"use client";

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ListingCreateForm } from '@/components/listing-create-form';
import { ReactNode } from 'react';

export function ListingCreateDialog({ children, open, onOpenChange }: { children?: ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto p-8 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-primary/10">
        <ListingCreateForm />
      </DialogContent>
    </Dialog>
  );
}