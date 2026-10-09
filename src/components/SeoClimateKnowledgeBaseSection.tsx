import React, { useState } from 'react';
import { Language } from '../data/climateDatasets';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  lang: Language;
}

interface FaqItem {
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  sourceLabel: string;
}

const SCIENTIFIC_FAQ_ITEMS: FaqItem[] = [
  {
    questionFr: 'Quelles sont les causes principales du réchauffement climatique dans le monde ?',
    questionEn: 'What are the primary root causes of global warming worldwide?',
    answerFr:
      'Selon le Sixième Rapport d’Évaluation du GIEC (AR6), les émissions mondiales atteignent 59 100 000 000 tonnes de CO₂/an (59,1 milliards de tonnes de CO₂/an) et proviennent de cinq grands secteurs : 1) La production d’électricité et de chaleur par combustion du charbon, du gaz et du fioul (31,4 % soit 18,56 Mrd tCO₂/an), 2) L’industrie lourde comme la sidérurgie, la calcination chimique du ciment et la pétrochimie (23,8 % soit 14,07 Mrd tCO₂/an), 3) L’agriculture, l’élevage bovin producteur de méthane et la déforestation tropicale (21,6 % soit 12,76 Mrd tCO₂/an), 4) Les transports routiers, aériens et maritimes (16,2 % soit 9,57 Mrd tCO₂/an), et 5) Les déchets urbains et eaux usées (7,0 % soit 4,14 Mrd tCO₂/an).',
    answerEn:
      'According to the IPCC Sixth Assessment Report (AR6), global anthropogenic emissions reach 59,100,000,000 tonnes of CO₂/yr (59.1 billion tonnes CO₂/yr) across five primary sectors: 1) Electricity and heat generation from coal, gas, and oil (31.4% or 18.56B tCO₂/yr), 2) Heavy industry including steelmaking, cement clinker calcination, and petrochemicals (23.8% or 14.07B tCO₂/yr), 3) Agriculture, ruminant livestock methane, and tropical deforestation (21.6% or 12.76B tCO₂/yr), 4) Road, aviation, and maritime transport (16.2% or 9.57B tCO₂/yr), and 5) Municipal solid waste and wastewater (7.0% or 4.14B tCO₂/yr).',
    sourceLabel: 'GIEC / IPCC AR6 WG3 & EDGAR (europa.eu)'
  },
  {
    questionFr: 'Quel est le lien entre la déforestation mondiale et le dérèglement climatique ?',
    questionEn: 'How does global deforestation accelerate climate disruption?',
    answerFr:
      'Chaque année, environ 10 millions d’hectares de forêts sont détruits dans le monde (FAO / WWF), principalement en Amazonie, dans le Bassin du Congo et en Asie du Sud-Est. Près de 80 % de cette déforestation est causée par l’expansion agricole (pâturages bovins, soja pour l’alimentation animale, huile de palme). Lorsqu’une forêt primaire est brûlée ou coupée, le carbone stocké dans les arbres et les tourbières est libéré, représentant environ 3 800 000 000 tonnes de CO₂/an (3,8 milliards de tonnes de CO₂/an) tout en réduisant la capacité de la Terre à absorber nos futures émissions.',
    answerEn:
      'Approximately 10 million hectares of forest are lost annually worldwide (FAO / WWF), primarily in the Amazon, Congo Basin, and Southeast Asia. Nearly 80% of this deforestation is driven by agricultural expansion (cattle ranching, livestock soy feed, palm oil). Clearing and burning primary forests releases ~3,800,000,000 tonnes of CO₂/yr (3.8 billion tonnes CO₂/yr) stored in biomass and peatlands while permanently eroding Earth’s natural carbon sink capacity.',
    sourceLabel: 'WWF France (Deforestation Fronts) & FAO'
  },
  {
    questionFr: 'Que fait concrètement le WWF pour protéger les animaux et la biodiversité face au climat ?',
    questionEn: 'What concrete actions does WWF take to protect wildlife against climate change?',
    answerFr:
      'Le Rapport Planète Vivante du WWF révèle un déclin moyen de 73 % des populations de vertébrés sauvages entre 1970 et 2020. Pour enrayer cette chute, le WWF agit sur quatre leviers : 1) La création et la cogestion d’aires protégées (programme ARPA de 62 Mha en Amazonie, Sanctuaire Pelagos en Méditerranée pour les cétacés et herbiers de posidonie), 2) La restauration des corridors écologiques (Trame verte et bleue pour le lynx et l’ours en France, corridors du jaguar), 3) La lutte contre la déforestation importée (règlement européen EUDR), et 4) La protection des espèces « ingénieurs du climat » comme les éléphants de forêt et les baleines.',
    answerEn:
      'The WWF Living Planet Report documents a 73% average decline in monitored wildlife populations between 1970 and 2020. WWF counters this through four field pillars: 1) Establishing protected sanctuaries (62 Mha ARPA program in the Amazon, Pelagos whale and Posidonia sanctuary in the Mediterranean), 2) Restoring biological migration corridors, 3) Enforcing zero-deforestation supply chains (EU EUDR regulation), and 4) Protecting "climate keystone species" such as forest elephants and great whales.',
    sourceLabel: 'WWF France (Rapport Planète Vivante)'
  },
  {
    questionFr: 'Quelles sont les mesures mises en place par la France et l’Union Européenne pour le climat ?',
    questionEn: 'What binding climate measures have France and the European Union implemented?',
    answerFr:
      'L’Union Européenne applique le Pacte Vert (« Fit for 55 ») visant -55 % d’émissions nettes d’ici 2030 (déjà -32,5 % atteints depuis 1990 selon l’EEA europa.eu) grâce au marché carbone EU ETS, à la taxe carbone aux frontières (MACF/CBAM), au règlement contre la déforestation importée (EUDR) et à la Loi sur la Restauration de la Nature. En France, la Stratégie Nationale Bas-Carbone (SNBC) et la Stratégie Nationale Biodiversité 2030 s’appuient sur une électricité déjà décarbonée à 92 %, le remplacement des chaudières fossiles par des pompes à chaleur, la décarbonation des 50 sites industriels les plus émetteurs et la protection de 30 % du territoire terrestre et marin.',
    answerEn:
      'The European Union enforces the "Fit for 55" Green Deal package targeting -55% net GHG emissions by 2030 (-32.5% already achieved since 1990 per EEA europa.eu) via the EU ETS carbon market, the Carbon Border Adjustment Mechanism (CBAM), the EU Deforestation Regulation (EUDR), and the Nature Restoration Law. France’s National Low-Carbon Strategy (SNBC) leverages a >92% low-carbon power grid, heat-pump deployment, industrial decarbonization of its top 50 emitting sites, and 30% protected terrestrial and marine areas.',
    sourceLabel: 'Commission Européenne (europa.eu) & Ministère de la Transition Écologique'
  },
  {
    questionFr: 'Pourquoi le méthane (CH₄) et le protoxyde d’azote (N₂O) sont-ils aussi dangereux que le CO₂ ?',
    questionEn: 'Why are methane (CH₄) and nitrous oxide (N₂O) as critical as CO₂?',
    answerFr:
      'Bien que le dioxyde de carbone (CO₂) persiste des siècles dans l’atmosphère, le méthane (CH₄, 1941 ppb) possède un pouvoir réchauffant 84 fois supérieur à celui du CO₂ sur un horizon de 20 ans. Il est responsable d’environ 0,5 °C du réchauffement actuel de +1,52 °C et provient de l’élevage des ruminants, des rizières, des décharges et des fuites d’extraction gazière et pétrolière. Le protoxyde d’azote (N₂O), issu principalement des engrais azotés agricoles, a quant à lui un pouvoir réchauffant 273 fois supérieur au CO₂ et détruit également la couche d’ozone stratosphérique.',
    answerEn:
      'While carbon dioxide (CO₂) persists for centuries, methane (CH₄, 1941 ppb) traps 84 times more heat than CO₂ over a 20-year horizon. Methane accounts for ~0.5 °C of the current +1.52 °C global warming and stems from ruminant livestock, rice paddies, landfills, and fossil fuel extraction leaks. Nitrous oxide (N₂O), driven by synthetic nitrogen fertilizers, has a Global Warming Potential 273 times higher than CO₂.',
    sourceLabel: 'NOAA Global Monitoring Laboratory & GIEC AR6 WG1'
  }
];

