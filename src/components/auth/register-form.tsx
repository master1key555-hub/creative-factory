"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  signUpWithPassword,
  signInWithGoogleAction,
} from "@/lib/actions/auth";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const [googlePending, startGoogle] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpWithPassword(formData);
      if (!result.ok) setError(result.error);
      else setSuccess(true);
    });
  }

  function google() {
    setError(null);
    startGoogle(async () => {
      const result = await signInWithGoogleAction();
      if (result && !result.ok) setError(result.error);
    });
  }

  if (success) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="serif text-xl font-semibold mb-2">Check your inbox.</p>
        <p className="text-sm text-muted-foreground">
          We sent you a confirmation email. Click the link to finish signing up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11"
        onClick={google}
        disabled={googlePending || pending}
      >
        <GoogleIcon />
        {googlePending ? "Connecting…" : "Sign up with Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground tracking-widest">
            or with email
          </span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
          />
        </div>
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
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
      />
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#FBBC05"
        d="M3.88 10.78c-.21-.61-.32-1.27-.32-1.95s.11-1.34.32-1.95L.96 4.62C.28 5.96 0 7.45 0 9s.28 3.04.96 4.38l2.92-2.6z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
      />
    </svg>
  );
}
