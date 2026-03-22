
"use client";

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthDialog } from '@/components/auth-dialog';
import { ListingCreateDialog } from '@/components/listing-create-dialog';

/**
 * @fileOverview Master Post Ad Action Node
 * Rectangular command node with 6% border-radius logic.
 * Force-reduced by 35% for elite visual balance and non-obstructive presence.
 */
export function PostAdButton() {
  const [showAuth, setShowAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    // In a real app, check auth state here. For demo, we just show form.
    setShowForm(true);
  };

  return (
    <>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <ListingCreateDialog open={showForm} onOpenChange={setShowForm} />
      <div className="fixed right-6 bottom-6 z-50 group">
        <Button 
          onClick={handleClick}
          className="h-10 px-5 bg-primary text-secondary hover:bg-white shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-2.5 rounded-[6%] border-2 border-white/10 transition-all active:scale-95 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <PlusCircle className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-black uppercase text-[9px] tracking-[0.15em]">Post Ad</span>
        </Button>
      </div>
    </>
  );
}
