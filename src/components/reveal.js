import * as React from "react"
import { motion } from "motion/react"

// Shared easing: fast start, long soft landing.
export const ease = [0.22, 1, 0.36, 1]

const variants = {
  hidden: { opacity: 0, y: 24 },
  shown: delay => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
}

// Fades its content up the first time it scrolls into view.
// `as` picks the element: <Reveal as="section">, <Reveal as="li">.
// Print styles and <noscript> force `.reveal` visible, so the content
// is never lost when animations do not run.
const Reveal = ({ as = "div", delay = 0, className, children, ...rest }) => {
  const Component = motion[as]

  return (
    <Component
      className={className ? `reveal ${className}` : "reveal"}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={variants}
      custom={delay}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Reveal
