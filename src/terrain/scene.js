// 3D relief drawn like a topographic model: black contour lines on a
// white block. Loaded on demand by TerrainFigure, never during SSR.

import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js"
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js"

import { contourLevels, contourSegments } from "./contours"

const RELIEF = 0.62 // height of the whole range, in scene units (block is 2 wide)
const BASE = -0.08 // bottom of the block

export const createTerrainScene = ({
  container,
  terrain,
  reducedMotion = false,
  label,
}) => {
  const { cols, rows, min, max, step, heights } = terrain
  const depth = (2 * (rows - 1)) / (cols - 1)
  const toX = gx => (gx / (cols - 1) - 0.5) * 2
  const toZ = gy => (gy / (rows - 1) - 0.5) * depth
  const toY = h => ((h - min) / (max - min)) * RELIEF
  const heightAt = (gx, gy) => heights[gy * cols + gx]

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.domElement.className = "terrain-canvas"
  container.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new PerspectiveCamera(28, 1, 0.1, 50)
  const disposables = []

  // --- White surface and walls: they only hide lines behind the hills

  const paper = new MeshBasicMaterial({
    color: 0xffffff,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })
  disposables.push(paper)

  const surface = new BufferGeometry()
  const positions = []
  const index = []
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      positions.push(toX(gx), toY(heightAt(gx, gy)), toZ(gy))
    }
  }
  for (let gy = 0; gy < rows - 1; gy++) {
    for (let gx = 0; gx < cols - 1; gx++) {
      const a = gy * cols + gx
      const b = a + 1
      const c = a + cols
      const d = c + 1
      index.push(a, c, b, b, c, d)
    }
  }
  surface.setAttribute("position", new Float32BufferAttribute(positions, 3))
  surface.setIndex(index)
  scene.add(new Mesh(surface, paper))
  disposables.push(surface)

  // The four sides of the block follow the terrain profile along each edge
  const edges = [
    Array.from({ length: cols }, (_, gx) => [gx, 0]),
    Array.from({ length: rows }, (_, gy) => [cols - 1, gy]),
    Array.from({ length: cols }, (_, gx) => [cols - 1 - gx, rows - 1]),
    Array.from({ length: rows }, (_, gy) => [0, rows - 1 - gy]),
  ]
  const wallPositions = []
  const outline = []
  edges.forEach(edge => {
    for (let i = 0; i < edge.length - 1; i++) {
      const [ax, ay] = edge[i]
      const [bx, by] = edge[i + 1]
      const top1 = [toX(ax), toY(heightAt(ax, ay)), toZ(ay)]
      const top2 = [toX(bx), toY(heightAt(bx, by)), toZ(by)]
      const bottom1 = [toX(ax), BASE, toZ(ay)]
      const bottom2 = [toX(bx), BASE, toZ(by)]
      wallPositions.push(
        ...top1,
        ...bottom1,
        ...top2,
        ...top2,
        ...bottom1,
        ...bottom2
      )
      outline.push(...top1, ...top2, ...bottom1, ...bottom2)
    }
    const [cx, cy] = edge[0]
    outline.push(
      toX(cx),
      BASE,
      toZ(cy),
      toX(cx),
      toY(heightAt(cx, cy)),
      toZ(cy)
    )
  })
  const walls = new BufferGeometry()
  walls.setAttribute("position", new Float32BufferAttribute(wallPositions, 3))
  scene.add(new Mesh(walls, paper))
  disposables.push(walls)

  // --- Black lines: contours, thicker every fifth one, and the block edges

  const thin = []
  const thick = []
  contourLevels(min, max, step).forEach(level => {
    const segments = contourSegments(heights, cols, rows, level)
    const target = level % (step * 5) === 0 ? thick : thin
    const y = toY(level)
    for (let i = 0; i < segments.length; i += 4) {
      target.push(
        toX(segments[i]),
        y,
        toZ(segments[i + 1]),
        toX(segments[i + 2]),
        y,
        toZ(segments[i + 3])
      )
    }
  })

  const lineMaterials = []
  const addLines = (points, width) => {
    if (!points.length) return
    const geometry = new LineSegmentsGeometry()
    geometry.setPositions(points)
    const material = new LineMaterial({ color: 0x000000, linewidth: width })
    lineMaterials.push(material)
    disposables.push(geometry, material)
    scene.add(new LineSegments2(geometry, material))
  }
  addLines(thin, 0.8)
  addLines(thick, 1.6)
  addLines(outline, 1.2)

  // --- Optional marker for the place at the centre of the map

  let marker = null
  if (label) {
    const gx = Math.round((cols - 1) / 2)
    const gy = Math.round((rows - 1) / 2)
    const ground = new Vector3(toX(gx), toY(heightAt(gx, gy)), toZ(gy))
    const top = ground.clone().add(new Vector3(0, 0.28, 0))
    addLines([...ground.toArray(), ...top.toArray()], 1.4)
    const element = document.createElement("span")
    element.className = "terrain-marker"
    element.textContent = label
    container.appendChild(element)
    marker = { top, element, projected: new Vector3() }
  }

  // --- Camera: slow turn, follows the pointer, rises as the page scrolls

  const state = {
    azimuth: 0.7,
    pointerX: 0,
    pointerY: 0,
    tiltX: 0,
    tiltY: 0,
    dragging: false,
    dragX: 0,
    width: 0,
    height: 0,
  }

  const scrollProgress = () => {
    const rect = container.getBoundingClientRect()
    const viewport = window.innerHeight || 1
    return MathUtils.clamp(
      (viewport - rect.top) / (viewport + rect.height),
      0,
      1
    )
  }

  const update = dt => {
    if (!reducedMotion && !state.dragging) state.azimuth += dt * 0.06
    const ease = reducedMotion ? 1 : Math.min(1, dt * 3)
    state.tiltX += (state.pointerX - state.tiltX) * ease
    state.tiltY += (state.pointerY - state.tiltY) * ease

    const progress = scrollProgress()
    const polar = MathUtils.lerp(1.12, 0.74, progress) + state.tiltY * 0.1
    const radius = MathUtils.lerp(5.6, 4.6, progress)
    const azimuth = state.azimuth + state.tiltX * 0.25
    camera.position.set(
      radius * Math.sin(polar) * Math.sin(azimuth),
      radius * Math.cos(polar),
      radius * Math.sin(polar) * Math.cos(azimuth)
    )
    camera.lookAt(0, RELIEF * 0.15, 0)
  }

  const placeMarker = () => {
    if (!marker) return
    marker.projected.copy(marker.top).project(camera)
    const x = (marker.projected.x * 0.5 + 0.5) * state.width
    const y = (-marker.projected.y * 0.5 + 0.5) * state.height
    marker.element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -130%)`
  }

  const render = dt => {
    update(dt)
    renderer.render(scene, camera)
    placeMarker()
  }

  const resize = () => {
    state.width = container.clientWidth
    state.height = container.clientHeight
    if (!state.width || !state.height) return
    renderer.setSize(state.width, state.height)
    camera.aspect = state.width / state.height
    camera.updateProjectionMatrix()
    lineMaterials.forEach(material =>
      material.resolution.set(state.width, state.height)
    )
    render(0)
  }

  // --- Loop: runs only while the figure is on screen and the tab is open

  let frame = 0
  let running = false
  let visible = false
  let last = 0

  const tick = time => {
    const dt = Math.min(0.05, (time - last) / 1000)
    last = time
    render(dt)
    if (running) frame = requestAnimationFrame(tick)
  }
  const start = () => {
    if (running || reducedMotion || !visible || document.hidden) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  const visibility = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting)
    if (visible) start()
    else stop()
  })
  visibility.observe(container)

  const onVisibilityChange = () => (document.hidden ? stop() : start())
  // With reduced motion there is no loop: redraw on scroll and drag only
  const onScroll = () => reducedMotion && visible && render(0)
  const onPointerMove = event => {
    const rect = container.getBoundingClientRect()
    if (state.dragging) {
      state.azimuth -= (event.clientX - state.dragX) * 0.008
      state.dragX = event.clientX
    } else if (event.pointerType === "mouse") {
      state.pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      state.pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    if (reducedMotion) render(0)
  }
  const onPointerDown = event => {
    state.dragging = true
    state.dragX = event.clientX
    container.setPointerCapture?.(event.pointerId)
    container.classList.add("is-dragging")
  }
  const onPointerUp = () => {
    state.dragging = false
    container.classList.remove("is-dragging")
  }
  const onPointerLeave = () => {
    state.pointerX = 0
    state.pointerY = 0
  }

  document.addEventListener("visibilitychange", onVisibilityChange)
  window.addEventListener("scroll", onScroll, { passive: true })
  container.addEventListener("pointermove", onPointerMove)
  container.addEventListener("pointerdown", onPointerDown)
  container.addEventListener("pointerup", onPointerUp)
  container.addEventListener("pointercancel", onPointerUp)
  container.addEventListener("pointerleave", onPointerLeave)

  const resizeObserver =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize)
  resizeObserver?.observe(container)
  resize()
  container.classList.add("is-ready")

  return {
    dispose() {
      stop()
      visibility.disconnect()
      resizeObserver?.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("scroll", onScroll)
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerdown", onPointerDown)
      container.removeEventListener("pointerup", onPointerUp)
      container.removeEventListener("pointercancel", onPointerUp)
      container.removeEventListener("pointerleave", onPointerLeave)
      disposables.forEach(item => item.dispose())
      renderer.dispose()
      renderer.domElement.remove()
      marker?.element.remove()
      container.classList.remove("is-ready", "is-dragging")
    },
  }
}
