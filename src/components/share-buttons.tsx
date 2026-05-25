"use client";

import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";
import {
  TwitterIcon,
  FacebookIcon,
  TelegramIcon,
} from "@/components/brand-icons";

export function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;
  const encoded = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mr-1">
        Share
      </span>
      <button
        onClick={copy}
        aria-label="Copy link"
        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encoded}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <TwitterIcon style={{ width: 16, height: 16 }} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <FacebookIcon style={{ width: 16, height: 16 }} />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Telegram"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <TelegramIcon style={{ width: 16, height: 16 }} />
      </a>
      {copied && (
        <span className="text-xs text-primary ml-2">Copied</span>
      )}
    </div>
  );
}
