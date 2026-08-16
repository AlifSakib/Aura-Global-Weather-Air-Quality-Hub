import { WeatherCondition, AQIStatus, AirPollutant, HealthRecommendations, UnitSystem, WeatherAlert, SunMoonInfo } from '../types';

/**
 * Interpret WMO Weather Interpretation Codes (WW)
 * 0: Clear sky
 * 1, 2, 3: Mainly clear, partly cloudy, and overcast
 * 45, 48: Fog and depositing rime fog
 * 51, 53, 55: Drizzle: Light, moderate, and dense intensity
 * 56, 57: Freezing Drizzle: Light and dense intensity
 * 61, 63, 65: Rain: Slight, moderate and heavy intensity
 * 66, 67: Freezing Rain: Light and heavy intensity
 * 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
 * 77: Snow grains
 * 80, 81, 82: Rain showers: Slight, moderate, and violent
 * 85, 86: Snow showers slight and heavy
 * 95: Thunderstorm: Slight or moderate
 * 96, 99: Thunderstorm with slight and heavy hail
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunshine and cloudless sky' : 'Starlit, cloudless night',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        backgroundGradientDark: 'from-sky-950 via-slate-900 to-indigo-950',
        backgroundGradientLight: 'from-sky-100 via-blue-50 to-indigo-100',
        ambientColor: isDay ? '#38bdf8' : '#818cf8',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Occasional light scattered clouds',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        category: 'clear',
        backgroundGradientDark: 'from-blue-950 via-slate-900 to-slate-950',
        backgroundGradientLight: 'from-blue-100 via-sky-50 to-indigo-100',
        ambientColor: '#60a5fa',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of sunshine',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        backgroundGradientDark: 'from-slate-900 via-cyan-950 to-slate-950',
        backgroundGradientLight: 'from-sky-100 via-slate-100 to-blue-100',
        ambientColor: '#38bdf8',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Thick, continuous cloud cover',
        iconName: 'Cloud',
        category: 'cloudy',
        backgroundGradientDark: 'from-slate-900 via-gray-900 to-zinc-950',
        backgroundGradientLight: 'from-slate-200 via-gray-100 to-zinc-200',
        ambientColor: '#94a3b8',
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy & Mist',
        description: 'Reduced horizontal visibility with dense moisture',
        iconName: 'CloudFog',
        category: 'fog',
        backgroundGradientDark: 'from-slate-900 via-stone-900 to-zinc-950',
        backgroundGradientLight: 'from-stone-200 via-slate-200 to-gray-200',
        ambientColor: '#cbd5e1',
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        code,
        label: 'Light Drizzle',
        description: 'Fine, gentle droplets of precipitation',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
        backgroundGradientDark: 'from-slate-900 via-blue-950 to-slate-950',
        backgroundGradientLight: 'from-blue-100 via-cyan-50 to-slate-200',
        ambientColor: '#0ea5e9',
      };
    case 61:
    case 63:
    case 80:
    case 81:
      return {
        code,
        label: 'Rain Showers',
        description: 'Moderate steady rainfall with damp conditions',
        iconName: 'CloudRain',
        category: 'rain',
        backgroundGradientDark: 'from-slate-950 via-sky-950 to-blue-950',
        backgroundGradientLight: 'from-sky-200 via-blue-100 to-slate-200',
        ambientColor: '#0284c7',
      };
    case 65:
    case 66:
    case 67:
    case 82:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense downpour with rapid water accumulation',
        iconName: 'CloudRainWind',
        category: 'rain',
        backgroundGradientDark: 'from-slate-950 via-slate-900 to-blue-950',
        backgroundGradientLight: 'from-blue-200 via-sky-200 to-indigo-200',
        ambientColor: '#2563eb',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        code,
        label: 'Snowfall',
        description: 'Crisp, fluttering snowflakes and frosty chill',
        iconName: 'CloudSnow',
        category: 'snow',
        backgroundGradientDark: 'from-slate-950 via-indigo-950 to-cyan-950',
        backgroundGradientLight: 'from-indigo-100 via-slate-100 to-cyan-100',
        ambientColor: '#a5f3fc',
      };
    case 95:
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning strikes, turbulent wind gusts & thunder',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        backgroundGradientDark: 'from-slate-950 via-purple-950 to-zinc-950',
        backgroundGradientLight: 'from-purple-200 via-slate-200 to-indigo-200',
        ambientColor: '#c084fc',
      };
    default:
      return {
        code,
        label: isDay ? 'Partly Sunny' : 'Partly Clear',
        description: 'Moderate variable cloud cover',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        backgroundGradientDark: 'from-slate-900 via-slate-950 to-slate-900',
        backgroundGradientLight: 'from-slate-100 via-sky-50 to-blue-100',
        ambientColor: '#38bdf8',
      };
  }
}

/**
 * Unit conversions
 */
