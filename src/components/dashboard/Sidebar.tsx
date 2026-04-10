'use client';

import { useState } from 'react';
import {
  FileText,
  PlusCircle,
  MessageSquare,
  Heart,
  Bookmark,
  User,
  Crown,
  Store,
  BarChart3,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguageStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'my-ads', icon: FileText, key: 'myAds' },
  { id: 'post-ad', icon: PlusCircle, key: 'postFreeAd' },
  { id: 'messages', icon: MessageSquare, key: 'messages' },
  { id: 'saved-ads', icon: Heart, key: 'savedAds' },
  { id: 'saved-searches', icon: Bookmark, key: 'savedSearches' },
  { id: 'settings', icon: User, key: 'settings' },
  { id: 'membership', icon: Crown, key: 'membership' },
  { id: 'my-shop', icon: Store, key: 'myShop', memberOnly: true },
  { id: 'analytics', icon: BarChart3, key: 'analytics', memberOnly: true },
  { id: 'help', icon: HelpCircle, key: 'helpSupport' },
];

// Define SidebarContent as a separate component outside of Sidebar
interface SidebarContentProps {
  isCollapsed: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

function SidebarContent({ isCollapsed, activeSection, onSectionChange, onLogout }: SidebarContentProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();
  const isMember = user?.role === 'member' || user?.role === 'admin';

  return (
    <div className="flex flex-col h-full">
      {/* User Profile */}
      <div className={cn(
        'p-4 border-b border-slate-200',
        isCollapsed ? 'items-center' : ''
      )}>
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-10 w-10 border-2 border-emerald-200">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email}
              </p>
              {isMember && (
                <Badge className="mt-1 bg-amber-100 text-amber-700 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {t.member}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.memberOnly && !isMember) return null;

            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-emerald-600')} />
                {!isCollapsed && (
                  <span className="truncate">
                    {t[item.key as keyof typeof t]}
                    {item.id === 'membership' && !isMember && (
                      <Badge className="ml-2 bg-amber-100 text-amber-700 text-xs">
                        {t.upgradeToMember?.toString().split(' ')[0] || 'Upgrade'}
                      </Badge>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>{t.logout}</span>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 h-[calc(100vh-64px)] sticky top-16',
          isCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')} />
        </button>

        <SidebarContent 
          isCollapsed={isCollapsed}
          activeSection={activeSection}
          onSectionChange={(section) => {
            onSectionChange(section);
          }}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed bottom-4 left-4 z-50 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg rounded-full h-12 w-12"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent 
            isCollapsed={false}
            activeSection={activeSection}
            onSectionChange={(section) => {
              onSectionChange(section);
              setIsMobileOpen(false);
            }}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
