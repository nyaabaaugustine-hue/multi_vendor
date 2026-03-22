
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const TIPS = [
  {
    id: 1,
    title: "Stay ahead in the automotive market with Data Ecommerce Autos.",
    description: "Access free reports and data now!",
    imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop",
    imageHint: "professional woman car"
  },
  {
    id: 2,
    title: "Technology for a safer environment",
    description: "Explore our logistics options and choose the best one for you.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    imageHint: "delivery package hands"
  }
];

/**
 * @fileOverview Marketplace Tips Command Node
 * 1:1 structural clone of the OLX tips module.
 * Aligned to the 1280px (max-w-7xl) grid.
 */
export function TipsSection() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 py-24 animate-in fade-in duration-1000 bg-slate-950/50 border-y border-white/5 my-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Marketplace Tips</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Check out the tips <br />
            <span className="text-white/40">from Ecommerce.</span>
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {TIPS.map((tip) => (
          <div key={tip.id} className="group cursor-pointer">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-none mb-8 shadow-2xl border-2 border-white/5 group-hover:border-primary/50 transition-all duration-500">
              <Image 
                src={tip.imageUrl} 
                alt={tip.title} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                data-ai-hint={tip.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </div>
            <div className="space-y-4 px-2">
              <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors">
                {tip.title}
              </h3>
              <div className="flex items-center gap-6">
                <p className="text-[11px] text-white/50 font-black uppercase tracking-widest leading-relaxed flex-1">
                  {tip.description}
                </p>
                <div className="h-10 w-10 rounded-none border border-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-950 transition-all">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
