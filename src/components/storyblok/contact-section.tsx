import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { SiteSettings } from "@/lib/types";

interface ContactSectionBlok extends SbBlokData {
  eyebrow?: string;
  title?: string;
  intro?: string;
  follow_label?: string;
}

// Mirrors the contact page: editable header text plus the working contact form
// and social links (the form logic and social URLs stay in code / settings).
export default async function ContactSection({
  blok,
}: {
  blok: ContactSectionBlok;
}) {
  let settings: Pick<
    SiteSettings,
    | "instagram_url"
    | "telegram_url"
    | "facebook_url"
    | "twitter_url"
    | "pinterest_url"
  > | null = null;
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select(
        "instagram_url,telegram_url,facebook_url,twitter_url,pinterest_url",
      )
      .limit(1)
      .maybeSingle();
    settings = data;
  } catch {
    settings = null;
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24"
    >
      <header className="mb-10">
        {blok.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            {blok.eyebrow}
          </p>
        ) : null}
        {blok.title ? (
          <h1 className="serif text-5xl sm:text-6xl font-semibold">
            {blok.title}
          </h1>
        ) : null}
        {blok.intro ? (
          <p className="mt-4 text-muted-foreground max-w-xl">{blok.intro}</p>
        ) : null}
      </header>

      <ContactForm />

      <hr className="gold-divider my-12" />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          {blok.follow_label || "Follow"}
        </p>
        <SocialLinks settings={settings} iconSize={20} />
      </div>
    </div>
  );
}
