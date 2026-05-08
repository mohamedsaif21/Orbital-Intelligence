'use client'

const METRICS = [
  { label: 'Objects detected', value: '18', tone: '#0EA5E9' },
  { label: 'Confidence', value: '96.2%', tone: '#22C55E' },
  { label: 'Review queue', value: '4', tone: '#F59E0B' },
]

export default function DetectionPage() {
  return (
    <section
      style={{
        flex: 1,
        minWidth: 0,
        background: 'linear-gradient(180deg, #0A0F1A 0%, #0D1117 100%)',
        borderLeft: '1px solid #1E293B',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflow: 'auto',
      }}
    >
      <div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: '#334155', marginBottom: 6 }}>
          DETECTION WORKSPACE
        </div>
        <h2 style={{ fontSize: 24, color: '#E2E8F0', margin: 0 }}>
          Satellite change detection pipeline
        </h2>
        <p style={{ marginTop: 8, color: '#94A3B8', fontSize: 12, lineHeight: 1.7, maxWidth: 720 }}>
          Compare imagery, validate land-cover changes, and prepare review-ready findings for the dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {METRICS.map(metric => (
          <div
            key={metric.label}
            style={{
              background: '#111827',
              border: '1px solid #1E293B',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 1.2, color: '#64748B', marginBottom: 10 }}>
              {metric.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: metric.tone }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 260,
          border: '1px solid #1E293B',
          borderRadius: 16,
          background: 'radial-gradient(circle at top left, rgba(14,165,233,0.15), transparent 36%), #0B1220',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: '#475569', marginBottom: 10 }}>
            REVIEW STAGE
          </div>
          <div style={{ fontSize: 18, color: '#E2E8F0', fontWeight: 700, marginBottom: 8 }}>
            Current analysis snapshot
          </div>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: 12, lineHeight: 1.7, maxWidth: 760 }}>
            This panel is a dedicated landing area for the detection workflow. Hook your analysis widgets,
            imagery comparison, or backend inference results into this space.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #0EA5E9',
              background: '#0EA5E9',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            RUN DETECTION
          </button>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #334155',
              background: 'transparent',
              color: '#E2E8F0',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            VIEW RESULTS
          </button>
        </div>
      </div>
    </section>
  )
}
