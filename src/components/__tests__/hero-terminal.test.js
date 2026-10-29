import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import HeroTerminal, { timing } from "../hero-terminal"
import { TerminalContext } from "../terminal-context"

const lessMotion = matches => {
  window.matchMedia = jest.fn().mockImplementation(() => ({ matches }))
}

const input = () => screen.getByRole("textbox", { name: "Type a command" })

const run = command => {
  fireEvent.change(input(), { target: { value: command } })
  fireEvent.submit(input().closest("form"))
}

describe("HeroTerminal", () => {
  afterEach(() => {
    delete window.matchMedia
    jest.useRealTimers()
  })

  it("starts with the banner and four quick commands", () => {
    render(<HeroTerminal lang="en" autorun={null} />)

    expect(screen.getByText("Type help to see the commands.")).toBeVisible()
    const quick = screen.getByRole("group", { name: "Quick commands" })
    expect(
      Array.from(quick.querySelectorAll("button")).map(
        button => button.textContent
      )
    ).toEqual(["whoami", "projects", "contact", "help"])
  })

  it("runs a typed command", () => {
    lessMotion(true)
    render(<HeroTerminal lang="en" autorun={null} />)

    run("whoami")
    expect(
      screen.getByText(
        "Abdillamit Mamytov — Full Stack Software Engineer, Bishkek."
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "whoami" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(input()).toHaveValue("")
  })

  it("types a quick command, then prints the answer line by line", () => {
    lessMotion(false)
    jest.useFakeTimers()
    render(<HeroTerminal lang="en" autorun={null} />)

    fireEvent.click(screen.getByRole("button", { name: "projects" }))
    act(() => jest.advanceTimersByTime(timing.key * 3))
    expect(input()).toHaveValue("pro")

    act(() =>
      jest.advanceTimersByTime(timing.key * 5 + timing.enter + timing.line)
    )
    expect(screen.getByText(/^Finik/)).toBeInTheDocument()
    expect(screen.queryByText(/^Mancho School/)).toBeNull()

    act(() => jest.advanceTimersByTime(timing.line * 3))
    expect(screen.getByText(/^Mancho School/)).toBeInTheDocument()
  })

  it("introduces itself after the page opens", () => {
    lessMotion(true)
    jest.useFakeTimers()
    render(<HeroTerminal lang="ru" />)

    act(() => jest.advanceTimersByTime(1000))
    expect(screen.getByText(/Abdillamit Mamytov — Full Stack/)).toBeVisible()
  })

  it("completes commands with Tab and goes through history", () => {
    lessMotion(true)
    render(<HeroTerminal lang="en" autorun={null} />)

    fireEvent.change(input(), { target: { value: "who" } })
    fireEvent.keyDown(input(), { key: "Tab" })
    expect(input()).toHaveValue("whoami ")

    run("pwd")
    fireEvent.keyDown(input(), { key: "ArrowUp" })
    expect(input()).toHaveValue("pwd")
    fireEvent.keyDown(input(), { key: "ArrowDown" })
    expect(input()).toHaveValue("")
  })

  it("clears the screen", () => {
    lessMotion(true)
    render(<HeroTerminal lang="en" autorun={null} />)

    run("clear")
    expect(screen.queryByText("Type help to see the commands.")).toBeNull()
  })

  it("hands what was run over to the full terminal", () => {
    lessMotion(true)
    const open = jest.fn()
    render(
      <TerminalContext.Provider value={{ open }}>
        <HeroTerminal lang="en" autorun={null} />
      </TerminalContext.Provider>
    )

    run("pwd")
    fireEvent.click(
      screen.getByRole("button", { name: "Open the full terminal" })
    )
    expect(open).toHaveBeenCalledWith([
      { kind: "input", prompt: "guest@abdillamit:~$", text: "pwd" },
      { kind: "text", parts: [{ text: "/home/guest" }] },
    ])
  })
})
