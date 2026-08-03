"use client";

import { useMemo, useState } from "react";
import {
  CONFIRMED_PRESENT,
  CURRENTLY_TAKING,
  DEMO_NOTE,
  DEMO_PROFILE,
  EXPLICITLY_ABSENT,
  NOT_MENTIONED,
  NOT_PRESENT,
  PatientDataStore,
  PRESENT,
  PRIOR_TREATMENT,
  type LookupResult,
  type Status,
} from "@/lib/patientStore";

type Tool = "check_condition" | "lookup_lab_value" | "lookup_patient_field";

const TOOLS: Array<{ id: Tool; label: string }> = [
  { id: "check_condition", label: "check_condition" },
  { id: "lookup_lab_value", label: "lookup_lab_value" },
  { id: "lookup_patient_field", label: "lookup_patient_field" },
];

/** Queries chosen to surface each distinct outcome the store can return. */
const SUGGESTIONS: Array<{ tool: Tool; term: string; why: string }> = [
  { tool: "check_condition", term: "asthma", why: "never mentioned" },
  { tool: "check_condition", term: "Type 2 Diabetes", why: "the diagnosis" },
  { tool: "check_condition", term: "cardiovascular disease", why: "ruled out" },
  { tool: "lookup_lab_value", term: "HbA1c", why: "on file" },
  { tool: "lookup_lab_value", term: "platelets", why: "not measured" },
  { tool: "lookup_patient_field", term: "ecog_score", why: "not recorded" },
];

/**
 * A status is "settled" when the record actually establishes something. The
 * unsettled ones are what force an UNKNOWN verdict upstream, which is the
 * behaviour this demo exists to show.
 */
const SETTLED: Status[] = [
  PRESENT,
  CONFIRMED_PRESENT,
  EXPLICITLY_ABSENT,
  CURRENTLY_TAKING,
  PRIOR_TREATMENT,
];

export default function LookupDemo() {
  const [tool, setTool] = useState<Tool>("check_condition");
  const [term, setTerm] = useState("asthma");

  // A fresh store per query keeps this a pure function of the inputs; the
  // audit trail is rebuilt rather than accumulated across renders.
  const result: LookupResult = useMemo(() => {
    const store = new PatientDataStore(DEMO_PROFILE);
    if (!term.trim()) {
      return { status: NOT_MENTIONED, note: "Type a term to query the record." };
    }
    if (tool === "check_condition") return store.checkCondition(term);
    if (tool === "lookup_lab_value") return store.lookupLab(term);
    return store.lookupField(term);
  }, [tool, term]);

  const settled = SETTLED.includes(result.status);

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line lg:grid-cols-2">
      {/* The record the agent is not allowed to read directly. */}
      <div className="bg-night-raised p-6 sm:p-8">
        <p className="eyebrow text-night-soft">The patient note</p>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-night-ink/80">
          {DEMO_NOTE}
        </p>
        <p className="mt-6 border-t border-night-line pt-5 text-[14px] leading-relaxed text-night-soft">
          The agent never receives this text. It has to request each fact through a tool — which is
          why it cannot answer from a value the note does not contain.
        </p>
      </div>

      {/* The tool surface. */}
      <div className="bg-night-raised p-6 sm:p-8">
        <p className="eyebrow text-night-soft">Query the record</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              aria-pressed={tool === t.id}
              className={`rounded-full px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] transition-colors ${
                tool === t.id
                  ? "bg-night-ink text-night"
                  : "border border-night-line text-night-soft hover:text-night-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Term to look up</span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            spellCheck={false}
            placeholder="asthma"
            className="w-full rounded-lg border border-night-line bg-night px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-night-ink outline-none transition-colors placeholder:text-night-soft/60 focus:border-night-soft"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={`${s.tool}-${s.term}`}
              type="button"
              onClick={() => {
                setTool(s.tool);
                setTerm(s.term);
              }}
              className="rounded-full border border-night-line px-2.5 py-1 text-[11px] text-night-soft transition-colors hover:border-night-soft hover:text-night-ink"
            >
              {s.term}
              <span className="ml-1.5 opacity-50">{s.why}</span>
            </button>
          ))}
        </div>

        {/* Result */}
        <div
          className={`mt-5 rounded-xl border p-5 ${
            settled ? "border-sage/35 bg-sage/5" : "border-amber/40 bg-amber/5"
          }`}
          aria-live="polite"
        >
          <p
            className={`font-[family-name:var(--font-mono)] text-sm font-semibold ${
              settled ? "text-sage" : "text-amber"
            }`}
          >
            {result.status}
            {result.value !== undefined && (
              <span className="ml-2 font-normal text-night-ink/80">
                {Array.isArray(result.value) ? result.value.join(", ") : String(result.value)}
              </span>
            )}
          </p>

          {result.note && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-night-soft">{result.note}</p>
          )}

          <p className="mt-4 border-t border-night-line pt-3 text-[13px] leading-relaxed">
            {settled ? (
              <span className="text-night-soft">
                The record settles this, so a criterion resting on it can be decided.
              </span>
            ) : (
              <span className="text-amber">
                Nothing here to reason from — a criterion resting on this returns UNKNOWN, naming
                it as the missing data.
              </span>
            )}
          </p>
        </div>

        <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] text-night-soft/70">
          Real port of backend/agent/patient_store.py, running in your browser.
        </p>
      </div>
    </div>
  );
}
