// Work page (/work): every project, with tag filter buttons on top.
// projects and tags come from src/data/projects.js; rows are drawn by components/WorkList.jsx.
import { useState } from 'react'
import WorkList from '../components/WorkList.jsx'
import { getProjectTags, projects } from '../data/projects.js'

export default function WorkPage() {
  // KNOB: the filter selected when the page opens ('All' is added by getProjectTags in projects.js)
  const [tag, setTag] = useState('All')
  const shown = tag === 'All' ? projects : projects.filter((project) => project.tags.includes(tag))

  return (
    <section className="page">
      {/* KNOB: heading + intro line (App.test.jsx expects the h1 'Work') */}
      <h1>Work</h1>
      <p className="muted">Things I've built, newest ones first. There's more that isn't up yet.</p>
      {/* KNOB: filter buttons are built from every project's tags. edit tags in src/data/projects.js */}
      <div className="filters" role="group" aria-label="Filter projects">
        {getProjectTags().map((item) => (
          <button aria-pressed={tag === item} key={item} onClick={() => setTag(item)} type="button">{item}</button>
        ))}
      </div>
      <WorkList projects={shown} />
    </section>
  )
}
