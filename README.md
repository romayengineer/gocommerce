# ShopHub - Static Ecommerce Website

A fully static ecommerce website built with Svelte 5 and SvelteKit. Zero backend, zero API, works completely offline!

## ✨ Features

### Core Features
- 📦 Complete product catalog with 12 sample products
- 🛒 Shopping cart with persistent storage (localStorage)
- 💳 Product filtering by category
- 📊 Product sorting (name, price)
- 📱 Fully responsive design
- ⚡ Lightning-fast static site generation
- 🎨 Beautiful Tailwind CSS styling

### Advanced Features
- 🌍 **Multi-language Support** - English (🇬🇧) & Spanish (🇦🇷)
  - Language switcher dropdown with flag emojis
  - Persistent language preference (localStorage)
  - 30+ translated strings across all pages
- 🎠 **Image Carousel** - Click through multiple product images
  - Previous/Next navigation buttons
  - Image counter (e.g., "1 of 3")
  - Auto-wrapping navigation
- 🛍️ **Checkout Flow** - Complete order management
  - Multi-step checkout form with validation
  - Delivery location mapping with Google Maps
  - Order summary with itemized breakdown
  - Support for multiple payment methods
- 🗺️ **Delivery Map** - Interactive address visualization
  - Google Maps integration with geocoding
  - Real-time address to location mapping
  - Responsive map display
- 🎨 **Component Architecture** - Highly reusable atomic components
  - 25+ specialized, single-responsibility components
  - Zero code duplication
  - Consistent styling throughout

### Technical Features
- ✅ **Single HTML File** - Entire app bundled into one portable file (171KB)
- 📦 **Offline-First** - Works completely without internet
- 🔐 **Hash-Based Routing** - No server required for navigation
- 📘 **Full TypeScript** - Type-safe throughout with Svelte 5 runes
- 🚀 **Zero Deprecation Warnings** - Modern Svelte 5 syntax

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Google Maps Setup (Optional)

The checkout page includes an interactive delivery location map powered by Google Maps. To enable this feature:

1. Get your Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/maps)
   - Create a new project
   - Enable the Maps JavaScript API and Geocoding API
   - Create an API key

2. Add the API key to your `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. Restart your dev server

If you don't add an API key, the checkout page will still work but the map will display a helpful message with instructions.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built site will be in the `build/index.html` - a single portable HTML file ready to share or deploy!

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte              # Root layout (Navigation, Footer)
│   ├── +page.svelte                # Homepage
│   ├── products/
│   │   ├── +page.svelte            # Products listing with filters
│   │   └── [id]/
│   │       └── +page.svelte        # Product detail page with carousel
│   ├── cart/
│   │   └── +page.svelte            # Shopping cart
│   └── checkout/
│       └── +page.svelte            # Checkout with delivery form
└── lib/
    ├── translations/               # i18n files
    │   ├── en.json                # English translations
    │   └── es.json                # Spanish translations
    ├── i18n.ts                    # i18n configuration
    ├── products.ts                # Product data & types
    ├── cart.ts                    # Cart store & logic
    ├── googleMapsService.ts       # Google Maps integration
    ├── LanguageSwitcher.svelte    # Language selector dropdown
    ├── ProductImage.svelte        # Image carousel component
    ├── ProductCard.svelte         # Product grid card
    ├── ProductGrid.svelte         # Product grid layout
    ├── ProductFilters.svelte      # Category & sort filters
    ├── CartItem.svelte            # Cart item component
    ├── CheckoutForm.svelte        # Checkout form component
    ├── MapDisplay.svelte          # Delivery location map
    ├── ApiKeyMissing.svelte       # API key missing alert
    ├── Button.svelte              # Reusable button
    ├── Link.svelte                # Consistent link styling
    ├── Price.svelte               # Price display
    ├── Rating.svelte              # Star rating
    ├── Navigation.svelte          # Header navigation
    ├── Footer.svelte              # Footer
    └── [more atomic components]
```

## Key Features Explained

### 🌍 Internationalization (i18n)
- **svelte-i18n** library for professional translations
- Dropdown language selector with flag emojis in header
- All UI strings translated (header, products, cart, footer)
- Language preference saved to localStorage
- Instant switching without page reload

### 🎠 Product Image Carousel
- Each product has multiple related emoji "images"
- Click arrows to browse through images
- Counter shows position (e.g., "2 of 3")
- Automatic wrapping (next after last → first)
- Only shows controls when multiple images available

### 🛒 Shopping Cart
- Real-time quantity controls
- Persistent storage with localStorage
- Works completely offline
- Order summary with subtotal, tax, shipping

### 💳 Checkout Process
- Multi-step checkout form with form validation
- Customer information fields (name, email, phone)
- Delivery address input (address, city, zip, country)
- Interactive map visualization of delivery location
- Order review before completing purchase

### 🗺️ Delivery Location Map
- Google Maps integration for address visualization
- Real-time geocoding of delivery addresses
- Automatic marker placement on map
- Responsive map container
- Graceful handling of missing API keys with helpful instructions

### 💻 Component Architecture
Instead of inline markup, every UI element is a reusable component:

**Layout Components:**
- `SidePanel` - Reusable card container
- `ProductGrid` - Grid display for products
- `ProductFilters` - Category & sort controls

**UI Components:**
- `Button` - Primary/secondary/danger variants
- `Link` - Consistent link styling
- `Price` - Flexible price display
- `Rating` - Star rating display

**Feature Components:**
- `ProductCard` - Product grid card
- `CartItem` - Cart item with controls
- `LanguageSwitcher` - Language dropdown
- `ProductImage` - Image carousel

## Customization

### Add Your Products
Edit `src/lib/products.ts` and add products to the array. Each product can have:
```typescript
{
  id: string,
  name: string,
  price: number,
  category: string,
  emoji: string,           // Primary image
  emojis?: string[],       // Optional: multiple carousel images
  rating: number,
  description: string
}
```

### Change Languages
Add new language to `src/lib/translations/`:
1. Create `fr.json` with French translations
2. Update `src/lib/i18n.ts` to register the language
3. Add to `locales` array

### Change Colors
Modify Tailwind CSS classes in components or update `tailwind.config.js`.

### Add More Pages
Create new `.svelte` files in `src/routes/` and use hash-based links like `href="#/your-page"`.

## Deployment

### Single File Deployment
The entire app is in `build/index.html`. Just:
- Share the file directly
- Host on any static file server
- Deploy to CDN
- Send via email or USB

### Netlify
```bash
npm run build
npm run preview  # Test locally first
# Drag & drop build/ folder to Netlify
```

### Vercel
```bash
npm run build
# Vercel auto-detects SvelteKit
```

### GitHub Pages
```bash
npm run build
# Commit build/index.html to gh-pages branch
```

## Technologies Used

- **Svelte 5** - Reactive component framework with modern runes
- **SvelteKit** - Full-stack framework with static adapter
- **svelte-i18n** - Professional internationalization
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Adapter Static** - Single HTML file bundling
- **Google Maps API** - Interactive maps and geocoding (optional)

## Performance

- **Bundle Size:** 171KB (single HTML file, gzipped)
- **Build Time:** ~27 seconds
- **Runtime:** No JavaScript frameworks to load (Svelte compiles to vanilla JS)
- **Offline:** 100% works without internet

## Browser Support

- Modern browsers with ES6 support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT - Feel free to use this for your own projects!
