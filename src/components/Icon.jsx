import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Add02Icon,
  AlertCircleIcon,
  Alert02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Building06Icon,
  Camera01Icon,
  Car01Icon,
  ChartHistogramIcon,
  CheckmarkCircle02Icon,
  ChefHatIcon,
  Clock01Icon,
  DropletIcon,
  ElectricPlugsIcon,
  FlashIcon,
  Globe02Icon,
  GpsSignal01Icon,
  Home01Icon,
  HouseIcon,
  Image02Icon,
  ImageDone01Icon,
  Invoice01Icon,
  Leaf01Icon,
  PaintBoardIcon,
  Shield01Icon,
  ShieldEnergyIcon,
  SprayCanIcon,
  SquareLock02Icon,
  Target01Icon,
  Tick02Icon,
  UserCheck01Icon,
  UserGroup02Icon,
  WhatsappIcon,
  WorkflowSquare01Icon,
  Wrench01Icon,
} from '@hugeicons/core-free-icons';

const icons = {
  Add01Icon,
  Add02Icon,
  AlertCircleIcon,
  Alert02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Building06Icon,
  Camera01Icon,
  Car01Icon,
  ChartHistogramIcon,
  CheckmarkCircle02Icon,
  ChefHatIcon,
  Clock01Icon,
  DropletIcon,
  ElectricPlugsIcon,
  FlashIcon,
  Globe02Icon,
  GpsSignal01Icon,
  Home01Icon,
  HouseIcon,
  Image02Icon,
  ImageDone01Icon,
  Invoice01Icon,
  Leaf01Icon,
  PaintBoardIcon,
  Shield01Icon,
  ShieldEnergyIcon,
  SprayCanIcon,
  SquareLock02Icon,
  Target01Icon,
  Tick02Icon,
  UserCheck01Icon,
  UserGroup02Icon,
  WhatsappIcon,
  WorkflowSquare01Icon,
  Wrench01Icon,
};

// SVG Fallback components for specific missing UI symbols
function CustomSearchIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function CustomLocationIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function CustomMinusIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function CustomBellIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}

function CustomCalendarIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function CustomSettingsIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function CustomTrendingUpIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function CustomScaleIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
      <path d="M7 21h10"></path>
      <path d="M12 3v18"></path>
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
    </svg>
  );
}

export function Icon({ name, size = 20, className, strokeWidth = 1.8 }) {
  if (name === 'Search01Icon') return <CustomSearchIcon size={size} className={className} />;
  if (name === 'Location01Icon') return <CustomLocationIcon size={size} className={className} />;
  if (name === 'Minus01Icon') return <CustomMinusIcon size={size} className={className} />;
  if (name === 'Notification01Icon' || name === 'Notification03Icon') return <CustomBellIcon size={size} className={className} />;
  if (name === 'Calendar03Icon' || name === 'CalendarIcon') return <CustomCalendarIcon size={size} className={className} />;
  if (name === 'Settings01Icon' || name === 'SettingsIcon') return <CustomSettingsIcon size={size} className={className} />;
  if (name === 'TrendingUp01Icon' || name === 'TrendingUpIcon') return <CustomTrendingUpIcon size={size} className={className} />;
  if (name === 'BalanceIcon' || name === 'ScaleIcon') return <CustomScaleIcon size={size} className={className} />;
  if (name === 'ChartBarLineIcon') return <HugeiconsIcon icon={ChartHistogramIcon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'Coins02Icon' || name === 'Money01Icon') return <HugeiconsIcon icon={Target01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'DocumentValidationIcon') return <HugeiconsIcon icon={Invoice01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'Grid01Icon') return <HugeiconsIcon icon={WorkflowSquare01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'ShoppingBag01Icon') return <HugeiconsIcon icon={Invoice01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'Briefcase01Icon') return <HugeiconsIcon icon={Building06Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'User01Icon') return <HugeiconsIcon icon={UserCheck01Icon} size={size} className={className} strokeWidth={strokeWidth} />;

  const iconData = icons[name];
  if (!iconData) {
    return <CustomSearchIcon size={size} className={className} />;
  }
  return (
    <HugeiconsIcon icon={iconData} size={size} className={className} strokeWidth={strokeWidth} />
  );
}
