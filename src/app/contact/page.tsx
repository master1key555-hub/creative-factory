import { StoryblokStory } from "@storyblok/react/rsc";

import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/settings";
import { SocialLinks } from "@/components/social-links";
import { getStoryblokStory } from "@/lib/storyblok-page";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Creative Factory.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ _storyblok?: string }>;
}) {
  const { _storyblok } = await searchParams;
  const story = await getStoryblokStory("contact", _storyblok !== undefined);
  if (story) return <StoryblokStory story={story} />;

  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Get in touch
        </p>
        <h1 className="serif text-5xl sm:text-6xl font-semibold">
          Let&apos;s talk
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Project inquiries, press, or just to say hello. We read every message
          and reply within two working days.
        </p>
      </header>

      <ContactForm />

      <hr className="gold-divider my-12" />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Follow
        </p>
        <SocialLinks settings={settings} iconSize={20} />
      </div>
    </div>
  );
}
