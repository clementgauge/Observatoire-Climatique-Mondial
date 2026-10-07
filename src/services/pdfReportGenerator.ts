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
 * Sanitizes Unicode characters unsupported by standard PDF WinAnsi (Helvetica) fonts
 * (such as subscripts ₂, ₄, curly apostrophes ’, middle dots ·, narrow spaces, etc.)
 * so jsPDF never stretches letter spacing or corrupts chemical formulas.
 */
function sanitizePdfText(input: string): string {
  return input
    .replace(/₀/g, '0')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .replace(/₄/g, '4')
    .replace(/₅/g, '5')
    .replace(/₆/g, '6')
    .replace(/[’‘]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/·/g, ' - ')
    .replace(/≈/g, '~')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/×/g, 'x')
    .replace(/[\u00A0\u202F]/g, ' ');
}

/**
 * Generates a formatted multi-page scientific PDF report containing all live telemetry,
 * sectoral causes, country profiles, deforestation & WWF biodiversity actions, and verified sources.
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

  const nowStr = sanitizePdfText(
    new Date().toLocaleString(isEn ? 'en-US' : 'fr-FR', {
      dateStyle: 'long',
      timeStyle: 'medium'
    })
  );

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(
    sanitizePdfText(
      isEn
        ? 'GLOBAL CLIMATE OBSERVATORY - SCIENTIFIC REPORT'
        : 'OBSERVATOIRE CLIMATIQUE MONDIAL - RAPPORT SCIENTIFIQUE'
    ),
    14,
    14
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    sanitizePdfText(
      isEn
        ? `Generated on: ${nowStr} | Sources: NOAA GML, NASA GISS, IPCC AR6, Europa.eu, WWF France`
        : `Généré le : ${nowStr} | Sources : NOAA GML, NASA GISS, GIEC AR6, Europa.eu, WWF France`
    ),
    14,
    21
  );
  doc.text(
    sanitizePdfText(
      isEn
        ? `Live Stream: ${atmospheric.sourceLabelEn} | Session GHG Emitted: +${tonnesEmittedSession.toLocaleString('en-US')} tCO2eq`
        : `Flux Direct : ${atmospheric.sourceLabelFr} | GES émis durant la session : +${tonnesEmittedSession.toLocaleString('fr-FR')} tCO2eq`
    ),
    14,
    27
  );

  // Section 1: Live Atmospheric Telemetry
  let currentY = 42;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    sanitizePdfText(
      isEn
        ? '1. Live Global Atmospheric Telemetry (NOAA GML & NASA GISS)'
        : '1. Télémesure Atmosphérique Globale en Temps Réel (NOAA GML & NASA GISS)'
    ),
    14,
    currentY
  );

  const co2Delta = (atmospheric.co2Ppm - atmospheric.co2YearAgoPpm).toFixed(2);
  const ch4Delta = (atmospheric.ch4Ppb - atmospheric.ch4YearAgoPpb).toFixed(1);

  autoTable(doc, {
    startY: currentY + 3,
    tableWidth: 182,
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
    styles: { overflow: 'linebreak', cellPadding: 2.5, fontSize: 8 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8.5 },
    bodyStyles: { textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 42 },
      2: { cellWidth: 44 },
      3: { cellWidth: 50 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 9;

  // Section 2: Global Warming Root Causes by Sector (59.1 GtCO2e/yr)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    sanitizePdfText(
      isEn
        ? '2. Global Warming Root Causes by Sector (59.1 GtCO2eq/yr - IPCC AR6)'
        : '2. Répartition Mondiale des Causes du Réchauffement par Secteur (59,1 GtCO2eq/an)'
    ),
    14,
    currentY
  );

  // Format each sub-sector on its own clean bullet line and sanitize Unicode subscripts
  const sectorRows = GLOBAL_CAUSES_BY_SECTOR.map((s) => {
    const subList = s.subSectors
      .map((sub) => sanitizePdfText(`• ${isEn ? sub.nameEn : sub.name} (${sub.share.toFixed(1)}% | ${sub.gtCO2e.toFixed(2)} Gt)`))
      .join('\n');
    return [
      sanitizePdfText(isEn ? s.nameEn : s.name),
      `${s.sharePercent.toFixed(1)}%`,
      `${s.annualGtCO2e.toFixed(2)} Gt`,
      sanitizePdfText(s.primaryGas),
      subList
    ];
  });

  autoTable(doc, {
    startY: currentY + 3,
    tableWidth: 182,
    head: [
      isEn
        ? ['Sector', 'Share', 'Volume', 'Gas', 'Key Industrial Sub-Sectors']
        : ['Secteur', 'Part', 'Volume', 'Gaz', 'Sous-Secteurs Industriels Clés']
    ],
    body: sectorRows,
    theme: 'grid',
    styles: { overflow: 'linebreak', cellPadding: 2.5, fontSize: 8, valign: 'middle' },
    headStyles: { fillColor: [217, 119, 6], textColor: 255, fontSize: 8.5 },
    bodyStyles: { textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 16, halign: 'right' },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 92 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 9;

  // Section 3: Top 12 Emitting Countries & Cumulative Historical Debt
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    sanitizePdfText(
      isEn
        ? '3. Top 12 Global Emitting Countries & Historical Responsibility (EDGAR / World Bank)'
        : '3. Atlas des 12 Grands Pays Émetteurs & Responsabilité Historique (EDGAR / Banque Mondiale)'
    ),
    14,
    currentY
  );

  const countryRows = COUNTRY_EMISSION_PROFILES.map((c) => [
    sanitizePdfText(`${isEn ? c.nameEn : c.name} (${c.iso})`),
    sanitizePdfText(`${c.annualMtCO2.toLocaleString(isEn ? 'en-US' : 'fr-FR')} Mt`),
    `${c.perCapitaTonnes.toFixed(1)} t`,
    `${c.cumulativeSharePercent.toFixed(1)}%`,
    `${c.renewableSharePercent.toFixed(1)}%`,
    sanitizePdfText(isEn ? c.mainCauseEn : c.mainCause)
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    tableWidth: 182,
    head: [
      isEn
        ? ['Country (ISO)', 'Annual CO2', 'Per Cap.', '1850 Cumul.', 'Renewables', 'Primary Structural Causes']
        : ['Pays (ISO)', 'CO2 Annuel', 'Par Hab.', 'Cumul 1850', 'Renouvelable', 'Causes Structurelles Principales']
    ],
    body: countryRows,
    theme: 'striped',
    styles: { overflow: 'linebreak', cellPadding: 2, fontSize: 7.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8 },
    bodyStyles: { textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 21, halign: 'right' },
      2: { cellWidth: 16, halign: 'right' },
      3: { cellWidth: 19, halign: 'right' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 78 }
    },
    margin: { left: 14, right: 14 }
  });

  // Page 2: Deforestation, WWF Wildlife Conservation, Policies (France/EU/World) & Live Station
  doc.addPage();
  let page2Y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    sanitizePdfText(
      isEn
        ? '4. Global Deforestation, WWF Wildlife Conservation & Public Climate Policies'
        : '4. Déforestation Mondiale, Actions du WWF pour la Faune & Politiques Publiques'
    ),
    14,
    page2Y
  );

  autoTable(doc, {
    startY: page2Y + 3,
    tableWidth: 182,
    head: [
      isEn
        ? ['Thematic Pillar', 'Key Empirical Metric', 'Drivers, WWF Field Actions & Legislative Measures']
        : ['Pilier Thématique', 'Indicateur Clé Vérifié', 'Causes, Actions WWF pour la Faune & Mesures Législatives']
    ],
    body: [
      [
        isEn ? 'Global Deforestation (FAO / WWF)' : 'Déforestation Mondiale (FAO / WWF)',
        '-10.0 M ha / yr\n(~80% agricultural)',
        sanitizePdfText(
          isEn
            ? 'Amazon (-1.95 Mha/yr), Congo Basin (-0.82 Mha/yr), Borneo/Sumatra (-0.68 Mha/yr). Driven by cattle ranching, soy feed, and palm oil.'
            : 'Amazonie (-1,95 Mha/an), Bassin du Congo (-0,82 Mha/an), Bornéo/Sumatra (-0,68 Mha/an). Causée par le bétail, le soja et l’huile de palme.'
        )
      ],
      [
        isEn ? 'WWF Wildlife & Biosphere (LPI)' : 'Faune Sauvage & Actions WWF (IPV)',
        '-73% Wildlife (1970-2020)\n-95% Latin America',
        sanitizePdfText(
          isEn
            ? 'ARPA Amazon sanctuary (62 Mha), Pelagos whale & Posidonia protection (5x carbon/ha), Congo forest elephants (+7% forest carbon), Arctic patrols.'
            : 'Sanctuaire ARPA Amazonie (62 Mha), cétacés & herbiers de posidonie en Méditerranée (5x carbone/ha), éléphants du Congo, corridors lynx/ours.'
        )
      ],
      [
        isEn ? 'France Policy (SNBC 3 & ZAN)' : 'Mesures France (SNBC 3 & Biodiversité)',
        '304 MtCO2e (-5.8%/yr)\n92% Low-Carbon Grid',
        sanitizePdfText(
          isEn
            ? '-50% gross GHG target by 2030, oil boiler ban, heat pumps, decarbonizing top 50 industrial sites, 30% protected areas (10% strict protection).'
            : 'Objectif -50 % en 2030, fin des chaudières fioul, pompes à chaleur, décarbonation des 50 sites industriels majeurs, 30 % d’aires protégées.'
        )
      ],
      [
        isEn ? 'European Union (Green Deal / EUDR)' : 'Union Européenne (Green Deal / EUDR)',
        '-32.5% Net GHG vs 1990\nTarget: -55% by 2030',
        sanitizePdfText(
          isEn
            ? 'EU Deforestation Regulation (EUDR banning deforestation-linked imports), Carbon Border Adjustment (CBAM), EU Nature Restoration Law (20% by 2030).'
            : 'Règlement Zéro Déforestation Importée (EUDR), Taxe Carbone aux Frontières (MACF/CBAM), Loi sur la Restauration de la Nature (20 % d’ici 2030).'
        )
      ],
      [
        isEn ? 'Global Treaties (Paris & 30x30)' : 'Accords Mondiaux (Paris & 30x30)',
        '+510 GW Renewables/yr\n30% Planet Protected',
        sanitizePdfText(
          isEn
            ? 'COP28 pledge to triple renewables (11,000 GW by 2030), Global Methane Pledge (-30% CH4), Kunming-Montreal 30x30 Biodiversity & UN High Seas Treaty.'
            : 'Engagement COP28 de tripler les renouvelables (11 000 GW), Global Methane Pledge (-30 % CH4), Accord Kunming-Montréal 30x30 & Traité Haute Mer.'
        )
      ]
    ],
    theme: 'grid',
    styles: { overflow: 'linebreak', cellPadding: 2.5, fontSize: 8 },
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontSize: 8.5 },
    bodyStyles: { textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 36 },
      2: { cellWidth: 104 }
    },
    margin: { left: 14, right: 14 }
  });

  page2Y = (doc as any).lastAutoTable.finalY + 9;

  // Section 5: Active Live Observatory Sensor Snapshot
  if (activeStationTelemetry) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(
      sanitizePdfText(
        isEn
          ? '5. Live Observatory Sensor Snapshot (Open-Meteo Weather & CAMS Air Quality API)'
          : '5. Relevé Capteur de la Station Active en Temps Réel (API Open-Meteo & CAMS)'
      ),
      14,
      page2Y
    );

    const st = activeStationTelemetry.station;
    autoTable(doc, {
      startY: page2Y + 3,
      tableWidth: 182,
      head: [
        isEn
          ? ['Station & Coordinates', '2m Temp / Delta', 'PM2.5 / PM10', 'CO / Ozone (O3)', 'Wind & Pressure']
          : ['Station & Coordonnées', 'Temp 2m / Écart', 'PM2.5 / PM10', 'CO / Ozone (O3)', 'Vent & Pression']
      ],
      body: [
        [
          sanitizePdfText(`${isEn ? st.nameEn : st.name}\n(${st.lat.toFixed(2)}°, ${st.lon.toFixed(2)}° | ${st.elevationM}m)`),
          sanitizePdfText(`${activeStationTelemetry.currentTempC.toFixed(1)} °C\n(Delta: ${activeStationTelemetry.decadeDeltaC >= 0 ? '+' : ''}${activeStationTelemetry.decadeDeltaC.toFixed(1)} °C)`),
          `PM2.5: ${activeStationTelemetry.pm25UgM3.toFixed(1)} ug/m3\nPM10: ${activeStationTelemetry.pm10UgM3.toFixed(1)} ug/m3`,
          `CO: ${activeStationTelemetry.carbonMonoxideUgM3.toFixed(0)} ug/m3\nO3: ${activeStationTelemetry.ozoneUgM3.toFixed(1)} ug/m3`,
          `${activeStationTelemetry.windSpeedKmh.toFixed(1)} km/h | ${activeStationTelemetry.humidityPercent}%\n${activeStationTelemetry.surfacePressureHpa.toFixed(0)} hPa`
        ]
      ],
      theme: 'grid',
      styles: { overflow: 'linebreak', cellPadding: 2.5, fontSize: 8 },
      headStyles: { fillColor: [2, 132, 199], textColor: 255, fontSize: 8.5 },
      bodyStyles: { textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 46, fontStyle: 'bold' },
        1: { cellWidth: 34 },
        2: { cellWidth: 34 },
        3: { cellWidth: 34 },
        4: { cellWidth: 34 }
      },
      margin: { left: 14, right: 14 }
    });
    page2Y = (doc as any).lastAutoTable.finalY + 9;
  }

  // Section 6: Real-Time API Verification & Institutional Provenance Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    sanitizePdfText(
      isEn
        ? '6. Live Public API Verification & Institutional Provenance (Incl. Europa.eu & WWF)'
        : '6. Audit des APIs Publiques & Sources Institutionnelles (Incl. Europa.eu & WWF France)'
    ),
    14,
    page2Y
  );

  const channelRows = [
    ...atmospheric.channels.map((ch) => [
      sanitizePdfText(ch.name),
      sanitizePdfText(ch.endpoint),
      ch.isLive ? (isEn ? 'LIVE HTTP 200' : 'DIRECT HTTP 200') : 'CALIBRATED',
      sanitizePdfText(ch.lastUpdated),
      sanitizePdfText(ch.measuredValue)
    ]),
    [
      'European Commission (EDGAR / EEA)',
      'edgar.jrc.ec.europa.eu | eea.europa.eu',
      isEn ? 'OFFICIAL INVENTORY' : 'INVENTAIRE OFFICIEL',
      '1990-2025',
      'EU-27: -32.5% vs 1990'
    ],
    [
      'WWF France (Living Planet Report)',
      'wwf.fr/rapport-planete-vivante',
      isEn ? 'EMPIRICAL REPORT' : 'RAPPORT SCIENTIFIQUE',
      '1970-2020',
      'LPI / IPV: -73% Wildlife'
    ]
  ];

  autoTable(doc, {
    startY: page2Y + 3,
    tableWidth: 182,
    head: [
      isEn
        ? ['Data Stream', 'Public API Endpoint', 'Status', 'Timestamp', 'Current Readout']
        : ['Flux de Données', 'Point d\'Entrée API Public', 'Statut', 'Horodatage', 'Mesure Actuelle']
    ],
    body: channelRows,
    theme: 'grid',
    styles: { overflow: 'linebreak', cellPadding: 2, fontSize: 7.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8 },
    bodyStyles: { textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 44, fontStyle: 'bold' },
      1: { cellWidth: 56 },
      2: { cellWidth: 28 },
      3: { cellWidth: 24 },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      sanitizePdfText(
        isEn
          ? `Global Climate Observatory - Scientific Synthesis Report | Page ${i} of ${pageCount}`
          : `Observatoire Climatique Mondial - Rapport de Synthèse Scientifique | Page ${i} sur ${pageCount}`
      ),
      14,
      288
    );
  }

  const filename = isEn
    ? `global-climate-observatory-report-${new Date().toISOString().slice(0, 10)}.pdf`
    : `observatoire-climatique-rapport-${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(filename);
}
