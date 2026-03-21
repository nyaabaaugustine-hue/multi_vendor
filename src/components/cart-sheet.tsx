
"use client";

import { useState } from 'react';
import { ShoppingBag, X, Trash2, ShieldCheck, ArrowRight, Loader2, Lock, Key, CheckCircle2 } from 'lucide-react';
import { useCart, useCurrency } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function CartSheet() {
  const { items, removeItem, total, startCheckoutSim, isCheckingOut, checkoutStep } = useCart();
  const { formatPrice } = useCurrency();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false); // Close the sheet to let the global simulation dominate
    startCheckoutSim();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="fixed right-4 bottom-4 md:right-10 md:bottom-10 z-40 flex flex-col gap-5">
          <div 
            data-cart-trigger
            className="bg-secondary text-white p-3 md:p-5 rounded-none shadow-2xl flex flex-col items-center cursor-pointer hover:scale-105 transition-all group border border-primary/20"
          >
             <ShoppingBag className="h-5 w-5 md:h-8 md:w-8 text-primary" />
             <span className="text-[8px] md:text-[9px] font-black mt-1 md:mt-2 tracking-widest uppercase">Cart: {items.length}</span>
             <span className="text-[8px] md:text-[9px] font-black bg-primary text-secondary px-2 md:px-3 py-0.5 rounded-none mt-1 md:mt-2">{formatPrice(total)}</span>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col rounded-none p-0 border-l-4 border-primary">
        <div className="p-6 border-b bg-muted/30">
          <SheetHeader>
            <SheetTitle className="text-xl md:text-2xl font-black text-secondary flex items-center gap-3 uppercase tracking-tighter">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Secure Cart
            </SheetTitle>
            <SheetDescription className="text-[10px] font-bold uppercase tracking-widest">
              Review items before escrow authorization.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-muted p-8 rounded-none border border-dashed">
                <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-border/50 hover:border-primary/20 transition-all">
                <div className="relative h-16 w-16 rounded-none overflow-hidden shrink-0 border bg-muted">
                  <Image src={item.imageUrl} alt={item.title} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-[11px] text-secondary uppercase tracking-tight leading-none mb-1">{item.title}</h4>
                    <p className="text-[9px] text-primary font-bold uppercase tracking-widest">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-burgundy text-xs">{formatPrice(item.price)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-muted/20 border-t space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-burgundy">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-secondary uppercase tracking-widest">Total Secure Deposit</span>
                <span className="text-xl font-black text-burgundy tracking-tighter">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-none border border-primary/20 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-[9px] text-secondary/70 font-black uppercase tracking-tight leading-tight">
                  Funds protected via Secure Payment Escrow. Released after your inspection.
                </p>
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-secondary text-white font-black rounded-none text-xs uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl group"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                  Authorizing...
                </>
              ) : (
                <>
                  Secure Checkout <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
