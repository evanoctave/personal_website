// Every project on the site. /work lists them, /work/<slug> is each case study,
// and /home shows the ones with featured: true. the /work filter buttons come from the tags.
// to add one: copy an entry, give it a new slug, and put its images in public/work/<folder>/
// (any folder name, the src paths just have to match). projects.test.js and App.test.jsx check some values.
// KNOB: order of this array = order on /work and /home, and the 'Next:' chain on project pages
// (projects.test.js expects ai-sentiment-analysis before and rumie after the package tracker)
export const projects = [
  {
    // KNOB: slug = the URL (/work/digital-package-tracker). changing it breaks old links; tests use this one
    slug: 'digital-package-tracker',
    // KNOB: title (heading, list row, tab title), eyebrow (small line under the title), year, role
    title: 'Digital Package Tracker',
    eyebrow: 'CSUF internal operations tool',
    year: '2026',
    role: 'Full-stack developer',
    // KNOB: stack = the "Built with" line. tags = /work filter buttons (projects.test.js lists every tag,
    // and checks this entry's title / role / stack)
    stack: ['Node.js', 'Express', 'SQLite', 'PWA'],
    tags: ['Product', 'Web', 'Backend'],
    // KNOB: summary = list row + lede. challenge / solution / outcome = the "The problem",
    // "What I built", and "How it went" sections
    summary: 'Barcode-to-signature package intake for campus teams that need a durable delivery record.',
    challenge: 'Campus teams need one reliable package workflow that keeps each tracking number, recipient, department, and delivery record connected.',
    solution: 'Built an authenticated Express and SQLite application with carrier detection, camera barcode scanning, grouped intake, shared signature capture, and searchable package records.',
    outcome: 'Used by CSUF IT and Building Engineering for structured receiving, search, and delivery confirmation.',
    // orbit isn't read anywhere right now (leftover), safe to ignore
    orbit: { color: 'coral', size: 'large', angle: 12 },
    // KNOB: cover = the big 16:9 image (src under public/, alt, optional position for the crop)
    cover: { src: '/work/package-tracker/search.jpg', alt: 'Package search page listing unsigned and logged packages with tracking numbers, departments, and carriers (demo data)' },
    // KNOB: gallery = screenshots under the text: src, alt, caption, ratio (the image width / height).
    // leave it out and the page shows grey placeholder boxes
    gallery: [
      { src: '/work/package-tracker/log.jpg', alt: 'Package logging form filled in with a UPS tracking number, receiver, type, and department (demo data)', caption: 'Logging a package', ratio: '1148 / 700' },
      { src: '/work/package-tracker/sign.jpg', alt: 'Recipient signature page with a drawn signature and printed name (demo data)', caption: 'Signing for it', ratio: '1148 / 700' },
    ],
    // KNOB: links on the case study page; null hides one. devpostUrl works too (see Rumie)
    liveUrl: null,
    codeUrl: null,
    githubUrl: null,
    // KNOB: featured: true puts this project in the home page Work list
    featured: true,
    // media isn't read anywhere right now
    media: [],
  },
  {
    slug: 'rumie',
    title: 'Rumie',
    eyebrow: 'DesignVerse 2026 hackathon, MLH prize winner',
    year: '2026',
    role: 'Mobile developer, with Anjelo Go',
    stack: ['Flutter', 'Dart', 'MongoDB Atlas', 'Cloudflare', 'Vultr'],
    tags: ['Mobile', 'Product'],
    summary: 'Swipe, match, and chat to find a compatible roommate and a place to live.',
    challenge: 'Finding a roommate early in college usually means scrolling disorganized listings or relying on word of mouth, and the platforms that exist feel impersonal and dated.',
    solution: 'Built in 24 hours with Flutter and a MongoDB Atlas backend: profiles built around budget, habits, interests, and pets, a swipe deck for people and housing listings, matching, chat between matches, landlord listings, and email sign-in with a Face ID or passcode fallback.',
    outcome: 'Won [MLH] Best Use of MongoDB Atlas at DesignVerse 2026. After the event I finished the app: every screen now runs on the live API instead of sample data, token refresh and error handling are hardened, and 109 tests cover it.',
    cover: { src: '/work/rumie/discover.jpg', alt: 'Rumie discover screen showing a roommate profile card', position: '50% 30%' },
    // KNOB: layout: 'phone' swaps the cover for a row of phone screenshots (the gallery) up top
    layout: 'phone',
    gallery: [
      { src: '/work/rumie/discover.jpg', alt: 'Rumie discover screen showing a roommate profile card', caption: 'Discover', ratio: '737 / 1600' },
      { src: '/work/rumie/match.jpg', alt: 'Rumie match screen', caption: "It's a match", ratio: '737 / 1600' },
      { src: '/work/rumie/chat.jpg', alt: 'Rumie chat between two matched people', caption: 'Chat', ratio: '737 / 1600' },
      { src: '/work/rumie/housing.jpg', alt: 'Rumie housing listings', caption: 'Listings', ratio: '737 / 1600' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/rumie-app',
    devpostUrl: 'https://devpost.com/software/rumie',
    featured: true,
    media: [],
  },
  {
    slug: 'basevolytics',
    title: 'Basevolytics',
    eyebrow: 'MLB player analytics dashboard',
    year: '2026',
    role: 'Full-stack developer',
    stack: ['React', 'TypeScript', 'Express', 'Zod', 'Recharts', 'Tailwind'],
    tags: ['Web', 'Data', 'Backend'],
    summary: 'Search any MLB player, read the trends, and compare two players side by side.',
    challenge: 'Box scores tell you what happened, not whether a player is heating up or how two players actually stack up against each other.',
    solution: "An npm-workspaces monorepo with an Express and Zod API over the public MLB Stats API, cached for five minutes, and a React and Recharts front end. It covers player search, season stats and game logs, wOBA, ISO, and FIP with their formulas, trend charts in each team's colors, a 0 to 100 Hot/Cold form score, head-to-head comparison, league leaders, standings, rosters, and a saved watchlist.",
    outcome: 'Seven API routes and eight pages running on public data with no API keys, with backend tests on the routes.',
    cover: { src: '/work/basevolytics/home.jpg', alt: 'Basevolytics home page with a player search and a Shohei Ohtani form card' },
    gallery: [
      { src: '/work/basevolytics/player.jpg', alt: 'Basevolytics player page for Shohei Ohtani with slash line, form score, and season totals', caption: 'Player page' },
      { src: '/work/basevolytics/leaders.jpg', alt: 'Basevolytics league leaders table for batting average', caption: 'League leaders' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/summer-project',
    featured: true,
    media: [],
  },
  {
    slug: 'evoeat',
    title: 'EvoEat',
    eyebrow: 'iOS nutrition tracker',
    year: '2026',
    role: 'Mobile developer',
    stack: ['Expo', 'React Native', 'TensorFlow Lite', 'SQLite', 'Supabase', 'RevenueCat'],
    tags: ['Mobile', 'AI', 'Product'],
    summary: 'Snap a photo of a meal and get calories and macros, recognized on the phone itself.',
    challenge: 'Most photo-based food trackers send your pictures to a server and charge a subscription to cover the inference bill.',
    solution: 'Food recognition runs on-device with a TensorFlow Lite model, barcodes resolve through Open Food Facts, and nutrition comes from a bundled USDA-derived database, all stored in local-first SQLite. An optional account syncs the diary through Supabase, and an EvoEat+ subscription through RevenueCat unlocks fasting, goal phases, a coach, and a meal planner.',
    outcome: 'Works fully offline with no account and costs nothing to run. Store screenshots, support, and privacy pages are done, and App Store submission is the last step.',
    cover: { src: '/work/evoeat/home.jpg', alt: 'EvoEat home screen with a calorie ring and macros', position: '50% 20%' },
    layout: 'phone',
    gallery: [
      { src: '/work/evoeat/home.jpg', alt: 'EvoEat home screen with a calorie ring and macros', caption: 'Your day', ratio: '737 / 1600' },
      { src: '/work/evoeat/history.jpg', alt: 'EvoEat history of logged days', caption: 'History', ratio: '737 / 1600' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/plately',
    featured: true,
    media: [],
  },
  {
    slug: 'csufsched',
    title: 'CSUFsched',
    eyebrow: 'Class schedule builder',
    year: '2026',
    role: 'Full-stack developer',
    stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'React', 'Docker'],
    tags: ['Web', 'Backend', 'Data'],
    summary: 'Builds conflict-free CSUF class schedules from the catalog, with professor ratings alongside.',
    challenge: 'Registration means juggling the catalog, section times, and professor reviews across tabs, then checking for time conflicts by hand.',
    solution: 'Scrapers pull the CSUF catalog and RateMyProfessor ratings into Postgres behind a Fastify API, and a solver package enumerates, filters, and scores section combinations. The React front end has a drag-and-drop calendar, course search, professor popovers, share links, and .ics calendar export.',
    outcome: 'Runs with Docker Compose and is covered by unit, integration, and Playwright tests in CI. A full catalog scrape takes about 90 minutes, and it is not hosted publicly yet.',
    cover: { src: '/work/csufsched/solver.jpg', alt: 'Week calendar with CPSC 131, CPSC 240, CPSC 315, and MATH 270A placed around a busy block, next to ranked generated schedules (demo data)' },
    gallery: [
      { src: '/work/csufsched/professor.jpg', alt: 'Course search showing CPSC 131 sections with a professor rating popover (demo data)', caption: 'Sections with professor ratings', ratio: '1152 / 800' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/CSUFsched',
    featured: true,
    media: [],
  },
  {
    slug: 'gspot-eats',
    title: 'GSpot Eats',
    eyebrow: 'CSUF dining companion',
    year: '2026',
    role: 'Mobile developer',
    stack: ['Expo', 'React Native', 'Supabase', 'SQLite', 'React Query'],
    tags: ['Mobile', 'Product', 'Data'],
    summary: 'Dining-hall menus, macro tracking, and a plate planner for CSUF students.',
    challenge: 'The campus dining menu tells you what is being served, not whether it fits your goals, so students tracking protein or calories end up guessing at the station.',
    solution: 'An Expo app with a day view that builds a plate for a chosen diet direction from the current meal, an on-device diary of meal snapshots, and progress against personal targets. A Supabase cron job and edge function are set up to ingest the menu during each meal window and store versioned snapshots.',
    outcome: 'Runs end to end on a clearly labeled sample menu. Live menu ingestion stays switched off until data permission is in writing.',
    cover: { src: '/work/gspot-eats/today.jpg', alt: 'GSpot Eats Today screen suggesting a high-protein plate across three dining stations', position: '50% 20%' },
    layout: 'phone',
    gallery: [
      { src: '/work/gspot-eats/today.jpg', alt: 'GSpot Eats Today screen suggesting a high-protein plate across three dining stations', caption: 'A plate for your goal', ratio: '402 / 874' },
      { src: '/work/gspot-eats/menu.jpg', alt: 'GSpot Eats dinner menu grouped by station with macros per serving', caption: 'Menu by station', ratio: '402 / 874' },
      { src: '/work/gspot-eats/diary.jpg', alt: 'GSpot Eats diary showing a logged dinner against daily calorie and macro targets', caption: 'Diary', ratio: '402 / 874' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/g-spot-eats',
    featured: false,
    media: [],
  },
  {
    // KNOB: App.test.jsx expects this exact title and GitHub url for this project
    slug: 'ai-sentiment-analysis',
    title: 'AI Sentiment Analysis System',
    eyebrow: 'Applied machine learning',
    year: '2025',
    role: 'Machine learning developer',
    stack: ['Python', 'scikit-learn', 'Streamlit', 'NLTK'],
    tags: ['AI', 'Data', 'Web'],
    summary: 'A train-to-analysis workflow for classifying movie-review sentiment.',
    challenge: 'Turn raw review text into an approachable project that covers data preparation, model training, evaluation, and interactive analysis.',
    solution: 'Prepared text with NLTK, trained a TF-IDF and Logistic Regression pipeline, then exposed single-text, batch CSV, and model-performance views in Streamlit.',
    outcome: 'Created an end-to-end learning project with model persistence, confidence scores, batch results, and evaluation visuals.',
    orbit: { color: 'mint', size: 'medium', angle: 142 },
    cover: { src: '/work/ai-sentiment/analyze.jpg', alt: 'Streamlit app classifying a movie review as positive with 86.6% confidence, shown on a gauge' },
    gallery: [
      { src: '/work/ai-sentiment/train.jpg', alt: 'Train Model page with the generated sample training data and cleaned review text', caption: 'Training on generated reviews', ratio: '16 / 10' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/AI-project',
    featured: false,
    media: [],
  },
]

export const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug)

// filter tags = 'All' + every tag used above, alphabetical (projects.test.js asserts the full list)
export const getProjectTags = () => [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
]

// previous / next project, wrapping around the ends (the 'Next:' link on project pages)
export const getAdjacentProjects = (slug) => {
  const index = projects.findIndex((project) => project.slug === slug)

  if (index < 0) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  }
}
