# Baby Heaven Honduras

E-commerce website for baby products built with Next.js 16, Sanity CMS, and Tailwind CSS v4.

## Features

- 🛍️ Complete e-commerce functionality
- 🎨 Beautiful baby-themed design with pastel colors
- 📱 Fully responsive (mobile-first)
- 🛒 Shopping cart with product options (colors, sizes, etc.)
- 🇭🇳 Honduras-specific checkout with state/city selection
- 📍 Geolocation support for La Ceiba deliveries
- 📸 Instagram API integration
- 💳 Payment methods: Cash and Bank Transfer
- 📲 WhatsApp order submission
- ⚡ Server-side rendering with Next.js 16
- 🎯 SEO optimized

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Image Storage:** Vercel Blob
- **Deployment:** Vercel

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token
   BLOB_READ_WRITE_TOKEN=your_blob_token
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token (optional)
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access Sanity Studio:**
   
   Navigate to `http://localhost:3000/studio` to manage your content.

## Project Structure

```
baby-heaven/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── products/             # Product pages
│   ├── studio/               # Sanity Studio
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Categories.tsx
│   ├── NewProducts.tsx
│   ├── Instagram.tsx
│   ├── About.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductGallery.tsx
│   ├── ProductOptions.tsx
│   ├── CartModal.tsx
│   └── LocationPicker.tsx
├── contexts/                 # React contexts
│   └── CartContext.tsx
├── lib/                      # Utilities
│   ├── sanity.ts             # Sanity client & queries
│   ├── hondurasData.ts       # Honduras states & cities
│   └── imageUtils.ts         # Image compression
├── sanity/                   # Sanity configuration
│   ├── schemas/              # Content schemas
│   └── lib/                  # Sanity helpers
└── public/                   # Static assets
```

## Content Management

Access the Sanity Studio at `/studio` to manage:

- **Products:** Add products with images, prices, options (colors, sizes), and stock status
- **Categories:** Organize products into categories
- **Hero Slides:** Create homepage carousel slides
- **About:** Update company information
- **Site Settings:** Configure logo, contact info, payment methods
- **Instagram:** Automated via API (requires Instagram token)

## Honduras Checkout Flow

The checkout process is specifically designed for Honduras:

1. Customer selects state (department)
2. Customer selects city (filtered by state)
3. For **La Ceiba** only: Option to use geolocation for precise address
4. Payment method selection (Cash or Bank Transfer)
5. Order submission via WhatsApp

## Instagram Integration

To enable Instagram integration:

1. Get an Instagram Basic Display API token
2. Add `INSTAGRAM_ACCESS_TOKEN` to `.env.local`
3. The homepage will automatically display your 4 most recent posts

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add all environment variables in your Vercel project settings.

## License

Private project for Baby Heaven Honduras.
