export type UnitSystem = 'metric' | 'imperial';

export type ThemeMode = 'dark' | 'light' | 'atmospheric';

export interface GeoLocation {
  id?: number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
  population?: number;
}

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: string; // Lucide icon key
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  backgroundGradientDark: string;
  backgroundGradientLight: string;
  ambientColor: string;
}

export interface CurrentWeather {
  temperature: number; // in Celsius
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number; // hPa
  surfacePressure: number;
  windSpeed10m: number; // km/h
  windDirection10m: number; // degrees
  windGusts10m: number; // km/h
  uvIndex: number;
  dewPoint: number;
  visibility: number; // meters
  time: string;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  formattedHour: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressureMsl: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windDirectionDominant: number;
}

export interface AirPollutant {
  key: string;
  name: string;
  symbol: string;
  value: number; // in µg/m³ (or ppm for CO)
  unit: string;
  whoStandard: number; // WHO guideline safe limit
  description: string;
  healthEffect: string;
  status: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  percentageOfLimit: number;
}

export interface AQIStatus {
  aqi: number; // 0-500 scale (US EPA)
  europeanAqi?: number;
  level: string; // "Good", "Moderate", etc.
  category: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  dominantPollutant: string;
}

export interface HealthRecommendations {
  outdoorExercise: {
    allowed: boolean;
    status: string;
    advice: string;
    icon: string;
  };
  sensitiveGroups: {
    warning: boolean;
    status: string;
    advice: string;
    icon: string;
  };
  maskRequirement: {
    needed: boolean;
    status: string;
    advice: string;
    icon: string;
  };
  ventilation: {
    openWindows: boolean;
    status: string;
    advice: string;
    icon: string;
  };
}

export interface AirQualityData {
  aqi: AQIStatus;
  pollutants: AirPollutant[];
  recommendations: HealthRecommendations;
  hourlyAQI: {
    time: string;
    formattedHour: string;
    aqi: number;
    pm25: number;
    pm10: number;
    ozone: number;
  }[];
}

export interface SunMoonInfo {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  dayLengthMinutes: number;
  currentSunProgress: number; // 0 to 1
  isSunUp: boolean;
  moonPhase: {
    name: string;
    illumination: number; // 0 to 100%
    icon: string;
  };
}

export interface WeatherAlert {
  id: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor' | 'info';
  event: string;
  headline: string;
  description: string;
  instruction: string;
  effective: string;
  expires: string;
  sender: string;
}

export interface ComprehensiveWeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  condition: WeatherCondition;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData;
  sunMoon: SunMoonInfo;
  alerts: WeatherAlert[];
  lastUpdated: string;
  isLive: boolean;
}

export type RadarLayer = 'precipitation' | 'clouds' | 'temperature' | 'aqi' | 'wind';

export interface SavedCity extends GeoLocation {
  savedAt: number;
  lastTempC?: number;
  lastConditionCode?: number;
  lastAQI?: number;
}
