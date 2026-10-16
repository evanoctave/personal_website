// FriendRing: the footer webring. "← previous friend · random · next friend →", read from the shared
// list in friendsites.ts. renders nothing until the list loads, and nothing at all if the fetch fails
// or this site isn't in the list, so the footer never breaks because of it.
import { useEffect, useState } from 'react'
import { Friend, href, loadRing, neighbors } from './friendsites'

type Props = { self?: string; src?: string }

export default function FriendRing({ self, src }: Props) {
  const [list, setList] = useState<Friend[] | null>(null)

  useEffect(() => {
    let live = true
    loadRing(src)
      .then((friends) => { if (live) setList(friends) })
      .catch((err) => console.warn('friendsites: no friends... :(', err))
    return () => { live = false }
  }, [src])

  if (!list) return null
  const ring = neighbors(list, self)
  if (!ring) return null

  return (
    <nav aria-label="friendsites" className="friendring">
      {/* KNOB: the label in front of the ring links */}
      <span className="friendring-label">friends</span>
      <a href={href(ring.prev.url)}>← {ring.prev.displayName}</a>
      <button onClick={() => { window.location.href = href(ring.random().url) }} type="button">random</button>
      <a href={href(ring.next.url)}>{ring.next.displayName} →</a>
    </nav>
  )
}
