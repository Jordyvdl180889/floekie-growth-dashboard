export type TargetStatus = "exceeding" | "on_target" | "approaching" | "below" | "no_data";

export function evaluateTargetStatus(
  actual: number | null | undefined,
  pessimistic: number,
  realistic: number,
  optimistic: number,
  direction: string
): TargetStatus {
  if (actual == null) return "no_data";

  if (direction === "higher_is_better") {
    if (actual >= optimistic) return "exceeding";
    if (actual >= realistic) return "on_target";
    if (actual >= pessimistic) return "approaching";
    return "below";
  }

  // lower_is_better
  if (actual <= optimistic) return "exceeding";
  if (actual <= realistic) return "on_target";
  if (actual <= pessimistic) return "approaching";
  return "below";
}

export const METRIC_LABELS: Record<string, string> = {
  cpl: "CPL",
  cpc: "CPC",
  ctr: "CTR",
  conversion_rate: "Conversie",
  open_rate: "Open Rate",
  click_rate: "Click Rate",
  click_to_open_rate: "Click-to-Open",
  reply_rate: "Reply Rate",
  meeting_booked_rate: "Meeting Booked",
  unsubscribe_rate: "Unsubscribe Rate",
};

export const CHANNEL_LABELS: Record<string, string> = {
  "linkedin-ads": "LinkedIn Ads",
  "meta-ads": "Meta Ads",
  "email-cold": "Email (Cold)",
  "email-warm": "Email (Warm)",
  "landing-page": "Landing Page",
};

export function formatMetricValue(value: number, unit: string): string {
  if (unit === "EUR") return `\u20AC${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
  if (unit === "%") return `${value % 1 === 0 ? value : value.toFixed(1)}%`;
  return String(value);
}
