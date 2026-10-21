// TreeFigure: draws a codec.js tree as an inline SVG. leaves sit left to right in tree order, branches
// hang above the midpoint of their children. `path` (a bit string) lights up the root-to-leaf route of
// the last typed symbol. colors come from the site's CSS vars so invert mode flips it too.
// used by pages/BinaryTreeTranslator.jsx. styles: .bintree-figure in site.css
import { useMemo } from 'react'
import { isLeaf } from './codec.js'

// KNOB: drawing scale — space between leaves, height per level, node radius, svg padding
const GAP = 27
const ROW = 42
const R = 9
const PAD = 20
// KNOB: 0/1 edge labels only show this many levels down (deeper gets too crowded)
const LABEL_DEPTH = 3

// each node gets its path as an id ('' is the root), an x from its leaves and a y from its depth
const layout = (tree) => {
  const nodes = []
  const edges = []
  let leafIndex = 0
  let deepest = 0
  const place = (node, path, depth) => {
    deepest = Math.max(deepest, depth)
    const y = PAD + depth * ROW
    if (isLeaf(node)) {
      const x = PAD + leafIndex * GAP
      leafIndex += 1
      nodes.push({ id: path, x, y, symbol: node.symbol })
      return x
    }
    const lx = place(node.left, `${path}0`, depth + 1)
    const rx = place(node.right, `${path}1`, depth + 1)
    const x = (lx + rx) / 2
    nodes.push({ id: path, x, y })
    edges.push({ id: `${path}0`, from: [x, y], to: [lx, y + ROW], bit: '0', depth })
    edges.push({ id: `${path}1`, from: [x, y], to: [rx, y + ROW], bit: '1', depth })
    return x
  }
  place(tree, '', 0)
  return { nodes, edges, width: PAD * 2 + (leafIndex - 1) * GAP, height: PAD * 2 + deepest * ROW + R }
}

const show = (symbol) => (symbol === ' ' ? '␣' : symbol)

export default function TreeFigure({ codes, path = '', tree }) {
  const { nodes, edges, width, height } = useMemo(() => layout(tree), [tree])
  const lit = (id) => path.startsWith(id)

  return (
    <div className="bintree-figure">
      <svg aria-label="The alphabet tree" role="img" viewBox={`0 0 ${width} ${height}`} style={{ minWidth: width }}>
        {edges.map((edge) => (
          <g className={lit(edge.id) ? 'is-lit' : undefined} key={edge.id}>
            <line x1={edge.from[0]} y1={edge.from[1]} x2={edge.to[0]} y2={edge.to[1]} />
            {edge.depth < LABEL_DEPTH && (
              <text
                className="bintree-bit"
                x={(edge.from[0] + edge.to[0]) / 2 + (edge.bit === '0' ? -7 : 7)}
                y={(edge.from[1] + edge.to[1]) / 2}
              >
                {edge.bit}
              </text>
            )}
          </g>
        ))}
        {nodes.map((node) => (
          <g className={`${node.symbol !== undefined ? 'bintree-leaf' : 'bintree-branch'}${lit(node.id) ? ' is-lit' : ''}`} key={node.id}>
            {node.symbol !== undefined ? (
              <>
                <title>{`${show(node.symbol)} = ${codes.get(node.symbol)}`}</title>
                <rect height={R * 2} rx="3" width={R * 2} x={node.x - R} y={node.y - R} />
                <text x={node.x} y={node.y + 1}>{show(node.symbol)}</text>
              </>
            ) : (
              <circle cx={node.x} cy={node.y} r={node.id === '' ? 4 : 2.5} />
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
