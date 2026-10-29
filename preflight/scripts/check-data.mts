// Consistency checks for the guide library. Run: node scripts/check-data.mts
import { CARDS } from "../src/data/cards.ts";
import { github } from "../src/data/guides/github.ts";
import { gmail } from "../src/data/guides/gmail.ts";
import { linkedin } from "../src/data/guides/linkedin.ts";
import { metaInstagram } from "../src/data/guides/meta-instagram.ts";
import { microsoft365 } from "../src/data/guides/microsoft-365.ts";
import { notion } from "../src/data/guides/notion.ts";
import { salesforce } from "../src/data/guides/salesforce.ts";
import { shopify } from "../src/data/guides/shopify.ts";
import { slack } from "../src/data/guides/slack.ts";
import { xTwitter } from "../src/data/guides/x-twitter.ts";

const guides = [github, gmail, linkedin, metaInstagram, microsoft365, notion, salesforce, shopify, slack, xTwitter];
const problems: string[] = [];

for (const g of guides) {
  const ids = new Set(g.sources.map((s) => s.id));
  const ucIds = new Set(g.useCases.map((u) => u.id));
  const check = (where: string, refs: string[] | undefined) =>
    (refs ?? []).forEach((r) => ids.has(r) || problems.push(`${g.slug}: ${where} cites unknown source "${r}"`));
  const checkUses = (where: string, uses: string[] | undefined) =>
    (uses ?? []).forEach((u) => ucIds.has(u) || problems.push(`${g.slug}: ${where} uses unknown use case "${u}"`));

  if (!ucIds.has(g.defaultUc)) problems.push(`${g.slug}: defaultUc "${g.defaultUc}" missing`);
  check("needOwnApp", g.needOwnApp.sources);
  check("adminAsk", g.adminAsk?.sources);
  for (const u of g.useCases) {
    check(`use case ${u.id} difficulty`, u.diffSources);
    check(`use case ${u.id} effort`, u.effort.sources);
    check(`use case ${u.id} wait`, u.wait?.sources);
    check(`use case ${u.id} cost`, u.cost.sources);
    if (u.diffConf === "sourced" && !u.diffSources?.length) problems.push(`${g.slug}: use case ${u.id} difficulty is "sourced" with no source`);
    if (u.wait?.conf === "sourced" && !u.wait.sources?.length) problems.push(`${g.slug}: use case ${u.id} wait is "sourced" with no source`);
    if (u.cost.conf === "sourced" && !u.cost.sources?.length) problems.push(`${g.slug}: use case ${u.id} cost is "sourced" with no source`);
    const steps = g.steps.filter((s) => !s.uses || s.uses.includes(u.id));
    if (steps.length < 2) problems.push(`${g.slug}: use case ${u.id} has fewer than 2 steps`);
  }
  for (const s of g.steps) {
    check(`step ${s.id}`, s.sources);
    checkUses(`step ${s.id}`, s.uses);
    if (s.conf === "sourced" && !s.sources.length) problems.push(`${g.slug}: step ${s.id} is "sourced" with no source`);
    if (s.who === "you" && !s.why) problems.push(`${g.slug}: step ${s.id} needs the developer but says no why`);
  }
  for (const r of g.requirements) {
    check(`requirement ${r.id}`, r.sources);
    checkUses(`requirement ${r.id}`, r.uses);
    if (r.conf === "sourced" && !r.sources.length) problems.push(`${g.slug}: requirement ${r.id} is "sourced" with no source`);
  }
  for (const b of g.blockers) {
    check(`blocker "${b.title}"`, b.sources);
    checkUses(`blocker "${b.title}"`, b.uses);
  }
  const all = JSON.stringify(g);
  if (all.includes('"conf":"tested"') && g.tested.length === 0) problems.push(`${g.slug}: claims marked tested but no test runs recorded`);
  for (const s of g.sources) if (!s.url.startsWith("https://")) problems.push(`${g.slug}: source ${s.id} is not https`);
  for (const t of g.tested) {
    const m = t.result.match(/All (\d+) load/);
    if (m && Number(m[1]) !== g.sources.length) problems.push(`${g.slug}: test run says ${m[1]} links but the guide has ${g.sources.length} sources`);
  }
  const unused = [...ids].filter((id) => !all.replace(`"id":"${id}"`, "").includes(`"${id}"`));
  if (unused.length) problems.push(`${g.slug}: sources never cited: ${unused.join(", ")}`);
}

const slugs = new Set(guides.map((g) => g.slug));
for (const c of CARDS) if (!slugs.has(c.slug)) problems.push(`card ${c.slug} has no guide`);

console.log(problems.length ? problems.join("\n") : `OK: ${guides.length} guides, ${CARDS.length} cards, no problems.`);
process.exitCode = problems.length ? 1 : 0;
