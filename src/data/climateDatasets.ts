export type Language = 'fr' | 'en';

export interface HistoricalPoint {
  year: number;
  co2Ppm: number;
  tempAnomaly: number;
  ch4Ppb: number;
  seaLevelMm: number;
  arcticIceMkm2: number;
}

export type AnnotationCategory = 'volcanic' | 'treaty' | 'threshold';

export interface HistoricalAnnotation {
  id: string;
  year: number;
  category: AnnotationCategory;
  shortLabelFr: string;
  shortLabelEn: string;
  titleFr: string;
  titleEn: string;
  impactBadgeFr: string;
  impactBadgeEn: string;
  narrativeFr: string;
  narrativeEn: string;
  /** Which curve this event primarily anchors to in CO2/CH4 vs Temp modes */
  anchorSeries: 'primary' | 'secondary';
  /** Vertical offset in SVG pixels for the callout label so annotations never collide */
  labelOffsetY: number;
  textAnchor?: 'start' | 'middle' | 'end';
}

export interface SectorCause {
  id: string;
  name: string;
  nameEn: string;
  sharePercent: number;
  annualGtCO2e: number;
  primaryGas: 'CO2' | 'CH4' | 'N2O' | 'F-Gases';
  trend5Yr: string;
  trend5YrEn: string;
  color: string;
  description: string;
  descriptionEn: string;
  globalDrivers: string[];
  globalDriversEn: string[];
  subSectors: {
    name: string;
    nameEn: string;
    share: number;
    gtCO2e: number;
    detail: string;
    detailEn: string;
    mitigationLever: string;
    mitigationLeverEn: string;
  }[];
}

export interface CountryEmissionProfile {
  iso: string;
  code2: string;
  name: string;
  nameEn: string;
  region: 'Asie-Pacifique' | 'Amérique du Nord' | 'Europe' | 'Amérique Latine' | 'Moyen-Orient & Afrique';
  regionEn: 'Asia-Pacific' | 'North America' | 'Europe' | 'Latin America' | 'Middle East & Africa';
  annualMtCO2: number;
  perCapitaTonnes: number;
  cumulativeSharePercent: number;
  mainCause: string;
  mainCauseEn: string;
  renewableSharePercent: number;
  historical1990Mt: number;
  lat: number;
  lon: number;
}

export interface ObservatoryStation {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryEn: string;
  biome: string;
  biomeEn: string;
  lat: number;
  lon: number;
  elevationM: number;
  baselineTempC: number;
}

// High-precision empirical dataset (NOAA GML / NASA GISS / IPCC AR6 / Global Carbon Project)
export const HISTORICAL_CLIMATE_DATA: HistoricalPoint[] = [
  { year: 1880, co2Ppm: 290.8, tempAnomaly: -0.16, ch4Ppb: 850, seaLevelMm: -185, arcticIceMkm2: 7.85 },
  { year: 1883, co2Ppm: 291.9, tempAnomaly: -0.32, ch4Ppb: 856, seaLevelMm: -181, arcticIceMkm2: 7.88 },
  { year: 1890, co2Ppm: 294.2, tempAnomaly: -0.35, ch4Ppb: 868, seaLevelMm: -172, arcticIceMkm2: 7.80 },
  { year: 1900, co2Ppm: 295.7, tempAnomaly: -0.08, ch4Ppb: 885, seaLevelMm: -158, arcticIceMkm2: 7.75 },
  { year: 1910, co2Ppm: 299.8, tempAnomaly: -0.43, ch4Ppb: 915, seaLevelMm: -146, arcticIceMkm2: 7.72 },
  { year: 1920, co2Ppm: 303.4, tempAnomaly: -0.27, ch4Ppb: 955, seaLevelMm: -132, arcticIceMkm2: 7.65 },
  { year: 1930, co2Ppm: 307.2, tempAnomaly: -0.15, ch4Ppb: 1012, seaLevelMm: -119, arcticIceMkm2: 7.52 },
  { year: 1940, co2Ppm: 310.5, tempAnomaly: 0.12, ch4Ppb: 1068, seaLevelMm: -102, arcticIceMkm2: 7.40 },
  { year: 1950, co2Ppm: 311.3, tempAnomaly: -0.17, ch4Ppb: 1145, seaLevelMm: -84, arcticIceMkm2: 7.35 },
  { year: 1958, co2Ppm: 315.3, tempAnomaly: 0.06, ch4Ppb: 1238, seaLevelMm: -66, arcticIceMkm2: 7.26 },
  { year: 1960, co2Ppm: 316.9, tempAnomaly: -0.03, ch4Ppb: 1265, seaLevelMm: -62, arcticIceMkm2: 7.22 },
  { year: 1963, co2Ppm: 318.9, tempAnomaly: -0.14, ch4Ppb: 1308, seaLevelMm: -55, arcticIceMkm2: 7.19 },
  { year: 1965, co2Ppm: 320.0, tempAnomaly: -0.11, ch4Ppb: 1335, seaLevelMm: -51, arcticIceMkm2: 7.15 },
  { year: 1970, co2Ppm: 325.7, tempAnomaly: 0.03, ch4Ppb: 1412, seaLevelMm: -39, arcticIceMkm2: 7.02 },
  { year: 1975, co2Ppm: 331.1, tempAnomaly: -0.01, ch4Ppb: 1485, seaLevelMm: -27, arcticIceMkm2: 6.91 },
  { year: 1980, co2Ppm: 338.8, tempAnomaly: 0.26, ch4Ppb: 1576, seaLevelMm: -14, arcticIceMkm2: 7.54 },
  { year: 1982, co2Ppm: 341.4, tempAnomaly: 0.07, ch4Ppb: 1612, seaLevelMm: -9, arcticIceMkm2: 7.18 },
  { year: 1985, co2Ppm: 346.1, tempAnomaly: 0.12, ch4Ppb: 1658, seaLevelMm: -2, arcticIceMkm2: 6.70 },
  { year: 1990, co2Ppm: 354.4, tempAnomaly: 0.45, ch4Ppb: 1714, seaLevelMm: 11, arcticIceMkm2: 6.14 },
  { year: 1992, co2Ppm: 356.5, tempAnomaly: 0.14, ch4Ppb: 1735, seaLevelMm: 15, arcticIceMkm2: 6.45 },
  { year: 1995, co2Ppm: 360.9, tempAnomaly: 0.45, ch4Ppb: 1752, seaLevelMm: 22, arcticIceMkm2: 6.08 },
  { year: 1997, co2Ppm: 363.8, tempAnomaly: 0.47, ch4Ppb: 1764, seaLevelMm: 27, arcticIceMkm2: 6.18 },
  { year: 2000, co2Ppm: 369.7, tempAnomaly: 0.39, ch4Ppb: 1773, seaLevelMm: 34, arcticIceMkm2: 6.25 },
  { year: 2005, co2Ppm: 379.9, tempAnomaly: 0.68, ch4Ppb: 1775, seaLevelMm: 51, arcticIceMkm2: 5.50 },
  { year: 2010, co2Ppm: 390.1, tempAnomaly: 0.72, ch4Ppb: 1799, seaLevelMm: 67, arcticIceMkm2: 4.87 },
  { year: 2012, co2Ppm: 394.0, tempAnomaly: 0.65, ch4Ppb: 1808, seaLevelMm: 74, arcticIceMkm2: 3.39 },
  { year: 2015, co2Ppm: 401.0, tempAnomaly: 0.90, ch4Ppb: 1834, seaLevelMm: 85, arcticIceMkm2: 4.62 },
  { year: 2018, co2Ppm: 408.7, tempAnomaly: 0.85, ch4Ppb: 1857, seaLevelMm: 94, arcticIceMkm2: 4.71 },
  { year: 2020, co2Ppm: 414.2, tempAnomaly: 1.02, ch4Ppb: 1879, seaLevelMm: 101, arcticIceMkm2: 3.92 },
  { year: 2022, co2Ppm: 418.6, tempAnomaly: 0.89, ch4Ppb: 1912, seaLevelMm: 105, arcticIceMkm2: 4.67 },
  { year: 2023, co2Ppm: 421.1, tempAnomaly: 1.18, ch4Ppb: 1923, seaLevelMm: 108, arcticIceMkm2: 4.23 },
  { year: 2024, co2Ppm: 424.6, tempAnomaly: 1.48, ch4Ppb: 1931, seaLevelMm: 112, arcticIceMkm2: 4.28 },
  { year: 2025, co2Ppm: 426.8, tempAnomaly: 1.52, ch4Ppb: 1939, seaLevelMm: 116, arcticIceMkm2: 4.19 }
];

