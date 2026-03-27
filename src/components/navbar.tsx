"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Search, MapPin, Bell, Palette, ChevronDown,
  Info, ShieldCheck, Plus, Menu, Package, Timer,
  Home as HomeIcon, Phone, X, LogOut, User as UserIcon,
  Settings, LayoutDashboard,
} from 'lucide-react';
import { useAuth, useContent, useTheme, useSearch, type PrimaryTheme } from '@/components/providers';
import { useState, useEffect } from 'react';
import { AuthDialog } from '@/components/auth-dialog';
import { MegaMenu } from '@/components/mega-menu';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ListingCreateDialog } from '@/components/listing-create-dialog';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const { content }      = useContent();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();

  const [showAuth, setShowAuth]           = useState(false);
  const [mounted, setMounted]             = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation]           = useState('Accra');

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const themes: { id: PrimaryTheme; name: string; dot: string; desc: string }[] = [
    { id: 'cold-white', name: 'Light',       dot: 'bg-white border-2 border-gray-300',   desc: 'Default' },
    { id: 'sovereign',  name: 'Sovereign',   dot: 'bg-slate-800',   desc: 'Space Blue' },
    { id: 'midnight',   name: 'Midnight',    dot: 'bg-black',       desc: 'OLED Black' },
    { id: 'cobalt',     name: 'Cobalt',      dot: 'bg-blue-800',    desc: 'Corporate' },
    { id: 'royal',      name: 'Royal',       dot: 'bg-purple-800',  desc: 'Majesty' },
    { id: 'crimson',    name: 'Crimson',     dot: 'bg-red-800',     desc: 'Power' },
  ];

  const NAV_LINKS = [
    { name: 'Home',     href: '/',        icon: HomeIcon },
    { name: 'About',    href: '/about',   icon: Info },
    { name: 'Vendors',  href: '/vendors', icon: ShieldCheck },
    { name: 'Contact',  href: '/contact', icon: Phone },
  ];

  const unreadCount = MOCK_NOTIFICATIONS.length;

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300"
      style={{ backgroundColor: 'hsl(var(--background))', borderBottom: '2px solid hsl(var(--primary) / 0.25)' }}
    >
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />

      <div className="max-w-7xl mx-auto px-4 h-16 md:h-[72px] flex items-center justify-between gap-4 md:gap-6">

        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border-2 p-1.5 transition-all duration-300 group-hover:scale-105"
            style={{ borderColor: 'hsl(var(--primary) / 0.3)', backgroundColor: 'hsl(var(--background))' }}
          >
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png"
              alt="Logo" fill sizes="36px"
              className="object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-lg leading-none tracking-tighter" style={{ color: 'hsl(var(--primary))' }}>
              {content.settings.siteName}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] leading-none mt-0.5"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              Secure Marketplace
            </span>
          </div>
        </Link>

        {/* ── MEGA MENU (Desktop) ── */}
        <div className="hidden lg:block">
          <MegaMenu />
        </div>

        {/* ── SEARCH BAR (Desktop) ── */}
        <div className="hidden md:flex flex-1 max-w-md items-center h-11 rounded-xl overflow-hidden border-2 transition-all duration-300 focus-within:shadow-lg"
          style={{
            backgroundColor: 'hsl(var(--secondary))',
            borderColor: 'hsl(var(--border))',
          }}
        >
          <div className="flex-1 flex items-center px-4 gap-3 h-full">
            <Search className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
            <input
              placeholder="Search verified listings..."
              className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-[hsl(var(--muted-foreground))]"
              style={{ color: 'hsl(var(--foreground))' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0">
                <X className="h-3.5 w-3.5" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </button>
            )}
          </div>
          <div className="h-5 w-px" style={{ backgroundColor: 'hsl(var(--border))' }} />
          {/* Location dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 h-full hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                <MapPin className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary))' }} />
                <span className="text-[11px] font-black" style={{ color: 'hsl(var(--foreground))' }}>{location}</span>
                <ChevronDown className="h-3 w-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl border-2 shadow-xl"
              style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
            >
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest px-3 py-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Select Location
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: 'hsl(var(--border))' }} />
              {['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast'].map((loc) => (
                <DropdownMenuItem key={loc} onClick={() => setLocation(loc)}
                  className="text-[11px] font-bold px-3 py-2 cursor-pointer"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  {loc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all hover:scale-105"
                style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
              >
                <Bell className="h-4.5 w-4.5" style={{ color: 'hsl(var(--foreground))' }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-2xl p-0 shadow-2xl overflow-hidden border-2"
              style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              align="end"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
              >
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'hsl(var(--foreground))' }}>
                  Notifications
                </span>
                <button className="text-[9px] font-black uppercase" style={{ color: 'hsl(var(--primary))' }}>
                  Mark all read
                </button>
              </div>
              <div className="max-h-[340px] overflow-y-auto no-scrollbar">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <DropdownMenuItem key={n.id}
                    className="p-4 border-b cursor-pointer focus:outline-none block"
                    style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                        n.type === 'order'   && 'bg-blue-100 text-blue-600',
                        n.type === 'payment' && 'bg-green-100 text-green-600',
                        n.type !== 'order' && n.type !== 'payment' && 'bg-amber-100 text-amber-600',
                      )}>
                        {n.type === 'order'   && <Package className="h-4 w-4" />}
                        {n.type === 'payment' && <ShieldCheck className="h-4 w-4" />}
                        {n.type !== 'order' && n.type !== 'payment' && <Timer className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-[11px] font-black uppercase leading-tight" style={{ color: 'hsl(var(--foreground))' }}>
                          {n.title}
                        </p>
                        <p className="text-[10px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                          {n.message}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0 mt-1" />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-3 text-center border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <button className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'hsl(var(--primary))' }}>
                  View All
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme switcher */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all hover:scale-105"
                  style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
                >
                  <Palette className="h-4.5 w-4.5" style={{ color: 'hsl(var(--foreground))' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 rounded-2xl p-2 shadow-2xl border-2"
                style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                align="end"
              >
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest px-3 py-2"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Select Theme
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: 'hsl(var(--border))' }} />
                {themes.map((t) => (
                  <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-xl transition-all",
                      mounted && theme === t.id && "bg-primary/10"
                    )}
                  >
                    <span className={cn("text-[11px] font-bold", mounted && theme === t.id ? "text-primary" : "")}
                      style={{ color: mounted && theme === t.id ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
                    >
                      {t.name}
                    </span>
                    <div className={cn("h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm", t.dot)} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post Ad button */}
          <ListingCreateDialog>
            <Button className="hidden sm:flex h-10 px-4 font-black text-[10px] uppercase tracking-widest rounded-xl gap-2 shadow-md active:scale-95 transition-all"
              style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Post Ad</span>
            </Button>
          </ListingCreateDialog>

          {/* User menu / Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-1 group cursor-pointer">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[11px] font-black uppercase tracking-tight leading-none group-hover:text-primary transition-colors"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white/20 transition-all group-hover:scale-105"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 rounded-2xl p-2 shadow-2xl border-2 mt-1"
                style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                align="end"
              >
                {/* User info */}
                <div className="px-3 py-3 mb-1 rounded-xl" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                  <p className="text-[12px] font-black" style={{ color: 'hsl(var(--foreground))' }}>{user.name}</p>
                  <p className="text-[10px] truncate mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{user.email}</p>
                </div>
                <DropdownMenuSeparator style={{ backgroundColor: 'hsl(var(--border))' }} />
                <Link href="/dashboard">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <Package className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                  <span className="text-[11px] font-black uppercase tracking-widest">My Listings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <Settings className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ backgroundColor: 'hsl(var(--border))' }} />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              className="h-10 px-4 font-black text-[10px] uppercase tracking-widest rounded-xl border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                backgroundColor: 'hsl(var(--background))',
              }}
            >
              Login
            </Button>
          )}

          {/* ── HAMBURGER (always visible, always coloured) ── */}
          <button
            className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              borderColor:     'hsl(var(--primary))',
              color:           'hsl(var(--primary-foreground))',
            }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ════════ MOBILE SHEET ════════ */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[340px] p-0 flex flex-col border-l-2"
          style={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--primary) / 0.3)',
          }}
        >
          {/* Mobile Header */}
          <SheetHeader
            className="px-5 py-4 border-b flex-row items-center justify-between shrink-0"
            style={{
              backgroundColor: 'hsl(var(--secondary))',
              borderColor: 'hsl(var(--border))',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <SheetTitle className="text-[13px] font-black uppercase tracking-widest leading-none"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Menu
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <button className="h-8 w-8 rounded-xl flex items-center justify-center border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  backgroundColor: 'hsl(var(--background))',
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto no-scrollbar">

            {/* User info */}
            {user && (
              <div className="mx-4 mt-4 rounded-2xl p-4 border-2"
                style={{
                  backgroundColor: 'hsl(var(--primary) / 0.06)',
                  borderColor: 'hsl(var(--primary) / 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white shadow-md"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[12px] font-black" style={{ color: 'hsl(var(--foreground))' }}>
                      {user.name}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--primary))' }}>
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Search
              </p>
              <div className="flex items-center h-11 border-2 rounded-xl overflow-hidden"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--secondary))' }}
              >
                <input
                  placeholder="Search listings..."
                  className="flex-1 px-3 bg-transparent outline-none text-[12px] font-semibold"
                  style={{
                    color: 'hsl(var(--foreground))',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-full px-3 flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                >
                  <Search className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Nav Links */}
            <div className="px-4 pt-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Navigation
              </p>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-l-2 border-transparent hover:border-primary hover:bg-primary/5"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    <link.icon className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Theme switcher */}
            <div className="px-4 pt-4 border-t mt-4"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Theme
              </p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 border-2 rounded-xl transition-all text-left"
                    )}
                    style={{
                      borderColor: mounted && theme === t.id ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      backgroundColor: mounted && theme === t.id ? 'hsl(var(--primary) / 0.08)' : 'hsl(var(--background))',
                    }}
                  >
                    <div className={cn("h-3.5 w-3.5 rounded-full shrink-0 shadow-sm", t.dot)} />
                    <span className="text-[10px] font-black uppercase tracking-tight"
                      style={{ color: mounted && theme === t.id ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
                    >
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account actions */}
            <div className="px-4 pt-4 pb-6 border-t mt-4"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                Account
              </p>
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-black text-[11px] uppercase tracking-widest transition-all hover:bg-primary/5"
                      style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    >
                      <LayoutDashboard className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-900 font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}
                    variant="outline"
                    className="w-full h-11 font-black text-[10px] uppercase tracking-widest rounded-xl border-2"
                    style={{
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    Login
                  </Button>
                  <ListingCreateDialog>
                    <Button
                      className="w-full h-11 font-black text-[10px] uppercase tracking-widest rounded-xl gap-2"
                      style={{
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Post Ad
                    </Button>
                  </ListingCreateDialog>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
