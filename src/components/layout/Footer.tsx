'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Learn More */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.learnMore}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?page=sell-fast" className="hover:text-emerald-400 transition-colors">
                  {t.sellFast}
                </Link>
              </li>
              <li>
                <Link href="/?page=membership" className="hover:text-emerald-400 transition-colors">
                  {t.membership}
                </Link>
              </li>
              <li>
                <Link href="/?page=advertising" className="hover:text-emerald-400 transition-colors">
                  {t.bannerAdvertising}
                </Link>
              </li>
              <li>
                <Link href="/?page=boost-ad" className="hover:text-emerald-400 transition-colors">
                  {t.adBoost}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.helpSupport}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?page=faq" className="hover:text-emerald-400 transition-colors">
                  {t.faq}
                </Link>
              </li>
              <li>
                <Link href="/?page=stay-safe" className="hover:text-emerald-400 transition-colors">
                  {t.staySafe}
                </Link>
              </li>
              <li>
                <Link href="/?page=contact" className="hover:text-emerald-400 transition-colors">
                  {t.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.aboutUs}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?page=about" className="hover:text-emerald-400 transition-colors">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/?page=careers" className="hover:text-emerald-400 transition-colors">
                  {t.careers}
                </Link>
              </li>
              <li>
                <Link href="/?page=terms" className="hover:text-emerald-400 transition-colors">
                  {t.termsPolicies}
                </Link>
              </li>
              <li>
                <Link href="/?page=privacy" className="hover:text-emerald-400 transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/?page=sitemap" className="hover:text-emerald-400 transition-colors">
                  {t.sitemap}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.contactUs}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">support@partschai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/partschai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/partschai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/partschai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/partschai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Download PartsChai App</h4>
              <p className="text-sm text-slate-400">Get the best experience on mobile</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg px-4 py-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 2.318L12 11.957 6.477 2.318H.85l7.59 13.21L.85 28.74h5.627L12 19.1l5.523 9.638h5.627l-7.59-13.212 7.59-13.208h-5.627z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">GET IT ON</div>
                  <div className="text-sm font-medium text-white">Google Play</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg px-4 py-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">Download on the</div>
                  <div className="text-sm font-medium text-white">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <p>
              © {currentYear} {t.allRightsReserved}. PartsChai.com
            </p>
            <div className="flex items-center gap-4">
              <Link href="/?page=terms" className="hover:text-emerald-400 transition-colors">
                {t.termsPolicies}
              </Link>
              <Link href="/?page=privacy" className="hover:text-emerald-400 transition-colors">
                {t.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
