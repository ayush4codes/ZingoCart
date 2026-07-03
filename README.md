# ZingoCart - Multi-Vendor Indian Grocery Marketplace

ZingoCart is a premium, high-performance multi-vendor grocery marketplace built using the **MERN Stack** (MongoDB Atlas, Express, React, Node.js). It aggregates local Indian grocery vendors into a unified storefront, enabling buyers to browse fresh produce, organic staples, and dairy from multiple stores in a single checkout experience, while providing vendors with self-service management tools.

---

## 🚀 Key Modules & Features

### 🛒 1. Unified Grocery Storefront (Buyer Catalog)
* **Consolidated Browsing**: Combines items from all active vendors into a single shop catalog.
* **Consolidated Cart System**: Add items from multiple vendors and check out with a single COD invoice.
* **Dynamic Search & Filtering**: Real-time product search with dynamic filtering by **Category**, **Maximum Price**, and **Vendor Store**.
* **Indian Rupee (₹) Formatting**: Prices, subtotals, and metrics styled using standard Indian numbering formats.

### 🏪 2. Vendor Portal & Self-Service Dashboards
* **Efulfillment Panel**: Displays sales metrics (Total Revenue, Active Orders, Low Stock Alerts).
* **Inventory Manager**: Live product control center for vendors to list new grocery items, update prices or stock, and delete products.
* **Order Fulfillment Board**: Multi-vendor order splits! Allows each vendor to see only their items in a customer's order and change their fulfillment state (`Pending`, `Shipped`, `Delivered`, `Cancelled`) independently.
* **Instant Shop Creation**: Add new simulated vendor stores dynamically using the registration interface with user-facing validation error messages.

### 🎨 3. Premium Design System
* Customized **Outfit** sans-serif font family.
* Brand identity colors extracted directly from the uploaded **ZingoCart logo**:
  * **Primary (Lime Green)**: `#8dc63f`
  * **Secondary Accent (Vivid Orange)**: `#f96e14`
* Glassmorphism layout details, hover interactions, custom scrollbars, and fluid animations.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Lucide Icons, Custom CSS Variables
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas (via Mongoose ODM)
* **DNS SRV Resolve Patch**: Native DNS resolution override inside `dbHelper.js` forcing Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) resolvers to prevent standard Windows querySrv failures (automatically bypassed in Vercel to preserve cloud DNS routes).

---

## 🏃‍♂️ Getting Started (Local Startup)

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* A MongoDB Atlas account/cluster or local MongoDB server

### 1. Setup Backend
1. Open the [backend/](file:///c:/Users/ayush/Desktop/grocery/backend) directory in your terminal:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Configure environment variables in [.env](file:///c:/Users/ayush/Desktop/grocery/backend/.env):
   ```env
   PORT=5000
   MONGODB_URI=YOUR_MONGODB_ATLAS_URI_HERE
   ```
4. Start the server:
   ```bash
   npm run start
   ```
   *The console should print: `⚡ Connected to MongoDB Atlas successfully!` on port `5000`.*

### 2. Setup Frontend
1. Open the [frontend/](file:///c:/Users/ayush/Desktop/grocery/frontend) directory in your terminal:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the local address in your web browser: **`http://localhost:5173/`**

---

## 📂 Project Structure

```text
grocery/
├── api/
│   └── index.js          # Vercel serverless function entrypoint (ensures DB readiness)
├── backend/
│   ├── models/           # Mongoose schemas (Product, Order, Vendor)
│   ├── dbHelper.js       # MongoDB helper utilities and data access methods
│   ├── server.js         # API Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/           # Favicons & Manifests
│   ├── src/
│   │   ├── assets/       # ZingoCart brand logo
│   │   ├── components/   # Navbar, CartDrawer
│   │   ├── context/      # CartContext, UserContext
│   │   ├── pages/        # Catalog, Checkout, VendorDashboard
│   │   ├── App.jsx       # Layout shell and tab routing
│   │   ├── App.css       # Layout styles
│   │   ├── index.css     # Global reset & typography
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json          # Root package.json for Vercel dependency resolution
└── vercel.json           # Vercel deployment configuration (routing, serverless builds)
``` 
