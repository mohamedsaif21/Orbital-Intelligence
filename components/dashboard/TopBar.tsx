'use client'
const TABS = ['TELEMETRY', 'ASSETS', 'REPORTS', 'SETTINGS']

export default function TopBar({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <header style={{
      height: 52, background: '#0D1117', borderBottom: '1px solid #1E293B',
      display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: 0,
    }}>
      {/* Logo */}
      <div style={{
        width: 220, height: '100%', display: 'flex', alignItems: 'center',
        padding: '0 20px', borderRight: '1px solid #1E293B', flexShrink: 0,
      }}>
        <div style={{ width: 28, height: 28, background: '#0EA5E9', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14, marginRight: 10 }}>O</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', letterSpacing: 2 }}>ORBITAL</div>
          <div style={{ fontSize: 9, color: '#475569', letterSpacing: 2 }}>INTELLIGENCE</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', height: '100%' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActive(tab)} style={{
            padding: '0 22px', height: '100%', border: 'none', cursor: 'pointer',
            background: active === tab ? '#1E293B' : 'transparent',
            borderBottom: active === tab ? '2px solid #0EA5E9' : '2px solid transparent',
            color: active === tab ? '#E2E8F0' : '#475569',
            fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: 'inherit',
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: '1px solid #1E293B', borderRadius: 4,
        padding: '0 12px', height: 30, marginRight: 12,
      }}>
        <span style={{ fontSize: 12, color: '#334155' }}>🔍</span>
        <span style={{ fontSize: 11, color: '#334155' }}>SEARCH SATELLITE ID...</span>
      </div>

      {/* Icons */}
      {['🔔', '👤'].map((icon, i) => (
        <div key={i} style={{
          width: 32, height: 32, background: '#1E293B', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: i === 0 ? 6 : 16, cursor: 'pointer', fontSize: 13,
        }}>{icon}</div>
      ))}
    </header>
  )
}