export const AI_ENABLED = false; // Forced disable for stabilization as requested

if (!AI_ENABLED) {
  if (typeof window === 'undefined') {
    console.warn('AI features are temporarily paused for system stabilization.');
  }
}
