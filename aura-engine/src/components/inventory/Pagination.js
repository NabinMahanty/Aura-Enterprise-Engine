'use client';

import styles from './Pagination.module.css';

/**
 * Generate page numbers for pagination display.
 * Shows first page, last page, current, and 2 surrounding pages with ellipsis.
 */
function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const delta = 2;

  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (start > 2) {
    pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Pagination Component
 *
 * Server-side pagination controls with:
 * - Page number buttons with ellipsis
 * - Previous/Next navigation
 * - Items per page selector
 * - "Showing X to Y of Z" info
 */
export default function Pagination({ pagination, onPageChange, onLimitChange }) {
  const { page, limit, totalItems, totalPages } = pagination;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className={styles.pagination} id="pagination-controls">
      <div className={styles.pageInfo}>
        Showing{' '}
        <span className={styles.pageInfoHighlight}>{start}</span>
        {' — '}
        <span className={styles.pageInfoHighlight}>{end}</span>
        {' of '}
        <span className={styles.pageInfoHighlight}>
          {totalItems.toLocaleString()}
        </span>{' '}
        products
      </div>

      <div className={styles.pageControls}>
        {/* Previous */}
        <button
          className={`${styles.pageBtn} ${styles.navBtn}`}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ⋯
            </span>
          ) : (
            <button
              key={pageNum}
              className={`${styles.pageBtn} ${
                pageNum === page ? styles.active : ''
              }`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={`${styles.pageBtn} ${styles.navBtn}`}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <div className={styles.perPage}>
        <label className={styles.perPageLabel} htmlFor="per-page-select">
          Per page:
        </label>
        <select
          id="per-page-select"
          className={styles.perPageSelect}
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}
