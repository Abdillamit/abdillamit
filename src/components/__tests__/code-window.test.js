import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import CodeWindow, { tokenize } from "../code-window"

describe("tokenize", () => {
  it("tells keywords, keys, strings and punctuation apart", () => {
    const kinds = line =>
      tokenize(line)
        .filter(token => token.text.trim())
        .map(token => `${token.kind}:${token.text}`)

    expect(kinds("export const abu = {")).toEqual([
      "keyword:export",
      "keyword:const",
      "plain:abu",
      "plain:=",
      "punct:{",
    ])
    expect(kinds('  name: "Abu",')).toEqual([
      "key:name",
      "punct::",
      'string:"Abu"',
      "punct:,",
    ])
    expect(kinds('  "aws": [')).toEqual(['key:"aws"', "punct::", "punct:["])
    expect(tokenize("// profile.ts")).toEqual([
      { text: "// profile.ts", kind: "comment" },
    ])
  })
})

describe("CodeWindow", () => {
  const files = [
    { id: "a", name: "a.ts", language: "TypeScript", lines: ["const a = 1"] },
    { id: "b", name: "b.json", language: "JSON", lines: ['{ "b": 2 }'] },
  ]

  it("numbers the lines and switches files", () => {
    render(<CodeWindow label="Files" files={files} />)

    expect(screen.getByLabelText("a.ts")).toHaveTextContent("1const a = 1")
    expect(screen.getByText("[ TypeScript ]")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "b.json" }))
    expect(screen.getByRole("button", { name: "b.json" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByLabelText("b.json")).toHaveTextContent('{ "b": 2 }')
    expect(screen.getByText("[ JSON ]")).toBeInTheDocument()
  })
})
