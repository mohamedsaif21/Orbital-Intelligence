'use client'

import { useState, useEffect } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
export interface LandParcel {
  id: string
  name: string
  survey_number: string
  district: string
  taluk: string
  area_sqm: number
  area_acres: number
  land_type: string
  department?: string
  status: string
  last_verified?: string
  coordinates: [number, number][]
  center: [number, number]
  // encroached fields
  encroached_by?: string
  encroachment_type?: string
  severity?: string
  detected_date?: string
  ndvi_drop?: number
  confidence?: number
  parent_land_id?: string
}

interface LandsData {
  government: LandParcel[]
  encroached: LandParcel[]
  total_government: number
  total_encroached: number
}

interface Props {
  onSelectLand: (land: LandParcel, type: 'government' | 'encroached') => void
  selectedId: string | null
}

// ── Severity badge ─────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null
  const cfg: Record<string, { bg: string; color: string }> = {
    HIGH:   { bg: '#7F1D1D', color: '#FCA5A5' },
    MEDIUM: { bg: '#78350F', color: '#FCD34D' },
    LOW:    { bg: '#14532D', color: '#86EFAC' },
  }
  const c = cfg[severity] ?? cfg.LOW
  return (
    <span style={{
      fontSize: 9, padding: '1px 6px', borderRadius: 2,
      background: c.bg, color: c.color,
      fontWeight: 700, letterSpacing: 0.5, flexShrink: 0,
    }}>
      {severity}
    </span>
  )
}

// ── Single land row ────────────────────────────────────────────────────────
function LandRow({
  land,
  type,
  isSelected,
  index,
  total,
  onClick,
}: {
  land: LandParcel
  type: 'government' | 'encroached'
  isSelected: boolean
  index: number
  total: number
  onClick: () => void
}) {
  const isGovt = type === 'government'
  const accentColor = isGovt ? '#22C55E' : '#EF4444'

  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 14px',
        borderBottom: '1px solid #1E293B',
        cursor: 'pointer',
        background: isSelected ? '#1E293B' : 'transparent',
        borderLeft: isSelected
          ? `2px solid ${accentColor}`
          : '2px solid transparent',
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      {/* Top row: index + name + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
        <span style={{
          fontSize: 9, color: isSelected ? accentColor : '#334155',
          fontWeight: 700, minWidth: 20, marginTop: 1, flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#E2E8F0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 2,
          }}>
            {land.name}
          </div>
          <div style={{
            fontSize: 10, color: '#475569',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {land.district} · {land.taluk}
          </div>
        </div>
        {!isGovt && <SeverityBadge severity={land.severity} />}
      </div>

      {/* Bottom row: survey number + area */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginLeft: 28,
      }}>
        <span style={{ fontSize: 9, color: '#334155', letterSpacing: 0.5 }}>
          {land.survey_number}
        </span>
        <span style={{ fontSize: 9, color: '#475569' }}>
          {land.area_acres} ac
        </span>
      </div>

      {/* Encroachment details if applicable */}
      {!isGovt && land.encroachment_type && (
        <div style={{
          marginLeft: 28, marginTop: 4,
          fontSize: 9, color: '#EF4444', letterSpacing: 0.3,
        }}>
          {land.encroachment_type}
          {land.confidence !== undefined && (
            <span style={{ color: '#475569', marginLeft: 6 }}>
              {land.confidence}% conf
            </span>
          )}
        </div>
      )}

      {/* Selected indicator arrow */}
      {isSelected && (
        <div style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)',
          color: accentColor, fontSize: 12,
        }}>
          ›
        </div>
      )}
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, color: '#334155', textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>◫</div>
      <div style={{ fontSize: 11, letterSpacing: 1 }}>{message}</div>
    </div>
  )
}

