import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { navigate } from "gatsby"
import Terminal from "../terminal"

const type = (input, text) => {
  fireEvent.change(input, { target: { value: text } })
  fireEvent.submit(input.closest("form"))
}

describe("Terminal", () => {
  beforeEach(() => navigate.mockClear())

  it("opens with a banner and focuses the input", () => {
    render(<Terminal lang="ru" current="about" onClose={() => {}} />)

    expect(screen.getByRole("dialog", { name: "Терминал" })).toBeInTheDocument()
    expect(screen.getByText(/Наберите help/)).toBeInTheDocument()
    expect(document.activeElement).toBe(
      screen.getByLabelText("guest@abdillamit:~$")
    )
  })

  it("echoes the command and prints the answer", () => {
    render(<Terminal lang="en" onClose={() => {}} />)
    const input = screen.getByRole("textbox")

    type(input, "echo hello")
    expect(screen.getAllByText("echo hello")).toHaveLength(1)
    expect(screen.getByText("hello")).toBeInTheDocument()
    expect(input).toHaveValue("")
  })

  it("renders links in the output", () => {
    render(<Terminal lang="en" onClose={() => {}} />)
    type(screen.getByRole("textbox"), "contact")

    const github = screen.getByRole("link", { name: "github.com/Abdillamit" })
    expect(github).toHaveAttribute("href", "https://github.com/Abdillamit")
    expect(github).toHaveAttribute("target", "_blank")
    expect(
      screen.getByRole("link", { name: "abdillamit08@gmail.com" })
    ).not.toHaveAttribute("target")
  })

  it("navigates, clears and closes", () => {
    const onClose = jest.fn()
    render(<Terminal lang="en" onClose={onClose} />)
    const input = screen.getByRole("textbox")

    type(input, "cd resume")
    expect(navigate).toHaveBeenCalledWith("/resume/")

    type(input, "clear")
    expect(screen.queryByText(/Type help/)).toBeNull()

    type(input, "exit")
    expect(onClose).toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: "Close the terminal" }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("downloads the resume through a temporary link", () => {
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    render(<Terminal lang="en" onClose={() => {}} />)

    type(screen.getByRole("textbox"), "cv")
    expect(click).toHaveBeenCalledTimes(1)
    click.mockRestore()
  })

  it("completes with Tab and lists the options", () => {
    render(<Terminal lang="en" onClose={() => {}} />)
    const input = screen.getByRole("textbox")

    fireEvent.change(input, { target: { value: "who" } })
    fireEvent.keyDown(input, { key: "Tab" })
    expect(input).toHaveValue("whoami ")

    fireEvent.change(input, { target: { value: "c" } })
    fireEvent.keyDown(input, { key: "Tab" })
    expect(
      screen.getByText(/^cat\s+cd\s+contact\s+cv\s+clear$/)
    ).toBeInTheDocument()
  })

  it("goes through history with the arrow keys", () => {
    render(<Terminal lang="en" onClose={() => {}} />)
    const input = screen.getByRole("textbox")
    type(input, "ls")
    type(input, "pwd")

    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveValue("pwd")
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveValue("ls")
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveValue("ls")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(input).toHaveValue("pwd")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(input).toHaveValue("")
  })

  it("shows the current page in the prompt", () => {
    render(<Terminal lang="en" current="blog" onClose={() => {}} />)
    expect(
      screen.getByLabelText("guest@abdillamit:~/blog$")
    ).toBeInTheDocument()
  })
})
