"use client";

import { MessageSquare, Heart, TrendingUp, CircleDollarSign } from 'lucide-react';
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
      <Card className="rounded-none border shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8 md:p-12 space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
            Create your Ecommerce account and enjoy all the benefits.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                {/* [FIX 3.3] Square icon container matching --radius: 0px system */}
                <div className="h-12 w-12 rounded-none border border-border bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[13px] font-medium leading-relaxed text-secondary/80">
                  <span className="font-bold">{title}</span> {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => setShowAuth(true)}
              className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-sm uppercase tracking-tight shadow-lg border-2 border-primary/20 rounded-none transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Create a free account
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
