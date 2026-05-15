# Aura Enterprise Engine

**Aura Enterprise Engine** (part of the Apex Enterprise Inventory system) is a high-performance, enterprise-grade inventory management and analytics platform. Built with a focus on speed, data density, and efficiency, it features a unique brutalist, high-contrast, text-first design system tailored to minimize visual distractions and maximize operational throughput.

## 🚀 Key Features

### 1. Advanced Analytics & Valuation
- **Real-Time Computation:** Computes total inventory valuation dynamically (price × quantity) using powerful MongoDB aggregation pipelines.
- **Categorical Breakdown:** Aggregates stock levels and valuation by product category.
- **Restock Priority:** Automatically identifies items low in stock and prioritizes them for restocking.

### 2. Optimized Search & Filtering
- **Debounced Input:** Implements a custom 500ms debounced search hook to prevent API flooding while typing.
- **Instant Filtering:** Allows users to filter products by category or stock status seamlessly.

### 3. High-Performance Data Handling
- **Server-Side Pagination:** Efficient handling of massive datasets (tested with 50,000+ records) utilizing concurrent `skip()`, `limit()`, and `countDocuments()` execution.
- **Client-Side CSV Export:** Zero-latency data exports generated directly in the browser via the native Blob API (`text/csv`), eliminating unnecessary server round-trips.

### 4. Enterprise-Grade Design System
- **Brutalist Aesthetics:** A high-contrast, black-and-white minimalist UI that relies almost entirely on typography and strict layouts, prioritizing information over decoration.
- **Data-Dense Tables:** Optimized for viewing large amounts of inventory data at once on wide enterprise monitors.

## 🛠 Technology Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Next.js Server Components, Next.js API Routes, Node.js
- **Database:** MongoDB Atlas, Mongoose ODM
- **Utilities:** Faker.js (for data seeding)

## 📁 Project Structure

```text
aura-engine/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── api/              # Backend API routes (inventory, analytics)
│   ├── layout.tsx        # Root layout with global styles and providers
│   └── page.tsx          # Main dashboard view
├── components/           # Reusable React components
│   ├── ui/               # Core UI elements (buttons, inputs, skeleton loaders)
│   └── dashboard/        # Complex dashboard widgets (tables, analytics cards)
├── lib/                  # Utility functions and database connection
│   └── db.js             # Mongoose connection logic
├── models/               # Mongoose schemas (e.g., InventoryItem)
├── public/               # Static assets
└── styles/               # Global CSS and Tailwind configurations
```

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster (or local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aura-engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory. You will need to define the following variables:
   ```env
   # The connection string for your MongoDB database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aura_engine?retryWrites=true&w=majority
   
   # Base URL for the application (useful for absolute API calls)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Seed the Database (Optional):**
   To populate the database with realistic test data (up to 50,000 records), run the seed script:
   ```bash
   npm run seed
   ```
   *Note: Data is inserted in batches of 5,000 to prevent database timeout errors.*

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Reference

### `GET /api/inventory`
Retrieves paginated inventory items with optional search and sorting parameters.

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | integer | `1` | Page number for pagination |
| `limit` | integer | `10` | Number of items per page |
| `search` | string | `""` | Search query for item names or SKUs |
| `category`| string | `""` | Filter items by specific category |
| `sortOrder` | string | `asc` | Sort direction (`asc` or `desc`) |

**Example Response:**
```json
{
  "data": [
    {
      "_id": "60d5ecb8b392d7... ",
      "name": "Enterprise Server Rack",
      "sku": "SRV-RACK-001",
      "category": "Hardware",
      "price": 1200.00,
      "quantity": 15
    }
  ],
  "pagination": {
    "total": 50000,
    "page": 1,
    "limit": 10,
    "totalPages": 5000
  }
}
```

### `GET /api/analytics`
Retrieves aggregated analytics data (valuation, category breakdowns, restock priority) for the dashboard widgets.

**Example Response:**
```json
{
  "totalValuation": 1250000,
  "totalItems": 50000,
  "lowStockAlerts": 120,
  "categoryBreakdown": [
    { "_id": "Electronics", "count": 15000, "valuation": 500000 },
    { "_id": "Hardware", "count": 35000, "valuation": 750000 }
  ]
}
```

## 📄 License

Proprietary — Prodesk IT © 2026
