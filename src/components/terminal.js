import * as React from "react"
import { navigate } from "gatsby"
import { motion } from "motion/react"

import { ease } from "./reveal"
import { banner, complete, promptFor, runCommand } from "../terminal/commands"

const Line = ({ line }) => (
  <div className={`terminal__line is-${line.kind}`}>
    {line.kind === "input" ? (
      <>
        <span className="terminal__prompt">{line.prompt}</span> {line.text}
      </>
    ) : (
      line.parts.map((part, index) =>
        part.href ? (
          <a
            key={index}
            href={part.href}
            target={part.href.startsWith("http") ? "_blank" : undefined}
            rel={part.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {part.text}
          </a>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )
    )}
  </div>
)

const runAction = (action, onClose) => {
  if (!action) return
  if (action.type === "navigate") navigate(action.to)
  if (action.type === "close") onClose()
  if (action.type === "open") window.location.href = action.href
  if (action.type === "download") {
    const anchor = document.createElement("a")
    anchor.href = action.href
    anchor.download = ""
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}

// A small shell for curious visitors: ~ or Ctrl+K opens it (see layout.js).
// It is a panel, not a modal: the page stays visible and `cd` moves it.
const Terminal = ({
  lang = "en",
  current,
  translations,
  pathname,
  onClose,
}) => {
  const [lines, setLines] = React.useState(() => banner(lang))
  const [value, setValue] = React.useState("")
  const [history, setHistory] = React.useState([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)
  const inputRef = React.useRef(null)
  const outputRef = React.useRef(null)
  const prompt = promptFor(current)

  // Focus the input on open and again after `cd`: Gatsby moves focus to
  // the new page after navigation, so take it back a moment later.
  React.useEffect(() => {
    inputRef.current?.focus()
    const timer = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(timer)
  }, [pathname])

  React.useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [lines])

  const submit = event => {
    event.preventDefault()
    const result = runCommand(value, { lang, current, translations })
    const echo = { kind: "input", prompt, text: value }
    if (result.action?.type === "clear") setLines([])
    else setLines(previous => [...previous, echo, ...result.output])
    if (value.trim()) setHistory(previous => [...previous, value])
    setHistoryIndex(-1)
    setValue("")
    runAction(result.action, onClose)
  }

  const onKeyDown = event => {
    if (event.key === "Tab") {
      event.preventDefault()
      const result = complete(value)
      setValue(result.input)
      if (result.options.length) {
        setLines(previous => [
          ...previous,
          { kind: "input", prompt, text: value },
          { kind: "muted", parts: [{ text: result.options.join("  ") }] },
        ])
      }
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault()
      const index =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setValue(history[index])
    } else if (event.key === "ArrowDown" && historyIndex !== -1) {
      event.preventDefault()
      const index = historyIndex + 1
      if (index >= history.length) {
        setHistoryIndex(-1)
        setValue("")
      } else {
        setHistoryIndex(index)
        setValue(history[index])
      }
    }
  }

  const title = lang === "ru" ? "Терминал" : "Terminal"

  return (
    <motion.section
      className="terminal"
      role="dialog"
      aria-label={title}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease }}
    >
      <div className="terminal__bar">
        <span>{prompt.replace(/\$$/, "")}</span>
        <button
          type="button"
          className="terminal__close"
          onClick={onClose}
          aria-label={lang === "ru" ? "Закрыть терминал" : "Close the terminal"}
        >
          ×
        </button>
      </div>
      {/* Clicking anywhere in the output puts the cursor back in the input */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="terminal__output"
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
      >
        <div aria-live="polite">
          {lines.map((line, index) => (
            <Line key={index} line={line} />
          ))}
        </div>
        <form className="terminal__form" onSubmit={submit}>
          <label className="terminal__prompt" htmlFor="terminal-input">
            {prompt}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            className="terminal__input"
            value={value}
            onChange={event => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </form>
      </div>
    </motion.section>
  )
}

export default Terminal
