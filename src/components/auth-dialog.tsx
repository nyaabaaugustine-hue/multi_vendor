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
          <div className="w-full md:w-[40%] bg-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <ShieldCheck className="h-48 w-48 rotate-12 text-amber-600" />
            </div>
            
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-none bg-amber-600 flex items-center justify-center mb-6 shadow-xl shadow-amber-600/20">
                <ShieldCheck className="h-7 w-7 text-slate-950" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase italic">VaultCommerce</h2>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] leading-relaxed">
                Secure Marketplace
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="p-5 rounded-none bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">System Status</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Accra Hub Online</span>
                </div>
              </div>
              <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.4em] text-center">
                Version 1.5.9
              </p>
            </div>
          </div>

          {/* Right Side: Account Selection */}
          <div className="w-full md:w-[60%] p-10 bg-background">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-amber-950 uppercase tracking-tighter italic">Select Account</h3>
              <p className="text-[10px] text-amber-700/60 font-black uppercase tracking-widest mt-1">Authorized Testing Environment</p>
            </div>

            <div className="grid gap-4">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.email)}
                  className="group flex items-center p-5 gap-5 rounded-none border-2 border-amber-600/5 hover:border-amber-600/40 hover:bg-amber-50 transition-all duration-500 text-left outline-none"
                >
                  <div className="h-14 w-14 rounded-none bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors shrink-0 border border-amber-600/10">
                    {user.role === 'HIGH_ADMIN'    && <Shield      className="h-6 w-6 text-amber-700/40 group-hover:text-amber-600" />}
                    {user.role === 'VENDOR_ADMIN'  && <Store       className="h-6 w-6 text-amber-700/40 group-hover:text-amber-600" />}
                    {user.role === 'CUSTOMER'      && <UserIcon    className="h-6 w-6 text-amber-700/40 group-hover:text-amber-600" />}
                    {user.role === 'VENDOR_STAFF'  && <ShieldCheck className="h-6 w-6 text-amber-700/40 group-hover:text-amber-600" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-amber-950 text-sm tracking-tight uppercase">{user.name}</p>
                      <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-2 rounded-none", 
                        user.role === 'HIGH_ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                        user.role === 'VENDOR_ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        user.role === 'VENDOR_STAFF' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      )}>
                        {user.role.split('_')[0]}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-amber-700/40 truncate font-black uppercase tracking-tighter">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t-2 border-dashed border-amber-600/10 text-center">
              <p className="text-[10px] font-black text-amber-700/20 uppercase tracking-[0.3em]">
                One-Click Secure Login
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
