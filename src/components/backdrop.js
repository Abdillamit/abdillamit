import * as React from "react"

// Animated backgrounds from React Bits (src/components/react-bits).
// Each one loads in its own chunk after the page has painted. Until then,
// and for people who ask for less motion or have no WebGL 2, the CSS
// dot pattern of .backdrop stays.
const loaders = {
  "faulty-terminal": () => import("./react-bits/faulty-terminal"),
  "dot-grid": () => import("./react-bits/dot-grid"),
}

const canAnimate = () => {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false
  }
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"))
  } catch (error) {
    return false
  }
}

const Backdrop = ({ name, className = "", ...props }) => {
  const [Component, setComponent] = React.useState(null)

  React.useEffect(() => {
    const load = loaders[name]
    if (!load || !canAnimate()) return undefined

    let cancelled = false
    const start = () =>
      load()
        .then(module => {
          if (!cancelled) setComponent(() => module.default)
        })
        .catch(() => {})
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
  }, [name])

  return (
    <div
      className={`backdrop${Component ? " is-live" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {Component && <Component {...props} />}
    </div>
  )
}

export default Backdrop
