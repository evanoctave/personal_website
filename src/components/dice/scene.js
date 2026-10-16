// scene.js: the 3D half of the dice gate. two real dice (three.js for the picture, cannon-es for the
// physics) thrown across a small invisible tray; roll() resolves with what they landed on.
// DiceTable.jsx loads this file lazily so three.js only downloads on /home, and only with WebGL.
import * as CANNON from 'cannon-es'
import {
  AmbientLight, BoxGeometry, CanvasTexture, DirectionalLight, Mesh, MeshStandardMaterial, OrthographicCamera,
  PCFShadowMap, PlaneGeometry, Scene, ShadowMaterial, SRGBColorSpace, WebGLRenderer,
} from 'three'
import { upFace } from './odds.js'

// KNOB: tray size in die-widths (x = left/right, z = toward/away from you) and the camera tilt in degrees.
// 0° tilt is straight down; more tilt shows more of the dice's sides
const TRAY = { w: 8, d: 4, tilt: 28 }
// KNOB: gravity (bigger = snappier, less floaty), how bouncy and grippy the dice are
const GRAVITY = -40
const BOUNCE = 0.35
const GRIP = 0.3
// KNOB: how hard a throw is: forward speed, upward speed, sideways spread, spin
const THROW = { forward: [9, 14], up: [0, 3], side: 4, spin: 18 }
// give up waiting for a die to settle after this long (ms) and read it as it lies
const PATIENCE = 8000
const rand = (a, b) => a + Math.random() * (b - a)
const cssColor = (name, fallback) =>
  (typeof getComputedStyle === 'function' && getComputedStyle(document.documentElement).getPropertyValue(name).trim()) || fallback

// one face of a die as a canvas: site foreground for the face, background for the pips
function pipTexture(value) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = cssColor('--fg', '#e8e6e1')
  g.fillRect(0, 0, 128, 128)
  g.fillStyle = cssColor('--bg', '#0d0d0d')
  const L = 34, M = 64, R = 94
  const pips = {
    1: [[M, M]], 2: [[L, L], [R, R]], 3: [[L, L], [M, M], [R, R]], 4: [[L, L], [R, L], [L, R], [R, R]],
    5: [[L, L], [R, L], [M, M], [L, R], [R, R]], 6: [[L, L], [R, L], [L, M], [R, M], [L, R], [R, R]],
  }
  // KNOB: pip radius
  for (const [x, y] of pips[value]) { g.beginPath(); g.arc(x, y, 11, 0, Math.PI * 2); g.fill() }
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

// face order must match FACES in odds.js (three's BoxGeometry order: +x, -x, +y, -y, +z, -z)
const FACE_VALUES = [2, 5, 1, 6, 3, 4]
const NORMALS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((n) => new CANNON.Vec3(...n))

// a static, infinite, invisible wall: cannon planes face +z until rotated
const wall = (world, material, position, euler) => {
  const body = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material })
  body.position.set(...position)
  body.quaternion.setFromEuler(...euler)
  world.addBody(body)
}

