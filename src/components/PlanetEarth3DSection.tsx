import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import countriesTopo50m from 'world-atlas/countries-50m.json';
import landTopo50m from 'world-atlas/land-50m.json';
import { Language } from '../data/climateDatasets';
import {
  RefreshCw,
  CloudRain,
  Snowflake,
  Sun,
  Droplets,
  Wind,
  Compass,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Crosshair,
  Thermometer,
  Flame
} from 'lucide-react';

export type HydrologicalState = 'snow' | 'rain' | 'dry' | 'humid' | 'temperate';
export type GlobeLayerMode = 'temperature' | 'moisture' | 'precipitation' | 'combined';

export interface EarthLiveNode {
  id: string;
  nameFr: string;
  nameEn: string;
  regionFr: string;
  regionEn: string;
  countryIso: string;
  isFrance: boolean;
  lat: number;
  lon: number;
  elevationM: number;
  // Precomputed 3D unit sphere coordinates for fast continuous surface interpolation
  ux: number;
  uy: number;
  uz: number;
  // Live metrics updated from Open-Meteo API
  tempC: number;
  humidityPercent: number;
  soilMoistureM3: number;
  rainMmH: number;
  snowCmH: number;
  precipitationMmH: number;
  windKmh: number;
  weatherCode: number;
  state: HydrologicalState;
  isLiveApi: boolean;
  updatedAt: string;
}

interface CameraPreset {
  id: string;
  labelFr: string;
  labelEn: string;
  lon: number;
  lat: number;
  zoom: number;
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'france',
    labelFr: 'Zoom France (Nord Froid / Sud Chaud)',
    labelEn: 'Zoom France (North Cold / South Warm)',
    lon: 2.3,
    lat: 46.6,
    zoom: 4.3
  },
  {
    id: 'europe',
    labelFr: 'Europe & Méditerranée',
    labelEn: 'Europe & Mediterranean',
    lon: 8.0,
    lat: 46.5,
    zoom: 2.35
  },
  {
    id: 'world',
    labelFr: 'Globe Terrestre 3D Complet',
    labelEn: 'Full 3D Earth Globe',
    lon: 8.0,
    lat: 26.0,
    zoom: 1.05
  },
  {
    id: 'arctic',
    labelFr: 'Arctique & Pôle Nord (Glace/Neige)',
    labelEn: 'Arctic & North Pole (Ice/Snow)',
    lon: 15.0,
    lat: 72.0,
    zoom: 1.75
  },
  {
    id: 'americas',
    labelFr: 'Amériques & Amazonie',
    labelEn: 'Americas & Amazonia',
    lon: -68.0,
    lat: 10.0,
    zoom: 1.25
  },
  {
    id: 'africa-asia',
    labelFr: 'Afrique, Sahara & Asie',
    labelEn: 'Africa, Sahara & Asia',
    lon: 38.0,
    lat: 22.0,
    zoom: 1.25
  }
];

function latLonToUnitVector(latDeg: number, lonDeg: number): { ux: number; uy: number; uz: number } {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const cosLat = Math.cos(lat);
  return {
    ux: cosLat * Math.cos(lon),
    uy: cosLat * Math.sin(lon),
    uz: Math.sin(lat)
  };
}

// 48 Regional & Global Reference Anchor Stations used for Continuous Surface Interpolation
const RAW_STATIONS: Omit<
  EarthLiveNode,
  'ux' | 'uy' | 'uz' | 'state' | 'isLiveApi' | 'updatedAt'
