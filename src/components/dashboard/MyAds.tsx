'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MoreVertical,
  Edit,
  Trash2,
  ArrowUp,
  Share2,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import BoostModal from '@/components/boost/BoostModal';

interface Ad {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPriceNegotiable: boolean;
  condition: string;
  locationDivision?: string;
  locationDistrict?: string;
  locationArea?: string;
  status: string;
  viewCount: number;
  createdAt: string;
  category: {
    nameEn: string;
    nameBn?: string;
  };
  images: { imageUrl: string; isPrimary: boolean }[];
}

export default function MyAds() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedAdForBoost, setSelectedAdForBoost] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAds();
  }, [user]);

  const fetchAds = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/me/ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkSold = async (adId: string) => {
    try {
      const res = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
      if (res.ok) {
        fetchAds();
      }
    } catch (error) {
      console.error('Failed to mark as sold:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdId) return;
    try {
      const res = await fetch(`/api/ads/${selectedAdId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAds();
      }
    } catch (error) {
      console.error('Failed to delete ad:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAdId(null);
    }
  };

  const handleBoost = (ad: Ad) => {
    setSelectedAdForBoost(ad);
    setBoostModalOpen(true);
  };

  const handleShare = (ad: Ad) => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        url: `${window.location.origin}/?ad=${ad.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/?ad=${ad.slug}`);
    }
  };

  const filterAds = (status: string) => {
    switch (status) {
      case 'active':
        return ads.filter((ad) => ad.status === 'active');
      case 'pending':
        return ads.filter((ad) => ad.status === 'pending_review');
      case 'expired':
        return ads.filter((ad) => ad.status === 'expired');
      case 'sold':
        return ads.filter((ad) => ad.status === 'sold');
      default:
        return ads;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { label: t.active, className: 'bg-emerald-100 text-emerald-700' },
      pending_review: { label: t.pending, className: 'bg-amber-100 text-amber-700' },
      expired: { label: t.expired, className: 'bg-slate-100 text-slate-600' },
      sold: { label: t.sold, className: 'bg-blue-100 text-blue-700' },
      rejected: { label: t.rejected, className: 'bg-red-100 text-red-700' },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD').format(price);
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays < 1) return t.justNow;
    if (diffInDays < 7) return `${diffInDays} ${t.daysAgo}`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} ${t.weeksAgo}`;
    return `${Math.floor(diffInDays / 30)} ${t.monthsAgo}`;
  };

  const tabs = [
    { id: 'active', label: t.active, count: filterAds('active').length },
    { id: 'pending', label: t.pending, count: filterAds('pending').length },
    { id: 'expired', label: t.expired, count: filterAds('expired').length },
    { id: 'sold', label: t.sold, count: filterAds('sold').length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const filteredAds = filterAds(activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{t.myAds}</h2>
        <Link href="/?post-ad=true">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t.postFreeAd}
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="relative">
              {tab.label}
              {tab.count > 0 && (
                <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center text-xs">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            {filteredAds.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">
                    {tab.id === 'active' && "You don't have any active ads yet"}
                    {tab.id === 'pending' && 'No pending ads'}
                    {tab.id === 'expired' && 'No expired ads'}
                    {tab.id === 'sold' && 'No sold items'}
                  </p>
                  {tab.id === 'active' && (
                    <Link href="/?post-ad=true">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        {t.postFreeAd}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredAds.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    language={language}
                    t={t}
                    getStatusBadge={getStatusBadge}
                    formatPrice={formatPrice}
                    getTimeAgo={getTimeAgo}
                    onMarkSold={handleMarkSold}
                    onDelete={() => {
                      setSelectedAdId(ad.id);
                      setDeleteDialogOpen(true);
                    }}
                    onBoost={handleBoost}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ad? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Boost Modal */}
      {selectedAdForBoost && user && (
        <BoostModal
          isOpen={boostModalOpen}
          onClose={() => {
            setBoostModalOpen(false);
            setSelectedAdForBoost(null);
          }}
          adId={selectedAdForBoost.id}
          adTitle={selectedAdForBoost.title}
          userId={user.id}
          userEmail={user.email}
          userName={user.fullName || 'User'}
        />
      )}
    </div>
  );
}

// Ad Card Component
interface AdCardProps {
  ad: Ad;
  language: 'en' | 'bn';
  t: typeof translations.en;
  getStatusBadge: (status: string) => JSX.Element;
  formatPrice: (price: number) => string;
  getTimeAgo: (dateStr: string) => string;
  onMarkSold: (adId: string) => void;
  onDelete: () => void;
  onBoost: (ad: Ad) => void;
  onShare: (ad: Ad) => void;
}

function AdCard({
  ad,
  language,
  t,
  getStatusBadge,
  formatPrice,
  getTimeAgo,
  onMarkSold,
  onDelete,
  onBoost,
  onShare,
}: AdCardProps) {
  const primaryImage = ad.images.find((img) => img.isPrimary)?.imageUrl || ad.images[0]?.imageUrl;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-slate-100">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
            {ad.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                +{ad.images.length}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(ad.status)}
                  {ad.condition === 'new' && (
                    <Badge className="bg-teal-100 text-teal-700">{t.new}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 line-clamp-1">{ad.title}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {language === 'en' ? ad.category.nameEn : ad.category.nameBn || ad.category.nameEn}
                  {' • '}
                  {ad.locationArea || ad.locationDistrict || ad.locationDivision}
                </p>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-5 w-5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/?edit-ad=${ad.id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      {t.edit}
                    </Link>
                  </DropdownMenuItem>
                  {ad.status === 'active' && (
                    <DropdownMenuItem onClick={() => onMarkSold(ad.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.markAsSold}
                    </DropdownMenuItem>
                  )}
                  {ad.status === 'expired' && (
                    <DropdownMenuItem>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t.renew}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onBoost(ad)}>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    {t.boost}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare(ad)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {t.share}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Price & Stats */}
            <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
              <p className="text-lg font-bold text-emerald-600">
                ৳ {formatPrice(ad.price)}
                {ad.isPriceNegotiable && (
                  <span className="text-sm font-normal text-slate-500 ml-1">({t.negotiable})</span>
                )}
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {ad.viewCount} {t.views}
                </span>
                <span>{getTimeAgo(ad.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
