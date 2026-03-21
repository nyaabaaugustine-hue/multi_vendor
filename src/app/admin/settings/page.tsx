
"use client";

import { useState } from 'react';
import { useContent } from '@/components/providers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  ShieldCheck, 
  Zap, 
  Phone, 
  Globe, 
  Lock, 
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ProtocolSettings() {
  const { content, updateSettings, resetToDefault } = useContent();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (data: any) => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(data);
      setIsSaving(false);
      toast({
        title: "Protocol Registry Updated",
        description: "Institutional settings have been synchronized across all nodes.",
      });
    }, 1500);
  };

  const handleReset = () => {
    if (confirm("Reset to factory sovereign protocols? This cannot be undone.")) {
      resetToDefault();
      toast({ title: "Protocols Reset", description: "Returning to factory institutional settings." });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Protocol Management</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Configure global registry assets and institutional parameters.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset} className="rounded-none h-12 gap-2 font-black text-[10px] uppercase tracking-widest border-destructive/20 text-destructive hover:bg-destructive/10">
            <RotateCcw className="h-4 w-4" />
            Reset Factory
          </Button>
          <Button onClick={() => handleSave({})} disabled={isSaving} className="bg-primary text-secondary font-black rounded-none px-8 h-12 uppercase text-[10px] tracking-widest gap-2 shadow-xl">
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Global Sync
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border p-1 rounded-none w-full md:w-auto overflow-x-auto no-scrollbar">
          <TabsTrigger value="general" className="rounded-none px-6 py-2 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-secondary data-[state=active]:text-white">General Node</TabsTrigger>
          <TabsTrigger value="branding" className="rounded-none px-6 py-2 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-secondary data-[state=active]:text-white">Branding Registry</TabsTrigger>
          <TabsTrigger value="finance" className="rounded-none px-6 py-2 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-secondary data-[state=active]:text-white">Fee Protocol</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-none border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Support Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Global Support Hotline</label>
                  <Input 
                    defaultValue={content.settings.supportPhone} 
                    className="rounded-none border-2 focus:border-primary font-bold"
                    onBlur={(e) => updateSettings({ supportPhone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Institutional Email Node</label>
                  <Input 
                    defaultValue={content.settings.supportEmail} 
                    className="rounded-none border-2 focus:border-primary font-bold"
                    onBlur={(e) => updateSettings({ supportEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Marketplace Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Platform Title</label>
                  <Input 
                    defaultValue={content.settings.siteName} 
                    className="rounded-none border-2 focus:border-primary font-bold"
                    onBlur={(e) => updateSettings({ siteName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sovereign Copyright</label>
                  <Input 
                    defaultValue={content.settings.footerCopyright} 
                    className="rounded-none border-2 focus:border-primary font-medium" 
                    onBlur={(e) => updateSettings({ footerCopyright: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="mt-8 space-y-8">
          <Card className="rounded-none border shadow-sm bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Branding Node
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="grid gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Institutional Logo URL</label>
                    <Input 
                      defaultValue={content.settings.logoUrl} 
                      className="rounded-none border-2 font-bold"
                      onBlur={(e) => updateSettings({ logoUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Site Tagline</label>
                    <Input 
                      defaultValue={content.settings.siteTagline} 
                      className="rounded-none border-2 font-black uppercase text-xs"
                      onBlur={(e) => updateSettings({ siteTagline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-dashed bg-muted/20 p-8">
                  <p className="text-[8px] font-black uppercase tracking-widest mb-4 opacity-40">Active Logo Preview</p>
                  <div className="relative h-20 w-20 border-2 border-primary/20">
                    <Image src={content.settings.logoUrl} alt="Logo" fill className="object-contain p-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="rounded-none border shadow-sm bg-white border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Escrow Fee Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Percentage Rate</label>
                    <div className="relative">
                       <Input defaultValue="2.0" className="rounded-none border-2 font-black pr-10" />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xs text-primary">%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 border border-dashed rounded-none">
                     <p className="text-[8px] font-bold text-muted-foreground uppercase leading-relaxed">Applied to all consumer-tier transactions within the sovereign registry.</p>
                  </div>
                </CardContent>
             </Card>

             <Card className="rounded-none border shadow-sm bg-white border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Settlement Node
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">SLA Window (Hours)</label>
                    <Input defaultValue="48" className="rounded-none border-2 font-black" />
                  </div>
                  <div className="p-4 bg-muted/30 border border-dashed rounded-none">
                     <p className="text-[8px] font-bold text-muted-foreground uppercase leading-relaxed">Automatic refund protocol triggers after this duration if dispatch is not verified.</p>
                  </div>
                </CardContent>
             </Card>

             <Card className="rounded-none border shadow-sm bg-white border-t-4 border-t-burgundy">
                <CardHeader>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-burgundy" />
                    Security Threshold
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Auto-Freeze Level (GHS)</label>
                    <Input defaultValue="50000" className="rounded-none border-2 font-black" />
                  </div>
                  <div className="p-4 bg-burgundy/5 border border-burgundy/10 rounded-none">
                     <p className="text-[8px] font-bold text-burgundy uppercase leading-relaxed">Transactions above this value require secondary Multisig authorization.</p>
                  </div>
                </CardContent>
             </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
