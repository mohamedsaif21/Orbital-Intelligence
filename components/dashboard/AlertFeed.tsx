interface AlertItem {
  id: string;
  status: 'critical' | 'review' | 'cleared';
  title: string;
  subtitle: string;
  time: string;
  imageUrl: string;
}

const alerts: AlertItem[] = [
  {
    id: '1',
    status: 'critical',
    title: 'Parcel #882-NORTH',
    subtitle: 'Lat: 34.052, Long: -118.243',
    time: '2m ago',
    imageUrl:
      'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    id: '2',
    status: 'review',
    title: 'Zone-DELTA / Sector 4',
    subtitle: 'Vegetation index drop detected',
    time: '14m ago',
    imageUrl:
      'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
  {
    id: '3',
    status: 'cleared',
    title: 'Plot #114-ALPHA',
    subtitle: 'Routine maintenance verified',
    time: '1h ago',
    imageUrl:
      'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  },
];

const statusConfig = {
  critical: {
    label: 'BREACH: CRITICAL',
    badgeBg: 'bg-oi-error-container',
    badgeText: 'text-oi-on-error-container',
    border: 'border-oi-error',
    shadow: 'shadow-[0_0_20px_rgba(147,0,10,0.15)]',
  },
  review: {
    label: 'UNDER REVIEW',
    badgeBg: 'bg-oi-tertiary-container',
    badgeText: 'text-oi-on-tertiary-container',
    border: 'border-oi-on-tertiary-container',
    shadow: '',
  },
  cleared: {
    label: 'CLEARED',
    badgeBg: 'bg-oi-secondary-container',
    badgeText: 'text-oi-secondary',
    border: 'border-oi-secondary-container',
    shadow: '',
  },
};

const trendHeights = ['h-1/4', 'h-2/4', 'h-full', 'h-3/4', 'h-2/4', 'h-4/5', 'h-1/3'];
const trendOpacities = [
  'bg-oi-cyan/20',
  'bg-oi-cyan/20',
  'bg-oi-cyan',
  'bg-oi-cyan/60',
  'bg-oi-cyan/40',
  'bg-oi-cyan',
  'bg-oi-cyan/20',
];

export default function AlertFeed() {
  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold font-headline tracking-widest uppercase flex items-center gap-2 text-oi-on-surface">
          <span className="w-2 h-2 rounded-full bg-oi-error animate-pulse inline-block" />
          Live Alert Feed
        </h2>
        <span className="text-[10px] font-headline text-oi-outline-variant">AUTO-REFRESH: 5S</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {alerts.map((alert) => {
          const cfg = statusConfig[alert.status];
          return (
            <div
              key={alert.id}
              className={`group relative bg-oi-surface hover:bg-oi-surface-high transition-all cursor-pointer p-3 rounded-lg border-l-4 ${cfg.border} ${cfg.shadow}`}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={alert.imageUrl}
                    alt={alert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`px-1.5 py-0.5 ${cfg.badgeBg} ${cfg.badgeText} text-[8px] font-bold uppercase rounded tracking-tighter`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[9px] text-oi-outline">{alert.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-oi-on-surface truncate">{alert.title}</h4>
                  <p className="text-[10px] text-oi-outline truncate">{alert.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="bg-oi-surface-low p-4 rounded-lg mt-4">
          <p className="text-[10px] text-oi-outline uppercase tracking-widest font-body mb-3">
            Encroachments Trend (7d)
          </p>
          <div className="h-16 w-full flex items-end gap-1 px-1">
            {trendHeights.map((h, i) => (
              <div key={i} className={`w-full ${trendOpacities[i]} ${h} rounded-t-sm`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
