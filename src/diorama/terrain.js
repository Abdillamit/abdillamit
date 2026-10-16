// Shape of the Baul diorama: a round island with the village between two
// rivers, hills on both sides and the Turkestan Range at the back.
// Pure functions, so they can be tested without WebGL.

export const ISLAND_RADIUS = 10

// Deterministic random numbers, so the island looks the same every visit
export const makeRandom =
  (seed = 5) =>
  () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

const lattice = (() => {
  const random = makeRandom(5)
  return Array.from({ length: 256 * 256 }, random)
})()

const smoothStep01 = t => t * t * (3 - 2 * t)

export const noise = (x, y) => {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = smoothStep01(x - x0)
  const fy = smoothStep01(y - y0)
  const at = (i, j) =>
    lattice[(((j % 256) + 256) % 256) * 256 + (((i % 256) + 256) % 256)]
  const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx
  const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx
  return top * (1 - fy) + bottom * fy
}

export const fbm = (x, y) => {
  let sum = 0
  let amplitude = 0.5
  let frequency = 1
  for (let octave = 0; octave < 4; octave++) {
    sum += noise(x * frequency, y * frequency) * amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return sum
}

export const smoothstep = (edge0, edge1, value) =>
  smoothStep01(Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0))))

// The two rivers run from the mountains (back, -z) to the front (+z)
export const riverA = z => -3.1 + 0.7 * Math.sin(z * 0.45 + 0.5)
export const riverB = z => 3.3 + 0.6 * Math.sin(z * 0.55 + 2.0)

export const isBetweenRivers = (x, z) => x > riverA(z) && x < riverB(z)

export const terrainHeight = (x, z) => {
  const a = riverA(z)
  const b = riverB(z)
  let height
  if (x > a && x < b) {
    // the village: a low, almost flat meadow
    height = 0.42 + (fbm(x * 0.4 + 9, z * 0.4) - 0.5) * 0.35
  } else {
    // dry hills (adyr) rising away from the rivers
    const out = x <= a ? a - x : x - b
    height =
      0.45 +
      Math.min(1, out / 4.5) ** 1.3 * 2.4 +
      (fbm(x * 0.5 + 3, z * 0.5) - 0.5) * 0.9
  }
  // the land rises toward the mountains at the back
  height += Math.max(0, (-z - 2.5) / 6) ** 1.5 * 2.4
  // river channels
  const channel = Math.min(Math.abs(x - a), Math.abs(x - b))
  if (channel < 1.2) {
    height = -0.4 + (height + 0.4) * smoothstep(0.3, 1.2, channel)
  }
  return height
}
