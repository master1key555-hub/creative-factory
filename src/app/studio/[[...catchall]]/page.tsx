import { notFound } from "next/navigation";
import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { PLASMIC, isPlasmicConfigured } from "@/plasmic-init";
import { PlasmicClientRootProvider } from "@/plasmic-init-client";

// Re-fetch from Plasmic at most once per minute (incremental static regeneration).
export const revalidate = 60;
// Allow paths that weren't generated at build time to be rendered on demand.
export const dynamicParams = true;

type PageParams = { catchall?: string[] };

function NotConfigured() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-amber-600">
        Plasmic
      </p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl">Plasmic is not connected yet</h1>
        <p className="mt-3 text-neutral-600">
          Set <code>NEXT_PUBLIC_PLASMIC_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_PLASMIC_API_TOKEN</code> in your environment, then
          reload. See <code>docs/plasmic-visual-builder.md</code> for setup.
        </p>
      </div>
    </div>
  );
}

function FetchError({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-amber-600">
        Plasmic
      </p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl">Could not load Plasmic page</h1>
        <p className="mt-3 text-neutral-600">
          Check that the project ID and API token are correct and the page is
          published in Plasmic Studio.
        </p>
        <p className="mt-4 text-sm text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

export default async function PlasmicLoaderPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  if (!isPlasmicConfigured) {
    return <NotConfigured />;
  }

  const { catchall } = await params;
  const plasmicPath = "/" + (catchall ? catchall.join("/") : "");

  let prefetchedData;
  try {
    prefetchedData = await PLASMIC.maybeFetchComponentData(plasmicPath);
  } catch (e) {
    return (
      <FetchError message={e instanceof Error ? e.message : "Unknown error"} />
    );
  }

  if (!prefetchedData || prefetchedData.entryCompMetas.length === 0) {
    notFound();
  }

  const pageMeta = prefetchedData.entryCompMetas[0];

  return (
    <PlasmicClientRootProvider
      prefetchedData={prefetchedData}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </PlasmicClientRootProvider>
  );
}
