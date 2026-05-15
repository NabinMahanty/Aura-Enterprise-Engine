'use client';

import styles from './KPICards.module.css';

/**
 * Format large numbers with commas and dollar signs.
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '—';
  return num.toLocaleString('en-US');
}

function formatCurrency(num) {
  if (num === undefined || num === null) return '—';
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return '$' + (num / 1000).toFixed(1) + 'K';
  }
  return '$' + num.toFixed(2);
}

/**
 * KPICards Component
 *
 * Displays 4 key performance indicator cards:
 * 1. Total SKUs (primary)
 * 2. Total Inventory Value (success/green)
 * 3. Low Stock Items (warning/amber)
 * 4. Out of Stock Items (danger/red)
 *
 * Shows skeleton loaders when data is being fetched.
 */
export default function KPICards({ data, loading }) {
  if (loading) {
    return (
      <div className={styles.cardsGrid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={`${styles.skeletonIcon} skeleton`} />
            <div className={`${styles.skeletonValue} skeleton`} />
            <div className={`${styles.skeletonLabel} skeleton`} />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total SKUs',
      value: formatNumber(data?.totalSKUs),
      variant: 'primary',
      trend: null,
    },
    {
      label: 'Total Inventory Value',
      value: formatCurrency(data?.totalValue),
      variant: 'success',
      trend: null,
    },
    {
      label: 'Low Stock Items',
      value: formatNumber(data?.lowStock),
      variant: 'warning',
      trend: data?.lowStock > 1000 ? 'up' : null,
    },
    {
      label: 'Out of Stock',
      value: formatNumber(data?.outOfStock),
      variant: 'danger',
      trend: null,
    },
  ];

  return (
    <div className={styles.cardsGrid} id="kpi-cards">
      {cards.map((card) => (
        <div key={card.label} className={`${styles.card} ${styles[card.variant]}`}>
          <div className={styles.cardHeader}>
            {card.trend && (
              <span
                className={`${styles.cardTrend} ${
                  card.trend === 'up' ? styles.trendUp : styles.trendDown
                }`}
              >
                {card.trend === 'up' ? '↑' : '↓'} Alert
              </span>
            )}
          </div>
          <div className={styles.cardValue}>{card.value}</div>
          <div className={styles.cardLabel}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
