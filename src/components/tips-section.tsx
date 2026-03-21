
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

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
    <section className="max-w-7xl mx-auto w-full px-4 py-16 animate-in fade-in duration-1000">
      <h2 className="text-2xl font-medium text-foreground tracking-tight mb-8">
        Check out the tips from Ecommerce.
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TIPS.map((tip) => (
          <div key={tip.id} className="group cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md mb-6 shadow-sm border border-border/50">
              <Image 
                src={tip.imageUrl} 
                alt={tip.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={tip.imageHint}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
