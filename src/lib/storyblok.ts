// Storyblok server-side initialization (React Server Components entry).
//
// Visual CMS integration: pages are designed/edited in the Storyblok Visual
// Editor and rendered here via the Storyblok API. Configuration is driven by
// public environment variables (a Storyblok *preview* token is read-only and
// safe to expose to the browser, like the Plasmic public token).
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

import ButtonBlock from "@/components/storyblok/button-block";
import Columns from "@/components/storyblok/columns";
import Hero from "@/components/storyblok/hero";
import ImageBlock from "@/components/storyblok/image-block";
import Page from "@/components/storyblok/page";
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
    page: Page,
    hero: Hero,
    text: TextBlock,
    image: ImageBlock,
    button: ButtonBlock,
    columns: Columns,
  },
});
