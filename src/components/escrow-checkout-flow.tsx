"use client";

/**
 * EscrowCheckoutFlow — Investor Demo Build
 *
 * Full seamless buying journey:
 *   1. Auth gate (if not logged in)
 *   2. Escrow briefing + order summary
 *   3. Paystack payment panel (demo)
 *   4. Paystack webhook simulation — realistic notifications fire at each event
 *   5. Escrow funded confirmation + seller 48h countdown
 *   6. Dispatch simulation
 *   7. Buyer inspection + release
 *   8. Complete — redirect to dashboard
 *
 * Paystack demo notifications mirror real webhook events:
 *   charge.success → escrow.funded → order.dispatched →
 *   delivery.confirmed → escrow.released
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart, useAuth, useCurrency } from '@/components/providers';
import { AuthDialog } from '@/components/auth-dialog';
import {
  Lock, ShieldCheck, CreditCard, Truck, CheckCircle2,
  AlertCircle, Copy, Timer, Package, Eye, X,
  Zap, Bell, Smartphone, CheckCheck, Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HowItWorksPopup } from './how-it-works-popup';

// ─── Types ────────────────────────────────────────────────────────────────────

type EscrowStep =
  | 'idle' | 'auth_required' | 'briefing'
  | 'payment_pending' | 'payment_processing'
  | 'escrow_funded' | 'in_transit'
  | 'inspection' | 'released';

const STEP_ORDER: EscrowStep[] = [
  'briefing', 'payment_pending', 'payment_processing',
  'escrow_funded', 'in_transit', 'inspection', 'released',
];

const PLATFORM_FEE = 0.025;
function calcFee(amount: number) {
  const fee = Math.round(amount * PLATFORM_FEE * 100) / 100;
  return { fee, total: Math.round((amount + fee) * 100) / 100 };
}

function genRef() {
  return `PSK-GH-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}
function genOrder() {
  return `ORD-${Math.floor(8000 + Math.random() * 1999)}`;
}

// ─── Paystack Notification Banner ─────────────────────────────────────────────
// Shown as a floating toast-style notification that slides in from the top
// simulating a real Paystack webhook event arriving.

interface PSKNotif {
  id: number;
  event: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  color: string;
}

let notifIdCounter = 0;

function PaystackNotifBanner({ notifs, dismiss }: { notifs: PSKNotif[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 w-[340px] pointer-events-none">
      {notifs.map(n => (
        <div
          key={n.id}
          className="pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] flex items-start gap-4 p-5 rounded-2xl group overflow-hidden relative"
        >
          {/* Animated glow background based on notification color */}
          <div 
            className="absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-10 transition-colors duration-500" 
            style={{ backgroundColor: n.color }}
          />
          
          <div className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${n.color}15`, color: n.color }}>
            {n.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: n.color }}>{n.event}</span>
              <div className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: n.color }} />
            </div>
            <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight">{n.title}</p>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-medium">{n.body}</p>
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground hover:bg-muted transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Step Label Map ───────────────────────────────────────────────────────────

const STEP_LABEL: Record<EscrowStep, string> = {
  idle: '', auth_required: '',
  briefing: 'How It Works',
  payment_pending: 'Secure Payment',
  payment_processing: 'Processing',
  escrow_funded: 'Funds Secured',
  in_transit: 'In Transit',
  inspection: 'Inspect Item',
  released: 'Complete!',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function EscrowCheckoutFlow() {
  const { total, clearCart, isCheckingOut, closeSuccess } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<EscrowStep>('idle');
  const [showAuth, setShowAuth] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [paystackRef, setPaystackRef] = useState('');
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [notifs, setNotifs] = useState<PSKNotif[]>([]);
  const prevChecking = useRef(false);

  // ── fire a Paystack-style webhook notification ──────────────────────────────
  const fireNotif = useCallback((
    event: string, title: string, body: string,
    icon: React.ReactNode, color: string, autoMs = 6000
  ) => {
    const id = ++notifIdCounter;
    setNotifs(prev => [...prev, { id, event, title, body, icon, color }]);
    setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), autoMs);
  }, []);

  const dismissNotif = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  // ── Rising-edge: only open on a new checkout trigger ──────────────────────
  useEffect(() => {
    const rising = isCheckingOut && !prevChecking.current;
    prevChecking.current = isCheckingOut;
    if (!rising) return;

    if (!user) {
      setPendingOpen(true);
      setShowAuth(true);
    } else {
      const ref = genRef();
      const id = genOrder();
      setPaystackRef(ref);
      setOrderId(id);
      setStep('briefing');
    }
  }, [isCheckingOut, user]);

  // ── After login while pending ─────────────────────────────────────────────
  useEffect(() => {
    if (user && pendingOpen && step === 'idle') {
      setPendingOpen(false);
      setShowAuth(false);
      const ref = genRef();
      const id = genOrder();
      setPaystackRef(ref);
      setOrderId(id);
      setStep('briefing');
    }
  }, [user, pendingOpen, step]);

  const handleClose = useCallback(() => {
    setStep('idle');
    setPendingOpen(false);
    closeSuccess();
  }, [closeSuccess]);

  // ── PAY ───────────────────────────────────────────────────────────────────
  const handlePay = () => {
    setStep('payment_processing');

    // Simulate Paystack processing (1.8s)
    setTimeout(() => {
      setStep('escrow_funded');

      // Notification 1: charge.success
      fireNotif(
        'charge.success',
        `Payment of ${formatPrice(calcFee(total).total)} received`,
        `Ref: ${paystackRef} · MTN Mobile Money · Confirmed`,
        <Smartphone className="h-4 w-4" />,
        '#800020',
      );

      // Notification 2: escrow.funded (300ms later)
      setTimeout(() => {
        fireNotif(
          'escrow.funded',
          `Escrow locked for ${orderId}`,
          `Funds held securely. Seller notified to dispatch within 48h.`,
          <Lock className="h-4 w-4" />,
          '#1565C0',
          7000,
        );
      }, 900);

      // Notification 3: seller.notified (1.8s later)
      setTimeout(() => {
        fireNotif(
          'seller.notified',
          `Melcom Digital Hub has been alerted`,
          `Order ${orderId} — 48h dispatch window started. Buyer funds in escrow.`,
          <Bell className="h-4 w-4" />,
          '#6A1B9A',
          8000,
        );
        toast({
          title: '✅ Payment confirmed & escrow funded',
          description: `${orderId} · ${paystackRef}`,
        });
      }, 1800);
    }, 1800);
  };

  // ── DISPATCH (demo) ───────────────────────────────────────────────────────
  const handleSimulateDispatch = () => {
    setStep('in_transit');
    fireNotif(
      'order.dispatched',
      `Your item has been dispatched`,
      `Tracking: ACC-2026-${orderId.replace('ORD-', '')} · Est. 1–3 days in Accra`,
      <Truck className="h-4 w-4" />,
      '#E65100',
      8000,
    );
    toast({ title: '📦 Item dispatched!', description: `Tracking: ACC-2026-${orderId.replace('ORD-', '')}` });
  };

  // ── RELEASE ───────────────────────────────────────────────────────────────
  const handleRelease = () => {
    const { fee } = calcFee(total);
    setStep('released');
    clearCart();

    fireNotif(
      'escrow.released',
      `GH₵${((total - fee)).toLocaleString()} released to seller`,
      `Platform fee GH₵${fee.toLocaleString()} retained. Order complete.`,
      <CheckCheck className="h-4 w-4" />,
      '#00c853',
      9000,
    );
    fireNotif(
      'order.complete',
      `Transaction ${orderId} completed`,
      `Thank you for buying safely. Leave a review for the seller.`,
      <Star className="h-4 w-4" />,
      '#FFB300',
      10000,
    );
    toast({ title: '🎉 Payment released!', description: 'Seller has been paid. Transaction complete.' });

    setTimeout(() => {
      handleClose();
      router.push('/dashboard');
    }, 3500);
  };

  // ── DISPUTE ──────────────────────────────────────────────────────────────
  const handleDispute = () => {
    fireNotif(
      'dispute.opened',
      `Dispute raised for ${orderId}`,
      `Our team will review within 24 hours. Funds frozen until resolution.`,
      <AlertCircle className="h-4 w-4" />,
      '#C62828',
      10000,
    );
    toast({ title: '⚠️ Dispute opened', description: 'Our mediation team will contact you within 24 hours.' });
    handleClose();
  };

  const isOpen = step !== 'idle' && step !== 'auth_required';
  const { fee, total: grandTotal } = calcFee(total || 0);
  const stepIdx = STEP_ORDER.indexOf(step);
  const progress = stepIdx < 0 ? 0 : Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100);

  return (
    <>
      {/* Paystack-style webhook notifications */}
      <PaystackNotifBanner notifs={notifs} dismiss={dismissNotif} />

      {/* Auth gate */}
      <AuthDialog
        open={showAuth}
        noRedirect
        onOpenChange={(open) => {
          setShowAuth(open);
          if (!open && !user) { setPendingOpen(false); handleClose(); }
        }}
      />

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className={cn(
          "rounded-2xl p-0 overflow-hidden border-none shadow-2xl z-[150] bg-background",
          step === 'briefing' ? "sm:max-w-4xl" : "sm:max-w-xl"
        )}>
          <DialogHeader className="sr-only">
            <DialogTitle>Secure Escrow Checkout</DialogTitle>
            <DialogDescription>Complete your purchase securely.</DialogDescription>
          </DialogHeader>

          {/* ── HEADER ── */}
          <div className="bg-slate-950 border-b-2 border-amber-600/20 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-none bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600/60 block leading-none mb-1.5">
                    Secure Buy Protocol
                  </span>
                  <span className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                    {STEP_LABEL[step]}
                  </span>
                </div>
              </div>
              <button onClick={handleClose} aria-label="Close" className="h-8 w-8 rounded-none flex items-center justify-center hover:bg-white/5 transition-colors">
                <X className="h-5 w-5 text-white/40" />
              </button>
            </div>

            {/* Step progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                <span>
                  Step {Math.max(1, stepIdx + 1)} of {STEP_ORDER.length}
                </span>
                <span className="text-amber-600">{progress}% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-amber-600 transition-all duration-700 ease-in-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>

          {/* ── STEP CONTENT ── */}
          <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">

            {/* ── 1. BRIEFING ── */}
            {step === 'briefing' && (
              <HowItWorksPopup onNext={() => setStep('payment_pending')} />
            )}

            {/* ── 2. PAYMENT PENDING ── */}
            {step === 'payment_pending' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center max-w-sm mx-auto">
                  <div className="h-20 w-20 bg-amber-600/10 rounded-none flex items-center justify-center mx-auto mb-4 border border-amber-600/20 shadow-[0_0_20px_rgba(217,119,6,0.1)]">
                    <CreditCard className="h-10 w-10 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">Complete Payment</h2>
                  <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest">Secure transaction powered by Paystack.</p>
                </div>

                {/* Paystack-style card - World Class Redesign */}
                <div className="relative overflow-hidden rounded-none bg-slate-950 p-8 text-white shadow-2xl border-2 border-amber-600/20">
                  <div className="absolute top-0 right-0 p-6 opacity-20 text-amber-600">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#800020]">Secure Payment Portal</span>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] text-[#800020] uppercase font-black tracking-widest mb-2">Amount Due</p>
                        <span className="text-3xl font-black text-amber-600 tracking-tighter uppercase italic">{formatPrice(grandTotal)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#800020] uppercase font-black tracking-widest mb-2">Order Reference</p>
                        <p className="text-sm font-mono font-black text-white/90">{orderId}</p>
                        <div className="flex items-center gap-2 mt-2 justify-end group">
                          <span className="text-[10px] text-[#800020] font-mono truncate max-w-[100px]">{paystackRef}</span>
                          <button
                            onClick={() => { 
                              if (typeof window !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(paystackRef)
                                  .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
                                  .catch(() => {});
                              }
                            }}
                            className="p-1 rounded-none hover:bg-white/5 text-white/20 hover:text-amber-600 transition-all"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {copied && <p className="text-[10px] text-green-400 font-black mt-1 uppercase tracking-widest">Copied to clipboard</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-none p-5 border-l-4 border-amber-600 flex gap-4 shadow-xl">
                  <div className="h-10 w-10 rounded-none bg-amber-600/10 flex items-center justify-center shrink-0 border border-amber-600/20">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed font-black uppercase tracking-wide">
                    Your payment is held in a <span className="text-amber-600 font-black">secure escrow vault</span>. The seller is only paid after you verify the item.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handlePay}
                    className="w-full h-16 bg-amber-600 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-none gap-3 shadow-[0_15px_40px_rgba(217,119,6,0.3)] hover:bg-amber-700 hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    <Lock className="h-5 w-5" /> Pay {formatPrice(grandTotal)} via Paystack
                  </Button>
                  <div className="flex items-center justify-center gap-4 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground">MTN MoMo</span>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Visa/Mastercard</span>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Bank Transfer</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. PAYMENT PROCESSING ── */}
            {step === 'payment_processing' && (
              <div className="text-center py-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mx-auto h-24 w-24">
                  <div className="absolute inset-0 rounded-none border-4 border-amber-600/10" />
                  <div className="absolute inset-0 rounded-none border-4 border-amber-600 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-amber-600 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">Verifying Payment</h3>
                  <p className="text-[10px] text-muted-foreground max-w-[240px] mx-auto leading-relaxed uppercase tracking-widest">
                    Paystack is confirming your transaction. Please do not refresh.
                  </p>
                </div>
                <div className="max-w-xs mx-auto space-y-4">
                  <Progress value={65} className="h-1.5 rounded-none bg-muted" />
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] animate-pulse">
                    Securing funds in escrow...
                  </p>
                </div>
              </div>
            )}

            {/* ── 4. ESCROW FUNDED ── */}
            {step === 'escrow_funded' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-amber-600/10 rounded-none border border-amber-600/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-7 w-7 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Payment Confirmed!</h2>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Paystack confirmed. Funds locked in escrow.</p>
                </div>

                <div className="bg-slate-950 border-l-4 border-amber-600 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Escrow Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-1">
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Amount Locked</p>
                      <p className="text-lg font-black text-white italic tracking-tighter">{formatPrice(grandTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Order ID</p>
                      <p className="text-lg font-black text-white tracking-tighter">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Reference</p>
                      <p className="text-[10px] font-mono text-white/40 truncate">{paystackRef}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Status</p>
                      <Badge className="bg-amber-600 text-white rounded-none border-none text-[8px] font-black uppercase px-3 py-1 tracking-widest">SECURED</Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed border-t border-white/10 pt-4 uppercase tracking-wide">
                    Seller notified. They must dispatch within <strong className="text-white">48 hours</strong>. Failure = automatic full refund to you.
                  </p>
                </div>

                <div className="bg-slate-950 border border-white/10 p-6 space-y-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 flex items-center justify-center gap-2">
                    <Timer className="h-3.5 w-3.5" /> Seller Dispatch Window
                  </p>
                  <div className="text-4xl font-black text-white tracking-tighter font-mono italic">47:59:58</div>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest">Counting down for the seller. You will be notified on dispatch.</p>
                </div>

                {/* Demo shortcut for investors */}
                <div className="bg-amber-600/5 border border-amber-600/20 p-4 flex gap-4">
                  <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-amber-900/80 font-black uppercase tracking-widest leading-relaxed">
                    <strong>Demo mode:</strong> Simulate immediate dispatch to see the full buyer journey.
                  </p>
                </div>

                <Button
                  onClick={handleSimulateDispatch}
                  className="w-full h-14 bg-amber-600 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-none gap-2 hover:bg-amber-700 shadow-lg"
                >
                  <Truck className="h-4 w-4" /> Demo: Seller Dispatches Now →
                </Button>

                <Button
                  variant="outline"
                  onClick={() => { handleClose(); router.push('/dashboard'); }}
                  className="w-full h-12 font-black uppercase text-[9px] tracking-[0.2em] rounded-none border-2 border-amber-600/20 hover:bg-amber-600/5"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {/* ── 5. IN TRANSIT ── */}
            {step === 'in_transit' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-amber-600/10 border border-amber-600/20 rounded-none flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-7 w-7 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-[#800020]">Item Dispatched</h2>
                  <p className="text-[10px] text-[#800020] mt-1 uppercase tracking-widest">Your item is on its way to you</p>
                </div>

                <div className="bg-slate-950 border-l-4 border-amber-600 p-6 space-y-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Tracking ID</p>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">ACC-2026-{orderId.replace('ORD-', '')}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-1">ETA</p>
                      <p className="text-sm font-black text-white uppercase tracking-tighter italic">1–3 Days</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 border-t border-white/10 pt-4 uppercase tracking-wide">
                    Funds remain in escrow. You are fully protected until you confirm receipt and inspect the item.
                  </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-3">
                  {[
                    { label: 'Order placed & payment secured', done: true },
                    { label: 'Seller packed & dispatched',      done: true },
                    { label: 'In transit to delivery address',  done: true },
                    { label: 'Delivered — awaiting confirmation', done: false },
                  ].map((s, i) => (
                    <div key={i} className={cn('flex items-center gap-4 p-4 border rounded-none transition-all', s.done ? 'border-amber-600/20 bg-amber-600/5' : 'border-white/5 bg-slate-950/50')}>
                      {s.done
                        ? <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                        : <div className="h-4 w-4 border-2 border-white/10 rounded-none shrink-0" />
                      }
                      <span className={cn('text-[10px] font-black uppercase tracking-widest', s.done ? 'text-white' : 'text-white/20')}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep('inspection')}
                  className="w-full h-16 bg-amber-600 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-none gap-3 hover:bg-amber-700 shadow-lg"
                >
                  <Package className="h-5 w-5" /> I've Received My Item
                </Button>
              </div>
            )}

            {/* ── 6. INSPECTION ── */}
            {step === 'inspection' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-amber-600/10 border border-amber-600/20 flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-7 w-7 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-[#800020]">Inspect Your Item</h2>
                  <p className="text-[10px] text-[#800020] mt-1 uppercase tracking-widest">Verify everything before releasing payment to the seller</p>
                </div>

                <div className="space-y-2">
                  {[
                    'Item matches the listing description exactly',
                    'No physical damage or defects present',
                    'All accessories and parts are included',
                    'Item powers on and works as expected',
                  ].map((check, i) => (
                    <label key={i} className="flex items-center gap-4 p-4 border-2 border-border/50 cursor-pointer hover:border-amber-600/40 transition-all bg-background">
                      <input type="checkbox" className="h-5 w-5 accent-amber-600 rounded-none border-2" />
                      <span className="text-[10px] font-black uppercase tracking-tight text-foreground leading-snug">{check}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-slate-950 border-2 border-amber-600/20 p-6 space-y-3 shadow-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 mb-2">Payment breakdown on release</p>
                  <div className="flex justify-between text-[13px] font-black text-white italic">
                    <span className="uppercase tracking-tighter">Seller receives</span>
                    <span className="text-green-500 tracking-tighter">{formatPrice((total || 0) - fee)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-[#800020] uppercase tracking-widest pt-2 border-t border-white/5">
                    <span>Platform commission (2.5%)</span>
                    <span>{formatPrice(fee)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleDispute}
                    className="h-14 rounded-none border-destructive/40 text-destructive hover:bg-destructive hover:text-white font-black uppercase text-[9px] tracking-[0.2em] gap-2"
                  >
                    <AlertCircle className="h-4 w-4" /> Problem? Dispute
                  </Button>
                  <Button
                    onClick={handleRelease}
                    className="h-14 bg-green-600 text-white hover:bg-green-700 font-black uppercase text-[9px] tracking-[0.2em] rounded-none gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Release Payment
                  </Button>
                </div>
              </div>
            )}

            {/* ── 7. RELEASED / COMPLETE ── */}
            {step === 'released' && (
              <div className="text-center py-8 space-y-8 animate-in fade-in zoom-in-95 duration-400">
                <div className="h-24 w-24 bg-amber-600/10 rounded-none border-2 border-amber-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                  <CheckCircle2 className="h-12 w-12 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic text-[#800020]">Transaction Complete!</h2>
                  <p className="text-[10px] text-[#800020] uppercase tracking-[0.3em] mt-3">
                    {formatPrice((total || 0) - fee)} released to seller
                  </p>
                </div>
                <div className="bg-slate-950 border-2 border-amber-600/20 p-8 space-y-4 text-left shadow-2xl text-[#800020]">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span>Order ID</span><span className="">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span>Reference</span><span className="font-mono text-[10px] truncate ml-4">{paystackRef}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
                    <span>Status</span>
                    <Badge className="bg-amber-600 text-white rounded-none border-none text-[9px] font-black uppercase px-3 py-1 tracking-widest">COMPLETED</Badge>
                  </div>
                </div>
                <p className="text-[9px] text-amber-600 font-black uppercase tracking-[0.4em] animate-pulse pt-4">Redirecting to Registry Dashboard...</p>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
