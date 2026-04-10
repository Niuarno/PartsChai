import { Suspense } from 'react';
import { db } from '@/lib/db';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedAds from '@/components/home/FeaturedAds';
import AdDetailPage from '@/components/ad/AdDetailPage';
import PostAdWrapper from '@/components/post-ad/PostAdWrapper';
import BrowsePage from '@/components/browse/BrowsePage';
import DashboardPage from '@/components/dashboard/DashboardPage';
import SavedAds from '@/components/dashboard/SavedAds';
import ChatPage from '@/components/chat/ChatPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// Import payment status component
import PaymentStatusWrapper from '@/components/payment/PaymentStatusWrapper';

// Import static page components
import AboutPage from '@/components/pages/AboutPage';
import SellFastPage from '@/components/pages/SellFastPage';
import StaySafePage from '@/components/pages/StaySafePage';
import TermsPage from '@/components/pages/TermsPage';
import PrivacyPage from '@/components/pages/PrivacyPage';
import FAQPage from '@/components/pages/FAQPage';
import ContactPage from '@/components/pages/ContactPage';
import MembershipPage from '@/components/pages/MembershipPage';
import BoostAdPage from '@/components/pages/BoostAdPage';

export default async function Home({ searchParams }: { searchParams: Promise<{ 
  ad?: string; 
  page?: string;
  browse?: string;
  dashboard?: string;
  saved?: string;
  chat?: string;
  post_ad?: string;
  category?: string;
  section?: string;
  payment?: string;
  message?: string;
  invoice_id?: string;
}> }) {
  const params = await searchParams;
  const adSlug = params.ad;
  const pageName = params.page;
  const isBrowse = params.browse === 'true';
  const isDashboard = params.dashboard === 'true';
  const isSaved = params.saved === 'true';
  const isChat = params.chat === 'true';
  const paymentStatus = params.payment;
  const paymentMessage = params.message;
  const invoiceId = params.invoice_id;

  // Static page mapping
  const staticPages: Record<string, React.ReactNode> = {
    'about': <AboutPage />,
    'sell-fast': <SellFastPage />,
    'stay-safe': <StaySafePage />,
    'terms': <TermsPage />,
    'privacy': <PrivacyPage />,
    'faq': <FAQPage />,
    'contact': <ContactPage />,
    'membership': <MembershipPage />,
    'boost-ad': <BoostAdPage />,
  };

  // If page parameter is present, show static page
  if (pageName && staticPages[pageName]) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          {staticPages[pageName]}
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch categories with ad counts
  const categories = await db.category.findMany({
    where: {
      parentId: null,
      isActive: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
    include: {
      _count: {
        select: {
          ads: {
            where: { status: 'active' },
          },
        },
      },
    },
  });

  // Fetch featured ads
  const featuredAds = await db.ad.findMany({
    where: {
      status: 'active',
      isFeatured: true,
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      category: {
        select: { nameEn: true, nameBn: true },
      },
      user: {
        select: { id: true, fullName: true, role: true, isVerified: true },
      },
    },
  });

  // Fetch latest ads
  const latestAds = await db.ad.findMany({
    where: {
      status: 'active',
    },
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      category: {
        select: { nameEn: true, nameBn: true },
      },
      user: {
        select: { id: true, fullName: true, role: true, isVerified: true },
      },
    },
  });

  // If ad parameter is present, show ad detail page
  if (adSlug) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-4 sm:py-6 pb-20 lg:pb-4">
          <AdDetailPage slug={adSlug} />
        </main>
        <Footer />
      </div>
    );
  }

  // If browse page
  if (isBrowse) {
    // Get category if specified
    let category: Awaited<ReturnType<typeof db.category.findFirst>> = null;
    if (params.category) {
      category = await db.category.findFirst({
        where: { slug: params.category },
        include: { parent: true },
      });
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <BrowsePage 
            initialCategory={category || undefined}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // If saved ads page
  if (isSaved) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-4 sm:py-6 pb-20 lg:pb-4">
          <div className="container mx-auto px-4">
            <SavedAds />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If dashboard page
  if (isDashboard) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <DashboardPage />
        </main>
        <Footer />
      </div>
    );
  }

  // If chat page
  if (isChat) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <ChatPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Default homepage
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      {/* Post Ad Wizard Modal */}
      <Suspense fallback={null}>
        <PostAdWrapper />
      </Suspense>
      
      {/* Payment Status Modal */}
      {paymentStatus && (
        <Suspense fallback={null}>
          <PaymentStatusWrapper 
            status={paymentStatus as 'success' | 'error' | 'cancel' | 'callback'} 
            message={paymentMessage}
            invoiceId={invoiceId}
          />
        </Suspense>
      )}
      
      <main className="flex-1 pb-20 lg:pb-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
                  🖥️ PC Parts Marketplace
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Buy & Sell PC Parts in{' '}
                  <span className="text-emerald-400">Bangladesh</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                  The trusted marketplace for processors, graphics cards, motherboards, and all PC components. New & used parts at the best prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/?post-ad=true">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-full sm:w-auto"
                    >
                      Post Free Ad
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/?browse=true">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                    >
                      Browse All Parts
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-emerald-400">15K+</div>
                    <div className="text-slate-300">Active Listings</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-emerald-400">8K+</div>
                    <div className="text-slate-300">Trusted Sellers</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-emerald-400">16</div>
                    <div className="text-slate-300">PC Categories</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-emerald-400">64</div>
                    <div className="text-slate-300">Districts Covered</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4">
          <CategoryGrid categories={categories} />
        </section>

        {/* Featured Ads Section */}
        {featuredAds.length > 0 && (
          <section className="bg-slate-100 py-8">
            <div className="container mx-auto px-4">
              <FeaturedAds ads={featuredAds.map(ad => ({
                ...ad,
                isPriceNegotiable: true,
                condition: ad.condition || 'used',
              }))} />
            </div>
          </section>
        )}

        {/* Start Earning CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Start Earning Now!
                  </h2>
                  <p className="text-emerald-100 text-lg mb-6">
                    Have PC parts to sell? Post your first ad for free and start making money today. Reach thousands of buyers across Bangladesh.
                  </p>
                  <Link href="/?post-ad=true">
                    <Button
                      size="lg"
                      className="bg-white text-emerald-600 hover:bg-emerald-50"
                    >
                      Post Free Ad
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex justify-end">
                  <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
                    <Zap className="h-24 w-24 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Latest Ads Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Latest Ads</h2>
            <Link href="/?browse=true">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {latestAds.map((ad) => (
              <Link key={ad.id} href={`/?ad=${ad.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-emerald-300">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {ad.images[0]?.imageUrl ? (
                      <img
                        src={ad.images[0].imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Zap className="h-16 w-16" />
                      </div>
                    )}
                    {ad.isTopAd && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Top Ad</Badge>
                    )}
                    {ad.isUrgent && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">Urgent</Badge>
                    )}
                    {ad.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        +{ad.images.length} photos
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[48px]">
                      {ad.title}
                    </h3>
                    <p className="text-lg font-bold text-emerald-600 mt-2">
                      ৳ {ad.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {ad.locationArea || ad.locationDistrict || ad.locationDivision}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose PartsChai */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
              Why Choose PartsChai?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Safe Trading</h3>
                <p className="text-sm text-slate-600">
                  Verified sellers and secure transactions for peace of mind
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Fast Listing</h3>
                <p className="text-sm text-slate-600">
                  Post your ad in minutes and reach buyers instantly
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Large Community</h3>
                <p className="text-sm text-slate-600">
                  Connect with thousands of PC enthusiasts nationwide
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Best Prices</h3>
                <p className="text-sm text-slate-600">
                  Competitive prices on new and used PC components
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPUs */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                  Processors / CPUs
                  <Badge variant="secondary">1,234</Badge>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/?browse=true&category=processors-cpus" className="text-slate-600 hover:text-emerald-600">
                      Intel Processors
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=processors-cpus" className="text-slate-600 hover:text-emerald-600">
                      AMD Processors
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=processors-cpus" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View All →
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* GPUs */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                  Graphics Cards
                  <Badge variant="secondary">892</Badge>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/?browse=true&category=graphics-cards-gpus" className="text-slate-600 hover:text-emerald-600">
                      NVIDIA GPUs
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=graphics-cards-gpus" className="text-slate-600 hover:text-emerald-600">
                      AMD GPUs
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=graphics-cards-gpus" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View All →
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* RAM */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                  RAM & Memory
                  <Badge variant="secondary">567</Badge>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/?browse=true&category=ram-memory" className="text-slate-600 hover:text-emerald-600">
                      DDR4 RAM
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=ram-memory" className="text-slate-600 hover:text-emerald-600">
                      DDR5 RAM
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=ram-memory" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View All →
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Monitors */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                  Monitors
                  <Badge variant="secondary">423</Badge>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/?browse=true&category=monitors" className="text-slate-600 hover:text-emerald-600">
                      Gaming Monitors
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=monitors" className="text-slate-600 hover:text-emerald-600">
                      4K Monitors
                    </Link>
                  </li>
                  <li>
                    <Link href="/?browse=true&category=monitors" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View All →
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
