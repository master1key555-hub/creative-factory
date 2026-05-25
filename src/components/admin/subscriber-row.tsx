"use client";

import { useTransition } from "react";
import { deleteSubscriber } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";

export function SubscriberRow({
  id,
  email,
  createdAt,
}: {
  id: string;
  email: string;
  createdAt: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <tr>
      <td className="px-4 py-3">{email}</td>
      <td className="px-4 py-3 text-muted-foreground">{createdAt}</td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (confirm(`Remove ${email}?`)) {
              startTransition(async () => {
                await deleteSubscriber(id);
              });
            }
          }}
        >
          Remove
        </Button>
      </td>
    </tr>
  );
}
