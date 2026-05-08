// Types for dashboard components

export type AlertSeverity =
  | 'CRITICAL'
  | 'WARNING'
  | 'INFO'
  | 'breach-critical'
  | 'under-review'
  | 'cleared'

export type SeverityKey = 'CRITICAL' | 'WARNING' | 'INFO'

export function normalizeSeverity(severity: AlertSeverity): SeverityKey {
  switch (severity) {
    case 'breach-critical':
      return 'CRITICAL'
    case 'under-review':
      return 'WARNING'
    case 'cleared':
      return 'INFO'
    default:
      return severity
  }
}

export interface Alert {
  id: number
  severity: AlertSeverity
  code: string
  zone: string
  time: string
  img: string
  desc?: string
  lat?: number
  lon?: number
  gpsLat?: string
  gpsLon?: string
  landCover?: string
  confidence?: number
}

export const SEVERITY_CONFIG: Record<SeverityKey, {
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
