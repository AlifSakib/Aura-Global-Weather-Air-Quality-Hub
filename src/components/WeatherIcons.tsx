import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  MoonStar,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Compass,
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Activity,
  Heart,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun {...props} />;
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'MoonStar':
      return <MoonStar {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'Gauge':
      return <Gauge {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Thermometer':
      return <Thermometer {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'AlertOctagon':
      return <AlertOctagon {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    default:
      return <SunMedium {...props} />;
  }
};