export const HISTORICAL_CLIMATE_ANNOTATIONS: HistoricalAnnotation[] = [
  {
    id: 'krakatoa-1883',
    year: 1883,
    category: 'volcanic',
    shortLabelFr: '1883 · Krakatoa (-0,3 °C)',
    shortLabelEn: '1883 · Krakatoa (-0.3 °C)',
    titleFr: 'Éruption cataclysmique du Krakatoa (Indonésie)',
    titleEn: 'Cataclysmic Krakatoa Eruption (Indonesia)',
    impactBadgeFr: 'Forçage volcanique : -0,32 °C (voile d’aérosols sulfatés)',
    impactBadgeEn: 'Volcanic forcing: -0.32 °C (stratospheric sulfate veil)',
    narrativeFr:
      'L’injection massive de dioxyde de soufre (SO₂) dans la stratosphère a formé un bouclier d’aérosols réfléchissant le rayonnement solaire incident pendant 3 ans, provoquant un refroidissement global temporaire sans interrompre l’accumulation industrielle de CO₂.',
    narrativeEn:
      'Massive sulfur dioxide (SO₂) injection into the stratosphere formed a reflective sulfate aerosol veil for 3 years, triggering temporary global cooling while industrial CO₂ accumulation continued unabated.',
    anchorSeries: 'secondary',
    labelOffsetY: -34,
    textAnchor: 'start'
  },
  {
    id: 'novarupta-1910',
    year: 1910,
    category: 'volcanic',
    shortLabelFr: '1902–1912 · Santa María & Novarupta',
    shortLabelEn: '1902–1912 · Santa María & Novarupta',
    titleFr: 'Séquence éruptive Santa María (1902) & Novarupta (1912)',
    titleEn: 'Santa María (1902) & Novarupta (1912) Eruptive Sequence',
    impactBadgeFr: 'Minimum thermique du XXe siècle : -0,43 °C',
    impactBadgeEn: '20th-century thermal minimum: -0.43 °C',
    narrativeFr:
      'La succession des plus puissantes éruptions du début du XXe siècle (Santa María, Ksudach, Novarupta en Alaska) combinée à un minimum solaire a maintenu l’anomalie thermique globale autour de -0,43 °C malgré 2 344 Mrd tonnes de CO₂ dans l’atmosphère.',
    narrativeEn:
      'A cluster of major early-20th-century volcanic eruptions (Santa María, Ksudach, Novarupta in Alaska) combined with low solar activity depressed global temperatures to -0.43 °C despite 2,344B tonnes of atmospheric CO₂.',
    anchorSeries: 'secondary',
    labelOffsetY: -28,
    textAnchor: 'middle'
  },
  {
    id: 'keeling-1958',
    year: 1958,
    category: 'threshold',
    shortLabelFr: '1958 · Courbe de Keeling (Mauna Loa)',
    shortLabelEn: '1958 · Keeling Curve (Mauna Loa)',
    titleFr: 'Début des mesures continues à Mauna Loa (Charles David Keeling)',
    titleEn: 'Start of Continuous Mauna Loa CO₂ Record (C.D. Keeling)',
    impactBadgeFr: '2 466 Mrd tCO₂ (315,3 ppm) · Preuve directe de l’accumulation',
    impactBadgeEn: '2,466B tCO₂ (315.3 ppm) · Direct proof of accumulation',
    narrativeFr:
      'L’installation de l’analyseur infrarouge de Charles David Keeling à 3 397 m d’altitude à Hawaï établit la première mesure instrumentale directe prouvant que la combustion fossile augmente inexorablement la masse de CO₂ atmosphérique d’année en année.',
    narrativeEn:
      'Charles David Keeling’s infrared gas analyzer at 3,397 m in Hawaii established the first direct instrumental record proving that fossil fuel combustion inexorably increases atmospheric CO₂ mass year after year.',
    anchorSeries: 'primary',
    labelOffsetY: -42,
    textAnchor: 'middle'
  },
  {
    id: 'agung-1963',
    year: 1963,
    category: 'volcanic',
    shortLabelFr: '1963 · Mont Agung (-0,14 °C)',
    shortLabelEn: '1963 · Mt. Agung (-0.14 °C)',
    titleFr: 'Éruption stratosphérique du Mont Agung (Bali)',
    titleEn: 'Mount Agung Stratospheric Eruption (Bali)',
    impactBadgeFr: 'Refroidissement aérosols : -0,14 °C (-0,20 °C sur 24 mois)',
    impactBadgeEn: 'Aerosol cooling: -0.14 °C (-0.20 °C over 24 months)',
    narrativeFr:
      'Riche en soufre, le panache du Mont Agung a atteint 25 km d’altitude et refroidi la basse troposphère mondiale de près de 0,2 °C pendant deux ans, masquant temporairement le début de l’accélération industrielle d’après-guerre.',
    narrativeEn:
      'Sulfur-rich plumes from Mount Agung reached 25 km into the stratosphere and cooled the global lower troposphere by ~0.2 °C for two years, briefly masking post-war industrial warming.',
    anchorSeries: 'secondary',
    labelOffsetY: 32,
    textAnchor: 'middle'
  },
  {
    id: 'el-chichon-1982',
    year: 1982,
    category: 'volcanic',
    shortLabelFr: '1982 · El Chichón',
    shortLabelEn: '1982 · El Chichón',
    titleFr: 'Éruption volcanique d’El Chichón (Mexique)',
    titleEn: 'El Chichón Volcanic Eruption (Mexico)',
    impactBadgeFr: 'Inflexion thermique : +0,07 °C (-0,19 °C vs 1980)',
    impactBadgeEn: 'Thermal dip: +0.07 °C (-0.19 °C vs 1980)',
    narrativeFr:
      'Avec 7 millions de tonnes de SO₂ injectées dans la stratosphère, El Chichón provoque une chute nette de l’anomalie thermique de +0,26 °C (1980) à +0,07 °C (1982), avant que le forçage des gaz à effet de serre ne reprenne le dessus.',
    narrativeEn:
      'Injecting 7 million tonnes of SO₂ into the stratosphere, El Chichón drove a sharp thermal dip from +0.26 °C (1980) down to +0.07 °C (1982) before greenhouse gas forcing resumed its climb.',
    anchorSeries: 'secondary',
    labelOffsetY: 30,
    textAnchor: 'middle'
  },
  {
    id: 'pinatubo-1992',
    year: 1992,
    category: 'volcanic',
    shortLabelFr: '1991–92 · Mont Pinatubo (-0,4 °C)',
    shortLabelEn: '1991–92 · Mt. Pinatubo (-0.4 °C)',
    titleFr: 'Éruption du Mont Pinatubo (Philippines, juin 1991)',
    titleEn: 'Mount Pinatubo Eruption (Philippines, June 1991)',
    impactBadgeFr: '20 Mt de SO₂ · Chute thermique globale de -0,40 °C en 1992',
    impactBadgeEn: '20 Mt SO₂ · Global thermal drop of -0.40 °C in 1992',
    narrativeFr:
      'Plus grande perturbation volcanique stratosphérique de la seconde moitié du XXe siècle : 20 millions de tonnes de SO₂ ont réduit l’irradiance solaire au sol de ~2,5 W/m², faisant chuter l’anomalie globale de +0,45 °C à +0,14 °C en 1992.',
    narrativeEn:
      'Largest stratospheric volcanic perturbation of the late 20th century: 20 million tonnes of SO₂ cut surface solar irradiance by ~2.5 W/m², dropping global anomaly from +0.45 °C to +0.14 °C in 1992.',
    anchorSeries: 'secondary',
    labelOffsetY: 36,
    textAnchor: 'middle'
  },
  {
    id: 'kyoto-1997',
    year: 1997,
    category: 'treaty',
    shortLabelFr: '1997 · Protocole de Kyoto (COP3)',
    shortLabelEn: '1997 · Kyoto Protocol (COP3)',
    titleFr: 'Adoption du Protocole de Kyoto (COP3)',
    titleEn: 'Adoption of the Kyoto Protocol (COP3)',
    impactBadgeFr: '2 845 Mrd tCO₂ (363,8 ppm) · Premier traité contraignant',
    impactBadgeEn: '2,845B tCO₂ (363.8 ppm) · First binding climate treaty',
    narrativeFr:
      'Premier accord international fixant des objectifs juridiquement contraignants aux pays industrialisés (Annexe I). Toutefois, l’absence de ratification par les États-Unis et l’essor industriel rapide de l’Asie accélèrent la pente du CO₂ après 2000.',
    narrativeEn:
      'First international treaty setting legally binding reduction targets for industrialized nations. However, non-ratification by the US and rapid industrial growth in Asia steepened the CO₂ curve after 2000.',
    anchorSeries: 'primary',
    labelOffsetY: -36,
    textAnchor: 'middle'
  },
  {
    id: 'arctic-2012',
    year: 2012,
    category: 'threshold',
    shortLabelFr: '2012 · Minimum Banquise (3,39 Mkm²)',
    shortLabelEn: '2012 · Record Sea Ice Low (3.39 Mkm²)',
    titleFr: 'Minimum historique absolu de la banquise arctique',
    titleEn: 'All-Time Record Minimum Arctic Sea Ice Extent',
    impactBadgeFr: '3,39 M km² (-57 % vs 1880) · Rétroaction d’albédo',
    impactBadgeEn: '3.39 M km² (-57% vs 1880) · Ice-albedo feedback loop',
    narrativeFr:
      'En septembre 2012, la banquise arctique perd plus de la moitié de sa surface estivale historique (3,39 M km²). Le remplacement de la glace réfléchissante par l’océan sombre amplifie le réchauffement polaire (amplification arctique ×3 à ×4).',
    narrativeEn:
      'In September 2012, Arctic summer sea ice shrank to less than half its historical extent (3.39 M km²). Replacing reflective ice with dark ocean water accelerates polar warming (Arctic amplification ×3–4).',
    anchorSeries: 'secondary',
    labelOffsetY: 32,
    textAnchor: 'end'
  },
  {
    id: 'paris-2015',
    year: 2015,
    category: 'treaty',
    shortLabelFr: '2015 · Accord de Paris (COP21)',
    shortLabelEn: '2015 · Paris Agreement (COP21)',
    titleFr: 'Accord de Paris sur le Climat (COP21 — 196 Parties)',
    titleEn: 'Paris Climate Agreement (COP21 — 196 Parties)',
    impactBadgeFr: '3 136 Mrd tCO₂ (401 ppm) · Cible +1,5 °C / < +2,0 °C',
    impactBadgeEn: '3,136B tCO₂ (401 ppm) · Target +1.5 °C / < +2.0 °C',
    narrativeFr:
      '196 États adoptent un cadre universel visant à contenir le réchauffement bien en-dessous de +2,0 °C et poursuivre l’objectif de +1,5 °C. Bien que l’accord ait accéléré la transition électrique mondiale, +202 Mrd tonnes de CO₂ supplémentaires se sont accumulées dans l’atmosphère depuis 2015.',
    narrativeEn:
      '196 Parties adopted a universal pact to hold warming well below +2.0 °C and pursue +1.5 °C. While catalyzing clean energy deployment worldwide, an additional +202B tonnes of CO₂ have accumulated in the atmosphere since 2015.',
    anchorSeries: 'primary',
    labelOffsetY: -44,
    textAnchor: 'end'
  },
  {
    id: 'breach-2024',
    year: 2024,
    category: 'threshold',
    shortLabelFr: '2024–25 · Franchissement +1,5 °C',
    shortLabelEn: '2024–25 · +1.5 °C Threshold Reached',
    titleFr: 'Franchissement annuel du seuil de +1,5 °C (2024–2025)',
    titleEn: 'First Annual Breach of the +1.5 °C Threshold (2024–2025)',
    impactBadgeFr: '+1,48 à +1,52 °C · 3 338 Mrd tCO₂ (426,8 ppm)',
    impactBadgeEn: '+1.48 to +1.52 °C · 3,338B tCO₂ (426.8 ppm)',
    narrativeFr:
      'Sous l’effet combiné du forçage radiatif record des gaz à effet de serre (3 338 Mrd tonnes de CO₂) et d’un épisode El Niño, la température moyenne mondiale atteint pour la première fois la ligne critique de +1,5 °C sur une année calendaire complète.',
    narrativeEn:
      'Driven by record greenhouse gas radiative forcing (3,338B tonnes of CO₂) and an El Niño cycle, global mean surface temperature reached the critical +1.5 °C Paris threshold across a full calendar year for the first time.',
    anchorSeries: 'secondary',
    labelOffsetY: -22,
    textAnchor: 'end'
  }
];