export function createDiceScene(container) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  const tilt = (TRAY.tilt * Math.PI) / 180
  camera.position.set(0, 30 * Math.cos(tilt), 30 * Math.sin(tilt))
  camera.lookAt(0, 0, 0)

  scene.add(new AmbientLight(0xffffff, 1.4))
  const sun = new DirectionalLight(0xffffff, 2.2)
  sun.position.set(-4, 10, 3)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -TRAY.w, right: TRAY.w, top: TRAY.d * 2, bottom: -TRAY.d * 2 })
  scene.add(sun)

  // the tray floor only shows the dice's shadows; the page background shows through
  const floor = new Mesh(new PlaneGeometry(TRAY.w * 2, TRAY.d * 2), new ShadowMaterial({ opacity: 0.4 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, GRAVITY, 0) })
  world.allowSleep = true
  const dieMat = new CANNON.Material('die')
  const trayMat = new CANNON.Material('tray')
  world.addContactMaterial(new CANNON.ContactMaterial(dieMat, trayMat, { friction: GRIP, restitution: BOUNCE }))
  world.addContactMaterial(new CANNON.ContactMaterial(dieMat, dieMat, { friction: GRIP, restitution: BOUNCE }))
  const hw = TRAY.w / 2, hd = TRAY.d / 2
  wall(world, trayMat, [0, 0, 0], [-Math.PI / 2, 0, 0])      // floor
  wall(world, trayMat, [0, 5, 0], [Math.PI / 2, 0, 0])       // lid, so a wild throw can't leave the picture
  wall(world, trayMat, [hw, 0, 0], [0, -Math.PI / 2, 0])     // right
  wall(world, trayMat, [-hw, 0, 0], [0, Math.PI / 2, 0])     // left
  wall(world, trayMat, [0, 0, hd], [0, Math.PI, 0])          // near
  wall(world, trayMat, [0, 0, -hd], [0, 0, 0])               // far

  const geometry = new BoxGeometry(1, 1, 1)
  const dice = [0, 1].map((i) => {
    const materials = FACE_VALUES.map((v) => new MeshStandardMaterial({ map: pipTexture(v), roughness: 0.45, metalness: 0.05 }))
    const mesh = new Mesh(geometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    const body = new CANNON.Body({
      mass: 1, shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), material: dieMat,
      linearDamping: 0.08, angularDamping: 0.08, sleepSpeedLimit: 0.25, sleepTimeLimit: 0.3,
    })
    // resting pose to start with: side by side, a random face up, a random twist
    body.position.set(i ? 1 : -1, 0.5, 0.2 * (i ? 1 : -1))
    const face = [[0, 0, 0], [Math.PI / 2, 0, 0], [0, 0, Math.PI / 2], [Math.PI, 0, 0], [-Math.PI / 2, 0, 0], [0, 0, -Math.PI / 2]][Math.floor(Math.random() * 6)]
    body.quaternion.setFromEuler(...face)
    const twist = new CANNON.Quaternion().setFromEuler(0, rand(0, Math.PI * 2), 0)
    body.quaternion = twist.mult(body.quaternion)
    body.sleep()
    world.addBody(body)
    return { mesh, body }
  })

  const sync = () => {
    for (const { mesh, body } of dice) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
    }
  }
  const render = () => { sync(); renderer.render(scene, camera) }

  // fit the whole tray in view at whatever size the box is right now
  const resize = () => {
    const w = container.clientWidth || 1, h = container.clientHeight || 1
    const aspect = w / h
    // the tray's depth foreshortens with the tilt; the +1 leaves room for a die standing at the near edge
    const viewH = Math.max(TRAY.w / aspect, TRAY.d * Math.cos(tilt) + 1)
    const viewW = viewH * aspect
    Object.assign(camera, { left: -viewW / 2, right: viewW / 2, top: viewH / 2, bottom: -viewH / 2 })
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
    render()
  }
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null
  ro?.observe(container)
  resize()

  // the light/dark switch flips --fg/--bg; redraw the faces so the dice flip with it
  const retheme = () => {
    for (const { mesh } of dice) mesh.material.forEach((m, i) => { m.map.dispose(); m.map = pipTexture(FACE_VALUES[i]); m.needsUpdate = true })
    render()
  }
  const mo = typeof MutationObserver === 'function' ? new MutationObserver(retheme) : null
  mo?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-fx-inverted'] })

  let frame = 0
  let disposed = false

  const read = (body) => upFace(NORMALS.map((n) => body.quaternion.vmult(n).y))
  const throwDie = (body, i) => {
    body.wakeUp()
    body.position.set(-hw + 1 + i * 1.4, 2 + i * 0.8, rand(-1, 1))
    body.quaternion.setFromEuler(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2))
    body.velocity.set(rand(...THROW.forward), rand(...THROW.up), rand(-THROW.side, THROW.side))
    body.angularVelocity.set(rand(-THROW.spin, THROW.spin), rand(-THROW.spin, THROW.spin), rand(-THROW.spin, THROW.spin))
  }
  const nudge = (body) => {
    body.wakeUp()
    body.applyImpulse(new CANNON.Vec3(rand(-1.5, 1.5), 4, rand(-1.5, 1.5)))
    body.angularVelocity.set(rand(-6, 6), rand(-6, 6), rand(-6, 6))
  }

  // throw both dice; resolves [a, b] once they've stopped moving flat on the floor
  const roll = () => new Promise((resolve) => {
    cancelAnimationFrame(frame)
    dice.forEach(({ body }, i) => throwDie(body, i))
    const started = performance.now()
    let nudges = 0
    const tick = () => {
      if (disposed) return
      world.fixedStep()
      render()
      const asleep = dice.every(({ body }) => body.sleepState === CANNON.Body.SLEEPING)
      const late = performance.now() - started > PATIENCE
      if (asleep || late) {
        const faces = dice.map(({ body }) => read(body))
        // a die leaning on the other one (or the wall) gets flicked; after a few tries we take what we see
        if (!late && nudges < 4 && faces.some((f) => !f.flat)) {
          nudges += 1
          dice.forEach(({ body }, i) => { if (!faces[i].flat) nudge(body) })
        } else {
          resolve(faces.map((f) => f.value))
          return
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  const dispose = () => {
    disposed = true
    cancelAnimationFrame(frame)
    ro?.disconnect()
    mo?.disconnect()
    for (const { mesh } of dice) mesh.material.forEach((m) => { m.map.dispose(); m.dispose() })
    geometry.dispose()
    floor.geometry.dispose()
    floor.material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { roll, dispose, resize }
}
