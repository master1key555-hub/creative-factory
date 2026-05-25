"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateSettings } from "@/lib/actions/settings";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || "");
  const [ogUrl, setOgUrl] = useState(settings.default_og_image || "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    formData.set("logo_url", logoUrl);
    formData.set("default_og_image", ogUrl);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.ok) setMsg({ ok: true, text: "Settings saved." });
      else setMsg({ ok: false, text: result.error });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset className="border border-border rounded-lg p-5 space-y-4">
        <legend className="text-xs uppercase tracking-widest text-muted-foreground px-1">
          Brand
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="site_name">Site name</Label>
            <Input
              id="site_name"
              name="site_name"
              required
              defaultValue={settings.site_name}
            />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={settings.tagline || ""}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Logo image</Label>
            <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="brand" />
          </div>
          <div>
            <Label>Default OG image</Label>
            <ImageUpload value={ogUrl} onChange={setOgUrl} folder="brand" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="primary_color">Primary color</Label>
            <Input
              id="primary_color"
              name="primary_color"
              defaultValue={settings.primary_color || "#c9a961"}
              placeholder="#c9a961"
            />
          </div>
          <div>
            <Label htmlFor="secondary_color">Secondary color</Label>
            <Input
              id="secondary_color"
              name="secondary_color"
              defaultValue={settings.secondary_color || "#6b1f2a"}
              placeholder="#6b1f2a"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-border rounded-lg p-5 space-y-4">
        <legend className="text-xs uppercase tracking-widest text-muted-foreground px-1">
          Social media
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/your-handle"
              defaultValue={settings.instagram_url === "#" ? "" : settings.instagram_url || ""}
            />
          </div>
          <div>
            <Label htmlFor="telegram_url">Telegram URL</Label>
            <Input
              id="telegram_url"
              name="telegram_url"
              type="url"
              placeholder="https://t.me/your-channel"
              defaultValue={settings.telegram_url === "#" ? "" : settings.telegram_url || ""}
            />
          </div>
          <div>
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input
              id="facebook_url"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/your-page"
              defaultValue={settings.facebook_url === "#" ? "" : settings.facebook_url || ""}
            />
          </div>
          <div>
            <Label htmlFor="twitter_url">Twitter / X URL</Label>
            <Input
              id="twitter_url"
              name="twitter_url"
              type="url"
              placeholder="https://twitter.com/your-handle"
              defaultValue={settings.twitter_url === "#" ? "" : settings.twitter_url || ""}
            />
          </div>
          <div>
            <Label htmlFor="pinterest_url">Pinterest URL</Label>
            <Input
              id="pinterest_url"
              name="pinterest_url"
              type="url"
              placeholder="https://pinterest.com/your-profile"
              defaultValue={settings.pinterest_url === "#" ? "" : settings.pinterest_url || ""}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-border rounded-lg p-5 space-y-4">
        <legend className="text-xs uppercase tracking-widest text-muted-foreground px-1">
          Footer
        </legend>
        <div>
          <Label htmlFor="footer_text">Footer text</Label>
          <Textarea
            id="footer_text"
            name="footer_text"
            rows={2}
            defaultValue={settings.footer_text || ""}
          />
        </div>
      </fieldset>

      {msg && (
        <p className={`text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
