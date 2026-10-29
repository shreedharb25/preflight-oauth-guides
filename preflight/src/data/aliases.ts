// Names, products and domains people type for apps that are already in the library.
// Matching any of these opens the library guide instead of starting web research.
const ALIASES: Record<string, string[]> = {
  github: ["github", "github.com", "gh", "github apps", "github oauth"],
  gmail: ["gmail", "google mail", "gmail.com", "google", "google workspace", "gsuite", "g suite", "google.com"],
  slack: ["slack", "slack.com", "slack api"],
  notion: ["notion", "notion.so", "notion.com"],
  salesforce: ["salesforce", "salesforce.com", "sfdc", "sales cloud"],
  shopify: ["shopify", "shopify.com", "shopify app store"],
  "microsoft-365": ["microsoft 365", "microsoft365", "m365", "office 365", "office365", "o365", "outlook", "outlook.com", "microsoft outlook", "teams", "microsoft teams", "microsoft", "microsoft.com", "entra", "azure ad", "microsoft graph", "exchange online"],
  "meta-instagram": ["instagram", "instagram.com", "meta", "meta instagram", "instagram graph api", "ig"],
  linkedin: ["linkedin", "linkedin.com", "linked in"],
  "x-twitter": ["x", "x.com", "twitter", "twitter.com", "x twitter", "x (twitter)", "twitter api", "x api", "tweet", "tweets"],
};

const norm = (s: string) =>
  s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").replace(/\s+/g, " ");

const INDEX = new Map<string, string>();
for (const [slug, names] of Object.entries(ALIASES)) {
  INDEX.set(slug, slug);
  for (const n of names) INDEX.set(norm(n), slug);
}

/** The library slug for what the user typed, or undefined if it isn't a library app. */
export function librarySlug(input: string): string | undefined {
  const n = norm(input);
  if (!n) return undefined;
  return INDEX.get(n) ?? INDEX.get(n.replace(/\.(com|io|so|app|dev|ai)$/, "")) ?? INDEX.get(n.replace(/[^a-z0-9]+/g, " ").trim());
}

/** Every alias for a library slug, for the landing-page search. */
export function aliasesFor(slug: string): string[] {
  return ALIASES[slug] ?? [];
}
