export interface CountrySectorShare {
  sectorFr: string;
  sectorEn: string;
  sharePercent: number;
  detailFr: string;
  detailEn: string;
  color: string;
}

export interface CountryFullDossier {
  iso3: string;
  iso2: string;
  nameFr: string;
  nameEn: string;
  aliases: string[];
  regionFr: string;
  regionEn: string;
  capitalFr: string;
  capitalEn: string;
  lat: number;
  lon: number;
  populationMillions: number;
  // Emissions & Energy
  annualMtCO2e: number;
  perCapitaTonnes: number;
  evolutionSince1990Percent: number;
  cumulativeHistoricalSharePercent: number;
  lowCarbonElectricityPercent: number;
  renewableSharePercent: number;
  nationalTempAnomalyC: number;
  // Sectoral breakdown of the country's emissions
  sectors: CountrySectorShare[];
  // Forests, Deforestation & Biodiversity
  forestCoverPercent: number;
  forestTrendFr: string;
  forestTrendEn: string;
  climateRisksFr: string[];
  climateRisksEn: string[];
  // WWF & Wildlife Conservation in this country
  wwfSpeciesAndActionsFr: {
    title: string;
    species: string;
    action: string;
  }[];
  wwfSpeciesAndActionsEn: {
    title: string;
    species: string;
    action: string;
  }[];
  // National Laws, Policies & Measures implemented
  policyFrameworkTitleFr: string;
  policyFrameworkTitleEn: string;
  target2030Fr: string;
  target2030En: string;
  netZeroTargetYear: number;
  keyLawsAndMeasuresFr: string[];
  keyLawsAndMeasuresEn: string[];
  officialSources: { label: string; url: string }[];
}

