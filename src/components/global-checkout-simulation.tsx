
"use client";

import { useCart, useCurrency } from '@/components/providers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Key, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Global Forced Acquisition Overlay
 * Handles the institutional escrow simulation sequence.
 */
export function GlobalCheckoutSimulation() {
  const { isCheckingOut, checkoutStep, showSuccess, closeSuccess } = useCart();
  const router = useRouter();

  const STEPS = [
    "Connecting to Escrow Gateway...",
    "Syncing Central Registry...",
    "Authorizing Secure Lock...",
    "Finalizing Settlement..."
  ];

  const handleGoToDashboard = () => {
    closeSuccess();
    router.push('/dashboard');
  };

  return (
    <>
      <Dialog open={isCheckingOut}>
        <DialogContent className="sm:max-w-md border-none bg-slate-950 text-white text-center p-12 rounded-none shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[150]">
          <DialogHeader className="sr-only">
             <DialogTitle>Payment Authorization</DialogTitle>
             <DialogDescription>Securing payment in the registry.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-10 py-4">
            <div className="relative">
              <div className="h-28 w-28 rounded-none border-4 border-amber-600/20 flex items-center justify-center shadow-2xl">
                <Lock className="h-12 w-12 text-amber-600" />
              </div>
              <div className="absolute inset-0 h-28 w-28 rounded-none border-4 border-amber-600 border-t-transparent animate-spin" />
            </div>
            <div className="space-y-6 w-full">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Securing Escrow</h3>
              <div className="space-y-3">
                <p className="text-amber-600 text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">
                  {STEPS[checkoutStep]}
                </p>
                <Progress value={(checkoutStep + 1) * 25} className="h-2 bg-white/5 rounded-none" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={closeSuccess}>
        <DialogContent className="sm:max-w-md rounded-none p-12 border-t-8 border-t-amber-600 shadow-[0_50px_100px_rgba(0,0,0,0.6)] z-[150] bg-background">
          <DialogHeader>
             <DialogTitle className="text-3xl font-black text-amber-950 tracking-tighter uppercase text-center italic">Payment Secured!</DialogTitle>
             <DialogDescription className="text-[11px] font-black text-amber-700/60 uppercase tracking-[0.25em] text-center mt-3">
                Payment successfully held in secure escrow.
             </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-8 pt-6">
            <div className="h-20 w-20 bg-amber-50 rounded-none flex items-center justify-center mx-auto border-2 border-amber-600/10 shadow-xl">
              <Key className="h-10 w-10 text-amber-600" />
            </div>
            
            <div className="bg-amber-50/50 p-8 rounded-none border-2 border-dashed border-amber-600/20">
              <div className="flex items-center justify-center gap-4 text-amber-950 font-black">
                <CheckCircle2 className="h-8 w-8 text-amber-600" />
                <span className="text-3xl font-black tracking-tighter uppercase leading-none">Authorized</span>
              </div>
              <p className="text-[10px] uppercase font-black text-amber-700/40 mt-3 tracking-[0.3em]">
                Node: GHS-ACCRA-AUTH-01
              </p>
            </div>

            <Button onClick={handleGoToDashboard} className="w-full h-16 bg-amber-600 text-white rounded-none font-black gap-3 text-[11px] uppercase tracking-[0.3em] hover:bg-amber-700 shadow-2xl shadow-amber-600/20 transition-all hover:-translate-y-1">
              View My Account <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
