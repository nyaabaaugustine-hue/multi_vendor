"use client";

import { Wallet, ShieldCheck, Key, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EscrowProgressProps {
  currentStatus: 'escrow' | 'delivery' | 'inspection' | 'payout';
}

export function EscrowProgress({ currentStatus }: EscrowProgressProps) {
  const steps = [
    { id: 'escrow', label: 'Buyer Funds', desc: 'Held in Escrow', icon: Wallet },
    { id: 'delivery', label: 'In Transit', desc: 'Secure Shipping', icon: Lock },
    { id: 'inspection', label: 'Inspection', desc: 'Quality Check', icon: ShieldCheck },
    { id: 'payout', label: 'Seller Payout', desc: 'Funds Released', icon: Key },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStatus);

  return (
    <div className="bg-white border p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Escrow Flow: Money Path</h4>
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase text-secondary">System Active</span>
        </div>
      </div>

      <div className="relative flex justify-between">
        {/* Connection Lines */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-muted z-0">
          <div 
            className="h-full bg-primary transition-all duration-1000" 
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }} 
          />
        </div>

        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={cn(
                "h-12 w-12 flex items-center justify-center border-2 transition-all duration-500 bg-white",
                isActive ? "border-primary text-primary" : "border-muted text-muted-foreground",
                isCurrent && "bg-primary text-secondary scale-110 shadow-xl"
              )}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  isActive ? "text-secondary" : "text-muted-foreground"
                )}>{step.label}</p>
                <p className="text-[7px] font-bold text-muted-foreground uppercase">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
