# Baby Heaven - Setup Guide

## Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd /Volumes/JR/Documents/side-projects/baby-heaven
   ```

2. **Create your environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Set up Sanity:**
   - Go to https://www.sanity.io and create a new project
   - Copy your Project ID and paste it in `.env.local`
   - Create an API token with Editor permissions
   - Paste the token in `.env.local`

4. **Set up Vercel Blob (for image uploads):**
   - Go to https://vercel.com/dashboard
   - Create a Blob store or use an existing one
   - Copy the read/write token
   - Paste it in `.env.local`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access your site:**
   - Website: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

## Initial Content Setup

1. **Go to** http://localhost:3000/studio

2. **Create Site Settings:**
   - Add your logo
   - Set phone number (WhatsApp)
   - Add email
   - Configure social media links
   - Set shipping cost (default: 120 Lps)
   - Add bank accounts for transfers

3. **Create Categories:**
   - Add 2-3 categories (e.g., "Ropa", "Juguetes", "Accesorios")
   - Upload background images for each
   - Set order for display

4. **Create Products:**
   - Add products with images
   - Set prices
   - Add product options (colors, sizes/months, etc.)
   - Link to categories
   - Add related products

5. **Create Hero Slides:**
   - Add 2-3 hero slides for the homepage carousel
   - Set titles, subtitles, and CTA buttons

6. **Create About Section:**
   - Add company description
   - Upload about image
   - Add features/highlights

## Instagram Integration (Optional)

To show real Instagram posts:

1. Get an Instagram Basic Display API token:
   - Follow: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
   
2. Add token to `.env.local`:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_token_here
   ```

Without this token, the Instagram section will show a "Follow us" button instead.

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Don't forget to add all environment variables in Vercel project settings!

## Support

For questions about the codebase, see README.md
