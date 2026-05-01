import { useState } from 'react'
import { Alert } from './types'

// ── Animated confidence ring ────────────────────────────────────────────────
function ConfidenceRing({ value }: { value: number }) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const filled = (value / 100) * circumference

  const color =
    value >= 90 ? '#0EA5E9' :
    value >= 70 ? '#F59E0B' : '#EF4444'

  const textColor =
    value >= 90 ? '#0EA5E9' :
    value >= 70 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
      <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="38" cy="38" r={radius}
          fill="none" stroke="#1E293B" strokeWidth="5"
        />
        {/* Filled arc */}
        <circle
          cx="38" cy="38" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: textColor, lineHeight: 1 }}>
          {value.toFixed(1)}
        </span>
        <span style={{ fontSize: 8, color: '#475569', marginTop: 1 }}>%</span>
      </div>
    </div>
  )
}

// ── Toggle switch ───────────────────────────────────────────────────────────
function Toggle({ label, state, onChange }: { label: string; state: boolean; onChange: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 0', borderBottom: '1px solid #1E293B',
    }}>
      <span style={{ fontSize: 10, color: '#64748B', letterSpacing: 0.5 }}>{label}</span>
      <div
        onClick={onChange}
        style={{
          width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
          background: state ? '#0EA5E9' : '#1E293B',
          position: 'relative', transition: 'background 0.25s',
          border: `1px solid ${state ? '#0EA5E9' : '#334155'}`,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: state ? '#fff' : '#475569',
          position: 'absolute', top: 2,
          left: state ? 18 : 2,
          transition: 'left 0.25s, background 0.25s',
        }} />
      </div>
    </div>
  )
}

// ── Data field ─────────────────────────────────────────────────────────────
function DataField({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: '#0F172A', border: '1px solid #1E293B',
      borderRadius: 4, padding: '8px 12px',
    }}>
      <div style={{ fontSize: 9, color: '#475569', marginBottom: 3, letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{
        fontSize: 12, fontWeight: accent ? 700 : 400,
        color: accent ? '#E2E8F0' : '#94A3B8',
      }}>
        {value}
      </div>
    </div>
  )
}

// ── Action button ──────────────────────────────────────────────────────────
function ActionButton({
  label,
  variant = 'ghost',
  onClick,
}: {
  label: string
  variant?: 'primary' | 'ghost' | 'outline'
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: hover ? '#38BDF8' : '#0EA5E9',
      border: 'none',
      color: '#fff',
    },
    ghost: {
      background: hover ? '#1E293B' : 'transparent',
      border: '1px solid #1E293B',
      color: hover ? '#E2E8F0' : '#64748B',
    },
    outline: {
      background: 'transparent',
      border: '1px solid #0EA5E9',
      color: '#0EA5E9',
    },
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '10px 0',
        borderRadius: 4, cursor: 'pointer',
        fontSize: 11, fontWeight: 700, letterSpacing: 1,
        fontFamily: 'inherit', transition: 'all 0.2s',
        ...styles[variant],
      }}
    >
      {label}
    </button>
  )
}

// ── Main DecisionPanel ─────────────────────────────────────────────────────
interface Props {
  alert?: Alert | null
  onClose?: () => void
}

export default function DecisionPanel({ alert, onClose = () => {} }: Props) {
  const [aiLayer,   setAiLayer]   = useState(true)
  const [cadastral, setCadastral] = useState(false)
  const [status, setStatus]       = useState<'idle' | 'verified' | 'dismissed'>('idle')

  if (!alert) {
    return (
      <div style={{
        width: 280,
        background: '#0D1117',
        borderLeft: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#475569',
        fontSize: 11,
        textAlign: 'center',
        padding: 20,
      }}>
        Select an alert to view details
      </div>
    )
  }

  const isPositiveShift = alert.landCover?.startsWith('+') ?? false
  const confidence = alert.confidence ?? 75
  const landCoverText = alert.landCover ? `${alert.landCover}%` : 'N/A'

  const confidenceText =
    confidence >= 90
      ? 'High confidence detection of non-permitted structural expansion.'
      : confidence >= 70
      ? 'Medium confidence. Manual field verification recommended.'
      : 'Low confidence. Possible false positive — review imagery.'

  function handleVerify() {
    setStatus('verified')
  }

  function handleDismiss() {
    setStatus('dismissed')
  }

  return (
    <div style={{
      width: 280,
      background: '#0D1117',
      borderLeft: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#E2E8F0' }}>
            DECISION SUPPORT
          </div>
          <div style={{ fontSize: 9, color: '#334155', marginTop: 2, letterSpacing: 0.5 }}>
            {alert.code}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none',
            color: '#334155', cursor: 'pointer', fontSize: 14,
            padding: 4, borderRadius: 3,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>

        {/* Status banner if action taken */}
        {status !== 'idle' && (
          <div style={{
            padding: '8px 10px', borderRadius: 4, marginBottom: 12,
            background: status === 'verified' ? '#14532D' : '#1C1917',
            border: `1px solid ${status === 'verified' ? '#16A34A' : '#44403C'}`,
            fontSize: 10, color: status === 'verified' ? '#86EFAC' : '#A8A29E',
            fontWeight: 700, letterSpacing: 0.5,
          }}>
            {status === 'verified' ? '✓ CASE VERIFIED — FORWARDED TO AUTHORITY' : '✕ MARKED AS FALSE POSITIVE'}
          </div>
        )}

        {/* Target data */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: 1, color: '#334155', marginBottom: 8 }}>
            TARGET DATA
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <DataField label="GPS LAT"  value={alert.gpsLat || 'N/A'} />
            <DataField label="GPS LONG" value={alert.gpsLon || 'N/A'} />
          </div>
          <div style={{
            background: '#0F172A', border: '1px solid #1E293B',
            borderRadius: 4, padding: '8px 12px',
          }}>
            <div style={{ fontSize: 9, color: '#475569', marginBottom: 4, letterSpacing: 0.5 }}>
              LAND COVER SHIFT
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{
                fontSize: 22, fontWeight: 700,
                color: isPositiveShift ? '#EF4444' : '#22C55E',
              }}>
                {landCoverText}
              </span>
              <span style={{ fontSize: 10, color: '#475569' }}>
                {isPositiveShift ? '▲ expansion' : '▼ reduction'}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence score */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: 1, color: '#334155', marginBottom: 8 }}>
            AI CONFIDENCE SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ConfidenceRing value={confidence} />
            <p style={{
              fontSize: 11, color: '#64748B',
              lineHeight: 1.55, margin: 0,
            }}>
              {confidenceText}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ marginBottom: 14 }}>
          <Toggle
            label="AI PREDICTION LAYER"
            state={aiLayer}
            onChange={() => setAiLayer(!aiLayer)}
          />
          <Toggle
            label="CADASTRAL OVERLAYS"
            state={cadastral}
            onChange={() => setCadastral(!cadastral)}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ActionButton
            label="VERIFY CASE"
            variant="primary"
            onClick={handleVerify}
          />
          <ActionButton
            label="MARK AS FALSE POSITIVE"
            variant="ghost"
            onClick={handleDismiss}
          />
          <ActionButton
            label="SEND NOTICE"
            variant="ghost"
          />
        </div>
      </div>
    </div>
  )
}