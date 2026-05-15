'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import KPICards from '@/components/dashboard/KPICards';
import RestockChart from '@/components/dashboard/RestockChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import styles from './dashboard.module.css';

/**
 * Dashboard Page — Command Center
 *
 * The executive overview page showing:
 * - KPI Summary Cards (Total SKUs, Value, Low Stock, Out of Stock)
 * - Restock Priority Bar Chart (Top 10 lowest stock items)
 * - Portfolio Distribution Pie Chart (Valuation by category)
 */
export default function DashboardPage() {
  const { data, loading, error } = useAnalytics();

  return (
    <div className={styles.dashboardPage}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <p className={styles.welcomeText}>Welcome back, Jonathan</p>
        <h1 className={styles.dashboardTitle}>
          <span className="gradient-text">Command Center</span>
        </h1>
        <p className={styles.dashboardSubtitle}>
          Real-time analytics and operational intelligence across all Midwest
          warehouses. Monitor inventory health, identify restocking priorities,
          and track portfolio distribution.
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards data={data} loading={loading} />

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <RestockChart data={data} loading={loading} />
        <CategoryPieChart data={data} loading={loading} />
      </div>

      {/* Timestamp */}
      <p className={styles.timestamp}>
        Last updated: {new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </p>
    </div>
  );
}
