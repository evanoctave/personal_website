import { useCallback, useMemo, useRef, useState } from 'react'
import Moveable from 'react-moveable'
import { projects } from '../data/projects.js'
import { useWorkbenchState } from '../hooks/useWorkbenchState.js'
import WorkbenchTile from './WorkbenchTile.jsx'

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export default function ProjectWorkbench() {
  const workbenchRef = useRef(null)
  const fileInputRef = useRef(null)
  const {
    addImage,
    items,
    moveItem,
    removeItem,
    resizeItem,
    rotateItem,
    selectItem,
    selectedId,
    status,
    updateAlt,
    updateItem,
  } = useWorkbenchState()
  const [selectedNode, setSelectedNode] = useState(null)
  const [workbenchSize] = useState({ width: 1200, height: 680 })

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [])
  const updatePosition = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    const item = items.find((candidate) => candidate.id === selectedId)
    if (!item) return
    updateItem(selectedId, {
      x: clamp(item.x + (lastEvent.lastEvent?.dist?.[0] || 0), 0, workbenchSize.width - item.width),
      y: clamp(item.y + (lastEvent.lastEvent?.dist?.[1] || 0), 0, workbenchSize.height - item.height),
    })
  }, [items, selectedId, updateItem, workbenchSize])

  const updateSize = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    const item = items.find((candidate) => candidate.id === selectedId)
    if (!item) return
    updateItem(selectedId, {
      width: clamp(lastEvent.lastEvent?.width || item.width, 200, workbenchSize.width),
      height: clamp(lastEvent.lastEvent?.height || item.height, 160, workbenchSize.height),
    })
  }, [items, selectedId, updateItem, workbenchSize])

  const updateRotation = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    const item = items.find((candidate) => candidate.id === selectedId)
    if (!item) return
    updateItem(selectedId, { rotation: lastEvent.lastEvent?.rotation || item.rotation })
  }, [items, selectedId, updateItem])

  const setSelectedTileRef = useCallback((node) => setSelectedNode(node), [])
  const selectedProject = selectedId ? items.find((item) => item.id === selectedId) : undefined

  const handleDrop = (event) => {
    event.preventDefault()
    addImage(event.dataTransfer.files?.[0])
  }

  const handleFileChange = (event) => {
    addImage(event.target.files?.[0])
    event.target.value = ''
  }

  const handleDropzoneKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <section aria-label="Project workbench" className="project-workbench" ref={workbenchRef}>
      <div className="project-workbench__header">
        <p className="eyebrow">Work in progress</p>
        <p>Select a tile to move, resize, or rotate it.</p>
      </div>
      <div
        className="project-workbench__dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onKeyDown={handleDropzoneKeyDown}
        role="button"
        tabIndex="0"
      >
        Drop photo or <span>browse files</span>
        <input accept="image/*" aria-label="Add a workbench image" hidden onChange={handleFileChange} ref={fileInputRef} type="file" />
      </div>
      <p aria-live="polite" className="project-workbench__status" role="status">{status}</p>
      <div className="project-workbench__canvas">
        <div aria-hidden="true" className="workbench-backdrop">
          <img alt="" src="/assets/server-room-terrarium-v1.png" />
        </div>
        {items.map((item) => {
          const project = item.type === 'image'
            ? { eyebrow: 'Local image', slug: item.id, summary: item.alt || 'Untitled image', title: item.alt || 'Untitled image', year: 'Local' }
            : projectMap.get(item.projectSlug)
          if (!project) return null
          return (
            <WorkbenchTile
              item={item}
              key={item.id}
              nodeRef={selectedId === item.id ? setSelectedTileRef : undefined}
              onMove={moveItem}
              onResize={resizeItem}
              onRotate={rotateItem}
              onSelect={selectItem}
              onRemove={removeItem}
              onUpdateAlt={updateAlt}
              project={project}
              selected={selectedId === item.id}
            />
          )
        })}
        {selectedNode && selectedProject && (
          <Moveable
            bounds={{ bottom: workbenchSize.height, left: 0, position: 'css', right: workbenchSize.width, top: 0 }}
            container={workbenchRef.current}
            draggable
            keepRatio
            onDragEnd={updatePosition}
            onResizeEnd={updateSize}
            onRotateEnd={updateRotation}
            resizable
            rotatable
            scalable
            target={selectedNode}
          />
        )}
      </div>
    </section>
  )
}
