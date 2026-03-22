"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Activity,
  Phone,
  MessageSquare,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Heart,
  Eye,
  Share2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LISTINGS as MOCK_LISTINGS } from '@/lib/mock-data';
import { getListingByIdAction } from '@/lib/actions';
import { useAuth, useCurrency, useCart } from '@/components/providers';
import { AuthDialog } from '@/components/auth-dialog';
import { cn, normalizeListing } from '@/lib/utils';

export default function ListingDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addItem, startCheckoutSim } = useCart();
  const router = useRouter();

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [realListing, setRealListing] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchListing = async () => {
      const mockListing = MOCK_LISTINGS.find(l => l.id === id);
      if (mockListing) {
        setRealListing(mockListing);
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await getListingByIdAction(id as string);
        if (result.success && result.data) {
          setRealListing(result.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (!mounted || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-black uppercase tracking-widest text-primary animate-pulse">Synchronizing Asset Node...</div>;
  }

  const listing = normalizeListing(realListing || MOCK_LISTINGS[0]);
  const seller = listing.seller;

  // ── The real escrow trigger ──────────────────────────────────────────────────
  // Adds the item to cart then fires startCheckoutSim which the
  // EscrowCheckoutFlow component listens to via isCheckingOut.
  // If not logged in, the flow itself handles the auth gate.
  const handleBuyNow = () => {
    addItem(listing);
    startCheckoutSim();
  };

  const handleShowContact = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setShowContactInfo(true);
  };

  const handleSave = () => {
    setIsSaved(prev => !prev);
    toast({
      title: isSaved ? 'Removed from saved' : 'Saved to favourites',
      description: listing.title,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl bg-background text-foreground">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-10 rounded-none gap-2 font-black text-[10px] uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

        {/* ── LEFT: IMAGE + DETAILS ── */}
        <div className="lg:col-span-8 space-y-10">
          <div className="relative h-[400px] md:h-[600px] w-full bg-muted overflow-hidden border border-border shadow-2xl">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 1200px) 100vw, 800px"
              className="object-cover"
              priority
            />
            {/* Badges */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
              <Badge className="bg-primary text-primary-foreground font-black uppercase text-[10px] px-4 py-1.5 rounded-none">
                {listing.category}
              </Badge>
              {listing.isEscrowProtected && (
                <Badge className="bg-secondary/90 text-white font-black uppercase text-[10px] px-4 py-1.5 rounded-none border border-primary/40 flex items-center gap-2">
                  <Lock className="h-3 w-3 text-primary" /> Escrow Protected
                </Badge>
              )}
            </div>
            {/* Save + Share */}
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={handleSave}
                aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border transition-all',
                  isSaved ? 'bg-primary border-primary text-white' : 'bg-white/90 border-border text-muted-foreground hover:text-primary'
                )}
              >
                <Heart className={cn('h-5 w-5', isSaved && 'fill-white')} />
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                      .then(() => toast({ title: 'Link copied!' }))
                      .catch(() => toast({ title: 'Failed to copy', description: 'Please copy the URL manually', variant: 'destructive' }));
                  }
                }}
                aria-label="Share listing"
                className="h-10 w-10 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border bg-white/90 border-border text-muted-foreground hover:text-primary transition-all"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            {/* View count */}
            {listing.viewCount && (
              <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5">
                <Eye className="h-3 w-3 text-white/70" />
                <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{listing.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-tight italic">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Posted {listing.postedAt}</span>
                  </div>
                  {listing.condition && (
                    <Badge className="bg-muted text-muted-foreground rounded-none font-black text-[9px] uppercase tracking-widest border-none">
                      {listing.condition}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                  {formatPrice(typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price)}
                </div>
                {listing.oldPrice && (
                  <p className="text-[12px] text-muted-foreground line-through font-bold mt-1">
                    {formatPrice(typeof listing.oldPrice === 'string' ? parseFloat(listing.oldPrice) : listing.oldPrice)}
                  </p>
                )}
                {listing.isNegotiable && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] mt-1 font-black">Negotiable</p>
                )}
              </div>
            </div>

            {/* Specs */}
            {listing.specs && listing.specs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listing.specs.map((spec, i) => (
                  <Badge key={i} className="bg-primary/10 text-primary rounded-none font-black text-[9px] uppercase tracking-widest border-none px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="bg-border" />

            <div className="space-y-4">
              <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" /> Description
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-medium">
                {listing.description}
              </p>
            </div>

            {/* Trust cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <Card className="bg-card border-border rounded-none p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="space-y-4 relative z-10">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tighter">Protected by Escrow</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                      Funds are held securely until you verify the item. Inspect before you release. Full refunds triggered after 48h non-dispatch.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="bg-card border-border rounded-none p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="space-y-4 relative z-10">
                  <AlertTriangle className="h-10 w-10 text-primary" />
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tighter">Safety Notice</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                      Only pay through our Escrow system. Never send money directly to sellers in advance. Report suspicious listings.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* ── RIGHT: SELLER + CTA SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-card border-4 border-primary/20 rounded-none overflow-hidden sticky top-24 shadow-2xl">
            <div className="p-8 space-y-8">

              {/* Seller info */}
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 bg-primary flex items-center justify-center text-2xl font-black text-primary-foreground shadow-xl rounded-none">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-foreground uppercase tracking-tight text-base leading-none">{seller.name}</h4>
                      {seller.isVerified && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{seller.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-border py-5">
                  <div className="text-center space-y-1">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Rating</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-black text-foreground">{seller.rating}</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1 border-l border-border">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Since</p>
                    <p className="text-sm font-black text-foreground">{seller.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* ── PRIMARY CTA: triggers full escrow flow ── */}
              <div className="space-y-4">
                <Button
                  onClick={handleBuyNow}
                  className="w-full h-16 bg-primary text-primary-foreground hover:opacity-90 font-black uppercase text-xs tracking-[0.2em] rounded-none shadow-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <Lock className="h-5 w-5" /> Buy Now — Escrow Protected
                </Button>

                {showContactInfo ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {seller.phone && (
                      <a href={`tel:${seller.phone}`} className="block">
                        <Button variant="outline" className="w-full h-12 font-black uppercase text-[10px] tracking-widest rounded-none gap-3 border-2">
                          <Phone className="h-4 w-4" /> Call Seller
                        </Button>
                      </a>
                    )}
                    {seller.whatsapp && (
                      <a href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full h-12 bg-[#25D366] text-white font-black uppercase text-[10px] tracking-widest rounded-none gap-3">
                          <MessageSquare className="h-4 w-4" /> WhatsApp Seller
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleShowContact}
                    className="w-full h-12 border-2 border-border text-foreground hover:bg-muted font-black uppercase text-xs tracking-widest rounded-none flex items-center justify-center gap-3"
                  >
                    <Phone className="h-4 w-4 text-primary" /> Reveal Contact Details
                  </Button>
                )}
              </div>

              <div className="bg-muted/50 p-5 border border-dashed border-border">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed text-center">
                  Never pay outside this platform. All transactions are escrow-protected.
                </p>
              </div>
            </div>
          </Card>

          {/* Safety tips */}
          <Card className="bg-card p-6 border border-border rounded-none space-y-4">
            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Safety Tips</h5>
            <ul className="space-y-3">
              {[
                'Inspect item before authorising release.',
                'Meet sellers in public, busy locations.',
                'Verify vehicle documents before purchase.',
                'Never share your platform password.',
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-[9px] font-bold text-muted-foreground uppercase leading-snug">
                  <div className="h-1.5 w-1.5 bg-primary mt-1 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}
