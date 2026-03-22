
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CATEGORY_COLUMNS = [
  [
    "Cell phones and telephony",
    "Used and Pre-Owned Cars",
    "Motorcycles",
    "Computers and Accessories",
    "Houses"
  ],
  [
    "Furniture",
    "Home appliances",
    "Video games",
    "Audio, TV, Video and Photography",
    "Dogs and Accessories"
  ],
  [
    "Apartments",
    "Auto Parts",
    "Job Openings",
    "Services",
    "Building and garden materials"
  ],
  [
    "Children's items",
    "Land and plots",
    "Clothing and footwear",
    "Sports and gymnastics",
    "Beauty and personal care"
  ],
  [
    "Jewelry, watches and accessories",
    "Household items",
    "Musical instruments",
    "Motorcycle parts",
    "Decorative objects"
  ]
];

/**
 * @fileOverview Institutional Footer Tabs Node
 * 1:1 structural clone of the OLX footer tab interaction.
 * Aligned to the 1280px (max-w-7xl) grid.
 */
export function FooterTabs() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 py-24 border-t border-border/50 bg-background">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-12 border-b border-border/50 rounded-none mb-16 w-full overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="main" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-6 text-xs font-black uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all"
          >
            Main Categories
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-6 text-xs font-black uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all"
          >
            Popular Surveys
          </TabsTrigger>
          <TabsTrigger 
            value="links" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-6 text-xs font-black uppercase tracking-[0.2em] text-foreground/40 data-[state=active]:text-primary transition-all"
          >
            Useful links
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {CATEGORY_COLUMNS.map((column, colIdx) => (
              <ul key={colIdx} className="space-y-4">
                {column.map((cat) => (
                  <li key={cat}>
                    <a 
                      href="/listings" 
                      className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary transition-all block leading-tight hover:translate-x-1"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-[12px] font-black uppercase tracking-widest text-foreground/60 leading-relaxed max-w-2xl">
            Rent trends in Accra, Vehicle value index Ghana, Electronics market reports.
          </p>
        </TabsContent>
        
        <TabsContent value="links" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-wrap gap-12">
            {['Escrow Guide', 'Safety Tips', 'Contact Us'].map((link) => (
              <a 
                key={link}
                href={link === 'Contact Us' ? '/contact' : '/about'} 
                className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-all"
              >
                <span className="h-px w-6 bg-foreground/10 group-hover:bg-primary transition-all" />
                {link}
              </a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
