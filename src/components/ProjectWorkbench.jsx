import { useCallback, useMemo, useRef, useState } from 'react'
import Moveable from 'react-moveable'
import { getProjectBySlug, projects } from '../data/projects.js'
import { createSeedWorkbench } from '../data/workbench.js'
import WorkbenchTile from './WorkbenchTile.jsx'

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export default function ProjectWorkbench() {
  const workbenchRef = useRef(null)
  const [items, setItems] = useState(createSeedWorkbench)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [workbenchSize] = useState({ width: 1200, height: 680 })

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [])
  const updateItem = useCallback((id, updater) => {
    setItems((current) => current.map((item) => item.id === id ? updater(item) : item))
  }, [])

  const selectItem = useCallback((id) => setSelectedId(id), [])
  const moveItem = useCallback((id, direction, largerStep = false) => {
    const step = largerStep ? 32 : 8
    const delta = {
      down: [0, step],
      left: [-step, 0],
      right: [step, 0],
      up: [0, -step],
    }[direction]
    if (!delta) return
    updateItem(id, (item) => ({
      ...item,
      x: clamp(item.x + delta[0], 0, workbenchSize.width - item.width),
      y: clamp(item.y + delta[1], 0, workbenchSize.height - item.height),
    }))
  }, [updateItem, workbenchSize])

  const resizeItem = useCallback((id, delta) => {
    updateItem(id, (item) => ({
      ...item,
      height: clamp(item.height + delta, 160, 720),
      width: clamp(item.width + delta, 200, 720),
    }))
  }, [updateItem])

  const rotateItem = useCallback((id, delta) => {
    updateItem(id, (item) => ({ ...item, rotation: item.rotation + delta }))
  }, [updateItem])

  const updatePosition = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    updateItem(selectedId, (item) => ({
      ...item,
      x: clamp(item.x + (lastEvent.lastEvent?.dist?.[0] || 0), 0, workbenchSize.width - item.width),
      y: clamp(item.y + (lastEvent.lastEvent?.dist?.[1] || 0), 0, workbenchSize.height - item.height),
    }))
  }, [selectedId, updateItem, workbenchSize])

  const updateSize = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    updateItem(selectedId, (item) => ({
      ...item,
      width: clamp(lastEvent.lastEvent?.width || item.width, 200, workbenchSize.width),
      height: clamp(lastEvent.lastEvent?.height || item.height, 160, workbenchSize.height),
    }))
  }, [selectedId, updateItem, workbenchSize])

  const updateRotation = useCallback((lastEvent) => {
    if (!lastEvent || !selectedId) return
    updateItem(selectedId, (item) => ({ ...item, rotation: lastEvent.lastEvent?.rotation || item.rotation }))
  }, [selectedId, updateItem])

  const setSelectedTileRef = useCallback((node) => setSelectedNode(node), [])
  const selectedProject = selectedId
    ? projectMap.get(items.find((item) => item.id === selectedId)?.projectSlug)
    : undefined

  return (
    <section aria-label="Project workbench" className="project-workbench" ref={workbenchRef}>
      <div className="project-workbench__header">
        <p className="eyebrow">Work in progress</p>
        <p>Select a tile to move, resize, or rotate it.</p>
      </div>
      <div className="project-workbench__canvas">
        {items.map((item) => {
          const project = projectMap.get(item.projectSlug) || getProjectBySlug(item.projectSlug)
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
