'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

/**
 * Page titles mapped to pathnames.
 */
const PAGE_TITLES = {
  '/': { title: 'Command Center', subtitle: 'Analytics Overview' },
  '/inventory': { title: 'Inventory Manager', subtitle: 'Data Grid' },
};

/**
 * Navbar Component
 *
 * Top navigation bar with:
 * - Dynamic page titles based on route
 * - Database seed button (one-click 50K product seeding)
 * - Connection status indicator
 * - Mobile hamburger toggle
 */
export default function Navbar({ collapsed, onMobileToggle }) {
  const pathname = usePathname();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const pageInfo = PAGE_TITLES[pathname] || PAGE_TITLES['/'];

  const handleSeed = async () => {
    if (seeding) return;

    setSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const result = await response.json();

      if (result.success) {
        setSeedResult({ type: 'success', message: result.message });
        // Reload page to refresh data
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSeedResult({ type: 'error', message: result.error });
      }
    } catch (error) {
      setSeedResult({ type: 'error', message: 'Failed to seed database' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header
      className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}
      role="banner"
    >
      <div className={styles.navLeft}>
        <button
          className={styles.hamburger}
          onClick={onMobileToggle}
          aria-label="Toggle navigation menu"
        >
          MENU
        </button>
        <div>
          <h1 className={styles.pageTitle}>
            {pageInfo.title}
            <span className={styles.pageSubtitle}>{pageInfo.subtitle}</span>
          </h1>
        </div>
      </div>

      <div className={styles.navRight}>
        <button
          className={`${styles.seedBtn} ${seeding ? styles.seeding : ''}`}
          onClick={handleSeed}
          disabled={seeding}
          title="Seed database with 50,000 products"
        >
          <span>{seeding ? 'Seeding...' : seedResult ? seedResult.message : 'Seed Database'}</span>
        </button>

        <div className={styles.statusDot} title="Database connected" />
        <span className={styles.statusText}>Online</span>

        <div className={styles.avatar} title="Jonathan Hayes">
          JH
        </div>
      </div>
    </header>
  );
}
