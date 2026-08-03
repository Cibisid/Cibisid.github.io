/**
 * Guards the browser ports against drift from the Python they came from.
 *
 * src/lib/criteria.ts and src/lib/patientStore.ts are hand-ports of
 * backend/agent/criteria.py and backend/agent/patient_store.py in the
 * TrialBridge repo. The site claims the interactive panels run "the real
 * logic", so if the Python changes and these don't, the site starts
 * misrepresenting the system. The expectations below mirror the assertions in
 * backend/tests/test_criteria.py and backend/tests/test_patient_store.py.
 *
 *   npm run verify:port
 */
import { parseEligibilityCriteria } from "../src/lib/criteria.ts";
import {
  CONFIRMED_PRESENT,
  CURRENTLY_TAKING,
  DEMO_PROFILE,
  EXPLICITLY_ABSENT,
  NOT_MENTIONED,
  NOT_PRESENT,
  PatientDataStore,
  PRESENT,
} from "../src/lib/patientStore.ts";

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures++;
    console.log(`FAIL  ${name}\n        expected ${e}\n        actual   ${a}`);
  } else {
    console.log(`ok    ${name}`);
  }
}

/* ------------------------------------------------------------- parser */

const CTGOV = `
        Inclusion Criteria:

          -  Adults aged 18 to 75 years

          -  Diagnosis of Type 2 Diabetes Mellitus for at least 6 months

          -  HbA1c between 7.0% and 10.5% at screening

        Exclusion Criteria:

          -  Prior insulin therapy

          -  eGFR less than 45 mL/min/1.73m2
`;

const parsed = parseEligibilityCriteria(CTGOV);

check(
  "parser: ids",
  parsed.map((c) => c.id),
  ["INC-1", "INC-2", "INC-3", "EXC-1", "EXC-2"],
);
check(
  "parser: kinds",
  parsed.map((c) => c.kind),
  ["inclusion", "inclusion", "inclusion", "exclusion", "exclusion"],
);
check("parser: thresholds survive", parsed[2].text, "HbA1c between 7.0% and 10.5% at screening");
check("parser: units survive", parsed[4].text, "eGFR less than 45 mL/min/1.73m2");

const wrapped = parseEligibilityCriteria(`
        Inclusion Criteria:

          -  Histologically confirmed adenocarcinoma of the colon or rectum
             with measurable disease per RECIST v1.1 criteria

          -  ECOG performance status 0 or 1
`);
check("parser: wrapped bullet stays one claim", wrapped.length, 2);
check("parser: wrapped text joined", wrapped[0].text.endsWith("per RECIST v1.1 criteria"), true);

const numbered = parseEligibilityCriteria(`
        Inclusion Criteria:

          1. Age 18 or older
          2. Signed informed consent

        Exclusion Criteria:

          * Active infection
`);
check(
  "parser: numbered and star markers",
  numbered.map((c) => c.text),
  ["Age 18 or older", "Signed informed consent", "Active infection"],
);

const headerless = parseEligibilityCriteria("  -  Age 18 or older\n  -  Able to provide consent\n");
check(
  "parser: no header means unspecified, not inclusion",
  headerless.map((c) => c.kind),
  ["unspecified", "unspecified"],
);
check(
  "parser: unspecified ids",
  headerless.map((c) => c.id),
  ["UNK-1", "UNK-2"],
);

check("parser: empty string", parseEligibilityCriteria(""), []);
check("parser: null", parseEligibilityCriteria(null), []);
check("parser: whitespace only", parseEligibilityCriteria("   \n\n  "), []);

/* -------------------------------------------------------------- store */

const store = new PatientDataStore(DEMO_PROFILE);

check("store: present field", store.lookupField("age").status, PRESENT);
check("store: unrecorded field", store.lookupField("ecog_score").status, NOT_PRESENT);
check("store: empty list field", store.lookupField("allergies").status, NOT_PRESENT);
check("store: unknown field name", store.lookupField("hemoglobin").status, NOT_PRESENT);

for (const alias of ["HbA1c", "hba1c", "A1c", "hemoglobin a1c"]) {
  check(`store: lab alias ${alias}`, store.lookupLab(alias).value, 8.9);
}
check("store: missing lab", store.lookupLab("platelets").status, NOT_PRESENT);

check("store: diagnosis", store.checkCondition("Type 2 Diabetes").status, CONFIRMED_PRESENT);
check("store: negated condition", store.checkCondition("cardiovascular disease").status, EXPLICITLY_ABSENT);
check("store: unmentioned condition", store.checkCondition("asthma").status, NOT_MENTIONED);
check(
  "store: unmentioned is not absence",
  store.checkCondition("asthma").note?.includes("not evidence of absence"),
  true,
);

check("store: current medication", store.checkMedication("Metformin").status, CURRENTLY_TAKING);
check("store: unmentioned medication", store.checkMedication("warfarin").status, NOT_MENTIONED);
check("store: negated medication", store.checkMedication("insulin therapy").status, EXPLICITLY_ABSENT);

/* Negation must be checked before positives. */
const conflicted = new PatientDataStore({
  primary_diagnosis: "Breast Cancer",
  comorbidities: ["diabetes"],
  negated_conditions: ["diabetes"],
});
check("store: negation wins over positive", conflicted.checkCondition("diabetes").status, EXPLICITLY_ABSENT);

console.log(failures ? `\n${failures} check(s) FAILED` : "\nall checks passed");
process.exit(failures ? 1 : 0);
