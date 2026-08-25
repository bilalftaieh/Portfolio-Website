export const profile = {
  name: 'Belal Alfutayh',
  title: 'Software Engineer',
  tagline: 'Cloud & API Integration · GCP Certified (ACE)',
  location: 'Riyadh, Saudi Arabia',
  email: 'ftaiehbilal@gmail.com',
  links: {
    github: 'https://github.com/bilalftaieh',
    linkedin: 'https://www.linkedin.com/in/belalalfutayh-2997682a3',
  },
  sourceRepo: 'https://github.com/bilalftaieh/Portfolio-Website',
  // Canonical origin, no trailing slash. Single source for the og:/twitter:
  // tags, the canonical link, robots.txt and sitemap.xml — all of which are
  // injected or emitted at build time from this one value.
  siteUrl: 'https://portfolio-bilalftaieh.vercel.app',
  summary:
    "I build the digital infrastructure that connects modern applications — designing scalable APIs and managing them within the Google Cloud ecosystem. I work extensively with Google Apigee to centralize services across their full lifecycle, from security policies and developer portals to traffic management and analytics, within a premier Google Partner environment.",
}

export const aboutNarrative = [
  "I started out elbow-deep in SQL Server stored procedures and X++ extensions — the unglamorous plumbing that makes enterprise systems actually run. Tracing a problem down to its root, one query or one policy at a time, is a habit that never left me.",
  "At NVSSoft, that habit turned into dashboards the Ministry of Transport relied on daily, backed by a data warehouse I built to keep them fast. At iSolution, I moved up a layer — now I design and manage the APIs that let entire systems talk to each other across Google Cloud.",
  "Different rooms, same instinct: take a messy requirement, find the clean architecture hiding inside it, and ship something that scales.",
]

export const stats = [
  { value: '2+', label: 'Years in production' },
  { value: '4', label: 'Certifications' },
  { value: '3', label: 'Teams shipped with' },
]

