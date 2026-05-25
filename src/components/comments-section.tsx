"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addComment, deleteComment } from "@/lib/actions/comments";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface Props {
  postId: string;
  postSlug: string;
  comments: Comment[];
  loggedIn: boolean;
  currentUserId: string | null;
  isAdmin: boolean;
}

export function CommentsSection({
  postId,
  postSlug,
  comments,
  loggedIn,
  currentUserId,
  isAdmin,
}: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addComment(postId, postSlug, text);
      if (!result.ok) setError(result.error);
      else setText("");
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteComment(id, postSlug);
    });
  }

  return (
    <section>
      <h2 className="serif text-2xl font-semibold mb-6">
        Comments ({comments.length})
      </h2>

      {loggedIn ? (
        <form onSubmit={submit} className="mb-10">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            required
            disabled={pending}
            className="mb-2"
            maxLength={2000}
          />
          {error && (
            <p className="text-sm text-destructive mb-2">{error}</p>
          )}
          <Button type="submit" disabled={pending || !text.trim()}>
            {pending ? "Posting…" : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="mb-10 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline underline-offset-4">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Be the first to comment.
        </p>
      ) : (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border-l-2 border-border pl-4 py-1 flex gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{c.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
              {(c.author_id === currentUserId || isAdmin) && (
                <button
                  onClick={() => remove(c.id)}
                  disabled={pending}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  aria-label="Delete comment"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
