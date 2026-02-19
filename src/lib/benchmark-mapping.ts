/**
 * Maps experiment to relevant channels + metrics for auto-suggest.
 * Supports both the new offerType+channel model (Growth Engine) and legacy contentType.
 */

interface ChannelMetric {
  channel: string;
  offerType: string | null;
  metrics: string[];
}

// New: direct mapping from offerType to benchmark lookup
const OFFER_TYPE_CHANNEL_MAPPING: Record<string, Record<string, string[]>> = {
  // Laag 1: Urgentie Creëren
  whitepaper: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  ebook: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  toolkit: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  checklist: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  webinar: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "ctr"],
    "landing-page": ["conversion_rate"],
    "email-warm": ["open_rate", "click_rate"],
  },
  // Laag 2: Urgentie Capteren
  "case-study": {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
  },
  calculator: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  quiz: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  assessment: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  // Laag 3: Kwalificatie + Sale
  audit: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "google-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  analyse: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "google-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  demo: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "google-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  "demo-request": {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "google-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  review: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "google-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
  poc: {
    "linkedin-ads": ["cpl", "cpc", "ctr"],
    "meta-ads": ["cpl", "cpc", "ctr"],
    "landing-page": ["conversion_rate"],
  },
};

/**
 * Get benchmarks for a specific experiment using the Growth Engine model.
 * Uses offerType + channel directly if available, otherwise falls back to contentType.
 */
export function getChannelMetricsForExperiment(
  offerType: string | null,
  channel: string | null,
): ChannelMetric[] {
  if (!offerType) return [];

  const offerMapping = OFFER_TYPE_CHANNEL_MAPPING[offerType];
  if (!offerMapping) return [];

  // If channel is specified, return only metrics for that channel
  if (channel && offerMapping[channel]) {
    return [{
      channel,
      offerType: mapOfferTypeToBenchmark(offerType),
      metrics: offerMapping[channel],
    }];
  }

  // If no channel, return all channels for this offer type
  return Object.entries(offerMapping).map(([ch, metrics]) => ({
    channel: ch,
    offerType: mapOfferTypeToBenchmark(offerType),
    metrics,
  }));
}

/**
 * Map Growth Engine offerType to existing benchmark offerType values.
 * The benchmark table uses specific offerType values — this maps new names to existing ones.
 */
function mapOfferTypeToBenchmark(offerType: string): string | null {
  const mapping: Record<string, string | null> = {
    whitepaper: "lead-magnet",
    ebook: "lead-magnet",
    toolkit: "lead-magnet",
    checklist: "lead-magnet",
    webinar: "webinar",
    "case-study": "lead-magnet",
    calculator: "assessment",
    quiz: "assessment",
    assessment: "assessment",
    audit: "demo-request",
    analyse: "demo-request",
    demo: "demo-request",
    "demo-request": "demo-request",
    review: "demo-request",
    poc: "demo-request",
  };
  return mapping[offerType] ?? null;
}

// Legacy: contentType-based mapping (kept for backward compatibility)
const CONTENT_TYPE_MAPPING: Record<string, ChannelMetric[]> = {
  "landing-page": [
    { channel: "landing-page", offerType: "lead-magnet", metrics: ["conversion_rate"] },
    { channel: "linkedin-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "google-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
  ],
  "lead-magnet": [
    { channel: "landing-page", offerType: "lead-magnet", metrics: ["conversion_rate"] },
    { channel: "linkedin-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr", "conversion_rate"] },
    { channel: "meta-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr", "conversion_rate"] },
  ],
  "email-sequence": [
    { channel: "email-warm", offerType: null, metrics: ["open_rate", "click_rate", "click_to_open_rate", "unsubscribe_rate"] },
  ],
  "email-template": [
    { channel: "email-warm", offerType: null, metrics: ["open_rate", "click_rate", "click_to_open_rate", "unsubscribe_rate"] },
  ],
  assessment: [
    { channel: "landing-page", offerType: "assessment", metrics: ["conversion_rate"] },
    { channel: "linkedin-ads", offerType: "assessment", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "assessment", metrics: ["cpl", "ctr"] },
  ],
  "event-page": [
    { channel: "landing-page", offerType: "webinar", metrics: ["conversion_rate"] },
    { channel: "linkedin-ads", offerType: "webinar", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "webinar", metrics: ["cpl", "ctr"] },
    { channel: "email-warm", offerType: null, metrics: ["open_rate", "click_rate"] },
  ],
  popup: [
    { channel: "popup", offerType: null, metrics: ["popup_conversion_rate", "popup_view_rate", "popup_close_rate", "popup_ctr"] },
  ],
  "website-copy": [
    { channel: "landing-page", offerType: "lead-magnet", metrics: ["conversion_rate"] },
  ],
  "service-page": [
    { channel: "landing-page", offerType: "demo-request", metrics: ["conversion_rate"] },
    { channel: "linkedin-ads", offerType: "demo-request", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "demo-request", metrics: ["cpl", "cpc", "ctr"] },
  ],
  ads: [
    { channel: "linkedin-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
  ],
  outreach: [
    { channel: "email-cold", offerType: null, metrics: ["open_rate", "reply_rate", "bounce_rate", "meeting_booked_rate", "click_rate", "lp_conversion_rate"] },
  ],
  "social-content": [],
  "case-study": [
    { channel: "linkedin-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
    { channel: "meta-ads", offerType: "lead-magnet", metrics: ["cpl", "cpc", "ctr"] },
  ],
  article: [],
  "content-outline": [],
};

export function getChannelMetricsForContentType(contentType: string): ChannelMetric[] {
  return CONTENT_TYPE_MAPPING[contentType] || [];
}

export { CONTENT_TYPE_MAPPING };
export type { ChannelMetric };
