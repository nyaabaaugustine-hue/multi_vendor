
"use client";

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsOfUse() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="bg-secondary py-20 text-white relative">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary text-secondary font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
            Institutional Legal
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Terms of Use
          </h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">Protocol Version v1.4.2 • Effective Jan 2026</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <ScrollArea className="h-[600px] border-4 border-secondary p-8 md:p-12 bg-white shadow-2xl">
          <div className="space-y-12 text-secondary font-medium text-sm leading-relaxed uppercase tracking-wider">
            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tighter">1. Acceptance of Protocols</h2>
              <p>
                By accessing the VaultCommerce Registry Node, you agree to be cryptographically bound by these Sovereign Terms. Use of the platform for any non-verified or illegal trade node is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tighter">2. The Escrow Mandate</h2>
              <p>
                VaultCommerce acts as a mandatory escrow node for all GHS-Accra transactions. Users are forbidden from bypassing the escrow protocol to initiate direct payments. Failure to comply results in immediate registry termination.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tighter">3. Vendor Node Responsibility</h2>
              <p>
                Verified Vendors must maintain a minimum Fidelity Score of 90%. Any breach of product authenticity or SLA dispatch window will trigger a treasury freeze and mediation session.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tighter">4. Dispute Mediation</h2>
              <p>
                In the event of a failed quality audit, the High Admin node has final multisig authorization on fund release or reversal. Mediation sessions are conducted via an institutional chat node.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tighter">5. Limitation of Liability</h2>
              <p>
                VaultCommerce is a marketplace aggregator. While we provide elite escrow protection, we are not liable for the physical quality of assets beyond the verified inspection window.
              </p>
            </section>
          </div>
        </ScrollArea>
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Institutional Registry Node: Airport Residential Area, Accra - 00233-GH-ACC</p>
        </div>
      </div>
    </div>
  );
}
