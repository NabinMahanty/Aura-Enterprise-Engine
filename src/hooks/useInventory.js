'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useInventory Hook
 *
 * Manages inventory data fetching with:
 * - Server-side pagination
 * - Debounced search
 * - Column filters (category, stock range, price range)
 * - Sortable columns
 *
 * @param {Object} params - Query parameters
 * @returns {Object} Inventory data, pagination info, loading state, and controls
 */
export function useInventory(params = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async (queryParams) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value);
        }
      });

      const response = await fetch(`/api/inventory?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory(params);
  }, [
    params.page,
    params.limit,
    params.search,
    params.category,
    params.minStock,
    params.maxStock,
    params.minPrice,
    params.maxPrice,
    params.sortBy,
    params.sortOrder,
    fetchInventory,
  ]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: () => fetchInventory(params),
  };
}