>[] = [
  // --- 18 FRANCE REGIONAL SURFACE ANCHORS (North, West, Center, East, Alps, Pyrenees, South, Corsica) ---
  {
    id: 'fr-lille',
    nameFr: 'Nord de la France — Lille & Flandres',
    nameEn: 'Northern France — Lille & Flanders',
    regionFr: 'France · Hauts-de-France (Nord)',
    regionEn: 'France · Hauts-de-France (North)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 50.63,
    lon: 3.06,
    elevationM: 28,
    tempC: 9.2,
    humidityPercent: 86,
    soilMoistureM3: 0.35,
    rainMmH: 0.8,
    snowCmH: 0,
    precipitationMmH: 0.8,
    windKmh: 24,
    weatherCode: 61
  },
  {
    id: 'fr-cherbourg',
    nameFr: 'Normandie & Manche — Cherbourg / Rouen',
    nameEn: 'Normandy & Channel Coast',
    regionFr: 'France · Normandie (Nord-Ouest)',
    regionEn: 'France · Normandy (North-West)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 49.63,
    lon: -1.62,
    elevationM: 35,
    tempC: 10.1,
    humidityPercent: 88,
    soilMoistureM3: 0.37,
    rainMmH: 1.2,
    snowCmH: 0,
    precipitationMmH: 1.2,
    windKmh: 29,
    weatherCode: 61
  },
  {
    id: 'fr-brest',
    nameFr: 'Bretagne — Brest & Finistère',
    nameEn: 'Brittany — Brest & Atlantic Tip',
    regionFr: 'France · Bretagne (Océanique Humide)',
    regionEn: 'France · Brittany (Humid Oceanic)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 48.39,
    lon: -4.49,
    elevationM: 94,
    tempC: 11.4,
    humidityPercent: 90,
    soilMoistureM3: 0.39,
    rainMmH: 1.8,
    snowCmH: 0,
    precipitationMmH: 1.8,
    windKmh: 32,
    weatherCode: 63
  },
  {
    id: 'fr-paris',
    nameFr: 'Bassin Parisien — Paris & Île-de-France',
    nameEn: 'Paris Basin & Ile-de-France',
    regionFr: 'France · Île-de-France (Nord-Centre)',
    regionEn: 'France · Ile-de-France (North-Central)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 48.85,
    lon: 2.35,
    elevationM: 42,
    tempC: 11.2,
    humidityPercent: 78,
    soilMoistureM3: 0.29,
    rainMmH: 0.3,
    snowCmH: 0,
    precipitationMmH: 0.3,
    windKmh: 18,
    weatherCode: 51
  },
  {
    id: 'fr-strasbourg',
    nameFr: 'Grand Est — Strasbourg & Vosges',
    nameEn: 'Grand Est — Strasbourg & Rhine',
    regionFr: 'France · Grand Est (Nord-Est)',
    regionEn: 'France · Grand Est (North-East)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 48.57,
    lon: 7.75,
    elevationM: 142,
    tempC: 9.8,
    humidityPercent: 76,
    soilMoistureM3: 0.28,
    rainMmH: 0.2,
    snowCmH: 0,
    precipitationMmH: 0.2,
    windKmh: 15,
    weatherCode: 3
  },
  {
    id: 'fr-nantes',
    nameFr: 'Val de Loire — Nantes & Angers',
    nameEn: 'Loire Valley — Nantes & Angers',
    regionFr: 'France · Pays de la Loire',
    regionEn: 'France · Pays de la Loire',
    countryIso: 'FRA',
    isFrance: true,
    lat: 47.22,
    lon: -1.55,
    elevationM: 26,
    tempC: 13.6,
    humidityPercent: 80,
    soilMoistureM3: 0.31,
    rainMmH: 0.4,
    snowCmH: 0,
    precipitationMmH: 0.4,
    windKmh: 20,
    weatherCode: 51
  },
  {
    id: 'fr-dijon',
    nameFr: 'Bourgogne — Dijon & Morvan',
    nameEn: 'Burgundy — Dijon & Plateau',
    regionFr: 'France · Bourgogne-Franche-Comté',
    regionEn: 'France · Bourgogne-Franche-Comte',
    countryIso: 'FRA',
    isFrance: true,
    lat: 47.32,
    lon: 5.04,
    elevationM: 245,
    tempC: 12.1,
    humidityPercent: 72,
    soilMoistureM3: 0.25,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 14,
    weatherCode: 2
  },
  {
    id: 'fr-clermont',
    nameFr: 'Massif Central — Clermont-Ferrand',
    nameEn: 'Massif Central — Auvergne',
    regionFr: 'France · Auvergne (Centre)',
    regionEn: 'France · Auvergne (Central)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 45.78,
    lon: 3.08,
    elevationM: 358,
    tempC: 15.8,
    humidityPercent: 58,
    soilMoistureM3: 0.19,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 14,
    weatherCode: 1
  },
  {
    id: 'fr-chamonix',
    nameFr: 'Alpes du Nord — Massif du Mont-Blanc',
    nameEn: 'French Alps — Mont-Blanc Massif',
    regionFr: 'France · Haute-Savoie (Haute Montagne)',
    regionEn: 'France · High Alps Cryosphere',
    countryIso: 'FRA',
    isFrance: true,
    lat: 45.88,
    lon: 6.89,
    elevationM: 2850,
    tempC: -3.2,
    humidityPercent: 86,
    soilMoistureM3: 0.38,
    rainMmH: 0,
    snowCmH: 0.9,
    precipitationMmH: 1.1,
    windKmh: 34,
    weatherCode: 73
  },
  {
    id: 'fr-bordeaux',
    nameFr: 'Sud-Ouest — Bordeaux & Landes',
    nameEn: 'South-West — Bordeaux & Aquitaine',
    regionFr: 'France · Nouvelle-Aquitaine',
    regionEn: 'France · Nouvelle-Aquitaine',
    countryIso: 'FRA',
    isFrance: true,
    lat: 44.84,
    lon: -0.58,
    elevationM: 16,
    tempC: 20.6,
    humidityPercent: 54,
    soilMoistureM3: 0.2,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 16,
    weatherCode: 1
  },
  {
    id: 'fr-toulouse',
    nameFr: 'Sud de la France — Toulouse & Occitanie',
    nameEn: 'Southern France — Toulouse & Occitanie',
    regionFr: 'France · Occitanie (Sud)',
    regionEn: 'France · Occitanie (South)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 43.6,
    lon: 1.44,
    elevationM: 151,
    tempC: 23.8,
    humidityPercent: 40,
    soilMoistureM3: 0.13,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 18,
    weatherCode: 0
  },
  {
    id: 'fr-perpignan',
    nameFr: 'Sud de la France — Perpignan & Roussillon',
    nameEn: 'Southern France — Perpignan & Roussillon',
    regionFr: 'France · Pyrénées-Orientales (Chaud & Sec)',
    regionEn: 'France · Roussillon (Hot & Dry South)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 42.7,
    lon: 2.89,
    elevationM: 42,
    tempC: 26.4,
    humidityPercent: 31,
    soilMoistureM3: 0.08,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 25,
    weatherCode: 0
  },
  {
    id: 'fr-montpellier',
    nameFr: 'Sud de la France — Montpellier & Hérault',
    nameEn: 'Southern France — Montpellier & Languedoc',
    regionFr: 'France · Languedoc Méditerranéen (Sud)',
    regionEn: 'France · Mediterranean Languedoc (South)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 43.61,
    lon: 3.88,
    elevationM: 27,
    tempC: 25.2,
    humidityPercent: 35,
    soilMoistureM3: 0.1,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 21,
    weatherCode: 0
  },
  {
    id: 'fr-marseille',
    nameFr: 'Sud-Est — Marseille & Provence',
    nameEn: 'Southern France — Marseille & Provence',
    regionFr: 'France · Provence-Alpes-Côte d’Azur (Sud)',
    regionEn: 'France · Provence Coast (Hot & Dry South)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 43.3,
    lon: 5.37,
    elevationM: 28,
    tempC: 25.8,
    humidityPercent: 34,
    soilMoistureM3: 0.09,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 24,
    weatherCode: 0
  },
  {
    id: 'fr-nice',
    nameFr: 'Sud-Est — Nice & Côte d’Azur',
    nameEn: 'Southern France — Nice & French Riviera',
    regionFr: 'France · Alpes-Maritimes (Sud-Est)',
    regionEn: 'France · French Riviera (South-East)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 43.7,
    lon: 7.26,
    elevationM: 18,
    tempC: 24.9,
    humidityPercent: 39,
    soilMoistureM3: 0.11,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 15,
    weatherCode: 0
  },
  {
    id: 'fr-ajaccio',
    nameFr: 'Corse — Ajaccio & Méditerranée',
    nameEn: 'Corsica — Ajaccio & Mediterranean',
    regionFr: 'France · Corse (Extrême Sud)',
    regionEn: 'France · Corsica Island (Deep South)',
    countryIso: 'FRA',
    isFrance: true,
    lat: 41.92,
    lon: 8.74,
    elevationM: 18,
    tempC: 26.2,
    humidityPercent: 36,
    soilMoistureM3: 0.1,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 16,
    weatherCode: 0
  },

  // --- 30 GLOBAL CONTINENTAL & POLAR ANCHORS FOR CONTINUOUS PLANETARY SURFACE ---
  {
    id: 'eu-london',
    nameFr: 'Londres & Sud Angleterre',
    nameEn: 'London & Southern UK',
    regionFr: 'Royaume-Uni · Europe du Nord-Ouest',
    regionEn: 'United Kingdom · NW Europe',
    countryIso: 'GBR',
    isFrance: false,
    lat: 51.51,
    lon: -0.13,
    elevationM: 24,
    tempC: 8.8,
    humidityPercent: 85,
    soilMoistureM3: 0.36,
    rainMmH: 0.9,
    snowCmH: 0,
    precipitationMmH: 0.9,
    windKmh: 25,
    weatherCode: 61
  },
  {
    id: 'eu-edinburgh',
    nameFr: 'Édimbourg & Highlands d’Écosse',
    nameEn: 'Edinburgh & Scottish Highlands',
    regionFr: 'Royaume-Uni · Écosse',
    regionEn: 'United Kingdom · Scotland',
    countryIso: 'GBR',
    isFrance: false,
    lat: 55.95,
    lon: -3.19,
    elevationM: 47,
    tempC: 6.4,
    humidityPercent: 89,
    soilMoistureM3: 0.4,
    rainMmH: 1.5,
    snowCmH: 0,
    precipitationMmH: 1.5,
    windKmh: 34,
    weatherCode: 63
  },
  {
    id: 'eu-sevilla',
    nameFr: 'Séville & Andalousie',
    nameEn: 'Seville & Southern Spain',
    regionFr: 'Espagne · Europe du Sud',
    regionEn: 'Spain · Southern Europe',
    countryIso: 'ESP',
    isFrance: false,
    lat: 37.39,
    lon: -5.98,
    elevationM: 16,
    tempC: 29.4,
    humidityPercent: 25,
    soilMoistureM3: 0.06,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 14,
    weatherCode: 0
  },
  {
    id: 'eu-madrid',
    nameFr: 'Madrid & Meseta Centrale',
    nameEn: 'Madrid & Iberian Plateau',
    regionFr: 'Espagne · Castille',
    regionEn: 'Spain · Central Plateau',
    countryIso: 'ESP',
    isFrance: false,
    lat: 40.42,
    lon: -3.7,
    elevationM: 667,
    tempC: 26.8,
    humidityPercent: 29,
    soilMoistureM3: 0.08,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 15,
    weatherCode: 0
  },
  {
    id: 'eu-rome',
    nameFr: 'Rome & Péninsule Italienne',
    nameEn: 'Rome & Italian Peninsula',
    regionFr: 'Italie · Méditerranée Centrale',
    regionEn: 'Italy · Central Mediterranean',
    countryIso: 'ITA',
    isFrance: false,
    lat: 41.9,
    lon: 12.5,
    elevationM: 21,
    tempC: 25.9,
    humidityPercent: 38,
    soilMoistureM3: 0.11,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 14,
    weatherCode: 0
  },
  {
    id: 'eu-berlin',
    nameFr: 'Berlin & Plaine d’Europe du Nord',
    nameEn: 'Berlin & Northern European Plain',
    regionFr: 'Allemagne · Europe Centrale',
    regionEn: 'Germany · Central Europe',
    countryIso: 'DEU',
    isFrance: false,
    lat: 52.52,
    lon: 13.4,
    elevationM: 38,
    tempC: 8.5,
    humidityPercent: 79,
    soilMoistureM3: 0.3,
    rainMmH: 0.4,
    snowCmH: 0,
    precipitationMmH: 0.4,
    windKmh: 19,
    weatherCode: 51
  },
  {
    id: 'eu-oslo',
    nameFr: 'Oslo & Scandinavie du Sud',
    nameEn: 'Oslo & Southern Scandinavia',
    regionFr: 'Norvège · Scandinavie',
    regionEn: 'Norway · Scandinavia',
    countryIso: 'NOR',
    isFrance: false,
    lat: 59.91,
    lon: 10.75,
    elevationM: 23,
    tempC: 3.2,
    humidityPercent: 86,
    soilMoistureM3: 0.37,
    rainMmH: 1.1,
    snowCmH: 0,
    precipitationMmH: 1.1,
    windKmh: 22,
    weatherCode: 61
  },
  {
    id: 'eu-tromso',
    nameFr: 'Tromsø & Laponie Boréale',
    nameEn: 'Tromso & Lapland Arctic',
    regionFr: 'Norvège · Cercle Polaire Arctique',
    regionEn: 'Norway · Arctic Circle',
    countryIso: 'NOR',
    isFrance: false,
    lat: 69.65,
    lon: 18.96,
    elevationM: 10,
    tempC: -3.8,
    humidityPercent: 88,
    soilMoistureM3: 0.39,
    rainMmH: 0,
    snowCmH: 0.8,
    precipitationMmH: 0.9,
    windKmh: 28,
    weatherCode: 73
  },
  {
    id: 'eu-svalbard',
    nameFr: 'Svalbard (Haut-Arctique 78°N)',
    nameEn: 'Svalbard (High Arctic 78°N)',
    regionFr: 'Arctique · Banquise & Glaciers',
    regionEn: 'High Arctic · Glaciers',
    countryIso: 'NOR',
    isFrance: false,
    lat: 78.22,
    lon: 15.65,
    elevationM: 29,
    tempC: -9.4,
    humidityPercent: 85,
    soilMoistureM3: 0.4,
    rainMmH: 0,
    snowCmH: 1.1,
    precipitationMmH: 1.1,
    windKmh: 31,
    weatherCode: 75
  },
  {
    id: 'eu-reykjavik',
    nameFr: 'Islande — Reykjavik & Vatnajökull',
    nameEn: 'Iceland — Reykjavik & Glaciers',
    regionFr: 'Islande · Atlantique Nord',
    regionEn: 'Iceland · North Atlantic',
    countryIso: 'ISL',
    isFrance: false,
    lat: 64.15,
    lon: -21.94,
    elevationM: 48,
    tempC: 1.2,
    humidityPercent: 86,
    soilMoistureM3: 0.38,
    rainMmH: 0.6,
    snowCmH: 0.3,
    precipitationMmH: 0.9,
    windKmh: 35,
    weatherCode: 68
  },
  {
    id: 'eu-athens',
    nameFr: 'Athènes & Bassin Égéen',
    nameEn: 'Athens & Eastern Mediterranean',
    regionFr: 'Grèce · Méditerranée Orientale',
    regionEn: 'Greece · Eastern Mediterranean',
    countryIso: 'GRC',
    isFrance: false,
    lat: 37.98,
    lon: 23.73,
    elevationM: 75,
    tempC: 27.6,
    humidityPercent: 30,
    soilMoistureM3: 0.08,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 21,
    weatherCode: 0
  },
  {
    id: 'eu-moscow',
    nameFr: 'Moscou & Plaine Russe',
    nameEn: 'Moscow & Eastern European Plain',
    regionFr: 'Russie Européenne · Continental',
    regionEn: 'European Russia · Continental',
    countryIso: 'RUS',
    isFrance: false,
    lat: 55.75,
    lon: 37.62,
    elevationM: 156,
    tempC: 2.1,
    humidityPercent: 81,
    soilMoistureM3: 0.33,
    rainMmH: 0.4,
    snowCmH: 0.1,
    precipitationMmH: 0.5,
    windKmh: 18,
    weatherCode: 61
  },
  {
    id: 'na-nuuk',
    nameFr: 'Inlandsis du Groenland',
    nameEn: 'Greenland Ice Sheet',
    regionFr: 'Groenland · Calotte Polaire',
    regionEn: 'Greenland · Polar Ice Cap',
    countryIso: 'GRL',
    isFrance: false,
    lat: 68.5,
    lon: -44.0,
    elevationM: 2100,
    tempC: -19.2,
    humidityPercent: 88,
    soilMoistureM3: 0.41,
    rainMmH: 0,
    snowCmH: 1.4,
    precipitationMmH: 1.4,
    windKmh: 42,
    weatherCode: 75
  },
  {
    id: 'na-anchorage',
    nameFr: 'Alaska & Yukon Subarctique',
    nameEn: 'Alaska & Subarctic Range',
    regionFr: 'Amérique du Nord · Alaska',
    regionEn: 'North America · Alaska',
    countryIso: 'USA',
    isFrance: false,
    lat: 64.84,
    lon: -147.72,
    elevationM: 136,
    tempC: -6.5,
    humidityPercent: 82,
    soilMoistureM3: 0.36,
    rainMmH: 0,
    snowCmH: 0.7,
    precipitationMmH: 0.7,
    windKmh: 19,
    weatherCode: 71
  },
  {
    id: 'na-quebec',
    nameFr: 'Québec & Bouclier Canadien',
    nameEn: 'Quebec & Canadian Shield',
    regionFr: 'Canada · Est Boréal',
    regionEn: 'Canada · Eastern Boreal',
    countryIso: 'CAN',
    isFrance: false,
    lat: 48.5,
    lon: -71.2,
    elevationM: 120,
    tempC: 5.4,
    humidityPercent: 80,
    soilMoistureM3: 0.34,
    rainMmH: 0.7,
    snowCmH: 0,
    precipitationMmH: 0.7,
    windKmh: 22,
    weatherCode: 61
  },
  {
    id: 'na-phoenix',
    nameFr: 'Arizona & Désert du Sud-Ouest US',
    nameEn: 'Arizona & Sonoran Desert',
    regionFr: 'États-Unis · Sud-Ouest Aride',
    regionEn: 'USA · Arid Southwest',
    countryIso: 'USA',
    isFrance: false,
    lat: 33.45,
    lon: -112.07,
    elevationM: 331,
    tempC: 33.4,
    humidityPercent: 18,
    soilMoistureM3: 0.05,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 12,
    weatherCode: 0
  },
  {
    id: 'na-miami',
    nameFr: 'Floride & Golfe du Mexique',
    nameEn: 'Florida & Gulf Coast',
    regionFr: 'États-Unis · Subtropical Humide',
    regionEn: 'USA · Subtropical Humid',
    countryIso: 'USA',
    isFrance: false,
    lat: 25.76,
    lon: -80.19,
    elevationM: 6,
    tempC: 28.4,
    humidityPercent: 84,
    soilMoistureM3: 0.38,
    rainMmH: 1.6,
    snowCmH: 0,
    precipitationMmH: 1.6,
    windKmh: 24,
    weatherCode: 80
  },
  {
    id: 'sa-manaus',
    nameFr: 'Bassin de l’Amazone (Manaus)',
    nameEn: 'Amazon Rainforest Basin',
    regionFr: 'Brésil · Équatorial Humide',
    regionEn: 'Brazil · Equatorial Rainforest',
    countryIso: 'BRA',
    isFrance: false,
    lat: -3.12,
    lon: -60.02,
    elevationM: 92,
    tempC: 29.8,
    humidityPercent: 89,
    soilMoistureM3: 0.43,
    rainMmH: 2.8,
    snowCmH: 0,
    precipitationMmH: 2.8,
    windKmh: 11,
    weatherCode: 81
  },
  {
    id: 'sa-atacama',
    nameFr: 'Désert d’Atacama & Andes Arides',
    nameEn: 'Atacama Hyper-Arid Desert',
    regionFr: 'Chili · Aridité Extrême',
    regionEn: 'Chile · Hyper-Arid Core',
    countryIso: 'CHL',
    isFrance: false,
    lat: -23.65,
    lon: -70.4,
    elevationM: 40,
    tempC: 23.5,
    humidityPercent: 22,
    soilMoistureM3: 0.03,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 19,
    weatherCode: 0
  },
  {
    id: 'sa-ushuaia',
    nameFr: 'Patagonie & Terre de Feu',
    nameEn: 'Patagonia & Tierra del Fuego',
    regionFr: 'Argentine · Subantarctique',
    regionEn: 'Argentina · Subantarctic',
    countryIso: 'ARG',
    isFrance: false,
    lat: -54.8,
    lon: -68.3,
    elevationM: 28,
    tempC: 1.8,
    humidityPercent: 84,
    soilMoistureM3: 0.36,
    rainMmH: 0.4,
    snowCmH: 0.3,
    precipitationMmH: 0.7,
    windKmh: 44,
    weatherCode: 68
  },
  {
    id: 'af-marrakech',
    nameFr: 'Maghreb — Marrakech & Atlas',
    nameEn: 'North Africa — Marrakech & Atlas',
    regionFr: 'Maroc · Aride Chaud',
    regionEn: 'Morocco · Hot Arid',
    countryIso: 'MAR',
    isFrance: false,
    lat: 31.63,
    lon: -7.98,
    elevationM: 466,
    tempC: 32.2,
    humidityPercent: 20,
    soilMoistureM3: 0.05,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 16,
    weatherCode: 0
  },
  {
    id: 'af-sahara',
    nameFr: 'Désert du Sahara Central (Hoggar)',
    nameEn: 'Central Sahara Desert',
    regionFr: 'Algérie / Niger · Hyper-Aride Chaud',
    regionEn: 'Sahara · Hyper-Arid Hot Core',
    countryIso: 'DZA',
    isFrance: false,
    lat: 22.79,
    lon: 5.52,
    elevationM: 1378,
    tempC: 36.4,
    humidityPercent: 12,
    soilMoistureM3: 0.02,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 21,
    weatherCode: 0
  },
  {
    id: 'af-cairo',
    nameFr: 'Égypte & Désert Libyque',
    nameEn: 'Egypt & Eastern Sahara',
    regionFr: 'Égypte · Aride Chaud',
    regionEn: 'Egypt · Hot Desert',
    countryIso: 'EGY',
    isFrance: false,
    lat: 28.0,
    lon: 30.0,
    elevationM: 85,
    tempC: 33.8,
    humidityPercent: 22,
    soilMoistureM3: 0.05,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 18,
    weatherCode: 0
  },
  {
    id: 'af-congo',
    nameFr: 'Bassin du Congo (Forêt Équatoriale)',
    nameEn: 'Congo Basin Rainforest',
    regionFr: 'Afrique Centrale · Équatorial Humide',
    regionEn: 'Central Africa · Equatorial Humid',
    countryIso: 'COD',
    isFrance: false,
    lat: 0.05,
    lon: 18.26,
    elevationM: 317,
    tempC: 27.6,
    humidityPercent: 90,
    soilMoistureM3: 0.44,
    rainMmH: 3.2,
    snowCmH: 0,
    precipitationMmH: 3.2,
    windKmh: 9,
    weatherCode: 82
  },
  {
    id: 'af-capetown',
    nameFr: 'Afrique Australe & Le Cap',
    nameEn: 'Southern Africa & Cape Basin',
    regionFr: 'Afrique du Sud · Tempéré Austral',
    regionEn: 'South Africa · Southern Temperate',
    countryIso: 'ZAF',
    isFrance: false,
    lat: -33.92,
    lon: 18.42,
    elevationM: 42,
    tempC: 18.4,
    humidityPercent: 68,
    soilMoistureM3: 0.24,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 26,
    weatherCode: 1
  },
  {
    id: 'as-riyadh',
    nameFr: 'Péninsule Arabique (Riyad)',
    nameEn: 'Arabian Peninsula Desert',
    regionFr: 'Arabie Saoudite · Hyper-Aride Chaud',
    regionEn: 'Saudi Arabia · Hyper-Arid Hot',
    countryIso: 'SAU',
    isFrance: false,
    lat: 24.71,
    lon: 46.68,
    elevationM: 612,
    tempC: 37.2,
    humidityPercent: 13,
    soilMoistureM3: 0.02,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 15,
    weatherCode: 0
  },
  {
    id: 'as-yakutsk',
    nameFr: 'Sibérie Orientale & Pergélisol (Iakoutsk)',
    nameEn: 'Eastern Siberia Permafrost (Yakutsk)',
    regionFr: 'Russie · Sibérie Polaire',
    regionEn: 'Russia · Polar Siberia',
    countryIso: 'RUS',
    isFrance: false,
    lat: 62.04,
    lon: 129.74,
    elevationM: 126,
    tempC: -11.5,
    humidityPercent: 80,
    soilMoistureM3: 0.35,
    rainMmH: 0,
    snowCmH: 0.8,
    precipitationMmH: 0.8,
    windKmh: 16,
    weatherCode: 73
  },
  {
    id: 'as-assam',
    nameFr: 'Inde & Mousson Himalayenne',
    nameEn: 'India & Meghalaya Monsoon',
    regionFr: 'Asie du Sud · Humide & Pluvieux',
    regionEn: 'South Asia · Humid Monsoon',
    countryIso: 'IND',
    isFrance: false,
    lat: 25.27,
    lon: 91.73,
    elevationM: 1484,
    tempC: 24.4,
    humidityPercent: 93,
    soilMoistureM3: 0.45,
    rainMmH: 3.8,
    snowCmH: 0,
    precipitationMmH: 3.8,
    windKmh: 14,
    weatherCode: 65
  },
  {
    id: 'as-singapore',
    nameFr: 'Asie du Sud-Est & Indonésie',
    nameEn: 'Southeast Asia & Maritime Continent',
    regionFr: 'Singapour / Bornéo · Équatorial Humide',
    regionEn: 'Southeast Asia · Equatorial Humid',
    countryIso: 'SGP',
    isFrance: false,
    lat: 1.35,
    lon: 103.82,
    elevationM: 15,
    tempC: 29.1,
    humidityPercent: 86,
    soilMoistureM3: 0.4,
    rainMmH: 2.1,
    snowCmH: 0,
    precipitationMmH: 2.1,
    windKmh: 12,
    weatherCode: 80
  },
  {
    id: 'as-tokyo',
    nameFr: 'Japon & Façade Pacifique',
    nameEn: 'Japan & Western Pacific',
    regionFr: 'Japon · Honshu',
    regionEn: 'Japan · Honshu',
    countryIso: 'JPN',
    isFrance: false,
    lat: 35.68,
    lon: 139.77,
    elevationM: 24,
    tempC: 18.6,
    humidityPercent: 74,
    soilMoistureM3: 0.29,
    rainMmH: 0.2,
    snowCmH: 0,
    precipitationMmH: 0.2,
    windKmh: 19,
    weatherCode: 2
  },
  {
    id: 'oc-alice',
    nameFr: 'Outback Australien (Désert Central)',
    nameEn: 'Australian Outback Red Centre',
    regionFr: 'Australie · Désert Aride Chaud',
    regionEn: 'Australia · Arid Outback',
    countryIso: 'AUS',
    isFrance: false,
    lat: -23.7,
    lon: 133.88,
    elevationM: 545,
    tempC: 33.1,
    humidityPercent: 18,
    soilMoistureM3: 0.04,
    rainMmH: 0,
    snowCmH: 0,
    precipitationMmH: 0,
    windKmh: 22,
    weatherCode: 0
  },
  {
    id: 'an-vostok',
    nameFr: 'Calotte Polaire Antarctique (Dôme C)',
    nameEn: 'East Antarctic Ice Sheet (Dome C)',
    regionFr: 'Antarctique · Glace Polaire',
    regionEn: 'Antarctica · Polar Ice Sheet',
    countryIso: 'ATA',
    isFrance: false,
    lat: -75.1,
    lon: 123.33,
    elevationM: 3233,
    tempC: -46.5,
    humidityPercent: 78,
    soilMoistureM3: 0.38,
    rainMmH: 0,
    snowCmH: 0.4,
    precipitationMmH: 0.4,
    windKmh: 28,
    weatherCode: 71
  }
];

