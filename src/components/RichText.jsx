// RichText: lets plain strings (like the project write-ups in src/data/projects.js) carry links.
// Write a link as [words](https://example.com) and it renders as a real link that opens in a new tab.
// HTML typed into a string (<a href=...>) does NOT work: React shows it as literal text.
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

export default function RichText({ text }) {
  if (!text) return null
  const parts = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    parts.push(text.slice(last, match.index))
    parts.push(<a href={match[2]} key={match.index} rel="noreferrer" target="_blank">{match[1]}</a>)
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return <>{parts}</>
}

// the same text with the link syntax stripped, for places that can't hold a link (inside another link,
// the browser tab title)
export const plainText = (text = '') => text.replace(LINK, '$1')
