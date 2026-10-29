// From https://docs.composio.dev/toolkits/managed-auth (read 2026-10-28). Used to fill in
// "Composio-managed" for generated guides without spending a web search on it.

const MANAGED = [
  "Aircall", "Airtable", "Apaleo", "Asana", "Attio", "Basecamp", "Bitbucket", "Blackbaud", "Boldsign", "Box", "Cal",
  "Calendly", "Canva", "Capsule CRM", "ClickUp", "Confluence", "Contentful", "Crowdin", "Dart", "Daytona", "Dialpad",
  "Discord", "Discord Bot", "Dropbox", "Dub", "Dynamics 365", "Eventbrite", "Excel", "Exist", "Facebook", "Fathom",
  "Figma", "Freeagent", "FreshBooks", "GitHub", "GitLab", "Gmail", "Gong", "Google Ads", "Google Analytics",
  "Google BigQuery", "Google Calendar", "Google Classroom", "Google Docs", "Google Drive", "Google Maps", "Google Meet",
  "Google Photos", "Google Search Console", "Google Sheets", "Google Slides", "Google Super", "Google Tasks", "Gorgias",
  "Greenhouse", "Gumroad", "Harvest", "HubSpot", "Hugging Face", "Instagram", "Intercom", "Jira", "Kit", "Linear",
  "LinkedIn", "Linkhut", "Mailchimp", "Microsoft Teams", "Miro", "Monday", "Moneybird", "Mural", "NotebookLM", "Notion",
  "Omnisend", "OneDrive", "Outlook", "PagerDuty", "Pinterest", "Pinterest Ads", "Prisma", "Productboard", "Pushbullet",
  "QuickBooks", "Reddit", "Reddit Ads", "Roam", "Salesforce", "Sentry", "Servicem8", "SharePoint", "Shippo", "Slack",
  "Slackbot", "Splitwise", "Square", "Stack Exchange", "Stripe", "Supabase", "Ticketmaster", "Ticktick", "TikTok Ads",
  "Timely", "Todoist", "Trello", "Twitch", "Typeform", "WakaTime", "Webex", "WhatsApp", "Wrike", "Yandex", "YNAB",
  "YouTube", "Zendesk", "Zeplin", "Zoho", "Zoho Bigin", "Zoho Books", "Zoho Desk", "Zoho Inventory", "Zoho Invoice",
  "Zoho Mail", "Zoom",
];

const BRING_YOUR_OWN = [
  "AdRoll", "Aha!", "Ahrefs", "Alpaca", "AWeber", "BambooHR", "Beeminder", "bexio", "Bitly", "Bitwarden", "Blackboard",
  "Borneo", "Brevo", "Brex", "Buffer", "Canvas", "CleverReach", "ClickFunnels", "Clio Manage", "Clockify", "Clover",
  "Commerce Layer", "Constant Contact", "Contacts+", "Coupa", "Databricks", "Datadog", "dbt Cloud", "Deel", "Deputy",
  "DevCycle", "DigitalOcean", "Disqus", "DocuSign", "Dribbble", "Dropbox Sign", "Dynatrace", "eBay", "Egnyte",
  "Epic Games", "Follow Up Boss", "freee", "Freshsales", "Front", "GetResponse", "Google Admin", "Google AdSense",
  "Google Chat", "Google Data Studio", "Google Merchant Center", "Google Contacts", "Google Forms", "Gusto", "HaloPSA",
  "Help Scout", "HighLevel", "Infisical", "Jibble", "Jobber", "Judge.me", "Kintone", "Klaviyo", "Kommo", "LaunchDarkly",
  "Lever", "Lightspeed", "LinkedIn Ads", "LiveChat", "Lodgify", "MailUp", "Matterport", "Meta Ads",
  "Microsoft Advertising", "Microsoft Bookings", "Microsoft Entra ID", "Microsoft OneNote", "Power BI",
  "Microsoft PowerPoint", "Microsoft To Do", "Microsoft Word", "Money Forward", "MongoDB", "Neo4j", "Neon", "NetSuite",
  "Parma", "PayPal", "PayPal Zettle", "Personio", "Pinecone", "Pipedrive", "PlanetScale", "Quire", "Railway", "Ramp",
  "Razorpay", "RD Station", "Rebrandly", "Recruitee", "Reloadly", "Resend", "Rillet", "Salesforce Service Cloud",
  "ScheduleOnce", "Sendloop", "SendPulse", "ServiceNow", "ServiceTitan", "Shopify", "SignNow", "Smartsheet", "Snapchat",
  "Snowflake", "Snyk", "SoundCloud", "Spotify", "Storyblok", "SurveyMonkey", "Tally", "Threads", "TikTok", "Toneden",
  "Twitter", "X", "Vercel", "Vibe", "Vimeo", "Webflow", "Whop", "WildApricot", "Wix", "WordPress.com", "Workable",
  "Workday", "Xero", "Zoho Calendar", "Zoho Campaigns", "Zoho Recruit", "Zoho Sign", "Zoho WorkDrive", "Zoom Team Chat",
  "ZoomInfo",
];

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const managedSet = new Set(MANAGED.map(key));
const byoSet = new Set(BRING_YOUR_OWN.map(key));

/** "yes" / "no" from Composio's directory, or "unknown" when the provider isn't listed there. */
export function composioManaged(...names: string[]): "yes" | "no" | "unknown" {
  const keys = names.map(key).filter(Boolean);
  if (keys.some((k) => managedSet.has(k))) return "yes";
  if (keys.some((k) => byoSet.has(k))) return "no";
  return "unknown";
}
