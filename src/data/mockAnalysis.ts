// Mock analysis data for AutoTark

export interface InspectionPoint {
  type: 'warning' | 'attention' | 'positive' | 'neutral'
  title: string
  description: string
}

export interface SellerQuestion {
  question: string
  category: 'maintenance' | 'history' | 'issues' | 'documentation'
}

export interface InspectionItem {
  id: string
  label: string
  checked: boolean
  category: string
}

export interface ModelIssue {
  model: string
  issues: string[]
}

export interface MaintenanceTask {
  category: string
  tasks: string[]
  estimatedCost: number
  urgency: 'urgent' | 'recommended' | 'optional'
}

export interface SellerClaim {
  claim: string
  evidence: string
  verification: string
}

export interface ReportSummary {
  pros: string[]
  cons: string[]
  recommendation: string
  // Evidence-based counts instead of numeric scores
  attentionItemCount: number
  warningItemCount: number
  positiveItemCount: number
  claimsNeedingVerification: number
  maintenanceItems: number
}

export interface AnalysisReport {
  id: string
  carId: string
  car: {
    title: string
    price: number
    year: number
    mileage: number
    engine: string
    transmission: string
    sellerType: string
    features: string[]
  }
  inspectionPoints: InspectionPoint[]
  sellerQuestions: SellerQuestion[]
  inspectionChecklist: InspectionItem[]
  modelIssues: ModelIssue[]
  upcomingMaintenance: MaintenanceTask[]
  sellerClaims: SellerClaim[]
  summary: ReportSummary
  analysisDate: string
}

