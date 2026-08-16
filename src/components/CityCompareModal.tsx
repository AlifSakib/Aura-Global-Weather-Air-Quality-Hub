import React, { useState, useEffect } from 'react';
import { GeoLocation, ComprehensiveWeatherData, UnitSystem } from '../types';
import { PRESET_CITIES } from '../data/presetCities';
import { fetchComprehensiveWeatherData } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcons';
import { formatTemp, convertSpeed } from '../utils/weatherUtils';
import { X, Split, Loader2, ArrowRight, Wind, Droplets, Gauge, Activity } from 'lucide-react';

interface CityCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: GeoLocation;
  savedCities: GeoLocation[];
  unit: UnitSystem;
  onSelectCity: (city: GeoLocation) => void;
}

export const CityCompareModal: React.FC<CityCompareModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  savedCities,
  unit,
  onSelectCity,
}) => {
  const [cityA, setCityA] = useState<GeoLocation>(currentCity);
  const [cityB, setCityB] = useState<GeoLocation>(
    savedCities.find((c) => c.name !== currentCity.name) || PRESET_CITIES[1]
  );

  const [dataA, setDataA] = useState<ComprehensiveWeatherData | null>(null);
  const [dataB, setDataB] = useState<ComprehensiveWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync cityA with currentCity when opened
  useEffect(() => {
    if (isOpen) {
      setCityA(currentCity);
      const fallback = savedCities.find((c) => c.name !== currentCity.name) || PRESET_CITIES[1];
      setCityB(fallback);
    }
  }, [isOpen, currentCity, savedCities]);

  // Fetch comparison data for both cities
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [resA, resB] = await Promise.all([
          fetchComprehensiveWeatherData(cityA),
          fetchComprehensiveWeatherData(cityB),
        ]);
        if (!isCancelled) {
          setDataA(resA);
          setDataB(resB);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, cityA, cityB]);

  if (!isOpen) return null;

  const selectableCities = [
    ...PRESET_CITIES,
    ...savedCities.filter((s) => !PRESET_CITIES.some((p) => p.name === s.name)),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#0c1322] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 shadow-sm">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Micro-Climate & AQI Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Direct side-by-side atmospheric comparison
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131c31] border border-transparent hover:border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selectors Row */}
        <div className="p-6 bg-[#080d19] border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-400 mb-1.5 uppercase tracking-wider">
              Location A
            </label>
            <select
              value={`${cityA.latitude},${cityA.longitude}`}
              onChange={(e) => {
                const [lat, lon] = e.target.value.split(',').map(Number);
                const found = selectableCities.find(
                  (c) => Math.abs(c.latitude - lat) < 0.01 && Math.abs(c.longitude - lon) < 0.01
                );
                if (found) setCityA(found);
              }}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-display"
            >
              {selectableCities.map((c) => (
                <option
                  key={`a-${c.name}-${c.latitude}`}
                  value={`${c.latitude},${c.longitude}`}
                  className="bg-[#0c1322] text-white"
                >
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-400 mb-1.5 uppercase tracking-wider">
              Location B
            </label>
            <select
              value={`${cityB.latitude},${cityB.longitude}`}
              onChange={(e) => {
                const [lat, lon] = e.target.value.split(',').map(Number);
                const found = selectableCities.find(
                  (c) => Math.abs(c.latitude - lat) < 0.01 && Math.abs(c.longitude - lon) < 0.01
                );
                if (found) setCityB(found);
              }}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-display"
            >
              {selectableCities.map((c) => (
                <option
                  key={`b-${c.name}-${c.latitude}`}
                  value={`${c.latitude},${c.longitude}`}
                  className="bg-[#0c1322] text-white"
                >
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Comparison Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0c1322]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-xs text-slate-400">Fetching live dual telemetry...</p>
            </div>
          ) : dataA && dataB ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City A Inner Card */}
              <div className="p-5 bg-[#131c31] border border-slate-800 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-xl font-bold text-white font-display">
                      {dataA.location.name}
                    </h4>
                    <p className="text-xs text-slate-400">{dataA.location.country}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c1322] border border-slate-700">
                    <WeatherIcon
                      name={dataA.condition.iconName}
                      className="w-8 h-8"
                      style={{ color: dataA.condition.ambientColor }}
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-white font-display">
                    {formatTemp(dataA.current.temperature, unit)}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {dataA.condition.label}
                  </span>
                </div>

                {/* Metrics Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Air Quality Index</span>
                    </span>
                    <span className={`font-bold ${dataA.airQuality.aqi.textColor}`}>
                      {dataA.airQuality.aqi.aqi} ({dataA.airQuality.aqi.level})
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Humidity & Dew Point</span>
                    </span>
                    <span className="font-mono text-slate-200">
                      {dataA.current.relativeHumidity}% · {Math.round(dataA.current.dewPoint)}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Wind Velocity</span>
                    </span>
                    <span className="font-mono text-slate-200">
                      {convertSpeed(dataA.current.windSpeed10m, unit).value}{' '}
                      {convertSpeed(dataA.current.windSpeed10m, unit).unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400">UV Index & Sun</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {dataA.current.uvIndex.toFixed(1)} / 12
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCity(dataA.location);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
                >
                  Set as Active Focus
                </button>
              </div>

              {/* City B Inner Card */}
              <div className="p-5 bg-[#131c31] border border-slate-800 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-xl font-bold text-white font-display">
                      {dataB.location.name}
                    </h4>
                    <p className="text-xs text-slate-400">{dataB.location.country}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c1322] border border-slate-700">
                    <WeatherIcon
                      name={dataB.condition.iconName}
                      className="w-8 h-8"
                      style={{ color: dataB.condition.ambientColor }}
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-white font-display">
                    {formatTemp(dataB.current.temperature, unit)}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {dataB.condition.label}
                  </span>
                </div>

                {/* Metrics Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Air Quality Index</span>
                    </span>
                    <span className={`font-bold ${dataB.airQuality.aqi.textColor}`}>
                      {dataB.airQuality.aqi.aqi} ({dataB.airQuality.aqi.level})
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Humidity & Dew Point</span>
                    </span>
                    <span className="font-mono text-slate-200">
                      {dataB.current.relativeHumidity}% · {Math.round(dataB.current.dewPoint)}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Wind Velocity</span>
                    </span>
                    <span className="font-mono text-slate-200">
                      {convertSpeed(dataB.current.windSpeed10m, unit).value}{' '}
                      {convertSpeed(dataB.current.windSpeed10m, unit).unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c1322] border border-slate-800">
                    <span className="text-slate-400">UV Index & Sun</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {dataB.current.uvIndex.toFixed(1)} / 12
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCity(dataB.location);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
                >
                  Set as Active Focus
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
