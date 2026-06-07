import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal Cloudflare config. No R2 incremental cache binding is configured, so
// ISR/revalidated pages are regenerated per request instead of being cached in
// R2. This keeps the free-tier setup simple (no R2 bucket required). Add an
// `incrementalCache` override here later if persistent caching is desired.
export default defineCloudflareConfig({});
