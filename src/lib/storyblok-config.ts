// Lightweight Storyblok configuration (env + CDN host) with no React component
// imports. Routes that only need to talk to the Storyblok API (e.g. sitemap)
// import from here instead of `@/lib/storyblok` so they don't pull the whole
// component registry into their bundle.
export const STORYBLOK_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;

// Storyblok serves from a region-specific API host. EU is the default; spaces
// created in the US/AP/CA regions need this set so requests hit the right host.
export const STORYBLOK_REGION = process.env.NEXT_PUBLIC_STORYBLOK_REGION ?? "eu";

export const isStoryblokConfigured = Boolean(STORYBLOK_TOKEN);

// Base host of the Storyblok Content Delivery API for the configured region.
export function storyblokCdnBase(): string {
  switch (STORYBLOK_REGION) {
    case "us":
      return "https://api-us.storyblok.com";
    case "ap":
      return "https://api-ap.storyblok.com";
    case "ca":
      return "https://api-ca.storyblok.com";
    default:
      return "https://api.storyblok.com";
  }
}
