# GoCommerce - Static Ecommerce Website

A fully static ecommerce website built with Svelte 5 and SvelteKit. Zero backend, zero API, works completely offline with intelligent image caching!

## ✨ Features

### Core Features
- 📦 Complete product catalog with real product images from external CDN
- 🛒 Shopping cart with persistent storage (localStorage)
- 💳 Smart product filtering by size/variations
- 📊 Product sorting (name, price)
- ♾️ **Infinite Scroll** - Loads 20 products initially, then 20 more as you scroll
- 📱 **Mobile-first responsive design** - Optimized for all devices
- ⚡ Lightning-fast static site generation
- 🎨 Beautiful Tailwind CSS styling

### Advanced Features
- 🌍 **Multi-language Support** - English (🇬🇧) & Spanish (🇦🇷)
  - Language switcher dropdown with flag emojis
  - Persistent language preference (localStorage)
  - **Dynamic price formatting:** Spanish uses `123,456.78` format, others use `123.456,78`
  - 30+ translated strings across all pages
- 🖼️ **Real Product Images** - Professional product photos
  - Multiple images per product with carousel
  - Smart navigation arrows (only in detail view)
  - Image counter (e.g., "1 of 7")
  - Auto-wrapping navigation
  - **Automatic product filtering:** Only displays products with successfully loaded first images
  - Broken image handling: Products hidden if first image fails to load
- 💾 **Intelligent Image Caching** - Service Worker powered
  - First load: Downloads images, caches automatically
  - Subsequent loads: Serves from cache instantly
  - Works offline after first visit
  - Automatic cache management
- 🛍️ **Checkout Flow** - Complete order management
  - Multi-step checkout form with validation
  - Delivery location mapping with Google Maps
  - Order summary with itemized breakdown
  - Support for multiple payment methods
- 🗺️ **Delivery Map** - Interactive address visualization (choose your provider)
  - **Default:** Leaflet + OpenStreetMap (free, no API key required)
  - **Alternative:** Google Maps integration with geocoding
  - Real-time address to location mapping
  - Responsive map display
  - Easy provider switching via environment variable
- 📊 **Smart Product Filters** - Intelligent category organization
  - Automatically groups sizes (e.g., "30 ML", "100 ML", "200 ML")
  - Numerical sorting for size variants
  - Separate display for other categories
  - Visual grouping with border indicators
  - **Responsive design:** Full filters on desktop, collapsible mobile version
  - Mobile filters automatically collapse sections to save space
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
- 🔄 **Service Worker Caching** - Aggressive image caching strategy
  - Cache-first approach for images
  - Network-first for other assets
  - Automatic fallback to cached versions when offline
  - Periodic cache updates
- 🔍 **Custom Logger** - Reactive logging system with URL parameter control
  - Enable/disable logs with `?debug` query parameter
  - Programmatic control via `logger.setEnabled()` and `logger.toggle()`
  - Used throughout the app for debugging image loading, cart operations, and service worker activity

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Map Provider Setup

The checkout page includes an interactive delivery location map. Two providers are available:

#### Leaflet + OpenStreetMap (Default - No Setup Required)
The default map provider uses free, open-source Leaflet and OpenStreetMap data. No API key needed!

```bash
npm run dev
# Map will work automatically
```

#### Google Maps (Optional)
To use Google Maps instead of Leaflet:

1. Get your Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/maps)
   - Create a new project
   - Enable the Maps JavaScript API and Geocoding API
   - Create an API key

