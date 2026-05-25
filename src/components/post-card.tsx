import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostCard({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: "default" | "featured" | "compact";
}) {
  const date = post.published_at || post.created_at;
  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="serif text-4xl text-primary/30">CF</span>
            </div>
          )}
        </div>
        <div className="mt-6">
          {post.tags.length > 0 && (
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
              {post.tags[0]}
            </p>
          )}
          <h3 className="serif text-3xl md:text-4xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-3 text-muted-foreground text-base leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            {formatDate(date)}
            {post.author_name ? ` · ${post.author_name}` : ""}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 py-4 border-b border-border last:border-0"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center serif text-primary/40">
              CF
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="serif text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(date)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="serif text-3xl text-primary/30">CF</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        {post.tags.length > 0 && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
            {post.tags[0]}
          </p>
        )}
        <h3 className="serif text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {formatDate(date)}
        </p>
      </div>
    </Link>
  );
}
