
"use client";

import { useContent } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Search, MessageSquare, Phone, Mail, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HelpCenter() {
  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-secondary py-20 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <Badge className="bg-primary text-secondary font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
            Registry Support
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Help Center
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search institutional support nodes..." 
              className="h-16 pl-16 rounded-none border-none bg-white text-secondary font-bold text-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Categories Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Support Nodes</h3>
            <div className="grid gap-2">
              {['Escrow Guide', 'Safety & Trust', 'Payments & Settlements', 'Vendor Registry', 'My Account'].map((cat) => (
                <Button key={cat} variant="outline" className="justify-between rounded-none border-2 font-black uppercase text-[10px] tracking-widest h-12 hover:bg-primary/5">
                  {cat}
                  <HelpCircle className="h-4 w-4 text-primary" />
                </Button>
              ))}
            </div>
          </div>

          <Card className="rounded-none border-t-4 border-t-primary bg-white shadow-xl">
            <CardContent className="p-8 space-y-6">
              <MessageSquare className="h-10 w-10 text-primary" />
              <h4 className="text-xl font-black uppercase tracking-tighter">Need Mediation?</h4>
              <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-widest">
                Our High Admin node is available 24/7 for escrow dispute resolution.
              </p>
              <Button className="w-full bg-secondary text-white font-black rounded-none h-12 uppercase text-[10px] tracking-widest gap-2">
                Launch WhatsApp Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Registry */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter">Frequently Asked Protocols</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-2 border-dashed py-4">
                <AccordionTrigger className="text-left font-black uppercase text-sm tracking-tight hover:text-primary">
                  How does the Sovereign Escrow Protocol work?
                </AccordionTrigger>
                <AccordionContent className="text-xs font-medium text-muted-foreground uppercase leading-relaxed tracking-widest pt-4">
                  When you initiate a purchase, your GHS funds are held in our secure treasury node. The vendor is notified to ship the asset. Once you receive and verify the item, you authorize the release of funds. If the item is not dispatched within 48 hours, a refund node is automatically triggered.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-2 border-dashed py-4">
                <AccordionTrigger className="text-left font-black uppercase text-sm tracking-tight hover:text-primary">
                  What is a "Fidelity Score"?
                </AccordionTrigger>
                <AccordionContent className="text-xs font-medium text-muted-foreground uppercase leading-relaxed tracking-widest pt-4">
                  Every vendor node is analyzed based on SLA compliance, product quality, and escrow resolution speed. A higher score indicates a more institutional level of trust within the registry.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-2 border-dashed py-4">
                <AccordionTrigger className="text-left font-black uppercase text-sm tracking-tight hover:text-primary">
                  Is my payment data secure?
                </AccordionTrigger>
                <AccordionContent className="text-xs font-medium text-muted-foreground uppercase leading-relaxed tracking-widest pt-4">
                  Yes. We utilize cryptographic hashing and multisig authorization for all treasury transactions. We never store raw card or mobile money details on our primary registry nodes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-muted/30 border-l-4 border-primary space-y-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h5 className="font-black uppercase text-sm tracking-tighter">Gold Standard Reviews</h5>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">Access verified user audits for every product listed in the registry.</p>
            </div>
            <div className="p-8 bg-muted/30 border-l-4 border-primary space-y-4">
              <Zap className="h-8 w-8 text-primary" />
              <h5 className="font-black uppercase text-sm tracking-tighter">Fast Settlements</h5>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">Vendors receive GHS liquidity within 2 hours of customer authorization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
