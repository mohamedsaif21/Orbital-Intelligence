import { Globe, TriangleAlert, ClipboardCheck, CircleCheck as CheckCircle, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function KpiCard({ label, value, unit, trend, icon, iconBg }: KpiCardProps) {
  return (
    <div className="bg-oi-surface p-4 rounded-lg flex items-center justify-between">
      <div>
        <p className="text-[10px] text-oi-outline uppercase tracking-widest font-body mb-1">
          {label}
        </p>
        <div className="flex items-end gap-2">
          <h3 className="text-xl font-bold font-headline text-oi-on-surface">
            {value}
            {unit && <span className="text-sm font-normal text-oi-outline ml-1">{unit}</span>}
          </h3>
          {trend && (
            <span className="text-oi-cyan text-xs flex items-center mb-1">
              <TrendingDown size={14} className="mr-0.5" />
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`w-10 h-10 ${iconBg} rounded flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

export default function KpiCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <KpiCard
        label="Land Monitored"
        value="1,240"
        unit="Ha"
        iconBg="bg-oi-cyan/10"
        icon={<Globe size={20} className="text-oi-cyan" />}
      />
      <KpiCard
        label="Encroachments"
        value="08"
        trend="12%"
        iconBg="bg-oi-on-tertiary-container/10"
        icon={<TriangleAlert size={20} className="text-oi-on-tertiary-container" />}
      />
      <KpiCard
        label="Verified Cases"
        value="05"
        iconBg="bg-oi-surface-highest"
        icon={<ClipboardCheck size={20} className="text-oi-outline" />}
      />
      <KpiCard
        label="Action Taken"
        value="88%"
        iconBg="bg-oi-secondary-container/50"
        icon={<CheckCircle size={20} className="text-oi-secondary" />}
      />
    </section>
  );
}
