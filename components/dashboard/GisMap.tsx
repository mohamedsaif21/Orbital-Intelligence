'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Alert } from './types'
import { LandParcel } from './LandPanel'

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  alerts:            Alert[]
  selected:          Alert | null
  onSelect:          (a: Alert) => void
  selectedLand?:     LandParcel | null
  selectedLandType?: 'government' | 'encroached' | null
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL CSS ANIMATIONS  (injected once into <head>)
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  /* ── Leaflet base ─────────────────────────────────────────────────── */
  .leaflet-container { background: #0A0F1A !important; }

  /* ── Marching-ants border — government land (GREEN, slow) ─────────── */
  .poly-govt {
    animation: march-slow 2.4s linear infinite;
  }

  /* ── Marching-ants border — encroached land (RED, fast) ──────────── */
  .poly-enc {
    animation: march-fast 1.0s linear infinite;
  }

  @keyframes march-slow { to { stroke-dashoffset: -40; } }
  @keyframes march-fast { to { stroke-dashoffset: -40; } }

  /* ── Pulse ring on encroached corners ────────────────────────────── */
  .pulse-ring {
    animation: pulse-red 1.4s ease-out infinite;
  }
  @keyframes pulse-red {
    0%   { r: 8;  opacity: 0.9; }
    60%  { r: 18; opacity: 0.25; }
    100% { r: 24; opacity: 0; }
  }

  /* ── Alert marker pin ────────────────────────────────────────────── */
  .alert-pulse {
    animation: alert-glow 2s ease-in-out infinite;
  }
  @keyframes alert-glow {
    0%, 100% { box-shadow: 0 0 6px currentColor; }
    50%       { box-shadow: 0 0 18px currentColor; }
  }

  /* ── Popup skin ──────────────────────────────────────────────────── */
  .land-popup .leaflet-popup-content-wrapper {
    background:    #0D1117 !important;
    border:        1px solid #1E293B !important;
    border-radius: 6px !important;
    box-shadow:    0 10px 40px rgba(0,0,0,0.8) !important;
    padding:       0 !important;
  }
  .land-popup .leaflet-popup-content  { margin: 0 !important; }
  .land-popup .leaflet-popup-tip-container { display: none !important; }
  .land-popup .leaflet-popup-close-button  {
    color: #475569 !important;
    font-size: 16px !important;
    top: 6px !important; right: 8px !important;
  }

  /* ── Popup inner ─────────────────────────────────────────────────── */
  .lp-wrap   { font-family:'IBM Plex Mono',monospace; padding:14px 16px; min-width:220px; }
  .lp-type   { font-size:9px; font-weight:700; letter-spacing:1.2px; margin-bottom:6px; }
  .lp-name   { font-size:13px; font-weight:700; color:#E2E8F0; margin-bottom:8px; line-height:1.4; }
  .lp-row    { font-size:10px; color:#475569; margin-bottom:3px; }
  .lp-accent { color:#E2E8F0; }
  .lp-divider{ height:1px; background:#1E293B; margin:8px 0; }
  .lp-badge  { display:inline-block; font-size:9px; font-weight:700;
                padding:2px 7px; border-radius:2px; letter-spacing:.6px; }

  @keyframes spin { to { transform: rotate(360deg); } }
`

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Build the popup HTML for a government parcel */
function govtPopup(land: LandParcel): string {
  return `
    <div class="lp-wrap">
      <div class="lp-type" style="color:#22C55E">✓ GOVERNMENT PROTECTED LAND</div>
      <div class="lp-name">${land.name}</div>
      <div class="lp-divider"></div>
      <div class="lp-row">Survey №  <span class="lp-accent">${land.survey_number}</span></div>
      <div class="lp-row">District  <span class="lp-accent">${land.district}, ${land.taluk}</span></div>
      <div class="lp-row">Land type <span class="lp-accent">${land.land_type}</span></div>
      <div class="lp-row">Department<span class="lp-accent"> ${land.department ?? '—'}</span></div>
      <div class="lp-divider"></div>
      <div class="lp-row">Area      <span class="lp-accent">${land.area_acres} acres (${land.area_sqm.toLocaleString()} sqm)</span></div>
      <div class="lp-row">Verified  <span class="lp-accent">${land.last_verified ?? '—'}</span></div>
      <div style="margin-top:8px">
        <span class="lp-badge" style="background:#14532D;color:#86EFAC">STATUS: SAFE</span>
      </div>
    </div>`
}

/** Build the popup HTML for an encroached parcel */
function encPopup(land: LandParcel): string {
  const sevBg  = land.severity === 'HIGH' ? '#7F1D1D' : '#78350F'
  const sevCol = land.severity === 'HIGH' ? '#FCA5A5' : '#FCD34D'
  return `
    <div class="lp-wrap">
      <div class="lp-type" style="color:#EF4444">⚠ ENCROACHMENT DETECTED</div>
      <div class="lp-name">${land.name}</div>
      <div class="lp-divider"></div>
      <div class="lp-row">Survey №   <span class="lp-accent">${land.survey_number}</span></div>
      <div class="lp-row">District   <span class="lp-accent">${land.district}, ${land.taluk}</span></div>
      <div class="lp-row">Land type  <span class="lp-accent">${land.land_type}</span></div>
      <div class="lp-divider"></div>
      <div class="lp-row">Enc. type  <span class="lp-accent" style="color:#EF4444">${land.encroachment_type ?? '—'}</span></div>
      <div class="lp-row">Detected   <span class="lp-accent">${land.detected_date ?? '—'}</span></div>
      <div class="lp-row">NDVI drop  <span class="lp-accent" style="color:#F87171">-${land.ndvi_drop ?? '—'}</span></div>
      <div class="lp-row">Confidence <span class="lp-accent">${land.confidence ?? '—'}%</span></div>
      <div class="lp-row">Area       <span class="lp-accent">${land.area_acres} acres (${land.area_sqm.toLocaleString()} sqm)</span></div>
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
        <span class="lp-badge" style="background:${sevBg};color:${sevCol}">
          ${land.severity} RISK
        </span>
        <span class="lp-badge" style="background:#1E293B;color:#94A3B8">
          UNDER INVESTIGATION
        </span>
      </div>
    </div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY SLIDER
// ─────────────────────────────────────────────────────────────────────────────
function VerifySlider() {
  const [value,  setValue]  = useState(0)
  const [locked, setLocked] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    setValue(v)
    if (v >= 95) {
      setLocked(true)
      setTimeout(() => { setValue(0); setLocked(false) }, 2500)
    }
  }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(13,17,23,0.92)', borderTop: '1px solid #1E293B',
      padding: '10px 16px', backdropFilter: 'blur(4px)',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:10 }}>
        <span style={{ color:'#475569' }}>SENS-A (MAR 10)</span>
        <span style={{ color:'#0EA5E9', fontWeight:700 }}>SENS-B (TODAY)</span>
      </div>
      <div style={{ position:'relative', height:20, display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', left:0, right:0, height:4, background:'#1E293B', borderRadius:2 }} />
        <div style={{
          position:'absolute', left:0, height:4, width:`${value}%`,
          background: locked ? '#22C55E' : '#0EA5E9',
          borderRadius:2, transition:'background 0.3s',
        }} />
        <input type="range" min={0} max={100} step={1} value={value}
          onChange={handleChange}
          style={{
            position:'absolute', left:0, right:0, width:'100%',
            appearance:'none', background:'transparent',
            cursor:'pointer', height:20,
          }}
        />
      </div>
      <div style={{
        textAlign:'center', fontSize:9, letterSpacing:1, marginTop:5,
        color: locked ? '#22C55E' : '#334155', transition:'color 0.3s',
      }}>
        {locked ? '✓ ENCROACHMENT EXPANSION VERIFIED' : 'SLIDE TO VERIFY ENCROACHMENT EXPANSION'}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAND INFO CARD  (top-left overlay when a parcel is selected)
// ─────────────────────────────────────────────────────────────────────────────
function LandInfoCard({
  land,
  type,
  onClose,
}: {
  land: LandParcel
  type: 'government' | 'encroached'
  onClose: () => void
}) {
  const isGovt  = type === 'government'
  const color   = isGovt ? '#22C55E' : '#EF4444'
  const bgColor = isGovt ? '#14532D' : '#7F1D1D'
  const label   = isGovt ? '✓ GOVT LAND' : '⚠ ENCROACHED'

  return (
    <div style={{
      position: 'absolute', top: 14, left: 14, zIndex: 1000,
      background: 'rgba(13,17,23,0.95)',
      border: `1px solid ${color}44`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 4, padding: '10px 14px',
      backdropFilter: 'blur(8px)',
      minWidth: 210,
      boxShadow: `0 4px 24px ${color}22`,
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
        <div style={{
          fontSize:9, fontWeight:700, letterSpacing:1.2,
          color, padding:'1px 6px', borderRadius:2,
          background: bgColor,
        }}>
          {label}
        </div>
        <button onClick={onClose} style={{
          background:'none', border:'none', color:'#334155',
          cursor:'pointer', fontSize:13, padding:'0 0 0 8px',
          transition:'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
        >✕</button>
      </div>

      {/* Name */}
      <div style={{ fontSize:12, fontWeight:700, color:'#E2E8F0', marginBottom:4, lineHeight:1.4 }}>
        {land.name}
      </div>

      {/* Meta rows */}
      {[
        { k: 'District', v: `${land.district}, ${land.taluk}` },
        { k: 'Area',     v: `${land.area_acres} acres` },
        { k: 'Survey',   v: land.survey_number },
        ...(!isGovt && land.encroachment_type
          ? [{ k: 'Type', v: land.encroachment_type }]
          : []),
        ...(!isGovt && land.confidence !== undefined
          ? [{ k: 'Confidence', v: `${land.confidence}%` }]
          : []),
      ].map(row => (
        <div key={row.k} style={{ display:'flex', gap:6, fontSize:10, marginBottom:2 }}>
          <span style={{ color:'#334155', minWidth:68 }}>{row.k}</span>
          <span style={{ color: row.k === 'Type' ? '#EF4444' : '#94A3B8' }}>{row.v}</span>
        </div>
      ))}

      {/* Pulsing dot indicator */}
      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:8 }}>
        <div style={{
          width:6, height:6, borderRadius:'50%',
          background: color, boxShadow:`0 0 6px ${color}`,
          animation: !isGovt ? 'alert-glow 1.2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontSize:9, color:'#475569', letterSpacing:0.5 }}>
          {isGovt ? 'BOUNDARY ACTIVE' : 'ENCROACHMENT FLAGGED'}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MAP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function GisMap({ alerts, selected, onSelect, selectedLand, selectedLandType }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)
  const isInitializingRef = useRef(false)

  // polygon layers
  const polyMainRef   = useRef<any>(null)   // main dashed outline
  const polyFillRef   = useRef<any>(null)   // semi-transparent fill
  const pulseLayerRef = useRef<any>(null)   // SVG pulse rings (enc only)
  const cornerDotsRef = useRef<any[]>([])   // corner dot markers

  const [mapReady,     setMapReady]     = useState(false)
  const [showInfoCard, setShowInfoCard] = useState(false)

  const CENTER: [number, number] = [11.127, 78.657]

  const ALERT_COLORS: Record<string, string> = {
    'breach-critical': '#EF4444',
    'under-review':    '#F59E0B',
    'cleared':         '#22C55E',
  }

  // ── Remove all polygon layers ──────────────────────────────────────────
  const clearPolygons = useCallback((L: any) => {
    const map = instanceRef.current
    if (!map) return
    ;[polyMainRef, polyFillRef, pulseLayerRef].forEach(ref => {
      if (ref.current) { map.removeLayer(ref.current); ref.current = null }
    })
    cornerDotsRef.current.forEach(d => map.removeLayer(d))
    cornerDotsRef.current = []
  }, [])

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || instanceRef.current || isInitializingRef.current) return
    isInitializingRef.current = true
    let disposed = false

    import('leaflet').then(L => {
      if (disposed || !mapRef.current || instanceRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number }
      // Strict mode/dev remounts can leave Leaflet's marker on the same node.
      if (container._leaflet_id) {
        container._leaflet_id = undefined
      }

      const map = L.map(container, { zoomControl: false, attributionControl: false })
        .setView(CENTER, 7)
      instanceRef.current = map

      // Satellite tiles (free ESRI)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map)

      // Place name labels
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.45 }
      ).addTo(map)

      L.control.zoom({ position: 'topright' }).addTo(map)

      // Alert markers
      alerts.forEach(alert => {
        const color = ALERT_COLORS[alert.severity] ?? '#94A3B8'
        const icon  = L.divIcon({
          className: '',
          html: `<div class="alert-pulse" style="
            width:14px;height:14px;border-radius:50%;
            background:${color};color:${color};
            border:2px solid rgba(255,255,255,0.75);
          "></div>`,
          iconSize:   [14, 14],
          iconAnchor: [7, 7],
        })
        L.marker([alert.lat, alert.lon], { icon })
          .addTo(map)
          .on('click', () => onSelect(alert))
      })

      setMapReady(true)
      isInitializingRef.current = false
    }).catch(() => {
      isInitializingRef.current = false
    })

    return () => {
      disposed = true
      instanceRef.current?.remove()
      instanceRef.current = null
      isInitializingRef.current = false
      if (mapRef.current) {
        const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number }
        if (container._leaflet_id) {
          container._leaflet_id = undefined
        }
      }
    }
  }, [])

  // ── Fly to alert ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!instanceRef.current || !selected || selectedLand) return
    instanceRef.current.flyTo([selected.lat, selected.lon], 10, {
      duration: 1.2, easeLinearity: 0.25,
    })
  }, [selected?.id])

  // ── Draw animated polygon when land selected ──────────────────────────────
  useEffect(() => {
    if (!instanceRef.current) return

    import('leaflet').then(L => {
      const map = instanceRef.current
      clearPolygons(L)
      setShowInfoCard(false)

      if (!selectedLand) return

      const isGovt     = selectedLandType === 'government'
      const color      = isGovt ? '#22C55E' : '#EF4444'
      const fillOpacity = isGovt ? 0.06 : 0.10
      const dashArray  = '12, 9'
      const polyClass  = isGovt ? 'poly-govt' : 'poly-enc'

      const latlngs = selectedLand.coordinates.map(
        (c: [number, number]) => L.latLng(c[0], c[1])
      )

      // 1 ── Transparent fill polygon
      polyFillRef.current = L.polygon(latlngs, {
        color:        'transparent',
        weight:       0,
        fillColor:    color,
        fillOpacity,
        interactive:  false,
      }).addTo(map)

      // 2 ── Marching-ants dashed border
      polyMainRef.current = L.polygon(latlngs, {
        color,
        weight:      3,
        opacity:     1,
        fill:        false,
        dashArray,
        dashOffset:  '0',
        className:   polyClass,
      }).addTo(map)

      // 3 ── Corner dot markers
      // Use all unique corner coords (skip the repeated closing coord)
      const corners = selectedLand.coordinates.slice(0, -1)
      corners.forEach(([lat, lon]: [number, number]) => {
        const dot = L.circleMarker([lat, lon], {
          radius:      5,
          color,
          weight:      2,
          fillColor:   '#0D1117',
          fillOpacity: 1,
          interactive: false,
          className:   '',
        }).addTo(map)
        cornerDotsRef.current.push(dot)
      })

      // 4 ── Pulse rings on corners (encroached only)
      if (!isGovt) {
        corners.forEach(([lat, lon]: [number, number]) => {
          const pulseIcon = L.divIcon({
            className: '',
            html: `
              <svg width="50" height="50" viewBox="0 0 50 50" style="overflow:visible;position:absolute;top:-25px;left:-25px">
                <circle cx="25" cy="25" r="8" fill="none" stroke="#EF4444" stroke-width="2" class="pulse-ring"/>
              </svg>`,
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          })
          const m = L.marker([lat, lon], { icon: pulseIcon, interactive: false }).addTo(map)
          cornerDotsRef.current.push(m)
        })
      }

      // 5 ── Bind popup to main polygon
      polyMainRef.current.bindPopup(
        isGovt ? govtPopup(selectedLand) : encPopup(selectedLand),
        { className: 'land-popup', maxWidth: 300 }
      )

      // 6 ── Fly to bounds then open popup + info card
      const bounds = polyMainRef.current.getBounds()
      map.flyToBounds(bounds, {
        padding:       [80, 80],
        duration:      1.5,
        easeLinearity: 0.2,
        maxZoom:       15,
      })

      setTimeout(() => {
        polyMainRef.current?.openPopup()
        setShowInfoCard(true)
      }, 1700)
    })
  }, [selectedLand?.id, selectedLandType])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0A0F1A' }}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* All animation & popup styles */}
      <style>{GLOBAL_STYLES}</style>

      {/* Map container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading overlay */}
      {!mapReady && (
        <div style={{
          position: 'absolute', inset: 0, background: '#0A0F1A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36,
            border: '2px solid #1E293B', borderTop: '2px solid #0EA5E9',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 10, color: '#334155', letterSpacing: 2 }}>
            LOADING SATELLITE FEED…
          </span>
        </div>
      )}

      {/* Land info card — top left when parcel is active */}
      {showInfoCard && selectedLand && selectedLandType && (
        <LandInfoCard
          land={selectedLand}
          type={selectedLandType}
          onClose={() => {
            setShowInfoCard(false)
            import('leaflet').then(L => clearPolygons(L))
          }}
        />
      )}

      {/* Alert tracking label — only when no land is selected */}
      {!selectedLand && selected && (
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 1000,
          background: 'rgba(13,17,23,0.92)',
          border: '1px solid #1E293B', borderRadius: 4, padding: '8px 12px',
        }}>
          <div style={{ fontSize: 9, color: '#475569', marginBottom: 4, letterSpacing: 1 }}>
            TRACKING
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0EA5E9' }}>
            {selected.code}
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
            {selected.gpsLat} / {selected.gpsLon}
          </div>
        </div>
      )}

      {/* Verify slider */}
      <VerifySlider />
    </div>
  )
}