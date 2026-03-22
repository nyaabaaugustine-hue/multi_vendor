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
    <Card className="group overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full rounded-2xl">

      {/* Image — 4:5 ratio */}
      <Link href={`/listings/${id}`} className="relative aspect-[4/5] w-full overflow-hidden block bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition-all duration-700 group-hover:scale-105"
          data-ai-hint={imageHint}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all active:scale-90 z-10",
            isFavorited ? "bg-primary border-primary text-white" : "bg-background/80 border-border text-muted-foreground hover:text-primary"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        </button>

        {/* Escrow Badge */}
        {isEscrowProtected && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary text-primary-foreground border-none font-bold text-[8px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="h-2.5 w-2.5" /> Escrow
            </Badge>
          </div>
        )}

        {/* Price Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-lg">{formatPrice(price)}</span>
            {oldPrice && <span className="text-white/60 text-xs line-through">{formatPrice(oldPrice)}</span>}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col flex-1 gap-2 bg-card">
        {/* Category + location */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] truncate">
            {category}
          </p>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold uppercase tracking-widest shrink-0">
            <MapPin className="h-2.5 w-2.5 text-primary/40" />
            <span>{location.split(',')[0]}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {title}
          </h3>
        </Link>

        {/* Buy button */}
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleBuyNow}
            className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl transition-all duration-300"
          >
            Buy Now — Secure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
