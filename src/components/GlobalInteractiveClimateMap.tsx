import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  COUNTRY_EMISSION_PROFILES,
  OBSERVATORY_STATIONS,
  CountryEmissionProfile,
  ObservatoryStation,
  Language
} from '../data/climateDatasets';
import { fetchStationLiveTelemetry } from '../services/climateApiService';
import { Globe, Layers, ExternalLink, Compass, Flame, ShieldAlert } from 'lucide-react';

interface Props {
  lang: Language;
}

type MapLayerMode = 'all' | 'emitters' | 'stations' | 'biodiversity';

interface BiodiversityHotspot {
  id: string;
  nameFr: string;
  nameEn: string;
  regionFr: string;
  regionEn: string;
  lat: number;
  lon: number;
  declinePercent: number;
  threatFr: string;
  threatEn: string;
  sourceLabel: string;
}

// WWF France / Living Planet Report (Indice Planète Vivante) & Copernicus / JRC Forest Hotspots
const WWF_BIODIVERSITY_HOTSPOTS: BiodiversityHotspot[] = [
  {
    id: 'amazon-cerrado',
    nameFr: 'Bassin Amazonien & Cerrado',
    nameEn: 'Amazon Basin & Cerrado',
    regionFr: 'Amérique Latine & Caraïbes (IPV -95 %)',
    regionEn: 'Latin America & Caribbean (LPI -95%)',
    lat: -6.5,
    lon: -62.0,
    declinePercent: 95,
    threatFr: 'Point de bascule hydrologique, déforestation bovine/soja et mégafeux liés aux sécheresses El Niño amplifiées.',
    threatEn: 'Hydrological tipping point, cattle/soy deforestation, and megafires driven by amplified drought cycles.',
    sourceLabel: 'WWF France (Rapport Planète Vivante) & JRC Europa.eu'
  },
  {
    id: 'congo-basin',
    nameFr: 'Bassin Forestier du Congo & Tourbières',
    nameEn: 'Congo Basin Rainforest & Peatlands',
    regionFr: 'Afrique Centrale (IPV -76 %)',
    regionEn: 'Central Africa (LPI -76%)',
    lat: -0.8,
    lon: 21.5,
    declinePercent: 76,
    threatFr: 'Deuxième poumon tropical mondial stockant 30 Gt de carbone dans ses tourbières, menacé par le réchauffement et la pression agricole.',
    threatEn: 'Second largest tropical lung storing 30 Gt of carbon in Cuvette Centrale peatlands, threatened by warming and land conversion.',
    sourceLabel: 'WWF France & Commission Européenne JRC (europa.eu)'
  },
  {
    id: 'coral-triangle',
    nameFr: 'Triangle de Corail & Grande Barrière',
    nameEn: 'Coral Triangle & Great Barrier Reef',
    regionFr: 'Asie-Pacifique (IPV -60 %)',
    regionEn: 'Asia-Pacific (LPI -60%)',
    lat: -14.2,
    lon: 145.7,
    declinePercent: 60,
    threatFr: 'Blanchissement corallien massif (+1,5 °C compromet 70 à 90 % des récifs tropicaux selon le GIEC et le WWF).',
    threatEn: 'Mass coral bleaching (+1.5 °C threatens 70–90% of warm-water coral reefs according to IPCC & WWF).',
    sourceLabel: 'WWF France & Copernicus Marine Service (europa.eu)'
  },
  {
    id: 'mediterranean-basin',
    nameFr: 'Bassin Méditerranéen & Europe du Sud',
    nameEn: 'Mediterranean Basin & Southern Europe',
    regionFr: 'Hotspot Climatique Européen (EEA / Europa.eu)',
    regionEn: 'European Climate Hotspot (EEA / Europa.eu)',
    lat: 41.2,
    lon: 14.5,
    declinePercent: 52,
    threatFr: 'L’Europe est le continent qui se réchauffe le plus vite (2× la moyenne mondiale selon Copernicus et l’Agence Européenne pour l’Environnement).',
    threatEn: 'Europe is the fastest-warming continent (warming at 2× the global average according to Copernicus & EEA europa.eu).',
    sourceLabel: 'Agence Européenne pour l’Environnement (eea.europa.eu) & WWF France'
  },
  {
    id: 'arctic-permafrost',
    nameFr: 'Cryosphère Arctique & Pergélisol Sibérien',
    nameEn: 'Arctic Cryosphere & Siberian Permafrost',
    regionFr: 'Cercle Polaire Arctique (Réchauffement 4×)',
    regionEn: 'Arctic Circle (4× Warming Amplification)',
    lat: 71.5,
    lon: 128.0,
    declinePercent: 68,
    threatFr: 'Fonte de la banquise estivale et dégel du pergélisol libérant du CO₂ et du méthane (CH₄) fossiles anciens.',
    threatEn: 'Summer sea-ice loss and thawing permafrost releasing ancient carbon dioxide and methane (CH₄) feedback loops.',
    sourceLabel: 'Copernicus C3S (europa.eu) & NOAA Arctic Report Card'
  }
];