// Global Greenhouse Gas Emissions by Sector & Root Causes (59.1 GtCO2e/yr total - IPCC AR6 / Climate Watch)
export const GLOBAL_CAUSES_BY_SECTOR: SectorCause[] = [
  {
    id: 'electricity-heat',
    name: 'Production d’Électricité & Chaleur',
    nameEn: 'Electricity & Heat Generation',
    sharePercent: 31.4,
    annualGtCO2e: 18.56,
    primaryGas: 'CO2',
    trend5Yr: '+1.8% / an',
    trend5YrEn: '+1.8% / yr',
    color: '#D97706', // Amber 600
    description:
      'La combustion du charbon, du gaz fossile et du fioul pour l’alimentation des réseaux électriques urbains et le chauffage central représente le premier vecteur anthropique de forçage radiatif mondial.',
    descriptionEn:
      'Burning coal, fossil gas, and fuel oil to power urban electrical grids and district heating represents the single largest anthropogenic driver of global radiative forcing.',
    globalDrivers: [
      'Centrales thermiques au charbon en Asie de l’Est et du Sud (plus de 10,5 GtCO₂/an)',
      'Expansion des turbines à gaz naturel pour répondre aux pointes de demande électrique',
      'Besoins énergétiques croissants des centres de données, de la climatisation urbaine et de l’électrification industrielle'
    ],
    globalDriversEn: [
      'Coal-fired power plants across East and South Asia (exceeding 10.5 GtCO₂/yr)',
      'Expansion of natural gas peaking turbines to meet rising electricity demand',
      'Surging power consumption from data centers, urban air conditioning, and industrial electrification'
    ],
    subSectors: [
      {
        name: 'Centrales thermiques au charbon',
        nameEn: 'Coal-Fired Power Plants',
        share: 18.2,
        gtCO2e: 10.75,
        detail: 'Plus haute intensité carbone (820 à 1050 gCO₂eq/kWh). Responsable de plus de la moitié des émissions électriques.',
        detailEn: 'Highest carbon intensity (820–1050 gCO₂eq/kWh). Accounts for more than half of all global power-sector emissions.',
        mitigationLever: 'Fermeture anticipée des unités sous-critiques, déploiement massif du solaire PV et de l’éolien couplés au stockage.',
        mitigationLeverEn: 'Accelerated phase-out of subcritical coal units, utility-scale solar PV and wind deployment paired with grid storage.'
      },
      {
        name: 'Centrales au gaz fossile & cogénération',
        nameEn: 'Fossil Gas Power & Combined Heat',
        share: 9.8,
        gtCO2e: 5.79,
        detail: 'Environ 490 gCO₂eq/kWh hors fuites de méthane amont qui alourdissent fortement le bilan sur 20 ans.',
        detailEn: 'Approximately 490 gCO₂eq/kWh excluding upstream methane leaks, which substantially increase 20-year warming impact.',
        mitigationLever: 'Réduction des fuites de méthane, réseaux de chaleur géothermiques et stockage longue durée.',
        mitigationLeverEn: 'Upstream methane leak abatement, deep geothermal district heating, and long-duration energy storage.'
      },
      {
        name: 'Chauffage résidentiel & tertiaire direct',
        nameEn: 'Residential & Commercial Heating',
        share: 3.4,
        gtCO2e: 2.02,
        detail: 'Chaudières individuelles et collectives au gaz et au fioul dans les zones tempérées et continentales.',
        detailEn: 'On-site fossil gas and heating oil boilers across temperate and continental urban buildings.',
        mitigationLever: 'Pompes à chaleur haute performance et isolation thermique des enveloppes bâties.',
        mitigationLeverEn: 'High-efficiency electric heat pumps and deep thermal retrofits of building envelopes.'
      }
    ]
  },
  {
    id: 'industry-manufacturing',
    name: 'Industrie Lourde & Procédés Chimiques',
    nameEn: 'Heavy Industry & Chemical Processes',
    sharePercent: 23.8,
    annualGtCO2e: 14.07,
    primaryGas: 'CO2',
    trend5Yr: '+1.2% / an',
    trend5YrEn: '+1.2% / yr',
    color: '#0F172A', // Slate 900
    description:
      'Au-delà de la chaleur haute température, la chimie minérale du ciment (calcination du calcaire) et la réduction du minerai de fer au coke métallurgique libèrent du CO₂ intrinsèque aux réactions chimiques.',
    descriptionEn:
      'Beyond high-temperature process heat, the mineral chemistry of cement (limestone calcination) and iron ore reduction using metallurgical coke release CO₂ intrinsic to chemical reactions.',
    globalDrivers: [
      'Urbanisation rapide nécessitant plus de 4,1 milliards de tonnes de ciment par an',
      'Hauts-fourneaux sidérurgiques utilisant le charbon à coke comme agent réducteur',
      'Vapocraquage pétrochimique pour les plastiques, engrais azotés (ammoniac Haber-Bosch) et gaz fluorés'
    ],
    globalDriversEn: [
      'Rapid global urbanization requiring over 4.1 billion tonnes of cement annually',
      'Blast-furnace steelmaking relying on coking coal as a chemical reducing agent',
      'Petrochemical steam cracking for plastics, synthetic nitrogen fertilizers (Haber-Bosch), and fluorinated gases'
    ],
    subSectors: [
      {
        name: 'Sidérurgie (Fer & Acier)',
        nameEn: 'Iron & Steelmaking',
        share: 7.2,
        gtCO2e: 4.25,
        detail: 'Production de 1,9 milliard de tonnes d’acier/an avec une intensité moyenne de 1,9 tCO₂ par tonne d’acier coulé.',
        detailEn: '1.9 billion tonnes of crude steel produced annually at an average intensity of 1.9 tCO₂ per tonne of steel.',
        mitigationLever: 'Réduction directe du fer par hydrogène vert (DRI-H₂) et fours électriques à arc recyclant la ferraille.',
        mitigationLeverEn: 'Green hydrogen Direct Reduced Iron (DRI-H₂) and scrap-based Electric Arc Furnaces (EAF).'
      },
      {
        name: 'Cimenterie & Calcination du Clinker',
        nameEn: 'Cement & Clinker Calcination',
        share: 6.5,
        gtCO2e: 3.84,
        detail: '60 % des émissions proviennent de la décarbonatation chimique (CaCO₃ → CaO + CO₂), indépendamment du combustible brûlé.',
        detailEn: '60% of emissions stem directly from chemical calcination (CaCO₃ → CaO + CO₂), regardless of kiln fuel.',
        mitigationLever: 'Argiles calcinées (LC3), substitution du clinker par laitiers et capture carbone sur fumées concentrées.',
        mitigationLeverEn: 'Limestone calcined clay cement (LC3), clinker substitution, and kiln flue-gas carbon capture.'
      },
      {
        name: 'Pétrochimie, Plastiques & Engrais',
        nameEn: 'Petrochemicals, Plastics & Fertilizers',
        share: 6.1,
        gtCO2e: 3.61,
        detail: 'Synthèse d’ammoniac, méthanol, éthylène et fuites de gaz fluorés (HFC, SF₆) au pouvoir réchauffant jusqu’à 23 500× le CO₂.',
        detailEn: 'Ammonia, methanol, and ethylene synthesis plus fluorinated gases (HFCs, SF₆) with GWP up to 23,500× CO₂.',
        mitigationLever: 'Hydrogène électrolytique pour l’ammoniac vert, circularité des polymères et élimination des HFC.',
        mitigationLeverEn: 'Electrolytic green ammonia, circular polymer recycling, and Kigali Amendment HFC phase-down.'
      },
      {
        name: 'Fuites Fugitives d’Extraction Fossile',
        nameEn: 'Fugitive Fossil Extraction Leaks',
        share: 4.0,
        gtCO2e: 2.37,
        detail: 'Torchage (flaring), dégazage des puits pétroliers/gaziers et grisou des mines de charbon.',
        detailEn: 'Gas flaring, venting at oil and gas wellheads, and coal-seam methane seepage.',
        mitigationLever: 'Détection satellitaire des super-émetteurs de méthane et colmatage obligatoire des vannes.',
        mitigationLeverEn: 'Satellite detection of methane super-emitters and mandatory pneumatic valve retrofits.'
      }
    ]
  },
  {
    id: 'agriculture-forestry',
    name: 'Agriculture, Élevage & Déforestation (AFOLU)',
    nameEn: 'Agriculture, Livestock & Deforestation (AFOLU)',
    sharePercent: 21.6,
    annualGtCO2e: 12.76,
    primaryGas: 'CH4',
    trend5Yr: '+0.7% / an',
    trend5YrEn: '+0.7% / yr',
    color: '#059669', // Emerald 600
    description:
      'Premier émetteur mondial de méthane (CH₄) et de protoxyde d’azote (N₂O), ce secteur combine la fermentation entérique des ruminants, la conversion des forêts tropicales et la dégradation des sols agricoles.',
    descriptionEn:
      'The world’s primary source of methane (CH₄) and nitrous oxide (N₂O), combining ruminant enteric fermentation, tropical forest conversion, and agricultural soil degradation.',
    globalDrivers: [
      'Expansion des pâturages bovins et de la culture industrielle du soja en Amazonie et dans le Cerrado',
      'Assèchement et brûlis des tourbières tropicales riches en carbone en Asie du Sud-Est',
      'Surutilisation d’engrais azotés de synthèse provoquant la nitrification microbienne (N₂O, 273× plus puissant que le CO₂)'
    ],
    globalDriversEn: [
      'Expansion of cattle ranching and industrial soy cultivation across the Amazon and Cerrado biomes',
      'Drainage and burning of carbon-dense tropical peatlands in Southeast Asia',
      'Overapplication of synthetic nitrogen fertilizers triggering microbial soil nitrification (N₂O, 273× CO₂ GWP)'
    ],
    subSectors: [
      {
        name: 'Élevage & Fermentation Entérique (CH₄)',
        nameEn: 'Livestock & Enteric Fermentation (CH₄)',
        share: 6.8,
        gtCO2e: 4.02,
        detail: 'Digestion anaérobie d’environ 1,5 milliard de bovins et gestion des lisiers libérant du méthane à fort pouvoir réchauffant.',
        detailEn: 'Anaerobic digestion across ~1.5 billion cattle and manure management releasing high-GWP biogenic methane.',
        mitigationLever: 'Transition vers des régimes riches en protéines végétales, additifs alimentaires anti-méthanogènes (algues Asparagopsis).',
        mitigationLeverEn: 'Dietary shifts toward plant-rich proteins and anti-methanogenic feed additives (Asparagopsis red algae).'
      },
      {
        name: 'Déforestation Tropicale & Changements d’Usage des Sols',
        nameEn: 'Tropical Deforestation & Land-Use Change',
        share: 6.4,
        gtCO2e: 3.78,
        detail: 'Destruction des puits forestiers primaires (Amazonie, Bassin du Congo, Bornéo) transformant des réservoirs de carbone en sources nettes.',
        detailEn: 'Clearance of primary forest sinks (Amazon, Congo Basin, Borneo), turning carbon reservoirs into net emission sources.',
        mitigationLever: 'Traçabilité satellitaire zéro-déforestation, restauration écologique et protection des territoires autochtones.',
        mitigationLeverEn: 'Satellite-enforced zero-deforestation supply chains, ecological restoration, and indigenous land tenure protection.'
      },
      {
        name: 'Sols Agricoles & Engrais Azotés (N₂O)',
        nameEn: 'Agricultural Soils & Nitrogen Fertilizers (N₂O)',
        share: 4.9,
        gtCO2e: 2.89,
        detail: 'Émissions de protoxyde d’azote issues des épandages d’engrais synthétiques et du labour profond.',
        detailEn: 'Nitrous oxide emissions driven by synthetic fertilizer runoff and intensive deep tillage.',
        mitigationLever: 'Agriculture régénérative, légumineuses fixatrices d’azote et couverture permanente des sols.',
        mitigationLeverEn: 'Precision regenerative agriculture, nitrogen-fixing cover crops, and no-till soil management.'
      },
      {
        name: 'Riziculture Inondée & Brûlis de Biomasse',
        nameEn: 'Flooded Rice Paddies & Biomass Burning',
        share: 3.5,
        gtCO2e: 2.07,
        detail: 'Les rizières inondées en continu créent des conditions anoxiques propices aux archées méthanogènes.',
        detailEn: 'Continuously flooded rice paddies create anoxic soil conditions ideal for methanogenic archaea.',
        mitigationLever: 'Drainage intermittent à mi-saison (Alternating Wetting and Drying) réduisant le méthane de 45 %.',
        mitigationLeverEn: 'Alternate Wetting and Drying (AWD) mid-season drainage, cutting paddy methane emissions by 45%.'
      }
    ]
  },
  {
    id: 'transport-mobility',
    name: 'Transports Routiers, Aériens & Maritimes',
    nameEn: 'Road, Aviation & Maritime Transport',
    sharePercent: 16.2,
    annualGtCO2e: 9.57,
    primaryGas: 'CO2',
    trend5Yr: '+2.1% / an',
    trend5YrEn: '+2.1% / yr',
    color: '#0284C7', // Sky 600
    description:
      'Quasi intégralement dépendant des produits pétroliers raffinés (essence, diesel, kérosène, fioul lourd), le transport voit ses émissions croître sous l’effet de l’alourdissement du parc automobile (SUV) et du fret mondial.',
    descriptionEn:
      'Nearly 95% reliant on refined petroleum fuels (gasoline, diesel, jet kerosene, heavy fuel oil), transport emissions continue rising due to vehicle mass inflation (SUVs) and global freight.',
    globalDrivers: [
      'Prépondérance de l’automobile individuelle thermique et essor mondial des véhicules lourds (SUV)',
      'Croissance structurelle du fret routier par camions diesel et de la logistique du dernier kilomètre',
      'Reprise rapide de l’aviation commerciale long-courrier (avec effets radiatifs additionnels des traînées de condensation)'
    ],
    globalDriversEn: [
      'Dominance of internal combustion passenger cars and rapid market share growth of heavy SUVs',
      'Structural growth in diesel heavy-duty road freight and last-mile delivery logistics',
      'Expansion of long-haul commercial aviation (compounded by high-altitude contrail cirrus radiative forcing)'
    ],
    subSectors: [
      {
        name: 'Transport Routier Passagers (Voitures, SUV, 2-roues)',
        nameEn: 'Passenger Road Vehicles (Cars, SUVs, Two-Wheelers)',
        share: 7.3,
        gtCO2e: 4.31,
        detail: 'Plus de 1,4 milliard de véhicules en circulation. Les SUV ont absorbé une grande partie des gains d’efficacité énergétique.',
        detailEn: 'Over 1.4 billion vehicles on the road globally. SUV proliferation has offset decades of engine efficiency gains.',
        mitigationLever: 'Report modal vers le rail et le transport public, électrification légère et sobriété sur la masse des véhicules.',
        mitigationLeverEn: 'Modal shift to rail and mass transit, rapid battery-electric vehicle adoption, and vehicle weight standards.'
      },
      {
        name: 'Fret Routier & Poids Lourds',
        nameEn: 'Road Freight & Heavy-Duty Trucks',
        share: 4.6,
        gtCO2e: 2.72,
        detail: 'Camions longue distance fonctionnant au gazole à haute densité énergétique.',
        detailEn: 'Long-haul freight trucks burning high-density diesel fuel across continental supply chains.',
        mitigationLever: 'Fret ferroviaire électrifié, camions électriques à batterie sur corridors haute puissance.',
        mitigationLeverEn: 'Electrified rail freight corridors and megawatt-charging battery-electric heavy trucks.'
      },
      {
        name: 'Aviation Civile & Traînées de Condensation',
        nameEn: 'Commercial Aviation & Contrail Forcing',
        share: 2.4,
        gtCO2e: 1.42,
        detail: 'Outre le CO₂ du kérosène, les oxydes d’azote et cirrus d’altitude doublent l’effet de réchauffement radiatif net.',
        detailEn: 'Beyond jet kerosene CO₂, high-altitude NOx and contrail cirrus clouds double aviation’s net radiative warming.',
        mitigationLever: 'Substitution par le train grande vitesse, réduction des vols courts/privés et carburants de synthèse (e-SAF).',
        mitigationLeverEn: 'High-speed rail substitution, demand management for short-haul/private jets, and synthetic e-SAF fuels.'
      },
      {
        name: 'Transport Maritime International',
        nameEn: 'International Maritime Shipping',
        share: 1.9,
        gtCO2e: 1.12,
        detail: '90 % du commerce mondial en volume, propulsé par du fioul lourd résiduel riche en carbone et en soufre.',
        detailEn: 'Carries 90% of world trade by volume, powered by carbon-intensive residual heavy bunker fuel.',
        mitigationLever: 'Réduction de vitesse (slow steaming), propulsion vélique assistée et e-méthanol.',
        mitigationLeverEn: 'Operational slow steaming, wind-assisted rotor sails, and green e-methanol/ammonia propulsion.'
      }
    ]
  },
  {
    id: 'waste-circularity',
    name: 'Déchets Urbains, Eaux Usées & Méthane',
    nameEn: 'Urban Waste, Wastewater & Methane',
    sharePercent: 7.0,
    annualGtCO2e: 4.14,
    primaryGas: 'CH4',
    trend5Yr: '+1.4% / an',
    trend5YrEn: '+1.4% / yr',
    color: '#E11D48', // Rose 600
    description:
      'L’enfouissement de matières organiques en décharge sans captage de biogaz ainsi que le traitement anaérobie des eaux usées urbaines et industrielles constituent le troisième pilier mondial des émissions de méthane.',
    descriptionEn:
      'Landfilling organic matter without landfill-gas capture and anaerobic treatment of urban and industrial wastewater represent the third largest global pillar of anthropogenic methane.',
    globalDrivers: [
      'Décharges à ciel ouvert dans les mégapoles en croissance démographique rapide sans tri à la source des biodéchets',
      'Incinération non valorisée des déchets plastiques d’origine fossile',
      'Lagunes d’eaux usées non oxygénées libérant du CH₄ et du N₂O'
    ],
    globalDriversEn: [
      'Open dumpsites and unsanitary landfills in rapidly growing megacities lacking organic waste sorting',
      'Unabated incineration of fossil-derived plastic packaging waste',
      'Anoxic wastewater lagoons emitting concentrated CH₄ and N₂O'
    ],
    subSectors: [
      {
        name: 'Décharges d’Ordures Ménagères (CH₄)',
        nameEn: 'Municipal Solid Waste Landfills (CH₄)',
        share: 4.2,
        gtCO2e: 2.48,
        detail: 'La décomposition sans oxygène des restes alimentaires et papiers produit du biogaz composé à 50 % de méthane pendant des décennies.',
        detailEn: 'Oxygen-free decomposition of food scraps and paper generates landfill gas (~50% methane) for decades.',
        mitigationLever: 'Compostage obligatoire à la source, méthanisation contrôlée et captage actif du biogaz de décharge.',
        mitigationLeverEn: 'Mandatory source-separated composting, anaerobic digestion, and active landfill gas capture.'
      },
      {
        name: 'Traitement des Eaux Usées & Boues',
        nameEn: 'Wastewater Treatment & Sludge',
        share: 1.8,
        gtCO2e: 1.06,
        detail: 'Dégradation bactérienne de la charge organique dans les réseaux d’assainissement insuffisamment aérés.',
        detailEn: 'Bacterial breakdown of organic loads in poorly aerated municipal and industrial sanitation networks.',
        mitigationLever: 'Stations d’épuration à récupération de biogaz et oxydation contrôlée.',
        mitigationLeverEn: 'Aerobic treatment upgrades with biogas recovery and methane oxidation.'
      },
      {
        name: 'Incinération des Déchets Fossiles',
        nameEn: 'Fossil Plastic Waste Incineration',
        share: 1.0,
        gtCO2e: 0.60,
        detail: 'Combustion directe des emballages plastiques et textiles synthétiques dérivés du pétrole.',
        detailEn: 'Direct combustion of petroleum-derived plastic packaging and synthetic textiles.',
        mitigationLever: 'Réduction à la source des plastiques à usage unique et consigne pour réemploi.',
        mitigationLeverEn: 'Upstream elimination of single-use plastics and standardized reuse/refill systems.'
      }
    ]
  }
];

