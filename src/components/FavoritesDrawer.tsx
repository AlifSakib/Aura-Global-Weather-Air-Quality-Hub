import React from 'react';
import { SavedCity, UnitSystem } from '../types';
import { formatTemp } from '../utils/weatherUtils';
import {
  Star,
  X,
  Trash2,
  MapPin,
  ArrowRight,
  Split,
  Plus,
  Compass,
} from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: SavedCity[];
  onSelectCity: (city: SavedCity) => void;
  onRemoveCity: (city: SavedCity) => void;
  onOpenCompare: () => void;
  unit: UnitSystem;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedCities,
  onSelectCity,
  onRemoveCity,
  onOpenCompare,
  unit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-[#0c1322] border-y-0 sm:border-y border-r-0 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Saved Cities ({savedCities.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Quick access & multi-location telemetry
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#131c31] border border-transparent hover:border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Compare Button if at least 2 saved cities */}
          {savedCities.length >= 2 && (
            <div className="mt-4">
              <button
                type="button"
                id="open-city-compare-btn"
                onClick={() => {
                  onClose();
                  onOpenCompare();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-md font-display"
              >
                <Split className="w-4 h-4" />
                <span>Side-by-Side City Comparison</span>
              </button>
            </div>
          )}

          {/* List of Saved Cities */}
          <div className="mt-4 space-y-2.5">
            {savedCities.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#131c31] border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Star className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-300 font-medium font-display">No saved cities yet</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click the star icon on any city card to pin it here for instant monitoring.
                </p>
              </div>
            ) : (
              savedCities.map((city) => (
                <div
                  key={`${city.name}-${city.latitude}-${city.longitude}`}
                  className="p-3.5 bg-[#131c31] border border-slate-800 rounded-2xl hover:border-slate-700 transition flex items-center justify-between group shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="flex items-center space-x-3 text-left flex-1 min-w-0"
                  >
                    <div className="p-2 rounded-xl bg-[#0c1322] border border-slate-700 group-hover:border-blue-500/40 text-blue-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5 font-display">
                        <span className="font-bold text-sm text-slate-100">{city.name}</span>
                        {city.countryCode && (
                          <span className="text-[10px] font-mono px-1 rounded bg-[#0c1322] text-slate-400 border border-slate-800">
                            {city.countryCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center space-x-2 ml-2">
                    {city.lastTempC !== undefined && (
                      <span className="font-mono font-bold text-sm text-slate-100">
                        {formatTemp(city.lastTempC, unit)}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveCity(city)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Saved locally on this device via browser storage.
        </div>
      </div>
    </div>
  );
};
