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
    return <div className="min-h-screen bg-background flex items-center justify-center font-black uppercase tracking-widest text-amber-600 animate-pulse text-sm">Loading Listing...</div>;
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
      title: isSaved ? 'Removed from favorites' : 'Saved to favorites',
      description: listing.title,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl bg-background text-foreground">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-10 rounded-none gap-2 font-black text-[10px] uppercase tracking-widest border border-border text-muted-foreground hover:text-amber-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

        {/* ── LEFT: IMAGE + DETAILS ── */}
        <div className="lg:col-span-8 space-y-10">
          <div className="relative h-[400px] md:h-[600px] w-full bg-amber-50 overflow-hidden border-2 border-amber-600/5 shadow-2xl rounded-none">
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
              <Badge className="bg-amber-600 text-white font-black uppercase text-[10px] px-4 py-1.5 rounded-none shadow-xl">
                {listing.category}
              </Badge>
              {listing.isEscrowProtected && (
                <Badge className="bg-amber-950/90 text-white font-black uppercase text-[10px] px-4 py-1.5 rounded-none border border-amber-600/40 flex items-center gap-2 shadow-xl backdrop-blur-md">
                  <Lock className="h-3 w-3 text-amber-600" /> Secure Escrow
                </Badge>
              )}
            </div>
            {/* Save + Share */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={handleSave}
                aria-label={isSaved ? 'Remove from favorites' : 'Save listing'}
                className={cn(
                  'h-12 w-12 rounded-none flex items-center justify-center shadow-2xl backdrop-blur-md border-2 transition-all active:scale-90',
                  isSaved ? 'bg-amber-600 border-amber-600 text-white shadow-amber-600/40' : 'bg-white/90 border-amber-600/10 text-amber-700 hover:border-amber-600/40 hover:text-amber-600'
                )}
              >
                <Heart className={cn('h-6 w-6', isSaved && 'fill-white')} />
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
                className="h-12 w-12 rounded-none flex items-center justify-center shadow-2xl backdrop-blur-md border-2 bg-white/90 border-amber-600/10 text-amber-700 hover:border-amber-600/40 hover:text-amber-600 transition-all active:scale-90"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            {/* View count */}
            {listing.viewCount && (
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-amber-950/60 backdrop-blur-md px-4 py-2 border border-amber-600/20">
                <Eye className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{listing.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <h1 className="text-3xl md:text-6xl font-black text-amber-950 tracking-tighter uppercase leading-[0.9] italic">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-8 text-amber-900/40">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Posted {listing.postedAt}</span>
                  </div>
                  {listing.condition && (
                    <Badge className="bg-amber-50 text-amber-700 rounded-none font-black text-[10px] uppercase tracking-widest border-2 border-amber-600/10 px-3">
                      {listing.condition}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl md:text-6xl font-black text-amber-600 tracking-tighter leading-none italic">
                  GHS {parseFloat(listing.price.toString()).toLocaleString()}
                </div>
                {listing.oldPrice && (
                  <p className="text-[14px] text-amber-900/30 line-through font-black mt-2 tracking-tighter">
                    GHS {parseFloat(listing.oldPrice.toString()).toLocaleString()}
                  </p>
                )}
                {listing.isNegotiable && (
                  <p className="text-[10px] text-amber-600/60 uppercase tracking-[0.5em] mt-2 font-black italic">Negotiable</p>
                )}
              </div>
            </div>

            {/* Specs */}
            {listing.specs && listing.specs.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4">
                {listing.specs.map((spec, i) => (
                  <Badge key={i} className="bg-amber-50 text-amber-900/60 rounded-none font-black text-[10px] uppercase tracking-widest border-2 border-amber-600/5 px-4 py-2 hover:bg-amber-100 transition-colors">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="bg-amber-600/10" />

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-amber-950 uppercase tracking-tighter flex items-center gap-4 italic">
                <Activity className="h-6 w-6 text-amber-600" /> Asset Briefing
              </h3>
              <p className="text-amber-900/70 text-lg leading-relaxed font-bold uppercase tracking-tight">
                {listing.description}
              </p>
            </div>

            {/* Trust cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <Card className="bg-amber-50/50 border-2 border-amber-600/5 rounded-none p-10 relative overflow-hidden group hover:border-amber-600/20 transition-all">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/5 rounded-none -mr-20 -mt-20 blur-3xl group-hover:bg-amber-600/10 transition-all" />
                <div className="space-y-6 relative z-10">
                  <ShieldCheck className="h-12 w-12 text-amber-600" />
                  <div>
                    <h4 className="font-black text-xl mb-3 uppercase tracking-tighter italic text-amber-950">Protected Buy</h4>
                    <p className="text-[11px] text-amber-900/50 leading-relaxed font-black uppercase tracking-widest">
                      Funds are held securely in escrow until you verify the item. Inspect before you release. Full refunds triggered after 48h non-dispatch.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="bg-amber-50/50 border-2 border-amber-600/5 rounded-none p-10 relative overflow-hidden group hover:border-amber-600/20 transition-all">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/5 rounded-none -mr-20 -mt-20 blur-3xl group-hover:bg-amber-600/10 transition-all" />
                <div className="space-y-6 relative z-10">
                  <AlertTriangle className="h-12 w-12 text-amber-600" />
                  <div>
                    <h4 className="font-black text-xl mb-3 uppercase tracking-tighter italic text-amber-950">Safety Notice</h4>
                    <p className="text-[11px] text-amber-900/50 leading-relaxed font-black uppercase tracking-widest">
                      Only pay through our Secure Escrow system. Never send money directly to sellers in advance. Report suspicious activity.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* ── RIGHT: SELLER + CTA SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-background border-4 border-amber-600/10 rounded-none overflow-hidden sticky top-24 shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
            <div className="p-10 space-y-10">

              {/* Seller info */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl rounded-none border-2 border-white">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-amber-950 uppercase tracking-tighter text-xl leading-none italic">{seller.name}</h4>
                      {seller.isVerified && <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] font-black text-amber-900/40 uppercase tracking-[0.2em]">{seller.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 border-y-2 border-amber-600/5 py-8">
                  <div className="text-center space-y-2">
                    <p className="text-[9px] font-black text-amber-900/30 uppercase tracking-[0.3em]">Trust Rating</p>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-lg font-black text-amber-950">{seller.rating}</span>
                    </div>
                  </div>
                  <div className="text-center space-y-2 border-l-2 border-amber-600/5">
                    <p className="text-[9px] font-black text-amber-900/30 uppercase tracking-[0.3em]">Member Since</p>
                    <p className="text-lg font-black text-amber-950 uppercase tracking-tighter">{seller.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* ── PRIMARY CTA: triggers full escrow flow ── */}
              <div className="space-y-6">
                <Button
                  onClick={handleBuyNow}
                  className="w-full h-20 bg-amber-600 text-white hover:bg-amber-700 font-black uppercase text-[13px] tracking-[0.3em] rounded-none shadow-[0_20px_40px_rgba(217,119,6,0.3)] flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <Lock className="h-6 w-6" /> Secure Buy — Escrow Protected
                </Button>

                {showContactInfo ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {seller.phone && (
                      <a href={`tel:${seller.phone}`} className="block">
                        <Button variant="outline" className="w-full h-14 font-black uppercase text-[11px] tracking-[0.25em] rounded-none gap-4 border-2 border-amber-600/20 text-amber-900 hover:bg-amber-50 transition-all">
                          <Phone className="h-5 w-5 text-amber-600" /> Call Seller
                        </Button>
                      </a>
                    )}
                    {seller.whatsapp && (
                      <a href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full h-14 bg-[#25D366] text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-none gap-4 hover:opacity-90 shadow-xl transition-all">
                          <MessageSquare className="h-5 w-5" /> WhatsApp Seller
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleShowContact}
                    className="w-full h-14 border-2 border-amber-600/10 text-amber-900/60 hover:bg-amber-50 hover:text-amber-950 hover:border-amber-600/30 font-black uppercase text-[11px] tracking-[0.2em] rounded-none flex items-center justify-center gap-4 transition-all"
                  >
                    <Phone className="h-5 w-5 text-amber-600" /> Reveal Contact Details
                  </Button>
                )}
              </div>

              <div className="bg-amber-50/50 p-6 border-2 border-dashed border-amber-600/10">
                <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-[0.2em] leading-relaxed text-center">
                  Never pay outside this platform. All transactions are protected by Secure Escrow.
                </p>
              </div>
            </div>
          </Card>

          {/* Safety tips */}
          <Card className="bg-amber-50/30 p-8 border-2 border-amber-600/5 rounded-none space-y-6">
            <h5 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em] italic">Safety Protocols</h5>
            <ul className="space-y-4">
              {[
                'Inspect item before authorizing release.',
                'Meet sellers in public, busy locations.',
                'Verify all documents before purchase.',
                'Never share your platform credentials.',
              ].map((tip, i) => (
                <li key={i} className="flex gap-4 text-[10px] font-black text-amber-900/40 uppercase leading-relaxed tracking-tight">
                  <div className="h-2 w-2 bg-amber-600 mt-1 shrink-0 rounded-none" />
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
