
"use client";

import { useContent } from '@/components/providers';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { content } = useContent();
  const page = content.pages.contact;

  if (!page) return null;

  return (
    <div className="bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Interactive Form Node */}
        <section className="p-8 md:p-24 space-y-16 bg-white border-r">
          <div className="space-y-6">
            <Badge className="bg-primary text-secondary font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
              Institutional Support
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter uppercase leading-none">
              {page.sections.support.title}
            </h1>
            <p className="text-muted-foreground text-lg font-medium uppercase tracking-widest leading-relaxed">
              {page.sections.support.description}
            </p>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Authorized Name</label>
                <Input className="rounded-none h-14 border-2 focus:border-primary font-bold" placeholder="e.g. Yaw Mensah" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Registry Email</label>
                <Input className="rounded-none h-14 border-2 focus:border-primary font-bold" placeholder="support@vault.gh" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Institutional Message</label>
              <Textarea className="rounded-none min-h-[200px] border-2 focus:border-primary font-medium" placeholder="Describe your inquiry or escrow dispute node..." />
            </div>
            <Button className="w-full md:w-auto px-16 h-16 bg-secondary text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-none shadow-2xl hover:bg-primary transition-all gap-3">
              AUTHORIZE SEND <Send className="h-5 w-5" />
            </Button>
          </form>
        </section>

        {/* Right: Visual Node & Metadata */}
        <section className="relative min-h-[600px] bg-secondary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src={page.sections.support.imageUrl} alt="Support" fill className="object-cover" />
          </div>
          <div className="relative z-10 p-8 md:p-24 flex flex-col justify-center h-full space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-primary">
                    <Phone className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Global Hotline</span>
                  </div>
                  <p className="text-2xl font-black tracking-tight">{content.settings.supportPhone}</p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-primary">
                    <Mail className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Registry Email</span>
                  </div>
                  <p className="text-xl font-black tracking-tight">{content.settings.supportEmail}</p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-primary">
                    <MapPin className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Command Center</span>
                  </div>
                  <p className="text-base font-black tracking-tight uppercase leading-relaxed">
                    Airport Residential Area,<br />
                    Accra, Ghana Registry Node
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-primary">
                    <Clock className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Active Window</span>
                  </div>
                  <p className="text-base font-black tracking-tight uppercase">24/7 Institutional Access</p>
               </div>
            </div>

            <div className="bg-white/5 p-10 border border-white/10 space-y-6">
               <div className="flex items-center gap-4">
                 <MessageSquare className="h-8 w-8 text-primary" />
                 <h4 className="text-xl font-black uppercase tracking-tighter">Instant Mediation</h4>
               </div>
               <p className="text-white/50 text-xs font-medium uppercase tracking-widest leading-relaxed">
                  For immediate escrow disputes or registry authorization issues, connect directly with our High Admin node via the WhatsApp protocol.
               </p>
               <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-secondary rounded-none font-black text-[10px] uppercase tracking-widest h-12 px-8">
                 Launch Mediation Session
               </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
