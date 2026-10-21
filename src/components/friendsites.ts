// friendsites.ts: the data side of the footer webring (FriendRing.tsx renders it).
// the list of friends' sites lives in one shared repo so every member's site reads the same order:
// https://github.com/ilovetcp/friendsites (list.json). to add someone, add them there, not here.

export type Friend = { displayName: string; url: string }

// KNOB: where the shared list lives (raw GitHub, cached ~5 min, CORS open)
export const RING_URL = 'https://raw.githubusercontent.com/ilovetcp/friendsites/main/list.json'
// KNOB: this site's host, as it appears in list.json (scheme and www. don't matter)
export const SELF = 'evanoctave.dev'

// list.json stores bare hosts ("www.anjelogo.com"); links need a scheme
export const href = (url: string): string => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

// "https://www.Evanoctave.dev/home" -> "evanoctave.dev", so matching is forgiving about how a url was typed
const host = (url: string): string =>
  href(url)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[/?#].*$/, '')
    .toLowerCase()

const isFriend = (x: unknown): x is Friend =>
  typeof x === 'object' && x !== null &&
  typeof (x as Friend).displayName === 'string' && typeof (x as Friend).url === 'string'

export async function loadRing(src: string = RING_URL): Promise<Friend[]> {
  const res = await fetch(src)
  if (!res.ok) throw new Error(`friendsites: ${res.status} from ${src}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('friendsites: list.json is not an array idiot')
  return data.filter(isFriend)
}

// everyone in the list except this site (the dice gate on /home picks from these)
export const others = (list: Friend[], self: string = SELF): Friend[] => {
  const me = host(self)
  return list.filter((f) => host(f.url) !== me)
}

export type Ring = { prev: Friend; next: Friend; random: () => Friend }

// the sites on either side of this one in the list (wrapping at the ends), or null if this site
// isn't in the list yet or is the only member
export function neighbors(list: Friend[], self: string = SELF): Ring | null {
  const me = host(self)
  const i = list.findIndex((f) => host(f.url) === me)
  if (i < 0 || list.length < 2) return null
  const n = list.length
  const others = list.filter((_, k) => k !== i)
  return {
    prev: list[(i - 1 + n) % n],
    next: list[(i + 1) % n],
    random: () => others[Math.floor(Math.random() * others.length)],
  }
}
