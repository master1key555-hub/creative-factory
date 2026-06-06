// Storyblok server-side initialization (React Server Components entry).
//
// Visual CMS integration: pages are designed/edited in the Storyblok Visual
// Editor and rendered here via the Storyblok API. Configuration is driven by
// public environment variables (a Storyblok *preview* token is read-only and
// safe to expose to the browser, like the Plasmic public token).
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

import ButtonBlock from "@/components/storyblok/button-block";
import Columns from "@/components/storyblok/columns";
import ContactSection from "@/components/storyblok/contact-section";
import Feature from "@/components/storyblok/feature";
import Grid from "@/components/storyblok/grid";
import Hero from "@/components/storyblok/hero";
import HeroHome from "@/components/storyblok/hero-home";
import ImageBlock from "@/components/storyblok/image-block";
import Page from "@/components/storyblok/page";
import PostFeed from "@/components/storyblok/post-feed";
import ProsePage from "@/components/storyblok/prose-page";
import Teaser from "@/components/storyblok/teaser";
import TextBlock from "@/components/storyblok/text-block";

export const STORYBLOK_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;

// Storyblok serves from a region-specific API host. EU is the default; spaces
// created in the US/AP/CA regions need this set so requests hit the right host.
const STORYBLOK_REGION = process.env.NEXT_PUBLIC_STORYBLOK_REGION ?? "eu";

export const isStoryblokConfigured = Boolean(STORYBLOK_TOKEN);

export const getStoryblokApi = storyblokInit({
  accessToken: STORYBLOK_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: STORYBLOK_REGION,
  },
  components: {
    // Storyblok standard blueprint blocks (the space ships with these).
    page: Page,
    teaser: Teaser,
    grid: Grid,
    feature: Feature,
    // Extra reusable blocks available for richer pages.
    hero: Hero,
    text: TextBlock,
    image: ImageBlock,
    button: ButtonBlock,
    columns: Columns,
    // Blocks that mirror the site's existing pages (transferred from code).
    hero_home: HeroHome,
    post_feed: PostFeed,
    prose_page: ProsePage,
    contact_section: ContactSection,
  },
});
