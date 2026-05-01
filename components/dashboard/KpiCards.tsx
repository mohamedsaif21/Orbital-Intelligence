'use client'
const CARDS = [
  { label: 'LAND MONITORED', value: '1,240', unit: 'Ha',  icon: '🌍', delta: null },
  { label: 'ENCROACHMENTS',  value: '08',    unit: '',    icon: '⚠',  delta: '↓12%', dc: '#22C55E' },
  { label: 'VERIFIED CASES', value: '05',    unit: '',    icon: '📋', delta: null },
  { label: 'ACTION TAKEN',   value: '88%',   unit: '',    icon: '✅', delta: null },
]

export default function KpiCards() {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #1E293B', flexShrink: 0 }}>
      {CARDS.map((c, i) => (
        <div key={i} style={{
          flex: 1, padding: '14px 20px', background: '#0D1117',
          borderRight: i < 3 ? '1px solid #1E293B' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: 1, color: '#475569' }}>{c.label}</span>
            <div style={{
              width: 32, height: 32, background: '#1E293B', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>{c.icon}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#E2E8F0' }}>{c.value}</span>
            {c.unit && <span style={{ fontSize: 12, color: '#475569' }}>{c.unit}</span>}
            {c.delta && <span style={{ fontSize: 12, color: c.dc! }}>{c.delta}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}