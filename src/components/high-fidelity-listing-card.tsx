"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShoppingBag, ShieldCheck, Lock } from 'lucide-react';
import { useCurrency, useCart } from '@/components/providers';
import type { Listing } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function HighFidelityListingCard(props: Listing) {
  const { id, title, price, location, imageUrl, imageHint, category, subcategory, specs, seller } = props;
  const { formatPrice } = useCurrency();
  const { addItem, startCheckoutSim } = useCart();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(props);
    startCheckoutSim();
  };

  return (
    <Card className="group overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full rounded-[7%]">

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
        <div className="absolute bottom-2 right-2 z-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-white shadow-lg rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black rounded-full">
                    {seller.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="rounded-none border-primary/20 text-[9px] font-black uppercase tracking-widest">
                {seller.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Price + audit badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-secondary/90 backdrop-blur-md text-white border-none font-black text-[9px] px-2 py-1 rounded-none uppercase">
            {formatPrice(price)}
          </Badge>
          <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-none font-black text-[7px] px-2 py-0.5 rounded-none uppercase flex items-center gap-1">
            <ShieldCheck className="h-2 w-2" /> Escrow
          </Badge>
        </div>
      </Link>

      <CardContent className="p-3 flex flex-col flex-1 gap-1.5 bg-gradient-to-b from-card to-muted/5">
        {/* Category + location */}
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-bold text-primary uppercase tracking-widest truncate">
            {category}{subcategory && ` · ${subcategory}`}
          </p>
          <div className="flex items-center gap-1 text-[7px] text-muted-foreground font-black uppercase shrink-0">
            <MapPin className="h-2 w-2 text-primary/60" />
            <span>{location.split(',')[0]}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="font-black text-[11px] leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 uppercase italic tracking-tighter">
            {title}
          </h3>
        </Link>

        {/* Specs */}
        {specs && (
          <div className="flex flex-wrap gap-x-1.5 text-[8px] font-bold text-muted-foreground/60">
            {specs.map((spec, i) => (
              <span key={i} className="uppercase tracking-tighter">
                {spec}{i < specs.length - 1 && ' ·'}
              </span>
            ))}
          </div>
        )}

        {/* Buy button */}
        <div className="mt-auto pt-2 border-t border-dashed border-border/50">
          <Button
            onClick={handleBuyNow}
            className="w-full h-9 bg-primary text-primary-foreground font-black uppercase text-[8px] tracking-[0.2em] rounded-none shadow-lg gap-2 hover:opacity-90 transition-all active:scale-95"
          >
            <ShoppingBag className="h-3 w-3" /> Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
