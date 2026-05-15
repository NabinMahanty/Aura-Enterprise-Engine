'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * AppShell Component
 *
 * Root layout wrapper that manages:
 * - Sidebar collapse state
 * - Mobile sidebar toggle
 * - Content area margins
 */
export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Navbar
        collapsed={collapsed}
        onMobileToggle={() => setMobileOpen((prev) => !prev)}
      />
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}
