/**
 * A faithful port of backend/agent/patient_store.py from the TrialBridge repo.
 *
 * This is the piece the whole project turns on: the agent never sees the
 * patient note, so every fact has to be requested here, and a fact the note
 * does not contain comes back as an explicit absence rather than a default.
 *
 * Running the real thing in the browser is the point. A visitor typing a
 * condition the note never mentions should see the actual NOT_MENTIONED
 * response, not an animation of one.
 */

export const PRESENT = "PRESENT";
export const NOT_PRESENT = "NOT_PRESENT";
export const CONFIRMED_PRESENT = "CONFIRMED_PRESENT";
export const EXPLICITLY_ABSENT = "EXPLICITLY_ABSENT";
export const NOT_MENTIONED = "NOT_MENTIONED";
export const CURRENTLY_TAKING = "CURRENTLY_TAKING";
export const PRIOR_TREATMENT = "PRIOR_TREATMENT";

export type Status =
  | typeof PRESENT
  | typeof NOT_PRESENT
  | typeof CONFIRMED_PRESENT
  | typeof EXPLICITLY_ABSENT
  | typeof NOT_MENTIONED
  | typeof CURRENTLY_TAKING
  | typeof PRIOR_TREATMENT;

export type LookupResult = {
  status: Status;
  value?: string | number | string[];
  note?: string;
};

export type PatientProfile = {
  age?: number;
  sex?: string;
  primary_diagnosis?: string;
  comorbidities?: string[];
  negated_conditions?: string[];
  current_medications?: string[];
  prior_treatments?: string[];
  allergies?: string[];
  lab_values?: Record<string, number>;
  ecog_score?: number;
};

export const SCALAR_FIELDS = ["age", "sex", "primary_diagnosis", "ecog_score"] as const;
export const LIST_FIELDS = [
  "comorbidities",
  "negated_conditions",
  "current_medications",
  "prior_treatments",
  "allergies",
] as const;

/**
 * Lab synonyms seen in both notes and trial criteria. Deliberately short —
 * every entry asserts that two names mean the same measurement, and a wrong
 * one produces a confidently wrong verdict.
 */
const LAB_ALIASES: Record<string, string> = {
  a1c: "hba1c",
  hba1c: "hba1c",
  hemoglobina1c: "hba1c",
  glycatedhemoglobin: "hba1c",
  egfr: "egfr",
  gfr: "egfr",
  estimatedgfr: "egfr",
  creatinine: "creatinine",
  scr: "creatinine",
  hgb: "hemoglobin",
  hb: "hemoglobin",
  hemoglobin: "hemoglobin",
  plt: "platelets",
  platelets: "platelets",
  platelet: "platelets",
  wbc: "wbc",
  anc: "anc",
  bmi: "bmi",
  ldl: "ldl",
  hdl: "hdl",
};

