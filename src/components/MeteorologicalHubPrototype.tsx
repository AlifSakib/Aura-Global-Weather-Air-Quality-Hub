import React from 'react';
import { ComprehensiveWeatherData, UnitSystem, GeoLocation } from '../types';
import { PRESET_CITIES } from '../data/presetCities';
import { formatTemp, convertSpeed } from '../utils/weatherUtils';
import {
  CloudSun,
  MapPin,
  Droplets,
  Wind,
  SunMedium,
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  CloudFog,
  Snowflake,
  Star,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

interface MeteorologicalHubPrototypeProps {
  data: ComprehensiveWeatherData;
  unit: UnitSystem;
  onToggleUnit: () => void;
  onSelectCity: (city: GeoLocation) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenSearch?: () => void;
}

export const MeteorologicalHubPrototype: React.FC<MeteorologicalHubPrototypeProps> = ({
  data,
  unit,
  onToggleUnit,
  onSelectCity,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing = false,
  onOpenSearch,
}) => {
  const { location, current, condition, daily } = data;

  // Key quick hubs as shown in the prototype
  const quickHubs = [
    { key: 'SF', name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { key: 'TOKYO', name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
    { key: 'LONDON', name: 'London', lat: 51.5085, lon: -0.1257 },
    { key: 'NYC', name: 'New York', lat: 40.7128, lon: -74.006 },
  ];

  // Helper to check if a quick hub is active
  const isHubActive = (lat: number, lon: number) =>
    Math.abs(location.latitude - lat) < 0.15 && Math.abs(location.longitude - lon) < 0.15;

  // Helper to render the vibrant yellow stylized weather icon
  const renderWeatherGraphic = () => {
    const code = current.weatherCode;
    // Clear / Sunny
    if (code === 0) {
      return (
        <div className="relative flex items-center justify-center">
          <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 animate-pulse stroke-[2.5]" />
        </div>
      );
    }
    // Partly sunny / cloudy
    if (code === 1 || code === 2) {
      return (
        <div className="relative flex items-center justify-center">
          <CloudSun className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 stroke-[2.5] drop-shadow-md" />
        </div>
      );
    }
    // Rain
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return (
        <div className="relative flex items-center justify-center">
          <CloudRain className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 stroke-[2.5]" />
        </div>
      );
    }
    // Thunderstorm
    if ([95, 96, 99].includes(code)) {
      return (
        <div className="relative flex items-center justify-center">
          <CloudLightning className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 stroke-[2.5]" />
        </div>
      );
    }
    // Snow
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return (
        <div className="relative flex items-center justify-center">
          <Snowflake className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-200 stroke-[2.5]" />
        </div>
      );
    }
    // Fog
    if ([45, 48].includes(code)) {
      return (
        <div className="relative flex items-center justify-center">
          <CloudFog className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 stroke-[2.5]" />
        </div>
      );
    }
    // Default overcast
    return (
      <div className="relative flex items-center justify-center">
        <Cloud className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 stroke-[2.5]" />
      </div>
    );
  };

  const windConverted = convertSpeed(current.windSpeed10m, unit);

  // 5 days outlook slice
  const fiveDayList = daily.slice(0, 5);

  return (
    <div
      id="aura-meteorological-hub"
      className="w-full bg-[#0c1322] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl transition-all"
    >
      {/* Top Prototype Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-800/80">
        {/* Left: Brand Icon & Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 shadow-sm">
            <CloudSun className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Aura Meteorological Hub Prototype</span>
            </h2>
            <p className="text-xs text-slate-400">
              Live atmospheric metrics with multi-city switching
            </p>
          </div>
        </div>

        {/* Right: Hub City Segmented Switcher & Unit Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-y-1.5">
          {quickHubs.map((hub) => {
            const active = isHubActive(hub.lat, hub.lon);
            const foundPreset = PRESET_CITIES.find((c) => c.name.toLowerCase() === hub.name.toLowerCase());

            return (
              <button
                key={hub.key}
                type="button"
                id={`prototype-hub-${hub.key.toLowerCase()}`}
                onClick={() => {
                  if (foundPreset) {
                    onSelectCity(foundPreset);
                  } else {
                    onSelectCity({
                      name: hub.name,
                      country: 'Selected Region',
                      latitude: hub.lat,
                      longitude: hub.lon,
                      timezone: 'auto',
                    });
                  }
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-1 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-[#131c31] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {hub.key}
              </button>
            );
          })}

          {/* Unit Toggle Pill */}
          <button
            type="button"
            id="prototype-unit-toggle"
            onClick={onToggleUnit}
            className="px-2.5 py-1.5 sm:py-1 rounded-lg bg-[#131c31] text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold font-mono transition"
            title={`Switch to ${unit === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
          >
            {unit === 'metric' ? '°C' : '°F'}
          </button>

          {/* Quick Refresh & Favorite Buttons */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#131c31] text-slate-300 hover:text-cyan-300 border border-slate-800 transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border transition ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-[#131c31] border-slate-800 text-slate-400 hover:text-amber-400'
            }`}
            title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Prototype Grid: Blue Card + 5-Day Outlook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mt-4 sm:mt-5">
        {/* Left Column: Signature Vivid Blue Weather Hero Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-blue-900/25 flex flex-col justify-between relative overflow-hidden">
          {/* Top location & Weather summary */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-white/90 text-xs sm:text-sm font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {location.name}, {location.countryCode || location.country}
                </span>
              </div>

              {/* Huge Temperature Display */}
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mt-2.5 sm:mt-3">
                {formatTemp(current.temperature, unit)}
              </div>

              {/* Weather Condition Text */}
              <div className="text-sm sm:text-base font-semibold text-white/95 mt-1">
                {condition.label}
              </div>
            </div>

            {/* Stylized Weather Graphic in Gold/Yellow on Right */}
            <div className="pl-4 pt-1">
              {renderWeatherGraphic()}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-white/20 my-4 sm:my-5" />

          {/* Bottom Telemetry Strip */}
          <div className="flex items-center justify-between sm:justify-start sm:space-x-8 text-xs sm:text-sm text-white/95 font-medium flex-wrap gap-y-2">
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-blue-200 shrink-0" />
              <span>{Math.round(current.relativeHumidity)}% Humidity</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-blue-200 shrink-0" />
              <span>{windConverted.value} {windConverted.unit}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <SunMedium className="w-4 h-4 text-blue-200 shrink-0" />
              <span>UV {Math.round(current.uvIndex)} / 10</span>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Day Outlook Card */}
        <div className="lg:col-span-4 bg-[#131c31] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                5-DAY OUTLOOK
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">High Temp</span>
            </div>

            {/* 5 Rows */}
            <div className="divide-y divide-slate-800/80">
              {fiveDayList.map((dayItem, index) => {
                const isToday = index === 0;
                return (
                  <div
                    key={dayItem.date}
                    className="py-2.5 flex items-center justify-between text-xs sm:text-sm hover:bg-white/[0.02] px-1 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">
                        {isToday ? 'Today' : `Day ${index + 1}`}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({dayItem.dayName.slice(0, 3)})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5 font-mono">
                      <span className="text-slate-400 text-xs">
                        {formatTemp(dayItem.tempMin, unit)}
                      </span>
                      <span className="font-bold text-slate-100">
                        {formatTemp(dayItem.tempMax, unit)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Synchronized with Open-Meteo</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Live Mesh</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
