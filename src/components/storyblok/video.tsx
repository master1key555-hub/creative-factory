import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface VideoBlok extends SbBlokData {
  url?: string;
  caption?: string;
}

// Accepts a YouTube/Vimeo page URL or a direct video file URL and renders the
// appropriate embed.
function toEmbed(url: string): { type: "iframe" | "file"; src: string } | null {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: "file", src: url };
  return { type: "iframe", src: url };
}

export default function Video({ blok }: { blok: VideoBlok }) {
  const embed = blok.url ? toEmbed(blok.url) : null;

  return (
    <figure
      {...storyblokEditable(blok)}
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
    >
      {embed?.type === "file" ? (
        <video src={embed.src} controls className="w-full rounded-lg" />
      ) : embed ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={embed.src}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={blok.caption || "Video"}
          />
        </div>
      ) : null}
      {blok.caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {blok.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
