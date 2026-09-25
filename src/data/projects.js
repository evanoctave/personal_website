export const projects = [
  {
    slug: 'digital-package-tracker',
    title: 'Digital Package Tracker',
    eyebrow: 'CSUF internal operations tool',
    year: '2026',
    role: 'Full-stack developer',
    stack: ['Node.js', 'Express', 'SQLite', 'PWA'],
    tags: ['Product', 'Web', 'Backend'],
    summary: 'Barcode-to-signature package intake for campus teams that need a durable delivery record.',
    challenge: 'Campus teams need one reliable package workflow that keeps each tracking number, recipient, department, and delivery record connected.',
    solution: 'Built an authenticated Express and SQLite application with carrier detection, camera barcode scanning, grouped intake, shared signature capture, and searchable package records.',
    outcome: 'Used by CSUF IT and Building Engineering for structured receiving, search, and delivery confirmation.',
    orbit: { color: 'coral', size: 'large', angle: 12 },
    cover: { label: 'Coral planet with package rings', tone: 'coral' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
    githubUrl: null,
    featured: true,
    media: [],
  },
  {
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
    cover: { label: 'Mint planet with signal satellites', tone: 'mint' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
    githubUrl: 'https://github.com/evanoctave/AI-project',
    featured: true,
    media: [],
  },
]

export const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug)

export const getProjectTags = () => [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
]

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
