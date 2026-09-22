export const projects = [
  {
    slug: 'nebula-notes',
    title: 'Nebula Notes',
    eyebrow: 'Productivity system',
    year: '2026',
    role: 'Product design + frontend',
    stack: ['React', 'Motion', 'Local-first'],
    tags: ['Product', 'Web'],
    summary: 'A quiet note tool for loud ideas.',
    challenge: 'Turn unstructured fragments into a calm daily ritual.',
    solution: 'Designed a spatial inbox and one-command capture flow.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'coral', size: 'large', angle: 12 },
    cover: { label: 'Coral planet with paper rings', tone: 'coral' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    eyebrow: 'Climate data experience',
    year: '2026',
    role: 'Creative developer',
    stack: ['React', 'Data viz', 'Accessibility'],
    tags: ['Product', 'Web'],
    summary: 'Public data made warm, legible, and alive.',
    challenge: 'Make seasonal climate signals useful to local residents.',
    solution: 'Built a color-guided forecast narrative with plain-language states.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'mint', size: 'medium', angle: 142 },
    cover: { label: 'Mint planet with leaf satellites', tone: 'mint' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
  },
  {
    slug: 'comet-care',
    title: 'Comet Care',
    eyebrow: 'Identity and service site',
    year: '2026',
    role: 'Brand direction + web',
    stack: ['Brand', 'UI', 'React'],
    tags: ['Brand', 'Web'],
    summary: 'Gentle care scheduling for moving lives.',
    challenge: 'Make appointment planning feel human during stressful weeks.',
    solution: 'Paired direct language with a calm service-path finder.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'yellow', size: 'small', angle: 252 },
    cover: { label: 'Yellow comet crossing soft clouds', tone: 'yellow' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
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
