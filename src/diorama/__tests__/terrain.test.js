import {
  ISLAND_RADIUS,
  isBetweenRivers,
  makeRandom,
  riverA,
  riverB,
  smoothstep,
  terrainHeight,
} from "../terrain"

describe("Baul terrain", () => {
  it("keeps the two rivers apart across the whole island", () => {
    for (let z = -ISLAND_RADIUS; z <= ISLAND_RADIUS; z += 0.5) {
      expect(riverB(z) - riverA(z)).toBeGreaterThan(4)
    }
  })

  it("puts the village between the rivers, low and almost flat", () => {
    expect(isBetweenRivers(0, 0)).toBe(true)
    expect(isBetweenRivers(-6, 0)).toBe(false)
    const village = [-1, 0, 1].map(x => terrainHeight(x, 1))
    village.forEach(height => {
      expect(height).toBeGreaterThan(0.1)
      expect(height).toBeLessThan(0.8)
    })
  })

  it("cuts the river channels below the water line", () => {
    expect(terrainHeight(riverA(2), 2)).toBeLessThan(-0.1)
    expect(terrainHeight(riverB(-1), -1)).toBeLessThan(-0.1)
  })

  it("raises dry hills outside the rivers and the land toward the mountains", () => {
    expect(terrainHeight(-7.5, 1)).toBeGreaterThan(terrainHeight(0, 1) + 1)
    expect(terrainHeight(7, 2)).toBeGreaterThan(terrainHeight(0, 2) + 1)
    expect(terrainHeight(0.5, -7)).toBeGreaterThan(terrainHeight(0.5, 3))
  })

  it("is the same on every visit", () => {
    const a = makeRandom(5)
    const b = makeRandom(5)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(terrainHeight(1.234, -2.5)).toBe(terrainHeight(1.234, -2.5))
  })

  it("smoothstep clamps and eases", () => {
    expect(smoothstep(0, 1, -1)).toBe(0)
    expect(smoothstep(0, 1, 2)).toBe(1)
    expect(smoothstep(0, 1, 0.5)).toBe(0.5)
  })
})
