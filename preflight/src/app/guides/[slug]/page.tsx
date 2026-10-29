import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import GuideView from "@/components/GuideView";
import { ArrowRight, TopNav } from "@/components/ui";
import { CARDS } from "@/data/cards";
import { librarySlug } from "@/data/aliases";
import { getGuide } from "@/data/guides";
import { readGenerated } from "@/lib/generate/store";

export function generateStaticParams() {
  return CARDS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const name = CARDS.find((c) => c.slug === slug)?.name ?? (await readGenerated(slug))?.name;
  return { title: name ? `${name} OAuth app guide · Preflight.` : "Guide · Preflight." };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const canonical = librarySlug(slug);
  if (canonical && canonical !== slug) redirect(`/guides/${canonical}`);
  const card = CARDS.find((c) => c.slug === slug);
  const guide = getGuide(slug) ?? (await readGenerated(slug));
  if (!card && !guide) notFound();

  if (guide) {
    const uc = typeof sp.uc === "string" ? sp.uc : guide.defaultUc;
    return <GuideView guide={guide} initialUc={uc} />;
  }

  // Phase 1: the card summary is real, the full guide page lands in phase 2.
  return (
    <>
      <TopNav title={card!.name} />
      <section className="frame frame--col">
        <div className="tile tile--lg">
          <span className="label">full guide in progress</span>
          <h1 className="h1">{card!.name}</h1>
          <p className="lead" style={{ maxWidth: 820 }}>{card!.gotcha}</p>
          <p className="body">The summary on the card is sourced. The full guide for this app is being written from the same research.</p>
          <Link href="/" className="btn" style={{ alignSelf: "flex-start" }}>Back to all apps <ArrowRight /></Link>
        </div>
      </section>
    </>
  );
}
