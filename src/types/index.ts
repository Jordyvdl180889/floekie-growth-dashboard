export type ExperimentStatus =
  | "planned"
  | "running"
  | "completed"
  | "paused"
  | "stopped";

export type AARRRStage =
  | "Acquisition"
  | "Activation"
  | "Retention"
  | "Revenue"
  | "Referral";

export type SprintStatus = "upcoming" | "active" | "completed";

export interface ClientContext {
  company: {
    name: string;
    description: string;
    valueProp: string;
    founded?: string;
    team?: string;
    website?: string;
  };
  market: {
    tam?: string;
    sam?: string;
    som?: string;
    trends?: string[];
  };
  icp: {
    segments: Array<{
      name: string;
      description: string;
      painPoints: string[];
      goals: string[];
    }>;
  };
  competitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  }>;
}

export interface GrowthLoopStep {
  label: string;
  description: string;
}

export interface SprintActivity {
  day: string;
  activity: string;
  owner: string;
  deliverable: string;
}

export interface ContentSection {
  title: string;
  type: string;
  body: string;
}

export interface ExperimentContent {
  sections: ContentSection[];
}

export type ContentType =
  | "website-copy"
  | "lead-magnet"
  | "service-page"
  | "assessment"
  | "social-content"
  | "event-page"
  | "email-sequence"
  | "landing-page"
  | "case-study"
  | "popup"
  | "email-template"
  | "article"
  | "content-outline";

export type FunnelLayer = 1 | 2 | 3;

export type OfferType =
  | "whitepaper" | "ebook" | "toolkit" | "checklist" | "webinar"
  | "case-study" | "calculator" | "quiz" | "assessment"
  | "audit" | "analyse" | "demo" | "review" | "poc";

export type AudienceType =
  | "cold-interest" | "cold-jobtitle" | "cold-industry" | "cold-lookalike"
  | "retargeting-l1" | "lookalike-l1"
  | "retargeting-l2" | "lookalike-l2" | "outbound";

export const FUNNEL_LAYER_LABELS: Record<number, string> = {
  1: "Urgentie Creëren",
  2: "Urgentie Capteren",
  3: "Kwalificatie + Sale",
};

export const OFFER_TYPE_LABELS: Record<string, string> = {
  whitepaper: "Whitepaper",
  ebook: "Ebook",
  toolkit: "Toolkit",
  checklist: "Checklist",
  webinar: "Webinar",
  "case-study": "Case Study",
  calculator: "Calculator",
  quiz: "Quiz",
  assessment: "Assessment",
  audit: "Audit",
  analyse: "Analyse",
  demo: "Demo",
  review: "Review",
  poc: "Proof of Concept",
};

export const CHANNEL_LABELS: Record<string, string> = {
  "linkedin-ads": "LinkedIn Ads",
  "meta-ads": "Meta Ads",
  "google-ads": "Google Ads",
  "reddit-ads": "Reddit Ads",
  "cold-email": "Cold Email",
  "email-warm": "Email (Warm)",
  "outbound": "Outbound",
  "popup": "Popup",
  "organic-social": "Organic Social",
  "landing-page": "Landing Page",
  "seo": "SEO",
  "event": "Event",
  "referral": "Referral",
  "product-hunt": "Product Hunt",
};

export const AUDIENCE_TYPE_LABELS: Record<string, string> = {
  "cold-interest": "Cold: Interesse",
  "cold-jobtitle": "Cold: Job Title",
  "cold-industry": "Cold: Industrie",
  "cold-lookalike": "Cold: Lookalike",
  "retargeting-l1": "Retargeting L1",
  "lookalike-l1": "Lookalike L1",
  "retargeting-l2": "Retargeting L2",
  "lookalike-l2": "Lookalike L2",
  "outbound": "Outbound",
};

// Audience Specs
export interface AudienceCustomAudience {
  type: string;
  description: string;
  dataNeeded?: string[];
  minSize?: number;
  window?: string;
}

