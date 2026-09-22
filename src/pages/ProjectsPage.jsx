import ProjectGrid from '../components/ProjectGrid.jsx'

export default function ProjectsPage() {
  return (
    <section className="projects-page page-frame">
      <p className="eyebrow">Selected work</p>
      <h1>Projects with a pulse.</h1>
      <h2 className="sr-only">Project worlds</h2>
      <p className="page-intro">A small archive of product, data, and identity work. Open a case study for the thinking behind each build.</p>
      <ProjectGrid />
    </section>
  )
}
