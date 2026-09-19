import React from 'react';
import {
  Search,
  Target,
  TrendingUp,
  Megaphone,
  Code,
  Sparkles,
  Palette,
  Mail,
  Zap,
  BarChart3,
  Globe,
  Layers,
  Cpu,
  Share2,
  Compass
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Search,
  Target,
  TrendingUp,
  Megaphone,
  Code,
  Sparkles,
  Palette,
  Mail,
  Zap,
  BarChart3,
  Globe,
  Layers,
  Cpu,
  Share2,
  Compass
};

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = iconMap[name] || Target;
  return <IconComponent className={className} />;
};

export const AVAILABLE_ICONS = Object.keys(iconMap);
