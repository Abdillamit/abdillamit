// Contour lines (isolines) of a height grid, by marching squares.
//
// `heights` is row-major, `cols` × `rows`. Returns one flat array of
// segments [x1, y1, x2, y2, ...] in grid units (0..cols-1, 0..rows-1)
// where the surface crosses `level`.

// For each of the 16 corner patterns: which cell edges the line joins.
// Edges: 0 top, 1 right, 2 bottom, 3 left. Corners: tl=8, tr=4, br=2, bl=1.
const cases = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[0, 1]],
  null, // saddle, decided by the centre value
  [[0, 2]],
  [[3, 0]],
  [[3, 0]],
  [[0, 2]],
  null, // saddle
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
]

// Saddle cells: lines cutting off the top-left and bottom-right corners,
// or the top-right and bottom-left ones
const aroundTlBr = [
  [3, 0],
  [2, 1],
]
const aroundTrBl = [
  [0, 1],
  [3, 2],
]

export const contourSegments = (heights, cols, rows, level) => {
  const segments = []
  const at = (x, y) => heights[y * cols + x]
  const t = (a, b) => (a === b ? 0.5 : (level - a) / (b - a))

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const tl = at(x, y)
      const tr = at(x + 1, y)
      const br = at(x + 1, y + 1)
      const bl = at(x, y + 1)
      const index =
        (tl >= level ? 8 : 0) |
        (tr >= level ? 4 : 0) |
        (br >= level ? 2 : 0) |
        (bl >= level ? 1 : 0)

      let pairs = cases[index]
      if (pairs === null) {
        // Saddle: the centre value decides which two corners are cut off
        const centreHigh = (tl + tr + br + bl) / 4 >= level
        pairs = (index === 5) === centreHigh ? aroundTlBr : aroundTrBl
      }

      for (const [from, to] of pairs) {
        for (const edge of [from, to]) {
          if (edge === 0) segments.push(x + t(tl, tr), y)
          else if (edge === 1) segments.push(x + 1, y + t(tr, br))
          else if (edge === 2) segments.push(x + t(bl, br), y + 1)
          else segments.push(x, y + t(tl, bl))
        }
      }
    }
  }

  return segments
}

// Contour levels between min and max, every `step` metres.
export const contourLevels = (min, max, step) => {
  const levels = []
  for (let level = Math.ceil(min / step) * step; level <= max; level += step) {
    if (level > min) levels.push(level)
  }
  return levels
}
