import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createSeedWorkbench,
  readWorkbench,
  writeWorkbench,
} from '../data/workbench.js'

const MAX_WORKBENCH_WIDTH = 1200
const MAX_WORKBENCH_HEIGHT = 680

const createMemoryStorage = () => {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  }
}

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export function useWorkbenchState({ storage } = {}) {
  const resolvedStorage = storage || (typeof window === 'undefined' ? createMemoryStorage() : window.localStorage)
  const [items, setItems] = useState(() => readWorkbench(resolvedStorage))
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('')
  const objectUrls = useRef(new Map())

  useEffect(() => {
    writeWorkbench(resolvedStorage, items)
  }, [items, resolvedStorage])

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    objectUrls.current.clear()
  }, [])

  const selectItem = useCallback((id) => setSelectedId(id), [])

  const updateItem = useCallback((id, changes) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
  }, [])

  const moveItem = useCallback((id, direction, largerStep = false) => {
    const step = largerStep ? 32 : 8
    const delta = {
      down: [0, step],
      left: [-step, 0],
      right: [step, 0],
      up: [0, -step],
    }[direction]
    if (!delta) return
    setItems((current) => current.map((item) => item.id === id ? {
      ...item,
      x: clamp(item.x + delta[0], 0, MAX_WORKBENCH_WIDTH - item.width),
      y: clamp(item.y + delta[1], 0, MAX_WORKBENCH_HEIGHT - item.height),
    } : item))
  }, [])

  const resizeItem = useCallback((id, delta) => {
    setItems((current) => current.map((item) => item.id === id ? {
      ...item,
      height: clamp(item.height + delta, 160, 720),
      width: clamp(item.width + delta, 200, 720),
    } : item))
  }, [])

  const rotateItem = useCallback((id, delta) => {
    setItems((current) => current.map((item) => item.id === id
      ? { ...item, rotation: item.rotation + delta }
      : item))
  }, [])

  const addImage = useCallback((file) => {
    if (!file?.type?.startsWith('image/')) {
      setStatus('Choose an image file.')
      return
    }
    const src = URL.createObjectURL(file)
    const id = `image-${Date.now()}-${file.name}`
    objectUrls.current.set(id, src)
    setItems((current) => [...current, {
      id,
      type: 'image',
      src,
      alt: file.name,
      x: 120,
      y: 96,
      width: 320,
      height: 240,
      rotation: 0,
    }])
    setStatus(`${file.name} added.`)
  }, [])

  const updateAlt = useCallback((id, alt) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, alt } : item))
  }, [])

  const removeItem = useCallback((id) => {
    const url = objectUrls.current.get(id)
    if (url) {
      URL.revokeObjectURL(url)
      objectUrls.current.delete(id)
    }
    setItems((current) => current.filter((item) => item.id !== id))
    setSelectedId((current) => current === id ? null : current)
  }, [])

  return {
    addImage,
    createSeedWorkbench,
    items,
    moveItem,
    removeItem,
    resizeItem,
    rotateItem,
    selectItem,
    selectedId,
    status,
    updateItem,
    updateAlt,
  }
}
