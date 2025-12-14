export interface AdData {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  location: {
    city: string;
    province: string;
    region: string;
  };
  category: string;
  subcategory: string;
  condition: string;
  publishedDate: string;
  views: number;
  images: string[];
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
    joinDate: string;
    isVerified: boolean;
  };
  features: string[];
  specifications: { [key: string]: string };
}

// Sample data arrays for random generation
const titles = [
  'iPhone 14 Pro Max 256GB come nuovo',
  'Appartamento trilocale centro storico',
  'Fiat Punto 1.2 benzina 2018',
  'Mountain bike Scott Scale 29"',
  'Divano 3 posti in pelle marrone',
  'PlayStation 5 con 2 controller',
  'Tavolo da pranzo allungabile',
  'Notebook Lenovo ThinkPad',
  'Scarpe Nike Air Max nuove',
  'Borsa Louis Vuitton originale',
  'Chitarra elettrica Fender',
  'Orologio Rolex Submariner',
  'Macchina fotografica Canon EOS',
  'Frigorifero Samsung side by side',
  'Bicicletta da corsa Specialized',
];

const cities = [
  { city: 'Milano', province: 'MI', region: 'Lombardia' },
  { city: 'Roma', province: 'RM', region: 'Lazio' },
  { city: 'Napoli', province: 'NA', region: 'Campania' },
  { city: 'Torino', province: 'TO', region: 'Piemonte' },
  { city: 'Bologna', province: 'BO', region: 'Emilia-Romagna' },
  { city: 'Firenze', province: 'FI', region: 'Toscana' },
  { city: 'Genova', province: 'GE', region: 'Liguria' },
  { city: 'Palermo', province: 'PA', region: 'Sicilia' },
  { city: 'Bari', province: 'BA', region: 'Puglia' },
  { city: 'Catania', province: 'CT', region: 'Sicilia' },
];

const categories = [
  {
    category: 'Elettronica',
    subcategories: ['Telefoni', 'Computer', 'TV e Audio', 'Console'],
  },
  {
    category: 'Casa e Giardino',
    subcategories: ['Arredamento', 'Elettrodomestici', 'Decorazioni'],
  },
  {
    category: 'Auto e Moto',
    subcategories: ['Auto usate', 'Moto', 'Accessori auto'],
  },
  {
    category: 'Sport e Hobby',
    subcategories: ['Biciclette', 'Palestra', 'Calcio', 'Tennis'],
  },
  {
    category: 'Immobiliare',
    subcategories: ['Vendita', 'Affitto', 'Commerciale'],
  },
];

const conditions = [
  'Nuovo',
  'Come nuovo',
  'Buone condizioni',
  'Discreto',
  'Da riparare',
];

const descriptions = [
  'Vendo per inutilizzo. Sempre tenuto con cura, nessun difetto da segnalare.',
  'Causa trasferimento, vendo a malincuore. Ottime condizioni, mai dato problemi.',
  'Acquistato da poco ma devo vendere per motivi familiari. Praticamente nuovo.',
  'Usato pochissimo, vendo per cambio modello. Include tutti gli accessori originali.',
  'In perfette condizioni, sempre custodito in ambiente asciutto e pulito.',
];

const sellerNames = [
  'Marco Rossi',
  'Giulia Bianchi',
  'Alessandro Conti',
  'Francesca Romano',
  'Davide Ferrari',
  'Chiara Ricci',
  'Matteo Greco',
  'Elena Fiore',
  'Luca Barbieri',
  'Silvia Marchetti',
];

