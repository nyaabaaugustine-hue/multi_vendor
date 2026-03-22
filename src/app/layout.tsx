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
  title: "Ecommerce — Ghana's Secure Marketplace",
  description: 'Buy and sell safely across Ghana with escrow-protected transactions.',
  icons: {
    icon: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png',
  },
};

function Footer() {
  return (
    <footer className="bg-muted/30 text-foreground pt-24 pb-32 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-bold text-xl text-foreground tracking-tighter uppercase leading-none">
                ECOMMERCE
              </span>
              <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1 opacity-70">Sovereign Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Ghana's most secure multi-vendor intent engine. Buy and sell with total confidence through our integrated escrow system.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Marketplace</h4>
            <ul className="space-y-3">
              {['Laptops', 'Vehicles', 'Property', 'Fashion'].map((item) => (
                <li key={item}>
                  <Link href="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Safety Tips', 'Escrow Guide', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Connect</h4>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            © 2026 Ecommerce Inc. — Airport Residential Area, Accra
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
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
