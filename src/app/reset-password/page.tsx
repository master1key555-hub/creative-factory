"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (!result.ok) setError(result.error);
      else router.push("/profile");
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="serif text-4xl font-semibold mb-2 text-center">
        Set a new password
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Choose a password you&apos;ll remember.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </div>
  );
}