function classifyHydrologicalState(node: {
  tempC: number;
  humidityPercent: number;
  soilMoistureM3: number;
  rainMmH: number;
  snowCmH: number;
  precipitationMmH: number;
  weatherCode: number;
}): HydrologicalState {
  const isSnowCode =
    (node.weatherCode >= 71 && node.weatherCode <= 77) ||
    node.weatherCode === 85 ||
    node.weatherCode === 86;
  if (node.snowCmH > 0.02 || isSnowCode || node.tempC <= -1.0) {
    return 'snow';
  }

  const isRainCode =
    (node.weatherCode >= 51 && node.weatherCode <= 67) ||
    (node.weatherCode >= 80 && node.weatherCode <= 82) ||
    node.weatherCode >= 95;
  if (node.rainMmH > 0.05 || node.precipitationMmH > 0.1 || isRainCode) {
    return 'rain';
  }

  if (node.soilMoistureM3 <= 0.16 || node.humidityPercent <= 45) {
    return 'dry';
  }

  if (node.soilMoistureM3 >= 0.3 || node.humidityPercent >= 76) {
    return 'humid';
  }

  return 'temperate';
}

function lerpColor(
  t: number,
  stops: { pos: number; r: number; g: number; b: number }[]
): [number, number, number] {
  if (t <= stops[0].pos) return [stops[0].r, stops[0].g, stops[0].b];
  const last = stops[stops.length - 1];
  if (t >= last.pos) return [last.r, last.g, last.b];

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.pos && t <= b.pos) {
      const u = (t - a.pos) / (b.pos - a.pos);
      return [
        Math.round(a.r + (b.r - a.r) * u),
        Math.round(a.g + (b.g - a.g) * u),
        Math.round(a.b + (b.b - a.b) * u)
      ];
    }
  }
  return [last.r, last.g, last.b];
}

