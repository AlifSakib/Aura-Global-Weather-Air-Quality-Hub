import React, { useState } from 'react';
import { WeatherAlert } from '../types';
import { AlertTriangle, AlertOctagon, Info, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface SevereAlertBannerProps {
  alerts: WeatherAlert[];
}

export const SevereAlertBanner: React.FC<SevereAlertBannerProps> = ({ alerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  const topAlert = alerts[0];
  const isExtreme = topAlert.severity === 'extreme';
  const isSevere = topAlert.severity === 'severe';

  const bgClasses = isExtreme
    ? 'bg-rose-950/70 border-rose-600/50 text-rose-100 shadow-rose-950/40'
    : isSevere
    ? 'bg-amber-950/70 border-amber-500/50 text-amber-100 shadow-amber-950/40'
    : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-100 shadow-indigo-950/30';

  const badgeBg = isExtreme
    ? 'bg-rose-600 text-white'
    : isSevere
    ? 'bg-amber-600 text-slate-950'
    : 'bg-indigo-500 text-white';

  return (
    <div
      className={`w-full bento-card transition-all duration-300 ${bgClasses} p-5 mb-6`}
      id="severe-alert-banner"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-white/10 shrink-0 mt-0.5 animate-pulse border border-white/10">
            {isExtreme ? (
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            ) : isSevere ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-indigo-300" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bento-badge ${badgeBg}`}>
                {topAlert.severity.toUpperCase()} ADVISORY
              </span>
              <h3 className="font-bold text-sm sm:text-base font-display">
                {topAlert.event}
              </h3>
              {alerts.length > 1 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">
                  +{alerts.length - 1} more alert{alerts.length > 2 ? 's' : ''}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              {topAlert.headline}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="toggle-alert-details-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition shrink-0 font-semibold cursor-pointer border border-white/10 font-display"
        >
          <span>{isExpanded ? 'Collapse' : 'Guidelines'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-3 text-xs sm:text-sm">
          {alerts.map((alert, idx) => (
            <div
              key={alert.id || idx}
              className="p-4 bento-inner space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono opacity-80">
                <span className="font-semibold">{alert.event}</span>
                <span>{alert.effective} · {alert.expires}</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{alert.description}</p>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-white font-display">Emergency Instructions: </span>
                  <span className="text-slate-300 text-xs">{alert.instruction}</span>
                </div>
              </div>
              <div className="text-[10px] text-right font-mono opacity-60">
                Issued by: {alert.sender}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
