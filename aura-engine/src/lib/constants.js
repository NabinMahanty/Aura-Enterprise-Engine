/**
 * Product categories for Apex Logistics inventory.
 * Used for filtering, seeding, and validation.
 */
export const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Sports & Outdoors',
  'Automotive',
  'Health & Beauty',
  'Toys & Games',
  'Office Supplies',
  'Food & Beverage',
  'Industrial & Scientific',
];

/**
 * Warehouse locations across the Midwest.
 */
export const WAREHOUSES = [
  'Chicago-W1',
  'Chicago-W2',
  'Milwaukee-W3',
  'Indianapolis-W4',
  'Detroit-W5',
  'Columbus-W6',
  'Minneapolis-W7',
  'St. Louis-W8',
];

/**
 * Supplier names for seeding.
 */
export const SUPPLIERS = [
  'TechDistro Inc.',
  'Midwest Supply Co.',
  'Great Lakes Trading',
  'Prairie Wholesale',
  'Heartland Distributors',
  'Lakefront Logistics',
  'Central States Imports',
  'Tri-State Supplies',
  'Metro Merchandising',
  'Continental Goods LLC',
];

/**
 * Default pagination settings.
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};

/**
 * Stock level thresholds for status computation.
 */
export const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK: 20,
};
