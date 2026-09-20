import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Default Leaflet marker icons reference image files that don't resolve under
// Vite's bundler by default — rebuild the icon URLs from the installed package.
// This is a one-time side-effect import; every map component imports this file.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const coopIcon = new L.DivIcon({
  html: '<div style="background:#33456B;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 2px #33456B33"></div>',
  className: '',
  iconSize: [14, 14],
});

export const jobIcon = new L.DivIcon({
  html: '<div style="background:#E4A63B;width:14px;height:14px;border-radius:3px;border:2px solid white;box-shadow:0 0 0 2px #E4A63B33"></div>',
  className: '',
  iconSize: [14, 14],
});

export const addressIcon = new L.DivIcon({
  html: '<div style="background:#17231E;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white"></div>',
  className: '',
  iconSize: [16, 16],
});

export const workerLiveIcon = new L.DivIcon({
  html: `<div style="position:relative;width:16px;height:16px">
    <div style="position:absolute;inset:0;background:#3C8A5B;border-radius:50%;border:2px solid white"></div>
    <div style="position:absolute;inset:-6px;background:#3C8A5B33;border-radius:50%;animation:pulse-ring 1.6s ease-out infinite"></div>
  </div>
  <style>@keyframes pulse-ring{0%{transform:scale(0.6);opacity:1}100%{transform:scale(1.8);opacity:0}}</style>`,
  className: '',
  iconSize: [16, 16],
});

export { L };
