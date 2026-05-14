import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { PAGINATION } from '@/lib/constants';

/**
 * GET /api/inventory
 *
 * Server-side paginated, filtered, sorted, and searchable inventory endpoint.
 * Supports: pagination, text search, category filter, stock range, price range, sorting.
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    // Search
    const search = searchParams.get('search')?.trim();

    // Filters
    const category = searchParams.get('category')?.trim();
    const minStock = searchParams.get('minStock');
    const maxStock = searchParams.get('maxStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status')?.trim();

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    // Build query filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minStock || maxStock) {
      filter.quantity = {};
      if (minStock) filter.quantity.$gte = parseInt(minStock);
      if (maxStock) filter.quantity.$lte = parseInt(maxStock);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (status) {
      if (status === 'Out of Stock') {
        filter.quantity = { ...filter.quantity, $eq: 0 };
      } else if (status === 'Low Stock') {
        filter.quantity = { ...filter.quantity, $gt: 0, $lte: 20 };
      } else if (status === 'In Stock') {
        filter.quantity = { ...filter.quantity, $gt: 20 };
      }
    }

    // Build sort object
    const allowedSortFields = ['name', 'price', 'quantity', 'category', 'sku', 'lastRestocked'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sort = { [sortField]: sortOrder };

    // Execute query with pagination
    const [products, totalItems] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Add virtual status field to lean results
    const productsWithStatus = products.map((product) => ({
      ...product,
      status:
        product.quantity <= 0
          ? 'Out of Stock'
          : product.quantity <= 20
          ? 'Low Stock'
          : 'In Stock',
    }));

    return NextResponse.json({
      success: true,
      data: productsWithStatus,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error('Inventory API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory data' },
      { status: 500 }
    );
  }
}
