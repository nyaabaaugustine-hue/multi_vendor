'use server';
/**
 * @fileOverview A generative AI tool that assists providers in creating compelling and optimized descriptions
 * for their product or service listings.
 *
 * - generateListingDescription - A function that handles the listing description generation process.
 * - GenerateListingDescriptionInput - The input type for the generateListingDescription function.
 * - GenerateListingDescriptionOutput - The return type for the generateListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the product or service.'),
  category: z.string().describe('The category of the listing (e.g., "Electronics", "Real Estate", "Tutoring").'),
  keyFeatures: z.array(z.string()).describe('A list of key features or benefits of the product/service.'),
  targetAudience: z.string().optional().describe('The primary target audience for this listing.'),
  keywords: z.array(z.string()).optional().describe('Optional SEO keywords to include.'),
  tone: z.string().optional().describe('The desired tone for the description (e.g., "professional", "friendly", "luxurious").'),
  length: z.enum(['short', 'medium', 'long']).default('medium').describe('Desired length of the description.'),
});
export type GenerateListingDescriptionInput = z.infer<typeof GenerateListingDescriptionInputSchema>;

const GenerateListingDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated compelling and optimized listing description.'),
});
export type GenerateListingDescriptionOutput = z.infer<typeof GenerateListingDescriptionOutputSchema>;

export async function generateListingDescription(input: GenerateListingDescriptionInput): Promise<GenerateListingDescriptionOutput> {
  return generateListingDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: {schema: GenerateListingDescriptionInputSchema},
  output: {schema: GenerateListingDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling and optimized product/service descriptions for a cross-category marketplace.\nYour goal is to generate a description that attracts the target audience, highlights key features, and is optimized for search engines.\n\nGenerate a {{length}} description for the following listing:\n\nTitle: {{{title}}}\nCategory: {{{category}}}\nKey Features: \n{{#each keyFeatures}}- {{{this}}}\n{{/each}}\n\n{{#if targetAudience}}Target Audience: {{{targetAudience}}}\n{{/if}}\n{{#if keywords}}SEO Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n{{/if}}\n{{#if tone}}Tone: {{{tone}}}\n{{/if}}\n\nMake sure the description is engaging, clear, and persuasive.`,
});

const generateListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: GenerateListingDescriptionInputSchema,
    outputSchema: GenerateListingDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
