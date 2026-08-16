# Aura: Global Weather & Air Quality Hub

An interactive, high-precision meteorological intelligence dashboard and real-time air quality monitoring application. Built with modern React 19, TypeScript, Tailwind CSS v4, Recharts, and HTML5 Canvas, powered by the live Open-Meteo Weather and Air Quality APIs.

---

## 🌟 Features Overview

### 1. 🌤️ Real-Time Current Weather & Micro-Climate Hub
- **Live Atmosphere Metrics**: Instant reading of current temperature, "feels like" apparent temperature, weather condition code, humidity, wind speed, gust velocity, barometric pressure, visibility, and UV index.
- **Unit Switching**: Seamless one-click toggling between Imperial (°F, mph, inHg) and Metric (°C, km/h, hPa) units across all graphs, stats, and timelines.
- **Micro-Climate Telemetry Grid**: Dedicated cards detailing Wind Vector & Direction Compass, Atmospheric Moisture & Dew Point, UV Solar Hazard Scale, Surface Pressure Tendency, Optical Visibility, and Relative Humidity.
- **Severe Weather Alert Engine**: Automatic detection and dynamic warning banners for high heat index, extreme UV exposure, high winds, poor air quality, and severe storm thresholds.

### 2. 🍃 Air Quality Index (AQI) & WHO Pollutant Safety Breakdown
- **US EPA AQI Dial**: Precision semicircular vector gauge showing the current Air Quality Index with dynamic color rating (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous).
- **Six-Component Pollutant Telemetry**:
  - **PM2.5** (Fine Particulate Matter)
  - **PM10** (Coarse Particulate Matter)
  - **O₃** (Ground-Level Ozone)
  - **NO₂** (Nitrogen Dioxide)
  - **SO₂** (Sulfur Dioxide)
  - **CO** (Carbon Monoxide)
- **World Health Organization (WHO) Threshold Comparison**: Visual progress bars mapping live concentrations against WHO recommended 24-hour safety guidelines with contextual health advisories.
- **Tailored Health Recommendations**: Categorized activity recommendations for general populations, sensitive groups (asthma/respiratory), outdoor athletes, and ventilation/mask guidance.

### 3. 🛰️ Environmental Radar & Satellite Visualizer
- **Interactive HTML5 Canvas Radar**: Real-time simulation engine rendering particle-field wind streamlines, dynamic radar sweeps, precipitation reflectivity, cloud density clusters, thermal heatmaps, and air quality overlays.
- **5 Multi-Spectral Layers**:
  - **Precipitation Radar**: Simulated Doppler radar reflectivity showing rain, storm cells, and cloud cover.
  - **Cloud Density**: Satellite infrared cloud cover simulation.
  - **Thermal Layer**: Heat distribution contour map.
  - **AQI Dispersion**: Particulate dispersion field.
  - **Wind Streamlines**: Particle-based animated vector flow field reflecting local wind speed and angle.
- **Interactive Playback & Zoom**: Timeline scrubber with past and near-future steps, play/pause radar loop animation, zoom controls, and centering crosshairs.

### 4. ☀️ Solar Trajectory & 🌙 Lunar Phase Timeline
- **Parabolic Solar Arc**: Mathematical calculation of solar elevation, golden hour, solar noon, dawn, and dusk based on city latitude, longitude, and current solar time.
- **Daylight Duration Tracker**: Live elapsed sunlight percentage and remaining daylight countdown.
- **Astronomical Lunar Cycle**: Calculation of current moon phase (New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent) with illuminated percentage and moonrise/moonset timings.

### 5. 📈 24-Hour Timeline & 7-Day Extended Outlook
- **Interactive Composed Chart (Recharts)**: Smooth temperature spline curve overlaid with precipitation probability bar charts, custom dark-slate tooltips, and time markers.
- **Horizontal Hourly Cards**: Fast horizontal scrolling strip showing hourly conditions, temperatures, wind velocities, and precipitation odds.
- **7-Day Synoptic Forecast**: Daily high/low temperature range bars, dominant weather icon badges, wind vectors, and rain probability.

