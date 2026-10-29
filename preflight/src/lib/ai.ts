import Anthropic from "@anthropic-ai/sdk";

// Always use the site owner's own Anthropic key and call Anthropic directly.
// On Netlify, only PREFLIGHT_ANTHROPIC_API_KEY counts: the host can inject its own ANTHROPIC_API_KEY
// (Netlify's AI Gateway does), which would silently bill a different account.
// Locally, ANTHROPIC_API_KEY from .env.local is used.
const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.SITE_ID);

export function anthropicKey(): string | undefined {
  return process.env.PREFLIGHT_ANTHROPIC_API_KEY || (onNetlify ? undefined : process.env.ANTHROPIC_API_KEY) || undefined;
}

export function anthropicClient() {
  return new Anthropic({ apiKey: anthropicKey(), baseURL: "https://api.anthropic.com" });
}
