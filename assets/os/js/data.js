/* ============================================================
   PrabhatOS — portfolio content
   Source of truth for every app rendered by the desktop shell.
   ============================================================ */

const PROFILE = {
  name: 'Prabhat Thakur',
  initials: 'PT',
  role: 'Software Engineer',
  tagline: 'Full-Stack Engineer · Engineering Lead',
  location: 'New Delhi, India',
  phone: '+91 78278 89388',
  phoneRaw: '+917827889388',
  email: 'ck.8107@gmail.com',
  github: 'https://github.com/Prabhatthakur18',
  githubLabel: 'github.com/Prabhatthakur18',
  // TODO: the resume PDF lists the LinkedIn handle truncated — drop the full
  // profile URL in here and the Contact app + terminal will start showing it.
  linkedin: '',
  linkedinLabel: '',
  summary:
    'Full-stack engineer who owns systems end to end — schema design through AWS deployment. ' +
    "Now engineering lead for Amato Automotive India's digital products, where I rebuilt the corporate " +
    'platform from scratch, shipped a multi-tenant franchise warranty platform and an HR + learning ' +
    'platform, and now lead a group-wide MIS consolidating dealer-network data. Strong across ' +
    'React/TypeScript, Python/FastAPI, Node.js/Express, and Java/Spring Boot. Also the group’s lead ' +
    'on applied AI, designing and running enablement programmes for sales, operations, design, and ' +
    'manufacturing teams across Amato Automotive.',
  specs: [
    ['Device name', 'PRABHAT-OS'],
    ['Processor', 'Full-Stack Engineering Core — 4.2 yrs @ turbo'],
    ['Installed memory', 'React · TypeScript · Python · Java · SQL'],
    ['System type', 'Engineering Lead, Amato Automotive Pvt Ltd'],
    ['Location', 'New Delhi, India'],
    ['Status', 'Shipping to production']
  ]
};

const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Amato Automotive Pvt Ltd',
    period: 'Dec 2024 – Present',
    current: true,
    points: [
      "Serving as Engineering Lead for Amato Automotive's digital products — owning the full lifecycle from requirement gathering and architecture through deployment and maintenance, while mentoring the internal tech team across frontend, backend, and infrastructure.",
      'Leading development of a group-wide Management Information System unifying Sales, Leads, Finance, and OE Network data across a 1000+ dealer network — closing the data-leakage and reporting gaps left by manual spreadsheet workflows (React/TypeScript, FastAPI/Python, PostgreSQL on a self-managed VPS with nginx and PM2).',
      'Engineered a Google Sheets → PostgreSQL sync pipeline that normalizes semi-structured spreadsheet data — inconsistent headers, mixed units, hand-typed dates — into a queryable schema with idempotent re-sync and full audit logging, reconciling 1,500+ dealer records across 5 OEMs with verified zero data loss.',
      'Enforced two-layer access control (module-level and sheet-source-level) with scoped JWT tokens across separate auth domains, so a token from the public field-rep portal can never authenticate against the internal MIS; shipped an OTP-based passwordless portal for field reps with server-side record scoping and CSV/XLSX export.',
      'Rebuilt AmatoAutomotiveIndia.com end to end — frontend, backend, database architecture, and admin panel — replacing a legacy stack with a maintainable, performant platform.',
      'Managing and scaling AWS infrastructure (EC2, S3, IAM, CloudFront, Lambda) across all Amato Automotive digital platforms, covering deployments, access control, and uptime.',
      'Built and maintain the Enterprise Franchise Management & Warranty Verification System, a Three.js 3D personalization configurator for Mahindra accessories, and a responsive Store Locator with ratings and admin tooling.'
    ]
  },
  {
    role: 'Software Developer Trainee',
    company: 'RailWorld India Pvt Ltd',
    period: 'Dec 2023 – Aug 2024',
    current: false,
    points: [
      'Built backend services and REST APIs with Java, Spring Boot, and a microservices architecture, integrated with React.js frontends over MySQL.',
      'Delivered features, debugging, and performance work in an Agile/Scrum team — sprint planning, code review, and Git branching workflows.'
    ]
  }
];

