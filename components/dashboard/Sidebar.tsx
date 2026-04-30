'use client';

import {
  LayoutDashboard,
  Layers,
  TriangleAlert,
  TrendingUp,
  History,
  HelpCircle,
  LogOut,
  Satellite,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Layers, label: 'Map Layers', active: false },
  { icon: TriangleAlert, label: 'Alert Log', active: false },
  { icon: TrendingUp, label: 'Analytics', active: false },
  { icon: History, label: 'Archived', active: false },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col pt-4 bg-oi-bg w-64 border-r border-oi-surface-high/40">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-oi-surface-highest rounded flex items-center justify-center">
            <Satellite size={20} className="text-oi-cyan" />
          </div>
          <div>
            <div className="text-base font-black text-white font-headline">SENTINEL-1</div>
            <div className="text-[10px] text-oi-cyan font-headline tracking-widest uppercase">
              Active Monitoring
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-3 gap-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-headline text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
              active
                ? 'bg-oi-cyan/10 text-oi-cyan border-r-2 border-oi-cyan'
                : 'text-slate-500 hover:bg-oi-surface-low hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </a>
        ))}

        <div className="mt-6 px-3">
          <button className="w-full py-3 bg-oi-cyan text-oi-on-cyan font-headline text-xs font-bold tracking-widest uppercase rounded hover:opacity-90 transition-opacity">
            NEW REPORT
          </button>
        </div>
      </nav>

      <div className="mt-auto p-4 flex flex-col gap-1 border-t border-oi-surface-high/40">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white font-headline text-[10px] uppercase tracking-widest transition-colors"
        >
          <HelpCircle size={14} />
          Support
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white font-headline text-[10px] uppercase tracking-widest transition-colors"
        >
          <LogOut size={14} />
          Logout
        </a>
      </div>
    </aside>
  );
}
