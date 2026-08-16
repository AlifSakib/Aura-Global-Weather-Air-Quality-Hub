import React, { useState, useEffect, useCallback } from 'react';
import {
  GeoLocation,
  ComprehensiveWeatherData,
  UnitSystem,
  ThemeMode,
  SavedCity,
} from './types';
import { DEFAULT_CITY } from './data/presetCities';
import { fetchComprehensiveWeatherData, reverseGeocode } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { QuickCityPresets } from './components/QuickCityPresets';
import { SevereAlertBanner } from './components/SevereAlertBanner';
import { MeteorologicalHubPrototype } from './components/MeteorologicalHubPrototype';
import { MicroClimateGrid } from './components/MicroClimateGrid';
import { SunMoonTimeline } from './components/SunMoonTimeline';
import { AirQualityCard } from './components/AirQualityCard';
import { ForecastSection } from './components/ForecastSection';
import { EnvironmentalRadar } from './components/EnvironmentalRadar';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CityCompareModal } from './components/CityCompareModal';
import { Footer } from './components/Footer';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [currentCity, setCurrentCity] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('aura_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [weatherData, setWeatherData] = useState<ComprehensiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Unit System
  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      return (localStorage.getItem('aura_unit') as UnitSystem) || 'metric';
    } catch {
      return 'metric';
    }
  });

  // Theme Mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('aura_theme') as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Saved Favorite Cities
  const [savedCities, setSavedCities] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem('aura_saved_cities');
      if (saved) return JSON.parse(saved);
      // Default to 3 initial global pins
      return [
        { ...DEFAULT_CITY, savedAt: Date.now() },
        {
          name: 'London',
          country: 'United Kingdom',
          countryCode: 'GB',
          latitude: 51.5085,
          longitude: -0.1257,
          timezone: 'Europe/London',
          savedAt: Date.now(),
        },
        {
          name: 'New York',
          country: 'United States',
          countryCode: 'US',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
          savedAt: Date.now(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sync unit to localStorage
  useEffect(() => {
    localStorage.setItem('aura_unit', unit);
  }, [unit]);

  // Sync saved cities to localStorage
  useEffect(() => {
    localStorage.setItem('aura_saved_cities', JSON.stringify(savedCities));
  }, [savedCities]);

  // Sync theme class to document
  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  // Load weather data for current city
  const loadWeatherData = useCallback(
    async (city: GeoLocation, showFullLoader = false) => {
      if (showFullLoader) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const data = await fetchComprehensiveWeatherData(city);
        setWeatherData(data);

        // Update lastCity
        localStorage.setItem('aura_last_city', JSON.stringify(city));

        // Update telemetry snapshot in savedCities if pinned
        setSavedCities((prev) =>
          prev.map((sc) => {
            if (
              Math.abs(sc.latitude - city.latitude) < 0.05 &&
              Math.abs(sc.longitude - city.longitude) < 0.05
            ) {
              return {
                ...sc,
                lastTempC: data.current.temperature,
                lastConditionCode: data.current.weatherCode,
                lastAQI: data.airQuality.aqi.aqi,
              };
            }
            return sc;
          })
        );
      } catch (err) {
        console.error('Failed to load weather data:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial fetch and city change
  useEffect(() => {
    loadWeatherData(currentCity, !weatherData);
  }, [currentCity, loadWeatherData]);

  // Automatic background refresh every 10 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      loadWeatherData(currentCity, false);
    }, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [currentCity, loadWeatherData]);

  // Handle City Selection
  const handleSelectCity = (city: GeoLocation) => {
    setCurrentCity(city);
    setGeoError(null);
  };

  // 1-Click Geolocation Flow
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingGeo(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocode(latitude, longitude);
          setCurrentCity(loc);
        } catch (err) {
          console.error(err);
          setGeoError('Could not resolve your coordinate address.');
        } finally {
          setIsLoadingGeo(false);
        }
      },
      (err) => {
        console.warn(err);
        setIsLoadingGeo(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission was denied. Please allow access or search manually.');
        } else {
          setGeoError('Could not acquire your GPS fix. Please search your city.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Favorite
  const isCurrentFavorite = savedCities.some(
    (c) =>
      Math.abs(c.latitude - currentCity.latitude) < 0.05 &&
      Math.abs(c.longitude - currentCity.longitude) < 0.05
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setSavedCities((prev) =>
        prev.filter(
          (c) =>
            Math.abs(c.latitude - currentCity.latitude) >= 0.05 ||
            Math.abs(c.longitude - currentCity.longitude) >= 0.05
        )
      );
    } else {
      const newCity: SavedCity = {
        ...currentCity,
        savedAt: Date.now(),
        lastTempC: weatherData?.current.temperature,
        lastConditionCode: weatherData?.current.weatherCode,
        lastAQI: weatherData?.airQuality.aqi.aqi,
      };
      setSavedCities((prev) => [newCity, ...prev]);
    }
  };

  const handleRemoveCity = (city: SavedCity) => {
    setSavedCities((prev) =>
      prev.filter(
        (c) =>
          Math.abs(c.latitude - city.latitude) >= 0.05 ||
          Math.abs(c.longitude - city.longitude) >= 0.05
      )
    );
  };

  // Toggle Theme mode
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'atmospheric' : 'dark'));
  };

  // Toggle Unit System
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  // Dynamic Background classes based on theme and condition
  const dynamicBackgroundClass =
    theme === 'light'
      ? 'bg-slate-50 text-slate-900'
      : theme === 'atmospheric' && weatherData
      ? `bg-gradient-to-b ${weatherData.condition.backgroundGradientDark} text-slate-100`
      : 'bg-slate-950 text-slate-100';

  return (
    <div className={`min-h-screen flex flex-col ${dynamicBackgroundClass} transition-colors duration-700`}>
      {/* Top Navbar */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        savedCitiesCount={savedCities.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onSelectCity={handleSelectCity}
        onUseGeolocation={handleUseGeolocation}
        isLoadingGeo={isLoadingGeo}
        isLive={weatherData?.isLive ?? true}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Geolocation Error Toast if any */}
        {geoError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{geoError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGeoError(null)}
              className="text-xs font-bold underline ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Quick City Presets Bar with live clocks */}
        <QuickCityPresets
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
        />

        {/* Loading Spinner during initial fetch */}
        {isLoading && !weatherData ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Synchronizing with Open-Meteo Atmospheric Sensors...
            </p>
            <p className="text-xs text-slate-500">
              Fetching temperature, Doppler precipitation, and chemical AQI mesh
            </p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6">
            {/* Active Severe Alerts Banner (Heat, Wind, Storm, Fog, AQI, UV) */}
            <SevereAlertBanner alerts={weatherData.alerts} />

            {/* Aura Meteorological Hub Centerpiece (Matches User Selected Prototype) */}
            <MeteorologicalHubPrototype
              data={weatherData}
              unit={unit}
              onToggleUnit={handleToggleUnit}
              onSelectCity={handleSelectCity}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRefresh={() => loadWeatherData(currentCity, false)}
              isRefreshing={isRefreshing}
            />

            {/* Micro-Climate Metrics 6-Cell Grid */}
            <MicroClimateGrid
              current={weatherData.current}
              unit={unit}
            />

            {/* Astronomical Sun & Moon Trajectory */}
            <SunMoonTimeline sunMoon={weatherData.sunMoon} />

            {/* Real-Time Air Quality Index & Health Matrix */}
            <AirQualityCard airQuality={weatherData.airQuality} />

            {/* 24-Hour Hourly Timeline & 7-Day Forecast */}
            <ForecastSection
              hourly={weatherData.hourly}
              daily={weatherData.daily}
              unit={unit}
            />

            {/* Interactive Environmental Radar & Visualizer */}
            <EnvironmentalRadar
              location={weatherData.location}
              condition={weatherData.condition}
              temperatureC={weatherData.current.temperature}
              aqiValue={weatherData.airQuality.aqi.aqi}
            />
          </div>
        ) : null}
      </main>

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedCities={savedCities}
        onSelectCity={handleSelectCity}
        onRemoveCity={handleRemoveCity}
        onOpenCompare={() => setIsCompareOpen(true)}
        unit={unit}
      />

      {/* Side-by-Side City Compare Modal */}
      <CityCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentCity={currentCity}
        savedCities={savedCities}
        unit={unit}
        onSelectCity={handleSelectCity}
      />

      {/* Global Footer */}
      <Footer
        lastUpdated={weatherData?.lastUpdated || new Date().toISOString()}
        isLive={weatherData?.isLive ?? true}
      />
    </div>
  );
}
