import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { AI_ENABLED } from './config';

export { AI_ENABLED };

export const ai = genkit({
  plugins: AI_ENABLED ? [googleAI()] : [],
  model: 'googleai/gemini-2.5-flash',
});
