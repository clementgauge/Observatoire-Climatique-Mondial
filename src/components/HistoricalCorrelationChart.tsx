import React, { useState, useMemo } from 'react';
import {
  HISTORICAL_CLIMATE_DATA,
  HISTORICAL_CLIMATE_ANNOTATIONS,
  HistoricalPoint,
  HistoricalAnnotation,
  AnnotationCategory,
  Language
} from '../data/climateDatasets';

type ChartMetricMode = 'co2_temp' | 'methane_temp' | 'sealevel_ice';
type AnnotationFilter = 'all' | AnnotationCategory | 'none';

interface Props {
  lang: Language;
}

export const HistoricalCorrelationChart: React.FC<Props> = ({ lang }) => {
  const [mode, setMode] = useState<ChartMetricMode>('co2_temp');
  const [startYear, setStartYear] = useState<number>(1880);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [annotationFilter, setAnnotationFilter] = useState<AnnotationFilter>('all');
  const [showTrendLine, setShowTrendLine] = useState<boolean>(true);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string>('paris-2015');
  const isEn = lang === 'en';

  const filteredData = useMemo(() => {
    return HISTORICAL_CLIMATE_DATA.filter((d) => d.year >= startYear);
  }, [startYear]);

  const activePoint: HistoricalPoint =
    hoveredIndex !== null && filteredData[hoveredIndex]
      ? filteredData[hoveredIndex]
      : filteredData[filteredData.length - 1];

  // SVG coordinate dimensions — slightly taller to accommodate callout annotations cleanly
  const width = 920;
  const height = 400;
  const padLeft = 58;
  const padRight = 64;
  const padTop = 44;
  const padBottom = 44;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const { primaryValues, secondaryValues, primaryLabel, primaryUnit, secondaryLabel, secondaryUnit, primaryColor, secondaryColor } =
    useMemo(() => {
      if (mode === 'co2_temp') {
        return {
          // 1 ppm atmospheric CO2 = 7.82 billion tonnes of CO2 (Mrd tCO2)
          primaryValues: filteredData.map((d) => Number((d.co2Ppm * 7.82).toFixed(0))),
          secondaryValues: filteredData.map((d) => d.tempAnomaly),
          primaryLabel: isEn ? 'Atmospheric CO₂ Mass (Billion tonnes CO₂)' : 'Masse CO₂ Atmosphérique (Mrd tonnes de CO₂)',
          primaryUnit: isEn ? 'B tCO₂' : 'Mrd tCO₂',
          secondaryLabel: isEn ? 'Global Temperature Anomaly' : 'Anomalie Thermique Globale',
          secondaryUnit: '°C',
          primaryColor: '#D97706', // Amber 600
          secondaryColor: '#E11D48' // Rose 600
        };
      }
      if (mode === 'methane_temp') {
        return {
          // 1 ppb CH4 in atmosphere = 2.78 Mt CH4 * 84 (GWP-20) = 0.2335 billion tonnes of CO2 equivalent
          primaryValues: filteredData.map((d) => Number((d.ch4Ppb * 0.2335).toFixed(0))),
          secondaryValues: filteredData.map((d) => d.tempAnomaly),
          primaryLabel: isEn ? 'Atmospheric Methane (Billion tonnes CO₂ eq)' : 'Méthane Atmosphérique (Mrd tonnes de CO₂ éq.)',
          primaryUnit: isEn ? 'B tCO₂' : 'Mrd tCO₂',
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

  const minYear = filteredData[0]?.year ?? 1880;
  const maxYear = filteredData[filteredData.length - 1]?.year ?? 2025;

  // True linear time scale so volcanic dips, treaties, and regression trend slopes are temporally accurate
  const getXByYear = (year: number) => {
    const span = maxYear - minYear || 1;
    return padLeft + ((year - minYear) / span) * plotW;
  };

  const getX = (idx: number) => {
    if (!filteredData[idx]) return padLeft;
    return getXByYear(filteredData[idx].year);
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

  // Compute Ordinary Least Squares (OLS) linear trend line for the post-1970 modern acceleration era
  const trendLineData = useMemo(() => {
    const trendStartYear = Math.max(startYear, 1970);
    const indices = filteredData
      .map((d, i) => ({ year: d.year, i }))
      .filter((item) => item.year >= trendStartYear);

    if (indices.length < 2) return null;

    const n = indices.length;
    const xs = indices.map((item) => item.year);
    const ysS = indices.map((item) => secondaryValues[item.i]);
    const ysP = indices.map((item) => primaryValues[item.i]);

    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanYS = ysS.reduce((a, b) => a + b, 0) / n;
    const meanYP = ysP.reduce((a, b) => a + b, 0) / n;

    let numS = 0;
    let numP = 0;
    let den = 0;
    for (let k = 0; k < n; k++) {
      const dx = xs[k] - meanX;
      numS += dx * (ysS[k] - meanYS);
      numP += dx * (ysP[k] - meanYP);
      den += dx * dx;
    }

    const slopeS = den !== 0 ? numS / den : 0;
    const interceptS = meanYS - slopeS * meanX;
    const slopeP = den !== 0 ? numP / den : 0;

    const yStartS = slopeS * trendStartYear + interceptS;
    const yEndS = slopeS * maxYear + interceptS;

    const decadalSlopeS = slopeS * 10;
    const decadalSlopeP = slopeP * 10;

    return {
      startYear: trendStartYear,
      endYear: maxYear,
      x1: getXByYear(trendStartYear),
      y1: getYSecondary(yStartS),
      x2: getXByYear(maxYear),
      y2: getYSecondary(yEndS),
      decadalSlopeS,
      decadalSlopeP
    };
  }, [filteredData, primaryValues, secondaryValues, startYear, maxYear, minP, maxP, minS, maxS]);

  // Visible annotations within the active time window and category filter
  const visibleAnnotations = useMemo(() => {
    if (annotationFilter === 'none') return [];
    return HISTORICAL_CLIMATE_ANNOTATIONS.filter((ann) => {
      if (ann.year < startYear) return false;
      if (annotationFilter !== 'all' && ann.category !== annotationFilter) return false;
      return filteredData.some((d) => d.year === ann.year);
    });
  }, [startYear, annotationFilter, filteredData]);

  // Active narrative annotation: either the hovered year's annotation, or the user-selected annotation
  const activeAnnotation: HistoricalAnnotation = useMemo(() => {
    const hoveredAnn = HISTORICAL_CLIMATE_ANNOTATIONS.find((a) => a.year === activePoint.year);
    if (hoveredIndex !== null && hoveredAnn) {
      return hoveredAnn;
    }
    return (
      HISTORICAL_CLIMATE_ANNOTATIONS.find((a) => a.id === selectedAnnotationId) ||
      HISTORICAL_CLIMATE_ANNOTATIONS.find((a) => a.id === 'paris-2015') ||
      HISTORICAL_CLIMATE_ANNOTATIONS[0]
    );
  }, [activePoint.year, hoveredIndex, selectedAnnotationId]);

  const handleSelectAnnotation = (ann: HistoricalAnnotation) => {
    setSelectedAnnotationId(ann.id);
    if (ann.year < startYear) {
      setStartYear(1880);
    }
    const idx = HISTORICAL_CLIMATE_DATA.filter((d) => d.year >= (ann.year < startYear ? 1880 : startYear)).findIndex(
      (d) => d.year === ann.year
    );
    if (idx !== -1) {
      setHoveredIndex(idx);
    }
  };

  const getCategoryColor = (cat: AnnotationCategory) => {
    if (cat === 'volcanic') return '#4F46E5'; // Indigo 600 for stratospheric cooling aerosols
    if (cat === 'treaty') return '#0284C7'; // Sky 600 for global climate treaties
    return '#B45309'; // Amber 700 for physical thresholds
  };

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
                ? '01. Multi-Decadal Empirical Correlation & Historical Annotations'
                : '01. Corrélation Empirique Multi-Décennale & Repères Historiques'}
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
              ? `Radiative Forcing, Volcanic Perturbations & Treaties (${startYear}–2025)`
              : `Couplage Forçage Radiatif, Éruptions Volcaniques & Accords (${startYear}–2025)`}
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

      {/* Annotation Layer & Trend Line Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1">
            {isEn ? 'Chart Annotations:' : 'Annotations sur courbe :'}
          </span>
          {(
            [
              { id: 'all', labelFr: 'Tous les événements (10)', labelEn: 'All Key Events (10)' },
              { id: 'volcanic', labelFr: 'Éruptions Volcaniques', labelEn: 'Volcanic Eruptions' },
              { id: 'treaty', labelFr: 'Accords (Paris 2015 / Kyoto)', labelEn: 'Treaties (Paris 2015 / Kyoto)' },
              { id: 'threshold', labelFr: 'Seuils Physiques & Cryosphère', labelEn: 'Physical Thresholds' },
              { id: 'none', labelFr: 'Masquer', labelEn: 'Hide' }
            ] as { id: AnnotationFilter; labelFr: string; labelEn: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAnnotationFilter(tab.id)}
              className={`min-h-[32px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                annotationFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {isEn ? tab.labelEn : tab.labelFr}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowTrendLine((prev) => !prev)}
          className={`min-h-[32px] px-3 py-1 text-xs font-mono-tabular font-medium rounded-md border transition-colors cursor-pointer self-start sm:self-auto ${
            showTrendLine
              ? 'border-rose-300 bg-rose-50/70 text-rose-800'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          {showTrendLine
            ? isEn
              ? '✓ Linear Trend Line (1970–2025)'
              : '✓ Droite de Tendance (1970–2025)'
            : isEn
            ? '+ Show Trend Line (1970–2025)'
            : '+ Afficher Droite de Tendance (1970–2025)'}
        </button>
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
          {HISTORICAL_CLIMATE_ANNOTATIONS.some((a) => a.year === activePoint.year) && (
            <div className="text-[10px] font-medium text-indigo-700 truncate">
              {isEn
                ? HISTORICAL_CLIMATE_ANNOTATIONS.find((a) => a.year === activePoint.year)?.shortLabelEn
                : HISTORICAL_CLIMATE_ANNOTATIONS.find((a) => a.year === activePoint.year)?.shortLabelFr}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs text-slate-500">
            {isEn ? 'Atmospheric CO₂ (tCO₂)' : 'CO₂ Atmosphérique (tCO₂)'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-amber-700 mt-0.5">
            {Math.round(activePoint.co2Ppm * 7.82).toLocaleString(isEn ? 'en-US' : 'fr-FR')}
            <span className="text-xs font-mono-tabular text-slate-500 ml-1">
              {isEn ? 'B tCO₂' : 'Mrd tCO₂'}
            </span>
          </div>
          <div className="text-[10px] font-mono-tabular text-slate-400">
            ({activePoint.co2Ppm.toFixed(1)} ppm)
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
            {isEn ? 'Methane (in tCO₂)' : 'Méthane (en tCO₂)'}
          </div>
          <div className="text-lg sm:text-xl font-mono-tabular font-semibold text-emerald-700 mt-0.5">
            {Math.round(activePoint.ch4Ppb * 0.2335).toLocaleString(isEn ? 'en-US' : 'fr-FR')}
            <span className="text-xs font-mono-tabular text-slate-500 ml-1">
              {isEn ? 'B tCO₂' : 'Mrd tCO₂'}
            </span>
          </div>
          <div className="text-[10px] font-mono-tabular text-slate-400">
            ({activePoint.ch4Ppb} ppb CH₄)
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

          {/* Multi-Decadal Linear Regression Trend Line Overlay (1970–2025) */}
          {showTrendLine && trendLineData && (
            <g>
              <line
                x1={trendLineData.x1}
                y1={trendLineData.y1}
                x2={trendLineData.x2}
                y2={trendLineData.y2}
                stroke={mode === 'sealevel_ice' ? '#0F172A' : '#BE123C'}
                strokeWidth="1.75"
                strokeDasharray="8 4"
                strokeOpacity="0.65"
              />
              <text
                x={(trendLineData.x1 + trendLineData.x2) / 2 - 20}
                y={(trendLineData.y1 + trendLineData.y2) / 2 - 10}
                textAnchor="middle"
                className="text-[10px] fill-rose-800 font-mono-tabular font-semibold"
              >
                {mode === 'sealevel_ice'
                  ? isEn
                    ? `Trend (${trendLineData.startYear}–2025): ${trendLineData.decadalSlopeS.toFixed(2)} Mkm²/decade`
                    : `Tendance (${trendLineData.startYear}–2025) : ${trendLineData.decadalSlopeS.toFixed(2)} Mkm²/décennie`
                  : isEn
                  ? `Warming Trend (${trendLineData.startYear}–2025): +${trendLineData.decadalSlopeS.toFixed(2)} °C/decade (+${Math.round(trendLineData.decadalSlopeP)}B tCO₂/dec)`
                  : `Tendance (${trendLineData.startYear}–2025) : +${trendLineData.decadalSlopeS.toFixed(2)} °C/décennie (+${Math.round(trendLineData.decadalSlopeP)} Mrd tCO₂/déc)`}
              </text>
            </g>
          )}

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

          {/* Historical Event Annotations & Trend Callouts */}
          {visibleAnnotations.map((ann) => {
            const dataIdx = filteredData.findIndex((d) => d.year === ann.year);
            if (dataIdx === -1) return null;

            const cx = getX(dataIdx);
            const usePrimaryAnchor =
              mode === 'sealevel_ice'
                ? ann.id !== 'arctic-2012'
                : ann.anchorSeries === 'primary';

            const anchorY = usePrimaryAnchor
              ? getYPrimary(primaryValues[dataIdx])
              : getYSecondary(secondaryValues[dataIdx]);

            const rawLabelY = anchorY + ann.labelOffsetY;
            const labelY = Math.max(padTop - 16, Math.min(padTop + plotH - 8, rawLabelY));
            const color = getCategoryColor(ann.category);
            const isSelected = activeAnnotation.id === ann.id;
            const anchorAlign =
              ann.textAnchor ||
              (cx < padLeft + 130 ? 'start' : cx > width - padRight - 150 ? 'end' : 'middle');

            return (
              <g
                key={ann.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAnnotation(ann);
                }}
              >
                {/* Subtle full-height vertical marker for Paris 2015 and Kyoto 1997 treaties */}
                {ann.category === 'treaty' && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    stroke={color}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    strokeDasharray="2 3"
                    strokeOpacity="0.45"
                  />
                )}

                {/* Connector stem from exact curve point to annotation callout */}
                <line
                  x1={cx}
                  y1={anchorY}
                  x2={cx}
                  y2={labelY + (ann.labelOffsetY < 0 ? 4 : -10)}
                  stroke={color}
                  strokeWidth={isSelected ? '1.75' : '1.25'}
                  strokeDasharray={ann.category === 'volcanic' ? '2 2' : undefined}
                />

                {/* Highlighted ring on the curve point */}
                <circle
                  cx={cx}
                  cy={anchorY}
                  r={isSelected ? '6.5' : '4.5'}
                  fill="#FFFFFF"
                  stroke={color}
                  strokeWidth={isSelected ? '2.5' : '2'}
                />

                {/* Crisp readable callout label with subtle white halo */}
                <text
                  x={cx}
                  y={labelY}
                  textAnchor={anchorAlign}
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  style={{ fill: color }}
                  className={`text-[10px] font-mono-tabular ${
                    isSelected ? 'font-bold' : 'font-semibold'
                  }`}
                >
                  {isEn ? ann.shortLabelEn : ann.shortLabelFr}
                </text>
              </g>
            );
          })}

          {/* X-Axis Year Ticks */}
          {filteredData.map((pt, i) => {
            const showLabel =
              pt.year === minYear ||
              pt.year === maxYear ||
              (pt.year % 20 === 0 && pt.year - minYear >= 8 && maxYear - pt.year >= 8);
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

          {/* Contiguous Interactive Hover & Touch Columns covering 100% of plot width */}
          {filteredData.map((pt, i) => {
            const currX = getX(i);
            const prevX = i === 0 ? padLeft : getX(i - 1);
            const nextX = i === filteredData.length - 1 ? padLeft + plotW : getX(i + 1);
            const xStart = i === 0 ? padLeft : (prevX + currX) / 2;
            const xEnd = i === filteredData.length - 1 ? padLeft + plotW : (currX + nextX) / 2;
            return (
              <rect
                key={pt.year}
                x={xStart}
                y={padTop}
                width={Math.max(2, xEnd - xStart)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => {
                  setHoveredIndex(i);
                  const matchingAnn = HISTORICAL_CLIMATE_ANNOTATIONS.find(
                    (a) => a.year === pt.year
                  );
                  if (matchingAnn) {
                    setSelectedAnnotationId(matchingAnn.id);
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Interactive Narrative Event Inspector & Milestone Selector */}
      <div className="mt-4 border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono-tabular font-semibold text-slate-900">
              {isEn ? `EVENT YEAR: ${activeAnnotation.year}` : `REPÈRE HISTORIQUE : ${activeAnnotation.year}`}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className="font-medium"
              style={{ color: getCategoryColor(activeAnnotation.category) }}
            >
              {activeAnnotation.category === 'volcanic'
                ? isEn
                  ? 'Stratospheric Volcanic Cooling Perturbation'
                  : 'Perturbation Volcanique Stratosphérique (Aérosols)'
                : activeAnnotation.category === 'treaty'
                ? isEn
                  ? 'Global Diplomatic Climate Accord'
                  : 'Accord Climatique International'
                : isEn
                ? 'Observational & Physical Milestone'
                : 'Seuil Physique & Observationnel'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular text-slate-700">
              {isEn ? activeAnnotation.impactBadgeEn : activeAnnotation.impactBadgeFr}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isEn
              ? 'Click any milestone below to inspect its impact on the curve'
              : 'Cliquez sur un événement ci-dessous pour l’inspecter sur la courbe'}
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-base sm:text-lg font-display text-slate-900">
            {isEn ? activeAnnotation.titleEn : activeAnnotation.titleFr}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
            {isEn ? activeAnnotation.narrativeEn : activeAnnotation.narrativeFr}
          </p>
        </div>

        {/* Chronological Quick-Jump Event Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-200/70">
          {HISTORICAL_CLIMATE_ANNOTATIONS.map((ann) => {
            const isSelected = activeAnnotation.id === ann.id;
            const dotColor = getCategoryColor(ann.category);
            return (
              <button
                key={ann.id}
                type="button"
                onClick={() => handleSelectAnnotation(ann)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-mono-tabular rounded-md border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : dotColor }}
                />
                <span>{isEn ? ann.shortLabelEn : ann.shortLabelFr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Methodological Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
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
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 inline-block shrink-0" />
            <span>{isEn ? 'Volcanic Cooling' : 'Éruption Volcanique'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-sky-600 inline-block shrink-0" />
            <span>{isEn ? 'Climate Treaty' : 'Accord Climatique'}</span>
          </div>
        </div>
        <div className="font-mono-tabular text-slate-400">
          {isEn
            ? 'Hover or tap chart · Pre-industrial: 2,190B tonnes CO₂ (280 ppm)'
            : 'Survolez ou touchez le graphique · Pré-industriel : 2 190 Mrd tonnes de CO₂ (280 ppm)'}
        </div>
      </div>
    </div>
  );
};
