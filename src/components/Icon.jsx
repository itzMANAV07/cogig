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

export function Icon({ name, size = 20, className, strokeWidth = 1.8 }) {
  if (name === 'Search01Icon') return <CustomSearchIcon size={size} className={className} />;
  if (name === 'Location01Icon') return <CustomLocationIcon size={size} className={className} />;
  if (name === 'Minus01Icon') return <CustomMinusIcon size={size} className={className} />;
  if (name === 'Notification01Icon') return <CustomBellIcon size={size} className={className} />;
  if (name === 'Grid01Icon') return <HugeiconsIcon icon={WorkflowSquare01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'ShoppingBag01Icon') return <HugeiconsIcon icon={Invoice01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'Briefcase01Icon') return <HugeiconsIcon icon={Building06Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'Money01Icon') return <HugeiconsIcon icon={Target01Icon} size={size} className={className} strokeWidth={strokeWidth} />;
  if (name === 'User01Icon') return <HugeiconsIcon icon={UserCheck01Icon} size={size} className={className} strokeWidth={strokeWidth} />;

  const iconData = icons[name];
  if (!iconData) {
    return <CustomSearchIcon size={size} className={className} />;
  }
  return (
    <HugeiconsIcon icon={iconData} size={size} className={className} strokeWidth={strokeWidth} />
  );
}
