import React, { useState } from 'react';
import { Language } from '../data/climateDatasets';
import {
  Trees,
  ShieldCheck,
  Landmark,
  Globe2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface Props {
  lang: Language;
}

interface DeforestationFront {
  id: string;
  nameFr: string;
  nameEn: string;
  locationFr: string;
  locationEn: string;
  annualLossMha: number;
  carbonStockGt: number;
  primaryCausesFr: string;
  primaryCausesEn: string;
  wwfActionFr: string;
  wwfActionEn: string;
  color: string;
}

const DEFORESTATION_FRONTS: DeforestationFront[] = [
  {
    id: 'amazon-cerrado',
    nameFr: 'Amazonie & Savane du Cerrado',
    nameEn: 'Amazon Basin & Cerrado Savannah',
    locationFr: 'Amérique du Sud (Brésil, Bolivie, Pérou, Colombie)',
    locationEn: 'South America (Brazil, Bolivia, Peru, Colombia)',
    annualLossMha: 1.95,
    carbonStockGt: 120,
    primaryCausesFr:
      'Conversion en pâturages bovins extensifs (80 %) et monocultures industrielles de soja pour l’alimentation animale mondiale.',
    primaryCausesEn:
      'Conversion into extensive cattle ranching (80%) and industrial soy monocultures for global livestock feed.',
    wwfActionFr:
      'Programme ARPA (62 millions d’hectares d’aires protégées), lutte contre l’orpaillage illégal en Guyane et application du règlement européen EUDR (Zéro Déforestation Importée).',
    wwfActionEn:
      'ARPA Program (62 million hectares of protected areas), combating illegal gold mining in French Guiana, and enforcing the EU Deforestation Regulation (EUDR).',
    color: '#059669'
  },
  {
    id: 'congo-basin',
    nameFr: 'Bassin du Congo & Tourbières de la Cuvette Centrale',
    nameEn: 'Congo Basin & Cuvette Centrale Peatlands',
    locationFr: 'Afrique Centrale (RDC, République du Congo, Gabon, Cameroun)',
    locationEn: 'Central Africa (DRC, Republic of Congo, Gabon, Cameroon)',
    annualLossMha: 0.82,
    carbonStockGt: 60,
    primaryCausesFr:
      'Agriculture sur brûlis de subsistance, production de charbon de bois (makala) faute d’accès à l’électricité et exploitation forestière illégale.',
    primaryCausesEn:
      'Slash-and-burn subsistence agriculture, wood-charcoal production due to energy poverty, and illegal logging.',
    wwfActionFr:
      'Certification FSC des concessions forestières, création d’aires protégées transfrontalières (TRIDOM) pour les éléphants de forêt et les gorilles, et foyers de cuisson améliorés.',
    wwfActionEn:
      'FSC sustainable forestry certification, transboundary protected corridors (TRIDOM) for forest elephants and gorillas, and clean cooking initiatives.',
    color: '#D97706'
  },
  {
    id: 'borneo-sumatra',
    nameFr: 'Bornéo, Sumatra & Nouvelle-Guinée',
    nameEn: 'Borneo, Sumatra & New Guinea',
    locationFr: 'Asie du Sud-Est (Indonésie, Malaisie, Papouasie)',
    locationEn: 'Southeast Asia (Indonesia, Malaysia, Papua)',
    annualLossMha: 0.68,
    carbonStockGt: 45,
    primaryCausesFr:
      'Plantations industrielles de palmiers à huile, pâte à papier (acacia) et drainage des tourbières tropicales riches en méthane et carbone.',
    primaryCausesEn:
      'Industrial oil palm plantations, pulpwood monocultures, and drainage of carbon-rich tropical peatlands.',
    wwfActionFr:
      'Réhydratation des tourbières asséchées, table ronde RSPO sur l’huile de palme durable et sanctuarisation de l’habitat des orangs-outans et tigres de Sumatra.',
    wwfActionEn:
      'Rewetting drained peatlands, RSPO sustainable palm oil standards, and protecting critical habitats for Bornean orangutans and Sumatran tigers.',
    color: '#E11D48'
  },
  {
    id: 'gran-chaco',
    nameFr: 'Gran Chaco & Pantanal',
    nameEn: 'Gran Chaco & Pantanal Wetlands',
    locationFr: 'Argentine, Paraguay, Bolivie & Brésil',
    locationEn: 'Argentina, Paraguay, Bolivia & Brazil',
    annualLossMha: 0.65,
    carbonStockGt: 25,
    primaryCausesFr:
      'Défrichement mécanique rapide de la plus grande forêt sèche d’Amérique du Sud pour le bétail et le soja, aggravé par des mégafeux.',
    primaryCausesEn:
      'Rapid mechanical clearing of South America’s largest dry forest for cattle and soy, compounded by severe drought megafires.',
    wwfActionFr:
      'Restauration des corridors écologiques du jaguar, brigades anti-incendies communautaires et traçabilité bancaire/financière des chaînes du cuir et du soja.',
    wwfActionEn:
      'Restoration of jaguar ecological corridors, community wildfire brigades, and financial traceability across leather and soy supply chains.',
    color: '#0284C7'
  }
];

interface WildlifeProgram {
  speciesFr: string;
  speciesEn: string;
  biomeFr: string;
  biomeEn: string;
  climateThreatFr: string;
  climateThreatEn: string;
  wwfInterventionFr: string;
  wwfInterventionEn: string;
  keyMetricFr: string;
  keyMetricEn: string;
}

const WWF_WILDLIFE_PROGRAMS: WildlifeProgram[] = [
  {
    speciesFr: 'Grands Cétacés & Posidonies de Méditerranée',
    speciesEn: 'Mediterranean Whales & Posidonia Meadows',
    biomeFr: 'Sanctuaire Pelagos (France, Italie, Monaco)',
    biomeEn: 'Pelagos Sanctuary (France, Italy, Monaco)',
    climateThreatFr:
      'Canicules marines (+2 à +3 °C en été), acidification marine, collisions maritimes et destruction des herbiers de posidonie par le mouillage.',
    climateThreatEn:
      'Marine heatwaves (+2 to +3 °C in summer), ocean acidification, ship strikes, and anchor damage to carbon-storing Posidonia meadows.',
    wwfInterventionFr:
      'Le WWF France déploie des coffres d’amarrage écologique, régule la vitesse des navires dans le Sanctuaire Pelagos et protège les herbiers qui séquestrent 5× plus de carbone par hectare qu’une forêt tropicale.',
    wwfInterventionEn:
      'WWF France deploys ecological mooring buoys, advocates for vessel speed limits in the Pelagos Sanctuary, and protects seagrass meadows that store 5× more carbon per hectare than tropical forests.',
    keyMetricFr: '5× plus de carbone stocké / ha (Carbone Bleu)',
    keyMetricEn: '5× higher carbon sequestration / ha (Blue Carbon)'
  },
  {
    speciesFr: 'Lynx Boréal, Loup & Ours Brun (Grands Carnivores)',
    speciesEn: 'Eurasian Lynx, Wolf & Brown Bear',
    biomeFr: 'Jura, Alpes & Pyrénées (France & Europe)',
    biomeEn: 'Jura, Alps & Pyrenees (France & Europe)',
    climateThreatFr:
      'Fragmentation des forêts montagnardes, recul de l’enneigement alpin et rupture des corridors biologiques empêchant la migration climatique des espèces.',
    climateThreatEn:
      'Mountain forest fragmentation, shrinking alpine snowpack, and severed biological corridors preventing climate-driven species migration.',
    wwfInterventionFr:
      'Restauration de la Trame Verte et Bleue, financement des dispositifs de coexistence pastorale (chiens de protection, parcs électrifiés) et lutte contre le braconnage du lynx dans le massif jurassien.',
    wwfInterventionEn:
      'Restoring green/blue ecological corridors, funding pastoral coexistence measures (livestock guard dogs, electric fencing), and anti-poaching for the Jura lynx.',
    keyMetricFr: '~150 lynx adultes suivis en France',
    keyMetricEn: '~150 adult lynx monitored in France'
  },
  {
    speciesFr: 'Éléphants de Forêt & Gorilles des Plaines',
    speciesEn: 'African Forest Elephants & Lowland Gorillas',
    biomeFr: 'Bassin du Congo (Afrique Centrale)',
    biomeEn: 'Congo Basin (Central Africa)',
    climateThreatFr:
      'La disparition des éléphants de forêt (« jardiniers du climat » qui dispersent les graines des grands arbres à bois dense) réduirait de 7 % la capacité de stockage carbone de la forêt.',
    climateThreatEn:
      'Losing forest elephants ("climate gardeners" that disperse seeds of high-carbon-density trees) would reduce Central African rainforest carbon storage by 7%.',
    wwfInterventionFr:
      'Appui aux écogardes dans les parcs nationaux (Dzanga-Sangha, Ntokou-Pikounda), suivi bioacoustique et valorisation économique des forêts intactes.',
    wwfInterventionEn:
      'Supporting eco-rangers in national parks (Dzanga-Sangha, Ntokou-Pikounda), bioacoustic monitoring, and preserving intact forest landscapes.',
    keyMetricFr: '+7 % de biomasse carbone grâce aux éléphants',
    keyMetricEn: '+7% forest carbon biomass maintained by elephants'
  },
  {
    speciesFr: 'Ours Polaire, Narval & Faune Arctique',
    speciesEn: 'Polar Bear, Narwhal & Arctic Fauna',
    biomeFr: 'Cercle Polaire Arctique (Réchauffement 4×)',
    biomeEn: 'Arctic Circle (4× Warming Amplification)',
    climateThreatFr:
      'Perte de 12,6 % de la banquise arctique de septembre par décennie, raccourcissant la saison de chasse sur glace des ours polaires et exposant les cétacés au trafic maritime.',
    climateThreatEn:
      'Loss of 12.6% of September Arctic sea ice per decade, shortening the ice-hunting season for polar bears and exposing cetaceans to shipping noise.',
    wwfInterventionFr:
      'Cartographie des « Derniers Refuges de Glace » (Last Ice Area), patrouilles polaires communautaires inuites pour prévenir les conflits homme-ours et interdiction du fioul lourd en Arctique.',
    wwfInterventionEn:
      'Mapping the "Last Ice Area" sanctuary, supporting Inuit community polar bear patrols, and enforcing the Arctic heavy fuel oil ban.',
    keyMetricFr: '-12,6 % de banquise estivale / décennie',
    keyMetricEn: '-12.6% summer sea ice / decade'
  }
];

interface PolicyAction {
  scale: 'FRANCE' | 'EUROPE' | 'MONDE';
  titleFr: string;
  titleEn: string;
  targetFr: string;
  targetEn: string;
  measuresFr: string[];
  measuresEn: string[];
  progressMetricFr: string;
  progressMetricEn: string;
  officialUrl: string;
}

const CLIMATE_POLICY_ACTIONS: PolicyAction[] = [
  {
    scale: 'FRANCE',
    titleFr: 'France — Stratégie Nationale Bas-Carbone (SNBC 3) & Planification Écologique',
    titleEn: 'France — National Low-Carbon Strategy (SNBC 3) & Ecological Planning',
    targetFr: '-50 % d’émissions brutes en 2030 (vs 1990) & Neutralité Carbone en 2050',
    targetEn: '-50% gross GHG emissions by 2030 (vs 1990) & Net-Zero Carbon by 2050',
    measuresFr: [
      'Sortie définitive du fioul et accélération des pompes à chaleur (MaPrimeRénov’) et réseaux de chaleur géothermiques.',
      'Électricité déjà décarbonée à plus de 92 % (nucléaire + hydraulique + essor éolien en mer et photovoltaïque) permettant d’électrifier l’industrie (50 sites les plus émetteurs).',
      'Stratégie Nationale pour la Biodiversité 2030 : 30 % d’aires terrestres et maritimes protégées (dont 10 % sous protection forte) et objectif « Zéro Artificialisation Nette » (ZAN) des sols en 2050.'
    ],
    measuresEn: [
      'Phase-out of oil boilers, accelerated heat-pump subsidies (MaPrimeRénov’), and deep geothermal district heating.',
      'Power grid already >92% low-carbon (nuclear + hydro + expanding offshore wind and solar), enabling rapid electrification of the 50 largest industrial sites.',
      'National Biodiversity Strategy 2030: 30% protected land and marine areas (10% under strict protection) and "Zero Net Land Artificialization" (ZAN) by 2050.'
    ],
    progressMetricFr: '304 MtCO₂e en France (-5,8 % en un an · 4,5 t/hab)',
    progressMetricEn: '304 MtCO₂e in France (-5.8% in one year · 4.5 t/cap)',
    officialUrl: 'https://www.ecologie.gouv.fr/strategie-nationale-bas-carbone-snbc'
  },
  {
    scale: 'EUROPE',
    titleFr: 'Union Européenne — Pacte Vert (Green Deal), Fit for 55 & Règlement EUDR',
    titleEn: 'European Union — European Green Deal, Fit for 55 & EUDR Regulation',
    targetFr: '-55 % d’émissions nettes en 2030 (vs 1990) & Continent Climatiquement Neutre en 2050',
    targetEn: '-55% net GHG emissions by 2030 (vs 1990) & Climate-Neutral Continent by 2050',
    measuresFr: [
      'Règlement Européen contre la Déforestation Importée (EUDR) : interdiction de mise sur le marché européen de soja, bœuf, huile de palme, cacao, café, bois et caoutchouc issus de terres déboisées après 2020.',
      'Mécanisme d’Ajustement Carbone aux Frontières (MACF / CBAM) taxant l’acier, le ciment, l’aluminium et l’électricité importés selon leur contenu carbone réel.',
      'Loi Européenne sur la Restauration de la Nature (Nature Restoration Law) imposant la remise en état d’au moins 20 % des terres et espaces marins dégradés de l’UE d’ici 2030.'
    ],
    measuresEn: [
      'EU Deforestation Regulation (EUDR): bans imports of soy, beef, palm oil, cocoa, coffee, timber, and rubber linked to land deforested after 2020.',
      'Carbon Border Adjustment Mechanism (CBAM): applies carbon pricing to imported steel, cement, aluminum, fertilizers, and electricity.',
      'EU Nature Restoration Law: legally binding target to restore at least 20% of degraded EU land and sea ecosystems by 2030.'
    ],
    progressMetricFr: '-32,5 % d’émissions nettes dans l’UE-27 depuis 1990 (eea.europa.eu)',
    progressMetricEn: '-32.5% net GHG emissions across EU-27 since 1990 (eea.europa.eu)',
    officialUrl: 'https://climate.ec.europa.eu/eu-action/european-green-deal_fr'
  },
  {
    scale: 'MONDE',
    titleFr: 'Monde — Accord de Paris, Cadre Kunming-Montréal (30×30) & Traité Haute Mer',
    titleEn: 'Global — Paris Agreement, Kunming-Montreal (30×30) & High Seas Treaty',
    targetFr: 'Limiter le réchauffement à +1,5 °C, Tripler les Renouvelables d’ici 2030 & Protéger 30 % de la Planète',
    targetEn: 'Limit warming to +1.5 °C, Triple Renewables by 2030 & Protect 30% of Land and Oceans',
    measuresFr: [
      'Engagement mondial COP28 : tripler la capacité mondiale d’énergies renouvelables (à 11 000 GW) et doubler les gains d’efficacité énergétique d’ici 2030.',
      'Global Methane Pledge (155 pays) : réduire de 30 % les émissions mondiales de méthane d’ici 2030 (colmatage des fuites pétrogazières et gestion des déchets).',
      'Accord de Kunming-Montréal sur la Biodiversité (COP15) & Traité de l’ONU sur la Haute Mer (BBNJ) : sanctuariser 30 % des terres, des eaux douces et des océans mondiaux d’ici 2030 (objectif 30×30).'
    ],
    measuresEn: [
      'COP28 Global Renewables Pledge: triple global renewable power capacity (to 11,000 GW) and double annual energy efficiency improvements by 2030.',
      'Global Methane Pledge (155 countries): cut global anthropogenic methane emissions by 30% by 2030 across oil/gas and waste sectors.',
      'Kunming-Montreal Global Biodiversity Framework (COP15) & UN High Seas Treaty (BBNJ): conserve 30% of Earth’s land, freshwater, and oceans by 2030 (30×30 target).'
    ],
    progressMetricFr: '+510 GW de solaire & éolien installés par an dans le monde',
    progressMetricEn: '+510 GW of new solar & wind capacity added annually worldwide',
    officialUrl: 'https://unfccc.int/fr/process-and-meetings/the-paris-agreement'
  }
];

export const DeforestationBiodiversityActionsSection: React.FC<Props> = ({ lang }) => {
  const [selectedFrontId, setSelectedFrontId] = useState<string>(DEFORESTATION_FRONTS[0].id);
  const [activePolicyTab, setActivePolicyTab] = useState<'FRANCE' | 'EUROPE' | 'MONDE'>('FRANCE');
  const isEn = lang === 'en';

  const activeFront =
    DEFORESTATION_FRONTS.find((f) => f.id === selectedFrontId) || DEFORESTATION_FRONTS[0];

  const activePolicy =
    CLIMATE_POLICY_ACTIONS.find((p) => p.scale === activePolicyTab) || CLIMATE_POLICY_ACTIONS[0];

  return (
    <section
      id="deforestation-wwf-actions"
      className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-[#F8FAFC]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <Trees className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {isEn
                  ? '05. Beyond CO₂: Global Deforestation, WWF Wildlife Conservation & Climate Policies'
                  : '05. Au-delà du CO₂ : Déforestation Mondiale, Actions du WWF pour la Faune & Politiques Publiques'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Forest Loss, Biodiversity Protection by WWF & Concrete Actions in France, Europe and Worldwide'
                : 'Déforestation mondiale, protection des espèces par le WWF et mesures concrètes en France, en Europe et dans le monde'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Climate disruption is inseparable from the destruction of living ecosystems. Every year, 10 million hectares of forest disappear globally (FAO / WWF). Discover the primary deforestation fronts, how WWF protects endangered species, and the binding policies deployed by France, the European Union, and the international community.'
                : 'Le dérèglement climatique ne se résume pas au CO₂ industriel : chaque année, 10 millions d’hectares de forêts disparaissent dans le monde (FAO / WWF), détruisant des puits de carbone vitaux. Découvrez l’état des fronts de déforestation, les programmes de terrain du WWF pour les animaux et les lois déployées par la France, l’Europe et le monde.'}
            </p>
          </div>

          {/* Key Global Forest & Biodiversity Summary Box */}
          <div className="bg-white border border-slate-200 p-4 flex items-center gap-5 self-start lg:self-auto">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase text-slate-500">
                {isEn ? 'Global Forest Loss (FAO)' : 'Déforestation Mondiale (FAO)'}
              </div>
              <div className="text-2xl font-mono-tabular font-bold text-rose-600 mt-0.5">
                -10,0 M ha / {isEn ? 'yr' : 'an'}
              </div>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div>
              <div className="text-[11px] font-mono-tabular uppercase text-slate-500">
                {isEn ? 'Imported Deforestation Driver' : 'Part liée à l’Agriculture'}
              </div>
              <div className="text-2xl font-mono-tabular font-bold text-amber-700 mt-0.5">
                ~80 %
              </div>
            </div>
          </div>
        </div>

        {/* PART 1: Global Deforestation Fronts Interactive Breakdown */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-xl sm:text-2xl font-display text-slate-900">
              {isEn
                ? 'A. The 4 Major Tropical Deforestation Fronts (WWF Deforestation Fronts Report & FAO)'
                : 'A. Les 4 Grands Fronts Mondiaux de Déforestation Tropicale (Rapport WWF & FAO)'}
            </h3>
            <span className="text-xs font-mono-tabular text-slate-500">
              {isEn
                ? 'Select a forest basin to inspect causes & WWF field interventions'
                : 'Sélectionnez un bassin forestier pour inspecter ses causes et les actions du WWF'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Columns: 4 Forest Basin Cards */}
            <div className="lg:col-span-5 flex flex-col border border-slate-200 bg-white divide-y divide-slate-200">
              {DEFORESTATION_FRONTS.map((front) => {
                const isSelected = front.id === activeFront.id;
                return (
                  <button
                    key={front.id}
                    type="button"
                    onClick={() => setSelectedFrontId(front.id)}
                    className={`w-full text-left p-4 sm:p-5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-mono-tabular ${
                          isSelected ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        {isEn ? front.locationEn : front.locationFr}
                      </span>
                      <span
                        className={`text-xs font-mono-tabular font-bold ${
                          isSelected ? 'text-rose-400' : 'text-rose-600'
                        }`}
                      >
                        -{front.annualLossMha.toFixed(2)} M ha/{isEn ? 'yr' : 'an'}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-semibold mt-1">
                      {isEn ? front.nameEn : front.nameFr}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 7 Columns: Active Deforestation Front Deep Dive */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-mono-tabular text-emerald-700 uppercase">
                      {isEn ? activeFront.locationEn : activeFront.locationFr}
                    </div>
                    <h4 className="text-2xl sm:text-3xl font-display text-slate-900 mt-1">
                      {isEn ? activeFront.nameEn : activeFront.nameFr}
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-mono-tabular font-bold text-slate-900">
                      ~{activeFront.carbonStockGt} Gt
                    </div>
                    <div className="text-xs text-slate-500">
                      {isEn ? 'Biomass & Soil Carbon Stock' : 'Stock de carbone biomasse & sols'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-rose-50/50 border border-rose-200/70">
                    <div className="text-xs font-mono-tabular font-semibold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {isEn
                          ? 'Primary Economic Drivers of Destruction'
                          : 'Causes Économiques Directes de Déforestation'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed mt-2">
                      {isEn ? activeFront.primaryCausesEn : activeFront.primaryCausesFr}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/70">
                    <div className="text-xs font-mono-tabular font-semibold text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>
                        {isEn
                          ? 'Concrete WWF & European Regulation Actions'
                          : 'Actions de Terrain du WWF & Réglementation EUDR'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed mt-2">
                      {isEn ? activeFront.wwfActionEn : activeFront.wwfActionFr}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  {isEn
                    ? 'Source: WWF Deforestation Fronts Report & FAO Global Forest Resources Assessment'
                    : 'Source : Rapport WWF « Deforestation Fronts » & Évaluation des ressources forestières mondiales (FAO)'}
                </span>
                <a
                  href="https://www.wwf.fr/champs-daction/forets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-tabular text-slate-900 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>wwf.fr/forets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: What WWF Does for Wildlife & Ecosystems */}
        <div className="mt-14 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono-tabular text-emerald-700 uppercase">
                {isEn
                  ? 'B. Conservation & Climate Symbiosis — WWF France & International'
                  : 'B. Protection de la Faune Sauvage & Puits de Carbone — Actions du WWF France'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-slate-900 mt-1">
                {isEn
                  ? 'What WWF concretely does to protect wildlife and ecosystems against climate change'
                  : 'Ce que fait concrètement le WWF pour protéger les animaux et les écosystèmes face au climat'}
              </h3>
            </div>
            <a
              href="https://www.wwf.fr/espaces-prioritaires"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono-tabular font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1.5"
            >
              <span>{isEn ? 'Explore WWF Priority Programmes' : 'Voir les programmes prioritaires WWF France'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WWF_WILDLIFE_PROGRAMS.map((prog, i) => (
              <article
                key={i}
                className="bg-white border border-slate-200 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono-tabular text-amber-700 font-semibold">
                    {isEn ? prog.biomeEn : prog.biomeFr}
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 mt-1.5 leading-snug">
                    {isEn ? prog.speciesEn : prog.speciesFr}
                  </h4>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-mono-tabular text-rose-700 font-medium">
                      {isEn ? 'Climate & Habitat Threat:' : 'Menace Climatique & Habitat :'}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {isEn ? prog.climateThreatEn : prog.climateThreatFr}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-mono-tabular text-emerald-700 font-medium">
                      {isEn ? 'WWF Field Action:' : 'Action de Terrain du WWF :'}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      {isEn ? prog.wwfInterventionEn : prog.wwfInterventionFr}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono-tabular font-bold text-slate-900">
                  {isEn ? prog.keyMetricEn : prog.keyMetricFr}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* PART 3: Concrete Climate & Biodiversity Policies in France, Europe & Worldwide */}
        <div className="mt-14 pt-12 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono-tabular text-slate-500 uppercase flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-700" />
                <span>
                  {isEn
                    ? 'C. Institutional Frameworks & Laws Implemented'
                    : 'C. Mesures, Lois et Engagements Mis en Place (France, Europe, Monde)'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-slate-900 mt-1">
                {isEn
                  ? 'What is being implemented by France, the European Union, and the World?'
                  : 'Quelles sont les mesures concrètes mises en place par la France, l’Europe et le Monde ?'}
              </h3>
            </div>

            {/* Scale Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setActivePolicyTab('FRANCE')}
                className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activePolicyTab === 'FRANCE'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? '1. France (SNBC & ZAN)' : '1. France (SNBC & Biodiversité)'}
              </button>
              <button
                type="button"
                onClick={() => setActivePolicyTab('EUROPE')}
                className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activePolicyTab === 'EUROPE'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? '2. Europe (Green Deal & EUDR)' : '2. Union Européenne (Green Deal)'}
              </button>
              <button
                type="button"
                onClick={() => setActivePolicyTab('MONDE')}
                className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activePolicyTab === 'MONDE'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? '3. Global (Paris & 30×30)' : '3. Monde (Accord de Paris & 30×30)'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono-tabular text-amber-700 font-semibold flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4" />
                  <span>
                    {isEn ? 'Binding Target:' : 'Objectif Officiel :'} {isEn ? activePolicy.targetEn : activePolicy.targetFr}
                  </span>
                </div>
                <h4 className="text-2xl lg:text-3xl font-display text-slate-900 mt-1">
                  {isEn ? activePolicy.titleEn : activePolicy.titleFr}
                </h4>
              </div>

              <div className="bg-slate-900 text-white px-4 py-3 text-left lg:text-right shrink-0">
                <div className="text-[11px] font-mono-tabular text-slate-300">
                  {isEn ? 'Verified Empirical Indicator' : 'Indicateur de Suivi Vérifié'}
                </div>
                <div className="text-sm sm:text-base font-mono-tabular font-bold text-emerald-400 mt-0.5">
                  {isEn ? activePolicy.progressMetricEn : activePolicy.progressMetricFr}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {(isEn ? activePolicy.measuresEn : activePolicy.measuresFr).map((measure, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono-tabular font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        {isEn ? `Pillar 0${idx + 1}` : `Pilier Réglementaire 0${idx + 1}`}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {measure}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {isEn
                  ? 'Official legislative and institutional source'
                  : 'Source institutionnelle et législative officielle'}
              </span>
              <a
                href={activePolicy.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tabular font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
              >
                <span>{activePolicy.officialUrl}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
