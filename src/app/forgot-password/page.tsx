"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (!result.ok) setError(result.error);
      else setSent(true);
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="serif text-4xl font-semibold mb-2 text-center">
        Reset password
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      {sent ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
          <p className="serif text-xl font-semibold mb-2">Check your inbox.</p>
          <p className="text-sm text-muted-foreground">
            If an account exists with that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-11" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm text-center">
        <Link href="/login" className="text-muted-foreground underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </div>
  );
}
