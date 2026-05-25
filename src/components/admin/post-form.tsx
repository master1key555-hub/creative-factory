"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createPost,
  updatePost,
  deletePost,
} from "@/lib/actions/posts";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;
  const [coverUrl, setCoverUrl] = useState(post?.cover_url || "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.og_image_url || "");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [delPending, startDel] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const formData = new FormData(e.currentTarget);
    formData.set("cover_url", coverUrl);
    formData.set("og_image_url", ogImageUrl);
    startTransition(async () => {
      if (isEdit && post) {
        const result = await updatePost(post.id, formData);
        if (!result.ok) setError(result.error);
        else setOk("Post saved.");
      } else {
        const result = await createPost(formData);
        if (!result.ok) setError(result.error);
        else if (result.id) router.push(`/admin/posts/${result.id}`);
      }
    });
  }

  function handleDelete() {
    if (!post) return;
    if (!confirm("Delete this post permanently?")) return;
    startDel(async () => {
      await deletePost(post.id);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={post?.title || ""}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={post?.slug || ""}
              placeholder="auto-generated from title"
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt || ""}
              placeholder="One-sentence summary, shown on the blog list."
            />
          </div>
          <div>
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              name="content"
              rows={20}
              required
              defaultValue={post?.content || ""}
              className="font-mono text-sm"
              placeholder={`# Heading

Write your essay in Markdown. Use **bold**, _italic_, [links](https://example.com), images ![alt](url), lists, > quotes, and \`code\`.`}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div>
            <Label>Status</Label>
            <select
              name="status"
              defaultValue={post?.status || "draft"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <Label htmlFor="author_name">Author name</Label>
            <Input
              id="author_name"
              name="author_name"
              defaultValue={post?.author_name || ""}
              placeholder="Creative Factory"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={(post?.tags || []).join(", ")}
              placeholder="design, craft"
            />
          </div>
          <div>
            <Label>Cover image</Label>
            <ImageUpload
              value={coverUrl}
              onChange={setCoverUrl}
              folder="posts"
            />
          </div>
          <fieldset className="border border-border rounded-md p-4 space-y-3">
            <legend className="text-xs uppercase tracking-widest text-muted-foreground px-1">
              SEO
            </legend>
            <div>
              <Label htmlFor="seo_title">SEO title</Label>
              <Input
                id="seo_title"
                name="seo_title"
                defaultValue={post?.seo_title || ""}
              />
            </div>
            <div>
              <Label htmlFor="seo_description">SEO description</Label>
              <Textarea
                id="seo_description"
                name="seo_description"
                rows={2}
                defaultValue={post?.seo_description || ""}
              />
            </div>
            <div>
              <Label>OG image</Label>
              <ImageUpload
                value={ogImageUrl}
                onChange={setOgImageUrl}
                folder="og"
              />
            </div>
          </fieldset>
        </aside>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {ok && <p className="text-sm text-primary">{ok}</p>}

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={delPending}
            className="ml-auto"
          >
            {delPending ? "Deleting…" : "Delete post"}
          </Button>
        )}
      </div>
    </form>
  );
}
