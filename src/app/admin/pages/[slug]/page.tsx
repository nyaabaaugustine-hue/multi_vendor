
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContent } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  RefreshCw,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function PageEditor() {
  const { slug } = useParams();
  const router = useRouter();
  const { content, updatePage } = useContent();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const page = content.pages[slug as keyof typeof content.pages];

  if (!page) {
    return <div className="p-20 text-center font-black uppercase tracking-widest">Node Not Found</div>;
  }

  const handleSaveSection = (sectionKey: string, data: any) => {
    setIsSaving(true);
    setTimeout(() => {
      updatePage(slug as string, sectionKey, data);
      setIsSaving(false);
      toast({
        title: "Section Sync Success",
        description: `High-fidelity changes to ${sectionKey} have been authorized.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-none h-12 w-12 border">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Editor: {page.title} Node</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Modify institutional content for the global registry.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-none font-black text-[10px] uppercase tracking-widest h-12 gap-2" onClick={() => window.open('/', '_blank')}>
          <Eye className="h-4 w-4" />
          Live Preview
        </Button>
      </div>

      <div className="space-y-12">
        {Object.entries(page.sections).map(([key, section]: [string, any]) => (
          <Card key={key} className="rounded-none border shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  Section: {key.toUpperCase()}
                </CardTitle>
                <CardDescription className="text-[9px] uppercase font-bold">Configure display nodes for this sector.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-none font-black text-[8px] border-primary/20 text-primary">SCMS v1.0</Badge>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  {Object.keys(section).map((field) => (
                    field !== 'imageUrl' && (
                      <div key={field} className="grid gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Type className="h-3 w-3" /> {field}
                        </label>
                        {field === 'description' ? (
                          <Textarea 
                            defaultValue={section[field]} 
                            className="rounded-none border-2 focus:border-primary font-medium min-h-[120px]"
                            onChange={(e) => section[field] = e.target.value}
                          />
                        ) : (
                          <Input 
                            defaultValue={section[field]} 
                            className="rounded-none border-2 focus:border-primary font-black uppercase text-xs"
                            onChange={(e) => section[field] = e.target.value}
                          />
                        )}
                      </div>
                    )
                  ))}
                </div>

                {section.imageUrl && (
                  <div className="space-y-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> Visual Asset
                    </label>
                    <div className="relative h-64 w-full bg-muted border-2 border-dashed border-primary/20 group">
                      <Image src={section.imageUrl} alt="Preview" fill className="object-cover contrast-125" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-6">
                        <div className="w-full space-y-4">
                          <Input 
                            placeholder="Authorized Image URL" 
                            className="bg-white rounded-none border-none text-[10px] font-bold"
                            defaultValue={section.imageUrl}
                            onChange={(e) => section.imageUrl = e.target.value}
                          />
                          <p className="text-[8px] text-white/60 font-black uppercase tracking-widest text-center">Replace existing node URL to authorize update.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-dashed flex justify-end">
                <Button 
                  onClick={() => handleSaveSection(key, section)} 
                  disabled={isSaving}
                  className="bg-secondary text-white font-black rounded-none px-12 h-14 uppercase text-[10px] tracking-widest gap-2 shadow-xl"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Authorize Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