const PROJECTS = [
  {
    id: 'connect',
    name: 'Autoform Connect',
    file: 'Autoform-Connect',
    subtitle: 'Full-Stack HR Management System',
    kind: 'Platform',
    year: '2025',
    color: '#0f7b6c',
    live: 'https://connect.amatoautomotive.co.in/',
    stack: ['React (Vite)', 'TypeScript', 'Node.js', 'Express.js', 'Prisma ORM', 'MySQL', 'JWT', 'Vercel'],
    blurb:
      'An end-to-end HR platform built from scratch — 38 relational tables spanning employees, attendance, leave, payroll, learning, documents and performance, wrapped in four-tier role-based access.',
    points: [
      'Architected and shipped an end-to-end HR platform from scratch, designing a 38-table relational schema spanning employees, attendance, leave, payroll, learning, documents, and performance.',
      'Secured the platform with JWT over httpOnly cookies, bcrypt hashing, OTP email password reset, four-tier role-based access control (HR / Manager / Leadership / Employee), and IP-aware rate limiting on login and sensitive endpoints.',
      'Built Attendance, Leave, and Payroll modules — clock-in/out with manager-approved corrections, multi-level approval chains (Employee → Manager → HR), salary-slip generation, and a Tally CSV/Excel import pipeline.',
      'Developed a full Learning Management System with multi-format modules (video, YouTube/Vimeo embeds, PDF, text), approval-based enrollment, and auto-issued certificates — gated by an 80% watch/read threshold enforced via the YouTube IFrame API, Vimeo Player SDK, and Page Visibility API.',
      'Engineered a proctored quiz engine with a form-style builder, configurable pass marks, grade bands, and attempt limits, plus tab-switch detection (Page Visibility + blur) that auto-submits the attempt and alerts Manager/HR.',
      'Built an E-Library with in-app PDF viewing via blob-URL rendering for large files, and a centralized notification service with department/role/individual targeting behind a real-time unread-count bell.'
    ],
    stats: [
      ['Tables', '38'],
      ['Access tiers', '4'],
      ['Modules', '7+']
    ]
  },
  {
    id: 'warranty',
    name: 'Franchise & Warranty System',
    file: 'Franchise-Warranty-System',
    subtitle: 'Enterprise Franchise Management & Warranty Verification',
    kind: 'Multi-tenant platform',
    year: '2025',
    color: '#8b5cf6',
    live: 'https://warranty2.autoformindia.co.in/',
    stack: ['React (Vite)', 'TypeScript', 'Tailwind', 'shadcn/ui', 'TanStack Query', 'Node.js', 'Express.js', 'MySQL', 'JWT'],
    blurb:
      'A multi-tenant warranty platform for high-value automotive products, with a fraud-prevention pipeline that will not clear a claim until installer and product code verify against each other.',
    points: [
      'Built a multi-tenant platform serving Customers, Vendors, and Admins for high-value automotive warranty management (Seat Covers, PPF, EV) with JWT role-based access control.',
      'Engineered a multi-stage fraud prevention pipeline requiring verified installer-to-product-code linking before any warranty clears admin validation.',
      'Designed an automated grievance redressal system with department-routing algorithms that dispatch complaints to internal staff via secure tokenized email links.',
      'Audited and refactored 50+ complex SQL queries — multi-table JOINs, dynamic filters — to parameterized bindings, eliminating SQL injection vectors and 500-level errors.',
      'Built a franchise-to-distributor Order Management System with webhook-based integration into existing internal systems, streamlining order placement and fulfillment tracking.'
    ],
    stats: [
      ['User roles', '3'],
      ['Queries hardened', '50+'],
      ['SQLi vectors', '0']
    ]
  },
  {
    id: 'configurator',
    name: 'Personalisation Configurator',
    file: 'Mahindra-MG-Configurator',
    subtitle: 'Mahindra & MG Accessory Personalisation',
    kind: 'Browser graphics',
    year: '2025',
    color: '#d97706',
    live: '',
    stack: ['React', 'JavaScript', 'Express', 'Material UI', 'Canvas 2D', 'ONNX Runtime Web', 'WebAssembly', 'pdf-lib', 'jsPDF', 'html2canvas', 'Puppeteer'],
    blurb:
      'A personalisation configurator that renders real satin-stitch embroidery in the browser — deterministic Canvas 2D stitch sequencing, on-device background removal, and client-side PDF orders.',
    points: [
      'Built a React-based accessory personalisation configurator for Mahindra & MG Hector accessories, supporting custom text, fonts, colours, artwork uploads, and front/rear seat placement previews.',
      'Developed a Canvas 2D embroidery renderer that converts user text into deterministic satin-stitch graphics using a custom stitch-sequencing algorithm for direction, spacing, and thread shading per glyph.',
      'Integrated browser-side ONNX/WASM background removal for uploaded artwork with lazy model loading, plus a flood-fill (BFS-based) segmentation fallback.',
      'Implemented client-side PDF order generation using pdf-lib and jsPDF with embedded fonts, product previews, customer details, and signature/dealership fields.'
    ],
    stats: [
      ['Render', 'Canvas 2D'],
      ['Inference', 'On-device'],
      ['Server calls', 'Zero for PDF']
    ]
  },
  {
    id: 'exportlead',
    name: 'Export Lead Intelligence',
    file: 'Export-Lead-Intelligence',
    subtitle: 'Export Lead Management Platform · Internal Tool',
    kind: 'Data & AI',
    year: '2025',
    color: '#0369a1',
    live: '',
    stack: ['Java', 'Spring Boot', 'Selenium WebDriver', 'Jsoup', 'Google Gemini API', 'Apache POI', 'iText'],
    blurb:
      'A multi-source lead engine for export markets — one dashboard over EN 52, Volza, LinkedIn, Apollo.io and Google Maps, enriched and scored by Gemini before it reaches the sales pipeline.',
    points: [
      'Architected a multi-source scraping platform unifying EN 52, Volza, LinkedIn, Apollo.io, and Google Maps — users connect via their own credentials from a single dashboard.',
      'Handled authenticated session management per platform using Selenium WebDriver + Jsoup for both dynamic and static page scraping.',
      'Integrated the Google Gemini API for AI-powered prospect enrichment — intelligent company profiling, summarization, and scoring from raw scraped data.',
      'Built a document generation engine exporting leads as Excel (Apache POI), PDF (iText), and CSV for sales and outreach pipelines.',
      'Enabled AI-powered lead generation across the USA, Canada, and other foreign markets for the export sales desk.'
    ],
    stats: [
      ['Sources', '5'],
      ['Export formats', '3'],
      ['Markets', 'USA / CA / Intl']
    ]
  }
];

