import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

type DividerBlok = SbBlokData;

export default function Divider({ blok }: { blok: DividerBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="mx-auto max-w-3xl px-4 sm:px-6"
    >
      <hr className="gold-divider my-8" />
    </div>
  );
}
