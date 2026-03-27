/**
 * Genkit dev server entry-point — no longer needed.
 * AI is now powered entirely by the Tavily Search API.
 * Run the standard Next.js dev server with: npm run dev:next
 */
import { config } from 'dotenv';
config();

console.log('[AI] Tavily-powered AI is ready. No Genkit dev server required.');
console.log('[AI] AI_ENABLED:', !!(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'tvly-dev-YOUR_KEY_HERE'));