export const COUNTRY_FULL_DOSSIERS: CountryFullDossier[] = [
  {
    iso3: 'FRA',
    iso2: 'FR',
    nameFr: 'France',
    nameEn: 'France',
    aliases: ['france', 'french republic', 'republique francaise', 'hexagone', 'paris', 'fr'],
    regionFr: 'Europe de l’Ouest (Union Européenne)',
    regionEn: 'Western Europe (European Union)',
    capitalFr: 'Paris (Station ICOS Paris-Saclay)',
    capitalEn: 'Paris (ICOS Paris-Saclay Station)',
    lat: 48.8566,
    lon: 2.3522,
    populationMillions: 68.4,
    annualMtCO2e: 304,
    perCapitaTonnes: 4.5,
    evolutionSince1990Percent: -31.2,
    cumulativeHistoricalSharePercent: 2.2,
    lowCarbonElectricityPercent: 92.4,
    renewableSharePercent: 28.4,
    nationalTempAnomalyC: 1.85,
    sectors: [
      {
        sectorFr: 'Transports Routiers, Aériens & Maritimes',
        sectorEn: 'Road, Aviation & Maritime Transport',
        sharePercent: 32.0,
        detailFr: '1er secteur émetteur en France (voitures individuelles, poids lourds diesel et aviation).',
        detailEn: '#1 emitting sector in France (passenger cars, diesel freight trucks, and aviation).',
        color: '#0284C7'
      },
      {
        sectorFr: 'Agriculture, Élevage & Sols',
        sectorEn: 'Agriculture, Livestock & Soils',
        sharePercent: 19.0,
        detailFr: 'Méthane entérique du cheptel bovin (CH₄), engrais azotés (N₂O) et motorisation agricole.',
        detailEn: 'Cattle enteric methane (CH₄), synthetic nitrogen fertilizers (N₂O), and farm machinery.',
        color: '#059669'
      },
      {
        sectorFr: 'Industrie Manufacturière & Cimenterie',
        sectorEn: 'Manufacturing & Heavy Industry',
        sharePercent: 18.0,
        detailFr: 'Sidérurgie (Dunkerque, Fos-sur-Mer), chimie, cimenteries et agroalimentaire.',
        detailEn: 'Steelmaking (Dunkirk, Fos-sur-Mer), chemicals, cement kilns, and food processing.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Bâtiments Résidentiels & Tertiaires',
        sectorEn: 'Residential & Commercial Buildings',
        sharePercent: 16.0,
        detailFr: 'Chauffage au gaz fossile et au fioul domestique des logements mal isolés.',
        detailEn: 'Fossil gas and heating oil boilers in residential and commercial buildings.',
        color: '#64748B'
      },
      {
        sectorFr: 'Industrie de l’Énergie & Déchets',
        sectorEn: 'Energy Transformation & Waste',
        sharePercent: 15.0,
        detailFr: 'Raffineries, centrales gaz d’appoint et méthane des centres d’enfouissement (électricité décarbonée à >92 %).',
        detailEn: 'Refineries, peaking gas plants, and landfill methane (electricity grid is >92% low-carbon).',
        color: '#D97706'
      }
    ],
    forestCoverPercent: 31.5,
    forestTrendFr:
      '17,5 millions d’hectares en métropole (+8 Mha en Guyane). Surface en progression mais puits de carbone forestier divisé par deux en 10 ans à cause des sécheresses estivales, des scolytes et des mégafeux.',
    forestTrendEn:
      '17.5 million hectares in mainland France (+8 Mha in French Guiana). Area is expanding, but the forest carbon sink has halved over the past decade due to summer droughts, bark beetles, and wildfires.',
    climateRisksFr: [
      'Réchauffement en France métropolitaine (+1,85 °C) plus rapide que la moyenne mondiale (+1,52 °C) en raison de la continentalité.',
      'Fonte accélérée des glaciers alpins et pyrénéens (-40 % de volume depuis 2000, Mer de Glace).',
      'Sécheresses édaphiques estivales, retrait-gonflement des argiles (menaçant 10,4 millions de maisons) et submersion côtière.',
      'Déforestation importée : l’empreinte française liée aux importations de soja, cacao, huile de palme et bœuf équivaut à 5,1 millions d’hectares dans les tropiques.'
    ],
    climateRisksEn: [
      'Mainland France is warming (+1.85 °C) faster than the global average (+1.52 °C) due to land mass amplification.',
      'Rapid retreat of Alpine and Pyrenean glaciers (-40% volume since 2000, including Mer de Glace).',
      'Severe summer soil droughts, clay shrinkage-swelling affecting 10.4 million homes, and coastal erosion.',
      'Imported deforestation: French consumption of imported soy, cocoa, palm oil, and beef drives major tropical forest footprint.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Sanctuaire Pelagos & Herbiers de Posidonie (Méditerranée)',
        species: 'Rorqual commun, Grand dauphin, Cachalot & Posidonie',
        action:
          'Le WWF France déploie des coffres d’amarrage écologique pour protéger les herbiers de posidonie (qui stockent 5× plus de carbone par hectare qu’une forêt tropicale) et impose la réduction de vitesse des navires contre les collisions avec les baleines.'
      },
      {
        title: 'Grands Carnivores & Corridors Écologiques (Jura, Alpes, Pyrénées)',
        species: 'Lynx boréal (~150 individus), Ours brun des Pyrénées (~83 individus) & Loup gris',
        action:
          'Restauration de la Trame Verte et Bleue pour permettre la migration climatique des espèces, lutte contre le braconnage du lynx et financement des chiens de protection pour la coexistence avec les éleveurs.'
      },
      {
        title: 'Forêt Primaire de Guyane Française & Récifs d’Outre-Mer',
        species: 'Jaguar, Tortue luth, Tapir & Coraux de Nouvelle-Calédonie',
        action:
          'Lutte sur le terrain contre l’orpaillage illégal et la contamination au mercure dans le Parc amazonien de Guyane, et protection des mangroves ultramarines.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Pelagos Sanctuary & Posidonia Seagrass (Mediterranean)',
        species: 'Fin Whale, Bottlenose Dolphin, Sperm Whale & Posidonia',
        action:
          'WWF France installs ecological mooring buoys to protect Posidonia seagrass meadows (storing 5× more carbon per hectare than tropical forests) and campaigns for ship speed limits.'
      },
      {
        title: 'Large Carnivores & Ecological Corridors (Jura, Alps, Pyrenees)',
        species: 'Eurasian Lynx (~150 adults), Pyrenean Brown Bear (~83) & Grey Wolf',
        action:
          'Restoring ecological migration corridors, anti-poaching enforcement for the Jura lynx, and funding livestock protection dogs for pastoral coexistence.'
      },
      {
        title: 'French Guiana Primary Amazon Forest & Overseas Reefs',
        species: 'Jaguar, Leatherback Turtle, Tapir & Coral Reefs',
        action:
          'Combating illegal gold mining and mercury pollution in the Guiana Amazonian Park and conserving coastal mangroves across French overseas territories.'
      }
    ],
    policyFrameworkTitleFr:
      'Stratégie Nationale Bas-Carbone (SNBC 3), Planification Écologique & Loi Climat et Résilience',
    policyFrameworkTitleEn:
      'National Low-Carbon Strategy (SNBC 3), Ecological Planning & Climate Resilience Act',
    target2030Fr: '-50 % d’émissions brutes de GES en 2030 (vs 1990) · Trajectoire « Fit for 55 »',
    target2030En: '-50% gross GHG emissions by 2030 (vs 1990) · EU Fit for 55 Alignment',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Décarbonation des 50 sites industriels français les plus émetteurs (hydrogène bas-carbone, électrification des fours et captage de CO₂ à Dunkerque et Fos-sur-Mer).',
      'Interdiction des chaudières neuves au fioul, aides MaPrimeRénov’ pour l’installation de 1 million de pompes à chaleur par an et bonus écologique réservé aux véhicules électriques à faible score carbone.',
      'Stratégie Nationale pour la Biodiversité 2030 : 30 % d’aires terrestres et maritimes protégées (dont 10 % sous protection forte) et objectif « Zéro Artificialisation Nette » (ZAN) des sols en 2050.',
      'Application de la Stratégie Nationale de lutte contre la Déforestation Importée (SNDI) et du règlement européen EUDR.'
    ],
    keyLawsAndMeasuresEn: [
      'Decarbonization contracts for France’s 50 largest industrial emitters (low-carbon hydrogen, furnace electrification, and CCS at Dunkirk and Fos-sur-Mer).',
      'Ban on new oil boilers, MaPrimeRénov’ subsidies targeting 1 million heat pumps per year, and lifecycle carbon-scored electric vehicle incentives.',
      'National Biodiversity Strategy 2030: 30% protected land and marine areas (10% strict protection) and "Zero Net Land Artificialization" (ZAN) by 2050.',
      'Enforcement of the National Strategy Against Imported Deforestation (SNDI) and the EU EUDR regulation.'
    ],
    officialSources: [
      { label: 'CITEPA — Inventaire Officiel GES France (Secten)', url: 'https://www.citepa.org/fr/secten/' },
      { label: 'Ministère de la Transition Écologique (SNBC)', url: 'https://www.ecologie.gouv.fr/strategie-nationale-bas-carbone-snbc' },
      { label: 'WWF France — Programmes & Biodiversité', url: 'https://www.wwf.fr/espaces-prioritaires' },
      { label: 'Météo-France & DRIAS Climat', url: 'https://meteofrance.com/changement-climatique' }
    ]
  },
  {
    iso3: 'USA',
    iso2: 'US',
    nameFr: 'États-Unis',
    nameEn: 'United States',
    aliases: ['etats-unis', 'états-unis', 'etats unis', 'united states', 'usa', 'us', 'amerique', 'america'],
    regionFr: 'Amérique du Nord',
    regionEn: 'North America',
    capitalFr: 'Washington D.C. / Observatoire NOAA Mauna Loa',
    capitalEn: 'Washington D.C. / NOAA Mauna Loa Observatory',
    lat: 38.9072,
    lon: -77.0369,
    populationMillions: 335.9,
    annualMtCO2e: 4910,
    perCapitaTonnes: 14.6,
    evolutionSince1990Percent: -4.1,
    cumulativeHistoricalSharePercent: 24.6,
    lowCarbonElectricityPercent: 41.2,
    renewableSharePercent: 22.7,
    nationalTempAnomalyC: 1.65,
    sectors: [
      {
        sectorFr: 'Transports Routiers & Aviation Intérieure',
        sectorEn: 'Road Transport & Domestic Aviation',
        sharePercent: 28.5,
        detailFr: 'Prédominance des SUV/pick-ups thermiques, fret routier longue distance et aviation intérieure.',
        detailEn: 'Dominance of heavy internal-combustion SUVs/pickups, long-haul trucking, and domestic aviation.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Production d’Électricité (Gaz de schiste & Charbon)',
        sectorEn: 'Electric Power (Shale Gas & Coal)',
        sharePercent: 25.0,
        detailFr: 'Le gaz naturel a remplacé une partie du charbon, mais reste lourdement émetteur de CO₂ et CH₄.',
        detailEn: 'Fossil gas has displaced coal in many states, while solar and wind rapidly expand in Texas and California.',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie Lourde & Extraction Pétrogazière',
        sectorEn: 'Heavy Industry & Oil/Gas Extraction',
        sharePercent: 23.0,
        detailFr: 'Premier producteur mondial de pétrole et de gaz (bassin Permien) avec fuites de méthane.',
        detailEn: 'World’s largest oil and gas producer (Permian Basin) alongside petrochemical and steel plants.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Bâtiments Résidentiels & Climatisation',
        sectorEn: 'Residential & Commercial Buildings',
        sharePercent: 13.0,
        detailFr: 'Chauffage au gaz et forte consommation électrique pour la climatisation.',
        detailEn: 'Fossil gas heating in northern states and high air-conditioning demand across the Sun Belt.',
        color: '#64748B'
      },
      {
        sectorFr: 'Agriculture & Élevage Intensif',
        sectorEn: 'Agriculture & Feedlot Livestock',
        sharePercent: 10.5,
        detailFr: 'Parcs d’engraissement bovins (feedlots), engrais azotés dans la Corn Belt.',
        detailEn: 'Cattle feedlots, manure lagoons, and synthetic fertilizer application across the Midwest Corn Belt.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 33.9,
    forestTrendFr:
      '310 millions d’hectares de forêts. Les forêts de l’Ouest américain (Californie, Oregon, Rocheuses) subissent des mégafeux historiques et un stress hydrique sévère.',
    forestTrendEn:
      '310 million hectares of forest. Western US forests (California, Oregon, Rockies) face record megafires and prolonged megadrought stress.',
    climateRisksFr: [
      'Amplification arctique en Alaska (+3,1 °C, fonte du pergélisol côtier).',
      'Ouragans de catégorie 4-5 intensifiés par la surchauffe du Golfe du Mexique (Floride, Louisiane, Texas).',
      'Mégasécheresse du bassin du fleuve Colorado (lacs Mead et Powell à des niveaux critiques).'
    ],
    climateRisksEn: [
      'Arctic amplification in Alaska (+3.1 °C, thawing coastal permafrost).',
      'Rapidly intensifying Category 4–5 hurricanes fueled by record Gulf of Mexico sea temperatures.',
      'structural megadrought across the Colorado River Basin (Lake Mead and Lake Powell).'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Grandes Plaines du Nord (Northern Great Plains)',
        species: 'Bison d’Amérique, Putois à pieds noirs & Chiens de prairie',
        action:
          'Le WWF restaure les prairies tempérées intactes avec les nations amérindiennes (Sioux, Blackfeet) pour réintroduire le bison et stocker le carbone dans les sols profonds.'
      },
      {
        title: 'Arctique de l’Alaska & Mer de Béring',
        species: 'Ours polaire, Morse du Pacifique & Béluga',
        action:
          'Protection des zones de mise bas contre les forages pétroliers arctiques et patrouilles communautaires inuites.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Northern Great Plains Grassland Restoration',
        species: 'American Bison, Black-Footed Ferret & Swift Fox',
        action:
          'WWF partners with Native Nations and ranchers to restore intact temperate grasslands, reintroduce bison herds, and lock carbon into deep prairie soils.'
      },
      {
        title: 'Alaskan Arctic & Bering Sea Conservation',
        species: 'Polar Bear, Pacific Walrus & Beluga Whale',
        action:
          'Protecting critical sea-ice denning habitats from offshore drilling and supporting Indigenous community co-management.'
      }
    ],
    policyFrameworkTitleFr:
      'Inflation Reduction Act (IRA), EPA Methane Rule & Engagements Climatiques des États (California CARB)',
    policyFrameworkTitleEn:
      'Inflation Reduction Act (IRA), EPA Methane Rule & State Climate Mandates (California CARB)',
    target2030Fr: '-50 à -52 % d’émissions nettes en 2030 (vs niveau de 2005)',
    target2030En: '-50% to -52% net GHG emissions by 2030 (below 2005 levels)',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Inflation Reduction Act (IRA) : plus de 369 milliards $ de crédits d’impôt pour le solaire, l’éolien, les batteries, l’hydrogène vert et les véhicules électriques.',
      'Règlement EPA sur le méthane pétrogazier : redevance sur les fuites de méthane et obligation de détection par satellite/capteurs optiques.',
      'Coalition « US Climate Alliance » (24 États dont la Californie et New York) imposant 100 % d’électricité décarbonée d’ici 2040-2045.'
    ],
    keyLawsAndMeasuresEn: [
      'Inflation Reduction Act (IRA): $369+ billion in clean energy tax credits for utility solar, wind, battery manufacturing, and EVs.',
      'EPA Oil & Gas Methane Rule: methane waste emissions charge and mandatory optical/satellite leak detection.',
      'US Climate Alliance (24 states including California and New York) enforcing 100% clean electricity standards by 2040–2045.'
    ],
    officialSources: [
      { label: 'NOAA Global Monitoring Laboratory', url: 'https://gml.noaa.gov/' },
      { label: 'US EPA Greenhouse Gas Inventory', url: 'https://www.epa.gov/ghgemissions' },
      { label: 'NASA GISS Surface Temperature', url: 'https://data.giss.nasa.gov/gistemp/' }
    ]
  },
  {
    iso3: 'CHN',
    iso2: 'CN',
    nameFr: 'Chine',
    nameEn: 'China',
    aliases: ['chine', 'china', 'pekin', 'beijing', 'cn', 'rpc', 'prc'],
    regionFr: 'Asie de l’Est',
    regionEn: 'East Asia',
    capitalFr: 'Pékin (Beijing)',
    capitalEn: 'Beijing',
    lat: 39.9042,
    lon: 116.4074,
    populationMillions: 1410.7,
    annualMtCO2e: 11900,
    perCapitaTonnes: 8.4,
    evolutionSince1990Percent: 379.8,
    cumulativeHistoricalSharePercent: 15.2,
    lowCarbonElectricityPercent: 36.5,
    renewableSharePercent: 31.8,
    nationalTempAnomalyC: 1.72,
    sectors: [
      {
        sectorFr: 'Production d’Électricité & Chaleur (Charbon)',
        sectorEn: 'Electricity & Heat Generation (Coal)',
        sharePercent: 46.0,
        detailFr: 'Plus grand parc mondial de centrales au charbon, bien que le solaire et l’éolien battent des records mondiaux.',
        detailEn: 'World’s largest coal power fleet, alongside record-breaking utility solar and wind additions.',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie Lourde (Acier, Ciment, Chimie, Aluminium)',
        sectorEn: 'Heavy Industry (Steel, Cement, Chemicals)',
        sharePercent: 34.0,
        detailFr: 'Production de plus de 50 % de l’acier et du ciment mondiaux.',
        detailEn: 'Produces over 50% of global crude steel, cement clinker, and solar/battery hardware.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Transports (Fret, Aviation & Flotte Électrique)',
        sectorEn: 'Transport (Freight, Aviation & EV Fleet)',
        sharePercent: 9.5,
        detailFr: 'Croissance freinée par l’électrification massive (plus de 45 % des voitures neuves sont électriques/hybrides) et le train à grande vitesse.',
        detailEn: 'Road oil demand plateauing due to >45% EV new car sales and 45,000 km of high-speed rail.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Agriculture (Riziculture & Élevage)',
        sectorEn: 'Agriculture (Rice Paddies & Livestock)',
        sharePercent: 6.5,
        detailFr: 'Méthane des rizières inondées et usage intensif d’engrais azotés.',
        detailEn: 'Anaerobic methane from flooded rice paddies and synthetic nitrogen fertilizer application.',
        color: '#059669'
      },
      {
        sectorFr: 'Bâtiments & Déchets Urbains',
        sectorEn: 'Buildings & Municipal Waste',
        sharePercent: 4.0,
        detailFr: 'Réseaux de chauffage urbain dans les provinces du Nord.',
        detailEn: 'District heating networks across northern provinces and urban waste.',
        color: '#64748B'
      }
    ],
    forestCoverPercent: 24.0,
    forestTrendFr:
      '231 millions d’hectares. Programme massif de reforestation (« Grande Muraille Verte » contre l’avancée du désert de Gobi), mais monocultures moins riches en biodiversité que les forêts primaires.',
    forestTrendEn:
      '231 million hectares. Massive afforestation programs ("Three-North Shelter Forest") against Gobi Desert expansion.',
    climateRisksFr: [
      'Fonte accélérée des glaciers du Plateau Tibétain (« Troisième Pôle ») qui alimentent le Yangtsé et le Fleuve Jaune.',
      'Vagues de chaleur extrêmes (>42 °C) et inondations de mousson dans le bassin du Yangtsé.',
      'Élévation du niveau marin menaçant les mégapoles côtières (Shanghai, Shenzhen, Guangzhou).'
    ],
    climateRisksEn: [
      'Rapid glacier retreat across the Tibetan Plateau ("Third Pole") feeding the Yangtze and Yellow Rivers.',
      'Extreme heatwaves (>42 °C) and monsoon flooding across the Yangtze River basin.',
      'Sea-level rise threatening low-lying coastal megacities (Shanghai, Guangzhou, Tianjin).'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Parc National du Panda Géant (Sichuan, Shaanxi, Gansu)',
        species: 'Panda géant (~1 864 à l’état sauvage), Panthère des neiges & Rhinopithèque',
        action:
          'Symbole mondial du WWF : création de corridors de bambous reliant 67 réserves isolées pour permettre aux pandas de migrer en altitude face au réchauffement.'
      },
      {
        title: 'Bassin du Fleuve Yangtsé & Zones Humides',
        species: 'Marsouin aptère du Yangtsé (~1 249 individus)',
        action:
          'Moratoire de 10 ans sur la pêche industrielle dans le Yangtsé et reconnexion des lacs latéraux pour restaurer les populations de marsouins.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Giant Panda National Park (Sichuan, Shaanxi, Gansu)',
        species: 'Giant Panda (~1,864 in the wild), Snow Leopard & Golden Snub-Nosed Monkey',
        action:
          'Connecting 67 fragmented reserves with high-altitude bamboo corridors so wildlife can adapt to shifting thermal zones.'
      },
      {
        title: 'Yangtze River Basin & Floodplain Restoration',
        species: 'Yangtze Finless Porpoise (~1,249 individuals)',
        action:
          'Supporting the 10-year commercial fishing ban and reconnecting floodplain lakes along the Yangtze.'
      }
    ],
    policyFrameworkTitleFr:
      'Objectifs « Double Carbone » (30/60) & Marché Carbone National ETS',
    policyFrameworkTitleEn:
      'Dual Carbon Goals (2030 Peak / 2060 Neutrality) & National ETS Carbon Market',
    target2030Fr: 'Pic des émissions de CO₂ avant 2030 & >1 200 GW éolien/solaire (objectif dépassé dès 2024)',
    target2030En: 'Peak CO₂ emissions before 2030 & >1,200 GW wind/solar (surpassed 6 years early)',
    netZeroTargetYear: 2060,
    keyLawsAndMeasuresFr: [
      'Déploiement de plus de 300 GW de solaire et d’éolien par an (plus que le reste du monde réuni).',
      'Plus grand marché carbone mondial en volume (China ETS) élargi de l’électricité à l’acier, au ciment et à l’aluminium.',
      'Électrification rapide du transport routier et réseau de 45 000 km de lignes ferroviaires à grande vitesse.'
    ],
    keyLawsAndMeasuresEn: [
      'Installing over 300 GW of new solar and wind capacity annually (more than the rest of the world combined).',
      'Expanding the national emissions trading system (China ETS) from power generation to steel, cement, and aluminum.',
      'Rapid EV adoption (>45% of new car sales) and 45,000 km high-speed rail network.'
    ],
    officialSources: [
      { label: 'Global Carbon Project — China Profile', url: 'https://globalcarbonbudget.org/' },
      { label: 'EDGAR JRC European Commission', url: 'https://edgar.jrc.ec.europa.eu/' }
    ]
  },
  {
    iso3: 'BRA',
    iso2: 'BR',
    nameFr: 'Brésil',
    nameEn: 'Brazil',
    aliases: ['bresil', 'brésil', 'brazil', 'amazonie', 'brasilia', 'br'],
    regionFr: 'Amérique du Sud',
    regionEn: 'South America',
    capitalFr: 'Brasília / Station ATTO Amazonie',
    capitalEn: 'Brasília / ATTO Amazon Station',
    lat: -15.7975,
    lon: -47.8919,
    populationMillions: 216.4,
    annualMtCO2e: 1320,
    perCapitaTonnes: 6.1,
    evolutionSince1990Percent: -6.4,
    cumulativeHistoricalSharePercent: 4.1,
    lowCarbonElectricityPercent: 89.2,
    renewableSharePercent: 88.2,
    nationalTempAnomalyC: 1.58,
    sectors: [
      {
        sectorFr: 'Changement d’Usage des Terres & Déforestation (LULUCF)',
        sectorEn: 'Land-Use Change & Deforestation (LULUCF)',
        sharePercent: 46.0,
        detailFr: 'Défrichement et brûlis en Amazonie et dans la savane du Cerrado.',
        detailEn: 'Forest clearing and burning across the Amazon Basin and Cerrado savannah.',
        color: '#059669'
      },
      {
        sectorFr: 'Agriculture & Élevage Bovin (>230 millions de têtes)',
        sectorEn: 'Agriculture & Cattle Livestock (>230M head)',
        sharePercent: 27.0,
        detailFr: 'Fermentation entérique (CH₄) du plus grand troupeau commercial mondial et culture du soja.',
        detailEn: 'Enteric methane (CH₄) from the world’s largest commercial cattle herd and soy cultivation.',
        color: '#10B981'
      },
      {
        sectorFr: 'Transports & Énergie (Fret Routier)',
        sectorEn: 'Transport & Energy (Road Freight)',
        sharePercent: 18.0,
        detailFr: 'Transport par camions diesel sur de longues distances (partiellement compensé par le bioéthanol).',
        detailEn: 'Long-haul diesel trucking (partially offset by sugarcane bioethanol in passenger cars).',
        color: '#0284C7'
      },
      {
        sectorFr: 'Industrie & Déchets',
        sectorEn: 'Industrial Processes & Waste',
        sharePercent: 9.0,
        detailFr: 'Sidérurgie, cimenterie et méthane des décharges urbaines (électricité déjà hydraulique/éolienne à 89 %).',
        detailEn: 'Steel, cement, and urban waste (electricity grid is already ~89% hydro, wind, and solar).',
        color: '#0F172A'
      }
    ],
    forestCoverPercent: 59.4,
    forestTrendFr:
      '496 millions d’hectares (plus grande forêt tropicale de la planète). Grâce à la reprise des contrôles satellites DETER/IBAMA en Amazonie, la déforestation amazonienne a reculé de plus de 30 % depuis 2023, mais la pression reste forte sur le Cerrado.',
    forestTrendEn:
      '496 million hectares (world’s largest tropical rainforest). Strengthened IBAMA/DETER satellite enforcement has reduced Amazon deforestation by >30% since 2023, though Cerrado clearing remains high.',
    climateRisksFr: [
      'Risque de point de bascule (« savanisation » de l’Amazonie) si la déforestation cumulée dépasse 20 à 25 %.',
      'Sécheresses historiques des fleuves Rio Negro et Solimões isolant les communautés et asséchant le Pantanal.',
      'Impact sur les barrages hydroélectriques qui fournissent plus de 60 % de l’électricité brésilienne.'
    ],
    climateRisksEn: [
      'Amazon dieback tipping point risk ("savannization") if cumulative deforestation exceeds 20–25%.',
      'Record river droughts along the Rio Negro and Solimões and severe wildfires across the Pantanal wetlands.',
      'Hydrological volatility affecting hydroelectric dams that supply >60% of Brazil’s power.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Programme ARPA (Aires Protégées d’Amazonie)',
        species: 'Jaguar, Dauphin rose de l’Amazone (Boto), Ara hyacinthe & Paresseux',
        action:
          'Plus grand programme mondial de conservation tropicale co-fondé par le WWF : sanctuarisation de 62 millions d’hectares (1,1× la surface de la France) en partenariat avec les peuples autochtones.'
      },
      {
        title: 'Zones Humides du Pantanal & Savane du Cerrado',
        species: 'Loup à crinière, Tamanoir géant & Loutre géante',
        action:
          'Brigades communautaires de lutte contre les mégafeux et traçabilité « zéro déforestation » des chaînes du soja et du bœuf.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'ARPA Program (Amazon Region Protected Areas)',
        species: 'Jaguar, Amazon River Dolphin (Boto), Hyacinth Macaw & Giant Otter',
        action:
          'World’s largest tropical forest conservation initiative co-founded by WWF: permanently protecting 62 million hectares alongside Indigenous territories.'
      },
      {
        title: 'Pantanal Wetlands & Cerrado Savannah Defense',
        species: 'Maned Wolf, Giant Anteater & Tapir',
        action:
          'Deploying community wildfire brigades and enforcing zero-deforestation soy and beef supply chain traceability.'
      }
    ],
    policyFrameworkTitleFr:
      'Plan PPCDAm (Objectif Zéro Déforestation Illégale 2030) & Hôte de la COP30 (Belém)',
    policyFrameworkTitleEn:
      'PPCDAm Action Plan (Zero Illegal Deforestation by 2030) & COP30 Host (Belém)',
    target2030Fr: '-53 % d’émissions nettes en 2030 (vs 2005) & Zéro Déforestation Illégale d’ici 2030',
    target2030En: '-53% net GHG emissions by 2030 (below 2005) & Zero Illegal Deforestation by 2030',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Relance du Fonds Amazone (Fundo Amazônia) et surveillance radar/satellite en temps réel (INPE DETER) contre l’accaparement illégal des terres.',
      'Mix électrique déjà renouvelable à près de 89 % (hydroélectricité + essor massif de l’éolien et du solaire dans le Nordeste).',
      'Création d’un marché réglementé du carbone brésilien (SBCE) et restauration de 12 millions d’hectares de forêts dégradées.'
    ],
    keyLawsAndMeasuresEn: [
      'Reactivation of the Amazon Fund and real-time INPE DETER satellite enforcement against illegal land grabbing.',
      'Power grid already ~89% renewable (hydropower plus rapid wind and solar growth across the Northeast).',
      'Launch of the Brazilian Regulated Carbon Market (SBCE) and commitment to restore 12 million hectares of degraded forest.'
    ],
    officialSources: [
      { label: 'INPE TerraBrasilis — Surveillance Satellite Amazonie', url: 'https://terrabrasilis.dpi.inpe.br/' },
      { label: 'SEEG Brasil — Inventaire GES Brésil', url: 'https://seeg.eco.br/' },
      { label: 'WWF Brasil — Amazônia & Cerrado', url: 'https://www.wwf.org.br/' }
    ]
  },
  {
    iso3: 'DEU',
    iso2: 'DE',
    nameFr: 'Allemagne',
    nameEn: 'Germany',
    aliases: ['allemagne', 'germany', 'deutschland', 'berlin', 'de'],
    regionFr: 'Europe Centrale (Union Européenne)',
    regionEn: 'Central Europe (European Union)',
    capitalFr: 'Berlin',
    capitalEn: 'Berlin',
    lat: 52.52,
    lon: 13.405,
    populationMillions: 84.5,
    annualMtCO2e: 595,
    perCapitaTonnes: 7.1,
    evolutionSince1990Percent: -43.4,
    cumulativeHistoricalSharePercent: 5.4,
    lowCarbonElectricityPercent: 56.0,
    renewableSharePercent: 52.4,
    nationalTempAnomalyC: 1.8,
    sectors: [
      {
        sectorFr: 'Industrie de l’Énergie (Charbon/Lignite & Gaz)',
        sectorEn: 'Energy Industry (Coal/Lignite & Gas)',
        sharePercent: 31.0,
        detailFr: 'En forte baisse grâce au dépassement des 52 % d’électricité renouvelable (éolien et solaire), mais maintien résiduel du lignite.',
        detailEn: 'Declining rapidly as wind and solar exceed 52% of electricity, though residual lignite remains.',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie Manufacturière, Chimie & Sidérurgie',
        sectorEn: 'Manufacturing, Chemicals & Steelmaking',
        sharePercent: 24.0,
        detailFr: 'Grands pôles industriels de la Ruhr, chimie (BASF) et construction mécanique.',
        detailEn: 'Ruhr Valley steelworks, heavy chemicals, and automotive manufacturing.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Transports Routiers & Fret',
        sectorEn: 'Road Transport & Freight',
        sharePercent: 22.0,
        detailFr: 'Autoroutes à fort trafic de transit européen et parc automobile thermique.',
        detailEn: 'High-volume European transit freight corridors and passenger car fleet.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Bâtiments & Chauffage Urbain',
        sectorEn: 'Buildings & Space Heating',
        sharePercent: 15.0,
        detailFr: 'Chauffage résidentiel majoritairement au gaz fossile et au fioul.',
        detailEn: 'Residential heating historically reliant on imported natural gas and oil.',
        color: '#64748B'
      },
      {
        sectorFr: 'Agriculture & Tourbières Drainées',
        sectorEn: 'Agriculture & Drained Peatlands',
        sharePercent: 8.0,
        detailFr: 'Élevage intensif et émissions de CO₂ issues des tourbières agricoles drainées du Nord.',
        detailEn: 'Livestock farming and CO₂ release from drained agricultural peatlands in northern Germany.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 32.7,
    forestTrendFr:
      '11,4 millions d’hectares. Les forêts d’épicéas et de hêtres (Harz, Forêt-Noire) souffrent d’un dépérissement lié aux sécheresses et aux scolytes.',
    forestTrendEn:
      '11.4 million hectares. Spruce and beech forests (Harz, Black Forest) face severe drought dieback and bark beetle infestations.',
    climateRisksFr: [
      'Crues éclairs extrêmes (comme dans la vallée de l’Ahr) alternant avec des étiages du Rhin perturbant le transport fluvial.',
      'Dépérissement des monocultures d’épicéas et feux de forêt dans le Brandebourg.'
    ],
    climateRisksEn: [
      'Extreme flash flooding (such as the Ahr Valley disaster) alternating with low Rhine River water levels.',
      'Dieback of spruce monocultures and summer forest fires in Brandenburg.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Mer des Wadden (UNESCO) & Baltique',
        species: 'Phoque gris, Marsouin commun & Oiseaux migrateurs',
        action:
          'Protection des vasières côtières (stockage de carbone bleu) et restauration des récifs et herbiers marins en mer Baltique.'
      },
      {
        title: 'Réhydratation des Tourbières & Retour du Lynx / Loup',
        species: 'Lynx boréal, Loup, Pygargue à queue blanche & Bison d’Europe',
        action:
          'Remise en eau des tourbières allemandes (qui représentent 7 % des émissions nationales de GES) et conversion des forêts en peuplements mixtes résilients.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Wadden Sea (UNESCO) & Baltic Marine Conservation',
        species: 'Grey Seal, Harbour Porpoise & Migratory Shorebirds',
        action:
          'Conserving tidal mudflats ("blue carbon" sinks) and restoring seagrass beds across the Baltic coast.'
      },
      {
        title: 'Peatland Rewetting & Mixed Forest Restoration',
        species: 'Eurasian Lynx, Wolf & White-Tailed Eagle',
        action:
          'Rewetting drained peatlands (which account for ~7% of Germany’s GHG emissions) and converting spruce monocultures into climate-resilient broadleaf forests.'
      }
    ],
    policyFrameworkTitleFr:
      'Loi Fédérale sur la Protection du Climat (Klimaschutzgesetz) & Energiewende',
    policyFrameworkTitleEn:
      'Federal Climate Change Act (Klimaschutzgesetz) & Energiewende',
    target2030Fr: '-65 % d’émissions de GES en 2030 (vs 1990) & 80 % d’électricité renouvelable en 2030',
    target2030En: '-65% GHG emissions by 2030 (vs 1990) & 80% renewable electricity by 2030',
    netZeroTargetYear: 2045,
    keyLawsAndMeasuresFr: [
      'Objectif légal de neutralité climatique dès 2045 (5 ans avant la cible européenne de 2050).',
      'Passage à 80 % d’électricité renouvelable d’ici 2030 (déjà >52 %) et sortie accélérée du charbon.',
      'Loi sur l’énergie des bâtiments (GEG) imposant 65 % d’énergies renouvelables pour tout nouveau système de chauffage.'
    ],
    keyLawsAndMeasuresEn: [
      'Legally binding climate neutrality target set for 2045 (five years ahead of the EU 2050 target).',
      '80% renewable electricity mandate by 2030 (already >52%) alongside coal phase-out.',
      'Building Energy Act (GEG) requiring 65% renewable energy for newly installed heating systems.'
    ],
    officialSources: [
      { label: 'Umweltbundesamt (UBA) — Agence Fédérale Environnement', url: 'https://www.umweltbundesamt.de/' },
      { label: 'EEA Europa.eu — Germany Climate Profile', url: 'https://www.eea.europa.eu/' },
      { label: 'WWF Deutschland', url: 'https://www.wwf.de/' }
    ]
  },
  {
    iso3: 'CAN',
    iso2: 'CA',
    nameFr: 'Canada',
    nameEn: 'Canada',
    aliases: ['canada', 'quebec', 'québec', 'ottawa', 'montreal', 'ca'],
    regionFr: 'Amérique du Nord',
    regionEn: 'North America',
    capitalFr: 'Ottawa',
    capitalEn: 'Ottawa',
    lat: 45.4215,
    lon: -75.6972,
    populationMillions: 40.5,
    annualMtCO2e: 548,
    perCapitaTonnes: 14.1,
    evolutionSince1990Percent: 19.1,
    cumulativeHistoricalSharePercent: 2.0,
    lowCarbonElectricityPercent: 82.5,
    renewableSharePercent: 67.8,
    nationalTempAnomalyC: 2.1,
    sectors: [
      {
        sectorFr: 'Extraction Pétrolière & Gazière (Sables Bitumineux)',
        sectorEn: 'Oil & Gas Extraction (Oil Sands)',
        sharePercent: 31.0,
        detailFr: '1er poste d’émission canadien (extraction thermique des sables bitumineux en Alberta et gaz).',
        detailEn: 'Canada’s #1 emission source (steam-assisted oil sands extraction in Alberta and fossil gas).',
        color: '#0F172A'
      },
      {
        sectorFr: 'Transports Routiers, Ferroviaires & Aériens',
        sectorEn: 'Road, Rail & Domestic Aviation Transport',
        sharePercent: 22.0,
        detailFr: 'Longues distances continentales et parc de véhicules lourds (pick-ups/camions).',
        detailEn: 'Vast continental distances and heavy-duty vehicle/pickup fleet.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Bâtiments & Chauffage Hivernal',
        sectorEn: 'Buildings & Winter Space Heating',
        sharePercent: 13.0,
        detailFr: 'Chauffage au gaz naturel (sauf au Québec où l’hydroélectricité domine).',
        detailEn: 'Natural gas winter heating (except in Quebec and BC where hydroelectricity dominates).',
        color: '#64748B'
      },
      {
        sectorFr: 'Industrie Lourde & Mines',
        sectorEn: 'Heavy Industry & Mining',
        sharePercent: 11.0,
        detailFr: 'Alumineries (décarbonées au Québec), sidérurgie, chimie et mines.',
        detailEn: 'Mining, chemicals, steelmaking, and aluminum smelting.',
        color: '#D97706'
      },
      {
        sectorFr: 'Agriculture & Électricité Résiduelle',
        sectorEn: 'Agriculture & Residual Power',
        sharePercent: 23.0,
        detailFr: 'Grandes cultures des Prairies (Saskatchewan, Manitoba) et centrales gaz/charbon de l’Ouest.',
        detailEn: 'Prairie grain and cattle agriculture plus fossil power in Alberta and Saskatchewan.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 38.7,
    forestTrendFr:
      '347 millions d’hectares de forêt boréale. En 2023, des mégafeux sans précédent ont brûlé plus de 15 millions d’hectares, émettant plus de CO₂ que l’ensemble de l’économie canadienne.',
    forestTrendEn:
      '347 million hectares of boreal forest. Record-shattering 2023 wildfires burned over 15 million hectares, releasing immense boreal carbon stocks.',
    climateRisksFr: [
      'Le Canada se réchauffe 2 fois plus vite que la moyenne mondiale (et 3 à 4 fois plus vite dans le Grand Nord canadien).',
      'Dégel du pergélisol arctique déstabilisant les infrastructures et libérant du méthane.',
      'Mégafeux boréaux récurrents au Québec, en Colombie-Britannique et dans les Territoires du Nord-Ouest.'
    ],
    climateRisksEn: [
      'Canada is warming at twice the global average rate (and 3–4× faster across the Canadian Arctic).',
      'Thawing Arctic permafrost destabilizing northern infrastructure and releasing methane.',
      'Unprecedented boreal wildfire seasons across Quebec, British Columbia, and Alberta.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Dernier Refuge de Glace (Last Ice Area — Haut Arctique)',
        species: 'Ours polaire (60 % de la population mondiale vit au Canada), Narval & Béluga',
        action:
          'Le WWF-Canada et les communautés inuites ont obtenu la création de l’aire marine protégée de Tuvaijuittuq dans l’Archipel Arctique, où la banquise d’été résistera le plus longtemps.'
      },
      {
        title: 'Forêt Boréale & Tourbières de la Baie d’Hudson',
        species: 'Caribou boréal, Saumon du Pacifique & Épaulard résident du Sud',
        action:
          'Protection des tourbières de la baie d’Hudson (qui stockent l’équivalent de 35 milliards de tonnes de carbone) en cogestion avec les Premières Nations.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'The Last Ice Area ( Tuvaijuittuq High Arctic Sanctuary)',
        species: 'Polar Bear (60% of the global population lives in Canada), Narwhal & Beluga',
        action:
          'WWF-Canada and Inuit communities secured the Tuvaijuittuq Marine Protected Area to safeguard the Arctic’s most resilient summer sea ice.'
      },
      {
        title: 'Hudson Bay Peatlands & Boreal Caribou Habitat',
        species: 'Boreal Woodland Caribou, Pacific Salmon & Southern Resident Killer Whale',
        action:
          'Indigenous-led conservation of the Hudson Bay Lowlands, which store over 35 billion tonnes of soil carbon.'
      }
    ],
    policyFrameworkTitleFr:
      'Loi Canadienne sur la Responsabilité en Matière de Carboneutralité & Cadre de la Biodiversité de Montréal (COP15)',
    policyFrameworkTitleEn:
      'Canadian Net-Zero Emissions Accountability Act & Montreal COP15 30×30 Framework',
    target2030Fr: '-40 à -45 % d’émissions de GES en 2030 (vs 2005) & -75 % de méthane pétrogazier',
    target2030En: '-40% to -45% GHG emissions by 2030 (below 2005) & -75% oil/gas methane',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Tarification fédérale de la pollution par le carbone et système de plafonnement et d’échange au Québec.',
      'Mix électrique déjà décarboné à plus de 82 % (hydroélectricité au Québec, en Colombie-Britannique et au Manitoba + nucléaire en Ontario).',
      'Engagement de protéger 30 % des terres et des océans du Canada d’ici 2030 (Accords de conservation autochtones).'
    ],
    keyLawsAndMeasuresEn: [
      'National carbon pricing system and Quebec’s cap-and-trade carbon market.',
      'Electricity grid already >82% non-emitting (hydroelectricity in Quebec, BC, and Manitoba + nuclear in Ontario).',
      'Commitment to conserve 30% of Canada’s lands and oceans by 2030 through Indigenous Protected and Conserved Areas (IPCAs).'
    ],
    officialSources: [
      { label: 'Environnement et Changement Climatique Canada', url: 'https://www.canada.ca/fr/environnement-changement-climatique.html' },
      { label: 'WWF-Canada — Régénérer le Canada', url: 'https://wwf.ca/fr/' }
    ]
  },
  {
    iso3: 'IND',
    iso2: 'IN',
    nameFr: 'Inde',
    nameEn: 'India',
    aliases: ['inde', 'india', 'new delhi', 'delhi', 'in'],
    regionFr: 'Asie du Sud',
    regionEn: 'South Asia',
    capitalFr: 'New Delhi',
    capitalEn: 'New Delhi',
    lat: 28.6139,
    lon: 77.209,
    populationMillions: 1428.6,
    annualMtCO2e: 3060,
    perCapitaTonnes: 2.1,
    evolutionSince1990Percent: 393.5,
    cumulativeHistoricalSharePercent: 3.4,
    lowCarbonElectricityPercent: 24.8,
    renewableSharePercent: 21.5,
    nationalTempAnomalyC: 1.42,
    sectors: [
      {
        sectorFr: 'Production d’Électricité (Charbon Thermique)',
        sectorEn: 'Electricity Generation (Thermal Coal)',
        sharePercent: 44.0,
        detailFr: 'Plus de 70 % de l’électricité provient encore du charbon, malgré un boom massif du solaire photovoltaïque.',
        detailEn: 'Over 70% of power still comes from coal, alongside one of the world’s fastest solar buildouts.',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie (Acier, Ciment & Briqueteries)',
        sectorEn: 'Industry (Steel, Cement & Brick Kilns)',
        sharePercent: 23.0,
        detailFr: 'Urbanisation rapide nécessitant d’immenses volumes de ciment et d’acier.',
        detailEn: 'Rapid infrastructure urbanization driving steel, cement, and fertilizer demand.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Agriculture (Bovins, Buffles & Riziculture)',
        sectorEn: 'Agriculture (Cattle, Buffalo & Rice Paddies)',
        sharePercent: 18.0,
        detailFr: 'Premier cheptel laitier mondial (méthane entérique CH₄) et rizières irriguées.',
        detailEn: 'World’s largest dairy herd (enteric methane CH₄) and monsoon rice cultivation.',
        color: '#059669'
      },
      {
        sectorFr: 'Transports & Ménages',
        sectorEn: 'Transport & Residential',
        sharePercent: 15.0,
        detailFr: 'Électrification quasi totale du réseau ferroviaire indien (Indian Railways) et essor des 2/3-roues électriques.',
        detailEn: 'Near-complete electrification of Indian Railways and rapid electric 2/3-wheeler adoption.',
        color: '#0284C7'
      }
    ],
    forestCoverPercent: 24.4,
    forestTrendFr:
      '72 millions d’hectares (Ghâts occidentaux, Himalaya, mangroves des Sundarbans). Pression démographique et minière sur les corridors forestiers.',
    forestTrendEn:
      '72 million hectares (Western Ghats, Himalayas, Sundarbans mangroves).',
    climateRisksFr: [
      'Vagues de chaleur humides pré-mousson dépassant 48 à 50 °C à New Delhi et dans la plaine indo-gangétique.',
      'Fonte des glaciers himalayens menaçant les bassins du Gange et du Brahmapoutre.',
      'Submersion saline dans le delta des Sundarbans.'
    ],
    climateRisksEn: [
      'Severe pre-monsoon humid heatwaves reaching 48–50 °C across Delhi and the Indo-Gangetic Plains.',
      'Himalayan glacier retreat threatening dry-season flows of the Ganges and Brahmaputra.',
      'Sea-level rise and cyclones impacting the Sundarbans delta.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Project Tiger, Éléphant d’Asie & Rhinocéros Unicorne',
        species: 'Tigre du Bengale (>3 680 en Inde, 75 % de la population mondiale) & Rhinocéros',
        action:
          'Grâce au Project Tiger soutenu par le WWF-India, la population de tigres sauvages a plus que doublé en 15 ans, protégeant simultanément d’immenses forêts et bassins versants.'
      },
      {
        title: 'Mangroves des Sundarbans',
        species: 'Dauphin du Gange & Tortue olivâtre',
        action:
          'Restauration des mangroves côtières qui agissent comme bouclier naturel contre les cyclones et puits de carbone bleu.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Project Tiger, Asian Elephant & Greater One-Horned Rhino',
        species: 'Bengal Tiger (>3,680 in India, 75% of the global wild population) & Rhino',
        action:
          'Through Project Tiger and WWF-India landscape corridors, India’s wild tiger population has more than doubled, safeguarding critical forest watersheds.'
      },
      {
        title: 'Sundarbans Mangrove & Ganges River Conservation',
        species: 'Ganges River Dolphin & Olive Ridley Turtle',
        action:
          'Restoring coastal mangroves as cyclone buffers and high-density blue carbon sinks.'
      }
    ],
    policyFrameworkTitleFr:
      'Stratégie « Panchamrit » (500 GW Non-Fossiles en 2030) & Alliance Solaire Internationale',
    policyFrameworkTitleEn:
      'Panchamrit Pledge (500 GW Non-Fossil Capacity by 2030) & International Solar Alliance',
    target2030Fr: '50 % de capacité électrique non-fossile en 2030 & -45 % d’intensité carbone du PIB',
    target2030En: '50% non-fossil power capacity by 2030 & -45% GDP emissions intensity',
    netZeroTargetYear: 2070,
    keyLawsAndMeasuresFr: [
      'Émissions par habitant très faibles (2,1 tCO₂/hab contre 14,6 t aux États-Unis et 4,7 t en moyenne mondiale).',
      'Déploiement de parcs solaires géants (Bhadla, Khavda 30 GW) et électrification à plus de 95 % du réseau ferré Indian Railways.',
      'Mission Nationale Hydrogène Vert et programme Ujjwala remplaçant la biomasse de cuisson par du GPL et l’induction.'
    ],
    keyLawsAndMeasuresEn: [
      'Low per-capita footprint (2.1 tCO₂/cap vs 14.6 t in the US and 4.7 t global average).',
      'Ultra-scale solar parks (Bhadla, Khavda 30 GW) and >95% electrification of Indian Railways.',
      'National Green Hydrogen Mission and clean cooking transition.'
    ],
    officialSources: [
      { label: 'Ministry of Environment, Forest and Climate Change (India)', url: 'https://moef.gov.in/' },
      { label: 'WWF-India', url: 'https://www.wwfindia.org/' }
    ]
  },
  {
    iso3: 'MAR',
    iso2: 'MA',
    nameFr: 'Maroc',
    nameEn: 'Morocco',
    aliases: ['maroc', 'morocco', 'rabat', 'casablanca', 'marrakech', 'ma'],
    regionFr: 'Afrique du Nord & Méditerranée',
    regionEn: 'North Africa & Mediterranean',
    capitalFr: 'Rabat',
    capitalEn: 'Rabat',
    lat: 34.0209,
    lon: -6.8416,
    populationMillions: 37.8,
    annualMtCO2e: 76,
    perCapitaTonnes: 2.0,
    evolutionSince1990Percent: 185.0,
    cumulativeHistoricalSharePercent: 0.15,
    lowCarbonElectricityPercent: 39.5,
    renewableSharePercent: 39.5,
    nationalTempAnomalyC: 1.75,
    sectors: [
      {
        sectorFr: 'Production d’Électricité & Énergie',
        sectorEn: 'Electricity & Energy Supply',
        sharePercent: 38.0,
        detailFr: 'En transition rapide grâce aux complexes solaires (Noor Ouarzazate) et éoliens (Tarfaya, Boujdour).',
        detailEn: 'Rapidly transitioning via utility solar (Noor Ouarzazate) and coastal wind farms (Tarfaya).',
        color: '#D97706'
      },
      {
        sectorFr: 'Transports Routiers & Logistique',
        sectorEn: 'Road Transport & Logistics',
        sharePercent: 28.0,
        detailFr: 'Croissance du parc automobile, compensée par le TGV Al Boraq alimenté à l’énergie éolienne.',
        detailEn: 'Road fleet growth, balanced by the wind-powered Al Boraq high-speed rail line.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Agriculture & Élevage',
        sectorEn: 'Agriculture & Livestock',
        sharePercent: 20.0,
        detailFr: 'Élevage ovin/bovin et pompage d’irrigation.',
        detailEn: 'Sheep/cattle livestock and agricultural irrigation pumping.',
        color: '#059669'
      },
      {
        sectorFr: 'Industrie (Phosphates OCP, Ciment, Automobile)',
        sectorEn: 'Industry (Phosphates, Cement, Automotive)',
        sharePercent: 14.0,
        detailFr: 'Le groupe OCP décarbone massivement sa production d’engrais via l’énergie solaire et l’ammoniac vert.',
        detailEn: 'OCP Group is rapidly decarbonizing fertilizer production using solar power and green ammonia.',
        color: '#0F172A'
      }
    ],
    forestCoverPercent: 12.9,
    forestTrendFr:
      '5,7 millions d’hectares (cèdres de l’Atlas, chêne-liège, arganeraie du Souss). Programme « Forêts du Maroc 2020-2030 » visant le reboisement de 600 000 hectares.',
    forestTrendEn:
      '5.7 million hectares (Atlas cedar, cork oak, and Souss Argan biosphere). "Forests of Morocco 2020–2030" targets 600,000 ha of reforestation.',
    climateRisksFr: [
      'Stress hydrique structurel après 6 années consécutives de sécheresse sévère (barrages à moins de 30 % de remplissage).',
      'Avancée de l’aridité vers le nord et baisse de l’enneigement du Haut et Moyen Atlas.'
    ],
    climateRisksEn: [
      'Severe structural water stress following six consecutive years of drought.',
      'Reduced snowpack in the High and Middle Atlas mountains ("water tower of Morocco").'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Cédraies de l’Atlas & Ibis Chauve (Parc National de Souss-Massa)',
        species: 'Singe Magot (Macaque de Barbarie), Ibis chauve, Gazelle dorcas & Panthère de Barbarie',
        action:
          'Protection de la dernière population sauvage viable au monde d’Ibis chauves à Souss-Massa, préservation des forêts de cèdres du Moyen Atlas et gestion durable des zones humides (Merja Zerga).'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Atlas Cedar Forests & Northern Bald Ibis (Souss-Massa)',
        species: 'Barbary Macaque, Northern Bald Ibis & Cuvier’s Gazelle',
        action:
          'Protecting the world’s last viable wild population of Northern Bald Ibis in Souss-Massa and conserving Atlas cedar forests and Ramsar wetlands.'
      }
    ],
    policyFrameworkTitleFr:
      'Stratégie Nationale Énergétique (52 % Renouvelables en 2030) & Plan National de l’Eau',
    policyFrameworkTitleEn:
      'National Energy Strategy (52% Renewables by 2030) & National Water Plan',
    target2030Fr: '-45,5 % d’émissions de GES en 2030 (par rapport au scénario tendanciel) & 52 % de capacité électrique renouvelable',
    target2030En: '-45.5% GHG emissions by 2030 (vs BAU) & 52% renewable power capacity',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'L’un des pays les mieux classés au monde par le Climate Change Performance Index (CCPI) avec une empreinte de seulement 2,0 tCO₂/habitant.',
      'Mégaprojets solaires (Noor) et éoliens visant plus de 52 % de capacité électrique renouvelable avant 2030.',
      'Construction massive d’usines de dessalement d’eau de mer alimentées à 100 % par des parcs éoliens et solaires (Agadir, Casablanca, Dakhla).'
    ],
    keyLawsAndMeasuresEn: [
      'Ranked among the top global performers in the Climate Change Performance Index (CCPI) with a low 2.0 tCO₂/capita footprint.',
      'Noor solar and wind megaprojects exceeding 52% renewable installed capacity by 2030.',
      'Large-scale seawater desalination plants powered by 100% renewable wind and solar energy.'
    ],
    officialSources: [
      { label: 'Ministère de la Transition Énergétique et du Développement Durable (Maroc)', url: 'https://www.environnement.gov.ma/' },
      { label: 'WWF Afrique du Nord', url: 'https://www.wwf.fr/' }
    ]
  },
  {
    iso3: 'CHE',
    iso2: 'CH',
    nameFr: 'Suisse',
    nameEn: 'Switzerland',
    aliases: ['suisse', 'switzerland', 'confederation helvetique', 'geneve', 'genève', 'berne', 'zurich', 'ch'],
    regionFr: 'Europe Centrale (Espace Alpin)',
    regionEn: 'Central Europe (Alpine Region)',
    capitalFr: 'Berne / Genève (Siège GIEC, OMM & WWF International)',
    capitalEn: 'Bern / Geneva (HQ of IPCC, WMO & WWF International)',
    lat: 46.948,
    lon: 7.4474,
    populationMillions: 8.9,
    annualMtCO2e: 41.5,
    perCapitaTonnes: 4.7,
    evolutionSince1990Percent: -24.0,
    cumulativeHistoricalSharePercent: 0.3,
    lowCarbonElectricityPercent: 97.5,
    renewableSharePercent: 76.2,
    nationalTempAnomalyC: 2.8,
    sectors: [
      {
        sectorFr: 'Transports Routiers & Aviation Internationale',
        sectorEn: 'Road Transport & Aviation',
        sharePercent: 32.0,
        detailFr: '1er émetteur territorial (électricité ferroviaire CFF déjà 90 % hydraulique).',
        detailEn: '#1 domestic emitter (while SBB/CFF rail is already 90% hydro-powered).',
        color: '#0284C7'
      },
      {
        sectorFr: 'Bâtiments & Chauffage (Mazout & Gaz)',
        sectorEn: 'Buildings & Heating (Oil & Gas)',
        sharePercent: 24.0,
        detailFr: 'En forte baisse grâce au remplacement des chaudières à mazout par des pompes à chaleur.',
        detailEn: 'Declining steadily as oil boilers are replaced by heat pumps and district heating.',
        color: '#64748B'
      },
      {
        sectorFr: 'Industrie & Incinération des Déchets',
        sectorEn: 'Industry & Waste Incineration',
        sharePercent: 24.0,
        detailFr: 'Cimenteries, chimie-pharma et usines d’incinération des ordures ménagères.',
        detailEn: 'Cement plants, chemical/pharma manufacturing, and waste-to-energy plants.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Agriculture & Élevage Alpin',
        sectorEn: 'Alpine Agriculture & Dairy Livestock',
        sharePercent: 20.0,
        detailFr: 'Élevage bovin laitier et fertilisation des sols.',
        detailEn: 'Dairy cattle methane and agricultural soil management.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 31.9,
    forestTrendFr:
      '1,31 million d’hectares. Les forêts protectrices alpines jouent un rôle vital contre les avalanches et les glissements de terrain.',
    forestTrendEn:
      '1.31 million hectares. Alpine protection forests are critical against avalanches, rockfalls, and landslides.',
    climateRisksFr: [
      'La Suisse se réchauffe à +2,8 °C (près de 2 fois la moyenne mondiale) en raison de l’amplification alpine.',
      'Perte de 60 % du volume des glaciers suisses depuis 1850 (dont -10 % sur les deux seules années 2022-2023).',
      'Dégel du pergélisol de haute montagne provoquant des éboulements rocheux et laves torrentielles.'
    ],
    climateRisksEn: [
      'Switzerland has warmed by +2.8 °C (nearly twice the global average) due to Alpine amplification.',
      'Swiss glaciers have lost 60% of their volume since 1850 (losing 10% in 2022–2023 alone).',
      'High-altitude permafrost thaw triggering rockfalls and debris flows.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Siège Mondial du WWF (Gland, Vaud) & Biodiversité Alpine',
        species: 'Lynx boréal, Gypaète barbu, Castor & Truite lacustre',
        action:
          'Fondé en Suisse (Morges/Gland) en 1961, le WWF Suisse revitalise les cours d’eau alpins artificialisés, protège le lynx et le gypaète barbu et agit sur la place financière suisse.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'WWF International Headquarters (Gland) & Alpine River Restoration',
        species: 'Eurasian Lynx, Bearded Vulture, Beaver & Alpine Ibex',
        action:
          'Founded in Switzerland in 1961, WWF Switzerland restores channelized Alpine rivers, protects lynx and bearded vultures, and audits Swiss financial sector climate alignment.'
      }
    ],
    policyFrameworkTitleFr:
      'Loi sur le Climat et l’Innovation (Acceptée par référendum à 59,1 %) & Loi sur l’Électricité',
    policyFrameworkTitleEn:
      'Climate and Innovation Act (Approved by 59.1% Referendum) & Federal Electricity Act',
    target2030Fr: '-50 % d’émissions de GES en 2030 (vs 1990)',
    target2030En: '-50% GHG emissions by 2030 (below 1990 levels)',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Loi sur le Climat et l’Innovation (zéro émission nette en 2050 inscrite dans la loi après votation populaire).',
      'Mix électrique déjà décarboné à 97,5 % (hydroélectricité alpine + nucléaire + essor photovoltaïque alpin).',
      'Taxe incitative sur le CO₂ (120 CHF / tonne de CO₂ sur les combustibles fossiles) redistribuée en partie à la population.'
    ],
    keyLawsAndMeasuresEn: [
      'Climate and Innovation Act enshrining Net-Zero 2050 into law via national referendum.',
      'Electricity grid already 97.5% low-carbon (Alpine hydroelectricity, nuclear, and high-altitude solar).',
      'CO₂ levy (120 CHF per tonne of CO₂ on heating fuels) partially redistributed as a dividend to citizens.'
    ],
    officialSources: [
      { label: 'OFEV / BAFU — Office Fédéral de l’Environnement (Suisse)', url: 'https://www.bafu.admin.ch/' },
      { label: 'MétéoSuisse — Changement Climatique en Suisse', url: 'https://www.meteosuisse.admin.ch/' },
      { label: 'WWF Suisse', url: 'https://www.wwf.ch/fr' }
    ]
  },
  {
    iso3: 'COD',
    iso2: 'CD',
    nameFr: 'République Démocratique du Congo (RDC)',
    nameEn: 'Democratic Republic of the Congo (DRC)',
    aliases: ['rdc', 'congo', 'republique democratique du congo', 'drc', 'kinshasa', 'bassin du congo', 'cd'],
    regionFr: 'Afrique Centrale (Bassin du Congo)',
    regionEn: 'Central Africa (Congo Basin)',
    capitalFr: 'Kinshasa',
    capitalEn: 'Kinshasa',
    lat: -4.4419,
    lon: 15.2663,
    populationMillions: 102.3,
    annualMtCO2e: 480,
    perCapitaTonnes: 0.04,
    evolutionSince1990Percent: 18.0,
    cumulativeHistoricalSharePercent: 0.05,
    lowCarbonElectricityPercent: 99.0,
    renewableSharePercent: 99.0,
    nationalTempAnomalyC: 1.4,
    sectors: [
      {
        sectorFr: 'Déforestation & Agriculture sur Brûlis (LULUCF)',
        sectorEn: 'Deforestation & Slash-and-Burn Agriculture (LULUCF)',
        sharePercent: 91.0,
        detailFr: 'Plus de 90 % des émissions proviennent de la coupe de bois de chauffe (charbon makala) et de l’agriculture de subsistance.',
        detailEn: 'Over 90% of gross emissions stem from wood-charcoal (makala) harvesting and subsistence clearing.',
        color: '#059669'
      },
      {
        sectorFr: 'Énergie, Mines & Transports',
        sectorEn: 'Energy, Mining & Transport',
        sharePercent: 9.0,
        detailFr: 'Émissions fossiles par habitant parmi les plus faibles au monde (0,04 tCO₂/hab).',
        detailEn: 'Fossil CO₂ emissions per capita are among the lowest on Earth (0.04 tCO₂/cap).',
        color: '#0F172A'
      }
    ],
    forestCoverPercent: 55.6,
    forestTrendFr:
      '126 millions d’hectares (60 % du Bassin du Congo, 2e poumon vert mondial). Le Bassin du Congo est aujourd’hui le dernier grand bassin tropical qui absorbe encore nettement plus de CO₂ qu’il n’en émet (-0,6 GtCO₂ net/an), et ses tourbières de la Cuvette Centrale stockent 30 milliards de tonnes de carbone.',
    forestTrendEn:
      '126 million hectares (60% of the Congo Basin). The Congo Basin remains the world’s strongest net tropical forest carbon sink (-0.6 GtCO₂ net/yr), while the Cuvette Centrale peatlands store 30 Gt of carbon.',
    climateRisksFr: [
      'Pression sur la forêt primaire liée à la pauvreté énergétique (dépendance au charbon de bois à Kinshasa et Goma).',
      'Risque d’assèchement des tourbières de la Cuvette Centrale.'
    ],
    climateRisksEn: [
      'Deforestation pressure driven by energy poverty (wood-charcoal cooking in growing cities).',
      'Vulnerability of the Cuvette Centrale peatlands to drought and hydrocarbon exploration.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Parc National des Virunga, Salonga & Forêt de l’Ituri',
        species: 'Gorille de montagne, Gorille de Grauer, Bonobo (endémique RDC), Okapi & Éléphant de forêt',
        action:
          'Le WWF-RDC soutient les écogardes de l’ICCN, développe l’agroforesterie durable (cacao/café sans déforestation) et distribue des foyers de cuisson améliorés réduisant de 50 % la coupe de bois autour du parc des Virunga.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Virunga, Salonga & Cuvette Centrale Peatlands',
        species: 'Mountain Gorilla, Bonobo (endemic to DRC), Okapi & African Forest Elephant',
        action:
          'WWF-DRC supports ICCN eco-rangers, promotes zero-deforestation cocoa/coffee agroforestry, and distributes efficient cookstoves that cut wood-charcoal harvesting around Virunga by 50%.'
      }
    ],
    policyFrameworkTitleFr:
      'Statut de « Pays-Solution » Climatique & Initiative des Forêts d’Afrique Centrale (CAFI)',
    policyFrameworkTitleEn:
      'Climate "Solution Country" Framework & Central African Forest Initiative (CAFI)',
    target2030Fr: '-21 % d’émissions d’ici 2030 & Sanctuarisation des tourbières du Bassin du Congo',
    target2030En: '-21% emissions by 2030 & Permanent Protection of Congo Basin Peatlands',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Création du Couloir Vert Kivu-Kinshasa (plus grande réserve forestière tropicale communautaire au monde sur 550 000 km²).',
      'Partenariat international CAFI pour électrifier les villes par l’hydroélectricité et le solaire afin de remplacer le charbon de bois.',
      'Production des métaux stratégiques mondiaux de la transition énergétique (cobalt et cuivre à faible empreinte électrique grâce aux barrages d’Inga).'
    ],
    keyLawsAndMeasuresEn: [
      'Creation of the Kivu-Kinshasa Green Corridor (world’s largest community-conserved tropical forest reserve spanning 550,000 km²).',
      'CAFI partnership expanding clean hydro and solar mini-grids to replace wood-charcoal cooking.',
      'Protection of the 30-gigatonne Cuvette Centrale peatland carbon stock.'
    ],
    officialSources: [
      { label: 'CAFI — Central African Forest Initiative', url: 'https://www.cafi.org/' },
      { label: 'WWF République Démocratique du Congo', url: 'https://www.wwfdrc.org/' }
    ]
  },
  {
    iso3: 'GBR',
    iso2: 'GB',
    nameFr: 'Royaume-Uni',
    nameEn: 'United Kingdom',
    aliases: ['royaume-uni', 'royaume uni', 'united kingdom', 'uk', 'angleterre', 'england', 'ecosse', 'scotland', 'londres', 'london', 'gb'],
    regionFr: 'Europe du Nord-Ouest',
    regionEn: 'Northwestern Europe',
    capitalFr: 'Londres',
    capitalEn: 'London',
    lat: 51.5072,
    lon: -0.1276,
    populationMillions: 67.7,
    annualMtCO2e: 384,
    perCapitaTonnes: 5.5,
    evolutionSince1990Percent: -50.0,
    cumulativeHistoricalSharePercent: 4.5,
    lowCarbonElectricityPercent: 60.5,
    renewableSharePercent: 46.5,
    nationalTempAnomalyC: 1.45,
    sectors: [
      {
        sectorFr: 'Transports Routiers & Aviation',
        sectorEn: 'Domestic Transport & Aviation',
        sharePercent: 29.0,
        detailFr: '1er poste d’émission britannique suite à la décarbonation du secteur électrique.',
        detailEn: 'UK’s largest emitting sector following the rapid decarbonization of power generation.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Bâtiments Résidentiels (Chauffage au Gaz)',
        sectorEn: 'Buildings & Gas Boilers',
        sharePercent: 21.0,
        detailFr: '85 % des foyers britanniques sont encore chauffés au gaz naturel.',
        detailEn: '~85% of UK homes still rely on natural gas boilers.',
        color: '#64748B'
      },
      {
        sectorFr: 'Électricité & Approvisionnement Énergétique',
        sectorEn: 'Electricity & Energy Supply',
        sharePercent: 19.0,
        detailFr: 'Fermeture de la toute dernière centrale au charbon britannique (Ratcliffe-on-Soar) en septembre 2024 : 1er pays du G7 à sortir totalement du charbon électrique !',
        detailEn: 'Closed its final coal power station (Ratcliffe-on-Soar) in September 2024—becoming the first G7 nation to completely phase out coal electricity!',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie & Agriculture',
        sectorEn: 'Industry & Agriculture',
        sharePercent: 31.0,
        detailFr: 'Élevage ovin/bovin, industrie manufacturière et tourbières écossaises.',
        detailEn: 'Livestock farming, manufacturing, and degraded upland peatlands.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 13.3,
    forestTrendFr:
      '3,25 millions d’hectares. Programme majeur de restauration des tourbières d’Écosse (Flow Country, classé UNESCO) et de reforestation.',
    forestTrendEn:
      '3.25 million hectares. Major restoration of Scottish blanket bogs (The Flow Country, UNESCO World Heritage).',
    climateRisksFr: [
      'Érosion côtière rapide dans l’Est de l’Angleterre et inondations hivernales récurrentes.',
      'Franchissement pour la première fois du seuil de +40,3 °C à Coningsby en été.'
    ],
    climateRisksEn: [
      'Accelerated coastal erosion along eastern England and severe winter river flooding.',
      'Crossing the historic 40.3 °C summer temperature threshold.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Restauration des Herbiers Marins & Tourbières d’Écosse',
        species: 'Macareux moine, Phoque gris, Saumon atlantique & Écureuil roux',
        action:
          'Le WWF-UK plante des millions de graines de zostères marines (Seagrass Ocean Rescue) le long des côtes du Pays de Galles et d’Écosse et restaure les tourbières.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Seagrass Ocean Rescue & Scottish Peatland Restoration',
        species: 'Atlantic Puffin, Grey Seal, Atlantic Salmon & Red Squirrel',
        action:
          'WWF-UK leads the Seagrass Ocean Rescue project across Wales and Scotland and restores carbon-rich upland peatlands.'
      }
    ],
    policyFrameworkTitleFr:
      'UK Climate Change Act (1er pays du G7 à sortir du charbon électrique) & Clean Power 2030',
    policyFrameworkTitleEn:
      'UK Climate Change Act (First G7 Coal Phase-Out) & Clean Power 2030',
    target2030Fr: '-68 % d’émissions de GES en 2030 (vs 1990) & -81 % en 2035',
    target2030En: '-68% GHG emissions by 2030 (below 1990) & -81% by 2035',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Premier grand pays industrialisé (berceau de la Révolution industrielle) à avoir réduit ses émissions de 50 % depuis 1990 et fermé sa dernière centrale au charbon en 2024.',
      'Deuxième parc éolien en mer (offshore) au monde en mer du Nord (Dogger Bank, Hornsea).',
      'Budgets carbone quinquennaux juridiquement contraignants supervisés par le Climate Change Committee (CCC).'
    ],
    keyLawsAndMeasuresEn: [
      'First G7 country (and birthplace of the Industrial Revolution) to cut GHG emissions by 50% since 1990 and close its last coal power plant in 2024.',
      'World’s second-largest offshore wind fleet across the North Sea (Dogger Bank, Hornsea).',
      'Legally binding five-year Carbon Budgets audited by the independent Climate Change Committee (CCC).'
    ],
    officialSources: [
      { label: 'UK Climate Change Committee (CCC)', url: 'https://www.theccc.org.uk/' },
      { label: 'WWF-UK', url: 'https://www.wwf.org.uk/' }
    ]
  },
  {
    iso3: 'ESP',
    iso2: 'ES',
    nameFr: 'Espagne',
    nameEn: 'Spain',
    aliases: ['espagne', 'spain', 'espana', 'españa', 'madrid', 'barcelone', 'es'],
    regionFr: 'Europe du Sud (Bassin Méditerranéen)',
    regionEn: 'Southern Europe (Mediterranean Basin)',
    capitalFr: 'Madrid',
    capitalEn: 'Madrid',
    lat: 40.4168,
    lon: -3.7038,
    populationMillions: 48.3,
    annualMtCO2e: 275,
    perCapitaTonnes: 5.7,
    evolutionSince1990Percent: -5.2,
    cumulativeHistoricalSharePercent: 0.9,
    lowCarbonElectricityPercent: 72.5,
    renewableSharePercent: 51.8,
    nationalTempAnomalyC: 1.9,
    sectors: [
      {
        sectorFr: 'Transports Routiers & Tourisme Aérien',
        sectorEn: 'Road Transport & Aviation',
        sharePercent: 31.0,
        detailFr: '1er secteur émetteur malgré le plus grand réseau TGV (AVE) d’Europe.',
        detailEn: 'Largest emitting sector despite Europe’s longest high-speed rail network (AVE).',
        color: '#0284C7'
      },
      {
        sectorFr: 'Industrie & Raffinage',
        sectorEn: 'Industry & Refining',
        sharePercent: 24.0,
        detailFr: 'Cimenterie, chimie, sidérurgie et céramique.',
        detailEn: 'Cement, chemicals, steel, and ceramics manufacturing.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Agriculture & Élevage Porcin/Bovin',
        sectorEn: 'Agriculture & Livestock',
        sharePercent: 16.0,
        detailFr: 'Élevage intensif et agriculture irriguée (Andalousie, Murcie).',
        detailEn: 'Intensive livestock and irrigated agriculture across Andalusia and Murcia.',
        color: '#059669'
      },
      {
        sectorFr: 'Électricité & Bâtiments',
        sectorEn: 'Electricity & Buildings',
        sharePercent: 29.0,
        detailFr: 'Plus de 51 % de l’électricité espagnole provient déjà du solaire et de l’éolien (+20 % nucléaire).',
        detailEn: 'Over 51% of Spanish electricity now comes from wind and solar (+20% nuclear).',
        color: '#D97706'
      }
    ],
    forestCoverPercent: 37.2,
    forestTrendFr:
      '18,6 millions d’hectares (Dehesa de chênes verts et chênes-lièges). Forte vulnérabilité aux mégafeux estivaux.',
    forestTrendEn:
      '18.6 million hectares (including oak Dehesa agroforestry). High vulnerability to summer wildfires.',
    climateRisksFr: [
      '75 % du territoire espagnol est exposé à un risque de désertification (Andalousie, Catalogne, Murcie).',
      'Canicules précoces dès le mois de mai dépassant 44 °C dans la vallée du Guadalquivir.'
    ],
    climateRisksEn: [
      '75% of Spanish territory faces desertification risk across Andalusia, Murcia, and Catalonia.',
      'Extreme heatwaves exceeding 44 °C in the Guadalquivir Valley.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Sauvetage du Lynx Ibérique & Parc National de Doñana',
        species: 'Lynx pardelle (Lynx ibérique : passé de 94 individus en 2002 à >2 000 en 2024 !) & Aigle impérial',
        action:
          'Victoire historique du programme LIFE et du WWF Espagne : le lynx ibérique, félin le plus menacé au monde en 2002, a vu sa population multipliée par 20. Le WWF lutte aussi contre les puits illégaux qui assèchent la zone humide de Doñana.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Iberian Lynx Recovery & Doñana Wetland Defense',
        species: 'Iberian Lynx (recovered from 94 individuals in 2002 to >2,000 in 2024!) & Spanish Imperial Eagle',
        action:
          'One of global conservation’s greatest successes led by WWF Spain and EU LIFE programs: rebounding the Iberian lynx twentyfold while fighting illegal groundwater extraction in Doñana National Park.'
      }
    ],
    policyFrameworkTitleFr:
      'Plan National Intégré Énergie-Climat (PNIEC 2023-2030) & Loi sur le Changement Climatique',
    policyFrameworkTitleEn:
      'Integrated National Energy and Climate Plan (PNIEC) & Climate Change Act',
    target2030Fr: '-32 % d’émissions de GES en 2030 (vs 1990) & 81 % d’électricité renouvelable en 2030',
    target2030En: '-32% GHG emissions by 2030 (vs 1990) & 81% renewable electricity by 2030',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Leader européen du solaire photovoltaïque et de l’éolien (>51 % du mix électrique annuel) et quasi-sortie totale du charbon.',
      'Plus grand réseau ferroviaire à grande vitesse d’Europe (4 000 km AVE) alimenté par de l’électricité verte.',
      'Interdiction de tout nouveau permis d’exploration d’hydrocarbures ou d’extraction d’énergies fossiles sur le territoire.'
    ],
    keyLawsAndMeasuresEn: [
      'European powerhouse in utility solar and wind (>51% of annual electricity generation) and near-complete coal exit.',
      'Europe’s longest high-speed rail network (4,000 km AVE) running on renewable electricity.',
      'Complete ban on new fossil fuel exploration permits across Spanish territory.'
    ],
    officialSources: [
      { label: 'MITECO — Ministère de la Transition Écologique (Espagne)', url: 'https://www.miteco.gob.es/' },
      { label: 'WWF España', url: 'https://www.wwf.es/' }
    ]
  },
  {
    iso3: 'BEL',
    iso2: 'BE',
    nameFr: 'Belgique',
    nameEn: 'Belgium',
    aliases: ['belgique', 'belgium', 'bruxelles', 'brussels', 'wallonie', 'flandre', 'be'],
    regionFr: 'Europe de l’Ouest (Union Européenne)',
    regionEn: 'Western Europe (European Union)',
    capitalFr: 'Bruxelles (Siège des Institutions Européennes)',
    capitalEn: 'Brussels (EU Institutions HQ)',
    lat: 50.8503,
    lon: 4.3517,
    populationMillions: 11.8,
    annualMtCO2e: 102,
    perCapitaTonnes: 8.6,
    evolutionSince1990Percent: -29.5,
    cumulativeHistoricalSharePercent: 0.7,
    lowCarbonElectricityPercent: 71.0,
    renewableSharePercent: 29.8,
    nationalTempAnomalyC: 1.85,
    sectors: [
      {
        sectorFr: 'Industrie Chimique, Pétrochimique & Sidérurgie',
        sectorEn: 'Chemicals, Petrochemicals & Steel',
        sharePercent: 31.0,
        detailFr: 'Pôle pétrochimique mondial du port d’Anvers et sidérurgie (Gand, Liège).',
        detailEn: 'Port of Antwerp petrochemical cluster and steelmaking in Ghent and Liège.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Transports Routiers & Transit Logistique',
        sectorEn: 'Road Transport & Logistics Transit',
        sharePercent: 25.0,
        detailFr: 'Carrefour autoroutier européen et réforme fiscale des voitures de société vers le 100 % électrique.',
        detailEn: 'European freight crossroads; rapid transition of company car fleets to 100% EV.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Bâtiments Résidentiels & Tertiaires',
        sectorEn: 'Residential & Commercial Buildings',
        sharePercent: 21.0,
        detailFr: 'Parc immobilier ancien chauffé au gaz et au mazout.',
        detailEn: 'Older housing stock heated by natural gas and heating oil.',
        color: '#64748B'
      },
      {
        sectorFr: 'Électricité & Agriculture',
        sectorEn: 'Electricity & Agriculture',
        sharePercent: 23.0,
        detailFr: 'Nucléaire (Doel, Tihange) + parcs éoliens offshore en mer du Nord + élevage.',
        detailEn: 'Nuclear power (Doel, Tihange) + North Sea offshore wind + intensive livestock.',
        color: '#D97706'
      }
    ],
    forestCoverPercent: 22.8,
    forestTrendFr: '689 000 hectares (massif ardennais en Wallonie). Restauration des tourbières des Hautes Fagnes.',
    forestTrendEn: '689,000 hectares (Ardennes forest in Wallonia) and High Fens peatland restoration.',
    climateRisksFr: [
      'Inondations extrêmes dans les vallées encaissées (comme la catastrophe de la Vesdre en juillet 2021).',
      'Vulnérabilité du littoral flamand et de l’estuaire de l’Escaut à la hausse du niveau de la mer du Nord.'
    ],
    climateRisksEn: [
      'Extreme river flooding in steep valleys (such as the July 2021 Vesdre Valley floods).',
      'Vulnerability of the Flemish coastline and Scheldt estuary to North Sea storm surges.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Retour du Loup, du Lynx & de la Loutre en Ardenne',
        species: 'Loup gris, Lynx boréal, Castor, Cigogne noire & Huître plate de mer du Nord',
        action:
          'Le WWF-Belgique accompagne le retour naturel du loup et de la loutre, restaure les récifs d’huîtres plates dans les parcs éoliens de la mer du Nord belge et protège les forêts ardennaises.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Ardennes Wildlife Corridors & North Sea Oyster Reefs',
        species: 'Grey Wolf, Eurasian Lynx, Beaver, Black Stork & European Flat Oyster',
        action:
          'WWF-Belgium supports wolf and otter coexistence in the Ardennes and restores native flat oyster reefs inside Belgian North Sea offshore wind parks.'
      }
    ],
    policyFrameworkTitleFr:
      'Plan National Énergie-Climat (PNEC) & Pacte Vert Européen (Fit for 55)',
    policyFrameworkTitleEn:
      'National Energy and Climate Plan (NECP) & European Green Deal',
    target2030Fr: '-47 % d’émissions hors-ETS en 2030 (vs 2005)',
    target2030En: '-47% non-ETS GHG emissions by 2030 (below 2005 levels)',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Déductibilité fiscale réservée uniquement aux voitures de société zéro émission (100 % électriques) dès 2026.',
      'Extension de l’éolien offshore en mer du Nord belge (Île énergétique Princesse Élisabeth) et prolongation de 2 réacteurs nucléaires.',
      'Projet Antwerp@C de captage et transport de CO₂ dans le port industriel d’Anvers.'
    ],
    keyLawsAndMeasuresEn: [
      'Tax deductibility restricted exclusively to zero-emission (100% electric) company cars from 2026.',
      'Princess Elisabeth North Sea Energy Island (offshore wind hub) and 10-year extension of two nuclear reactors.',
      'Antwerp@C industrial carbon capture and storage infrastructure at the Port of Antwerp.'
    ],
    officialSources: [
      { label: 'Service Fédéral Climat Belgique (climat.be)', url: 'https://climat.be/' },
      { label: 'WWF Belgique', url: 'https://wwf.be/fr' }
    ]
  },
  {
    iso3: 'JPN',
    iso2: 'JP',
    nameFr: 'Japon',
    nameEn: 'Japan',
    aliases: ['japon', 'japan', 'tokyo', 'kyoto', 'jp'],
    regionFr: 'Asie-Pacifique',
    regionEn: 'Asia-Pacific',
    capitalFr: 'Tokyo',
    capitalEn: 'Tokyo',
    lat: 35.6762,
    lon: 139.6503,
    populationMillions: 124.5,
    annualMtCO2e: 1030,
    perCapitaTonnes: 8.3,
    evolutionSince1990Percent: -11.2,
    cumulativeHistoricalSharePercent: 3.9,
    lowCarbonElectricityPercent: 31.4,
    renewableSharePercent: 22.9,
    nationalTempAnomalyC: 1.55,
    sectors: [
      {
        sectorFr: 'Production d’Électricité (GNL Importé & Charbon)',
        sectorEn: 'Power Generation (Imported LNG & Coal)',
        sharePercent: 39.0,
        detailFr: 'Forte dépendance au gaz naturel liquéfié (GNL) et au charbon, en baisse avec le solaire et le redémarrage nucléaire.',
        detailEn: 'Reliance on imported LNG and coal, declining with solar expansion and nuclear restarts.',
        color: '#D97706'
      },
      {
        sectorFr: 'Industrie Manufacturière, Acier & Automobile',
        sectorEn: 'Manufacturing, Steel & Automotive',
        sharePercent: 26.0,
        detailFr: 'Sidérurgie, électronique, chimie et construction automobile.',
        detailEn: 'Advanced steelmaking, electronics, chemicals, and automotive production.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Transports & Bâtiments',
        sectorEn: 'Transport & Buildings',
        sharePercent: 35.0,
        detailFr: 'Réseau ferroviaire Shinkansen ultra-efficace et généralisation des véhicules hybrides/électriques.',
        detailEn: 'Ultra-efficient Shinkansen rail network and heat-pump water heaters (EcoCute).',
        color: '#0284C7'
      }
    ],
    forestCoverPercent: 68.4,
    forestTrendFr: '25 millions d’hectares (l’un des pays industrialisés les plus boisés au monde avec 68,4 % du territoire couvert de forêts).',
    forestTrendEn: '25 million hectares (one of the most heavily forested industrialized nations at 68.4% land cover).',
    climateRisksFr: [
      'Super-typhons intensifiés par le réchauffement du courant Kuroshio et pluies diluviennes.',
      'Blanchissement des récifs coralliens subtropicaux d’Okinawa.'
    ],
    climateRisksEn: [
      'Intensifying super-typhoons fueled by warming Kuroshio Current waters.',
      'Coral bleaching across Okinawa and the Ryukyu Islands.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Archipel Ryukyu, Okinawa & Mer du Japon',
        species: 'Chat d’Iriomote (espèce en danger critique), Grue du Japon & Dugong',
        action:
          'Le WWF-Japon protège les forêts subtropicales d’Iriomote et d’Amami (UNESCO), restaure les récifs coralliens d’Okinawa et lutte contre la pêche illégale.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Ryukyu Archipelago, Okinawa & Marine Conservation',
        species: 'Iriomote Cat (critically endangered), Red-Crowned Crane & Dugong',
        action:
          'WWF-Japan conserves the subtropical forests of Iriomote and Amami (UNESCO) and restores Okinawa coral reefs.'
      }
    ],
    policyFrameworkTitleFr:
      'Stratégie GX (Green Transformation) & Protocole de Kyoto / Accord de Paris',
    policyFrameworkTitleEn:
      'GX (Green Transformation) Strategy & Basic Energy Plan',
    target2030Fr: '-46 % d’émissions de GES en 2030 (vs 2013)',
    target2030En: '-46% GHG emissions by 2030 (below 2013 levels)',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Plan d’investissement GX (Green Transformation) de 150 000 milliards de yens (~1 000 milliards $) sur 10 ans dans l’hydrogène, les batteries, l’éolien flottant et l’acier décarboné.',
      'Haute efficacité énergétique industrielle et généralisation des pompes à chaleur domestiques.'
    ],
    keyLawsAndMeasuresEn: [
      '150 trillion yen (~$1 trillion) GX Green Transformation investment bond program for floating offshore wind, hydrogen, and green steel.',
      'World-leading industrial energy efficiency and Shinkansen electrified rail transit.'
    ],
    officialSources: [
      { label: 'Ministry of the Environment Japan (MOEJ)', url: 'https://www.env.go.jp/en/' },
      { label: 'WWF Japan', url: 'https://www.wwf.or.jp/' }
    ]
  },
  {
    iso3: 'AUS',
    iso2: 'AU',
    nameFr: 'Australie',
    nameEn: 'Australia',
    aliases: ['australie', 'australia', 'sydney', 'canberra', 'melbourne', 'au'],
    regionFr: 'Océanie & Asie-Pacifique',
    regionEn: 'Oceania & Asia-Pacific',
    capitalFr: 'Canberra / Station Cape Grim (Tasmanie)',
    capitalEn: 'Canberra / Cape Grim Station (Tasmania)',
    lat: -35.2809,
    lon: 149.13,
    populationMillions: 26.6,
    annualMtCO2e: 433,
    perCapitaTonnes: 15.0,
    evolutionSince1990Percent: -24.5,
    cumulativeHistoricalSharePercent: 1.1,
    lowCarbonElectricityPercent: 39.4,
    renewableSharePercent: 39.4,
    nationalTempAnomalyC: 1.51,
    sectors: [
      {
        sectorFr: 'Production d’Électricité & Extraction (Charbon & GNL)',
        sectorEn: 'Electricity & Coal/LNG Extraction',
        sharePercent: 52.0,
        detailFr: 'Centrales au charbon et fuites de méthane des mines de charbon et terminaux GNL, malgré le record mondial de solaire sur toiture.',
        detailEn: 'Coal power and fugitive methane from coal/LNG extraction, alongside world-record rooftop solar adoption.',
        color: '#D97706'
      },
      {
        sectorFr: 'Transports & Agriculture (Élevage)',
        sectorEn: 'Transport & Livestock Agriculture',
        sharePercent: 34.0,
        detailFr: 'Fret routier continental et élevage extensif bovin/ovin.',
        detailEn: 'Long-distance road transport and extensive cattle/sheep grazing.',
        color: '#059669'
      },
      {
        sectorFr: 'Industrie & Déchets',
        sectorEn: 'Industry & Waste',
        sharePercent: 14.0,
        detailFr: 'Raffinage d’alumine, mines de minerai de fer et cimenterie.',
        detailEn: 'Alumina refining, iron ore mining, and industrial processing.',
        color: '#0F172A'
      }
    ],
    forestCoverPercent: 17.4,
    forestTrendFr:
      '134 millions d’hectares (forêts d’eucalyptus). L’Australie orientale figure parmi les fronts mondiaux de déforestation identifiés par le WWF, aggravés par les mégafeux (« Black Summer »).',
    forestTrendEn:
      '134 million hectares (eucalyptus forests). Eastern Australia is listed by WWF among global deforestation fronts, compounded by severe bushfires.',
    climateRisksFr: [
      'Blanchissement corallien de masse sur la Grande Barrière de Corail (5 épisodes majeurs depuis 2016).',
      'Mégafeux de brousse (« Black Summer » ayant touché 3 milliards d’animaux sauvages).'
    ],
    climateRisksEn: [
      'Mass coral bleaching events across the Great Barrier Reef (five mass events since 2016).',
      'Extreme bushfire seasons ("Black Summer" impacted an estimated 3 billion native animals).'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Programme « Regenerate Australia » & Sauvetage du Koala',
        species: 'Koala (classé en danger sur la côte Est), Tortue verte de la Grande Barrière & Ornithorynque',
        action:
          'Le WWF-Australie mène le programme « Koalas Forever » visant à doubler le nombre de koalas sur la côte Est d’ici 2050 grâce à la plantation de corridors d’eucalyptus et aux drones thermiques de sauvetage.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: 'Regenerate Australia & Koalas Forever Programme',
        species: 'Koala (listed as Endangered across eastern Australia), Green Sea Turtle & Platypus',
        action:
          'WWF-Australia leads "Koalas Forever" to double eastern coast koala populations by 2050 via eucalyptus corridor reforestation and thermal drone monitoring.'
      }
    ],
    policyFrameworkTitleFr:
      'Climate Change Act 2022 & Safeguard Mechanism Industriel',
    policyFrameworkTitleEn:
      'Climate Change Act 2022 & Reformed Safeguard Mechanism',
    target2030Fr: '-43 % d’émissions de GES en 2030 (vs 2005) & 82 % d’électricité renouvelable en 2030',
    target2030En: '-43% GHG emissions by 2030 (below 2005) & 82% renewable electricity by 2030',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      '1 foyer australien sur 3 est équipé de panneaux solaires photovoltaïques sur toiture (record mondial absolu).',
      'Plafond d’émissions décroissant (« Safeguard Mechanism ») imposé aux 215 sites industriels et miniers les plus émetteurs du pays.'
    ],
    keyLawsAndMeasuresEn: [
      'Over 1 in 3 Australian households have rooftop solar PV installed (highest per-capita rate in the world).',
      'Reformed Safeguard Mechanism imposing declining emission baselines on Australia’s 215 largest industrial facilities.'
    ],
    officialSources: [
      { label: 'CSIRO & Bureau of Meteorology (State of the Climate)', url: 'https://www.csiro.au/' },
      { label: 'WWF-Australia', url: 'https://wwf.org.au/' }
    ]
  },
  {
    iso3: 'ITA',
    iso2: 'IT',
    nameFr: 'Italie',
    nameEn: 'Italy',
    aliases: ['italie', 'italy', 'italia', 'rome', 'roma', 'milan', 'it'],
    regionFr: 'Europe du Sud (Union Européenne)',
    regionEn: 'Southern Europe (European Union)',
    capitalFr: 'Rome',
    capitalEn: 'Rome',
    lat: 41.9028,
    lon: 12.4964,
    populationMillions: 58.9,
    annualMtCO2e: 330,
    perCapitaTonnes: 5.6,
    evolutionSince1990Percent: -26.0,
    cumulativeHistoricalSharePercent: 1.5,
    lowCarbonElectricityPercent: 44.2,
    renewableSharePercent: 43.8,
    nationalTempAnomalyC: 1.92,
    sectors: [
      {
        sectorFr: 'Transports Routiers & Maritimes',
        sectorEn: 'Road & Maritime Transport',
        sharePercent: 28.0,
        detailFr: 'Parc automobile dense et transport maritime en Méditerranée.',
        detailEn: 'High passenger car ownership and Mediterranean maritime shipping.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Production d’Électricité & Chaleur (Gaz)',
        sectorEn: 'Electricity & Heat (Fossil Gas)',
        sharePercent: 24.0,
        detailFr: 'Centrales au gaz naturel compensées par l’hydroélectricité alpine, la géothermie (Toscane) et le solaire.',
        detailEn: 'Natural gas power plants balanced by Alpine hydro, Tuscan geothermal, and rapid solar growth.',
        color: '#D97706'
      },
      {
        sectorFr: 'Bâtiments & Industrie Manufacturière',
        sectorEn: 'Buildings & Manufacturing Industry',
        sharePercent: 38.0,
        detailFr: 'PME industrielles du Nord de l’Italie, sidérurgie et chauffage résidentiel.',
        detailEn: 'Northern Italian manufacturing clusters, steelworks, and building heating.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Agriculture (Plaine du Pô)',
        sectorEn: 'Agriculture (Po Valley)',
        sharePercent: 10.0,
        detailFr: 'Élevage intensif et riziculture dans la plaine du Pô.',
        detailEn: 'Intensive livestock farming and rice cultivation in the Po Valley.',
        color: '#059669'
      }
    ],
    forestCoverPercent: 32.5,
    forestTrendFr: '9,6 millions d’hectares (Apennins et Alpes). Expansion forestière naturelle sur les anciennes terres agricoles de montagne.',
    forestTrendEn: '9.6 million hectares across the Apennines and Alps.',
    climateRisksFr: [
      'Sécheresses sévères du fleuve Pô alternant avec des inondations dévastatrices en Émilie-Romagne.',
      'Fonte des glaciers des Dolomites (Marmolada) et menaces de submersion à Venise (lagune protégée par le système MOSE).'
    ],
    climateRisksEn: [
      'Severe Po River droughts alternating with extreme flooding in Emilia-Romagna.',
      'Rapid Dolomite glacier melt (Marmolada) and sea-level rise in the Venice Lagoon.'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: 'Plus de 100 « Oasis WWF » en Italie & Ours Marsicain',
        species: 'Ours brun marsicain (~60 individus dans les Abruzzes), Loup des Apennins & Tortue Caouanne',
        action:
          'Le WWF Italie gère directement un réseau exceptionnel de plus de 100 réserves naturelles (« Oasi WWF » sur 30 000 ha), protège l’ours marsicain en danger critique et cogère le Sanctuaire Pelagos avec la France.'
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: '100+ WWF Oases Network & Marsican Brown Bear',
        species: 'Marsican Brown Bear (~60 individuals in Abruzzo), Apennine Wolf & Loggerhead Turtle',
        action:
          'WWF Italy directly manages over 100 nature reserves ("Oasi WWF" covering 30,000 ha), protects the critically endangered Marsican bear, and co-manages the Pelagos Whale Sanctuary.'
      }
    ],
    policyFrameworkTitleFr:
      'Plan National Intégré Énergie et Climat (PNIEC) & Pacte Vert Européen',
    policyFrameworkTitleEn:
      'Integrated National Energy and Climate Plan (PNIEC) & EU Green Deal',
    target2030Fr: '-43,7 % d’émissions hors-ETS en 2030 (vs 2005) & 65 % d’électricité renouvelable',
    target2030En: '-43.7% non-ETS GHG emissions by 2030 (below 2005) & 65% renewable electricity',
    netZeroTargetYear: 2050,
    keyLawsAndMeasuresFr: [
      'Pionnier mondial historique de l’énergie géothermique (Larderello en Toscane) et essor accéléré de l’agrivoltaïsme.',
      'Sortie complète du charbon électrique sur le continent italien.'
    ],
    keyLawsAndMeasuresEn: [
      'Historic global pioneer in deep geothermal power (Larderello, Tuscany) and rapid solar expansion.',
      'Phase-out of mainland coal-fired power generation.'
    ],
    officialSources: [
      { label: 'ISPRA — Institut Italien pour la Protection de l’Environnement', url: 'https://www.isprambiente.gov.it/' },
      { label: 'WWF Italia', url: 'https://www.wwf.it/' }
    ]
  }
];

