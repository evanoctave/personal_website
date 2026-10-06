// Photos live in public/photos, clips in public/clips.
// kind: 'photo' | 'clip'. A clip needs src (mp4) and poster (jpg).
// `days` is the digicam roll (one object per camera date).
// `chapters` is the phone roll, newest first. `wide: true` = landscape, takes two columns.

export const days = [
  {
    date: '2026-08-20',
    title: 'Thursday',
    note: 'Walmart run with the boys. Ghost cherry limeade for the road.',
    items: [
      { kind: 'clip', src: '/clips/MOVI0002.mp4', poster: '/clips/MOVI0002.jpg', alt: 'Walking through a parking lot holding a Ghost energy can, friends ahead', caption: 'the walk in' },
    ],
  },
  {
    date: '2026-08-21',
    title: 'Friday',
    note: 'Physics, campus roof, then everybody at the apartment till late.',
    items: [
      { kind: 'clip', src: '/clips/MOVI0021.mp4', poster: '/clips/MOVI0021.jpg', alt: 'Looking down through a lattice at campus buildings', caption: 'roof' },
      { kind: 'clip', src: '/clips/MOVI0023.mp4', poster: '/clips/MOVI0023.jpg', alt: 'Pine trees against blue sky, then my shadow on the sidewalk', caption: 'trees' },
    ],
  },
]

export const chapters = [
  // phone roll. a handful, newest first.
  {
    id: "phone",
    title: "before the digicam",
    note: "Senior year through sophomore year, from my phone.",
    items: [
      { kind: 'photo', src: "/photos/hike.jpg", alt: "Five friends on a hilltop with the valley behind them", caption: "hike", when: "jan 26", wide: true },
      { kind: 'photo', src: "/photos/grad-boys.jpg", alt: "Four graduates in gowns and leis", caption: "the boys", when: "jun 25" },
      { kind: 'photo', src: "/photos/pitch.jpg", alt: "Evan mid-pitch on the mound in a pinstripe uniform", caption: "the pitch", when: "mar 25" },
      { kind: 'photo', src: "/photos/catan.jpg", alt: "Friends around a table playing Catan", caption: "catan", when: "aug 25", wide: true },
      { kind: 'photo', src: "/photos/dodgers-night.jpg", alt: "Dodger Stadium under the lights at night", caption: "dodgers", when: "aug 25", wide: true },
      { kind: 'photo', src: "/photos/lava-cove.jpg", alt: "Waves crashing on black lava rock in a green cove", caption: "lava cove", when: "aug 25", position: "35% 50%" },
      { kind: 'photo', src: "/photos/mb-pier.jpg", alt: "Sun setting beside the Manhattan Beach pier", caption: "manhattan beach", when: "jan 25", position: "70% 50%" },
    ],
  },
]

export const formatDay = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m} ${d} ${y}`
}
