'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Heart,
  MessageCircle,
  User,
  ChevronDown,
  Globe,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
  Store,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore, useUIStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LocationSelector from './LocationSelector';
import LoginModal from '@/components/auth/LoginModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openLoginModal, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePostAd = () => {
    if (!isAuthenticated) {
      openLoginModal('register');
    } else {
      router.push('/?post-ad=true');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white border-b transition-shadow ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        {/* Top Bar */}
        <div className="bg-slate-900 text-white py-1.5 px-4 text-sm hidden md:block">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-slate-300">PartsChai.com - PC Parts Marketplace Bangladesh</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl px-3 py-1.5 rounded-lg">
                PC
              </div>
              <span className="font-bold text-xl hidden sm:block text-slate-800">
                Parts<span className="text-emerald-600">Chai</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for PC parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-emerald-600"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link href="/?browse=true">
                <Button variant="ghost" className="text-slate-600 hover:text-emerald-600">
                  {t.allAds}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/?chat=true">
                    <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-emerald-600">
                      <MessageCircle className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 text-white text-xs">
                        3
                      </Badge>
                    </Button>
                  </Link>
                  <Link href="/?saved=true">
                    <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-emerald-600">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatarUrl || ''} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {user?.fullName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden xl:inline">{user?.fullName?.split(' ')[0]}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="font-medium">{user?.fullName}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                        {user?.role === 'member' && (
                          <Badge className="mt-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            {t.member}
                          </Badge>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/?dashboard=true" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          {t.dashboard}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/?dashboard=my-ads" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {t.myAds}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/?shop=true" className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          {t.myShop}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/?settings=true" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {t.settings}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => logout()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t.logout}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => openLoginModal('login')}
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    {t.login}
                  </Button>
                  <Button
                    onClick={() => openLoginModal('register')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {t.register}
                  </Button>
                </>
              )}

              <Button
                onClick={handlePostAd}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white ml-2"
              >
                {t.postFreeAd}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {isAuthenticated && (
                <Link href="/?chat=true">
                  <Button variant="ghost" size="icon" className="relative text-slate-600">
                    <MessageCircle className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 text-white text-xs">
                      3
                    </Badge>
                  </Button>
                </Link>
              )}
              <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-600">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <MobileMenu
                    language={language}
                    setLanguage={setLanguage}
                    t={t}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    logout={logout}
                    openLoginModal={openLoginModal}
                    handlePostAd={handlePostAd}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Location Bar */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="container mx-auto px-4 py-2">
            <LocationSelector />
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal />
    </>
  );
}

// Mobile Menu Component
function MobileMenu({
  language,
  setLanguage,
  t,
  isAuthenticated,
  user,
  logout,
  openLoginModal,
  handlePostAd,
}: {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  t: typeof translations.en;
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  openLoginModal: (tab: 'login' | 'register') => void;
  handlePostAd: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* User Section */}
      <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback className="bg-emerald-400 text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.fullName}</p>
              <p className="text-sm text-emerald-100">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-lg">Welcome to PartsChai</p>
            <p className="text-sm text-emerald-100">Buy & Sell PC Parts in Bangladesh</p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search PC parts..."
            className="w-full pr-10 bg-slate-50"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
        >
          <Package className="h-5 w-5 text-emerald-600" />
          {t.allAds}
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link
              href="/?dashboard=true"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <LayoutDashboard className="h-5 w-5 text-emerald-600" />
              {t.dashboard}
            </Link>
            <Link
              href="/?dashboard=my-ads"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <Package className="h-5 w-5 text-emerald-600" />
              {t.myAds}
            </Link>
            <Link
              href="/?saved=true"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <Heart className="h-5 w-5 text-emerald-600" />
              {t.savedAds}
            </Link>
            <Link
              href="/?settings=true"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <Settings className="h-5 w-5 text-emerald-600" />
              {t.settings}
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => openLoginModal('login')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <User className="h-5 w-5 text-emerald-600" />
              {t.login}
            </button>
            <button
              onClick={() => openLoginModal('register')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <User className="h-5 w-5 text-emerald-600" />
              {t.register}
            </button>
          </>
        )}

        <div className="pt-4 border-t mt-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 w-full"
          >
            <Globe className="h-5 w-5 text-emerald-600" />
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          onClick={handlePostAd}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
        >
          {t.postFreeAd}
        </Button>
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={logout}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        )}
      </div>
    </div>
  );
}
