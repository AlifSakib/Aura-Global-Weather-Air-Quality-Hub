import React, { useState, useEffect } from 'react';
import { ComprehensiveWeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcons';
import { formatTemp, formatLocalTime } from '../utils/weatherUtils';
import {
  MapPin,
  Star,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  CloudRain,
} from 'lucide-react';

interface CurrentWeatherHeroProps {
  data: ComprehensiveWeatherData;
  unit: UnitSystem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  data,
  unit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing = false,
}) => {
  const { location, current, condition, daily, sunMoon } = data;
  const todayForecast = daily[0];

  // Local live clock for this city
  const [clock, setClock] = useState(() => formatLocalTime(location.timezone));

  useEffect(() => {
    setClock(formatLocalTime(location.timezone));
    const interval = setInterval(() => {
      setClock(formatLocalTime(location.timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [location.timezone]);

  return (
    <div
      id="current-weather-hero"
      className="bento-card p-6 sm:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic atmospheric ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 animate-atmospheric-pulse"
        style={{ backgroundColor: condition.ambientColor }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: current.isDay ? '#38bdf8' : '#818cf8' }}
      />

      {/* Top Bar: Location Info, Local Clock, Actions */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              {location.name}
            </h1>
            {location.countryCode && (
              <span className="px-2 py-0.5 rounded-lg bg-white/5 text-cyan-300 text-xs font-mono font-medium border border-white/10">
                {location.countryCode}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-9">
            {[location.admin1, location.country].filter(Boolean).join(', ')} ·{' '}
            <span className="font-mono text-slate-400">
              {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </span>
          </p>
        </div>

        {/* Local time badge & quick actions */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div className="flex items-center space-x-1.5">
              <span className="font-mono font-semibold text-slate-100">{clock.timeStr}</span>
              <span className="text-slate-400">· {clock.dayStr}</span>
            </div>
          </div>

          <button
            type="button"
            id="toggle-favorite-city-btn"
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
            }`}
            title={isFavorite ? 'Remove from Saved Cities' : 'Save to Favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            type="button"
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-cyan-300 transition"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temp & Condition Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
        {/* Left: Huge Temp & Weather Condition */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Dynamic Weather Icon with Glowing Ring */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center border shadow-xl transition-all"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderColor: `${condition.ambientColor}55`,
                boxShadow: `0 0 30px ${condition.ambientColor}25`,
              }}
            >
              <WeatherIcon
                name={condition.iconName}
                className="w-14 h-14 sm:w-16 sm:h-16 transition-transform hover:scale-110"
                style={{ color: condition.ambientColor }}
              />
            </div>
            <span
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-white/10 text-slate-200"
            >
              {current.isDay ? 'Day' : 'Night'}
            </span>
          </div>

          {/* Temperature Display */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white font-display">
                {formatTemp(current.temperature, unit)}
              </span>
              <div className="flex flex-col text-xs text-slate-400">
                <span className="text-slate-300 font-medium">
                  Feels like {formatTemp(current.apparentTemperature, unit)}
                </span>
                {todayForecast && (
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="flex items-center text-rose-400 font-mono">
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                      {formatTemp(todayForecast.tempMax, unit)}
                    </span>
                    <span className="flex items-center text-cyan-400 font-mono">
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                      {formatTemp(todayForecast.tempMin, unit)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
                {condition.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                {condition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Micro-Climatic Highlights Bento Sub-Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
          {/* Precipitation Chance */}
          <div className="bento-inner p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center space-x-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Precipitation</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {todayForecast?.precipitationProbabilityMax ?? 0}%
              </span>
            </div>
            <div className="text-base font-bold text-slate-100 font-display">
              {current.precipitation > 0
                ? `${current.precipitation} mm`
                : `${todayForecast?.precipitationSum ?? 0} mm Today`}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {current.precipitation > 0 ? 'Active rainfall' : 'No heavy rain expected'}
            </p>
          </div>

          {/* Daylight Summary */}
          <div className="bento-inner p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {Math.round(sunMoon.dayLengthMinutes / 60)}h {sunMoon.dayLengthMinutes % 60}m
              </span>
            </div>
            <div className="text-base font-bold text-slate-100 font-display">
              {sunMoon.isSunUp ? 'Daylight Active' : 'Night Hours'}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Sunset at {sunMoon.sunset}
            </p>
          </div>

          {/* Dew Point & Air Comfort */}
          <div className="bento-inner p-3.5">
            <div className="text-xs text-slate-400 mb-1">Dew Point Comfort</div>
            <div className="text-base font-bold text-slate-100 font-display">
              {formatTemp(current.dewPoint, unit)}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {current.dewPoint < 10
                ? 'Dry & crisp'
                : current.dewPoint <= 16
                ? 'Comfortable'
                : current.dewPoint <= 21
                ? 'Humid & sticky'
                : 'Muggy & oppressive'}
            </p>
          </div>

          {/* Cloud Coverage */}
          <div className="bento-inner p-3.5">
            <div className="text-xs text-slate-400 mb-1">Sky Cloudiness</div>
            <div className="text-base font-bold text-slate-100 font-display">
              {current.cloudCover}%
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {current.cloudCover < 20
                ? 'Clear open skies'
                : current.cloudCover < 60
                ? 'Partially scattered'
                : 'Heavy cloud blanket'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
