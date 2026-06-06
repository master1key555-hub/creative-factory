import StoryblokProvider from "@/components/storyblok-provider";

// Scope the Storyblok client/bridge to the /cms subtree so the rest of the
// site is untouched. The Visual Editor edits pages served from here.
export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoryblokProvider>{children}</StoryblokProvider>;
}
