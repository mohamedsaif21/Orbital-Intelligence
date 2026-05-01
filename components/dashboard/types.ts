// Types for dashboard components

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO'

export interface Alert {
  id: number
  severity: AlertSeverity
  code: string
  zone: string
  time: string
  img: string
  lat?: number
  lon?: number
  gpsLat?: string
  gpsLon?: string
  landCover?: string
  confidence?: number
}

export const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string
  bg: string
  text: string
  color: string
}> = {
  CRITICAL: {
    label: 'BREACH-CRITICAL',
    bg: '#7F1D1D',
    text: '#FECACA',
    color: '#DC2626',
  },
  WARNING: {
    label: 'UNDER REVIEW',
    bg: '#78350F',
    text: '#FEF3C7',
    color: '#F59E0B',
  },
  INFO: {
    label: 'CLEARED',
    bg: '#15803D',
    text: '#DCFCE7',
    color: '#22C55E',
  },
}
