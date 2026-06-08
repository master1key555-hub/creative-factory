"use client";

import { useTransition } from "react";
import { deleteSubscriber } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";

export function SubscriberRow({
  id,
  email,
  createdAt,
  source,
  tag,
  pageUrl,
}: {
  id: string;
  email: string;
  createdAt: string;
  source?: string | null;
  tag?: string | null;
  pageUrl?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <tr>
      <td className="px-4 py-3">{email}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {source || tag || pageUrl ? (
          <div className="flex flex-col gap-0.5">
            {source ? <span>{source}</span> : null}
            {tag ? (
              <span className="text-xs uppercase tracking-widest text-primary">
                {tag}
              </span>
            ) : null}
            {pageUrl ? (
              <span className="text-xs text-muted-foreground">{pageUrl}</span>
            ) : null}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
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
