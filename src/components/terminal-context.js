import * as React from "react"

// Lets any part of a page open the site terminal (layout.js owns it).
// `open(lines)` can pass lines to show under the banner, so the terminal
// on the home page can hand over what the visitor already ran there.
export const TerminalContext = React.createContext({ open: () => {} })

export const useTerminal = () => React.useContext(TerminalContext)