// ── Main LandPanel ─────────────────────────────────────────────────────────
export default function LandPanel({ onSelectLand, selectedId }: Props) {
  const [tab,     setTab]     = useState<'government' | 'encroached'>('government')
  const [data,    setData]    = useState<LandsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [search,  setSearch]  = useState('')

  // ── Fetch land data from backend ─────────────────────────────────────────
  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetch(`${BASE}/api/lands`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: LandsData) => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        if (controller.signal.aborted) return
        setError('Backend offline — cannot load land data')
        setLoading(false)
      })
    return () => controller.abort()
  }, [])

  // ── Filter by search ─────────────────────────────────────────────────────
  const currentList = tab === 'government'
    ? (data?.government ?? [])
    : (data?.encroached ?? [])

  const filtered = search.trim().length > 0
    ? currentList.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.district.toLowerCase().includes(search.toLowerCase()) ||
        l.survey_number.toLowerCase().includes(search.toLowerCase())
      )
    : currentList

  return (
    <div style={{
      width: 260,
      background: '#0D1117',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px 0',
        borderBottom: '1px solid #1E293B',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#0EA5E9', boxShadow: '0 0 5px #0EA5E9',
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: 1, color: '#E2E8F0',
            }}>
              LAND REGISTRY
            </span>
          </div>
          <span style={{ fontSize: 9, color: '#334155' }}>
            {data
              ? `${data.total_government + data.total_encroached} parcels`
              : '—'}
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {(['government', 'encroached'] as const).map(t => {
            const count = t === 'government'
              ? data?.total_government
              : data?.total_encroached
            const isActive = tab === t
            const color = t === 'government' ? '#22C55E' : '#EF4444'
            return (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch('') }}
                style={{
                  flex: 1, padding: '7px 4px',
                  border: 'none', cursor: 'pointer',
                  background: 'transparent',
                  borderBottom: isActive
                    ? `2px solid ${color}`
                    : '2px solid transparent',
                  color: isActive ? '#E2E8F0' : '#475569',
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: 1, fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'government' ? 'GOVT LAND' : 'ENCROACHED'}
                {count !== undefined && (
                  <span style={{
                    marginLeft: 5, fontSize: 9,
                    color: isActive ? color : '#334155',
                  }}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid #1E293B', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#0F172A', border: '1px solid #1E293B',
          borderRadius: 4, padding: '5px 8px',
        }}>
          <span style={{ fontSize: 11, color: '#334155' }}>⌕</span>
          <input
            type="text"
            placeholder="Search land, district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'none', border: 'none',
              color: '#E2E8F0', fontSize: 11, outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none',
                color: '#475569', cursor: 'pointer', fontSize: 12, padding: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tab colour legend */}
      <div style={{
        padding: '6px 14px',
        borderBottom: '1px solid #1E293B',
        display: 'flex', gap: 12, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 1, background: '#22C55E' }} />
          <span style={{ fontSize: 9, color: '#475569' }}>Government safe</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 1, background: '#EF4444' }} />
          <span style={{ fontSize: 9, color: '#475569' }}>Encroached</span>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 32, gap: 10,
          }}>
            <div style={{
              width: 24, height: 24, border: '2px solid #1E293B',
              borderTop: '2px solid #0EA5E9', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 10, color: '#334155', letterSpacing: 1 }}>
              LOADING PARCELS…
            </span>
          </div>
        )}

        {error && (
          <div style={{
            margin: 12, padding: '10px 12px',
            background: '#7F1D1D', border: '1px solid #EF4444',
            borderRadius: 4, fontSize: 10, color: '#FCA5A5', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            message={search ? 'No matching parcels' : 'No parcels loaded'}
          />
        )}

        {!loading && !error && filtered.map((land, i) => (
          <LandRow
            key={land.id}
            land={land}
            type={tab}
            isSelected={selectedId === land.id}
            index={i}
            total={filtered.length}
            onClick={() => onSelectLand(land, tab)}
          />
        ))}
      </div>

      {/* Footer: selected land mini info */}
      {selectedId && data && (
        (() => {
          const all = [...(data.government ?? []), ...(data.encroached ?? [])]
          const sel = all.find(l => l.id === selectedId)
          if (!sel) return null
          const isEnc = sel.id.startsWith('EL')
          return (
            <div style={{
              padding: '8px 14px',
              borderTop: '1px solid #1E293B',
              background: '#0F172A', flexShrink: 0,
            }}>
              <div style={{
                fontSize: 9, color: '#334155',
                letterSpacing: 1, marginBottom: 4,
              }}>
                VIEWING
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: isEnc ? '#EF4444' : '#22C55E',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {sel.name}
              </div>
              <div style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>
                {sel.district} · {sel.area_acres} acres ·{' '}
                <span style={{ color: isEnc ? '#EF4444' : '#22C55E' }}>
                  {isEnc ? 'ENCROACHED' : 'SAFE'}
                </span>
              </div>
            </div>
          )
        })()
      )}
    </div>
  )
}