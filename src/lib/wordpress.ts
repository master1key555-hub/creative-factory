import "server-only";

/**
 * Minimal helper for talking to a headless WordPress site via the
 * WPGraphQL plugin. Set WORDPRESS_GRAPHQL_URL in your environment, e.g.
 *
 *   WORDPRESS_GRAPHQL_URL=https://your-wordpress-site.com/graphql
 *
 * See docs/wordpress-headless.md for the full setup (plugins, ACF fields,
 * and how the data below was produced and tested).
 */
const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;

export type WpQueryOptions = {
  /** Variables passed to the GraphQL query. */
  variables?: Record<string, unknown>;
  /**
   * Seconds before Next.js revalidates the cached response (ISR).
   * Defaults to 60. Use 0 to always fetch fresh data.
   */
  revalidate?: number;
  /** Cache tags for on-demand revalidation via revalidateTag(). */
  tags?: string[];
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * Runs a GraphQL query against the configured WordPress endpoint and returns
 * the `data` payload. Throws if the endpoint is not configured or the API
 * returns GraphQL errors.
 */
export async function wpQuery<T>(
  query: string,
  { variables, revalidate = 60, tags }: WpQueryOptions = {},
): Promise<T> {
  if (!WORDPRESS_GRAPHQL_URL) {
    throw new Error(
      "WORDPRESS_GRAPHQL_URL is not set. Add it to your environment " +
        "(see docs/wordpress-headless.md).",
    );
  }

  const res = await fetch(WORDPRESS_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // fetch is uncached by default in Next 16; opt into ISR-style caching.
    next: { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(`WordPress responded with ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `WordPress GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }

  if (!json.data) {
    throw new Error("WordPress GraphQL response had no data.");
  }

  return json.data;
}

/** Shape of the ACF "Homepage Fields" group exposed via WPGraphQL for ACF. */
export type HomepageFields = {
  heading: string | null;
  videoUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

export type HomepageData = {
  page: {
    title: string | null;
    uri: string | null;
    homepageFields: HomepageFields | null;
  } | null;
};

/**
 * Tested GraphQL query — verified against a live WordPress + WPGraphQL + ACF
 * (with the "WPGraphQL for ACF" bridge) instance. `homepageFields` is the
 * graphql_field_name of the ACF field group; each field has show_in_graphql
 * enabled so it appears in the schema.
 */
export const HOMEPAGE_QUERY = /* GraphQL */ `
  query HomePage($uri: ID!) {
    page(id: $uri, idType: URI) {
      title
      uri
      homepageFields {
        heading
        videoUrl
        buttonText
        buttonLink
      }
    }
  }
`;

/** Fetches the ACF fields for a page by its URI (defaults to the home page). */
export async function getHomepage(uri = "/home/"): Promise<HomepageData> {
  return wpQuery<HomepageData>(HOMEPAGE_QUERY, {
    variables: { uri },
    tags: ["wordpress:page", `wordpress:page:${uri}`],
  });
}
