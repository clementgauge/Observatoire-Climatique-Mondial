import React, { useState } from 'react';
import { Language } from '../data/climateDatasets';
import { ExternalLink, ShieldAlert, TrendingDown, Flame } from 'lucide-react';

interface Props {
  lang: Language;
}

interface EeaDecarbSector {
  sectorFr: string;
  sectorEn: string;
  reductionSince1990Percent: number;
  currentShareEuPercent: number;
  statusFr: string;
  statusEn: string;
  color: string;
}

// Verified European Environment Agency (eea.europa.eu) & EDGAR JRC (europa.eu) EU-27 sectoral trends
const EEA_EU27_SECTORS: EeaDecarbSector[] = [
  {
    sectorFr: 'Industrie Énergétique & Centrales Électriques (EU ETS)',
    sectorEn: 'Energy Supply & Power Plants (EU ETS)',
    reductionSince1990Percent: -49.2,
    currentShareEuPercent: 26.4,
    statusFr: 'Forte baisse grâce à la sortie accélérée du charbon et l’essor éolien/solaire dans l’UE.',
    statusEn: 'Sharp decline driven by coal phase-out and rapid wind/solar expansion across the EU-27.',
    color: '#059669'
  },
  {
    sectorFr: 'Industrie Manufacturière & Procédés Lourds',
    sectorEn: 'Manufacturing & Heavy Industrial Processes',
    reductionSince1990Percent: -38.4,
    currentShareEuPercent: 20.8,
    statusFr: 'Gains d’efficacité énergétique et quotas carbone européens (SEQE-UE).',
    statusEn: 'Energy efficiency gains and European Emissions Trading System (EU ETS) pricing.',
    color: '#0284C7'
  },
  {
    sectorFr: 'Bâtiments Résidentiels & Tertiaires (Chauffage)',
    sectorEn: 'Residential & Commercial Buildings (Heating)',
    reductionSince1990Percent: -34.1,
    currentShareEuPercent: 12.5,
    statusFr: 'Rénovation thermique et déploiement des pompes à chaleur électriques.',
    statusEn: 'Building envelope retrofits and accelerated heat-pump deployment.',
    color: '#0F172A'
  },
  {
    sectorFr: 'Agriculture & Élevage Européen',
    sectorEn: 'European Agriculture & Livestock',
    reductionSince1990Percent: -21.6,
    currentShareEuPercent: 11.4,
    statusFr: 'Stagnation relative depuis 2005 (méthane entérique CH₄ et engrais azotés N₂O).',
    statusEn: 'Relative stagnation since 2005 (enteric methane CH₄ and nitrogenous fertilizers N₂O).',
    color: '#D97706'
  },
  {
    sectorFr: 'Transports Routiers & Aériens Internes',
    sectorEn: 'Domestic Road & Aviation Transport',
    reductionSince1990Percent: +18.4,
    currentShareEuPercent: 28.9,
    statusFr: 'Seul grand secteur en hausse nette (+18,4 % vs 1990) sous l’effet du fret routier et du trafic aérien.',
    statusEn: 'Only major sector with net growth (+18.4% vs 1990) due to road freight volume and aviation.',
    color: '#E11D48'
  }
];

interface WwfLpiRegion {
  regionFr: string;
  regionEn: string;
  declinePercent: number;
  climateDriverFr: string;
  climateDriverEn: string;
  earthOvershootFranceDate: string;
}