interface CompactCountrySeed {
  iso3: string;
  iso2: string;
  nameFr: string;
  nameEn: string;
  aliases: string[];
  regionFr: string;
  regionEn: string;
  capitalFr: string;
  capitalEn: string;
  lat: number;
  lon: number;
  popM: number;
  mtCO2e: number;
  perCap: number;
  evol1990: number;
  cumulShare: number;
  lowCarbonElec: number;
  renewShare: number;
  tempAnomaly: number;
  forestPct: number;
  mainDriverFr: string;
  mainDriverEn: string;
  wwfFocusFr: string;
  wwfFocusEn: string;
  wwfSpeciesFr: string;
  wwfSpeciesEn: string;
  policyFr: string;
  policyEn: string;
  netZero: number;
}

const COMPACT_GLOBAL_COUNTRIES: CompactCountrySeed[] = [
  {
    iso3: 'RUS',
    iso2: 'RU',
    nameFr: 'Russie',
    nameEn: 'Russia',
    aliases: ['russie', 'russia', 'moscou', 'moscow', 'siberie', 'ru'],
    regionFr: 'Eurasie & Arctique',
    regionEn: 'Eurasia & Arctic',
    capitalFr: 'Moscou',
    capitalEn: 'Moscow',
    lat: 55.7558,
    lon: 37.6173,
    popM: 143.8,
    mtCO2e: 1810,
    perCap: 12.5,
    evol1990: -28.4,
    cumulShare: 6.8,
    lowCarbonElec: 38.0,
    renewShare: 19.4,
    tempAnomaly: 2.35,
    forestPct: 49.8,
    mainDriverFr: 'Extraction gazière et pétrolière, fuites fugitives de méthane sur gazoducs et chauffage urbain.',
    mainDriverEn: 'Oil & gas extraction, fugitive pipeline methane leaks, and urban district heating.',
    wwfFocusFr: 'Conservation de la taïga boréale (815 millions d’hectares, plus grande forêt du monde) et protection de l’Arctique.',
    wwfFocusEn: 'Conserving the Boreal Taiga (815 million hectares, world’s largest forest) and Arctic marine habitats.',
    wwfSpeciesFr: 'Tigre de l’Amour (Sibérie), Léopard de l’Amour, Ours polaire & Morse',
    wwfSpeciesEn: 'Amur Tiger, Amur Leopard, Polar Bear & Arctic Walrus',
    policyFr: 'Stratégie de développement bas-carbone à l’horizon 2050-2060 et valorisation du puits forestier de la taïga.',
    policyEn: 'Long-term Low-Carbon Development Strategy (2060 Net-Zero target) and boreal forest carbon accounting.',
    netZero: 2060
  },
  {
    iso3: 'IDN',
    iso2: 'ID',
    nameFr: 'Indonésie',
    nameEn: 'Indonesia',
    aliases: ['indonesie', 'indonésie', 'indonesia', 'jakarta', 'borneo', 'sumatra', 'id'],
    regionFr: 'Asie du Sud-Est',
    regionEn: 'Southeast Asia',
    capitalFr: 'Jakarta',
    capitalEn: 'Jakarta',
    lat: -6.2088,
    lon: 106.8456,
    popM: 277.5,
    mtCO2e: 1240,
    perCap: 4.5,
    evol1990: 39.3,
    cumulShare: 2.3,
    lowCarbonElec: 19.2,
    renewShare: 14.5,
    tempAnomaly: 1.38,
    forestPct: 49.1,
    mainDriverFr: 'Drainage des tourbières tropicales, plantations de palmiers à huile et centrales électriques au charbon.',
    mainDriverEn: 'Tropical peatland drainage, oil palm expansion, and coal-fired power generation.',
    wwfFocusFr: 'Réhydratation des tourbières de Bornéo et Sumatra, certification RSPO et protection du Triangle de Corail.',
    wwfFocusEn: 'Rewetting Borneo and Sumatra peatlands, RSPO sustainable palm oil, and Coral Triangle conservation.',
    wwfSpeciesFr: 'Orang-outan de Bornéo & Sumatra, Rhinocéros de Java (~80 individus) & Tigre de Sumatra',
    wwfSpeciesEn: 'Bornean & Sumatran Orangutan, Javan Rhino (~80 individuals) & Sumatran Tiger',
    policyFr: 'Programme FOLU Net Sink 2030 (faire des forêts indonésiennes un puits net de carbone d’ici 2030) et partenariat JETP.',
    policyEn: 'FOLU Net Sink 2030 (turning forestry/land-use into a net carbon sink by 2030) and JETP coal transition.',
    netZero: 2060
  },
  {
    iso3: 'SAU',
    iso2: 'SA',
    nameFr: 'Arabie Saoudite',
    nameEn: 'Saudi Arabia',
    aliases: ['arabie saoudite', 'saudi arabia', 'riyad', 'riyadh', 'sa'],
    regionFr: 'Moyen-Orient',
    regionEn: 'Middle East',
    capitalFr: 'Riyad',
    capitalEn: 'Riyadh',
    lat: 24.7136,
    lon: 46.6753,
    popM: 36.9,
    mtCO2e: 675,
    perCap: 18.7,
    evol1990: 221.4,
    cumulShare: 1.1,
    lowCarbonElec: 2.2,
    renewShare: 1.8,
    tempAnomaly: 1.95,
    forestPct: 0.5,
    mainDriverFr: 'Extraction et raffinage pétrolier, dessalement thermique d’eau de mer et climatisation intensive.',
    mainDriverEn: 'Oil extraction and refining, thermal seawater desalination, and intensive air conditioning.',
    wwfFocusFr: 'Protection des récifs coralliens thermorésistants de la mer Rouge et réintroduction de l’Oryx d’Arabie.',
    wwfFocusEn: 'Conserving heat-resilient Red Sea coral reefs and reintroducing the Arabian Oryx.',
    wwfSpeciesFr: 'Oryx d’Arabie, Léopard d’Arabie, Dugong & Coraux de la mer Rouge',
    wwfSpeciesEn: 'Arabian Oryx, Arabian Leopard, Dugong & Red Sea Corals',
    policyFr: 'Saudi Green Initiative (50 % d’électricité renouvelable visée, hydrogène vert à NEOM et plantation de mangroves).',
    policyEn: 'Saudi Green Initiative (targeting 50% renewable power, NEOM green hydrogen, and coastal mangrove planting).',
    netZero: 2060
  },
  {
    iso3: 'ZAF',
    iso2: 'ZA',
    nameFr: 'Afrique du Sud',
    nameEn: 'South Africa',
    aliases: ['afrique du sud', 'south africa', 'pretoria', 'johannesburg', 'le cap', 'cape town', 'za'],
    regionFr: 'Afrique Australe',
    regionEn: 'Southern Africa',
    capitalFr: 'Pretoria / Le Cap',
    capitalEn: 'Pretoria / Cape Town',
    lat: -25.7479,
    lon: 28.2293,
    popM: 60.4,
    mtCO2e: 435,
    perCap: 7.2,
    evol1990: 38.1,
    cumulShare: 1.3,
    lowCarbonElec: 14.2,
    renewShare: 10.6,
    tempAnomaly: 1.62,
    forestPct: 14.1,
    mainDriverFr: 'Mix électrique dépendant à plus de 80 % du charbon (Eskom) et liquéfaction houillère (Sasol).',
    mainDriverEn: 'Power grid >80% reliant on coal (Eskom) and coal-to-liquid synthetic fuel plants (Sasol).',
    wwfFocusFr: 'Lutte contre le braconnage des rhinocéros au parc Kruger, protection du Fynbos du Cap et des manchots du Cap.',
    wwfFocusEn: 'Anti-poaching in Kruger National Park, Cape Fynbos water-source protection, and African Penguin conservation.',
    wwfSpeciesFr: 'Rhinocéros noir & blanc, Éléphant d’Afrique, Manchot du Cap & Grand requin blanc',
    wwfSpeciesEn: 'Black & White Rhinoceros, African Savanna Elephant & Endangered African Penguin',
    policyFr: 'Loi Climat Sud-Africaine (Climate Change Act 2024), taxe carbone et partenariat JETP de sortie progressive du charbon.',
    policyEn: 'South African Climate Change Act 2024, carbon tax, and Just Energy Transition Partnership (JETP).',
    netZero: 2050
  },
  {
    iso3: 'DZA',
    iso2: 'DZ',
    nameFr: 'Algérie',
    nameEn: 'Algeria',
    aliases: ['algerie', 'algérie', 'algeria', 'alger', 'dz'],
    regionFr: 'Afrique du Nord & Méditerranée',
    regionEn: 'North Africa & Mediterranean',
    capitalFr: 'Alger',
    capitalEn: 'Algiers',
    lat: 36.7538,
    lon: 3.0588,
    popM: 45.6,
    mtCO2e: 178,
    perCap: 3.9,
    evol1990: 112.0,
    cumulShare: 0.3,
    lowCarbonElec: 3.1,
    renewShare: 3.1,
    tempAnomaly: 1.82,
    forestPct: 0.8,
    mainDriverFr: 'Production d’électricité à 97 % au gaz naturel, extraction pétrogazière (torchage/méthane) et transports.',
    mainDriverEn: 'Natural gas power generation (~97%), oil/gas extraction, and road transport.',
    wwfFocusFr: 'Restauration des subéraies (forêts de chênes-lièges) de Kabylie/El Kala contre les feux de forêt et relance du Barrage Vert.',
    wwfFocusEn: 'Restoring Mediterranean cork oak forests in El Kala/Kabylia and rehabilitating the Green Dam steppe belt.',
    wwfSpeciesFr: 'Cerf de Barbarie, Singe Magot, Guépard du Sahara (Ahaggar) & Phoque moine',
    wwfSpeciesEn: 'Barbary Stag, Barbary Macaque, Saharan Cheetah & Mediterranean Monk Seal',
    policyFr: 'Programme solaire Solar 1000 MW / Sonelgaz (3 000 MW photovoltaïques lancés), réduction du torchage de gaz et extension du Barrage Vert à 4,7 Mha.',
    policyEn: '3,000 MW utility solar deployment, gas flaring reduction, and expanding the Green Dam reforestation belt to 4.7 Mha.',
    netZero: 2050
  },
  {
    iso3: 'SEN',
    iso2: 'SN',
    nameFr: 'Sénégal',
    nameEn: 'Senegal',
    aliases: ['senegal', 'sénégal', 'dakar', 'sn'],
    regionFr: 'Afrique de l’Ouest (Sahel)',
    regionEn: 'West Africa (Sahel)',
    capitalFr: 'Dakar',
    capitalEn: 'Dakar',
    lat: 14.7167,
    lon: -17.4677,
    popM: 17.7,
    mtCO2e: 12.5,
    perCap: 0.7,
    evol1990: 140.0,
    cumulShare: 0.01,
    lowCarbonElec: 31.0,
    renewableShare: 31.0,
    renewShare: 31.0,
    tempAnomaly: 1.55,
    forestPct: 41.5,
    mainDriverFr: 'Transports urbains, agriculture/élevage et production thermique (déjà >30 % d’électricité renouvelable grâce à l’éolien de Taïba N’Diaye et au solaire).',
    mainDriverEn: 'Urban transport and agriculture (power grid already >30% renewable thanks to Taïba N’Diaye wind and solar parks).',
    wwfFocusFr: 'Reboisement massif des mangroves du Delta du Saloum et de Casamance et Grande Muraille Verte sahélienne.',
    wwfFocusEn: 'Large-scale mangrove restoration across the Sine-Saloum Delta and Casamance, plus the Sahel Great Green Wall.',
    wwfSpeciesFr: 'Lamantin d’Afrique, Tortue verte, Éland de Derby (Niokolo-Koba) & Oiseaux migrateurs du Djoudj',
    wwfSpeciesEn: 'West African Manatee, Green Sea Turtle, Giant Eland (Niokolo-Koba) & Migratory Pelicans',
    policyFr: 'Partenariat JETP Sénégal (40 % d’électricité renouvelable dès 2030), BRT 100 % électrique et TER de Dakar.',
    policyEn: 'Senegal JETP Partnership (40% renewable electricity by 2030), 100% electric Dakar BRT bus rapid transit, and Great Green Wall.',
    netZero: 2050
  } as any,
  {
    iso3: 'MDG',
    iso2: 'MG',
    nameFr: 'Madagascar',
    nameEn: 'Madagascar',
    aliases: ['madagascar', 'antananarivo', 'tana', 'mg'],
    regionFr: 'Afrique de l’Est & Océan Indien',
    regionEn: 'East Africa & Indian Ocean',
    capitalFr: 'Antananarivo',
    capitalEn: 'Antananarivo',
    lat: -18.8792,
    lon: 47.5079,
    popM: 30.3,
    mtCO2e: 4.2,
    perCap: 0.15,
    evol1990: 95.0,
    cumulShare: 0.01,
    lowCarbonElec: 48.0,
    renewShare: 48.0,
    tempAnomaly: 1.48,
    forestPct: 21.3,
    mainDriverFr: 'Déforestation par culture sur brûlis (tavy) et production de charbon de bois (émissions fossiles quasi nulles : 0,15 t/hab).',
    mainDriverEn: 'Slash-and-burn agriculture (tavy) and wood charcoal harvesting (fossil emissions near zero: 0.15 t/cap).',
    wwfFocusFr: 'Sanctuaire mondial de biodiversité (plus de 80 % des espèces sont endémiques) : reforestation des corridors de lémuriens et des mangroves.',
    wwfFocusEn: 'Global biodiversity hotspot (>80% endemic species): restoring lemur forest corridors and western coastal mangroves.',
    wwfSpeciesFr: 'Lémuriens (>100 espèces endémiques : Indri, Maki catta), Tortue radiée, Fossa & Baobabs',
    wwfSpeciesEn: 'Lemurs (>100 endemic species: Indri, Ring-Tailed Lemur), Radiated Tortoise, Fossa & Baobabs',
    policyFr: 'Programme national de reboisement, foyers économes, hydroélectricité et protection des récifs du Canal du Mozambique.',
    policyEn: 'National reforestation strategy, clean cooking initiatives, hydropower expansion, and Marine Protected Areas.',
    netZero: 2050
  },
  {
    iso3: 'NOR',
    iso2: 'NO',
    nameFr: 'Norvège',
    nameEn: 'Norway',
    aliases: ['norvege', 'norvège', 'norway', 'oslo', 'svalbard', 'no'],
    regionFr: 'Europe du Nord & Arctique',
    regionEn: 'Northern Europe & Arctic',
    capitalFr: 'Oslo / Station Arctique Ny-Ålesund (Svalbard)',
    capitalEn: 'Oslo / Ny-Ålesund Arctic Station (Svalbard)',
    lat: 59.9139,
    lon: 10.7522,
    popM: 5.5,
    mtCO2e: 46.6,
    perCap: 8.4,
    evolution1990: -9.1,
    evol1990: -9.1,
    cumulShare: 0.2,
    lowCarbonElec: 98.5,
    renewShare: 98.5,
    tempAnomaly: 2.15,
    forestPct: 33.4,
    mainDriverFr: 'Plateformes d’extraction pétrolière et gazière en mer du Nord (tandis que l’électricité terrestre est 98,5 % hydroélectrique et que ~90 % des voitures neuves sont 100 % électriques).',
    mainDriverEn: 'Offshore oil and gas platforms (while onshore electricity is 98.5% hydro and ~90% of new cars sold are 100% electric).',
    wwfFocusFr: 'Protection de l’archipel du Svalbard (qui se réchauffe 4× plus vite que le globe), des fjords et moratoire sur l’exploitation minière des grands fonds marins.',
    wwfFocusEn: 'Protecting the Svalbard archipelago (warming 4× faster than the global average) and opposing deep-sea mining.',
    wwfSpeciesFr: 'Ours polaire du Svalbard, Baleine à bosse, Orque, Renne du Svalbard & Macareux',
    wwfSpeciesEn: 'Svalbard Polar Bear, Humpback Whale, Orca, Svalbard Reindeer & Atlantic Puffin',
    policyFr: 'Leader mondial absolu du véhicule électrique (~90 % des ventes neuves), projet Northern Lights de stockage géologique de CO₂ et Initiative Internationale pour le Climat et les Forêts (NICFI).',
    policyEn: 'World leader in EV adoption (~90% of new car sales), Northern Lights geological CO₂ storage, and NICFI tropical forest funding.',
    netZero: 2050
  } as any,
  {
    iso3: 'SWE',
    iso2: 'SE',
    nameFr: 'Suède',
    nameEn: 'Sweden',
    aliases: ['suede', 'suède', 'sweden', 'stockholm', 'se'],
    regionFr: 'Europe du Nord (Union Européenne)',
    regionEn: 'Northern Europe (European Union)',
    capitalFr: 'Stockholm',
    capitalEn: 'Stockholm',
    lat: 59.3293,
    lon: 18.0686,
    popM: 10.5,
    mtCO2e: 44.2,
    perCap: 4.2,
    evol1990: -38.0,
    cumulShare: 0.3,
    lowCarbonElec: 98.2,
    renewShare: 68.5,
    tempAnomaly: 2.05,
    forestPct: 68.7,
    mainDriverFr: 'Transports routiers et industrie lourde (acier et papier), avec une électricité déjà décarbonée à 98,2 % (hydraulique, nucléaire et éolien).',
    mainDriverEn: 'Road transport and heavy industry, while electricity is already 98.2% fossil-free (hydro, nuclear, and wind).',
    wwfFocusFr: 'Préservation des forêts boréales anciennes de Laponie (coexistence avec les éleveurs de rennes Samis) et dépollution de la mer Baltique.',
    wwfFocusEn: 'Preserving old-growth boreal forests in Sápmi (Lapland) and restoring Baltic Sea ecosystems.',
    wwfSpeciesFr: 'Renard polaire, Lynx boréal, Glouton, Loup & Phoque annelé de la Baltique',
    wwfSpeciesEn: 'Arctic Fox, Eurasian Lynx, Wolverine, Wolf & Baltic Ringed Seal',
    policyFr: '1er pays au monde à avoir instauré une taxe carbone élevée dès 1991 (~120 €/tCO₂), pionnier mondial de l’acier vert sans charbon (HYBRIT / H2 Green Steel) et objectif zéro émission nette dès 2045.',
    policyEn: 'World’s first high carbon tax (introduced in 1991), global pioneer in fossil-free hydrogen steel (HYBRIT / Stegra), and legally binding Net-Zero by 2045.',
    netZero: 2045
  },
  {
    iso3: 'NLD',
    iso2: 'NL',
    nameFr: 'Pays-Bas',
    nameEn: 'Netherlands',
    aliases: ['pays-bas', 'pays bas', 'netherlands', 'hollande', 'holland', 'amsterdam', 'rotterdam', 'nl'],
    regionFr: 'Europe de l’Ouest (Union Européenne)',
    regionEn: 'Western Europe (European Union)',
    capitalFr: 'Amsterdam / La Haye',
    capitalEn: 'Amsterdam / The Hague',
    lat: 52.3676,
    lon: 4.9041,
    popM: 17.9,
    mtCO2e: 146,
    perCap: 8.1,
    evol1990: -34.0,
    cumulShare: 0.7,
    lowCarbonElec: 54.0,
    renewShare: 48.0,
    tempAnomaly: 1.8,
    forestPct: 11.2,
    mainDriverFr: 'Pôle pétrochimique de Rotterdam, chauffage au gaz, transports et élevage intensif.',
    mainDriverEn: 'Port of Rotterdam refining/chemical hub, natural gas heating, transport, and intensive livestock.',
    wwfFocusFr: 'Programme « Room for the River » (redonner de l’espace aux fleuves Rhin et Meuse), restauration de la mer des Wadden et récifs d’huîtres.',
    wwfFocusEn: 'Restoring the Rhine-Meuse delta ("Room for the River"), Wadden Sea wetlands, and North Sea oyster reefs.',
    wwfSpeciesFr: 'Phoque commun, Marsouin, Spatule blanche & Castor d’Europe',
    wwfSpeciesEn: 'Harbour Seal, Harbour Porpoise, Eurasian Spoonbill & European Beaver',
    policyFr: 'Plan Delta contre la montée des eaux (26 % du pays est sous le niveau de la mer), fermeture définitive du champ gazier de Groningue, 1er réseau cyclable mondial et projet Porthos de stockage de CO₂ sous la mer du Nord.',
    policyEn: 'Delta Works sea-level defense (26% of the country lies below sea level), permanent closure of the Groningen gas field, world-leading cycling infrastructure, and Porthos North Sea CCS.',
    netZero: 2050
  },
  {
    iso3: 'PRT',
    iso2: 'PT',
    nameFr: 'Portugal',
    nameEn: 'Portugal',
    aliases: ['portugal', 'lisbonne', 'lisbon', 'porto', 'pt'],
    regionFr: 'Europe du Sud (Péninsule Ibérique)',
    regionEn: 'Southern Europe (Iberian Peninsula)',
    capitalFr: 'Lisbonne',
    capitalEn: 'Lisbon',
    lat: 38.7223,
    lon: -9.1393,
    popM: 10.5,
    mtCO2e: 53,
    perCap: 5.0,
    evol1990: -12.0,
    cumulShare: 0.15,
    lowCarbonElec: 76.0,
    renewShare: 76.0,
    tempAnomaly: 1.78,
    forestPct: 36.2,
    mainDriverFr: 'Transports routiers et industrie (le Portugal a fermé toutes ses centrales au charbon dès 2021 et produit déjà 76 % de son électricité via l’eau, le vent et le soleil).',
    mainDriverEn: 'Road transport and industry (Portugal closed all coal plants in 2021 and generates ~76% of its electricity from hydro, wind, and solar).',
    wwfFocusFr: 'Protection des forêts de chênes-lièges (Montado, grand puits de carbone et rempart contre les incendies) et retour du Lynx ibérique dans la vallée du Guadiana.',
    wwfFocusEn: 'Protecting cork oak Montado landscapes against megafires and reintroducing the Iberian Lynx in the Guadiana Valley.',
    wwfSpeciesFr: 'Lynx pardelle (Lynx ibérique), Loup ibérique, Aigle de Bonelli & Cétacés des Açores',
    wwfSpeciesEn: 'Iberian Lynx, Iberian Wolf, Bonelli’s Eagle & Azores Sperm Whales',
    policyFr: 'Sortie complète du charbon dès 2021, objectif de 85 % d’électricité renouvelable en 2030 et neutralité carbone avancée à 2045.',
    policyEn: 'Complete coal phase-out achieved in 2021, 85% renewable electricity target by 2030, and accelerated Net-Zero target for 2045.',
    netZero: 2045
  },
  {
    iso3: 'POL',
    iso2: 'PL',
    nameFr: 'Pologne',
    nameEn: 'Poland',
    aliases: ['pologne', 'poland', 'varsovie', 'warsaw', 'pl'],
    regionFr: 'Europe Centrale (Union Européenne)',
    regionEn: 'Central Europe (European Union)',
    capitalFr: 'Varsovie',
    capitalEn: 'Warsaw',
    lat: 52.2297,
    lon: 21.0122,
    popM: 36.8,
    mtCO2e: 348,
    perCap: 9.2,
    evol1990: -26.0,
    cumulShare: 1.8,
    lowCarbonElec: 27.5,
    renewShare: 27.5,
    tempAnomaly: 1.82,
    forestPct: 31.0,
    mainDriverFr: 'Centrales électriques et chauffage urbain au charbon/lignite (~60 % de l’électricité), en transition rapide vers l’éolien, le solaire et le futur nucléaire.',
    mainDriverEn: 'Coal and lignite power plants (~60% of electricity) and district heating, rapidly adding solar and Baltic offshore wind.',
    wwfFocusFr: 'Protection de la forêt primaire de Białowieża (dernière forêt primaire de plaine d’Europe, UNESCO) et des fleuves sauvages (Vistule, Biebrza).',
    wwfFocusEn: 'Protecting the ancient Białowieża Forest (Europe’s last lowland primeval forest, UNESCO) and free-flowing rivers.',
    wwfSpeciesFr: 'Bison d’Europe (>800 dans la forêt de Białowieża), Lynx boréal, Loup & Phoque gris',
    wwfSpeciesEn: 'European Bison (>800 in Białowieża Forest), Eurasian Lynx, Wolf & Grey Seal',
    policyFr: 'Boom du solaire photovoltaïque résidentiel (1,4 million de foyers équipés), parcs éoliens en mer Baltique et programme nucléaire polonais.',
    policyEn: 'Booming residential solar PV (1.4M prosumer households), Baltic Sea offshore wind farms, and nuclear power program.',
    netZero: 2050
  },
  {
    iso3: 'MEX',
    iso2: 'MX',
    nameFr: 'Mexique',
    nameEn: 'Mexico',
    aliases: ['mexique', 'mexico', 'cdmx', 'mx'],
    regionFr: 'Amérique Latine / Amérique du Nord',
    regionEn: 'Latin America / North America',
    capitalFr: 'Mexico',
    capitalEn: 'Mexico City',
    lat: 19.4326,
    lon: -99.1332,
    popM: 128.5,
    mtCO2e: 485,
    perCap: 3.8,
    evol1990: 54.0,
    cumulShare: 1.2,
    lowCarbonElec: 24.5,
    renewShare: 21.8,
    tempAnomaly: 1.65,
    forestPct: 33.8,
    mainDriverFr: 'Extraction pétrolière et gazière (Pemex), centrales électriques au gaz/fioul, transports et déforestation dans le Yucatán/Chiapas.',
    mainDriverEn: 'Oil and gas extraction (Pemex), fossil power generation, road transport, and Yucatán/Chiapas deforestation.',
    wwfFocusFr: 'Sanctuaires d’hivernage du Papillon Monarque dans les forêts du Michoacán, réserve de biosphère de la Maya (jaguar) et Golfe de Californie.',
    wwfFocusEn: 'Monarch Butterfly Biosphere Reserve forests in Michoacán, Mayan Jaguar rainforests, and Gulf of California marine life.',
    wwfSpeciesFr: 'Papillon Monarque, Jaguar, Marsouin Vaquita (Golfe de Californie) & Baleine grise',
    wwfSpeciesEn: 'Monarch Butterfly, Jaguar, Vaquita Porpoise & Grey Whale',
    policyFr: 'Loi Générale sur le Changement Climatique (LGCC), marché carbone pilote mexicain et potentiel solaire/éolien majeur.',
    policyEn: 'General Law on Climate Change (LGCC), pilot emissions trading system, and solar/wind expansion.',
    netZero: 2050
  },
  {
    iso3: 'ARG',
    iso2: 'AR',
    nameFr: 'Argentine',
    nameEn: 'Argentina',
    aliases: ['argentine', 'argentina', 'buenos aires', 'patagonie', 'ar'],
    regionFr: 'Amérique du Sud',
    regionEn: 'South America',
    capitalFr: 'Buenos Aires',
    capitalEn: 'Buenos Aires',
    lat: -34.6037,
    lon: -58.3816,
    popM: 45.8,
    mtCO2e: 365,
    perCap: 7.9,
    evol1990: 42.0,
    cumulShare: 0.5,
    lowCarbonElec: 39.0,
    renewShare: 32.0,
    tempAnomaly: 1.45,
    forestPct: 10.4,
    mainDriverFr: 'Élevage bovin de la Pampa (méthane CH₄), défrichement de la forêt sèche du Gran Chaco pour le soja et gaz naturel.',
    mainDriverEn: 'Pampas cattle livestock (methane CH₄), Gran Chaco dry forest clearing for soy, and natural gas.',
    wwfFocusFr: 'Fondation Vida Silvestre (partenaire WWF en Argentine) : lutte contre la déforestation du Gran Chaco et protection de la mer d’Argentine.',
    wwfFocusEn: 'Fundación Vida Silvestre (WWF partner): halting Gran Chaco deforestation and protecting Patagonian marine ecosystems.',
    wwfSpeciesFr: 'Jaguar (Yaguareté), Baleine franche australe, Manchot de Magellan & Guanaco',
    wwfSpeciesEn: 'Jaguar, Southern Right Whale, Magellanic Penguin & Pampas Deer',
    policyFr: 'Loi sur les Normes Minimales de Protection des Forêts Natives (Ley de Bosques) et développement de l’éolien en Patagonie.',
    policyEn: 'Native Forest Protection Law (Ley de Bosques) and high-capacity-factor Patagonian wind energy.',
    netZero: 2050
  },
  {
    iso3: 'COL',
    iso2: 'CO',
    nameFr: 'Colombie',
    nameEn: 'Colombia',
    aliases: ['colombie', 'colombia', 'bogota', 'cali', 'co'],
    regionFr: 'Amérique du Sud (Andes & Amazonie)',
    regionEn: 'South America (Andes & Amazon)',
    capitalFr: 'Bogotá',
    capitalEn: 'Bogotá',
    lat: 4.711,
    lon: -74.0721,
    popM: 52.1,
    mtCO2e: 185,
    perCap: 3.5,
    evol1990: 34.0,
    cumulShare: 0.2,
    lowCarbonElec: 75.0,
    renewShare: 75.0,
    tempAnomaly: 1.42,
    forestPct: 53.3,
    mainDriverFr: 'Déforestation en Amazonie colombienne (accaparement des terres et pâturages) et élevage, tandis que l’électricité est à 75 % hydroélectrique.',
    mainDriverEn: 'Deforestation across the Colombian Amazon and cattle grazing, while power generation is ~75% hydroelectric.',
    wwfFocusFr: '2e pays le plus riche en biodiversité au monde par km² (hôte de la COP16 Biodiversité à Cali) : protection des Páramos andins (usines à eau) et de l’Amazonie.',
    wwfFocusEn: '2nd most biodiverse country on Earth (host of COP16 Biodiversity in Cali): conserving Andean Páramo water towers and the Amazon.',
    wwfSpeciesFr: 'Ours à lunettes des Andes, Dauphin rose d’Amazonie, Condor des Andes & Jaguar',
    wwfSpeciesEn: 'Andean Spectacled Bear, Amazon River Dolphin, Andean Condor & Jaguar',
    policyFr: 'Arrêt de l’octroi de nouveaux contrats d’exploration pétrolière/gazière, taxe carbone nationale et programme Herencia Colombia (30 % d’aires protégées déjà atteint).',
    policyEn: 'Halted new oil/gas exploration licenses, national carbon tax, and Herencia Colombia (30×30 target already achieved).',
    netZero: 2050
  },
  {
    iso3: 'KOR',
    iso2: 'KR',
    nameFr: 'Corée du Sud',
    nameEn: 'South Korea',
    aliases: ['coree du sud', 'corée du sud', 'south korea', 'coree', 'korea', 'seoul', 'kr'],
    regionFr: 'Asie de l’Est',
    regionEn: 'East Asia',
    capitalFr: 'Séoul',
    capitalEn: 'Seoul',
    lat: 37.5665,
    lon: 126.978,
    popM: 51.7,
    mtCO2e: 620,
    perCap: 12.0,
    evol1990: 138.0,
    cumulShare: 1.1,
    lowCarbonElec: 39.0,
    renewShare: 9.6,
    tempAnomaly: 1.68,
    forestPct: 62.8,
    mainDriverFr: 'Centrales au charbon et au GNL, sidérurgie (POSCO), pétrochimie et industrie des semi-conducteurs/batteries.',
    mainDriverEn: 'Coal and LNG power generation, steelmaking (POSCO), petrochemicals, and electronics manufacturing.',
    wwfFocusFr: 'Conservation des vasières intertidales (Getbol, classées UNESCO) qui absorbent d’importants volumes de carbone bleu et accueillent les oiseaux migrateurs.',
    wwfFocusEn: 'Conserving UNESCO-listed Getbol tidal mudflats (blue carbon sinks and critical East Asian migratory bird stopovers).',
    wwfSpeciesFr: 'Ours noir d’Asie (Jirisan), Marsouin aptère & Bécasseau spatule',
    wwfSpeciesEn: 'Asiatic Black Bear (Jirisan), Finless Porpoise & Spoon-Billed Sandpiper',
    policyFr: 'Loi-cadre sur la Neutralité Carbone 2050 (K-ETS, 1er marché carbone d’Asie de l’Est), nucléaire + éolien offshore.',
    policyEn: 'Framework Act on Carbon Neutrality 2050, Korea Emissions Trading Scheme (K-ETS), nuclear and offshore wind expansion.',
    netZero: 2050
  },
  {
    iso3: 'TUR',
    iso2: 'TR',
    nameFr: 'Turquie',
    nameEn: 'Turkey',
    aliases: ['turquie', 'turkey', 'turkiye', 'ankara', 'istanbul', 'tr'],
    regionFr: 'Méditerranée Orientale & Eurasie',
    regionEn: 'Eastern Mediterranean & Eurasia',
    capitalFr: 'Ankara',
    capitalEn: 'Ankara',
    lat: 39.9334,
    lon: 32.8597,
    popM: 85.3,
    mtCO2e: 525,
    perCap: 6.1,
    evol1990: 138.0,
    cumulShare: 0.7,
    lowCarbonElec: 42.5,
    renewShare: 42.5,
    tempAnomaly: 1.85,
    forestPct: 29.4,
    mainDriverFr: 'Centrales électriques au charbon/lignite et au gaz, cimenteries, sidérurgie et transport routier.',
    mainDriverEn: 'Coal/lignite and gas power generation, cement production, steelmaking, and road transport.',
    wwfFocusFr: 'Protection des plages de ponte des tortues marines en Méditerranée (Dalyan, Belek) et restauration des zones humides d’Anatolie.',
    wwfFocusEn: 'Protecting Mediterranean sea turtle nesting beaches (Dalyan, Belek) and restoring Anatolian wetlands.',
    wwfSpeciesFr: 'Tortue Caouanne (Caretta caretta), Phoque moine de Méditerranée & Mérou brun',
    wwfSpeciesEn: 'Loggerhead Sea Turtle (Caretta caretta), Mediterranean Monk Seal & Anatolian Leopard',
    policyFr: 'Objectif de neutralité carbone en 2053, fort développement de l’hydroélectricité, de la géothermie, de l’éolien et du solaire.',
    policyEn: '2053 Net-Zero target, strong hydro, geothermal, wind, and solar capacity growth.',
    netZero: 2053
  },
  {
    iso3: 'EGY',
    iso2: 'EG',
    nameFr: 'Égypte',
    nameEn: 'Egypt',
    aliases: ['egypte', 'égypte', 'egypt', 'le caire', 'cairo', 'eg'],
    regionFr: 'Afrique du Nord & Moyen-Orient',
    regionEn: 'North Africa & Middle East',
    capitalFr: 'Le Caire',
    capitalEn: 'Cairo',
    lat: 30.0444,
    lon: 31.2357,
    popM: 112.7,
    mtCO2e: 265,
    perCap: 2.3,
    evol1990: 175.0,
    cumulShare: 0.4,
    lowCarbonElec: 12.0,
    renewShare: 12.0,
    tempAnomaly: 1.8,
    forestPct: 0.1,
    mainDriverFr: 'Centrales électriques au gaz naturel, transports urbains et industrie lourde.',
    mainDriverEn: 'Natural gas power generation, urban transport, and heavy industry.',
    wwfFocusFr: 'Protection des récifs coralliens de la mer Rouge (qui comptent parmi les plus résilients à la chaleur sur Terre) et gestion durable du delta du Nil.',
    wwfFocusEn: 'Conserving Red Sea coral reefs (among the most heat-resilient corals on Earth) and Nile Delta coastal defense.',
    wwfSpeciesFr: 'Dugong de la mer Rouge, Requin-baleine, Dauphin à long bec & Coraux',
    wwfSpeciesEn: 'Red Sea Dugong, Whale Shark, Spinner Dolphin & Heat-Resilient Corals',
    policyFr: 'Hôte de la COP27 (Charm el-Cheikh), programme NWFE (Nexus Eau-Alimentation-Énergie), parc solaire géant de Benban (1,8 GW) et éolien dans le Golfe de Suez.',
    policyEn: 'Host of COP27 (Sharm El-Sheikh), NWFE Water-Food-Energy Nexus program, Benban 1.8 GW solar park, and Gulf of Suez wind.',
    netZero: 2050
  },
  {
    iso3: 'NGA',
    iso2: 'NG',
    nameFr: 'Nigeria',
    nameEn: 'Nigeria',
    aliases: ['nigeria', 'nigéria', 'abuja', 'lagos', 'ng'],
    regionFr: 'Afrique de l’Ouest',
    regionEn: 'West Africa',
    capitalFr: 'Abuja / Lagos',
    capitalEn: 'Abuja / Lagos',
    lat: 9.0765,
    lon: 7.3986,
    popM: 223.8,
    mtCO2e: 135,
    perCap: 0.6,
    evol1990: 45.0,
    cumulShare: 0.25,
    lowCarbonElec: 24.0,
    renewShare: 24.0,
    tempAnomaly: 1.52,
    forestPct: 23.7,
    mainDriverFr: 'Torchage de gaz associé à l’extraction pétrolière dans le delta du Niger, groupes électrogènes diesel et déforestation.',
    mainDriverEn: 'Gas flaring in the Niger Delta oilfields, backup diesel generators, and deforestation.',
    wwfFocusFr: 'Restauration des mangroves du delta du Niger (plus grande mangrove d’Afrique) et protection du parc national de Cross River.',
    wwfFocusEn: 'Restoring Niger Delta mangroves (Africa’s largest mangrove ecosystem) and protecting Cross River National Park.',
    wwfSpeciesFr: 'Gorille de la rivière Cross (en danger critique, ~300 individus), Éléphant de forêt & Lamantin',
    wwfSpeciesEn: 'Cross River Gorilla (critically endangered, ~300 individuals), Forest Elephant & Manatee',
    policyFr: 'Nigeria Climate Change Act, plan d’élimination du torchage de gaz et déploiement de mini-réseaux solaires décentralisés.',
    policyEn: 'Nigeria Climate Change Act, gas flaring commercialization/elimination plan, and decentralized solar mini-grids.',
    netZero: 2060
  },
  {
    iso3: 'CIV',
    iso2: 'CI',
    nameFr: 'Côte d’Ivoire',
    nameEn: 'Ivory Coast (Côte d’Ivoire)',
    aliases: ['cote d ivoire', 'côte d’ivoire', 'cote divoire', 'ivory coast', 'abidjan', 'yamoussoukro', 'ci'],
    regionFr: 'Afrique de l’Ouest',
    regionEn: 'West Africa',
    capitalFr: 'Yamoussoukro / Abidjan',
    capitalEn: 'Yamoussoukro / Abidjan',
    lat: 5.36,
    lon: -4.0083,
    popM: 28.9,
    mtCO2e: 15.2,
    perCap: 0.5,
    evol1990: 82.0,
    cumulShare: 0.02,
    lowCarbonElec: 31.0,
    renewShare: 31.0,
    tempAnomaly: 1.5,
    forestPct: 8.9,
    mainDriverFr: 'Déforestation historique liée à l’expansion cacaoyère (1er producteur mondial de cacao), transports et énergie.',
    mainDriverEn: 'Historical deforestation driven by cocoa expansion (world’s #1 cocoa producer), transport, and energy.',
    wwfFocusFr: 'Conservation du Parc National de Taï (dernière grande forêt primaire d’Afrique de l’Ouest, UNESCO) et agroforesterie cacaoyère zéro déforestation.',
    wwfFocusEn: 'Conserving Taï National Park (West Africa’s largest remaining primary rainforest, UNESCO) and shade-grown cocoa agroforestry.',
    wwfSpeciesFr: 'Hippopotame pygmée, Chimpanzé d’Afrique de l’Ouest & Éléphant de forêt',
    wwfSpeciesEn: 'Pygmy Hippopotamus, Western Chimpanzee & African Forest Elephant',
    policyFr: 'Initiative Cacao et Forêts (traçabilité satellite conforme au règlement européen EUDR pour replanter 20 % du territoire en forêts d’ici 2030).',
    policyEn: 'Cocoa & Forests Initiative (satellite traceability aligned with EU EUDR to restore forest cover to 20% by 2030).',
    netZero: 2050
  },
  {
    iso3: 'CMR',
    iso2: 'CM',
    nameFr: 'Cameroun',
    nameEn: 'Cameroon',
    aliases: ['cameroun', 'cameroon', 'yaounde', 'yaoundé', 'douala', 'cm'],
    regionFr: 'Afrique Centrale (Bassin du Congo)',
    regionEn: 'Central Africa (Congo Basin)',
    capitalFr: 'Yaoundé',
    capitalEn: 'Yaoundé',
    lat: 3.848,
    lon: 11.5021,
    popM: 28.6,
    mtCO2e: 10.4,
    perCap: 0.4,
    evol1990: 65.0,
    cumulShare: 0.01,
    lowCarbonElec: 72.0,
    renewShare: 72.0,
    tempAnomaly: 1.45,
    forestPct: 43.0,
    mainDriverFr: 'Changement d’usage des terres (agriculture et bois-énergie), tandis que l’électricité est à 72 % hydroélectrique (barrages de Nachtigal, Memve’ele).',
    mainDriverEn: 'Land-use change and wood-energy, while power generation is ~72% hydroelectric (Nachtigal dam).',
    wwfFocusFr: 'Programme transfrontalier TRIDOM et Tri-National de la Sangha (UNESCO) protégeant les forêts humides du sud-est du Cameroun.',
    wwfFocusEn: 'TRIDOM and Sangha Trinational (UNESCO) transboundary rainforest conservation in southeastern Cameroon.',
    wwfSpeciesFr: 'Gorille des plaines de l’Ouest, Éléphant de forêt, Bongo & Mandrill',
    wwfSpeciesEn: 'Western Lowland Gorilla, Forest Elephant, Bongo Antelope & Mandrill',
    policyFr: 'Engagement de restaurer 12 millions d’hectares de terres dégradées (Initiative AFR100) et mise en service du barrage hydroélectrique de Nachtigal (420 MW).',
    policyEn: 'Pledge to restore 12 million hectares of degraded land (AFR100) and commissioning of the 420 MW Nachtigal hydropower plant.',
    netZero: 2050
  },
  {
    iso3: 'TUN',
    iso2: 'TN',
    nameFr: 'Tunisie',
    nameEn: 'Tunisia',
    aliases: ['tunisie', 'tunisia', 'tunis', 'tn'],
    regionFr: 'Afrique du Nord & Méditerranée',
    regionEn: 'North Africa & Mediterranean',
    capitalFr: 'Tunis',
    capitalEn: 'Tunis',
    lat: 36.8065,
    lon: 10.1815,
    popM: 12.4,
    mtCO2e: 31.5,
    perCap: 2.5,
    evol1990: 95.0,
    cumulShare: 0.05,
    lowCarbonElec: 6.0,
    renewShare: 6.0,
    tempAnomaly: 1.85,
    forestPct: 4.5,
    mainDriverFr: 'Production d’électricité au gaz naturel, transports routiers et industrie des matériaux de construction.',
    mainDriverEn: 'Natural gas power generation, road transport, and cement/construction materials.',
    wwfFocusFr: 'Bureau WWF Afrique du Nord à Tunis : protection des herbiers de posidonie du golfe de Gabès, de l’archipel de la Galite et du parc national d’Ichkeul (UNESCO).',
    wwfFocusEn: 'WWF North Africa hub in Tunis: conserving Gulf of Gabès Posidonia seagrass, Galite marine reserve, and Ichkeul wetland (UNESCO).',
    wwfSpeciesFr: 'Cerf de Barbarie ( Kroumirie), Tortue Caouanne, Mérou & Flamant rose',
    wwfSpeciesEn: 'Barbary Stag, Loggerhead Sea Turtle, Grouper & Greater Flamingo',
    policyFr: 'Plan Solaire Tunisien visant 35 % d’électricité renouvelable en 2030 et interconnexion électrique sous-marine ELMED avec l’Europe.',
    policyEn: 'Tunisian Solar Plan targeting 35% renewable electricity by 2030 and the ELMED submarine power interconnector with Italy.',
    netZero: 2050
  }
];