export const mockAnalysis: AnalysisReport = {
  id: 'analysis-1',
  carId: '1',
  car: {
    title: 'BMW 530d xDrive',
    price: 17900,
    year: 2018,
    mileage: 214000,
    engine: '3.0 diesel',
    transmission: 'automatic',
    sellerType: 'private',
    features: ['xDrive', 'navigation', 'leather seats', 'heated seats', 'panorama roof', 'parking sensors', 'blind spot monitor'],
  },
  inspectionPoints: [
    {
      type: 'warning',
      title: 'Kõrge läbisõit 214 000 km',
      description: 'Selle läbisõidu juures tuleb eraldi tähelepanu pöörata mootori ja käigukasti olekule. Kontrolli ka EGR süsteemi ja puhvri olekut.',
    },
    {
      type: 'attention',
      title: '"Värskelt hooldatud" - puudub dokumenteerimine',
      description: 'Kuulutus ei täpsusta, mida hoolduse käigus tehti. Küsi hooldusarvet või arvete koopiat.',
    },
    {
      type: 'attention',
      title: 'Hooldusajalugu puudulikult dokumenteeritud',
      description: 'Kuulutuses öeldakse, et hooldusajalugu on olemas, kuid tõendeid ei näidata. See on merk muret.',
    },
    {
      type: 'positive',
      title: 'Sisemärgid suurepärased',
      description: 'Kuulutuses mainitakse, et sisemärgid on puhtad ja olukord suurepärane. See on positiivne märk.',
    },
    {
      type: 'neutral',
      title: 'XDrive süsteem',
      description: 'xDrive 4-ristjuhtimissüsteem on töökindel, kuid hooldus on oluline. Kontrolli transferi olekut.',
    },
    {
      type: 'warning',
      title: 'Turbomehaanika - võib vaja vahetada',
      description: 'BMW B57 mootori turbiidid võivad 200 000 km pealt vaja vahetada. Hindab 1500-3000 €.',
    },
  ],
  sellerQuestions: [
    { question: 'Millal viimati vahetati käigukastiõli?', category: 'maintenance' },
    { question: 'Kas EGR süsteem on kinni jäänud või puhastatud?', category: 'issues' },
    { question: 'Kas puhvri süsteem töötab korralikult?', category: 'issues' },
    { question: 'Kas hooldusajalugu on dokumenteeritud?', category: 'documentation' },
    { question: 'Kas autol on olnud liikluskahjusid?', category: 'history' },
    { question: 'Kas mõlemad võtmed on olemas?', category: 'documentation' },
    { question: 'Mis põhjusel autot müüte?', category: 'history' },
    { question: 'Kas autol on olnud veapõhjusel puhkust?', category: 'history' },
    { question: 'Kas kõik elektrilised lisad toimivad korralikult?', category: 'issues' },
    { question: 'Kas kliimaseade töötab kõigil temperatuuridel?', category: 'issues' },
  ],
  inspectionChecklist: [
    { id: '1', label: 'Külmkäivitus - kas motor töötab külmas', checked: false, category: 'test drive' },
    { id: '2', label: 'Rehvide ebaühtlane kulumine - võib viidata varustusprobleemidele', checked: false, category: 'visual' },
    { id: '3', label: 'Kerepaneelide värvierinevused - võib viidata kahjustustele', checked: false, category: 'visual' },
    { id: '4', label: 'VIN-number autol ja dokumentidel - kattuvad', checked: false, category: 'documentation' },
    { id: '5', label: 'Kõik elektrilised lisad toimivad - kliima, seat, navig', checked: false, category: 'test drive' },
    { id: '6', label: 'Kliimaseade töötab kõigil temperatuuridel', checked: false, category: 'test drive' },
    { id: '7', label: 'Veateased armatuurlaual - puuduvad', checked: false, category: 'test drive' },
    { id: '8', label: 'Mootori hääldus ja käitumine - sujuv ja ühtlane', checked: false, category: 'test drive' },
    { id: '9', label: 'Põletusõhukatt - puhas, mitte must', checked: false, category: 'visual' },
    { id: '10', label: 'Tagakülg - ühtlane, ilma kahjustusteta', checked: false, category: 'visual' },
    { id: '11', label: 'Käigukast - sujuv vahetus, mitte kriiksuva', checked: false, category: 'test drive' },
    { id: '12', label: 'Põrkerelvad - puuduvad või puhas', checked: false, category: 'visual' },
    { id: '13', label: 'Kütusekulu - vastavalt kuulutusele', checked: false, category: 'test drive' },
    { id: '14', label: 'Põlevkivitõrjekatted - puuduvad või vahetamise järel', checked: false, category: 'maintenance' },
    { id: '15', label: 'Brake fluid - vahetatud viimati 2 aasta järel', checked: false, category: 'maintenance' },
  ],
  modelIssues: [
    {
      model: 'BMW G30 530d / B57',
      issues: [
        'EGR süsteem - kontrolli, kas EGR-ventiil on kinni jäänud',
        'Turbomehaanika - 200 000 km pealt võib vaja vahetada',
        'AdBlue süsteem - kontrolli, kas puhvri süsteem töötab',
        'Transfer kast xDrive mudelite juures - kontrolli ühendusi',
        'Käigukast - 100 000 km pealt vaja kontrollida',
        'Mootori põrkerelvad - 150 000 km pealt vaja vahetada',
      ],
    },
  ],
  upcomingMaintenance: [
    {
      category: 'Kriitiline (kohe)',
      tasks: [
        'Põlevkivitõrjekatted - kui varem kui 2 aastat',
        'Brake fluid - vahetada kui varem kui 2 aastat',
      ],
      estimatedCost: 400,
      urgency: 'urgent',
    },
    {
      category: 'Soovitatav (6 kuud)',
      tasks: [
        'Käigukastiõli vahetamine',
        'Kõik filter (ilmavõi, kütuse, kabin)',
        'Külmutusvedelik',
        'Kliimaseadme töökorras hoidmine',
      ],
      estimatedCost: 800,
      urgency: 'recommended',
    },
    {
      category: 'Plaanitud (1-2 aastat)',
      tasks: [
        'Turbomehaanika võib vaja vahetada',
        'Mootori põrkerelvad',
        'Elektrisüsteemi kontroll',
      ],
      estimatedCost: 3500,
      urgency: 'optional',
    },
  ],
  sellerClaims: [
    {
      claim: 'Täielik hooldusajalugu',
      evidence: 'Kuulutuses öeldakse, et hooldusajalugu on olemas',
      verification: 'Näita hooldusarvet või arvete koopiat',
    },
    {
      claim: 'Avariivaba',
      evidence: 'Kuulutuses öeldakse, et autol pole avariisid',
      verification: 'Kontrolli paneelide ühendusi ja kasti vundamenti',
    },
    {
      claim: 'Värskelt hooldatud',
      evidence: 'Kuulutuses öeldakse, et auto on värskelt hooldatud',
      verification: 'Näita viimaseid hooldusarveid',
    },
    {
      claim: 'Kõik lisad töötavad',
      evidence: 'Kuulutuses öeldakse, et kõik lisad töötavad',
      verification: 'Testi kõik lisad põhjalikult',
    },
  ],
  summary: {
    pros: [
      'Suurepärased sisemärgid',
      'Kõik lisad töötavad',
      'Kere on avariivaba',
      'Täielik hooldusajalugu (kui kinnitatud)',
    ],
    cons: [
      'Kõrge läbisõit 214 000 km',
      'Hooldusajalugu on puudulikult dokumenteeritud',
      'Turbomehaanika võib vaja vahetada (1500-3000 €)',
      'EGR süsteemi võib vaja puhastada',
    ],
    recommendation: 'Auto on võimalik ostu väärtus, kuid enne ostu tehke põhjalik inspektsioon. Erityiselt kontrolli mootori ja käigukasti olekut, kui hooldusajalugu ei ole dokumenteeritud. Turbiidid võivad vaja vahetada lähiajal.',
    attentionItemCount: 2,
    warningItemCount: 2,
    positiveItemCount: 1,
    claimsNeedingVerification: 4,
    maintenanceItems: 6,
  },
  analysisDate: new Date().toISOString(),
}