export const SeoClimateKnowledgeBaseSection: React.FC<Props> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const isEn = lang === 'en';

  return (
    <section
      id="questions-scientifiques-seo"
      className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-white"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {isEn
                  ? '07. Scientific Synthesis & Frequently Asked Questions (Structured Knowledge Base)'
                  : '07. Synthèse Encyclopédique & Questions Clés sur le Climat et la Biodiversité'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Essential Scientific Answers: Warming Causes, Deforestation, WWF & Public Policies'
                : 'Réponses Scientifiques Essentielles : Causes du Réchauffement, Déforestation, WWF & Politiques'}
            </h2>
          </div>
          <div className="text-xs font-mono-tabular text-slate-500">
            {isEn
              ? 'Indexed via Schema.org FAQPage for Google Search Console'
              : 'Structuré selon Schema.org FAQPage pour Google Search Console'}
          </div>
        </div>

        <div className="mt-8 divide-y divide-slate-200 border border-slate-200 bg-[#F8FAFC]">
          {SCIENTIFIC_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    {isEn ? item.questionEn : item.questionFr}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100">
                    <p>{isEn ? item.answerEn : item.answerFr}</p>
                    <div className="mt-3 text-xs font-mono-tabular text-amber-700">
                      {isEn ? 'Verified Institutional Source:' : 'Source Institutionnelle Vérifiée :'}{' '}
                      {item.sourceLabel}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