function expandCompactCountry(seed: CompactCountrySeed): CountryFullDossier {
  return {
    iso3: seed.iso3,
    iso2: seed.iso2,
    nameFr: seed.nameFr,
    nameEn: seed.nameEn,
    aliases: seed.aliases,
    regionFr: seed.regionFr,
    regionEn: seed.regionEn,
    capitalFr: seed.capitalFr,
    capitalEn: seed.capitalEn,
    lat: seed.lat,
    lon: seed.lon,
    populationMillions: seed.popM,
    annualMtCO2e: seed.mtCO2e,
    perCapitaTonnes: seed.perCap,
    evolutionSince1990Percent: seed.evol1990,
    cumulativeHistoricalSharePercent: seed.cumulShare,
    lowCarbonElectricityPercent: seed.lowCarbonElec,
    renewableSharePercent: seed.renewShare,
    nationalTempAnomalyC: seed.tempAnomaly,
    sectors: [
      {
        sectorFr: 'Énergie, Électricité & Extraction',
        sectorEn: 'Energy, Electricity & Extraction',
        sharePercent: seed.lowCarbonElec > 70 ? 18 : 40,
        detailFr: seed.mainDriverFr,
        detailEn: seed.mainDriverEn,
        color: '#D97706'
      },
      {
        sectorFr: 'Transports Routiers, Aériens & Maritimes',
        sectorEn: 'Road, Aviation & Maritime Transport',
        sharePercent: seed.lowCarbonElec > 70 ? 34 : 24,
        detailFr: 'Mobilité routière, transport de marchandises et aviation.',
        detailEn: 'Passenger road vehicles, freight logistics, and aviation.',
        color: '#0284C7'
      },
      {
        sectorFr: 'Industrie Manufacturière & Construction',
        sectorEn: 'Manufacturing Industry & Construction',
        sharePercent: 22,
        detailFr: 'Procédés industriels, cimenterie, métallurgie et bâtiments.',
        detailEn: 'Industrial processes, cement, metallurgy, and building heating/cooling.',
        color: '#0F172A'
      },
      {
        sectorFr: 'Agriculture, Élevage & Forêts (AFOLU)',
        sectorEn: 'Agriculture, Livestock & Forestry (AFOLU)',
        sharePercent: seed.lowCarbonElec > 70 ? 26 : 14,
        detailFr: 'Élevage, fertilisation des sols agricoles et gestion forestière.',
        detailEn: 'Livestock methane, agricultural soils, and land-use change.',
        color: '#059669'
      }
    ],
    forestCoverPercent: seed.forestPct,
    forestTrendFr: `Couverture forestière nationale de ${seed.forestPct.toFixed(1)} % du territoire. ${seed.wwfFocusFr}`,
    forestTrendEn: `National forest cover of ${seed.forestPct.toFixed(1)}% of land area. ${seed.wwfFocusEn}`,
    climateRisksFr: [
      `Anomalie thermique nationale observée de +${seed.tempAnomaly.toFixed(2)} °C par rapport à l’ère pré-industrielle (1850–1900).`,
      seed.mainDriverFr,
      'Multiplication des événements météorologiques extrêmes (vagues de chaleur, stress hydrique et pression sur les écosystèmes).'
    ],
    climateRisksEn: [
      `Observed national temperature anomaly of +${seed.tempAnomaly.toFixed(2)} °C vs pre-industrial baseline (1850–1900).`,
      seed.mainDriverEn,
      'Increasing frequency of extreme weather events (heatwaves, hydrological stress, and habitat pressure).'
    ],
    wwfSpeciesAndActionsFr: [
      {
        title: `Conservation de la Biodiversité & Actions WWF (${seed.nameFr})`,
        species: seed.wwfSpeciesFr,
        action: seed.wwfFocusFr
      }
    ],
    wwfSpeciesAndActionsEn: [
      {
        title: `Biodiversity Conservation & WWF Field Actions (${seed.nameEn})`,
        species: seed.wwfSpeciesEn,
        action: seed.wwfFocusEn
      }
    ],
    policyFrameworkTitleFr: `Stratégie Climatique Nationale & Engagements Accord de Paris (${seed.nameFr})`,
    policyFrameworkTitleEn: `National Climate Strategy & Paris Agreement NDC (${seed.nameEn})`,
    target2030Fr: `Contribution Déterminée au niveau National (CDN 2030) & Neutralité Carbone ${seed.netZero}`,
    target2030En: `Nationally Determined Contribution (2030 NDC) & Net-Zero ${seed.netZero}`,
    netZeroTargetYear: seed.netZero,
    keyLawsAndMeasuresFr: [
      seed.policyFr,
      `Part actuelle d’électricité bas-carbone : ${seed.lowCarbonElec.toFixed(1)} % (dont ${seed.renewShare.toFixed(1)} % d’énergies renouvelables).`,
      'Participation à l’Accord de Paris (UNFCCC) et au Cadre Mondial de la Biodiversité de Kunming-Montréal (objectif 30×30).'
    ],
    keyLawsAndMeasuresEn: [
      seed.policyEn,
      `Current low-carbon electricity share: ${seed.lowCarbonElec.toFixed(1)}% (including ${seed.renewShare.toFixed(1)}% renewables).`,
      'Signatory to the UNFCCC Paris Agreement and Kunming-Montreal Global Biodiversity Framework (30×30 target).'
    ],
    officialSources: [
      { label: `World Bank Open Data — ${seed.nameEn} (${seed.iso3})`, url: `https://data.worldbank.org/country/${seed.iso2.toLowerCase()}` },
      { label: 'EDGAR JRC European Commission (europa.eu)', url: 'https://edgar.jrc.ec.europa.eu/' },
      { label: 'WWF International & Rapports Planète Vivante', url: 'https://www.wwf.fr/rapport-planete-vivante' }
    ]
  };
}

