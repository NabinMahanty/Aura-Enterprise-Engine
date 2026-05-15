'use client';

import { useState, useEffect } from 'react';

/**
 * useAnalytics Hook
 *
 * Fetches aggregated analytics data from the API.
 * Returns KPI metrics, restock priority list, and category breakdown.
 */
export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { data, loading, error };
}
