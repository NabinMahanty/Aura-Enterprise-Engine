import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { faker } from '@faker-js/faker';
import { CATEGORIES, WAREHOUSES, SUPPLIERS } from '@/lib/constants';

/**
 * Product name prefixes and suffixes per category for realistic data generation.
 */
const PRODUCT_NAMES = {
  Electronics: {
    prefixes: ['Wireless', 'Smart', 'Digital', 'Ultra', 'Pro', 'Premium', 'Compact', 'Portable', 'HD', 'Advanced'],
    items: ['Bluetooth Headphones', 'USB-C Hub', 'LED Monitor', 'Mechanical Keyboard', 'Webcam', 'Speaker', 'Charging Cable', 'Power Bank', 'Mouse', 'Tablet Stand', 'Microphone', 'Router', 'External SSD', 'Graphics Card', 'Smartwatch'],
  },
  Apparel: {
    prefixes: ['Classic', 'Urban', 'Vintage', 'Modern', 'Premium', 'Essential', 'Comfort', 'Athletic', 'Slim-Fit', 'Oversized'],
    items: ['Cotton T-Shirt', 'Denim Jacket', 'Running Shorts', 'Wool Sweater', 'Cargo Pants', 'Polo Shirt', 'Hoodie', 'Dress Shirt', 'Joggers', 'Blazer', 'Windbreaker', 'Vest', 'Beanie', 'Sneakers', 'Rain Coat'],
  },
  'Home & Garden': {
    prefixes: ['Eco-Friendly', 'Bamboo', 'Stainless Steel', 'Ceramic', 'Rustic', 'Modern', 'Handcrafted', 'Organic', 'Solar-Powered', 'Heavy-Duty'],
    items: ['Plant Pot', 'Garden Hose', 'LED String Lights', 'Throw Pillow', 'Wall Clock', 'Candle Set', 'Storage Basket', 'Picture Frame', 'Doormat', 'Curtain Rod', 'Tool Set', 'Compost Bin', 'Bird Feeder', 'Welcome Sign', 'Planter Box'],
  },
  'Sports & Outdoors': {
    prefixes: ['Pro', 'Elite', 'Trail', 'All-Weather', 'Ultra-Light', 'Competition', 'Training', 'Expedition', 'Endurance', 'Tactical'],
    items: ['Yoga Mat', 'Dumbbell Set', 'Running Shoes', 'Camping Tent', 'Hiking Backpack', 'Water Bottle', 'Resistance Bands', 'Jump Rope', 'Cycling Gloves', 'Fishing Rod', 'Skateboard', 'Football', 'Swim Goggles', 'Climbing Harness', 'Kayak Paddle'],
  },
  Automotive: {
    prefixes: ['Performance', 'OEM', 'Universal', 'Heavy-Duty', 'Premium', 'All-Season', 'Custom', 'Racing', 'Professional', 'Industrial'],
    items: ['Floor Mat Set', 'Dash Camera', 'Car Charger', 'Tire Gauge', 'Air Freshener', 'Seat Cover', 'LED Headlight', 'Oil Filter', 'Spark Plug Set', 'Wiper Blades', 'Battery Jumper', 'Phone Mount', 'Trunk Organizer', 'Brake Pads', 'Steering Wheel Cover'],
  },
  'Health & Beauty': {
    prefixes: ['Natural', 'Organic', 'Clinical', 'Luxury', 'Daily', 'Hydrating', 'Anti-Aging', 'Gentle', 'Revitalizing', 'Professional'],
    items: ['Face Moisturizer', 'Shampoo', 'Sunscreen SPF50', 'Lip Balm', 'Hand Cream', 'Essential Oil Set', 'Hair Dryer', 'Electric Toothbrush', 'Vitamin Supplement', 'Body Wash', 'Face Mask Pack', 'Perfume', 'Nail Kit', 'Massage Roller', 'Eye Cream'],
  },
  'Toys & Games': {
    prefixes: ['Interactive', 'Educational', 'Classic', 'Deluxe', 'Collectible', 'Remote Control', 'Buildable', 'Creative', 'Strategy', 'Family'],
    items: ['Board Game', 'Building Blocks Set', 'Puzzle 1000pc', 'Action Figure', 'RC Car', 'Plush Toy', 'Art Kit', 'Card Game', 'Science Kit', 'Drone', 'Chess Set', 'Nerf Blaster', 'Dollhouse', 'Model Train', 'Magic Kit'],
  },
  'Office Supplies': {
    prefixes: ['Executive', 'Ergonomic', 'Eco', 'Professional', 'Budget', 'Deluxe', 'Compact', 'Stackable', 'Premium', 'Multi-Pack'],
    items: ['Notebook Set', 'Ballpoint Pen Pack', 'Desk Organizer', 'File Folders', 'Stapler', 'Whiteboard', 'Paper Shredder', 'Desk Lamp', 'Chair Mat', 'Binder Clips', 'Label Maker', 'Calculator', 'Sticky Notes', 'Ink Cartridges', 'Monitor Stand'],
  },
  'Food & Beverage': {
    prefixes: ['Artisan', 'Organic', 'Fair Trade', 'Premium', 'Gourmet', 'Sugar-Free', 'Gluten-Free', 'Bulk', 'Imported', 'Small-Batch'],
    items: ['Coffee Beans 1lb', 'Green Tea Sampler', 'Protein Bars Box', 'Mixed Nuts Can', 'Olive Oil 500ml', 'Hot Sauce Set', 'Dried Fruit Mix', 'Granola Pack', 'Sparkling Water Case', 'Dark Chocolate Bar', 'Honey Jar', 'Spice Rack Set', 'Pasta Variety Pack', 'Trail Mix', 'Energy Drink Pack'],
  },
  'Industrial & Scientific': {
    prefixes: ['Lab-Grade', 'Industrial', 'Precision', 'Commercial', 'Heavy-Duty', 'Standard', 'Calibrated', 'Professional', 'High-Temp', 'Safety'],
    items: ['Digital Caliper', 'Safety Goggles', 'Nitrile Gloves Box', 'Lab Beaker Set', 'Measuring Tape', 'Soldering Iron', 'Multimeter', 'Work Gloves', 'Drill Bit Set', 'Cable Ties Pack', 'Heat Gun', 'Respirator Mask', 'Fire Extinguisher', 'First Aid Kit', 'Weld Helmet'],
  },
};

