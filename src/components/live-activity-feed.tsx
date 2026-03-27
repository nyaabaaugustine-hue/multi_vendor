"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, ShoppingBag, User, Zap, X, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const ACTIVITIES = [
  { 
    id: 1, 
    type: 'purchase', 
    text: 'Someone in Accra just secured a MacBook Pro in the Escrow.', 
    time: '2 MINS AGO', 
    icon: ShieldCheck,
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1773999233/177984_n39gml.png'
  },
  { 
    id: 2, 
    type: 'listing', 
    text: 'Melcom Digital Hub updated their global inventory.', 
    time: '5 MINS AGO', 
    icon: Zap,
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1773999233/166105_nesnhj.png'
  },
  { 
    id: 3, 
    type: 'escrow', 
    text: 'GH₵8,500 deposit authorized for a Samsung QLED TV.', 
    time: 'JUST NOW', 
    icon: ShoppingBag,
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1773999233/177985_njyykl.png'
  },
  { 
    id: 4, 
    type: 'trust', 
    text: 'New institutional vendor "PrimeRentals GH" verified.', 
    time: '12 MINS AGO', 
    icon: User,
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1773999402/file_eognv9.jpg'
  },
];

export function LiveActivityFeed() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissedAd, setHasDismissedAd] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('vault_ad_dismissed');
    if (dismissed) {
      setHasDismissedAd(true);
      return;
    }

    const initialDelay = setTimeout(() => {
      if (!pathname?.startsWith('/dashboard')) {
        setIsVisible(true);
      }
    }, 2000);

    const interval = setInterval(() => {
      if (!hasDismissedAd && !pathname?.startsWith('/dashboard')) {
        setIsVisible(true);
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
      }
    }, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [hasDismissedAd, pathname]);

  const handleClose = () => {
    setIsVisible(false);
    setHasDismissedAd(true);
    localStorage.setItem('vault_ad_dismissed', 'true');
  };

  const activity = ACTIVITIES[currentIndex];

  if (hasDismissedAd || pathname?.startsWith('/dashboard')) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[60] w-full max-w-[380px] pointer-events-none">
      <div className={cn(
        "transition-all duration-700 ease-in-out transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}>
        <Card className="bg-slate-900 text-white border-2 border-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-none overflow-hidden pointer-events-auto relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="absolute top-2 right-2 h-8 w-8 text-white/20 hover:text-primary rounded-none hover:bg-white/5 transition-all"
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="p-6 flex gap-6 items-center">
            <div className="relative h-20 w-20 bg-white border-2 border-primary/20 overflow-hidden shrink-0 shadow-2xl">
              <Image 
                src={activity.image} 
                alt="Activity" 
                fill 
                className="object-cover" 
                unoptimized
              />
              <div className="absolute bottom-0 right-0 h-7 w-7 bg-slate-900 flex items-center justify-center border-t-2 border-l-2 border-primary/30">
                <Shield className="h-4 w-4 text-primary fill-primary" />
              </div>
            </div>
            <div className="space-y-2 flex-1 pr-6">
              <p className="text-[12px] font-black text-white leading-tight uppercase tracking-tighter italic">
                {activity.text}
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary text-slate-900 text-[9px] font-black uppercase tracking-[0.2em] px-3 h-5 rounded-none border-none shadow-lg">
                  SYSTEM SYNC
                </Badge>
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{activity.time}</span>
              </div>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-white/5">
            <div 
              className="h-full bg-primary transition-all ease-linear"
              style={{ width: isVisible ? '100%' : '0%', transitionDuration: '10000ms' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}