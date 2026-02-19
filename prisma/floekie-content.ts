/**
 * Floekie experiment content — transformed to dashboard format
 * Maps GH1-GH8 content to { sections: ContentSection[] } per experiment sortOrder
 */

import { floekieMetaAds } from "./content-sources/floekie-content-ads";
import { floekieEmailSequences } from "./content-sources/floekie-content-emails";
import { floekieGoogleAds, floekieSocialContent } from "./content-sources/floekie-content-google-social";

interface ContentSection {
  title: string;
  type: string;
  body: string;
}

function formatAdVariants(variants: any[], platform: string): ContentSection[] {
  return variants.map((v, i) => ({
    title: `${platform} Ad — ${v.angle} variant`,
    type: "copy",
    body: `PRIMARY TEXT:\n${v.primaryText}\n\nHEADLINE: ${v.headline}\nDESCRIPTION: ${v.description}\nCTA: ${v.cta}`,
  }));
}

function formatEmails(emails: any[], sequenceName: string): ContentSection[] {
  return emails.map((e) => ({
    title: `${sequenceName} — Dag ${e.day}: ${e.subject}`,
    type: "email",
    body: `SUBJECT: ${e.subject}\nPREVIEW: ${e.previewText}\n\n${e.body.replace(/<\/?[^>]+(>|$)/g, "").trim()}\n\nCTA: ${e.ctaText}\nLINK: ${e.ctaLink}`,
  }));
}

// GH1: Ras-Quiz Viral Campagne (Meta Ads)
const gh1Content: ContentSection[] = formatAdVariants(floekieMetaAds.GH1.variants, "Meta");

// GH2: Puppy Starter Gids (Meta Ads)
const gh2Content: ContentSection[] = formatAdVariants(floekieMetaAds.GH2.variants, "Meta");

// GH3: Hondenvoeding Zoekcampagne (Google Ads)
const gh3Content: ContentSection[] = [
  {
    title: "Google Ads — Responsive Search Ad",
    type: "copy",
    body: `HEADLINES (max 30 chars each):\n${floekieGoogleAds.GH3.headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n\nDESCRIPTIONS (max 90 chars each):\n${floekieGoogleAds.GH3.descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nDISPLAY PATHS: /${floekieGoogleAds.GH3.displayPaths.path1}/${floekieGoogleAds.GH3.displayPaths.path2}`,
  },
  {
    title: "Google Ads — Sitelinks",
    type: "copy",
    body: floekieGoogleAds.GH3.sitelinks.map((s) => `${s.title}\n${s.description}`).join("\n\n"),
  },
];

// GH4: Organic Social Content (4 weken content kalender)
const gh4Content: ContentSection[] = floekieSocialContent.GH4.month1.map((post) => ({
  title: `Week ${post.week} ${post.day} — ${post.pillar} (${post.format})`,
  type: "social-post",
  body: `CAPTION:\n${post.caption}\n\nHASHTAGS: ${post.hashtags.join(" ")}\n\nVISUAL: ${post.visualDescription}${post.hasCTA ? "\n\n→ Bevat CTA naar quiz/app" : ""}`,
}));

// GH5: Retargeting Quiz Completers (Meta Ads)
const gh5Content: ContentSection[] = formatAdVariants(floekieMetaAds.GH5.variants, "Meta");

// GH6: Quiz-to-Profile Nurture Email Sequence
const gh6Content: ContentSection[] = formatEmails(
  floekieEmailSequences.GH6_nurture.emails,
  "Nurture Sequence"
);

// GH7: In-App Profile Upgrade — geen specifieke content gegenereerd
const gh7Content: ContentSection[] = [
  {
    title: "In-App Upgrade — UX Copy",
    type: "copy",
    body: "Dit experiment focust op in-app conversie-optimalisatie:\n\n→ Quiz resultaatpagina: prominent profiel-CTA na de top 3 matches\n→ Feature teasers: voedingsplan preview met blur + unlock CTA\n→ Pricing: €4,95/maand, maandelijks opzegbaar, geen contract\n→ Social proof: '500+ hondeneigenaren gebruiken Floekie'\n→ Urgentie: 'Stel je persoonlijk voedingsplan samen'",
  },
];

// GH8: Subscriber Feature Adoption Emails
const gh8Content: ContentSection[] = formatEmails(
  floekieEmailSequences.GH8_onboarding.emails,
  "Onboarding Sequence"
);

// Export: keyed by experiment sortOrder (1-8)
export const floekieContent: Record<number, { contentType: string; content: { sections: ContentSection[] } }> = {
  1: { contentType: "meta-ads", content: { sections: gh1Content } },
  2: { contentType: "meta-ads", content: { sections: gh2Content } },
  3: { contentType: "google-ads", content: { sections: gh3Content } },
  4: { contentType: "social-content", content: { sections: gh4Content } },
  5: { contentType: "meta-ads", content: { sections: gh5Content } },
  6: { contentType: "email-nurture", content: { sections: gh6Content } },
  7: { contentType: "in-app", content: { sections: gh7Content } },
  8: { contentType: "email-nurture", content: { sections: gh8Content } },
};
