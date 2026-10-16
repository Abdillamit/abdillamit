#!/usr/bin/env node
/**
 * Builds the height map for the 3D mountains on the About page.
 *
 * Real relief (needs internet):
 *   node scripts/terrain.mjs --lat 39.95 --lon 69.70 --place "Baul"
 * Stylized relief (no internet):
 *   node scripts/terrain.mjs --synthetic
 *
 * Options: --size <km> (default 24), --grid <points per side> (default 96),
 *          --step <contour interval, m> (default 100)
 *
 * Real heights come from the AWS Terrain Tiles (terrarium PNG, mostly
 * SRTM 30 m in this region), https://registry.opendata.aws/terrain-tiles/
 *
 * Writes:
 *   static/terrain/terrain.json   heights, loaded by the 3D scene at runtime
 *   src/data/terrain-meta.json    source, place and size, used for the caption
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { inflateSync } from "node:zlib"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .join(" ")
    .split("--")
    .filter(Boolean)
    .map(part => {
      const [key, ...value] = part.trim().split(" ")
      return [key, value.join(" ").replace(/^"|"$/g, "") || true]
    })
)

const sizeKm = Number(args.size || 24)
const grid = Number(args.grid || 96)
const step = Number(args.step || 100)

// --- PNG decoding (8-bit RGB or RGBA, no interlace: what terrarium uses)

const paeth = (a, b, c) => {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

export const decodePng = buffer => {
  let offset = 8
  let width = 0
  let height = 0
  let channels = 0
  const data = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString("ascii", offset + 4, offset + 8)
    const chunk = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === "IHDR") {
      width = chunk.readUInt32BE(0)
      height = chunk.readUInt32BE(4)
      const colorType = chunk[9]
      if (chunk[8] !== 8 || chunk[12] !== 0 || ![2, 6].includes(colorType)) {
        throw new Error(
          "Only 8-bit, non-interlaced RGB/RGBA PNGs are supported"
        )
      }
      channels = colorType === 6 ? 4 : 3
    }
    if (type === "IDAT") data.push(chunk)
    offset += length + 12
  }

  const raw = inflateSync(Buffer.concat(data))
  const stride = width * channels
  const pixels = Buffer.alloc(height * stride)

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[y * stride + x - channels] : 0
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0
      const upLeft =
        y > 0 && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0
      const value = line[x]
      pixels[y * stride + x] =
        (filter === 0
          ? value
          : filter === 1
          ? value + left
          : filter === 2
          ? value + up
          : filter === 3
          ? value + ((left + up) >> 1)
          : value + paeth(left, up, upLeft)) & 255
    }
  }

  return { width, height, channels, pixels }
}

// --- Real relief from terrain tiles

const zoom = 12
const tileSize = 256

const toWorldPixel = (lat, lon) => {
  const scale = tileSize * 2 ** zoom
  const sin = Math.sin((lat * Math.PI) / 180)
  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  }
}

const realRelief = async (lat, lon) => {
  const kmPerDegreeLat = 110.574
  const kmPerDegreeLon = 111.32 * Math.cos((lat * Math.PI) / 180)
  const half = sizeKm / 2
  const north = lat + half / kmPerDegreeLat
  const south = lat - half / kmPerDegreeLat
  const west = lon - half / kmPerDegreeLon
  const east = lon + half / kmPerDegreeLon

  const topLeft = toWorldPixel(north, west)
  const bottomRight = toWorldPixel(south, east)
  const tiles = new Map()
  const tileOf = async (tx, ty) => {
    const key = `${tx}/${ty}`
    if (!tiles.has(key)) {
      const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${tx}/${ty}.png`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`${url}: ${response.status}`)
      tiles.set(key, decodePng(Buffer.from(await response.arrayBuffer())))
    }
    return tiles.get(key)
  }
  const heightAt = async (px, py) => {
    const tile = await tileOf(
      Math.floor(px / tileSize),
      Math.floor(py / tileSize)
    )
    const x = Math.min(tileSize - 1, Math.floor(px % tileSize))
    const y = Math.min(tileSize - 1, Math.floor(py % tileSize))
    const i = (y * tile.width + x) * tile.channels
    const [r, g, b] = tile.pixels.subarray(i, i + 3)
    return r * 256 + g + b / 256 - 32768
  }

  const heights = []
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const px = topLeft.x + ((bottomRight.x - topLeft.x) * col) / (grid - 1)
      const py = topLeft.y + ((bottomRight.y - topLeft.y) * row) / (grid - 1)
      heights.push(Math.round(await heightAt(px, py)))
    }
  }
  return heights
}

// --- Stylized relief: ridged noise with a river valley through the middle

const synthetic = () => {
  let seed = 1984
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const size = 257
  const lattice = Array.from({ length: size * size }, random)
  const smooth = t => t * t * (3 - 2 * t)
  const noise = (x, y) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = smooth(x - x0)
    const fy = smooth(y - y0)
    const at = (i, j) =>
      lattice[((j & 255) * size + (i & 255)) % lattice.length]
    const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx
    const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx
    return top * (1 - fy) + bottom * fy
  }
  const ridged = (x, y) => {
    let sum = 0
    let amplitude = 0.55
    let frequency = 1
    for (let octave = 0; octave < 5; octave++) {
      const n = 1 - Math.abs(noise(x * frequency, y * frequency) * 2 - 1)
      sum += n * n * amplitude
      amplitude *= 0.42
      frequency *= 2.03
    }
    return sum
  }

  const heights = []
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const u = col / (grid - 1)
      const v = row / (grid - 1)
      // A river winds north to south; the land rises away from it
      const river = 0.5 + 0.12 * Math.sin(v * Math.PI * 2.2)
      const valley = Math.min(1, Math.abs(u - river) * 2.6)
      const relief = ridged(u * 3.2 + 3.1, v * 3.2 + 7.7)
      const height = 1250 + 3600 * (0.15 + 0.85 * valley ** 1.3) * relief ** 1.7
      heights.push(height)
    }
  }
  return blur(blur(heights)).map(Math.round)
}

// 3×3 box blur: real slopes are smoother than raw noise at this scale
const blur = values =>
  values.map((_, i) => {
    const row = Math.floor(i / grid)
    const col = i % grid
    let sum = 0
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const r = row + dy
        const c = col + dx
        if (r < 0 || c < 0 || r >= grid || c >= grid) continue
        sum += values[r * grid + c]
        count++
      }
    }
    return sum / count
  })

const write = (heights, meta) => {
  const min = Math.min(...heights)
  const max = Math.max(...heights)
  const terrain = {
    ...meta,
    sizeKm,
    cols: grid,
    rows: grid,
    step,
    min,
    max,
    heights,
  }
  const terrainPath = join(root, "static/terrain/terrain.json")
  const metaPath = join(root, "src/data/terrain-meta.json")
  mkdirSync(dirname(terrainPath), { recursive: true })
  writeFileSync(terrainPath, JSON.stringify(terrain))
  writeFileSync(
    metaPath,
    `${JSON.stringify({ ...meta, sizeKm, step }, null, 2)}\n`
  )
  console.log(
    `${meta.source}: ${grid}×${grid}, ${min}–${max} m → ${terrainPath}`
  )
}

if (args.synthetic) {
  write(synthetic(), { source: "synthetic", place: null })
} else if (args.lat && args.lon) {
  const lat = Number(args.lat)
  const lon = Number(args.lon)
  const heights = await realRelief(lat, lon)
  write(heights, {
    source: "srtm",
    place: { name: args.place || null, lat, lon },
  })
} else {
  console.error(
    "Usage: node scripts/terrain.mjs --lat <lat> --lon <lon> [--place <name>]\n" +
      "       node scripts/terrain.mjs --synthetic"
  )
  process.exit(1)
}
