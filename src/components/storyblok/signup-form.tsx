"use client";

import { useState, useTransition } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

import { submitLead } from "@/lib/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupFormBlok extends SbBlokData {
  heading?: string;
  description?: string;
  email_placeholder?: string;
  button_label?: string;
  success_message?: string;
  tag?: string;
}

// Reads UTM params + current path so each lead records where it came from.
function captureSource() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const referrer = document.referrer
    ? new URL(document.referrer).hostname
    : undefined;
  return {
    page_url: window.location.pathname,
    utm_source: q.get("utm_source") || undefined,
    utm_medium: q.get("utm_medium") || undefined,
    utm_campaign: q.get("utm_campaign") || undefined,
    source: q.get("utm_source") || referrer,
  };
}

export default function SignupForm({ blok }: { blok: SignupFormBlok }) {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitLead({
        email,
        tag: blok.tag,
        ...captureSource(),
      });
      if (result.ok) {
        setDone(true);
        setEmail("");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto my-8 max-w-2xl rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10"
    >
      {blok.heading ? (
        <h2 className="serif text-2xl font-semibold sm:text-3xl">
          {blok.heading}
        </h2>
      ) : null}
      {blok.description ? (
        <p className="mt-3 text-muted-foreground">{blok.description}</p>
      ) : null}

      {done ? (
        <p className="mt-6 text-primary">
          {blok.success_message || "Thanks! We'll be in touch."}
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            required
            placeholder={blok.email_placeholder || "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className="sm:flex-1"
            aria-label="Email address"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : blok.button_label || "Sign up"}
          </Button>
        </form>
      )}
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </section>
  );
}
