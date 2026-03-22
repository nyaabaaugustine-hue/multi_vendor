"use client";

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ListingCreateForm } from '@/components/listing-create-form';
import { ReactNode } from 'react';

export function ListingCreateDialog({ children, open, onOpenChange }: { children?: ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto p-8 rounded-2xl bg-background/95 backdrop-blur-xl border-2 border-primary/10 text-foreground">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>Fill out the details to post a new ad on the marketplace.</DialogDescription>
        </DialogHeader>
        <ListingCreateForm />
      </DialogContent>
    </Dialog>
  );
}