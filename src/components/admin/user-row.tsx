"use client";

import { useTransition } from "react";
import { setUserRole, setUserBanned } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

export function UserRow({ user }: { user: Profile }) {
  const [pending, startTransition] = useTransition();

  function toggleRole() {
    startTransition(async () => {
      await setUserRole(user.id, user.role === "admin" ? "user" : "admin");
    });
  }

  function toggleBan() {
    startTransition(async () => {
      await setUserBanned(user.id, !user.banned);
    });
  }

  return (
    <tr>
      <td className="px-4 py-3">
        <p className="font-medium">{user.full_name || "—"}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            user.role === "admin"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        {user.banned ? (
          <span className="text-xs text-destructive">Suspended</span>
        ) : (
          <span className="text-xs text-muted-foreground">Active</span>
        )}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRole}
          disabled={pending}
        >
          {user.role === "admin" ? "Demote" : "Promote"}
        </Button>
        <Button
          variant={user.banned ? "outline" : "destructive"}
          size="sm"
          onClick={toggleBan}
          disabled={pending}
        >
          {user.banned ? "Unsuspend" : "Suspend"}
        </Button>
      </td>
    </tr>
  );
}
