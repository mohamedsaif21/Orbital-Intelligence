'use client'
const NAV = [
  { id: 'dashboard', label: 'DASHBOARD',   icon: '⊞' },
  { id: 'detection', label: 'DETECTION',    icon: '⊕' },
  { id: 'maplayers', label: 'MAP LAYERS',  icon: '◈' },
  { id: 'alertlog',  label: 'ALERT LOG',   icon: '⚠' },
  { id: 'analytics', label: 'ANALYTICS',   icon: '⩬' },
  { id: 'archived',  label: 'ARCHIVED',    icon: '◫' },
]

export default function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <aside style={{
      width: 220, background: '#0D1117', borderRight: '1px solid #1E293B',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%',
    }}>
      {/* Sentinel badge */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: '#1E293B', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>🛰</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0' }}>SENTINEL-1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 5px #22C55E' }} />
              <span style={{ fontSize: 9, color: '#22C55E', letterSpacing: 1 }}>ACTIVE MONITORING</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px', border: 'none', cursor: 'pointer',
            background: active === item.id ? '#1E293B' : 'transparent',
            borderLeft: active === item.id ? '2px solid #0EA5E9' : '2px solid transparent',
            color: active === item.id ? '#E2E8F0' : '#475569',
            fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #1E293B' }}>
        <button style={{
          width: '100%', padding: '10px 0', background: '#0EA5E9', border: 'none',
          borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 700,
          letterSpacing: 1, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16,
        }}>+ NEW REPORT</button>
        <div style={{ fontSize: 10, color: '#334155', marginBottom: 8 }}>⚙ SUPPORT</div>
        <div style={{ fontSize: 10, color: '#334155' }}>→ LOGOUT</div>
      </div>
    </aside>
  )
}