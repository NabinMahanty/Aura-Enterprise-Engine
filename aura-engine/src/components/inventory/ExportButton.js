'use client';

import styles from './ExportButton.module.css';

/**
 * Convert product data to CSV format.
 */
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = [
    'SKU',
    'Name',
    'Category',
    'Price',
    'Cost Price',
    'Quantity',
    'Status',
    'Warehouse',
    'Supplier',
    'Last Restocked',
  ];

  const rows = data.map((product) => [
    product.sku || '',
    `"${(product.name || '').replace(/"/g, '""')}"`,
    product.category || '',
    product.price ? product.price.toFixed(2) : '0.00',
    product.costPrice ? product.costPrice.toFixed(2) : '0.00',
    product.quantity || 0,
    product.status || '',
    product.warehouse || '',
    product.supplier || '',
    product.lastRestocked ? new Date(product.lastRestocked).toLocaleDateString('en-US') : '',
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * ExportButton Component
 *
 * Exports the currently filtered/displayed table data as a CSV file.
 * Uses the Blob API for client-side file generation — no server round-trip needed.
 */
export default function ExportButton({ data, totalItems, filters }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // Include filter context in filename
    const filterParts = [];
    if (filters?.search) filterParts.push(`search-${filters.search}`);
    if (filters?.category) filterParts.push(filters.category);
    const filterSuffix = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';

    link.download = `aura-inventory${filterSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Delay revocation to ensure browser has time to start download
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <button
      className={styles.exportBtn}
      onClick={handleExport}
      disabled={!data || data.length === 0}
      title={`Export ${data?.length || 0} rows to CSV`}
      id="export-csv-btn"
    >
      <span>Export CSV</span>
      {data && data.length > 0 && (
        <span className={styles.exportCount}>{data.length}</span>
      )}
    </button>
  );
}
