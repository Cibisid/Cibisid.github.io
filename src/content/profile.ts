/**
 * Every claim on this site comes from here, and everything here is verifiable.
 *
 * Sources: profile/profile.yaml (the ground-truth file used by the job-search
 * agent), the live GitHub API, and the repositories themselves.
 *
 * Rule for the projects list: if there is no public repository, it does not
 * appear. A portfolio entry a reader cannot click through to is a claim they
 * have to take on faith, and one unverifiable entry devalues the rest.
 */

export const profile = {
  name: "Cibi Siddarth",
  role: "AI / Applied AI Engineer",
  location: "Jacksonville, Florida",
  tagline:
    "I build systems that reason over messy real-world text — and that say so when they don't know.",
  availability: "Open to AI/ML engineering roles. Remote, or relocating anywhere in the U.S.",
  email: "cibi.siddarth@icloud.com",
  github: "https://github.com/Cibisid",
  githubHandle: "Cibisid",
  linkedin: "https://www.linkedin.com/in/cibi-siddarth",
} as const;

export const about = [
  `I work on applied AI where being wrong has a cost. Most of my recent time has gone into
   TrialBridge, a clinical trial matching system: it parses a free-text patient note, searches
   2,344 real trials by meaning rather than keywords, and decides each eligibility criterion
   individually.`,
  `The part I care about is what it does when it can't decide. Rather than let the model see the
   patient note, it has to request every fact through a tool — so when a lab value isn't in the
   record, the tool says so and the only available answer is "I don't know, and here is exactly
   what I need." A system that reports its own uncertainty is more useful to a clinician than one
   that is confidently wrong.`,
] as const;

export type SampleLine = {
  mark: "ok" | "unknown" | "no";
  text: string;
  detail?: string;
};

export type Project = {
  name: string;
  tagline: string;
  repo: string;
  language: string;
  problem: string;
  build: string[];
  insight: string;
  stack: string[];
  sample: { trial: string; verdict: string; lines: SampleLine[] } | null;
};

/** Flagship work. Both have public repositories with substantive code. */
export const projects: Project[] = [
  {
    name: "TrialBridge",
    tagline: "Clinical trial matching that refuses to guess",
    repo: "https://github.com/Cibisid/trialbridge",
    language: "Python",
    problem:
      "Over 80% of clinical trials miss their enrollment targets while patients who would qualify never hear about them. Matching is done by hand — a coordinator reads eligibility criteria line by line against a chart.",
    build: [
      "Negation-aware NLP extracts age, sex, diagnosis, labs and medications from a free-text note, distinguishing 'no history of X' from a positive finding.",
      "Sentence-transformer embeddings in pgvector search 2,344 trials ingested from the ClinicalTrials.gov bulk export.",
      "An agent decides each eligibility criterion one at a time and returns MET, NOT_MET, or UNKNOWN — where UNKNOWN must name the exact missing data point.",
    ],
    insight:
      "The agent never receives the patient note. It requests each fact through a tool, and the tool reports when the record doesn't contain one — so it cannot resolve a criterion from a value nobody measured.",
    stack: [
      "FastAPI",
      "PostgreSQL + pgvector",
      "sentence-transformers",
      "Claude on AWS Bedrock",
      "Docker",
      "GitHub Actions",
    ],
    // Illustrative of the agent's output shape.
    sample: {
      trial: "NCT04125342",
      verdict: "UNKNOWN",
      lines: [
        { mark: "ok", text: "Age 58 within range 40–75" },
        { mark: "ok", text: "Type 2 Diabetes confirmed" },
        { mark: "ok", text: "Not on insulin — explicitly ruled out in the note" },
        {
          mark: "unknown",
          text: "Requires eGFR ≥ 60 measured within 90 days",
          detail: "Note gives eGFR 72 but no draw date. Need the date.",
        },
      ],
    },
  },
  {
    name: "NUDGE",
    tagline: "Plain English to a whitelisted automation plan",
    repo: "https://github.com/Cibisid/NUDGE",
    language: "Python",
    problem:
      "Helping a non-technical relative fix something on their PC means a video call and twenty minutes of 'now click the blue button'.",
    build: [
      "Describe a task in plain English; Llama 3.3 70B via Groq plans a whitelisted action sequence.",
      "The plan is delivered as a single-use, expiring token link rather than an installed agent.",
      "FastAPI backend, React frontend.",
    ],
    insight:
      "The interesting constraint is what it must not do. Because it generates and runs automation on a target machine, the plan is restricted to a whitelist and the link is single-use and expiring — and it is why any public demo of this shows planning only, never execution.",
    stack: ["FastAPI", "Llama 3.3 70B (Groq)", "React", "Vite", "PyAutoGUI"],
    sample: null,
  },
];

