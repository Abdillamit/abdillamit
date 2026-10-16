import * as React from "react"
import { withPrefix } from "gatsby"

import meta from "../data/terrain-meta.json"
import { site } from "../data/site"

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch (error) {
    return false
  }
}

// "Fig. 1": 3D mountains as a figure with a caption, like in a LaTeX
// paper. three.js and the height map load only when the figure gets
// close to the screen, so the rest of the page stays light. Without
// WebGL the figure is left out.
const TerrainFigure = ({ lang = "en" }) => {
  const text = site[lang].about.figure
  const stageRef = React.useRef(null)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === "undefined") return undefined

    let scene = null
    let cancelled = false

    const load = async () => {
      try {
        if (!hasWebGL()) throw new Error("WebGL is not available")
        const [{ createTerrainScene }, terrain] = await Promise.all([
          import("../terrain/scene"),
          window
            .fetch(withPrefix("/terrain/terrain.json"))
            .then(response => response.json()),
        ])
        if (cancelled) return
        scene = createTerrainScene({
          container: stage,
          terrain,
          reducedMotion:
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
            false,
          label: meta.place ? text.place : null,
        })
      } catch (error) {
        if (!cancelled) setFailed(true)
      }
    }

    const nearScreen = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        nearScreen.disconnect()
        load()
      },
      { rootMargin: "300px 0px" }
    )
    nearScreen.observe(stage)

    return () => {
      cancelled = true
      nearScreen.disconnect()
      scene?.dispose()
    }
  }, [text.place])

  if (failed) return null

  return (
    <figure className="terrain wrap">
      <div className="terrain-stage" ref={stageRef} aria-hidden="true" />
      <figcaption className="terrain-caption">
        <span className="terrain-caption__label">{text.label}</span>{" "}
        {meta.source === "srtm" ? text.real : text.stylized}
      </figcaption>
    </figure>
  )
}

export default TerrainFigure
