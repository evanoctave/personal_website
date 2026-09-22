import ProjectGrid from '../components/ProjectGrid.jsx'

export default function ProjectsPage() {
  return (
    <section className="projects-page page-frame">
      <p className="eyebrow">Selected transmissions</p>
      <h1>Project worlds</h1>
      <p className="page-intro">Template projects live in one data file. Filter them here, then open each reusable case-study route.</p>
      <ProjectGrid />
    </section>
  )
}
