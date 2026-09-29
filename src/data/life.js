// Digicam roll. Photos live in public/photos, clips in public/clips.
// kind: 'photo' | 'clip'. A clip needs src (mp4) and poster (jpg).
// Add a new day by pushing another { date, title, items } object.

export const days = [
  {
    date: '2026-08-20',
    title: 'Thursday',
    note: 'Walmart run with the boys. Ghost cherry limeade for the road.',
    items: [
      { kind: 'clip', src: '/clips/MOVI0002.mp4', poster: '/clips/MOVI0002.jpg', alt: 'Walking through a parking lot holding a Ghost energy can, friends ahead', caption: 'the walk in' },
      { kind: 'photo', src: '/photos/PICT0004.jpg', alt: 'Hand holding a red Ghost cherry limeade energy can over concrete', caption: 'fuel' },
      { kind: 'clip', src: '/clips/MOVI0007.mp4', poster: '/clips/MOVI0007.jpg', alt: 'Friends walking through Walmart aisles, one looking back', caption: 'aisle 12' },
      { kind: 'clip', src: '/clips/MOVI0009.mp4', poster: '/clips/MOVI0009.jpg', alt: 'Shaky footage of the meat section and a shopping cart', caption: 'cart cam' },
      { kind: 'photo', src: '/photos/PICT0010.jpg', alt: 'Hand splayed over packs of stew meat', caption: '$10.16' },
      { kind: 'clip', src: '/clips/MOVI0011.mp4', poster: '/clips/MOVI0011.jpg', alt: 'Friend turning around in a warehouse store aisle', caption: 'costco' },
    ],
  },
  {
    date: '2026-08-21',
    title: 'Friday',
    note: 'Physics, campus roof, then everybody at the apartment till late.',
    items: [
      { kind: 'photo', src: '/photos/PICT0016.jpg', alt: 'Whiteboard with thin film interference equations', caption: 'thin films' },
      { kind: 'clip', src: '/clips/MOVI0021.mp4', poster: '/clips/MOVI0021.jpg', alt: 'Looking down through a lattice at campus buildings', caption: 'roof' },
      { kind: 'photo', src: '/photos/PICT0020.jpg', alt: 'View over campus rooftops and trees on a bright day', caption: 'fullerton' },
      { kind: 'clip', src: '/clips/MOVI0023.mp4', poster: '/clips/MOVI0023.jpg', alt: 'Pine trees against blue sky, then my shadow on the sidewalk', caption: 'trees' },
      { kind: 'photo', src: '/photos/PICT0025.jpg', alt: 'Evan with arms out wide in an empty parking lot at night', caption: 'night' },
      { kind: 'photo', src: '/photos/PICT0026.jpg', alt: 'Selfie with a friend in a parking garage', caption: 'garage' },
      { kind: 'photo', src: '/photos/PICT0027.jpg', alt: 'Two hands holding Chi sparkling peach and lychee cans', caption: 'chi' },
      { kind: 'photo', src: '/photos/PICT0030.jpg', alt: 'Friend at a desk with a laptop, hand over mouth, thinking', caption: 'locked in' },
      { kind: 'photo', src: '/photos/PICT0034.jpg', alt: 'Playing a Roblox game on a laptop at a cafe table', caption: 'roblox' },
      { kind: 'photo', src: '/photos/PICT0036.jpg', alt: 'Friend in a black hoodie looking at the camera', caption: 'hey' },
      { kind: 'photo', src: '/photos/PICT0037.jpg', alt: 'Close portrait of a friend looking straight at the camera', caption: 'stare' },
      { kind: 'clip', src: '/clips/MOVI0033.mp4', poster: '/clips/MOVI0033.jpg', alt: 'Frozen yogurt kiosk menu, then two upside-down faces', caption: 'froyo' },
    ],
  },
  {
    date: '2026-08-22',
    title: 'Saturday',
    note: 'Climbing gym.',
    items: [
      { kind: 'photo', src: '/photos/PICT0039.jpg', alt: 'Climbing gym ceiling with ducts and a big window', caption: 'gym' },
    ],
  },
  {
    date: '2026-08-23',
    title: 'Sunday',
    note: 'Homework day.',
    items: [
      { kind: 'photo', src: '/photos/PICT0040.jpg', alt: 'Spiral notebook with function and inverse problems next to a phone', caption: 'inverses' },
      { kind: 'photo', src: '/photos/PICT0042.jpg', alt: 'Study table with laptops, textbooks, and friends', caption: 'study' },
      { kind: 'photo', src: '/photos/PICT0043.jpg', alt: 'Laptop and open textbook with country flags', caption: 'lang' },
    ],
  },
]

export const formatDay = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m} ${d} ${y}`
}
