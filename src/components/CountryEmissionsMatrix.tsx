import React, { useState, useEffect, useMemo } from 'react';
import { COUNTRY_EMISSION_PROFILES, CountryEmissionProfile, Language } from '../data/climateDatasets';
import { fetchWorldBankCountryTrend, WorldBankTimePoint } from '../services/climateApiService';
import { ArrowUpDown, Globe2, RefreshCw } from 'lucide-react';

type SortMetric = 'annualMtCO2' | 'perCapitaTonnes' | 'cumulativeSharePercent';

interface Props {
  lang: Language;
}

export const CountryEmissionsMatrix: React.FC<Props> = ({ lang }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortMetric>('annualMtCO2');
  const [selectedCountry, setSelectedCountry] = useState<CountryEmissionProfile>(
    COUNTRY_EMISSION_PROFILES[0]
  );
  const [wbTrend, setWbTrend] = useState<WorldBankTimePoint[]>([]);
  const [wbLoading, setWbLoading] = useState<boolean>(false);
  const isEn = lang === 'en';

  const regions = [
    { id: 'ALL', fr: 'Tous les Continents (12 Grands Émetteurs)', en: 'All Continents (Top 12 Emitters)' },
    { id: 'Asie-Pacifique', fr: 'Asie-Pacifique', en: 'Asia-Pacific' },
    { id: 'Amérique du Nord', fr: 'Amérique du Nord', en: 'North America' },
    { id: 'Europe', fr: 'Europe', en: 'Europe' },
    { id: 'Amérique Latine', fr: 'Amérique Latine', en: 'Latin America' },
    { id: 'Moyen-Orient & Afrique', fr: 'Moyen-Orient & Afrique', en: 'Middle East & Africa' }
  ];

  const sortedCountries = useMemo(() => {
    return COUNTRY_EMISSION_PROFILES.filter((c) =>
      selectedRegion === 'ALL' ? true : c.region === selectedRegion
    ).sort((a, b) => b[sortBy] - a[sortBy]);
  }, [selectedRegion, sortBy]);

  useEffect(() => {
    let active = true;
    setWbLoading(true);
    fetchWorldBankCountryTrend(selectedCountry.iso)
      .then((pts) => {
        if (active) {
          setWbTrend(pts);
          setWbLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setWbTrend([]);
          setWbLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedCountry]);

  const maxMetricVal = useMemo(() => {
    return Math.max(...COUNTRY_EMISSION_PROFILES.map((c) => c[sortBy]), 1);
  }, [sortBy]);

  return (
    <section id="atlas-pays" className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500">
              <span>
                {isEn
                  ? '03. Carbon Geopolitics & Comparative Responsibilities'
                  : '03. Géopolitique du Carbone & Responsabilités Comparées'}
              </span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>
                {isEn ? 'Global Carbon Project & World Bank Data' : 'Global Carbon Project & Données Banque Mondiale'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Territorial emissions, per-capita footprint, and cumulative historical debt'
                : 'Émissions territoriales, empreinte par habitant et dette historique cumulée'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Understanding the geographic drivers of global warming requires comparing three metrics: annual gross volume, per-capita intensity (lifestyle and energy infrastructure), and cumulative historical responsibility since 1850.'
                : 'Analyser les causes géographiques du réchauffement exige de croiser trois lectures : le volume annuel brut, l’intensité par habitant (mode de vie et infrastructures) et la responsabilité historique cumulée depuis 1850.'}
            </p>
          </div>

          {/* Sort Metric Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{isEn ? 'Sort by:' : 'Classer par :'}</span>
            </span>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSortBy('annualMtCO2')}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sortBy === 'annualMtCO2'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Annual Volume (MtCO₂)' : 'Volume Annuel (MtCO₂)'}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('perCapitaTonnes')}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sortBy === 'perCapitaTonnes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Per Capita (tCO₂/cap)' : 'Par Habitant (tCO₂/hab)'}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('cumulativeSharePercent')}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sortBy === 'cumulativeSharePercent'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Historical 1850 (%)' : 'Cumul Historique 1850 (%)'}
              </button>
            </div>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 py-4 border-b border-slate-200">
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedRegion === reg.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? reg.en : reg.fr}
            </button>
          ))}
        </div>

        {/* Main Content Grid: Left Interactive Table + Right Country Telemetry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
          {/* Left 7 Columns: Comparative Matrix Table */}
          <div className="lg:col-span-7 overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono-tabular uppercase text-slate-500">
                  <th className="py-3 px-3 sm:px-4 font-medium">
                    {isEn ? 'Country / Jurisdiction' : 'Pays / Juridiction'}
                  </th>
                  <th className="py-3 px-3 sm:px-4 font-medium text-right">
                    {isEn ? 'Annual (MtCO₂)' : 'Annuel (MtCO₂)'}
                  </th>
                  <th className="py-3 px-3 sm:px-4 font-medium text-right">
                    {isEn ? 'tCO₂ / Capita' : 'tCO₂ / Habitant'}
                  </th>
                  <th className="py-3 px-3 sm:px-4 font-medium text-right">
                    {isEn ? '1850 Cumul. (%)' : 'Cumul 1850 (%)'}
                  </th>
                  <th className="py-3 px-3 sm:px-4 font-medium w-28 sm:w-36">
                    {isEn ? 'Relative Scale' : 'Échelle Relative'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {sortedCountries.map((country) => {
                  const isSelected = country.iso === selectedCountry.iso;
                  const barRatio = Math.min(100, Math.round((country[sortBy] / maxMetricVal) * 100));
                  const deltaSince1990 = Math.round(
                    ((country.annualMtCO2 - country.historical1990Mt) / country.historical1990Mt) * 100
                  );
                  const cName = isEn ? country.nameEn : country.name;

                  return (
                    <tr
                      key={country.iso}
                      onClick={() => setSelectedCountry(country)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-50/70 font-medium'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="text-slate-900 font-semibold">{cName}</span>
                            <span className="text-xs text-slate-400 font-mono-tabular ml-2">
                              {country.iso}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-mono-tabular shrink-0 ${
                              deltaSince1990 > 0 ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {deltaSince1990 > 0 ? `+${deltaSince1990}%` : `${deltaSince1990}%`} vs 1990
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono-tabular text-slate-900">
                        {country.annualMtCO2.toLocaleString(isEn ? 'en-US' : 'fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono-tabular text-slate-800">
                        {country.perCapitaTonnes.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono-tabular text-slate-700">
                        {country.cumulativeSharePercent.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="w-full h-2 bg-slate-100 overflow-hidden">
                          <div
                            className="h-full transition-all duration-200"
                            style={{
                              width: `${barRatio}%`,
                              backgroundColor: isSelected ? '#D97706' : '#0F172A'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right 5 Columns: Selected Country Deep Profile + Live World Bank API Chart */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isEn ? selectedCountry.regionEn : selectedCountry.region}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">ISO {selectedCountry.iso}</span>
                  </div>
                  <h3 className="text-3xl font-display text-slate-900 mt-1">
                    {isEn ? selectedCountry.nameEn : selectedCountry.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono-tabular font-bold text-slate-900">
                    {selectedCountry.perCapitaTonnes.toFixed(1)}
                    <span className="text-xs font-mono-tabular text-slate-500 ml-1">
                      {isEn ? 'tCO₂/cap' : 'tCO₂/hab'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'World average: 4.7 t/cap' : 'Moyenne mondiale : 4,7 t/hab'}
                  </div>
                </div>
              </div>

              {/* Country Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 py-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Annual Flux' : 'Flux Annuel'}
                  </div>
                  <div className="text-lg font-mono-tabular font-bold text-slate-900 mt-0.5">
                    {(selectedCountry.annualMtCO2 / 1000).toFixed(2)}
                    <span className="text-xs font-normal text-slate-500 ml-1">Gt</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Cumul. Since 1850' : 'Cumul depuis 1850'}
                  </div>
                  <div className="text-lg font-mono-tabular font-bold text-amber-700 mt-0.5">
                    {selectedCountry.cumulativeSharePercent.toFixed(1)}
                    <span className="text-xs font-normal text-slate-500 ml-1">%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Low-Carbon Power' : 'Élec. Décarbonée'}
                  </div>
                  <div className="text-lg font-mono-tabular font-bold text-emerald-700 mt-0.5">
                    {selectedCountry.renewableSharePercent.toFixed(1)}
                    <span className="text-xs font-normal text-slate-500 ml-1">%</span>
                  </div>
                </div>
              </div>

              {/* Root Cause Analysis for Country */}
              <div className="mt-4">
                <div className="text-xs font-mono-tabular text-slate-500">
                  {isEn
                    ? 'Primary structural emission drivers:'
                    : 'Sources structurelles d’émissions nationales :'}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed mt-1 font-medium">
                  {isEn ? selectedCountry.mainCauseEn : selectedCountry.mainCause}
                </p>
              </div>

              {/* Live World Bank API Data Integration */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {isEn
                        ? 'World Bank Historical Time-Series (Updated)'
                        : 'Série Temporelle Banque Mondiale (Actualisée)'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isEn
                        ? 'Renewable energy share in total final energy consumption (%)'
                        : 'Part des énergies renouvelables dans la consommation finale d’énergie (%)'}
                    </div>
                  </div>
                  {wbLoading && (
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
                  )}
                </div>

                {wbTrend.length > 4 ? (
                  <div className="bg-white border border-slate-200 p-3">
                    <svg viewBox="0 0 360 110" className="w-full h-auto">
                      {(() => {
                        const vals = wbTrend.map((d) => d.value);
                        const minV = Math.max(0, Math.min(...vals) - 2);
                        const maxV = Math.max(...vals) + 2;
                        const span = maxV - minV || 1;
                        const w = 320;
                        const h = 76;
                        const ox = 28;
                        const oy = 12;

                        const path = wbTrend
                          .map((pt, idx) => {
                            const x = ox + (idx / (wbTrend.length - 1)) * w;
                            const y = oy + h - ((pt.value - minV) / span) * h;
                            return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                          })
                          .join(' ');

                        const first = wbTrend[0];
                        const last = wbTrend[wbTrend.length - 1];

                        return (
                          <g>
                            <line
                              x1={ox}
                              y1={oy + h}
                              x2={ox + w}
                              y2={oy + h}
                              stroke="#E2E8F0"
                            />
                            <path
                              d={path}
                              fill="none"
                              stroke="#059669"
                              strokeWidth="2"
                            />
                            <text
                              x={ox}
                              y={oy + h + 16}
                              className="text-[10px] fill-slate-500 font-mono-tabular"
                            >
                              {first.year} ({first.value}%)
                            </text>
                            <text
                              x={ox + w}
                              y={oy + h + 16}
                              textAnchor="end"
                              className="text-[10px] fill-emerald-700 font-mono-tabular font-semibold"
                            >
                              {last.year} ({last.value}%)
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 p-3 text-xs text-slate-600 font-mono-tabular">
                    {isEn ? 'National emission trajectory:' : 'Évolution des émissions nationales :'}{' '}
                    {selectedCountry.historical1990Mt} MtCO₂ (1990) →{' '}
                    {selectedCountry.annualMtCO2} MtCO₂ ({isEn ? 'current' : 'actuel'}).
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                {isEn
                  ? 'Select any country in the table to view its detailed profile'
                  : 'Cliquez sur un pays du tableau pour afficher son profil détaillé'}
              </span>
              <span className="font-mono-tabular">Global Carbon Project · World Bank</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
