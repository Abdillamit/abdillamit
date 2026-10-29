// Colours that JavaScript needs too. Keep `accent` in sync with --accent
// in src/styles/site.css.
export const accent = "#FFA552"

// Animated backgrounds (see src/components/backdrop.js). To try another
// React Bits background, copy it into src/components/react-bits, add it
// to the loaders in backdrop.js and put its name and props here.
export const heroBackground = {
  name: "faulty-terminal",
  props: {
    tint: accent,
    scale: 1.5,
    gridMul: [2, 1],
    digitSize: 1.3,
    timeScale: 0.4,
    scanlineIntensity: 0.4,
    curvature: 0.12,
    brightness: 0.7,
    mouseReact: true,
    mouseStrength: 0.4,
    glyphs: "blocks",
    vignette: 0.3,
  },
}

export const contactBackground = {
  name: "dot-grid",
  props: {
    baseColor: "#26241F",
    activeColor: accent,
    dotSize: 3,
    gap: 22,
    proximity: 150,
    shockRadius: 240,
    shockStrength: 4,
  },
}
