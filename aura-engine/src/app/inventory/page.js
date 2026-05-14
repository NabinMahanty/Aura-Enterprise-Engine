'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useInventory } from '@/hooks/useInventory';
import SearchBar from '@/components/inventory/SearchBar';
import FilterPanel from '@/components/inventory/FilterPanel';
import DataGrid from '@/components/inventory/DataGrid';
import Pagination from '@/components/inventory/Pagination';
import ExportButton from '@/components/inventory/ExportButton';
import styles from './inventory.module.css';

/**
 * Inventory Content
 */
function InventoryContent() {
  const searchParams = useSearchParams();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minStock: '',
    maxStock: searchParams.get('status') === 'Low Stock' ? '20' : '',
    minPrice: '',
    maxPrice: '',
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // Sort state
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Build query params for the hook
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      category: filters.category,
      minStock: filters.minStock,
      maxStock: filters.maxStock,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy,
      sortOrder,
    }),
    [page, limit, debouncedSearch, filters, sortBy, sortOrder]
  );

  const { data, pagination, loading, error, refetch } = useInventory(queryParams);

  // Reset to page 1 when filters/search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minStock: '',
      maxStock: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchTerm('');
    setPage(1);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top of table on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className={styles.inventoryPage}>
      {/* Header */}
      <div className={styles.inventoryHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.inventoryTitle}>
            <span className="gradient-text">Inventory Manager</span>
          </h1>
          <p className={styles.inventorySubtitle}>
            Browse, search, and filter across{' '}
            {pagination.totalItems?.toLocaleString() || '—'} products
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.toggleFiltersBtn} ${
              showFilters ? styles.active : ''
            }`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <ExportButton data={data} totalItems={pagination.totalItems} filters={{ search: debouncedSearch, ...filters }} />
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.controlsBar}>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          debouncedValue={debouncedSearch}
        />
      </div>

      {/* Filter Panel (collapsible) */}
      {showFilters && (
        <div className={styles.filterSection}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      {/* Data Grid */}
      <div className={styles.tableSection}>
        <DataGrid
          data={data}
          loading={loading}
          error={error}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRetry={refetch}
        />
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}

/**
 * Inventory Page
 *
 * Enterprise data grid page with:
 * - Debounced omnisearch (500ms)
 * - Server-side pagination (50 items/page)
 * - Advanced column filters (category, stock, price)
 * - Sortable columns
 * - CSV export of filtered data
 */
export default function InventoryPage() {
  return (
    <Suspense fallback={<div className={styles.inventoryPage}><div className="skeleton" style={{ width: '100%', height: '500px', borderRadius: '8px' }}></div></div>}>
      <InventoryContent />
    </Suspense>
  );
}
