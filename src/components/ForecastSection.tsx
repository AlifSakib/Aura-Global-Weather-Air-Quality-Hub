import React, { useState } from 'react';
import { HourlyForecastItem, DailyForecastItem, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcons';
import { getWeatherCondition, formatTemp, convertSpeed } from '../utils/weatherUtils';
import {
  CalendarDays,
  Clock,
  CloudRain,
  Wind,
  TrendingUp,
  Droplets,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ForecastSectionProps {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({
  hourly,
  daily,
  unit,
}) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  // Find min and max temperature across the entire 7-day forecast for normalized bar sliders
  const allMaxTemps = daily.map((d) => d.tempMax);
  const allMinTemps = daily.map((d) => d.tempMin);
  const weekGlobalMax = Math.max(...allMaxTemps, 30);
  const weekGlobalMin = Math.min(...allMinTemps, 0);
  const globalRange = Math.max(1, weekGlobalMax - weekGlobalMin);

  return (
    <div
      id="forecast-section"
      className="w-full bg-[#0c1322] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
            {activeTab === 'hourly' ? (
              <Clock className="w-5 h-5" />
            ) : (
              <CalendarDays className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {activeTab === 'hourly' ? '24-Hour Meteorological Timeline' : '7-Day Extended Outlook'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-resolution hourly micro-trends and daily frontal transitions
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-[#131c31] border border-slate-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            id="tab-forecast-hourly"
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'hourly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24 Hours</span>
          </button>
          <button
            type="button"
            id="tab-forecast-daily"
            onClick={() => setActiveTab('daily')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>7 Days</span>
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === 'hourly' && (
        <div className="space-y-6">
          {/* Recharts Interactive Combo Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-slate-300 font-display">Temperature & Precipitation Trend</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-cyan-400 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mr-1.5" /> Temp ({unit === 'imperial' ? '°F' : '°C'})
                </span>
                <span className="flex items-center text-blue-400 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 mr-1.5" /> Rain %
                </span>
              </div>
            </div>

            <div className="h-60 w-full p-3 bg-[#131c31] border border-slate-800 rounded-2xl">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
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
                    yAxisId="left"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    domain={['dataMin - 3', 'dataMax + 3']}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#3b82f6"
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 bg-[#0c1322] border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                            <div className="font-bold text-slate-100">{label}</div>
                            <div className="text-cyan-300 font-mono">
                              Temperature: {payload[0]?.value}°{unit === 'imperial' ? 'F' : 'C'}
                            </div>
                            <div className="text-blue-300 font-mono">
                              Rain Probability: {payload[1]?.value}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="precipitationProbability"
                    fill="#3b82f6"
                    opacity={0.6}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#tempAreaGrad)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Scrollable Hourly Cards Strip */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar">
            {hourly.map((item, idx) => {
              const cond = getWeatherCondition(item.weatherCode, item.isDay);
              const windConv = convertSpeed(item.windSpeed, unit);

              return (
                <div
                  key={`${item.time}-${idx}`}
                  className="shrink-0 w-24 p-3 bg-[#131c31] border border-slate-800 rounded-2xl hover:border-cyan-500/40 flex flex-col items-center justify-between text-center transition-all hover:scale-105 shadow-md"
                >
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    {item.formattedHour}
                  </span>

                  <div className="my-2.5">
                    <WeatherIcon
                      name={cond.iconName}
                      className="w-7 h-7"
                      style={{ color: cond.ambientColor }}
                    />
                  </div>

                  <span className="text-base font-extrabold text-white font-display">
                    {formatTemp(item.temperature, unit)}
                  </span>

                  {/* Rain chance badge */}
                  <div className="mt-2 flex items-center space-x-1 text-[11px] font-mono text-cyan-300 font-bold">
                    <CloudRain className="w-3 h-3 text-cyan-400" />
                    <span>{item.precipitationProbability}%</span>
                  </div>

                  <div className="mt-1 text-[10px] font-mono text-slate-400">
                    {windConv.value} {windConv.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily 7-Day Extended Outlook */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          {daily.map((day, idx) => {
            const cond = getWeatherCondition(day.weatherCode, true);
            const isToday = idx === 0;

            // Bar math
            const minPercent = Math.max(0, ((day.tempMin - weekGlobalMin) / globalRange) * 100);
            const maxPercent = Math.min(100, ((day.tempMax - weekGlobalMin) / globalRange) * 100);
            const barWidth = Math.max(8, maxPercent - minPercent);

            return (
              <div
                key={`${day.date}-${idx}`}
                className={`p-4 bg-[#131c31] border rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isToday
                    ? 'border-blue-500/50 bg-[#15213d] shadow-lg ring-1 ring-blue-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Day name & Condition Icon */}
                <div className="flex items-center space-x-4 sm:w-48 shrink-0">
                  <div className="w-16">
                    <div className="font-extrabold text-sm text-slate-100 font-display">
                      {day.dayName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className="p-2 rounded-xl bg-[#0c1322] border"
                      style={{ borderColor: `${cond.ambientColor}44` }}
                    >
                      <WeatherIcon
                        name={cond.iconName}
                        className="w-5 h-5"
                        style={{ color: cond.ambientColor }}
                      />
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {cond.label}
                    </div>
                  </div>
                </div>

                {/* Rain probability & Wind */}
                <div className="flex items-center space-x-6 sm:w-40 shrink-0 text-xs">
                  <div className="flex items-center space-x-1.5 text-cyan-300 font-mono">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{day.precipitationProbabilityMax}%</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                    <Wind className="w-3.5 h-3.5 text-slate-500" />
                    <span>{Math.round(day.windSpeedMax)} km/h</span>
                  </div>
                </div>

                {/* Temperature Range Slider Bar */}
                <div className="flex items-center space-x-3 flex-1 min-w-[180px]">
                  <span className="text-xs font-mono text-cyan-300 w-10 text-right font-bold">
                    {formatTemp(day.tempMin, unit)}
                  </span>

                  {/* Relative bar track */}
                  <div className="relative flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 rounded-full"
                      style={{
                        left: `${minPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono text-rose-300 w-10 text-left font-bold">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
