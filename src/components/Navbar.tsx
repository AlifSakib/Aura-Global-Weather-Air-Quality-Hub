import React from 'react';
import { UnitSystem, ThemeMode, GeoLocation, SavedCity } from '../types';
import { CitySearchBar } from './CitySearchBar';
import {
  CloudSun,
  Star,
  Split,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Radio,
} from 'lucide-react';

interface NavbarProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  savedCitiesCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onSelectCity: (city: GeoLocation) => void;
  onUseGeolocation: () => void;
  isLoadingGeo: boolean;
  isLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  theme,
  onToggleTheme,
  savedCitiesCount,
  onOpenFavorites,
  onOpenCompare,
  onSelectCity,
  onUseGeolocation,
  isLoadingGeo,
  isLive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 border border-white/20">
            <CloudSun className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-white font-display">
                AURA
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                LIVE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium -mt-0.5">
              Global Weather & Air Quality Hub
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="flex-1 max-w-xl mx-2">
          <CitySearchBar
            onSelectCity={onSelectCity}
            onUseGeolocation={onUseGeolocation}
            isLoadingGeo={isLoadingGeo}
          />
        </div>

        {/* Action Controls (Unit toggle, Favorites, Compare, Theme) */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Unit Toggle */}
          <button
            type="button"
            id="unit-toggle-btn"
            onClick={onToggleUnit}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono font-bold text-slate-200 transition shadow-sm"
            title={`Switch to ${unit === 'metric' ? 'Imperial (°F, mph)' : 'Metric (°C, km/h)'}`}
          >
            <span className={unit === 'metric' ? 'text-cyan-400' : 'text-slate-500'}>°C</span>
            <span className="text-slate-600">/</span>
            <span className={unit === 'imperial' ? 'text-cyan-400' : 'text-slate-500'}>°F</span>
          </button>

          {/* City Comparison Trigger */}
          <button
            type="button"
            id="navbar-compare-btn"
            onClick={onOpenCompare}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition shadow-sm"
            title="Side-by-side city comparison"
          >
            <Split className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare</span>
          </button>

          {/* Saved Cities Drawer Button */}
          <button
            type="button"
            id="navbar-favorites-btn"
            onClick={onOpenFavorites}
            className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-amber-400 transition shadow-sm"
            title="View saved favorite cities"
          >
            <Star className="w-4 h-4" />
            {savedCitiesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold flex items-center justify-center">
                {savedCitiesCount}
              </span>
            )}
          </button>

          {/* Theme Mode Switcher */}
          <button
            type="button"
            id="navbar-theme-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-cyan-300 transition shadow-sm"
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
