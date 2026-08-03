import Figure from "@/components/Figure";
import LookupDemo from "@/components/LookupDemo";
import ParserDemo from "@/components/ParserDemo";
import {
  about,
  certifications,
  education,
  experience,
  otherWork,
  pipeline,
  profile,
  projects,
  repoFacts,
  skills,
} from "@/content/profile";

const GITHUB_BASE = "https://github.com/Cibisid";
const [trialbridge, nudge] = projects;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <TrialBridgeOpener />
        <Pipeline />
        <PinnedVerdict />
        <LookupSection />
        <ParserSection />
        <TrialBridgeEngineering />
        <Nudge />
        <OtherWork />
        <Background />
        <Skills />
      </main>
      <Contact />
    </>
  );
}

/* ----------------------------------------------------------- primitives */

function Section({
  id,
  tone,
  children,
  className = "",
}: {
  id?: string;
  tone: "night" | "canvas";
  children: React.ReactNode;
  className?: string;
}) {
  const bg = tone === "night" ? "bg-night text-night-ink" : "bg-canvas text-ink";
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className="mx-auto max-w-5xl px-6 py-[clamp(5rem,14vh,9rem)]">{children}</div>
    </section>
  );
}

function Eyebrow({ tone, children }: { tone: "night" | "canvas"; children: React.ReactNode }) {
  return (
    <p className={`eyebrow ${tone === "night" ? "text-night-soft" : "text-ink-soft"}`}>
      {children}
    </p>
  );
}

/* ----------------------------------------------------------------- nav */

