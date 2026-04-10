'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Home,
  Search,
  PlusCircle,
  Heart,
  User,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore, useSavedAdsStore } from '@/lib/store';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useUIStore();
  const { savedAdIds } = useSavedAdsStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePostAdClick = () => {
    if (!isAuthenticated) {
      openLoginModal('register');
    } else {
      router.push('/?post-ad=true');
    }
  };

  const handleProtectedClick = (path: string) => {
    if (!isAuthenticated) {
      openLoginModal('login');
    } else {
      router.push(path);
    }
  };

  // Determine active state
  const isHome = !searchParams.get('browse') && !searchParams.get('ad') && !searchParams.get('dashboard');
  const isBrowse = searchParams.get('browse') === 'true';
  const isSaved = searchParams.get('saved') === 'true';
  const isChat = searchParams.get('chat') === 'true';
  const isDashboard = searchParams.get('dashboard') === 'true';

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      isActive: isHome,
      href: '/',
    },
    {
      icon: Search,
      label: 'Browse',
      isActive: isBrowse,
      href: '/?browse=true',
    },
    {
      icon: PlusCircle,
      label: 'Post',
      isActive: false,
      onClick: handlePostAdClick,
      isPrimary: true,
    },
    {
      icon: Heart,
      label: 'Saved',
      isActive: isSaved,
      onClick: () => handleProtectedClick('/?saved=true'),
      badge: savedAdIds.length > 0 ? savedAdIds.length : undefined,
    },
    {
      icon: User,
      label: 'Account',
      isActive: isDashboard || isChat,
      onClick: () => handleProtectedClick('/?dashboard=true&section=my-ads'),
    },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'bg-white border-t border-slate-200',
        'transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      {/* Safe area padding for iOS */}
      <div className="h-[calc(60px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around h-full px-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            
            if (item.isPrimary) {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-[10px] text-slate-600 mt-1 font-medium">
                    {item.label}
                  </span>
                </button>
              );
            }

            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 min-w-[60px]',
                    'transition-colors duration-200'
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        'h-6 w-6 transition-colors',
                        item.isActive ? 'text-emerald-600' : 'text-slate-400'
                      )}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 font-medium transition-colors',
                      item.isActive ? 'text-emerald-600' : 'text-slate-500'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 min-w-[60px]',
                  'transition-colors duration-200'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors',
                      item.isActive ? 'text-emerald-600' : 'text-slate-400'
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1 font-medium transition-colors',
                    item.isActive ? 'text-emerald-600' : 'text-slate-500'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
