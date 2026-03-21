"use client";

import dynamic from 'next/dynamic';

const HeroCarousel = dynamic(() => import('@/components/hero-carousel').then(mod => mod.HeroCarousel), {
  ssr: true,
  loading: () => <div className="max-w-7xl mx-auto w-full px-4 mb-8 md:mb-12 mt-4 md:mt-8 h-[260px] md:h-[320px] bg-muted animate-pulse rounded-xl" />
});
const SpotlightCategories = dynamic(() => import('@/components/spotlight-categories').then(mod => mod.SpotlightCategories), { ssr: true });
const TipsSection = dynamic(() => import('@/components/tips-section').then(mod => mod.TipsSection), { ssr: true });
const BenefitsSection = dynamic(() => import('@/components/benefits-section').then(mod => mod.BenefitsSection), { ssr: true });

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { ListingCard } from '@/components/listing-card';
import { HighFidelityListingCard } from '@/components/high-fidelity-listing-card';
import { CategoryBar } from '@/components/category-bar';
import { PrivacyPopup } from '@/components/privacy-popup';
import { FooterTabs } from '@/components/footer-tabs';
import { NewsletterPopup } from '@/components/newsletter-popup';
import { LISTINGS, VENDORS } from '@/lib/mock-data';
import { useSearch } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Star, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// [FIX 1.1] SectionHeader — border-pin anchors editorial parentheses into authority.
// [FIX 5.3] "View Registry" links include ArrowUpRight + hover translate.
// ─────────────────────────────────────────────────────────────────────────────
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

