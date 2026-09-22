import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function WorkbenchTile({ item, project, selected, onSelect, onMove, onResize, onRotate, onRemove, onUpdateAlt, nodeRef }) {
  const [imageBroken, setImageBroken] = useState(false)
  const tileStyle = {
    height: `${item.height}px`,
    left: `${item.x}px`,
    top: `${item.y}px`,
    transform: `rotate(${item.rotation}deg)`,
    width: `${item.width}px`,
  }

  const move = (direction, keyboard = false) => onMove(item.id, direction, keyboard)

  const handleKeyDown = (event) => {
    const directionByKey = { ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' }
    const direction = directionByKey[event.key]
    if (!direction) return
    event.preventDefault()
    if (event.shiftKey) {
      onResize(item.id, ['right', 'down'].includes(direction) ? 24 : -24)
      return
    }
    if (event.altKey) {
      onRotate(item.id, ['right', 'down'].includes(direction) ? 5 : -5)
      return
    }
    move(direction, true)
  }

  return (
    <article
      aria-label={`${project.title} workbench tile`}
      className={`workbench-tile${selected ? ' is-selected' : ''}`}
      onKeyDown={handleKeyDown}
      ref={nodeRef}
      style={tileStyle}
      tabIndex="0"
    >
      <button
        aria-pressed={selected}
        className="workbench-tile__select"
        onClick={() => onSelect(item.id)}
        type="button"
      >
        Select {project.title} tile
      </button>
      {item.type === 'image' ? (
        <>
          <p className="workbench-tile__index">{project.year} / {project.eyebrow}</p>
          {imageBroken ? (
            <div className="workbench-tile__image-fallback" role="img" aria-label={`${project.title} unavailable`}>Image unavailable</div>
          ) : (
            <img alt={project.title} className="workbench-tile__image" onError={() => setImageBroken(true)} src={item.src} />
          )}
          <label className="workbench-tile__alt-label">
            Image description
            <input aria-label={`Edit description for ${project.title}`} onChange={(event) => onUpdateAlt(item.id, event.target.value)} value={item.alt} />
          </label>
          <button className="workbench-tile__remove" onClick={() => onRemove(item.id)} type="button">Remove image</button>
        </>
      ) : (
        <>
          <p className="workbench-tile__index">{project.year} / {project.eyebrow}</p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <Link to={`/projects/${project.slug}`}>Open project</Link>
        </>
      )}
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
