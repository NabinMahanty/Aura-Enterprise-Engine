'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from './Chart.module.css';

/**
 * Custom tooltip for the restock bar chart.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  return (
    <div
      style={{
        background: 'hsl(223, 39%, 14%)',
        border: '1px solid hsl(223, 25%, 25%)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px hsla(0,0%,0%,0.4)',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4, color: 'hsl(210,40%,96%)' }}>
        {item.name}
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'hsl(215,20%,65%)' }}>
        SKU: {item.sku}
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'hsl(215,20%,65%)' }}>
        Category: {item.category}
      </p>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: item.quantity <= 5 ? 'hsl(0,84%,60%)' : 'hsl(38,92%,50%)',
          marginTop: 4,
        }}
      >
        Stock: {item.quantity} units
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'hsl(215,20%,65%)' }}>
        Warehouse: {item.warehouse}
      </p>
    </div>
  );
}

/**
 * RestockChart Component
 *
 * Bar chart showing the Top 10 products with the lowest stock levels.
 * Color-coded: red for critical (≤5), amber for low (≤20).
 */
export default function RestockChart({ data, loading }) {
  if (loading) {
    return (
      <div className={styles.skeletonChart}>
        <div className={`${styles.skeletonHeader} skeleton`} />
        <div className={`${styles.skeletonBody} skeleton`} />
      </div>
    );
  }

  const chartData = data?.restockPriority || [];

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Restock Priority</h3>
            <p className={styles.chartSubtitle}>Top 10 lowest stock items</p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>EMPTY</span>
          <p>No data available. Seed the database first.</p>
        </div>
      </div>
    );
  }

  // Truncate long names for chart labels
  const formattedData = chartData.map((item) => ({
    ...item,
    shortName: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
  }));

  return (
    <div className={styles.chartContainer} id="restock-chart">
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Restock Priority</h3>
          <p className={styles.chartSubtitle}>
            Top 10 products requiring immediate restocking
          </p>
        </div>
        <span className={styles.chartBadge}>
          {chartData.length} items critical
        </span>
      </div>

      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(223, 25%, 20%)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(223, 25%, 22%)' }}
            />
            <YAxis
              dataKey="shortName"
              type="category"
              width={160}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(223, 25%, 22%)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(220, 90%, 56%, 0.05)' }} />
            <Bar dataKey="quantity" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {formattedData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.quantity <= 5
                      ? 'hsl(0, 84%, 60%)'
                      : entry.quantity <= 10
                      ? 'hsl(25, 95%, 53%)'
                      : 'hsl(38, 92%, 50%)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