const NAV_LINKS = [
  { href: "#trialbridge", label: "TrialBridge" },
  { href: "#nudge", label: "NUDGE" },
  { href: "#background", label: "Background" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  return (
    <nav className="nav-blur sticky top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="text-[13px] font-semibold tracking-tight text-night-ink">
          {profile.name}
        </a>
        <ul className="flex gap-5 sm:gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[12px] text-night-soft transition-colors hover:text-night-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <section id="top" className="bg-night text-night-ink">
      <div className="mx-auto flex min-h-[calc(100svh-2.75rem)] max-w-5xl flex-col justify-between px-6 py-16">
        <div className="hero-layer flex flex-1 flex-col justify-center">
          <Eyebrow tone="night">{profile.role}</Eyebrow>
          <h1 className="display mt-6">{profile.name}</h1>
          <p className="lede mt-8 max-w-2xl text-night-soft">{profile.tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
            <a className="link-quiet-night" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="link-quiet-night" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="link-quiet-night"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <p className="mt-8 text-[13px] text-night-soft">
            {profile.location} &middot; {profile.availability}
          </p>
        </div>

        {/* Facts, not adjectives — each one is checkable from the repo. */}
        <dl className="reveal-soft grid grid-cols-2 gap-x-6 gap-y-8 border-t border-night-line pt-8 sm:grid-cols-4">
          {repoFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight tabular-nums">
                {fact.value}
              </dt>
              <dd className="mt-1 text-[12px] leading-snug text-night-soft">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- statement */

function Statement() {
  return (
    <Section tone="canvas">
      <p className="headline reveal max-w-4xl text-balance">
        A system that reports its own uncertainty is more useful to a clinician than one that is
        confidently wrong.
      </p>
      <div className="reveal mt-14 grid gap-10 sm:grid-cols-2">
        {about.map((paragraph, i) => (
          <p key={i} className="lede text-ink-soft">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------- trialbridge opener */

function TrialBridgeOpener() {
  return (
    <Section id="trialbridge" tone="night">
      <Eyebrow tone="night">Project 01 &middot; {trialbridge.language}</Eyebrow>
      <h2 className="display reveal mt-5">{trialbridge.name}</h2>
      <p className="subhead reveal mt-4 max-w-2xl text-night-soft">{trialbridge.tagline}</p>

      <div className="reveal mt-16 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-16">
        <p className="text-[clamp(4rem,12vw,8rem)] font-semibold leading-none tracking-tighter text-amber">
          80%
        </p>
        <p className="lede max-w-xl text-night-soft">
          of clinical trials miss their enrollment targets — while patients who would qualify never
          hear about them. The matching is done by hand: a research coordinator reads eligibility
          criteria line by line against a patient chart.
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ pipeline */

function Pipeline() {
  return (
    <Section tone="night">
      <Eyebrow tone="night">How it works</Eyebrow>
      <h3 className="subhead reveal mt-4 max-w-2xl text-balance">
        Note in, ranked and explained matches out — seven stages.
      </h3>

      <ol className="reveal mt-12 border-l border-night-line">
        {pipeline.map((step, i) => (
          <li key={step.stage} className="relative pb-10 pl-8 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-night-line"
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-night-soft/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[17px] font-medium tracking-tight">{step.stage}</span>
            </div>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-night-soft">
              {step.detail}
            </p>
            {step.file && (
              <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11px] text-night-soft/60">
                {step.file}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------ pinned verdict */

const MARKS = {
  ok: { glyph: "✓", className: "text-sage" },
  no: { glyph: "✕", className: "text-night-soft" },
  unknown: { glyph: "?", className: "text-amber" },
} as const;

function PinnedVerdict() {
  const sample = trialbridge.sample;
  if (!sample) return null;

  return (
    <section className="bg-night text-night-ink">
      <div className="pin-track relative">
        <div className="pin-stage">
          <div className="mx-auto w-full max-w-4xl px-6 py-20">
            <Eyebrow tone="night">A single trial, criterion by criterion</Eyebrow>
            <h3 className="subhead mt-4 max-w-2xl text-balance">
              It checks each one in turn — then tells you which one it can&rsquo;t answer.
            </h3>

            <div className="mt-10 overflow-hidden rounded-2xl border border-night-line bg-night-raised">
              <div className="flex items-baseline justify-between border-b border-night-line px-5 py-3">
                <span className="font-[family-name:var(--font-mono)] text-xs text-night-soft">
                  Trial {sample.trial}
                </span>
                <span className="pin-verdict rounded-full border border-amber/40 bg-amber/10 px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-amber">
                  {sample.verdict}
                </span>
              </div>

              <ul className="space-y-4 px-5 py-6">
                {sample.lines.map((line, i) => {
                  const mark = MARKS[line.mark];
                  return (
                    <li
                      key={line.text}
                      className={`pin-step pin-step-${i + 1} flex gap-4 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed sm:text-sm`}
                    >
                      <span aria-hidden className={`shrink-0 ${mark.className}`}>
                        {mark.glyph}
                      </span>
                      <span>
                        <span className="text-night-ink/85">{line.text}</span>
                        {line.detail && (
                          <span className="mt-1.5 block text-amber">&rarr; {line.detail}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="pin-verdict lede mt-8 max-w-2xl text-night-soft">
              {trialbridge.insight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- demo: tools */

function LookupSection() {
  return (
    <Section tone="night">
      <Eyebrow tone="night">Try it &middot; runs in your browser</Eyebrow>
      <h3 className="subhead reveal mt-4 max-w-3xl text-balance">
        Ask the record something it doesn&rsquo;t know.
      </h3>
      <p className="lede reveal mt-5 max-w-2xl text-night-soft">
        Query <span className="text-night-ink">asthma</span> — a condition the note never mentions.
        The record answers <span className="text-amber">NOT_MENTIONED</span>, not
        &ldquo;absent&rdquo;. That distinction is why the agent can&rsquo;t quietly clear an
        exclusion criterion nobody actually ruled out.
      </p>

      <div className="reveal mt-10">
        <LookupDemo />
      </div>
    </Section>
  );
}

function ParserSection() {
  return (
    <Section tone="night">
      <Eyebrow tone="night">Try it &middot; runs in your browser</Eyebrow>
      <h3 className="subhead reveal mt-4 max-w-3xl text-balance">
        One wall of prose becomes a list of decidable claims.
      </h3>

      <div className="reveal mt-10">
        <ParserDemo />
      </div>
    </Section>
  );
}

/* -------------------------------------------- trialbridge: engineering */

const ENGINEERING = [
  {
    heading: "Deterministic where it can be",
    body: "Criteria parsing is regex and rules, not a model call. The ClinicalTrials.gov format is consistent enough that an LLM call per trial per query would be pure cost — and this way it is unit-testable and free.",
  },
  {
    heading: "Two metrics, never one",
    body: "The eval reports unsupported decisions and over-abstentions together. Any system drives the first to zero by answering UNKNOWN to everything, and that system is useless. Reporting one without the other would be a number designed to look good.",
  },
  {
    heading: "Failing closed",
    body: "Unparseable criteria, an agent error, a criterion never reached — all resolve to UNKNOWN. A trial reads QUALIFIES only when every criterion was actually decided.",
  },
];

function TrialBridgeEngineering() {
  return (
    <Section tone="canvas">
      <Eyebrow tone="canvas">Engineering decisions</Eyebrow>
      <div className="reveal mt-10 grid gap-12 sm:grid-cols-3">
        {ENGINEERING.map((item) => (
          <div key={item.heading}>
            <h4 className="text-[17px] font-semibold tracking-tight">{item.heading}</h4>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-14 flex flex-wrap items-center gap-2">
        {trialbridge.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-ink-soft/25 px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-ink-soft"
          >
            {tech}
          </span>
        ))}
      </div>

      <a
        className="link-quiet reveal mt-8 inline-block text-[15px]"
        href={trialbridge.repo}
        target="_blank"
        rel="noreferrer"
      >
        Read the code &rarr;
      </a>
    </Section>
  );
}

/* --------------------------------------------------------------- nudge */

function Nudge() {
  return (
    <Section id="nudge" tone="night">
      <Eyebrow tone="night">Project 02 &middot; {nudge.language}</Eyebrow>
      <h2 className="headline reveal mt-5">{nudge.name}</h2>
      <p className="subhead reveal mt-4 max-w-2xl text-night-soft">{nudge.tagline}</p>

      <p className="lede reveal mt-10 max-w-2xl text-night-soft">{nudge.problem}</p>

      <ol className="reveal mt-12 grid gap-8 sm:grid-cols-3">
        {nudge.build.map((item, i) => (
          <li key={item}>
            <span className="font-[family-name:var(--font-mono)] text-xs text-night-soft/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 text-[15px] leading-relaxed text-night-soft">{item}</p>
          </li>
        ))}
      </ol>

      <div className="reveal mt-12 rounded-2xl border border-amber/30 bg-amber/5 p-6 sm:p-8">
        <p className="eyebrow text-amber">Why there is no live demo of this one</p>
        <p className="lede mt-4 max-w-2xl text-night-ink/85">{nudge.insight}</p>
      </div>

      <div className="reveal mt-10 flex flex-wrap items-center gap-2">
        {nudge.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-night-line px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-night-soft"
          >
            {tech}
          </span>
        ))}
      </div>

      <a
        className="link-quiet-night reveal mt-8 inline-block text-[15px]"
        href={nudge.repo}
        target="_blank"
        rel="noreferrer"
      >
        Read the code &rarr;
      </a>
    </Section>
  );
}

/* ---------------------------------------------------------- other work */

function OtherWork() {
  return (
    <Section tone="canvas">
      <Eyebrow tone="canvas">Other public work</Eyebrow>
      <ul className="reveal mt-8 divide-y divide-ink-soft/15 border-y border-ink-soft/15">
        {otherWork.map((repo) => (
          <li key={repo.name}>
            <a
              href={`${GITHUB_BASE}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1.5 py-5 transition-opacity hover:opacity-60"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-[family-name:var(--font-mono)] text-[13px]">{repo.name}</span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">
                  {repo.language}
                </span>
              </div>
              {repo.description && (
                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                  {repo.description}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------- background */

function Background() {
  return (
    <Section id="background" tone="night">
      <Eyebrow tone="night">Education</Eyebrow>

      <div className="reveal mt-8 grid gap-10 lg:grid-cols-2">
        {education.map((entry, i) => (
          <div key={entry.school}>
            <Figure
              file={i === 0 ? "unf.jpg" : "vit.jpg"}
              alt={`${entry.school} campus`}
              hint={`Photo of ${entry.school}`}
              width={800}
              height={520}
            />
            <h3 className="mt-6 text-[20px] font-semibold tracking-tight">{entry.degree}</h3>
            <p className="mt-1.5 text-[15px] text-night-soft">
              {entry.detail} &middot; {entry.school}
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[12px] text-night-soft/70">
              {entry.location} &middot; {entry.period} &middot; {entry.note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 grid gap-14 sm:grid-cols-2">
        <div className="reveal">
          <Eyebrow tone="night">Experience</Eyebrow>
          <ul className="mt-6 space-y-8">
            {experience.map((role) => (
              <li key={`${role.company}-${role.title}`}>
                <p className="text-[17px] font-medium tracking-tight">{role.title}</p>
                <p className="mt-1 text-[15px] text-night-soft">
                  {role.company} &middot; {role.location}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-night-soft/70">
                  {role.period}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal">
          <Eyebrow tone="night">Certifications</Eyebrow>
          <ul className="mt-6 space-y-5">
            {certifications.map((cert) => (
              <li key={cert.name}>
                <p className="text-[15px] leading-snug">{cert.name}</p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-night-soft/70">
                  {cert.issuer} &middot; {cert.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- skills */

function Skills() {
  return (
    <Section tone="canvas">
      <Eyebrow tone="canvas">Tools</Eyebrow>
      <dl className="reveal mt-8 grid gap-10 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.group}>
            <dt className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {group.group}
            </dt>
            <dd className="mt-3 text-[17px] leading-relaxed tracking-tight">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ------------------------------------------------------------- contact */

function Contact() {
  return (
    <footer id="contact" className="bg-night text-night-ink">
      <div className="mx-auto max-w-5xl px-6 py-[clamp(6rem,18vh,11rem)]">
        <h2 className="display reveal text-balance">Let&rsquo;s talk.</h2>
        <p className="lede reveal mt-8 max-w-lg text-night-soft">{profile.availability}</p>

        <div className="reveal mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[17px]">
          <a className="link-quiet-night" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="link-quiet-night" href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.githubHandle}
          </a>
          <a className="link-quiet-night" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>

        <p className="mt-24 max-w-2xl text-[12px] leading-relaxed text-night-soft/70">
          {profile.location} &middot; Built with Next.js. The two interactive panels above run
          ported copies of the real parser and lookup logic in your browser — nothing on this page
          is a recording.
        </p>
      </div>
    </footer>
  );
}
