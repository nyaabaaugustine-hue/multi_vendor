"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  Car, 
  Smartphone, 
  Home, 
  Armchair, 
  Sparkles, 
  Heart, 
  Ticket,
  ChevronRight,
  Tv,
  Wrench,
  Shapes,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { 
    name: 'Categories', 
    icon: Shapes, 
    imageUrl: 'https://picsum.photos/seed/camera1/100/100',
    href: '/listings',
    color: 'text-blue-600',
    param: null,
  },
  { name: 'Favorites', icon: Heart, href: '/dashboard', color: 'text-red-500', param: null },
  { name: 'Coupons', icon: Ticket, href: '/listings', color: 'text-green-600', param: null },
  { name: 'Vehicles', icon: Car, href: '/listings?category=Vehicles', color: 'text-purple-600', param: 'Vehicles' },
  { name: 'Auto Parts', icon: Wrench, href: '/listings?category=Vehicles', color: 'text-orange-600', param: 'Vehicles' },
  { name: 'Mobiles', icon: Smartphone, href: '/listings?category=Electronics', color: 'text-cyan-600', param: 'Electronics' },
  { name: 'Property', icon: Home, href: '/listings?category=Property', color: 'text-indigo-600', param: 'Property' },
  { name: 'Decoration', icon: Sparkles, href: '/listings?category=Home & Furniture', color: 'text-amber-500', param: 'Home & Furniture' },
  { name: 'Appliances', icon: Tv, href: '/listings?category=Electronics', color: 'text-rose-600', param: 'Electronics' },
  { name: 'Furniture', icon: Armchair, href: '/listings?category=Home & Furniture', color: 'text-stone-600', param: 'Home & Furniture' },
];

export function CategoryBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <section className="bg-background py-1.5 md:py-2 overflow-hidden border-b transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 relative flex items-center group">
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar w-full pb-0.5 scroll-smooth">
          {CATEGORIES.map((cat, idx) => {
            // [FIX 4.1] Compute active state: match by category param or exact path
            const isActive = cat.param
              ? currentCategory === cat.param
              : pathname === cat.href && !currentCategory;

            return (
              <Link 
                key={cat.name} 
                href={cat.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "flex items-center gap-2 border px-3 py-1.5 rounded-none transition-all shrink-0 group/chip animate-in fade-in slide-in-from-right-2",
                  `delay-${idx * 20}`,
                  isActive
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-muted/20 border-transparent hover:border-primary/30 hover:bg-muted/40"
                )}
              >
                {cat.imageUrl ? (
                  <div className="relative h-3.5 w-3.5 md:h-4 md:w-4 overflow-hidden rounded-none border border-secondary/10">
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill 
                      className={cn("object-cover transition-all", isActive ? "grayscale-0" : "grayscale group-hover/chip:grayscale-0")}
                      sizes="16px"
                    />
                  </div>
                ) : (
                  <cat.icon className={cn(
                    "h-3 w-3 md:h-3.5 md:w-3.5 transition-colors",
                    isActive ? "text-primary" : cat.color
                  )} />
                )}
                <span className={cn(
                  "text-[8px] md:text-[9px] font-black whitespace-nowrap uppercase tracking-[0.1em]",
                  isActive ? "text-primary" : "text-secondary group-hover/chip:text-primary"
                )}>
                  {cat.name}
                </span>
                {/* Active underline pip */}
                {isActive && (
                  <span className="h-1 w-1 bg-primary rounded-full shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/90 backdrop-blur-sm border shadow-sm rounded-none flex items-center justify-center cursor-pointer hover:bg-muted transition-all z-10 lg:flex hidden mr-2 opacity-0 group-hover:opacity-100 active:scale-95">
           <ChevronRight className="h-3 w-3 text-secondary" />
        </div>
      </div>
    </section>
  );
}
