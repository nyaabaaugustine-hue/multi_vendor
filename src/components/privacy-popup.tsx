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
      <div className="bg-secondary border-2 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <span className="text-[10px] font-black uppercase tracking-widest">AdOpt</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Control your privacy.</h3>
          <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-widest">
            Our website uses cookies to improve navigation and authorize secure escrow nodes. Review our 
            <span className="text-primary underline cursor-pointer ml-1">Privacy Policy</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-none border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5"
          >
            Customize
          </Button>
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-primary text-secondary font-black text-[10px] uppercase tracking-widest shadow-xl"
          >
            To accept
          </Button>
        </div>
      </div>
    </div>
  );
}