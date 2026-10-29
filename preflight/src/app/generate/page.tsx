import Generate from "@/components/Generate";

export const metadata = { title: "Generate a guide · Preflight." };

export default async function GeneratePage(props: PageProps<"/generate">) {
  const sp = await props.searchParams;
  const app = typeof sp.app === "string" ? sp.app : "";
  return <Generate initialApp={app} />;
}
