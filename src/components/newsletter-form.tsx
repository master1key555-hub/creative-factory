"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.ok) {
        setMessage({ type: "ok", text: "Thanks. You're subscribed." });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          className="sm:flex-1"
          aria-label="Email address"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {message && (
        <p
          className={`mt-2 text-xs ${
            message.type === "ok" ? "text-primary" : "text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
