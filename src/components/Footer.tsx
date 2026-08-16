import React from 'react';
import { CloudSun, Globe2, Radio, Heart } from 'lucide-react';

interface FooterProps {
  lastUpdated: string;
  isLive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ lastUpdated, isLive }) => {
  const formattedUpdate = new Date(lastUpdated).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <footer className="w-full border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-xl mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2 font-display">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">Aura</span>
          <span>· High-Resolution Global Meteorological & AQI System</span>
        </div>

        <div className="flex items-center space-x-4 flex-wrap justify-center font-mono text-[11px]">
          <div className="flex items-center space-x-1.5 bento-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Open-Meteo Live Sensor Mesh</span>
          </div>

          <span className="text-slate-400">
            Updated: <strong className="text-slate-200">{formattedUpdate}</strong>
          </span>
        </div>

        <div className="text-slate-400 text-center sm:text-right">
          Standardized with <span className="text-slate-300 font-semibold">US EPA</span> & <span className="text-slate-300 font-semibold">WHO</span> Air Quality Guidelines.
        </div>
      </div>
    </footer>
  );
};
