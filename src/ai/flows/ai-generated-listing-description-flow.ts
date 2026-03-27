'use server';
/**
 * AI-Generated Listing Description — powered by Tavily Search API.
 * Completely replaces the previous Genkit/Gemini implementation.
 *
 * Strategy: search for real market context about the item, then synthesise
 * a compelling, accurate description from the results.
 */

import { tavilySearch } from '@/ai/tavily';
import { AI_ENABLED } from '@/ai/config';

// ── Types ────────────────────────────────────────────────────────────────────

export interface GenerateDescriptionInput {
  title: string;
  category: string;
  keyFeatures: string[];
  length?: 'short' | 'medium' | 'long';
  tone?: string;
}

export interface GenerateDescriptionOutput {
  description: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const LENGTH_TARGETS: Record<string, number> = {
  short: 120,
  medium: 280,
  long: 500,
};

function compose(
  title: string,
  category: string,
  keyFeatures: string[],
  snippets: string[],
  tone: string,
  length: 'short' | 'medium' | 'long'
): string {
  const target = LENGTH_TARGETS[length] ?? 280;
  const featuresText = keyFeatures.length ? keyFeatures.join(', ') : 'premium quality and excellent condition';

  // Pull relevant context snippets (remove duplicates, trim)
  const contextLines = snippets
    .flatMap((s) => s.split('. '))
    .filter((s) => s.length > 30 && s.toLowerCase().includes(title.toLowerCase().split(' ')[0]))
    .slice(0, 3)
    .map((s) => s.trim().replace(/\s+/g, ' '));

  const contextBlock = contextLines.length
    ? `Based on current market data: ${contextLines.join('. ')}.`
    : '';

  const toneAdj = tone === 'luxurious' ? 'exclusive, premium'
    : tone === 'friendly' ? 'approachable, reliable'
    : 'professional, trustworthy';

  const intro = `Presenting this ${toneAdj} ${category.toLowerCase()} listing: **${title}**.`;
  const features = `Key highlights include ${featuresText}.`;
  const context = contextBlock;
  const escrow = `This listing is fully protected by Secure Escrow — your payment is only released after you confirm satisfaction. Buyers receive a 48-hour inspection period.`;

  const full = [intro, features, context, escrow].filter(Boolean).join(' ');

  // Trim to target length (at word boundary)
  if (full.length <= target + 80) return full;
  const truncated = full.substring(0, target);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '… ' + escrow;
}

// ── Main exported function ───────────────────────────────────────────────────

export async function generateListingDescription(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  const { title, category, keyFeatures, length = 'medium', tone = 'professional' } = input;

  if (!AI_ENABLED) {
    return {
      description: `${title} — ${category}\n\nFeaturing: ${keyFeatures.join(', ')}.\n\nThis asset is protected by Secure Escrow for your safety. Set TAVILY_API_KEY in .env.local to enable AI-generated descriptions.`,
    };
  }

  try {
    const searchQuery = `${title} ${category} specifications review Ghana 2025`;

    const result = await tavilySearch({
      query: searchQuery,
      search_depth: 'basic',
      max_results: 4,
      include_answer: true,
    });

    const snippets = result.results.map((r) => r.content);
    const description = compose(title, category, keyFeatures, snippets, tone, length);

    return { description };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ListingDescription] Tavily search failed:', message);
    // Graceful fallback — still useful, just no web context
    const description = compose(title, category, keyFeatures, [], tone, length);
    return { description };
  }
}
