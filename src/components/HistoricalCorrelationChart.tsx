import React, { useState, useMemo } from 'react';
import { HISTORICAL_CLIMATE_DATA, HistoricalPoint, Language } from '../data/climateDatasets';

type ChartMetricMode = 'co2_temp' | 'methane_temp' | 'sealevel_ice';

interface Props {
  lang: Language;
}

export const HistoricalCorrelationChart: React.FC<Props> = ({ lang }) => {
  const [mode, setMode] = useState<ChartMetricMode>('co2_temp');
  const [startYear, setStartYear] = useState<number>(1880);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isEn = lang === 'en';

  const filteredData = useMemo(() => {
    return HISTORICAL_CLIMATE_DATA.filter((d) => d.year >= startYear);
  }, [startYear]);

  const activePoint: HistoricalPoint =
    hoveredIndex !== null && filteredData[hoveredIndex]
      ? filteredData[hoveredIndex]
      : filteredData[filteredData.length - 1];

  // SVG coordinate dimensions
  const width = 920;
  const height = 360;
  const padLeft = 58;
  const padRight = 64;
  const padTop = 28;
  const padBottom = 42;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const { primaryValues, secondaryValues, primaryLabel, primaryUnit, secondaryLabel, secondaryUnit, primaryColor, secondaryColor } =
    useMemo(() => {
      if (mode === 'co2_temp') {
        return {
          primaryValues: filteredData.map((d) => d.co2Ppm),
          secondaryValues: filteredData.map((d) => d.tempAnomaly),
          primaryLabel: isEn ? 'Atmospheric CO₂ Concentration' : 'Concentration Atmosphérique CO₂',
          primaryUnit: 'ppm',
          secondaryLabel: isEn ? 'Global Temperature Anomaly' : 'Anomalie Thermique Globale',
          secondaryUnit: '°C',
          primaryColor: '#D97706', // Amber 600
          secondaryColor: '#E11D48' // Rose 600
        };
      }
      if (mode === 'methane_temp') {
        return {
          primaryValues: filteredData.map((d) => d.ch4Ppb),
          secondaryValues: filteredData.map((d) => d.tempAnomaly),
          primaryLabel: isEn ? 'Atmospheric Methane (CH₄)' : 'Concentration Méthane (CH₄)',
          primaryUnit: 'ppb',
          secondaryLabel: isEn ? 'Global Temperature Anomaly' : 'Anomalie Thermique Globale',
          secondaryUnit: '°C',
          primaryColor: '#059669', // Emerald 600
          secondaryColor: '#E11D48' // Rose 600
        };
      }
      return {
        primaryValues: filteredData.map((d) => d.seaLevelMm),
        secondaryValues: filteredData.map((d) => d.arcticIceMkm2),
        primaryLabel: isEn ? 'Global Mean Sea Level (GMSL)' : 'Élévation Niveau Marin (GMSL)',
        primaryUnit: 'mm',
        secondaryLabel: isEn ? 'Arctic Sea Ice (Sept. Minimum)' : 'Banquise Arctique (Minimum Sept.)',
        secondaryUnit: 'M km²',
        primaryColor: '#0284C7', // Sky 600
        secondaryColor: '#0F172A' // Slate 900
      };
    }, [mode, filteredData, isEn]);

  const minP = Math.min(...primaryValues);
  const maxP = Math.max(...primaryValues);
  const minS = Math.min(...secondaryValues);
  const maxS = Math.max(...secondaryValues);

  const getX = (idx: number) => {
    if (filteredData.length <= 1) return padLeft;
    return padLeft + (idx / (filteredData.length - 1)) * plotW;
  };

  const getYPrimary = (val: number) => {
    const span = maxP - minP || 1;
    return padTop + plotH - ((val - minP) / span) * plotH;
  };

  const getYSecondary = (val: number) => {
    const span = maxS - minS || 1;
    return padTop + plotH - ((val - minS) / span) * plotH;
  };

  const primaryPath = filteredData
    .map((_, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getYPrimary(primaryValues[i]).toFixed(1)}`)
    .join(' ');

  const primaryAreaPath = `${primaryPath} L ${getX(filteredData.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${padLeft} ${(padTop + plotH).toFixed(1)} Z`;

  const secondaryPath = filteredData
    .map((_, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getYSecondary(secondaryValues[i]).toFixed(1)}`)
    .join(' ');

  const parisThresholdY =
    mode !== 'sealevel_ice' && maxS >= 1.4 && minS <= 1.5
      ? getYSecondary(1.5)
      : null;

  return (
    <div className="bg-white border border-slate-200 p-4 sm:p-6 lg:p-8">
      {/* Top Control & Telemetry Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500">
            <span>
              {isEn
                ? '01. Multi-Decadal Empirical Correlation'
                : '01. Corrélation Empirique Multi-Décennale'}
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>
              {isEn
                ? 'Sources: NOAA Mauna Loa / NASA GISS / IPCC AR6'
                : 'Sources : NOAA Mauna Loa / NASA GISS / GIEC AR6'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-slate-900 mt-1">
            {isEn
              ? `Radiative Forcing & Thermal Response Coupling (${startYear}–2025)`
              : `Couplage Forçage Radiatif & Réponse Thermique (${startYear}–2025)`}
          </h3>
        </div>

        {/* Interactive Filter Controls — Touch & Desktop optimized */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('co2_temp')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'co2_temp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'CO₂ vs Temperature' : 'CO₂ vs Température'}
            </button>
            <button
              type="button"
              onClick={() => setMode('methane_temp')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'methane_temp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Methane (CH₄) vs Temp' : 'Méthane (CH₄) vs Temp'}
            </button>
            <button
              type="button"
              onClick={() => setMode('sealevel_ice')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'sealevel_ice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Sea Level vs Arctic Ice' : 'Niveau Marin vs Banquise'}
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[1880, 1950, 1980].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setStartYear(yr);
                  setHoveredIndex(null);
                }}
                className={`flex-1 sm:flex-initial min-h-[38px] px-2.5 py-1.5 text-xs font-mono-tabular font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  startYear === yr
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? `Since ${yr}` : `Depuis ${yr}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Crosshair Readout Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 py-4 border-b border-slate-100 bg-slate-50/60 px-3 sm:px-4 my-4">
        <div>
          <div className="text-xs text-slate-500">
            {isEn ? 'Inspected Year' : 'Année inspectée'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-slate-900 mt-0.5">
            {activePoint.year}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">
            {isEn ? 'Atmospheric CO₂' : 'CO₂ Atmosphérique'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-amber-700 mt-0.5">
            {activePoint.co2Ppm.toFixed(1)}
            <span className="text-xs font-mono-tabular text-slate-400 ml-1">ppm</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">
            {isEn ? 'Thermal Anomaly' : 'Anomalie Thermique'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-rose-600 mt-0.5">
            {activePoint.tempAnomaly >= 0 ? `+${activePoint.tempAnomaly.toFixed(2)}` : activePoint.tempAnomaly.toFixed(2)}
            <span className="text-xs font-mono-tabular text-slate-400 ml-1">°C</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">
            {isEn ? 'Methane (CH₄)' : 'Méthane (CH₄)'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-emerald-700 mt-0.5">
            {activePoint.ch4Ppb}
            <span className="text-xs font-mono-tabular text-slate-400 ml-1">ppb</span>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500">
            {isEn ? 'Sea Level / Sea Ice' : 'Niveau Marin / Banquise'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-sky-700 mt-0.5">
            {activePoint.seaLevelMm >= 0 ? `+${activePoint.seaLevelMm}` : activePoint.seaLevelMm}
            <span className="text-xs font-mono-tabular text-slate-400 ml-1">mm</span>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-sm text-slate-700">{activePoint.arcticIceMkm2.toFixed(2)} Mkm²</span>
          </div>
        </div>
      </div>

      {/* Main SVG Dual-Axis Interactive Canvas */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none cursor-crosshair touch-pan-y"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Dual Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padTop + ratio * plotH;
            const pVal = maxP - ratio * (maxP - minP);
            const sVal = maxS - ratio * (maxS - minS);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={idx === 4 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-500 font-mono-tabular"
                >
                  {pVal.toFixed(0)}
                </text>
                <text
                  x={width - padRight + 10}
                  y={y + 4}
                  textAnchor="start"
                  className="text-[11px] fill-slate-600 font-mono-tabular"
                >
                  {sVal >= 0 && mode !== 'sealevel_ice' ? `+${sVal.toFixed(2)}` : sVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Paris Agreement +1.5°C Reference Line */}
          {parisThresholdY !== null && (
            <g>
              <line
                x1={padLeft}
                y1={parisThresholdY}
                x2={width - padRight}
                y2={parisThresholdY}
                stroke="#E11D48"
                strokeWidth="1"
                strokeDasharray="6 4"
              />
              <text
                x={padLeft + 8}
                y={parisThresholdY - 6}
                className="text-[10px] fill-rose-600 font-mono-tabular font-medium"
              >
                {isEn
                  ? 'Paris Agreement Threshold (+1.50 °C vs 1850–1900)'
                  : 'Seuil Accord de Paris (+1,50 °C vs 1850–1900)'}
              </text>
            </g>
          )}

          {/* Area under primary curve */}
          <path d={primaryAreaPath} fill="url(#primaryAreaGrad)" />

          {/* Primary Curve (Solid) */}
          <path
            d={primaryPath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Curve (Dashed) */}
          <path
            d={secondaryPath}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2.25"
            strokeDasharray="5 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-Axis Year Ticks */}
          {filteredData.map((pt, i) => {
            const showLabel =
              i === 0 ||
              i === filteredData.length - 1 ||
              pt.year % 20 === 0;
            if (!showLabel) return null;
            const x = getX(i);
            return (
              <g key={pt.year}>
                <line
                  x1={x}
                  y1={padTop + plotH}
                  x2={x}
                  y2={padTop + plotH + 6}
                  stroke="#94A3B8"
                />
                <text
                  x={x}
                  y={padTop + plotH + 22}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-500 font-mono-tabular"
                >
                  {pt.year}
                </text>
              </g>
            );
          })}

          {/* Active Crosshair Indicator */}
          {(() => {
            const activeIdx =
              hoveredIndex !== null ? hoveredIndex : filteredData.length - 1;
            const cx = getX(activeIdx);
            const cyP = getYPrimary(primaryValues[activeIdx]);
            const cyS = getYSecondary(secondaryValues[activeIdx]);

            return (
              <g>
                <line
                  x1={cx}
                  y1={padTop}
                  x2={cx}
                  y2={padTop + plotH}
                  stroke="#64748B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={cx}
                  cy={cyP}
                  r="5"
                  fill={primaryColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cyS}
                  r="5"
                  fill={secondaryColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            );
          })()}

          {/* Invisible Interactive Hover & Touch Columns */}
          {filteredData.map((pt, i) => {
            const colWidth = plotW / filteredData.length;
            const x = getX(i) - colWidth / 2;
            return (
              <rect
                key={pt.year}
                x={Math.max(padLeft, x)}
                y={padTop}
                width={colWidth}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => setHoveredIndex(i)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend & Methodological Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-0.5 inline-block shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-slate-700">
              {primaryLabel} ({primaryUnit}) — {isEn ? 'Left Axis' : 'Axe gauche'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-0.5 inline-block border-b-2 border-dashed shrink-0"
              style={{ borderColor: secondaryColor }}
            />
            <span className="font-medium text-slate-700">
              {secondaryLabel} ({secondaryUnit}) — {isEn ? 'Right Axis' : 'Axe droit'}
            </span>
          </div>
        </div>
        <div className="font-mono-tabular text-slate-400">
          {isEn
            ? 'Hover or tap chart to inspect each decade · Pre-industrial baseline: 280 ppm CO₂'
            : 'Survolez ou touchez le graphique pour inspecter chaque décennie · Pré-industriel : 280 ppm CO₂'}
        </div>
      </div>
    </div>
  );
};
