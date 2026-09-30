// Mock car data for AutoTark - Estonian used car inspections

export interface Car {
  id: string
  title: string
  brand?: string
  price: number
  year: number
  mileage: number
  engine: string
  fuelType: string
  transmission: 'automatic' | 'manual'
  sellerType: 'private' | 'dealer'
  listingUrl: string
  images: string[]
  sellerName: string
  sellerLocation: string
  description: string
  features: string[]
  createdAt: string
  isSaved?: boolean
}

export const cars: Car[] = [
  {
    id: '1',
    title: 'BMW 530d xDrive',
    price: 17900,
    year: 2018,
    mileage: 214000,
    engine: '3.0 diesel',
    fuelType: 'diesel',
    transmission: 'automatic',
    sellerType: 'private',
    listingUrl: 'https://www.auto24.ee/ads/bmw-530d-xdrive/123456',
    images: [],
    sellerName: 'Juhan Smith',
    sellerLocation: 'Tallinn',
    description: 'Müüd värskelt hooldatud BMW 530d. Autol on täielik hooldusajalugu ja see on avariivaba. Välisilme on suurepärane ja sisemärgid on puhtad. Võtmed on kättesaadaval kohe.',
    features: ['xDrive', 'navigation', 'leather seats', 'heated seats', 'panorama roof', 'parking sensors', 'blind spot monitor'],
    createdAt: '2024-01-15',
    isSaved: true,
  },
  {
    id: '2',
    title: 'Audi A6 2.0 TDI Quattro',
    price: 15900,
    year: 2017,
    mileage: 198000,
    engine: '2.0 diesel',
    fuelType: 'diesel',
    transmission: 'automatic',
    sellerType: 'private',
    listingUrl: 'https://www.auto24.ee/ads/audi-a6-tdi/234567',
    images: [],
    sellerName: 'Mari Vahet',
    sellerLocation: 'Tartu',
    description: 'Huoleghoolduslikult kasutatud Audi A6. Kõik hooldused tehtud ajalikult. Autol on viimati vahetatud kõvakatt ja kõik süsteemid töötavad korralikult.',
    features: ['Quattro', 'navigation', 'leather seats', 'blind spot monitor', 'lane assist', 'adaptive cruise control'],
    createdAt: '2024-01-10',
    isSaved: true,
  },
  {
    id: '3',
    title: 'Volvo V90 D5 AWD',
    price: 18500,
    year: 2019,
    mileage: 145000,
    engine: '2.0 diesel',
    fuelType: 'diesel',
    transmission: 'automatic',
    sellerType: 'dealer',
    listingUrl: 'https://www.auto24.ee/ads/volvo-v90-d5/345678',
    images: [],
    sellerName: 'AutoKeskus OU',
    sellerLocation: 'Narva',
    description: 'Valitud omadustega Volvo V90. Täielik hooldusajalugu, kõik kahjustused parandatud. Garantiiga ja esialgne kontrolliga.',
    features: ['AWD', 'navigation', 'leather seats', 'panorama roof', 'blind spot monitor', 'parking camera', 'climate control'],
    createdAt: '2024-01-20',
    isSaved: false,
  },
]
