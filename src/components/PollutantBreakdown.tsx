import React from 'react';
import { AirPollutant } from '../types';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface PollutantBreakdownProps {
  pollutants: AirPollutant[];
}

export const PollutantBreakdown: React.FC<PollutantBreakdownProps> = ({ pollutants }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {pollutants.map((item) => {
        const isExceeding = item.value > item.whoStandard;

        const statusColor =
          item.status === 'good'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : item.status === 'moderate'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : item.status === 'sensitive'
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400';

        const barColor =
          item.status === 'good'
            ? 'bg-emerald-400'
            : item.status === 'moderate'
            ? 'bg-amber-400'
            : item.status === 'sensitive'
            ? 'bg-orange-400'
            : 'bg-rose-500';

        return (
          <div
            key={item.key}
            className="p-4 bg-[#131c31] border border-slate-800 rounded-2xl hover:border-slate-700 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-slate-100 font-mono">
                    {item.symbol}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">({item.name})</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColor}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* Measured Value */}
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-display">
                  {item.value}{' '}
                  <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  WHO Limit: {item.whoStandard} {item.unit}
                </span>
              </div>

              {/* Progress bar vs WHO standard */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.min(100, (item.value / item.whoStandard) * 50)}%` }}
                />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 leading-snug">
              {item.healthEffect}
            </div>
          </div>
        );
      })}
    </div>
  );
};
