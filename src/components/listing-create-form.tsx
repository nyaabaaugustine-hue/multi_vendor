"use client";

import { useState, useMemo, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Loader2, ShieldCheck, Sparkles, X, ImagePlus,
  CheckCircle2, Package, MapPin, Tag, DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createListingAction } from '@/lib/actions';
import { generateListingDescription } from '@/ai/flows/ai-generated-listing-description-flow';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const MAX_IMAGES = 8;

const formSchema = z.object({
  title:       z.string().min(5,  "Title must be at least 5 characters"),
  category:    z.string().min(1,  "Please select a category"),
  price:       z.string().min(1,  "Please enter a price"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location:    z.string().min(3,  "Please enter a location"),
  condition:   z.enum(['New', 'Like New', 'Excellent', 'Good', 'Fair']).default('Good'),
});

const CATEGORIES = [
  { value: 'Vehicles',         label: '🚗  Vehicles & Transport' },
  { value: 'Property',         label: '🏠  Property & Real Estate' },
  { value: 'Electronics',      label: '📱  Electronics & Tech' },
  { value: 'Home & Furniture', label: '🛋️  Home & Furniture' },
  { value: 'Fashion',          label: '👗  Fashion & Clothing' },
  { value: 'Agriculture',      label: '🌾  Agriculture & Food' },
  { value: 'Services',         label: '🛠️  Services & Tasks' },
  { value: 'Sports',           label: '⚽  Sports & Fitness' },
];

const CONDITIONS = [
  { value: 'New',       label: '✨ Brand New',  desc: 'Never used, original packaging' },
  { value: 'Like New',  label: '💎 Like New',   desc: 'Barely used, no visible wear' },
  { value: 'Excellent', label: '⭐ Excellent',  desc: 'Minor signs of use only' },
  { value: 'Good',      label: '👍 Good',       desc: 'Normal wear, fully functional' },
  { value: 'Fair',      label: '🔧 Fair',       desc: 'Visible wear, works fine' },
];

const STEPS = [
  { id: 1, label: 'Photos',   icon: ImagePlus },
  { id: 2, label: 'Details',  icon: Package },
  { id: 3, label: 'Publish',  icon: ShieldCheck },
];

export function ListingCreateForm() {
  const [step, setStep]                 = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [images, setImages]             = useState<{ file: File; preview: string }[]>([]);
  const [isDragging, setIsDragging]     = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const { toast }  = useToast();
  const router     = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '', category: '', price: '',
      description: '', location: 'Accra, Ghana', condition: 'Good',
    },
  });

  const watchPrice    = form.watch('price');
  const watchCategory = form.watch('category');
  const watchCondition = form.watch('condition');

  const payoutStats = useMemo(() => {
    const price       = parseFloat(watchPrice) || 0;
    const treasuryFee = price * 0.025;
    const netEarnings = price - treasuryFee;
    return { treasuryFee, netEarnings, price };
  }, [watchPrice]);

  // ── Image handling ──────────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) return;
    const accepted = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, slots);
    const newImgs = accepted.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImgs]);
  }, [images.length]);

  const removeImage = useCallback((idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  // ── AI description ──────────────────────────────────────────────────────────
  const handleGenerateDescription = async () => {
    const title    = form.getValues('title');
    const category = form.getValues('category');
    if (!title || !category) {
      toast({ title: 'Fill in Title & Category first', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateListingDescription({
        title, category,
        keyFeatures: [form.getValues('condition') ?? 'Good condition', form.getValues('location') ?? 'Accra'],
        length: 'medium', tone: 'professional',
      });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({ title: '✨ Description generated!', description: 'Feel free to edit it.' });
    } catch {
      toast({ title: 'AI unavailable', description: 'Write a description manually.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createListingAction(values);
      if (result.success) {
        toast({ title: '🎉 Listing published!', description: 'Your ad is now live with Escrow Protection.' });
        router.push('/dashboard');
      } else {
        setSubmitError(result.error || 'Failed to publish.');
        toast({ title: 'Publication failed', description: result.error, variant: 'destructive' });
      }
    } catch {
      setSubmitError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const canProceedStep1 = watchCategory.length > 0;
  const canProceedStep2 = !form.formState.errors.title && !form.formState.errors.price &&
    !form.formState.errors.location && !form.formState.errors.description &&
    watchPrice.length > 0 && form.getValues('title').length >= 5 && form.getValues('description').length >= 20;

  return (
    <div className="flex flex-col min-h-0">

      {/* ── STEP INDICATOR ── */}
      <div className="flex items-center gap-1.5 mb-7 bg-muted/40 rounded-2xl p-1.5 border border-border/60">
        {STEPS.map((s) => {
          const Icon     = s.icon;
          const active   = step === s.id;
          const complete = step > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => complete && setStep(s.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                active   && "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                complete && "bg-background text-primary border border-primary/30 cursor-pointer hover:bg-primary/5",
                !active && !complete && "text-muted-foreground cursor-not-allowed opacity-50"
              )}
            >
              {complete
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                : <Icon className="h-3.5 w-3.5 shrink-0" />
              }
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          {/* ════ STEP 1: PHOTOS & CATEGORY ════ */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">

              {/* Image upload zone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-foreground uppercase tracking-widest">
                    Photos
                  </label>
                  <span className="text-[10px] font-black text-muted-foreground">
                    {images.length} / {MAX_IMAGES}
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-muted/30",
                    images.length >= MAX_IMAGES && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <ImagePlus className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">Drop photos here or click to upload</p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                          JPG, PNG, WebP up to 10MB each · Max {MAX_IMAGES} photos
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest">
                        <div className="h-px w-8 bg-primary/30" />
                        Click or drag to add
                        <div className="h-px w-8 bg-primary/30" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <Image
                              src={img.preview}
                              alt={`Upload ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {/* Cover badge for first image */}
                            {idx === 0 && (
                              <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                                Cover
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {/* Add more slot */}
                        {images.length < MAX_IMAGES && (
                          <div className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors">
                            <ImagePlus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {/* Category select */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest">Category *</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => field.onChange(cat.value)}
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-200 text-[11px] font-bold",
                            field.value === cat.value
                              ? "border-primary bg-primary/8 text-primary shadow-sm"
                              : "border-border bg-background hover:border-primary/40 hover:bg-muted/30 text-foreground"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <FormMessage className="text-red-500 text-[10px] font-black uppercase mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={() => canProceedStep1 && setStep(2)}
                disabled={!canProceedStep1}
                className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-primary/25 transition-all hover:opacity-90 active:scale-95 gap-2"
              >
                Continue to Details
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {/* ════ STEP 2: DETAILS ════ */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Tag className="h-3 w-3 text-primary" /> Title *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Toyota Corolla 2019, iPhone 15 Pro Max..."
                          className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground font-semibold text-sm transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-[10px] font-black" />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <DollarSign className="h-3 w-3 text-primary" /> Price (GHS) *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-primary select-none">GH₵</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="h-12 pl-12 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground font-bold text-sm transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-[10px] font-black" />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary" /> Location *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. East Legon, Accra"
                          className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground font-semibold text-sm transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-[10px] font-black" />
                    </FormItem>
                  )}
                />

                {/* Condition */}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest">Condition *</FormLabel>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {CONDITIONS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => field.onChange(c.value)}
                            className={cn(
                              "px-3 py-2 rounded-xl border-2 text-[11px] font-bold transition-all duration-150",
                              field.value === c.value
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-background hover:border-primary/40 text-foreground"
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage className="text-red-500 text-[10px] font-black" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-[10px] font-black text-foreground uppercase tracking-widest">Description *</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating}
                          className="h-7 rounded-lg font-black uppercase text-[9px] tracking-wider gap-1.5 border-primary/30 text-primary hover:bg-primary/5 px-3"
                        >
                          {isGenerating
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <Sparkles className="h-3 w-3" />
                          }
                          {isGenerating ? 'Generating…' : '✨ AI Write'}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your item in detail — condition, features, reason for selling…"
                          className="min-h-[120px] rounded-xl border-2 border-border focus:border-primary bg-background text-foreground font-medium text-sm p-4 resize-none transition-all"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-1">
                        <FormMessage className="text-red-500 text-[10px] font-black" />
                        <span className={cn(
                          "text-[9px] font-black ml-auto",
                          field.value.length < 20 ? "text-muted-foreground" : "text-primary"
                        )}>
                          {field.value.length} chars
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-12 px-5 rounded-xl border-2 border-border font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-muted/30 text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    const ok = await form.trigger(['title', 'price', 'location', 'description', 'condition']);
                    if (ok) setStep(3);
                  }}
                  className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-primary/25 gap-2"
                >
                  Review & Publish
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* ════ STEP 3: REVIEW & PUBLISH ════ */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">

              {submitError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl">
                  <X className="h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-bold text-red-700 dark:text-red-400">{submitError}</p>
                </div>
              )}

              {/* Summary card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">Ready to Publish</p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Escrow protection enabled</p>
                  </div>
                </div>

                {/* Listing preview */}
                <div className="bg-background rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {images.length > 0 && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border shrink-0">
                        <Image src={images[0].preview} alt="Cover" fill className="object-cover" unoptimized />
                        {images.length > 1 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-[10px] font-black">+{images.length - 1}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-foreground text-sm truncate">{form.getValues('title') || '—'}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{watchCategory} · {form.getValues('condition')}</p>
                      <p className="text-[10px] text-muted-foreground">{form.getValues('location')}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-primary">GH₵{parseFloat(watchPrice || '0').toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Payout breakdown */}
                {payoutStats.price > 0 && (
                  <div className="space-y-2 pt-1 border-t border-primary/15">
                    <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Listing price</span>
                      <span>GH₵{payoutStats.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold text-red-500">
                      <span>Platform fee (2.5%)</span>
                      <span>−GH₵{payoutStats.treasuryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-primary border-t border-primary/15 pt-2">
                      <span>You receive</span>
                      <span>GH₵{payoutStats.netEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed text-center">
                By publishing you agree to our Terms of Service. Funds are held in escrow until the buyer confirms receipt.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="h-12 px-5 rounded-xl border-2 border-border font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-muted/30 text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-primary/25 gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Publishing…</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> Publish Listing</>
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