export function convertTemp(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: UnitSystem): string {
  const value = convertTemp(celsius, unit);
  return `${value}°${unit === 'imperial' ? 'F' : 'C'}`;
}

export function convertSpeed(kmh: number, unit: UnitSystem): { value: number; unit: string } {
  if (unit === 'imperial') {
    return { value: Math.round(kmh * 0.621371), unit: 'mph' };
  }
  return { value: Math.round(kmh), unit: 'km/h' };
}

export function convertPressure(hPa: number, unit: UnitSystem): { value: number; unit: string } {
  if (unit === 'imperial') {
    return { value: Number((hPa * 0.02953).toFixed(2)), unit: 'inHg' };
  }
  return { value: Math.round(hPa), unit: 'hPa' };
}

export function convertPrecipitation(mm: number, unit: UnitSystem): { value: number; unit: string } {
  if (unit === 'imperial') {
    return { value: Number((mm * 0.0393701).toFixed(2)), unit: 'in' };
  }
  return { value: Number(mm.toFixed(1)), unit: 'mm' };
}

export function convertVisibility(meters: number, unit: UnitSystem): { value: number; unit: string } {
  if (unit === 'imperial') {
    const miles = meters / 1609.34;
    return { value: Number(miles.toFixed(1)), unit: 'mi' };
  }
  const km = meters / 1000;
  return { value: Number(km.toFixed(1)), unit: 'km' };
}

/**
 * Convert wind degree to Cardinal Direction
 */
export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * UV Index description & safety advisory
 */
export function getUVAdvisory(uv: number): {
  level: string;
  color: string;
  textColor: string;
  bgColor: string;
  advice: string;
  maxSafeExposure: string;
} {
  if (uv < 3) {
    return {
      level: 'Low',
      color: '#10b981',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      advice: 'Minimal sun protection needed. Safe for extended outdoor activity.',
      maxSafeExposure: '60+ min',
    };
  } else if (uv < 6) {
    return {
      level: 'Moderate',
      color: '#f59e0b',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      advice: 'Wear sunglasses & SPF 30+ sunscreen. Seek shade during midday peak.',
      maxSafeExposure: '45 min',
    };
  } else if (uv < 8) {
    return {
      level: 'High',
      color: '#f97316',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
      advice: 'Protection required. Hat, UV sunglasses, SPF 50+, and reduce direct midday sun.',
      maxSafeExposure: '25 min',
    };
  } else if (uv < 11) {
    return {
      level: 'Very High',
      color: '#ef4444',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      advice: 'Extra protection mandatory. Avoid midday sun (10 AM - 4 PM) & stay hydrated.',
      maxSafeExposure: '15 min',
    };
  } else {
    return {
      level: 'Extreme',
      color: '#a855f7',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      advice: 'Dangerous UV levels. Unprotected skin burns in minutes. Remain indoors when possible.',
      maxSafeExposure: '<10 min',
    };
  }
}

/**
 * Calculate AQI Status from US EPA scale
 */
