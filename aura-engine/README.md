# 🚀 Aura Enterprise Engine

> Lightning-fast enterprise inventory management dashboard built for Apex Logistics & Retail Solutions.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Recharts](https://img.shields.io/badge/Recharts-2.x-blue?style=flat-square)

## 📋 Overview

Aura Engine is a modern, data-dense enterprise dashboard designed to handle **50,000+ SKUs** without performance degradation. It replaces legacy SAP/Excel workflows with a responsive, real-time web interface.

## ✨ Key Features

### Enterprise Data Grid
- **Server-Side Pagination** — Only 50 items fetched per page (no DOM crashes)
- **Debounced Omnisearch** — 500ms debounce prevents API flooding
- **Advanced Filters** — Category dropdown, stock level slider, price range inputs
- **Sortable Columns** — Click any header to sort ascending/descending
- **Sticky Headers** — Column headers stay visible during scroll

### Analytics Command Center
- **KPI Summary Cards** — Total SKUs, Inventory Value, Low Stock, Out of Stock
- **Restock Priority Chart** — Top 10 lowest stock items (color-coded bar chart)
- **Portfolio Distribution** — Inventory valuation by category (donut chart)

### Export Module
- **CSV Export** — Download currently filtered data as CSV (client-side Blob)

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Charts | Recharts |
| Styling | Vanilla CSS (CSS Modules) |
| Seeding | Faker.js |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd aura-engine

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Start development server
npm run dev
```

### Seed the Database

Click the **"🌱 Seed Database"** button in the top navigation to populate 50,000 products, or trigger it via API:

```bash
curl -X POST http://localhost:3000/api/seed
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/inventory/      # Paginated inventory endpoint
│   ├── api/analytics/      # Aggregation pipeline endpoint
│   ├── api/seed/           # Database seeder endpoint
│   ├── inventory/          # Inventory data grid page
│   └── page.js             # Dashboard (Command Center)
├── components/
│   ├── dashboard/          # KPI Cards, Charts
│   ├── inventory/          # DataGrid, Filters, Search, Pagination
│   └── layout/             # Sidebar, Navbar, AppShell
├── hooks/                  # Custom React hooks
├── lib/                    # DB connection, constants
└── models/                 # Mongoose schemas
```

## 📡 API Reference

### `GET /api/inventory`
Server-side paginated inventory with search, filters, and sorting.

| Param | Type | Default | Description |
|---|---|---|---|
| page | number | 1 | Page number |
| limit | number | 50 | Items per page |
| search | string | — | Text search |
| category | string | — | Category filter |
| sortBy | string | name | Sort field |
| sortOrder | string | asc | Sort direction |

### `GET /api/analytics`
Aggregated analytics data for the dashboard widgets.

## 📄 License

Proprietary — Prodesk IT © 2026
