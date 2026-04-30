'use client';

import { Search, Bell, CircleUser as UserCircle } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-oi-bg border-b border-oi-surface">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-oi-cyan font-headline">
          ORBITAL INTELLIGENCE
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="font-headline tracking-tight text-sm uppercase text-oi-cyan border-b-2 border-oi-cyan pb-1"
          >
            Telemetry
          </a>
          <a
            href="#"
            className="font-headline tracking-tight text-sm uppercase text-slate-400 hover:text-white transition-colors"
          >
            Assets
          </a>
          <a
            href="#"
            className="font-headline tracking-tight text-sm uppercase text-slate-400 hover:text-white transition-colors"
          >
            Reports
          </a>
          <a
            href="#"
            className="font-headline tracking-tight text-sm uppercase text-slate-400 hover:text-white transition-colors"
          >
            Settings
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-oi-outline"
          />
          <input
            type="text"
            placeholder="SEARCH SATELLITE ID..."
            className="bg-oi-surface-lowest border border-oi-outline-variant/30 text-oi-on-surface text-xs font-headline tracking-widest pl-9 pr-4 py-2 w-64 rounded focus:outline-none focus:ring-1 focus:ring-oi-cyan/50 placeholder:text-oi-outline"
          />
        </div>
        <button className="text-slate-400 hover:text-white transition-all active:scale-95">
          <Bell size={20} />
        </button>
        <button className="text-slate-400 hover:text-white transition-all active:scale-95">
          <UserCircle size={22} />
        </button>
      </div>
    </header>
  );
}
