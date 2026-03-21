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
    <header className="w-full bg-background border-b sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      
      {/* SOVEREIGN PROTOCOL TICKER */}
      {/* [FIX 1.3] Upgraded ticker text to text-[10px] and text-white/90 for WCAG contrast */}
      <div className="bg-secondary text-white overflow-hidden h-8 flex items-center border-b border-white/5">
        <div className="flex animate-marquee whitespace-nowrap items-center gap-12 px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Network Health: 99.98%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Active Escrow: GH₵4,240,950</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Settlement Speed: 1.4h Average</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Registry Status: ACCRA HUB ONLINE</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Network Health: 99.98%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Active Escrow: GH₵4,240,950</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Settlement Speed: 1.4h Average</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90">Registry Status: ACCRA HUB ONLINE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-8 h-full">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative h-7 w-7 md:h-9 md:w-9 overflow-hidden rounded-none border border-primary/20 p-1 bg-white shadow-sm group-hover:border-primary transition-colors duration-500">
              <Image 
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png" 
                alt="Logo" 
                fill 
                sizes="40px" 
                className="object-contain" 
                priority 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-black text-base md:text-lg text-foreground tracking-tighter uppercase leading-none">
                {content.settings.siteName}
              </span>
              <span className="text-[6px] font-black text-primary uppercase tracking-[0.3em] mt-0.5">Marketplace</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center h-full gap-6">
            <div className="h-6 w-px bg-border mr-2" />
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-all relative group/nav"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/nav:w-full" />
              </Link>
            ))}
            <div className="h-6 w-px bg-border mx-2" />
            <MegaMenu />
          </div>
        </div>

        {/* [FIX 2.1] Search bar now gives visual feedback when query is active */}
        <div className="hidden sm:flex flex-1 max-w-md items-center h-9 md:h-10 border border-border rounded-none overflow-hidden bg-muted/10 focus-within:border-primary/40 focus-within:bg-background transition-all duration-300">
          <div className="flex-1 flex items-center px-3 md:px-4 gap-3 border-r border-border">
            <input 
              placeholder='Search verified listings...' 
              className="w-full bg-transparent outline-none text-foreground text-[11px] md:text-[12px] font-bold placeholder:text-muted-foreground/40 uppercase tracking-tight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search listings"
            />
            {/* Clear button appears when searching */}
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="hidden md:flex px-3 items-center gap-2 shrink-0 cursor-pointer hover:bg-muted h-full transition-colors group">
            <MapPin className="h-3 w-3 text-primary/60" />
            <span className="text-[9px] font-black text-foreground uppercase tracking-widest">Accra</span>
            <ChevronDown className="h-2 w-2 text-muted-foreground" />
          </div>
          {/* [FIX 2.1] Search button turns fully primary when query is active */}
          <button
            aria-label="Submit search"
            className={cn(
              "h-full px-3 md:px-4 transition-all duration-200",
              searchQuery.length > 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden xl:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center gap-0.5 text-secondary hover:text-primary transition-all cursor-pointer group px-2">
                  <Palette className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[7px] font-black uppercase tracking-widest">THEME</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-none border-t-2 border-t-primary shadow-xl" align="end">
                <DropdownMenuLabel className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground">Themes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid gap-0.5">
                  {themes.map((t) => (
                    <DropdownMenuItem 
                      key={t.id} 
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer py-2 px-3 transition-all hover:bg-muted rounded-none",
                        mounted && theme === t.id && "bg-primary/10 border-l-2 border-primary"
                      )}
                    >
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", mounted && theme === t.id ? "text-primary" : "text-foreground")}>{t.name}</span>
                      <div className={cn("h-3 w-3 rounded-none", t.color)} />
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col items-center gap-0.5 text-secondary hover:text-primary transition-all cursor-pointer group px-2 relative">
              <Bell className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-[7px] font-black uppercase tracking-widest">Alerts</span>
              <span className="absolute top-0 right-1 h-1 w-1 bg-primary rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 px-3 h-9 border-2 border-primary/20 rounded-none group hover:border-primary transition-all">
                    <Avatar className="h-5 w-5 rounded-none border border-primary/20">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary text-secondary text-[8px] font-black">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start leading-none hidden sm:flex">
                      <span className="text-[9px] font-black uppercase tracking-tight text-foreground">{user.name}</span>
                      <span className="text-[7px] font-bold uppercase text-primary tracking-widest">{user.role.replace('_', ' ')}</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-none border-t-2 border-t-primary" align="end">
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
