'use server';

import { AI_ENABLED } from './config';

export async function checkAiStatusAction() {
  return { enabled: AI_ENABLED };
}