### 6. 🌍 Global Search, Geolocation & City Comparison
- **Live Geocoding Search**: Fast search across global cities, towns, and regions using the Open-Meteo Geocoding API.
- **One-Click Geolocation**: Instant location lookup via the browser's Geolocation API with reverse geocoding.
- **World City Presets**: Quick-access preset pills for major global metropolises with real-time local clock calculation.
- **Side-by-Side City Comparison Modal**: Compare weather conditions, temperature, air quality, humidity, and wind between two locations simultaneously.
- **Saved Favorites Drawer**: Bookmark favorite locations stored locally in browser storage for quick retrieval.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/)
- **Graphics Engine**: HTML5 Canvas 2D API for high-performance radar rendering
- **Data APIs**: [Open-Meteo Free Weather & Air Quality APIs](https://open-meteo.com/) (no API key required, highly reliable)

---

## 📡 Data Pipeline & APIs

The application aggregates real-time environmental data directly from Open-Meteo endpoints:

1. **Weather Forecast API** (`https://api.open-meteo.com/v1/forecast`):
   - Current temperature, apparent temperature, relative humidity, precipitation, weather code (WMO), surface pressure, wind speed, wind direction, wind gusts, UV index, and visibility.
   - Hourly 24-hour predictions and 7-day daily high/low aggregates, sunrise, sunset, and solar radiation.
2. **Air Quality API** (`https://air-quality-api.open-meteo.com/v1/air-quality`):
   - European AQI, US AQI, PM2.5, PM10, Carbon Monoxide (CO), Nitrogen Dioxide (NO₂), Sulfur Dioxide (SO₂), and Ozone (O₃).
3. **Geocoding API** (`https://geocoding-api.open-meteo.com/v1/search`):
   - City name search, country resolution, coordinates, elevation, and timezone detection.
4. **In-Memory Caching**:
   - Implements a client-side 5-minute TTL cache to reduce network requests and ensure instant tab/view switching.

---

## 📁 Project Directory Structure

```
├── index.html                 # HTML entry point
├── metadata.json              # Applet metadata, title, and permissions
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
└── src/
    ├── main.tsx               # React application entry point
    ├── App.tsx                # Main dashboard layout and state orchestration
    ├── index.css              # Global styles, fonts, and Tailwind CSS imports
    ├── types.ts               # Shared TypeScript interfaces and data models
    ├── components/
    │   ├── Navbar.tsx                   # Top navigation bar, search, units, and actions
    │   ├── CitySearchBar.tsx            # Live geocoding search dropdown
    │   ├── QuickCityPresets.tsx         # Quick city presets with live local clocks
    │   ├── SevereAlertBanner.tsx        # Dynamic severe weather warning alerts
    │   ├── CurrentWeatherHero.tsx       # Primary weather card with dynamic sky gradients
    │   ├── AirQualityCard.tsx           # US AQI semicircular gauge & air health status
    │   ├── PollutantBreakdown.tsx       # Detailed PM2.5, PM10, O3, NO2, SO2, CO metrics
    │   ├── MicroClimateGrid.tsx         # 6-card micro-climate telemetry grid
    │   ├── SunMoonTimeline.tsx          # Parabolic solar arc & lunar phase tracker
    │   ├── ForecastSection.tsx          # 24-hour Recharts curve & 7-day outlook
    │   ├── EnvironmentalRadar.tsx       # HTML5 Canvas radar and satellite visualizer
    │   ├── CityCompareModal.tsx         # Side-by-side multi-city comparison
    │   ├── FavoritesDrawer.tsx          # Saved favorite cities drawer
    │   ├── WeatherIcons.tsx             # Dynamic weather iconography mapper
    │   └── Footer.tsx                   # Dashboard footer and data attribution
    ├── services/
    │   └── weatherApi.ts                # API client, geocoding, reverse lookup, and cache
    ├── utils/
    │   └── weatherUtils.ts              # Meteorological calculations, AQI logic, and astronomical models
    └── data/
        └── presetCities.ts              # Curated global cities and fallback datasets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Production Build
To create an optimized production bundle:
```bash
npm run build
```

To test TypeScript compilation and linting:
```bash
npm run lint
```

---

## 📄 License & Attribution

- Weather, Air Quality, and Geocoding data provided by [Open-Meteo](https://open-meteo.com/) under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.
- Map and reverse geocoding assistance via [BigDataCloud](https://www.bigdatacloud.com/).
# Aura-Global-Weather-Air-Quality-Hub
