'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styles from './Chart.module.css';

/**
 * Curated color palette for pie chart segments.
 */
const COLORS = [
  'hsl(220, 90%, 56%)',   // Blue
  'hsl(262, 83%, 62%)',   // Purple
  'hsl(142, 71%, 45%)',   // Green
  'hsl(38, 92%, 50%)',    // Amber
  'hsl(0, 84%, 60%)',     // Red
  'hsl(199, 89%, 48%)',   // Cyan
  'hsl(330, 80%, 60%)',   // Pink
  'hsl(160, 60%, 45%)',   // Teal
  'hsl(45, 93%, 47%)',    // Gold
  'hsl(280, 65%, 55%)',   // Violet
];

/**
 * Format currency for tooltip.
 */
function formatCurrency(value) {
  if (value >= 1000000) return '$' + (value / 1000000).toFixed(2) + 'M';
  if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'K';
  return '$' + value.toFixed(2);
}

/**
 * Custom tooltip for the pie chart.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const total = item.totalValue || 1;
  const percentage = ((item.value / total) * 100).toFixed(1);

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
        {item.category}
      </p>
      <p style={{ fontSize: '0.875rem', color: payload[0].color, fontWeight: 700 }}>
        {formatCurrency(item.value)} ({percentage}%)
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'hsl(215,20%,65%)' }}>
        {item.count.toLocaleString()} SKUs · Avg ${item.avgPrice?.toFixed(2)}
      </p>
    </div>
  );
}

/**
 * Custom legend renderer.
 */
function CustomLegend({ payload }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 16px',
        justifyContent: 'center',
        paddingTop: '16px',
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'hsl(215, 20%, 72%)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: entry.color,
              flexShrink: 0,
            }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

/**
 * CategoryPieChart Component
 *
 * Donut/Pie chart showing inventory valuation breakdown by category.
 * Displays percentage distribution and absolute values on hover.
 */
export default function CategoryPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className={styles.skeletonChart}>
        <div className={`${styles.skeletonHeader} skeleton`} />
        <div className={`${styles.skeletonBody} skeleton`} />
      </div>
    );
  }

  const chartData = data?.categoryBreakdown || [];
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Add totalValue to each item for percentage calculation in tooltip
  const enrichedData = chartData.map((item) => ({
    ...item,
    totalValue,
  }));

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Portfolio Distribution</h3>
            <p className={styles.chartSubtitle}>Valuation by category</p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>EMPTY</span>
          <p>No data available. Seed the database first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer} id="category-pie-chart">
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Portfolio Distribution</h3>
          <p className={styles.chartSubtitle}>
            Inventory valuation by category · {formatCurrency(totalValue)} total
          </p>
        </div>
      </div>

      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enrichedData}
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
              nameKey="category"
              animationBegin={200}
              animationDuration={800}
            >
              {enrichedData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="hsl(222, 47%, 11%)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
