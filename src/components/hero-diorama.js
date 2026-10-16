import * as React from "react"
import { withPrefix } from "gatsby"

import { site } from "../data/site"

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch (error) {
    return false
  }
}

// Baul in 3D next to the name on the home page.
// A still picture of the same scene is shown first. When the page has
// painted, three.js loads in its own chunk and the live scene fades in
// over the picture. Without WebGL, or with reduced motion, the picture
// stays.
const HeroDiorama = ({ lang = "en" }) => {
  const text = site[lang].about.diorama
  const stageRef = React.useRef(null)
  const pinRef = React.useRef(null)
  const [live, setLive] = React.useState(false)

  React.useEffect(() => {
    const stage = stageRef.current
    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    if (!stage || reducedMotion || !hasWebGL()) return undefined

    let scene = null
    let cancelled = false
    const start = () =>
      import("../diorama/scene")
        .then(({ createDioramaScene }) => {
          if (cancelled) return
          scene = createDioramaScene({ container: stage, pin: pinRef.current })
          setLive(true)
        })
        .catch(() => {})

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 200)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      scene?.dispose()
    }
  }, [])

  return (
    <div
      className={live ? "hero-diorama is-live" : "hero-diorama"}
      ref={stageRef}
      role="img"
      aria-label={text.label}
    >
      <img
        className="hero-diorama__poster"
        src={withPrefix("/diorama/baul.webp")}
        alt=""
        width="1106"
        height="1006"
        decoding="async"
      />
      <span className="hero-diorama__pin" ref={pinRef} aria-hidden="true">
        {text.place} <small>· {text.district}</small>
      </span>
    </div>
  )
}

export default HeroDiorama
