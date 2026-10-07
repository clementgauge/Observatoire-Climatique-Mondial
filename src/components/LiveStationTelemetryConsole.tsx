import React, { useState, useEffect, useCallback } from 'react';
import {
  OBSERVATORY_STATIONS,
  fetchStationLiveTelemetry,
  LiveStationTelemetry
} from '../services/climateApiService';
import { Language } from '../data/climateDatasets';
import { RefreshCw, Radio, Wind, Gauge, Droplets } from 'lucide-react';

interface Props {
  lang: Language;
  onStationDataChange?: (data: LiveStationTelemetry) => void;
}

export const LiveStationTelemetryConsole: React.FC<Props> = ({ lang, onStationDataChange }) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(OBSERVATORY_STATIONS[0].id);
  const [telemetry, setTelemetry] = useState<LiveStationTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredHourIndex, setHoveredHourIndex] = useState<number | null>(null);
  const isEn = lang === 'en';

  const activeStation =
    OBSERVATORY_STATIONS.find((s) => s.id === selectedStationId) || OBSERVATORY_STATIONS[0];

  const loadStationData = useCallback(async () => {
    setLoading(true);
    const data = await fetchStationLiveTelemetry(activeStation);
    setTelemetry(data);
    if (onStationDataChange) {
      onStationDataChange(data);
    }
    setLoading(false);
  }, [activeStation, onStationDataChange]);

  useEffect(() => {
    loadStationData();
  }, [loadStationData]);

  const hourlyData = telemetry?.hourlyTemps || [];
  const activeHour =
    hoveredHourIndex !== null && hourlyData[hoveredHourIndex]
      ? hourlyData[hoveredHourIndex]
      : hourlyData[hourlyData.length - 1];

  return (
    <section id="stations-temps-reel" className="py-12 sm:py-16 lg:py-24 border-t border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>
                {isEn
                  ? '04. Global Live Atmospheric Telemetry Network'
                  : '04. Réseau Mondial de Télémesure Atmosphérique en Direct'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn
                  ? 'Open-Meteo Public API (Meteorology & Aerosols)'
                  : 'API Publique Open-Meteo (Météorologie & Aérosols)'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Real-time reference sensors: from the polar ice caps to the Amazonian canopy'
                : 'Capteurs de référence en temps réel : des pôles à la canopée amazonienne'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Query live thermal conditions, barometric pressure, and fine particulate matter (PM2.5, carbon monoxide, tropospheric ozone) across six sentinel climate observatories.'
                : 'Interrogez en direct les conditions thermiques, la pression barométrique et la concentration en particules fines (PM2.5, monoxyde de carbone, ozone troposphérique) sur six observatoires climatiques sentinelles.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={loadStationData}
              disabled={loading}
              className="min-h-[40px] px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {isEn ? 'Refresh API Sensors' : 'Actualiser les Capteurs API'}
              </span>
            </button>
          </div>
        </div>

        {/* Station Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 mt-8">
          {OBSERVATORY_STATIONS.map((station) => {
            const isSelected = station.id === selectedStationId;
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => {
                  setSelectedStationId(station.id);
                  setHoveredHourIndex(null);
                }}
                className={`p-4 text-left border transition-colors flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div
                    className={`text-[11px] font-mono-tabular ${
                      isSelected ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {station.lat >= 0 ? `${station.lat.toFixed(1)}°N` : `${Math.abs(station.lat).toFixed(1)}°S`},{' '}
                    {station.lon >= 0 ? `${station.lon.toFixed(1)}°E` : `${Math.abs(station.lon).toFixed(1)}°W`}
                  </div>
                  <div className="text-sm font-semibold mt-1 leading-snug">
                    {isEn ? station.nameEn : station.name}
                  </div>
                </div>
                <div
                  className={`text-xs mt-3 pt-2 border-t ${
                    isSelected
                      ? 'border-slate-800 text-slate-300'
                      : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {isEn ? station.countryEn : station.country}
                </div>
              </button>
            );
          })}
        </div>

        {/* Telemetry Readout Console */}
        {telemetry && (
          <div className="mt-6 bg-white border border-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular text-emerald-700 font-medium">
                    <Radio className="w-3.5 h-3.5" />
                    <span>
                      {telemetry.isLive
                        ? isEn
                          ? '● LIVE API STREAM ACTIVE (OPEN-METEO)'
                          : '● FLUX API DIRECT ACTIF (OPEN-METEO)'
                        : isEn
                        ? '● CALIBRATED FALLBACK ACTIVE'
                        : '● ÉTALONNAGE DE SECOURS ACTIF'}
                    </span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">
                    {isEn ? 'Elevation:' : 'Altitude :'} {telemetry.station.elevationM} m
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">
                    {isEn ? 'Timestamp:' : 'Horodatage :'} {telemetry.fetchedAt}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display text-slate-900 mt-1">
                  {isEn ? telemetry.station.nameEn : telemetry.station.name} —{' '}
                  {isEn ? telemetry.station.countryEn : telemetry.station.country}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {isEn ? 'Scientific role:' : 'Rôle scientifique :'}{' '}
                  {isEn ? telemetry.station.biomeEn : telemetry.station.biome}
                </p>
              </div>

              {/* Delta vs Baseline */}
              <div className="bg-slate-50 border border-slate-200 px-4 py-3 text-left sm:text-right self-stretch sm:self-start lg:self-auto">
                <div className="text-xs text-slate-500">
                  {isEn
                    ? `Delta vs Climatological Baseline (1961–1990: ${telemetry.station.baselineTempC}°C)`
                    : `Écart vs Normale Climatologique (1961–1990 : ${telemetry.station.baselineTempC}°C)`}
                </div>
                <div
                  className={`text-2xl font-mono-tabular font-bold mt-0.5 ${
                    telemetry.decadeDeltaC >= 0 ? 'text-rose-600' : 'text-sky-700'
                  }`}
                >
                  {telemetry.decadeDeltaC >= 0
                    ? `+${telemetry.decadeDeltaC.toFixed(1)} °C`
                    : `${telemetry.decadeDeltaC.toFixed(1)} °C`}
                </div>
              </div>
            </div>

            {/* 6-Metric Sensor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 py-6 border-b border-slate-200">
              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500">
                  {isEn ? '2m Temperature' : 'Température 2m'}
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                  {telemetry.currentTempC.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">°C</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                  {isEn ? 'Feels like:' : 'Ressenti :'} {telemetry.apparentTempC.toFixed(1)} °C
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500">
                  {isEn ? 'Fine Particulates PM2.5' : 'Particules Fines PM2.5'}
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-amber-700 mt-1">
                  {telemetry.pm25UgM3.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">µg/m³</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                  PM10 : {telemetry.pm10UgM3.toFixed(1)} µg/m³
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500">
                  {isEn ? 'Carbon Monoxide (CO)' : 'Monoxyde de Carbone (CO)'}
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                  {telemetry.carbonMonoxideUgM3.toFixed(0)}
                  <span className="text-xs font-normal text-slate-500 ml-1">µg/m³</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                  {isEn ? 'Combustion tracer' : 'Traceur de combustion'}
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500">
                  {isEn ? 'Tropospheric Ozone (O₃)' : 'Ozone Troposphérique (O₃)'}
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                  {telemetry.ozoneUgM3.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">µg/m³</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                  NO₂ : {telemetry.nitrogenDioxideUgM3.toFixed(1)} µg/m³
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-400" />
                  <span>{isEn ? 'Wind & Humidity' : 'Vent & Humidité'}</span>
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                  {telemetry.windSpeedKmh.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">km/h</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-600" />
                  <span>
                    {isEn ? 'Humidity:' : 'Humidité :'} {telemetry.humidityPercent}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-slate-400" />
                  <span>{isEn ? 'Surface Pressure' : 'Pression Surface'}</span>
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                  {telemetry.surfacePressureHpa.toFixed(0)}
                  <span className="text-xs font-normal text-slate-500 ml-1">hPa</span>
                </div>
                <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                  {isEn ? 'Barometric sensor' : 'Capteur barométrique'}
                </div>
              </div>
            </div>

            {/* 24-Hour Temperature Wave Graph */}
            {hourlyData.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-xs font-semibold text-slate-800">
                    {isEn
                      ? `24-Hour Diurnal Thermal Profile (${telemetry.station.nameEn})`
                      : `Profil Thermique Horaire sur 24 Heures (${telemetry.station.name})`}
                  </div>
                  {activeHour && (
                    <div className="text-xs font-mono-tabular text-slate-600">
                      {isEn ? 'Inspected hour:' : 'Heure inspectée :'}{' '}
                      <strong className="text-slate-900">{activeHour.time}</strong> ·{' '}
                      {isEn ? 'Temperature:' : 'Température :'}{' '}
                      <strong className="text-amber-700">{activeHour.temp.toFixed(1)} °C</strong>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <svg
                    viewBox="0 0 860 150"
                    className="w-full h-auto cursor-crosshair select-none touch-pan-y"
                    onMouseLeave={() => setHoveredHourIndex(null)}
                  >
                    {(() => {
                      const temps = hourlyData.map((h) => h.temp);
                      const minT = Math.min(...temps) - 1;
                      const maxT = Math.max(...temps) + 1;
                      const span = maxT - minT || 1;
                      const padL = 44;
                      const padR = 24;
                      const padT = 16;
                      const padB = 28;
                      const w = 860 - padL - padR;
                      const h = 150 - padT - padB;

                      const getX = (i: number) =>
                        padL + (i / Math.max(1, hourlyData.length - 1)) * w;
                      const getY = (val: number) =>
                        padT + h - ((val - minT) / span) * h;

                      const linePath = hourlyData
                        .map(
                          (pt, idx) =>
                            `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(pt.temp).toFixed(1)}`
                        )
                        .join(' ');

                      return (
                        <g>
                          <line
                            x1={padL}
                            y1={padT + h}
                            x2={padL + w}
                            y2={padT + h}
                            stroke="#E2E8F0"
                          />
                          <line
                            x1={padL}
                            y1={padT}
                            x2={padL + w}
                            y2={padT}
                            stroke="#F1F5F9"
                          />
                          <text
                            x={padL - 8}
                            y={padT + 8}
                            textAnchor="end"
                            className="text-[10px] fill-slate-500 font-mono-tabular"
                          >
                            {maxT.toFixed(1)}°
                          </text>
                          <text
                            x={padL - 8}
                            y={padT + h}
                            textAnchor="end"
                            className="text-[10px] fill-slate-500 font-mono-tabular"
                          >
                            {minT.toFixed(1)}°
                          </text>

                          <path
                            d={linePath}
                            fill="none"
                            stroke="#D97706"
                            strokeWidth="2.2"
                          />

                          {hourlyData.map((pt, idx) => {
                            const x = getX(idx);
                            const y = getY(pt.temp);
                            const isActive =
                              (hoveredHourIndex !== null
                                ? hoveredHourIndex
                                : hourlyData.length - 1) === idx;
                            return (
                              <g key={idx}>
                                {idx % 4 === 0 && (
                                  <text
                                    x={x}
                                    y={padT + h + 18}
                                    textAnchor="middle"
                                    className="text-[10px] fill-slate-500 font-mono-tabular"
                                  >
                                    {pt.time}
                                  </text>
                                )}
                                {isActive && (
                                  <>
                                    <line
                                      x1={x}
                                      y1={padT}
                                      x2={x}
                                      y2={padT + h}
                                      stroke="#94A3B8"
                                      strokeDasharray="2 2"
                                    />
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="4.5"
                                      fill="#D97706"
                                      stroke="#FFFFFF"
                                      strokeWidth="1.5"
                                    />
                                  </>
                                )}
                                <rect
                                  x={x - w / hourlyData.length / 2}
                                  y={padT}
                                  width={w / hourlyData.length}
                                  height={h}
                                  fill="transparent"
                                  onMouseEnter={() => setHoveredHourIndex(idx)}
                                  onClick={() => setHoveredHourIndex(idx)}
                                />
                              </g>
                            );
                          })}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
