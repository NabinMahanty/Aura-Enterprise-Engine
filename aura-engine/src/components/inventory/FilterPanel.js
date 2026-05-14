'use client';

import { CATEGORIES } from '@/lib/constants';
import styles from './FilterPanel.module.css';

/**
 * FilterPanel Component
 *
 * Advanced column-specific filters:
 * - Category: Dropdown select from predefined categories
 * - Stock Level: Range slider (0 to max)
 * - Price Range: Min/Max number inputs
 * - Clear all filters button
 */
export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const activeCount = Object.values(filters).filter(
    (v) => v !== '' && v !== undefined && v !== null
  ).length;

  return (
    <div className={styles.filterPanel} id="filter-panel">
      {/* Category Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          className={styles.filterSelect}
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Level Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-stock">
          Max Stock Level
        </label>
        <div className={styles.rangeGroup}>
          <input
            id="filter-stock"
            type="range"
            className={styles.stockSlider}
            min="0"
            max="500"
            step="5"
            value={filters.maxStock || 500}
            onChange={(e) =>
              onFilterChange(
                'maxStock',
                e.target.value === '500' ? '' : e.target.value
              )
            }
          />
          <span className={styles.stockValue}>
            {filters.maxStock || '∞'}
          </span>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Price Range ($)</label>
        <div className={styles.rangeGroup}>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            min="0"
            step="0.01"
            aria-label="Minimum price"
          />
          <span className={styles.rangeSeparator}>—</span>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            min="0"
            step="0.01"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Active Filters Count & Clear */}
      {activeCount > 0 && (
        <>
          <div className={styles.activeFilters}>
            <span className={styles.filterCount}>{activeCount}</span>
            <span>active</span>
          </div>
          <button
            className={styles.clearFiltersBtn}
            onClick={onClearFilters}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </>
      )}
    </div>
  );
}
