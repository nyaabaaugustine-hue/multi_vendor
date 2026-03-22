"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useCurrency, useCart } from '@/components/providers';
import type { Listing } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function HighFidelityListingCard(props: Listing) {
  const { id, title, price, location, imageUrl, imageHint, category, specs, seller } = props;
  const { formatPrice } = useCurrency();
  const { addItem: addToCart, startCheckoutSim: startCheckout } = useCart();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(props);
    startCheckout();
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

        {/* Seller avatar with tooltip */}
        <div className="absolute bottom-3 right-3 z-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-background shadow-xl rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={seller.avatar} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                    {seller.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg border-primary/20 text-[10px] font-bold uppercase tracking-widest bg-background/95 backdrop-blur-sm">
                Verified: {seller.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Price + audit badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-sm">
            {formatPrice(price)}
          </Badge>
          <Badge className="bg-primary text-primary-foreground border-none font-bold text-[8px] px-2.5 py-0.5 rounded-lg shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="h-2.5 w-2.5" /> Escrow Protected
          </Badge>
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

        {/* Specs */}
        {specs && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] font-medium text-muted-foreground/80 mt-1">
            {specs.map((spec, i) => (
              <span key={i} className="flex items-center">
                {spec}{i < specs.length - 1 && <span className="ml-2 h-1 w-1 rounded-full bg-border" />}
              </span>
            ))}
          </div>
        )}

        {/* Buy button */}
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleBuyNow}
            className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl transition-all duration-300"
          >
            Buy Now — Escrow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
