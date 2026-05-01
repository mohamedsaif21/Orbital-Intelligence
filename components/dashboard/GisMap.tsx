'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Alert, SEVERITY_CONFIG } from './types'

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

interface Props {
  alerts?: Alert[]
  selected?: Alert | null
  onSelect?: (a: Alert) => void
}

// ── Slide-to-verify slider ─────────────────────────────────────────────────
function VerifySlider() {
  const [value, setValue] = useState(0)
  const [locked, setLocked] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    setValue(v)
    if (v >= 95) {
      setLocked(true)
      setTimeout(() => { setValue(0); setLocked(false) }, 2000)
    }
  }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(13, 17, 23, 0.88)',
      borderTop: '1px solid #1E293B',
      padding: '10px 16px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 6, fontSize: 10,
      }}>
        <span style={{ color: '#475569' }}>SENS-A (MAR 10)</span>
        <span style={{ color: '#0EA5E9', fontWeight: 700 }}>SENS-B (TODAY)</span>
      </div>

      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0,
          height: 4, background: '#1E293B', borderRadius: 2,
        }} />
        <div style={{
          position: 'absolute', left: 0,
          height: 4, width: `${value}%`,
          background: locked ? '#22C55E' : '#0EA5E9',
          borderRadius: 2, transition: 'background 0.3s',
        }} />
        <input
          type="range" min={0} max={100} step={1} value={value}
          onChange={handleChange}
          style={{
            position: 'absolute', left: 0, right: 0, width: '100%',
            appearance: 'none', background: 'transparent', cursor: 'pointer',
            height: 20,
          } as any}
        />
      </div>

      <div style={{
        textAlign: 'center', fontSize: 9, letterSpacing: 1,
        color: locked ? '#22C55E' : '#334155',
        marginTop: 5, transition: 'color 0.3s',
      }}>
        {locked ? '✓ ENCROACHMENT EXPANSION VERIFIED' : 'SLIDE TO VERIFY ENCROACHMENT EXPANSION'}
      </div>
    </div>
  )
}

// ── Map zoom controls ──────────────────────────────────────────────────────
function MapControls({ onZoomIn, onZoomOut, onReset }: {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}) {
  const btn = (label: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        width: 32, height: 32,
        background: 'rgba(13,17,23,0.9)',
        border: '1px solid #1E293B',
        borderRadius: 4, cursor: 'pointer',
        color: '#94A3B8', fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'inherit',
        transition: 'background 0.15s',
        padding: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,17,23,0.9)')}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      position: 'absolute', top: 14, left: 14, zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {btn('+', onZoomIn)}
      {btn('−', onZoomOut)}
      {btn('◎', onReset)}
    </div>
  )
}

// ── Main map ───────────────────────────────────────────────────────────────
function GisMapContent({ 
  alerts = MOCK_ALERTS, 
  selected = null, 
  onSelect = () => {} 
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapReady, setMapReady] = useState(false)

  const CENTER: [number, number] = [11.127, 78.657]
  const DEFAULT_ZOOM = 7

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled) return

      // Prevent double-initialization in React StrictMode
      if (instanceRef.current) return
      if ((mapRef.current as any)._leaflet_map) {
        instanceRef.current = (mapRef.current as any)._leaflet_map
        return
      }
      if ((mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id
      }

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      try {
        const map = L.map(mapRef.current!, {
          zoomControl: false,
          attributionControl: false,
        }).setView(CENTER, DEFAULT_ZOOM)

        instanceRef.current = map

        // ESRI satellite layer
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18 }
        ).addTo(map)

        // Reference layer overlay
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18, opacity: 0.4 }
        ).addTo(map)

        // Add markers
        alerts.forEach((alert) => {
          if (!alert.lat || !alert.lon) return

          const color = SEVERITY_CONFIG[alert.severity].color

          const iconHtml = `
            <div style="position: relative; width: 20px; height: 20px;">
              <div style="
                width: 14px; height: 14px;
                border-radius: 50%;
                background: ${color};
                border: 2px solid rgba(255,255,255,0.8);
                box-shadow: 0 0 10px ${color}88;
                position: absolute;
                top: 3px; left: 3px;
              "></div>
              <div style="
                width: 20px; height: 20px;
                border-radius: 50%;
                border: 1px solid ${color}55;
                position: absolute;
                top: 0; left: 0;
                animation: pulse 2s infinite;
              "></div>
            </div>
          `

          const icon = L.divIcon({
            className: '',
            html: iconHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          const marker = L.marker([alert.lat, alert.lon], { icon })
            .addTo(map)
            .on('click', () => onSelect(alert))

          markersRef.current.push({ id: alert.id, marker })
        })

        setMapReady(true)
      } catch (err) {
        console.error('Failed to initialize map:', err)
      }
    })

    return () => {
      cancelled = true
      instanceRef.current?.remove()
      instanceRef.current = null
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id
      }
      markersRef.current = []
    }
  }, [])

  function zoomIn()  { instanceRef.current?.zoomIn() }
  function zoomOut() { instanceRef.current?.zoomOut() }
  function reset()   { instanceRef.current?.setView(CENTER, DEFAULT_ZOOM) }

  // Pan to selected alert
  useEffect(() => {
    if (!instanceRef.current || !selected?.lat || !selected?.lon) return
    instanceRef.current.flyTo([selected.lat, selected.lon], 10, {
      duration: 1.2,
      easeLinearity: 0.25,
    })
  }, [selected?.id])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0A0F1A' }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <style>{`
        @keyframes pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          50%  { transform: scale(1.8); opacity: 0.1; }
          100% { transform: scale(1);   opacity: 0.6; }
        }
        .leaflet-container { background: #0A0F1A !important; }
      `}</style>

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {!mapReady && (
        <div style={{
          position: 'absolute', inset: 0, background: '#0A0F1A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, border: '2px solid #1E293B',
            borderTop: '2px solid #0EA5E9', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 10, color: '#334155', letterSpacing: 2 }}>
            LOADING SATELLITE FEED…
          </span>
        </div>
      )}

      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} />

      {selected && (
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 1000,
          background: 'rgba(13,17,23,0.9)',
          border: '1px solid #1E293B',
          borderRadius: 4, padding: '8px 12px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ fontSize: 9, color: '#475569', marginBottom: 4, letterSpacing: 1 }}>
            TRACKING
          </div>
          <div style={{ fontSize: 11, color: '#0EA5E9', fontWeight: 700 }}>
            {selected.code}
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
            {selected.gpsLat} / {selected.gpsLon}
          </div>
        </div>
      )}

      <VerifySlider />
    </div>
  )
}

// Export GisMapContent directly since we're in a client component
export default GisMapContent