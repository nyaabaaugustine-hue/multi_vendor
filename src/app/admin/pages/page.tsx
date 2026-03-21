
"use client";

import Link from 'next/link';
import { useContent } from '@/components/providers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ChevronRight, 
  Layout, 
  Clock, 
  ExternalLink,
  Edit3
} from 'lucide-react';

export default function PagesRegistry() {
  const { content } = useContent();
  const pages = Object.values(content.pages);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Page Registry</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Manage institutional content nodes across the platform.</p>
        </div>
        <Button className="bg-primary text-secondary rounded-none font-black text-[10px] uppercase tracking-widest h-12 px-8">
          Add New Node
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          <Card key={page.slug} className="rounded-none border shadow-sm bg-white group hover:border-primary transition-all">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-muted p-3 group-hover:bg-primary/5 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="rounded-none text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">AUTHORIZED</Badge>
              </div>
              <CardTitle className="text-xl font-black text-secondary uppercase tracking-tighter">{page.title}</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Slug: /{page.slug}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 py-4 border-y border-dashed">
                <Layout className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase text-secondary">Sections: {Object.keys(page.sections).length} Nodes</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/pages/${page.slug}`} className="flex-1">
                  <Button className="w-full bg-secondary text-white rounded-none font-black text-[10px] uppercase tracking-widest h-11 gap-2">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Content
                  </Button>
                </Link>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-none border-primary/20" onClick={() => window.open(`/${page.slug === 'home' ? '' : page.slug}`, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
