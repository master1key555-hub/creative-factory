import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface FeatureBlok extends SbBlokData {
  name?: string;
}

// Matches Storyblok's standard blueprint "feature" block (a single card).
export default function Feature({ blok }: { blok: FeatureBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="rounded-lg border border-border bg-card p-6 text-center"
    >
      <p className="serif text-xl font-semibold">{blok.name}</p>
    </div>
  );
}
