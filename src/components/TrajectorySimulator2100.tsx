import React, { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Language } from '../data/climateDatasets';

interface PolicySliders {
  coalPhaseout: number;
  methaneAbatement: number;
  reforestationAndDiet: number;
  transportElectrification: number;
  industrialDecarb: number;
}

const DEFAULT_SLIDERS: PolicySliders = {
  coalPhaseout: 25,
  methaneAbatement: 20,
  reforestationAndDiet: 15,
  transportElectrification: 30,
  industrialDecarb: 15
};

const PARIS_ALIGNED_SLIDERS: PolicySliders = {
  coalPhaseout: 95,
  methaneAbatement: 85,
  reforestationAndDiet: 80,
  transportElectrification: 90,
  industrialDecarb: 75
};

interface Props {
  lang: Language;
}

export const TrajectorySimulator2100: React.FC<Props> = ({ lang }) => {
  const [sliders, setSliders] = useState<PolicySliders>(DEFAULT_SLIDERS);
  const isEn = lang === 'en';

  const updateSlider = (key: keyof PolicySliders, val: number) => {
    setSliders((prev) => ({ ...prev, [key]: val }));
  };

  // Calculate projected annual emissions by 2050 & 2100 temperature anomaly
  const simulation = useMemo(() => {
    const baseline2025Gt = 59.1;

    // Maximum mitigation potential per lever by 2050 (in GtCO2e/yr)
    const savedCoal = (sliders.coalPhaseout / 100) * 16.4;
    const savedMethane = (sliders.methaneAbatement / 100) * 8.2;
    const savedAFOLU = (sliders.reforestationAndDiet / 100) * 10.5;
    const savedTransport = (sliders.transportElectrification / 100) * 8.6;
    const savedIndustry = (sliders.industrialDecarb / 100) * 10.2;

    const totalAbated2050 =
      savedCoal + savedMethane + savedAFOLU + savedTransport + savedIndustry;

    const projected2050Gt = Math.max(4.2, baseline2025Gt - totalAbated2050);

    const mitigationRatio = totalAbated2050 / (16.4 + 8.2 + 10.5 + 8.6 + 10.2);
    const projected2100Temp = Number((2.92 - mitigationRatio * 1.44).toFixed(2));
    const projectedSeaLevelCm = Math.round(84 - mitigationRatio * 39);

    const years = [2025, 2035, 2050, 2065, 2080, 2100];
    const bauTemps = [1.52, 1.74, 2.08, 2.38, 2.66, 2.92];
    const parisTemps = [1.52, 1.58, 1.61, 1.56, 1.51, 1.48];
    const customTemps = years.map((yr, idx) => {
      if (idx === 0) return 1.52;
      const progress = idx / (years.length - 1);
      const bau = bauTemps[idx];
      const delta = (bau - parisTemps[idx]) * mitigationRatio;
      return Number((bau - delta * Math.pow(progress, 0.85)).toFixed(2));
    });

    return {
      projected2050Gt,
      totalAbated2050,
      projected2100Temp,
      projectedSeaLevelCm,
      years,
      bauTemps,
      parisTemps,
      customTemps
    };
  }, [sliders]);

  const statusBadge = useMemo(() => {
    if (simulation.projected2100Temp <= 1.65) {
      return {
        label: isEn
          ? '● PARIS AGREEMENT ALIGNED (< 1.7 °C)'
          : '● COMPATIBLE ACCORD DE PARIS (< 1,7 °C)',
        dotClass: 'bg-emerald-500 ring-4 ring-emerald-500/20',
        textClass: 'text-emerald-700'
      };
    }
    if (simulation.projected2100Temp <= 2.15) {
      return {
        label: isEn
          ? '▲ INTERMEDIATE TRANSITION (+1.7 °C to +2.1 °C)'
          : '▲ TRANSITION INTERMÉDIAIRE (+1,7 °C à +2,1 °C)',
        dotClass: 'bg-amber-500 ring-4 ring-amber-500/20',
        textClass: 'text-amber-700'
      };
    }
    return {
      label: isEn
        ? '✖ CRITICAL OVERSHOOT (> +2.2 °C)'
        : '✖ DÉPASSEMENT CRITIQUE (> +2,2 °C)',
      dotClass: 'bg-rose-500 ring-4 ring-rose-500/20',
      textClass: 'text-rose-700'
    };
  }, [simulation.projected2100Temp, isEn]);

  return (
    <section id="simulateur-2100" className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500">
              <span>
                {isEn
                  ? '05. Parametric Mitigation Simulator (2100 Horizon)'
                  : '05. Simulateur Paramétrique d’Atténuation (Horizon 2100)'}
              </span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>
                {isEn
                  ? 'Cumulative Carbon Budget Model (IPCC TCRE)'
                  : 'Modèle de Bilan Carbone Cumulé (TCRE GIEC)'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Simulate the impact of neutralizing global root causes on the 2100 climate'
                : 'Simulez l’impact de la neutralisation des causes mondiales sur le climat de 2100'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Every tenth of a degree matters. Adjust the five primary structural levers below to observe the resulting 2050 emission abatement and projected 2100 thermal anomaly in real time.'
                : 'Chaque dixième de degré compte. Ajustez les cinq grands leviers structurels mondiaux pour observer instantanément la réduction des émissions en 2050 et l’anomalie thermique résultante en 2100.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setSliders(PARIS_ALIGNED_SLIDERS)}
              className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isEn ? 'Paris Agreement Scenario (1.5 °C)' : 'Scénario Accord de Paris (1,5 °C)'}
            </button>
            <button
              type="button"
              onClick={() => setSliders(DEFAULT_SLIDERS)}
              className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Current Policies' : 'Politiques Actuelles'}</span>
            </button>
          </div>
        </div>

        {/* Asymmetric Split Console: Left Parameter Sliders + Right Live Trajectory Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
          {/* Left 5 Columns: 5 Structural Levers */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              {/* Lever 1 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <label htmlFor="slider-coal" className="font-semibold text-slate-900">
                    {isEn
                      ? '1. Coal phase-out & solar/wind grid electrification'
                      : '1. Sortie du charbon & électrification solaire/éolienne'}
                  </label>
                  <span className="font-mono-tabular font-bold text-amber-700 shrink-0">
                    {sliders.coalPhaseout}%
                  </span>
                </div>
                <input
                  id="slider-coal"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={sliders.coalPhaseout}
                  onChange={(e) => updateSlider('coalPhaseout', Number(e.target.value))}
                  className="w-full h-2 accent-slate-900 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>
                    {isEn
                      ? 'Target: Thermal power plants (31.4% of GHG)'
                      : 'Cible : Centrales thermiques (31,4 % des GES)'}
                  </span>
                  <span className="font-mono-tabular">
                    -{((sliders.coalPhaseout / 100) * 16.4).toFixed(1)} {isEn ? 'Gt/yr' : 'Gt/an'}
                  </span>
                </div>
              </div>

              {/* Lever 2 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <label htmlFor="slider-methane" className="font-semibold text-slate-900">
                    {isEn
                      ? '2. Methane leak capture (Fossil extraction & Waste)'
                      : '2. Capture des fuites de méthane (Fossiles & Déchets)'}
                  </label>
                  <span className="font-mono-tabular font-bold text-amber-700 shrink-0">
                    {sliders.methaneAbatement}%
                  </span>
                </div>
                <input
                  id="slider-methane"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={sliders.methaneAbatement}
                  onChange={(e) => updateSlider('methaneAbatement', Number(e.target.value))}
                  className="w-full h-2 accent-slate-900 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>
                    {isEn
                      ? 'Target: Oil/gas flaring & landfill biogas'
                      : 'Cible : Torchage pétrolier & biogaz de décharge'}
                  </span>
                  <span className="font-mono-tabular">
                    -{((sliders.methaneAbatement / 100) * 8.2).toFixed(1)} {isEn ? 'Gt/yr' : 'Gt/an'}
                  </span>
                </div>
              </div>

              {/* Lever 3 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <label htmlFor="slider-afolu" className="font-semibold text-slate-900">
                    {isEn
                      ? '3. Zero tropical deforestation & agro-food transition'
                      : '3. Zéro déforestation tropicale & transition agro-alimentaire'}
                  </label>
                  <span className="font-mono-tabular font-bold text-emerald-700 shrink-0">
                    {sliders.reforestationAndDiet}%
                  </span>
                </div>
                <input
                  id="slider-afolu"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={sliders.reforestationAndDiet}
                  onChange={(e) => updateSlider('reforestationAndDiet', Number(e.target.value))}
                  className="w-full h-2 accent-slate-900 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>
                    {isEn
                      ? 'Target: Primary forests, peatlands & livestock'
                      : 'Cible : Forêts primaires, tourbières & élevage'}
                  </span>
                  <span className="font-mono-tabular">
                    -{((sliders.reforestationAndDiet / 100) * 10.5).toFixed(1)} {isEn ? 'Gt/yr' : 'Gt/an'}
                  </span>
                </div>
              </div>

              {/* Lever 4 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <label htmlFor="slider-transport" className="font-semibold text-slate-900">
                    {isEn
                      ? '4. Transport electrification & rail modal shift'
                      : '4. Électrification des transports & report modal ferroviaire'}
                  </label>
                  <span className="font-mono-tabular font-bold text-sky-700 shrink-0">
                    {sliders.transportElectrification}%
                  </span>
                </div>
                <input
                  id="slider-transport"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={sliders.transportElectrification}
                  onChange={(e) =>
                    updateSlider('transportElectrification', Number(e.target.value))
                  }
                  className="w-full h-2 accent-slate-900 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>
                    {isEn
                      ? 'Target: Road vehicles, heavy freight & aviation'
                      : 'Cible : Routier, fret lourd & carburants aviation'}
                  </span>
                  <span className="font-mono-tabular">
                    -{((sliders.transportElectrification / 100) * 8.6).toFixed(1)} {isEn ? 'Gt/yr' : 'Gt/an'}
                  </span>
                </div>
              </div>

              {/* Lever 5 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <label htmlFor="slider-industry" className="font-semibold text-slate-900">
                    {isEn
                      ? '5. Industrial decarbonization (H₂ steel, low-clinker cement)'
                      : '5. Décarbonation industrielle (Acier H₂, Ciment bas-clinker)'}
                  </label>
                  <span className="font-mono-tabular font-bold text-slate-900 shrink-0">
                    {sliders.industrialDecarb}%
                  </span>
                </div>
                <input
                  id="slider-industry"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={sliders.industrialDecarb}
                  onChange={(e) => updateSlider('industrialDecarb', Number(e.target.value))}
                  className="w-full h-2 accent-slate-900 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>
                    {isEn
                      ? 'Target: Blast furnaces, chemicals & cement kilns'
                      : 'Cible : Hauts-fourneaux, chimie & cimenteries'}
                  </span>
                  <span className="font-mono-tabular">
                    -{((sliders.industrialDecarb / 100) * 10.2).toFixed(1)} {isEn ? 'Gt/yr' : 'Gt/an'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                {isEn ? 'Total simulated abatement by 2050:' : 'Abattement total simulé d’ici 2050 :'}
              </span>
              <span className="font-mono-tabular font-bold text-emerald-700 text-sm">
                -{simulation.totalAbated2050.toFixed(1)} {isEn ? 'GtCO₂e / yr' : 'GtCO₂e / an'}
              </span>
            </div>
          </div>

          {/* Right 7 Columns: Projected Warming Readout & Multi-Scenario SVG Curve */}
          <div className="lg:col-span-7 border border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Status & Key Outcomes */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusBadge.dotClass}`} />
                  <span className={`text-xs font-mono-tabular font-bold ${statusBadge.textClass}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <div className="text-xs font-mono-tabular text-slate-500">
                  {isEn ? 'Pre-industrial baseline: 1850–1900' : 'Référence pré-industrielle : 1850–1900'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Projected Warming (2100)' : 'Réchauffement Projeté (2100)'}
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono-tabular font-bold text-slate-900 mt-1">
                    +{simulation.projected2100Temp.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500 ml-1">°C</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Residual Emissions (2050)' : 'Émissions Résiduelles (2050)'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-bold text-amber-700 mt-1">
                    {simulation.projected2050Gt.toFixed(1)}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      {isEn ? 'GtCO₂e/yr' : 'GtCO₂e/an'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Sea Level Rise (2100)' : 'Hausse Niveau Marin (2100)'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-bold text-sky-700 mt-1">
                    +{simulation.projectedSeaLevelCm}
                    <span className="text-xs font-normal text-slate-500 ml-1">cm</span>
                  </div>
                </div>
              </div>

              {/* SVG Trajectory Fan Chart */}
              <div className="mt-6">
                <div className="text-xs font-semibold text-slate-800 mb-3">
                  {isEn
                    ? 'Global Thermal Trajectory Comparison (2025–2100)'
                    : 'Comparaison des Trajectoires Thermiques Globales (2025–2100)'}
                </div>

                <svg viewBox="0 0 640 240" className="w-full h-auto">
                  {(() => {
                    const padL = 48;
                    const padR = 96;
                    const padT = 20;
                    const padB = 34;
                    const w = 640 - padL - padR;
                    const h = 240 - padT - padB;
                    const minT = 1.2;
                    const maxT = 3.2;

                    const getX = (idx: number) =>
                      padL + (idx / (simulation.years.length - 1)) * w;
                    const getY = (val: number) =>
                      padT + h - ((val - minT) / (maxT - minT)) * h;

                    const makePath = (arr: number[]) =>
                      arr
                        .map(
                          (v, i) =>
                            `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(v).toFixed(1)}`
                        )
                        .join(' ');

                    const bauPath = makePath(simulation.bauTemps);
                    const parisPath = makePath(simulation.parisTemps);
                    const customPath = makePath(simulation.customTemps);

                    return (
                      <g>
                        {[1.5, 2.0, 2.5, 3.0].map((tVal) => {
                          const y = getY(tVal);
                          return (
                            <g key={tVal}>
                              <line
                                x1={padL}
                                y1={y}
                                x2={padL + w}
                                y2={y}
                                stroke={tVal === 1.5 ? '#10B981' : '#E2E8F0'}
                                strokeDasharray={tVal === 1.5 ? '4 4' : undefined}
                              />
                              <text
                                x={padL - 8}
                                y={y + 4}
                                textAnchor="end"
                                className="text-[10px] fill-slate-500 font-mono-tabular"
                              >
                                +{tVal.toFixed(1)}°C
                              </text>
                            </g>
                          );
                        })}

                        {/* Reference BAU Path */}
                        <path
                          d={bauPath}
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="1.75"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padL + w + 8}
                          y={getY(simulation.bauTemps[simulation.bauTemps.length - 1]) + 4}
                          className="text-[10px] fill-slate-500 font-mono-tabular"
                        >
                          {isEn ? 'Baseline (+2.92°C)' : 'Inaction (+2,92°C)'}
                        </text>

                        {/* Reference Paris 1.5°C Path */}
                        <path
                          d={parisPath}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="1.75"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padL + w + 8}
                          y={getY(simulation.parisTemps[simulation.parisTemps.length - 1]) + 4}
                          className="text-[10px] fill-emerald-700 font-mono-tabular"
                        >
                          {isEn ? 'Net-Zero (+1.48°C)' : 'Net-Zéro (+1,48°C)'}
                        </text>

                        {/* Active Custom Simulated Path */}
                        <path
                          d={customPath}
                          fill="none"
                          stroke="#D97706"
                          strokeWidth="3"
                        />

                        {simulation.customTemps.map((val, idx) => (
                          <g key={simulation.years[idx]}>
                            <circle
                              cx={getX(idx)}
                              cy={getY(val)}
                              r="4"
                              fill="#D97706"
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                            />
                            <text
                              x={getX(idx)}
                              y={padT + h + 20}
                              textAnchor="middle"
                              className="text-[10px] fill-slate-600 font-mono-tabular"
                            >
                              {simulation.years[idx]}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <span>
                {isEn
                  ? 'Amber curve: Your simulated trajectory · Dashed gray: Current unmitigated baseline'
                  : 'Courbe orange : Votre scénario simulé · Pointillés gris : Tendances actuelles sans inflexion'}
              </span>
              <span className="font-mono-tabular">
                {isEn
                  ? 'Climate sensitivity: ~0.45 °C / 1000 GtCO₂'
                  : 'Sensibilité climatique : ~0,45 °C / 1000 GtCO₂'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
