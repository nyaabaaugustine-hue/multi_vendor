
"use client";

import { useContent } from '@/components/providers';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Target, Award, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  const { content } = useContent();
  const page = content.pages.about;

  if (!page) return null;

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-secondary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={page.sections.mission.imageUrl} alt="Mission" fill className="object-cover contrast-150" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <Badge className="bg-primary text-secondary font-black uppercase text-[10px] tracking-[0.4em] px-6 py-2 rounded-none">
            Institutional Registry
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            {page.sections.mission.title}
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
            {page.sections.mission.description}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">The Protocol</span>
                </div>
                <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase leading-tight">
                  {page.sections.values.title}
                </h2>
                <Separator className="w-20 h-1.5 bg-primary" />
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium uppercase tracking-wide">
                {page.sections.values.description}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-muted/30 border-l-4 border-primary space-y-2">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <p className="text-xs font-black uppercase tracking-widest">Multisig Security</p>
                </div>
                <div className="p-6 bg-muted/30 border-l-4 border-primary space-y-2">
                  <Award className="h-8 w-8 text-primary" />
                  <p className="text-xs font-black uppercase tracking-widest">Sovereign Quality</p>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] border-8 border-primary shadow-2xl overflow-hidden image-reveal">
               <Image src={page.sections.values.imageUrl} alt="Values" fill className="object-cover" />
               <div className="absolute inset-0 bg-primary/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background border-t">
        <div className="container mx-auto px-4 text-center space-y-12">
           <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase">The Governance Board</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[1, 2, 3].map((i) => (
               <div key={i} className="space-y-4 group">
                 <div className="relative h-80 bg-muted overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                   <Image src={`https://picsum.photos/seed/${i + 50}/400/600`} alt="Board Member" fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                 </div>
                 <div className="text-center">
                    <p className="font-black text-secondary uppercase tracking-widest text-sm">Director Node {i}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Institutional Oversight</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}