export const GlobalInteractiveClimateMap: React.FC<Props> = ({ lang }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [layerMode, setLayerMode] = useState<MapLayerMode>('all');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'emitter' | 'station' | 'hotspot';
    title: string;
    subtitle: string;
    primaryMetric: string;
    secondaryMetric: string;
    description: string;
    source: string;
    lat: number;
    lon: number;
  }>({
    type: 'emitter',
    title: 'Chine (CHN)',
    subtitle: 'Asie-Pacifique · EDGAR JRC (europa.eu)',
    primaryMetric: '11 900 MtCO₂/an',
    secondaryMetric: '8,4 tCO₂/hab · Cumul 1850 : 15,2 %',
    description: 'Charbon thermique, sidérurgie & cimenterie (atelier manufacturier mondial).',
    source: 'EDGAR — Commission Européenne (edgar.jrc.ec.europa.eu)',
    lat: 39.9042,
    lon: 116.4074
  });

  const isEn = lang === 'en';

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [24, 14],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      scrollWheelZoom: false,
      worldCopyJump: true
    });

    // Clean, high-contrast scientific cartographic basemap (CartoDB Positron / OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · EDGAR (europa.eu) · WWF France',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = group;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Populate markers whenever layerMode or language changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Emitters Layer (EDGAR JRC Europa.eu & Global Carbon Project)
    if (layerMode === 'all' || layerMode === 'emitters') {
      COUNTRY_EMISSION_PROFILES.forEach((country: CountryEmissionProfile) => {
        const radius = Math.max(9, Math.min(28, Math.sqrt(country.annualMtCO2) * 0.25));
        const circle = L.circleMarker([country.lat, country.lon], {
          radius,
          fillColor: '#D97706', // Amber 600
          color: '#FFFFFF',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.82
        });

        const cName = isEn ? country.nameEn : country.name;
        const cRegion = isEn ? country.regionEn : country.region;
        const cCause = isEn ? country.mainCauseEn : country.mainCause;

        circle.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px;">
            <strong>${cName} (${country.iso})</strong><br/>
            ${country.annualMtCO2.toLocaleString()} MtCO₂/yr · ${country.perCapitaTonnes} t/cap
          </div>`,
          { direction: 'top' }
        );

        circle.on('click', () => {
          setSelectedItem({
            type: 'emitter',
            title: `${cName} (${country.iso})`,
            subtitle: `${cRegion} · EDGAR JRC (europa.eu)`,
            primaryMetric: `${country.annualMtCO2.toLocaleString(isEn ? 'en-US' : 'fr-FR')} MtCO₂/${isEn ? 'yr' : 'an'}`,
            secondaryMetric: `${country.perCapitaTonnes} tCO₂/hab · ${isEn ? '1850 Cumul:' : 'Cumul 1850 :'} ${country.cumulativeSharePercent}%`,
            description: cCause,
            source: 'EDGAR — European Commission JRC (edgar.jrc.ec.europa.eu)',
            lat: country.lat,
            lon: country.lon
          });
        });

        circle.addTo(group);
      });
    }

    // 2. Live Atmospheric Stations Layer (NOAA & Open-Meteo)
    if (layerMode === 'all' || layerMode === 'stations') {
      OBSERVATORY_STATIONS.forEach((station: ObservatoryStation) => {
        const marker = L.circleMarker([station.lat, station.lon], {
          radius: 9,
          fillColor: '#059669', // Emerald 600
          color: '#0F172A',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        const sName = isEn ? station.nameEn : station.name;
        const sCountry = isEn ? station.countryEn : station.country;
        const sBiome = isEn ? station.biomeEn : station.biome;

        marker.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px;">
            <strong>● ${sName}</strong><br/>
            ${sCountry} (${station.elevationM}m)
          </div>`,
          { direction: 'top' }
        );

        marker.on('click', async () => {
          setSelectedItem({
            type: 'station',
            title: sName,
            subtitle: `${sCountry} · Altitude ${station.elevationM}m`,
            primaryMetric: isEn ? 'Querying live sensor...' : 'Interrogation capteur en direct...',
            secondaryMetric: `${station.lat.toFixed(2)}°, ${station.lon.toFixed(2)}°`,
            description: sBiome,
            source: 'Open-Meteo API & Copernicus CAMS (europa.eu)',
            lat: station.lat,
            lon: station.lon
          });

          const live = await fetchStationLiveTelemetry(station);
          setSelectedItem({
            type: 'station',
            title: sName,
            subtitle: `${sCountry} · Altitude ${station.elevationM}m`,
            primaryMetric: `${live.currentTempC.toFixed(1)} °C (${live.decadeDeltaC >= 0 ? '+' : ''}${live.decadeDeltaC.toFixed(1)} °C vs 1961–90)`,
            secondaryMetric: `PM2.5: ${live.pm25UgM3.toFixed(1)} µg/m³ · CO: ${live.carbonMonoxideUgM3.toFixed(0)} µg/m³ · Vent: ${live.windSpeedKmh.toFixed(1)} km/h`,
            description: sBiome,
            source: 'Open-Meteo Live API & Copernicus CAMS (atmosphere.copernicus.eu)',
            lat: station.lat,
            lon: station.lon
          });
        });

        marker.addTo(group);
      });
    }

    // 3. WWF France & Copernicus Biodiversity / Tipping Point Hotspots
    if (layerMode === 'all' || layerMode === 'biodiversity') {
      WWF_BIODIVERSITY_HOTSPOTS.forEach((spot) => {
        const marker = L.circleMarker([spot.lat, spot.lon], {
          radius: 12,
          fillColor: '#E11D48', // Rose 600
          color: '#FFFFFF',
          weight: 2,
          dashArray: '3 3',
          opacity: 1,
          fillOpacity: 0.85
        });

        const hName = isEn ? spot.nameEn : spot.nameFr;
        const hRegion = isEn ? spot.regionEn : spot.regionFr;
        const hThreat = isEn ? spot.threatEn : spot.threatFr;

        marker.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px;">
            <strong>▲ ${hName}</strong><br/>
            ${hRegion}
          </div>`,
          { direction: 'top' }
        );

        marker.on('click', () => {
          setSelectedItem({
            type: 'hotspot',
            title: hName,
            subtitle: hRegion,
            primaryMetric: isEn
              ? `Living Planet Index: -${spot.declinePercent}%`
              : `Indice Planète Vivante : -${spot.declinePercent} %`,
            secondaryMetric: isEn
              ? 'Critical Biosphere & Climate Tipping Point'
              : 'Zone Critique Biosphère & Point de Bascule Climatique',
            description: hThreat,
            source: spot.sourceLabel,
            lat: spot.lat,
            lon: spot.lon
          });
        });

        marker.addTo(group);
      });
    }
  }, [layerMode, isEn]);

  return (
    <section
      id="carte-mondiale"
      className="py-12 sm:py-16 lg:py-24 border-t border-slate-200 bg-[#F8FAFC]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {isEn
                  ? 'Interactive Global Cartography — Emissions, Live Sensors & Biosphere'
                  : 'Cartographie Mondiale Interactive — Émissions, Capteurs en Direct & Biosphère'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn
                  ? 'Sources: EDGAR (europa.eu), WWF France, Copernicus & NOAA'
                  : 'Sources : EDGAR (europa.eu), WWF France, Copernicus & NOAA'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-slate-900 mt-2">
              {isEn
                ? 'Planetary Spatial Atlas: Industrial Emitters, Sentinel Stations & Ecological Tipping Points'
                : 'Atlas Spatial Planétaire : Foyers d’Émissions, Stations Sentinelles & Points de Bascule'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
              {isEn
                ? 'Explore the spatial distribution of global warming causes and impacts. Click any marker on the interactive map to inspect national emissions from the European Commission EDGAR database (europa.eu), real-time Open-Meteo sensors, or WWF Living Planet biodiversity hotspots.'
                : 'Explorez la géographie physique du réchauffement climatique. Cliquez sur n’importe quel marqueur de la carte interactive pour inspecter les émissions issues de la base européenne EDGAR (europa.eu), interroger en direct un capteur atmosphérique ou analyser les zones critiques identifiées par le WWF France.'}
            </p>
          </div>

          {/* Layer Filter Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setLayerMode('all')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                layerMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'All Layers (23 Markers)' : 'Tous les Calques (23 Points)'}
            </button>
            <button
              type="button"
              onClick={() => setLayerMode('emitters')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                layerMode === 'emitters'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              <span>{isEn ? 'EDGAR Emitters (12)' : 'Émetteurs EDGAR (12)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setLayerMode('stations')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                layerMode === 'stations'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>{isEn ? 'Live Sensors (6)' : 'Capteurs Temps Réel (6)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setLayerMode('biodiversity')}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                layerMode === 'biodiversity'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
              <span>{isEn ? 'WWF / EEA Hotspots (5)' : 'Points de Bascule WWF (5)'}</span>
            </button>
          </div>
        </div>

        {/* Map + Inspector Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
          {/* Interactive Leaflet Map Viewport */}
          <div className="lg:col-span-8 bg-white border border-slate-200 p-2 sm:p-3 flex flex-col">
            <div
              ref={mapContainerRef}
              className="w-full h-[380px] sm:h-[460px] lg:h-[500px] border border-slate-200"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 px-1 text-[11px] text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span>
                    {isEn
                      ? 'Amber Circle: Annual MtCO₂ (EDGAR europa.eu)'
                      : 'Cercle Orange : Volume MtCO₂/an (EDGAR europa.eu)'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>
                    {isEn
                      ? 'Green Dot: Live Atmospheric Sensor (Open-Meteo)'
                      : 'Point Vert : Station Temps Réel (Open-Meteo)'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>
                    {isEn
                      ? 'Red Zone: WWF Living Planet / EEA Hotspot'
                      : 'Point Rouge : Zone Critique WWF France / EEA'}
                  </span>
                </span>
              </div>
              <span className="font-mono-tabular">
                {isEn ? 'Click any marker to inspect' : 'Cliquez sur un marqueur pour inspecter'}
              </span>
            </div>
          </div>

          {/* Right Column: Live Spatial Inspector + European & WWF Synthesis Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {/* Active Marker Readout Card */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs text-slate-500">
                  <span className="font-mono-tabular uppercase font-semibold text-slate-800 flex items-center gap-1.5">
                    {selectedItem.type === 'emitter' && <Flame className="w-3.5 h-3.5 text-amber-600" />}
                    {selectedItem.type === 'station' && <Compass className="w-3.5 h-3.5 text-emerald-600" />}
                    {selectedItem.type === 'hotspot' && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                    <span>
                      {selectedItem.type === 'emitter'
                        ? isEn
                          ? 'National Emitter Profile'
                          : 'Profil Émetteur National'
                        : selectedItem.type === 'station'
                        ? isEn
                          ? 'Live Telemetry Sensor'
                          : 'Capteur Télémesure en Direct'
                        : isEn
                        ? 'Biosphere & Climate Hotspot'
                        : 'Zone Critique Biosphère & Climat'}
                    </span>
                  </span>
                  <span className="font-mono-tabular text-[11px] text-slate-400">
                    {selectedItem.lat.toFixed(1)}°, {selectedItem.lon.toFixed(1)}°
                  </span>
                </div>

                <h3 className="text-2xl font-display text-slate-900 mt-3">
                  {selectedItem.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">{selectedItem.subtitle}</div>

                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">
                    {isEn ? 'Primary Measured Indicator' : 'Indicateur Principal Mesuré'}
                  </div>
                  <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-slate-900 mt-0.5">
                    {selectedItem.primaryMetric}
                  </div>
                  <div className="text-xs font-mono-tabular text-amber-700 mt-1">
                    {selectedItem.secondaryMetric}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-mono-tabular text-slate-500">
                    {isEn ? 'Scientific Diagnostic & Drivers:' : 'Diagnostic Scientifique & Causes :'}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between gap-2">
                <span className="truncate">{selectedItem.source}</span>
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Institutional Focus Box: Europa.eu (EEA / EDGAR) & WWF France */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 border border-slate-900">
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-amber-400">
                {isEn
                  ? 'Institutional Synthesis · Europa.eu & WWF France'
                  : 'Synthèse Institutionnelle · Europa.eu & WWF France'}
              </div>
              <h4 className="text-xl font-display mt-1">
                {isEn
                  ? 'Climate & Biosphere Coupling: Key Findings'
                  : 'Couplage Climat & Biodiversité : Constats Vérifiés'}
              </h4>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <li>
                  <strong className="text-white">
                    {isEn ? 'European Commission (EDGAR / EEA):' : 'Commission Européenne (EDGAR / EEA) :'}
                  </strong>{' '}
                  {isEn
                    ? 'Europe is warming at twice the global rate (+2.3 °C vs pre-industrial), while EU-27 net GHG emissions have decreased by ~32.5% since 1990.'
                    : 'L’Europe se réchauffe 2 fois plus vite que la moyenne mondiale (+2,3 °C vs ère pré-industrielle), tandis que les émissions de l’UE-27 ont baissé de ~32,5 % depuis 1990.'}
                </li>
                <li>
                  <strong className="text-white">
                    {isEn ? 'WWF France (Living Planet Report):' : 'WWF France (Rapport Planète Vivante) :'}
                  </strong>{' '}
                  {isEn
                    ? 'Monitored global wildlife populations have declined by 73% between 1970 and 2020 (-95% in Latin America), driven by habitat loss and thermal stress.'
                    : 'Les populations de vertébrés sauvages suivies ont décliné de 73 % entre 1970 et 2020 (-95 % en Amérique Latine), sous l’effet conjoint de la déforestation et du réchauffement.'}
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] font-mono-tabular">
                <a
                  href="https://edgar.jrc.ec.europa.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>edgar.jrc.ec.europa.eu</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.eea.europa.eu/en/topics/in-depth/climate-change-impacts-risks-and-adaptation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>eea.europa.eu</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.wwf.fr/champs-daction/climat-energie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>wwf.fr</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
