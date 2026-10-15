# Friendsites ring — design

Date: 2026-10-13

## What

A tiny webring in the site footer. It links to the previous and next site in a shared list of
friends' websites, plus a "random" jump. The list lives in one shared repo so every member's site
reads the same order: <https://github.com/ilovetcp/friendsites> (`list.json`).

`list.json` is an ordered array of `{ "displayName": string, "url": string }`. URLs are bare hosts
(`www.anjelogo.com`), no scheme.

Anjelo's site (anjelogo.com) already does this: finds itself in the list by `url`, links the
neighbours on either side with wraparound, and prefixes `https://`. This site matches that so the
ring is consistent in both directions.

## Where

Footer of every page (`SiteShell.jsx`), on its own row under the existing two lines. Hidden
entirely until the list loads, and stays hidden if the fetch fails or this site is not in the list,
so a GitHub outage never breaks the footer.

## How

- **Data**: the browser fetches `list.json` straight from `raw.githubusercontent.com` (CORS is
  `*`, cached 5 min). The site is static nginx, so there is no server to proxy through.
- **`src/components/friendsites.ts`**: pure helpers. `href(url)` adds the scheme; `loadRing(src)`
  fetches + validates; `neighbors(list, self)` finds this site by host (ignores scheme, `www.`,
  trailing path, case) and returns `{ prev, next, random() }` with wraparound, or `null` if this
  site is missing or alone.
- **`src/components/FriendRing.tsx`**: renders `← prev · random · next →` as a `<nav
  aria-label="friendsites">`. Same-tab navigation.
- **KNOBs**: the list URL and this site's host are constants at the top of `friendsites.ts`.

## Tests

- Unit: `neighbors` wraparound, host matching, missing self, single member; `href` scheme handling;
  `loadRing` rejects non-arrays and drops malformed entries.
- Component: with `fetch` mocked, the footer shows the neighbour links; with a failing fetch, it
  shows nothing and the rest of the footer still renders.
- `App.test.jsx` stubs `fetch` so existing tests never hit the network.

## Out of scope

Showing the whole list, a dedicated friends page, server-side caching, or adding more members
(that happens in the shared repo).
