"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Search', icon: Search, href: '/listings' },
  { label: 'Sell', icon: PlusCircle, href: '/sell', isCenter: true },
  { label: 'Messages', icon: MessageSquare, href: '/messages' },
  { label: 'Profile', icon: User, href: '/dashboard' },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg md:max-w-md">
      <nav className="bg-background/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl p-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative -top-6"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center text-primary-foreground transition-transform hover:scale-110 active:scale-95 border-4 border-background">
                  <Icon className="h-8 w-8" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
