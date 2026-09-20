import { useState } from 'react';
import { Icon } from './Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { useAppState } from '../lib/appState';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Trade service forecast data
const TRADE_SERIES = [
  {
    id: 'plumbing',
    name: 'Plumbing & Pipe Repair',
    color: '#059669', // Emerald
    icon: 'DropletIcon',
    data: [24, 35, 88, 94, 48, 38],
    change: +128,
    trend: 'up',
    reason: 'Monsoon water damage & pipe bursts',
    peakMonth: 'Jul (94 jobs)',
  },
  {
    id: 'waterproofing',
    name: 'Waterproofing & Sealing',
    color: '#4338CA', // Indigo
    icon: 'Home01Icon',
    data: [18, 32, 76, 82, 40, 28],
    change: +95,
    trend: 'up',
    reason: 'Pre-monsoon roof & wall dampness prep',
    peakMonth: 'Jul (82 jobs)',
  },
  {
    id: 'electrical',
    name: 'Electrical & Circuit Wiring',
    color: '#D97706', // Amber
    icon: 'ElectricPlugsIcon',
    data: [22, 25, 38, 42, 34, 26],
    change: +42,
    trend: 'up',
    reason: 'Post-storm circuit faults & power tripping',
    peakMonth: 'Jul (42 jobs)',
  },
  {
    id: 'painting',
    name: 'Painting & Touchup',
    color: '#E11D48', // Rose / Red
    icon: 'PaintBoardIcon',
    data: [46, 52, 22, 16, 28, 44],
    change: -15,
    trend: 'down',
    reason: 'Monsoon humidity halts exterior painting',
    peakMonth: 'May (52 jobs)',
  },
];

// Area zone forecast data per city
const AREA_ZONES = {
  bengaluru: [
    {
      id: 'z1',
      name: 'Hennur - Horamavu Hub',
      color: '#059669',
      data: [32, 44, 96, 92, 54, 42],
      change: +88,
      trend: 'up',
      reason: 'Heavy lake overflow & pipe burst hotspots',
    },
    {
      id: 'z2',
      name: 'Kalyan Nagar / HRBR Layout',
      color: '#4338CA',
      data: [26, 34, 64, 68, 42, 36],
      change: +55,
      trend: 'up',
      reason: 'Apartment sump pump & backup electrical demand',
    },
    {
      id: 'z3',
      name: 'Banaswadi & Kammanahalli',
      color: '#D97706',
      data: [22, 26, 48, 52, 36, 30],
      change: +38,
      trend: 'up',
      reason: 'Residential roof waterproofing & gutter maintenance',
    },
    {
      id: 'z4',
      name: 'Central Commercial Belt',
      color: '#E11D48',
      data: [40, 42, 28, 22, 32, 38],
      change: -18,
      trend: 'down',
      reason: 'Commercial renovation slowdown during monsoon',
    },
  ],
  davangere: [
    {
      id: 'z1',
      name: 'Vidyanagar Central Hub',
      color: '#059669',
      data: [28, 38, 86, 80, 48, 38],
      change: +76,
      trend: 'up',
      reason: 'Pre-monsoon drainage & pipe repairs',
    },
    {
      id: 'z2',
      name: "MCC 'B' Block Sector",
      color: '#4338CA',
      data: [20, 28, 56, 60, 36, 30],
      change: +48,
      trend: 'up',
      reason: 'Apartment society maintenance contracts',
    },
    {
      id: 'z3',
      name: 'DCM Industrial Township',
      color: '#E11D48',
      data: [36, 38, 25, 20, 28, 34],
      change: -16,
      trend: 'down',
      reason: 'Outdoor site work suspended during rains',
    },
  ],
  patna: [
    {
      id: 'z1',
      name: 'Green Valley & Kankarbagh',
      color: '#059669',
      data: [30, 42, 92, 88, 52, 42],
      change: +84,
      trend: 'up',
      reason: 'Waterlogging prevention & pump repairs',
    },
    {
      id: 'z2',
      name: 'Bailey Road Corridor',
      color: '#4338CA',
      data: [24, 32, 60, 64, 40, 32],
      change: +46,
      trend: 'up',
      reason: 'Commercial electrical & waterproofing surges',
    },
    {
      id: 'z3',
      name: 'Patna City Heritage Sector',
      color: '#E11D48',
      data: [36, 38, 24, 20, 28, 34],
      change: -19,
      trend: 'down',
      reason: 'Narrow lane masonry & painting delays',
    },
  ],
};

