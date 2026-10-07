import React, { useState } from 'react';
import { GLOBAL_CAUSES_BY_SECTOR, SectorCause, Language } from '../data/climateDatasets';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Props {
  lang: Language;
}

export const SectorCausesExplorer: React.FC<Props> = ({ lang }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(GLOBAL_CAUSES_BY_SECTOR[0].id);
  const [gasFilter, setGasFilter] = useState<'ALL' | 'CO2' | 'CH4'>('ALL');
  const [activeSubSectorIndex, setActiveSubSectorIndex] = useState<number>(0);
  const isEn = lang === 'en';

  const visibleSectors = GLOBAL_CAUSES_BY_SECTOR.filter((s) =>
    gasFilter === 'ALL' ? true : s.primaryGas === gasFilter
  );

  const activeSector: SectorCause =
    GLOBAL_CAUSES_BY_SECTOR.find((s) => s.id === selectedSectorId) || GLOBAL_CAUSES_BY_SECTOR[0];

  const activeSubSector =
    activeSector.subSectors[activeSubSectorIndex] || activeSector.subSectors[0];

  const handleSelectSector = (id: string) => {
    setSelectedSectorId(id);
    setActiveSubSectorIndex(0);
  };

  return (
    <section id="causes-mondiales" className="py-12 sm:py-16 lg:py-24 border-t border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500">
              <span>
                {isEn
                  ? '02. Anatomy of Anthropogenic Causes'
                  : '02. Anatomie des Causes Anthropiques'}
              </span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>
                {isEn
                  ? 'Global Total: 59.1 GtCO₂eq / yr (IPCC AR6 & Climate Watch)'
                  : 'Bilan Mondial : 59,1 GtCO₂eq / an (GIEC AR6 & Climate Watch)'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'What are the exact root causes of global warming across the world?'
                : 'Quelles sont les causes exactes du réchauffement climatique dans le monde ?'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Heat accumulation in the Earth’s climate system stems from five primary physical and economic sectors. Select any sector below to inspect its industrial sub-sectors, dominant greenhouse gases, and mitigation levers.'
                : 'L’accumulation de chaleur dans le système climatique découle de cinq grands systèmes physiques et économiques. Sélectionnez un secteur ci-dessous pour décomposer ses sous-secteurs industriels, les gaz impliqués et les leviers de décarbonation.'}
            </p>
          </div>

          {/* Gas Filter Segmented Control */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setGasFilter('ALL')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                gasFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'All Gases (59.1 Gt)' : 'Tous les gaz (59,1 Gt)'}
            </button>
            <button
              type="button"
              onClick={() => setGasFilter('CO2')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                gasFilter === 'CO2'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Fossil & Industrial CO₂' : 'Dominante CO₂ Fossile'}
            </button>
            <button
              type="button"
              onClick={() => setGasFilter('CH4')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                gasFilter === 'CH4'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Methane (CH₄) & Biogenic' : 'Dominante Méthane (CH₄)'}
            </button>
          </div>
        </div>

        {/* Interactive Proportional Marimekko Bar (100% Global Emissions Breakdown) */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 mb-2">
            <span>
              {isEn
                ? 'Proportional breakdown of global greenhouse gas emissions (100% = 59.1 GtCO₂eq/yr)'
                : 'Répartition proportionnelle des émissions mondiales de gaz à effet de serre (100 % = 59,1 GtCO₂eq/an)'}
            </span>
            <span className="font-mono-tabular">
              {isEn ? 'Tap or click a block to inspect sub-sectors' : 'Cliquez sur un bloc pour explorer ses sous-secteurs'}
            </span>
          </div>

          <div className="h-14 w-full flex border border-slate-300 bg-slate-100 overflow-hidden">
            {GLOBAL_CAUSES_BY_SECTOR.map((sector) => {
              const isSelected = sector.id === activeSector.id;
              const isDimmed = gasFilter !== 'ALL' && sector.primaryGas !== gasFilter;
              const sName = isEn ? sector.nameEn : sector.name;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => handleSelectSector(sector.id)}
                  style={{
                    width: `${sector.sharePercent}%`,
                    backgroundColor: sector.color,
                    opacity: isDimmed ? 0.25 : isSelected ? 1 : 0.82
                  }}
                  className={`h-full relative group transition-opacity border-r border-white/30 last:border-r-0 flex flex-col justify-center px-1.5 sm:px-2.5 text-left overflow-hidden focus:outline-none cursor-pointer ${
                    isSelected ? 'ring-2 ring-inset ring-white' : ''
                  }`}
                  title={`${sName}: ${sector.sharePercent}% (${sector.annualGtCO2e} GtCO₂e)`}
                >
                  <span className="text-[11px] font-mono-tabular font-semibold text-white truncate">
                    {sector.sharePercent}%
                  </span>
                  <span className="text-[11px] text-white/90 font-medium truncate hidden md:block">
                    {sName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Split Workspace: Left Sector Selector List + Right Deep Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
          {/* Left Column: 5 Primary Sectors */}
          <div className="lg:col-span-5 flex flex-col border border-slate-200 bg-white divide-y divide-slate-200">
            {visibleSectors.map((sector, idx) => {
              const isSelected = sector.id === activeSector.id;
              const sName = isEn ? sector.nameEn : sector.name;
              const sTrend = isEn ? sector.trend5YrEn : sector.trend5Yr;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => handleSelectSector(sector.id)}
                  className={`w-full text-left p-4 sm:p-5 transition-colors flex flex-col gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 shrink-0"
                        style={{ backgroundColor: sector.color }}
                      />
                      <span
                        className={`text-xs font-mono-tabular truncate ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        0{idx + 1} · {isEn ? 'Primary Gas' : 'Gaz majeur'} : {sector.primaryGas}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono-tabular shrink-0 ${
                        isSelected ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {isEn ? 'Trend' : 'Tendance'} : {sTrend}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 mt-1">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                      {sName}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xl sm:text-2xl font-mono-tabular font-bold">
                        {sector.sharePercent.toFixed(1)}%
                      </span>
                      <span
                        className={`block text-xs font-mono-tabular ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {sector.annualGtCO2e.toFixed(2)} {isEn ? 'GtCO₂e/yr' : 'GtCO₂e/an'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Diagnostic & Sub-Sectors Breakdown */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Sector Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">
                    <span>
                      {isEn ? 'Detailed Sectoral Diagnostic' : 'Diagnostic Sectoriel Détaillé'}
                    </span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>
                      {isEn ? 'Primary driver:' : 'Vecteur principal :'} {activeSector.primaryGas}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display text-slate-900 mt-1">
                    {isEn ? activeSector.nameEn : activeSector.name}
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-bold text-slate-900">
                    {activeSector.annualGtCO2e.toFixed(2)}
                    <span className="text-xs font-mono-tabular text-slate-500 ml-1.5 uppercase">
                      {isEn ? 'GtCO₂e / yr' : 'GtCO₂e / an'}
                    </span>
                  </div>
                  <div className="text-xs font-mono-tabular text-slate-500">
                    {isEn
                      ? `${activeSector.sharePercent}% of global total`
                      : `Soit ${activeSector.sharePercent}% du total mondial`}
                  </div>
                </div>
              </div>

              {/* Physical & Economic Explanation */}
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-5">
                {isEn ? activeSector.descriptionEn : activeSector.description}
              </p>

              {/* Sub-sectors Interactive Bar Breakdown */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-slate-800">
                    {isEn
                      ? 'Sub-sector breakdown (click or tap to inspect mechanism)'
                      : 'Décomposition par sous-secteur (cliquez pour inspecter le mécanisme)'}
                  </span>
                  <span className="font-mono-tabular">
                    {isEn ? 'Global Share (%) & Volume (Gt)' : 'Part mondiale (%) & Volume (Gt)'}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSector.subSectors.map((sub, sIdx) => {
                    const isSubSelected = sIdx === activeSubSectorIndex;
                    const relativeWidth = Math.min(
                      100,
                      Math.round((sub.share / activeSector.sharePercent) * 100)
                    );
                    const subName = isEn ? sub.nameEn : sub.name;
                    return (
                      <button
                        key={sub.name}
                        type="button"
                        onClick={() => setActiveSubSectorIndex(sIdx)}
                        className={`w-full text-left p-3.5 border transition-colors cursor-pointer ${
                          isSubSelected
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{subName}</span>
                            {isSubSelected && (
                              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </span>
                          <div className="font-mono-tabular text-xs shrink-0">
                            <span className="font-bold text-slate-900">{sub.share.toFixed(1)}%</span>
                            <span className="text-slate-400 mx-1.5">·</span>
                            <span className="text-slate-600">{sub.gtCO2e.toFixed(2)} Gt</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 mt-2.5 overflow-hidden">
                          <div
                            className="h-full transition-transform duration-200 origin-left"
                            style={{
                              width: `${relativeWidth}%`,
                              backgroundColor: activeSector.color
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Sub-Sector Deep Dive Box */}
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-mono-tabular text-slate-500">
                    {isEn ? 'Physico-chemical mechanism' : 'Mécanisme physico-chimique'} —{' '}
                    {isEn ? activeSubSector.nameEn : activeSubSector.name}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1.5">
                    {isEn ? activeSubSector.detailEn : activeSubSector.detail}
                  </p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                  <div className="text-xs font-mono-tabular text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isEn ? 'Priority Decarbonization Lever' : 'Levier prioritaire de décarbonation'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1.5">
                    {isEn ? activeSubSector.mitigationLeverEn : activeSubSector.mitigationLever}
                  </p>
                </div>
              </div>
            </div>

            {/* Global Structural Drivers */}
            <div className="mt-8 pt-5 border-t border-slate-100">
              <div className="text-xs text-slate-500 mb-2">
                {isEn
                  ? 'Observed global acceleration drivers:'
                  : 'Facteurs d’accélération mondiaux observés :'}
              </div>
              <ul className="space-y-1.5">
                {(isEn ? activeSector.globalDriversEn : activeSector.globalDrivers).map((driver, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-mono-tabular text-slate-400">0{i + 1}.</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
