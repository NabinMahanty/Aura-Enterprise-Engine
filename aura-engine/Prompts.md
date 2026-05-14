# Prompts.md — AI Transparency Log

## Project: Aura Enterprise Engine
### Author: Nabin Mahanty | Prodesk IT

---

## AI Usage Documentation

This document transparently records all AI-assisted development for this project.

### 1. Architecture & Planning
**Tool Used:** AI Coding Assistant  
**Purpose:** Initial project architecture design, folder structure planning, and technology stack decisions.  
**What I Learned:** Chose Next.js App Router over Pages Router for better server component support and API route organization. Selected MongoDB Atlas with Mongoose for its aggregation pipeline capabilities needed for analytics.

### 2. MongoDB Aggregation Pipeline
**Tool Used:** AI Coding Assistant  
**Purpose:** Designing the aggregation pipeline for the analytics API endpoint.  
**Prompt Context:** Needed to compute total inventory valuation (price × quantity), category-wise breakdown, and restock priority in a single API call.  
**What I Learned:** Running multiple aggregation queries with `Promise.all()` is more efficient than a single complex pipeline. The `$group` stage with `$multiply` handles valuation computation elegantly.

### 3. Debounced Search Hook
**Tool Used:** AI Coding Assistant  
**Purpose:** Implementing a React hook for 500ms debounced search to prevent API flooding.  
**What I Learned:** The `useDebounce` hook uses `setTimeout` inside `useEffect` with proper cleanup to prevent stale closures. The debounced value is consumed by the data-fetching hook, not the input itself.

### 4. Server-Side Pagination
**Tool Used:** AI Coding Assistant  
**Purpose:** Building paginated API with MongoDB `skip()` and `limit()` with concurrent `countDocuments()`.  
**What I Learned:** Running `find()` and `countDocuments()` in parallel with `Promise.all()` halves the response time. Added proper input validation and clamping for page/limit params.

### 5. CSV Export Module
**Tool Used:** AI Coding Assistant  
**Purpose:** Client-side CSV generation using the Blob API.  
**What I Learned:** Creating a Blob with `text/csv` MIME type and using `URL.createObjectURL()` avoids server round-trips. Proper CSV escaping requires wrapping fields containing commas or quotes in double quotes.

### 6. Data Seeding Strategy
**Tool Used:** AI Coding Assistant  
**Purpose:** Generating 50,000 realistic product records with Faker.js.  
**What I Learned:** Batch insertion with `insertMany()` in chunks of 5,000 prevents MongoDB timeout errors. Category-specific product naming makes the demo data feel realistic.

---

*This log will be updated as development progresses.*
