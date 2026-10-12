import * as React from "react"

// "2024-09" -> "09.2024"
export const formatMonth = value => {
  const [year, month] = value.split("-")
  return `${month}.${year}`
}

const Period = ({ from, to, presentLabel }) => (
  <span className="period">
    <time dateTime={from}>{formatMonth(from)}</time>
    {" – "}
    {to ? <time dateTime={to}>{formatMonth(to)}</time> : presentLabel}
  </span>
)

export default Period
