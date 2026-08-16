import React, { useState, useEffect } from 'react';
import { PRESET_CITIES } from '../data/presetCities';
import { GeoLocation } from '../types';
import { formatLocalTime } from '../utils/weatherUtils';
import { Clock } from 'lucide-react';

interface QuickCityPresetsProps {
  currentCity: GeoLocation;
  onSelectCity: (city: GeoLocation) => void;
}

export const QuickCityPresets: React.FC<QuickCityPresetsProps> = ({
  currentCity,
  onSelectCity,
}) => {
  // Live ticker to keep local time clocks up-to-date every 10 seconds
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Global Hubs & Live Telemetry Clocks</span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
          1-click switch
        </span>
      </div>

      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none no-scrollbar">
        {PRESET_CITIES.map((city) => {
          const isActive =
            Math.abs(city.latitude - currentCity.latitude) < 0.1 &&
            Math.abs(city.longitude - currentCity.longitude) < 0.1;

          const localTime = formatLocalTime(city.timezone, now);

          return (
            <button
              key={`${city.name}-${city.countryCode}`}
              type="button"
              id={`preset-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCity(city)}
              className={`shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs transition-all duration-300 font-display ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : 'bg-[#0c1322] hover:bg-[#131c31] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm leading-none">{city.flag}</span>
              <span className="font-bold tracking-tight">{city.name}</span>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded-lg ${
                  isActive
                    ? 'bg-black/20 text-white font-bold'
                    : 'bg-[#131c31] text-slate-400 border border-slate-800'
                }`}
              >
                {localTime.timeStr}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
