export interface BenchmarkRow {
  industry: string;
  channel: string;
  offerType: string | null;
  metricName: string;
  unit: string;
  pessimistic: number;
  realistic: number;
  optimistic: number;
  direction: "lower_is_better" | "higher_is_better";
  region: string;
  source: string | null;
}

export const benchmarkData: BenchmarkRow[] = [
  // ============================================================
  // CONSUMER PET APP (Floekie) — BE+NL
  // ============================================================

  // Meta Ads — Quiz (Interactive tool)
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "quiz", metricName: "cpc", unit: "EUR", pessimistic: 0.80, realistic: 0.45, optimistic: 0.25, direction: "lower_is_better", region: "eu", source: "WordStream 2025 — Consumer Meta Ads benchmarks" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "quiz", metricName: "ctr", unit: "%", pessimistic: 1.2, realistic: 2.5, optimistic: 4.0, direction: "higher_is_better", region: "eu", source: "WordStream 2025" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "quiz", metricName: "cpe", unit: "EUR", pessimistic: 8, realistic: 3, optimistic: 1.5, direction: "lower_is_better", region: "eu", source: "Estimated — cost per quiz completion" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "quiz", metricName: "cpm", unit: "EUR", pessimistic: 12, realistic: 7, optimistic: 4, direction: "lower_is_better", region: "eu", source: "WordStream 2025" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "quiz", metricName: "conversion_rate", unit: "%", pessimistic: 5, realistic: 10, optimistic: 15, direction: "higher_is_better", region: "eu", source: "Estimated — quiz-to-profile rate" },

  // Meta Ads — Lead Magnet (Puppy Guide)
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "lead-magnet", metricName: "cpl", unit: "EUR", pessimistic: 5.0, realistic: 3.0, optimistic: 1.5, direction: "lower_is_better", region: "eu", source: "Estimated — consumer pet niche" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "lead-magnet", metricName: "cpc", unit: "EUR", pessimistic: 0.80, realistic: 0.45, optimistic: 0.25, direction: "lower_is_better", region: "eu", source: "WordStream 2025" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "lead-magnet", metricName: "ctr", unit: "%", pessimistic: 1.2, realistic: 2.5, optimistic: 4.0, direction: "higher_is_better", region: "eu", source: "WordStream 2025" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "lead-magnet", metricName: "conversion_rate", unit: "%", pessimistic: 15, realistic: 25, optimistic: 40, direction: "higher_is_better", region: "eu", source: "Estimated — download rate from landing page" },

  // Meta Ads — Retargeting
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "retargeting", metricName: "cpa", unit: "EUR", pessimistic: 25, realistic: 15, optimistic: 8, direction: "lower_is_better", region: "eu", source: "Estimated — retargeting warm audience" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "retargeting", metricName: "ctr", unit: "%", pessimistic: 2.0, realistic: 4.0, optimistic: 6.0, direction: "higher_is_better", region: "eu", source: "Estimated — warm retargeting audience" },
  { industry: "consumer-pet-app", channel: "meta-ads", offerType: "retargeting", metricName: "conversion_rate", unit: "%", pessimistic: 5, realistic: 8, optimistic: 12, direction: "higher_is_better", region: "eu", source: "Estimated — quiz-completer to profile" },

  // Google Ads — Tool (Voedingsplan)
  { industry: "consumer-pet-app", channel: "google-ads", offerType: "tool", metricName: "cpc", unit: "EUR", pessimistic: 1.50, realistic: 0.60, optimistic: 0.30, direction: "lower_is_better", region: "eu", source: "Estimated — niche NL keywords" },
  { industry: "consumer-pet-app", channel: "google-ads", offerType: "tool", metricName: "ctr", unit: "%", pessimistic: 3.0, realistic: 5.5, optimistic: 8.0, direction: "higher_is_better", region: "eu", source: "Estimated" },
  { industry: "consumer-pet-app", channel: "google-ads", offerType: "tool", metricName: "conversion_rate", unit: "%", pessimistic: 1.5, realistic: 3.0, optimistic: 5.0, direction: "higher_is_better", region: "eu", source: "Estimated — click to profile conversion" },

  // Email Warm (Nurture)
  { industry: "consumer-pet-app", channel: "email-warm", offerType: null, metricName: "open_rate", unit: "%", pessimistic: 30, realistic: 45, optimistic: 60, direction: "higher_is_better", region: "eu", source: "Mailchimp 2025 — Consumer email benchmarks (hobbies/pets)" },
  { industry: "consumer-pet-app", channel: "email-warm", offerType: null, metricName: "click_rate", unit: "%", pessimistic: 3, realistic: 8, optimistic: 15, direction: "higher_is_better", region: "eu", source: "Mailchimp 2025" },
  { industry: "consumer-pet-app", channel: "email-warm", offerType: null, metricName: "conversion_rate", unit: "%", pessimistic: 5, realistic: 12, optimistic: 20, direction: "higher_is_better", region: "eu", source: "Estimated — email to profile conversion" },
  { industry: "consumer-pet-app", channel: "email-warm", offerType: null, metricName: "unsubscribe_rate", unit: "%", pessimistic: 2.0, realistic: 0.8, optimistic: 0.3, direction: "lower_is_better", region: "eu", source: "Mailchimp 2025" },

  // Organic Social
  { industry: "consumer-pet-app", channel: "organic-social", offerType: null, metricName: "engagement_rate", unit: "%", pessimistic: 2, realistic: 5, optimistic: 10, direction: "higher_is_better", region: "eu", source: "Estimated — pet niche high engagement" },
  { industry: "consumer-pet-app", channel: "organic-social", offerType: null, metricName: "follower_growth_weekly", unit: "#", pessimistic: 30, realistic: 80, optimistic: 200, direction: "higher_is_better", region: "eu", source: "Estimated" },
  { industry: "consumer-pet-app", channel: "organic-social", offerType: null, metricName: "bio_link_clicks_weekly", unit: "#", pessimistic: 10, realistic: 25, optimistic: 60, direction: "higher_is_better", region: "eu", source: "Estimated" },

  // Subscription Metrics (In-App)
  { industry: "consumer-pet-app", channel: "in-app", offerType: "subscription", metricName: "quiz_to_profile_rate", unit: "%", pessimistic: 5, realistic: 10, optimistic: 15, direction: "higher_is_better", region: "eu", source: "Lenny Rachitsky 2025 — Subscription app conversion benchmarks" },
  { industry: "consumer-pet-app", channel: "in-app", offerType: "subscription", metricName: "monthly_churn", unit: "%", pessimistic: 20, realistic: 12, optimistic: 7, direction: "lower_is_better", region: "eu", source: "Recurly 2025 — Consumer subscription churn benchmarks" },
  { industry: "consumer-pet-app", channel: "in-app", offerType: "subscription", metricName: "retention_day_30", unit: "%", pessimistic: 70, realistic: 85, optimistic: 92, direction: "higher_is_better", region: "eu", source: "Adjust 2025 — Pet app retention benchmarks" },

  // Landing Page
  { industry: "consumer-pet-app", channel: "landing-page", offerType: "quiz", metricName: "conversion_rate", unit: "%", pessimistic: 30, realistic: 50, optimistic: 70, direction: "higher_is_better", region: "eu", source: "Estimated — quiz start rate from landing page" },
  { industry: "consumer-pet-app", channel: "landing-page", offerType: "lead-magnet", metricName: "conversion_rate", unit: "%", pessimistic: 15, realistic: 30, optimistic: 45, direction: "higher_is_better", region: "eu", source: "Estimated — download rate" },
];
