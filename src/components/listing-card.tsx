"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { useCurrency, useCart } from '@/components/providers';
import type { Listing } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ListingCard(props: Listing) {
  const { id, title, price, oldPrice, location, imageUrl, imageHint, category, isEscrowProtected } = props;
  const { formatPrice } = useCurrency();
  const { addItem, startCheckoutSim } = useCart();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(props);
    startCheckoutSim();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(prev => !prev);
    toast({
      title: isFavorited ? 'Removed from saved' : 'Saved to favorites',
      description: title,
    });
  };

  return (
    <Card className="group overflow-hidden bg-card border-2 border-amber-600/5 shadow-sm hover:shadow-[0_20px_50px_rgba(217,119,6,0.15)] hover:border-amber-600/30 transition-all duration-500 flex flex-col h-full rounded-none">

      {/* Image — 4:5 ratio */}
      <Link href={`/listings/${id}`} className="relative aspect-[4/5] w-full overflow-hidden block bg-amber-50">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          data-ai-hint={imageHint}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-3 right-3 h-10 w-10 rounded-none flex items-center justify-center backdrop-blur-md border-2 shadow-xl transition-all active:scale-90 z-10",
            isFavorited ? "bg-amber-600 border-amber-600 text-white shadow-amber-600/40" : "bg-white/80 border-amber-600/10 text-amber-700 hover:border-amber-600/40 hover:text-amber-600"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
        </button>

        {/* Escrow Badge */}
        {isEscrowProtected && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-amber-600 text-white border-none font-black text-[9px] px-3 py-1 rounded-none shadow-xl flex items-center gap-2 uppercase tracking-[0.2em] italic">
              <ShieldCheck className="h-3.5 w-3.5" /> Escrow
            </Badge>
          </div>
        )}

        {/* Price Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-amber-950/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-baseline gap-3">
            <span className="text-white font-black text-2xl tracking-tighter">GHS {parseFloat(price.toString()).toLocaleString()}</span>
            {oldPrice && <span className="text-white/60 text-sm font-bold line-through tracking-tighter">GHS {parseFloat(oldPrice.toString()).toLocaleString()}</span>}
          </div>
        </div>
      </Link>

      <CardContent className="p-5 flex flex-col flex-1 gap-3 bg-card border-t-2 border-amber-600/5">
        {/* Category + location */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.25em] truncate">
            {category}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-amber-900/40 font-black uppercase tracking-widest shrink-0">
            <MapPin className="h-3 w-3 text-amber-600" />
            <span>{location.split(',')[0]}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="font-black text-sm leading-tight text-amber-950 group-hover:text-amber-600 transition-colors line-clamp-2 uppercase tracking-tighter italic">
            {title}
          </h3>
        </Link>

        {/* Buy button */}
        <div className="mt-auto pt-5">
          <Button 
            onClick={handleBuyNow}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[10px] tracking-[0.3em] h-12 rounded-none shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            Secure Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
