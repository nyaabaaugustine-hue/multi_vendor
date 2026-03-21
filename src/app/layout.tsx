// ROOT LAYOUT — Server Component
// dynamic() with ssr:false lives in <ClientWidgets> (a "use client" file).
// This file stays a pure Server Component for maximum SSR performance.

import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProviderWrapper } from '@/components/providers';
import { Navbar } from '@/components/navbar';
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
};

function Footer() {
  return (
    <footer className="bg-white dark:bg-background text-foreground pt-16 pb-12 border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 mb-16 text-xs md:text-sm font-black text-secondary uppercase tracking-widest">
          {['Help', 'Safety', 'Terms of use', 'Privacy Policy', 'About', 'Vendors', 'Contact'].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(/ /g, '-')}`}
              className="hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="pt-12 border-t border-dashed border-secondary/20 flex flex-col items-center gap-10">
          <p className="text-[11px] md:text-xs font-black text-secondary text-center uppercase tracking-[0.3em] leading-relaxed">
            © 2026 Ecommerce Inc. — Airport Residential Area, Accra, Ghana — 00233-GH-ACC
          </p>
          <div className="flex items-center gap-6">
            {[Facebook, Instagram, Youtube, Linkedin, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-10 w-10 bg-secondary rounded-none flex items-center justify-center hover:bg-primary transition-all text-white hover:scale-110 duration-200"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
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
          <Footer />
          <Toaster />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
