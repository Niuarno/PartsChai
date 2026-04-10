'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLanguageStore, useLocationStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import AdCard from '@/components/ads/AdCard';
import FilterSidebar, { FilterState } from './FilterSidebar';

interface Category {
  id: string;
  nameEn: string;
  nameBn: string | null;
  slug: string;
  parentId: string | null;
  parent?: {
    nameEn: string;
    nameBn: string | null;
    slug: string;
  } | null;
}

interface Ad {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPriceNegotiable: boolean;
  condition: string;
  locationArea?: string;
  locationDistrict?: string;
  locationDivision?: string;
  createdAt: string;
  isFeatured: boolean;
  isUrgent: boolean;
  isTopAd: boolean;
  images: { imageUrl: string; isPrimary: boolean }[];
  user: {
    id: string;
    fullName?: string;
    role: string;
    isVerified?: boolean;
  };
  category: {
    nameEn: string;
    nameBn?: string;
  };
}

interface BrowsePageProps {
  initialCategory?: Category;
  initialAds?: Ad[];
  initialTotal?: number;
  initialPage?: number;
}

const defaultFilters: FilterState = {
  division: '',
  district: '',
  area: '',
  minPrice: '',
  maxPrice: '',
  condition: 'all',
  adType: 'all',
  brands: [],
};

