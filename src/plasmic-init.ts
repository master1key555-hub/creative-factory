// Use the "react-server-conditional" entry so the same module works in both
// React Server Components (server loader) and Client Components (client loader).
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";

export const PLASMIC_PROJECT_ID = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID;
export const PLASMIC_API_TOKEN = process.env.NEXT_PUBLIC_PLASMIC_API_TOKEN;

export const isPlasmicConfigured = Boolean(
  PLASMIC_PROJECT_ID && PLASMIC_API_TOKEN,
);

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: PLASMIC_PROJECT_ID ?? "",
      token: PLASMIC_API_TOKEN ?? "",
    },
  ],
  // In development we fetch the latest (including unpublished) revisions so
  // changes show up instantly. In production only published changes render.
  preview: process.env.NODE_ENV !== "production",
});