export function HomePage() {
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredListings = useMemo(() => {
    if (!searchQuery) return LISTINGS;
    return LISTINGS.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const eliteComputing = useMemo(() => filteredListings.filter(l => l.subcategory === 'Laptops').slice(0, 5), [filteredListings]);
  const smartCommunication = useMemo(() => filteredListings.filter(l => l.subcategory === 'Mobiles').slice(0, 5), [filteredListings]);
  const premiumAutos = useMemo(() => filteredListings.filter(l => l.category === 'Vehicles').slice(0, 5), [filteredListings]);
  const industrialAgro = useMemo(() => filteredListings.filter(l => l.category === 'Agriculture').slice(0, 5), [filteredListings]);
  const heritageFashion = useMemo(() => filteredListings.filter(l => l.category === 'Fashion').slice(0, 5), [filteredListings]);
  const corporateServices = useMemo(() => filteredListings.filter(l => l.category === 'Services').slice(0, 5), [filteredListings]);
  const eliteSports = useMemo(() => filteredListings.filter(l => l.category === 'Sports').slice(0, 5), [filteredListings]);
  const luxuryProperty = useMemo(() => filteredListings.filter(l => l.category === 'Property').slice(0, 5), [filteredListings]);

  // [FIX 5.2] Detect if search returned zero results across all sections
  const hasAnyResults = [
    eliteComputing, smartCommunication, premiumAutos,
    industrialAgro, heritageFashion, corporateServices,
    eliteSports, luxuryProperty
  ].some(arr => arr.length > 0);

  return (
    <div className="flex flex-col bg-background min-h-screen pb-20 overflow-x-hidden transition-colors duration-500">
      <CategoryBar />
      
      <div className="max-w-7xl mx-auto w-full px-4 mb-8 md:mb-12 mt-4 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <HeroCarousel />
      </div>

      <SpotlightCategories />

      {/* [FIX 5.2] Empty state — shown when search has no results */}
      {searchQuery && !hasAnyResults && (
        <div className="max-w-7xl mx-auto w-full px-4 py-24 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="h-20 w-20 bg-muted border border-border flex items-center justify-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">
              No listings found
            </h2>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              No results for &ldquo;{searchQuery}&rdquo; in the registry
            </p>
          </div>
          <Button
            onClick={() => setSearchQuery('')}
            className="h-12 px-10 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-none gap-2 hover:opacity-90"
          >
            Clear Search &amp; Browse All
          </Button>
        </div>
      )}

      {/* ─── ELITE COMPUTING ─── */}
      {eliteComputing.length > 0 && (
        <section className="w-full section-standard bg-muted/5 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader
              title="Most popular laptops"
              subtitle="Premium Hardware Registry • ACCRA"
              href="/listings?category=Electronics"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {eliteComputing.map((item) => <HighFidelityListingCard key={item.id} {...item} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── SMART COMMUNICATION ─── */}
      {smartCommunication.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader
            title="Most searched for mobiles"
            subtitle="Verified Smartphone Registry Hub"
            href="/listings?category=Electronics"
            linkLabel="Full Directory"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {smartCommunication.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── INSTITUTIONAL PARTNER MARQUEE ─── */}
      <section className="bg-secondary section-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <Badge className="bg-primary text-secondary font-black rounded-none uppercase text-[10px] tracking-[0.4em] px-6">Institutional Directory</Badge>
              {/* [FIX 7.2] heading-gradient applied to the key phrase */}
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                Verified <br />
                <span className="heading-gradient italic">Partner Sellers</span>
              </h2>
            </div>
            <Link href="/vendors">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-secondary font-black rounded-none h-16 px-12 uppercase text-[11px] tracking-[0.3em] gap-3 transition-all">
                Enter Vendor Registry <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* [FIX 7.1] group/marquee adds ring affordance and "hover to pause" badge */}
          <div className="overflow-hidden relative group/marquee cursor-pointer">
            <div className="flex animate-marquee-slow gap-10 py-4 whitespace-nowrap hover:[animation-play-state:paused]">
              {[...VENDORS, ...VENDORS].map((vendor, idx) => (
                <div key={`${vendor.id}-${idx}`} className="bg-white/5 border border-white/10 hover:border-primary transition-all duration-500 min-w-[380px] md:min-w-[450px] rounded-[7%] overflow-hidden flex flex-col shadow-2xl">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image src={vendor.bgUrl} alt={vendor.name} fill className="object-cover opacity-50 contrast-[1.1]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
                    <div className="absolute bottom-6 left-8 flex items-end gap-6">
                      <div className="relative h-20 w-20 bg-white border-2 border-primary shadow-2xl p-2 rounded-[7%]">
                        <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-contain p-1" unoptimized />
                      </div>
                      <div className="pb-1 text-left whitespace-normal">
                        <Badge className="bg-primary text-secondary rounded-none font-black text-[8px] uppercase tracking-widest mb-2">PARTNER</Badge>
                        <h3 className="font-black text-white text-2xl tracking-tighter uppercase leading-none">{vendor.name}</h3>
                      </div>
                    </div>
                    <div className="absolute top-6 right-8">
                       <div className="bg-primary/90 backdrop-blur-md px-4 py-2 shadow-2xl flex flex-col items-center">
                          <span className="text-[9px] font-black text-secondary leading-none mb-1 uppercase">FIDELITY</span>
                          <span className="text-2xl font-black text-secondary leading-none">{vendor.fidelityScore}%</span>
                       </div>
                    </div>
                  </div>
                  <div className="p-10 space-y-10 flex-1 bg-secondary/30 border-t border-white/5">
                    <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest h-12 line-clamp-2 whitespace-normal">{vendor.description}</p>
                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-black text-white tracking-tight">{vendor.rating} Registry Rating</span>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white/40 rounded-none font-black text-[9px] uppercase tracking-widest">Since {vendor.joinedYear}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Hover-to-pause affordance badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover/marquee:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 pointer-events-none">
              <div className="flex gap-0.5">
                <span className="h-2.5 w-0.5 bg-white/70 rounded-none" />
                <span className="h-2.5 w-0.5 bg-white/70 rounded-none" />
              </div>
              <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">Hover to pause</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREMIUM AUTOS ─── */}
      {premiumAutos.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader
            title="Most searched for vehicles"
            subtitle="Verified High-Value Vehicle Registry"
            href="/listings?category=Vehicles"
            linkLabel="Full Registry"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {premiumAutos.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── AGRO ─── */}
      {industrialAgro.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard border-t border-dashed">
          <SectionHeader
            title="Most searched for agriculture"
            subtitle="Heavy Machinery & Farming Assets"
            href="/listings?category=Agriculture"
            linkLabel="View All Assets"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {industrialAgro.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── FASHION ─── */}
      {heritageFashion.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard bg-muted/5 border-y border-dashed">
          <SectionHeader
            title="Most popular fashion"
            subtitle="Royal Kente & Heritage Design Nodes"
            href="/listings?category=Fashion"
            linkLabel="Full Registry"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {heritageFashion.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── SERVICES ─── */}
      {corporateServices.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard">
          <SectionHeader
            title="Most popular services"
            subtitle="Corporate Services & Technical Audits"
            href="/listings?category=Services"
            linkLabel="Full Directory"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {corporateServices.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── SPORTS ─── */}
      {eliteSports.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard bg-secondary/5 border-y">
          <SectionHeader
            title="Most searched for sports"
            subtitle="Performance Hardware Nodes"
            href="/listings?category=Sports"
            linkLabel="Full Registry"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {eliteSports.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {/* ─── PROPERTY ─── */}
      {luxuryProperty.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 section-standard mb-12">
          <SectionHeader
            title="Most searched for property"
            subtitle="Elite Residential & Commercial Assets"
            href="/listings?category=Property"
            linkLabel="Full Registry"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {luxuryProperty.map((item) => <ListingCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

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
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePage />
    </Suspense>
  );
}
