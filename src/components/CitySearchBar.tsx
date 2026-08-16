import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Globe2, Navigation } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchLocations } from '../services/weatherApi';

interface CitySearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  onUseGeolocation: () => void;
  isLoadingGeo?: boolean;
  className?: string;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  onSelectCity,
  onUseGeolocation,
  isLoadingGeo = false,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim().length >= 2) {
        setIsLoading(true);
        searchLocations(query).then((res) => {
          if (res.length > 0) {
            handleSelect(res[0]);
          }
          setIsLoading(false);
        });
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          id="city-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search any global city, region, or coordinates..."
          className="w-full pl-10 pr-24 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-slate-900/90 border border-white/10 focus:border-cyan-500/80 rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner font-display"
        />

        <div className="absolute right-2 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            id="use-geolocation-btn"
            onClick={onUseGeolocation}
            disabled={isLoadingGeo}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-cyan-950/80 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition shadow-sm font-display"
            title="Use current device GPS location"
          >
            {isLoadingGeo ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="hidden sm:inline font-semibold">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-1.5 bento-card shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-white/[0.06]">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs text-slate-400">
              No matching locations found for "{query}".
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={`${item.id || item.name}-${item.latitude}-${item.longitude}-${index}`}
                  type="button"
                  id={`search-result-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-cyan-950/60 text-cyan-100' : 'text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] border border-white/10 text-slate-400'
                      }`}
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5 font-display">
                        <span className="font-bold text-sm text-slate-100">{item.name}</span>
                        {item.countryCode && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-cyan-400 border border-white/10">
                            {item.countryCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
