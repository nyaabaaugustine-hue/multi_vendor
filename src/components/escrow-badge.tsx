
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EscrowBadge({ className }: { className?: string }) {
  return (
    <Badge variant="secondary" className={cn("gap-2.5 py-2.5 px-6 bg-secondary text-white border-none font-black shadow-2xl shadow-secondary/20 rounded-none", className)}>
      <Lock className="h-4 w-4 text-primary" />
      <span className="text-[10px] tracking-[0.2em] uppercase">Escrow Protected</span>
    </Badge>
  );
}