export default function BrowsePage({
  initialCategory,
  initialAds = [],
  initialTotal = 0,
  initialPage = 1,
}: BrowsePageProps) {
  const { language } = useLanguageStore();
  const { division: storedDivision, district: storedDistrict } = useLocationStore();
  const t = translations[language];
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [totalAds, setTotalAds] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    division: storedDivision || '',
    district: storedDistrict || '',
  });

  const categorySlug = searchParams.get('category');
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const totalPages = Math.ceil(totalAds / limit);

  // Fetch ads when filters/sort/page change
  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (categorySlug) params.set('category', categorySlug);
      if (query) params.set('q', query);
      if (filters.division) params.set('division', filters.division);
      if (filters.district) params.set('district', filters.district);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.condition && filters.condition !== 'all') params.set('condition', filters.condition);
      if (filters.adType === 'featured') params.set('featured', 'true');
      if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
      params.set('sort', sortBy);
      params.set('page', currentPage.toString());
      params.set('limit', limit.toString());

      const response = await fetch(`/api/ads?${params.toString()}`);
      const data = await response.json();
      
      setAds(data.ads || []);
      setTotalAds(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, query, filters, sortBy, currentPage]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Update URL with filters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (categorySlug) params.set('category', categorySlug);
    if (query) params.set('q', query);
    if (filters.division) params.set('division', filters.division);
    if (filters.district) params.set('district', filters.district);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.condition && filters.condition !== 'all') params.set('condition', filters.condition);
    if (filters.adType === 'featured') params.set('featured', 'true');
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    params.set('browse', 'true');

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [categorySlug, query, filters, sortBy, currentPage, router]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateUrl();
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', searchQuery.trim());
      params.set('browse', 'true');
      router.push(`/?${params.toString()}`);
    }
  };

  // Get category name
  const getCategoryName = () => {
    if (initialCategory) {
      return language === 'bn' && initialCategory.nameBn 
        ? initialCategory.nameBn 
        : initialCategory.nameEn;
    }
    return t.allAds;
  };

  // Get location name
  const getLocationName = () => {
    if (filters.district) return filters.district;
    if (filters.division) return filters.division;
    return t.allOfBangladesh;
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    return pages;
  };

  // Active filters count
  const activeFilterCount = () => {
    let count = 0;
    if (filters.division) count++;
    if (filters.district) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.condition && filters.condition !== 'all') count++;
    if (filters.adType && filters.adType !== 'all') count++;
    if (filters.brands.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-600 hover:text-emerald-600">
                  {t.home}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {initialCategory?.parent && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={`/?browse=true&category=${initialCategory.parent.slug}`}
                      className="text-slate-600 hover:text-emerald-600"
                    >
                      {language === 'bn' && initialCategory.parent.nameBn 
                        ? initialCategory.parent.nameBn 
                        : initialCategory.parent.nameEn}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-800 font-medium">
                  {getCategoryName()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                categorySlug={categorySlug || undefined}
              />
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">
                      {totalAds.toLocaleString()} {t.ads} in {getCategoryName()}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      {t.location}: {getLocationName()}
                    </p>
                  </div>
                  
                  {/* Mobile Filter Button */}
                  <div className="flex items-center gap-3 lg:hidden">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="relative">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          {t.filter}
                          {activeFilterCount() > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 text-white text-xs">
                              {activeFilterCount()}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-0">
                        <SheetHeader className="sr-only">
                          <SheetTitle>{t.filter}</SheetTitle>
                        </SheetHeader>
                        <FilterSidebar
                          filters={filters}
                          onFiltersChange={setFilters}
                          onApply={handleApplyFilters}
                          onClear={handleClearFilters}
                          categorySlug={categorySlug || undefined}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={language === 'bn' ? 'বিজ্ঞাপন খুঁজুন...' : 'Search ads...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3"
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </form>
                  
                  <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder={t.sort} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t.newestFirst}</SelectItem>
                        <SelectItem value="oldest">{t.oldestFirst}</SelectItem>
                        <SelectItem value="price-low">{t.priceLowToHigh}</SelectItem>
                        <SelectItem value="price-high">{t.priceHighToLow}</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Toggle */}
                    <div className="hidden sm:flex items-center border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          'rounded-none rounded-l-md',
                          viewMode === 'grid' && 'bg-emerald-600 hover:bg-emerald-700'
                        )}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={cn(
                          'rounded-none rounded-r-md',
                          viewMode === 'list' && 'bg-emerald-600 hover:bg-emerald-700'
                        )}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount() > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-slate-500">Active filters:</span>
                    {filters.division && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        {filters.division}
                        <button onClick={() => setFilters({ ...filters, division: '', district: '' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.district && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        {filters.district}
                        <button onClick={() => setFilters({ ...filters, district: '' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.minPrice && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        Min: ৳{parseInt(filters.minPrice).toLocaleString()}
                        <button onClick={() => setFilters({ ...filters, minPrice: '' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.maxPrice && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        Max: ৳{parseInt(filters.maxPrice).toLocaleString()}
                        <button onClick={() => setFilters({ ...filters, maxPrice: '' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.condition && filters.condition !== 'all' && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        {filters.condition === 'new' ? t.new : t.used}
                        <button onClick={() => setFilters({ ...filters, condition: 'all' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.adType === 'featured' && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        {t.featured}
                        <button onClick={() => setFilters({ ...filters, adType: 'all' })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.brands.map(brand => (
                      <Badge key={brand} variant="secondary" className="bg-emerald-50 text-emerald-700 gap-1">
                        {brand}
                        <button onClick={() => setFilters({ 
                          ...filters, 
                          brands: filters.brands.filter(b => b !== brand) 
                        })}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                    >
                      {t.clearAll}
                    </Button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className={cn(
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                )}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                      {viewMode === 'grid' ? (
                        <>
                          <Skeleton className="aspect-[4/3] w-full" />
                          <div className="p-3 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </>
                      ) : (
                        <div className="flex">
                          <Skeleton className="w-48 h-36" />
                          <div className="flex-1 p-4 space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-6 w-1/4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : ads.length > 0 ? (
                <>
                  {/* Ad Listings */}
                  <div className={cn(
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                  )}>
                    {ads.map((ad) => (
                      <AdCard 
                        key={ad.id} 
                        ad={ad} 
                        variant={viewMode} 
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                          <Button
                            key={index}
                            variant={currentPage === page ? 'default' : 'outline'}
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              'min-w-10',
                              currentPage === page && 'bg-emerald-600 hover:bg-emerald-700'
                            )}
                          >
                            {page}
                          </Button>
                        ) : (
                          <span key={index} className="px-2 text-slate-400">...</span>
                        )
                      ))}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Results Info */}
                  <div className="text-center text-sm text-slate-500 mt-4">
                    Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalAds)} of {totalAds.toLocaleString()} results
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{t.noAdsFound}</h3>
                  <p className="text-slate-500 mb-6">{t.tryDifferentSearch}</p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    {t.clearAll} {t.filter}
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
