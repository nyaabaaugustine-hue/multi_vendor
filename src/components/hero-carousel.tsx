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
    <section className="w-full pt-8 pb-16 md:pt-12 md:pb-24 bg-background relative overflow-hidden">
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
              className="object-cover opacity-90"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
        ))}
      </div>

      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-700">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Ghana's #1 Secure Intent Engine</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] drop-shadow-md">
              What are you <span className="text-primary italic">looking for</span> today?
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium drop-shadow-sm">
              Connect instantly with verified vendors. Escrow-protected transactions. Zero risk.
            </p>
          </div>

          {/* Command Center Search */}
          <div className={cn(
            "relative max-w-2xl mx-auto transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200",
            isFocused ? "scale-[1.02]" : "scale-100"
          )}>
            <div className={cn(
              "rounded-2xl border bg-card shadow-2xl overflow-hidden transition-all duration-300",
              isFocused ? "ring-4 ring-primary/5 border-primary/30" : "border-border/50"
            )}>
              <Command className="rounded-none border-none" label="Search listings">
                <div className="flex items-center px-4 border-b">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <CommandInput 
                    placeholder="Search verified listings, vendors, or services..." 
                    className="h-14 border-none focus:ring-0 text-base"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onValueChange={(value) => setSearchQuery(value)}
                  />
                  <div className="hidden md:flex items-center gap-2 ml-auto">
                    <Badge variant="secondary" className="font-mono text-[10px] py-0 px-1.5 opacity-50">ESC</Badge>
                  </div>
                </div>
                
                {isFocused && (
                  <CommandList className="max-h-[300px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Quick Suggestions">
                      {SUGGESTIONS.map((item) => (
                        <CommandItem key={item.label} className="flex items-center gap-3 py-3 px-4 cursor-pointer">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{item.label}</span>
                          <TrendingUp className="h-3 w-3 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>

            {/* Floating Hint */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap opacity-60">
              <MapPin className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Searching in Accra, Greater Accra</span>
            </div>
          </div>

          {/* Quick Intent Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {QUICK_INTENTS.map((intent) => (
              <Link
                key={intent.label}
                href={intent.label.includes('Sell') ? '/sell' : '/listings'}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", intent.bg, intent.color)}>
                  <intent.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                  {intent.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Real-time Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 opacity-40 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">12k+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Listings</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">850+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified Vendors</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">GH₵4.2M</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Escrow Volume</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
