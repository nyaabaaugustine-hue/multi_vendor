// ROOT LAYOUT — Server Component
// dynamic() with ssr:false lives in <ClientWidgets> (a "use client" file).
// This file stays a pure Server Component for maximum SSR performance.

import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProviderWrapper } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { FloatingNav } from '@/components/floating-nav';
import { Toaster } from '@/components/ui/toaster';
import { ClientWidgets } from '@/components/client-widgets';
import Link from 'next/link';
import { Facebook, Youtube, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: "VaultCommerce — Ghana's Premier Secure Buy Marketplace",
  description: 'The definitive multi-vendor platform for high-value assets in Ghana. Buy and sell safely with professional escrow-protected transactions and Secure Buy protocols.',
  keywords: ['marketplace', 'Ghana', 'escrow', 'secure buy', 'ecommerce', 'Accra', 'high-value assets', 'verified vendors'],
  authors: [{ name: 'VaultCommerce Engineering' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'VaultCommerce — Secure Marketplace',
    description: "Ghana's most trusted escrow-protected platform.",
    url: 'https://vaultcommerce.com',
    siteName: 'VaultCommerce',
    images: [
      {
        url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png',
        width: 1200,
        height: 630,
        alt: 'VaultCommerce Secure Buy',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultCommerce — Secure Marketplace',
    description: "Ghana's most trusted escrow-protected platform.",
    images: ['https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png'],
  },
  icons: {
    icon: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png',
  },
};

function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-32 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white tracking-tighter uppercase leading-none italic">
                VAULT<span className="text-amber-600">COMMERCE</span>
              </span>
              <span className="text-[9px] font-black text-amber-600/60 uppercase tracking-[0.3em] mt-2">Secure Buy Marketplace</span>
            </div>
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest leading-relaxed max-w-xs">
              Ghana's premier multi-vendor node. Every transaction is protected by our professional Secure Buy protocol.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Registry</h4>
            <ul className="space-y-3">
              {['Laptops', 'Vehicles', 'Real Estate', 'Assets'].map((item) => (
                <li key={item}>
                  <Link href="/listings" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-amber-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Protocol</h4>
            <ul className="space-y-3">
              {['Safety Node', 'Escrow Briefing', 'Terms of Use', 'Partner Application'].map((item) => (
                <li key={item}>
                  <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-amber-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Connect</h4>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-12 w-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-xl group">
                  <Icon className="h-4 w-4 text-white/40 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
            © 2026 VaultCommerce — Registry Node: Airport Residential, Accra
          </p>
          <div className="flex gap-10">
            <Link href="/terms" className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-amber-600 transition-colors">Privacy Node</Link>
            <Link href="/terms" className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-amber-600 transition-colors">Service Protocol</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakarta.variable}>
      <head>
        <link
          rel="icon"
          href="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png"
        />
      </head>
      <body
        className={`antialiased bg-background min-h-screen flex flex-col text-secondary m-0 p-0 ${plusJakarta.className}`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AuthProviderWrapper>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          {/* All ssr:false widgets live in this client boundary */}
          <ClientWidgets />
          <FloatingNav />
          <Footer />
          <Toaster />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
