"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Shield, ShieldCheck, CheckCircle2, Wallet, Users, LogOut, Truck,
  Activity, Lock, TrendingUp, ShoppingBag, Home, AlertTriangle,
  Timer, Bell, Star, Package, Eye, Plus, Settings, Tag,
  AlertCircle, ArrowUpRight, RefreshCw, Zap, TrendingDown,
  DollarSign, BarChart2, Award, ChevronUp, ChevronDown,
  Filter, Download, CreditCard, Banknote, MessageSquare,
  Search, UserCheck, Ban, Edit, FileText, CheckCircle,
  XCircle, Clock, MoreHorizontal, PieChart, Target, Inbox,
  Send, Receipt, Key, Briefcase, BarChart3,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart,
  Pie, PieChart as RePieChart,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useAuth, useCurrency } from '@/components/providers';
import {
  MOCK_ORDERS, MOCK_TRANSACTIONS, MOCK_NOTIFICATIONS, MOCK_OFFERS,
  MOCK_DISPUTES, VENDOR_MONTHLY_DATA, PLATFORM_MONTHLY_DATA,
  LISTINGS, VENDORS, getFidelityTier, computeFidelityScore,
  formatGHS, type Order, type Transaction, type Notification, type Offer,
} from '@/lib/mock-data';

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, trend, trendValue, accent = false, color = '' }: {
  label: string; value: string; sub: string; icon: any;
  trend?: 'up' | 'down' | 'neutral'; trendValue?: string;
  accent?: boolean; color?: string;
}) {
  return (
    <Card className={cn('rounded-none border-l-4 shadow-sm hover:shadow-xl transition-all duration-300 group', accent ? 'bg-primary border-l-white/30' : `border-l-primary ${color}`)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2.5 rounded-none', accent ? 'bg-white/10' : 'bg-muted group-hover:bg-primary/10')}>
            <Icon className={cn('h-5 w-5', accent ? 'text-primary-foreground' : 'text-primary')} />
          </div>
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1',
              trend === 'up' ? 'bg-green-100 text-green-600' : trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground')}>
              {trend === 'up' ? <ChevronUp className="h-3 w-3" /> : trend === 'down' ? <ChevronDown className="h-3 w-3" /> : null}
              {trendValue}
            </div>
          )}
        </div>
        <p className={cn('text-[9px] font-black uppercase tracking-[0.3em] mb-0.5', accent ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{label}</p>
        <p className={cn('text-2xl font-black tracking-tighter', accent ? 'text-primary-foreground' : 'text-foreground')}>{value}</p>
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mt-0.5', accent ? 'text-primary-foreground/60' : 'text-muted-foreground')}>{sub}</p>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, action }: { icon: any; title: string; action?: { label: string; onClick?: () => void; href?: string } }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3 border-l-4 border-primary pl-3">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-base font-black uppercase tracking-widest text-foreground">{title}</h2>
      </div>
      {action && (
        action.href ? (
          <Link href={action.href} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline group">
            {action.label} <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        ) : (
          <button onClick={action.onClick} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline group">
            {action.label} <ArrowUpRight className="h-3 w-3" />
          </button>
        )
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Escrow Funded':   'bg-blue-100 text-blue-700 border-blue-200',
    'In Transit':      'bg-amber-100 text-amber-700 border-amber-200',
    'Inspection':      'bg-orange-100 text-orange-700 border-orange-200',
    'Completed':       'bg-green-100 text-green-700 border-green-200',
    'Disputed':        'bg-red-100 text-red-700 border-red-200',
    'Refunded':        'bg-slate-100 text-slate-600 border-slate-200',
    'Pending Payment': 'bg-purple-100 text-purple-700 border-purple-200',
    'Open':            'bg-red-100 text-red-700 border-red-200',
    'Under Review':    'bg-amber-100 text-amber-700 border-amber-200',
    'Resolved':        'bg-green-100 text-green-700 border-green-200',
    'Active':          'bg-green-100 text-green-700 border-green-200',
    'Suspended':       'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <Badge className={cn('rounded-none border font-black text-[8px] uppercase tracking-widest px-2 py-0.5', map[status] ?? 'bg-muted text-muted-foreground border-border')}>
      {status}
    </Badge>
  );
}

const CHART_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorSearch, setVendorSearch] = useState('');

  const totalGMV = PLATFORM_MONTHLY_DATA.reduce((s, d) => s + d.gmv, 0);
  const totalCommission = PLATFORM_MONTHLY_DATA.reduce((s, d) => s + d.commission, 0);
  const activeEscrow = MOCK_ORDERS.filter(o => ['Escrow Funded', 'In Transit', 'Inspection'].includes(o.status)).reduce((s, o) => s + o.amount, 0);
  const openDisputes = MOCK_DISPUTES.filter(d => d.status === 'Open' || d.status === 'Under Review').length;

  const categoryData = [
    { name: 'Electronics', value: 42 },
    { name: 'Vehicles',    value: 28 },
    { name: 'Property',    value: 18 },
    { name: 'Agriculture', value: 8  },
    { name: 'Fashion',     value: 4  },
  ];

  const filteredVendors = VENDORS.filter(v =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      {/* Tab Nav */}
      <div className="overflow-x-auto no-scrollbar">
        <TabsList className="bg-muted/50 rounded-none h-10 gap-0 p-0 border border-border w-max min-w-full">
          {[
            { id: 'overview',    label: 'Overview',      icon: Activity     },
            { id: 'escrow',      label: 'Escrow Control',icon: Lock         },
            { id: 'disputes',    label: 'Disputes',      icon: AlertTriangle},
            { id: 'vendors',     label: 'Vendors',       icon: Users        },
            { id: 'workers',     label: 'Workers',       icon: Briefcase    },
            { id: 'analytics',   label: 'Analytics',     icon: BarChart2    },
            { id: 'payments',    label: 'Payments',      icon: CreditCard   },
            { id: 'settings',    label: 'Settings',      icon: Settings     },
          ].map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="rounded-none text-[9px] font-black uppercase tracking-widest px-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 border-r border-border last:border-r-0">
              <Icon className="h-3 w-3" />{label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ── OVERVIEW ── */}
      <TabsContent value="overview" className="space-y-8 mt-0">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total GMV" value={formatGHS(totalGMV)} sub="All-time gross volume" icon={DollarSign} trend="up" trendValue="+28% MoM" accent />
          <StatCard label="Active Escrow" value={formatGHS(activeEscrow)} sub="Funds currently locked" icon={Lock} trend="up" trendValue="+12%" />
          <StatCard label="Platform Revenue" value={formatGHS(totalCommission)} sub="Commission earned" icon={TrendingUp} trend="up" trendValue="+18%" />
          <StatCard label="Open Disputes" value={String(openDisputes)} sub="Needs attention" icon={AlertTriangle} trend={openDisputes > 2 ? 'down' : 'neutral'} trendValue={openDisputes > 2 ? 'High' : 'Normal'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GMV Chart */}
          <Card className="rounded-none lg:col-span-2">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Monthly GMV vs Commission</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={PLATFORM_MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 800 }} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`GH₵${Number(v).toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="gmv" stroke="#2563eb" fill="url(#gmvGrad)" strokeWidth={2} name="GMV" />
                  <Area type="monotone" dataKey="commission" stroke="#16a34a" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Commission" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category breakdown */}
          <Card className="rounded-none">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">GMV by Category</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-4">
              <ResponsiveContainer width="100%" height={160}>
                <RePieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false} style={{ fontSize: 8 }}>
                    {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-[9px] font-black uppercase">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-none" style={{ background: CHART_COLORS[i] }} />
                      <span className="text-muted-foreground">{c.name}</span>
                    </div>
                    <span>{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live activity feed */}
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5 flex-row items-center justify-between">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Live Activity Feed</CardTitle>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-green-600 uppercase">Live</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {MOCK_TRANSACTIONS.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-dashed border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn('h-7 w-7 flex items-center justify-center rounded-none',
                    tx.type === 'escrow_hold' ? 'bg-blue-100' : tx.type === 'escrow_release' ? 'bg-green-100' : tx.type === 'fee' ? 'bg-purple-100' : 'bg-amber-100')}>
                    {tx.type === 'escrow_hold' && <Lock className="h-3.5 w-3.5 text-blue-600" />}
                    {tx.type === 'escrow_release' && <Zap className="h-3.5 w-3.5 text-green-600" />}
                    {tx.type === 'fee' && <DollarSign className="h-3.5 w-3.5 text-purple-600" />}
                    {tx.type === 'payment_in' && <CreditCard className="h-3.5 w-3.5 text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{tx.description}</p>
                    <p className="text-[9px] text-muted-foreground font-black">{tx.date} · {tx.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-black text-foreground">{formatGHS(tx.amount)}</p>
                  <StatusBadge status={tx.status === 'completed' ? 'Completed' : tx.status === 'pending' ? 'Pending Payment' : 'Disputed'} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── ESCROW CONTROL ── */}
      <TabsContent value="escrow" className="space-y-6 mt-0">
        <SectionTitle icon={Lock} title="Escrow Control Centre" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Funded" value={String(MOCK_ORDERS.filter(o => o.status === 'Escrow Funded').length)} sub="Awaiting dispatch" icon={Lock} />
          <StatCard label="In Transit" value={String(MOCK_ORDERS.filter(o => o.status === 'In Transit').length)} sub="Dispatched" icon={Truck} />
          <StatCard label="Inspection" value={String(MOCK_ORDERS.filter(o => o.status === 'Inspection').length)} sub="Buyer reviewing" icon={Eye} />
          <StatCard label="Completed" value={String(MOCK_ORDERS.filter(o => o.status === 'Completed').length)} sub="Released" icon={CheckCircle2} accent />
        </div>
        <Card className="rounded-none">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Order ID', 'Item', 'Buyer', 'Seller', 'Amount', 'Status', 'SLA', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map(order => (
                  <tr key={order.id} className="border-b border-dashed border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-black text-primary">{order.id}</td>
                    <td className="px-4 py-3 text-[10px] font-black text-foreground max-w-[140px] truncate uppercase">{order.listingTitle}</td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground font-black uppercase">Buyer #{order.buyerId}</td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground font-black uppercase">{order.sellerName}</td>
                    <td className="px-4 py-3 text-[11px] font-black text-foreground">{formatGHS(order.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[9px] font-black uppercase', order.slaExpired ? 'text-red-500' : 'text-green-600')}>{order.slaTimer}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 px-2 bg-green-600 text-white rounded-none text-[8px] font-black uppercase hover:bg-green-700">Release</Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 rounded-none text-[8px] font-black uppercase border-red-200 text-red-600 hover:bg-red-50">Freeze</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── DISPUTES ── */}
      <TabsContent value="disputes" className="space-y-6 mt-0">
        <SectionTitle icon={AlertTriangle} title="Disputes & Mediation" />
        {MOCK_DISPUTES.map(dispute => (
          <Card key={dispute.id} className="rounded-none border-l-4 border-l-red-500">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[12px] font-black text-foreground uppercase">{dispute.id} — Order {dispute.orderId}</p>
                    <StatusBadge status={dispute.status} />
                    <Badge className="bg-red-100 text-red-700 rounded-none border-none text-[8px] font-black uppercase">URGENT</Badge>
                  </div>
                  <p className="text-[11px] font-black text-primary uppercase">{dispute.reason}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{dispute.description}</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Raised by: {dispute.raisedBy} · {dispute.createdAt.split('T')[0]}</p>
                </div>
              </div>
              {/* AI Decision Assistant */}
              <div className="bg-primary/5 border border-primary/20 p-3 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5"><Zap className="h-3 w-3" /> AI Mediation Suggestion</p>
                <p className="text-[10px] text-foreground">Based on the evidence: <strong>Item was not as described</strong>. Recommend issuing a full refund to the buyer. Seller fidelity score will be adjusted.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="h-9 px-4 bg-green-600 text-white rounded-none text-[9px] font-black uppercase gap-1.5 hover:bg-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> Refund Buyer</Button>
                <Button size="sm" className="h-9 px-4 bg-primary text-primary-foreground rounded-none text-[9px] font-black uppercase gap-1.5"><Zap className="h-3.5 w-3.5" /> Release to Vendor</Button>
                <Button size="sm" variant="outline" className="h-9 px-4 rounded-none text-[9px] font-black uppercase gap-1.5 border-2"><BarChart2 className="h-3.5 w-3.5" /> Partial Split</Button>
                <Button size="sm" variant="outline" className="h-9 px-4 rounded-none text-[9px] font-black uppercase gap-1.5 border-2"><MessageSquare className="h-3.5 w-3.5" /> Chat Thread</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {MOCK_DISPUTES.length === 0 && (
          <div className="text-center py-16 border border-dashed rounded-none">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No open disputes</p>
          </div>
        )}
      </TabsContent>

      {/* ── VENDORS ── */}
      <TabsContent value="vendors" className="space-y-6 mt-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionTitle icon={Users} title="Vendor Management" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-9 h-9 rounded-none text-[10px] w-56" value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} />
          </div>
        </div>
        <Card className="rounded-none">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Vendor', 'Category', 'Fidelity', 'Revenue', 'Orders', 'Disputes', 'Commission', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="border-b border-dashed border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-black text-foreground uppercase">{vendor.name}</p>
                      <p className="text-[9px] text-muted-foreground">Since {vendor.joinedYear}</p>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase">{vendor.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Progress value={vendor.fidelityScore} className="h-1.5 w-16 rounded-none" />
                        <span className="text-[10px] font-black">{vendor.fidelityScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-black">{formatGHS(vendor.monthlyRevenue)}</td>
                    <td className="px-4 py-3 text-[11px] font-black">{vendor.totalOrders}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-black', vendor.disputeRate > 1 ? 'text-red-500' : 'text-green-600')}>{vendor.disputeRate}%</span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-black text-primary">{vendor.commissionRate}%</td>
                    <td className="px-4 py-3"><StatusBadge status="Active" /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 rounded-none text-[8px] font-black uppercase border-amber-200 text-amber-600 hover:bg-amber-50">Suspend</Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 rounded-none text-[8px] font-black uppercase">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── WORKER ACCOUNTS ── */}
      <TabsContent value="workers" className="space-y-6 mt-0">
        <SectionTitle icon={Briefcase} title="Worker Accounts" action={{ label: 'Create Worker', onClick: () => {} }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: 'Finance Officer', desc: 'Handles payouts and reconciliation', permissions: ['View transactions', 'Approve payouts', 'Export reports'], color: 'border-l-green-500' },
            { role: 'Dispute Manager', desc: 'Mediates buyer-seller conflicts', permissions: ['View disputes', 'Issue verdicts', 'Chat with parties'], color: 'border-l-amber-500' },
            { role: 'Moderator', desc: 'Reviews and approves listings', permissions: ['View listings', 'Approve/reject', 'Flag suspicious items'], color: 'border-l-purple-500' },
          ].map(worker => (
            <Card key={worker.role} className={cn('rounded-none border-l-4', worker.color)}>
              <CardContent className="p-5 space-y-3">
                <div>
                  <p className="text-[13px] font-black uppercase tracking-tight text-foreground">{worker.role}</p>
                  <p className="text-[10px] text-muted-foreground">{worker.desc}</p>
                </div>
                <div className="space-y-1">
                  {worker.permissions.map(p => (
                    <div key={p} className="flex items-center gap-2 text-[9px] font-black uppercase text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-primary" /> {p}
                    </div>
                  ))}
                </div>
                <Button className="w-full h-9 bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase tracking-widest gap-1.5 mt-2">
                  <Plus className="h-3 w-3" /> Assign Worker
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* ── ANALYTICS ── */}
      <TabsContent value="analytics" className="space-y-6 mt-0">
        <SectionTitle icon={BarChart2} title="Platform Analytics" action={{ label: 'Export CSV', onClick: () => {} }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Escrow Conv. Rate" value="78%" sub="Listings → purchases" icon={Target} trend="up" trendValue="+5%" />
          <StatCard label="Avg Order Value" value={formatGHS(totalGMV / Math.max(1, PLATFORM_MONTHLY_DATA.reduce((s,d) => s + d.users, 0)))} sub="Per transaction" icon={DollarSign} />
          <StatCard label="Active Users" value={String(PLATFORM_MONTHLY_DATA[PLATFORM_MONTHLY_DATA.length-1].users)} sub="This month" icon={Users} trend="up" trendValue="+18%" />
          <StatCard label="Dispute Rate" value="1.2%" sub="Platform average" icon={AlertTriangle} trend="down" trendValue="-0.3%" />
        </div>
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Revenue & User Growth</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={PLATFORM_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 800 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="commission" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} name="Users" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── PAYMENTS ── */}
      <TabsContent value="payments" className="space-y-6 mt-0">
        <SectionTitle icon={CreditCard} title="Paystack Payment Logs" action={{ label: 'Reconcile', onClick: () => {} }} />
        <Card className="rounded-none">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Ref', 'Order', 'Type', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="border-b border-dashed border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-3 text-[9px] font-mono text-primary">{tx.reference}</td>
                    <td className="px-4 py-3 text-[10px] font-black uppercase">{tx.orderId}</td>
                    <td className="px-4 py-3"><Badge className="rounded-none border-none font-black text-[8px] uppercase bg-muted text-muted-foreground">{tx.type.replace(/_/g, ' ')}</Badge></td>
                    <td className="px-4 py-3 text-[11px] font-black">{formatGHS(tx.amount)}</td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground font-black">{tx.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={tx.status === 'completed' ? 'Completed' : tx.status === 'pending' ? 'Pending Payment' : 'Disputed'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── SETTINGS ── */}
      <TabsContent value="settings" className="space-y-6 mt-0">
        <SectionTitle icon={Settings} title="System Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Platform Commission Rate', value: '2.5%', desc: 'Applied to all transactions' },
            { label: 'Dispatch SLA Window', value: '48 Hours', desc: 'Time allowed for seller to dispatch' },
            { label: 'High-Value Approval Threshold', value: 'GH₵50,000', desc: 'Orders above this require admin approval' },
            { label: 'Auto-Refund Trigger', value: '48h No Dispatch', desc: 'Automatic refund if seller misses SLA' },
          ].map(s => (
            <Card key={s.label} className="rounded-none border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase text-foreground">{s.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-primary">{s.value}</p>
                  <Button size="sm" variant="outline" className="h-6 px-2 rounded-none text-[8px] font-black uppercase mt-1 border">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── VENDOR DASHBOARD ─────────────────────────────────────────────────────────

function VendorDashboard() {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');

  const myListings = LISTINGS.filter(l => l.vendorId === 'v1').slice(0, 5);
  const totalRevenue = VENDOR_MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const lockedFunds = MOCK_ORDERS.filter(o => ['Escrow Funded', 'In Transit'].includes(o.status) && o.vendorId === 'v1').reduce((s, o) => s + o.netPayout, 0);
  const pendingDispatch = MOCK_ORDERS.filter(o => o.status === 'Escrow Funded' && o.vendorId === 'v1');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="overflow-x-auto no-scrollbar">
        <TabsList className="bg-muted/50 rounded-none h-10 gap-0 p-0 border border-border w-max min-w-full">
          {[
            { id: 'overview',  label: 'Overview',  icon: Activity   },
            { id: 'orders',    label: 'Orders',    icon: Package    },
            { id: 'escrow',    label: 'Escrow',    icon: Lock       },
            { id: 'listings',  label: 'Listings',  icon: Tag        },
            { id: 'analytics', label: 'Analytics', icon: BarChart2  },
            { id: 'wallet',    label: 'Wallet',    icon: Wallet     },
            { id: 'reviews',   label: 'Reviews',   icon: Star       },
            { id: 'workers',   label: 'Workers',   icon: Briefcase  },
          ].map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="rounded-none text-[9px] font-black uppercase tracking-widest px-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 border-r border-border last:border-r-0">
              <Icon className="h-3 w-3" />{label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ── OVERVIEW ── */}
      <TabsContent value="overview" className="space-y-6 mt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={formatGHS(totalRevenue)} sub="All-time earnings" icon={DollarSign} trend="up" trendValue="+22%" accent />
          <StatCard label="Locked in Escrow" value={formatGHS(lockedFunds)} sub="Pending release" icon={Lock} trend="neutral" trendValue="Held" />
          <StatCard label="Pending Dispatch" value={String(pendingDispatch.length)} sub="Must ship within 48h" icon={Timer} trend={pendingDispatch.length > 0 ? 'down' : 'neutral'} trendValue={pendingDispatch.length > 0 ? 'Action needed' : 'All clear'} />
          <StatCard label="Vendor Rating" value="4.9" sub="Out of 5.0" icon={Star} trend="up" trendValue="+0.1" />
        </div>

        {/* Revenue chart */}
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Monthly Revenue & Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={VENDOR_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 800 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`GH₵${Number(v).toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[0, 0, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top listings performance */}
        <SectionTitle icon={Tag} title="Top Listings Performance" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.slice(0, 3).map(listing => (
            <Card key={listing.id} className="rounded-none border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-black uppercase tracking-tight text-foreground leading-tight">{listing.title}</p>
                  {listing.isBoosted && <Badge className="bg-primary/10 text-primary rounded-none border-none text-[7px] font-black uppercase shrink-0">{listing.boostTier}</Badge>}
                </div>
                <p className="text-[14px] font-black text-primary">{formatGHS(listing.price)}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-[9px] text-muted-foreground font-black uppercase">Views</p><p className="text-[12px] font-black">{listing.viewCount ?? 0}</p></div>
                  <div><p className="text-[9px] text-muted-foreground font-black uppercase">Saved</p><p className="text-[12px] font-black">{listing.saveCount ?? 0}</p></div>
                  <div><p className="text-[9px] text-muted-foreground font-black uppercase">Leads</p><p className="text-[12px] font-black">{listing.inquiryCount ?? 0}</p></div>
                </div>
                <Progress value={((listing.viewCount ?? 0) / 2000) * 100} className="h-1 rounded-none" />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* ── ORDERS ── */}
      <TabsContent value="orders" className="space-y-4 mt-0">
        <SectionTitle icon={Package} title="Order Execution" />
        {MOCK_ORDERS.map(order => (
          <Card key={order.id} className={cn('rounded-none border-l-4', order.slaExpired ? 'border-l-red-500' : 'border-l-primary')}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[12px] font-black text-foreground uppercase">{order.id}</p>
                    <StatusBadge status={order.status} />
                    {order.slaExpired && <Badge className="bg-red-100 text-red-700 rounded-none border-none text-[8px] font-black uppercase">SLA BREACHED</Badge>}
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">{order.listingTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-foreground">{formatGHS(order.amount)}</p>
                  <p className="text-[9px] text-muted-foreground font-black">Net: {formatGHS(order.netPayout)}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground">
                  <span>Escrow Progress</span><span>{order.escrowProgress}%</span>
                </div>
                <Progress value={order.escrowProgress} className="h-2 rounded-none" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[9px] font-black uppercase text-muted-foreground">
                <div><p className="text-[8px] text-muted-foreground/60">Buyer</p><p>#{order.buyerId}</p></div>
                <div><p className="text-[8px] text-muted-foreground/60">Tracking</p><p>{order.trackingCode ?? 'Not set'}</p></div>
                <div><p className="text-[8px] text-muted-foreground/60">Dispatch SLA</p><p className={order.slaExpired ? 'text-red-500' : 'text-green-600'}>{order.slaTimer}</p></div>
                <div><p className="text-[8px] text-muted-foreground/60">Method</p><p>{order.deliveryMethod ?? 'TBD'}</p></div>
              </div>

              {order.status === 'Escrow Funded' && (
                <div className="flex gap-2 pt-2 border-t border-dashed">
                  <Button size="sm" className="h-9 px-4 bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase gap-1.5">
                    <Truck className="h-3.5 w-3.5" /> Mark Dispatched
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 px-4 rounded-none font-black text-[9px] uppercase gap-1.5 border-2">
                    <FileText className="h-3.5 w-3.5" /> Add Tracking Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      {/* ── ESCROW STATUS ── */}
      <TabsContent value="escrow" className="space-y-6 mt-0">
        <SectionTitle icon={Lock} title="Escrow Status" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Locked Funds" value={formatGHS(lockedFunds)} sub="Awaiting release" icon={Lock} />
          <StatCard label="Pending Approval" value={String(MOCK_ORDERS.filter(o => o.status === 'Inspection').length)} sub="Buyer reviewing" icon={Eye} />
          <StatCard label="Disputed" value={String(MOCK_DISPUTES.length)} sub="In mediation" icon={AlertTriangle} />
        </div>
        {/* Cash flow projection */}
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Expected Releases (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {MOCK_ORDERS.filter(o => ['Inspection', 'In Transit'].includes(o.status)).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-dashed border-border/50 last:border-0">
                <div>
                  <p className="text-[11px] font-black uppercase text-foreground">{order.id} — {order.listingTitle.substring(0, 30)}...</p>
                  <p className="text-[9px] text-muted-foreground">Expected: 1–3 business days</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-black text-green-600">{formatGHS(order.netPayout)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── LISTINGS ── */}
      <TabsContent value="listings" className="space-y-4 mt-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <SectionTitle icon={Tag} title="Listings Management" />
          <Button className="h-9 px-4 bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Listing
          </Button>
        </div>
        <Card className="rounded-none">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Title', 'Price', 'Category', 'Condition', 'Views', 'Saves', 'Boost', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myListings.map(listing => (
                  <tr key={listing.id} className="border-b border-dashed border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-3 text-[10px] font-black uppercase max-w-[160px] truncate">{listing.title}</td>
                    <td className="px-4 py-3 text-[11px] font-black text-primary">{formatGHS(listing.price)}</td>
                    <td className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase">{listing.subcategory ?? listing.category}</td>
                    <td className="px-4 py-3 text-[9px] font-black uppercase">{listing.condition ?? '—'}</td>
                    <td className="px-4 py-3 text-[11px] font-black">{listing.viewCount ?? 0}</td>
                    <td className="px-4 py-3 text-[11px] font-black">{listing.saveCount ?? 0}</td>
                    <td className="px-4 py-3">{listing.boostTier ? <Badge className="bg-primary/10 text-primary rounded-none border-none text-[8px] font-black uppercase">{listing.boostTier}</Badge> : <span className="text-[9px] text-muted-foreground">None</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={listing.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 rounded-none text-[8px] font-black uppercase gap-1"><Edit className="h-2.5 w-2.5" />Edit</Button>
                        <Button size="sm" className="h-7 px-2 bg-primary text-primary-foreground rounded-none text-[8px] font-black uppercase gap-1"><Zap className="h-2.5 w-2.5" />Boost</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── ANALYTICS ── */}
      <TabsContent value="analytics" className="space-y-6 mt-0">
        <SectionTitle icon={BarChart2} title="Vendor Analytics" />
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Revenue · Orders · Disputes (6 months)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={VENDOR_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 800 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `₵${(v/1000).toFixed(0)}k`} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue (GH₵)" />
                <Bar dataKey="orders" fill="#16a34a" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-none p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Best Category</p>
            <p className="text-[18px] font-black text-foreground">Electronics</p>
            <p className="text-[10px] text-green-600 font-black mt-1">You earn 3x more here than Fashion</p>
          </Card>
          <Card className="rounded-none p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Response Rate</p>
            <p className="text-[18px] font-black text-foreground">97%</p>
            <p className="text-[10px] text-primary font-black mt-1">Top 5% of all vendors</p>
          </Card>
        </div>
      </TabsContent>

      {/* ── WALLET ── */}
      <TabsContent value="wallet" className="space-y-6 mt-0">
        <SectionTitle icon={Wallet} title="Wallet & Earnings" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Available Balance" value={formatGHS(42500)} sub="Ready to withdraw" icon={Banknote} accent />
          <StatCard label="Locked (Escrow)" value={formatGHS(lockedFunds)} sub="Released on buyer approval" icon={Lock} />
          <StatCard label="Total Withdrawn" value={formatGHS(totalRevenue * 0.7)} sub="All-time" icon={ArrowUpRight} />
        </div>
        <Button className="h-12 px-8 bg-primary text-primary-foreground rounded-none font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl">
          <CreditCard className="h-4 w-4" /> Withdraw to Bank / MoMo
        </Button>
        <Card className="rounded-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {MOCK_TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-dashed border-border/50 last:border-0">
                <div>
                  <p className="text-[11px] font-black uppercase text-foreground">{tx.description}</p>
                  <p className="text-[9px] text-muted-foreground">{tx.date} · {tx.reference}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-[13px] font-black', ['escrow_release', 'payment_in'].includes(tx.type) ? 'text-green-600' : 'text-foreground')}>{formatGHS(tx.amount)}</p>
                  <StatusBadge status={tx.status === 'completed' ? 'Completed' : 'Pending Payment'} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── REVIEWS ── */}
      <TabsContent value="reviews" className="space-y-6 mt-0">
        <SectionTitle icon={Star} title="Reviews & Reputation" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Overall Rating" value="4.9 / 5.0" sub="Based on 142 reviews" icon={Star} accent />
          <StatCard label="Completion Rate" value="99.3%" sub="Orders completed" icon={CheckCircle2} />
          <StatCard label="Response Rate" value="97%" sub="Avg reply time: 1.4h" icon={MessageSquare} />
        </div>
        <Card className="rounded-none p-5 space-y-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary">Reputation Defence Tips</p>
          {['Respond to all buyer messages within 2 hours.', 'Always dispatch within 24h to stay ahead of the 48h SLA.', 'Use accurate product descriptions to reduce disputes.', 'Offer free delivery on high-value items to boost conversions.'].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] font-bold text-foreground">
              <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />{tip}
            </div>
          ))}
        </Card>
      </TabsContent>

      {/* ── WORKERS ── */}
      <TabsContent value="workers" className="space-y-6 mt-0">
        <SectionTitle icon={Briefcase} title="Team Members" action={{ label: 'Add Member', onClick: () => {} }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: 'Sales Manager', desc: 'Manages listings and pricing', perms: ['Create/edit listings', 'View analytics', 'Handle inquiries'] },
            { role: 'Dispatch Manager', desc: 'Handles order fulfilment', perms: ['View orders', 'Mark dispatched', 'Add tracking codes'] },
            { role: 'Support Agent', desc: 'Customer communication', perms: ['View messages', 'Reply to buyers', 'Escalate disputes'] },
          ].map(w => (
            <Card key={w.role} className="rounded-none border-l-4 border-l-primary">
              <CardContent className="p-5 space-y-3">
                <p className="text-[13px] font-black uppercase text-foreground">{w.role}</p>
                <p className="text-[10px] text-muted-foreground">{w.desc}</p>
                <div className="space-y-1">
                  {w.perms.map(p => <div key={p} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-muted-foreground"><CheckCircle2 className="h-3 w-3 text-primary" />{p}</div>)}
                </div>
                <Button className="w-full h-9 bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase gap-1"><Plus className="h-3 w-3" />Assign</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── CUSTOMER DASHBOARD ───────────────────────────────────────────────────────

function CustomerDashboard() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const fidelityScore = computeFidelityScore(user);
  const { label: tier, color: tierColor } = getFidelityTier(fidelityScore);
  const activeOrders = MOCK_ORDERS.filter(o => !['Completed', 'Refunded'].includes(o.status));
  const totalSpent = MOCK_ORDERS.filter(o => o.status === 'Completed').reduce((s, o) => s + o.amount, 0);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="overflow-x-auto no-scrollbar">
        <TabsList className="bg-muted/50 rounded-none h-10 gap-0 p-0 border border-border w-max min-w-full">
          {[
            { id: 'overview',  label: 'Overview',    icon: Activity      },
            { id: 'orders',    label: 'My Orders',   icon: Package       },
            { id: 'escrow',    label: 'Escrow Panel',icon: Lock          },
            { id: 'disputes',  label: 'Disputes',    icon: AlertTriangle },
            { id: 'saved',     label: 'Saved',       icon: Star          },
            { id: 'messages',  label: 'Messages',    icon: MessageSquare },
            { id: 'settings',  label: 'Settings',    icon: Settings      },
          ].map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="rounded-none text-[9px] font-black uppercase tracking-widest px-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 border-r border-border last:border-r-0">
              <Icon className="h-3 w-3" />{label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ── OVERVIEW ── */}
      <TabsContent value="overview" className="space-y-6 mt-0">
        {/* Fidelity / Trust badge */}
        <Card className="rounded-none bg-secondary text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Trust Score</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{fidelityScore}<span className="text-lg text-white/50">/100</span></p>
                    <Badge className={cn('rounded-none border-none text-[8px] font-black uppercase px-2 py-0.5 mt-0.5', tierColor.replace('text-', 'bg-').replace('-500', '-100').replace('-400', '-100'))}>{tier} Member</Badge>
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <Progress value={fidelityScore} className="h-2 rounded-none bg-white/10" />
                  <p className="text-[8px] text-white/40 mt-1 uppercase font-black tracking-widest">{100 - fidelityScore} pts to next tier</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center"><p className="text-2xl font-black text-white">{MOCK_ORDERS.length}</p><p className="text-[8px] text-white/50 uppercase font-black">Orders</p></div>
                <div className="text-center"><p className="text-2xl font-black text-white">{activeOrders.length}</p><p className="text-[8px] text-white/50 uppercase font-black">Active</p></div>
                <div className="text-center"><p className="text-2xl font-black text-primary">{formatGHS(totalSpent)}</p><p className="text-[8px] text-white/50 uppercase font-black">Spent</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Orders" value={String(activeOrders.length)} sub="In progress" icon={Package} />
          <StatCard label="Pending Inspection" value={String(MOCK_ORDERS.filter(o => o.status === 'Inspection').length)} sub="Awaiting your review" icon={Eye} trend="down" trendValue="Action needed" />
          <StatCard label="Completed" value={String(MOCK_ORDERS.filter(o => o.status === 'Completed').length)} sub="Successful purchases" icon={CheckCircle2} />
          <StatCard label="In Escrow" value={formatGHS(activeOrders.reduce((s, o) => s + o.amount, 0))} sub="Funds protected" icon={Lock} accent />
        </div>

        {/* Recent orders */}
        <SectionTitle icon={Package} title="Recent Orders" action={{ label: 'View All', onClick: () => setActiveTab('orders') }} />
        <div className="space-y-3">
          {MOCK_ORDERS.slice(0, 3).map(order => (
            <Card key={order.id} className="rounded-none border-l-4 border-l-primary">
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[11px] font-black uppercase text-foreground">{order.id}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{order.listingTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-black text-foreground">{formatGHS(order.amount)}</p>
                  {order.status === 'Inspection' && (
                    <Button size="sm" className="h-7 px-3 bg-green-600 text-white rounded-none font-black text-[8px] uppercase mt-1" onClick={() => setActiveTab('escrow')}>
                      Release Funds
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* ── MY ORDERS ── */}
      <TabsContent value="orders" className="space-y-4 mt-0">
        <SectionTitle icon={Package} title="My Orders" />
        {MOCK_ORDERS.map(order => (
          <Card key={order.id} className="rounded-none border-l-4 border-l-primary">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-[12px] font-black uppercase text-foreground">{order.id}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">{order.listingTitle}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Seller: {order.sellerName} · {order.createdAt.split('T')[0]}</p>
                </div>
                <p className="text-[15px] font-black text-foreground">{formatGHS(order.amount)}</p>
              </div>

              {/* Step-based progress */}
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: 'Paid', done: true },
                  { label: 'Dispatched', done: ['In Transit', 'Inspection', 'Completed'].includes(order.status) },
                  { label: 'Delivered', done: ['Inspection', 'Completed'].includes(order.status) },
                  { label: 'Complete', done: order.status === 'Completed' },
                ].map((s, i) => (
                  <div key={i} className={cn('text-center py-2 border-b-2 text-[8px] font-black uppercase', s.done ? 'border-primary text-primary' : 'border-border text-muted-foreground/40')}>
                    {s.done ? <CheckCircle2 className="h-3.5 w-3.5 mx-auto mb-0.5 text-primary" /> : <div className="h-3.5 w-3.5 mx-auto mb-0.5 border-2 border-current rounded-full" />}
                    {s.label}
                  </div>
                ))}
              </div>

              {order.trackingCode && (
                <div className="bg-amber-50 border border-amber-200 p-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-black uppercase text-amber-800">Tracking: {order.trackingCode}</span>
                </div>
              )}

              {order.status === 'Inspection' && (
                <div className="flex gap-2">
                  <Button size="sm" className="h-9 px-4 bg-green-600 text-white rounded-none font-black text-[9px] uppercase gap-1.5" onClick={() => setActiveTab('escrow')}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Release Payment
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 px-4 rounded-none font-black text-[9px] uppercase gap-1.5 border-destructive/40 text-destructive hover:bg-destructive hover:text-white">
                    <AlertCircle className="h-3.5 w-3.5" /> Open Dispute
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      {/* ── ESCROW PANEL ── */}
      <TabsContent value="escrow" className="space-y-6 mt-0">
        <SectionTitle icon={Lock} title="Escrow Panel" />
        {MOCK_ORDERS.filter(o => o.status === 'Inspection').length === 0 ? (
          <Card className="rounded-none p-10 text-center border-dashed">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No items awaiting inspection</p>
          </Card>
        ) : (
          MOCK_ORDERS.filter(o => o.status === 'Inspection').map(order => (
            <Card key={order.id} className="rounded-none border-l-4 border-l-blue-500">
              <CardContent className="p-5 space-y-5">
                <div>
                  <p className="text-[13px] font-black uppercase">{order.id} — {order.listingTitle}</p>
                  <p className="text-[10px] text-muted-foreground">{formatGHS(order.amount)} held in escrow · Seller: {order.sellerName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Guided Inspection Checklist</p>
                  {['Item matches the listing description exactly', 'No physical damage or defects', 'All accessories and parts included', 'Item powers on and works correctly'].map((check, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 border border-border/50 cursor-pointer hover:border-primary/30 transition-colors">
                      <input type="checkbox" className="h-4 w-4 accent-primary" />
                      <span className="text-[10px] font-black uppercase tracking-tight text-foreground">{check}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 rounded-none border-destructive/40 text-destructive hover:bg-destructive hover:text-white font-black uppercase text-[9px] gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Open Dispute
                  </Button>
                  <Button className="h-12 bg-green-600 text-white hover:bg-green-700 font-black uppercase text-[9px] rounded-none gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Release Payment
                  </Button>
                </div>
                <p className="text-center text-[9px] text-muted-foreground uppercase">Seller receives {formatGHS(order.netPayout)} · Platform fee {formatGHS(order.platformFee)}</p>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* ── DISPUTES ── */}
      <TabsContent value="disputes" className="space-y-4 mt-0">
        <SectionTitle icon={AlertTriangle} title="My Disputes" />
        {MOCK_DISPUTES.map(d => (
          <Card key={d.id} className="rounded-none border-l-4 border-l-red-500">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1"><p className="text-[12px] font-black uppercase">{d.id}</p><StatusBadge status={d.status} /></div>
                  <p className="text-[11px] font-black text-primary uppercase">{d.reason}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{d.description}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3">
                <p className="text-[9px] font-black uppercase text-blue-700">Status Update</p>
                <p className="text-[10px] text-blue-800 mt-0.5">Admin is reviewing evidence. Estimated resolution: 24 hours. Your funds are frozen and fully protected.</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 px-4 rounded-none font-black text-[9px] uppercase gap-1.5 border-2">
                <MessageSquare className="h-3 w-3" /> Chat with Admin
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      {/* ── SAVED ── */}
      <TabsContent value="saved" className="space-y-4 mt-0">
        <SectionTitle icon={Star} title="Saved Items" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {LISTINGS.filter(l => user?.savedListings?.includes(l.id)).map(listing => (
            <Card key={listing.id} className="rounded-none border-border hover:border-primary transition-colors">
              <CardContent className="p-4 space-y-2">
                <p className="text-[11px] font-black uppercase text-foreground line-clamp-2">{listing.title}</p>
                <p className="text-[14px] font-black text-primary">{formatGHS(listing.price)}</p>
                <p className="text-[9px] text-muted-foreground uppercase">{listing.location}</p>
                <Link href={`/listings/${listing.id}`}>
                  <Button size="sm" className="w-full h-8 bg-primary text-primary-foreground rounded-none font-black text-[8px] uppercase mt-1">View</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {(user?.savedListings?.length ?? 0) === 0 && (
            <div className="col-span-full text-center py-16 border border-dashed">
              <Star className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No saved items yet</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* ── MESSAGES ── */}
      <TabsContent value="messages" className="space-y-4 mt-0">
        <SectionTitle icon={MessageSquare} title="Messages" />
        <Card className="rounded-none p-10 text-center border-dashed">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Messaging system coming soon</p>
          <p className="text-[9px] text-muted-foreground mt-1">In-app chat with vendors for order queries</p>
        </Card>
      </TabsContent>

      {/* ── SETTINGS ── */}
      <TabsContent value="settings" className="space-y-4 mt-0">
        <SectionTitle icon={Settings} title="Account Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Notifications', desc: 'SMS, email and in-app alerts', icon: Bell },
            { label: 'Payment Methods', desc: 'MoMo, Visa, bank accounts', icon: CreditCard },
            { label: 'Security', desc: 'Password and 2FA settings', icon: ShieldCheck },
            { label: 'Privacy', desc: 'Data and visibility controls', icon: Lock },
          ].map(s => (
            <Card key={s.label} className="rounded-none border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-none"><s.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-[12px] font-black uppercase text-foreground">{s.label}</p>
                  <p className="text-[9px] text-muted-foreground">{s.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── STAFF DASHBOARD ──────────────────────────────────────────────────────────

function StaffDashboard() {
  const { formatPrice } = useCurrency();
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Dispatch Queue" value={String(MOCK_ORDERS.filter(o => o.status === 'Escrow Funded').length)} sub="Need dispatch today" icon={Truck} trend="down" trendValue="Action required" />
        <StatCard label="Inspection Queue" value={String(MOCK_ORDERS.filter(o => o.status === 'Inspection').length)} sub="Awaiting buyer review" icon={Eye} />
        <StatCard label="Open Disputes" value={String(MOCK_DISPUTES.length)} sub="Active cases" icon={AlertCircle} />
      </div>
      <SectionTitle icon={Package} title="Dispatch Queue" />
      <div className="space-y-3">
        {MOCK_ORDERS.filter(o => o.status === 'Escrow Funded').map(order => (
          <Card key={order.id} className="rounded-none border-l-4 border-l-amber-500">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1"><p className="text-[11px] font-black uppercase">{order.id}</p><StatusBadge status={order.status} /></div>
                <p className="text-[10px] text-muted-foreground uppercase">{order.listingTitle} · {order.sellerName}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('text-[11px] font-black uppercase', order.slaExpired ? 'text-red-500' : 'text-green-600')}>{order.slaTimer}</span>
                <Button size="sm" className="h-8 px-4 bg-primary text-primary-foreground rounded-none font-black text-[9px] uppercase gap-1.5">
                  <Truck className="h-3 w-3" /> Mark Dispatched
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE SHELL ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const currentRole = user?.role ?? 'CUSTOMER';

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">Access Required</h2>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Please login to access your dashboard.</p>
          <Button onClick={() => router.push('/')} className="rounded-none bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest h-12 px-10">
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground rounded-none font-black text-[8px] uppercase tracking-widest px-3 py-1">
                {currentRole.replace(/_/g, ' ')}
              </Badge>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Secure Session</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
              {currentRole === 'HIGH_ADMIN' ? 'Platform' : currentRole === 'VENDOR_ADMIN' ? 'Vendor' : currentRole === 'VENDOR_STAFF' ? 'Operations' : 'My'}
              {' '}<span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
              Welcome back, {user.name} — {new Date().toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/')} className="rounded-none h-10 px-5 font-black text-[9px] uppercase tracking-widest border-2 gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
            <Button onClick={logout} variant="destructive" className="rounded-none h-10 px-5 font-black text-[9px] uppercase tracking-widest gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* ROLE-BASED CONTENT */}
        {currentRole === 'HIGH_ADMIN'   && <AdminDashboard />}
        {currentRole === 'VENDOR_ADMIN' && <VendorDashboard />}
        {currentRole === 'CUSTOMER'     && <CustomerDashboard />}
        {currentRole === 'VENDOR_STAFF' && <StaffDashboard />}
      </div>
    </div>
  );
}