2. Add to your `.env` file:
   ```
   VITE_MAP_PROVIDER=google
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. Restart your dev server

#### Comparison
| Feature | Leaflet (Default) | Google Maps |
|---------|------------------|-------------|
| Cost | Free | Free tier + paid |
| API Key | Not required | Required |
| Setup | None | 3 steps |
| Offline | Yes | No |
| Data Source | OpenStreetMap | Google |

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
    ├── logger.svelte.ts           # Custom reactive logger with ?debug support
    ├── splideCarousel.svelte.ts   # Splide carousel class with state management
    ├── products.ts                # Product data & types
    ├── cart.ts                    # Cart store & logic
    ├── mapService.ts              # Map service interface & types
    ├── mapFactory.ts              # Map provider factory
    ├── googleMapsService.ts       # Google Maps implementation
    ├── leafletService.ts          # Leaflet + OpenStreetMap implementation
    ├── urlUtils.ts                # URL pagination utilities (updatePageInUrl, getPageInUrl)
    ├── LanguageSwitcher.svelte    # Language selector dropdown
    ├── ProductImage.svelte        # Image carousel component
    ├── ProductCard.svelte         # Product grid card
    ├── ProductGrid.svelte         # Product grid layout with pagination
    ├── ProductFilters.svelte      # Desktop category & sort filters
    ├── ProductFiltersMobile.svelte # Mobile collapsible filters
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

### 🎠 Product Image Carousel & Smart Image Loading
- Each product has multiple related emoji "images"
- **Powered by Splide** - Lightweight, modern carousel library with custom class wrapper
- **Class-based architecture** - `SplideCarousel` class in `splideCarousel.svelte.ts` manages all carousel logic
- **Smooth fade animations** - Quick transitions between images
- **Multiple navigation methods:**
  - **Drag/Swipe** - Click and drag left/right to navigate (desktop & mobile)
  - **Custom arrow buttons** - Styled with Tailwind, independent of Splide UI
  - **Keyboard** - Use arrow keys to navigate
- **Custom counter** - Shows position (e.g., "2 of 3") with matching oval styling
- Automatic looping (wraps to first after last image)
- Only shows controls when multiple images available
- **Conditional drag** - Drag is disabled when navigation is hidden
- **Smart Image Filtering:** Products automatically hidden if their first image fails to load
  - Prevents broken product cards from displaying
  - Uses image load/error event tracking
  - Reactive state management with SvelteSet for real-time updates
- **Carousel Configuration** - Customizable via `SplideCarousel` in `splideCarousel.svelte.ts`:
  - `type: 'loop'` - Seamless infinite looping
  - `speed: 300` - Animation duration in milliseconds
  - `touchAngle: 30` - Touch sensitivity for swipe detection
  - `drag: showNavigation` - Conditional drag based on navigation visibility

### 🛒 Shopping Cart
- Real-time quantity controls
- Persistent storage with localStorage
- Works completely offline
- Order summary with subtotal, tax, shipping

### 💳 Checkout Process
- **Multi-step checkout form** with form validation
- **Customer information fields** with multilingual labels:
  - Name, email, phone (fully translated to English/Spanish)
  - Address, city, postal code, country with Argentina-specific placeholders
- **Interactive map visualization** of delivery location
- **Real-time address validation** with debounced geocoding
- Order review before completing purchase
- Graceful error handling when address cannot be geocoded

### 🗺️ Delivery Location Map
- **Provider Selection:** Choose between Leaflet (default) or Google Maps via `VITE_MAP_PROVIDER`
- **Leaflet + OpenStreetMap:** Free, offline-capable, no API key required
- **Google Maps:** Full-featured, premium geocoding (optional)
- **Real-time geocoding** with debounced address updates (500ms)
- **Smart zoom levels:** 
  - Zooms in to street level when address is found
  - Shows regional view when address not found
- **Structured address queries** for better accuracy (street, city, postalcode, country)
- **Error handling** with user-friendly messages in English and Spanish
- Automatic marker placement on map
- Responsive map container
- Both providers implement the same interface for seamless switching

### 🗺️ Map Service Architecture
The map system uses a pluggable architecture with a shared interface (`IMapService`):

**LeafletService** (Default)
- Uses Nominatim API for free geocoding
- OpenStreetMap for map tiles
- Structured query support for accurate results
- 500ms debounce on address updates to reduce API calls

**GoogleMapsService** (Optional)
- Uses Google's Geocoding API
- Supports both address strings and structured queries
- Requires API key but offers higher accuracy

Both services share:
- Common interface for seamless swapping
- Dynamic zoom levels (street-level vs regional)
- Error tracking and default location fallback
- Multi-language error messages

### 🔍 Logging & Debugging
The app includes a custom reactive logger for debugging:

**Features:**
- Logs image loading, cart operations, and service worker activity
- Automatically detects `?debug` query parameter in URL
- Can be toggled programmatically from browser console
- Errors always display regardless of debug state

**Enable Logging:**
```javascript
// Via URL
http://localhost:5173/?debug

