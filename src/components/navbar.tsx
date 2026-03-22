"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Bell, 
  Palette,
  ChevronDown,
  Info,
  ShieldCheck,
  Plus,
  Menu,
  Home as HomeIcon,
  Phone,
  Activity,
  Zap,
  Lock,
  X,
} from 'lucide-react';
import { useAuth, useContent, useTheme, useSearch, type PrimaryTheme } from '@/components/providers';
import { useState, useEffect } from 'react';
import { AuthDialog } from '@/components/auth-dialog';
import { MegaMenu } from '@/components/mega-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { user } = useAuth();
  const { content } = useContent();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  // [FIX 5.1] Mobile menu state — was completely broken, now wired up
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes: { id: PrimaryTheme; name: string; color: string; desc: string }[] = [
    { id: 'cold-white', name: 'Clinical Light', color: 'bg-white border', desc: 'Standard Default' },
    { id: 'sovereign', name: 'Elite Sovereign', color: 'bg-slate-900', desc: 'Space Blue Blend' },
    { id: 'midnight', name: 'Midnight OLED', color: 'bg-black', desc: 'Slate Blue Blend' },
    { id: 'cobalt', name: 'Enterprise Blue', color: 'bg-blue-900', desc: 'Corporate Cobalt' },
    { id: 'royal', name: 'Royal Majesty', color: 'bg-purple-900', desc: 'Indigo Blend' },
    { id: 'crimson', name: 'Power Crimson', color: 'bg-red-900', desc: 'Heat Blend' },
  ];

  const NAV_LINKS = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Vendors', href: '/vendors', icon: ShieldCheck },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300">
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-primary/10 p-1.5 bg-white shadow-sm group-hover:border-primary/30 transition-all duration-500">
            <Image 
              src={content.settings.logoUrl} 
              alt="Logo" 
              fill 
              sizes="40px" 
              className="object-contain" 
              priority 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-foreground tracking-tighter uppercase leading-none">
              {content.settings.siteName}
            </span>
            <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1 opacity-70">Sovereign Marketplace</span>
          </div>
        </Link>

        {/* SEARCH AREA — Simplified "Uber Style" */}
        <div className="hidden md:flex flex-1 max-w-xl items-center h-12 bg-muted/30 rounded-2xl border border-border/40 focus-within:border-primary/30 focus-within:bg-background focus-within:shadow-lg transition-all duration-500 group">
          <div className="flex-1 flex items-center px-5 gap-4">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              placeholder='Search verified listings, vendors...' 
              className="w-full bg-transparent outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-6 w-px bg-border/50" />
          <div className="flex px-5 items-center gap-2 shrink-0 cursor-pointer hover:bg-muted/50 h-full transition-colors">
            <MapPin className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-xs font-bold text-foreground">Accra</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 mr-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl border border-border/50 shadow-2xl p-2" align="end">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-3 py-2">Select Theme</DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2" />
                {themes.map((t) => (
                  <DropdownMenuItem 
                    key={t.id} 
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-xl transition-all",
                      mounted && theme === t.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="text-xs font-bold uppercase tracking-tight">{t.name}</span>
                    <div className={cn("h-3 w-3 rounded-full border border-white/20", t.color)} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-2xl hover:bg-primary/5 group transition-all">
                  <Avatar className="h-8 w-8 rounded-xl border border-primary/10">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start leading-none hidden sm:flex">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{user.role.split('_')[0]}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl border border-border/50 shadow-2xl p-2 mt-2" align="end">
                  <DropdownMenuLabel className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Account Node</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Dashboard</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer">My Listings</DropdownMenuItem>
                  <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setShowAuth(true)}
                variant="outline" 
                className="text-foreground font-black text-[8px] md:text-[9px] uppercase tracking-widest px-3 md:px-4 h-8 hover:bg-muted border-2 transition-all"
              >
                Login
              </Button>
            )}

            <Link href="/listings/create" className="hidden xs:block">
              <Button 
                className="bg-primary text-primary-foreground hover:opacity-95 font-black text-[8px] md:text-[9px] uppercase tracking-widest h-8 px-3 md:px-5 shadow-md flex items-center gap-2"
              >
                <Plus className="h-3 w-3" />
                <span className="hidden sm:inline">Post Ad</span>
                <span className="sm:hidden">Post</span>
              </Button>
            </Link>
            
            {/* [FIX 5.1] Mobile hamburger — now wired to Sheet drawer, was completely non-functional */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* [FIX 5.1] Mobile Menu Sheet — full navigation drawer for mobile users */}
      {/* [FIX 2.4] Includes theme switcher for mobile users */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px] rounded-none border-l-2 border-primary p-0 flex flex-col">
          <SheetHeader className="px-6 py-5 border-b border-border/50 bg-secondary text-white">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                Navigation Registry
              </SheetTitle>
              <SheetClose asChild>
                <button aria-label="Close menu" className="text-white/60 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Nav Links */}
            <div className="px-6 py-4 border-b border-border/30">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Pages</p>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-[11px] font-black uppercase tracking-widest text-foreground hover:text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all"
                  >
                    <link.icon className="h-4 w-4 shrink-0 text-primary/60" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Search */}
            <div className="px-6 py-4 border-b border-border/30">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Search</p>
              <div className="flex items-center h-10 border border-border rounded-none overflow-hidden bg-muted/20 focus-within:border-primary/40 transition-all">
                <input
                  placeholder="Search listings..."
                  className="flex-1 px-3 bg-transparent outline-none text-foreground text-[11px] font-bold placeholder:text-muted-foreground/40 uppercase tracking-tight"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search listings"
                />
                <button
                  aria-label="Submit search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-full px-3 bg-primary text-primary-foreground"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="px-6 py-4 border-b border-border/30">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Theme</p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 border transition-all text-left",
                      mounted && theme === t.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted/30 text-foreground"
                    )}
                  >
                    <div className={cn("h-3 w-3 shrink-0 rounded-none border border-border/50", t.color)} />
                    <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Actions */}
            <div className="px-6 py-4">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Account</p>
              {user ? (
                <div className="flex items-center gap-3 p-3 border border-primary/20 bg-primary/5">
                  <Avatar className="h-8 w-8 rounded-none border border-primary/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-secondary text-[10px] font-black">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-foreground">{user.name}</p>
                    <p className="text-[8px] font-bold uppercase text-primary tracking-widest">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}
                    variant="outline"
                    className="w-full h-10 font-black text-[9px] uppercase tracking-widest border-2 rounded-none"
                  >
                    Login
                  </Button>
                  <Link href="/listings/create" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-10 bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest rounded-none gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Post Ad
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
