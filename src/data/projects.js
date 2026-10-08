// Every project on the site. /work lists them, /work/<slug> is each case study,
// and /home shows the ones with featured: true. the /work filter buttons come from the tags.
// to add one: copy an entry, give it a new slug, and put its images in public/work/<slug>/.
// projects.test.js and App.test.jsx check some values.
// KNOB: order of this array = order on /work and /home, and the 'Next:' chain on project pages
// (projects.test.js expects ai-sentiment-analysis before and rumie after the package tracker)
export const projects = [
  {
    // KNOB: slug = the URL (/work/digital-package-tracker). changing it breaks old links; tests use this one
    slug: 'digital-package-tracker',
    // KNOB: title (heading, list row, tab title), eyebrow (small line under the title), year, role
    title: 'Digital Package Tracker',
    eyebrow: 'Internal tool for Associated Students Inc., CSUF',
    year: '2026',
    role: 'Full-stack developer',
    // KNOB: stack = the "Built with" line. tags = /work filter buttons (projects.test.js lists every tag,
    // and checks this entry's title / role / stack)
    stack: ['Node.js', 'Express', 'SQLite', 'PWA'],
    tags: ['Product', 'Web', 'Backend'],
    // text fields can hold links written as [words](https://...) (components/RichText.jsx)
    // KNOB: summary = list row + lede. challenge / solution / outcome = the "The problem",
    // "What I built", and "How it went" sections
    summary: 'Barcode-to-signature package intake for campus teams that need a durable delivery record.',
    challenge: 'I noticed the Building Engineering team at my school was tracking their incoming packages on paper...many, many pages of paper.',
    solution: 'Built an authenticated Express and SQLite application with carrier detection, camera barcode scanning, grouped intake, shared signature capture, and searchable package records.',
    outcome: 'Cut average handling time per package by 70%. Used by CSUF IT, CSUF Building Engineering, and other CSU campuses for structured receiving, search, and delivery confirmation. Maintained by me and the IT department as of summer 2026.',
    // KNOB: cover = the big 16:9 image (src under public/, alt, optional position for the crop)
    cover: { src: '/work/digital-package-tracker/search.jpg', alt: 'Package search page listing unsigned and logged packages with tracking numbers, departments, and carriers (demo data)' },
    // KNOB: gallery = screenshots under the text: src, alt, caption, ratio (the image width / height).
    // leave it out and the page shows grey placeholder boxes
    gallery: [
      { src: '/work/digital-package-tracker/log.jpg', alt: 'Package logging form filled in with a UPS tracking number, receiver, type, and department (demo data)', caption: 'Logging a package', ratio: '1148 / 700' },
      { src: '/work/digital-package-tracker/sign.jpg', alt: 'Recipient signature page with a drawn signature and printed name (demo data)', caption: 'Signing for it', ratio: '1148 / 700' },
    ],
    // KNOB: links on the case study page; null hides one. devpostUrl works too (see Rumie)
    liveUrl: null,
    codeUrl: null,
    githubUrl: null,
    // KNOB: featured: true puts this project in the home page Work list
    featured: true,
  },
  {
    slug: 'rumie',
    title: 'Rumie',
    eyebrow: 'DesignVerse 2026, Major League Hacking prize winner',
    year: '2026',
    role: 'Mobile developer, in collaboration with [Anjelo Go](https://github.com/anjelogo)',
    stack: ['Flutter', 'Dart', 'MongoDB Atlas', 'Cloudflare', 'Vultr'],
    tags: ['Mobile', 'Product'],
    summary: 'Swipe, match, and chat to find a compatible roommate and a place to live.',
    challenge: 'Needed a cool project that could be taken beyond a competition.',
    solution: 'Built in 24 hours with Flutter and a MongoDB Atlas backend: profiles built around budget, habits, interests, and pets, a swipe deck for people and housing listings, matching, chat between matches, landlord listings, and email sign-in with a Face ID or passcode fallback.',
    outcome: 'Won [MLH] Best Use of MongoDB Atlas at DesignVerse 2026. After: every screen now runs on the live API instead of sample data, token refresh and error handling are hardened, and 109 tests cover it. Plan to release to App Store with Anjelo Go',
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
  },
  {
    slug: 'evolytics',
    title: 'Evolytics',
    eyebrow: 'MLB player analytics dashboard',
    year: '2026',
    role: 'Full-stack developer',
    stack: ['React', 'TypeScript', 'Express', 'Zod', 'Recharts', 'Tailwind'],
    tags: ['Web', 'Data', 'Backend'],
    summary: 'Search any MLB player, read the trends, and compare two players side by side.',
    challenge: 'My favorite website for baseball analytics, [Baseball Reference](https://www.baseball-reference.com), looks very cramped. So I made a baseball analytics site with a more open-concept approach, purely for the aesthetics. I also added my own stat!',
    solution: "An npm-workspaces monorepo with an Express and Zod API over the public MLB Stats API, cached for five minutes, and a React and Recharts front end. It covers player search, season stats and game logs, wOBA, ISO, and FIP with their formulas, trend charts in each team's colors, a 0 to 100 Hot/Cold form score, head-to-head comparison, league leaders, standings, rosters, and a saved watchlist.",
    outcome: 'Seven API routes and eight pages running on public data with no API keys, with backend tests on the routes.',
    cover: { src: '/work/evolytics/home.jpg', alt: 'Evolytics home page with a player search and a Shohei Ohtani form card' },
    gallery: [
      { src: '/work/evolytics/player.jpg', alt: 'Evolytics player page for Shohei Ohtani with slash line, form score, and season totals', caption: 'Player page' },
      { src: '/work/evolytics/leaders.jpg', alt: 'Evolytics league leaders table for batting average', caption: 'League leaders' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/summer-project',
    featured: true,
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
    challenge: 'I didn\'t wanna pay for a subscription to use a food recognition app that runs off the same AI models I already pay for.',
    solution: 'Food recognition runs on-device (or paid with a valid API key) with a TensorFlow Lite model, barcodes resolve through Open Food Facts, and nutrition comes from a bundled USDA-derived database, all stored in local-first SQLite. An optional account syncs the diary through Supabase, and an EvoEat+ subscription through RevenueCat unlocks fasting, goal phases, a coach, and a meal planner.',
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
  },
  {
    slug: 'csufsched',
    title: 'CSUF Sched',
    eyebrow: 'Class schedule builder',
    year: '2026',
    role: 'Full-stack developer',
    stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'React', 'Docker'],
    tags: ['Web', 'Backend', 'Data'],
    summary: 'Builds conflict-free CSUF class schedules from the catalog, with professor ratings alongside.',
    challenge: "CSUF's schedule builder kinda...sucks, so I built my own that actually works.",
    solution: 'Scrapers pull the CSUF catalog and RateMyProfessor ratings into Postgres behind a Fastify API, and a solver package enumerates, filters, and scores section combinations. The React front-end has a drag-and-drop calendar, course search, professor popovers, share links, and .ics export that drops straight into any calendar app.',
    outcome: 'Runs with Docker Compose and is covered by unit, integration, and Playwright tests in CI. A full catalog scrape takes about 90 minutes, and it is not hosted publicly yet.',
    cover: { src: '/work/csufsched/solver.jpg', alt: 'Week calendar with CPSC 131, CPSC 240, CPSC 315, and MATH 270A placed around a busy block, next to ranked generated schedules (demo data)' },
    gallery: [
      { src: '/work/csufsched/professor.jpg', alt: 'Course search showing CPSC 131 sections with a professor rating popover (demo data)', caption: 'Sections with professor ratings', ratio: '1152 / 800' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/CSUFsched',
    featured: true,
  },
  {
    // written from the résumé line and the server setup; reword the challenge to taste
    slug: 'Evoserver',
    title: 'Evoserver',
    eyebrow: 'Self-hosted infrastructure',
    year: '2026',
    role: 'Sole operator',
    stack: ['Linux', 'Docker', 'nginx', 'Cloudflare Tunnels', 'Tailscale'],
    tags: ['Infra', 'Backend'],
    summary: 'The Linux server that runs this site and the websites for my family\'s side hustles, as well as my sister\'s <a href="https://madibarreau.com" target=_blank>art website!</a>.',
    challenge: 'I wanted real production sites running on hardware I control, without exposing the server to the open internet.',
    solution: 'Each site runs in its own Docker container and is published through Cloudflare Tunnels, so the server has zero open inbound ports; Tailscale handles private remote access. This portfolio is a stock nginx container serving a folder that a one-command deploy script updates.',
    outcome: 'Three production websites live, with me as the sole operator for DNS, TLS, updates, and recovery.',
    cover: { src: null },
    gallery: [],
    liveUrl: 'https://evanoctave.dev',
    codeUrl: null,
    githubUrl: null,
    featured: false,
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
    challenge: 'I wanted a food tracking app tailored to my university\'s dining hall so everybody on campus could track their meals and meet their goals.',
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
    challenge: 'My first machine learning project--wanted it to be a real-world application based on a practical problem.',
    solution: 'Prepared text with NLTK, trained a TF-IDF and Logistic Regression pipeline, then exposed single-text, batch CSV, and model-performance views in Streamlit.',
    outcome: 'An end-to-end pipeline with model persistence, confidence scores, batch results, and evaluation visuals. It trains on generated sample reviews, so treat its accuracy as a demo, not a benchmark.',
    cover: { src: '/work/ai-sentiment-analysis/analyze.jpg', alt: 'Streamlit app classifying a movie review as positive with 86.6% confidence, shown on a gauge' },
    gallery: [
      { src: '/work/ai-sentiment-analysis/train.jpg', alt: 'Train Model page with the generated sample training data and cleaned review text', caption: 'Training on generated reviews', ratio: '16 / 10' },
    ],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/AI-project',
    featured: false,
  },
]

// KNOB: old project URLs that should still work after a rename (old slug -> current slug)
const RENAMED = { basevolytics: 'evolytics' }

// slugs match case-insensitively, so /work/Evolytics and /work/evolytics both land on the page
export const getProjectBySlug = (slug = '') => {
  const wanted = RENAMED[slug.toLowerCase()] ?? slug.toLowerCase()
  return projects.find((project) => project.slug === wanted)
}

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
