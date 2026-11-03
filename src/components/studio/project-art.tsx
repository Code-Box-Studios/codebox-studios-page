export type ProjectKind = 'operations' | 'commerce' | 'dashboard' | 'system'

export function ProjectArt({ kind }: { kind: ProjectKind }) {
  if (kind === 'commerce')
    return (
      <div className="mockup shop-mock" aria-hidden>
        <div className="mock-top">
          <span className="mock-brand">FORM &amp; FIELD</span>
          <span>Shop &nbsp; Our story &nbsp; Bag (0)</span>
        </div>
        <div className="shop-title">
          Everyday objects.
          <br />
          Considered differently.
        </div>
        <div className="shop-products">
          {[0, 1, 2].map((i) => (
            <div className="shop-product" key={i}>
              <div className="bottle" />
            </div>
          ))}
        </div>
      </div>
    )

  if (kind === 'system')
    return (
      <div className="design-system" aria-hidden>
        <div className="design-wordmark">
          Assembly<span>Design foundations / v.01</span>
        </div>
        <div className="design-components">
          <div className="type-specimen">
            Aa
            <span>
              Made to work.
              <br />
              Built to belong.
            </span>
          </div>
          <div className="component-specimen">
            <div className="swatches">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} />
              ))}
            </div>
            <div className="demo-cta">
              Start something <span>↗</span>
            </div>
            <div className="demo-input">
              Your next big idea <span>⌘ K</span>
            </div>
            <div className="demo-tags">
              <span>Composable</span>
              <span>Accessible</span>
            </div>
          </div>
        </div>
        <div className="design-tokens">
          SPACE / 08 &nbsp; 16 &nbsp; 24 &nbsp; 32 &nbsp; 64 <span>THOUGHTFULLY CONNECTED.</span>
        </div>
      </div>
    )

  const dashboard = kind === 'dashboard'
  return (
    <div className={`mockup ${dashboard ? 'dashboard-mock' : ''}`} aria-hidden>
      <div className="mock-top">
        <span className="mock-brand">{dashboard ? '▧ Clarity' : '▣ Orbit / Workspace'}</span>
        <span className="mock-dots">•••</span>
      </div>
      <div className="mock-layout">
        <div className="mock-sidebar">
          {(dashboard
            ? ['Workspace', 'Analytics', 'Activity', 'Reports']
            : ['Overview', 'Schedule', 'Projects', 'Team', 'Settings']
          ).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="mock-main">
          <h4>{dashboard ? 'A clearer view of your business.' : 'Everything, in its place.'}</h4>
          <p>{dashboard ? 'Illustrative analytics interface' : 'Your team’s week, at a glance.'}</p>
          {dashboard ? (
            <div className="chart">
              {[34, 54, 43, 68, 62, 86, 76, 96].map((height, i) => (
                <span key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          ) : (
            <>
              <div className="calendar-head">
                {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {[
                  'Discover',
                  '',
                  'Design review',
                  '',
                  'Handoff',
                  '',
                  'Architecture',
                  '',
                  'Build',
                  '',
                  'Planning',
                  '',
                  'Prototype',
                  '',
                  'Ship',
                ].map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
