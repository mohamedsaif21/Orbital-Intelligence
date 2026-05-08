'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Alert } from '@/components/dashboard/types'
import TopBar        from '@/components/dashboard/TopBar'
import Sidebar       from '@/components/dashboard/Sidebar'
import KpiCards      from '@/components/dashboard/KpiCards'
import AlertFeed     from '@/components/dashboard/AlertFeed'
import DecisionPanel from '@/components/dashboard/DecisionPanel'
import DetectionPage from '../components/dashboard/DetectionPage'


const GisMap = dynamic(() => import('@/components/dashboard/GisMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      flex: 1, background: '#0A0F1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36,
        border: '2px solid #1E293B',
        borderTop: '2px solid #0EA5E9',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 10, color: '#334155', letterSpacing: 2 }}>
        INITIALISING MAP…
      </span>
    </div>
  ),
})

// ── Fallback mock data — used when backend is offline ─────────────────────
const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    code: 'Parcel #882-NORTH',
    zone: 'Lat: 11.127, Long: 78.657',
    severity: 'breach-critical',
    time: '2m ago',
    img: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=120&q=60',
    desc: 'Unauthorised structural expansion detected on government land parcel.',
    lat: 11.127, lon: 78.657,
    landCover: '+12.4',
    confidence: 98.4,
    gpsLat: '11.1271° N',
    gpsLon: '78.6569° E',
  },
  {
    id: 2,
    code: 'Zone-DELTA / Sector 4',
    zone: 'Vegetation index drop detected',
    severity: 'under-review',
    time: '14m ago',
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=120&q=60',
    desc: 'Significant vegetation loss. Possible agricultural encroachment.',
    lat: 11.55, lon: 79.20,
    landCover: '+7.1',
    confidence: 81.2,
    gpsLat: '11.5501° N',
    gpsLon: '79.2003° E',
  },
  {
    id: 3,
    code: 'Plot #114-ALPHA',
    zone: 'Routine maintenance verified',
    severity: 'cleared',
    time: '1h ago',
    img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=120&q=60',
    desc: 'Earthworks reviewed by field officer — no boundary violation found.',
    lat: 10.90, lon: 78.10,
    landCover: '-1.2',
    confidence: 62.0,
    gpsLat: '10.9012° N',
    gpsLon: '78.1034° E',
  },
]

export default function Home() {
  const [activeTab,  setActiveTab]  = useState('TELEMETRY')
  const [activeNav,  setActiveNav]  = useState('dashboard')
  const [alerts,     setAlerts]     = useState<Alert[]>(MOCK_ALERTS)
  const [selected,   setSelected]   = useState<Alert | null>(MOCK_ALERTS[0])
  const [panelOpen,  setPanelOpen]  = useState(true)
  const [countdown,  setCountdown]  = useState(59)
  const [apiStatus,  setApiStatus]  = useState<'connecting' | 'live' | 'offline'>('connecting')

  // ── Fetch real alerts from backend ──────────────────────────────────────
  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

    async function loadAlerts() {
      try {
        const res = await fetch(`${BASE}/api/alerts`, {
          // 3 second timeout — don't hang the UI if backend is down
          signal: AbortSignal.timeout(3000),
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()

        if (data.alerts && data.alerts.length > 0) {
          // Map backend field names to frontend Alert type
          const mapped: Alert[] = data.alerts.map((a: any) => ({
            id:         a.id,
            code:       a.code,
            zone:       a.zone,
            severity:   a.severity,
            time:       a.time,
            img:        a.img ?? 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=120&q=60',
            desc:       a.desc,
            lat:        a.lat,
            lon:        a.lon,
            landCover:  a.land_cover,   // backend uses snake_case
            confidence: a.confidence,
            gpsLat:     a.gps_lat,
            gpsLon:     a.gps_lon,
          }))
          setAlerts(mapped)
          setSelected(mapped[0])
          setApiStatus('live')
        }
      } catch (err) {
        // Backend offline — keep mock data, show offline indicator
        console.warn('Backend offline, using mock data:', err)
        setApiStatus('offline')
      }
    }

    loadAlerts()
  }, [])

  // ── Auto-refresh countdown ───────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          // Re-fetch on each countdown completion
          const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
          fetch(`${BASE}/api/alerts`, { signal: AbortSignal.timeout(3000) })
            .then(r => r.json())
            .then(data => {
              if (data.alerts?.length) {
                setAlerts(data.alerts.map((a: any) => ({
                  id: a.id, code: a.code, zone: a.zone,
                  severity: a.severity, time: a.time,
                  img: a.img ?? MOCK_ALERTS[0].img,
                  desc: a.desc, lat: a.lat, lon: a.lon,
                  landCover: a.land_cover, confidence: a.confidence,
                  gpsLat: a.gps_lat, gpsLon: a.gps_lon,
                })))
                setApiStatus('live')
              }
            })
            .catch(() => setApiStatus('offline'))
          return 59
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  function handleSelect(alert: Alert) {
    setSelected(alert)
    setPanelOpen(true)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', background: '#0D1117',
    }}>
      {/* API status indicator — top right corner */}
      <div style={{
        position: 'fixed', top: 8, right: 60, zIndex: 9999,
        fontSize: 9, letterSpacing: 1, padding: '3px 8px',
        borderRadius: 3, fontFamily: 'monospace',
        background: apiStatus === 'live'        ? '#14532D'
                  : apiStatus === 'offline'     ? '#7F1D1D'
                  : '#1E3A5F',
        color: apiStatus === 'live'             ? '#86EFAC'
             : apiStatus === 'offline'          ? '#FCA5A5'
             : '#7DD3FC',
      }}>
        {apiStatus === 'live'        ? '● API LIVE'
       : apiStatus === 'offline'     ? '● API OFFLINE — MOCK DATA'
       : '● CONNECTING…'}
      </div>

      <TopBar active={activeTab} setActive={setActiveTab} />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar active={activeNav} setActive={setActiveNav} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <KpiCards />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            {activeNav === 'dashboard' && (
              <>
                <AlertFeed
                  alerts={alerts}
                  selected={selected}
                  onSelect={handleSelect}
                  countdown={countdown}
                />
                <GisMap
                  alerts={alerts}
                  selected={selected}
                  onSelect={handleSelect}
                />
                {panelOpen && selected && (
                  <DecisionPanel
                    alert={selected}
                    onClose={() => setPanelOpen(false)}
                  />
                )}
              </>
            )}

            {activeNav === 'detection' && <DetectionPage />}
          </div>
        </main>
      </div>
    </div>
  )
}