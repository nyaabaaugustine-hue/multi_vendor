'use server';
/**
 * @fileOverview A personal shopping assistant that helps users find products in the Ecommerce marketplace.
 *
 * - findProducts - A function that handles the product search and recommendation process.
 * - FindProductsInput - The input type for the findProducts function.
 * - FindProductsOutput - The return type for the findProducts function.
 */

import { ai } from '@/ai/genkit';
import { AI_ENABLED } from '@/ai/config';
import { z } from 'genkit';

const FindProductsInputSchema = z.object({
  query: z.string().describe('The user\'s request for finding products (e.g., "Find me a MacBook under GH₵10,000").'),
  budget: z.number().optional().describe('The user\'s maximum budget in GHS.'),
  category: z.string().optional().describe('The category the user is interested in.'),
});
export type FindProductsInput = z.infer<typeof FindProductsInputSchema>;

const FindProductsOutputSchema = z.object({
  recommendations: z.array(z.object({
    id: z.string().describe('The product ID.'),
    title: z.string().describe('The product title.'),
    price: z.number().describe('The product price in GHS.'),
    reason: z.string().describe('Why this product is recommended based on the query.'),
  })).describe('A list of recommended products.'),
  advice: z.string().describe('General shopping advice or escrow security tips related to the query.'),
});
export type FindProductsOutput = z.infer<typeof FindProductsOutputSchema>;

export async function findProducts(input: FindProductsInput): Promise<FindProductsOutput> {
  if (!AI_ENABLED) {
    return {
      recommendations: [
        {
          id: 'mock-1',
          title: 'Premium Item (Mock)',
          price: input.budget || 5000,
          reason: `This is a mock recommendation for your query: "${input.query}".`,
        }
      ],
      advice: "AI is currently disabled. Please use the search bar to find verified listings. Remember to always use our Escrow system for secure transactions.",
    };
  }
  return findProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findProductsPrompt',
  input: {schema: FindProductsInputSchema},
  output: {schema: FindProductsOutputSchema},
  prompt: `You are an expert personal shopping assistant for "Ecommerce", Ghana's most trusted marketplace.
Your goal is to help users find the best products while highlighting the security of our Escrow system.

User Query: {{{query}}}
{{#if budget}}Budget: GH₵{{{budget}}}{{/if}}
{{#if category}}Category: {{{category}}}{{/if}}

Based on the query, provide highly relevant product recommendations and professional shopping advice. 
Always mention that their purchase is protected by our 48-hour Escrow Refund Policy.`,
});

const findProductsFlow = ai.defineFlow(
  {
    name: 'findProductsFlow',
    inputSchema: FindProductsInputSchema,
    outputSchema: FindProductsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
