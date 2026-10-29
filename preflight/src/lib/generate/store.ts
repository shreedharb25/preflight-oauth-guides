import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { Guide } from "@/lib/types";

// Generated guides are saved so each one keeps its own shareable link, and asking for the same app
// again costs no tokens. On Netlify they go to Netlify Blobs; locally, or if Blobs is unavailable,
// they go to a folder on disk.
//
// Blobs is called directly over HTTP using the context Netlify provides to the function: the
// @netlify/blobs client hung inside the Next.js runtime, while the same request made directly
// returns in milliseconds.
const DIR = process.env.NETLIFY_BLOBS_CONTEXT ? path.join(os.tmpdir(), "generated") : path.join(process.cwd(), ".data", "generated");
const clean = (slug: string) => slug.replace(/[^a-z0-9-]/g, "");

type BlobsContext = { edgeURL: string; uncachedEdgeURL?: string; token: string; siteID: string };
function blobsContext(): BlobsContext | undefined {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return undefined;
  try {
    const ctx = JSON.parse(Buffer.from(raw, "base64").toString()) as BlobsContext;
    return ctx.edgeURL && ctx.token && ctx.siteID ? ctx : undefined;
  } catch {
    return undefined;
  }
}

// Site-wide store, read with strong consistency so a guide is visible the moment it's saved.
async function blob(method: "GET" | "PUT", store: string, key: string, body?: string): Promise<string | null> {
  const ctx = blobsContext();
  if (!ctx) throw new Error("no blobs context");
  const base = ctx.uncachedEdgeURL ?? ctx.edgeURL;
  const res = await fetch(new URL(`/${ctx.siteID}/site:${store}/${encodeURIComponent(key)}`, base), {
    method,
    headers: { authorization: `Bearer ${ctx.token}` },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (method === "GET" && res.status === 404) return null;
  if (!res.ok) throw new Error(`blobs ${method} ${res.status}`);
  return method === "GET" ? res.text() : null;
}

async function readDisk(slug: string) {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, `${clean(slug)}.json`), "utf8")) as Guide;
  } catch {
    return undefined;
  }
}

export async function readGenerated(slug: string): Promise<Guide | undefined> {
  if (blobsContext()) {
    try {
      const text = await blob("GET", "generated-guides", clean(slug));
      if (text) return JSON.parse(text) as Guide;
    } catch (err) {
      console.error("[store] read failed:", (err as Error).message);
    }
  }
  return readDisk(slug);
}

export async function saveGenerated(guide: Guide) {
  if (blobsContext()) {
    try {
      await blob("PUT", "generated-guides", clean(guide.slug), JSON.stringify(guide));
      return;
    } catch (err) {
      console.error("[store] save failed, using disk:", (err as Error).message);
    }
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, `${clean(guide.slug)}.json`), JSON.stringify(guide, null, 2));
}

// Research notes between the two generation steps, kept server-side so a client can't alter them.
export type ResearchJob = { slug: string; name: string; notes: string; searchedUrls: string[]; createdAt: number; overview?: Record<string, unknown> };
const JOB_DIR = process.env.NETLIFY_BLOBS_CONTEXT ? path.join(os.tmpdir(), "jobs") : path.join(process.cwd(), ".data", "jobs");

export async function saveJob(id: string, job: ResearchJob) {
  if (blobsContext()) {
    try {
      await blob("PUT", "research-jobs", id, JSON.stringify(job));
      return;
    } catch (err) {
      console.error("[store] job save failed, using disk:", (err as Error).message);
    }
  }
  await fs.mkdir(JOB_DIR, { recursive: true });
  await fs.writeFile(path.join(JOB_DIR, `${id}.json`), JSON.stringify(job));
}

export async function readJob(id: string): Promise<ResearchJob | undefined> {
  const safe = id.replace(/[^a-zA-Z0-9-]/g, "");
  if (blobsContext()) {
    try {
      const text = await blob("GET", "research-jobs", safe);
      if (text) return JSON.parse(text) as ResearchJob;
    } catch (err) {
      console.error("[store] job read failed:", (err as Error).message);
    }
  }
  try {
    return JSON.parse(await fs.readFile(path.join(JOB_DIR, `${safe}.json`), "utf8")) as ResearchJob;
  } catch {
    return undefined;
  }
}

// A daily cap on paid AI calls for the public site, so a shared link can't run up the bill.
// Counted per UTC day in Blobs; not enforced locally. If the counter can't be read, the call is
// allowed (the Anthropic console spend limit remains the hard stop) and the failure is logged.
export const DAILY_LIMITS = { generate: 30, describe: 150 } as const;

export async function takeDailyQuota(kind: keyof typeof DAILY_LIMITS): Promise<boolean> {
  if (!blobsContext()) return true;
  const key = `${kind}-${new Date().toISOString().slice(0, 10)}`;
  try {
    const used = Number((await blob("GET", "usage", key)) ?? 0);
    if (used >= DAILY_LIMITS[kind]) return false;
    await blob("PUT", "usage", key, String(used + 1));
  } catch (err) {
    console.error("[store] quota check failed:", (err as Error).message);
  }
  return true;
}
