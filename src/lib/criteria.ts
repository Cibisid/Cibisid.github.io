/**
 * A faithful port of backend/agent/criteria.py from the TrialBridge repo.
 *
 * This exists so the site can run the real parser in the browser rather than
 * animate a canned result. Keep it in step with the Python: if the rules there
 * change, they change here too, or the demo starts lying about what the system
 * does.
 */

export const INCLUSION = "inclusion";
export const EXCLUSION = "exclusion";
export const UNSPECIFIED = "unspecified";

export type CriterionKind =
  | typeof INCLUSION
  | typeof EXCLUSION
  | typeof UNSPECIFIED;

export type Criterion = {
  id: string;
  kind: CriterionKind;
  text: string;
};

const SECTION_RE =
  /^[ \t]*(?:key[ \t]+)?(inclusion|exclusion)[ \t]+criteria\b[ \t]*[:\-–]?[ \t]*/gim;

const BULLET_RE = /^[ \t]*(?:[-*•·]|\(?\d{1,2}[.)]|\(?[a-z][.)])[ \t]+/i;

const PREFIXES: Record<CriterionKind, string> = {
  [INCLUSION]: "INC",
  [EXCLUSION]: "EXC",
  [UNSPECIFIED]: "UNK",
};

function clean(text: string): string {
  return text.replace(/\s+/g, " ").replace(/^[ \t\-–—:;]+|[ \t\-–—:;]+$/g, "");
}

function splitBullets(segment: string): string[] {
  const items: string[] = [];
  let current: string[] = [];

  for (const line of segment.split("\n")) {
    if (!line.trim()) continue;

    if (BULLET_RE.test(line)) {
      if (current.length) items.push(current.join(" "));
      current = [line.replace(BULLET_RE, "").trim()];
    } else if (current.length) {
      // No marker: this line continues the previous bullet rather than
      // starting a new criterion.
      current.push(line.trim());
    } else {
      current = [line.trim()];
    }
  }

  if (current.length) items.push(current.join(" "));

  // No bullet markers anywhere: fall back to sentence-ish splitting so a
  // prose-style block still yields decidable units.
  if (items.length <= 1 && !BULLET_RE.test(segment)) {
    const blob = items[0] ?? segment;
    return blob
      .split(/(?<=[.;])\s+(?=[A-Z(])/)
      .map(clean)
      .filter((c) => c.length > 3);
  }

  return items.map(clean).filter((c) => c.length > 3);
}

export function parseEligibilityCriteria(raw: string | null | undefined): Criterion[] {
  if (!raw || !raw.trim()) return [];

  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const headers: Array<{ start: number; end: number; kind: CriterionKind }> = [];
  SECTION_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SECTION_RE.exec(text)) !== null) {
    headers.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: match[1].toLowerCase() as CriterionKind,
    });
  }

  const segments: Array<{ kind: CriterionKind; body: string }> = [];

  if (!headers.length) {
    segments.push({ kind: UNSPECIFIED, body: text });
  } else {
    const preamble = text.slice(0, headers[0].start).trim();
    if (preamble) segments.push({ kind: UNSPECIFIED, body: preamble });

    headers.forEach((header, i) => {
      const end = i + 1 < headers.length ? headers[i + 1].start : text.length;
      segments.push({ kind: header.kind, body: text.slice(header.end, end) });
    });
  }

  const counters: Record<CriterionKind, number> = {
    [INCLUSION]: 0,
    [EXCLUSION]: 0,
    [UNSPECIFIED]: 0,
  };
  const criteria: Criterion[] = [];

  for (const segment of segments) {
    for (const item of splitBullets(segment.body)) {
      counters[segment.kind] += 1;
      criteria.push({
        id: `${PREFIXES[segment.kind]}-${counters[segment.kind]}`,
        kind: segment.kind,
        text: item,
      });
    }
  }

  return criteria;
}
