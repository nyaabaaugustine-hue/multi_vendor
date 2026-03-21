
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity, Zap } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prototype Route Guard: Only High Admins can authorize this node
    if (user && user.role !== 'HIGH_ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'HIGH_ADMIN') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-secondary text-white">
        <div className="text-center space-y-4">
          <Zap className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Authorizing Node...</h2>
        </div>
      </div>
    );
  }

  // Simple Breadcrumb logic based on pathname
  const pathParts = pathname.split('/').filter(p => p !== '');
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6 bg-white sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="h-4 w-4 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Command Node: GHS-Accra</span>
                   <Badge variant="outline" className="rounded-none text-[8px] font-black border-primary/20 bg-primary/5 text-primary">Sovereign Protocol v1.2</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 pr-4 border-r border-dashed">
                  <Activity className="h-3.5 w-3.5 text-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Network Health: 99.8%</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-secondary leading-none uppercase">{user.name}</p>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-tighter mt-1">Super User</p>
                  </div>
               </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20 no-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Minimal Breadcrumb components as they might not be in UI folder yet
function BreadcrumbPlaceholder() {
  return null;
}
