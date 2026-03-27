"use client";

import dynamic from 'next/dynamic';

const SpotlightCategories = dynamic(() => import('@/components/spotlight-categories').then(mod => mod.SpotlightCategories), { ssr: false });
const TipsSection = dynamic(() => import('@/components/tips-section').then(mod => mod.TipsSection), { ssr: false });
const BenefitsSection = dynamic(() => import('@/components/benefits-section').then(mod => mod.BenefitsSection), { ssr: false });

import { useMemo, Suspense, useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListingCard } from '@/components/listing-card';
import { HighFidelityListingCard } from '@/components/high-fidelity-listing-card';
import { CategoryBar } from '@/components/category-bar';
import { PrivacyPopup } from '@/components/privacy-popup';
import { FooterTabs } from '@/components/footer-tabs';
import { NewsletterPopup } from '@/components/newsletter-popup';
import { LISTINGS, VENDORS } from '@/lib/mock-data';
import { useSearch } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight, Star, SearchX, Search, ShieldCheck,
  UserCheck, Zap, TrendingUp, Globe2, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

/* ─── Intersection-observer hook for scroll-in animations ─── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View Full Registry",
}: {
  title: string;
  subtitle: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex justify-between items-end gap-4">
      <div className="border-l-4 border-primary pl-4 space-y-1 min-w-0">
        <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
          <span className="text-foreground/25">(</span>
          {title}
          <span className="text-foreground/25">)</span>
        </h2>
        <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          {subtitle}
        </p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-black text-primary uppercase tracking-widest shrink-0 group hover:underline underline-offset-4"
      >
        {linkLabel}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

/* ─── Live trust ticker ─── */
const TRUST_ITEMS = [
  '🔒 256-bit escrow encryption',
  '✅ 4,200+ verified vendors',
  '⚡ Instant fund release on delivery',
  '🏆 GHS 92M+ secured in escrow',
  '📦 Free buyer protection on all orders',
  '🌍 Serving all 16 regions of Ghana',
  '💬 24/7 dispute resolution team',
  '🔒 256-bit escrow encryption',
  '✅ 4,200+ verified vendors',
  '⚡ Instant fund release on delivery',
  '🏆 GHS 92M+ secured in escrow',
  '📦 Free buyer protection on all orders',
  '🌍 Serving all 16 regions of Ghana',
  '💬 24/7 dispute resolution team',
];

