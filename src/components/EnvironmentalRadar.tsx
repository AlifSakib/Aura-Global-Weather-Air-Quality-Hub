import React, { useState, useEffect, useRef } from 'react';
import { RadarLayer, GeoLocation, WeatherCondition } from '../types';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  CloudRain,
  Cloud,
  Thermometer,
  Wind,
  Activity,
  Maximize2,
} from 'lucide-react';

interface EnvironmentalRadarProps {
  location: GeoLocation;
  condition: WeatherCondition;
  temperatureC: number;
  aqiValue: number;
}

export const EnvironmentalRadar: React.FC<EnvironmentalRadarProps> = ({
  location,
  condition,
  temperatureC,
  aqiValue,
}) => {
  const [activeLayer, setActiveLayer] = useState<RadarLayer>('precipitation');
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineIndex, setTimelineIndex] = useState(3); // 0: -3h, 1: -2h, 2: -1h, 3: Now, 4: +1h
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const timelineSteps = ['-3 Hours', '-2 Hours', '-1 Hour', 'Live (Now)', '+1 Hour Forecast'];

  // Animation loop for radar scrubber
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimelineIndex((prev) => (prev + 1) % timelineSteps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, timelineSteps.length]);

  // Canvas drawing effect for realistic atmospheric simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let isCancelled = false;

    // Set canvas dimensions
    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = 360);

    // Particle nodes for Wind & AQI
    const particleCount = 45;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 1.5 + 0.5) * (activeLayer === 'wind' ? 2.5 : 1),
        vy: (Math.sin(i) * 0.5) * (activeLayer === 'wind' ? 1.5 : 0.8),
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      if (isCancelled) return;
      frame++;

      // 1. Clear background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 2. Draw topographic radar map rings & grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;

      // Concentric range circles
      [60, 120, 180, 240].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * zoomLevel, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Simulated topography / landmass contours
      ctx.fillStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.beginPath();
      ctx.ellipse(centerX - 80 * zoomLevel, centerY - 40 * zoomLevel, 140 * zoomLevel, 90 * zoomLevel, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(centerX + 90 * zoomLevel, centerY + 50 * zoomLevel, 120 * zoomLevel, 70 * zoomLevel, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // 3. Layer specific visual rendering
      const tShift = timelineIndex * 15;

      if (activeLayer === 'precipitation') {
        // Render Doppler rain blobs
        const rainBlobs = [
          { x: centerX - 60 + tShift, y: centerY - 40, r: 50 * zoomLevel, color: 'rgba(34, 197, 94, 0.45)' },
          { x: centerX - 40 + tShift, y: centerY - 30, r: 35 * zoomLevel, color: 'rgba(234, 179, 8, 0.55)' },
          { x: centerX - 25 + tShift, y: centerY - 20, r: 18 * zoomLevel, color: 'rgba(239, 68, 68, 0.65)' },
          { x: centerX + 70 + tShift, y: centerY + 50, r: 40 * zoomLevel, color: 'rgba(59, 130, 246, 0.4)' },
        ];

        rainBlobs.forEach((b) => {
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          grad.addColorStop(0, b.color);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Rotating radar sweep beam
        const sweepAngle = (frame * 0.02) % (Math.PI * 2);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sweepAngle);
        const sweepGrad = ctx.createLinearGradient(0, 0, 200 * zoomLevel, 0);
        sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
        sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 240 * zoomLevel, 0, Math.PI / 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (activeLayer === 'clouds') {
        // Smooth cloud moisture field
        for (let i = 0; i < 6; i++) {
          const cx = (centerX - 150 + i * 70 + tShift * 2 + Math.sin(frame * 0.01 + i) * 20) % width;
          const cy = centerY - 50 + (i % 3) * 40;
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 90 * zoomLevel);
          grad.addColorStop(0, 'rgba(241, 245, 249, 0.28)');
          grad.addColorStop(1, 'rgba(241, 245, 249, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, 90 * zoomLevel, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeLayer === 'temperature') {
        // Temperature Thermal heatmap
        const thermalGrad = ctx.createLinearGradient(0, 0, width, height);
        thermalGrad.addColorStop(0, 'rgba(59, 130, 246, 0.35)'); // Cool
        thermalGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.35)'); // Mild
        thermalGrad.addColorStop(1, 'rgba(239, 68, 68, 0.45)'); // Warm
        ctx.fillStyle = thermalGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (activeLayer === 'aqi') {
        // AQI particulate density
        const aqiColor =
          aqiValue <= 50
            ? 'rgba(16, 185, 129, 0.35)'
            : aqiValue <= 100
            ? 'rgba(245, 158, 11, 0.4)'
            : aqiValue <= 150
            ? 'rgba(249, 115, 22, 0.45)'
            : 'rgba(239, 68, 68, 0.55)';

        const aqiGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 200 * zoomLevel);
        aqiGrad.addColorStop(0, aqiColor);
        aqiGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aqiGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 200 * zoomLevel, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw particle vectors (Wind / Aerosols)
      particles.forEach((p) => {
        p.x = (p.x + p.vx) % width;
        p.y = (p.y + p.vy + height) % height;

        ctx.fillStyle = activeLayer === 'aqi' ? '#f59e0b' : '#38bdf8';
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (activeLayer === 'wind') {
          // Draw mini wind trail
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      // 5. City Target Pin & Label
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Outer target ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.stroke();

      // City Name text box
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(location.name, centerX, centerY - 16);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeLayer, zoomLevel, timelineIndex, location.name, aqiValue]);

  return (
    <div
      id="environmental-radar-visualizer"
      className="w-full bg-[#0c1322] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5"
    >
      {/* Header & Layer Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Environmental Radar & Satellite Visualizer
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Simulated Scan
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-spectral Doppler reflectivity, cloud density, and pollutant flow
            </p>
          </div>
        </div>

        {/* Layer Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveLayer('precipitation')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLayer === 'precipitation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#131c31] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('clouds')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLayer === 'clouds'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#131c31] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Cover</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('temperature')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLayer === 'temperature'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#131c31] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('aqi')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLayer === 'aqi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#131c31] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AQI Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('wind')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLayer === 'wind'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#131c31] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Vectors</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#080d19] h-80 sm:h-96 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* Top-left Overlay Legend */}
        <div className="absolute top-3 left-3 px-3 py-2 rounded-xl bg-[#0c1322]/90 backdrop-blur-md border border-slate-700 text-xs space-y-1 z-10 pointer-events-none shadow-lg">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
            Active Layer: {activeLayer.toUpperCase()}
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-300">
            <span>Center: {location.name}</span>
            <span>({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)</span>
          </div>
        </div>

        {/* Top-right Zoom Controls */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
            className="p-2 rounded-xl bg-[#0c1322]/90 hover:bg-[#131c31] border border-slate-700 text-slate-300 hover:text-white transition shadow-md"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-2 rounded-xl bg-[#0c1322]/90 hover:bg-[#131c31] border border-slate-700 text-slate-300 hover:text-white transition shadow-md"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-xl bg-[#0c1322]/90 hover:bg-[#131c31] border border-slate-700 text-slate-300 hover:text-white transition shadow-md"
            title="Reset Center"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Legend Color Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto px-3.5 py-2 rounded-xl bg-[#0c1322]/90 backdrop-blur-md border border-slate-700 text-xs z-10 shadow-lg">
          {activeLayer === 'precipitation' && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-mono">Intensity:</span>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-2 rounded-sm bg-green-500" title="Light" />
                <span className="w-3 h-2 rounded-sm bg-yellow-500" title="Moderate" />
                <span className="w-3 h-2 rounded-sm bg-orange-500" title="Heavy" />
                <span className="w-3 h-2 rounded-sm bg-red-600" title="Severe" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Light → Torrential</span>
            </div>
          )}
          {activeLayer === 'temperature' && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-mono">Cold</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500" />
              <span className="text-[10px] text-slate-400 font-mono">Hot</span>
            </div>
          )}
          {activeLayer === 'aqi' && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-mono">Clean</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600" />
              <span className="text-[10px] text-slate-400 font-mono">Hazardous</span>
            </div>
          )}
          {(activeLayer === 'clouds' || activeLayer === 'wind') && (
            <div className="text-[11px] text-slate-300 font-mono">
              Live Particle Dispersion Field
            </div>
          )}
        </div>
      </div>

      {/* Radar Timeline Scrubber & Player Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#131c31] border border-slate-800 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            type="button"
            onClick={() => setTimelineIndex(3)}
            className="p-2 rounded-xl bg-[#0c1322] hover:bg-[#15213d] border border-slate-700 text-slate-300 transition"
            title="Jump to Real-time Now"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-200 pl-1">
            {timelineSteps[timelineIndex]}
          </span>
        </div>

        {/* Scrubber step buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {timelineSteps.map((step, idx) => (
            <button
              key={step}
              type="button"
              onClick={() => {
                setTimelineIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                timelineIndex === idx
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'bg-[#0c1322] text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {step.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