const features = [
  'Garanzia residua',
  'Scontrino disponibile',
  'Accessori inclusi',
  'Perfettamente funzionante',
  'Nessun graffio',
  'Confezione originale',
  'Manuale incluso',
  'Batteria ottima',
  'Schermo perfetto',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRandomFromArray<T>(arr: T[], seed: number): T {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
}

function generateImageUrls(id: string, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/800/600?random=${id}-${i}`,
  );
}

export function generateMockAdData(id: string): AdData {
  const numericId = parseInt(id);
  const seedBase = numericId * 137; // Prime number for better distribution

  const title = getRandomFromArray(titles, seedBase + 1);
  const location = getRandomFromArray(cities, seedBase + 2);
  const categoryData = getRandomFromArray(categories, seedBase + 3);
  const subcategory = getRandomFromArray(
    categoryData.subcategories,
    seedBase + 4,
  );
  const condition = getRandomFromArray(conditions, seedBase + 5);
  const description = getRandomFromArray(descriptions, seedBase + 6);
  const sellerName = getRandomFromArray(sellerNames, seedBase + 7);

  // Generate price based on category (seeded randomness)
  let basePrice = 50;
  if (categoryData.category === 'Elettronica') basePrice = 200;
  if (categoryData.category === 'Auto e Moto') basePrice = 5000;
  if (categoryData.category === 'Immobiliare') basePrice = 150000;

  const priceVariation = seededRandom(seedBase + 8) * 0.8 + 0.6; // 0.6 to 1.4 multiplier
  const price = Math.round(basePrice * priceVariation);

  // Generate views (higher for lower IDs to simulate older posts)
  const baseViews = Math.max(1, 1000 - numericId);
  const views = Math.round(baseViews + seededRandom(seedBase + 9) * 500);

  // Generate publish date (older for lower IDs)
  const daysAgo =
    Math.floor(seededRandom(seedBase + 10) * 30) + (numericId % 30);
  const publishedDate = new Date();
  publishedDate.setDate(publishedDate.getDate() - daysAgo);

  // Generate seller data
  const rating = 3.5 + seededRandom(seedBase + 11) * 1.5; // 3.5 to 5.0
  const reviewCount = Math.floor(seededRandom(seedBase + 12) * 100) + 5;
  const joinYearsAgo = Math.floor(seededRandom(seedBase + 13) * 8) + 1;
  const joinDate = new Date();
  joinDate.setFullYear(joinDate.getFullYear() - joinYearsAgo);

  // Generate random features
  const selectedFeatures = [];
  for (let i = 0; i < 3; i++) {
    const feature = getRandomFromArray(features, seedBase + 14 + i);
    if (!selectedFeatures.includes(feature)) {
      selectedFeatures.push(feature);
    }
  }

  // Generate specifications based on category
  const specifications: { [key: string]: string } = {};
  if (categoryData.category === 'Elettronica') {
    specifications['Marca'] = getRandomFromArray(
      ['Apple', 'Samsung', 'Sony', 'LG'],
      seedBase + 20,
    );
    specifications['Anno'] = `${2020 + (numericId % 4)}`;
    specifications['Memoria'] = getRandomFromArray(
      ['64GB', '128GB', '256GB', '512GB'],
      seedBase + 21,
    );
  }
  if (categoryData.category === 'Auto e Moto') {
    specifications['Marca'] = getRandomFromArray(
      ['Fiat', 'Volkswagen', 'BMW', 'Audi'],
      seedBase + 20,
    );
    specifications['Anno'] = `${2015 + (numericId % 9)}`;
    specifications['Chilometraggio'] = `${20000 + (numericId % 80000)} km`;
    specifications['Alimentazione'] = getRandomFromArray(
      ['Benzina', 'Diesel', 'GPL', 'Ibrida'],
      seedBase + 22,
    );
  }

  // Generate 3-6 images
  const imageCount = 3 + (numericId % 4);
  const images = generateImageUrls(id, imageCount);

  return {
    id,
    title,
    price,
    currency: '€',
    description: `${description} ${title}. Disponibile per visione in ${location.city}. Contattami per maggiori informazioni o per fissare un appuntamento.`,
    location,
    category: categoryData.category,
    subcategory,
    condition,
    publishedDate: publishedDate.toISOString(),
    views,
    images,
    seller: {
      name: sellerName,
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      joinDate: joinDate.toISOString(),
      isVerified: seededRandom(seedBase + 15) > 0.3,
    },
    features: selectedFeatures,
    specifications,
  };
}
