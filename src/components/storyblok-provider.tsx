"use client";

import * as React from "react";

import { getStoryblokApi } from "@/lib/storyblok";

// Re-initializes the Storyblok client on the browser so the Visual Editor
// bridge (live, in-context editing) can connect. Renders children unchanged.
export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  getStoryblokApi();
  return children;
}