// Via browser console
logger.setEnabled(true);
logger.toggle();
logger.setEnabled(false);

// Check current state
logger.isEnabled;
```

**Logger Locations:**
- Image loading events: `ProductImage.svelte`
- Cart operations: `cart.ts`
- Service Worker events: `service-worker.js`
- Location updates: `googleMapsService.ts`, `leafletService.ts`
- Checkout: `CheckoutForm.svelte`

### 🎯 Responsive Product Filters
The product filters automatically adapt based on screen size:

**Desktop Version (`ProductFilters`):**
- Full-featured sidebar with all controls visible
- Search, category, and sort options always accessible
- Generous spacing and padding for mouse interaction

**Mobile Version (`ProductFiltersMobile`):**
- Collapsible sections (Search, Category, Sort) to save space
- Each section toggles open/closed with smooth transitions
- Rotating chevron indicators show expanded/collapsed state
- Compact spacing optimized for touch interaction
- Identical filtering functionality as desktop version

**Responsive Behavior:**
- Automatically switches at 768px breakpoint (Tailwind `md`)
- Detects screen size on mount and on window resize
- Same filter state maintained across both versions
- Mobile version enables better UX on phones and tablets

### ♾️ Infinite Scroll Pagination with Scroll Position Caching
The product grid implements efficient infinite scroll pagination with automatic scroll position persistence:

**How It Works:**
- **Scroll-Based Pagination:** Current page is calculated from scroll position in real-time
- **Formula:** `currentPage = 1 + floor(scrollHeight_in_em / rowHeight_in_em)`
- **Automatic Caching:** Scroll position saved to sessionStorage on every scroll event
- **Smooth Recovery:** When returning to products page, scroll position restored automatically
- **URL Synchronization:** Page number reflected in URL (`?page=X`) for shareable links
- **Buffer Loading:** Page buffer (4 pages) preloads surrounding content for seamless scrolling
- **Responsive Pages:** Items per page varies by screen size (2-4 per row)
- **Works Offline:** All pagination from in-memory product list

**Implementation Details:**
- **Scroll Tracking:** `scrollHeight` state captures `window.scrollY` on every scroll event
- **SessionStorage:** Scroll position persisted to `sessionStorage` for automatic recovery on navigation
- **Page Calculation:** `currentPage` updated via debounced `$effect` (100ms delay)
  - Formula: `scrollHeight / 16 / (productCardHeight + gap)`
  - `scrollHeight / 16` converts pixels to em units (base font-size: 16px)
  - Dividing by row height (`productCardHeight + gap`) gives the current page number
  - Capped at `maxPage` to prevent exceeding total pages
- **Two-Stage Debounce:**
  - Stage 1 (100ms): Scroll → Page calculation debounce prevents excessive page recalculations during rapid scrolling
  - Stage 2 (100ms): Page → URL update debounce reduces navigation history clutter
- **Columns:** Dynamically calculated based on responsive breakpoints (2/3/4 columns)
- **itemsPerPage:** `columns × rowsPerPage` - varies by screen size
- **visibleProducts:** Renders current page ± buffer for smooth scrolling experience
- **pageBuffer:** Set to 4 pages for generous preloading
- **maxPage/maxHeight:** Derived values for total pages and scrollable height in rem
- **Automatic Recovery:** Scroll position restored on component mount from sessionStorage
- **URL Utilities:** `updatePageInUrl(url, page)` updates URL with page parameter

**Scroll Height Conversion:**
The component converts pixel-based scroll position to em units using the formula `px / 16` (where 16 is the base font size). This allows the pagination logic to work seamlessly with the component's rem-based dimensions.

### 🔍 Search Debouncing
Search queries are debounced to optimize performance and reduce unnecessary filtering:

**How It Works:**
- **User Input:** As users type in the search box, the raw query updates immediately
- **1-Second Delay:** Actual search filtering waits 1 second after typing stops
- **Optimized Performance:** Prevents filtering on every keystroke, reducing CPU usage
- **Responsive Feel:** Search results still feel instant despite the debounce delay

**Implementation Details:**
- `searchQuery` state captures raw user input
- `debouncedSearchQuery` state holds the delayed, filtered search term
- `$effect` with 1000ms timeout ensures filtering only happens after typing pauses
- Cleanup handler clears previous timeout when user types again
- Products are filtered against `debouncedSearchQuery` for smooth UX

### 💻 Component Architecture
Instead of inline markup, every UI element is a reusable component:

**Layout Components:**
- `SidePanel` - Reusable card container
- `ProductGrid` - Grid display for products
- `ProductFilters` - Desktop category & sort filters
- `ProductFiltersMobile` - Mobile collapsible filters

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
Edit `src/data/products.json` and add products to the array. Each product has:
```typescript
{
  itemId: string,          // Unique product ID
  nameComplete: string,    // Full product name
  ean: string,            // European Article Number (barcode)
  variations: string[],   // Size variants (e.g., ["30 ML", "100 ML", "200 ML"])
  images: string[],       // Array of product image URLs
  price: number           // Price in cents (e.g., 256368 = $2563.68)
}
```

Products are loaded from `src/data/products.json` and typed in `src/lib/products.ts`.

### Change Languages
Add new language to `src/lib/translations/`:
1. Create `fr.json` with French translations
2. Update `src/lib/i18n.ts` to register the language
3. Add to `locales` array

### Change Colors
Modify Tailwind CSS classes in components or update `tailwind.config.js`.

### Add More Pages
Create new `.svelte` files in `src/routes/` and use hash-based links like `href="#/your-page"`.

## Service Worker Caching

The app uses Service Workers for intelligent image caching:

### How It Works
1. **First Visit:** Images download from CDN and are automatically cached
2. **Subsequent Visits:** Images load instantly from cache (no network request)
3. **Offline Mode:** Cached images display even without internet connection
4. **Cache Management:** Old caches are automatically cleaned up

### Testing Locally
The Service Worker requires HTTPS or localhost. Use `npm run preview` to test:

```bash
npm run build
npm run preview
# Open http://localhost:4173
```

Then:
1. First load - images cache automatically
2. Refresh page - images load from cache instantly
3. DevTools → Application → Cache Storage - see cached images

### Security Note
Service Workers only work on:
- ✅ `https://` (production)
- ✅ `http://localhost` (local testing)
- ❌ `file://` (direct file opening - not supported)

Always use `npm run preview` or deploy to a server to test service worker functionality.

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
# Push to 'build' branch to deploy
# Vercel auto-detects SvelteKit
```

**Configuration:**
The project includes a `vercel.json` config that:
- Restricts deployments to the `build` branch only (main branch is disabled)
- Sets build command to `npm run build`
- Sets output directory to `build/`
- Pre-configures Leaflet as the default map provider

**To deploy:**
1. Push your changes to the `build` branch
2. Vercel will automatically detect and deploy
3. The main branch will not trigger deployments

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
- **Service Workers** - Intelligent image caching and offline support
- **Splide** - Lightweight, modern carousel/slider library
- **Leaflet** - Open-source mapping library with OpenStreetMap tiles (default)
- **Nominatim** - Free, open-source geocoding API for address lookup
- **Google Maps API** - Interactive maps and geocoding (optional alternative)

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
