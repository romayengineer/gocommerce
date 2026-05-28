# ShopHub - Static Ecommerce Website

A fully static ecommerce website built with Svelte and SvelteKit. No backend or API needed!

## Features

- 📦 Complete product catalog with 12 sample products
- 🛒 Shopping cart with persistent storage (localStorage)
- 💳 Product filtering by category
- 📊 Product sorting (name, price)
- 📱 Fully responsive design
- ⚡ Lightning-fast static site generation
- 🎨 Beautiful Tailwind CSS styling
- 🔍 Product search and discovery

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built site will be in the `build/` directory - ready to deploy to any static hosting service!

## Project Structure

```
src/
├── routes/                 # Page routes
│   ├── +page.svelte       # Homepage
│   ├── products/          # Products listing
│   │   ├── +page.svelte
│   │   └── [id]/          # Individual product pages
│   └── cart/              # Shopping cart
└── lib/
    ├── products.js        # Product data
    ├── cart.js           # Cart store
    ├── Navigation.svelte # Header
    ├── Footer.svelte     # Footer
    └── ProductCard.svelte # Product component
```

## Features Explained

### Static Generation
- No backend needed
- All content is pre-generated at build time
- Works on any static hosting (Netlify, Vercel, GitHub Pages, etc.)

### Shopping Cart
- Cart data is stored in browser's localStorage
- Persists across page refreshes
- Works completely offline

### Product Data
- Mock product data in `src/lib/products.js`
- Easy to customize with your own products
- Includes product images (emoji), prices, descriptions, ratings

## Customization

### Add Your Products
Edit `src/lib/products.js` and add/modify products in the array.

### Change Colors
Modify the Tailwind CSS classes in components or update `tailwind.config.js`.

### Add More Pages
Create new `.svelte` files in `src/routes/` to add more pages.

## Deployment

### Netlify
```bash
npm run build
# Then drag & drop the `build` folder to Netlify
```

### Vercel
```bash
npm run build
# Vercel automatically detects and deploys
```

### GitHub Pages
Build and commit the `build/` folder, then enable GitHub Pages in settings.

## Technologies Used

- **Svelte** - Reactive component framework
- **SvelteKit** - Full-stack framework with static adapter
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool

## License

MIT - Feel free to use this for your own projects!
