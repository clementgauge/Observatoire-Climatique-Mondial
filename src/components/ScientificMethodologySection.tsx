import React from 'react';
import { Language } from '../data/climateDatasets';
import { ApiChannelStatus } from '../services/climateApiService';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  lang: Language;
  channels?: ApiChannelStatus[];
}

interface ScientificSourceItem {
  id: string;
  institution: string;
  datasetNameFr: string;
  datasetNameEn: string;
  updateFrequencyFr: string;
  updateFrequencyEn: string;
  methodologyFr: string;
  methodologyEn: string;
  officialUrl: string;
  referencePortalLabel: string;
}

const OFFICIAL_SCIENTIFIC_SOURCES: ScientificSourceItem[] = [
  {
    id: 'noaa-gml',
    institution: 'NOAA Global Monitoring Laboratory (GML)',
    datasetNameFr: 'Mauna Loa CO₂ In-Situ Daily & Global Atmospheric Methane (CH₄)',
    datasetNameEn: 'Mauna Loa CO₂ In-Situ Daily & Global Atmospheric Methane (CH₄)',
    updateFrequencyFr: 'Mise à jour quotidienne & mensuelle',
    updateFrequencyEn: 'Daily & monthly updates',
    methodologyFr:
      'Spectroscopie infrarouge non dispersive (NDIR) et spectroscopie par cavité résonnante (CRDS) à 3 397 m d’altitude à l’observatoire de Mauna Loa (Hawaï), mesurant en continu la fraction molaire sèche du CO₂ et du CH₄.',
    methodologyEn:
      'Non-dispersive infrared (NDIR) and Cavity Ring-Down Spectroscopy (CRDS) at 3,397m elevation at the Mauna Loa Observatory (Hawaii), continuously measuring dry-air mole fractions of CO₂ and CH₄.',
    officialUrl: 'https://gml.noaa.gov/ccgg/trends/',
    referencePortalLabel: 'gml.noaa.gov/ccgg/trends'
  },
  {
    id: 'nasa-giss',
    institution: 'NASA Goddard Institute for Space Studies (GISS)',
    datasetNameFr: 'GISTEMP v4 — Surface Temperature Anomaly Analysis',
    datasetNameEn: 'GISTEMP v4 — Surface Temperature Anomaly Analysis',
    updateFrequencyFr: 'Série mensuelle & annuelle (1880–2026)',
    updateFrequencyEn: 'Monthly & annual series (1880–2026)',
    methodologyFr:
      'Combinaison des températures de l’air en surface (réseau GHCN v4 de plus de 26 000 stations météorologiques) et des températures de surface océanique (ERSST v5) recalibrée sur la base pré-industrielle 1850–1900.',
    methodologyEn:
      'Combines land surface air temperatures (GHCN v4 network of 26,000+ meteorological stations) and ocean sea-surface temperatures (ERSST v5) recalibrated to the 1850–1900 pre-industrial baseline.',
    officialUrl: 'https://data.giss.nasa.gov/gistemp/',
    referencePortalLabel: 'data.giss.nasa.gov/gistemp'
  },
  {
    id: 'copernicus-c3s',
    institution: 'Copernicus Climate Change Service (C3S / ECMWF — europa.eu)',
    datasetNameFr: 'Réanalyse Climatique Globale ERA5 & Surveillance Cryosphère',
    datasetNameEn: 'ERA5 Global Climate Reanalysis & Cryosphere Monitoring',
    updateFrequencyFr: 'Observation satellitaire quotidienne (UE)',
    updateFrequencyEn: 'Daily European satellite observation',
    methodologyFr:
      'Assimilation physique de milliards d’observations satellitaires Sentinel et in situ au sein du modèle du Centre Européen pour les Prévisions Météorologiques à Moyen Terme (CEPMMT / ECMWF).',
    methodologyEn:
      'Data assimilation of billions of Sentinel satellite and in-situ observations within the European Centre for Medium-Range Weather Forecasts (ECMWF) global physical model.',
    officialUrl: 'https://climate.copernicus.eu/climate-indicators',
    referencePortalLabel: 'climate.copernicus.eu'
  },
  {
    id: 'europa-edgar-eea',
    institution: 'Commission Européenne (JRC EDGAR & EEA — europa.eu)',
    datasetNameFr: 'Emissions Database for Global Atmospheric Research & European Climate Risk Assessment',
    datasetNameEn: 'Emissions Database for Global Atmospheric Research & European Climate Risk Assessment',
    updateFrequencyFr: 'Inventaires officiels UE-27 & Base mondiale par pays',
    updateFrequencyEn: 'Official EU-27 inventories & Country-by-country global database',
    methodologyFr:
      'Base de données officielle du Centre Commun de Recherche (JRC) de la Commission Européenne et de l’Agence Européenne pour l’Environnement (eea.europa.eu) traçant les émissions anthropiques par secteur et par pays depuis 1970.',
    methodologyEn:
      'Official Joint Research Centre (JRC) and European Environment Agency (eea.europa.eu) inventory tracking anthropogenic GHG emissions by sector and country since 1970.',
    officialUrl: 'https://edgar.jrc.ec.europa.eu/',
    referencePortalLabel: 'edgar.jrc.ec.europa.eu · eea.europa.eu'
  },
  {
    id: 'wwf-france',
    institution: 'WWF France & Zoological Society of London (ZSL)',
    datasetNameFr: 'Rapport Planète Vivante (Indice Planète Vivante IPV) & Fronts de Déforestation',
    datasetNameEn: 'Living Planet Report (Living Planet Index LPI) & Deforestation Fronts',
    updateFrequencyFr: 'Suivi de 35 000 populations de 5 495 espèces',
    updateFrequencyEn: 'Tracking 35,000 populations across 5,495 species',
    methodologyFr:
      'Évaluation scientifique de l’état de la biodiversité mondiale (-73 % entre 1970 et 2020), des 24 fronts majeurs de déforestation tropicale (Amazonie, Bassin du Congo, Bornéo) et des programmes de conservation de la faune.',
    methodologyEn:
      'Empirical assessment of global vertebrate biodiversity (-73% between 1970 and 2020), 24 tropical deforestation fronts (Amazon, Congo Basin, Borneo), and endangered wildlife conservation programs.',
    officialUrl: 'https://www.wwf.fr/champs-daction/climat-energie',
    referencePortalLabel: 'wwf.fr · livingplanetindex.org'
  },
  {
    id: 'ipcc-ar6',
    institution: 'GIEC / IPCC (Groupe d’experts intergouvernemental sur l’évolution du climat)',
    datasetNameFr: 'Sixième Rapport d’Évaluation (AR6 WG1 & WG3) & Budget Carbone',
    datasetNameEn: 'Sixth Assessment Report (AR6 WG1 & WG3) & Carbon Budget',
    updateFrequencyFr: 'Synthèse scientifique internationale de référence',
    updateFrequencyEn: 'International benchmark scientific assessment',
    methodologyFr:
      'Nomenclature officielle des émissions anthropiques mondiales (59,1 GtCO₂eq/an) pondérées par le Potentiel de Réchauffement Global à 100 ans (PRG-100) et réponse climatique transitoire aux émissions cumulées (TCRE ~0,45 °C / 1000 GtCO₂).',
    methodologyEn:
      'Official sectoral accounting of global anthropogenic GHG emissions (59.1 GtCO₂eq/yr) weighted by 100-year Global Warming Potential (GWP-100) and Transient Climate Response to Cumulative Emissions (TCRE ~0.45 °C / 1000 GtCO₂).',
    officialUrl: 'https://www.ipcc.ch/report/ar6/wg3/',
    referencePortalLabel: 'ipcc.ch/report/ar6'
  },
  {
    id: 'global-carbon-project',
    institution: 'Global Carbon Project & Banque Mondiale (World Bank Data)',
    datasetNameFr: 'Global Carbon Budget & Indicateurs Énergétiques et Forestiers Nationaux',
    datasetNameEn: 'Global Carbon Budget & National Energy and Forest Indicators',
    updateFrequencyFr: 'Actualisation continue des séries nationales',
    updateFrequencyEn: 'Continuous national time-series updates',
    methodologyFr:
      'Comptabilité des émissions territoriales de CO₂ fossile, des changements d’affectation des terres (LULUCF), de la dette cumulative depuis 1850, de la part d’énergies renouvelables et de la couverture forestière par pays.',
    methodologyEn:
      'Territorial fossil CO₂ accounting, land-use change fluxes (LULUCF), cumulative historical emissions since 1850, renewable energy share, and forest cover by country.',
    officialUrl: 'https://globalcarbonbudget.org/',
    referencePortalLabel: 'globalcarbonbudget.org · data.worldbank.org'
  },
  {
    id: 'cams-wmo',
    institution: 'Réseau Météorologique Mondial (NOAA GFS / Météo-France / CAMS)',
    datasetNameFr: 'Observations Météorologiques & Aérosols Troposphériques en Temps Réel',
    datasetNameEn: 'Real-Time Meteorological & Tropospheric Aerosol Observations',
    updateFrequencyFr: 'Actualisation horaire continue',
    updateFrequencyEn: 'Continuous hourly updates',
    methodologyFr:
      'Assimilation des modèles météorologiques nationaux (NOAA GFS, DWD ICON, Météo-France ARPEGE) et du réseau européen Copernicus Atmosphere Monitoring Service (CAMS) pour le suivi horaire des températures et des particules PM2.5, PM10, CO, NO₂ et O₃.',
    methodologyEn:
      'Assimilation of national weather models (NOAA GFS, DWD ICON, Météo-France ARPEGE) and the European Copernicus Atmosphere Monitoring Service (CAMS) for hourly temperature and PM2.5, PM10, CO, NO₂, and O₃ tracking.',
    officialUrl: 'https://atmosphere.copernicus.eu/',
    referencePortalLabel: 'atmosphere.copernicus.eu'
  }
];

