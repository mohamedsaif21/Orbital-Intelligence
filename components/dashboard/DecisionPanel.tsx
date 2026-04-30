'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function DecisionPanel() {
  const [aiLayerOn, setAiLayerOn] = useState(true);
  const [cadastralOn, setCadastralOn] = useState(false);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-72 glass border-l border-oi-outline-variant/20 z-20 flex flex-col shadow-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold font-headline tracking-widest uppercase text-white">
          Decision Support
        </h2>
        <button className="text-oi-outline hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar">
        {/* Target Data */}
        <div>
          <p className="text-[10px] text-oi-outline uppercase tracking-widest font-body mb-2">
            Target Data
          </p>
          <div className="bg-oi-surface-lowest p-3 rounded border border-oi-outline-variant/10">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-oi-outline font-headline">GPS LAT</span>
              <span className="text-[10px] text-white font-headline">34.0522° N</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-[10px] text-oi-outline font-headline">GPS LONG</span>
              <span className="text-[10px] text-white font-headline">118.2437° W</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-oi-cyan font-headline font-bold text-lg">+12.4%</span>
              <span className="text-[10px] text-oi-outline uppercase font-body">
                Land Cover Shift
              </span>
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div>
          <p className="text-[10px] text-oi-outline uppercase tracking-widest font-body mb-2">
            AI Confidence Score
          </p>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-oi-outline-variant"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-oi-cyan"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="transparent"
                  stroke="currentColor"
                  strokeDasharray="98.4, 100"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold font-headline text-white">
                98.4%
              </div>
            </div>
            <p className="text-[10px] text-oi-on-surface leading-tight">
              High confidence detection of non-permitted structural expansion.
            </p>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="pt-4 space-y-3 border-t border-oi-outline-variant/10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-headline text-white uppercase tracking-widest">
              AI Prediction Layer
            </span>
            <button
              onClick={() => setAiLayerOn(!aiLayerOn)}
              className={`w-10 h-5 rounded-full relative transition-colors ${
                aiLayerOn ? 'bg-oi-cyan' : 'bg-oi-outline-variant'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                  aiLayerOn ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-headline text-oi-outline uppercase tracking-widest">
              Cadastral Overlays
            </span>
            <button
              onClick={() => setCadastralOn(!cadastralOn)}
              className={`w-10 h-5 rounded-full relative transition-colors ${
                cadastralOn ? 'bg-oi-cyan' : 'bg-oi-outline-variant'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                  cadastralOn ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-2 border-t border-oi-outline-variant/10 mt-4">
        <button className="w-full py-2.5 bg-oi-cyan text-oi-on-cyan font-headline text-[10px] font-bold tracking-widest uppercase rounded hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
          VERIFY CASE
        </button>
        <button className="w-full py-2.5 border border-oi-outline-variant text-oi-cyan font-headline text-[10px] font-bold tracking-widest uppercase rounded hover:bg-white/5 transition-colors">
          MARK AS FALSE POSITIVE
        </button>
        <button className="w-full py-2.5 bg-oi-surface-highest text-oi-on-surface font-headline text-[10px] font-bold tracking-widest uppercase rounded hover:bg-oi-surface-bright transition-colors">
          SEND NOTICE
        </button>
      </div>
    </div>
  );
}
