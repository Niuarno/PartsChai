# PartsChai - Vercel + Supabase Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **UddoktaPay Account**: Sign up at [uddoktapay.com](https://uddoktapay.com) for payment processing

---

## Step 1: Set Up Supabase

### 1.1 Create a New Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project reference (found in project settings)
3. Wait for the project to be fully provisioned

### 1.2 Get Database Connection Strings

1. Go to **Project Settings** → **Database**
2. Find the **Connection string** section
3. Copy both URLs:

**For DATABASE_URL (Connection Pooling - use in production):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**For DIRECT_DATABASE_URL (Direct Connection - for migrations):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 1.3 Configure Prisma for Supabase

The schema is already configured. Just ensure your `prisma/schema.prisma` has:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
  relationMode = "prisma"
}
```

---

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/partschai.git
git push -u origin main
```

### 2.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `prisma generate && next build` (or leave default)
   - **Output Directory**: .next

### 2.3 Add Environment Variables

In Vercel, go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Supabase pooling URL | Production, Preview |
| `DIRECT_DATABASE_URL` | Your Supabase direct URL | Production, Preview |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | Production, Preview |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `UDDOKTAPAY_API_KEY` | Your UddoktaPay API key | Production |
| `UDDOKTAPAY_BASE_URL` | `https://uddoktapay.com/api` | Production |
| `UDDOKTAPAY_WEBHOOK_SECRET` | Your webhook secret | Production |
| `NEXT_PUBLIC_APP_NAME` | PartsChai | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

### 2.4 Deploy

Click **Deploy** and wait for the build to complete.

---

## Step 3: Run Database Migrations

After the first deployment, you need to push the database schema:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Option B: Using Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Run the generated SQL from `prisma migrate dev --create-only` locally

### Option C: Using Prisma with Local Env

```bash
# Set environment variables locally
export DATABASE_URL="your-production-database-url"
export DIRECT_DATABASE_URL="your-direct-database-url"

# Push schema
npx prisma db push
```

---

## Step 4: Seed Initial Data (Optional)

After migrations, seed the database:

```bash
# Using Vercel CLI with pulled env
bun run db:seed
# or
npx ts-node prisma/seed.ts
```

---

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test user registration
- [ ] Test user login
- [ ] Test ad creation flow
- [ ] Test payment flow with UddoktaPay
- [ ] Test chat/messaging (polling-based)
- [ ] Verify all images load properly
- [ ] Check mobile responsiveness

---

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":
- Verify DATABASE_URL and DIRECT_DATABASE_URL are correct
- Ensure IP restrictions in Supabase allow all connections (Vercel uses dynamic IPs)
- Check that the password is URL-encoded if it contains special characters

### Build Errors

If build fails:
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors locally with `npm run lint`

### Prisma Issues

If Prisma-related errors occur:
- Ensure `prisma generate` runs during build (it's in postinstall)
- Check that schema matches database state
- Run `npx prisma migrate deploy` to sync

---

## Updating the Deployment

### Automatic Deployments

Vercel automatically deploys when you push to the connected branch.

### Manual Deployments

```bash
vercel --prod
```

### Database Schema Updates

1. Make changes to `prisma/schema.prisma`
2. Run locally: `npx prisma migrate dev --name your_migration_name`
3. Commit the migration files
4. Push to trigger deployment
5. After deployment, run: `npx prisma migrate deploy`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase pooling connection string |
| `DIRECT_DATABASE_URL` | Yes | Supabase direct connection string |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth.js sessions |
| `NEXTAUTH_URL` | Yes | Your production URL |
| `UDDOKTAPAY_API_KEY` | Yes | UddoktaPay API key |
| `UDDOKTAPAY_BASE_URL` | Yes | UddoktaPay API base URL |
| `UDDOKTAPAY_WEBHOOK_SECRET` | Recommended | Webhook verification secret |
| `NEXT_PUBLIC_APP_NAME` | No | App name (default: PartsChai) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL |

---

## Support

For issues with:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **UddoktaPay**: [uddoktapay.com](https://uddoktapay.com)

---

## Architecture Notes

### Chat System

The chat system uses API polling instead of WebSockets for Vercel compatibility:
- Messages are fetched via `/api/chat/messages`
- Conversations via `/api/chat/conversations`
- Frontend polls for new messages every few seconds

### Payment Flow

1. User selects boost package
2. Payment initiated via UddoktaPay API
3. User redirected to payment page
4. Webhook confirms payment
5. Boost applied to ad

### File Uploads

For production, consider using Supabase Storage for image uploads:
1. Create a storage bucket in Supabase
2. Use `SUPABASE_URL` and `SUPABASE_ANON_KEY` for client-side uploads
3. Images stored with public URLs
