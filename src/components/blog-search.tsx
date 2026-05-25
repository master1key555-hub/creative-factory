"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function BlogSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const usp = new URLSearchParams(params.toString());
    if (value.trim()) usp.set("q", value.trim());
    else usp.delete("q");
    usp.delete("page");
    router.push(`/blog?${usp.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative max-w-sm w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search essays…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
        aria-label="Search essays"
      />
    </form>
  );
}
