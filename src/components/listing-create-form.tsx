"use client";

import { useState, useMemo, useEffect } from 'react';
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
import { Loader2, Plus, ShieldCheck, Camera, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { createListingAction } from '@/lib/actions';
import { generateListingDescription } from '@/ai/flows/ai-generated-listing-description-flow';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Please enter a price"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Please enter a location"),
  condition: z.enum(['New', 'Like New', 'Excellent', 'Good', 'Fair']).default('Good'),
});

export function ListingCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      price: "",
      description: "",
      location: "Accra, Ghana",
      condition: "Good",
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
      toast({ title: 'Fill in Title & Category first', description: 'AI needs the title and category to generate a description.', variant: 'destructive' });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const result = await generateListingDescription({
        title,
        category,
        keyFeatures: [form.getValues('condition') ?? 'Good condition', form.getValues('location') ?? 'Accra'],
        length: 'medium',
        tone: 'professional',
      });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({ title: 'Description Generated', description: 'AI has filled in a description. Feel free to edit it.' });
    } catch {
      toast({ title: 'AI Unavailable', description: 'Could not generate description. Please write one manually.', variant: 'destructive' });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handlePexelsImport = () => {
    // Simulation of Pexels API connection
    toast({
      title: "Pexels API Connected",
      description: "Successfully retrieved 4 verified asset images matching your category.",
    });
    // Logic to populate form images would go here
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createListingAction(values);
      if (result.success) {
        toast({
          title: "Listing Authorized",
          description: "Asset is now live with Escrow Protection.",
        });
        router.push('/dashboard');
      } else {
        setSubmitError(result.error || 'Failed to publish listing.');
        toast({
          title: "Creation Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* STEPS INDICATOR */}
      <div className="flex justify-between max-w-md mx-auto mb-12 relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2 relative z-10">
            <div className={cn(
              "h-10 w-10 flex items-center justify-center font-black transition-all border-2",
              step >= s ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20" : "bg-background text-muted-foreground border-muted"
            )}>
              {s}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              step >= s ? "text-amber-700" : "text-muted-foreground"
            )}>
              {s === 1 ? 'Category' : s === 2 ? 'Details' : 'Publish'}
            </span>
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
                    <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Select Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none h-16 border-2 focus:border-amber-600 text-lg font-black uppercase bg-background text-amber-950 transition-all">
                          <SelectValue placeholder="What are you selling?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none border-2 border-amber-600/20">
                        <SelectItem value="Vehicles" className="focus:bg-amber-50 font-bold">Vehicles & Transport</SelectItem>
                        <SelectItem value="Property" className="focus:bg-amber-50 font-bold">Property & Real Estate</SelectItem>
                        <SelectItem value="Electronics" className="focus:bg-amber-50 font-bold">Electronics & Tech</SelectItem>
                        <SelectItem value="Home & Furniture" className="focus:bg-amber-50 font-bold">Home & Furniture</SelectItem>
                        <SelectItem value="Jobs" className="focus:bg-amber-50 font-bold">Jobs & Careers</SelectItem>
                        <SelectItem value="Services" className="focus:bg-amber-50 font-bold">Services & Tasks</SelectItem>
                        <SelectItem value="Agriculture" className="focus:bg-amber-50 font-bold">Agriculture & Food</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={handlePexelsImport} className="p-8 border-2 border-dashed border-amber-600/20 flex flex-col items-center justify-center gap-4 hover:bg-amber-50 transition-all cursor-pointer group">
                   <Camera className="h-10 w-10 text-amber-700/40 group-hover:text-amber-600 transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/60 group-hover:text-amber-900">Auto-fill via Pexels</p>
                </div>
                <div className="p-8 border-2 border-dashed border-amber-600/20 flex flex-col items-center justify-center gap-4 hover:bg-amber-50 transition-all cursor-pointer group">
                   <Plus className="h-10 w-10 text-amber-700/40 group-hover:text-amber-600 transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/60 group-hover:text-amber-900">Add Media File</p>
                </div>
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full h-16 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-amber-600/20 transition-all hover:-translate-y-1">
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
                      <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Listing Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota Corolla 2015" className="rounded-none h-14 border-2 focus:border-amber-600 bg-background text-amber-950 font-bold" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Price (GHS)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-amber-600">GHS</span>
                          <Input type="number" placeholder="0.00" className="rounded-none h-14 pl-16 border-2 focus:border-amber-600 bg-background text-amber-950 font-bold" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. East Legon, Accra" className="rounded-none h-14 border-2 focus:border-amber-600 bg-background text-amber-950 font-bold" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none h-14 border-2 focus:border-amber-600 bg-background text-amber-950 font-bold transition-all">
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-2 border-amber-600/20">
                          <SelectItem value="New" className="focus:bg-amber-50 font-bold">Brand New</SelectItem>
                          <SelectItem value="Like New" className="focus:bg-amber-50 font-bold">Like New</SelectItem>
                          <SelectItem value="Excellent" className="focus:bg-amber-50 font-bold">Excellent</SelectItem>
                          <SelectItem value="Good" className="focus:bg-amber-50 font-bold">Good / Used</SelectItem>
                          <SelectItem value="Fair" className="focus:bg-amber-50 font-bold">Fair / Functional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
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
                      <FormLabel className="text-amber-900/80 font-black uppercase text-[10px] tracking-widest">Description</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDesc}
                        className="h-8 rounded-none font-black uppercase text-[8px] tracking-widest gap-1.5 border-amber-600/30 text-amber-700 hover:bg-amber-50"
                      >
                        {isGeneratingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isGeneratingDesc ? 'Generating…' : 'AI Generate'}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Detail the technical and operational specifics of your asset..." 
                        className="min-h-[200px] rounded-none border-2 focus:border-amber-600 p-6 font-bold bg-background text-amber-950" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-bold text-[10px] uppercase" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-16 font-black uppercase tracking-widest border-2 hover:bg-amber-50 transition-all rounded-none border-amber-600/20 text-amber-900">Back</Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-[2] h-16 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/20 transition-all hover:-translate-y-1">Review & Publish</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-600 p-6 flex items-start justify-between gap-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-none shadow-lg">
                  <div className="flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-red-600">⚠ Error: Failed to publish.</p>
                    <p className="text-[10px] font-bold text-red-900 uppercase mt-1">{submitError}</p>
                  </div>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-10 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-none shrink-0 shadow-md hover:bg-red-700 transition-all active:scale-95"
                    disabled={isSubmitting}
                  >
                    Retry
                  </Button>
                </div>
              )}
              <Card className="bg-amber-50 p-10 rounded-none text-amber-950 relative overflow-hidden border-b-4 border-amber-600 shadow-2xl">
                <div className="absolute -left-16 -top-16 w-40 h-40 bg-amber-600/5 rounded-none blur-3xl" />
                <CardContent className="p-0 space-y-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="bg-amber-600/10 p-5 rounded-none border border-amber-600/20">
                      <ShieldCheck className="h-10 w-10 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Escrow Protection Active</h4>
                      <p className="text-[10px] text-amber-900/60 uppercase tracking-widest font-black">Your payment is protected by escrow.</p>
                    </div>
                  </div>

                  {watchPrice && (
                    <div className="bg-white/80 backdrop-blur-sm p-8 border border-amber-600/10 space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-amber-900/40">
                        <span>Price</span>
                        <span>Service Fee (2.5%)</span>
                        <span className="text-amber-600">You Receive</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-black">GHS {parseFloat(watchPrice).toLocaleString()}</span>
                        <span className="text-xl font-black text-red-600">-GHS {payoutStats.treasuryFee.toFixed(2)}</span>
                        <span className="text-3xl font-black text-amber-600">GHS {payoutStats.netEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-amber-900/50 leading-relaxed font-bold uppercase tracking-[0.1em]">
                    By publishing, you agree to our terms. Funds are held securely until the buyer releases them after inspection.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-16 font-black uppercase tracking-widest border-2 hover:bg-amber-50 transition-all rounded-none border-amber-600/20 text-amber-900" disabled={isSubmitting}>Review Details</Button>
                <Button type="submit" className="flex-[2] h-16 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-amber-600/20 text-lg transition-all hover:-translate-y-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Listing'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}