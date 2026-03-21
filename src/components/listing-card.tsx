"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Truck, Lock, ShoppingBag, MapPin } from 'lucide-react';
import { useCurrency, useCart } from '@/components/providers';
import type { Listing } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ListingCard(props: Listing) {
  const { id, title, price, oldPrice, location, imageUrl, imageHint, isEscrowProtected, isFreeShipping, isEmphasis } = props;
  const { formatPrice } = useCurrency();
  const { addItem, startCheckoutSim } = useCart();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(props);
    startCheckoutSim();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(prev => !prev);
    toast({
      title: isFavorited ? 'Removed from saved' : 'Saved to favourites',
      description: title,
    });
  };

  return (
    <Card className="group overflow-hidden bg-card border border-border/40 shadow-none hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full rounded-[7%] animate-in fade-in zoom-in-95">

      {/* Image */}
      <Link href={`/listings/${id}`} className="relative aspect-[3/4] w-full overflow-hidden block bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition-all duration-700 group-hover:scale-110 contrast-[1.02] saturate-[1.1]"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Priority badge */}
        {isEmphasis && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary text-primary-foreground font-black px-2.5 py-1 rounded-none border-none shadow-xl uppercase text-[8px] tracking-widest">
              Featured
            </Badge>
          </div>
        )}

        {/* Favourite */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favourites' : 'Save to favourites'}
          aria-pressed={isFavorited}
          className={cn(
            'absolute top-3 right-3 z-10 h-9 w-9 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 border',
            isFavorited
              ? 'bg-primary border-primary text-white'
              : 'bg-white/90 border-border text-muted-foreground hover:text-primary'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-white')} />
        </button>

        {/* Price hover overlay — desktop only */}
        <div className="absolute bottom-3 left-3 z-10 hidden md:block opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 shadow-xl border-l-4 border-primary">
            <p className="text-[13px] font-black text-secondary tracking-tighter leading-none">{formatPrice(price)}</p>
            {oldPrice && <p className="text-[8px] text-muted-foreground line-through font-bold mt-0.5">{formatPrice(oldPrice)}</p>}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col flex-1 gap-2">
        {/* Category + location */}
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{props.category}</span>
          <div className="flex items-center gap-1 text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            <MapPin className="h-2.5 w-2.5 text-primary/40" />
            <span>{location.split(',')[0]}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="font-black text-[13px] md:text-[14px] line-clamp-2 text-foreground tracking-tighter leading-tight min-h-[2.2rem] group-hover:text-primary transition-colors uppercase italic">
            {title}
          </h3>
        </Link>

        {/* Price — always visible on mobile */}
        <div className="flex items-baseline gap-2 md:hidden">
          <p className="text-[15px] font-black text-foreground tracking-tighter">{formatPrice(price)}</p>
          {oldPrice && <p className="text-[9px] text-muted-foreground line-through font-bold">{formatPrice(oldPrice)}</p>}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {isFreeShipping && (
            <Badge className="bg-green-500/10 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-none border-none uppercase">
              <Truck className="h-2.5 w-2.5 mr-1" /> Free delivery
            </Badge>
          )}
          {isEscrowProtected && (
            <Badge className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-none border-none uppercase flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Escrow
            </Badge>
          )}
        </div>

        {/* Buy button — always visible on mobile, hover on desktop */}
        <div className="pt-3 border-t border-dashed border-border/50">
          <Button
            onClick={handleBuyNow}
            className={cn(
              'w-full h-10 bg-primary text-primary-foreground font-black uppercase text-[9px] tracking-widest rounded-none shadow-xl gap-2 hover:opacity-90 transition-all duration-300',
              'opacity-100 translate-y-0',
              'md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0'
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
