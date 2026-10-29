import type { Guide } from "@/lib/types";
import { github } from "./github";
import { gmail } from "./gmail";
import { linkedin } from "./linkedin";
import { metaInstagram } from "./meta-instagram";
import { microsoft365 } from "./microsoft-365";
import { notion } from "./notion";
import { salesforce } from "./salesforce";
import { shopify } from "./shopify";
import { slack } from "./slack";
import { xTwitter } from "./x-twitter";

export const GUIDES: Record<string, Guide> = Object.fromEntries(
  [github, gmail, linkedin, metaInstagram, microsoft365, notion, salesforce, shopify, slack, xTwitter].map((g) => [g.slug, g]),
);

export function getGuide(slug: string): Guide | undefined {
  return GUIDES[slug];
}
