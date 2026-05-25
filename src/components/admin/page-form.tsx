"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePage } from "@/lib/actions/pages";
import type { Page } from "@/lib/types";

export function PageForm({ slug, page }: { slug: string; page?: Page }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePage(slug, formData);
      if (result.ok) setMsg({ ok: true, text: "Saved." });
      else setMsg({ ok: false, text: result.error });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor={`${slug}-title`}>Title</Label>
        <Input
          id={`${slug}-title`}
          name="title"
          required
          defaultValue={page?.title || ""}
        />
      </div>
      <div>
        <Label htmlFor={`${slug}-content`}>Content (Markdown)</Label>
        <Textarea
          id={`${slug}-content`}
          name="content"
          rows={12}
          defaultValue={page?.content || ""}
          className="font-mono text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${slug}-seo-title`}>SEO title</Label>
          <Input
            id={`${slug}-seo-title`}
            name="seo_title"
            defaultValue={page?.seo_title || ""}
          />
        </div>
        <div>
          <Label htmlFor={`${slug}-seo-desc`}>SEO description</Label>
          <Input
            id={`${slug}-seo-desc`}
            name="seo_description"
            defaultValue={page?.seo_description || ""}
          />
        </div>
      </div>
      {msg && (
        <p
          className={`text-sm ${
            msg.ok ? "text-primary" : "text-destructive"
          }`}
        >
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