export function calculateAQIStatus(aqiValue: number): AQIStatus {
  const aqi = Math.max(0, Math.round(aqiValue));

  if (aqi <= 50) {
    return {
      aqi,
      level: 'Good',
      category: 'good',
      color: '#10b981',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/40',
      description: 'Air quality is satisfactory and poses little or no health risk.',
      dominantPollutant: 'PM2.5',
    };
  } else if (aqi <= 100) {
    return {
      aqi,
      level: 'Moderate',
      category: 'moderate',
      color: '#f59e0b',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
      borderColor: 'border-amber-500/40',
      description: 'Air quality is acceptable; unusually sensitive people should consider reducing prolonged outdoor exertion.',
      dominantPollutant: 'PM2.5',
    };
  } else if (aqi <= 150) {
    return {
      aqi,
      level: 'Unhealthy for Sensitive Groups',
      category: 'sensitive',
      color: '#f97316',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/40',
      description: 'Members of sensitive groups (asthma, children, elderly) may experience health effects.',
      dominantPollutant: 'PM2.5',
    };
  } else if (aqi <= 200) {
    return {
      aqi,
      level: 'Unhealthy',
      category: 'unhealthy',
      color: '#ef4444',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/15',
      borderColor: 'border-rose-500/40',
      description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.',
      dominantPollutant: 'PM2.5',
    };
  } else if (aqi <= 300) {
    return {
      aqi,
      level: 'Very Unhealthy',
      category: 'very_unhealthy',
      color: '#a855f7',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      borderColor: 'border-purple-500/40',
      description: 'Health alert: The risk of health effects is increased for everyone. Avoid strenuous outdoor activities.',
      dominantPollutant: 'PM10 & PM2.5',
    };
  } else {
    return {
      aqi,
      level: 'Hazardous',
      category: 'hazardous',
      color: '#881337',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-950/40',
      borderColor: 'border-rose-700/60',
      description: 'Emergency health warning: Serious health effects for the entire population. Stay indoors with air purifiers.',
      dominantPollutant: 'PM2.5',
    };
  }
}

/**
 * Generate Health Recommendations based on AQI and PM2.5
 */
export function generateHealthRecommendations(aqi: number, pm25: number): HealthRecommendations {
  if (aqi <= 50) {
    return {
      outdoorExercise: {
        allowed: true,
        status: 'Optimal for Outdoor Fitness',
        advice: 'Great conditions for running, cycling, and all outdoor sports.',
        icon: 'Activity',
      },
      sensitiveGroups: {
        warning: false,
        status: 'Safe for Everyone',
        advice: 'No precautions needed for asthma, heart conditions, or children.',
        icon: 'Heart',
      },
      maskRequirement: {
        needed: false,
        status: 'No Mask Needed',
        advice: 'Clean natural air. Free breathing without protective gear.',
        icon: 'ShieldCheck',
      },
      ventilation: {
        openWindows: true,
        status: 'Recommended to Ventilate',
        advice: 'Open windows to bring fresh air inside homes and offices.',
        icon: 'Wind',
      },
    };
  } else if (aqi <= 100) {
    return {
      outdoorExercise: {
        allowed: true,
        status: 'Good for Exercise',
        advice: 'Normal outdoor activities are safe. Very sensitive individuals take mild breaks.',
        icon: 'Activity',
      },
      sensitiveGroups: {
        warning: true,
        status: 'Minor Sensitivity Notice',
        advice: 'People with respiratory vulnerabilities should monitor prolonged high-exertion.',
        icon: 'Heart',
      },
      maskRequirement: {
        needed: false,
        status: 'Optional for Sensitive Groups',
        advice: 'Generally not required, except for highly allergic individuals.',
        icon: 'ShieldCheck',
      },
      ventilation: {
        openWindows: true,
        status: 'Open Windows Normally',
        advice: 'Safe to ventilate indoor spaces during breezy morning/evening hours.',
        icon: 'Wind',
      },
    };
  } else if (aqi <= 150) {
    return {
      outdoorExercise: {
        allowed: false,
        status: 'Limit Strenuous Cardio Outdoors',
        advice: 'Shift heavy workouts indoors or reduce session duration significantly.',
        icon: 'Activity',
      },
      sensitiveGroups: {
        warning: true,
        status: 'Caution for Sensitive Groups',
        advice: 'Asthma sufferers keep quick-relief inhalers nearby. Reduce outdoor playtime.',
        icon: 'AlertTriangle',
      },
      maskRequirement: {
        needed: true,
        status: 'Recommended Outdoors',
        advice: 'Consider wearing an N95 or KN95 mask near busy traffic corridors.',
        icon: 'ShieldAlert',
      },
      ventilation: {
        openWindows: false,
        status: 'Keep Windows Mostly Closed',
        advice: 'Use indoor HEPA air filters. Avoid bringing outside pollution indoors.',
        icon: 'Wind',
      },
    };
  } else {
    return {
      outdoorExercise: {
        allowed: false,
        status: 'Avoid Outdoor Activities',
        advice: 'Stay indoors. Heavy breathing outdoors will ingest elevated fine particulates.',
        icon: 'AlertOctagon',
      },
      sensitiveGroups: {
        warning: true,
        status: 'High Health Risk Alert',
        advice: 'Remain inside sealed air-conditioned environments. Avoid all physical exertion.',
        icon: 'AlertTriangle',
      },
      maskRequirement: {
        needed: true,
        status: 'N95 / FFP2 Mandatory',
        advice: 'Wear a sealed particulate respirator mask whenever stepping outdoors.',
        icon: 'ShieldAlert',
      },
      ventilation: {
        openWindows: false,
        status: 'Keep All Windows Sealed',
        advice: 'Run indoor air purifiers on high. Seal cracks and recirculate clean air.',
        icon: 'ShieldX',
      },
    };
  }
}

