/**
 * Tavily AI Search Client
 * Direct REST calls — zero Genkit, zero Gemini.
 */

const TAVILY_API_URL = 'https://api.tavily.com/search';

export interface TavilySearchOptions {
  query: string;
  search_depth?: 'basic' | 'advanced';
  max_results?: number;
  include_answer?: boolean;
  include_raw_content?: boolean;
  topic?: 'general' | 'news';
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  answer?: string;
  results: TavilyResult[];
  response_time: number;
}

export async function tavilySearch(options: TavilySearchOptions): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error('TAVILY_API_KEY is not set in environment variables.');

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: options.query,
      search_depth: options.search_depth ?? 'advanced',
      max_results: options.max_results ?? 5,
      include_answer: options.include_answer ?? true,
      include_raw_content: options.include_raw_content ?? false,
      topic: options.topic ?? 'general',
      ...(options.include_domains && { include_domains: options.include_domains }),
      ...(options.exclude_domains && { exclude_domains: options.exclude_domains }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Tavily API error ${response.status}: ${error}`);
  }

  return response.json();
}
