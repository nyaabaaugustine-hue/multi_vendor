
"use client";

import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, Database, Globe, EyeOff, Activity } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="bg-secondary py-20 text-white relative">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary text-secondary font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
            Data Sovereignty
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Privacy Registry
          </h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">Encryption Level: AES-256 Protocol Node</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="p-10 bg-white border-2 border-primary/20 shadow-xl space-y-6">
            <Lock className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-black uppercase tracking-tight">Identity Protection</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              Your institutional identity nodes are encrypted and only accessible during authorized mediation sessions.
            </p>
          </div>
          <div className="p-10 bg-white border-2 border-primary/20 shadow-xl space-y-6">
            <Database className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-black uppercase tracking-tight">Zero-Log Protocol</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              We do not track browsing nodes for advertising clusters. Your marketplace exploration is strictly private.
            </p>
          </div>
          <div className="p-10 bg-white border-2 border-primary/20 shadow-xl space-y-6">
            <Globe className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-black uppercase tracking-tight">Sovereign Hosting</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
              All registry data is stored on decentralized nodes within the West African regional network.
            </p>
          </div>
        </div>

        <div className="mt-20 space-y-16">
          <div className="flex items-center gap-6">
            <div className="h-px bg-border flex-1" />
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter">Information Harvest</h2>
              <ul className="space-y-6">
                {[
                  { title: "Node Registry", desc: "Name, email, and verified phone nodes for escrow syncing." },
                  { title: "Financial Metadata", desc: "Treasury lock details and settlement history (AES encrypted)." },
                  { title: "Communication Audit", desc: "Institutional chat logs for mediation and trust analysis." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 group">
                    <div className="h-12 w-12 bg-secondary text-white flex items-center justify-center font-black text-lg group-hover:bg-primary group-hover:text-secondary transition-all">0{i+1}</div>
                    <div className="space-y-1">
                      <h4 className="font-black uppercase text-secondary tracking-tight">{item.title}</h4>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter">Control Hub</h2>
              <div className="bg-muted/20 p-8 border-l-4 border-secondary space-y-6">
                <div className="flex items-center gap-4">
                  <EyeOff className="h-6 w-6 text-secondary" />
                  <h4 className="font-black uppercase text-secondary text-sm">Right to Erasure</h4>
                </div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
                  At any point, you may request the decommissioning of your identity node from the registry. This will purge all non-legal transaction data.
                </p>
                <div className="flex items-center gap-4">
                  <Activity className="h-6 w-6 text-secondary" />
                  <h4 className="font-black uppercase text-secondary text-sm">Transparency Log</h4>
                </div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
                  Request a dump of all metadata currently associated with your unique account node.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
