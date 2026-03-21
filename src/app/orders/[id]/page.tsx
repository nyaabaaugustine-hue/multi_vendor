
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  CheckCircle2, 
  Timer, 
  Lock, 
  Key, 
  ArrowLeft,
  Activity,
  Fingerprint,
  Zap,
  Info,
  ShieldAlert,
  Wallet,
  MessageSquare,
  FileCode,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/components/providers';
import { EscrowProgress } from '@/components/escrow-progress';

export default function OrderLifecycle() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  
  const [checklist, setChecklist] = useState({
    condition: false,
    matches: false,
    functionality: false,
    biometric: false
  });

  const handleBiometricScan = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setChecklist(prev => ({ ...prev, biometric: true }));
      toast({
        title: "Identity Verified",
        description: "Authentication successful.",
      });
    }, 2000);
  };

  const handleFinalSettlement = () => {
    const isComplete = checklist.condition && checklist.matches && checklist.functionality && checklist.biometric;
    
    if (!isComplete) {
      toast({
        variant: "destructive",
        title: "Inspection Incomplete",
        description: "Please complete all checks and verify your identity.",
      });
      return;
    }

    toast({
      title: "Payment Authorized",
      description: "Funds are being released to the seller.",
    });
    router.push('/dashboard');
  };

  const handleMediation = () => {
    const orderId = id as string;
    const message = encodeURIComponent(`I need mediation for Order ${orderId}. There is an issue with the quality check.`);
    window.open(`https://wa.me/233541988383?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8 rounded-none gap-2 font-black text-[10px] uppercase tracking-widest border px-6">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <Badge className="bg-primary text-secondary rounded-none font-black text-[10px] px-3">{id}</Badge>
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order Center: ACCRA-01</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-secondary uppercase tracking-tighter">Order Progress</h1>
            </div>
            <div className="bg-white border p-6 rounded-none shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/5 flex items-center justify-center text-primary">
                <Timer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estimated Delivery</p>
                <p className="text-2xl font-black text-burgundy tracking-tighter">32:14:05</p>
              </div>
            </div>
          </div>

          {/* Interactive Escrow Flow Visualization */}
          <EscrowProgress currentStatus="inspection" />

          {/* Inspection Hub */}
          <Card className="rounded-none border-t-4 border-t-primary shadow-2xl bg-white">
            <CardHeader className="p-8">
               <div className="flex items-center gap-4 mb-2">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl font-black text-secondary uppercase tracking-tighter">Quality Check</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">Verify your item to release the payment to the seller.</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    {[
                      { id: 'condition', label: 'Item Condition Verified', desc: 'No physical damage or defects.' },
                      { id: 'matches', label: 'Correct Item Received', desc: 'Product matches all specifications.' },
                      { id: 'functionality', label: 'Item is Functional', desc: 'Everything works as expected.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 bg-muted/20 border border-transparent hover:border-primary/20 transition-all cursor-pointer" onClick={() => setChecklist(prev => ({...prev, [item.id as keyof typeof prev] : !prev[item.id as keyof typeof prev]}))}>
                        <Checkbox id={item.id} checked={checklist[item.id as keyof typeof checklist]} className="mt-1" />
                        <div className="flex flex-col">
                          <label htmlFor={item.id} className="text-[11px] font-black uppercase tracking-widest text-secondary cursor-pointer">{item.label}</label>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="flex flex-col justify-center gap-6 p-8 border-2 border-dashed bg-primary/5 text-center">
                    <div className="space-y-3">
                       <Fingerprint className={cn("h-16 w-16 mx-auto transition-all", checklist.biometric ? "text-green-500 scale-110" : "text-primary opacity-40")} />
                       <h4 className="text-xs font-black uppercase tracking-widest">Confirm Your Identity</h4>
                       <p className="text-[9px] text-muted-foreground uppercase font-medium leading-relaxed">Securely authorize this payment via fingerprint or face ID.</p>
                    </div>
                    <Button 
                      className={cn(
                        "rounded-none h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl",
                        checklist.biometric ? "bg-green-600 text-white" : "bg-secondary text-white"
                      )}
                      onClick={handleBiometricScan}
                      disabled={biometricScanning}
                    >
                      {biometricScanning ? "Verifying..." : checklist.biometric ? "Identity Verified" : "Verify Now"}
                    </Button>
                 </div>
              </div>

              <div className="pt-8 border-t border-dashed flex flex-col sm:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-burgundy" />
                    <p className="text-[9px] font-black uppercase text-secondary max-w-xs">Funds are safely held until you authorize the release.</p>
                 </div>
                 <Button 
                   onClick={handleFinalSettlement}
                   className="w-full sm:w-auto bg-primary text-secondary hover:bg-white hover:text-secondary border-2 border-primary font-black rounded-none h-16 px-16 text-xs uppercase tracking-[0.3em] shadow-2xl"
                 >
                   AUTHORIZE PAYMENT
                 </Button>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Audit Registry */}
          <Card className="rounded-none border-l-4 border-l-secondary bg-white shadow-xl">
            <CardHeader className="p-8 border-b border-dashed">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-secondary" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Protocol Audit Trail</CardTitle>
                  </div>
                  <Badge variant="outline" className="rounded-none text-[8px] font-black border-primary/20 bg-primary/5 text-primary">TRANSPARENCY NODE ACTIVE</Badge>
               </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                  {[
                    { node: 'TREASURY_LOCK', text: 'GHS liquidity locked in secure escrow node.', time: '2026-03-21 10:15:02', status: 'COMPLETE' },
                    { node: 'VENDOR_NOTIFY', text: 'Institutional partner "Melcom" authorized for dispatch.', time: '2026-03-21 10:20:45', status: 'COMPLETE' },
                    { node: 'LOGISTICS_SYNC', text: 'Secure courier node assigned: ACCRA-DELIVERY-04.', time: '2026-03-21 11:05:12', status: 'COMPLETE' },
                    { node: 'GPS_VERIFY', text: 'Asset location verified within cantonments sector.', time: '2026-03-21 14:30:00', status: 'ACTIVE' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-6 items-start relative group">
                       {i < 3 && <div className="absolute left-[9px] top-6 w-0.5 h-10 bg-muted group-hover:bg-primary/20 transition-colors" />}
                       <div className={cn("h-5 w-5 rounded-full mt-1 border-2 flex items-center justify-center shrink-0 z-10", log.status === 'COMPLETE' ? 'bg-primary border-primary' : 'bg-white border-secondary animate-pulse')}>
                          {log.status === 'COMPLETE' && <CheckCircle2 className="h-3 w-3 text-white" />}
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-black uppercase text-secondary tracking-widest">{log.node}</p>
                             <span className="text-[8px] font-bold text-muted-foreground uppercase">{log.time}</span>
                          </div>
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-tight leading-relaxed">{log.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-none border shadow-xl bg-secondary text-white overflow-hidden">
              <div className="bg-primary p-6">
                 <h3 className="font-black uppercase tracking-widest text-secondary text-sm">Escrow Details</h3>
              </div>
              <CardContent className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Item Price</span>
                    <span className="text-lg font-black text-milky">{formatPrice(8450)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Service Fee (2%)</span>
                    <span className="text-sm font-bold text-primary">{formatPrice(169)}</span>
                 </div>
                 <div className="h-px bg-white/10 my-2" />
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-accent">Total Held Safely</span>
                    <span className="text-2xl font-black text-milky tracking-tighter">{formatPrice(8619)}</span>
                 </div>
              </CardContent>
              <div className="bg-white/5 p-6 border-t border-white/5">
                 <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Protection Status: ACTIVE</p>
                 </div>
              </div>
           </Card>

           <Card className="rounded-none border shadow-sm p-8 space-y-6 bg-white">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] border-b pb-4">Order Partners</h4>
              <div className="space-y-6">
                 <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-muted flex items-center justify-center font-black">M</div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-secondary">Melcom Digital Hub</p>
                       <p className="text-[8px] font-bold text-muted-foreground uppercase">Fidelity Score: 98%</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-primary/10 flex items-center justify-center font-black text-primary">SL</div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-secondary">Secure Logistics</p>
                       <p className="text-[8px] font-bold text-muted-foreground uppercase">SLA Compliance: 100%</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="rounded-none border shadow-sm p-8 bg-muted/20 border-dashed">
              <div className="flex items-center gap-3 mb-4">
                 <MessageSquare className="h-4 w-4 text-primary" />
                 <h5 className="text-[10px] font-black uppercase tracking-widest">Support Center</h5>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground leading-relaxed uppercase mb-4">Need help with your inspection? Connect with an agent for immediate mediation.</p>
              <Button 
                variant="outline" 
                onClick={handleMediation}
                className="w-full rounded-none font-black text-[9px] uppercase tracking-widest h-10 border-primary/20 gap-2"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Open Mediation Case
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
