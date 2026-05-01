'use client'
import { useState } from 'react'
import TopBar from '@/components/dashboard/TopBar'
import Sidebar from '@/components/dashboard/Sidebar'
import KpiCards from '@/components/dashboard/KpiCards'
import AlertFeed from '@/components/dashboard/AlertFeed'
import GisMap from '@/components/dashboard/GisMap'
import DecisionPanel from '@/components/dashboard/DecisionPanel'
import { Alert } from '@/components/dashboard/types'

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

export default function Home() {
  const [activeTab, setActiveTab] = useState('TELEMETRY')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [countdown] = useState(5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar active={activeTab} setActive={setActiveTab} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <KpiCards />
          <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0 }}>
            <AlertFeed
              alerts={MOCK_ALERTS}
              selected={selectedAlert}
              onSelect={setSelectedAlert}
              countdown={countdown}
            />
            <GisMap
              alerts={MOCK_ALERTS}
              selected={selectedAlert}
              onSelect={setSelectedAlert}
            />
            <DecisionPanel
              alert={selectedAlert}
              onClose={() => setSelectedAlert(null)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}