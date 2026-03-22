"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingBag, 
  Tag, 
  UserPlus, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  MapPin,
  Car,
  Smartphone,
  Home as HomeIcon,
  Briefcase
} from "lucide-react";
import { useSearch } from "@/components/providers";
import { cn } from "@/lib/utils";

const QUICK_INTENTS = [
  { label: "Buy Products", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Sell Anything", icon: Tag, color: "text-green-600", bg: "bg-green-50" },
  { label: "Hire Services", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Discover Deals", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
];

const SUGGESTIONS = [
  { label: "iPhone 15 Pro near me", icon: Smartphone },
  { label: "Toyota Corolla in Accra", icon: Car },
  { label: "Apartment for rent", icon: HomeIcon },
  { label: "Graphic Designer", icon: Briefcase },
];

const HERO_IMAGES = [
  "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

export function HeroCarousel() {
  const [isFocused, setIsFocused] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { setSearchQuery } = useSearch();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full pt-8 pb-16 md:pt-12 md:pb-24 bg-slate-950 relative overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={src}
              alt="Hero Background"
              fill
              sizes="100vw"
              className="object-cover opacity-60"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
          </div>
        ))}
      </div>

      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-none bg-white/5 border-2 border-primary/30 animate-in fade-in slide-in-from-top-4 duration-700 backdrop-blur-md">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Ghana's #1 Secure Marketplace</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase italic">
              What are you <br />
              <span className="heading-gradient not-italic">looking for</span> today?
            </h1>
            <p className="text-white/60 text-sm md:text-xl max-w-2xl mx-auto font-black uppercase tracking-widest leading-relaxed">
              Connect instantly with verified vendors. <br />
              <span className="text-primary underline decoration-2 underline-offset-4">Escrow-protected transactions.</span> Zero risk.
            </p>
          </div>

          {/* Command Center Search */}
          <div className={cn(
            "relative max-w-3xl mx-auto transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200",
            isFocused ? "scale-[1.02]" : "scale-100"
          )}>
            <div className={cn(
              "rounded-none border-2 bg-slate-900/90 backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300",
              isFocused ? "border-primary shadow-primary/20" : "border-white/10"
            )}>
              <Command className="rounded-none border-none bg-transparent" label="Search listings">
                <div className="flex items-center px-6 border-b border-white/5">
                  <Search className="h-6 w-6 text-primary shrink-0" />
                  <CommandInput 
                    placeholder="Search verified listings, vendors, or services..." 
                    className="h-20 border-none focus:ring-0 text-lg font-black uppercase tracking-widest text-white placeholder:text-white/20"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onValueChange={(value) => setSearchQuery(value)}
                  />
                  <div className="hidden md:flex items-center gap-3 ml-auto">
                    <Badge variant="outline" className="font-black text-[10px] py-1 px-3 border-white/20 text-white/40 uppercase tracking-widest rounded-none">ESC</Badge>
                  </div>
                </div>
                
                {isFocused && (
                  <CommandList className="max-h-[400px] animate-in fade-in slide-in-from-top-2 duration-300 border-t border-white/5 bg-slate-900">
                    <CommandEmpty className="py-10 text-center font-black text-white/40 uppercase text-xs tracking-widest">No results found.</CommandEmpty>
                    <CommandGroup heading="Quick Suggestions" className="p-4">
                      {SUGGESTIONS.map((item) => (
                        <CommandItem key={item.label} className="flex items-center gap-4 py-4 px-6 cursor-pointer hover:bg-primary/10 rounded-none group transition-colors">
                          <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="font-black text-xs uppercase tracking-widest text-white">{item.label}</span>
                          <TrendingUp className="h-4 w-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>

            {/* Floating Hint */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap text-white/40 group">
              <MapPin className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Searching in Accra, Greater Accra</span>
            </div>
          </div>

          {/* Quick Intent Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {QUICK_INTENTS.map((intent) => (
              <Link
                key={intent.label}
                href={intent.label.includes('Sell') ? '/listings/create' : '/listings'}
                className="group flex flex-col items-center justify-center p-8 rounded-none bg-white/5 border-2 border-white/5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={cn("h-16 w-16 rounded-none flex items-center justify-center mb-6 transition-transform group-hover:scale-110 border-2 border-current", intent.color.replace('text-', 'border-'))}>
                  <intent.icon className={cn("h-8 w-8", intent.color)} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60 group-hover:text-primary transition-colors">
                  {intent.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Real-time Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 pt-16 text-white/30 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-4 group">
              <span className="text-3xl font-black text-white group-hover:text-primary transition-colors">12k+</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-tight text-left">Active <br />Listings</span>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="flex items-center gap-4 group">
              <span className="text-3xl font-black text-white group-hover:text-primary transition-colors">850+</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-tight text-left">Verified <br />Vendors</span>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="flex items-center gap-4 group">
              <span className="text-3xl font-black text-white group-hover:text-primary transition-colors">GH₵4.2M</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-tight text-left">Escrow <br />Volume</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
