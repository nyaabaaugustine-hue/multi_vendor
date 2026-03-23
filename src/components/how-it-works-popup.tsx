import {
  ShieldCheck,
  CreditCard,
  Package,
  Search,
  CheckCircle,
  Rocket,
} from 'lucide-react';

const HowItWorksStep = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 rounded-full bg-secondary p-2">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const HowItWorksPopup = ({ onNext }: { onNext?: () => void }) => {
  const progress = 14;

  return (
    // This component assumes it's placed inside a modal or dialog container.
    <div className="w-full max-w-4xl rounded-none bg-card p-8 shadow-lg border-4 border-amber-600">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">
            Checkout Flow
          </h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Step 1 of 7</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {progress}% Complete
          </span>
        </div>
      </div>

      <div className="w-full bg-secondary rounded-none h-1.5 mb-8">
        <div
          className="bg-amber-600 h-1.5 rounded-none transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Explanation */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
              Secure Escrow Protocol
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-relaxed">
              We hold your funds securely until you're happy with your purchase.
              This protects both buyer and seller via our Secure Buy system.
            </p>
          </div>
          <div className="space-y-6">
            <HowItWorksStep
              icon={CreditCard}
              title="Secure Payment"
              description="Pay via Mobile Money or Card. Funds are instantly secured in escrow."
            />
            <HowItWorksStep
              icon={ShieldCheck}
              title="Funds Held"
              description="Your money is held in our secure vault. The seller cannot access it yet."
            />
            <HowItWorksStep
              icon={Package}
              title="Item Dispatched"
              description="Seller is notified to ship. You get real-time tracking updates."
            />
            <HowItWorksStep
              icon={Search}
              title="Inspect & Verify"
              description="Receive your item and check it. Only release funds when satisfied."
            />
            <HowItWorksStep
              icon={Rocket}
              title="Instant Release"
              description="Once you approve, funds are released to the seller instantly."
            />
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="rounded-none bg-slate-950 p-8 flex flex-col border-2 border-amber-600/20 shadow-2xl">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Order Summary</h3>
          <div className="flex items-center gap-3 bg-amber-600 text-white text-[10px] font-black px-4 py-3 rounded-none mb-8 uppercase tracking-[0.2em]">
            <CheckCircle className="h-4 w-4" />
            <span>Secure Buy Protected</span>
          </div>
          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Custom Northern Smock</span>
              <span className="text-sm font-black text-[#800020] uppercase tracking-tighter">GH₵1,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Service Fee (2.5%)</span>
              <span className="text-sm font-black text-[#800020] uppercase tracking-tighter">GH₵60</span>
            </div>
          </div>
          <div className="border-t-2 border-white/10 pt-6 mt-8">
            <div className="flex justify-between items-center font-black text-xl">
              <span className="text-white uppercase tracking-tighter">Total to Pay</span>
              <span className="text-amber-600 tracking-tighter">GH₵1,260</span>
            </div>
          </div>
          <button 
            onClick={onNext}
            className="mt-8 w-full bg-amber-600 text-white font-black py-5 rounded-none hover:bg-amber-700 transition-all uppercase text-[12px] tracking-[0.3em] shadow-[0_10px_30px_rgba(217,119,6,0.3)] hover:-translate-y-1 active:scale-95"
          >
            Proceed to Secure Payment
          </button>
        </div>
      </div>
    </div>
  );
};