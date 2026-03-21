"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Plus, X, ShieldCheck, Info, Calculator, ArrowRightLeft, Camera, MapPin } from 'lucide-react';
import { generateListingDescription } from '@/ai/flows/ai-generated-listing-description-flow';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Please enter a price"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Please enter a location"),
  condition: z.enum(['New', 'Used', 'Not Applicable']).default('Used'),
});

export function ListingCreateForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      price: "",
      description: "",
      location: "Accra, Ghana",
      condition: "Used",
    },
  });

  const watchPrice = form.watch('price');
  const commissionRate = 0.025; 
  
  const payoutStats = useMemo(() => {
    const price = parseFloat(watchPrice) || 0;
    const treasuryFee = price * commissionRate;
    const netEarnings = price - treasuryFee;
    return { treasuryFee, netEarnings };
  }, [watchPrice]);

  const handleGenerateDescription = async () => {
    const title = form.getValues('title');
    const category = form.getValues('category');

    if (!title || !category) {
      toast({
        title: "Information Incomplete",
        description: "Please provide a title and category first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateListingDescription({
        title,
        category,
        keyFeatures: ["Verified Item", "Escrow Secured", "Fast Delivery"],
        length: 'medium',
        tone: 'professional'
      });
      form.setValue('description', result.description);
      toast({ title: "AI Synthesis Successful" });
    } catch (error) {
      toast({ title: "AI Assistant Offline", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Listing Authorized",
      description: "Asset is now live with Escrow Protection.",
    });
  }

  return (
    <div className="space-y-10">
      {/* STEPS INDICATOR */}
      <div className="flex justify-between max-w-md mx-auto mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={cn(
              "h-10 w-10 flex items-center justify-center font-black transition-all",
              step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {s}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{s === 1 ? 'Category' : s === 2 ? 'Details' : 'Publish'}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Select Marketplace Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none h-16 border-2 focus:border-accent text-lg font-black uppercase">
                          <SelectValue placeholder="What are you selling?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Vehicles">Vehicles & Transport</SelectItem>
                        <SelectItem value="Property">Property & Real Estate</SelectItem>
                        <SelectItem value="Electronics">Electronics & Tech</SelectItem>
                        <SelectItem value="Home & Furniture">Home & Furniture</SelectItem>
                        <SelectItem value="Jobs">Jobs & Careers</SelectItem>
                        <SelectItem value="Services">Services & Tasks</SelectItem>
                        <SelectItem value="Agriculture">Agriculture & Food</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer group">
                   <Camera className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Add Asset Images</p>
                </div>
                <div className="p-8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer group">
                   <Plus className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Add Media File</p>
                </div>
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full h-16 bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl">
                Continue to Details
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Listing Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota Corolla 2015" className="rounded-none h-14 border-2 focus:border-accent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Price (GH₵)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary">GH₵</span>
                          <Input type="number" placeholder="0.00" className="rounded-none h-14 pl-16 border-2 focus:border-accent" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. East Legon, Accra" className="rounded-none h-14 border-2 focus:border-accent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none h-14 border-2 focus:border-accent">
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none">
                          <SelectItem value="New">Brand New</SelectItem>
                          <SelectItem value="Used">Used / Pre-owned</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-3">
                      <FormLabel className="text-secondary font-black uppercase text-[10px] tracking-widest">Description</FormLabel>
                      <Button 
                        type="button" 
                        size="sm" 
                        className="h-10 gap-3 bg-secondary text-accent font-black rounded-none px-8 shadow-lg text-[9px] tracking-[0.2em] uppercase"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                      >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        AI Optimizer
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Comprehensive details about your asset..." 
                        className="min-h-[200px] rounded-none border-2 focus:border-accent p-6 font-medium" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-16 font-black uppercase tracking-widest border-2">Back</Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-[2] h-16 bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl">Finalize Listing</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="bg-secondary p-10 rounded-none text-white relative overflow-hidden border-b-4 border-accent shadow-2xl">
                <div className="absolute -left-16 -top-16 w-40 h-40 bg-accent/5 rounded-none blur-3xl" />
                <CardContent className="p-0 space-y-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-5 rounded-none border border-white/20">
                      <ShieldCheck className="h-10 w-10 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Escrow Security Active</h4>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Your listing will be protected by VaultCommerce Escrow.</p>
                    </div>
                  </div>

                  {watchPrice && (
                    <div className="bg-white/5 p-8 border border-white/10 space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                        <span>Sale Value</span>
                        <span>Fee (2.5%)</span>
                        <span className="text-accent">You Receive</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-black">GH₵{parseFloat(watchPrice).toLocaleString()}</span>
                        <span className="text-xl font-black text-destructive">-GH₵{payoutStats.treasuryFee.toFixed(2)}</span>
                        <span className="text-3xl font-black text-accent">GH₵{payoutStats.netEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-widest">
                    By publishing, you agree to our Sovereign Terms. Funds are held in our secure gateway until the buyer authorizes release after inspection.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-16 font-black uppercase tracking-widest border-2">Review</Button>
                <Button type="submit" className="flex-[2] h-16 bg-accent text-secondary hover:bg-white font-black uppercase tracking-[0.2em] shadow-2xl text-lg">
                  Publish To Marketplace
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}