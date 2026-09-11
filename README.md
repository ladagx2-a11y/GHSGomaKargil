# GHS Goma Kargil

Official website and administrative portal for Government High School Goma, Kargil, Ladakh.

## Features
- **Public Facing Website**: Dynamic and responsive school website featuring a hero carousel, latest news, public compliance records, a masonry photo gallery, and community voices.
- **Secure Admin Portal**: A protected dashboard for institutional staff to manage all dynamic content, including images, news stories, compliance documents, and hero images.
- **Supabase Integration**: Uses Supabase PostgreSQL for the database and Supabase Storage for media assets.
- **Next.js App Router**: Built with modern Next.js architecture, utilizing Server-Side Rendering (SSR) for fast loads and SEO.
- **Robust Security**: Protected with Next.js Middleware and Supabase Auth with Row Level Security (RLS) ensuring that only authenticated admins can modify content.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Local Development
1. Clone the repository
2. Install dependencies with `npm install`
3. Configure your `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server with `npm run dev`

## Deployment
This project is configured to be seamlessly deployed on [Vercel](https://vercel.com).
