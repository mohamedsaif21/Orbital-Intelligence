'use client'

import { Alert, SEVERITY_CONFIG, normalizeSeverity } from './types'

// ── Mock alerts data ────────────────────────────────────────────────────────
const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    severity: 'CRITICAL',
    code: 'ENCROACHMENT-042',
    zone: 'Sector 7, Plot 42',
    time: '14:32',
    img: '🏗️',
    lat: 11.2588,
    lon: 78.6588,
    gpsLat: '11.2588° N',
    gpsLon: '78.6588° E',
    landCover: '+18',
    confidence: 94,
  },
  {
    id: 2,
    severity: 'WARNING',
    code: 'ILLEGAL-LAND-USE-19',
    zone: 'Zone B, Grid 19',
    time: '09:15',
    img: '🌾',
    lat: 11.1524,
    lon: 78.7041,
    gpsLat: '11.1524° N',
    gpsLon: '78.7041° E',
    landCover: '+8',
    confidence: 72,
  },
  {
    id: 3,
    severity: 'INFO',
    code: 'DISPUTE-RESOLVED-88',
    zone: 'Northern Territory, Lot 88',
    time: '16:45',
    img: '✅',
    lat: 11.3204,
    lon: 78.5592,
    gpsLat: '11.3204° N',
    gpsLon: '78.5592° E',
    landCover: '-12',
    confidence: 88,
  },
]

// ── Trend bar chart ─────────────────────────────────────────────────────────
const TREND = [3, 5, 4, 8, 6, 11, 9, 14, 10, 8, 12, 15, 13, 7]

function TrendChart() {
  const max = Math.max(...TREND)
  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid #1E293B' }}>
      <div style={{
        fontSize: 9, letterSpacing: 1, color: '#475569',
        marginBottom: 8, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ENCROACHMENTS TREND (7D)</span>
        <span style={{ color: '#0EA5E9' }}>↑ 8.3%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52 }}>
        {TREND.map((v, i) => {
          const isLast = i === TREND.length - 1
          const height = Math.round((v / max) * 100)
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}%`,
                background: isLast ? '#0EA5E9' : '#1E4976',
                borderRadius: '2px 2px 0 0',
                transition: 'background 0.2s',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ── Alert row ───────────────────────────────────────────────────────────────
function AlertRow({
  alert,
  isSelected,
  onClick,
}: {
  alert: Alert
  isSelected: boolean
  onClick: () => void
}) {
  const sev = SEVERITY_CONFIG[normalizeSeverity(alert.severity)] ?? SEVERITY_CONFIG.INFO

  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderBottom: '1px solid #1E293B',
        cursor: 'pointer',
        background: isSelected ? '#1E293B' : 'transparent',
        borderLeft: isSelected ? '2px solid #0EA5E9' : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Thumbnail */}
        <div style={{
          width: 52, height: 42, borderRadius: 4,
          overflow: 'hidden', background: '#0F172A', flexShrink: 0,
          border: `1px solid ${isSelected ? '#0EA5E9' : '#1E293B'}`,
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            opacity: 0.95,
          }}>
            {alert.img}
          </div>
        </div>

        {/* Content */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{
              fontSize: 9, padding: '2px 6px', borderRadius: 2,
              background: sev.bg, color: sev.text,
              fontWeight: 700, letterSpacing: 0.5,
            }}>
              {sev.label}
            </span>
            <span style={{ fontSize: 9, color: '#334155' }}>{alert.time}</span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#E2E8F0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 2,
          }}>
            {alert.code}
          </div>
          <div style={{
            fontSize: 10, color: '#475569',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {alert.zone}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main AlertFeed ──────────────────────────────────────────────────────────
interface Props {
  alerts?: Alert[]
  selected?: Alert | null
  onSelect?: (a: Alert) => void
  countdown?: number
}

export default function AlertFeed({ 
  alerts = MOCK_ALERTS, 
  selected = null, 
  onSelect = () => {}, 
  countdown = 5 
}: Props) {
  return (
    <div style={{
      width: 280,
      background: '#0D1117',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#EF4444',
            boxShadow: '0 0 6px #EF4444',
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#E2E8F0' }}>
            LIVE ALERT FEED
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: 9, color: '#475569', letterSpacing: 0.5 }}>
            AUTO-REFRESH: {countdown}s
          </span>
        </div>
      </div>

      {/* Alert list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alerts.map((alert) => (
          <AlertRow
            key={alert.id}
            alert={alert}
            isSelected={selected?.id === alert.id}
            onClick={() => onSelect(alert)}
          />
        ))}
      </div>

      {/* Trend chart */}
      <TrendChart />
    </div>
  )
}