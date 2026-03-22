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
  Package,
  Timer,
  Home as HomeIcon,
  Phone,
  X,
} from 'lucide-react';
import { useAuth, useContent, useTheme, useSearch, type PrimaryTheme } from '@/components/providers';
import { useState, useEffect } from 'react';
import { AuthDialog } from '@/components/auth-dialog';
import { MegaMenu } from '@/components/mega-menu';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
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
import { ListingCreateDialog } from '@/components/listing-create-dialog';

export function Navbar() {
  const { user } = useAuth();
  const { content } = useContent();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  // [FIX 5.1] Mobile menu state — was completely broken, now wired up
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('Accra');

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
    <header className="w-full bg-background/95 backdrop-blur-md border-b-[3px] border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sticky top-0 z-50 transition-all duration-300">
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-amber-600/20 p-1.5 bg-background shadow-sm group-hover:border-amber-600/50 group-hover:shadow-lg group-hover:shadow-amber-600/20 transition-all duration-500 group-hover:scale-105">
            <Image 
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png"
              alt="Logo" 
              fill 
              sizes="40px" 
              className="object-contain transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" 
              priority 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-amber-600 tracking-tighter uppercase leading-none">
              {content.settings.siteName}
            </span>
            <span className="text-[8px] font-bold text-amber-700/70 uppercase tracking-[0.2em] mt-1">Secure Marketplace</span>
          </div>
        </Link>

        {/* MEGA MENU — Desktop */}
        <div className="hidden md:block">
          <MegaMenu />
        </div>

        {/* SEARCH AREA — Simplified "Uber Style" */}
        <div className="hidden md:flex flex-1 max-w-xl items-center h-12 bg-secondary border border-border focus-within:border-amber-600 focus-within:bg-background focus-within:shadow-lg transition-all duration-500 group rounded-xl overflow-hidden">
          <div className="flex-1 flex items-center px-5 gap-4 h-full">
            <Search className="h-4 w-4 text-amber-600" />
            <input 
              placeholder='Search verified listings, vendors...' 
              className="w-full bg-transparent outline-none text-amber-900 text-sm font-bold placeholder:text-amber-700/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                }
              }}
            />
            <span className="text-[10px] font-black text-amber-700/40 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">ESC</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex px-5 items-center gap-2 shrink-0 cursor-pointer hover:bg-amber-50 h-full transition-colors">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-black text-amber-900">{location}</span>
                <ChevronDown className="h-3 w-3 text-amber-700/40" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border-2 border-amber-600/20 shadow-2xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-amber-700/60 px-4 py-2">Select Location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast'].map((loc) => (
                <DropdownMenuItem key={loc} onClick={() => setLocation(loc)} className="cursor-pointer text-xs font-black px-4 py-2 hover:bg-amber-50 text-amber-900 transition-colors">
                  {loc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary/10 text-foreground hover:text-primary transition-all border border-border hover:border-primary/20">
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-background" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 rounded-2xl border-2 border-primary/20 shadow-2xl p-0 bg-background overflow-hidden" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/80">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Notifications</span>
                  <button className="text-[9px] font-black uppercase text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <DropdownMenuItem key={n.id} className="p-4 border-b border-border/50 cursor-pointer hover:bg-primary/5 transition-colors focus:bg-primary/5 outline-none block">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          n.type === 'order' ? 'bg-blue-100 text-blue-600' : 
                          n.type === 'payment' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        )}>
                          {n.type === 'order' ? <Package className="h-5 w-5" /> : 
                           n.type === 'payment' ? <ShieldCheck className="h-5 w-5" /> : <Timer className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[11px] font-black uppercase text-foreground leading-tight tracking-tight">{n.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{n.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">3/19/2026</p>
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-3 bg-secondary/30 text-center">
                  <button className="text-[9px] font-black uppercase text-primary hover:underline tracking-widest">View All Activity</button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary/10 text-foreground hover:text-primary transition-all border border-border hover:border-primary/20">
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
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[11px] font-black text-amber-900 uppercase tracking-tighter leading-none group-hover:text-amber-600 transition-colors">{user.name}</span>
                    <span className="text-[9px] font-bold text-amber-700/50 uppercase tracking-widest mt-1">{user.role}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform border-2 border-white">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl border border-border/50 shadow-2xl p-2 mt-2 bg-background/95 backdrop-blur-xl" align="end">
                  <DropdownMenuLabel className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Account</DropdownMenuLabel>
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
                className="text-foreground font-black text-[8px] md:text-[9px] uppercase tracking-widest px-3 md:px-6 h-10 hover:bg-secondary border-2 border-border/50 hover:border-primary/30 transition-all rounded-xl"
              >
                Login
              </Button>
            )}

            <ListingCreateDialog>
              <Button 
                className="hidden xs:flex bg-primary text-white hover:opacity-95 font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] h-10 px-3 md:px-6 shadow-lg shadow-primary/20 items-center gap-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Post Ad</span>
              </Button>
            </ListingCreateDialog>
            
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

      {/* [FIX 5.1] Mobile Menu Sheet — full navigation drawer for mobile users */}
      {/* [FIX 2.4] Includes theme switcher for mobile users */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px] rounded-none border-l-2 border-primary p-0 flex flex-col">
          <SheetHeader className="px-6 py-5 border-b border-border/50 bg-secondary text-foreground">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">
                Menu
              </SheetTitle>
              <SheetClose asChild>
                <button aria-label="Close menu" className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Nav Links */}
            <div className="px-6 py-4 border-b border-border/30">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Navigation</p>
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
                  <Button 
                    asChild
                    className="w-full h-10 bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest rounded-none gap-2"
                  >
                    <Link href="/listings/create" onClick={() => setMobileMenuOpen(false)}>
                      <Plus className="h-3.5 w-3.5" />
                      Post Ad
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
