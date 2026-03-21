
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, 
  Home, 
  ShoppingBag, 
  ShieldCheck, 
  Monitor,
  Building2,
  Key,
  Briefcase,
  Armchair,
  Zap,
  ShieldAlert,
  Store,
  Star,
  Car,
  Truck,
  Wrench,
  Smartphone,
  Tv,
  Refrigerator
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SECTORS = [
  {
    title: "Vehicles & Transport",
    subtitle: "Verified Nodes",
    icon: Car,
    bgImage: "https://images.unsplash.com/photo-1562141961-b5d1852d7316?q=80&w=600&auto=format&fit=crop",
    items: [
      { name: "Cars & SUVs", href: "/listings?category=Vehicles", icon: Car, desc: "Luxury & Pre-owned" },
      { name: "Commercial Trucks", href: "/listings?category=Vehicles", icon: Truck, desc: "Logistics Assets" },
      { name: "Auto Parts", href: "/listings?category=Vehicles", icon: Wrench, desc: "Verified Spares" },
    ]
  },
  {
    title: "Property & Services",
    subtitle: "Verified Nodes",
    icon: Home,
    bgImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
    items: [
      { name: "Houses & Land", href: "/listings?category=Property", icon: Key, desc: "Residential Assets" },
      { name: "Commercial Space", href: "/listings?category=Property", icon: Building2, desc: "Ridge & Osu Nodes" },
      { name: "Professional Services", href: "/listings?category=Services", icon: Briefcase, desc: "Legal & IT Audit" },
    ]
  },
  {
    title: "Electronics & Home",
    subtitle: "Verified Nodes",
    icon: ShoppingBag,
    bgImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop",
    items: [
      { name: "Laptops & Tech", href: "/listings?category=Electronics", icon: Monitor, desc: "Institutional Hardware" },
      { name: "Furniture & Decor", href: "/listings?category=Home & Furniture", icon: Armchair, desc: "Luxury Suites" },
      { name: "Kitchen & Appliances", href: "/listings?category=Electronics", icon: Refrigerator, desc: "Smart Home Nodes" },
    ]
  }
];

export function MegaMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-full px-4 flex flex-col items-center justify-center rounded-none hover:bg-muted group transition-all gap-1">
          <span className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground font-black group-hover:text-primary transition-colors">Global Directory</span>
          <span className="font-black text-foreground text-[11px] group-hover:text-primary transition-colors uppercase tracking-tighter">Shop Categories</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[95vw] max-w-7xl mx-auto p-0 border-x-0 border-t-4 border-t-primary shadow-2xl rounded-none bg-background overflow-hidden transition-colors duration-300" align="center" sideOffset={10}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Categories */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 divide-x border-b lg:border-b-0 border-border">
            {SECTORS.map((sector, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="relative h-24 w-full overflow-hidden border-b border-border bg-muted/20">
                  <Image src={sector.bgImage} alt={sector.title} fill sizes="400px" className="object-cover opacity-20 contrast-125" />
                  <div className="absolute inset-0 p-6 flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <sector.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground uppercase tracking-[0.15em] text-[10px] leading-tight">{sector.title}</h3>
                      <p className="text-[7px] text-primary font-black uppercase tracking-[0.3em] mt-0.5 flex items-center gap-1.5">
                        <ShieldCheck className="h-2 w-2" />
                        {sector.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                  <ul className="space-y-4">
                    {sector.items.map((item, i) => (
                      <li key={i}>
                        <Link 
                          href={item.href} 
                          className="group flex items-start gap-4 text-muted-foreground hover:text-primary transition-all"
                        >
                          <div className="mt-0.5 p-2 bg-muted rounded-none group-hover:bg-primary/10 transition-colors shrink-0">
                            <item.icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 group-hover:text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                              <ChevronRight className="h-2.5 w-2.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                            </div>
                            <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Spotlight */}
          <div className="lg:col-span-3 bg-card border-l border-border p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -mr-32 -mt-32 rounded-none blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                <Badge className="bg-primary text-primary-foreground font-black rounded-none uppercase text-[8px] tracking-[0.3em] px-3 py-1 border-none">
                  Partner Spotlight
                </Badge>
                <h3 className="text-xl md:text-2xl font-black tracking-tighter leading-none uppercase text-foreground">
                  OPEN <span className="text-primary">VENDOR</span> <br /> NETWORK
                </h3>
                <p className="text-muted-foreground text-[10px] font-medium leading-relaxed uppercase tracking-widest">
                  Every business can register to become a verified escrow partner.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary border-b border-border pb-2">Top Marketplace Sellers</p>
                <div className="space-y-3">
                  <Link href="/vendors" className="flex items-center gap-4 p-4 bg-muted/20 border border-border hover:border-primary transition-all cursor-pointer group">
                    <div className="h-10 w-10 bg-white relative p-1 shrink-0 border border-border">
                      <Image 
                        src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1773999402/file_eognv9.jpg" 
                        fill 
                        sizes="40px"
                        className="object-contain" 
                        alt="Melcom" 
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors text-foreground">Melcom Hub</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-2 w-2 fill-gold text-gold" />
                        <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">Verified Node • 4.9</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/vendors" className="mt-8 relative z-10">
              <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 font-black rounded-none h-12 uppercase text-[10px] tracking-[0.3em] gap-3 shadow-2xl transition-all">
                Browse Full Directory <Store className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-muted py-4 px-10 flex flex-col md:flex-row justify-between items-center border-t border-dashed border-border gap-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">99.4% Fulfillment Rate</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Multisig Escrow Active</span>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-primary text-[8px] font-black px-3 py-1 uppercase tracking-widest text-primary bg-primary/5">
            Sovereign Certified
          </Badge>
        </div>
      </PopoverContent>
    </Popover>
  );
}
