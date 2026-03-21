
"use client";

import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, Lock, UserCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SafetyProtocol() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="bg-burgundy py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <Badge className="bg-white text-burgundy font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
            Trust Registry
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Safety Protocol
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
            Protecting the Sovereign Marketplace through elite escrow encryption and verified human nodes.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-20 max-w-5xl space-y-24">
        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6 text-center">
            <div className="h-20 w-20 bg-burgundy/5 border-2 border-burgundy flex items-center justify-center mx-auto rounded-none">
              <Lock className="h-10 w-10 text-burgundy" />
            </div>
            <h3 className="font-black uppercase tracking-tight text-xl">Escrow Lock</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              Funds are never released directly to sellers. They are locked in our treasury until you authorize dispatch.
            </p>
          </div>
          <div className="space-y-6 text-center">
            <div className="h-20 w-20 bg-burgundy/5 border-2 border-burgundy flex items-center justify-center mx-auto rounded-none">
              <UserCheck className="h-10 w-10 text-burgundy" />
            </div>
            <h3 className="font-black uppercase tracking-tight text-xl">Verified Nodes</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              Every vendor must provide verified identification before joining the institutional registry.
            </p>
          </div>
          <div className="space-y-6 text-center">
            <div className="h-20 w-20 bg-burgundy/5 border-2 border-burgundy flex items-center justify-center mx-auto rounded-none">
              <Eye className="h-10 w-10 text-burgundy" />
            </div>
            <h3 className="font-black uppercase tracking-tight text-xl">Real Audit</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              Our AI agents and human admins monitor all protocol activity for anomalous transaction nodes.
            </p>
          </div>
        </section>

        <Separator className="bg-border/50" />

        {/* Scams to avoid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter">Threat Mitigation</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Common marketplace scams and how our protocol blocks them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="rounded-none border-4 border-burgundy shadow-2xl bg-white">
              <CardHeader className="bg-burgundy/5 border-b p-8">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-burgundy" />
                  <CardTitle className="text-xl font-black uppercase tracking-tighter">Advance Payment Scam</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-xs font-medium text-muted-foreground uppercase leading-relaxed">
                  Sellers asking for delivery fees or "reservation deposits" via direct mobile money are a red flag.
                </p>
                <div className="bg-green-50 p-4 border-l-4 border-green-500">
                  <p className="text-[9px] font-black text-green-700 uppercase flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" /> Protocol Fix: Always use Vault Escrow.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-4 border-burgundy shadow-2xl bg-white">
              <CardHeader className="bg-burgundy/5 border-b p-8">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="h-8 w-8 text-burgundy" />
                  <CardTitle className="text-xl font-black uppercase tracking-tighter">Fake Receipt Fraud</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-xs font-medium text-muted-foreground uppercase leading-relaxed">
                  Buyers sending doctored SMS alerts or bank receipts to claim payment has been made.
                </p>
                <div className="bg-green-50 p-4 border-l-4 border-green-500">
                  <p className="text-[9px] font-black text-green-700 uppercase flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" /> Protocol Fix: Funds must reflect in Vault Wallet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Institutional Promise */}
        <section className="bg-secondary p-12 text-white text-center space-y-8 rounded-none">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto" />
          <h3 className="text-3xl font-black uppercase tracking-tighter">The Vault Guarantee</h3>
          <p className="text-xs font-medium text-white/50 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            If a transaction fails our fidelity audit or a vendor breaches the SLA window, your GHS liquidity is returned immediately. No exceptions.
          </p>
        </section>
      </div>
    </div>
  );
}
