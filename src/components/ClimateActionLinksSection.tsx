import React, { useState } from 'react';
import {
  HeartHandshake,
  Trees,
  ExternalLink,
  Calculator,
  Waves,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface ClimateActionItem {
  id: string;
  category: 'donate' | 'trees' | 'footprint' | 'oceans';
  badgeFr: string;
  badgeEn: string;
  titleFr: string;
  titleEn: string;
  org: string;
  descriptionFr: string;
  descriptionEn: string;
  impactFr: string;
  impactEn: string;
  ctaFr: string;
  ctaEn: string;
  url: string;
  accentColor: 'emerald' | 'amber' | 'sky' | 'rose';
}

const CLIMATE_ACTIONS: ClimateActionItem[] = [
  {
    id: 'wwf-france-don',
    category: 'donate',
    badgeFr: 'Don & Protection de la Faune (66 % déductible)',
    badgeEn: 'Wildlife & Forest Donation',
    titleFr: 'Faire un don au WWF France',
    titleEn: 'Donate to WWF France',
    org: 'WWF France (Fonds Mondial pour la Nature)',
    descriptionFr:
      'Soutenez directement les programmes de terrain du WWF contre la déforestation en Amazonie et au Bassin du Congo, la protection des espèces menacées (Indice Planète Vivante -73 %) et la préservation du Sanctuaire Pelagos en Méditerranée.',
    descriptionEn:
      'Directly fund WWF field operations against tropical deforestation in the Amazon and Congo Basin, endangered wildlife conservation, and Mediterranean marine sanctuaries.',
    impactFr: '66 % du don déductible des impôts en France · Lutte terrain contre la déforestation',
    impactEn: 'Direct conservation funding · Anti-deforestation & endangered species protection',
    ctaFr: 'Faire un don sur wwf.fr',
    ctaEn: 'Donate on wwf.fr',
    url: 'https://faireundon.wwf.fr/',
    accentColor: 'emerald',
  },
  {
    id: 'reforestaction-arbres',
    category: 'trees',
    badgeFr: 'Planter des Arbres & Puits de Carbone',
    badgeEn: 'Plant Trees & Carbon Sinks',
    titleFr: 'Planter des arbres avec Reforest’Action',
    titleEn: 'Plant Trees with Reforest’Action',
    org: 'Reforest’Action (France & Monde)',
    descriptionFr:
      'Financez la plantation d’arbres et la régénération de forêts dégradées en France (massifs touchés par les sécheresses et incendies) et dans les zones tropicales pour restaurer les puits de carbone naturels et les sols humides.',
    descriptionEn:
      'Fund tree planting and regeneration of degraded forests across France and tropical regions to restore natural carbon sinks, biodiversity corridors, and soil moisture.',
    impactFr: '~15 à 25 kg de CO₂ séquestrés / arbre / an à maturité · Forêts diversifiées',
    impactEn: '~15–25 kg CO₂ sequestered / tree / yr at maturity · Biodiverse forestry',
    ctaFr: 'Planter des arbres (Reforest’Action)',
    ctaEn: 'Plant Trees (Reforest’Action)',
    url: 'https://www.reforestaction.com/',
    accentColor: 'emerald',
  },
  {
    id: 'coeur-de-foret',
    category: 'trees',
    badgeFr: 'Reforestation & Forêts Primaires',
    badgeEn: 'Reforestation & Primary Forests',
    titleFr: 'Agir avec Cœur de Forêt & Tree-Nation',
    titleEn: 'Restore Forests with Cœur de Forêt',
    org: 'Association Cœur de Forêt',
    descriptionFr:
      'Association française engagée depuis 2005 dans la reforestation écologique en France et dans le monde, couplée au développement de filières équitables pour éviter la coupe rase des forêts tropicales.',
    descriptionEn:
      'French association dedicated to ecological reforestation in France and worldwide, protecting primary forests and supporting local sustainable livelihoods.',
    impactFr: 'Protection des forêts anciennes & plantation d’essences locales résilientes',
    impactEn: 'Old-growth forest protection & native resilient tree planting',
    ctaFr: 'Soutenir Cœur de Forêt',
    ctaEn: 'Support Cœur de Forêt',
    url: 'https://www.coeurdeforet.com/faire-un-don/',
    accentColor: 'emerald',
  },
  {
    id: 'ademe-nos-gestes-climat',
    category: 'footprint',
    badgeFr: 'Simulateur Officiel Public (ADEME)',
    badgeEn: 'Official Carbon Calculator (ADEME)',
    titleFr: 'Calculer & réduire son empreinte en tonnes de CO₂',
    titleEn: 'Calculate & Reduce Your CO₂ Footprint',
    org: 'ADEME — Nos Gestes Climat',
    descriptionFr:
      'Calculez en 5 minutes votre empreinte carbone annuelle personnelle en tonnes de CO₂ (transport, alimentation, logement) et découvrez les actions prioritaires pour passer de ~9 tCO₂/an à l’objectif de 2 tonnes de CO₂/an d’ici 2050.',
    descriptionEn:
      'Calculate your personal annual carbon footprint in tonnes of CO₂ in 5 minutes and discover high-impact actions to reach the 2 tonnes CO₂/yr Paris Agreement target.',
    impactFr: 'Objectif Accord de Paris : passer de 9,0 tCO₂/an à 2,0 tonnes de CO₂/an',
    impactEn: 'Paris Agreement target: reduce from 9.0 tCO₂/yr to 2.0 tonnes CO₂/yr',
    ctaFr: 'Calculer mes tonnes de CO₂ (ADEME)',
    ctaEn: 'Calculate My CO₂ Tonnes (ADEME)',
    url: 'https://nosgestesclimat.fr/',
    accentColor: 'amber',
  },
  {
    id: 'fondation-de-la-mer',
    category: 'oceans',
    badgeFr: 'Océans, Coraux & Carbone Bleu',
    badgeEn: 'Oceans, Coral & Blue Carbon',
    titleFr: 'Protéger les océans et herbiers marins',
    titleEn: 'Protect Oceans & Marine Seagrass Carbon Sinks',
    org: 'Fondation de la Mer & Surfrider Europe',
    descriptionFr:
      'L’océan absorbe près de 30 % du CO₂ émis par les activités humaines et plus de 90 % de l’excès de chaleur planétaire. Soutenez la restauration des herbiers de posidonie, des mangroves et des récifs coralliens.',
    descriptionEn:
      'Oceans absorb nearly 30% of anthropogenic CO₂ and over 90% of excess planetary heat. Support marine seagrass restoration, mangrove protection, and ocean conservation.',
    impactFr: 'Les herbiers marins stockent jusqu’à 5× plus de carbone par hectare qu’une forêt',
    impactEn: 'Marine seagrass meadows store up to 5× more carbon per hectare than forests',
    ctaFr: 'Agir avec la Fondation de la Mer',
    ctaEn: 'Act with Fondation de la Mer',
    url: 'https://www.fondationdelamer.org/faire-un-don/',
    accentColor: 'sky',
  },
  {
    id: 'fresque-du-climat-rac',
    category: 'footprint',
    badgeFr: 'Science GIEC & Mobilisation Collective',
    badgeEn: 'IPCC Science & Collective Action',
    titleFr: 'Participer à La Fresque du Climat / Réseau Action Climat',
    titleEn: 'Join Climate Fresk & Climate Action Network',
    org: 'La Fresque du Climat & Réseau Action Climat France',
    descriptionFr:
      'Participez à un atelier scientifique collaboratif basé sur les rapports du GIEC (déjà plus de 2 millions de participants) ou soutenez le Réseau Action Climat qui fédère les associations engagées pour la transition énergétique.',
    descriptionEn:
      'Take part in a collaborative scientific workshop based on IPCC reports or support the French Climate Action Network federation.',
    impactFr: '100 % basé sur les données scientifiques officielles du GIEC (AR6)',
    impactEn: '100% grounded in official IPCC AR6 scientific assessments',
    ctaFr: 'Participer à la Fresque du Climat',
    ctaEn: 'Join a Climate Fresk Workshop',
    url: 'https://fresqueduclimat.org/',
    accentColor: 'rose',
  },
];

export const ClimateActionLinksSection: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const isEn = lang === 'en';
  const [activeFilter, setActiveFilter] = useState<'all' | 'donate' | 'trees' | 'footprint' | 'oceans'>('all');

  const filteredActions =
    activeFilter === 'all'
      ? CLIMATE_ACTIONS
      : CLIMATE_ACTIONS.filter((item) => item.category === activeFilter);

  return (
    <section
      id="agir-climat"
      className="py-10 sm:py-16 bg-emerald-950 text-white border-y border-emerald-900"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Quick Direct Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-emerald-800/70">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? 'ACT NOW AGAINST GLOBAL WARMING — VERIFIED ORGANIZATIONS'
                  : 'AGIR CONCRÈTEMENT CONTRE LE RÉCHAUFFEMENT CLIMATIQUE'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display text-white mt-2 leading-tight">
              {isEn
                ? 'Take Direct Climate Action: Donate to WWF France, Plant Trees & Cut CO₂ Tonnes'
                : 'Agir pour la Planète : Faire un don au WWF France, Planter des Arbres & Réduire ses Tonnes de CO₂'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 mt-2.5 leading-relaxed">
              {isEn
                ? 'Every fraction of a degree and every hectare of forest matters. Access official, verified platforms directly below to support wildlife protection, plant resilient forests, or calculate your carbon footprint.'
                : 'Chaque dixième de degré évité et chaque hectare de forêt protégé compte. Accédez directement aux plateformes officielles vérifiées pour soutenir le WWF France, planter des arbres ou calculer votre empreinte en tonnes de CO₂.'}
            </p>
          </div>

          {/* 2 Primary Highlight CTA Buttons (WWF France + Plant Trees) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://faireundon.wwf.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Donate to WWF France' : 'Faire un don au WWF France'}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://www.reforestaction.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-emerald-400/40 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
            >
              <Trees className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{isEn ? 'Plant Trees Now' : 'Planter des arbres'}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {[
            { id: 'all', labelFr: 'Toutes les actions (6)', labelEn: 'All Actions (6)' },
            { id: 'donate', labelFr: 'Faire un don (WWF France)', labelEn: 'Donate (WWF France)' },
            { id: 'trees', labelFr: 'Planter des arbres & Forêts', labelEn: 'Plant Trees & Forests' },
            { id: 'footprint', labelFr: 'Réduire ses tonnes de CO₂ (ADEME)', labelEn: 'Cut CO₂ Tonnes (ADEME)' },
            { id: 'oceans', labelFr: 'Océans & Carbone Bleu', labelEn: 'Oceans & Blue Carbon' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular whitespace-nowrap transition-colors cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-emerald-900/50 text-emerald-100 border-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {isEn ? tab.labelEn : tab.labelFr}
            </button>
          ))}
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-2">
          {filteredActions.map((item) => {
            const IconComponent =
              item.category === 'donate'
                ? HeartHandshake
                : item.category === 'trees'
                ? Trees
                : item.category === 'oceans'
                ? Waves
                : item.id === 'ademe-nos-gestes-climat'
                ? Calculator
                : GraduationCap;

            return (
              <div
                key={item.id}
                className="bg-emerald-900/40 border border-emerald-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-500/70 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-tabular uppercase tracking-wide text-emerald-300 font-semibold">
                      {isEn ? item.badgeEn : item.badgeFr}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-800/70 border border-emerald-700 flex items-center justify-center text-emerald-300 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2.5">
                    {isEn ? item.titleEn : item.titleFr}
                  </h3>
                  <div className="text-xs font-mono-tabular text-emerald-200/80 mt-0.5">
                    {item.org}
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-100/85 mt-3 leading-relaxed">
                    {isEn ? item.descriptionEn : item.descriptionFr}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-emerald-800/70 space-y-3">
                  <div className="flex items-start gap-1.5 text-[11px] font-mono-tabular text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{isEn ? item.impactEn : item.impactFr}</span>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{isEn ? item.ctaEn : item.ctaFr}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
