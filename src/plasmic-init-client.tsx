"use client";

import * as React from "react";
import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import Link from "next/link";
import { PLASMIC } from "./plasmic-init";

export function PlasmicClientRootProvider(
  props: Omit<
    React.ComponentProps<typeof PlasmicRootProvider>,
    "loader" | "Link"
  >,
) {
  return <PlasmicRootProvider loader={PLASMIC} Link={Link} {...props} />;
}
