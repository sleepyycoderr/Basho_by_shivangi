// Product Data for Basho Shop
// Add more products following this structure

import { Product, GlazeColor } from '@/types/product';

// Available glaze colors across products
export const glazeColors: Record<string, GlazeColor> = {
  earthBrown: { name: 'Earth Brown', code: '#8B6F47' },
  matteWhite: { name: 'Matte White', code: '#F5F5DC' },
  forestGreen: { name: 'Forest Green', code: '#4A7C59' },
  oceanBlue: { name: 'Ocean Blue', code: '#4A7BA7' },
  sunsetOrange: { name: 'Sunset Orange', code: '#D4825C' },
  stoneGrey: { name: 'Stone Grey', code: '#ACA394' },
};

export const products: Product[] = [
  {
    id: 'ceremonial-tea-bowl-001',
    name: 'Ceremonial Tea Bowl',
    category: 'tableware',
    description: 'Handcrafted chawan inspired by Japanese tea ceremony traditions.',
    longDescription: `This ceremonial tea bowl is crafted with deep respect for Japanese tea ceremony traditions. Each piece is individually shaped on the pottery wheel, ensuring unique character and charm. The organic form and hand-carved textures create a meditative quality that enhances your tea-drinking ritual.`,
    price: 2800,
    images: [
      '/Images/products/1.png',
      '/Images/products/1.png',
    ],
    availableColors: [glazeColors.earthBrown, glazeColors.matteWhite],
    features: [
      'Handcrafted on pottery wheel',
      'Inspired by Japanese chawan',
      'Unique texture and form',
      'Perfect for tea ceremonies',
    ],
    dimensions: {
      diameter: '12cm',
      height: '7cm',
      capacity: '250ml',
    },
    materials: ['Stoneware clay', 'Food-safe glaze'],
    careInstructions: [
      'Hand wash recommended',
      'Avoid sudden temperature changes',
      'Pat dry after washing',
      'Store in a dry place',
    ],
    isFoodSafe: true,
    isMicrowaveSafe: true,
    isDishwasherSafe: false,
    isCustomizable: true,
    stock: 12,
    weight: 0.3,
    featured: true,
    relatedProducts: ['sake-set-002', 'matcha-bowl-003'],
  },
  {
    id: 'artisan-dinner-plate-002',
    name: 'Artisan Dinner Plate',
    category: 'tableware',
    description: 'Organic-shaped dinner plate with hand-carved textures.',
    longDescription: `Each Artisan Dinner Plate is a unique piece of functional art. The organic, flowing edges and hand-carved concentric patterns create visual interest while maintaining perfect functionality for everyday dining. The subtle variations in form celebrate the handmade process.`,
    price: 1800,
    images: [
      '/Images/products/3.png',
      '/Images/products/3.png',
      '/Images/products/3.png',
    ],
    availableColors: [
      glazeColors.earthBrown,
      glazeColors.forestGreen,
    ],
    features: [
      'Hand-carved textures',
      'Organic flowing edges',
      'Perfect for daily use',
      'Statement serving piece',
    ],
    dimensions: {
      diameter: '26cm',
      height: '2.5cm',
    },
    materials: ['Stoneware clay', 'Food-safe glaze', 'Natural earth pigments'],
    careInstructions: [
      'Dishwasher safe',
      'Microwave safe',
      'Avoid metal utensils',
      'Stack carefully',
    ],
    isFoodSafe: true,
    isMicrowaveSafe: true,
    isDishwasherSafe: true,
    isCustomizable: true,
    stock: 8,
    weight: 0.6,
    featured: true,
  },
  {
    id: 'ikebana-flower-vase-003',
    name: 'Ikebana Flower Vase',
    category: 'decor',
    description: 'Sculptural vase designed for Japanese flower arrangement.',
    longDescription: `Inspired by the Japanese art of Ikebana, this sculptural vase is designed to showcase the beauty of minimalist flower arrangements. The unique form and organic shape provide multiple placement options for stems, encouraging creativity in your floral displays.`,
    price: 3500,
    images: [
      '/Images/products/2.png',
      '/Images/products/2.png',
    ],
    availableColors: [
      glazeColors.matteWhite,
      glazeColors.oceanBlue,
      glazeColors.stoneGrey,
    ],
    features: [
      'Sculptural design',
      'Multiple stem placement options',
      'Inspired by Ikebana',
      'Statement decor piece',
    ],
    dimensions: {
      height: '18cm',
      diameter: '12cm',
    },
    materials: ['Stoneware clay', 'Glazed interior', 'Matte exterior finish'],
    careInstructions: [
      'Wipe clean with damp cloth',
      'Change water regularly',
      'Handle with care',
    ],
    isFoodSafe: false,
    isMicrowaveSafe: false,
    isDishwasherSafe: false,
    isCustomizable: true,
    stock: 5,
    weight: 0.8,
    featured: true,
  },
  {
    id: 'sake-set-tokkuri-ochoko-004',
    name: 'Sake Set (Tokkuri + 2 Ochoko)',
    category: 'tableware',
    description: 'Traditional sake serving set with bottle and two cups.',
    longDescription: `This traditional sake set includes a tokkuri (sake bottle) and two ochoko (sake cups). Each piece is handcrafted to honor Japanese sake drinking traditions. The set is perfect for intimate gatherings and adds an authentic touch to your sake experience.`,
    price: 4200,
    images: [
      '/Images/products/4.png',
      '/Images/products/4.png',
    ],
    availableColors: [glazeColors.earthBrown],
    features: [
      'Complete sake serving set',
      'Traditional Japanese design',
      'Handcrafted pottery',
      'Perfect for gifting',
    ],
    dimensions: {
      capacity: 'Tokkuri: 300ml, Ochoko: 50ml each',
    },
    materials: ['Stoneware clay', 'Food-safe glaze'],
    careInstructions: [
      'Hand wash recommended',
      'Dry thoroughly',
      'Store upright',
    ],
    isFoodSafe: true,
    isMicrowaveSafe: false,
    isDishwasherSafe: false,
    isCustomizable: false,
    stock: 6,
    weight: 0.7,
    featured: false,
  },
  {
    id: 'matcha-bowl-whisk-rest-005',
    name: 'Matcha Bowl & Whisk Rest',
    category: 'tableware',
    description: 'Complete matcha preparation set with bowl and chasen rest.',
    longDescription: `This complete matcha set includes a traditional matcha bowl and a chasen (whisk) rest. Designed for the authentic matcha tea ceremony experience, each piece combines functionality with aesthetic beauty. The bowl's wide shape allows for proper whisking technique.`,
    price: 3200,
    images: [
      '/Images/products/7.png',
    ],
    availableColors: [glazeColors.forestGreen, glazeColors.oceanBlue],
    features: [
      'Complete matcha set',
      'Traditional bowl shape',
      'Whisk rest included',
      'Ceremonial grade',
    ],
    dimensions: {
      diameter: '13cm',
      height: '8cm',
    },
    materials: ['Stoneware clay', 'Food-safe glaze'],
    careInstructions: [
      'Hand wash only',
      'Dry immediately',
      'Handle chasen rest gently',
    ],
    isFoodSafe: true,
    isMicrowaveSafe: true,
    isDishwasherSafe: false,
    isCustomizable: true,
    stock: 10,
    weight: 0.4,
    featured: false,
  },
  {
    id: 'large-serving-bowl-006',
    name: 'Large Serving Bowl',
    category: 'tableware',
    description: 'Statement serving bowl for family-style dining.',
    longDescription: `This large serving bowl is a centerpiece for family gatherings and dinner parties. The generous size accommodates salads, pasta, or rice dishes, while the handcrafted quality elevates everyday meals into special occasions.`,
    price: 2400,
    images: [
      '/Images/products/6.png',
    ],
    availableColors: [glazeColors.matteWhite, glazeColors.sunsetOrange],
    features: [
      'Large capacity',
      'Family-style serving',
      'Statement piece',
      'Versatile use',
    ],
    dimensions: {
      diameter: '30cm',
      height: '10cm',
    },
    materials: ['Stoneware clay', 'Food-safe glaze'],
    careInstructions: [
      'Dishwasher safe',
      'Microwave safe',
      'Handle with care due to size',
    ],
    isFoodSafe: true,
    isMicrowaveSafe: true,
    isDishwasherSafe: true,
    isCustomizable: true,
    stock: 7,
    weight: 1.2,
    featured: false,
  },
];

// Function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

// Function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};