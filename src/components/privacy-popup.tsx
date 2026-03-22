"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function PrivacyPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('vault_privacy_seen');
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsOpen(false);
    localStorage.setItem('vault_privacy_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-full max-w-[400px] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 border-2 border-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-8 space-y-6 relative overflow-hidden rounded-none">
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">AdOpt</span>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Control your privacy.</h3>
          <p className="text-[11px] text-white/40 leading-relaxed font-black uppercase tracking-[0.15em]">
            Our website uses cookies to improve navigation and authorize secure escrow nodes. Review our 
            <span className="text-primary underline decoration-2 underline-offset-4 cursor-pointer ml-2">Privacy Policy</span>.
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1 rounded-none border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
          >
            Customize
          </Button>
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-primary text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-2xl rounded-none hover:bg-white transition-all"
          >
            To accept
          </Button>
        </div>
      </div>
    </div>
  );
}