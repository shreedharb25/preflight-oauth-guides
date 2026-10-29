import Link from "next/link";
import type { Confidence, Who } from "@/lib/types";

export function ArrowRight({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function Check({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export function ConfBadge({ conf, href }: { conf: Confidence; href?: string }) {
  const body = (
    <>
      <span className="dot" />
      {conf}
    </>
  );
  if (href) {
    return (
      <a className={`conf conf--${conf}`} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {body}
      </a>
    );
  }
  return <span className={`conf conf--${conf}`}>{body}</span>;
}

export function WhoChip({ who }: { who: Who }) {
  return <span className={`who who--${who}`}>{who === "agent" ? "agent" : "you"}</span>;
}

export function TopNav({ title, back = "/", children }: { title: string; back?: string; children?: React.ReactNode }) {
  return (
    <nav aria-label={title} className="topnav">
      <Link href={back} aria-label="Back" className="circle">
        <ArrowLeft />
      </Link>
      <Link href="/" className="wordmark">
        Preflight<span>.</span>
      </Link>
      <span aria-hidden="true" className="vsep" />
      <span className="h-sm">{title}</span>
      {children}
    </nav>
  );
}

export function SampleTag({ children = "sample data" }: { children?: React.ReactNode }) {
  return <span className="tag tag--dashed">{children}</span>;
}
