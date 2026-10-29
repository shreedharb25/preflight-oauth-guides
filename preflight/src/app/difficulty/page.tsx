import { TopNav } from "@/components/ui";

export const metadata = { title: "How we rate difficulty · Preflight." };

const LEVELS = [
  { level: "Easy", rule: "No provider review for your use case. You can be live the same day.", eg: "GitHub, X (paid per call), Gmail sign-in only, Shopify for a single store" },
  { level: "Medium", rule: "A review or verification measured in days, or each customer's admin must approve your app. No paid audit.", eg: "Gmail sending, Microsoft 365, Salesforce, posting to Slack" },
  { level: "Hard", rule: "Review measured in weeks, a paid third-party security audit, or business verification documents.", eg: "Gmail reading, Shopify App Store, Instagram, reading Slack history at scale" },
  { level: "Gated", rule: "You must apply to a partner program. Approval isn't guaranteed, and a rejection can mean starting again.", eg: "LinkedIn company pages and ads" },
];

const MOVERS = [
  { t: "What you ask for", d: "Permissions (scopes) are the biggest lever. Gmail sign-in is easy; reading email is hard." },
  { t: "Who installs it", d: "One customer or your own workspace is often review-free. A public listing usually isn't." },
  { t: "Whose admins are involved", d: "Enterprise tools often need each customer's admin to approve you. That's time you can't control." },
  { t: "Whether a managed app exists", d: "If Composio already has an approved app, you can launch today and do the hard part later." },
];

export default function DifficultyPage() {
  return (
    <>
      <TopNav title="How we rate difficulty" />
      <section className="frame frame--col">
        <div className="tile tile--lg">
          <h1 className="h1">How we rate difficulty.</h1>
          <p className="lead" style={{ maxWidth: 820 }}>
            We rate each app per use case, because the same provider can be a 10-minute job or a six-week one depending on what you ask for. Time to launch is your own effort plus the time spent waiting on the provider.
          </p>
        </div>
      </section>
      <section className="frame" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {LEVELS.map((l) => (
          <div key={l.level} className={`tile tile--lg sub${l.level === "Gated" ? " tile--accent" : ""}`} style={{ gridRow: "span 4" }}>
            <span className="label">difficulty</span>
            <span style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1 }}>{l.level}</span>
            <p className="body" style={l.level === "Gated" ? { color: "var(--accent-ink)" } : undefined}>{l.rule}</p>
            <span className="label">examples: {l.eg}</span>
          </div>
        ))}
      </section>
      <section className="frame" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <div className="tile tile--lg" style={{ gridColumn: "1 / -1" }}>
          <h2 className="h2">What moves an app between levels</h2>
        </div>
        {MOVERS.map((m) => (
          <div key={m.t} className="tile sub" style={{ gridRow: "span 2" }}>
            <span className="h-sm">{m.t}</span>
            <span className="small">{m.d}</span>
          </div>
        ))}
      </section>
    </>
  );
}
