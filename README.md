# Circle Marketplace - Dynamic Sell Flow & Category System

A scalable, extensible secondhand marketplace web application built with **React**, **Node.js (Express)**, and **MongoDB Atlas**.

---

## 🏗️ Architecture Overview

```text
Circle Marketplace
│
├── Frontend
│   ├── Home
│   ├── Categories
│   ├── Sell Product
│   │     └── Dynamic Form
│   ├── Product Details
│   └── My Listings
│
├── Backend
│   ├── Category API
│   ├── Product API
│   └── Dynamic Field Logic
│
├── MongoDB Atlas
│   ├── Categories
│   │     └── fields[]
│   └── Products
│         └── attributes{}
│
└── GitHub
      └── Complete Source Code
```

---

##  Key Architecture & System Design

### 1. Separation of Common vs. Category-Specific Fields
- **Common Information**: Attributes shared by every product (`title`, `price` in ₹ INR, `description`, `images`, `category_id`, `location`).
- **Category-Specific Attributes**: Dynamic key-value dictionary stored as `attributes: Map<String, Schema.Types.Mixed>` in MongoDB.

### 2. Extensible Category Schema Model
The `Category` MongoDB document defines the form contract:
```json
{
  "_id": "6a76d55381f6a4e06b006be5",
  "name": "Laptops",
  "fields": [
    { "label": "Brand", "type": "text", "required": true },
    { "label": "RAM", "type": "select", "options": ["4GB", "8GB", "16GB", "32GB", "64GB"] },
    { "label": "Storage", "type": "select", "options": ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"] },
    { "label": "Processor", "type": "text" },
    { "label": "Condition", "type": "select", "options": ["New", "Like New", "Good", "Fair"] }
  ]
}
```

### 3. Dynamic UI Renderer (`CreateProduct.jsx`)
When a seller selects a category:
1. `CreateProduct.jsx` retrieves the category specification schema from `GET /api/categories`.
2. The dynamic field engine renders the appropriate controls:
   - `text` / `input` -> Standard text input
   - `number` -> Numeric input
   - `select` / `dropdown` -> Dropdown select
   - `radio` -> Single selection pills
   - `checkbox` -> Multi-select toggle group
   - `textarea` -> Multi-line text box
3. Validation enforces required attributes automatically based on `field.required === true`.

---

##  Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds 6 categories (Mobile Phones, Laptops, Vehicles, Fashion, Home & Furniture, Electronics) into MongoDB Atlas
npm start        # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173 (or 5174)
```

### 3. Production Build Verification
```bash
cd frontend
npm run build    # Compiles production bundle (0 errors)
```

---

##  Pre-configured Categories & Sample Data

| Category | Dynamic Fields Configured | Input Types Used |
| :--- | :--- | :--- |
| **Mobile Phones** | Brand, Storage, Condition | Text, Select Dropdown |
| **Laptops** | Brand, RAM, Storage, Processor, Condition | Text, Select Dropdown |
| **Vehicles** | Brand, Model, Year, Fuel Type, Condition | Text, Number, Radio, Select Dropdown |
| **Fashion** | Brand, Size, Gender, Condition | Text, Select Dropdown, Radio |
| **Home & Furniture** | Item Type, Material, Condition, Color | Text, Select Dropdown |
| **Electronics** | Brand, Model, Warranty, Condition | Text, Select Dropdown |

---

##  API Endpoints Summary

- `GET /api/categories` - Returns all category schemas with field configurations
- `POST /api/categories` - Creates a new category schema dynamically
- `GET /api/products` - Returns all product listings
- `POST /api/products` - Creates a new product listing with dynamic attributes

---

##  System Design Trade-offs & Future Enhancements

1. **Schema Flexibility**: Using a MongoDB Schema Mixed object for `attributes` allows instant schema addition without ALTER TABLE migrations.
2. **Conditional Fields Support**: Can be extended by adding `dependsOn` field in category schema (e.g., show warranty date if warranty != "None").
3. **Localized Currency & Region Support**: Configured for Indian Rupee (`₹ INR`) and Indian states/regions (Mumbai, Bengaluru, Delhi NCR, Hyderabad, etc.).

---

## 🚀 Deploying to Vercel (Step-by-Step)

The project includes pre-configured Vercel serverless rules ([vercel.json](file:///c:/Users/Prasanitha/Desktop/circle-marketplace/vercel.json) and [api/index.js](file:///c:/Users/Prasanitha/Desktop/circle-marketplace/api/index.js)) for full-stack deployment.

### Option A: Deploy via GitHub + Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your `circle-marketplace` GitHub repository.
4. Set Environment Variables in Vercel project settings:
   - `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas Connection String)
   - `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will automatically build the React frontend and deploy the Express API as a Serverless Function.

### Option B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Run deployment command at project root
vercel

# 3. Follow terminal prompts to link project & set environment variables
```