export const ScientificMethodologySection: React.FC<Props> = ({ lang }) => {
  const isEn = lang === 'en';

  return (
    <section
      id="sources-scientifiques"
      className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-[#F8FAFC]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {isEn
                  ? '07. Scientific Provenance, Methodology & Institutional Sources'
                  : '07. Provenance Scientifique, Méthodologie & Sources Institutionnelles'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Where does the data come from? Institutional sources and empirical protocols'
                : 'D’où proviennent les données ? Sources institutionnelles et protocoles de mesure'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Scientific rigor requires complete transparency. Every metric, historical time-series, cartographic layer, and real-time sensor stream on this platform is anchored in peer-reviewed institutional datasets (NOAA, NASA GISS, Copernicus, European Commission Europa.eu, WWF France, FAO, IPCC, World Bank).'
                : 'La rigueur scientifique exige une transparence totale sur l’origine des mesures. Chaque indicateur, carte interactive, série historique et mesure en temps réel affiché sur cette plateforme provient d’institutions scientifiques de référence (NOAA, NASA GISS, Copernicus, Commission Européenne Europa.eu, WWF France, FAO, GIEC, Banque Mondiale).'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 px-4 py-3 text-xs text-slate-600 self-start lg:self-auto">
            <div className="font-semibold text-slate-900">
              {isEn ? 'Pre-Industrial Baseline Reference' : 'Référentiel Pré-Industriel Standard'}
            </div>
            <div className="font-mono-tabular text-slate-500 mt-0.5">
              {isEn
                ? '1850–1900 Mean · CO₂: 280 ppm · CH₄: 722 ppb'
                : 'Moyenne 1850–1900 · CO₂ : 280 ppm · CH₄ : 722 ppb'}
            </div>
          </div>
        </div>

        {/* 8 Institutional Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {OFFICIAL_SCIENTIFIC_SOURCES.map((src, index) => (
            <article
              key={src.id}
              className="bg-white border border-slate-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span className="font-mono-tabular font-semibold text-slate-700">
                    SOURCE 0{index + 1}
                  </span>
                  <span className="font-mono-tabular text-emerald-700 text-[11px] truncate">
                    {isEn ? src.updateFrequencyEn : src.updateFrequencyFr}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mt-3 leading-snug">
                  {src.institution}
                </h3>

                <div className="text-xs font-mono-tabular text-amber-700 mt-1">
                  {isEn ? src.datasetNameEn : src.datasetNameFr}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3">
                  {isEn ? src.methodologyEn : src.methodologyFr}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="text-[10px] font-mono-tabular text-slate-400 truncate" title={src.referencePortalLabel}>
                  {src.referencePortalLabel}
                </div>
                <a
                  href={src.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                >
                  <span>
                    {isEn
                      ? 'Verify official institutional source'
                      : 'Consulter la source officielle'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