// Top Global Emitters & Regional Profiles (Global Carbon Budget / EDGAR / World Bank)
export const COUNTRY_EMISSION_PROFILES: CountryEmissionProfile[] = [
  {
    iso: 'CHN',
    code2: 'CN',
    name: 'Chine',
    nameEn: 'China',
    region: 'Asie-Pacifique',
    regionEn: 'Asia-Pacific',
    annualMtCO2: 11900,
    perCapitaTonnes: 8.4,
    cumulativeSharePercent: 15.2,
    mainCause: 'Charbon thermique, sidérurgie & cimenterie (atelier manufacturier mondial)',
    mainCauseEn: 'Thermal coal power, steelmaking & cement kilns (global manufacturing hub)',
    renewableSharePercent: 31.8,
    historical1990Mt: 2480,
    lat: 39.9042,
    lon: 116.4074
  },
  {
    iso: 'USA',
    code2: 'US',
    name: 'États-Unis',
    nameEn: 'United States',
    region: 'Amérique du Nord',
    regionEn: 'North America',
    annualMtCO2: 4910,
    perCapitaTonnes: 14.6,
    cumulativeSharePercent: 24.6,
    mainCause: 'Transports routiers & aériens, centrales à gaz et extraction pétrolière/gaz de schiste',
    mainCauseEn: 'Road & aviation transport, fossil gas power plants, and shale oil/gas extraction',
    renewableSharePercent: 22.7,
    historical1990Mt: 5120,
    lat: 38.9072,
    lon: -77.0369
  },
  {
    iso: 'IND',
    code2: 'IN',
    name: 'Inde',
    nameEn: 'India',
    region: 'Asie-Pacifique',
    regionEn: 'Asia-Pacific',
    annualMtCO2: 3060,
    perCapitaTonnes: 2.1,
    cumulativeSharePercent: 3.4,
    mainCause: 'Centrales électriques au charbon, industrie lourde et riziculture/élevage',
    mainCauseEn: 'Coal-fired power generation, heavy industry, and rice/livestock agriculture',
    renewableSharePercent: 21.5,
    historical1990Mt: 620,
    lat: 28.6139,
    lon: 77.2090
  },
  {
    iso: 'RUS',
    code2: 'RU',
    name: 'Russie',
    nameEn: 'Russia',
    region: 'Europe',
    regionEn: 'Europe',
    annualMtCO2: 1810,
    perCapitaTonnes: 12.5,
    cumulativeSharePercent: 6.8,
    mainCause: 'Extraction gazière/pétrolière, fuites fugitives de méthane et réseaux de chaleur urbains',
    mainCauseEn: 'Oil & gas extraction, fugitive pipeline methane leaks, and district heating',
    renewableSharePercent: 19.4,
    historical1990Mt: 2530,
    lat: 55.7558,
    lon: 37.6173
  },
  {
    iso: 'BRA',
    code2: 'BR',
    name: 'Brésil',
    nameEn: 'Brazil',
    region: 'Amérique Latine',
    regionEn: 'Latin America',
    annualMtCO2: 1320,
    perCapitaTonnes: 6.1,
    cumulativeSharePercent: 4.1,
    mainCause: 'Déforestation amazonienne (LULUCF), élevage bovin extensif et transport routier',
    mainCauseEn: 'Amazon deforestation (LULUCF), extensive cattle ranching, and road freight',
    renewableSharePercent: 88.2,
    historical1990Mt: 1410,
    lat: -15.7975,
    lon: -47.8919
  },
  {
    iso: 'IDN',
    code2: 'ID',
    name: 'Indonésie',
    nameEn: 'Indonesia',
    region: 'Asie-Pacifique',
    regionEn: 'Asia-Pacific',
    annualMtCO2: 1240,
    perCapitaTonnes: 4.5,
    cumulativeSharePercent: 2.3,
    mainCause: 'Assèchement des tourbières, déforestation tropicale et centrales électriques au charbon',
    mainCauseEn: 'Tropical peatland drainage, deforestation, and coal-fired power generation',
    renewableSharePercent: 14.5,
    historical1990Mt: 890,
    lat: -6.2088,
    lon: 106.8456
  },
  {
    iso: 'JPN',
    code2: 'JP',
    name: 'Japon',
    nameEn: 'Japan',
    region: 'Asie-Pacifique',
    regionEn: 'Asia-Pacific',
    annualMtCO2: 1030,
    perCapitaTonnes: 8.3,
    cumulativeSharePercent: 3.9,
    mainCause: 'Importation de GNL et charbon pour l’électricité, sidérurgie et industrie automobile',
    mainCauseEn: 'Imported LNG and thermal coal for power generation, steelmaking, and manufacturing',
    renewableSharePercent: 22.9,
    historical1990Mt: 1160,
    lat: 35.6762,
    lon: 139.6503
  },
  {
    iso: 'SAU',
    code2: 'SA',
    name: 'Arabie Saoudite',
    nameEn: 'Saudi Arabia',
    region: 'Moyen-Orient & Afrique',
    regionEn: 'Middle East & Africa',
    annualMtCO2: 675,
    perCapitaTonnes: 18.7,
    cumulativeSharePercent: 1.1,
    mainCause: 'Raffinage pétrolier, dessalement d’eau de mer thermique et climatisation électrique au fioul/gaz',
    mainCauseEn: 'Oil refining, thermal seawater desalination, and gas/oil-powered air conditioning',
    renewableSharePercent: 1.8,
    historical1990Mt: 210,
    lat: 24.7136,
    lon: 46.6753
  },
  {
    iso: 'DEU',
    code2: 'DE',
    name: 'Allemagne',
    nameEn: 'Germany',
    region: 'Europe',
    regionEn: 'Europe',
    annualMtCO2: 595,
    perCapitaTonnes: 7.1,
    cumulativeSharePercent: 5.4,
    mainCause: 'Centrales au lignite/gaz, industrie chimique et parc automobile thermique',
    mainCauseEn: 'Lignite/gas power plants, heavy chemical industry, and internal combustion vehicles',
    renewableSharePercent: 52.4,
    historical1990Mt: 1052,
    lat: 52.5200,
    lon: 13.4050
  },
  {
    iso: 'CAN',
    code2: 'CA',
    name: 'Canada',
    nameEn: 'Canada',
    region: 'Amérique du Nord',
    regionEn: 'North America',
    annualMtCO2: 548,
    perCapitaTonnes: 14.1,
    cumulativeSharePercent: 2.0,
    mainCause: 'Extraction des sables bitumineux de l’Alberta, transport longue distance et chauffage',
    mainCauseEn: 'Alberta oil sands extraction, long-distance road transport, and space heating',
    renewableSharePercent: 67.8,
    historical1990Mt: 460,
    lat: 45.4215,
    lon: -75.6972
  },
  {
    iso: 'ZAF',
    code2: 'ZA',
    name: 'Afrique du Sud',
    nameEn: 'South Africa',
    region: 'Moyen-Orient & Afrique',
    regionEn: 'Middle East & Africa',
    annualMtCO2: 435,
    perCapitaTonnes: 7.2,
    cumulativeSharePercent: 1.3,
    mainCause: 'Mix électrique dépendant à plus de 80 % du charbon et liquéfaction houillère (Sasol)',
    mainCauseEn: 'Power grid >80% reliant on coal and coal-to-liquid synthetic fuel production',
    renewableSharePercent: 10.6,
    historical1990Mt: 315,
    lat: -25.7479,
    lon: 28.2293
  },
  {
    iso: 'FRA',
    code2: 'FR',
    name: 'France',
    nameEn: 'France',
    region: 'Europe',
    regionEn: 'Europe',
    annualMtCO2: 304,
    perCapitaTonnes: 4.5,
    cumulativeSharePercent: 2.2,
    mainCause: 'Transports routiers (32 %), agriculture/élevage (19 %) et chauffage au gaz (électricité décarbonée à 92 %)',
    mainCauseEn: 'Road transport (32%), agriculture/livestock (19%), and gas heating (92% low-carbon electricity)',
    renewableSharePercent: 28.4,
    historical1990Mt: 395,
    lat: 48.8566,
    lon: 2.3522
  }
];

