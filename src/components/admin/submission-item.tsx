"use client";

import { useTransition, useState } from "react";
import { markSubmissionRead, deleteSubmission } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ContactSubmission } from "@/lib/types";

export function SubmissionItem({ submission }: { submission: ContactSubmission }) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      className={`rounded-lg border p-4 ${
        submission.read ? "border-border" : "border-primary/50 bg-primary/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium">
            {submission.name}{" "}
            <a
              href={`mailto:${submission.email}`}
              className="text-sm text-muted-foreground font-normal hover:text-primary"
            >
              · {submission.email}
            </a>
          </p>
          {submission.subject && (
            <p className="text-sm font-medium mt-1">{submission.subject}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(submission.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!submission.read && (
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await markSubmissionRead(submission.id, true);
                })
              }
            >
              Mark read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide" : "View"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this submission?")) {
                startTransition(async () => {
                  await deleteSubmission(submission.id);
                });
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 p-4 bg-background rounded-md border border-border">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {submission.message}
          </p>
          <a
            href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.subject || "Your message")}`}
            className="inline-block mt-4 text-sm font-medium text-primary underline underline-offset-4"
          >
            Reply via email →
          </a>
        </div>
      )}
    </li>
  );
}
