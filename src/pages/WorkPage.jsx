import { useState } from 'react'
import WorkList from '../components/WorkList.jsx'
import { getProjectTags, projects } from '../data/projects.js'

export default function WorkPage() {
  const [tag, setTag] = useState('All')
  const shown = tag === 'All' ? projects : projects.filter((project) => project.tags.includes(tag))

  return (
    <section className="page">
      <h1>Work</h1>
      <p className="muted">Things I've built, newest ones first. There's more that isn't up yet.</p>
      <div className="filters" role="group" aria-label="Filter projects">
        {getProjectTags().map((item) => (
          <button aria-pressed={tag === item} key={item} onClick={() => setTag(item)} type="button">{item}</button>
        ))}
      </div>
      <WorkList projects={shown} />
    </section>
  )
}
