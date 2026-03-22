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
    <div className="flex-shrink-0 rounded-full bg-[var(--bg-secondary)] p-2">
      <Icon className="h-5 w-5 text-[var(--primary)]" />
    </div>
    <div>
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  </div>
);

export const HowItWorksPopup = ({ onNext }: { onNext?: () => void }) => {
  const progress = 14;

  return (
    // This component assumes it's placed inside a modal or dialog container.
    <div className="w-full max-w-4xl rounded-lg bg-[var(--card)] p-8 shadow-lg border border-[var(--border)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            How It Works
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Step 1 of 7</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-[var(--primary)]">
            {progress}% Complete
          </span>
        </div>
      </div>

      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mb-8">
        <div
          className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Explanation */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            How Escrow Works
          </h3>
          <p className="text-[var(--text-secondary)]">
            We hold your funds securely until you're happy with your purchase.
            This protects both buyer and seller.
          </p>
          <div className="space-y-5">
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
        <div className="rounded-lg bg-[var(--bg-secondary)] p-6 flex flex-col border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Order Summary</h3>
          <div className="flex items-center gap-3 bg-green-100/50 text-green-800 text-sm font-medium px-3 py-2 rounded-md mb-4 border border-green-200/80">
            <CheckCircle className="h-5 w-5" />
            <span>Escrow Protected</span>
          </div>
          <div className="space-y-3 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Custom Northern Smock</span>
              <span className="font-semibold text-[var(--text-primary)]">GH₵1,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Service Fee (2.5%)</span>
              <span className="font-semibold text-[var(--text-primary)]">GH₵60</span>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-[var(--text-primary)]">Total to Pay</span>
              <span className="text-[var(--primary)]">GH₵1,260</span>
            </div>
          </div>
          <button 
            onClick={onNext}
            className="mt-6 w-full bg-[var(--primary)] text-white font-bold py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            Proceed to Secure Payment
          </button>
        </div>
      </div>
    </div>
  );
};