/**
 * Generate a single realistic product record.
 */
function generateProduct(index) {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const nameData = PRODUCT_NAMES[category];
  const prefix = faker.helpers.arrayElement(nameData.prefixes);
  const item = faker.helpers.arrayElement(nameData.items);
  const variant = faker.helpers.arrayElement(['', ' V2', ' Pro', ' Max', ' Lite', ' Plus', ' SE', '']);
  const name = `${prefix} ${item}${variant}`.trim();

  // Generate category-appropriate pricing
  const priceRanges = {
    Electronics: [9.99, 499.99],
    Apparel: [12.99, 149.99],
    'Home & Garden': [5.99, 199.99],
    'Sports & Outdoors': [7.99, 299.99],
    Automotive: [4.99, 249.99],
    'Health & Beauty': [3.99, 89.99],
    'Toys & Games': [6.99, 129.99],
    'Office Supplies': [2.99, 79.99],
    'Food & Beverage': [1.99, 49.99],
    'Industrial & Scientific': [8.99, 349.99],
  };

  const [minPrice, maxPrice] = priceRanges[category];
  const price = parseFloat(faker.commerce.price({ min: minPrice, max: maxPrice }));
  const costPrice = parseFloat((price * faker.number.float({ min: 0.35, max: 0.7 })).toFixed(2));

  // Generate realistic stock levels (with intentional low/out-of-stock items)
  let quantity;
  const stockChance = Math.random();
  if (stockChance < 0.03) {
    quantity = 0; // ~3% out of stock
  } else if (stockChance < 0.10) {
    quantity = faker.number.int({ min: 1, max: 20 }); // ~7% low stock
  } else {
    quantity = faker.number.int({ min: 21, max: 5000 }); // 90% normal stock
  }

  const categoryCode = category.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');

  return {
    sku: `APX-${categoryCode}-${String(index).padStart(5, '0')}`,
    name,
    category,
    price,
    costPrice,
    quantity,
    warehouse: faker.helpers.arrayElement(WAREHOUSES),
    supplier: faker.helpers.arrayElement(SUPPLIERS),
    lastRestocked: faker.date.between({
      from: new Date('2024-01-01'),
      to: new Date(),
    }),
  };
}

/**
 * POST /api/seed
 *
 * Seed the database with 50,000 realistic product records.
 * Inserts in batches of 5,000 for memory efficiency.
 */
export async function POST() {
  try {
    await connectDB();

    // Check if already seeded
    const existingCount = await Product.countDocuments();
    if (existingCount >= 50000) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${existingCount} products. Skipping seed.`,
        count: existingCount,
      });
    }

    // Clear existing data for a clean seed
    await Product.deleteMany({});

    const TOTAL_PRODUCTS = 50000;
    const BATCH_SIZE = 5000;
    let inserted = 0;

    for (let batch = 0; batch < TOTAL_PRODUCTS / BATCH_SIZE; batch++) {
      const products = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        const index = batch * BATCH_SIZE + i + 1;
        products.push(generateProduct(index));
      }

      await Product.insertMany(products, { ordered: false });
      inserted += products.length;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted} products.`,
      count: inserted,
    });
  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    );
  }
}