// Color ramps for continuous surface rendering:
// 1. Thermal Surface Ramp: Cold (Blue/Cyan) -> Mild -> Warm/Hot (Orange/Red)
const THERMAL_STOPS = [
  { pos: -15, r: 14, g: 165, b: 233 }, // Deep Sub-zero Cyan-Blue
  { pos: 0, r: 29, g: 78, b: 216 }, // Freezing Royal Blue (#1D4ED8)
  { pos: 9, r: 37, g: 99, b: 235 }, // Cold North Blue (#2563EB)
  { pos: 13.5, r: 56, g: 189, b: 248 }, // Cool Temperate Sky Blue
  { pos: 16.5, r: 250, g: 204, b: 21 }, // Mild Transition Amber-Yellow
  { pos: 20.5, r: 249, g: 115, b: 22 }, // Warm South Orange (#F97316)
  { pos: 25, r: 220, g: 38, b: 38 }, // Hot Mediterranean Red (#DC2626)
  { pos: 34, r: 153, g: 27, b: 27 } // Extreme Heat Deep Crimson (#991B1B)
];

// 2. Soil Moisture / Dry vs Humid Surface Ramp: Dry (Red/Orange) -> Humid (Emerald/Blue)
const MOISTURE_STOPS = [
  { pos: 0.04, r: 185, g: 28, b: 28 }, // Extreme Drought Crimson Red
  { pos: 0.11, r: 234, g: 88, b: 12 }, // Dry Zone Orange-Red
  { pos: 0.18, r: 245, g: 158, b: 11 }, // Moderate Dry Amber
  { pos: 0.25, r: 16, g: 185, b: 129 }, // Balanced / Humid Emerald
  { pos: 0.33, r: 14, g: 165, b: 233 }, // Saturated Humid Cyan-Blue
  { pos: 0.42, r: 29, g: 78, b: 216 } // Very Wet / Saturated Deep Blue
];

interface Props {
  lang: Language;
}

