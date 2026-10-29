import * as React from "react"

import { stackFiles } from "../data/stack"

const keywords = new Set(["export", "const", "as"])

// Splits one line of TypeScript or JSON into coloured pieces. Enough for
// the two files in data/stack.js, not a real highlighter.
export const tokenize = line => {
  if (line.trim().startsWith("//")) return [{ text: line, kind: "comment" }]
  const pattern = /"[^"]*"|[A-Za-z_$][\w$]*|[{}[\](),:]|\s+|[^\s]/g
  const tokens = []
  let match
  while ((match = pattern.exec(line))) {
    const piece = match[0]
    const isKey = line.slice(pattern.lastIndex).trimStart().startsWith(":")
    let kind = "plain"
    if (piece.startsWith('"')) kind = isKey ? "key" : "string"
    else if (keywords.has(piece)) kind = "keyword"
    else if (/^[{}[\](),:]$/.test(piece)) kind = "punct"
    else if (isKey) kind = "key"
    tokens.push({ text: piece, kind })
  }
  return tokens
}

// Editor-like window with file tabs and line numbers.
const CodeWindow = ({ label = "Files", files = stackFiles }) => {
  const [activeId, setActiveId] = React.useState(files[0].id)
  const file = files.find(item => item.id === activeId) || files[0]

  return (
    <div className="code-window">
      <div className="code-window__bar">
        <div className="code-window__tabs" role="group" aria-label={label}>
          {files.map(item => (
            <button
              key={item.id}
              type="button"
              className="code-window__tab"
              aria-pressed={item.id === file.id}
              onClick={() => setActiveId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <span className="code-window__language">[ {file.language} ]</span>
      </div>
      {/* Focusable so the code can be scrolled sideways from the keyboard */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <pre className="code-window__code" tabIndex={0} aria-label={file.name}>
        <code>
          {file.lines.map((line, index) => (
            <span className="code-line" key={`${file.id}-${index}`}>
              <span className="code-line__number" aria-hidden="true">
                {index + 1}
              </span>
              {tokenize(line).map((token, tokenIndex) => (
                <span key={tokenIndex} className={`token is-${token.kind}`}>
                  {token.text}
                </span>
              ))}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export default CodeWindow
