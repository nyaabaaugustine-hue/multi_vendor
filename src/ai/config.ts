/**
 * AI feature flag.
 * Powered entirely by Tavily Search API — no Genkit or Gemini required.
 * Requires TAVILY_API_KEY in .env.local
 */
export const AI_ENABLED = !!(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'tvly-dev-YOUR_KEY_HERE');
