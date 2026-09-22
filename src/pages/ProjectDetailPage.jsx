import { useParams } from 'react-router-dom'
import ProjectDetail from '../components/ProjectDetail.jsx'
import { getAdjacentProjects, getProjectBySlug } from '../data/projects.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <NotFoundPage />

  const { previous, next } = getAdjacentProjects(slug)
  return <ProjectDetail project={project} previous={previous} next={next} />
}
