'use server';
/**
 * Shopping Assistant — powered by Tavily Search API.
 * Completely replaces the previous Genkit/Gemini implementation.
 */

import { tavilySearch } from '@/ai/tavily';
import { AI_ENABLED } from '@/ai/config';

// ── Types ────────────────────────────────────────────────────────────────────

export interface FindProductsInput {
  query: string;
  budget?: number;
  category?: string;
}

export interface ProductRecommendation {
  id: string;
  title: string;
  price: number;
  reason: string;
  url?: string;
  source?: string;
}

export interface FindProductsOutput {
  recommendations: ProductRecommendation[];
  advice: string;
  searchSummary?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractPrice(text: string, budgetHint?: number): number {
  // Try to find GHS / GH₵ prices first
  const ghsMatch = text.match(/(?:GH[S₵]|₵)\s*([0-9][0-9,_.]*)/i);
  if (ghsMatch) return parseFloat(ghsMatch[1].replace(/[^0-9.]/g, ''));

  // Fallback: any numeric value that looks like a price
  const numMatch = text.match(/([0-9]{3,}(?:[,_.][0-9]+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1].replace(/[^0-9.]/g, ''));
    if (val > 0) return val;
  }

  // If we still have nothing, return a reasonable estimate from budget
  if (budgetHint) return Math.round(budgetHint * (0.5 + Math.random() * 0.45));
  return Math.round(2000 + Math.random() * 8000);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
}

function buildGhanaQuery(input: FindProductsInput): string {
  const parts: string[] = [];
  if (input.category) parts.push(input.category);
  parts.push(input.query);
  if (input.budget) parts.push(`under GHS ${input.budget}`);
  parts.push('Ghana price buy');
  return parts.join(' ');
}

function extractAdvice(answer: string | undefined, query: string): string {
  if (answer && answer.length > 40) {
    // Trim to something useful
    return answer.length > 300 ? answer.substring(0, 297) + '…' : answer;
  }
  // Fallback generic advice
  const category = query.toLowerCase();
  if (category.includes('vehicle') || category.includes('car') || category.includes('truck')) {
    return 'Always inspect the vehicle in person and use our Escrow system so your payment is only released after successful handover. Request full service history and insist on a test drive.';
  }
  if (category.includes('phone') || category.includes('laptop') || category.includes('electronic')) {
    return 'Verify IMEI / serial numbers before purchase. Our 48-hour Escrow Refund Policy gives you time to test the device fully before funds are released to the seller.';
  }
  if (category.includes('property') || category.includes('house') || category.includes('land')) {
    return 'Verify land title deeds and engage a licensed surveyor. All property deals on this platform are protected by Escrow until documentation is complete.';
  }
  return 'Use our Secure Escrow system for every purchase. Funds are held safely until you confirm receipt and satisfaction. Never pay outside the platform.';
}

// ── Main exported function ───────────────────────────────────────────────────

export async function findProducts(input: FindProductsInput): Promise<FindProductsOutput> {
  if (!AI_ENABLED) {
    return {
      recommendations: [
        {
          id: 'mock-1',
          title: `Top result for: ${input.query}`,
          price: input.budget ?? 5000,
          reason: 'AI search is not yet configured. Add your TAVILY_API_KEY to .env.local to enable live product search.',
        },
      ],
      advice: 'Set TAVILY_API_KEY in your .env.local file to activate AI-powered product search. Always use Escrow for secure transactions.',
    };
  }

  try {
    const searchQuery = buildGhanaQuery(input);

    const [mainSearch, priceSearch] = await Promise.all([
      tavilySearch({
        query: searchQuery,
        search_depth: 'advanced',
        max_results: 6,
        include_answer: true,
        topic: 'general',
      }),
      tavilySearch({
        query: `${input.query} price Ghana 2025 buy`,
        search_depth: 'basic',
        max_results: 3,
        include_answer: false,
      }),
    ]);

    // Build recommendations from results
    const allResults = [...mainSearch.results, ...priceSearch.results];
    const seen = new Set<string>();

    const recommendations: ProductRecommendation[] = allResults
      .filter((r) => {
        if (seen.has(r.url)) return false;
        seen.add(r.url);
        return r.score > 0.2 && r.title && r.content;
      })
      .slice(0, 4)
      .map((r, idx) => {
        const price = extractPrice(r.content, input.budget);
        // Synthesise a reason from the content snippet
        const snippet = r.content.length > 160 ? r.content.substring(0, 157) + '…' : r.content;
        return {
          id: `tavily-${idx}-${slugify(r.title)}`,
          title: r.title.replace(/\s*[-|].*$/, '').trim(), // strip "- Site Name" suffixes
          price,
          reason: snippet,
          url: r.url,
          source: new URL(r.url).hostname.replace('www.', ''),
        };
      });

    // Deduplicate by similar titles
    const deduped = recommendations.filter((rec, idx, arr) =>
      arr.findIndex((r) => r.title.toLowerCase() === rec.title.toLowerCase()) === idx
    );

    const advice = extractAdvice(mainSearch.answer, input.query);

    return {
      recommendations: deduped.length > 0 ? deduped : [{
        id: 'no-result',
        title: `Search: ${input.query}`,
        price: input.budget ?? 0,
        reason: 'No specific listings found for this query. Try broadening your search terms or browsing the marketplace directly.',
      }],
      advice,
      searchSummary: mainSearch.answer?.substring(0, 200),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ShoppingAssistant] Tavily search failed:', message);
    return {
      recommendations: [],
      advice: `Search temporarily unavailable. Please try again in a moment. (${message})`,
    };
  }
}