export const ALL_COUNTRY_DOSSIERS: CountryFullDossier[] = [
  ...COUNTRY_FULL_DOSSIERS,
  ...COMPACT_GLOBAL_COUNTRIES.map(expandCompactCountry)
];

export function normalizeCountryQuery(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’\-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchCountryDossiers(query: string): CountryFullDossier[] {
  const q = normalizeCountryQuery(query);
  if (!q) return [];

  const exactMatches: CountryFullDossier[] = [];
  const prefixMatches: CountryFullDossier[] = [];
  const substringMatches: CountryFullDossier[] = [];

  for (const country of ALL_COUNTRY_DOSSIERS) {
    const frNorm = normalizeCountryQuery(country.nameFr);
    const enNorm = normalizeCountryQuery(country.nameEn);
    const iso3Norm = country.iso3.toLowerCase();
    const iso2Norm = country.iso2.toLowerCase();
    const aliasNorms = country.aliases.map(normalizeCountryQuery);

    if (
      frNorm === q ||
      enNorm === q ||
      iso3Norm === q ||
      iso2Norm === q ||
      aliasNorms.includes(q)
    ) {
      exactMatches.push(country);
    } else if (
      frNorm.startsWith(q) ||
      enNorm.startsWith(q) ||
      aliasNorms.some((a) => a.startsWith(q))
    ) {
      prefixMatches.push(country);
    } else if (
      frNorm.includes(q) ||
      enNorm.includes(q) ||
      aliasNorms.some((a) => a.includes(q))
    ) {
      substringMatches.push(country);
    }
  }

  return [...exactMatches, ...prefixMatches, ...substringMatches];
}

