import React, { useState } from 'react';
import { AirQualityData } from '../types';
import { PollutantBreakdown } from './PollutantBreakdown';
import {
  Wind,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Heart,
  AlertOctagon,
  AlertTriangle,
  Flame,
  Info,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const [indexType, setIndexType] = useState<'us' | 'eu'>('us');
  const [viewTab, setViewTab] = useState<'overview' | 'pollutants' | 'trend'>('overview');

  const { aqi, pollutants, recommendations, hourlyAQI } = airQuality;
  const displayAqi = indexType === 'us' ? aqi.aqi : aqi.europeanAqi ?? Math.round(aqi.aqi * 0.4);

  // Gauge calculation: 0 to 500 mapped to 180 degrees (-90 to +90)
  const aqiClamped = Math.min(500, Math.max(0, aqi.aqi));
  const gaugeAngle = -90 + (aqiClamped / 500) * 180;

  return (
    <div
      id="air-quality-hub-card"
      className="w-full bg-[#0c1322] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 shadow-sm">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Real-Time Air Quality & Health
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Live Sensor Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Particulate matter, gaseous toxins, and pulmonary health guidelines
            </p>
          </div>
        </div>

        {/* View Switcher & US/EU Scale Toggle */}
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          {/* Sub-tabs */}
          <div className="flex p-1 rounded-xl bg-[#131c31] border border-slate-800 text-xs">
            <button
              type="button"
              id="aqi-tab-overview"
              onClick={() => setViewTab('overview')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Health Advice
            </button>
            <button
              type="button"
              id="aqi-tab-pollutants"
              onClick={() => setViewTab('pollutants')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewTab === 'pollutants'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              6 Pollutants
            </button>
            <button
              type="button"
              id="aqi-tab-trend"
              onClick={() => setViewTab('trend')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewTab === 'trend'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h Trend
            </button>
          </div>

          {/* US / EU standard toggle */}
          <div className="flex p-1 rounded-xl bg-[#131c31] border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setIndexType('us')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                indexType === 'us' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="US EPA 0-500 Scale"
            >
              US EPA
            </button>
            <button
              type="button"
              onClick={() => setIndexType('eu')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                indexType === 'eu' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="European Air Quality Index"
            >
              EU AQI
            </button>
          </div>
        </div>
      </div>

      {/* Main AQI Section: Gauge on Left + Core Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 5 Cols: Semi-Circular Gauge Meter */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-6 bg-[#131c31] border border-slate-800 rounded-2xl relative shadow-lg">
          {/* Symmetrical Semi-Circular Gauge with No Clipping */}
          <div className="relative w-full max-w-[260px] flex flex-col items-center justify-center pt-2">
            <svg className="w-full h-auto max-h-[145px]" viewBox="0 0 240 145">
              {/* Gradients */}
              <defs>
                <linearGradient id="aqiArcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#ef4444" />
                  <stop offset="90%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
              </defs>

              {/* Background Full Track Arc (Radius 85 from (35,120) to (205,120)) */}
              <path
                d="M 35 120 A 85 85 0 0 1 205 120"
                fill="none"
                stroke="#1e293b"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Colored Active Gradient Arc */}
              <path
                d="M 35 120 A 85 85 0 0 1 205 120"
                fill="none"
                stroke="url(#aqiArcGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="267.04"
                strokeDashoffset={267.04 - (267.04 * aqiClamped) / 500}
                className="transition-all duration-1000 ease-out"
              />

              {/* Needle Pointer pivoting smoothly at (120, 120) */}
              <g
                transform={`translate(120, 120) rotate(${gaugeAngle})`}
                className="transition-transform duration-700 ease-out"
              >
                <polygon points="-3,-10 3,-10 0,-76" fill="#ffffff" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-74"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="7" fill="#ffffff" />
                <circle cx="0" cy="0" r="3.5" fill="#0f172a" />
              </g>
            </svg>

            {/* Centered AQI Big Number */}
            <div className="text-center mt-2">
              <div className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight leading-none">
                {displayAqi}
              </div>
              <div className="text-xs font-mono font-medium text-slate-400 mt-1">
                {indexType === 'us' ? 'AQI Score' : 'EU AQI Index'}
              </div>
            </div>
          </div>

          {/* AQI Category Badge */}
          <div className="mt-3 text-center space-y-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${aqi.bgColor} ${aqi.textColor} ${aqi.borderColor}`}
            >
              {aqi.level}
            </span>
            <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
              {aqi.description}
            </p>
          </div>

          {/* Scale Legend Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-400 font-semibold">0 Good</span>
            <span className="text-amber-400 font-semibold">50 Mod</span>
            <span className="text-orange-400 font-semibold">100 Sens</span>
            <span className="text-rose-400 font-semibold">150+ Unhealthy</span>
            <span className="text-purple-400 font-semibold">300+ Haz</span>
          </div>
        </div>

        {/* Right 7 Cols: Tab Views */}
        <div className="lg:col-span-7">
          {viewTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">
                  Personal Health & Activity Matrix
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  Primary Risk: <strong className="text-slate-200">{aqi.dominantPollutant}</strong>
                </span>
              </div>

              {/* 4 Health Guidelines Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Outdoor Fitness */}
                <div className="p-3.5 bg-[#131c31] border border-slate-800 rounded-xl flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      recommendations.outdoorExercise.allowed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-200">
                      Outdoor Exercise
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      {recommendations.outdoorExercise.status}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {recommendations.outdoorExercise.advice}
                    </p>
                  </div>
                </div>

                {/* 2. Sensitive Groups & Asthma */}
                <div className="p-3.5 bg-[#131c31] border border-slate-800 rounded-xl flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      recommendations.sensitiveGroups.warning
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-200">
                      Respiratory & Asthma
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      {recommendations.sensitiveGroups.status}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {recommendations.sensitiveGroups.advice}
                    </p>
                  </div>
                </div>

                {/* 3. Mask Requirement */}
                <div className="p-3.5 bg-[#131c31] border border-slate-800 rounded-xl flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      recommendations.maskRequirement.needed
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {recommendations.maskRequirement.needed ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-200">
                      Mask / Respirator
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      {recommendations.maskRequirement.status}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {recommendations.maskRequirement.advice}
                    </p>
                  </div>
                </div>

                {/* 4. Home Ventilation */}
                <div className="p-3.5 bg-[#131c31] border border-slate-800 rounded-xl flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      recommendations.ventilation.openWindows
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-200">
                      Window Ventilation
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      {recommendations.ventilation.status}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {recommendations.ventilation.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewTab === 'pollutants' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">
                  Detailed Chemical & Particulate Breakdown
                </h4>
                <span className="text-xs text-slate-400">WHO 24h Limits</span>
              </div>
              <PollutantBreakdown pollutants={pollutants} />
            </div>
          )}

          {viewTab === 'trend' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">
                  24-Hour Projected AQI Timeline
                </h4>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center text-cyan-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" /> AQI
                  </span>
                  <span className="flex items-center text-amber-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-1" /> PM2.5
                  </span>
                </div>
              </div>

              <div className="h-56 w-full p-3 bg-[#131c31] border border-slate-800 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyAQI} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="pm25AreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="formattedHour"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      interval={2}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 'dataMax + 20']}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-3 bg-[#0c1322] border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                              <div className="font-bold text-slate-100">{label}</div>
                              <div className="text-cyan-300 font-mono">
                                AQI Index: {payload[0]?.value}
                              </div>
                              <div className="text-amber-300 font-mono">
                                PM2.5: {payload[1]?.value} µg/m³
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#aqiAreaGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pm25"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#pm25AreaGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
