"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MOCK_USERS } from '@/lib/mock-data';
import { useAuth } from '@/components/providers';
import { ShieldCheck, User as UserIcon, Store, Shield, Key } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, does NOT redirect to dashboard after login — used by escrow flow */
  noRedirect?: boolean;
}

export function AuthDialog({ open, onOpenChange, noRedirect = false }: AuthDialogProps) {
  const { login } = useAuth();

  const handleLogin = (email: string) => {
    login(email);
    onOpenChange(false);
    // Only redirect to dashboard when NOT inside a checkout flow
    if (!noRedirect && typeof window !== 'undefined') {
      // Small delay so providers can update before navigation
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border-t-4 border-t-primary shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-secondary flex items-center justify-center rounded-none">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-xl md:text-2xl font-black text-secondary uppercase tracking-tight">
              Sign In
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed text-left">
            Select your account to continue. Demo accounts are pre-configured.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.email)}
              className="flex items-start p-4 gap-4 hover:border-primary transition-all text-left bg-muted/20 border border-border/50 group rounded-none outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="bg-secondary p-2.5 group-hover:bg-primary transition-colors rounded-none shrink-0">
                {user.role === 'HIGH_ADMIN'    && <Shield      className="h-4 w-4 text-primary group-hover:text-secondary" />}
                {user.role === 'VENDOR_ADMIN'  && <Store       className="h-4 w-4 text-primary group-hover:text-secondary" />}
                {user.role === 'CUSTOMER'      && <UserIcon    className="h-4 w-4 text-primary group-hover:text-secondary" />}
                {user.role === 'VENDOR_STAFF'  && <ShieldCheck className="h-4 w-4 text-primary group-hover:text-secondary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-secondary text-sm uppercase tracking-tight">{user.name}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">
                  {user.role.replace(/_/g, ' ')}
                </p>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-dashed border-border">
                  <Key className="h-3 w-3 text-primary shrink-0" />
                  <span className="text-[9px] font-black text-secondary/60 tracking-widest truncate">{user.email}</span>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[7px] font-black px-2 py-0.5 rounded-none uppercase shrink-0 self-start mt-0.5">
                Demo
              </Badge>
            </button>
          ))}
        </div>

        <div className="bg-muted p-4 border border-dashed text-center rounded-none">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            VaultCommerce · Escrow-Protected Marketplace · Accra, Ghana
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
