import { projects } from './projects.js'
export { normalizeGithubRepo } from './github.js'

export const WORKBENCH_STORAGE_KEY = 'orbitfolio-workbench-v1'
export const WORKBENCH_STORAGE_VERSION = 1

export const createSeedWorkbench = () => projects
  .filter((project) => project.featured)
  .map((project, index) => ({
    id: `project-${project.slug}`,
    type: 'project',
    projectSlug: project.slug,
    x: index * 28,
    y: index * 20,
    width: 280,
    height: 220,
    rotation: index === 1 ? -3 : 0,
  }))

export const readWorkbench = (storage) => {
  try {
    const parsed = JSON.parse(storage.getItem(WORKBENCH_STORAGE_KEY) || '')
    if (parsed.version !== WORKBENCH_STORAGE_VERSION || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      return createSeedWorkbench()
    }
    if (!parsed.items.every((item) => item && typeof item.id === 'string' && typeof item.x === 'number')) {
      return createSeedWorkbench()
    }
    return parsed.items
  } catch {
    return createSeedWorkbench()
  }
}

export const writeWorkbench = (storage, items) => {
  storage.setItem(WORKBENCH_STORAGE_KEY, JSON.stringify({
    version: WORKBENCH_STORAGE_VERSION,
    items,
  }))
}
