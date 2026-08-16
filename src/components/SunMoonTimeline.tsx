import React from 'react';
import { SunMoonInfo } from '../types';
import { Sun, Moon, Sunrise, Sunset, Sparkles } from 'lucide-react';

interface SunMoonTimelineProps {
  sunMoon: SunMoonInfo;
}

export const SunMoonTimeline: React.FC<SunMoonTimelineProps> = ({ sunMoon }) => {
  // Convert progress (0 to 1) to SVG coordinates along arc
  // Arc goes from (20, 90) up to (150, 20) and down to (280, 90)
  const progress = sunMoon.currentSunProgress; // 0 to 1
  const isSunUp = sunMoon.isSunUp;

  // Parabolic trajectory math for SVG viewBox="0 0 300 110"
  const startX = 30;
  const endX = 270;
  const sunX = startX + progress * (endX - startX);
  // Quadratic curve: y = 90 - 4 * peak * progress * (1 - progress)
  const peakHeight = 70;
  const sunY = isSunUp ? 90 - 4 * peakHeight * progress * (1 - progress) : 92;

  return (
    <div className="w-full bg-[#0c1322] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Solar Trajectory & Lunar Cycle
            </h3>
            <p className="text-xs text-slate-400">
              Astronomical alignment & twilight calculations
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-lg bg-[#131c31] border border-slate-800 text-slate-300 flex items-center space-x-1.5 text-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="font-mono text-[11px] font-semibold">
            {Math.round(sunMoon.dayLengthMinutes / 60)}h {sunMoon.dayLengthMinutes % 60}m Light
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 8 Cols: Parabolic Solar Arc Visualizer */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="relative w-full h-32 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 300 110"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizon Line */}
              <line
                x1="10"
                y1="90"
                x2="290"
                y2="90"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Sky Background Gradient fill under arc */}
              <defs>
                <linearGradient id="solarArcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0c1322" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="sunGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Arc Path */}
              <path
                d="M 30 90 Q 150 15 270 90"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Traveled arc path (if daylight) */}
              {isSunUp && (
                <path
                  d={`M 30 90 Q ${30 + (sunX - 30) / 2} ${90 - (90 - sunY) * 0.9} ${sunX} ${sunY}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Sunrise marker */}
              <circle cx="30" cy="90" r="5" fill="#f59e0b" />
              {/* Sunset marker */}
              <circle cx="270" cy="90" r="5" fill="#ea580c" />
              {/* Solar noon marker at top */}
              <circle cx="150" cy="52" r="3" fill="#64748b" />

              {/* Current Sun indicator */}
              {isSunUp ? (
                <g transform={`translate(${sunX}, ${sunY})`}>
                  {/* Outer pulse */}
                  <circle cx="0" cy="0" r="14" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="url(#sunGlow)" />
                  <circle cx="0" cy="0" r="4" fill="#ffffff" />
                </g>
              ) : (
                <g transform="translate(150, 95)">
                  <circle cx="0" cy="0" r="6" fill="#818cf8" opacity="0.6" />
                </g>
              )}
            </svg>
          </div>

          {/* Timeline Milestones Row */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[11px]">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span>Sunrise</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-100">{sunMoon.sunrise}</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-slate-400 text-[11px]">Solar Noon</div>
              <div className="font-mono text-xs font-bold text-slate-200">{sunMoon.solarNoon}</div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-[11px]">
                <Sunset className="w-3.5 h-3.5 text-orange-400" />
                <span>Sunset</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-100">{sunMoon.sunset}</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-slate-400 text-[11px]">Golden Hour</div>
              <div className="font-mono text-[11px] font-semibold text-amber-300 truncate">
                {sunMoon.goldenHourEvening.split('–')[0].trim()}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Moon Phase Inner Card */}
        <div className="lg:col-span-4 p-4 bg-[#131c31] border border-slate-800 rounded-2xl flex flex-col justify-between h-full shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-semibold">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lunar Phase</span>
            </span>
            <span className="font-mono text-indigo-300 font-bold">
              {sunMoon.moonPhase.illumination}% Lit
            </span>
          </div>

          <div className="my-3 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#0c1322] border border-slate-700 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 font-display">
                {sunMoon.moonPhase.name}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Current synodic cycle
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{ width: `${sunMoon.moonPhase.illumination}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
