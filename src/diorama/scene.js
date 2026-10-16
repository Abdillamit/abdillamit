// 3D diorama of Baul for the home page: the village between two rivers,
// poplars, apricot trees in bloom, aigul flowers, sheep on the pasture,
// the Turkestan Range behind, and a boy with a laptop on the hill.
// Loaded on demand by HeroDiorama, never during SSR.

import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

import {
  ISLAND_RADIUS as R,
  fbm,
  isBetweenRivers,
  makeRandom,
  riverA,
  riverB,
  smoothstep,
  terrainHeight,
} from "./terrain"

const color = hex => new Color(hex)
const flat = (hex, extra = {}) =>
  new MeshStandardMaterial({
    color: hex,
    flatShading: true,
    roughness: 0.9,
    ...extra,
  })

// Merges many small static meshes into one mesh per material: a few draw
// calls instead of hundreds, which keeps phones smooth.
const createBatch = () => {
  const parts = new Map()
  return {
    add(geometry, material, matrix) {
      const piece = geometry.index ? geometry.toNonIndexed() : geometry.clone()
      piece.deleteAttribute("uv")
      piece.applyMatrix4(matrix)
      if (!parts.has(material)) parts.set(material, [])
      parts.get(material).push(piece)
      geometry.dispose()
    },
    meshes() {
      return [...parts.entries()].map(([material, pieces]) => {
        const merged = mergeGeometries(pieces)
        pieces.forEach(piece => piece.dispose())
        merged.computeVertexNormals()
        const mesh = new Mesh(merged, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        return mesh
      })
    },
  }
}

const place = (x, y, z, { rotateY = 0, scale = 1, rotation } = {}) => {
  const object = new Object3D()
  object.position.set(x, y, z)
  if (rotation) object.rotation.set(...rotation)
  else object.rotation.y = rotateY
  object.scale.setScalar(scale)
  object.updateMatrix()
  return object.matrix
}

const buildIsland = random => {
  const island = new Group()
  const batch = createBatch()
  const ground = terrainHeight

  // --- top surface on a polar grid, coloured by height and place
  const rings = 48
  const segments = 128
  const positions = []
  const colors = []
  const index = []
  const meadow = color("#8cc85a")
  const meadowLight = color("#a6d46a")
  const ochre = color("#dcaa5e")
  const dry = color("#c99a5b")
  const high = color("#b08e6e")
  const sand = color("#d8c49a")
  const tint = new Color()
  const vertex = (x, z) => {
    const y = ground(x, z)
    positions.push(x, y, z)
    if (y < 0) tint.copy(sand)
    else if (isBetweenRivers(x, z)) {
      tint.copy(meadow).lerp(meadowLight, fbm(x * 0.8, z * 0.8))
    } else {
      tint
        .copy(meadow)
        .lerp(ochre, smoothstep(0.6, 2.0, y))
        .lerp(dry, fbm(x * 0.6 + 4, z * 0.6) * 0.5)
    }
    if (y > 2.6) tint.lerp(high, smoothstep(2.6, 4, y))
    colors.push(tint.r, tint.g, tint.b)
  }
  vertex(0, 0)
  for (let ring = 1; ring <= rings; ring++) {
    for (let j = 0; j < segments; j++) {
      const radius = (R * ring) / rings
      const angle = (j / segments) * Math.PI * 2
      vertex(radius * Math.cos(angle), radius * Math.sin(angle))
    }
  }
  for (let j = 0; j < segments; j++)
    index.push(0, 1 + ((j + 1) % segments), 1 + j)
  for (let ring = 1; ring < rings; ring++) {
    for (let j = 0; j < segments; j++) {
      const a = 1 + (ring - 1) * segments + j
      const b = 1 + (ring - 1) * segments + ((j + 1) % segments)
      const c = 1 + ring * segments + j
      const d = 1 + ring * segments + ((j + 1) % segments)
      index.push(a, b, c, b, d, c)
    }
  }
  const top = new BufferGeometry()
  top.setAttribute("position", new Float32BufferAttribute(positions, 3))
  top.setAttribute("color", new Float32BufferAttribute(colors, 3))
  top.setIndex(index)
  top.computeVertexNormals()
  const surface = new Mesh(
    top,
    new MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 1,
    })
  )
  surface.receiveShadow = true
  island.add(surface)

  // --- soil layers on the sides
  const wallPositions = []
  const wallColors = []
  const layers = ["#7a5233", "#94663f", "#6a4528", "#55361f"].map(color)
  for (let j = 0; j < segments; j++) {
    const a0 = (j / segments) * Math.PI * 2
    const a1 = ((j + 1) / segments) * Math.PI * 2
    const [x0, z0] = [R * Math.cos(a0), R * Math.sin(a0)]
    const [x1, z1] = [R * Math.cos(a1), R * Math.sin(a1)]
    const ys = [
      [ground(x0, z0), ground(x1, z1)],
      [-0.6, -0.6],
      [-1.2, -1.2],
      [-1.8, -1.8],
      [-2.5, -2.5],
    ]
    for (let k = 0; k < 4; k++) {
      const [ya0, ya1] = ys[k]
      const [yb0, yb1] = ys[k + 1]
      wallPositions.push(
        x0,
        ya0,
        z0,
        x0,
        yb0,
        z0,
        x1,
        ya1,
        z1,
        x1,
        ya1,
        z1,
        x0,
        yb0,
        z0,
        x1,
        yb1,
        z1
      )
      for (let n = 0; n < 6; n++)
        wallColors.push(layers[k].r, layers[k].g, layers[k].b)
    }
  }
  const walls = new BufferGeometry()
  walls.setAttribute("position", new Float32BufferAttribute(wallPositions, 3))
  walls.setAttribute("color", new Float32BufferAttribute(wallColors, 3))
  walls.computeVertexNormals()
  island.add(
    new Mesh(
      walls,
      new MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        roughness: 1,
        side: DoubleSide,
      })
    )
  )

  // --- water fills the channels
  const water = new Mesh(
    new CircleGeometry(R - 0.03, 96),
    new MeshStandardMaterial({
      color: "#35c4d6",
      roughness: 0.15,
      metalness: 0.1,
    })
  )
  water.rotation.x = -Math.PI / 2
  water.position.y = -0.14
  island.add(water)

  // --- Turkestan Range: granite spires with snow
  const mountainParts = []
  ;[
    [-6.2, -6.6, 6.0, 2.2],
    [-2.6, -8.2, 9.2, 2.4],
    [0.9, -8.6, 7.4, 2.0],
    [3.9, -7.6, 8.3, 2.2],
    [6.6, -5.9, 5.6, 2.0],
    [-8.2, -4.2, 4.2, 1.7],
  ].forEach(([x, z, h, r]) => {
    const cone = new ConeGeometry(r, h, 9, 6).toNonIndexed()
    cone.deleteAttribute("uv")
    const p = cone.attributes.position
    const jitter = new Map()
    const shades = []
    for (let i = 0; i < p.count; i++) {
      const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p
        .getZ(i)
        .toFixed(3)}`
      const y = p.getY(i) + h / 2
      if (!jitter.has(key)) {
        jitter.set(
          key,
          y < h - 0.01
            ? [
                (random() - 0.5) * 0.45,
                (random() - 0.5) * 0.25,
                (random() - 0.5) * 0.45,
              ]
            : [0, 0, 0]
        )
      }
      const [dx, dy, dz] = jitter.get(key)
      p.setXYZ(i, p.getX(i) + dx, p.getY(i) + dy, p.getZ(i) + dz)
      const shade =
        y / h > 0.56
          ? color("#ffffff")
          : color("#868ca2").lerp(color("#b3b8c8"), y / h)
      shades.push(shade.r, shade.g, shade.b)
    }
    cone.setAttribute("color", new Float32BufferAttribute(shades, 3))
    cone.applyMatrix4(
      place(x, ground(x, z) + h / 2 - 0.6, z, { rotateY: random() * 3 })
    )
    mountainParts.push(cone)
  })
  const mountains = new Mesh(
    mergeGeometries(mountainParts),
    new MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.85,
    })
  )
  mountains.geometry.computeVertexNormals()
  mountains.castShadow = true
  mountains.receiveShadow = true
  island.add(mountains)
  mountainParts.forEach(part => part.dispose())

  // --- trees
  const poplar = flat("#3f8a3e")
  const trunk = flat("#7a5a3c")
  const blossom = [flat("#ffd1dc"), flat("#fff1f4"), flat("#ffb8c9")]
  const inside = (x, z, margin) => x * x + z * z < (R - margin) ** 2

  for (let z = -3.5; z <= 7.5; z += 1.15) {
    ;[riverA(z) + 1.0, riverB(z) - 1.0].forEach(x => {
      if (!inside(x, z, 0.8)) return
      const h = 2.2 + random() * 0.9
      const y = ground(x, z)
      batch.add(
        new ConeGeometry(0.28, h, 6),
        poplar,
        place(x, y + h / 2 + 0.25, z)
      )
      batch.add(
        new CylinderGeometry(0.05, 0.06, 0.4, 5),
        trunk,
        place(x, y + 0.2, z)
      )
    })
  }

  const blossomTops = []
  const apricot = (x, z, size = 1) => {
    const y = ground(x, z)
    batch.add(
      new CylinderGeometry(0.06 * size, 0.09 * size, 0.6 * size, 6),
      trunk,
      place(x, y + 0.3 * size, z)
    )
    for (let k = 0; k < 3; k++) {
      const bx = x + (random() - 0.5) * 0.4 * size
      const by = y + (0.75 + random() * 0.25) * size
      const bz = z + (random() - 0.5) * 0.4 * size
      batch.add(
        new IcosahedronGeometry((0.36 + random() * 0.14) * size, 0),
        blossom[k % 3],
        place(bx, by, bz, { rotation: [random(), random(), random()] })
      )
      blossomTops.push(new Vector3(bx, by, bz))
    }
  }
  for (let x = -1.6; x <= 1.7; x += 0.95) {
    for (let z = 2.4; z <= 5.4; z += 1.0) {
      apricot(x + (random() - 0.5) * 0.3, z + (random() - 0.5) * 0.3)
    }
  }

  // --- houses: mud brick walls, flat roofs
  const wall = flat("#ead6b2")
  const roof = flat("#bf9a6a")
  const door = flat("#6b3f24")
  const glass = flat("#4a90c2")
  ;[
    [-1.3, -1.4, 0.2],
    [0.3, -2.0, -0.15],
    [1.5, -0.6, 0.35],
    [-0.6, 0.3, -0.2],
    [0.9, 0.9, 0.1],
    [-1.7, 1.3, 0.25],
    [2.0, 1.6, -0.3],
  ].forEach(([x, z, turn]) => {
    const house = place(x, ground(x, z), z, { rotateY: turn })
    const part = (geometry, material, px, py, pz) =>
      batch.add(
        geometry,
        material,
        house.clone().multiply(new Matrix4().makeTranslation(px, py, pz))
      )
    part(new BoxGeometry(0.95, 0.55, 0.7), wall, 0, 0.275, 0)
    part(new BoxGeometry(1.08, 0.08, 0.82), roof, 0, 0.59, 0)
    part(new BoxGeometry(0.18, 0.32, 0.02), door, -0.2, 0.16, 0.36)
    part(new BoxGeometry(0.2, 0.14, 0.02), glass, 0.22, 0.3, 0.36)
  })

  // --- a cow on the pasture
  const dark = flat("#2f2a26")
  {
    const cow = place(5.6, ground(5.6, 4.6), 4.6, { rotateY: -0.7 })
    const part = (geometry, material, px, py, pz) =>
      batch.add(
        geometry,
        material,
        cow.clone().multiply(new Matrix4().makeTranslation(px, py, pz))
      )
    const brown = flat("#8b5a34")
    part(new BoxGeometry(0.75, 0.38, 0.34), brown, 0, 0.42, 0)
    part(new BoxGeometry(0.3, 0.39, 0.35), flat("#f2ece2"), 0.1, 0.42, 0)
    part(new BoxGeometry(0.22, 0.22, 0.2), brown, 0.46, 0.55, 0)
    ;[
      [-0.28, -0.12],
      [0.28, -0.12],
      [-0.28, 0.12],
      [0.28, 0.12],
    ].forEach(([lx, lz]) =>
      part(new BoxGeometry(0.07, 0.25, 0.07), dark, lx, 0.12, lz)
    )
  }

  // --- aigul: the red flower that grows only in Batken
  const stem = flat("#4f8f3a")
  const aigul = flat("#ff4b2b", { emissive: "#7a1400", emissiveIntensity: 0.3 })
  for (let k = 0; k < 26; k++) {
    const x = -1.8 + random() * 3.6
    const z = 6.0 + random() * 2.6
    if (!inside(x, z, 0.6) || x < riverA(z) + 0.8 || x > riverB(z) - 0.8)
      continue
    const y = ground(x, z)
    batch.add(
      new CylinderGeometry(0.015, 0.015, 0.34, 4),
      stem,
      place(x, y + 0.17, z)
    )
    batch.add(
      new ConeGeometry(0.075, 0.13, 6),
      aigul,
      place(x, y + 0.31, z, { rotation: [Math.PI, 0, 0] })
    )
  }

  // --- the boy with a laptop under an apricot tree
  const boyX = -6.0
  const boyZ = 1.4
  apricot(boyX - 0.7, boyZ - 0.5, 1.35)
  const boy = place(boyX, ground(boyX, boyZ), boyZ, {
    rotateY: -0.5,
    scale: 1.7,
  })
  const boyPart = (geometry, material, matrix) =>
    batch.add(geometry, material, boy.clone().multiply(matrix))
  const at = (x, y, z, rx = 0, rz = 0) =>
    place(x, y, z, { rotation: [rx, 0, rz] })
  boyPart(
    new CapsuleGeometry(0.13, 0.22, 4, 8),
    flat("#2f6fe4"),
    at(0, 0.32, 0)
  )
  boyPart(new SphereGeometry(0.12, 12, 10), flat("#d9a07a"), at(0, 0.6, 0))
  boyPart(
    new SphereGeometry(0.125, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    flat("#1d1a18"),
    at(0, 0.62, 0)
  )
  boyPart(
    new CapsuleGeometry(0.07, 0.3, 4, 8),
    flat("#2b3550"),
    at(0.2, 0.1, 0, 0, Math.PI / 2)
  )
  boyPart(new BoxGeometry(0.3, 0.02, 0.22), flat("#3a3d45"), at(0.32, 0.22, 0))
  const screen = new Mesh(
    new BoxGeometry(0.015, 0.2, 0.3),
    new MeshStandardMaterial({
      color: "#cfe9ff",
      emissive: "#8fd0ff",
      emissiveIntensity: 1.6,
    })
  )
  screen.matrixAutoUpdate = false
  screen.matrix.copy(boy.clone().multiply(at(0.47, 0.33, 0, 0, 0.15)))
  island.add(screen)
  const glow = new PointLight("#9fd6ff", 2.5, 2.6)
  glow.position.set(0.35, 0.4, 0).applyMatrix4(boy)
  island.add(glow)

  batch.meshes().forEach(mesh => island.add(mesh))

  // --- sheep wander on the right pasture
  const sheepGeometry = (() => {
    const wool = color("#f7f5ee")
    const face = color("#2f2a26")
    const parts = []
    const piece = (geometry, tone, matrix) => {
      const g = geometry.index ? geometry.toNonIndexed() : geometry
      g.deleteAttribute("uv")
      g.applyMatrix4(matrix)
      const tones = []
      for (let i = 0; i < g.attributes.position.count; i++)
        tones.push(tone.r, tone.g, tone.b)
      g.setAttribute("color", new Float32BufferAttribute(tones, 3))
      parts.push(g)
    }
    piece(
      new IcosahedronGeometry(0.22, 1),
      wool,
      new Matrix4().makeScale(1.35, 1, 1).setPosition(0, 0.3, 0)
    )
    piece(
      new BoxGeometry(0.13, 0.13, 0.16),
      face,
      new Matrix4().makeTranslation(0.3, 0.36, 0)
    )
    ;[
      [-0.12, -0.08],
      [0.12, -0.08],
      [-0.12, 0.08],
      [0.12, 0.08],
    ].forEach(([lx, lz]) =>
      piece(
        new BoxGeometry(0.04, 0.18, 0.04),
        face,
        new Matrix4().makeTranslation(lx, 0.09, lz)
      )
    )
    const merged = mergeGeometries(parts)
    merged.computeVertexNormals()
    return merged
  })()
  const sheepMaterial = new MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.9,
  })
  const sheep = []
  for (let k = 0; k < 9; k++) {
    const x = 5.0 + random() * 2.6
    const z = -0.6 + random() * 4.6
    if (!inside(x, z, 0.9)) continue
    const mesh = new Mesh(sheepGeometry, sheepMaterial)
    mesh.castShadow = true
    island.add(mesh)
    sheep.push({
      mesh,
      home: new Vector3(x, 0, z),
      heading: random() * Math.PI * 2,
      phase: random() * 10,
    })
  }

  // --- clouds drift around the island
  const clouds = new Group()
  const cloudParts = []
  ;[
    [-4, 10.5, -3],
    [5, 11.5, -1],
    [0.5, 12.2, -6],
  ].forEach(([x, y, z]) => {
    for (let k = 0; k < 4; k++) {
      const g = new IcosahedronGeometry(0.7 + random() * 0.5, 0)
      g.deleteAttribute("uv")
      g.applyMatrix4(
        new Matrix4().makeTranslation(
          x + k * 0.7 - 1,
          y + random() * 0.3,
          z + (random() - 0.5) * 0.6
        )
      )
      cloudParts.push(g)
    }
  })
  const cloudMesh = new Mesh(
    mergeGeometries(cloudParts),
    flat("#ffffff", { roughness: 1 })
  )
  cloudMesh.geometry.computeVertexNormals()
  cloudParts.forEach(part => part.dispose())
  clouds.add(cloudMesh)
  island.add(clouds)

  // --- foam on the rivers flows downstream
  const foamPerRiver = 26
  const foam = new InstancedMesh(
    new BoxGeometry(0.24, 0.01, 0.05),
    new MeshBasicMaterial({
      color: "#e9fbff",
      transparent: true,
      opacity: 0.85,
    }),
    foamPerRiver * 2
  )
  const foamState = Array.from({ length: foamPerRiver * 2 }, (_, i) => ({
    river: i < foamPerRiver ? riverA : riverB,
    z: -6 + random() * 15,
    offset: (random() - 0.5) * 0.5,
    speed: 0.5 + random() * 0.4,
  }))
  island.add(foam)

  // --- apricot petals in the wind
  const petalCount = 70
  const petals = new InstancedMesh(
    new PlaneGeometry(0.09, 0.07),
    new MeshBasicMaterial({ color: "#ffc4d3", side: DoubleSide }),
    petalCount
  )
  const respawn = petal => {
    const from = blossomTops[Math.floor(random() * blossomTops.length)]
    petal.position
      .copy(from)
      .add(
        new Vector3(
          (random() - 0.5) * 0.6,
          random() * 0.3,
          (random() - 0.5) * 0.6
        )
      )
    petal.life = 4 + random() * 5
    petal.spin = new Vector3(random() * 3, random() * 3, random() * 3)
  }
  const petalState = Array.from({ length: petalCount }, () => {
    const petal = {
      position: new Vector3(),
      rotation: new Vector3(random() * 6, random() * 6, random() * 6),
    }
    respawn(petal)
    petal.life *= random()
    return petal
  })
  island.add(petals)

  return {
    island,
    sheep,
    screen,
    glow,
    clouds,
    foam,
    foamState,
    petals,
    petalState,
    respawn,
    pinAnchor: new Vector3(0.2, 1.9, -0.4),
  }
}

const dummy = new Object3D()

export const createDioramaScene = ({
  container,
  reducedMotion = false,
  pin,
}) => {
  const random = makeRandom(5)
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.domElement.className = "diorama-canvas"
  container.appendChild(renderer.domElement)

  const scene = new Scene()
  const world = buildIsland(random)
  scene.add(world.island)

  scene.add(new HemisphereLight("#d6ecff", "#e6c8a0", 1.15))
  const sun = new DirectionalLight("#fff0d6", 2.6)
  sun.position.set(-12, 18, 10)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, {
    left: -13,
    right: 13,
    top: 13,
    bottom: -13,
    near: 1,
    far: 60,
  })
  sun.shadow.bias = -0.0008
  sun.shadow.normalBias = 0.03
  scene.add(sun)

  const camera = new PerspectiveCamera(32, 1, 0.1, 200)
  const target = new Vector3(0, 2.6, 0)

  const state = {
    angle: -0.35, // the drag adds to this
    drag: null,
    tiltX: 0,
    tiltY: 0,
    pointerX: 0,
    pointerY: 0,
    time: 0,
    width: 1,
    height: 1,
  }

  const placeCamera = () => {
    const aspect = state.width / state.height
    // Far enough for the island, the peaks and the clouds to fit; pull
    // back further when the stage is narrower than it is tall.
    const distance = 46 * Math.max(1, 1.1 / aspect)
    const elevation = 0.56 + state.tiltY * 0.06
    const azimuth = 0.62 + state.tiltX * 0.08
    camera.position.set(
      distance * Math.cos(elevation) * Math.sin(azimuth),
      distance * Math.sin(elevation) + 2,
      distance * Math.cos(elevation) * Math.cos(azimuth)
    )
    camera.lookAt(target)
  }

  // The pin is positioned from the top left corner while the scene runs
  if (pin) Object.assign(pin.style, { left: "0px", top: "0px" })
  const pinPosition = new Vector3()
  const placePin = () => {
    if (!pin) return
    pinPosition
      .copy(world.pinAnchor)
      .applyMatrix4(world.island.matrixWorld)
      .project(camera)
    const x = (pinPosition.x * 0.5 + 0.5) * state.width
    const y = (-pinPosition.y * 0.5 + 0.5) * state.height
    pin.style.transform = `translate(${x}px, ${y}px) translate(-50%, calc(-100% - 1.6rem))`
  }

  const animate = dt => {
    state.time += dt
    const t = state.time
    const ease = reducedMotion ? 1 : Math.min(1, dt * 3)
    state.tiltX += (state.pointerX - state.tiltX) * ease
    state.tiltY += (state.pointerY - state.tiltY) * ease

    // the island turns gently back and forth around the reader's angle
    world.island.rotation.y =
      state.angle + (reducedMotion ? 0 : Math.sin(t * 0.18) * 0.32)

    if (!reducedMotion) {
      world.clouds.rotation.y = t * 0.03

      world.foamState.forEach((foam, i) => {
        foam.z += foam.speed * dt
        if (foam.z > 9) foam.z = -6
        const x = foam.river(foam.z) + foam.offset
        dummy.position.set(x, -0.125, foam.z)
        dummy.rotation.set(0, Math.PI / 2 + Math.cos(foam.z * 0.5) * 0.3, 0)
        dummy.scale.setScalar(x * x + foam.z * foam.z < (R - 0.2) ** 2 ? 1 : 0)
        dummy.updateMatrix()
        world.foam.setMatrixAt(i, dummy.matrix)
      })
      world.foam.instanceMatrix.needsUpdate = true

      world.petalState.forEach((petal, i) => {
        petal.life -= dt
        petal.position.x += (0.45 + Math.sin(t + i) * 0.15) * dt
        petal.position.y -= 0.22 * dt
        petal.position.z += Math.cos(t * 0.7 + i) * 0.12 * dt
        petal.rotation.addScaledVector(petal.spin, dt)
        if (
          petal.life <= 0 ||
          petal.position.y < terrainHeight(petal.position.x, petal.position.z)
        ) {
          world.respawn(petal)
        }
        dummy.position.copy(petal.position)
        dummy.rotation.set(petal.rotation.x, petal.rotation.y, petal.rotation.z)
        dummy.scale.setScalar(Math.min(1, petal.life))
        dummy.updateMatrix()
        world.petals.setMatrixAt(i, dummy.matrix)
      })
      world.petals.instanceMatrix.needsUpdate = true
    }

    world.sheep.forEach(sheep => {
      if (!reducedMotion) {
        sheep.heading += Math.sin(t * 0.4 + sheep.phase) * dt * 0.6
        const walk = 0.5 + 0.5 * Math.sin(t * 0.25 + sheep.phase)
        const radius = 0.7
        sheep.offset = sheep.offset || new Vector3()
        sheep.offset.x = Math.cos(sheep.heading) * radius * walk
        sheep.offset.z = Math.sin(sheep.heading) * radius * walk
      }
      const x = sheep.home.x + (sheep.offset?.x || 0)
      const z = sheep.home.z + (sheep.offset?.z || 0)
      sheep.mesh.position.set(
        x,
        terrainHeight(x, z) +
          (reducedMotion ? 0 : Math.abs(Math.sin(t * 2 + sheep.phase)) * 0.02),
        z
      )
      sheep.mesh.rotation.y = -sheep.heading + Math.PI / 2
    })

    const flicker = reducedMotion
      ? 0
      : Math.sin(t * 3) * 0.25 + (Math.sin(t * 17) > 0.97 ? 0.4 : 0)
    world.screen.material.emissiveIntensity = 1.5 + flicker
    world.glow.intensity = 2.4 + flicker * 2
  }

  const render = dt => {
    animate(dt)
    placeCamera()
    renderer.render(scene, camera)
    placePin()
  }

  const resize = () => {
    state.width = container.clientWidth || 1
    state.height = container.clientHeight || 1
    renderer.setSize(state.width, state.height)
    camera.aspect = state.width / state.height
    camera.updateProjectionMatrix()
    render(0)
  }

  // --- loop only while on screen and the tab is visible
  let frame = 0
  let running = false
  let visible = false
  let last = 0
  const tick = now => {
    render(Math.min(0.05, (now - last) / 1000))
    last = now
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

  // --- drag to turn, pointer to tilt
  const onPointerDown = event => {
    state.drag = { x: event.clientX, angle: state.angle }
    container.setPointerCapture?.(event.pointerId)
    renderer.domElement.classList.add("is-dragging")
  }
  const onPointerMove = event => {
    const rect = container.getBoundingClientRect()
    if (state.drag) {
      state.angle = state.drag.angle + (event.clientX - state.drag.x) * 0.01
    } else if (event.pointerType === "mouse") {
      state.pointerX = MathUtils.clamp(
        ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        -1,
        1
      )
      state.pointerY = MathUtils.clamp(
        ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        -1,
        1
      )
    }
    if (reducedMotion) render(0)
  }
  const onPointerUp = () => {
    state.drag = null
    renderer.domElement.classList.remove("is-dragging")
  }
  const onPointerLeave = () => {
    state.pointerX = 0
    state.pointerY = 0
  }

  document.addEventListener("visibilitychange", onVisibilityChange)
  container.addEventListener("pointerdown", onPointerDown)
  container.addEventListener("pointermove", onPointerMove)
  container.addEventListener("pointerup", onPointerUp)
  container.addEventListener("pointercancel", onPointerUp)
  container.addEventListener("pointerleave", onPointerLeave)
  const resizeObserver =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize)
  resizeObserver?.observe(container)
  resize()

  return {
    dispose() {
      stop()
      visibility.disconnect()
      resizeObserver?.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      container.removeEventListener("pointerdown", onPointerDown)
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerup", onPointerUp)
      container.removeEventListener("pointercancel", onPointerUp)
      container.removeEventListener("pointerleave", onPointerLeave)
      scene.traverse(object => {
        object.geometry?.dispose()
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.forEach(material => material?.dispose())
      })
      renderer.dispose()
      renderer.domElement.remove()
      if (pin) Object.assign(pin.style, { left: "", top: "", transform: "" })
    },
  }
}
