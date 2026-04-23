Act as a Senior Frontend Engineer and Product Designer.

Build a complete, fully functional fashion e-commerce website for a personal brand that sells:
- Second-hand clothes (vintage, like new)
- Handmade yarn products (scarves, sweaters, accessories)

The website must be interactive (buttons clickable, UI responsive, components working) — not just static UI.

---

# 🔥 CORE REQUIREMENTS

## 1. TECH STACK
- React (Vite or Next.js)
- Tailwind CSS
- Use component-based architecture
- Use mock data (JSON) for products
- Use React hooks (useState, useEffect)
- No backend required, but simulate logic (cart, filter, etc.)

---

# 🏠 2. PAGES TO BUILD

## 1. Homepage
- Hero banner (aesthetic fashion style, Korean vibe)
- Featured products section
- Categories:
  - Clothes
  - Yarn
- “New Arrivals” section (inspired by modern boutique shops)
- CTA buttons (Shop now, View collection)

---

## 2. Product Listing Page (Shop)

### Layout:
- Grid (2–4 columns responsive)

### Product Card:
- Image (with hover effect → show second image)
- Name
- Price
- Condition badge (Used / Like New / Handmade)
- Heart icon (wishlist toggle)
- Quick Add to Cart button

### Filters:
- Category (Clothes / Yarn)
- Price range slider
- Size
- Condition
- Color

### Sorting:
- Newest
- Price low → high
- Price high → low

### Features:
- Pagination or infinite scroll
- Quick view modal (click → show popup product preview)

---

## 3. Product Detail Page

### Layout:
- Left: image gallery (multiple images + zoom effect)
- Right: product info

### Info:
- Product name
- Price (highlight)
- Condition tag
- Short description
- Size selector
- Quantity selector
- Add to Cart button
- Buy Now button

### Details:
- Storytelling description (aesthetic tone)
- Size guide (table format)
- Material (cotton, wool, yarn)
- Condition details (used marks if any)
- Care instructions

### Extra:
- Related products (grid)
- Favorite (heart button)
- Reviews section (UI only)

---

## 4. Cart Page

- List of selected items
- Quantity control (+ / -)
- Remove item
- Total price calculation
- Checkout button (mock)

---

# 🎨 3. UI/UX DESIGN STYLE

- Minimalist, clean, aesthetic
- Gen Z / Korean fashion vibe
- Soft pastel colors
- Rounded corners (2xl)
- Soft shadows
- Smooth hover animations
- Micro-interactions (button click, hover scale)

---

# 🧠 4. DATA STRUCTURE (IMPORTANT)

Create a mock product JSON like:

- id
- name
- price
- category (clothes / yarn)
- condition (new / like new / used / handmade)
- images (array)
- sizes
- description
- material
- color

---

# ⚙️ 5. FUNCTIONALITY (MUST WORK)

- Add to cart updates cart state
- Remove item works
- Quantity updates correctly
- Filter products dynamically
- Sort works correctly
- Wishlist toggle works (UI state)
- Product detail navigation works
- Quick view modal opens/closes properly

---

# 🖼️ 6. IMAGES

- Use placeholder images (Unsplash or similar)
- Clothes → fashion aesthetic images
- Yarn → handmade cozy images

---

# 🧩 7. COMPONENT STRUCTURE

- Navbar
- Footer
- ProductCard
- ProductGrid
- FilterSidebar
- ProductGallery
- CartItem
- Modal
- Button (reusable)

---

# 💡 8. EXTRA (IMPORTANT FOR SELLING)

- Add badges:
  - "Vintage"
  - "1 of 1"
  - "Handmade"
- Add subtle animations to increase engagement
- Focus on conversion (CTA buttons must stand out)

---

# 🎯 OUTPUT FORMAT

- Provide full project structure
- Provide all React components
- Provide Tailwind styling
- Ensure code is clean, readable, reusable
- Ensure it can run immediately after copy (minimal setup)

---

# 🎯 GOAL

The result should feel like a real boutique fashion website similar to:
- Modern Instagram shops
- Korean fashion brands
- Aesthetic lifestyle stores

It must be visually beautiful AND functionally usable