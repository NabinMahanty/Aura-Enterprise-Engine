import mongoose from 'mongoose';
import { CATEGORIES, WAREHOUSES, STOCK_THRESHOLDS } from '@/lib/constants';

const ProductSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    warehouse: {
      type: String,
      required: true,
      enum: WAREHOUSES,
    },
    supplier: {
      type: String,
      required: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual: Compute stock status based on quantity thresholds.
 */
ProductSchema.virtual('status').get(function () {
  if (this.quantity <= STOCK_THRESHOLDS.OUT_OF_STOCK) return 'Out of Stock';
  if (this.quantity <= STOCK_THRESHOLDS.LOW_STOCK) return 'Low Stock';
  return 'In Stock';
});

/**
 * Text index for omnisearch across name, SKU, and category fields.
 */
ProductSchema.index({ name: 'text', sku: 'text', category: 'text' });

/**
 * Compound indexes for optimized filtered queries.
 */
ProductSchema.index({ category: 1, quantity: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ quantity: 1 });

/**
 * Prevent model recompilation during HMR in development.
 */
export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
