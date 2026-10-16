import { contourLevels, contourSegments } from "../contours"

describe("contourSegments", () => {
  it("draws nothing when the level is outside the grid", () => {
    expect(contourSegments([0, 0, 0, 0], 2, 2, 5)).toEqual([])
    expect(contourSegments([9, 9, 9, 9], 2, 2, 5)).toEqual([])
  })

  it("cuts off a single high corner halfway along its edges", () => {
    // top-left corner is high
    expect(contourSegments([10, 0, 0, 0], 2, 2, 5)).toEqual([0, 0.5, 0.5, 0])
  })

  it("draws a straight line across a slope", () => {
    // left column low, right column high: a vertical line at x = 0.25
    expect(contourSegments([0, 20, 0, 20], 2, 2, 5)).toEqual([0.25, 0, 0.25, 1])
  })

  it("splits a saddle into two segments by the centre value", () => {
    // top-left and bottom-right high, centre average 5
    const saddle = [10, 0, 0, 10]
    const centreHigh = contourSegments(saddle, 2, 2, 4)
    const centreLow = contourSegments(saddle, 2, 2, 6)
    expect(centreHigh).toHaveLength(8)
    expect(centreLow).toHaveLength(8)
    expect(centreHigh).not.toEqual(centreLow)
  })

  it("closes a ring around a peak", () => {
    const peak = [0, 0, 0, 0, 10, 0, 0, 0, 0]
    // four cells, one segment each
    expect(contourSegments(peak, 3, 3, 5)).toHaveLength(16)
  })
})

describe("contourLevels", () => {
  it("returns the levels strictly inside the range, every step", () => {
    expect(contourLevels(1250, 1600, 100)).toEqual([1300, 1400, 1500, 1600])
    expect(contourLevels(1300, 1450, 100)).toEqual([1400])
  })
})
