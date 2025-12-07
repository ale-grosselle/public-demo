export interface SuggestedItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
}

const CATEGORIES = [
  'Electronics', 'Books', 'Clothing', 'Home & Garden', 'Sports',
  'Beauty', 'Automotive', 'Toys & Games', 'Food & Beverages', 'Health'
];

const SAMPLE_TITLES = [
  'Premium Quality', 'Best Seller', 'Latest Model', 'Classic Design', 'Modern Style',
  'Professional Grade', 'Eco-Friendly', 'Limited Edition', 'Top Rated', 'Customer Favorite'
];

const SAMPLE_DESCRIPTIONS = [
  'Experience the perfect blend of quality and functionality',
  'Designed with attention to detail and user comfort',
  'Revolutionary features that enhance your daily life',
  'Crafted from premium materials for lasting durability',
  'Innovative technology meets elegant design',
  'Perfect for both beginners and professionals',
  'Sustainable choice for environmentally conscious consumers',
  'Trusted by millions of satisfied customers worldwide'
];

function generateRandomItem(id: string): SuggestedItem {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const title = `${SAMPLE_TITLES[Math.floor(Math.random() * SAMPLE_TITLES.length)]} ${category.slice(0, -1)}`;
  const description = SAMPLE_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_DESCRIPTIONS.length)];

  return {
    id,
    title,
    description,
    category,
    price: Math.floor(Math.random() * 500) + 10, // Random price between $10-$510
    imageUrl: `https://picsum.photos/200/200?random=${id}`, // Random placeholder images
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // Random rating between 3.0-5.0
  };
}

export async function generateSuggestedItems(count: number = 10): Promise<SuggestedItem[]> {
  // Simulate async API call with random delay
  const delay = Math.floor(Math.random() * 2000) + 500; // 500-2500ms delay
  await new Promise(resolve => setTimeout(resolve, delay));

  return Array.from({ length: count }, (_, index) =>
    generateRandomItem(`item-${Date.now()}-${index}`)
  );
}