import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
interface User {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  accountType: string;
  companyName?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'partschai-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Location Store
interface LocationState {
  division: string | null;
  district: string | null;
  area: string | null;
  setLocation: (division: string | null, district: string | null, area?: string | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      division: null,
      district: null,
      area: null,
      setLocation: (division, district, area = null) => set({ division, district, area }),
      clearLocation: () => set({ division: null, district: null, area: null }),
    }),
    {
      name: 'partschai-location',
    }
  )
);

// UI Store
interface UIState {
  isLoginModalOpen: boolean;
  loginModalTab: 'login' | 'register';
  isLocationModalOpen: boolean;
  isMobileMenuOpen: boolean;
  openLoginModal: (tab?: 'login' | 'register') => void;
  closeLoginModal: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoginModalOpen: false,
  loginModalTab: 'login',
  isLocationModalOpen: false,
  isMobileMenuOpen: false,
  openLoginModal: (tab = 'login') => set({ isLoginModalOpen: true, loginModalTab: tab }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openLocationModal: () => set({ isLocationModalOpen: true }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));

// Language Store
interface LanguageState {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'partschai-language',
    }
  )
);

// Saved Ads Store
interface SavedAdsState {
  savedAdIds: string[];
  addSavedAd: (adId: string) => void;
  removeSavedAd: (adId: string) => void;
  isSaved: (adId: string) => boolean;
}

export const useSavedAdsStore = create<SavedAdsState>()(
  persist(
    (set, get) => ({
      savedAdIds: [],
      addSavedAd: (adId) => set((state) => ({ savedAdIds: [...state.savedAdIds, adId] })),
      removeSavedAd: (adId) => set((state) => ({ savedAdIds: state.savedAdIds.filter((id) => id !== adId) })),
      isSaved: (adId) => get().savedAdIds.includes(adId),
    }),
    {
      name: 'partschai-saved-ads',
    }
  )
);
