"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/lib/actions/likes";

export function LikeButton({
  postId,
  postSlug,
  initialLikes,
  initialLiked,
  loggedIn,
}: {
  postId: string;
  postSlug: string;
  initialLikes: number;
  initialLiked: boolean;
  loggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikes);
  const [pending, startTransition] = useTransition();

  function handle() {
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => c + (wasLiked ? -1 : 1));
    startTransition(async () => {
      await toggleLike(postId, postSlug);
    });
  }

  return (
    <button
      onClick={handle}
      disabled={pending}
      className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer disabled:opacity-60"
      aria-pressed={liked}
    >
      <Heart
        className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`}
      />
      <span>
        {count} {count === 1 ? "like" : "likes"}
      </span>
    </button>
  );
}
