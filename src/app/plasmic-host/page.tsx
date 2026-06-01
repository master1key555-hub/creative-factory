"use client";

import * as React from "react";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";

// This route lets Plasmic Studio render your app as the design canvas
// ("app host"), so the pages you build live inside this codebase's context.
// Point your Plasmic project's host URL at: <your-site>/plasmic-host
export default function PlasmicHost() {
  return PLASMIC ? <PlasmicCanvasHost /> : null;
}
