import React from 'react';
import { CurrentWeather, UnitSystem } from '../types';
import {
  convertSpeed,
  convertPressure,
  convertVisibility,
  getWindDirectionLabel,
  getUVAdvisory,
} from '../utils/weatherUtils';
import {
  Wind,
  Droplets,
  SunMedium,
  Gauge,
  Eye,
  Cloud,
  Compass,
  Navigation,
} from 'lucide-react';

interface MicroClimateGridProps {
  current: CurrentWeather;
  unit: UnitSystem;
}

export const MicroClimateGrid: React.FC<MicroClimateGridProps> = ({ current, unit }) => {
  const wind = convertSpeed(current.windSpeed10m, unit);
  const gusts = convertSpeed(current.windGusts10m, unit);
  const pressure = convertPressure(current.pressureMsl, unit);
  const visibility = convertVisibility(current.visibility, unit);
  const uvInfo = getUVAdvisory(current.uvIndex);
  const cardinal = getWindDirectionLabel(current.windDirection10m);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {/* 1. Wind & Gusts Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wind</span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">{cardinal}</span>
        </div>

        <div className="my-3 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-white font-display">
              {wind.value} <span className="text-xs font-normal text-slate-400">{wind.unit}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Gusts to {gusts.value} {gusts.unit}
            </div>
          </div>

          {/* Rotating Compass Needle Dial */}
          <div className="relative w-10 h-10 rounded-full border border-slate-700/80 bg-[#131c31] flex items-center justify-center shrink-0">
            <div
              className="absolute transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${current.windDirection10m}deg)` }}
            >
              <Navigation className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          {current.windSpeed10m < 12 ? 'Gentle breeze' : current.windSpeed10m < 28 ? 'Moderate breeze' : 'Strong wind'}
        </div>
      </div>

      {/* 2. Humidity & Dew Point Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity</span>
          </span>
          <span className="text-xs font-mono text-blue-300 font-bold">{current.relativeHumidity}%</span>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-white font-display">
            {current.relativeHumidity}<span className="text-sm font-normal text-slate-400">%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          Dew point: {Math.round(current.dewPoint)}°C
        </div>
      </div>

      {/* 3. UV Index Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            <span>UV Index</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${uvInfo.bgColor} ${uvInfo.textColor} border border-amber-500/20`}>
            {uvInfo.level}
          </span>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-white font-display">
            {current.uvIndex.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 12</span>
          </div>
          {/* UV Scale mini bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (current.uvIndex / 12) * 100)}%`,
                backgroundColor: uvInfo.color,
              }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          Safe burn: {uvInfo.maxSafeExposure}
        </div>
      </div>

      {/* 4. Atmospheric Pressure Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pressure</span>
          </span>
          <span className="text-[10px] font-mono text-indigo-300 font-bold">MSL</span>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-white font-display">
            {pressure.value}{' '}
            <span className="text-xs font-normal text-slate-400">{pressure.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {current.pressureMsl > 1015 ? 'High Barometer' : current.pressureMsl < 1005 ? 'Low Barometer' : 'Standard Barometer'}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          {current.pressureMsl >= 1013 ? 'Stable air mass' : 'Unsettled frontal air'}
        </div>
      </div>

      {/* 5. Visibility Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visibility</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            {current.visibility >= 10000 ? 'Clear' : 'Reduced'}
          </span>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-white font-display">
            {visibility.value}{' '}
            <span className="text-xs font-normal text-slate-400">{visibility.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {current.visibility >= 10000 ? 'Unobstructed view' : `${Math.round(current.visibility)}m limit`}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          {current.visibility >= 10000 ? 'Crystal clarity' : 'Fog or aerosol haze'}
        </div>
      </div>

      {/* 6. Cloud Cover Cell */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span>Cloud Cover</span>
          </span>
          <span className="text-xs font-mono text-sky-300 font-bold">{current.cloudCover}%</span>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-white font-display">
            {current.cloudCover}<span className="text-sm font-normal text-slate-400">%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-400 to-sky-400 rounded-full"
              style={{ width: `${current.cloudCover}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 truncate">
          {current.cloudCover < 20 ? 'Clear sky' : current.cloudCover < 70 ? 'Partly cloudy' : 'Overcast sky'}
        </div>
      </div>
    </div>
  );
};
