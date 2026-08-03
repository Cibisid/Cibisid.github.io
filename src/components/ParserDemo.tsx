"use client";

import { useMemo, useState } from "react";
import { EXCLUSION, INCLUSION, parseEligibilityCriteria } from "@/lib/criteria";

const DEFAULT_CRITERIA = `Inclusion Criteria:

  -  Adults aged 18 to 75 years

  -  Diagnosis of Type 2 Diabetes Mellitus for at least 6 months

  -  HbA1c between 7.0% and 10.5% at screening

Exclusion Criteria:

  -  Prior insulin therapy

  -  eGFR less than 45 mL/min/1.73m2`;

const KIND_STYLE: Record<string, { label: string; className: string }> = {
  [INCLUSION]: { label: "INCLUSION", className: "text-sage border-sage/35" },
  [EXCLUSION]: { label: "EXCLUSION", className: "text-amber border-amber/40" },
  unspecified: { label: "UNSPECIFIED", className: "text-night-soft border-night-line" },
};

export default function ParserDemo() {
  const [raw, setRaw] = useState(DEFAULT_CRITERIA);
  const criteria = useMemo(() => parseEligibilityCriteria(raw), [raw]);

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line lg:grid-cols-2">
      <div className="bg-night-raised p-6 sm:p-8">
        <p className="eyebrow text-night-soft">Raw eligibility text</p>
        <p className="mt-2 text-[13px] text-night-soft">
          Straight from the ClinicalTrials.gov bulk export. Edit it — the parse re-runs as you type.
        </p>
        <label className="mt-4 block">
          <span className="sr-only">Eligibility criteria text</span>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            rows={14}
            className="w-full resize-y rounded-lg border border-night-line bg-night p-4 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-night-ink outline-none transition-colors focus:border-night-soft"
          />
        </label>
      </div>

      <div className="bg-night-raised p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-night-soft">Discrete claims</p>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-night-soft">
            {criteria.length} parsed
          </p>
        </div>

        {criteria.length === 0 ? (
          <p className="mt-6 text-[14px] leading-relaxed text-amber">
            Nothing parsed. Upstream this is treated as &ldquo;cannot assess&rdquo; — never as
            &ldquo;the patient qualifies.&rdquo;
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {criteria.map((c) => {
              const style = KIND_STYLE[c.kind] ?? KIND_STYLE.unspecified;
              return (
                <li
                  key={c.id}
                  className="flex gap-3 rounded-lg border border-night-line bg-night p-3"
                >
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] ${style.className}`}
                  >
                    {c.id}
                  </span>
                  <span className="text-[13px] leading-relaxed text-night-ink/85">{c.text}</span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-5 border-t border-night-line pt-4 text-[13px] leading-relaxed text-night-soft">
          Deliberately deterministic. The format is consistent enough that spending an LLM call per
          trial to split bullets would be waste — and this way it is unit-testable.
        </p>
        <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] text-night-soft/70">
          Real port of backend/agent/criteria.py, running in your browser.
        </p>
      </div>
    </div>
  );
}