// Three files that are all about this person: who they are, what they've
// shipped, and what they want next. An earlier version padded this out with
// generic Apigee and gcloud config, which was syntax anyone could paste from
// the docs and said nothing a reader couldn't get from the Skills section.
export const codeSnippets = [
  {
    filename: 'whoami.json',
    lines: [
      [{ t: '{', c: 'muted' }],
      [{ t: '  "role"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: '"Software Engineer"', c: 'string' }, { t: ',', c: 'muted' }],
      [{ t: '  "based_in"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: '"Riyadh, Saudi Arabia"', c: 'string' }, { t: ',', c: 'muted' }],
      [{ t: '  "currently"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: '"API Developer @ iSolution"', c: 'string' }, { t: ',', c: 'muted' }],
      [{ t: '  "focus"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: '["Cloud Architecture", "Apigee", "System Integration"]', c: 'string' }, { t: ',', c: 'muted' }],
      [{ t: '  "certifications"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: '4', c: 'number' }, { t: ',', c: 'muted' }],
      [{ t: '  "open_to_connect"', c: 'tag' }, { t: ': ', c: 'muted' }, { t: 'true', c: 'bool' }],
      [{ t: '}', c: 'muted' }],
    ],
  },
  {
    filename: 'career.sql',
    lines: [
      [{ t: 'SELECT', c: 'tag' }, { t: ' company, role, shipped', c: 'plain' }],
      [{ t: 'FROM', c: 'tag' }, { t: '   career', c: 'plain' }],
      [{ t: 'WHERE', c: 'tag' }, { t: '  reached_production = ', c: 'plain' }, { t: 'true', c: 'bool' }],
      [{ t: 'ORDER BY', c: 'tag' }, { t: ' started_at ', c: 'plain' }, { t: 'DESC', c: 'tag' }, { t: ';', c: 'plain' }],
      [{ t: '', c: 'muted' }],
      [{ t: ' iSolution      | API Developer      | ', c: 'muted' }, { t: 'Apigee, GCP', c: 'string' }],
      [{ t: ' NVSSoft        | Software Engineer  | ', c: 'muted' }, { t: 'React, .NET', c: 'string' }],
      [{ t: ' Flex Avenues   | Developer Intern   | ', c: 'muted' }, { t: 'SQL Server, X++', c: 'string' }],
      [{ t: '(', c: 'muted' }, { t: '3', c: 'number' }, { t: ' rows)', c: 'muted' }],
    ],
  },
  {
    filename: 'looking-for.yaml',
    lines: [
      [{ t: 'open_to', c: 'tag' }, { t: ':', c: 'muted' }],
      [{ t: '  - ', c: 'muted' }, { t: 'API platform work', c: 'string' }],
      [{ t: '  - ', c: 'muted' }, { t: 'cloud architecture', c: 'string' }],
      [{ t: '  - ', c: 'muted' }, { t: 'system integration', c: 'string' }],
      [{ t: 'based_in', c: 'tag' }, { t: ': ', c: 'muted' }, { t: 'Riyadh, Saudi Arabia', c: 'string' }],
      [{ t: 'timezone', c: 'tag' }, { t: ': ', c: 'muted' }, { t: 'UTC+03', c: 'string' }],
      [{ t: 'reply_to', c: 'tag' }, { t: ': ', c: 'muted' }, { t: 'every message', c: 'string' }],
      [{ t: 'reach_me', c: 'tag' }, { t: ': ', c: 'muted' }, { t: 'ftaiehbilal@gmail.com', c: 'string' }],
    ],
  },
]

export const skills = [
  { group: 'Cloud & API', items: ['Google Cloud Platform (GCP)', 'Apigee API Management', 'Cloud Security', 'Cloud Logging', 'System Integration', 'Cloud Architecture'] },
  { group: 'Development', items: ['React', '.NET', 'CLI Tooling', 'React Native'] },
  { group: 'Data', items: ['Database Design & Optimization', 'Data Warehousing', 'SQL Server / T-SQL'] },
]

export const experience = [
  {
    company: 'iSolution',
    short: 'iSolution',
    role: 'API Developer',
    period: 'Feb 2026 — Present',
    duration: '7 months',
    location: 'Riyadh, Saudi Arabia',
    points: [
      'Architect robust, scalable APIs that serve as the backbone for system integrations and digital transformation.',
      'Leverage Google Apigee to centralize fragmented services — security policies, developer portals, traffic management, and analytics — across their full lifecycle.',
      'Work within a premier Google Partner environment delivering cloud-native solutions at scale.',
    ],
    stack: ['Apigee', 'GCP', 'API Design', 'Cloud Architecture'],
  },
  {
    company: 'NVSSoft',
    short: 'NVSSoft',
    role: 'Software Engineer',
    period: 'Sep 2024 — Feb 2026',
    duration: '1 year 6 months',
    location: 'Riyadh, Saudi Arabia',
    points: [
      'Developed and maintained interactive dashboards for government and private-sector clients, including the Ministry of Transport, using React on the front end and .NET on the back end.',
      'Built .NET utility tools to automate correspondence imports, physical record creation from Excel, and other operational workflows.',
      'Built a data warehouse to pre-aggregate data for faster dashboard loads and smoother reporting performance.',
      'Handled full deployment on virtual machines — server configuration and setup — ensuring stable, scalable production environments.',
      'Monitored and tuned database/query performance for real-time data access across client solutions.',
    ],
    stack: ['React', '.NET', 'SQL Server', 'Data Warehousing', 'VM Deployment'],
  },
  {
    company: 'Flex Avenues for Communications and IT',
    // The full legal name will not fit an axis lane; the chart uses `short`.
    short: 'Flex Avenues',
    role: 'Software Developer Intern',
    period: 'Jul 2023 — Sep 2023',
    duration: '3 months',
    location: 'Riyadh, Saudi Arabia',
    points: [
      'Built tables, views, and stored procedures in SQL Server; wrote and executed T-SQL statements.',
      'Customized forms, tables, and reports in Visual Studio for Dynamics workflows.',
      'Developed extensions and APIs using the X++ programming language.',
    ],
    stack: ['SQL Server', 'X++', 'Visual Studio'],
  },
]

// Newest first. `url` is the issuer's own attestation page — it is what makes
// the word "verified" mean anything here, so a credential without one should
// say so rather than borrow the check mark. `scope` lists the domains the
// credential actually covers; dates are month-precision because that is all
// the issuers publish.
export const certifications = [
  {
    id: 'gcp-ace',
    name: 'Associate Cloud Engineer',
    issuer: 'Google Cloud',
    kid: 'google-cloud',
    credentialId: 'ba415e79-24a3-429b-b5d2-fc957c177d57',
    issued: '2026-08',
    expires: '2029-08',
    scope: ['compute', 'networking', 'iam', 'operations'],
    url: 'https://www.credly.com/badges/ba415e79-24a3-429b-b5d2-fc957c177d57/linked_in_profile',
  },
  {
    id: 'ibm-data-science',
    name: 'IBM Data Science Professional Certificate',
    issuer: 'IBM',
    kid: 'ibm-skills',
    credentialId: 'C8X5LEMZLDFZ',
    issued: '2024-08',
    expires: null,
    scope: ['python', 'sql', 'pandas', 'machine-learning', 'visualization'],
    url: 'https://www.coursera.org/account/accomplishments/specialization/C8X5LEMZLDFZ',
  },
  {
    id: 'ibm-full-stack',
    name: 'IBM Full Stack Software Developer Specialization',
    issuer: 'IBM',
    kid: 'ibm-skills',
    credentialId: '7QVQQFVUF2KF',
    issued: '2024-02',
    expires: null,
    scope: ['react', 'node', 'containers', 'kubernetes', 'cloud-native'],
    url: 'https://www.coursera.org/account/accomplishments/specialization/7QVQQFVUF2KF',
  },
  {
    id: 'ms-az900',
    name: 'Microsoft Certified: Azure Fundamentals',
    issuer: 'Microsoft',
    kid: 'microsoft-learn',
    credentialId: 'B543F3E383BE97B0',
    issued: '2023-06',
    expires: null,
    scope: ['azure.core', 'governance', 'pricing', 'security'],
    url: 'https://learn.microsoft.com/en-us/users/belalalfutayh-5950/credentials/b543f3e383be97b0',
  },
]

export const education = {
  school: 'Bahçeşehir University',
  degree: 'B.S., Software Engineering',
  period: 'Sep 2019 — Sep 2023',
}

export const projects = [
  {
    title: 'Full Stack Developer Capstone',
    description:
      'Capstone project for the IBM Full Stack Software Developer Specialization — a complete full-stack app covering front-end UI, back-end services, and deployment.',
    tags: ['JavaScript', 'Full-Stack'],
    href: 'https://github.com/bilalftaieh/xrwvm-fullstack_developer_capstone',
    // Joins to src/data/repos.json, refreshed from GitHub at build time.
    repo: 'xrwvm-fullstack_developer_capstone',
  },
  {
    title: 'Giggle Gazette API',
    description:
      'A REST API project built in Java, focused on clean endpoint design and request/response handling.',
    tags: ['Java', 'REST API'],
    href: 'https://github.com/bilalftaieh/Project-Giggle-Gazette-API',
    // Joins to src/data/repos.json, refreshed from GitHub at build time.
    repo: 'Project-Giggle-Gazette-API',
  },
  {
    title: 'Next.js Dashboard',
    description:
      'A data dashboard built with Next.js and TypeScript — server components, routing, and structured data views.',
    tags: ['Next.js', 'TypeScript'],
    href: 'https://github.com/bilalftaieh/nextjs-dashboard',
    // Joins to src/data/repos.json, refreshed from GitHub at build time.
    repo: 'nextjs-dashboard',
  },
  {
    title: 'Company Budget Allocation',
    description:
      'A React + TypeScript app for planning and visualizing how a company allocates budget across departments.',
    tags: ['React', 'TypeScript'],
    href: 'https://github.com/bilalftaieh/React-Company-Budget-Allocation',
    // Joins to src/data/repos.json, refreshed from GitHub at build time.
    repo: 'React-Company-Budget-Allocation',
  },
]