/* ─── Live stats counter ─── */
function StatCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function HomePage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [heroInput, setHeroInput] = useState('');
  const parallaxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    if (parallaxRef.current) {
      const scrolled = window.scrollY;
      if (scrolled < 1000) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.28}px)`;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleHeroSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = heroInput.trim();
    if (!q) return;
    setSearchQuery(q);
    router.push(`/listings?q=${encodeURIComponent(q)}`);
  };

  const filteredListings = useMemo(() => {
    if (!searchQuery) return LISTINGS;
    const q = searchQuery.toLowerCase();
    return LISTINGS.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const eliteComputing    = useMemo(() => filteredListings.filter(l => l.subcategory === 'Laptops').slice(0, 5), [filteredListings]);
  const smartCommunication = useMemo(() => filteredListings.filter(l => l.subcategory === 'Mobiles').slice(0, 5), [filteredListings]);
  const premiumAutos      = useMemo(() => filteredListings.filter(l => l.category === 'Vehicles').slice(0, 5), [filteredListings]);
  const industrialAgro    = useMemo(() => filteredListings.filter(l => l.category === 'Agriculture').slice(0, 5), [filteredListings]);
  const heritageFashion   = useMemo(() => filteredListings.filter(l => l.category === 'Fashion').slice(0, 5), [filteredListings]);
  const corporateServices = useMemo(() => filteredListings.filter(l => l.category === 'Services').slice(0, 5), [filteredListings]);
  const eliteSports       = useMemo(() => filteredListings.filter(l => l.category === 'Sports').slice(0, 5), [filteredListings]);
  const luxuryProperty    = useMemo(() => filteredListings.filter(l => l.category === 'Property').slice(0, 5), [filteredListings]);

  const hasAnyResults = [
    eliteComputing, smartCommunication, premiumAutos,
    industrialAgro, heritageFashion, corporateServices,
    eliteSports, luxuryProperty,
  ].some(arr => arr.length > 0);

  return (
    <div className="flex flex-col bg-background min-h-screen pb-20 overflow-x-hidden transition-colors duration-500">
      <CategoryBar />

      {/* ─── HERO ─── */}
      <section className="relative w-full h-[640px] flex items-center justify-center bg-slate-900 overflow-hidden mb-0">
        {/* Parallax layer */}
        <div ref={parallaxRef} className="absolute -top-[20%] left-0 w-full h-[140%] z-0 pointer-events-none will-change-transform">
          {/* Brighter, warmer image — opacity raised to 0.55 */}
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover opacity-55 saturate-50 scale-105 transition-[filter] duration-[3000ms] ease-in-out hover:saturate-100"
            priority
          />
          {/* Lighter gradient — was via-slate-950/40, now /20 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          {/* Removed heavy radial overlay — use a soft vignette instead */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,rgba(15,23,42,0.55)_100%)]" />
        </div>

        {/* Subtle animated grid overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:60px_60px]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center space-y-7 animate-in fade-in zoom-in-95 duration-1000 slide-in-from-bottom-8">
          <div className="space-y-4 max-w-3xl">
            <Badge className="float-badge bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-5 py-1.5 h-7 rounded-full text-[9px] font-black uppercase tracking-[0.35em] shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              ✦ Trust Protocol Active ✦
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-[88px] font-black text-white tracking-tighter uppercase italic leading-[0.88] drop-shadow-2xl">
              The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-none">
                Secure
              </span>
              <br />
              Marketplace
            </h1>
            <p className="text-white/70 text-xs md:text-sm max-w-xl mx-auto font-semibold uppercase tracking-[0.18em] leading-relaxed drop-shadow">
              VaultCommerce protects your funds with institutional-grade escrow.{' '}
              <br className="hidden md:block" />
              Buy Electronics, Vehicles, and Property without risk.
            </p>
          </div>

          {/* SEARCH */}
          <form onSubmit={handleHeroSearch} className="w-full max-w-2xl relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-700" />
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-2 shadow-2xl">
              <Search className="h-5 w-5 text-white/60 ml-4 shrink-0" />
              <Input
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                placeholder="Search electronics, vehicles, property..."
                className="h-12 border-none bg-transparent text-white text-sm md:text-base placeholder:text-white/40 focus-visible:ring-0 font-semibold px-4"
              />
              <Button
                type="submit"
                className="h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest text-[10px] shadow-lg transition-all hover:shadow-amber-500/40 active:scale-95"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {['Electronics', 'Vehicles', 'Property', 'Fashion', 'Agriculture'].map(cat => (
              <button
                key={cat}
                onClick={() => { setSearchQuery(cat); router.push(`/listings?q=${encodeURIComponent(cat)}`); }}
                className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 md:gap-14 pt-2 text-white/50">
            {[
              { icon: ShieldCheck, label: 'Escrow Secured' },
              { icon: UserCheck, label: 'Verified Vendors' },
              { icon: Zap, label: 'Instant Release' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE TRUST TICKER ─── */}
      <div className="w-full bg-primary/95 border-b border-primary-foreground/10 overflow-hidden py-2.5 z-20 relative">
        <div className="animate-trust-ticker gap-16 items-center whitespace-nowrap">
          {TRUST_ITEMS.map((item, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/90 mr-16">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── LIVE STATS STRIP ─── */}
      <RevealSection className="w-full bg-muted/60 border-b border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
            {[
              { icon: TrendingUp, label: 'Active Listings', end: 18400, suffix: '+', color: 'text-amber-500' },
              { icon: UserCheck, label: 'Verified Vendors', end: 4200, suffix: '+', color: 'text-emerald-500' },
              { icon: Globe2, label: 'Regions Covered', end: 16, suffix: '', color: 'text-blue-500' },
              { icon: Award, label: 'Secured in Escrow', end: 92, prefix: 'GHS ', suffix: 'M+', color: 'text-purple-500' },
            ].map(({ icon: Icon, label, end, suffix, prefix, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-2 md:px-8">
                <Icon className={`h-6 w-6 ${color}`} />
                <p className={`text-3xl font-black tracking-tighter ${color}`}>
                  <StatCounter end={end} suffix={suffix} prefix={prefix} />
                </p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <SpotlightCategories />

      {/* Empty state */}
      {searchQuery && !hasAnyResults && (
        <div className="max-w-7xl mx-auto w-full px-4 py-24 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="h-20 w-20 bg-muted border border-border flex items-center justify-center rounded-2xl">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">No listings found</h2>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              No results for &ldquo;{searchQuery}&rdquo; in the registry
            </p>
          </div>
          <Button onClick={() => setSearchQuery('')} className="h-12 px-10 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-xl gap-2 hover:opacity-90 active:scale-95">
            Clear Search &amp; Browse All
          </Button>
        </div>
      )}

      {/* ─── ELITE COMPUTING ─── */}
      {eliteComputing.length > 0 && (
        <RevealSection className="w-full bg-muted/30 border-y border-primary/10 section-standard">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Most popular laptops" subtitle="Premium Hardware • ACCRA" href="/listings?category=Electronics" linkLabel="View All" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {eliteComputing.map((item, i) => (
                <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                  <HighFidelityListingCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── SMART COMMUNICATION ─── */}
      {smartCommunication.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader title="Most searched for mobiles" subtitle="Verified Smartphone Marketplace" href="/listings?category=Electronics" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {smartCommunication.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── PARTNER MARQUEE ─── */}
      <section className="bg-slate-950 section-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground font-black rounded-full uppercase text-[10px] tracking-[0.4em] px-6">Partner Directory</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">
                Verified <br />
                <span className="italic" style={{ background: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Partner Sellers
                </span>
              </h2>
            </div>
            <Link href="/vendors">
              <Button variant="outline" className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 font-black rounded-xl h-16 px-12 uppercase text-[11px] tracking-[0.3em] gap-3 transition-all">
                Enter Marketplace <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden relative group/marquee cursor-pointer">
            <div className="flex animate-marquee-slow gap-10 py-4 whitespace-nowrap hover:[animation-play-state:paused]">
              {[...VENDORS, ...VENDORS].map((vendor, idx) => (
                <div key={`${vendor.id}-${idx}`} className="bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all duration-500 min-w-[380px] md:min-w-[440px] rounded-2xl overflow-hidden flex flex-col shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image src={vendor.bgUrl} alt={vendor.name} fill className="object-cover opacity-50 contrast-[1.1]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-6 left-8 flex items-end gap-6">
                      <div className="relative h-20 w-20 bg-white border-2 border-amber-500 shadow-2xl p-2 rounded-xl">
                        <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-contain p-1" unoptimized />
                      </div>
                      <div className="pb-1 text-left whitespace-normal">
                        <Badge className="bg-amber-500 text-slate-950 rounded-full font-black text-[8px] uppercase tracking-widest mb-2">PARTNER</Badge>
                        <h3 className="font-black text-amber-400 text-2xl tracking-tighter uppercase leading-none">{vendor.name}</h3>
                      </div>
                    </div>
                    <div className="absolute top-6 right-8">
                      <div className="bg-amber-500/90 backdrop-blur-md px-4 py-2 shadow-2xl flex flex-col items-center rounded-xl">
                        <span className="text-[9px] font-black text-slate-950 leading-none mb-1 uppercase">FIDELITY</span>
                        <span className="text-2xl font-black text-slate-950 leading-none">{vendor.fidelityScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 space-y-5 flex-1 bg-white/5 border-t border-white/5">
                    <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest h-12 line-clamp-2 whitespace-normal">{vendor.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-black text-white tracking-tight">{vendor.rating} Rating</span>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white/40 rounded-full font-black text-[9px] uppercase tracking-widest">Since {vendor.joinedYear}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover/marquee:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg pointer-events-none">
              <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">❚❚ Hover to pause</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREMIUM AUTOS ─── */}
      {premiumAutos.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader title="Most searched for vehicles" subtitle="Verified Vehicle Marketplace" href="/listings?category=Vehicles" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {premiumAutos.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── AGRO ─── */}
      {industrialAgro.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard border-t border-dashed border-border">
          <SectionHeader title="Most searched for agriculture" subtitle="Heavy Machinery & Farming Items" href="/listings?category=Agriculture" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {industrialAgro.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── FASHION ─── */}
      {heritageFashion.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard bg-muted/20 border-y border-dashed border-border">
          <SectionHeader title="Most popular fashion" subtitle="Heritage & Contemporary Designs" href="/listings?category=Fashion" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {heritageFashion.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── SERVICES ─── */}
      {corporateServices.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader title="Most popular services" subtitle="Professional & Technical Services" href="/listings?category=Services" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {corporateServices.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── SPORTS ─── */}
      {eliteSports.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto w-full px-4 section-standard bg-muted/20 border-y border-border">
          <SectionHeader title="Most searched for sports" subtitle="Verified Sports Equipment" href="/listings?category=Sports" linkLabel="View All" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {eliteSports.map((item, i) => (
              <div key={item.id} className="card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <ListingCard {...item} />
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ─── PROPERTY (slow marquee scroll) ─── */}
      {luxuryProperty.length > 0 && (
        <RevealSection className="w-full section-standard mb-12 bg-slate-950/5 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <SectionHeader title="Most searched for property" subtitle="Residential & Commercial Marketplace" href="/listings?category=Property" linkLabel="View All" />
          </div>
          <div className="overflow-hidden relative group/propmarquee cursor-pointer">
            <div className="flex animate-marquee-slow gap-6 py-4 hover:[animation-play-state:paused]">
              {[...luxuryProperty, ...luxuryProperty, ...luxuryProperty].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="min-w-[260px] md:min-w-[300px]">
                  <ListingCard {...item} />
                </div>
              ))}
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover/propmarquee:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg pointer-events-none">
              <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">❚❚ Hover to pause</span>
            </div>
          </div>
        </RevealSection>
      )}

      {/* ─── HOW IT WORKS CTA ─── */}
      <RevealSection className="w-full bg-gradient-to-br from-amber-500/10 via-background to-background border-y border-primary/10 section-standard">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[9px] tracking-[0.3em] px-6 py-1.5 rounded-full">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground">
              3 Steps to a <span className="text-primary">Safe Deal</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Find & Agree', desc: 'Browse verified listings and agree on a price with the seller.' },
              { step: '02', title: 'Fund Escrow', desc: 'Pay securely into our institutional-grade escrow vault.' },
              { step: '03', title: 'Release & Enjoy', desc: 'Funds are only released when you confirm safe receipt.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="card-reveal flex flex-col items-center gap-4 p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/30 transition-all" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-lg shadow-primary/30">
                  {step}
                </div>
                <h3 className="font-black uppercase tracking-tight text-foreground">{title}</h3>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed text-center">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/safety">
            <Button className="h-14 px-12 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-xl shadow-primary/30 hover:opacity-90 active:scale-95 gap-3">
              Learn About Our Escrow <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </RevealSection>

      <BenefitsSection />
      <TipsSection />
      <FooterTabs />
      <PrivacyPopup />
      <NewsletterPopup />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <HomePage />
    </Suspense>
  );
}
