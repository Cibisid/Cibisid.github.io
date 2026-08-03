import {
  about,
  certifications,
  education,
  experience,
  otherWork,
  profile,
  projects,
  skills,
  type Project,
  type SampleLine,
} from "@/content/profile";

const GITHUB_BASE = "https://github.com/Cibisid";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-8 sm:py-28">
        <Hero />
        <About />
        <Work />
        <OtherWork />
        <Background />
        <Skills />
      </main>
      <Footer />
    </>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <header>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        {profile.name}
      </h1>
      <p className="mt-3 font-[family-name:var(--font-mono)] text-sm text-amber">
        {profile.role}
      </p>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim">
        {profile.tagline}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-bone-dim">
        <span>{profile.location}</span>
        <Divider />
        <a className="link-draw hover:text-bone" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <Divider />
        <a
          className="link-draw hover:text-bone"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <Divider />
        <a
          className="link-draw hover:text-bone"
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>

      <p className="mt-8 inline-block border border-ink-line px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-bone-faint">
        {profile.availability}
      </p>
    </header>
  );
}

function Divider() {
  return (
    <span aria-hidden className="text-ink-line">
      /
    </span>
  );
}

/* --------------------------------------------------------------- about */

function About() {
  return (
    <Section id="about" label="About">
      <div className="space-y-5 text-[15px] leading-relaxed text-bone-dim">
        {about.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- work */

function Work() {
  return (
    <Section id="work" label="Selected work">
      <div className="space-y-16">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-[family-name:var(--font-serif)] text-2xl tracking-tight">
          <a className="link-draw" href={project.repo} target="_blank" rel="noreferrer">
            {project.name}
          </a>
        </h3>
        <span className="font-[family-name:var(--font-mono)] text-xs text-bone-faint">
          {project.language}
        </span>
      </div>

      <p className="mt-1 text-sm text-amber">{project.tagline}</p>

      <p className="mt-5 text-[15px] leading-relaxed text-bone-dim">{project.problem}</p>

      <ul className="mt-5 space-y-2.5">
        {project.build.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-bone-dim">
            <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-ink-line" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-l-2 border-amber/50 pl-4 text-[15px] leading-relaxed text-bone">
        {project.insight}
      </p>

      {project.sample && <SampleVerdict sample={project.sample} />}

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="border border-ink-line px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-bone-faint"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

const MARKS: Record<SampleLine["mark"], { glyph: string; className: string }> = {
  ok: { glyph: "✓", className: "text-sage" },
  no: { glyph: "✕", className: "text-bone-faint" },
  unknown: { glyph: "?", className: "text-amber" },
};

function SampleVerdict({ sample }: { sample: NonNullable<Project["sample"]> }) {
  return (
    <figure className="mt-6 overflow-x-auto border border-ink-line bg-ink-raised">
      <figcaption className="flex items-baseline justify-between border-b border-ink-line px-4 py-2.5">
        <span className="font-[family-name:var(--font-mono)] text-xs text-bone-faint">
          Trial {sample.trial}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-amber">
          {sample.verdict}
        </span>
      </figcaption>

      <ul className="space-y-2.5 px-4 py-4">
        {sample.lines.map((line) => {
          const mark = MARKS[line.mark];
          return (
            <li
              key={line.text}
              className="flex gap-3 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed"
            >
              <span aria-hidden className={`shrink-0 ${mark.className}`}>
                {mark.glyph}
              </span>
              <span>
                <span className="text-bone-dim">{line.text}</span>
                {line.detail && (
                  <span className="mt-1 block text-amber/90">&rarr; {line.detail}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/* --------------------------------------------------------- other work */

function OtherWork() {
  return (
    <Section id="other" label="Other public work">
      <ul className="divide-y divide-ink-line border-y border-ink-line">
        {otherWork.map((repo) => (
          <li key={repo.name} className="py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <a
                className="link-draw font-[family-name:var(--font-mono)] text-sm text-bone"
                href={`${GITHUB_BASE}/${repo.name}`}
                target="_blank"
                rel="noreferrer"
              >
                {repo.name}
              </a>
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-bone-faint">
                {repo.language}
              </span>
            </div>
            {repo.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-bone-dim">{repo.description}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------- background */

function Background() {
  return (
    <Section id="background" label="Background">
      <div className="grid gap-12 sm:grid-cols-2">
        <div>
          <h3 className="eyebrow">Experience</h3>
          <ul className="mt-5 space-y-6">
            {experience.map((role) => (
              <li key={`${role.company}-${role.title}`}>
                <p className="text-[15px] text-bone">{role.title}</p>
                <p className="mt-0.5 text-sm text-bone-dim">
                  {role.company} &mdash; {role.location}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-bone-faint">
                  {role.period}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Education</h3>
          <ul className="mt-5 space-y-6">
            {education.map((entry) => (
              <li key={entry.school}>
                <p className="text-[15px] text-bone">
                  {entry.degree}
                  <span className="text-bone-dim"> &mdash; {entry.detail}</span>
                </p>
                <p className="mt-0.5 text-sm text-bone-dim">
                  {entry.school}, {entry.location}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-bone-faint">
                  {entry.period} &middot; {entry.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="eyebrow">Certifications</h3>
        <ul className="mt-5 space-y-2.5">
          {certifications.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-wrap items-baseline justify-between gap-x-4 text-[15px]"
            >
              <span className="text-bone">{cert.name}</span>
              <span className="font-[family-name:var(--font-mono)] text-xs text-bone-faint">
                {cert.issuer} &middot; {cert.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- skills */

function Skills() {
  return (
    <Section id="skills" label="Tools">
      <dl className="grid gap-8 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.group}>
            <dt className="font-[family-name:var(--font-mono)] text-xs text-bone-faint">
              {group.group}
            </dt>
            <dd className="mt-2.5 text-[15px] leading-relaxed text-bone-dim">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------- footer */

function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-line">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
        <p className="font-[family-name:var(--font-serif)] text-2xl tracking-tight">
          Let&rsquo;s talk.
        </p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-bone-dim">
          {profile.availability}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a className="link-draw" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a
            className="link-draw text-bone-dim hover:text-bone"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            github.com/{profile.githubHandle}
          </a>
          <a
            className="link-draw text-bone-dim hover:text-bone"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------- shared */

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-12">
      <h2 className="eyebrow mb-7">{label}</h2>
      {children}
    </section>
  );
}