const AI_PROGRAM = {
  title: 'AI Literacy Programme',
  org: 'Amato Automotive Group',
  period: 'Ongoing · Designed & Delivered',
  points: [
    'Designed and delivered a company-wide AI literacy programme for 500+ employees across Sales, Accounts, Design, and Operations — covering prompt engineering, deep research, and hands-on demos across Claude, ChatGPT, Gemini, and NotebookLM, with a custom prompt cheat sheet as post-session reference.',
    "Extended the programme across Amato Automotive's manufacturing units, running role-specific sessions across 4 units with production, planning, operations, and design teams on their own live data rather than generic examples.",
    'Built unit-level AI use cases now in regular use — production planning and shift reporting, SOP and work-instruction drafting, operational data analysis in Excel, and AI-assisted concept imagery for product design.',
    'Packaged session output into reusable prompt playbooks and progressive workshop tracks, turning one-off training into a repeatable enablement programme across sites.'
  ],
  metrics: [
    ['Employees trained', '500+'],
    ['Manufacturing units', '4'],
    ['Tracks', 'Progressive']
  ]
};

const SKILL_GROUPS = [
  {
    name: 'Languages',
    items: [
      ['TypeScript', 92], ['JavaScript', 94], ['Python', 82], ['Java', 85], ['SQL', 88]
    ]
  },
  {
    name: 'Frontend',
    items: [
      ['React.js', 93], ['Three.js', 74], ['Tailwind CSS', 90], ['shadcn/ui', 86],
      ['TanStack Query', 82], ['HTML5 / CSS3', 95]
    ]
  },
  {
    name: 'Backend',
    items: [
      ['Node.js', 90], ['Express.js', 90], ['Prisma ORM', 84], ['FastAPI', 80],
      ['SQLAlchemy', 76], ['Spring Boot', 82], ['REST APIs', 92], ['JWT / Auth', 88],
      ['ONNX Runtime Web', 68], ['WebAssembly', 62]
    ]
  },
  {
    name: 'Databases & Cloud',
    items: [
      ['PostgreSQL', 84], ['MySQL', 90], ['AWS (EC2, S3, IAM, CloudFront, Lambda)', 80],
      ['VPS · nginx · PM2', 82]
    ]
  },
  {
    name: 'AI',
    items: [
      ['Prompt engineering', 92], ['Claude', 88], ['OpenAI API', 80],
      ['Google Gemini API', 82], ['NotebookLM', 78]
    ]
  },
  {
    name: 'Tools & Libraries',
    items: [
      ['Git / GitHub', 92], ['VS Code', 95], ['Postman', 86], ['Jsoup', 72],
      ['Apache POI', 74], ['pdf-lib', 80], ['jsPDF', 78], ['Puppeteer', 74]
    ]
  }
];

const EDUCATION = [
  {
    title: 'B.Tech — Computer Science & Engineering',
    org: 'Maharshi Dayanand University (GITAM, Jhajjar, Haryana)',
    period: '2019 – 2023',
    detail: '78.54%'
  },
  {
    title: 'Full Stack Software Development',
    org: 'QSpiders / JSpiders, Delhi',
    period: 'Apr – Sep 2023',
    detail: 'Java (Core & Advanced), Spring Boot, OOPs, MySQL, React.js'
  },
  {
    title: 'CBSE Class XII',
    org: 'New Delhi',
    period: '2019',
    detail: '70.2%'
  },
  {
    title: 'CBSE Class X',
    org: 'New Delhi',
    period: '2017',
    detail: '86.54%'
  }
];

const RECYCLED = [
  { name: 'jQuery-spaghetti.js', note: 'Replaced by component state. No regrets.' },
  { name: 'manual-dealer-spreadsheets.xlsx', note: 'Superseded by the group MIS sync pipeline.' },
  { name: 'string-concatenated-queries.sql', note: 'All 50+ rewritten as parameterized bindings.' },
  { name: 'server-side-pdf-render.job', note: 'Now generated client-side with pdf-lib.' },
  { name: 'it-works-on-my-machine.txt', note: 'Deleted the day CI started running.' }
];
