import * as React from "react"

import { Line, runAction } from "./terminal"
import { useTerminal } from "./terminal-context"
import { banner, complete, promptFor, runCommand } from "../terminal/commands"
import { site } from "../data/site"
import { pageRoutes } from "../data/routes"

export const quickCommands = ["whoami", "projects", "contact", "help"]

// Typing speed of the quick commands, in milliseconds
export const timing = { key: 28, enter: 140, line: 50 }

const lessMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

// The site terminal (terminal/commands.js), built into the first screen.
// Quick commands type themselves and run; the visitor can also type any
// command. It shows the last command only; the expand button opens the
// full terminal with everything run here.
const HeroTerminal = ({ lang = "en", autorun = "whoami" }) => {
  const text = site[lang].about.terminal
  const { open } = useTerminal()
  const prompt = promptFor("about")
  const inputId = React.useId()

  const [command, setCommand] = React.useState(null)
  const [output, setOutput] = React.useState(() => banner(lang))
  const [shown, setShown] = React.useState(Infinity)
  const [value, setValue] = React.useState("")
  const [options, setOptions] = React.useState([])
  const [history, setHistory] = React.useState([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)
  const outputRef = React.useRef(null)
  const timers = React.useRef([])

  const clearTimers = () => {
    timers.current.forEach(timer => clearTimeout(timer))
    timers.current = []
  }
  const later = (callback, delay) => {
    timers.current.push(setTimeout(callback, delay))
  }

  const execute = input => {
    clearTimers()
    const trimmed = input.trim()
    const result = runCommand(trimmed, {
      lang,
      current: "about",
      translations: pageRoutes.about,
    })
    setValue("")
    setOptions([])
    setHistoryIndex(-1)
    if (trimmed) {
      setHistory(previous => [
        ...previous,
        { command: trimmed, output: result.output },
      ])
    }
    if (result.action?.type === "clear") {
      setCommand(null)
      setOutput([])
      return
    }
    setCommand(trimmed)
    setOutput(result.output)
    if (lessMotion()) {
      setShown(Infinity)
    } else {
      setShown(0)
      result.output.forEach((_, index) =>
        later(() => setShown(index + 1), (index + 1) * timing.line)
      )
    }
    runAction(result.action)
  }

  // Types a command into the input, then presses Enter
  const type = name => {
    clearTimers()
    if (lessMotion()) {
      execute(name)
      return
    }
    setValue("")
    setOptions([])
    for (let index = 1; index <= name.length; index++) {
      later(() => setValue(name.slice(0, index)), index * timing.key)
    }
    later(() => execute(name), name.length * timing.key + timing.enter)
  }

  // Introduce itself shortly after the page opens
  React.useEffect(() => {
    if (autorun) later(() => type(autorun), 900)
    return clearTimers
    // Runs once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const element = outputRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [output, shown, options])

  const submit = event => {
    event.preventDefault()
    execute(value)
  }

  const onKeyDown = event => {
    const commands = history.map(item => item.command)
    if (event.key === "Tab") {
      event.preventDefault()
      const result = complete(value)
      setValue(result.input)
      setOptions(result.options)
    } else if (event.key === "ArrowUp" && commands.length) {
      event.preventDefault()
      const index =
        historyIndex === -1
          ? commands.length - 1
          : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setValue(commands[index])
    } else if (event.key === "ArrowDown" && historyIndex !== -1) {
      event.preventDefault()
      const index = historyIndex + 1
      if (index >= commands.length) {
        setHistoryIndex(-1)
        setValue("")
      } else {
        setHistoryIndex(index)
        setValue(commands[index])
      }
    }
  }

  const openFull = () => {
    clearTimers()
    open(
      history.flatMap(item => [
        { kind: "input", prompt, text: item.command },
        ...item.output,
      ])
    )
  }

  return (
    <section className="hero-terminal" aria-label={text.label}>
      <div className="hero-terminal__bar">
        <span className="hero-terminal__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="hero-terminal__title">
          {prompt.replace(/\$$/, "")}
        </span>
        <button
          type="button"
          className="hero-terminal__expand"
          aria-label={text.expand}
          title={text.expand}
          onClick={openFull}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
          </svg>
        </button>
      </div>

      <div
        className="hero-terminal__quick"
        role="group"
        aria-label={text.quick}
      >
        {quickCommands.map(name => (
          <button
            key={name}
            type="button"
            className="hero-terminal__chip"
            aria-pressed={command === name}
            onClick={() => type(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="hero-terminal__output" ref={outputRef} aria-live="polite">
        {command !== null && (
          <Line line={{ kind: "input", prompt, text: command }} />
        )}
        {output.slice(0, shown).map((line, index) => (
          <Line key={`${command}-${index}`} line={line} />
        ))}
        {options.length > 0 && (
          <Line
            line={{ kind: "muted", parts: [{ text: options.join("  ") }] }}
          />
        )}
      </div>

      <form className="hero-terminal__form" onSubmit={submit}>
        <label className="terminal__prompt" htmlFor={inputId}>
          {prompt}
        </label>
        <span className="hero-terminal__field">
          {/* A block cursor drawn after the text; the real caret is hidden */}
          <span className="hero-terminal__mirror" aria-hidden="true">
            <span className="hero-terminal__typed">{value}</span>
            <span className="hero-terminal__cursor" />
            {!value && (
              <span className="hero-terminal__placeholder">
                {text.placeholder}
              </span>
            )}
          </span>
          <input
            id={inputId}
            className="hero-terminal__input"
            value={value}
            onChange={event => {
              setValue(event.target.value)
              setOptions([])
            }}
            onKeyDown={onKeyDown}
            aria-label={text.input}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </span>
      </form>

      <p className="hero-terminal__hints">
        <span>
          <kbd>Tab</kbd> {text.complete}
        </span>
        <span>
          <kbd>↑ ↓</kbd> {text.history}
        </span>
        <span>
          <kbd>~</kbd> {text.full}
        </span>
      </p>
    </section>
  )
}

export default HeroTerminal
