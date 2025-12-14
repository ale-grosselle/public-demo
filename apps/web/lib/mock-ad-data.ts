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
  condition: string;
  views: number;
  images: string[];
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
  'Elettronica',
  'Casa e Giardino',
  'Auto e Moto',
  'Sport e Hobby',
  'Immobiliare',
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
  const condition = getRandomFromArray(conditions, seedBase + 5);
  const description = getRandomFromArray(descriptions, seedBase + 6);

  // Generate price based on category (seeded randomness)
  let basePrice = 50;
  if (categoryData === 'Elettronica') basePrice = 200;
  if (categoryData === 'Auto e Moto') basePrice = 5000;
  if (categoryData === 'Immobiliare') basePrice = 150000;

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
  const joinYearsAgo = Math.floor(seededRandom(seedBase + 13) * 8) + 1;
  const joinDate = new Date();
  joinDate.setFullYear(joinDate.getFullYear() - joinYearsAgo);

  // Generate 3-6 images
  const imageCount = 3 + (numericId % 4);
  const images = generateImageUrls(id, imageCount);

  return {
    id,
    title,
    price,
    currency: '€',
    description: `${description} ${title}.`,
    location,
    category: categoryData,
    condition,
    views,
    images,
  };
}
