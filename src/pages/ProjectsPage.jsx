import ProjectGrid from '../components/ProjectGrid.jsx'

export default function ProjectsPage() {
  return (
    <section className="projects-page page-frame">
      <p className="eyebrow">Selected work</p>
      <h1>Things I made work.</h1>
      <h2 className="sr-only">Project worlds</h2>
      <p className="page-intro">Product systems and machine-learning experiments, with enough detail to inspect how each one works.</p>
      <ProjectGrid />
    </section>
  )
}
