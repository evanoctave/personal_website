import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'
import WorkList from '../components/WorkList.jsx'
import { getProjectTags, projects } from '../data/projects.js'

export default function WorkPage() {
  const [tag, setTag] = useState('All')
  const shown = tag === 'All' ? projects : projects.filter((project) => project.tags.includes(tag))

  return (
    <section className="page">
      <p className="eyebrow">Index — {String(projects.length).padStart(2, '0')} projects</p>
      <h1 className="page-title"><Scramble text="Work" /></h1>
      <Reveal className="filters" role="group" aria-label="Filter projects">
        {getProjectTags().map((item) => (
          <button aria-pressed={tag === item} key={item} onClick={() => setTag(item)} type="button">{item}</button>
        ))}
      </Reveal>
      <WorkList projects={shown} />
      <p className="page-note">More on the way. Some things are still under NDA, some are still on the workbench.</p>
    </section>
  )
}
