
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
    <section className="max-w-7xl mx-auto w-full px-4 py-12 border-t border-border/50">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-8 border-b rounded-none mb-10 w-full overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="main" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-muted-foreground data-[state=active]:text-primary"
          >
            Main Categories
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-muted-foreground data-[state=active]:text-primary"
          >
            Popular Surveys
          </TabsTrigger>
          <TabsTrigger 
            value="links" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-muted-foreground data-[state=active]:text-primary"
          >
            Useful links
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-0 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {CATEGORY_COLUMNS.map((column, colIdx) => (
              <ul key={colIdx} className="space-y-3">
                {column.map((cat) => (
                  <li key={cat}>
                    <a 
                      href="/listings" 
                      className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors block leading-tight"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="animate-in fade-in duration-500">
          <p className="text-[13px] font-medium text-muted-foreground">Rent trends in Accra, Vehicle value index Ghana, Electronics market reports.</p>
        </TabsContent>
        
        <TabsContent value="links" className="animate-in fade-in duration-500">
          <div className="flex flex-wrap gap-8">
            <a href="/about" className="text-[13px] font-medium text-muted-foreground hover:text-primary underline">Escrow Guide</a>
            <a href="/contact" className="text-[13px] font-medium text-muted-foreground hover:text-primary underline">Safety Tips</a>
            <a href="/contact" className="text-[13px] font-medium text-muted-foreground hover:text-primary underline">Contact Us</a>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
