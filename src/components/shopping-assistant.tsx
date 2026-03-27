"use client";

import { useState, useEffect } from 'react';
import {
  Sparkles, MessageSquare, Send, X, Loader2,
  ShoppingBag, ShieldCheck, ExternalLink, Search, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findProducts, type FindProductsOutput } from '@/ai/flows/shopping-assistant-flow';
import { checkAiStatusAction } from '@/ai/actions';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/components/providers';
import Link from 'next/link';

export function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<FindProductsOutput | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    checkAiStatusAction().then((res) => setAiEnabled(res.enabled));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await findProducts({ query: query.trim() });
      setResult(response);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('[ShoppingAssistant]', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setQuery('');
  };

  if (!aiEnabled) return null;

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <div className="fixed left-4 bottom-24 md:left-10 md:bottom-48 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 md:h-20 md:w-20 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl flex flex-col gap-1 items-center justify-center p-0 border border-primary/20"
          aria-label="Open AI Shopping Assistant"
        >
          <Sparkles className="h-5 w-5 md:h-8 md:w-8 animate-pulse" />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest hidden md:block">
            AI Search
          </span>
        </Button>
      </div>

      {/* ── Modal Overlay ────────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
      >
        <Card className="w-full max-w-2xl bg-background rounded-none border-t-4 border-t-primary shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

          {/* Header */}
          <CardHeader className="bg-secondary text-secondary-foreground p-4 md:p-6 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg font-black uppercase tracking-tighter text-secondary-foreground">
                  AI Shopping Assistant
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Globe className="h-2.5 w-2.5 text-primary" />
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary">
                    Powered by Tavily Live Search
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-secondary-foreground/40 hover:text-secondary-foreground hover:bg-white/5 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          {/* Body */}
          <CardContent className="p-0 flex flex-col max-h-[75vh]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">

              {/* ── Empty state ── */}
              {!result && !isSearching && !error && (
                <div className="text-center space-y-6 py-10">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-muted flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground opacity-30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm md:text-base font-black text-foreground uppercase tracking-tight">
                      What are you looking for?
                    </h3>
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest px-4 md:px-10">
                      I'll search the web and Ghana's market in real-time to find the best deals for you.
                    </p>
                  </div>
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {['MacBook Pro Ghana', 'Toyota Corolla Accra', 'iPhone 15 price GHS', 'Apartment East Legon'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 text-[9px] font-black uppercase tracking-widest text-muted-foreground transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Loading state ── */}
              {isSearching && (
                <div className="text-center py-16 space-y-5">
                  <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-primary mx-auto" />
                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                      Searching Live Market Data…
                    </p>
                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">
                      Powered by Tavily Real-Time Search
                    </p>
                  </div>
                </div>
              )}

              {/* ── Error state ── */}
              {error && !isSearching && (
                <div className="bg-destructive/10 border border-destructive/20 p-5 text-center space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-destructive">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="rounded-none font-black uppercase text-[9px] tracking-widest border-destructive/30"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* ── Results state ── */}
              {result && !isSearching && (
                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* Search summary pill */}
                  {result.searchSummary && (
                    <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 p-3">
                      <Globe className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                        {result.searchSummary}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> Live Search Results
                    </h4>
                    <div className="grid gap-3">
                      {result.recommendations.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 md:p-5 bg-muted/20 border-l-4 border-primary space-y-2.5 group hover:bg-muted/30 transition-colors"
                        >
                          {/* Title row */}
                          <div className="flex justify-between items-start gap-3">
                            <h5 className="font-black text-foreground uppercase text-xs md:text-sm tracking-tight leading-tight flex-1">
                              {item.title}
                            </h5>
                            {item.price > 0 && (
                              <span className="text-primary font-black text-xs md:text-sm whitespace-nowrap shrink-0">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>

                          {/* Reason/snippet */}
                          <p className="text-[9px] md:text-[10px] font-medium text-muted-foreground leading-relaxed line-clamp-3">
                            {item.reason}
                          </p>

                          {/* Actions row */}
                          <div className="flex items-center gap-2 pt-1">
                            {/* View in marketplace */}
                            <Link
                              href={`/listings?q=${encodeURIComponent(item.title)}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                size="sm"
                                className="h-7 rounded-none bg-secondary text-secondary-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
                              >
                                <ShoppingBag className="h-3 w-3" /> Marketplace
                              </Button>
                            </Link>

                            {/* External source link */}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                                {item.source ?? 'Source'}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice block */}
                  <div className="bg-primary/5 p-4 md:p-5 border border-dashed border-primary/20 space-y-2">
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Buying Advice
                    </h4>
                    <p className="text-[10px] md:text-[11px] font-medium text-muted-foreground leading-relaxed">
                      {result.advice}
                    </p>
                  </div>

                  {/* New search */}
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full h-10 md:h-12 rounded-none font-black uppercase text-[9px] md:text-[10px] tracking-widest border-primary/20 hover:bg-primary/5"
                  >
                    New Search
                  </Button>
                </div>
              )}
            </div>

            {/* ── Search bar (sticky bottom) ─────────────────────────────── */}
            <div className="border-t border-border bg-background p-3 md:p-4 shrink-0">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Premium sofa under GH₵8,000"
                    className="h-12 md:h-14 pl-11 pr-14 rounded-none border-2 focus:border-primary font-bold text-[10px] md:text-xs text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className="absolute right-1.5 top-1.5 md:right-2 md:top-2 h-9 w-9 md:h-10 md:w-10 bg-secondary text-secondary-foreground hover:bg-primary rounded-none p-0 transition-all disabled:opacity-40"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
