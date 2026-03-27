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
    <Card className="group overflow-hidden bg-card text-card-foreground border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 flex flex-col h-full rounded-2xl">

      {/* Image — 4:5 ratio */}
      <Link href={`/listings/${id}`} className="relative aspect-[4/5] w-full overflow-hidden block bg-muted">
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
            "absolute top-3 right-3 h-9 w-9 rounded-xl flex items-center justify-center backdrop-blur-md border shadow-xl transition-all active:scale-90 z-10",
            isFavorited
              ? "bg-primary border-primary text-primary-foreground shadow-primary/40"
              : "bg-background/80 border-border text-foreground hover:border-primary/40 hover:text-primary"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        </button>

        {/* Escrow Badge */}
        {isEscrowProtected && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary text-primary-foreground border-none font-black text-[9px] px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-1.5 uppercase tracking-[0.15em]">
              <ShieldCheck className="h-3 w-3" /> Escrow
            </Badge>
          </div>
        )}

        {/* Price Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-xl tracking-tighter">{formatPrice(price)}</span>
            {oldPrice && <span className="text-white/50 text-sm font-bold line-through">{formatPrice(oldPrice)}</span>}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col flex-1 gap-3 bg-card">
        {/* Category + location */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate">
            {category}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest shrink-0">
            <MapPin className="h-3 w-3 text-primary" />
            <span>{location.split(',')[0]}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="font-black text-sm leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
            {title}
          </h3>
        </Link>

        {/* Buy button */}
        <div className="mt-auto pt-3">
          <Button
            onClick={handleBuyNow}
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-black uppercase text-[10px] tracking-[0.25em] h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Secure Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
