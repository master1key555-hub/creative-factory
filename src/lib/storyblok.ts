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
import Divider from "@/components/storyblok/divider";
import Feature from "@/components/storyblok/feature";
import Grid from "@/components/storyblok/grid";
import Heading from "@/components/storyblok/heading";
import Hero from "@/components/storyblok/hero";
import HeroHome from "@/components/storyblok/hero-home";
import ImageBlock from "@/components/storyblok/image-block";
import Page from "@/components/storyblok/page";
import PostFeed from "@/components/storyblok/post-feed";
import ProsePage from "@/components/storyblok/prose-page";
import Quote from "@/components/storyblok/quote";
import SignupForm from "@/components/storyblok/signup-form";
import Teaser from "@/components/storyblok/teaser";
import TextBlock from "@/components/storyblok/text-block";
import Video from "@/components/storyblok/video";

import {
  STORYBLOK_TOKEN,
  STORYBLOK_REGION,
  isStoryblokConfigured,
} from "@/lib/storyblok-config";

export { STORYBLOK_TOKEN, isStoryblokConfigured };

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
    heading: Heading,
    text: TextBlock,
    image: ImageBlock,
    button: ButtonBlock,
    columns: Columns,
    quote: Quote,
    divider: Divider,
    video: Video,
    signup_form: SignupForm,
    // Blocks that mirror the site's existing pages (transferred from code).
    hero_home: HeroHome,
    post_feed: PostFeed,
    prose_page: ProsePage,
    contact_section: ContactSection,
  },
});
