'use server';

import { AI_ENABLED } from './config';

/** Returns whether Tavily AI features are active. */
export async function checkAiStatusAction() {
  return { enabled: AI_ENABLED };
}