// Verified WWF France / Living Planet Report (Indice Planète Vivante 1970-2020)
const WWF_LPI_REGIONS: WwfLpiRegion[] = [
  {
    regionFr: 'Amérique Latine & Caraïbes (Amazonie, Andes, Cerrado)',
    regionEn: 'Latin America & Caribbean (Amazon, Andes, Cerrado)',
    declinePercent: 95,
    climateDriverFr: 'Conversion des forêts tropicales, stress thermique hydrique et fragmentation des corridors.',
    climateDriverEn: 'Tropical forest conversion, hydrological thermal stress, and habitat fragmentation.',
    earthOvershootFranceDate: '7 Mai'
  },
  {
    regionFr: 'Écosystèmes d’Eau Douce Mondiaux (Rivières, Lacs & Zones Humides)',
    regionEn: 'Global Freshwater Ecosystems (Rivers, Lakes & Wetlands)',
    declinePercent: 85,
    climateDriverFr: 'Assèchement estival, réchauffement des eaux douces (baisse d’oxygène dissous) et barrages.',
    climateDriverEn: 'Summer droughts, freshwater warming (dissolved oxygen depletion), and dam fragmentation.',
    earthOvershootFranceDate: '7 Mai'
  },
  {
    regionFr: 'Afrique Subsaharienne & Bassin du Congo',
    regionEn: 'Sub-Saharan Africa & Congo Basin',
    declinePercent: 76,
    climateDriverFr: 'Sécheresses récurrentes dans la bande sahélienne et pression sur les forêts humides.',
    climateDriverEn: 'Recurrent droughts across the Sahelian belt and deforestation pressure on moist forests.',
    earthOvershootFranceDate: '7 Mai'
  },
  {
    regionFr: 'Asie-Pacifique & Triangle de Corail',
    regionEn: 'Asia-Pacific & Coral Triangle',
    declinePercent: 60,
    climateDriverFr: 'Vagues de chaleur marines, blanchissement des récifs coralliens et perte des mangroves.',
    climateDriverEn: 'Marine heatwaves, mass coral reef bleaching, and coastal mangrove deforestation.',
    earthOvershootFranceDate: '7 Mai'
  },
  {
    regionFr: 'Moyenne Mondiale Globale (35 000 populations suivies)',
    regionEn: 'Global Average (35,000 monitored vertebrate populations)',
    declinePercent: 73,
    climateDriverFr: 'Cumul du changement d’usage des terres et de l’accélération du réchauffement (+1,52 °C).',
    climateDriverEn: 'Combined impact of land-use change and accelerating anthropogenic warming (+1.52 °C).',
    earthOvershootFranceDate: '7 Mai'
  }
];

