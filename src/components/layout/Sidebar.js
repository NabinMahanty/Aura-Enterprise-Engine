'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

/**
 * Navigation items for the sidebar.
 * Each item has an icon (emoji for simplicity), label, and href.
 */
const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      {  label: 'Dashboard', href: '/' },
      {  label: 'Inventory', href: '/inventory' },
    ],
  },
  {
    section: 'Management',
    items: [
      {  label: 'Low Stock Alerts', href: '/inventory?status=Low+Stock' },
      {  label: 'Out of Stock', href: '/inventory?status=Out+of+Stock' },
    ],
  },
];

/**
 * Sidebar Component
 *
 * Collapsible sidebar navigation with:
 * - Active route highlighting
 * - Grouped navigation sections
 * - Mobile responsive overlay
 * - Collapse/expand toggle
 */
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.visible : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${
          mobileOpen ? styles.mobileOpen : ''
        }`}
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Logo Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>A</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Aura Engine</span>
            <span className={styles.logoSubtitle}>Inventory Suite</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navSection}>
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className={styles.navLabel}>{section.section}</div>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${
                        isActive(item.href) ? styles.active : ''
                      }`}
                      onClick={onMobileClose}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navText}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          className={styles.collapseBtn}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={styles.collapseIcon}>
            {collapsed ? '▶' : '◀'}
          </span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
