import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface HeroBlok extends SbBlokData {
  heading?: string;
  subheading?: string;
  eyebrow?: string;
}

export default function Hero({ blok }: { blok: HeroBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28"
    >
      {blok.eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {blok.eyebrow}
        </p>
      ) : null}
      {blok.heading ? (
        <h1 className="serif mt-4 text-4xl font-semibold sm:text-6xl">
          {blok.heading}
        </h1>
      ) : null}
      {blok.subheading ? (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {blok.subheading}
        </p>
      ) : null}
    </section>
  );
}
