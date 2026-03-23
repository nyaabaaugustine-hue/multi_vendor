
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { VENDORS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function VendorRegistry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('All');

  const SECTORS = ['All', 'Electronics', 'Real Estate', 'Home & Living'];

  const filteredVendors = VENDORS.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = activeSector === 'All' || v.category === activeSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Institutional Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Badge className="bg-amber-600 text-white rounded-none font-black text-[10px] px-4 py-1.5 uppercase tracking-widest border-none">Marketplace v1.4</Badge>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Network Active</span>
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
            Verified <br /> <span className="text-amber-600">Vendor Directory</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl leading-relaxed">
            Authorized directory of verified partners. Every vendor in this registry is protected by our Secure Buy system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search Vendors..." 
                className="pl-12 rounded-none h-14 border-2 focus:border-amber-600 font-bold uppercase text-[10px] tracking-widest bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <Button className="rounded-none h-14 px-8 bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-slate-900 border border-amber-600/20">
              <Filter className="h-4 w-4 text-amber-600" />
              Filter Categories
           </Button>
        </div>
      </div>

      {/* Sector Navigation */}
      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-4 border-b border-border/40">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={cn(
              "whitespace-nowrap px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
              activeSector === sector ? "border-amber-600 text-amber-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Vendor Grid - UPGRADED TO SQUARE AESTHETIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="rounded-none border-2 border-border/50 hover:border-amber-600 group transition-all duration-500 bg-background overflow-hidden shadow-sm hover:shadow-2xl flex flex-col">
            <div className="relative h-56 w-full overflow-hidden bg-slate-950">
              <Image 
                src={vendor.bgUrl} 
                alt={vendor.name} 
                fill 
                className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700 contrast-125" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute bottom-6 left-8 flex items-end gap-5">
                <div className="relative h-20 w-20 bg-white border-2 border-amber-600 shadow-2xl p-2 rounded-none">
                  <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-contain p-1" unoptimized />
                </div>
                <div className="pb-1">
                  <Badge className="bg-amber-600 text-white rounded-none font-black text-[8px] uppercase tracking-widest mb-2 border-none">
                    {vendor.category}
                  </Badge>
                  <h3 className="font-black text-white text-xl tracking-tighter uppercase leading-none">{vendor.name}</h3>
                </div>
              </div>
              <div className="absolute top-6 right-8">
                 <div className="bg-amber-600 px-4 py-2 shadow-2xl flex flex-col items-center">
                    <span className="text-[10px] font-black text-white leading-none mb-1 uppercase tracking-widest">TRUST</span>
                    <span className="text-xl font-black text-white leading-none">{vendor.fidelityScore}%</span>
                 </div>
              </div>
            </div>

            <CardContent className="p-10 space-y-8 flex-1 bg-white">
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed uppercase tracking-wide h-10 line-clamp-2">
                {vendor.description}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Active Items</p>
                   <p className="text-lg font-black text-foreground">{vendor.itemsCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Market Trust</p>
                   <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-lg font-black text-foreground">{vendor.rating}</span>
                   </div>
                </div>
              </div>

              {/* Performance Radar Node */}
              <div className="bg-slate-950 p-6 border-l-4 border-amber-600 space-y-4">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-white">
                       <Activity className="h-3 w-3 text-amber-600" />
                       Vendor Status
                    </span>
                    <span className="text-amber-600">OPTIMIZED</span>
                 </div>
                 <Progress value={92} className="h-1 rounded-none bg-white/10" />
                 <div className="flex justify-between items-center text-[8px] font-bold text-white/40 uppercase">
                    <span>Payment Release: 1.2h</span>
                    <span>SLA: 100%</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-dashed flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground">Secure Buy Protected</span>
                 </div>
                 <Link href={`/listings?vendorId=${vendor.id}`} className="block">
                    <Button variant="outline" className="rounded-none font-black text-[9px] uppercase tracking-[0.2em] border-amber-600/20 hover:bg-amber-600 hover:text-white transition-all gap-2">
                      View Items
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registry Footer */}
      <div className="mt-24 bg-slate-950 p-12 text-white relative overflow-hidden rounded-none border-t-4 border-amber-600">
        <div className="absolute top-0 right-0 h-64 w-64 bg-amber-600/10 -mr-32 -mt-32 rounded-none blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-2xl font-black uppercase tracking-tighter">Become a Partner</h4>
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest max-w-lg leading-relaxed">
              Are you a business looking to join our verified marketplace? Apply for vendor status and benefit from secure buy protection.
            </p>
          </div>
          <Button className="bg-amber-600 text-white hover:bg-amber-700 rounded-none px-12 h-16 font-black uppercase text-[11px] tracking-[0.3em] gap-3 shadow-2xl transition-all border-none">
            <Zap className="h-5 w-5" />
            Join Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
}
