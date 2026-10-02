// Photos live in public/photos, clips in public/clips.
// kind: 'photo' | 'clip'. A clip needs src (mp4) and poster (jpg).
// `days` is the digicam roll (one object per camera date).
// `chapters` is the phone roll, newest first. `wide: true` = landscape, takes two columns.

export const days = [
  {
    date: '2026-08-20',
    title: 'Thursday',
    note: 'Walmart run + Cherry Limeade Ghost',
    items: [
      { kind: 'clip', src: '/clips/MOVI0007.mp4', poster: '/clips/MOVI0007.jpg', alt: 'Friends walking through Walmart aisles, one looking back', caption: 'aisle 12' },
    ],
  },
  {
    date: '2026-08-21',
    title: 'Friday',
    note: 'Reaching new heights, then mario brothers until midnight',
    items: [
      { kind: 'clip', src: '/clips/MOVI0021.mp4', poster: '/clips/MOVI0021.jpg', alt: 'Looking down through a lattice at campus buildings', caption: 'roof woof' },
      { kind: 'photo', src: '/photos/PICT0020.jpg', alt: 'View over campus rooftops and trees on a bright day', caption: 'fullerton' },
      { kind: 'photo', src: '/photos/PICT0025-smooth.jpg', alt: 'Evan with arms out wide in an empty parking lot at night', caption: 'night' },
      { kind: 'photo', src: '/photos/PICT0027.jpg', alt: 'Two hands holding Chi sparkling peach and lychee cans', caption: 'chi' },
    ],
  },
  {
    date: '2026-08-23',
    title: 'Sunday',
    note: 'Homework day.',
    items: [
      { kind: 'photo', src: '/photos/PICT0042.jpg', alt: 'Study table with laptops, textbooks, and friends', caption: 'real big books guy' },
    ],
  },
]

export const chapters = [
  // phone roll, picked from favorites. newest chapter first.
  {
    id: "y2026",
    title: "2026",
    note: "Second year. IT job at CSUF, hikes, dogs, Dodger Stadium.",
    items: [
      { kind: 'photo', src: "/photos/dodger-stadium.jpg", alt: "Evan and family in Dodgers gear at the stadium", caption: "dodger stadium", when: "sep 26", wide: true },
      { kind: 'photo', src: "/photos/crew.jpg", alt: "Four friends in matching shirts outside a building", caption: "the crew", when: "aug 26", wide: true },
      { kind: 'photo', src: "/photos/four-dogs.jpg", alt: "Four golden retrievers lying on a patio looking at the camera", caption: "four dogs", when: "feb 26" },
      { kind: 'photo', src: "/photos/hike.jpg", alt: "Five friends on a hilltop with the valley behind them", caption: "hike", when: "jan 26", wide: true },
    ],
  },
  {
    id: "fall2025",
    title: "fall 2025",
    note: "First semester at Fullerton. Learned to program. Lost a lot of Catan.",
    items: [
      { kind: 'photo', src: "/photos/catan.jpg", alt: "Friends around a table playing Catan", caption: "catan", when: "aug 25", wide: true },
      { kind: 'photo', src: "/photos/alley.jpg", alt: "Evan with arms out in a wet alley at night", caption: "alley", when: "aug 25", wide: true },
      { kind: 'photo', src: "/photos/ascii-dino.jpg", alt: "A terminal printing an ASCII art dinosaur", caption: "ascii dino", when: "sep 25" },
    ],
  },
  {
    id: "summer2025",
    title: "summer 2025",
    note: "Graduated. Hawaii. Got a dog. Wrote my first program in July.",
    items: [
      { kind: 'photo', src: "/photos/grad-dad.jpg", alt: "Evan in cap and gown with leis holding a diploma, next to his dad in a white shirt", caption: "graduated", when: "jun 25" },
      { kind: 'photo', src: "/photos/first-program.jpg", alt: "A monitor showing a first program in an editor", caption: "hello, evan", when: "jul 25" },
      { kind: 'photo', src: "/photos/hawaii.jpg", alt: "Evan in front of crashing waves on a rocky shore", caption: "hawaii", when: "aug 25", wide: true },
      { kind: 'photo', src: "/photos/new-dog.jpg", alt: "Evan in a Stitch shirt with a golden retriever puppy", caption: "new dog", when: "aug 25", wide: true },
    ],
  },
  {
    id: "spring2025",
    title: "spring 2025",
    note: "Last baseball season. Senior year. Committed to CSUF.",
    items: [
      { kind: 'photo', src: "/photos/tigres.jpg", alt: "The whole baseball team posing on the field", caption: "tigres", when: "mar 25", wide: true },
      { kind: 'photo', src: "/photos/pitch.jpg", alt: "Evan mid-pitch on the mound in a pinstripe uniform", caption: "the pitch", when: "mar 25", wide: true },
    ],
  },
  {
    id: "before",
    title: "2024",
    note: "Applying to college, studying, and hanging around Pasadena.",
    items: [
      { kind: 'photo', src: "/photos/bench.jpg", alt: "Evan sitting on a bench next to a bronze statue at night", caption: "bench", when: "feb 25", wide: true },
    ],
  },
]

export const formatDay = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m} ${d} ${y}`
}
