'use client';

import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

/**
 * SearchBar Component
 *
 * Omnisearch input with:
 * - Visual debounce indicator (shows "Searching..." while waiting)
 * - Clear button
 * - Focus highlight
 *
 * Note: Actual debouncing is handled by the parent via useDebounce hook.
 * This component reports raw input value immediately.
 */
export default function SearchBar({ value, onChange, debouncedValue }) {
  const isDebouncing = value !== debouncedValue && value.length > 0;

  return (
    <div className={styles.searchContainer}>
      <input
        id="omnisearch"
        type="text"
        className={styles.searchInput}
        placeholder="Search by product name, SKU, or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search inventory"
        autoComplete="off"
      />

      {value && !isDebouncing && (
        <button
          className={styles.clearBtn}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          CLEAR
        </button>
      )}

      {isDebouncing && (
        <span className={styles.debounceHint}>Searching...</span>
      )}
    </div>
  );
}
