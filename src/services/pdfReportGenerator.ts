import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  GLOBAL_CAUSES_BY_SECTOR,
  COUNTRY_EMISSION_PROFILES,
  Language
} from '../data/climateDatasets';
import {
  LiveAtmosphericMetrics,
  LiveStationTelemetry
} from './climateApiService';

export interface PdfExportOptions {
  lang: Language;
  atmospheric: LiveAtmosphericMetrics;
  activeStationTelemetry: LiveStationTelemetry | null;
  tonnesEmittedSession: number;
}

/**
 * Generates a formatted multi-page scientific PDF report containing all live telemetry,
 * sectoral causes, country profiles, and verified institutional sources currently displayed.
 */
export function generateClimatePdfReport({
  lang,
  atmospheric,
  activeStationTelemetry,
  tonnesEmittedSession
}: PdfExportOptions): void {
  const isEn = lang === 'en';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const nowStr = new Date().toLocaleString(isEn ? 'en-US' : 'fr-FR', {
    dateStyle: 'long',
    timeStyle: 'medium'
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(
    isEn
      ? 'GLOBAL CLIMATE OBSERVATORY — SCIENTIFIC REPORT'
      : 'OBSERVATOIRE CLIMATIQUE MONDIAL — RAPPORT SCIENTIFIQUE',
    14,
    15
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    isEn
      ? `Generated on: ${nowStr} · Sources: NOAA GML, NASA GISS, IPCC AR6, Copernicus C3S, Open-Meteo, World Bank`
      : `Généré le : ${nowStr} · Sources : NOAA GML, NASA GISS, GIEC AR6, Copernicus C3S, Open-Meteo, Banque Mondiale`,
    14,
    22
  );
  doc.text(
    isEn
      ? `API Stream Status: ${atmospheric.sourceLabelEn} · Session GHG Emitted: +${tonnesEmittedSession.toLocaleString('en-US')} tCO2eq`
      : `Statut Flux API : ${atmospheric.sourceLabelFr} · GES émis durant la session : +${tonnesEmittedSession.toLocaleString('fr-FR')} tCO2eq`,
    14,
    28
  );

  // Section 1: Live Atmospheric Telemetry
  let currentY = 44;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(
    isEn
      ? '1. Live Global Atmospheric Telemetry (NOAA GML & NASA GISS)'
      : '1. Télémesure Atmosphérique Globale en Temps Réel (NOAA GML & NASA GISS)',
    14,
    currentY
  );

  const co2Delta = (atmospheric.co2Ppm - atmospheric.co2YearAgoPpm).toFixed(2);
  const ch4Delta = (atmospheric.ch4Ppb - atmospheric.ch4YearAgoPpb).toFixed(1);

  autoTable(doc, {
    startY: currentY + 4,
    head: [
      isEn
        ? ['Physical Indicator', 'Live Measured Value', 'Annual Delta / Reference', 'Official Source & Endpoint']
        : ['Indicateur Physique', 'Valeur Mesurée en Direct', 'Variation Annuelle / Réf.', 'Source Officielle & Endpoint']
    ],
    body: [
      [
        isEn ? 'Tropospheric CO2 (Mauna Loa)' : 'CO2 Troposphérique (Mauna Loa)',
        `${atmospheric.co2Ppm.toFixed(2)} ppm (${atmospheric.co2DateLabel})`,
        `+${co2Delta} ppm / 12m (+52% vs 1850)`,
        'NOAA GML (gml.noaa.gov/ccgg/trends/)'
      ],
      [
        isEn ? 'Global Mean Thermal Anomaly' : 'Anomalie Thermique Globale',
        `+${atmospheric.tempAnomalyC.toFixed(2)} °C (${atmospheric.tempDateLabel})`,
        isEn ? '+0.26 °C / decade vs 1850-1900' : '+0,26 °C / décennie vs 1850-1900',
        'NASA GISS GISTEMP v4 & Copernicus ERA5'
      ],
      [
        isEn ? 'Atmospheric Methane (CH4)' : 'Méthane Atmosphérique (CH4)',
        `${atmospheric.ch4Ppb.toFixed(1)} ppb (${atmospheric.ch4DateLabel})`,
        `+${ch4Delta} ppb / 12m (GWP-20: 84x)`,
        'NOAA Global CH4 Network (gml.noaa.gov)'
      ],
      [
        isEn ? 'Global Anthropogenic GHG Flux' : 'Flux Anthropique Mondial GES',
        '59.10 GtCO2eq / yr (1,874 t/s)',
        isEn ? 'Remaining 1.5°C Budget: ~200 Gt' : 'Budget 1,5°C restant : ~200 Gt',
        'IPCC AR6 WG3 & Global Carbon Project'
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section 2: Global Warming Root Causes by Sector (59.1 GtCO2e/yr)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? '2. Global Warming Root Causes by Sector (59.1 GtCO2eq/yr — IPCC AR6)'
      : '2. Répartition Mondiale des Causes du Réchauffement par Secteur (59,1 GtCO2eq/an)',
    14,
    currentY
  );

  const sectorRows = GLOBAL_CAUSES_BY_SECTOR.map((s) => {
    const subList = s.subSectors
      .map((sub) => `${isEn ? sub.nameEn : sub.name} (${sub.share}%)`)
      .join(' · ');
    return [
      isEn ? s.nameEn : s.name,
      `${s.sharePercent.toFixed(1)}%`,
      `${s.annualGtCO2e.toFixed(2)} Gt`,
      s.primaryGas,
      subList
    ];
  });

  autoTable(doc, {
    startY: currentY + 4,
    head: [
      isEn
        ? ['Sector', 'Share (%)', 'Volume (Gt/yr)', 'Gas', 'Key Industrial Sub-Sectors']
        : ['Secteur', 'Part (%)', 'Volume (Gt/an)', 'Gaz', 'Sous-Secteurs Industriels Clés']
    ],
    body: sectorRows,
    theme: 'grid',
    headStyles: { fillColor: [217, 119, 6], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 18, halign: 'right' },
      2: { cellWidth: 24, halign: 'right' },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 84 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section 3: Top 12 Emitting Countries & Cumulative Historical Debt
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? '3. Top 12 Global Emitting Countries & Historical Responsibility (GCP & World Bank)'
      : '3. Atlas des 12 Grands Pays Émetteurs & Responsabilité Historique (GCP & Banque Mondiale)',
    14,
    currentY
  );

  const countryRows = COUNTRY_EMISSION_PROFILES.map((c) => [
    `${isEn ? c.nameEn : c.name} (${c.iso})`,
    `${c.annualMtCO2.toLocaleString(isEn ? 'en-US' : 'fr-FR')} Mt`,
    `${c.perCapitaTonnes.toFixed(1)} t`,
    `${c.cumulativeSharePercent.toFixed(1)}%`,
    `${c.renewableSharePercent.toFixed(1)}%`,
    isEn ? c.mainCauseEn : c.mainCause
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [
      isEn
        ? ['Country (ISO)', 'Annual CO2', 'Per Capita', '1850 Cumul.', 'Renewables', 'Primary Structural Causes']
        : ['Pays (ISO)', 'CO2 Annuel', 'Par Hab.', 'Cumul 1850', 'Renouvelable', 'Causes Structurelles Principales']
    ],
    body: countryRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 22, halign: 'right' },
      2: { cellWidth: 18, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 74 }
    },
    margin: { left: 14, right: 14 }
  });

  // Page 2 if needed for Active Live Observatory Sensor + API Verification Matrix
  doc.addPage();
  let page2Y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? '4. Live Observatory Sensor Snapshot (Open-Meteo Weather & CAMS Air Quality API)'
      : '4. Relevé Capteur de la Station Active en Temps Réel (API Open-Meteo & CAMS)',
    14,
    page2Y
  );

  if (activeStationTelemetry) {
    const st = activeStationTelemetry.station;
    autoTable(doc, {
      startY: page2Y + 4,
      head: [
        isEn
          ? ['Station & Coordinates', '2m Temp / Delta', 'PM2.5 / PM10', 'CO / Ozone (O3)', 'Wind & Pressure']
          : ['Station & Coordonnées', 'Temp 2m / Écart', 'PM2.5 / PM10', 'CO / Ozone (O3)', 'Vent & Pression']
      ],
      body: [
        [
          `${isEn ? st.nameEn : st.name}\n(${st.lat.toFixed(2)}°, ${st.lon.toFixed(2)}° · ${st.elevationM}m)`,
          `${activeStationTelemetry.currentTempC.toFixed(1)} °C\n(Delta: ${activeStationTelemetry.decadeDeltaC >= 0 ? '+' : ''}${activeStationTelemetry.decadeDeltaC.toFixed(1)} °C)`,
          `PM2.5: ${activeStationTelemetry.pm25UgM3.toFixed(1)} µg/m³\nPM10: ${activeStationTelemetry.pm10UgM3.toFixed(1)} µg/m³`,
          `CO: ${activeStationTelemetry.carbonMonoxideUgM3.toFixed(0)} µg/m³\nO3: ${activeStationTelemetry.ozoneUgM3.toFixed(1)} µg/m³`,
          `${activeStationTelemetry.windSpeedKmh.toFixed(1)} km/h · ${activeStationTelemetry.humidityPercent}%\n${activeStationTelemetry.surfacePressureHpa.toFixed(0)} hPa`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontSize: 8.5 },
      bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
      margin: { left: 14, right: 14 }
    });
    page2Y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Section 5: Real-Time API Verification & Institutional Provenance Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn
      ? '5. Live Public API Verification & Institutional Provenance (Incl. Europa.eu & WWF)'
      : '5. Audit des APIs Publiques & Sources Institutionnelles (Incl. Europa.eu & WWF France)',
    14,
    page2Y
  );

  const channelRows = [
    ...atmospheric.channels.map((ch) => [
      ch.name,
      ch.endpoint,
      ch.isLive ? (isEn ? 'LIVE VERIFIED (HTTP 200)' : 'ACTIF VÉRIFIÉ (HTTP 200)') : 'CALIBRATED',
      ch.lastUpdated,
      ch.measuredValue
    ]),
    [
      'European Commission (EDGAR / EEA)',
      'edgar.jrc.ec.europa.eu · eea.europa.eu',
      isEn ? 'OFFICIAL INVENTORY' : 'INVENTAIRE OFFICIEL',
      '1990–2025',
      'EU-27: -32.5% vs 1990'
    ],
    [
      'WWF France (Living Planet Report)',
      'wwf.fr/rapport-planete-vivante',
      isEn ? 'EMPIRICAL REPORT' : 'RAPPORT SCIENTIFIQUE',
      '1970–2020',
      'LPI / IPV: -73% Wildlife'
    ]
  ];

  autoTable(doc, {
    startY: page2Y + 4,
    head: [
      isEn
        ? ['Data Stream', 'Public API Endpoint', 'Status', 'Timestamp', 'Current Readout']
        : ['Flux de Données', 'Point d’Entrée API Public', 'Statut', 'Horodatage', 'Mesure Actuelle']
    ],
    body: channelRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 }
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      isEn
        ? `Global Climate Observatory — Scientific Synthesis Report · Page ${i} of ${pageCount}`
        : `Observatoire Climatique Mondial — Rapport de Synthèse Scientifique · Page ${i} sur ${pageCount}`,
      14,
      288
    );
  }

  const filename = isEn
    ? `global-climate-observatory-report-${new Date().toISOString().slice(0, 10)}.pdf`
    : `observatoire-climatique-rapport-${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(filename);
}
