"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    leftBg: "bg-[#6e0ad6]",
    rightBg: "bg-[#f2eafa]",
    title: "Ghana's largest vehicle inventory. ",
    highlight: "Over 800 thousand options to choose from.",
    cta: "View offers",
    mainImage: "https://picsum.photos/seed/hero1/1600/800",
    sideTitle: "Toyota Corolla GLI",
    sideDesc: "Year 2024, 22,300 km and 2.0 Flex engine",
    accentColor: "text-[#6e0ad6]"
  },
  {
    id: 2,
    leftBg: "bg-[#d60a91]",
    rightBg: "bg-[#fbeaf5]",
    title: "Sovereign Electronics Center. ",
    highlight: "The best smartphones in GHS-Accra.",
    cta: "Shop now",
    mainImage: "https://picsum.photos/seed/hero2/1600/800",
    sideTitle: "iPhone 15 Pro",
    sideDesc: "Titanium Blue, 256GB. Vault condition.",
    accentColor: "text-[#d60a91]"
  }
];

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  // [FIX 2.3] Auto-play state managed manually without plugin dependency
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // [FIX 2.3] Auto-advance every 5s, pauses on hover
  React.useEffect(() => {
    if (!api) return;
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api, isPaused]);

  return (
    <section
      className="w-full relative group"
      // [FIX 2.3] Pause auto-play on hover
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Carousel 
        setApi={setApi}
        className="w-full" 
        opts={{ loop: true }}
      >
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.id}>
              {/* [FIX 3.1] Height increased on mobile: h-[260px], md panel now shown at md breakpoint */}
              <div className="relative h-[260px] md:h-[320px] w-full overflow-hidden rounded-none md:rounded-xl flex shadow-sm border border-border/50">
                {/* LEFT PANE: BRANDING & CTA */}
                <div className={cn("w-full md:w-[40%] flex flex-col justify-center p-6 md:p-12 z-10 text-white relative", slide.leftBg)}>
                  <div className="space-y-3 md:space-y-4">
                    <h1 className="text-xl md:text-4xl font-bold leading-tight tracking-tight">
                      {slide.title}
                      <span className="block font-black">{slide.highlight}</span>
                    </h1>
                    <div className="pt-2">
                       <Button className="bg-[#90EE90] text-secondary hover:bg-white font-bold rounded-none h-9 px-6 text-xs transition-all hover:scale-105">
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* MIDDLE PANE: ASSET IMAGE */}
                <div className="hidden md:flex flex-1 relative bg-white overflow-hidden items-center justify-center">
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={slide.mainImage} 
                      alt="Hero Asset" 
                      fill 
                      className="object-cover"
                      priority
                      data-ai-hint="marketplace hero"
                    />
                  </div>
                  {/* FLOATING CTA */}
                  <div className="absolute bottom-12 right-12 z-20">
                    <Button className="bg-[#90EE90] text-[#1a1a1a] hover:bg-white font-bold text-base rounded-none h-14 px-10 shadow-2xl shadow-green-500/20 transition-all scale-105 hover:scale-110">
                      {slide.cta}
                    </Button>
                  </div>
                </div>

                {/* [FIX 3.1] RIGHT PANE now shown at md (was lg-only), narrower at md */}
                <div className={cn("hidden md:flex w-[22%] flex-col justify-center p-5 lg:p-8 border-l border-white/10", slide.rightBg)}>
                  <div className="space-y-3 lg:space-y-4">
                    <div className={cn("h-9 w-9 flex items-center justify-center rounded-none bg-white/50", slide.accentColor)}>
                      <Timer className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className={cn("font-black text-xs lg:text-sm uppercase tracking-tight", slide.accentColor)}>
                        {slide.sideTitle}
                      </h3>
                      <p className="text-[10px] lg:text-xs font-medium text-foreground/60 leading-relaxed">
                        {slide.sideDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden md:flex -left-6 h-12 w-12 bg-white border shadow-xl text-foreground rounded-none hover:bg-muted transition-all z-30" />
        <CarouselNext className="hidden md:flex -right-6 h-12 w-12 bg-white border shadow-xl text-foreground rounded-none hover:bg-muted transition-all z-30" />

        {/* DASH INDICATORS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                "h-1 rounded-none transition-all duration-500",
                idx === current ? "bg-primary w-8 md:w-10" : "bg-white/40 w-4 md:w-6 hover:bg-white/70"
              )} 
            />
          ))}
        </div>

        {/* [FIX 2.3] Auto-play pause indicator on hover */}
        {isPaused && (
          <div className="absolute top-3 right-3 z-30 hidden md:flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1">
            <div className="flex gap-0.5">
              <span className="h-2.5 w-0.5 bg-white/80 rounded-none" />
              <span className="h-2.5 w-0.5 bg-white/80 rounded-none" />
            </div>
            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Paused</span>
          </div>
        )}
      </Carousel>
    </section>
  );
}
