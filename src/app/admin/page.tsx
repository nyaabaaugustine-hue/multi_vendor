
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingBag, 
  ShieldAlert, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck,
  Lock,
  Globe,
  Activity,
  Edit3,
  Layout,
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  FileText,
  Key,
  AlertTriangle,
  Server,
  Zap,
  Fingerprint
} from "lucide-react";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { VENDORS, LISTINGS } from "@/lib/mock-data";
import { useCurrency } from "@/components/providers";
import { cn } from "@/lib/utils";

const chartData = [
  { month: "Jan", volume: 450000 },
  { month: "Feb", volume: 620000 },
  { month: "Mar", volume: 580000 },
  { month: "Apr", volume: 890000 },
  { month: "May", volume: 1200000 },
  { month: "Jun", volume: 1450000 },
];

const chartConfig = {
  volume: {
    label: "Total Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const stats = [
    { label: "Total Sales", val: "GH₵4.2M", icon: TrendingUp, change: "+12.4%", status: "up" },
    { label: "Active Orders", val: "142", icon: Lock, change: "+5", status: "up" },
    { label: "Partner Sellers", val: VENDORS.length.toString(), icon: ShieldCheck, change: "Stable", status: "neutral" },
    { label: "Total Users", val: "1,248", icon: Users, change: "+24", status: "up" },
  ];

  const approvalQueue = [
    { id: 'TX-9912', title: 'Industrial Generator Set', price: 125000, vendor: 'Melcom Digital Hub', date: '2h ago' },
    { id: 'TX-9915', title: 'Plot - Airport Residential', price: 450000, vendor: 'PrimeEstate GH', date: '5h ago' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 bg-background/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">Admin Dashboard</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">ACCRA HUB • MASTER CONTROL</p>
        </div>
        <div className="flex items-center gap-4">
           <Badge className="bg-primary text-primary-foreground rounded-none font-black text-[10px] px-5 h-10 uppercase tracking-widest shadow-2xl">ADMIN AUTHORIZED</Badge>
           <div className="bg-card border-2 border-primary/20 px-4 h-10 rounded-none flex items-center gap-3 shadow-xl">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-foreground uppercase tracking-widest">System Online</span>
           </div>
        </div>
      </div>

      {/* High-Value Approvals */}
      <Card className="rounded-none border-t-4 border-t-destructive shadow-2xl bg-card overflow-hidden">
        <CardHeader className="bg-destructive/5 border-b p-8">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 bg-destructive/10 flex items-center justify-center text-destructive">
                <Key className="h-8 w-8" />
             </div>
             <div>
               <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tighter">High-Value Approvals</CardTitle>
               <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-muted-foreground">Orders over GH₵50,000 require admin approval.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-dashed border-b border-dashed">
            {approvalQueue.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-muted/20 transition-colors gap-8">
                <div className="flex gap-8 items-center flex-1">
                   <div className="h-16 w-16 bg-muted relative rounded-none shrink-0 border-2 border-destructive/20 flex items-center justify-center">
                      <Fingerprint className="h-8 w-8 text-destructive opacity-40" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-destructive uppercase tracking-widest">PENDING APPROVAL</p>
                        <span className="text-[9px] text-muted-foreground font-black uppercase">{item.date}</span>
                      </div>
                      <h4 className="font-black text-foreground uppercase text-xl leading-none tracking-tight">{item.title}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seller: {item.vendor} • ID: {item.id}</p>
                   </div>
                </div>
                <div className="text-right flex items-center gap-10 w-full md:w-auto">
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Locked Funds</p>
                      <p className="text-3xl font-black text-destructive tracking-tighter">{formatPrice(item.price)}</p>
                   </div>
                   <Button className="h-16 px-12 bg-foreground text-background font-black uppercase text-[11px] tracking-[0.3em] rounded-none shadow-2xl gap-4 hover:bg-primary hover:text-primary-foreground transition-all">
                      RELEASE PAYMENT <Zap className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main CMS & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="rounded-none border-4 border-primary shadow-2xl bg-foreground text-background overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 pointer-events-none">
            <Layout className="h-48 w-48 text-primary opacity-5 group-hover:opacity-10 transition-opacity" />
          </div>
          <CardContent className="p-12 space-y-10 relative z-10">
             <div className="space-y-4">
                <Badge className="bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase tracking-[0.4em] px-4">Content Management</Badge>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Website Editor</h2>
                <p className="text-xs font-medium text-background/60 uppercase tracking-widest max-w-md leading-relaxed">
                  Edit homepage content, banners, and featured categories.
                </p>
             </div>
             <Link href="/admin/pages/home" className="block">
               <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-background hover:text-foreground font-black rounded-none h-16 px-14 uppercase text-[12px] tracking-[0.3em] gap-4 shadow-2xl">
                  <Edit3 className="h-5 w-5" />
                  Edit Website
               </Button>
             </Link>
          </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-primary/20 shadow-2xl bg-card overflow-hidden relative group">
          <CardContent className="p-12 space-y-10 relative z-10">
             <div className="space-y-4">
                <Badge variant="outline" className="border-primary/40 text-primary rounded-none font-black text-[9px] uppercase tracking-[0.4em] px-4 bg-primary/5">Global Settings</Badge>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">App Settings</h2>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest max-w-md leading-relaxed">
                  Manage fees, delivery windows, and seller support contact details.
                </p>
             </div>
             <Link href="/admin/settings" className="block">
               <Button variant="outline" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-black rounded-none h-16 px-14 uppercase text-[12px] tracking-[0.3em] gap-4 shadow-2xl">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
               </Button>
             </Link>
          </CardContent>
        </Card>
      </div>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-none border-2 border-border shadow-sm bg-card border-l-4 border-l-primary group hover:border-l-destructive transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-muted p-4 group-hover:bg-primary/5 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge className={cn("rounded-none text-[9px] font-black tracking-widest border-none px-3 py-1", stat.status === 'up' ? 'bg-green-100/10 text-green-500' : 'bg-muted text-muted-foreground')}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-foreground tracking-tighter">{stat.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-none border-2 shadow-sm bg-card">
          <CardHeader className="p-8 border-b border-dashed">
            <CardTitle className="text-base font-black uppercase tracking-widest flex items-center gap-3 text-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Total Sales Volume
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Total funds flowing through the marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(var(--muted-foreground))" }} 
                  className="uppercase tracking-widest"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(val) => `GH₵${val / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fill="url(#fillVolume)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-10">
          <Card className="rounded-none border-2 shadow-sm bg-card">
            <CardHeader className="p-8 border-b border-dashed">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { type: 'DELIVERY LATE', text: 'Order 8815 past 48h', status: 'destructive' },
                { type: 'PENDING APPROVAL', text: 'GH₵450k order waiting', status: 'warning' },
                { type: 'NEW SELLER', text: 'PrimeRentals joined today', status: 'success' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-5 p-5 bg-muted/20 border-l-4 border-l-border hover:border-l-primary transition-all cursor-pointer group">
                  <div className={cn(
                    "h-3 w-3 rounded-full mt-1 shrink-0 animate-pulse",
                    alert.status === 'destructive' ? 'bg-destructive' : alert.status === 'warning' ? 'bg-primary' : 'bg-green-500'
                  )} />
                  <div>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest mb-1",
                      alert.status === 'destructive' ? 'text-destructive' : 'text-primary'
                    )}>{alert.type}</p>
                    <p className="text-[10px] font-bold text-foreground uppercase leading-snug">{alert.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 shadow-sm bg-card border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="p-8 bg-primary/5 border-b border-dashed">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                <Database className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
               <Link href="/admin/pages" className="flex items-center justify-between p-5 bg-muted/20 hover:bg-primary/10 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Edit Pages</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
               </Link>
               <Link href="/dashboard" className="flex items-center justify-between p-5 bg-muted/20 hover:bg-primary/10 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Vendor Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
               </Link>
               <Link href="/listings" className="flex items-center justify-between p-5 bg-muted/20 hover:bg-primary/10 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Marketplace Registry</span>
                  <ChevronRight className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
               </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
