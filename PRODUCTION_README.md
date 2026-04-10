# PartsChai - PC Parts Marketplace Platform

A production-ready PC parts marketplace platform for Bangladesh.

## Features

- 🔐 **User Authentication** - Login/Register with email, phone, social OAuth
- 📝 **Ad Posting** - Multi-step wizard for posting PC part listings
- 🔍 **Browse & Search** - Advanced filtering by category, location, price, condition
- 💬 **Real-time Chat** - WebSocket-based messaging between buyers and sellers
- 💳 **Payment Integration** - UddoktaPay gateway for ad boosting payments
- 📱 **PWA Support** - Installable app with offline capability
- 📊 **Dashboard** - Manage ads, saved items, settings, analytics

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Payments**: UddoktaPay (bKash, Nagad, Rocket, Card)
- **Real-time**: Socket.io for chat

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your production values
```

### 3. Initialize Database

```bash
bun run db:push
```

### 4. Start Development Server

```bash
bun run dev
```

### 5. Build for Production

```bash
bun run build
bun run start
```

## Production Deployment

### Environment Variables

Make sure to set these in your production environment:

| Variable | Description |
|----------|-------------|
| `UDDOKTAPAY_API_ENDPOINT` | Production API endpoint |
| `UDDOKTAPAY_API_KEY` | Your UddoktaPay API key |
| `UDDOKTAPAY_API_SECRET` | Your UddoktaPay API secret |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXT_PUBLIC_APP_URL` | Your domain URL |

### Payment Gateway Setup

1. Create an account at [UddoktaPay](https://uddoktapay.com)
2. Get your API credentials from the dashboard
3. Update the environment variables
4. Set up webhook URL: `https://yourdomain.com/api/payment/webhook`

### Database

The default SQLite database is suitable for small to medium deployments.
For larger scale, migrate to PostgreSQL by updating `DATABASE_URL`.

## Boost Packages Pricing

| Type | Duration | Price (BDT) |
|------|----------|-------------|
| Top Ad | 1 day | ৳49 |
| Top Ad | 3 days | ৳99 |
| Top Ad | 7 days | ৳199 |
| Top Ad | 14 days | ৳349 |
| Bump Up | Single | ৳29 |
| Urgent | 3 days | ৳79 |
| Urgent | 7 days | ৳149 |
| Urgent | 14 days | ৳249 |
| Featured | 1 day | ৳99 |
| Featured | 3 days | ৳249 |
| Featured | 7 days | ৳499 |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication APIs
│   │   ├── ads/           # Ads CRUD APIs
│   │   ├── payment/       # Payment APIs
│   │   └── ...
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Footer, Navigation
│   ├── pages/             # Static page components
│   ├── dashboard/         # Dashboard components
│   ├── post-ad/           # Ad posting wizard
│   ├── boost/             # Boost payment modal
│   └── payment/           # Payment status components
├── lib/
│   ├── db.ts              # Prisma client
│   ├── store.ts           # Zustand store
│   ├── payment-config.ts  # Payment gateway config
│   └── uddoktapay.ts      # UddoktaPay integration
└── prisma/
    └── schema.prisma      # Database schema
```

## Adding More Payment Gateways

The payment system is designed to be extensible. To add a new gateway:

1. Add config to `src/lib/payment-config.ts`:
```typescript
export const sslCommerzConfig: PaymentGatewayConfig = {
  name: 'sslcommerz',
  displayName: 'SSLCommerz',
  isActive: true,
  apiEndpoint: process.env.SSLCOMMERZ_API_ENDPOINT || '',
  apiKey: process.env.SSLCOMMERZ_STORE_ID || '',
  apiSecret: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
  // ...
};
```

2. Create integration file `src/lib/sslcommerz.ts`
3. Add API endpoints in `src/app/api/payment/`
4. Update `paymentGateways` in `payment-config.ts`

## License

MIT License

## Support

For issues and feature requests, please create an issue on the repository.
