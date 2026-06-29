import { useMemo, useState } from 'react'

/**
 * Renderiza un grafo en SVG usando las coordenadas (x, y) en el rango [-1, 1]
 * que entrega el backend (layout circular). Reutilizable para los endpoints de
 * grafo, flujo y MST mediante funciones de estilo configurables.
 */
function NetworkGraph({
  nodes = [],
  edges = [],
  size = 720,
  padding = 48,
  getNodeColor = () => '#a78bfa',
  getNodeRadius = (n) => 4 + Math.sqrt(n.in_degree ?? 1) * 1.6,
  getEdgeColor = () => 'rgba(148,163,184,0.18)',
  getEdgeWidth = () => 1,
  isEdgeVisible = () => true,
}) {
  const [hovered, setHovered] = useState(null)

  const positions = useMemo(() => {
    const map = new Map()
    const project = (v) => padding + ((v + 1) / 2) * (size - padding * 2)
    nodes.forEach((n) => {
      map.set(n.id, { x: project(n.x), y: project(n.y) })
    })
    return map
  }, [nodes, size, padding])

  if (!nodes.length) return null

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      role="img"
      aria-label="Visualización del grafo de la red"
    >
      <g>
        {edges.map((edge, i) => {
          if (!isEdgeVisible(edge)) return null
          const a = positions.get(edge.source)
          const b = positions.get(edge.target)
          if (!a || !b) return null
          const dim = hovered && hovered !== edge.source && hovered !== edge.target
          return (
            <line
              key={`${edge.source}-${edge.target}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={getEdgeColor(edge)}
              strokeWidth={getEdgeWidth(edge)}
              opacity={dim ? 0.15 : 1}
            />
          )
        })}
      </g>
      <g>
        {nodes.map((node) => {
          const p = positions.get(node.id)
          if (!p) return null
          const r = getNodeRadius(node)
          const isHovered = hovered === node.id
          return (
            <g
              key={node.id}
              transform={`translate(${p.x} ${p.y})`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                r={isHovered ? r + 2 : r}
                fill={getNodeColor(node)}
                stroke={isHovered ? '#fff' : 'rgba(15,23,42,0.7)'}
                strokeWidth={isHovered ? 1.5 : 1}
              />
              {isHovered && (
                <text
                  y={-r - 6}
                  textAnchor="middle"
                  className="fill-slate-100 text-[11px] font-medium"
                  style={{ paintOrder: 'stroke', stroke: '#020617', strokeWidth: 3 }}
                >
                  {node.id} · {node.in_degree} seg.
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default NetworkGraph
