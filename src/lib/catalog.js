// Service catalog — mirrors the PS26089 title: Household & Community Services.
// Icon names reference verified @hugeicons/core-free-icons exports.
// titleKey/descKey reference entries in lib/i18n/translations.js.

export const CATEGORIES = [
  {
    id: 'household',
    titleKey: 'householdServices',
    descKey: 'householdServicesDesc',
    icon: 'Home01Icon',
    accent: 'marigold',
  },
  {
    id: 'community',
    titleKey: 'communityServices',
    descKey: 'communityServicesDesc',
    icon: 'Building06Icon',
    accent: 'indigo',
  },
];

export const SERVICES = {
  household: [
    { id: 'domestic-helper', titleKey: 'svc_domestic_helper', icon: 'HouseIcon', rate: 450 },
    { id: 'caregiver', titleKey: 'svc_caregiver', icon: 'UserGroup02Icon', rate: 700 },
    { id: 'cook', titleKey: 'svc_cook', icon: 'ChefHatIcon', rate: 500 },
    { id: 'gardener', titleKey: 'svc_gardener', icon: 'Leaf01Icon', rate: 400 },
    { id: 'cleaner', titleKey: 'svc_cleaner', icon: 'SprayCanIcon', rate: 400 },
    { id: 'driver', titleKey: 'svc_driver', icon: 'Car01Icon', rate: 600 },
  ],
  community: [
    { id: 'painter', titleKey: 'svc_painter', icon: 'PaintBoardIcon', rate: 500 },
    { id: 'plumber', titleKey: 'svc_plumber', icon: 'DropletIcon', rate: 550 },
    { id: 'electrician', titleKey: 'svc_electrician', icon: 'ElectricPlugsIcon', rate: 600 },
    { id: 'carpenter', titleKey: 'svc_carpenter', icon: 'Wrench01Icon', rate: 550 },
    { id: 'technician', titleKey: 'svc_technician', icon: 'WorkflowSquare01Icon', rate: 600 },
    { id: 'supervisor', titleKey: 'svc_supervisor', icon: 'Shield01Icon', rate: 700 },
  ],
};
