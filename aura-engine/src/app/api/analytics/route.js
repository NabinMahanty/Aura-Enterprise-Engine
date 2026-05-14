import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * GET /api/analytics
 *
 * Aggregation pipeline endpoint providing:
 * - Total SKU count
 * - Total inventory valuation (price * quantity)
 * - Out of stock count
 * - Low stock count
 * - Top 10 lowest stock products (Restock Priority)
 * - Category-wise inventory valuation breakdown
 */
export async function GET() {
  try {
    await connectDB();

    // Run all aggregations in parallel for maximum performance
    const [
      totalSKUs,
      valuationResult,
      outOfStockCount,
      lowStockCount,
      restockPriority,
      categoryBreakdown,
    ] = await Promise.all([
      // Total distinct SKUs
      Product.countDocuments(),

      // Total inventory valuation: SUM(price * quantity)
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
            totalCost: { $sum: { $multiply: ['$costPrice', '$quantity'] } },
          },
        },
      ]),

      // Out of stock items (quantity === 0)
      Product.countDocuments({ quantity: 0 }),

      // Low stock items (quantity > 0 && quantity <= 20)
      Product.countDocuments({ quantity: { $gt: 0, $lte: 20 } }),

      // Top 10 products with lowest stock (excluding 0 - those are out of stock)
      Product.find({ quantity: { $gt: 0 } })
        .sort({ quantity: 1 })
        .limit(10)
        .select('name sku category quantity price warehouse')
        .lean(),

      // Category breakdown: valuation and count per category
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            value: { $sum: { $multiply: ['$price', '$quantity'] } },
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            totalQuantity: { $sum: '$quantity' },
          },
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            value: { $round: ['$value', 2] },
            count: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            totalQuantity: 1,
          },
        },
        { $sort: { value: -1 } },
      ]),
    ]);

    const totalValue = valuationResult[0]?.totalValue || 0;
    const totalCost = valuationResult[0]?.totalCost || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalSKUs,
        totalValue: Math.round(totalValue * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        outOfStock: outOfStockCount,
        lowStock: lowStockCount,
        restockPriority,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
