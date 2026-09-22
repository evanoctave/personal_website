export const normalizeGithubRepo = (repo) => {
  if (!repo || typeof repo !== 'object') return null
  const name = typeof repo.name === 'string' && repo.name.trim() ? repo.name.trim() : null
  const htmlUrl = typeof repo.html_url === 'string' && repo.html_url.trim() ? repo.html_url.trim() : null
  if (!name || !htmlUrl) return null
  return { name, htmlUrl, description: typeof repo.description === 'string' ? repo.description : '' }
}