export const OBSERVATORY_STATIONS: ObservatoryStation[] = [
  {
    id: 'mauna-loa',
    name: 'Mauna Loa Observatory (NOAA)',
    nameEn: 'Mauna Loa Observatory (NOAA)',
    country: 'Hawaï, Pacifique Nord',
    countryEn: 'Hawaii, North Pacific',
    biome: 'Station de référence mondiale du CO₂ troposphérique',
    biomeEn: 'Global benchmark station for well-mixed tropospheric CO₂',
    lat: 19.5362,
    lon: -155.5763,
    elevationM: 3397,
    baselineTempC: 7.2
  },
  {
    id: 'svalbard',
    name: 'Ny-Ålesund Arctic Station',
    nameEn: 'Ny-Ålesund Arctic Station',
    country: 'Svalbard, Arctique Norvégien',
    countryEn: 'Svalbard, Norwegian Arctic',
    biome: 'Sentinelle de l’amplification polaire (réchauffement 4× supérieur à la moyenne)',
    biomeEn: 'Arctic amplification sentinel (warming at 4× the global average)',
    lat: 78.9235,
    lon: 11.9099,
    elevationM: 474,
    baselineTempC: -5.8
  },
  {
    id: 'manaus',
    name: 'ATTO Amazon Tall Tower',
    nameEn: 'ATTO Amazon Tall Tower',
    country: 'Amazonie Centrale, Brésil',
    countryEn: 'Central Amazonia, Brazil',
    biome: 'Flux carbone forestier & stress hydrique de la canopée tropicale',
    biomeEn: 'Rainforest carbon flux & tropical canopy hydrological stress',
    lat: -2.1459,
    lon: -59.0056,
    elevationM: 120,
    baselineTempC: 26.8
  },
  {
    id: 'paris-saclay',
    name: 'Observatoire Atmosphérique ICOS',
    nameEn: 'ICOS Atmospheric Observatory',
    country: 'Paris-Saclay, France',
    countryEn: 'Paris-Saclay, France',
    biome: 'Surveillance européenne des panaches urbains et qualité de l’air',
    biomeEn: 'European urban plume monitoring & background air quality',
    lat: 48.7120,
    lon: 2.1480,
    elevationM: 160,
    baselineTempC: 11.8
  },
  {
    id: 'new-delhi',
    name: 'Station Indo-Gangétique IGI',
    nameEn: 'Indo-Gangetic Plains Station',
    country: 'New Delhi, Inde',
    countryEn: 'New Delhi, India',
    biome: 'Dôme thermique urbain, aérosols carbonés (suie) et stress PM2.5',
    biomeEn: 'Urban heat dome, black carbon aerosols, and severe PM2.5 stress',
    lat: 28.6139,
    lon: 77.2090,
    elevationM: 216,
    baselineTempC: 25.1
  },
  {
    id: 'cape-grim',
    name: 'Cape Grim Baseline Air Pollution',
    nameEn: 'Cape Grim Baseline Air Pollution',
    country: 'Tasmanie, Australie',
    countryEn: 'Tasmania, Australia',
    biome: 'Référence atmosphérique de l’Hémisphère Sud et de l’Océan Austral',
    biomeEn: 'Southern Hemisphere & Southern Ocean pristine atmospheric baseline',
    lat: -40.6833,
    lon: 144.6833,
    elevationM: 94,
    baselineTempC: 12.6
  }
];
