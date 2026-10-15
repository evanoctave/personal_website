// Photos live in public/photos, clips in public/clips.
// kind: 'photo' | 'clip'. A clip needs src (mp4) and poster (jpg).
// `days` is the digicam roll (one object per camera date).
// `chapters` is the phone roll, newest first. `wide: true` = landscape, takes two columns.
// feeds the /life page (src/pages/LifePage.jsx). App.test.jsx checks a few of these srcs
// (pitch.jpg, dodgers-night.jpg, MOVI0002.mp4 + .jpg) and the first date, so keep those in sync.

// KNOB: the digicam days, in order. date (YYYY-MM-DD, becomes the heading "09 27 2026"),
// title + note (the line under the date), items (that day's clips / photos, in order)
export const days = [
  {
    date: '2026-09-27',
    title: 'Thursday',
    note: 'Walmart run + Cherry Limeade Ghost',
    items: [
      // KNOB: item fields: src, poster (clips only, the still before it plays), alt (screen readers + lightbox),
      // caption (text under it)
      { kind: 'clip', src: '/clips/MOVI0002.mp4', poster: '/clips/MOVI0002.jpg', alt: 'Walking through a parking lot holding a Ghost energy can, friends ahead', caption: 'the walk in' },
    ],
  },
  {
    date: '2026-08-21',
    title: 'Friday',
    note: 'New physics lab experiment, super mario galaxy right after',
    items: [
      { kind: 'clip', src: '/clips/MOVI0021.mp4', poster: '/clips/MOVI0021.jpg', alt: 'Looking down through a lattice at campus buildings', caption: 'roof' },
      { kind: 'clip', src: '/clips/MOVI0023.mp4', poster: '/clips/MOVI0023.jpg', alt: 'Pine trees against blue sky, then my shadow on the sidewalk', caption: 'trees' },
    ],
  },
]

// KNOB: phone chapters. id (used in the html id), title (heading; App.test.jsx expects 'before the digicam'),
// note (line under it), items (photos, newest first)
export const chapters = [
  // phone roll. a handful, newest first.
  {
    id: "phone",
    title: "before the camera",
    note: "Another slice of me. Shot on my phone.",
    items: [
      // KNOB: photo fields: when (date tag after the caption), wide: true (landscape, two columns),
      // position (crop focus, '35% 50%' shifts left), ratio (optional, overrides the default shape)
      { kind: 'photo', src: "/photos/hike.jpg", alt: "Five friends on a hilltop with the valley behind them", caption: "the hike", when: " ", wide: true },
      { kind: 'photo', src: "/photos/grad-boys.jpg", alt: "Four graduates in gowns and leis", caption: "the boys", when: " " },
      { kind: 'photo', src: "/photos/pitch.jpg", alt: "Evan mid-pitch on the mound in a pinstripe uniform", caption: "the pitch", when: " " },
      { kind: 'photo', src: "/photos/dodgers-night.jpg", alt: "Dodger Stadium under the lights at night", caption: "the dodgers", when: " ", wide: true },
      { kind: 'photo', src: "/photos/lava-cove.jpg", alt: "Waves crashing on black lava rock in a green cove", caption: "the cove", when: " ", position: "35% 50%" },
      { kind: 'photo', src: "/photos/mb-pier.jpg", alt: "Sun setting beside the Manhattan Beach pier", caption: "the beach", when: " ", position: "70% 50%" },
    ],
  },
]

// KNOB: how day dates are written (month day year). App.test.jsx expects '08 20 2026'
export const formatDay = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m} ${d} ${y}`
}