export interface AudienceLookalike {
  source: string;
  percentage: string;
  country: string;
}

export interface AudienceRetargeting {
  source: string;
  window: string;
  excludeConverted: boolean;
}

export interface AudienceChannelSpec {
  channel: string;
  targeting: {
    jobTitles?: string[];
    industries?: string[];
    interests?: string[];
    keywords?: string[];
    companySize?: string;
    seniority?: string[];
    companyNames?: string[];
    groups?: string[];
    skills?: string[];
    behaviors?: string[];
    subreddits?: string[];
    communities?: string[];
    pinKeywords?: string[];
    boardTopics?: string[];
    hashtags?: string[];
    creatorCategories?: string[];
    followerLookalikes?: string[];
    tweetKeywords?: string[];
    youtubeChannels?: string[];
    topics?: string[];
    placements?: string[];
    customAudience?: AudienceCustomAudience;
    lookalike?: AudienceLookalike;
    retargeting?: AudienceRetargeting;
  };
  estimatedSize?: string;
  budget?: string;
  notes?: string;
}

export interface AudienceSpecs {
  channels: AudienceChannelSpec[];
}

// Design Briefing
export interface DesignAsset {
  type: string;
  format: string;
  description: string;
  copyOnAsset: string;
  style?: string;
  variants?: number;
}

export interface DesignBriefing {
  assets: DesignAsset[];
  generalNotes?: string;
}

// Projection types
export interface ProjectionInputs {
  monthlyBudget?: number;
  monthlyVisitors?: number;
  monthlyOutreachVolume?: number;
  monthlyImpressions?: number;
  upstreamMode?: "auto" | "manual";
  manualUpstreamLeads?: number;
}

export interface ProjectionResult {
  pessimistic: number;
  realistic: number;
  optimistic: number;
  unit: string;
  label: string;
  inputLabel: string;
  inputValue: number;
  benchmarkUsed: string;
}

// RISE Scoring Model
export interface RiseInputs {
  // REACH
  peopleReached: number;      // 1-5
  channelReach: number;       // 1-5
  // IMPACT
  isNewChannel: boolean;
  changeSize: number;         // 1-3
  isAboveFold: boolean;
  isNoticeable5s: boolean;
  changeType: number;         // 0=copy, 1=navigatie, 2=design
  // CONFIDENCE
  hasUserFeedback: boolean;
  hasCompetitorData: boolean;
  hasAnalyticsData: boolean;
  hasBestPractices: boolean;
  // EASE
  timeToSetup: number;        // 1-5 (1=<1u, 5=>week)
  dependencyLevel: number;    // 0=zelf, 1=dev, 2=extern
}

export interface RiseScores {
  reach: number;
  impact: number;
  confidence: number;
  ease: number;
  total: number;
}

export interface UtmSet {
  channel: string;
  utm_campaign: string;
  utm_medium: string;
  utm_source: string;
  utm_term: string;
  utm_content: string;
  termGuideline: string;
  contentGuideline: string;
}

// Slide types for Deliverables
export type SlideLayout =
  | "title"
  | "section-divider"
  | "bullets"
  | "two-column"
  | "table"
  | "metrics"
  | "quote"
  | "persona"
  | "timeline"
  | "text"
  | "big-number"
  | "comparison"
  | "checklist"
  | "icon-grid"
  | "funnel"
  | "highlight"
  | "donut-chart"
  | "bar-chart"
  | "progress-bars"
  | "three-column"
  | "card-grid"
  | "pie-chart";

export interface TitleSlideContent {
  layout: "title";
  mainTitle: string;
  subtitle?: string;
  metadata?: { label: string; value: string }[];
}

export interface SectionDividerSlideContent {
  layout: "section-divider";
  sectionNumber: number;
  heading: string;
  subtitle?: string;
}

export interface BulletsSlideContent {
  layout: "bullets";
  heading: string;
  intro?: string;
  bullets: { text: string; sub?: string }[];
}

