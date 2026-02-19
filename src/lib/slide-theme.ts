/**
 * Stretch Slide Design System — Pixel-Perfect Tokens
 *
 * All values in px for precise control. No Tailwind spacing classes in slides.
 * 8px grid system. Strict type scale.
 *
 * Main: #25DB99 (mint/green) — young, innovative feel
 * Accents: coral, electric blue, warm yellow — contrasting energy
 * Font: Roboto everywhere
 */

/* ── Colors ──────────────────────────────────────────── */

export function getSlideColors(brandPrimary: string) {
  return {
    // Brand
    brand: brandPrimary,
    brandLight: `${brandPrimary}20`,
    brandMedium: `${brandPrimary}40`,

    // Dark palette
    darkBg: "#0F1B2D",
    darkCard: "#162338",
    darkBorder: "#1E2F4A",

    // Main color + accent trio
    mint: "#25DB99",
    coral: "#FF6B6B",
    electric: "#4E7CFF",
    sunny: "#FFD93D",

    // Derived shades
    mintDark: "#1BA876",
    mintLight: "#25DB9930",

    // Neutral text
    white: "#FFFFFF",
    light: "#D6DEE8",
    muted: "#8899AA",
    steel: "#5C7080",

    // Light mode (unused currently but kept for future)
    slideBg: "#ffffff",
    cardBg: "#f1f5f9",
    titleText: "#0F1B2D",
    bodyText: "#334155",

    // Status
    positive: "#25DB99",
    negative: "#FF6B6B",
    warning: "#FFD93D",
  };
}

/* ── Typography ──────────────────────────────────────── */

export const fonts = {
  main: "var(--font-roboto), 'Roboto', sans-serif",
} as const;

/**
 * Type scale — strict px values.
 * Each level has a fixed size, weight, lineHeight, and letterSpacing.
 */
export const typeScale = {
  /** Giant hero numbers — BigNumber, SectionDivider bg numbers */
  hero: { fontSize: 80, fontWeight: 900 as const, lineHeight: 1, letterSpacing: "-0.02em" },
  /** Main title slide heading */
  h1: { fontSize: 36, fontWeight: 700 as const, lineHeight: 1.15, letterSpacing: "-0.01em" },
  /** Section headings on content slides */
  h2: { fontSize: 22, fontWeight: 700 as const, lineHeight: 1.25, letterSpacing: "-0.005em" },
  /** Card headings, column headers */
  h3: { fontSize: 17, fontWeight: 700 as const, lineHeight: 1.3, letterSpacing: "0" },
  /** Large metric values */
  metric: { fontSize: 44, fontWeight: 900 as const, lineHeight: 1, letterSpacing: "-0.02em" },
  /** Body text — paragraphs, bullets, descriptions */
  body: { fontSize: 14, fontWeight: 400 as const, lineHeight: 1.6, letterSpacing: "0" },
  /** Small body — secondary text, sub-bullets */
  bodySmall: { fontSize: 12, fontWeight: 400 as const, lineHeight: 1.5, letterSpacing: "0" },
  /** Labels, captions, metadata */
  caption: { fontSize: 12, fontWeight: 500 as const, lineHeight: 1.4, letterSpacing: "0" },
  /** Overline labels — uppercase category tags */
  overline: { fontSize: 11, fontWeight: 700 as const, lineHeight: 1.2, letterSpacing: "0.12em" },
} as const;

/* ── Spacing ─────────────────────────────────────────── */

/**
 * Spacing tokens — 8px grid.
 * Every spacing value is a multiple of 4 or 8.
 */
export const spacing = {
  /** Slide outer padding — tuned for 16:9 aspect ratio */
  slidePx: 48,
  slidePy: 36,
  /** Gap between heading and accent bar */
  accentBarGap: 12,
  /** Gap between heading area and main content */
  sectionGap: 24,
  /** Gap between cards / grid items */
  cardGap: 14,
  /** Card internal padding */
  cardPx: 20,
  cardPy: 20,
  /** Small internal gap within a card (between title and body) */
  elementGap: 10,
  /** Gap between list items */
  listGap: 10,
  /** Accent bar dimensions */
  accentBarWidth: 40,
  accentBarHeight: 3,
} as const;

/* ── Radii ───────────────────────────────────────────── */

export const radii = {
  card: 16,
  cardLg: 20,
  pill: 999,
  badge: 8,
} as const;

/* ── Shadows ─────────────────────────────────────────── */

export const shadows = {
  card: "0 2px 8px rgba(0,0,0,0.12)",
  glow: (color: string) => `0 0 40px ${color}30`,
} as const;

/* ── Helpers ─────────────────────────────────────────── */

/** Inline style object for slide outer container */
export function slideContainerStyle(colors: ReturnType<typeof getSlideColors>) {
  return {
    backgroundColor: colors.darkBg,
    padding: `${spacing.slidePy}px ${spacing.slidePx}px`,
  } as const;
}

/** Standard heading + accent bar style */
export function headingStyle() {
  return {
    fontSize: typeScale.h2.fontSize,
    fontWeight: typeScale.h2.fontWeight,
    lineHeight: typeScale.h2.lineHeight,
    letterSpacing: typeScale.h2.letterSpacing,
    fontFamily: fonts.main,
  } as const;
}

/** Accent color rotation helper */
export function getAccent(colors: ReturnType<typeof getSlideColors>, index: number) {
  const accents = [colors.mint, colors.coral, colors.electric, colors.sunny];
  return accents[index % accents.length];
}

/* ── Legacy compat (remove after full migration) ─────── */

export const slidePadding = {
  slide: "",
} as const;
