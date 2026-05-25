"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      onClick={() => startTransition(() => signOut())}
      disabled={pending}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
