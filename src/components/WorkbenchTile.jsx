import { Link } from 'react-router-dom'

export default function WorkbenchTile({ item, project, selected, onSelect, onMove, onResize, onRotate, nodeRef }) {
  const tileStyle = {
    height: `${item.height}px`,
    left: `${item.x}px`,
    top: `${item.y}px`,
    transform: `rotate(${item.rotation}deg)`,
    width: `${item.width}px`,
  }

  const move = (direction) => onMove(item.id, direction, false)

  return (
    <article
      aria-label={`${project.title} workbench tile`}
      className={`workbench-tile${selected ? ' is-selected' : ''}`}
      ref={nodeRef}
      style={tileStyle}
    >
      <button
        aria-pressed={selected}
        className="workbench-tile__select"
        onClick={() => onSelect(item.id)}
        type="button"
      >
        Select {project.title} tile
      </button>
      <p className="workbench-tile__index">{project.year} / {project.eyebrow}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <Link to={`/projects/${project.slug}`}>Open project</Link>
      {selected && (
        <div aria-label={`${project.title} tile controls`} className="workbench-tile__controls" role="group">
          <button aria-label={`Move ${project.title} left`} onClick={() => move('left')} type="button">←</button>
          <button aria-label={`Move ${project.title} right`} onClick={() => move('right')} type="button">→</button>
          <button aria-label={`Move ${project.title} up`} onClick={() => move('up')} type="button">↑</button>
          <button aria-label={`Move ${project.title} down`} onClick={() => move('down')} type="button">↓</button>
          <button aria-label={`Resize ${project.title} larger`} onClick={() => onResize(item.id, 24)} type="button">+</button>
          <button aria-label={`Resize ${project.title} smaller`} onClick={() => onResize(item.id, -24)} type="button">−</button>
          <button aria-label={`Rotate ${project.title} left`} onClick={() => onRotate(item.id, -5)} type="button">↺</button>
          <button aria-label={`Rotate ${project.title} right`} onClick={() => onRotate(item.id, 5)} type="button">↻</button>
        </div>
      )}
    </article>
  )
}
