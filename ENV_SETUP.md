# Environment Variables Setup

This project requires the following environment variables to be set in a `.env.local` file.

## Required Environment Variables

Create a file named `.env.local` in the root directory of this project with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://app.supabase.com
# Go to Settings > API to find these values

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here

# Your Supabase anonymous/public key (safe to expose in client-side code)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Your Supabase service role key (KEEP THIS SECRET - only used server-side)
# This is needed for admin operations like creating profiles, uploading files, etc.
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## How to Get These Values

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (or create a new one if you don't have one)
3. **Navigate to Settings > API**
4. You'll find:
   - **Project URL** → Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Use this for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Database Setup

After setting up your environment variables, you'll also need to:

1. Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor
   - This sets up the database schema, tables, and Row Level Security (RLS) policies
   - Go to SQL Editor in your Supabase dashboard and paste the contents of `supabase-setup.sql`

2. Create a storage bucket named `product-images` in Supabase Storage
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `product-images`
   - Make it public if you want images to be accessible without authentication

## Quick Start

1. Create `.env.local` file in the root directory
2. Add the three environment variables above with your Supabase credentials
3. Run `npm install` (if you haven't already)
4. Run `npm run dev` to start the development server