export interface TwoColumnSlideContent {
  layout: "two-column";
  heading?: string;
  left: { heading: string; body?: string; bullets?: string[] };
  right: { heading: string; body?: string; bullets?: string[] };
}

export interface TableSlideContent {
  layout: "table";
  heading?: string;
  headers: string[];
  rows: string[][];
}

export interface MetricsSlideContent {
  layout: "metrics";
  heading?: string;
  metrics: { label: string; value: string; subtitle?: string }[];
}

export interface QuoteSlideContent {
  layout: "quote";
  quote: string;
  attribution?: string;
}

export interface PersonaSlideContent {
  layout: "persona";
  name: string;
  role?: string;
  painPoints: string[];
  goals: string[];
}

export interface TimelineSlideContent {
  layout: "timeline";
  heading?: string;
  steps: { label: string; description: string; timing?: string }[];
}

export interface TextSlideContent {
  layout: "text";
  heading?: string;
  body: string;
}

export interface BigNumberSlideContent {
  layout: "big-number";
  heading?: string;
  number: string;
  label: string;
  context?: string;
}

export interface ComparisonSlideContent {
  layout: "comparison";
  heading?: string;
  left: { label: string; items: string[] };
  right: { label: string; items: string[] };
}

export interface ChecklistSlideContent {
  layout: "checklist";
  heading?: string;
  items: { text: string; checked: boolean }[];
}

export interface IconGridSlideContent {
  layout: "icon-grid";
  heading?: string;
  items: { icon: string; title: string; description?: string }[];
}

export interface FunnelSlideContent {
  layout: "funnel";
  heading?: string;
  layers: { label: string; value?: string; description?: string }[];
}

export interface HighlightSlideContent {
  layout: "highlight";
  heading?: string;
  body: string;
  accent?: string;
}

export type SlideContent =
  | TitleSlideContent
  | SectionDividerSlideContent
  | BulletsSlideContent
  | TwoColumnSlideContent
  | TableSlideContent
  | MetricsSlideContent
  | QuoteSlideContent
  | PersonaSlideContent
  | TimelineSlideContent
  | TextSlideContent
  | BigNumberSlideContent
  | ComparisonSlideContent
  | ChecklistSlideContent
  | IconGridSlideContent
  | FunnelSlideContent
  | HighlightSlideContent
  | DonutChartSlideContent
  | BarChartSlideContent
  | ProgressBarsSlideContent
  | ThreeColumnSlideContent
  | CardGridSlideContent
  | PieChartSlideContent;

export interface DonutChartSlideContent {
  layout: "donut-chart";
  heading?: string;
  segments: { label: string; value: number; color?: string }[];
  centerLabel?: string;
  centerValue?: string;
}

export interface BarChartSlideContent {
  layout: "bar-chart";
  heading?: string;
  bars: { label: string; value: number; displayValue?: string }[];
  maxValue?: number;
}

export interface ProgressBarsSlideContent {
  layout: "progress-bars";
  heading?: string;
  items: { label: string; value: number; max?: number; displayValue?: string }[];
}

export interface ThreeColumnSlideContent {
  layout: "three-column";
  heading?: string;
  columns: { heading: string; body?: string; bullets?: string[] }[];
}

export interface CardGridSlideContent {
  layout: "card-grid";
  heading?: string;
  cards: { title: string; body: string; accent?: string }[];
}

export interface PieChartSlideContent {
  layout: "pie-chart";
  heading?: string;
  slices: { label: string; value: number; color?: string }[];
}

export interface DeliverableData {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  category: string;
  slideCount: number;
  slides: SlideContent[];
  sortOrder: number;
}

export interface ExperimentTargetData {
  id: number;
  experimentId: number;
  benchmarkId: number | null;
  channel: string;
  metricName: string;
  unit: string;
  pessimistic: number;
  realistic: number;
  optimistic: number;
  actual: number | null;
  direction: string;
}
