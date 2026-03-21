
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Store, 
  ShieldCheck, 
  Settings, 
  History, 
  Database,
  Lock,
  Zap,
  ChevronRight,
  LogOut,
  ExternalLink,
  PlusCircle,
  FileText,
  AlertTriangle,
  Monitor,
  FileCode,
  Home
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NAV_MAIN = [
  {
    title: "Admin Home",
    url: "/admin",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Content",
    url: "/admin/pages",
    icon: Monitor,
    items: [
      { title: "Edit Homepage", url: "/admin/pages/home" },
      { title: "All Pages", url: "/admin/pages" },
      { title: "Settings", url: "/admin/settings" },
    ],
  },
  {
    title: "Listings",
    url: "/admin/listings",
    icon: ShoppingBag,
    items: [
      { title: "All Ads", url: "/admin/listings" },
      { title: "Create Ad", url: "/listings/create" },
    ],
  },
  {
    title: "Sellers",
    url: "/admin/vendors",
    icon: Store,
    items: [
      { title: "Verified Sellers", url: "/admin/vendors" },
      { title: "Performance", url: "/admin/vendors" },
    ],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    items: [
      { title: "All Accounts", url: "/admin/users" },
      { title: "Access Rights", url: "/admin/users" },
    ],
  },
];

const NAV_SECONDARY = [
  { title: "Activity Log", url: "/admin", icon: History },
  { title: "Security", url: "/admin", icon: Lock },
  { title: "Disputes", url: "/admin", icon: AlertTriangle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/20 bg-secondary text-white">
      <SidebarHeader className="p-4 bg-secondary">
        <Link href="/" className="flex items-center gap-3 group px-1">
          <div className="relative h-10 w-10 overflow-hidden rounded-[var(--radius)] border border-primary/30 shrink-0">
            <Image 
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1774057903/ai-removebg-preview_ikywpe.png" 
              alt="Logo" 
              fill 
              className="object-cover"
            />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col overflow-hidden">
               <span className="font-black text-sm uppercase tracking-tighter text-white truncate">
                  Admin <span className="text-primary">Panel</span>
               </span>
               <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em] truncate">Marketplace Backend</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="bg-secondary px-2 py-4">
        <SidebarMenu>
          {NAV_MAIN.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                className={pathname.startsWith(item.url) ? "bg-primary text-secondary" : "hover:bg-primary/10 text-white/70 hover:text-white"}
                asChild
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 ${pathname.startsWith(item.url) ? 'text-secondary' : 'text-primary'}`} />
                  <span className="font-black text-[10px] uppercase tracking-widest">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items && state !== "collapsed" && (
                <SidebarMenuSub className="border-l border-primary/20 ml-5 mt-1 space-y-1">
                  {item.items.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton 
                        asChild 
                        className={pathname === sub.url ? "text-primary font-black" : "text-white/40 hover:text-white"}
                      >
                        <Link href={sub.url} className="text-[9px] uppercase tracking-widest font-bold flex items-center justify-between group/sub">
                          {sub.title}
                          <ChevronRight className="h-2 w-2 opacity-0 group-hover/sub:opacity-100 transition-all text-primary" />
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-8 px-4 py-2">
           <p className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-4">Monitoring</p>
           <SidebarMenu>
              {NAV_SECONDARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton 
                    tooltip={item.title}
                    className="hover:bg-primary/5 text-white/50 hover:text-white"
                    asChild
                   >
                     <Link href={item.url} className="flex items-center gap-3">
                       <item.icon className="h-3.5 w-3.5 text-primary" />
                       <span className="text-[9px] font-black uppercase tracking-widest">{item.title}</span>
                     </Link>
                   </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
           </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 bg-secondary">
         <div className="space-y-4">
           {state !== "collapsed" && (
              <div className="bg-white/5 p-3 border border-white/10 rounded-none mb-4">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-white/50 tracking-widest">Admin Online</span>
                 </div>
                 <p className="text-[7px] font-bold text-white/30 uppercase leading-relaxed">High-level access enabled for marketplace management.</p>
              </div>
           )}
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-primary/10 text-white/70 hover:text-white" asChild>
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-primary/10 text-white/70 hover:text-white" asChild>
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">My Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-red-500 hover:bg-red-500/10 hover:text-red-500" asChild>
                   <Link href="/" className="flex items-center gap-3">
                     <LogOut className="h-4 w-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Exit Panel</span>
                   </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
