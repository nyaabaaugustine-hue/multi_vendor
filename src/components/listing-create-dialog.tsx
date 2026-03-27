"use client";

import {
  Dialog, DialogContent, DialogTrigger, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { ListingCreateForm } from '@/components/listing-create-form';
import { ReactNode, useState } from 'react';
import { useAuth } from '@/components/providers';
import { AuthDialog } from '@/components/auth-dialog';
import { ShieldCheck } from 'lucide-react';

interface Props {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ListingCreateDialog({ children, open, onOpenChange }: Props) {
  const { user }           = useAuth();
  const [showAuth, setShowAuth]   = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen       = isControlled ? open : internalOpen;
  const setIsOpen    = isControlled
    ? (onOpenChange ?? (() => {}))
    : setInternalOpen;

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAuth(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children && (
          <DialogTrigger asChild onClick={handleTriggerClick}>
            {children}
          </DialogTrigger>
        )}

        <DialogContent className="
          sm:max-w-2xl w-full max-h-[92vh] overflow-hidden
          rounded-3xl p-0 border border-border/60
          shadow-2xl shadow-black/20
          bg-background
          flex flex-col
        ">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-black text-foreground uppercase tracking-tight leading-none">
                Post New Ad
              </DialogTitle>
              <DialogDescription className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1 leading-none">
                Escrow-protected · Verified listing
              </DialogDescription>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            <ListingCreateForm />
          </div>
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
}
