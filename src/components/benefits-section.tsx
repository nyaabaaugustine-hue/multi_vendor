"use client";

import { MessageSquare, Heart, TrendingUp, CircleDollarSign, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/providers';
import { useState } from 'react';
import { AuthDialog } from '@/components/auth-dialog';

/**
 * @fileOverview Institutional Benefits Command Node
 *
 * FIXES APPLIED:
 * [FIX 3.3] Icon containers changed from rounded-full to rounded-none + border
 *           to match global --radius: 0px design system. No more radius inconsistency.
 */
export function BenefitsSection() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (user) return null;

  const benefits = [
    {
      icon: CircleDollarSign,
      title: "Advertise for free",
      desc: "and sell your products, cars, and real estate without paying anything.",
    },
    {
      icon: MessageSquare,
      title: "Negotiate with buyers and sellers",
      desc: "through the Ecommerce chat and protect yourself from scams.",
    },
    {
      icon: Heart,
      title: "Favorite the offers",
      desc: "you liked the most.",
    },
    {
      icon: TrendingUp,
      title: "Personalized recommendations",
      desc: "We send curated picks to help you find the perfect match.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 py-12">
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Card className="rounded-none border-2 border-primary/20 shadow-2xl bg-slate-900 overflow-hidden">
        <CardContent className="p-8 md:p-12 space-y-10">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Create your <span className="text-primary underline decoration-4 underline-offset-8">Ecommerce</span> account and enjoy all the benefits.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 group">
                {/* [FIX 3.3] Square icon container matching --radius: 0px system */}
                <div className="h-14 w-14 rounded-none border-2 border-white/10 bg-white/5 flex items-center justify-center shrink-0 transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[13px] font-black uppercase tracking-widest text-white leading-tight">{title}</h4>
                  <p className="text-[11px] font-medium leading-relaxed text-white/50 uppercase tracking-tighter">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-6 flex-wrap">
            <Button 
              onClick={() => setShowAuth(true)}
              className="h-16 px-12 bg-primary text-slate-900 hover:bg-white hover:text-slate-900 font-black text-xs uppercase tracking-[0.2em] shadow-2xl rounded-none transition-all hover:-translate-y-1 active:scale-95"
            >
              Create a free account
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure Escrow Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
