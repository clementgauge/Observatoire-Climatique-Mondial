/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAtmosphericTelemetry,
  LiveAtmosphericMetrics,
  LiveStationTelemetry
} from './services/climateApiService';
import { generateClimatePdfReport } from './services/pdfReportGenerator';
import { HistoricalCorrelationChart } from './components/HistoricalCorrelationChart';
import { SectorCausesExplorer } from './components/SectorCausesExplorer';
import { CountryEmissionsMatrix } from './components/CountryEmissionsMatrix';
import { LiveStationTelemetryConsole } from './components/LiveStationTelemetryConsole';
import { DeforestationBiodiversityActionsSection } from './components/DeforestationBiodiversityActionsSection';
import { PlanetaryBoundariesRadarSection } from './components/PlanetaryBoundariesRadarSection';
import { TrajectorySimulator2100 } from './components/TrajectorySimulator2100';
import { SeoClimateKnowledgeBaseSection } from './components/SeoClimateKnowledgeBaseSection';
import { ScientificMethodologySection } from './components/ScientificMethodologySection';
import { RefreshCw, ArrowDownRight, FileText, Menu, X, ExternalLink } from 'lucide-react';
import { Language } from './data/climateDatasets';

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr';
  const path = window.location.pathname.toLowerCase();
  if (path === '/en' || path.endsWith('/en') || path.endsWith('/en/')) {
    return 'en';
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'en') {
    return 'en';
  }
  return 'fr';
}