export function DemandForecastCard() {
  const { t } = useTranslation();
  const { selectedCity } = useAppState();

  const [viewMode, setViewMode] = useState('trades'); // 'trades' | 'areas'
  const [activeSeriesId, setActiveSeriesId] = useState(null); // null means all shown
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const cityName = selectedCity?.name || 'Bengaluru, Karnataka';
  const cityKey = selectedCity?.id || 'bengaluru';

  const currentSeries = viewMode === 'trades' ? TRADE_SERIES : (AREA_ZONES[cityKey] || AREA_ZONES.bengaluru);

  // SVG Dimension Constants
  const width = 620;
  const height = 230;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 25;
  const padBottom = 35;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const maxVal = 110;

  const getX = (idx) => padLeft + (idx / (MONTHS.length - 1)) * plotW;
  const getY = (val) => padTop + plotH - (Math.min(val, maxVal) / maxVal) * plotH;

  // Generate smooth cubic bezier SVG path
  const makePath = (points) => {
    if (!points || points.length === 0) return '';
    return points.reduce((acc, curr, i, arr) => {
      const x = getX(i);
      const y = getY(curr);
      if (i === 0) return `M ${x},${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }, '');
  };

  // Generate closed area under path
  const makeAreaPath = (points) => {
    const linePath = makePath(points);
    const lastX = getX(points.length - 1);
    const firstX = getX(0);
    const zeroY = padTop + plotH;
    return `${linePath} L ${lastX},${zeroY} L ${firstX},${zeroY} Z`;
  };

  const increasingItems = currentSeries.filter((s) => s.trend === 'up');
  const decreasingItems = currentSeries.filter((s) => s.trend === 'down');

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-md space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo text-white shadow-inner">
            <Icon name="ChartHistogramIcon" size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-ink text-base tracking-tight">
              {t('demandForecastTitle') || 'Predictive Demand Plot & Trends'}
            </h3>
            <p className="text-xs text-muted font-medium">
              Monthly job projection curves across {cityName}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Services vs Service Areas */}
        <div className="flex rounded-xl bg-paper p-1 border border-line">
          <button
            type="button"
            onClick={() => {
              setViewMode('trades');
              setActiveSeriesId(null);
              setHoveredPoint(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'trades' ? 'bg-indigo text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            By Trade Service
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('areas');
              setActiveSeriesId(null);
              setHoveredPoint(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'areas' ? 'bg-indigo text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Across Service Areas
          </button>
        </div>
      </div>

      {/* Interactive Legend Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-muted uppercase tracking-wider mr-1">Curves:</span>
        <button
          type="button"
          onClick={() => setActiveSeriesId(null)}
          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
            activeSeriesId === null
              ? 'bg-ink text-paper shadow-sm'
              : 'border border-line bg-paper text-muted hover:text-ink'
          }`}
        >
          All Trends
        </button>
        {currentSeries.map((s) => {
          const isSelected = activeSeriesId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSeriesId(isSelected ? null : s.id)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all border ${
                isSelected
                  ? 'border-indigo bg-indigo text-white shadow-sm'
                  : 'border-line bg-paper text-ink hover:border-muted'
              }`}
            >
              <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
              <span
                className={`text-[10px] font-extrabold ${
                  isSelected ? 'text-white' : s.trend === 'up' ? 'text-success' : 'text-danger'
                }`}
              >
                {s.trend === 'up' ? '↑' : '↓'}
                {Math.abs(s.change)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Line Graph / Plot Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-paper/70 p-2 sm:p-4">
        {/* Dynamic Hover Tooltip Banner */}
        <div className="mb-2 flex min-h-[30px] items-center justify-between px-2 text-xs">
          {hoveredPoint ? (
            <div className="flex items-center gap-2 animate-fade-in font-bold">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
              <span className="text-ink">{hoveredPoint.seriesName}:</span>
              <span className="rounded bg-indigo-light px-1.5 py-0.5 text-indigo-dark font-extrabold">
                {hoveredPoint.month} — {hoveredPoint.val} projected jobs
              </span>
              <span
                className={`text-[11px] font-extrabold ${
                  hoveredPoint.trend === 'up' ? 'text-success' : 'text-danger'
                }`}
              >
                ({hoveredPoint.trend === 'up' ? 'Surging' : 'Decreasing'} {hoveredPoint.change > 0 ? `+${hoveredPoint.change}%` : `${hoveredPoint.change}%`})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted">
              <Icon name="ActivityIcon" size={14} className="text-indigo" />
              <span className="text-[11px]">Hover or click any data point along the curves to inspect month-by-month demand</span>
            </div>
          )}
          <span className="text-[10px] font-bold text-muted uppercase">Y-Axis: Projected Job Volume</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px] select-none font-sans">
            <defs>
              {currentSeries.map((s) => (
                <linearGradient key={`grad-${s.id}`} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
                </linearGradient>
              ))}
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = getY(v);
              return (
                <g key={v}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#DBDECF"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6B7268"
                    fontWeight="600"
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* X-axis Month Labels */}
            {MONTHS.map((m, idx) => {
              const x = getX(idx);
              const isPeakMonsoon = m === 'Jun' || m === 'Jul';
              return (
                <g key={m}>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + plotH}
                    stroke={isPeakMonsoon ? '#4338CA' : '#DBDECF'}
                    strokeWidth={isPeakMonsoon ? '1.5' : '1'}
                    strokeDasharray={isPeakMonsoon ? 'none' : '3 3'}
                    opacity={isPeakMonsoon ? 0.35 : 0.6}
                  />
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isPeakMonsoon ? '800' : '600'}
                    fill={isPeakMonsoon ? '#1E293B' : '#6B7268'}
                  >
                    {m}
                  </text>
                  {isPeakMonsoon && idx === 2 && (
                    <text
                      x={x + 50}
                      y={padTop + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#4338CA"
                    >
                      ⚡ Monsoon Wave
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Series Paths & Area fills */}
            {currentSeries.map((s) => {
              const isTarget = activeSeriesId === null || activeSeriesId === s.id;
              const opacity = isTarget ? 1 : 0.15;
              const strokeW = activeSeriesId === s.id ? 3.5 : isTarget ? 2.5 : 1.5;

              return (
                <g key={s.id} opacity={opacity} className="transition-opacity duration-300">
                  {/* Area fill for selected series */}
                  {isTarget && (activeSeriesId === s.id || activeSeriesId === null) && (
                    <path d={makeAreaPath(s.data)} fill={`url(#grad-${s.id})`} />
                  )}

                  {/* Line curve */}
                  <path
                    d={makePath(s.data)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {s.data.map((val, i) => {
                    const cx = getX(i);
                    const cy = getY(val);
                    const isHovered =
                      hoveredPoint && hoveredPoint.seriesId === s.id && hoveredPoint.index === i;

                    return (
                      <g key={i}>
                        {isHovered && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="9"
                            fill={s.color}
                            opacity="0.35"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : isTarget ? 4 : 2.5}
                          fill={s.color}
                          stroke="#FFFFFF"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="cursor-pointer transition-all hover:scale-125"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              seriesId: s.id,
                              seriesName: s.name,
                              color: s.color,
                              index: i,
                              month: MONTHS[i],
                              val,
                              trend: s.trend,
                              change: s.change,
                            })
                          }
                          onClick={() =>
                            setHoveredPoint({
                              seriesId: s.id,
                              seriesName: s.name,
                              color: s.color,
                              index: i,
                              month: MONTHS[i],
                              val,
                              trend: s.trend,
                              change: s.change,
                            })
                          }
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Increase vs Decrease Categorized Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Increasing Trades / Areas */}
        <div className="rounded-2xl border border-success/30 bg-success-light/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-success font-extrabold text-xs uppercase tracking-wider">
            <span className="flex size-5 items-center justify-center rounded-full bg-success text-white text-[10px]">
              ↑
            </span>
            <span>Surging Demand (Seasonal Spike)</span>
          </div>

          <div className="space-y-2">
            {increasingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveSeriesId(activeSeriesId === item.id ? null : item.id)}
                className="cursor-pointer rounded-xl border border-line bg-surface p-3 transition-all hover:border-success hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-ink">{item.name}</span>
                  </div>
                  <span className="rounded-md bg-success-light px-2 py-0.5 text-xs font-extrabold text-success">
                    +{item.change}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted font-medium">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decreasing Trades / Areas */}
        <div className="rounded-2xl border border-danger/30 bg-danger-light/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-danger font-extrabold text-xs uppercase tracking-wider">
            <span className="flex size-5 items-center justify-center rounded-full bg-danger text-white text-[10px]">
              ↓
            </span>
            <span>Decreasing Demand (Seasonal Slowdown)</span>
          </div>

          <div className="space-y-2">
            {decreasingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveSeriesId(activeSeriesId === item.id ? null : item.id)}
                className="cursor-pointer rounded-xl border border-line bg-surface p-3 transition-all hover:border-danger hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-ink">{item.name}</span>
                  </div>
                  <span className="rounded-md bg-danger-light px-2 py-0.5 text-xs font-extrabold text-danger">
                    {item.change}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted font-medium">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Callout */}
      <div className="flex items-start gap-3 rounded-2xl bg-indigo-light/60 p-4 text-xs text-ink border border-indigo-light">
        <Icon name="AlertCircleIcon" size={18} className="mt-0.5 shrink-0 text-indigo" />
        <div className="space-y-1">
          <span className="font-extrabold block text-indigo-dark text-xs">
            Cooperative Capacity Recommendation for {cityName}
          </span>
          <p className="leading-relaxed font-medium">
            Pre-monsoon surges will require mobilizing <strong>+128% plumbing and waterproofing crews</strong> in June & July.
            Recommend re-allocating interior painting and non-critical carpentry workers to waterproofing and leakage inspection teams.
          </p>
        </div>
      </div>
    </div>
  );
}
