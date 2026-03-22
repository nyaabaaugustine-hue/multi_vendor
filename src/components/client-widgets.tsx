"use client";

/**
 * ClientWidgets — wraps all floating UI that requires ssr:false.
 * Next.js 15 forbids dynamic() with ssr:false in Server Components.
 * This client wrapper is the correct solution — it's lazy-loaded from
 * the Server Component layout, and the individual widgets inside it
 * are themselves client components that use browser APIs.
 */

import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(
  () => import('@/components/whatsapp-button').then(m => ({ default: m.WhatsAppButton })),
  { ssr: false }
);
const PostAdButton = dynamic(
  () => import('@/components/post-ad-button').then(m => ({ default: m.PostAdButton })),
  { ssr: false }
);
const LiveActivityFeed = dynamic(
  () => import('@/components/live-activity-feed').then(m => ({ default: m.LiveActivityFeed })),
  { ssr: false }
);
const ShoppingAssistant = dynamic(
  () => import('@/components/shopping-assistant').then(m => ({ default: m.ShoppingAssistant })),
  { ssr: false }
);
const EscrowCheckoutFlow = dynamic(
  () => import('@/components/escrow-checkout-flow').then(m => ({ default: m.EscrowCheckoutFlow })),
  { ssr: false }
);
const PrivacyPopup = dynamic(
  () => import('@/components/privacy-popup').then(m => ({ default: m.PrivacyPopup })),
  { ssr: false }
);

export function ClientWidgets() {
  return (
    <>
      <WhatsAppButton />
      <PostAdButton />
      <LiveActivityFeed />
      {/* <ShoppingAssistant /> — Temporarily disabled for stabilization */}
      <EscrowCheckoutFlow />
      <PrivacyPopup />
    </>
  );
}