export default function App() {
  const [lang, setLang] = useState<Language>(detectInitialLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeStationTelemetry, setActiveStationTelemetry] =
    useState<LiveStationTelemetry | null>(null);
  const [atmospheric, setAtmospheric] = useState<LiveAtmosphericMetrics>({
    co2Ppm: 426.39,
    co2DateLabel: '2026-10-06',
    co2YearAgoPpm: 423.65,
    ch4Ppb: 1941.23,
    ch4DateLabel: '2026-05',
    ch4YearAgoPpb: 1931.4,
    tempAnomalyC: 1.48,
    tempDateLabel: '2026',
    fetchedAtIso: new Date().toISOString(),
    isLiveApi: false,
    sourceLabelFr: 'Synchronisation API en cours...',
    sourceLabelEn: 'Synchronizing public API...',
    channels: []
  });
  const [syncing, setSyncing] = useState<boolean>(true);
  const [tonnesEmittedSession, setTonnesEmittedSession] = useState<number>(0);

  const isEn = lang === 'en';

  // Dynamically resolve the real active domain (e.g. Cloudflare workers.dev or custom domain)
  useEffect(() => {
    const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '');
    const origin = configuredSiteUrl && configuredSiteUrl.length > 4 ? configuredSiteUrl : window.location.origin;
    const targetUrl = isEn ? `${origin}/en` : `${origin}/`;

    document.documentElement.lang = isEn ? 'en' : 'fr';

    const title = isEn
      ? 'Global Climate Observatory — Real-Time Data, Deforestation, WWF & Policies (NOAA, IPCC, Europa.eu)'
      : 'Observatoire Climatique Mondial — Réchauffement, Déforestation, Actions WWF & Politiques (NOAA, GIEC)';

    const description = isEn
      ? 'Scientific observatory on climate disruption: real-time NOAA & Open-Meteo telemetry, global warming causes (59.1 GtCO₂e/yr), tropical deforestation, WWF wildlife protection, and France/EU/Global policies.'
      : "Observatoire scientifique du dérèglement climatique : données temps réel (NOAA, NASA GISS, Copernicus, Europa.eu), causes par secteur, déforestation mondiale, actions du WWF pour les animaux et mesures en France et dans le monde.";

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const canonical = document.getElementById('canonical-link');
    if (canonical) canonical.setAttribute('href', targetUrl);

    const hrefFr = document.getElementById('hreflang-fr');
    if (hrefFr) hrefFr.setAttribute('href', `${origin}/`);

    const hrefEn = document.getElementById('hreflang-en');
    if (hrefEn) hrefEn.setAttribute('href', `${origin}/en`);

    const hrefDefault = document.getElementById('hreflang-default');
    if (hrefDefault) hrefDefault.setAttribute('href', `${origin}/`);

    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', targetUrl);

    const ogLocale = document.getElementById('og-locale');
    if (ogLocale) ogLocale.setAttribute('content', isEn ? 'en_US' : 'fr_FR');

    const twTitle = document.getElementById('tw-title');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.getElementById('tw-desc');
    if (twDesc) twDesc.setAttribute('content', description);
  }, [isEn]);

  // Listen to browser back/forward navigation between / and /en
  useEffect(() => {
    const onPopState = () => {
      setLang(detectInitialLanguage());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const switchLanguage = (targetLang: Language, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const hash = window.location.hash || '';
    const newPath = targetLang === 'en' ? `/en${hash}` : `/${hash}`;
    try {
      window.history.pushState({ lang: targetLang }, '', newPath);
    } catch {
      // Fallback if iframe sandbox restricts pushState
    }
    setLang(targetLang);
    setMobileMenuOpen(false);
  };

  const loadAtmospheric = useCallback(async () => {
    setSyncing(true);
    const data = await fetchAtmosphericTelemetry();
    setAtmospheric(data);
    setSyncing(false);
  }, []);

  useEffect(() => {
    loadAtmospheric();
  }, [loadAtmospheric]);

  // Real-time physical counter: 59.1 GtCO2e/yr = ~1,874 tonnes per second globally
  useEffect(() => {
    const startMs = Date.now();
    const timer = setInterval(() => {
      const elapsedSec = (Date.now() - startMs) / 1000;
      setTonnesEmittedSession(Math.floor(elapsedSec * 1874.05));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const handleExportPdf = () => {
    generateClimatePdfReport({
      lang,
      atmospheric,
      activeStationTelemetry,
      tonnesEmittedSession
    });
  };

  const co2AnnualDelta = (atmospheric.co2Ppm - atmospheric.co2YearAgoPpm).toFixed(2);
  const ch4AnnualDelta = (atmospheric.ch4Ppb - atmospheric.ch4YearAgoPpb).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Strict 3-Zone Top Navigation Bar Contract — Responsive for Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-[#F8FAFC]/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-3">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <a
            href={isEn ? '/en' : '/'}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg sm:text-xl lg:text-2xl font-display tracking-tight text-slate-900 whitespace-nowrap truncate"
          >
            {isEn ? 'Global Climate Observatory' : 'Observatoire Climatique Mondial'}
          </a>

          {/* Zone 2: 6 Clean Text Navigation Links (Desktop) */}
          <nav
            aria-label={isEn ? 'Primary Navigation' : 'Navigation Principale'}
            className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600"
          >
            <a
              href="#observatoire"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Telemetry' : 'Télémesure'}
            </a>
            <a
              href="#causes-mondiales"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Causes by Sector' : 'Causes par Secteur'}
            </a>
            <a
              href="#atlas-pays"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Country Atlas' : 'Atlas des Pays'}
            </a>
            <a
              href="#deforestation-wwf-actions"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Deforestation, WWF & Laws' : 'Déforestation, WWF & Lois'}
            </a>
            <a
              href="#analyse-europa-wwf"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Europa.eu & Biosphere' : 'Europa.eu & Biosphère'}
            </a>
            <a
              href="#sources-scientifiques"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {isEn ? 'Sources & APIs' : 'Sources & APIs'}
            </a>
          </nav>

          {/* Zone 3: Language Switcher Links (/ and /en) + Primary Export PDF Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label={isEn ? 'Language selector' : 'Sélecteur de langue'}
              className="flex items-center p-0.5 bg-slate-200/80 rounded-lg border border-slate-300/60"
            >
              <a
                href="/"
                hrefLang="fr"
                onClick={(e) => switchLanguage('fr', e)}
                className={`px-2.5 py-1 text-xs font-mono-tabular font-semibold rounded-md transition-colors whitespace-nowrap ${
                  !isEn
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Version Française (/)"
              >
                FR
              </a>
              <a
                href="/en"
                hrefLang="en"
                onClick={(e) => switchLanguage('en', e)}
                className={`px-2.5 py-1 text-xs font-mono-tabular font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isEn
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English Version (/en)"
              >
                EN
              </a>
            </div>

            <button
              type="button"
              onClick={handleExportPdf}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isEn ? 'Export PDF' : 'Exporter PDF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={isEn ? 'Toggle navigation menu' : 'Ouvrir le menu de navigation'}
              className="xl:hidden p-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile & Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label={isEn ? 'Mobile Navigation' : 'Navigation Mobile'}
            className="xl:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2 text-sm font-medium text-slate-700"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href="#observatoire"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '01. Telemetry' : '01. Télémesure'}
              </a>
              <a
                href="#causes-mondiales"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '02. Causes by Sector' : '02. Causes par Secteur'}
              </a>
              <a
                href="#atlas-pays"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '03. Country Atlas' : '03. Atlas des Pays'}
              </a>
              <a
                href="#stations-temps-reel"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '04. Live Sensors' : '04. Capteurs Direct'}
              </a>
              <a
                href="#deforestation-wwf-actions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '05. Deforestation & WWF' : '05. Déforestation & WWF'}
              </a>
              <a
                href="#sources-scientifiques"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              >
                {isEn ? '06. Sources & APIs' : '06. Sources & APIs'}
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                handleExportPdf();
                setMobileMenuOpen(false);
              }}
              className="mt-1 px-3 py-2.5 bg-slate-900 text-white rounded-md flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isEn ? 'Export Full Report (PDF)' : 'Exporter le Rapport Complet (PDF)'}</span>
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section & Live Telemetry Command Deck */}
      <main className="flex-1">
        <section id="observatoire" className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Quiet Unboxed Editorial Metadata with Explicit Institutional Attribution */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono-tabular text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span>
                    {isEn ? '● LIVE TELEMETRY STREAM' : '● FLUX TÉLÉMÉTRIQUE ACTIF'}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {isEn ? atmospheric.sourceLabelEn : atmospheric.sourceLabelFr}
                </span>
                <span aria-hidden="true">·</span>
                <a
                  href="#sources-scientifiques"
                  className="text-slate-700 hover:text-slate-900 underline underline-offset-2"
                >
                  {isEn
                    ? 'Verify Sources (NOAA, NASA GISS, IPCC, Europa.eu, WWF)'
                    : 'Vérifier les Sources (NOAA, NASA GISS, GIEC, Europa.eu, WWF)'}
                </a>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={loadAtmospheric}
                  disabled={syncing}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{isEn ? 'Sync API' : 'Synchroniser API'}</span>
                </button>
              </div>
              <div className="font-mono-tabular text-slate-700">
                {isEn
                  ? 'GHG emitted since opening this page (IPCC 59.1 Gt/yr): '
                  : 'GES émis depuis l’ouverture de la page (GIEC 59,1 Gt/an) : '}
                <strong className="text-rose-600">
                  +{tonnesEmittedSession.toLocaleString(isEn ? 'en-US' : 'fr-FR')} tCO₂eq
                </strong>{' '}
                (1,874 t/s)
              </div>
            </div>

            {/* Editorial Headline & Lead Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8 sm:py-10 items-end">
              <div className="lg:col-span-8">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display text-slate-900 leading-[1.08] tracking-tight">
                  {isEn
                    ? 'Understanding climate disruption: atmospheric physics, global deforestation, wildlife protection, and public policies.'
                    : 'Comprendre le dérèglement climatique : mesure physique, déforestation mondiale, protection du vivant et politiques publiques.'}
                </h1>
              </div>
              <div className="lg:col-span-4">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {isEn
                    ? `Beyond industrial CO₂ (${atmospheric.co2Ppm.toFixed(2)} ppm at Mauna Loa), global warming is driven by methane, nitrous oxide, and the loss of 10 million hectares of forest every year. Explore real-time public telemetry, WWF wildlife conservation programs, and concrete measures enacted by France, Europe, and the world.`
                    : `Au-delà du CO₂ industriel (${atmospheric.co2Ppm.toFixed(2)} ppm à Mauna Loa), le dérèglement climatique implique le méthane, la perte de 10 millions d’hectares de forêts par an et le déclin de 73 % de la faune sauvage. Explorez en temps réel les capteurs publics, les actions du WWF pour les animaux et les lois mises en place en France, en Europe et dans le monde.`}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-900">
                  <a
                    href="#deforestation-wwf-actions"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:underline underline-offset-4"
                  >
                    <span>
                      {isEn
                        ? 'Explore Deforestation, WWF Wildlife & France/EU Laws'
                        : 'Voir Déforestation, Actions WWF & Mesures France/Monde'}
                    </span>
                    <ArrowDownRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* 4-Column Precision Telemetry Readout Strip with Explicit Source Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200 mb-8 sm:mb-10">
              {/* Metric 1: CO2 */}
              <div className="p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 font-mono-tabular flex items-center justify-between">
                    <span>{isEn ? 'CO₂ (Mauna Loa)' : 'CO₂ (Mauna Loa)'}</span>
                    <span className="text-[10px] text-emerald-700">{atmospheric.co2DateLabel}</span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                      {atmospheric.co2Ppm.toFixed(2)}
                    </span>
                    <span className="text-xs uppercase font-mono-tabular text-slate-400 ml-1.5">
                      ppm
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono-tabular text-rose-600">
                    {isEn
                      ? `DELTA: +${co2AnnualDelta} ppm / 12 mo (+52% vs 1850)`
                      : `DELTA : +${co2AnnualDelta} ppm / 12 mois (+52 % vs 1850)`}
                  </div>
                </div>
                <a
                  href="https://gml.noaa.gov/ccgg/trends/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono-tabular text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  <span>Source : NOAA GML Direct Feed</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Metric 2: Temperature Anomaly */}
              <div className="p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 font-mono-tabular flex items-center justify-between">
                    <span>{isEn ? 'Thermal Anomaly' : 'Anomalie Thermique'}</span>
                    <span className="text-[10px] text-emerald-700">{atmospheric.tempDateLabel}</span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-rose-600">
                      +{atmospheric.tempAnomalyC.toFixed(2)}
                    </span>
                    <span className="text-xs uppercase font-mono-tabular text-slate-400 ml-1.5">
                      °C vs 1850–1900
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono-tabular text-amber-700">
                    {isEn
                      ? 'RATE: +0.26 °C / current decade'
                      : 'CADENCE : +0,26 °C / décennie actuelle'}
                  </div>
                </div>
                <a
                  href="https://data.giss.nasa.gov/gistemp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono-tabular text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  <span>Source : NASA GISS / Copernicus ERA5</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Metric 3: Atmospheric Methane */}
              <div className="p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 font-mono-tabular flex items-center justify-between">
                    <span>{isEn ? 'Methane (CH₄)' : 'Méthane (CH₄)'}</span>
                    <span className="text-[10px] text-emerald-700">{atmospheric.ch4DateLabel}</span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                      {atmospheric.ch4Ppb.toFixed(1)}
                    </span>
                    <span className="text-xs uppercase font-mono-tabular text-slate-400 ml-1.5">
                      ppb
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono-tabular text-emerald-700">
                    {isEn
                      ? `DELTA: +${ch4AnnualDelta} ppb / yr (84× GWP-20)`
                      : `DELTA : +${ch4AnnualDelta} ppb / an (PRG 84× sur 20 ans)`}
                  </div>
                </div>
                <a
                  href="https://gml.noaa.gov/ccgg/trends_ch4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono-tabular text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  <span>Source : NOAA Global CH₄ Network</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Metric 4: Global Deforestation & Wildlife LPI */}
              <div className="p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 font-mono-tabular flex items-center justify-between">
                    <span>{isEn ? 'Deforestation & Fauna' : 'Déforestation & Faune'}</span>
                    <span className="text-[10px] text-rose-600">FAO / WWF</span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl lg:text-4xl font-mono-tabular font-bold text-slate-900">
                      -10,0
                    </span>
                    <span className="text-xs uppercase font-mono-tabular text-slate-400 ml-1.5">
                      {isEn ? 'M ha forests / yr' : 'M ha forêts / an'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono-tabular text-rose-600">
                    {isEn
                      ? 'WWF LIVING PLANET INDEX: -73% (1970–2020)'
                      : 'INDICE PLANÈTE VIVANTE WWF : -73 % (1970–2020)'}
                  </div>
                </div>
                <a
                  href="https://www.wwf.fr/rapport-planete-vivante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono-tabular text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  <span>Source : WWF France & FAO FRA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Interactive Multi-Decadal Correlation Chart */}
            <HistoricalCorrelationChart lang={lang} />
          </div>
        </section>

        {/* Section 2: Global Causes by Sector & Sub-sectors */}
        <SectorCausesExplorer lang={lang} />

        {/* Section 3: Country Emissions Matrix + Live World Bank API */}
        <CountryEmissionsMatrix lang={lang} />

        {/* Section 4: Real-Time Global Observatory Stations (Open-Meteo Weather & Air Quality APIs) */}
        <LiveStationTelemetryConsole
          lang={lang}
          onStationDataChange={setActiveStationTelemetry}
        />

        {/* Section 5: Beyond CO2 — Global Deforestation, WWF Wildlife Conservation & France/EU/World Policies */}
        <DeforestationBiodiversityActionsSection lang={lang} />

        {/* Section 6: European Commission (EEA / EDGAR europa.eu) & WWF France Living Planet Analytics */}
        <PlanetaryBoundariesRadarSection lang={lang} />

        {/* Section 7: 2100 Mitigation Trajectory Simulator */}
        <TrajectorySimulator2100 lang={lang} />

        {/* Section 8: SEO Structured Knowledge Base & Scientific FAQ */}
        <SeoClimateKnowledgeBaseSection lang={lang} />

        {/* Section 9: Verifiable Scientific Sources, Methodology & Live API Audit Table */}
        <ScientificMethodologySection
          lang={lang}
          channels={atmospheric.channels}
        />
      </main>

      {/* Quiet Institutional Footer with Direct Crawlable Bilingual Links & PDF Export */}
      <footer className="border-t border-slate-200 bg-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs text-slate-500">
          <div className="max-w-2xl">
            <div className="font-display text-lg text-slate-900">
              {isEn
                ? 'Global Climate Observatory — Scientific Data, Biodiversity & Telemetry'
                : 'Observatoire Climatique Mondial — Climat, Déforestation, Biodiversité & Télémesure'}
            </div>
            <p className="mt-1 leading-relaxed">
              {isEn
                ? 'Aggregated empirical datasets: NOAA Global Monitoring Laboratory (gml.noaa.gov), NASA GISS (GISTEMP v4), Copernicus Climate Change Service (C3S/ERA5), European Commission (JRC EDGAR & EEA europa.eu), WWF France (Living Planet Report), FAO, IPCC AR6, World Bank API, and Open-Meteo.'
                : 'Données scientifiques agrégées : NOAA Global Monitoring Laboratory (gml.noaa.gov), NASA GISS (GISTEMP v4), Copernicus Climate Change Service (C3S/ERA5), Commission Européenne (JRC EDGAR & EEA europa.eu), WWF France (Rapport Planète Vivante), FAO, GIEC AR6, API Banque Mondiale et Open-Meteo.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 shrink-0">
            <a
              href="/"
              hrefLang="fr"
              onClick={(e) => switchLanguage('fr', e)}
              className={`hover:text-slate-900 transition-colors ${
                !isEn ? 'font-semibold text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              Français (/)
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/en"
              hrefLang="en"
              onClick={(e) => switchLanguage('en', e)}
              className={`hover:text-slate-900 transition-colors ${
                isEn ? 'font-semibold text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              English (/en)
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors font-mono-tabular"
            >
              sitemap.xml
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors font-mono-tabular"
            >
              robots.txt
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleExportPdf}
              className="hover:text-slate-900 transition-colors underline underline-offset-4 cursor-pointer font-medium text-slate-800"
            >
              {isEn ? 'Download Scientific Report (PDF)' : 'Télécharger le rapport scientifique (PDF)'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
