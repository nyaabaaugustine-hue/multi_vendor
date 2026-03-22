'use server';

import { ai } from '@/ai/genkit';
import { AI_ENABLED } from '@/ai/config';
import { z } from 'genkit';

export const generateListingDescription = ai.defineFlow(
  {
    name: 'generateListingDescription',
    inputSchema: z.object({
      title: z.string().describe('The title of the item.'),
      category: z.string().describe('The category of the item.'),
      keyFeatures: z.array(z.string()).describe('List of key features or highlights.'),
      length: z.enum(['short', 'medium', 'long']).default('medium').describe('Desired length of the description.'),
      tone: z.string().optional().describe('The desired tone for the description (e.g., "professional", "friendly", "luxurious").'),
    }),
    outputSchema: z.object({
      description: z.string(),
    }),
  },
  async (input) => {
    if (!AI_ENABLED) {
      return {
        description: `This is a mock description for "${input.title}". (AI is currently disabled). \n\nFeaturing: ${input.keyFeatures.join(', ')}. \n\nCategory: ${input.category}. \n\nThis asset is protected by VaultCommerce Escrow for your safety.`,
      };
    }

    const { text } = await ai.generate({
      prompt: `You are an expert copywriter for a premium marketplace. Write a compelling listing description for the following item:

      Item: ${input.title}
      Category: ${input.category}
      Key Highlights: ${input.keyFeatures.join(', ')}
      Tone: ${input.tone || 'professional'}
      Length: ${input.length}

      The description should build trust, highlight value, and be formatted with clear paragraphs. Do not use markdown code blocks.`,
    });

    return { description: text };
  }
);