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
<<<<<<< HEAD
      { kind: 'clip', src: '/clips/MOVI0007.mp4', poster: '/clips/MOVI0007.jpg', alt: 'Friends walking through Walmart aisles, one looking back', caption: 'aisle 12' },
=======
      // KNOB: item fields: src, poster (clips only, the still before it plays), alt (screen readers + lightbox),
      // caption (text under it)
      { kind: 'clip', src: '/clips/MOVI0002.mp4', poster: '/clips/MOVI0002.jpg', alt: 'Walking through a parking lot holding a Ghost energy can, friends ahead', caption: 'the walk in' },
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
    ],
  },
  {
    date: '2026-08-21',
    title: 'Friday',
<<<<<<< HEAD
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
=======
    note: 'New physics lab experiment, super mario galaxy right after',
    items: [
      { kind: 'clip', src: '/clips/MOVI0021.mp4', poster: '/clips/MOVI0021.jpg', alt: 'Looking down through a lattice at campus buildings', caption: 'roof' },
      { kind: 'clip', src: '/clips/MOVI0023.mp4', poster: '/clips/MOVI0023.jpg', alt: 'Pine trees against blue sky, then my shadow on the sidewalk', caption: 'trees' },
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
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
<<<<<<< HEAD
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
=======
      // KNOB: photo fields: when (date tag after the caption), wide: true (landscape, two columns),
      // position (crop focus, '35% 50%' shifts left), ratio (optional, overrides the default shape)
      { kind: 'photo', src: "/photos/hike.jpg", alt: "Five friends on a hilltop with the valley behind them", caption: "the hike", when: " ", wide: true },
      { kind: 'photo', src: "/photos/grad-boys.jpg", alt: "Four graduates in gowns and leis", caption: "the boys", when: " " },
      { kind: 'photo', src: "/photos/pitch.jpg", alt: "Evan mid-pitch on the mound in a pinstripe uniform", caption: "the pitch", when: " " },
      { kind: 'photo', src: "/photos/dodgers-night.jpg", alt: "Dodger Stadium under the lights at night", caption: "the dodgers", when: " ", wide: true },
      { kind: 'photo', src: "/photos/lava-cove.jpg", alt: "Waves crashing on black lava rock in a green cove", caption: "the cove", when: " ", position: "35% 50%" },
      { kind: 'photo', src: "/photos/mb-pier.jpg", alt: "Sun setting beside the Manhattan Beach pier", caption: "the beach", when: " ", position: "70% 50%" },
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
    ],
  },
]

// KNOB: how day dates are written (month day year). App.test.jsx expects '08 20 2026'
export const formatDay = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m} ${d} ${y}`
}
