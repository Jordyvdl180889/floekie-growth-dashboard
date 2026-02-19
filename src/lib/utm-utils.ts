import type { UtmSet } from "@/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äàáâã]/g, "a")
    .replace(/[ëèéê]/g, "e")
    .replace(/[ïìíî]/g, "i")
    .replace(/[öòóô]/g, "o")
    .replace(/[üùúû]/g, "u")
    .replace(/[-\s]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

const CHANNEL_MEDIUM_MAP: Record<string, string> = {
  "linkedin-ads": "paidsocial",
  "meta-ads": "paidsocial",
  "google-ads": "cpc",
  "reddit-ads": "paidsocial",
  "cold-email": "outbound",
  "email-warm": "email",
  popup: "popup",
  "organic-social": "social",
  "landing-page": "referral",
  seo: "organic",
  event: "email",
  referral: "referral",
  outbound: "outbound",
};

const CHANNEL_SOURCE_MAP: Record<string, string> = {
  "linkedin-ads": "linkedin",
  "meta-ads": "facebook",
  "google-ads": "google",
  "reddit-ads": "reddit",
  "cold-email": "reply",
  "email-warm": "hubspot",
  popup: "{{site_source_name}}",
  "organic-social": "linkedin",
  "landing-page": "{{site_source_name}}",
  seo: "google",
  event: "hubspot",
  referral: "{{site_source_name}}",
  outbound: "reply",
};

export function channelToMedium(channel: string): string {
  return CHANNEL_MEDIUM_MAP[channel] || "referral";
}

export function channelToSource(channel: string): string {
  return CHANNEL_SOURCE_MAP[channel] || "{{site_source_name}}";
}

type ChannelCategory = "paid-ads" | "email" | "organic" | "other";

function getChannelCategory(channel: string): ChannelCategory {
  if (["linkedin-ads", "meta-ads", "google-ads", "reddit-ads"].includes(channel)) return "paid-ads";
  if (["cold-email", "email-warm", "event"].includes(channel)) return "email";
  if (["organic-social", "seo"].includes(channel)) return "organic";
  return "other";
}

function getTermGuideline(category: ChannelCategory): string {
  switch (category) {
    case "paid-ads":
      return "Vul in per advertentieset. Voorbeelden:\n• retargeting_website_bezoekers\n• lookalike_klanten_1pct\n• uploadlist_crm_leads\n• interesse_hr_managers";
    case "email":
      return "Vul in per email. Voorbeelden:\n• nurturing_whitepaper_downloaders\n• nurturing_webinar_deelnemers\n• nurturing_assessment_starters";
    case "organic":
      return "Vul in per post/pagina. Voorbeelden:\n• organic_linkedin_post\n• organic_seo_blogartikel\n• organic_community_share";
    default:
      return "Vul in per bron. Voorbeelden:\n• referral_partner_naam\n• popup_homepage_bezoekers\n• outbound_cold_lijst";
  }
}

function getContentGuideline(category: ChannelCategory): string {
  switch (category) {
    case "paid-ads":
      return "Vul in per ad variant. Voorbeelden:\n• pijn_v1\n• resultaat_v2\n• vraag_v3\n• carousel_casestudy";
    case "email":
      return "Vul in per email in de sequence. Voorbeelden:\n• email_1_welkom\n• email_2_probleem\n• email_3_oplossing\n• email_4_cta";
    case "organic":
      return "Vul in per publicatie. Voorbeelden:\n• post_tip_productiviteit\n• artikel_casestudy_klant\n• video_uitleg_methode";
    default:
      return "Vul in per variant. Voorbeelden:\n• popup_exit_intent\n• referral_invite_email\n• outbound_follow_up_2";
  }
}

interface GenerateUtmInput {
  experimentCode: string;
  name: string;
  channels: string[];
}

export function generateUtmSets(experiment: GenerateUtmInput): UtmSet[] {
  if (experiment.channels.length === 0) return [];

  const campaign = slugify(experiment.experimentCode + "_" + experiment.name);

  return experiment.channels.map((channel) => {
    const medium = channelToMedium(channel);
    const source = channelToSource(channel);
    const category = getChannelCategory(channel);

    return {
      channel,
      utm_campaign: campaign,
      utm_medium: medium,
      utm_source: source,
      utm_term: "{{audience}}",
      utm_content: "{{creative}}",
      termGuideline: getTermGuideline(category),
      contentGuideline: getContentGuideline(category),
    };
  });
}

export function buildFullUrl(baseUrl: string, utmSet: UtmSet): string {
  const params = new URLSearchParams({
    utm_campaign: utmSet.utm_campaign,
    utm_medium: utmSet.utm_medium,
    utm_source: utmSet.utm_source,
    utm_term: utmSet.utm_term,
    utm_content: utmSet.utm_content,
  });

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params.toString()}`;
}
