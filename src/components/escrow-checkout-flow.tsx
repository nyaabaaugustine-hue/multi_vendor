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
  AlertCircle, Copy, Timer, Package, Banknote, Eye, X,
  Zap, Bell, Smartphone, Wifi, CheckCheck, Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
    <div className="fixed top-4 right-4 z-[300] flex flex-col gap-2 w-80 pointer-events-none">
      {notifs.map(n => (
        <div
          key={n.id}
          className="pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-500 bg-white border-l-4 shadow-2xl flex items-start gap-3 p-4 rounded-none"
          style={{ borderLeftColor: n.color }}
        >
          <div className="shrink-0 mt-0.5" style={{ color: n.color }}>{n.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{n.event}</span>
              <Wifi className="h-2.5 w-2.5 text-green-500" />
            </div>
            <p className="text-[11px] font-black text-foreground leading-tight">{n.title}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors mt-0.5"
          >
            <X className="h-3 w-3" />
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
  const { items, total, clearCart, isCheckingOut, closeSuccess } = useCart();
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
        '#00c853',
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
        <DialogContent className="sm:max-w-lg rounded-none p-0 overflow-hidden border-t-4 border-t-primary shadow-2xl z-[150]">
          <DialogHeader className="sr-only">
            <DialogTitle>Secure Escrow Checkout</DialogTitle>
            <DialogDescription>Complete your purchase securely.</DialogDescription>
          </DialogHeader>

          {/* ── HEADER ── */}
          <div className="bg-secondary text-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none">
                  {STEP_LABEL[step]}
                </span>
              </div>
              <button onClick={handleClose} aria-label="Close" className="text-white/40 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40">
                <span>
                  Step {Math.max(1, stepIdx + 1)} of {STEP_ORDER.length}
                </span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-1 bg-white/10">
                <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-1 pt-0.5">
                {STEP_ORDER.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1 flex-1 transition-all duration-500 rounded-none',
                      stepIdx >= i ? 'bg-primary' : 'bg-white/15'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── STEP CONTENT ── */}
          <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto no-scrollbar">

            {/* ── 1. BRIEFING ── */}
            {step === 'briefing' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">How This Works</h2>
                  <p className="text-[10px] text-muted-foreground mt-1">Your money is 100% protected at every step</p>
                </div>

                <div className="space-y-2">
                  {[
                    { n: '1', icon: CreditCard, title: 'You Pay Securely',    desc: 'Via Paystack — Mobile Money, Visa, Mastercard or bank.' },
                    { n: '2', icon: Banknote,   title: 'Admin Holds Funds',   desc: 'Money goes to our escrow vault, not the seller.' },
                    { n: '3', icon: Truck,       title: 'Seller Dispatches',  desc: 'Seller must ship within 48h. No dispatch = full auto-refund.' },
                    { n: '4', icon: Eye,         title: 'You Inspect',        desc: 'Received item? Check it thoroughly before releasing.' },
                    { n: '5', icon: Zap,         title: 'Seller Gets Paid',   desc: 'One tap. Funds released instantly to the seller.' },
                  ].map(({ n, icon: Icon, title, desc }) => (
                    <div key={n} className="flex gap-3 p-3 border border-border/50 hover:border-primary/40 transition-colors">
                      <div className="h-7 w-7 bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black text-xs">
                        {n}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-foreground leading-none mb-0.5">{title}</p>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order summary */}
                <div className="bg-muted/40 border border-dashed p-4 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Order Summary</p>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-[11px] font-black gap-4">
                      <span className="text-foreground uppercase truncate">{item.title}</span>
                      <span className="text-foreground shrink-0">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed pt-3 space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase">
                      <span>Escrow Service Fee (2.5%)</span>
                      <span>{formatPrice(fee)}</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-black uppercase">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('payment_pending')}
                  className="w-full h-14 bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-widest rounded-none gap-2 shadow-xl hover:opacity-90"
                >
                  <CreditCard className="h-4 w-4" /> Proceed to Payment
                </Button>
              </div>
            )}

            {/* ── 2. PAYMENT PENDING ── */}
            {step === 'payment_pending' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Pay Securely</h2>
                  <p className="text-[10px] text-muted-foreground mt-1">Powered by Paystack · Ghana's #1 payment gateway</p>
                </div>

                {/* Paystack-style card */}
                <div className="bg-secondary text-white p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Paystack Secure Checkout</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-white/50 uppercase font-black mb-1">Amount</p>
                      <span className="text-3xl font-black text-primary tracking-tighter">{formatPrice(grandTotal)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-white/50 uppercase font-black mb-1">Order Ref</p>
                      <p className="text-[11px] font-black text-white/90">{orderId}</p>
                      <div className="flex items-center gap-1.5 mt-1 justify-end">
                        <span className="text-[8px] text-white/40 font-mono truncate max-w-[130px]">{paystackRef}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(paystackRef).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                          className="text-white/40 hover:text-primary transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        {copied && <span className="text-[8px] text-green-400">Copied!</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 flex gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                    Your payment is held by our escrow team. The seller receives nothing until <strong>you confirm delivery</strong> and release the funds.
                  </p>
                </div>

                <Button
                  onClick={handlePay}
                  className="w-full h-14 bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-widest rounded-none gap-2 shadow-xl hover:opacity-90"
                >
                  <Lock className="h-4 w-4" /> Pay {formatPrice(grandTotal)} via Paystack
                </Button>
                <p className="text-center text-[9px] text-muted-foreground uppercase tracking-widest">
                  MTN MoMo · Vodafone Cash · Visa · Mastercard · Bank Transfer
                </p>
              </div>
            )}

            {/* ── 3. PAYMENT PROCESSING ── */}
            {step === 'payment_processing' && (
              <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
                <div className="relative mx-auto h-20 w-20">
                  <div className="h-20 w-20 border-4 border-primary/20" />
                  <div className="absolute inset-0 h-20 w-20 border-4 border-primary border-t-transparent animate-spin" />
                  <Lock className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Processing Payment</h3>
                  <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-widest animate-pulse">
                    Paystack verifying transaction...
                  </p>
                </div>
                <Progress value={70} className="h-1.5 rounded-none bg-muted max-w-xs mx-auto" />
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Do not close this window</p>
              </div>
            )}

            {/* ── 4. ESCROW FUNDED ── */}
            {step === 'escrow_funded' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Payment Confirmed!</h2>
                  <p className="text-[10px] text-muted-foreground mt-1">Paystack confirmed. Funds locked in escrow.</p>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Escrow Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-[8px] font-black text-green-600 uppercase mb-0.5">Amount Locked</p>
                      <p className="text-[13px] font-black text-green-900">{formatPrice(grandTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-green-600 uppercase mb-0.5">Order</p>
                      <p className="text-[13px] font-black text-green-900">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-green-600 uppercase mb-0.5">Reference</p>
                      <p className="text-[9px] font-mono text-green-700 truncate">{paystackRef}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-green-600 uppercase mb-0.5">Status</p>
                      <Badge className="bg-green-100 text-green-700 rounded-none border-none text-[8px] font-black uppercase px-2">SECURED</Badge>
                    </div>
                  </div>
                  <p className="text-[9px] text-green-700 leading-relaxed border-t border-green-200 pt-2">
                    Seller notified. They must dispatch within <strong>48 hours</strong>. Failure = automatic full refund to you.
                  </p>
                </div>

                <div className="bg-muted/40 border border-dashed p-4 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Timer className="h-3.5 w-3.5 text-primary" /> Seller Dispatch Window
                  </p>
                  <div className="text-3xl font-black text-foreground tracking-tighter font-mono">47:59:58</div>
                  <p className="text-[9px] text-muted-foreground">Counting down for the seller. You will be notified on dispatch.</p>
                </div>

                {/* Demo shortcut for investors */}
                <div className="bg-amber-50 border border-amber-200 p-3 flex gap-3">
                  <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-amber-800 font-bold leading-relaxed">
                    <strong>Demo mode:</strong> Click below to simulate the seller dispatching immediately, so you can see the full buyer journey.
                  </p>
                </div>

                <Button
                  onClick={handleSimulateDispatch}
                  className="w-full h-12 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-none gap-2 hover:opacity-90"
                >
                  <Truck className="h-4 w-4" /> Demo: Seller Dispatches Now →
                </Button>

                <Button
                  variant="outline"
                  onClick={() => { handleClose(); router.push('/dashboard'); }}
                  className="w-full h-10 font-black uppercase text-[9px] tracking-widest rounded-none border-2"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {/* ── 5. IN TRANSIT ── */}
            {step === 'in_transit' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-amber-100 flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-7 w-7 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Item Dispatched</h2>
                  <p className="text-[10px] text-muted-foreground mt-1">Your item is on its way to you</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-0.5">Tracking</p>
                      <p className="text-[11px] font-black text-amber-900">ACC-2026-{orderId.replace('ORD-', '')}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-amber-600 uppercase mb-0.5">ETA</p>
                      <p className="text-[11px] font-black text-amber-900">1–3 days · Accra</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-amber-700 border-t border-amber-200 pt-2 leading-relaxed">
                    Funds remain in escrow. You are fully protected until you confirm receipt and inspect the item.
                  </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-2">
                  {[
                    { label: 'Order placed & payment secured', done: true },
                    { label: 'Seller packed & dispatched',      done: true },
                    { label: 'In transit to delivery address',  done: true },
                    { label: 'Delivered — awaiting your confirmation', done: false },
                  ].map((s, i) => (
                    <div key={i} className={cn('flex items-center gap-3 p-2.5 border', s.done ? 'border-green-200 bg-green-50' : 'border-border bg-muted/20')}>
                      {s.done
                        ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        : <div className="h-4 w-4 border-2 border-border rounded-full shrink-0" />
                      }
                      <span className={cn('text-[10px] font-black uppercase tracking-tight', s.done ? 'text-green-800' : 'text-muted-foreground')}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep('inspection')}
                  className="w-full h-12 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-none gap-2 hover:opacity-90"
                >
                  <Package className="h-4 w-4" /> I've Received My Item
                </Button>
              </div>
            )}

            {/* ── 6. INSPECTION ── */}
            {step === 'inspection' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="h-14 w-14 bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-7 w-7 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Inspect Your Item</h2>
                  <p className="text-[10px] text-muted-foreground mt-1">Verify everything before releasing payment to the seller</p>
                </div>

                <div className="space-y-2">
                  {[
                    'Item matches the listing description exactly',
                    'No physical damage or defects present',
                    'All accessories and parts are included',
                    'Item powers on and works as expected',
                  ].map((check, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 border border-border/50 cursor-pointer hover:border-primary/40 transition-colors">
                      <input type="checkbox" className="h-4 w-4 accent-primary" />
                      <span className="text-[10px] font-black uppercase tracking-tight text-foreground leading-snug">{check}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-muted/40 border border-dashed p-4 space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment breakdown on release</p>
                  <div className="flex justify-between text-[11px] font-black text-foreground">
                    <span>Seller receives</span>
                    <span className="text-green-600">{formatPrice((total || 0) - fee)}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-muted-foreground">
                    <span>Platform commission (2.5%)</span>
                    <span>{formatPrice(fee)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDispute}
                    className="h-12 rounded-none border-destructive/40 text-destructive hover:bg-destructive hover:text-white font-black uppercase text-[9px] tracking-widest gap-1.5"
                  >
                    <AlertCircle className="h-3.5 w-3.5" /> Problem? Dispute
                  </Button>
                  <Button
                    onClick={handleRelease}
                    className="h-12 bg-green-600 text-white hover:bg-green-700 font-black uppercase text-[9px] tracking-widest rounded-none gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Release Payment
                  </Button>
                </div>
              </div>
            )}

            {/* ── 7. RELEASED / COMPLETE ── */}
            {step === 'released' && (
              <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in-95 duration-400">
                <div className="h-20 w-20 bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">Transaction Complete!</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                    {formatPrice((total || 0) - fee)} released to seller
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 space-y-2 text-left">
                  <div className="flex justify-between text-[11px] font-black text-green-900">
                    <span>Order</span><span>{orderId}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-green-900">
                    <span>Reference</span><span className="font-mono text-[9px] truncate ml-4">{paystackRef}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-green-900">
                    <span>Status</span>
                    <Badge className="bg-green-100 text-green-700 rounded-none border-none text-[8px] font-black uppercase px-2">COMPLETED</Badge>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest animate-pulse">Redirecting to dashboard...</p>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
