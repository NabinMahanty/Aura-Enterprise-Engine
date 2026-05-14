'use client';

import styles from './DataGrid.module.css';

/**
 * Table column definitions with sort keys and formatters.
 */
const COLUMNS = [
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'quantity', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'warehouse', label: 'Warehouse', sortable: false },
  { key: 'lastRestocked', label: 'Last Restocked', sortable: true },
];

/**
 * Get status badge styling based on stock status.
 */
function getStatusClass(status) {
  switch (status) {
    case 'In Stock':
      return styles.statusInStock;
    case 'Low Stock':
      return styles.statusLowStock;
    case 'Out of Stock':
      return styles.statusOutOfStock;
    default:
      return '';
  }
}

/**
 * DataGrid Component
 *
 * Enterprise data table with:
 * - Sticky headers (CSS position: sticky)
 * - Sortable columns (click header to toggle asc/desc)
 * - Status badges with color coding
 * - Skeleton loading state
 * - Empty and error states
 * - Horizontal scroll on narrow viewports
 */
export default function DataGrid({
  data,
  loading,
  error,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
}) {
  const handleSort = (key) => {
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const getSortIndicator = (key) => {
    if (sortBy !== key) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Error state
  if (error) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.errorState}>
          <h3 className={styles.errorTitle}>Failed to load data</h3>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Skeleton loading
  if (loading && (!data || data.length === 0)) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className={styles.skeletonRow}>
                  {COLUMNS.map((col) => (
                    <td key={col.key}>
                      <div
                        className={`${styles.skeletonCell} skeleton ${
                          col.key === 'name'
                            ? styles.wide
                            : col.key === 'sku'
                            ? styles.medium
                            : styles.narrow
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No products found</h3>
          <p className={styles.emptyText}>
            Try adjusting your search or filter criteria, or seed the database
            with sample data using the button in the top navigation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.gridWrapper} ${loading ? styles.loadingOverlay : ''}`}>
      <div className={styles.tableContainer}>
        <table className={styles.table} id="inventory-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? styles.sortableHeader : ''}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    sortBy === col.key
                      ? sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className={styles.headerContent}>
                    {col.label}
                    {col.sortable && (
                      <span
                        className={`${styles.sortIcon} ${
                          sortBy === col.key ? styles.active : ''
                        }`}
                      >
                        {getSortIndicator(col.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product._id || product.sku}>
                <td className={styles.skuCell}>{product.sku}</td>
                <td className={styles.nameCell} title={product.name}>
                  {product.name}
                </td>
                <td>
                  <span className={styles.categoryBadge}>
                    {product.category}
                  </span>
                </td>
                <td className={styles.priceCell}>
                  ${product.price.toFixed(2)}
                </td>
                <td className={styles.quantityCell}>
                  {product.quantity.toLocaleString()}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      product.status
                    )}`}
                  >
                    <span className={styles.statusDot} />
                    {product.status}
                  </span>
                </td>
                <td className={styles.warehouseCell}>{product.warehouse}</td>
                <td className={styles.warehouseCell}>
                  {new Date(product.lastRestocked).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
