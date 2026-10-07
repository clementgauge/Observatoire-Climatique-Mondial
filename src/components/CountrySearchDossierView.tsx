import React, { useState, useEffect } from 'react';
import { CountryFullDossier } from '../data/countryFullDossiers';
import { Language } from '../data/climateDatasets';
import {
  fetchCountryLiveBundle,
  CountryLiveWeatherAndAir
} from '../services/climateApiService';
import {
  ArrowLeft,
  Radio,
  RefreshCw,
  Trees,
  ShieldCheck,
  Landmark,
  AlertTriangle,
  ExternalLink,
  FileText,
  Wind,
  Droplets,
  Gauge,
  CheckCircle2
} from 'lucide-react';

interface Props {
  country: CountryFullDossier;
  matchingCountries: CountryFullDossier[];
  onSelectCountry: (c: CountryFullDossier) => void;
  onClearSearch: () => void;
  onExportCountryPdf: () => void;
  lang: Language;
}

export const CountrySearchDossierView: React.FC<Props> = ({
  country,
  matchingCountries,
  onSelectCountry,
  onClearSearch,
  onExportCountryPdf,
  lang
}) => {
  const [liveData, setLiveData] = useState<CountryLiveWeatherAndAir | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(true);
  const [chartTab, setChartTab] = useState<'renewables' | 'forest' | 'hourlyTemp'>('renewables');

  const isEn = lang === 'en';

  const loadCountryLive = async (silent = false) => {
    if (!silent) setLoadingLive(true);
    const bundle = await fetchCountryLiveBundle(country.iso3, country.lat, country.lon);
    setLiveData(bundle);
    if (!silent) setLoadingLive(false);
  };

  useEffect(() => {
    loadCountryLive(false);
    const interval = setInterval(() => {
      loadCountryLive(true);
    }, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadCountryLive(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [country.iso3, country.lat, country.lon]);

  const evolPositive = country.evolutionSince1990Percent > 0;
  const worldAvgPerCapita = 4.7;
  const perCapitaRatio = (country.perCapitaTonnes / worldAvgPerCapita).toFixed(1);

  return (
    <section
      aria-label={
        isEn
          ? `Complete Climate Dossier for ${country.nameEn}`
          : `Dossier Climatique Complet : ${country.nameFr}`
      }
      className="py-8 sm:py-12 lg:py-14 bg-[#F8FAFC] min-h-[80vh]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Action & Breadcrumb Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? 'Back to Global World View (Clear Search)'
                  : 'Revenir à la Vue Mondiale Générale (Effacer la recherche)'}
              </span>
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <Radio className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? `COUNTRY DOSSIER ACTIVE · ISO ${country.iso3}`
                  : `DOSSIER PAYS ACTIF · ISO ${country.iso3}`}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadCountryLive(false)}
              disabled={loadingLive}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-mono-tabular rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
              <span>{isEn ? 'Update Data' : 'Actualiser les données'}</span>
            </button>

            <button
              type="button"
              onClick={onExportCountryPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? `Export ${country.nameEn} Report (PDF)`
                  : `Exporter le Dossier ${country.nameFr} (PDF)`}
              </span>
            </button>
          </div>
        </div>

        {/* If multiple countries match the search query, show quick selector pills */}
        {matchingCountries.length > 1 && (
          <div className="mt-4 p-3 bg-white border border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-tabular text-slate-500 mr-1">
              {isEn ? 'Matching countries:' : 'Pays correspondants à votre saisie :'}
            </span>
            {matchingCountries.slice(0, 8).map((mc) => {
              const isCurrent = mc.iso3 === country.iso3;
              return (
                <button
                  key={mc.iso3}
                  type="button"
                  onClick={() => onSelectCountry(mc)}
                  className={`px-3 py-1 text-xs font-mono-tabular rounded-md transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isEn ? mc.nameEn : mc.nameFr} ({mc.iso3})
                </button>
              );
            })}
          </div>
        )}

        {/* Country Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8 items-end border-b border-slate-200">
          <div className="lg:col-span-8">
            <div className="text-xs font-mono-tabular uppercase text-amber-700 font-semibold">
              {isEn ? country.regionEn : country.regionFr} ·{' '}
              {isEn ? `Capital / Station: ${country.capitalEn}` : `Capitale / Station : ${country.capitalFr}`}{' '}
              ({country.lat.toFixed(2)}°, {country.lon.toFixed(2)}°)
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-slate-900 mt-2 leading-[1.06]">
              {isEn
                ? `${country.nameEn} — Complete Climate, Biodiversity & Policy Dossier`
                : `${country.nameFr} — Bilan Climatique, Déforestation, Actions WWF & Lois`}
            </h1>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
              <span>{isEn ? 'POPULATION (WORLD BANK)' : 'POPULATION (BANQUE MONDIALE)'}</span>
              <span className="font-bold text-slate-900">
                {country.populationMillions.toLocaleString(isEn ? 'en-US' : 'fr-FR')} M hab.
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{isEn ? 'NET-ZERO LEGAL TARGET' : 'OBJECTIF NEUTRALITÉ CARBONE'}</span>
              <span className="font-bold text-emerald-700">{country.netZeroTargetYear}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{isEn ? 'HISTORICAL SHARE (SINCE 1850)' : 'PART HISTORIQUE CUMULÉE (1850)'}</span>
              <span className="font-bold text-slate-900">
                {country.cumulativeHistoricalSharePercent}% {isEn ? 'of world' : 'du monde'}
              </span>
            </div>
          </div>
        </div>

        {/* 6-Card National Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200 mt-8">
          {/* KPI 1: Annual GHG Emissions */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400">
              {isEn ? '1. Annual Territorial GHG Emissions' : '1. Émissions Annuelles de GES'}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                {country.annualMtCO2e.toLocaleString(isEn ? 'en-US' : 'fr-FR')}
              </span>
              <span className="text-xs font-mono-tabular text-slate-500">MtCO₂eq / {isEn ? 'yr' : 'an'}</span>
            </div>
            <div
              className={`mt-2 text-xs font-mono-tabular font-semibold ${
                evolPositive ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {isEn ? 'Trend since 1990: ' : 'Évolution depuis 1990 : '}
              {evolPositive
                ? `+${country.evolutionSince1990Percent.toFixed(1)}%`
                : `${country.evolutionSince1990Percent.toFixed(1)}%`}
            </div>
          </div>

          {/* KPI 2: Per Capita Footprint */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400">
              {isEn ? '2. Per Capita Carbon Footprint' : '2. Empreinte par Habitant'}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                {country.perCapitaTonnes.toFixed(2)}
              </span>
              <span className="text-xs font-mono-tabular text-slate-500">
                tCO₂ / {isEn ? 'capita / yr' : 'hab / an'}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono-tabular text-amber-700">
              {isEn
                ? `${perCapitaRatio}× global average (4.7 t/cap)`
                : `${perCapitaRatio}× la moyenne mondiale (4,7 t/hab)`}
            </div>
          </div>

          {/* KPI 3: National Warming Anomaly */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400">
              {isEn ? '3. National Thermal Anomaly' : '3. Réchauffement National Observé'}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-rose-600">
                +{country.nationalTempAnomalyC.toFixed(2)}
              </span>
              <span className="text-xs font-mono-tabular text-slate-500">°C vs 1850–1900</span>
            </div>
            <div className="mt-2 text-xs font-mono-tabular text-slate-600">
              {isEn
                ? 'Global mean reference: +1.52 °C (Copernicus)'
                : 'Moyenne mondiale : +1,52 °C (Copernicus ERA5)'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-x border-b border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {/* KPI 4: Low-Carbon & Renewable Electricity */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400">
              {isEn ? '4. Low-Carbon & Renewable Power' : '4. Électricité Bas-Carbone & Renouvelable'}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-emerald-700">
                {country.lowCarbonElectricityPercent.toFixed(1)}%
              </span>
              <span className="text-xs font-mono-tabular text-slate-500">
                {isEn ? 'low-carbon electricity' : 'électricité décarbonée'}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono-tabular text-slate-600">
              {isEn
                ? `Renewables share: ${country.renewableSharePercent.toFixed(1)}% (World Bank)`
                : `Part renouvelable : ${country.renewableSharePercent.toFixed(1)} % (Banque Mondiale)`}
            </div>
          </div>

          {/* KPI 5: National Forest Cover */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400">
              {isEn ? '5. Forest Cover & Carbon Sink' : '5. Couverture Forestière Nationale'}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                {country.forestCoverPercent.toFixed(1)}%
              </span>
              <span className="text-xs font-mono-tabular text-slate-500">
                {isEn ? 'of national territory (FAO)' : 'du territoire national (FAO)'}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono-tabular text-emerald-700">
              {isEn ? 'Tracked via FAO & WWF Forest Fronts' : 'Suivi par la FAO & WWF France'}
            </div>
          </div>

          {/* KPI 6: Real-Time Capital Weather & Air Quality (Open-Meteo API) */}
          <div className="p-5 sm:p-6">
            <div className="text-xs font-mono-tabular uppercase text-slate-400 flex items-center justify-between">
              <span>{isEn ? '6. Live Capital Telemetry' : '6. Météo & Air en Direct (Capitale)'}</span>
              <span className="text-[10px] text-emerald-700">
                {liveData ? `LIVE ${liveData.fetchedAt}` : 'SYNC...'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                {liveData ? `${liveData.currentTempC.toFixed(1)}°C` : '...'}
              </span>
              <span className="text-xs font-mono-tabular text-amber-700 font-semibold">
                PM₂.₅ : {liveData ? `${liveData.pm25UgM3.toFixed(1)} µg/m³` : '...'}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono-tabular text-slate-500 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {liveData ? `${liveData.windSpeedKmh.toFixed(1)} km/h` : '--'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {liveData ? `${liveData.humidityPercent}%` : '--'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {liveData ? `${liveData.surfacePressureHpa.toFixed(0)} hPa` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Analytical Section: Sectoral Causes Breakdown + Live API Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* Left 6 Columns: Country Sectoral Emissions Breakdown */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono-tabular uppercase text-amber-700">
                {isEn
                  ? `National Sectoral Inventory — ${country.nameEn}`
                  : `Répartition Sectorielle des Émissions — ${country.nameFr}`}
              </div>
              <h2 className="text-2xl font-display text-slate-900 mt-1">
                {isEn
                  ? `Where do ${country.nameEn}’s greenhouse gas emissions come from?`
                  : `D’où proviennent les émissions de gaz à effet de serre en ${country.nameFr} ?`}
              </h2>

              <div className="mt-6 space-y-4">
                {country.sectors.map((sec, idx) => (
                  <div key={idx} className="p-3.5 bg-[#F8FAFC] border border-slate-200">
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="font-semibold text-slate-900">
                        {isEn ? sec.sectorEn : sec.sectorFr}
                      </span>
                      <span className="font-mono-tabular font-bold text-slate-900 shrink-0">
                        {sec.sharePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 mt-2 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${Math.min(100, sec.sharePercent)}%`,
                          backgroundColor: sec.color
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {isEn ? sec.detailEn : sec.detailFr}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono-tabular">
              {isEn
                ? `Total national inventory: ${country.annualMtCO2e} MtCO₂eq/yr (EDGAR JRC / National Inventory)`
                : `Inventaire national total : ${country.annualMtCO2e} MtCO₂eq/an (EDGAR JRC / Inventaire officiel)`}
            </div>
          </div>

          {/* Right 6 Columns: Live World Bank API & Open-Meteo Interactive Chart */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-mono-tabular uppercase text-emerald-700">
                    {isEn
                      ? 'Official Time-Series (World Bank, FAO & Copernicus)'
                      : 'Séries Temporelles Officielles (Banque Mondiale, FAO & Copernicus)'}
                  </div>
                  <h2 className="text-2xl font-display text-slate-900 mt-1">
                    {chartTab === 'renewables' &&
                      (isEn
                        ? `${country.nameEn}: Renewable Energy Trajectory (%)`
                        : `${country.nameFr} : Évolution des Énergies Renouvelables (%)`)}
                    {chartTab === 'forest' &&
                      (isEn
                        ? `${country.nameEn}: Forest Cover Evolution (% of land)`
                        : `${country.nameFr} : Évolution de la Surface Forestière (%)`)}
                    {chartTab === 'hourlyTemp' &&
                      (isEn
                        ? `${country.capitalEn}: 24h Live Temperature Curve (°C)`
                        : `${country.capitalFr} : Température Horaire en Direct sur 24h (°C)`)}
                  </h2>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
                  <button
                    type="button"
                    onClick={() => setChartTab('renewables')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      chartTab === 'renewables'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isEn ? 'Renewables' : 'Renouvelables'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTab('forest')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      chartTab === 'forest'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isEn ? 'Forests' : 'Forêts'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTab('hourlyTemp')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      chartTab === 'hourlyTemp'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isEn ? '24h Weather' : 'Météo 24h'}
                  </button>
                </div>
              </div>

              {/* SVG Interactive Chart */}
              <div className="mt-6">
                {(() => {
                  const series =
                    chartTab === 'renewables'
                      ? liveData?.renewableTrend.map((p) => ({ label: String(p.year), val: p.value })) || []
                      : chartTab === 'forest'
                      ? liveData?.forestTrend.map((p) => ({ label: String(p.year), val: p.value })) || []
                      : liveData?.hourlyTemps.map((p) => ({ label: p.time, val: p.temp })) || [];

                  if (series.length < 2) {
                    return (
                      <div className="h-56 flex items-center justify-center bg-slate-50 border border-slate-200 text-xs font-mono-tabular text-slate-500">
                        {loadingLive
                          ? isEn
                            ? 'Updating national indicators...'
                            : 'Actualisation des indicateurs nationaux...'
                          : isEn
                          ? `Verified national value: ${
                              chartTab === 'forest'
                                ? `${country.forestCoverPercent}% forest cover`
                                : `${country.renewableSharePercent}% renewable share`
                            }`
                          : `Valeur nationale vérifiée : ${
                              chartTab === 'forest'
                                ? `${country.forestCoverPercent} % de couverture forestière`
                                : `${country.renewableSharePercent} % d'énergies renouvelables`
                            }`}
                      </div>
                    );
                  }

                  const vals = series.map((s) => s.val);
                  const minV = Math.min(...vals);
                  const maxV = Math.max(...vals);
                  const range = Math.max(1, maxV - minV);
                  const w = 560;
                  const h = 210;
                  const padL = 42;
                  const padR = 18;
                  const padT = 18;
                  const padB = 30;
                  const plotW = w - padL - padR;
                  const plotH = h - padT - padB;

                  const strokeColor =
                    chartTab === 'renewables'
                      ? '#059669'
                      : chartTab === 'forest'
                      ? '#0284C7'
                      : '#D97706';

                  const pointsAttr = series
                    .map((pt, i) => {
                      const x = padL + (i / (series.length - 1)) * plotW;
                      const y = padT + plotH - ((pt.val - minV) / range) * plotH;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ');

                  const unit = chartTab === 'hourlyTemp' ? '°C' : '%';

                  return (
                    <div className="bg-[#F8FAFC] border border-slate-200 p-3">
                      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56 overflow-visible">
                        {[0, 0.5, 1].map((ratio, idx) => {
                          const y = padT + ratio * plotH;
                          const labelVal = (maxV - ratio * range).toFixed(1);
                          return (
                            <g key={idx}>
                              <line
                                x1={padL}
                                y1={y}
                                x2={w - padR}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeDasharray="3 3"
                              />
                              <text
                                x={padL - 6}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-slate-500 text-[10px] font-mono-tabular"
                              >
                                {labelVal}
                                {unit}
                              </text>
                            </g>
                          );
                        })}

                        <polyline
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2.5"
                          points={pointsAttr}
                        />

                        {series.map((pt, i) => {
                          if (i !== 0 && i !== series.length - 1 && i % Math.ceil(series.length / 6) !== 0)
                            return null;
                          const x = padL + (i / (series.length - 1)) * plotW;
                          const y = padT + plotH - ((pt.val - minV) / range) * plotH;
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="3.5" fill={strokeColor} />
                              <text
                                x={x}
                                y={h - 8}
                                textAnchor="middle"
                                className="fill-slate-500 text-[10px] font-mono-tabular"
                              >
                                {pt.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* CAMS Air Quality Live Readout Box for the Country Capital */}
              <div className="mt-5 p-4 bg-slate-900 text-white">
                <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-300">
                  <span>
                    {isEn
                      ? `LIVE ATMOSPHERIC POLLUTANTS — ${country.capitalEn.toUpperCase()}`
                      : `POLLUANTS ATMOSPHÉRIQUES EN DIRECT — ${country.capitalFr.toUpperCase()}`}
                  </span>
                  <span className="text-emerald-400">Copernicus CAMS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs font-mono-tabular">
                  <div>
                    <div className="text-slate-400">PM₂.₅ (Fines)</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {liveData ? `${liveData.pm25UgM3.toFixed(1)} µg/m³` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">PM₁₀</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {liveData ? `${liveData.pm10UgM3.toFixed(1)} µg/m³` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Monoxyde CO</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {liveData ? `${liveData.carbonMonoxideUgM3.toFixed(0)} µg/m³` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Ozone O₃ / NO₂</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      {liveData
                        ? `${liveData.ozoneUgM3.toFixed(0)} / ${liveData.nitrogenDioxideUgM3.toFixed(1)}`
                        : '--'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 of Country View: Forests, Deforestation, Climate Risks & WWF Wildlife Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* Left 5 Columns: Forest Cover & Climate Disruption Risks */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-emerald-700">
                <Trees className="w-4 h-4" />
                <span>
                  {isEn
                    ? `Forests, Deforestation & Physical Climate Risks`
                    : `Forêts, Déforestation & Impacts Climatiques en ${country.nameFr}`}
                </span>
              </div>

              <h3 className="text-2xl font-display text-slate-900 mt-2">
                {isEn
                  ? `Forest Carbon Sink (${country.forestCoverPercent}%) & Territorial Vulnerability`
                  : `État des Forêts (${country.forestCoverPercent} % du territoire) & Vulnérabilités`}
              </h3>

              <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200 text-sm text-slate-800 leading-relaxed">
                {isEn ? country.forestTrendEn : country.forestTrendFr}
              </div>

              <div className="mt-6">
                <div className="text-xs font-mono-tabular font-semibold uppercase text-rose-700 flex items-center gap-1.5 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {isEn
                      ? `Observed Climate Disruption Impacts in ${country.nameEn}`
                      : `Impacts Directs du Dérèglement Climatique (${country.nameFr})`}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {(isEn ? country.climateRisksEn : country.climateRisksFr).map((risk, i) => (
                    <li
                      key={i}
                      className="p-3 bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed"
                    >
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: What WWF Does for Wildlife & Ecosystems in this Country */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-amber-700">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isEn
                    ? `WWF Wildlife Protection & Ecosystem Conservation in ${country.nameEn}`
                    : `Actions du WWF pour les Animaux et la Biodiversité en ${country.nameFr}`}
                </span>
              </div>

              <h3 className="text-2xl font-display text-slate-900 mt-2">
                {isEn
                  ? `Keystone Species & WWF Conservation Programs (${country.nameEn})`
                  : `Espèces Protégées & Programmes de Terrain du WWF (${country.nameFr})`}
              </h3>

              <div className="mt-5 space-y-4">
                {(isEn ? country.wwfSpeciesAndActionsEn : country.wwfSpeciesAndActionsFr).map(
                  (item, idx) => (
                    <div key={idx} className="p-5 bg-[#F8FAFC] border border-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                        <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <span className="text-xs font-mono-tabular font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-sm">
                          WWF / UICN
                        </span>
                      </div>
                      <div className="mt-2.5 text-xs font-mono-tabular text-amber-800 font-medium">
                        {isEn ? 'Target Wildlife & Biomes: ' : 'Espèces & Écosystèmes Ciblés : '}
                        <strong className="text-slate-900">{item.species}</strong>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {item.action}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {isEn
                  ? 'Source: WWF Living Planet Report & National Conservation Programmes'
                  : 'Source : Rapport Planète Vivante WWF & Programmes de Conservation Nationaux'}
              </span>
              <a
                href="https://www.wwf.fr/espaces-prioritaires"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tabular font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
              >
                <span>wwf.fr</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 3 of Country View: National Laws, Climate Policies & Official Sources */}
        <div className="mt-10 bg-white border border-slate-200 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono-tabular uppercase text-slate-500 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-slate-800" />
                <span>
                  {isEn
                    ? `Laws, Public Policies & Climate Measures Enacted by ${country.nameEn}`
                    : `Lois, Politiques Publiques & Mesures Mises en Place par : ${country.nameFr}`}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-slate-900 mt-1">
                {isEn ? country.policyFrameworkTitleEn : country.policyFrameworkTitleFr}
              </h3>
            </div>

            <div className="bg-slate-900 text-white px-4 py-3 shrink-0">
              <div className="text-[11px] font-mono-tabular text-slate-300">
                {isEn ? 'OFFICIAL 2030 & NET-ZERO TARGET' : 'OBJECTIF OFFICIEL 2030 & NEUTRALITÉ'}
              </div>
              <div className="text-xs sm:text-sm font-mono-tabular font-bold text-emerald-400 mt-0.5">
                {isEn ? country.target2030En : country.target2030Fr}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {(isEn ? country.keyLawsAndMeasuresEn : country.keyLawsAndMeasuresFr).map(
              (law, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#F8FAFC] border border-slate-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{law}</p>
                </div>
              )
            )}
          </div>

          {/* Official Country Sources & Links */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-mono-tabular text-slate-500">
              {isEn
                ? `Verified Institutional Sources for ${country.nameEn}:`
                : `Sources Institutionnelles Vérifiées pour ${country.nameFr} :`}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {country.officialSources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-mono-tabular rounded-md inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{src.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
