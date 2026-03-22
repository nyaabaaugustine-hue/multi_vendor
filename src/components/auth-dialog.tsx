"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MOCK_USERS } from '@/lib/mock-data';
import { useAuth } from '@/components/providers';
import { ShieldCheck, User as UserIcon, Store, Shield, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, does NOT redirect to dashboard after login — used by escrow flow */
  noRedirect?: boolean;
}

export function AuthDialog({ open, onOpenChange, noRedirect = false }: AuthDialogProps) {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (email: string) => {
    login(email);
    onOpenChange(false);
    // Only redirect to dashboard when NOT inside a checkout flow
    if (!noRedirect) {
      router.push('/dashboard');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'HIGH_ADMIN': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'VENDOR_ADMIN': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'VENDOR_STAFF': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Select an account to test the platform.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Branding/Info */}
          <div className="w-full md:w-[40%] bg-[#09090b] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <ShieldCheck className="h-48 w-48 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">VaultCommerce</h2>
              <p className="text-xs text-white/50 uppercase font-bold tracking-widest leading-relaxed">
                Ghana's Secure Intent Engine
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Live Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold">ACCRA HUB ONLINE</span>
                </div>
              </div>
              <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.2em] text-center">
                Investor Demo Build v1.0
              </p>
            </div>
          </div>

          {/* Right Side: Account Selection */}
          <div className="w-full md:w-[60%] p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-foreground mb-1">Select Account</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Testing Environment</p>
            </div>

            <div className="grid gap-3">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.email)}
                  className="group flex items-center p-4 gap-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 text-left outline-none"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors shrink-0">
                    {user.role === 'HIGH_ADMIN'    && <Shield      className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                    {user.role === 'VENDOR_ADMIN'  && <Store       className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                    {user.role === 'CUSTOMER'      && <UserIcon    className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                    {user.role === 'VENDOR_STAFF'  && <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-foreground text-sm tracking-tight">{user.name}</p>
                      <Badge variant="outline" className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0 border-none", getRoleBadgeColor(user.role))}>
                        {user.role.split('_')[0]}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate opacity-60 font-mono">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dashed border-border text-center">
              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                One-Click Sandbox Access
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
