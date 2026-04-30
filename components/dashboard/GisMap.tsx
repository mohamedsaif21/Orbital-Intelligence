'use client';

import { useState } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';
import DecisionPanel from './DecisionPanel';

const timelineOptions = ['7D', '30D', '90D'];

export default function GisMap() {
  const [activeTimeline, setActiveTimeline] = useState('7D');
  const [sliderValue, setSliderValue] = useState(66);

  return (
    <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex relative rounded-xl overflow-hidden bg-oi-surface-lowest min-h-[500px]">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
          alt="Satellite terrain view"
          className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/10 via-transparent to-oi-cyan/5 pointer-events-none" />
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass p-1 rounded-lg flex flex-col gap-1 border border-oi-outline-variant/20">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded text-oi-on-surface">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded text-oi-on-surface">
            <Minus size={16} />
          </button>
        </div>
        <button className="glass w-10 h-10 flex items-center justify-center rounded-lg border border-oi-outline-variant/20 text-oi-on-surface hover:text-oi-cyan transition-colors">
          <Crosshair size={18} />
        </button>
      </div>

      {/* Timeline Filter */}
      <div className="absolute top-4 right-4 z-10 glass px-4 py-2 rounded-full border border-oi-outline-variant/20 flex items-center gap-4">
        <span className="text-[10px] font-headline tracking-widest text-oi-outline uppercase">
          TIMELINE
        </span>
        <div className="flex gap-2">
          {timelineOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveTimeline(opt)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                activeTimeline === opt
                  ? 'bg-oi-cyan text-oi-on-cyan'
                  : 'text-oi-outline hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Before/After Slider */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 glass px-6 py-3 rounded-lg border border-oi-outline-variant/20 w-72">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-headline text-oi-outline tracking-widest">
            SENS-A (MAR 10)
          </span>
          <span className="text-[9px] font-headline text-oi-cyan tracking-widest">
            SENS-B (TODAY)
          </span>
        </div>
        <div className="relative h-1 bg-oi-outline-variant/40 rounded-full flex items-center">
          <div
            className="absolute left-0 top-0 h-full bg-oi-cyan rounded-full transition-all"
            style={{ width: `${sliderValue}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
          />
          <div
            className="absolute -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-oi-cyan pointer-events-none"
            style={{ left: `${sliderValue}%` }}
          />
        </div>
        <p className="text-[8px] text-center mt-2 text-oi-outline uppercase tracking-widest">
          Slide to verify encroachment expansion
        </p>
      </div>

      {/* Decision Panel */}
      <DecisionPanel />
    </div>
  );
}
