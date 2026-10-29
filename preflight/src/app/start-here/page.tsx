import Link from "next/link";
import { ArrowRight, ConfBadge, TopNav } from "@/components/ui";

export const metadata = { title: "Start here: Composio managed OAuth · Preflight." };

const OUTGROW = [
  { t: "Your brand on the consent screen", d: "With the managed app, users see \"Composio wants to access your account\". This is the most common reason to switch." },
  { t: "Scopes beyond the defaults", d: "Composio requests sensible defaults per app. Anything extra needs your own app." },
  { t: "Shared rate limits", d: "Managed apps share quota across all Composio users. Your own app gets its own." },
  { t: "Faster triggers", d: "Managed auth polls at most every 15 minutes. Your own app can poll more often where supported." },
  { t: "Custom instances", d: "Self-hosted or regional variants, such as a private Salesforce domain, need their own app." },
  { t: "Enterprise requirements", d: "Some customers require your branding end to end." },
];

export default function StartHere() {
  return (
    <>
      <TopNav title="Start here" />

      <section className="frame" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}>
        <div className="tile tile--lg">
          <span className="label">the prototype path</span>
          <h1 className="h1">Prototyping? You may not need your own OAuth app yet.</h1>
          <p className="lead">
            Composio has already registered OAuth apps with many providers. Your users connect through Composio&apos;s app, and Composio stores and refreshes their tokens. No forms, reviews or audits on your side.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ConfBadge conf="sourced" href="https://docs.composio.dev/toolkits/managed-auth" />
            <span className="small">Composio docs, checked 29 Oct 2026</span>
          </div>
        </div>
        <div className="frame" style={{ gridTemplateColumns: "1fr 1fr", padding: 0 }}>
          <div className="tile tile--accent" style={{ gridColumn: "1 / -1" }}>
            <span className="label">time to launch</span>
            <div className="num-row"><span className="huge">~5</span><span style={{ fontSize: 16 }}>min</span></div>
            <span className="label">estimate: create a session, send a Connect Link</span>
          </div>
          <div className="tile sub" style={{ gridRow: "span 3" }}>
            <span className="label">managed by Composio</span>
            <span className="huge">124</span>
            <span className="small">OAuth providers</span>
          </div>
          <div className="tile sub" style={{ gridRow: "span 3" }}>
            <span className="label">bring your own app</span>
            <span className="huge">258</span>
            <span className="small">OAuth providers</span>
          </div>
        </div>
      </section>

      <section className="frame" aria-labelledby="outgrow-h" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <div className="tile tile--lg" style={{ gridColumn: "1 / -1" }}>
          <h2 id="outgrow-h" className="h2">When you&apos;ll outgrow it</h2>
          <p className="body">From Composio&apos;s own guidance on managed vs custom auth.</p>
        </div>
        {OUTGROW.map((o) => (
          <div key={o.t} className="tile sub" style={{ gridRow: "span 3" }}>
            <span className="h-sm">{o.t}</span>
            <span className="small">{o.d}</span>
            <ConfBadge conf="sourced" href="https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app" />
          </div>
        ))}
      </section>

      <section className="frame" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)" }}>
        <div className="tile tile--lg tile--accent">
          <span className="label">going to production</span>
          <h2 className="h2">You don&apos;t have to leave Composio.</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>
            Register your own OAuth app with the provider, add its client ID and secret as a custom auth config, and pass it to your session. Apps you don&apos;t configure keep using managed auth.
          </p>
        </div>
        <div className="tile tile--lg">
          <span className="h-sm">One thing to plan for</span>
          <p className="body">
            Users who connected through Composio&apos;s app will probably need to reconnect once you switch to your own, because they granted access to a different app. Composio&apos;s Gmail docs confirm users must reconnect after a scope change; we haven&apos;t found the app-switch case stated directly.
          </p>
          <ConfBadge conf="uncertain" />
          <Link href="/#grid" className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
            Pick an app to see what your own takes <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