export const PlanetaryBoundariesRadarSection: React.FC<Props> = ({ lang }) => {
  const [selectedBoundaryIdx, setSelectedBoundaryIdx] = useState<number>(0);
  const isEn = lang === 'en';

  const boundaries = [
    {
      nameFr: '1. Changement Climatique (CO₂)',
      nameEn: '1. Climate Change (CO₂)',
      safeLimit: '350 ppm',
      currentValue: '426,4 ppm',
      transgressionScore: 95,
      detailFr: 'Limite de sécurité fixée à 350 ppm et +1,0 W/m². Actuellement à 426,4 ppm et +2,91 W/m² (Zone à haut risque).',
      detailEn: 'Safe boundary set at 350 ppm and +1.0 W/m². Currently at 426.4 ppm and +2.91 W/m² (High-risk zone).'
    },
    {
      nameFr: '2. Intégrité de la Biosphère (WWF IPV)',
      nameEn: '2. Biosphere Integrity (WWF LPI)',
      safeLimit: '< 10 E/MSY',
      currentValue: '-73 % IPV',
      transgressionScore: 98,
      detailFr: 'Taux d’extinction 10 à 100 fois supérieur à la normale géologique et déclin de 73 % des populations de vertébrés (WWF France).',
      detailEn: 'Extinction rate 10–100× above geological background and 73% decline in vertebrate populations (WWF Living Planet).'
    },
    {
      nameFr: '3. Cycles Azote & Phosphore (N₂O)',
      nameEn: '3. Biogeochemical Flows (N & P)',
      safeLimit: '62 Tg N/an',
      currentValue: '190 Tg N/an',
      transgressionScore: 92,
      detailFr: 'Surutilisation mondiale d’engrais synthétiques provoquant des émissions de protoxyde d’azote (N₂O) et l’eutrophisation côtière.',
      detailEn: 'Global overapplication of synthetic fertilizers driving nitrous oxide (N₂O) emissions and coastal eutrophication.'
    },
    {
      nameFr: '4. Changement d’Usage des Sols (Forêts)',
      nameEn: '4. Land-System Change (Forests)',
      safeLimit: '75 % forêts',
      currentValue: '60 % restant',
      transgressionScore: 78,
      detailFr: 'Déforestation tropicale en Amazonie, au Congo et en Asie du Sud-Est réduisant la capacité de puits de carbone terrestre.',
      detailEn: 'Tropical deforestation across Amazonia, Congo, and Southeast Asia eroding terrestrial carbon sink capacity.'
    },
    {
      nameFr: '5. Cycle de l’Eau Douce (Sécheresses)',
      nameEn: '5. Freshwater Change (Hydrology)',
      safeLimit: 'Seuil Holocène',
      currentValue: 'Franchi (Eau verte)',
      transgressionScore: 74,
      detailFr: 'Perturbation majeure de l’humidité des sols (« eau verte ») et des débits fluviaux sous l’effet de l’évapotranspiration.',
      detailEn: 'Severe disruption of root-zone soil moisture ("green water") and river streamflow due to warming-driven evapotranspiration.'
    },
    {
      nameFr: '6. Acidification des Océans (pH Marin)',
      nameEn: '6. Ocean Acidification (Marine pH)',
      safeLimit: 'Ω aragonite ≥ 2,75',
      currentValue: 'Ω ≈ 2,80 (Seuil critique)',
      transgressionScore: 66,
      detailFr: 'L’océan absorbe ~25 % du CO₂ anthropique émis, formant de l’acide carbonique qui réduit le pH marin de 0,1 unité (+30 % d’acidité).',
      detailEn: 'Oceans absorb ~25% of anthropogenic CO₂, forming carbonic acid and increasing surface ocean acidity by ~30%.'
    }
  ];

  const activeBoundary = boundaries[selectedBoundaryIdx];

  return (
    <section
      id="analyse-europa-wwf"
      className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-white"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {isEn
                  ? 'European & Ecological Analytics — Europa.eu (EEA / EDGAR) & WWF France'
                  : 'Analyses Européennes & Écologiques — Europa.eu (EEA / EDGAR) & WWF France'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'European Decarbonization Trajectory, Planetary Boundaries & WWF Living Planet Index'
                : 'Trajectoire Européenne (Europa.eu), Limites Planétaires & Indice Planète Vivante (WWF)'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Cross-referencing physical atmospheric warming with European Environment Agency (eea.europa.eu) sectoral inventories and WWF France biodiversity indicators reveals how climate change and biosphere degradation reinforce each other.'
                : 'Croiser le réchauffement physique de l’atmosphère avec les inventaires officiels de l’Union Européenne (eea.europa.eu / EDGAR) et les rapports du WWF France permet de visualiser l’interaction directe entre émissions de GES et effondrement de la biodiversité.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular self-start lg:self-auto">
            <a
              href="https://www.eea.europa.eu/en/topics/in-depth/climate-change-impacts-risks-and-adaptation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>EEA Europa.eu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.wwf.fr/rapport-planete-vivante"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>WWF France (IPV)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Two-Column Analytics Grid: Left EEA Europa.eu Chart + Right WWF France Living Planet Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left 6 Columns: EEA / Europa.eu Sectoral Divergence (1990 vs Current) */}
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-mono-tabular text-amber-700 uppercase">
                    Source : Agence Européenne pour l’Environnement (eea.europa.eu)
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display text-slate-900 mt-1">
                    {isEn
                      ? 'EU-27 Sectoral Emission Shifts Since 1990 (-32.5% Total Net)'
                      : 'Évolution Sectorielle des Émissions UE-27 depuis 1990 (-32,5 % net)'}
                  </h3>
                </div>
                <Flame className="w-5 h-5 text-amber-600 shrink-0" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                {isEn
                  ? 'According to official European Union inventories (EDGAR / EEA), while electricity generation and heavy industry have cut emissions sharply since 1990, transport has grown by +18.4%, becoming Europe’s #1 emission source.'
                  : 'Selon les inventaires officiels de l’Union Européenne (EDGAR / EEA europa.eu), si l’électricité (-49,2 %) et l’industrie (-38,4 %) ont fortement réduit leurs émissions depuis 1990, les transports (+18,4 %) sont devenus le 1er poste d’émission européen.'}
              </p>

              {/* Diverging Horizontal Bar Chart */}
              <div className="mt-6 space-y-4">
                {EEA_EU27_SECTORS.map((item) => {
                  const isPositive = item.reductionSince1990Percent > 0;
                  const barWidth = Math.min(100, Math.abs(item.reductionSince1990Percent) * 1.8);
                  return (
                    <div
                      key={item.sectorFr}
                      className="bg-white border border-slate-200 p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="font-semibold text-slate-900">
                          {isEn ? item.sectorEn : item.sectorFr}
                        </span>
                        <span
                          className={`font-mono-tabular font-bold shrink-0 ${
                            isPositive ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {isPositive
                            ? `+${item.reductionSince1990Percent.toFixed(1)}%`
                            : `${item.reductionSince1990Percent.toFixed(1)}%`}{' '}
                          vs 1990
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 mt-2 overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-slate-500">
                        <span>{isEn ? item.statusEn : item.statusFr}</span>
                        <span className="font-mono-tabular text-slate-700 font-medium">
                          {isEn ? 'Current EU Share:' : 'Part UE actuelle :'}{' '}
                          {item.currentShareEuPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                {isEn
                  ? 'Target Fit for 55 (Europa.eu): -55% net GHG by 2030 vs 1990'
                  : 'Objectif Pacte Vert Européen (Fit for 55) : -55 % de GES nets d’ici 2030'}
              </span>
              <a
                href="https://edgar.jrc.ec.europa.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tabular text-slate-800 hover:underline inline-flex items-center gap-1"
              >
                <span>edgar.jrc.ec.europa.eu</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right 6 Columns: WWF France Living Planet Index & Planetary Boundaries */}
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-mono-tabular text-rose-700 uppercase">
                    Source : WWF France (Rapport Planète Vivante) & Stockholm Resilience Centre
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display text-slate-900 mt-1">
                    {isEn
                      ? 'WWF Living Planet Index (-73% Global Wildlife Decline 1970–2020)'
                      : 'Indice Planète Vivante WWF (-73 % des Populations de Vertébrés 1970–2020)'}
                  </h3>
                </div>
                <TrendingDown className="w-5 h-5 text-rose-600 shrink-0" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                {isEn
                  ? 'The WWF Living Planet Report tracks almost 35,000 vertebrate populations across the globe. Climate warming and agricultural deforestation have triggered an average 73% collapse in 50 years, reaching -95% in Latin America.'
                  : 'Le Rapport Planète Vivante du WWF France suit près de 35 000 populations de vertébrés dans le monde. Le couplage entre destruction des habitats (déforestation agricole) et réchauffement climatique a provoqué une chute moyenne de 73 % en 50 ans.'}
              </p>

              {/* WWF Regional Decline Bars */}
              <div className="mt-6 space-y-3">
                {WWF_LPI_REGIONS.map((reg) => (
                  <div key={reg.regionFr} className="bg-white border border-slate-200 p-3.5">
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="font-semibold text-slate-900">
                        {isEn ? reg.regionEn : reg.regionFr}
                      </span>
                      <span className="font-mono-tabular font-bold text-rose-600 shrink-0">
                        -{reg.declinePercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-rose-600"
                        style={{ width: `${reg.declinePercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      {isEn ? reg.climateDriverEn : reg.climateDriverFr}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive 6 Planetary Boundaries Selector */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-900 mb-2">
                  {isEn
                    ? '6 Transgressed Planetary Boundaries (click to inspect threshold):'
                    : 'Les 6 Limites Planétaires Franchies (cliquez pour inspecter le seuil) :'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {boundaries.map((b, idx) => (
                    <button
                      key={b.nameFr}
                      type="button"
                      onClick={() => setSelectedBoundaryIdx(idx)}
                      className={`p-2.5 text-left border text-xs transition-colors cursor-pointer ${
                        selectedBoundaryIdx === idx
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold truncate">
                        {isEn ? b.nameEn : b.nameFr}
                      </div>
                      <div
                        className={`font-mono-tabular text-[11px] mt-0.5 ${
                          selectedBoundaryIdx === idx ? 'text-amber-400' : 'text-rose-600'
                        }`}
                      >
                        {b.currentValue}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-white border border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-mono-tabular text-[11px] text-slate-500 mb-1">
                    <span>
                      {isEn ? 'Safe Holocene Boundary:' : 'Limite de sécurité Holocène :'}{' '}
                      <strong>{activeBoundary.safeLimit}</strong>
                    </span>
                    <span className="text-rose-600 font-bold">
                      {isEn ? 'Current:' : 'Actuel :'} {activeBoundary.currentValue}
                    </span>
                  </div>
                  <p>{isEn ? activeBoundary.detailEn : activeBoundary.detailFr}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                {isEn
                  ? 'France Overshoot Day (WWF): ~2.9 Earths required if everyone lived like France'
                  : 'Jour du Dépassement (WWF France) : ~2,9 planètes nécessaires au rythme de consommation français'}
              </span>
              <a
                href="https://www.wwf.fr/champs-daction/climat-energie"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tabular text-slate-800 hover:underline inline-flex items-center gap-1"
              >
                <span>wwf.fr</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