/**
 * Format local time for given timezone
 */
export function formatLocalTime(timezone: string, date: Date = new Date()): {
  timeStr: string;
  dateStr: string;
  dayStr: string;
  hour: number;
  minute: number;
} {
  try {
    const formatterTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const formatterDate = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formatterDay = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
    });

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(date);

    let hour = 12;
    let minute = 0;
    for (const p of parts) {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }

    return {
      timeStr: formatterTime.format(date),
      dateStr: formatterDate.format(date),
      dayStr: formatterDay.format(date),
      hour,
      minute,
    };
  } catch {
    // Fallback if timezone not recognized
    return {
      timeStr: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      dateStr: date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      dayStr: date.toLocaleDateString([], { weekday: 'long' }),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
}

/**
 * Compute Sun & Moon information
 */
export function computeSunMoon(
  sunriseStr: string,
  sunsetStr: string,
  timezone: string
): SunMoonInfo {
  const now = new Date();
  const localTime = formatLocalTime(timezone, now);

  // Parse sunrise and sunset hours
  let sunriseH = 6, sunriseM = 0;
  let sunsetH = 18, sunsetM = 30;

  if (sunriseStr) {
    const parts = sunriseStr.split('T')[1]?.split(':') || ['06', '00'];
    sunriseH = parseInt(parts[0], 10);
    sunriseM = parseInt(parts[1], 10);
  }

  if (sunsetStr) {
    const parts = sunsetStr.split('T')[1]?.split(':') || ['18', '30'];
    sunsetH = parseInt(parts[0], 10);
    sunsetM = parseInt(parts[1], 10);
  }

  const sunriseTotalMin = sunriseH * 60 + sunriseM;
  const sunsetTotalMin = sunsetH * 60 + sunsetM;
  const currentTotalMin = localTime.hour * 60 + localTime.minute;

  const dayLengthMinutes = Math.max(1, sunsetTotalMin - sunriseTotalMin);
  const isSunUp = currentTotalMin >= sunriseTotalMin && currentTotalMin <= sunsetTotalMin;

  let currentSunProgress = 0;
  if (currentTotalMin < sunriseTotalMin) {
    currentSunProgress = 0;
  } else if (currentTotalMin > sunsetTotalMin) {
    currentSunProgress = 1;
  } else {
    currentSunProgress = (currentTotalMin - sunriseTotalMin) / dayLengthMinutes;
  }

  // Solar noon
  const solarNoonMin = sunriseTotalMin + Math.floor(dayLengthMinutes / 2);
  const solarNoonH = Math.floor(solarNoonMin / 60);
  const solarNoonM = solarNoonMin % 60;
  const solarNoonStr = `${solarNoonH % 12 || 12}:${solarNoonM.toString().padStart(2, '0')} ${solarNoonH >= 12 ? 'PM' : 'AM'}`;

  // Format sunrise/sunset in AM/PM
  const formatAmPm = (h: number, m: number) =>
    `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;

  const sunriseFormatted = formatAmPm(sunriseH, sunriseM);
  const sunsetFormatted = formatAmPm(sunsetH, sunsetM);

  // Golden hours (1 hr after sunrise and 1 hr before sunset)
  const ghMorning = `${sunriseFormatted} – ${formatAmPm(sunriseH + 1, sunriseM)}`;
  const ghEvening = `${formatAmPm(sunsetH - 1, sunsetM)} – ${sunsetFormatted}`;

  // Moon phase calculation based on lunar cycle (~29.53 days)
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const diffDays = (now.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const cycleDay = (diffDays % 29.53058867 + 29.53058867) % 29.53058867;

  let moonPhaseName = 'Waxing Gibbous';
  let illumination = 75;
  let moonIcon = 'Moon';

  if (cycleDay < 1.84) {
    moonPhaseName = 'New Moon';
    illumination = 2;
    moonIcon = 'Moon';
  } else if (cycleDay < 7.38) {
    moonPhaseName = 'Waxing Crescent';
    illumination = 28;
    moonIcon = 'MoonStar';
  } else if (cycleDay < 9.22) {
    moonPhaseName = 'First Quarter';
    illumination = 50;
    moonIcon = 'MoonStar';
  } else if (cycleDay < 14.76) {
    moonPhaseName = 'Waxing Gibbous';
    illumination = 78;
    moonIcon = 'MoonStar';
  } else if (cycleDay < 16.61) {
    moonPhaseName = 'Full Moon';
    illumination = 99;
    moonIcon = 'SunMedium';
  } else if (cycleDay < 22.15) {
    moonPhaseName = 'Waning Gibbous';
    illumination = 76;
    moonIcon = 'MoonStar';
  } else if (cycleDay < 23.99) {
    moonPhaseName = 'Last Quarter';
    illumination = 50;
    moonIcon = 'Moon';
  } else {
    moonPhaseName = 'Waning Crescent';
    illumination = 25;
    moonIcon = 'Moon';
  }

  return {
    sunrise: sunriseFormatted,
    sunset: sunsetFormatted,
    solarNoon: solarNoonStr,
    goldenHourMorning: ghMorning,
    goldenHourEvening: ghEvening,
    dayLengthMinutes,
    currentSunProgress: Math.max(0, Math.min(1, currentSunProgress)),
    isSunUp,
    moonPhase: {
      name: moonPhaseName,
      illumination,
      icon: moonIcon,
    },
  };
}

/**
 * Generate severe weather & environmental alerts dynamically based on conditions
 */
export function evaluateWeatherAlerts(
  tempC: number,
  apparentTempC: number,
  windSpeedKmh: number,
  weatherCode: number,
  uvIndex: number,
  aqi: number,
  visibilityMeters: number
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Heat Advisory
  if (apparentTempC >= 38) {
    alerts.push({
      id: 'heat-alert',
      severity: apparentTempC >= 43 ? 'extreme' : 'severe',
      event: 'Extreme Heat & Humidity Advisory',
      headline: `Heat index peaking at ${Math.round(apparentTempC)}°C (${Math.round((apparentTempC * 9) / 5 + 32)}°F)`,
      description: 'Prolonged exposure and strenuous outdoor activity may result in heat cramps, exhaustion, or heat stroke.',
      instruction: 'Stay in air-conditioned spaces, drink abundant electrolytes, avoid midday sun, and check on elderly neighbors.',
      effective: 'Active Now',
      expires: 'Until 8:00 PM Local Time',
      sender: 'Aura Meteorological Safety System',
    });
  } else if (apparentTempC <= -15) {
    alerts.push({
      id: 'freeze-alert',
      severity: apparentTempC <= -25 ? 'extreme' : 'severe',
      event: 'Severe Wind Chill & Freeze Warning',
      headline: `Sub-zero wind chills of ${Math.round(apparentTempC)}°C`,
      description: 'Frostbite risk on exposed skin within 15 minutes. Potential icy road hazards.',
      instruction: 'Dress in multiple thermal layers, protect extremities, and minimize outdoor exposure.',
      effective: 'Active Now',
      expires: 'Until 10:00 AM Tomorrow',
      sender: 'Aura Meteorological Safety System',
    });
  }

  // Gale / High Wind Warning
  if (windSpeedKmh >= 55) {
    alerts.push({
      id: 'wind-alert',
      severity: windSpeedKmh >= 75 ? 'extreme' : 'moderate',
      event: 'High Wind & Gale Warning',
      headline: `Sustained winds of ${Math.round(windSpeedKmh)} km/h with severe gusts`,
      description: 'Strong gusts may blow down tree branches, cause localized power outages, and make driving high-profile vehicles hazardous.',
      instruction: 'Secure loose outdoor furniture, avoid parking under large trees, and use caution when driving over open bridges.',
      effective: 'Active Now',
      expires: 'Until Midnight Local Time',
      sender: 'Aura Atmospheric Watch',
    });
  }

  // Thunderstorm / Severe Storm
  if ([95, 96, 99].includes(weatherCode)) {
    alerts.push({
      id: 'storm-alert',
      severity: 'severe',
      event: 'Active Thunderstorm Alert',
      headline: 'Turbulent convective storm with lightning and heavy precipitation',
      description: 'Cloud-to-ground lightning, rapid ponding on roadways, and localized hail possible in affected sectors.',
      instruction: 'Move indoors immediately. Avoid open water, tall isolated structures, and unplug sensitive electronics.',
      effective: 'Active Now',
      expires: 'Valid next 3 hours',
      sender: 'Aura Severe Convective Center',
    });
  }

  // Dense Fog Warning
  if (visibilityMeters < 1000 && [45, 48].includes(weatherCode)) {
    alerts.push({
      id: 'fog-alert',
      severity: 'moderate',
      event: 'Dense Fog & Low Visibility Advisory',
      headline: `Surface visibility restricted to ${Math.round(visibilityMeters)} meters`,
      description: 'Rapid fluctuations in visibility across roadways and airport approach paths.',
      instruction: 'Slow down, use low-beam headlights only, and maintain a generous following distance.',
      effective: 'Active Now',
      expires: 'Until Morning Burn-Off',
      sender: 'Aura Aviation & Roadways Watch',
    });
  }

  // Air Pollution Warning
  if (aqi >= 151) {
    alerts.push({
      id: 'aqi-alert',
      severity: aqi >= 201 ? 'extreme' : 'severe',
      event: aqi >= 201 ? 'Very Unhealthy Air Quality Health Emergency' : 'Unhealthy Air Quality Advisory',
      headline: `Air Quality Index measured at ${aqi} (US EPA Scale)`,
      description: 'Elevated concentrations of fine particulate matter (PM2.5) posing immediate respiratory strain.',
      instruction: 'Wear a certified N95 particulate mask outdoors, keep windows tightly closed, and operate indoor HEPA filtration.',
      effective: 'Active Now',
      expires: 'Continuous Monitoring',
      sender: 'Aura Environmental Health Network',
    });
  }

  // Extreme UV Alert
  if (uvIndex >= 10) {
    alerts.push({
      id: 'uv-alert',
      severity: 'moderate',
      event: 'Extreme Ultraviolet Radiation Warning',
      headline: `Peak Solar UV Index reaching ${Math.round(uvIndex)}`,
      description: 'Very rapid sunburn potential. DNA cell damage risk upon unprotected direct exposure.',
      instruction: 'Apply broad-spectrum SPF 50+ sunscreen, wear UV400 sunglasses, and stay under shade during peak midday hours.',
      effective: '11:00 AM – 3:30 PM',
      expires: '4:00 PM Today',
      sender: 'Aura Solar Radiation Division',
    });
  }

  return alerts;
}