/**
 * Additional public repositories. Descriptions are GitHub's own, verbatim —
 * repos without one are listed by name and language rather than given invented
 * copy. (Writing real descriptions for those four is a quick win.)
 */
export const otherWork = [
  {
    name: "Airbnb-Investment-Prediction",
    language: "Jupyter Notebook",
    description:
      "Airbnb price prediction and investment analysis using ML models (Linear Regression, Random Forest, XGBoost, MLP). Includes feature engineering, model evaluation, custom investment scoring, and interactive Folium maps.",
  },
  {
    name: "phishing-url-detection",
    language: "Python",
    description: "Phishing URL classifier in Python.",
  },
  {
    name: "aahaar",
    language: "HTML",
    description: "Nutrition and meal-planning web application.",
  },
  {
    name: "leetcode-75",
    language: "Java",
    description: "99 LeetCode solutions in Java, organised by pattern.",
  },
  {
    name: "dsa-practice",
    language: "Java",
    description: "100 data structures and algorithms problems in Java.",
  },
  { name: "House-price-prediction-ML-model", language: "Jupyter Notebook", description: null },
  { name: "Credit-Approval-ML-project-", language: "Jupyter Notebook", description: null },
  { name: "Online-Shopper-Intentions-", language: "Jupyter Notebook", description: null },
  {
    name: "NBA-Player-career-prediction-with-Machine-Learning-Project-Overview",
    language: "Jupyter Notebook",
    description: null,
  },
] as const;

export const experience = [
  {
    title: "Data Analyst Intern, CRM & Business Systems",
    company: "Salesforce",
    location: "Bhopal, India",
    period: "Aug – Nov 2023",
  },
  {
    title: "Python Full-Stack Developer Intern",
    company: "Besant Technologies",
    location: "Chennai, India",
    period: "Sep 2023 – Mar 2024",
  },
] as const;

export const education = [
  {
    degree: "M.S. Computer Science",
    detail: "Data Science concentration",
    school: "University of North Florida",
    location: "Jacksonville, FL",
    period: "2024 – 2026",
    note: "GPA 3.9 / 4.0",
  },
  {
    degree: "B.Tech. Computer Science",
    detail: "Health Informatics",
    school: "Vellore Institute of Technology",
    location: "India",
    period: "2020 – 2024",
    note: "GPA 3.45 / 4.0",
  },
] as const;

export const certifications = [
  { name: "AWS Certified Machine Learning Engineer – Associate", issuer: "Amazon Web Services", year: 2025 },
  { name: "Salesforce Platform Certification", issuer: "Salesforce", year: 2023 },
  { name: "Crash Course on Python", issuer: "Google", year: 2023 },
] as const;

export const skills = [
  {
    group: "Languages",
    items: ["Python", "SQL", "Java", "TypeScript", "JavaScript"],
  },
  {
    group: "ML & NLP",
    items: [
      "sentence-transformers",
      "scikit-learn",
      "XGBoost",
      "pandas",
      "NumPy",
      "vector search",
    ],
  },
  {
    group: "LLM systems",
    items: ["Tool-use agents", "RAG", "Claude API / Bedrock", "Llama 3.3 (Groq)"],
  },
  {
    group: "Backend & infra",
    items: ["FastAPI", "PostgreSQL", "pgvector", "Redis", "Docker", "GitHub Actions", "AWS"],
  },
] as const;
