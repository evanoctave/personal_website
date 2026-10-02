// A tiny construction crew that "builds" whatever it wraps: the content assembles in chunks while
// workers hammer away on top of it in smoke and wind, then the crew clears off.

function Worker({ carry = false, style }) {
  return (
    <svg className={`worker${carry ? ' worker--carry' : ''}`} style={style} viewBox="0 0 24 32">
      <rect fill="#2b2b2b" height="9" rx="1" width="3.5" x="8" y="22" />
      <rect fill="#2b2b2b" height="9" rx="1" width="3.5" x="12.5" y="22" />
      <rect fill="#e8e6e1" height="11" rx="3" width="11" x="6.5" y="12" />
      <rect fill="#ff8a3d" height="2" width="11" x="6.5" y="16" />
      <circle cx="12" cy="8" fill="#d9b48f" r="4" />
      <path d="M7 8a5 5 0 0 1 10 0z" fill="#ff8a3d" />
      <rect fill="#ff8a3d" height="1.6" rx=".8" width="13" x="5.5" y="7.5" />
      {carry
        ? <g><rect fill="#d9b48f" height="2.6" rx="1.3" width="8" x="14" y="13" /><rect fill="#8b6a3c" height="3" rx=".5" width="22" x="10" y="10" /></g>
        : (
          <g className="worker-arm">
            <rect fill="#d9b48f" height="8" rx="1.3" width="2.6" x="16" y="13" />
            <rect fill="#8b6a3c" height="7" width="1.6" x="17.3" y="8" />
            <rect fill="#3a3a3a" height="3" rx="1" width="7" x="14.5" y="6" />
          </g>
        )}
    </svg>
  )
}

export default function Build({ children, delay = 0 }) {
  return (
    <div className="build" style={{ '--delay': `${delay}s` }}>
      <div className="build-content">{children}</div>
      <div aria-hidden="true" className="build-crew">
        <Worker style={{ left: '6%' }} />
        <Worker carry style={{ left: '40%' }} />
        <Worker style={{ left: '84%', animationDelay: '-.2s' }} />
        <i className="smoke" style={{ left: '10%' }} />
        <i className="smoke" style={{ left: '86%', animationDelay: '-.9s' }} />
        <i className="smoke" style={{ left: '50%', animationDelay: '-1.4s' }} />
        <i className="wind" style={{ top: '30%' }} />
        <i className="wind" style={{ top: '70%', animationDelay: '-1.3s' }} />
      </div>
    </div>
  )
}