const normalize = (name: string) => (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const canonicalLab = (name: string) => LAB_ALIASES[normalize(name)] ?? normalize(name);

export type AuditEntry = { tool: string; argument: string; status: Status };

export class PatientDataStore {
  readonly profile: PatientProfile;
  private log: AuditEntry[] = [];

  constructor(profile: PatientProfile) {
    this.profile = profile;
  }

  private record(tool: string, argument: string, result: LookupResult): LookupResult {
    this.log.push({ tool, argument, status: result.status });
    return result;
  }

  lookupField(fieldName: string): LookupResult {
    const name = (fieldName || "").trim().toLowerCase();
    const known = [...SCALAR_FIELDS, ...LIST_FIELDS] as readonly string[];

    if (!known.includes(name)) {
      return this.record("lookup_patient_field", fieldName, {
        status: NOT_PRESENT,
        note: `'${fieldName}' is not a field this patient record has. Available: ${known.join(", ")}.`,
      });
    }

    const value = this.profile[name as keyof PatientProfile];

    // An empty list means the extractor found nothing of that kind in the note,
    // not that the patient has none.
    if (value === undefined || value === null || (Array.isArray(value) && !value.length)) {
      return this.record("lookup_patient_field", fieldName, {
        status: NOT_PRESENT,
        note: `The note does not state the patient's ${name}.`,
      });
    }

    return this.record("lookup_patient_field", fieldName, {
      status: PRESENT,
      value: value as string | number | string[],
    });
  }

  lookupLab(labName: string): LookupResult {
    const wanted = canonicalLab(labName);

    for (const [key, value] of Object.entries(this.profile.lab_values ?? {})) {
      if (canonicalLab(key) === wanted) {
        return this.record("lookup_lab_value", labName, {
          status: PRESENT,
          value,
          note: `Recorded in the note as '${key}'. No draw date is attached.`,
        });
      }
    }

    return this.record("lookup_lab_value", labName, {
      status: NOT_PRESENT,
      note: `No ${labName} value appears in the note.`,
    });
  }

  checkCondition(condition: string): LookupResult {
    const target = normalize(condition);
    if (!target) {
      return this.record("check_condition", condition, {
        status: NOT_MENTIONED,
        note: "Empty condition.",
      });
    }

    const matches = (candidate: string) => {
      const other = normalize(candidate);
      return Boolean(other) && (other.includes(target) || target.includes(other));
    };

    // Negation is checked first: a term in both lists must resolve as ruled out.
    for (const negated of this.profile.negated_conditions ?? []) {
      if (matches(negated)) {
        return this.record("check_condition", condition, {
          status: EXPLICITLY_ABSENT,
          value: negated,
          note: `The note explicitly rules out '${negated}'.`,
        });
      }
    }

    const positives = [...(this.profile.comorbidities ?? [])];
    if (this.profile.primary_diagnosis) positives.unshift(this.profile.primary_diagnosis);

    for (const positive of positives) {
      if (matches(positive)) {
        return this.record("check_condition", condition, {
          status: CONFIRMED_PRESENT,
          value: positive,
        });
      }
    }

    return this.record("check_condition", condition, {
      status: NOT_MENTIONED,
      note: `The note does not mention '${condition}' either way. This is not evidence of absence.`,
    });
  }

  checkMedication(medication: string): LookupResult {
    const target = normalize(medication);
    if (!target) {
      return this.record("check_medication", medication, {
        status: NOT_MENTIONED,
        note: "Empty medication.",
      });
    }

    const matches = (candidate: string) => {
      const other = normalize(candidate);
      return Boolean(other) && (other.includes(target) || target.includes(other));
    };

    for (const current of this.profile.current_medications ?? []) {
      if (matches(current)) {
        return this.record("check_medication", medication, {
          status: CURRENTLY_TAKING,
          value: current,
        });
      }
    }

    for (const prior of this.profile.prior_treatments ?? []) {
      if (matches(prior)) {
        return this.record("check_medication", medication, {
          status: PRIOR_TREATMENT,
          value: prior,
        });
      }
    }

    for (const negated of this.profile.negated_conditions ?? []) {
      if (matches(negated)) {
        return this.record("check_medication", medication, {
          status: EXPLICITLY_ABSENT,
          value: negated,
          note: `The note explicitly rules out '${negated}'.`,
        });
      }
    }

    return this.record("check_medication", medication, {
      status: NOT_MENTIONED,
      note: `The note does not mention '${medication}'. This is not evidence of absence.`,
    });
  }

  audit(): AuditEntry[] {
    return [...this.log];
  }
}

/** The patient behind the demo, matching the note used throughout the repo. */
export const DEMO_NOTE =
  "58-year-old female with Type 2 Diabetes Mellitus. Currently on Metformin 1000mg. " +
  "HbA1c 8.9%, eGFR 72. No prior insulin therapy. No history of cardiovascular disease.";

export const DEMO_PROFILE: PatientProfile = {
  age: 58,
  sex: "female",
  primary_diagnosis: "Type 2 Diabetes",
  comorbidities: [],
  negated_conditions: ["insulin therapy", "cardiovascular disease"],
  current_medications: ["Metformin"],
  prior_treatments: [],
  allergies: [],
  lab_values: { HbA1c: 8.9, eGFR: 72 },
};
