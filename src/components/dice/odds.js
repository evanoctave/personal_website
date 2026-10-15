// odds.js: the rules of the dice gate, with no three.js in sight so they can be unit tested.
// DiceTable.jsx uses judge/winChance; scene.js uses FACES/upFace to read a settled die.

// pip value of each face, in three.js BoxGeometry material order: +x, -x, +y, -y, +z, -z.
// opposite faces add up to 7 like a real die.
export const FACES = [2, 5, 1, 6, 3, 4]

// KNOB: a die counts as flat when its top face normal is within ~cos(25°) of straight up.
// below that it's leaning on the other die or a wall and gets a nudge.
const FLAT = 0.9

// ys: the world-space y component of each face normal (same order as FACES)
export function upFace(ys) {
  let best = 0
  for (let i = 1; i < ys.length; i += 1) if (ys[i] > ys[best]) best = i
  return { value: FACES[best], flat: ys[best] >= FLAT }
}

// strictly above the picked number wins. a tie is a loss (the house always needs an edge).
export const judge = (total, target) => (total > target ? 'win' : 'lose')

// chance that two dice total strictly more than `target`
export function winChance(target) {
  let wins = 0
  for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) if (a + b > target) wins += 1
  return wins / 36
}

// one honest die, for when there's no WebGL (or motion is turned off)
export const rollFlat = () => 1 + Math.floor(Math.random() * 6)