export const PlanetEarth3DSection: React.FC<Props> = ({ lang }) => {
  const isEn = lang === 'en';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenSurfaceRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize stations with precomputed 3D unit vectors
  const [nodes, setNodes] = useState<EarthLiveNode[]>(() =>
    RAW_STATIONS.map((n) => {
      const vec = latLonToUnitVector(n.lat, n.lon);
      return {
        ...n,
        ...vec,
        state: classifyHydrologicalState(n),
        isLiveApi: false,
        updatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
    })
  );

  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [liveSyncSuccess, setLiveSyncSuccess] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Start focused on France & Europe so the user immediately sees the North (Blue) vs South (Red) surface!
  const [rotation, setRotation] = useState<[number, number, number]>([-2.3, -46.6, 0]);
  const [zoom, setZoom] = useState<number>(3.8);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>('france');
  const [layerMode, setLayerMode] = useState<GlobeLayerMode>('temperature');
  const [showRegionLabels, setShowRegionLabels] = useState<boolean>(true);

  // Inspected surface coordinate (clicked or hovered anywhere on the continuous surface)
  const [inspectedCoord, setInspectedCoord] = useState<{
    lat: number;
    lon: number;
    tempC: number;
    humidityPercent: number;
    soilMoistureM3: number;
    precipitationMmH: number;
    snowCmH: number;
    windKmh: number;
    nearestNode: EarthLiveNode;
  } | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Parse 50m Land & Countries polygons once
  const landGeoJson = useMemo(() => {
    const topo = landTopo50m as any;
    return feature(topo, topo.objects.land) as any;
  }, []);

  const worldGeoJson = useMemo(() => {
    const topo = countriesTopo50m as any;
    return feature(topo, topo.objects.countries) as any;
  }, []);

  const graticule = useMemo(() => geoGraticule10(), []);

  // Compute continuous interpolated surface values at any (lat, lon) on Earth
  const evaluateSurfaceAtLatLon = useCallback(
    (lat: number, lon: number, stationList: EarthLiveNode[]) => {
      const { ux, uy, uz } = latLonToUnitVector(lat, lon);
      let wSum = 0;
      let tempSum = 0;
      let humSum = 0;
      let soilSum = 0;
      let precipSum = 0;
      let snowSum = 0;
      let windSum = 0;

      let bestDist2 = Infinity;
      let nearest = stationList[0];

      for (let i = 0; i < stationList.length; i++) {
        const s = stationList[i];
        const dot = ux * s.ux + uy * s.uy + uz * s.uz;
        const d2 = Math.max(0.00002, 2 - 2 * dot);
        if (d2 < bestDist2) {
          bestDist2 = d2;
          nearest = s;
        }
        // Sharp localized inverse distance weighting (power p = 2.4)
        const w = 1 / (d2 * d2 * Math.sqrt(d2));
        wSum += w;
        tempSum += s.tempC * w;
        humSum += s.humidityPercent * w;
        soilSum += s.soilMoistureM3 * w;
        precipSum += s.precipitationMmH * w;
        snowSum += s.snowCmH * w;
        windSum += s.windKmh * w;
      }

      return {
        lat,
        lon,
        tempC: Number((tempSum / wSum).toFixed(1)),
        humidityPercent: Math.round(humSum / wSum),
        soilMoistureM3: Number((soilSum / wSum).toFixed(2)),
        precipitationMmH: Number((precipSum / wSum).toFixed(2)),
        snowCmH: Number((snowSum / wSum).toFixed(2)),
        windKmh: Math.round(windSum / wSum),
        nearestNode: nearest
      };
    },
    []
  );

  // Initialize inspected surface coordinate to Southern France (Perpignan / Provence)
  useEffect(() => {
    if (nodes.length > 0 && !inspectedCoord) {
      setInspectedCoord(evaluateSurfaceAtLatLon(43.3, 3.5, nodes));
    }
  }, [nodes, inspectedCoord, evaluateSurfaceAtLatLon]);

  // Fetch Real-Time Batch Telemetry from Open-Meteo API
  const syncLiveEarthTelemetry = useCallback(async () => {
    setLoadingLive(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const lats = RAW_STATIONS.map((n) => n.lat.toFixed(2)).join(',');
      const lons = RAW_STATIONS.map((n) => n.lon.toFixed(2)).join(',');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,rain,snowfall,weather_code,wind_speed_10m,soil_moisture_0_to_7cm&timezone=auto`;

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const resultsArray = Array.isArray(json) ? json : [json];
        const nowStr = new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const updatedNodes: EarthLiveNode[] = RAW_STATIONS.map((baseNode, idx) => {
          const item = resultsArray[idx]?.current;
          const vec = latLonToUnitVector(baseNode.lat, baseNode.lon);

          if (!item) {
            return {
              ...baseNode,
              ...vec,
              state: classifyHydrologicalState(baseNode),
              isLiveApi: false,
              updatedAt: nowStr
            };
          }

          const tempC =
            typeof item.temperature_2m === 'number'
              ? Number(item.temperature_2m.toFixed(1))
              : baseNode.tempC;
          const humidityPercent =
            typeof item.relative_humidity_2m === 'number'
              ? Math.round(item.relative_humidity_2m)
              : baseNode.humidityPercent;
          const rainMmH =
            typeof item.rain === 'number' ? Number(item.rain.toFixed(2)) : baseNode.rainMmH;
          const snowCmH =
            typeof item.snowfall === 'number'
              ? Number(item.snowfall.toFixed(2))
              : baseNode.snowCmH;
          const precipitationMmH =
            typeof item.precipitation === 'number'
              ? Number(item.precipitation.toFixed(2))
              : baseNode.precipitationMmH;
          const windKmh =
            typeof item.wind_speed_10m === 'number'
              ? Math.round(item.wind_speed_10m)
              : baseNode.windKmh;
          const weatherCode =
            typeof item.weather_code === 'number' ? item.weather_code : baseNode.weatherCode;

          const rawSoil = item.soil_moisture_0_to_7cm;
          const soilMoistureM3 =
            typeof rawSoil === 'number' && rawSoil > 0
              ? Number(rawSoil.toFixed(3))
              : Number(
                  Math.max(
                    0.03,
                    Math.min(0.46, (humidityPercent / 100) * 0.38 + (precipitationMmH > 0 ? 0.08 : -0.04))
                  ).toFixed(2)
                );

          const merged = {
            ...baseNode,
            ...vec,
            tempC,
            humidityPercent,
            soilMoistureM3,
            rainMmH,
            snowCmH,
            precipitationMmH,
            windKmh,
            weatherCode
          };

          return {
            ...merged,
            state: classifyHydrologicalState(merged),
            isLiveApi: true,
            updatedAt: nowStr
          };
        });

        setNodes(updatedNodes);
        setLiveSyncSuccess(true);
        setLastSyncTime(nowStr);
        setInspectedCoord((prev) =>
          evaluateSurfaceAtLatLon(prev?.lat ?? 43.3, prev?.lon ?? 3.5, updatedNodes)
        );
      }
    } catch {
      clearTimeout(timeout);
    } finally {
      setLoadingLive(false);
    }
  }, [evaluateSurfaceAtLatLon]);

  useEffect(() => {
    syncLiveEarthTelemetry();
    const interval = setInterval(syncLiveEarthTelemetry, 120_000);
    return () => clearInterval(interval);
  }, [syncLiveEarthTelemetry]);

  // Apply Camera Preset
  const applyPreset = (preset: CameraPreset) => {
    setAutoRotate(false);
    setActivePresetId(preset.id);
    setRotation([-preset.lon, -preset.lat, 0]);
    setZoom(preset.zoom);
  };

  // Compute dynamic France North vs South temperature range to adapt the thermal surface contrast
  const franceThermalBounds = useMemo(() => {
    const frNodes = nodes.filter((n) => n.isFrance && n.elevationM < 1000);
    if (frNodes.length === 0) return { minT: 8, maxT: 25, midT: 16 };
    const temps = frNodes.map((n) => n.tempC);
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const midT = (minT + maxT) / 2;
    return { minT, maxT, midT };
  }, [nodes]);

  // Continuous 3D Surface Rendering Loop (Zero Dots — Pure Colored Continental Surface)
  useEffect(() => {
    let animationFrameId: number;

    const renderGlobeSurface = () => {
      if (autoRotate && !isDraggingRef.current) {
        setRotation((prev) => [((prev[0] + 0.14 + 180) % 360) - 180, prev[1], prev[2]]);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 680;
      const height = rect.height || 580;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.42;
      const globeRadius = baseRadius * zoom;

      // 1. Deep Space Backdrop
      const spaceGrad = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.2,
        cx,
        cy,
        Math.max(width, height) * 0.75
      );
      spaceGrad.addColorStop(0, '#0B1324');
      spaceGrad.addColorStop(0.65, '#070C18');
      spaceGrad.addColorStop(1, '#03060C');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Atmospheric 3D Limb Glow
      const limbGrad = ctx.createRadialGradient(
        cx,
        cy,
        globeRadius * 0.94,
        cx,
        cy,
        globeRadius * 1.12
      );
      limbGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      limbGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.10)');
      limbGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = limbGrad;
      ctx.fill();

      // 3. Configure Orthographic 3D Projection
      const projection = geoOrthographic()
        .scale(globeRadius)
        .translate([cx, cy])
        .rotate(rotation)
        .clipAngle(90);

      const pathGenerator = geoPath(projection, ctx);

      // 4. Deep Ocean 3D Sphere Base
      const oceanGrad = ctx.createRadialGradient(
        cx - globeRadius * 0.28,
        cy - globeRadius * 0.28,
        globeRadius * 0.05,
        cx,
        cy,
        globeRadius
      );
      oceanGrad.addColorStop(0, '#0F294A');
      oceanGrad.addColorStop(0.55, '#0A1C36');
      oceanGrad.addColorStop(1, '#040C1A');

      ctx.beginPath();
      pathGenerator({ type: 'Sphere' });
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // 5. Ocean Graticule Grid
      ctx.beginPath();
      pathGenerator(graticule);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // 6. Generate Continuous Meteorological Surface Field on Offscreen Raster Buffer
      const GRID_SIZE = 156;
      if (!offscreenSurfaceRef.current) {
        offscreenSurfaceRef.current = document.createElement('canvas');
        offscreenSurfaceRef.current.width = GRID_SIZE;
        offscreenSurfaceRef.current.height = GRID_SIZE;
      }
      const offCanvas = offscreenSurfaceRef.current;
      const offCtx = offCanvas.getContext('2d');

      if (offCtx && nodes.length > 0) {
        const imgData = offCtx.createImageData(GRID_SIZE, GRID_SIZE);
        const data = imgData.data;

        // Precompute inverse orthographic rotation angles
        // In d3.geoOrthographic, rotation is [lambda0, phi0, 0] in degrees
        const lambda0 = (-rotation[0] * Math.PI) / 180;
        const phi0 = (-rotation[1] * Math.PI) / 180;
        const cosPhi0 = Math.cos(phi0);
        const sinPhi0 = Math.sin(phi0);
        const cosLambda0 = Math.cos(lambda0);
        const sinLambda0 = Math.sin(lambda0);

        // Visible viewport bounds on screen
        const minScreenX = Math.max(0, cx - globeRadius);
        const maxScreenX = Math.min(width, cx + globeRadius);
        const minScreenY = Math.max(0, cy - globeRadius);
        const maxScreenY = Math.min(height, cy + globeRadius);

        const spanX = Math.max(1, maxScreenX - minScreenX);
        const spanY = Math.max(1, maxScreenY - minScreenY);

        const { minT, maxT } = franceThermalBounds;
        const tempSpread = Math.max(4, maxT - minT);

        for (let gy = 0; gy < GRID_SIZE; gy++) {
          const sy = minScreenY + ((gy + 0.5) / GRID_SIZE) * spanY;
          const ny = (cy - sy) / globeRadius; // Up is +Y in orthographic space

          for (let gx = 0; gx < GRID_SIZE; gx++) {
            const sx = minScreenX + ((gx + 0.5) / GRID_SIZE) * spanX;
            const nx = (sx - cx) / globeRadius;

            const r2 = nx * nx + ny * ny;
            const pIdx = (gy * GRID_SIZE + gx) * 4;

            if (r2 > 1.0) {
              data[pIdx + 3] = 0;
              continue;
            }

            const nz = Math.sqrt(1.0 - r2);

            // Convert view-space (nx, ny, nz) on the unit sphere to Earth-fixed 3D unit vector (ux, uy, uz)
            // Forward orthographic around (lambda0, phi0):
            // nx = cos(phi)*sin(lambda - lambda0)
            // ny = cos(phi0)*sin(phi) - sin(phi0)*cos(phi)*cos(lambda - lambda0)
            // nz = sin(phi0)*sin(phi) + cos(phi0)*cos(phi)*cos(lambda - lambda0)
            // Therefore inverse is:
            const sinPhi = nz * sinPhi0 + ny * cosPhi0;
            const cosPhiCosDL = nz * cosPhi0 - ny * sinPhi0;
            const cosPhiSinDL = nx;

            const ux = cosPhiCosDL * cosLambda0 - cosPhiSinDL * sinLambda0;
            const uy = cosPhiCosDL * sinLambda0 + cosPhiSinDL * cosLambda0;
            const uz = sinPhi;

            // Interpolate all stations using fast spherical chord distance squared: d2 = 2 - 2*dot
            let wSum = 0;
            let tempVal = 0;
            let soilVal = 0;
            let humVal = 0;
            let rainVal = 0;
            let snowVal = 0;

            for (let i = 0; i < nodes.length; i++) {
              const st = nodes[i];
              const dot = ux * st.ux + uy * st.uy + uz * st.uz;
              const d2 = Math.max(0.000015, 2.0 - 2.0 * dot);
              // Sharper localization when zoomed into France so North/South/Alps boundaries are crisp
              const w = 1.0 / (d2 * d2 * Math.sqrt(d2));
              wSum += w;
              tempVal += st.tempC * w;
              soilVal += st.soilMoistureM3 * w;
              humVal += st.humidityPercent * w;
              rainVal += st.precipitationMmH * w;
              snowVal += st.snowCmH * w;
            }

            const tInterp = tempVal / wSum;
            const soilInterp = soilVal / wSum;
            const humInterp = humVal / wSum;
            const rainInterp = rainVal / wSum;
            const snowInterp = snowVal / wSum;

            let r = 30;
            let g = 64;
            let b = 120;

            if (layerMode === 'temperature') {
              // When zoomed into France/Europe, normalize contrast so the North of France is vividly Blue and the South of France is vividly Red
              let effectiveTemp = tInterp;
              if (zoom >= 2.0 && tInterp >= minT - 4 && tInterp <= maxT + 4) {
                const norm = (tInterp - minT) / tempSpread; // 0 in North (coldest), 1 in South (warmest)
                effectiveTemp = 6 + norm * 21; // Maps North -> ~6°C (Vivid Blue) and South -> ~27°C (Vivid Red)
              }
              const [cr, cg, cb] = lerpColor(effectiveTemp, THERMAL_STOPS);
              r = cr;
              g = cg;
              b = cb;
            } else if (layerMode === 'moisture') {
              const [cr, cg, cb] = lerpColor(soilInterp, MOISTURE_STOPS);
              r = cr;
              g = cg;
              b = cb;
            } else if (layerMode === 'precipitation') {
              if (snowInterp > 0.08 || tInterp <= -0.8) {
                // Snow / Ice surface: Crisp Cyan-White
                const snowIntensity = Math.min(1, snowInterp * 1.2 + (tInterp < -2 ? 0.6 : 0.3));
                r = Math.round(125 + snowIntensity * 115);
                g = Math.round(211 + snowIntensity * 38);
                b = 252;
              } else if (rainInterp > 0.12) {
                // Active Rain surface: Vivid Cobalt-Blue
                const rainIntensity = Math.min(1, rainInterp / 1.8);
                r = Math.round(56 - rainIntensity * 28);
                g = Math.round(140 - rainIntensity * 55);
                b = Math.round(235 + rainIntensity * 20);
              } else {
                // Dry / No-precipitation surface: Warm Amber/Ochre according to aridity
                const aridity = Math.max(0, Math.min(1, (65 - humInterp) / 45));
                r = Math.round(65 + aridity * 165);
                g = Math.round(95 - aridity * 15);
                b = Math.round(85 - aridity * 55);
              }
            } else {
              // Combined Synthesis Surface:
              if (snowInterp > 0.08 || tInterp <= -1.0) {
                r = 186;
                g = 230;
                b = 253; // Snow White-Cyan
              } else if (rainInterp > 0.15) {
                r = 37;
                g = 99;
                b = 235; // Rain Cobalt Blue
              } else if (soilInterp <= 0.16 || humInterp <= 44) {
                // Dry & Warm surface (Red-Orange)
                const [cr, cg, cb] = lerpColor(Math.max(21, tInterp), THERMAL_STOPS);
                r = cr;
                g = cg;
                b = cb;
              } else {
                // Humid / Temperate surface
                const [cr, cg, cb] = lerpColor(soilInterp, MOISTURE_STOPS);
                r = cr;
                g = cg;
                b = cb;
              }
            }

            // Apply 3D spherical Lambertian limb shading so the colored surface looks genuinely 3D
            const shade = 0.58 + 0.42 * nz;
            data[pIdx] = Math.min(255, Math.round(r * shade));
            data[pIdx + 1] = Math.min(255, Math.round(g * shade));
            data[pIdx + 2] = Math.min(255, Math.round(b * shade));
            data[pIdx + 3] = 242;
          }
        }

        offCtx.putImageData(imgData, 0, 0);

        // 7. Clip strictly to the Continental Landmasses (`landGeoJson`) and paint the smooth interpolated surface!
        ctx.save();
        ctx.beginPath();
        pathGenerator(landGeoJson);
        ctx.clip();

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offCanvas, minScreenX, minScreenY, spanX, spanY);
        ctx.restore();
      }

      // 8. Draw Crisp Country Borders & Highlight France's Border on Top of the Colored Surface
      if (worldGeoJson?.features) {
        for (const feat of worldGeoJson.features) {
          const isFrancePoly =
            feat.id === '250' ||
            feat.properties?.name === 'France' ||
            feat.properties?.NAME === 'France';

          ctx.beginPath();
          pathGenerator(feat);

          if (isFrancePoly) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = zoom >= 2.0 ? 2.2 : 1.4;
            ctx.stroke();
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 9. Optional Clean Regional Typography Overlay (No Dots — Just Subtle Floating Region Names & Values)
      if (showRegionLabels) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
        ctx.clip();

        const keyRegions =
          zoom >= 2.2
            ? [
                { lat: 50.3, lon: 2.8, labelFr: 'NORD', labelEn: 'NORTH' },
                { lat: 48.3, lon: -3.2, labelFr: 'BRETAGNE', labelEn: 'BRITTANY' },
                { lat: 48.8, lon: 2.35, labelFr: 'PARIS', labelEn: 'PARIS' },
                { lat: 48.6, lon: 7.4, labelFr: 'ALSACE', labelEn: 'ALSACE' },
                { lat: 45.8, lon: 6.7, labelFr: 'ALPES', labelEn: 'ALPS' },
                { lat: 44.8, lon: -0.5, labelFr: 'AQUITAINE', labelEn: 'AQUITAINE' },
                { lat: 43.3, lon: 2.2, labelFr: 'SUD / OCCITANIE', labelEn: 'SOUTH / OCCITANIE' },
                { lat: 43.5, lon: 5.5, labelFr: 'PROVENCE', labelEn: 'PROVENCE' },
                { lat: 42.1, lon: 9.0, labelFr: 'CORSE', labelEn: 'CORSICA' }
              ]
            : [
                { lat: 46.6, lon: 2.3, labelFr: 'FRANCE', labelEn: 'FRANCE' },
                { lat: 40.0, lon: -4.0, labelFr: 'ESPAGNE', labelEn: 'SPAIN' },
                { lat: 64.0, lon: 16.0, labelFr: 'SCANDINAVIE', labelEn: 'SCANDINAVIA' },
                { lat: 23.0, lon: 12.0, labelFr: 'SAHARA', labelEn: 'SAHARA' },
                { lat: -4.0, lon: -60.0, labelFr: 'AMAZONIE', labelEn: 'AMAZONIA' },
                { lat: 62.0, lon: 105.0, labelFr: 'SIBÉRIE', labelEn: 'SIBERIA' },
                { lat: 72.0, lon: -42.0, labelFr: 'GROENLAND', labelEn: 'GREENLAND' }
              ];

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const reg of keyRegions) {
          const proj = projection([reg.lon, reg.lat]);
          if (!proj) continue;
          const [px, py] = proj;

          const surf = evaluateSurfaceAtLatLon(reg.lat, reg.lon, nodes);
          const title = isEn ? reg.labelEn : reg.labelFr;
          const valText =
            layerMode === 'temperature'
              ? `${surf.tempC > 0 ? '+' : ''}${surf.tempC}°C`
              : layerMode === 'moisture'
              ? `${surf.humidityPercent}% HR`
              : surf.snowCmH > 0.05 || surf.tempC <= -1
              ? isEn
                ? `Snow ${surf.tempC}°C`
                : `Neige ${surf.tempC}°C`
              : surf.precipitationMmH > 0.1
              ? isEn
                ? `Rain ${surf.precipitationMmH}mm`
                : `Pluie ${surf.precipitationMmH}mm`
              : `${surf.tempC}°C · ${surf.humidityPercent}%`;

          ctx.font = '700 10px Inter, system-ui, sans-serif';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(title, px, py - 6);

          ctx.font = '600 11px JetBrains Mono, monospace';
          ctx.fillStyle = '#F8FAFC';
          ctx.fillText(valText, px, py + 7);
        }

        ctx.restore();
      }

      // 10. Subtle Crosshair Ring at the Currently Inspected Surface Location
      if (inspectedCoord) {
        const proj = projection([inspectedCoord.lon, inspectedCoord.lat]);
        if (proj) {
          const [ix, iy] = proj;
          ctx.save();
          ctx.beginPath();
          ctx.arc(ix, iy, 9, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 11. 3D Outer Sphere Rim Highlight
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderGlobeSurface);
    };

    animationFrameId = requestAnimationFrame(renderGlobeSurface);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    rotation,
    zoom,
    autoRotate,
    landGeoJson,
    worldGeoJson,
    graticule,
    nodes,
    layerMode,
    showRegionLabels,
    franceThermalBounds,
    inspectedCoord,
    evaluateSurfaceAtLatLon,
    isEn
  ]);

  // Pointer Handlers: Drag to rotate 3D globe OR click anywhere on the surface to inspect that exact zone
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.26 / Math.sqrt(zoom);
    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-82, Math.min(82, prev[1] - dy * sensitivity)),
      0
    ]);
    setActivePresetId('custom');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    const moveDist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    );
    // If click (not drag), invert 3D orthographic projection to sample the exact surface coordinate!
    if (moveDist < 6) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const width = rect.width || 680;
      const height = rect.height || 580;
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.42 * zoom;

      const projection = geoOrthographic()
        .scale(globeRadius)
        .translate([cx, cy])
        .rotate(rotation)
        .clipAngle(90);

      const inverted = projection.invert?.([mx, my]);
      if (inverted && !isNaN(inverted[0]) && !isNaN(inverted[1])) {
        const [lon, lat] = inverted;
        setInspectedCoord(evaluateSurfaceAtLatLon(lat, lon, nodes));
      }
    }
  };

  // Summary of North vs South France live thermal & moisture contrast
  const franceNorthSouthComparison = useMemo(() => {
    const north = evaluateSurfaceAtLatLon(50.4, 2.8, nodes); // Hauts-de-France / Nord
    const south = evaluateSurfaceAtLatLon(43.2, 3.5, nodes); // Midi / Languedoc / Provence
    const west = evaluateSurfaceAtLatLon(48.3, -4.0, nodes); // Bretagne
    const alps = evaluateSurfaceAtLatLon(45.88, 6.89, nodes); // Mont-Blanc
    return { north, south, west, alps };
  }, [nodes, evaluateSurfaceAtLatLon]);

  const currentSurface = inspectedCoord || franceNorthSouthComparison.south;

  return (
    <section
      id="planete-terre-3d"
      className="py-12 sm:py-16 lg:py-20 border-t border-slate-200 bg-white"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span className="font-mono-tabular text-emerald-700 font-semibold">
                {isEn
                  ? '● 3D CONTINUOUS SURFACE THERMOGRAPHY & HYDROLOGY'
                  : '● CARTOGRAPHIE SURFACIQUE 3D CONTINUE — TEMPÉRATURES, SÉCHERESSE & PRÉCIPITATIONS'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn
                  ? 'Open-Meteo Live Surface Interpolation'
                  : 'Interpolation Surfacique Continue en Temps Réel'}
              </span>
              {lastSyncTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular text-slate-600">
                    {isEn ? `Synced at ${lastSyncTime}` : `Synchronisé à ${lastSyncTime}`}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2 leading-tight">
              {isEn
                ? '3D Planet Earth Surface Map: Warm South in Red, Cold North in Blue, Dry & Humid Surfaces'
                : 'Planète Terre en 3D : coloration continue des surfaces (Sud chaud en rouge, Nord froid en bleu, zones sèches et humides)'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
              {isEn
                ? 'Continuous meteorological surface shading across France and all continents without discrete dots: warmer Southern regions are colored in orange-red, colder Northern and Alpine zones in deep blue-cyan, dry soil surfaces in ochre-red, and humid/rainy surfaces in emerald and cobalt blue.'
                : 'Visualisation par surfaces continues sur toute la France et les continents (sans points isolés) : lorsqu’il fait chaud et sec au Sud de la France, toute la surface méridionale est coloriée en rouge-orangé tandis que le Nord plus froid et humide est colorié en bleu.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => {
                const frPreset = CAMERA_PRESETS.find((p) => p.id === 'france');
                if (frPreset) applyPreset(frPreset);
              }}
              className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${
                activePresetId === 'france'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? 'Center on France Surface (North/South)'
                  : 'Centrer sur la Surface de la France'}
              </span>
            </button>

            <button
              type="button"
              onClick={syncLiveEarthTelemetry}
              disabled={loadingLive}
              className="min-h-[40px] px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
              <span>{isEn ? 'Refresh Live Surface' : 'Actualiser la Surface en Direct'}</span>
            </button>
          </div>
        </div>

        {/* 4-Column Direct Surface Comparison Bar (North France Blue vs South France Red, Brittany Rain/Humid, Alps Snow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 bg-[#F8FAFC] divide-y sm:divide-y-0 sm:divide-x divide-slate-200 mt-8">
          <button
            type="button"
            onClick={() => {
              setLayerMode('temperature');
              setInspectedCoord(franceNorthSouthComparison.south);
              const frPreset = CAMERA_PRESETS.find((p) => p.id === 'france');
              if (frPreset) applyPreset(frPreset);
            }}
            className="p-4 text-left hover:bg-red-50/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono-tabular text-red-700 uppercase font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                {isEn ? 'South of France (Warm Surface)' : 'Sud de la France (Surface Rouge)'}
              </span>
              <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[11px]">
                +{franceNorthSouthComparison.south.tempC}°C
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              {isEn
                ? `Occitanie, Roussillon & Provence · Soil ${franceNorthSouthComparison.south.humidityPercent}% HR`
                : `Occitanie, Roussillon & Provence · Air ${franceNorthSouthComparison.south.humidityPercent}% HR`}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setLayerMode('temperature');
              setInspectedCoord(franceNorthSouthComparison.north);
              const frPreset = CAMERA_PRESETS.find((p) => p.id === 'france');
              if (frPreset) applyPreset(frPreset);
            }}
            className="p-4 text-left hover:bg-blue-50/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono-tabular text-blue-700 uppercase font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                {isEn ? 'North of France (Cool Surface)' : 'Nord de la France (Surface Bleue)'}
              </span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px]">
                +{franceNorthSouthComparison.north.tempC}°C
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              {isEn
                ? `Hauts-de-France & Normandy · Humidity ${franceNorthSouthComparison.north.humidityPercent}%`
                : `Hauts-de-France & Normandie · Humidité ${franceNorthSouthComparison.north.humidityPercent}%`}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setLayerMode('moisture');
              setInspectedCoord(franceNorthSouthComparison.west);
              const frPreset = CAMERA_PRESETS.find((p) => p.id === 'france');
              if (frPreset) applyPreset(frPreset);
            }}
            className="p-4 text-left hover:bg-emerald-50/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono-tabular text-emerald-800 uppercase font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                {isEn ? 'Atlantic & Brittany (Humid/Rain)' : 'Façade Atlantique (Humide / Pluie)'}
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px]">
                {franceNorthSouthComparison.west.humidityPercent}% HR
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              {isEn
                ? 'Click to switch surface to Dry (Red) vs Humid (Blue/Green) soils'
                : 'Cliquez pour colorier les surfaces sèches vs surfaces humides'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setLayerMode('precipitation');
              setInspectedCoord(franceNorthSouthComparison.alps);
              const frPreset = CAMERA_PRESETS.find((p) => p.id === 'france');
              if (frPreset) applyPreset(frPreset);
            }}
            className="p-4 text-left hover:bg-sky-50/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono-tabular text-sky-800 uppercase font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                {isEn ? 'Alps & Cryosphere (Snow/Ice)' : 'Alpes & Pôles (Surface Neige / Gel)'}
              </span>
              <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded text-[11px]">
                {franceNorthSouthComparison.alps.tempC}°C
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              {isEn
                ? 'Mont-Blanc, Pyrenees, Greenland & Arctic snow surfaces'
                : 'Surfaces enneigées ou gelées (Mont-Blanc, Pyrénées, Arctique)'}
            </div>
          </button>
        </div>

        {/* Control Deck: Continuous Surface Layer Selector + Camera Presets */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 py-4 border-b border-slate-200">
          {/* Layer Mode Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono-tabular uppercase text-slate-500 mr-1">
              {isEn ? 'Surface Coloring:' : 'Coloration de la Surface :'}
            </span>
            {(
              [
                {
                  id: 'temperature',
                  labelFr: 'Températures (Chaud = Rouge / Froid = Bleu)',
                  labelEn: 'Temperature (Warm = Red / Cold = Blue)'
                },
                {
                  id: 'moisture',
                  labelFr: 'Zones Sèches (Rouge/Ocre) vs Humides (Bleu/Vert)',
                  labelEn: 'Dry Surfaces (Red) vs Humid Surfaces (Blue/Green)'
                },
                {
                  id: 'precipitation',
                  labelFr: 'Surfaces de Pluie (Bleu) & Neige (Blanc-Cyan)',
                  labelEn: 'Rain Surfaces (Blue) & Snow Surfaces (White-Cyan)'
                },
                {
                  id: 'combined',
                  labelFr: 'Synthèse Météo Continue',
                  labelEn: 'Combined Continuous Surface'
                }
              ] as { id: GlobeLayerMode; labelFr: string; labelEn: string }[]
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setLayerMode(mode.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  layerMode === mode.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isEn ? mode.labelEn : mode.labelFr}
              </button>
            ))}
          </div>

          {/* Regional Camera Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono-tabular uppercase text-slate-500 mr-1">
              {isEn ? 'View:' : 'Cadrage :'}
            </span>
            {CAMERA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-2.5 py-1.5 text-xs font-mono-tabular rounded-md border transition-colors cursor-pointer ${
                  activePresetId === preset.id
                    ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isEn ? preset.labelEn : preset.labelFr}
              </button>
            ))}
          </div>
        </div>

        {/* Main 12-Column Interactive 3D Surface Globe + Surface Telemetry Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          {/* Left 7 Columns: Continuous Colored Surface 3D Earth Viewport */}
          <div className="lg:col-span-7 bg-[#050A14] border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
            {/* Top Overlay Controls inside 3D Viewport */}
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/85 backdrop-blur-xs border border-slate-700/80 px-3 py-1.5 rounded-md text-[11px] font-mono-tabular text-slate-200 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isEn
                    ? `Click any surface or drag to rotate · Zoom ×${zoom.toFixed(1)}`
                    : `Cliquez sur n’importe quelle surface ou glissez · Zoom ×${zoom.toFixed(1)}`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setShowRegionLabels((prev) => !prev)}
                  className={`px-2.5 py-1.5 border rounded-md text-xs font-mono-tabular cursor-pointer ${
                    showRegionLabels
                      ? 'bg-slate-800 text-white border-slate-600'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800'
                  }`}
                >
                  {isEn ? 'Names' : 'Noms'}
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-md text-xs font-mono-tabular flex items-center gap-1 cursor-pointer"
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoRotate ? (isEn ? 'Pause' : 'Pause') : isEn ? 'Rotate' : 'Tourner'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(5.5, Number((z + 0.5).toFixed(2))))}
                  className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-md cursor-pointer"
                  title={isEn ? 'Zoom In' : 'Zoomer'}
                  aria-label={isEn ? 'Zoom In' : 'Zoomer'}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.5).toFixed(2))))}
                  className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-md cursor-pointer"
                  title={isEn ? 'Zoom Out' : 'Dézoomer'}
                  aria-label={isEn ? 'Zoom Out' : 'Dézoomer'}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D Continuous Surface HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => {
                isDraggingRef.current = false;
              }}
              className="w-full h-[460px] sm:h-[540px] lg:h-[580px] block cursor-grab active:cursor-grabbing touch-none"
            />

            {/* Continuous Color Gradient Scale Bar at Bottom of 3D Viewport */}
            <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200">
              {layerMode === 'temperature' && (
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular text-slate-300">
                    <span>
                      {isEn ? '❄ COLD / NORTH / ALPS (BLUE)' : '❄ FROID / NORD / MONTAGNE (BLEU)'}
                    </span>
                    <span>{isEn ? 'MILD (YELLOW)' : 'TEMPÉRÉ (JAUNE)'}</span>
                    <span>
                      {isEn ? '☀ WARM / SOUTH / ARID (RED)' : '☀ CHAUD / SUD / MÉDITERRANÉE (ROUGE)'}
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full rounded-full border border-slate-700"
                    style={{
                      background:
                        'linear-gradient(90deg, #0EA5E9 0%, #1D4ED8 22%, #38BDF8 42%, #FACC15 58%, #F97316 78%, #DC2626 92%, #991B1B 100%)'
                    }}
                  />
                </div>
              )}

              {layerMode === 'moisture' && (
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular text-slate-300">
                    <span>
                      {isEn ? '☀ DRY SURFACE / DROUGHT (RED-ORANGE)' : '☀ SURFACE SÈCHE / SÉCHERESSE (ROUGE-OCRE)'}
                    </span>
                    <span>{isEn ? 'BALANCED (GREEN)' : 'ÉQUILIBRE (VERT)'}</span>
                    <span>
                      {isEn ? '💧 HUMID / SATURATED SURFACE (BLUE)' : '💧 SURFACE HUMIDE / SATURÉE (BLEU)'}
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full rounded-full border border-slate-700"
                    style={{
                      background:
                        'linear-gradient(90deg, #B91C1C 0%, #EA580C 28%, #F59E0B 48%, #10B981 70%, #0EA5E9 88%, #1D4ED8 100%)'
                    }}
                  />
                </div>
              )}

              {(layerMode === 'precipitation' || layerMode === 'combined') && (
                <div className="flex-1 flex flex-wrap items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-2.5 rounded-xs bg-[#DC2626]" />
                    <span>{isEn ? 'Hot / Dry Surface' : 'Surface Chaude / Sèche'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-2.5 rounded-xs bg-[#10B981]" />
                    <span>{isEn ? 'Humid Surface' : 'Surface Humide'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-2.5 rounded-xs bg-[#2563EB]" />
                    <span>{isEn ? 'Active Rain Surface' : 'Surface sous la Pluie'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-2.5 rounded-xs bg-[#BAE6FD]" />
                    <span>{isEn ? 'Snow / Freezing Surface' : 'Surface Enneigée / Gel'}</span>
                  </span>
                </div>
              )}

              <div className="text-[11px] font-mono-tabular text-emerald-400 shrink-0">
                {liveSyncSuccess
                  ? isEn
                    ? '● LIVE OPEN-METEO SURFACE'
                    : '● SURFACE TEMPS RÉEL OPEN-METEO'
                  : isEn
                  ? '● CONTINUOUS SURFACE'
                  : '● SURFACE CONTINUE'}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Live Surface Inspector & Regional Comparison Table */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Inspected Surface Coordinate Card */}
            <div className="border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 rounded-xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-mono-tabular text-slate-500">
                    {isEn ? 'INSPECTED SURFACE ZONE' : 'ZONE DE SURFACE INSPECTÉE'} ·{' '}
                    {currentSurface.lat >= 0
                      ? `${currentSurface.lat.toFixed(1)}°N`
                      : `${Math.abs(currentSurface.lat).toFixed(1)}°S`}
                    ,{' '}
                    {currentSurface.lon >= 0
                      ? `${currentSurface.lon.toFixed(1)}°E`
                      : `${Math.abs(currentSurface.lon).toFixed(1)}°W`}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display text-slate-900 mt-1">
                    {isEn
                      ? currentSurface.nearestNode.nameEn
                      : currentSurface.nearestNode.nameFr}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isEn
                      ? currentSurface.nearestNode.regionEn
                      : currentSurface.nearestNode.regionFr}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 text-xs font-mono-tabular font-semibold border rounded-md whitespace-nowrap ${
                    currentSurface.tempC >= 20
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : currentSurface.tempC <= 11
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {currentSurface.tempC >= 20
                    ? isEn
                      ? 'Warm Surface (Red)'
                      : 'Surface Chaude (Rouge)'
                    : currentSurface.tempC <= 11
                    ? isEn
                      ? 'Cold Surface (Blue)'
                      : 'Surface Froide (Bleu)'
                    : isEn
                    ? 'Temperate Surface'
                    : 'Surface Tempérée'}
                </span>
              </div>

              {/* 4 Physical Surface Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white border border-slate-200 p-3.5 rounded-lg">
                  <div className="text-[11px] font-mono-tabular uppercase text-slate-400 flex items-center justify-between">
                    <span>{isEn ? 'Surface Temperature' : 'Température de Surface'}</span>
                    <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div
                    className={`text-2xl font-mono-tabular font-bold mt-1 ${
                      currentSurface.tempC >= 20
                        ? 'text-red-600'
                        : currentSurface.tempC <= 11
                        ? 'text-blue-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {currentSurface.tempC > 0 ? `+${currentSurface.tempC}` : currentSurface.tempC} °C
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {currentSurface.tempC >= 20
                      ? isEn
                        ? 'Colored in red-orange on the map'
                        : 'Coloriée en rouge-orangé sur la carte'
                      : isEn
                      ? 'Colored in blue-cyan on the map'
                      : 'Coloriée en bleu sur la carte'}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-lg">
                  <div className="text-[11px] font-mono-tabular uppercase text-slate-400 flex items-center justify-between">
                    <span>{isEn ? 'Surface Humidity' : 'Humidité de Surface'}</span>
                    <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                    {currentSurface.humidityPercent} %
                  </div>
                  <div className="text-[11px] font-mono-tabular text-slate-600 mt-0.5">
                    {isEn
                      ? `Soil: ${currentSurface.soilMoistureM3} m³/m³ (${
                          currentSurface.soilMoistureM3 <= 0.16 ? 'Dry' : 'Humid'
                        })`
                      : `Sol : ${currentSurface.soilMoistureM3} m³/m³ (${
                          currentSurface.soilMoistureM3 <= 0.16 ? 'Zone Sèche' : 'Zone Humide'
                        })`}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-lg">
                  <div className="text-[11px] font-mono-tabular uppercase text-slate-400 flex items-center justify-between">
                    <span>{isEn ? 'Rain / Snow Surface' : 'Pluie / Neige en Surface'}</span>
                    {currentSurface.snowCmH > 0.05 || currentSurface.tempC <= -1 ? (
                      <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                    ) : (
                      <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <div className="text-xl font-mono-tabular font-bold text-slate-900 mt-1">
                    {currentSurface.snowCmH > 0.05
                      ? `${currentSurface.snowCmH} cm/h (${isEn ? 'Snow' : 'Neige'})`
                      : currentSurface.precipitationMmH > 0.05
                      ? `${currentSurface.precipitationMmH} mm/h (${isEn ? 'Rain' : 'Pluie'})`
                      : isEn
                      ? '0.0 mm/h (Dry sky)'
                      : '0,0 mm/h (Temps sec)'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isEn
                      ? 'Interpolated from live Open-Meteo grid'
                      : 'Interpolé en direct sur la surface'}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-lg">
                  <div className="text-[11px] font-mono-tabular uppercase text-slate-400 flex items-center justify-between">
                    <span>{isEn ? 'Surface Wind' : 'Vent en Surface'}</span>
                    <Wind className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-2xl font-mono-tabular font-bold text-slate-900 mt-1">
                    {currentSurface.windKmh} km/h
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isEn ? 'Click anywhere on globe to sample' : 'Cliquez sur le globe pour sonder'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Regional Surface Selector (France North/South/West/Alps + World Surfaces) */}
            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-mono-tabular uppercase font-semibold text-slate-700">
                  {isEn
                    ? 'Regional Surfaces in France & World (Click to inspect)'
                    : 'Surfaces Régionales France & Monde (Cliquez pour cadrer)'}
                </span>
              </div>

              <div className="max-h-[290px] overflow-y-auto divide-y divide-slate-100">
                {nodes.map((node) => {
                  const isCold = node.tempC <= 12;
                  const isHot = node.tempC >= 20;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setAutoRotate(false);
                        setRotation([-node.lon, -node.lat, 0]);
                        if (node.isFrance && zoom < 3.5) {
                          setZoom(4.1);
                          setActivePresetId('france');
                        } else if (!node.isFrance && zoom > 2.8) {
                          setZoom(1.8);
                          setActivePresetId('custom');
                        }
                        setInspectedCoord(evaluateSurfaceAtLatLon(node.lat, node.lon, nodes));
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-xs shrink-0 ${
                              isHot
                                ? 'bg-red-600'
                                : isCold
                                ? 'bg-blue-600'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span className="text-xs font-medium text-slate-900 truncate">
                            {isEn ? node.nameEn : node.nameFr}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {node.soilMoistureM3 <= 0.16
                            ? isEn
                              ? `Dry surface (${node.humidityPercent}% HR)`
                              : `Surface sèche (${node.humidityPercent}% HR)`
                            : node.snowCmH > 0 || node.tempC < 0
                            ? isEn
                              ? `Snow / Freezing surface`
                              : `Surface froide / enneigée`
                            : node.precipitationMmH > 0.1
                            ? isEn
                              ? `Rainy surface (${node.precipitationMmH} mm/h)`
                              : `Surface pluvieuse (${node.precipitationMmH} mm/h)`
                            : isEn
                            ? `Humid surface (${node.humidityPercent}% HR)`
                            : `Surface humide (${node.humidityPercent}% HR)`}
                        </div>
                      </div>

                      <div className="text-right font-mono-tabular shrink-0">
                        <div
                          className={`text-xs font-bold ${
                            isHot
                              ? 'text-red-600'
                              : isCold
                              ? 'text-blue-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {node.tempC > 0 ? `+${node.tempC}` : node.tempC}°C
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {node.humidityPercent}% HR
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
