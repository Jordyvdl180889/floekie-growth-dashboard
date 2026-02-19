"use client";

import type { MetricsSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface MetricsSlideProps {
  content: MetricsSlideContent;
  brandPrimary: string;
}

/** Short numeric values get metric scale; longer text scales down */
function getValueStyle(value: string) {
  const trimmed = value.trim();
  const isShortNumeric = /^[\d$%+\-.,\s]{1,6}[%xk]?$/i.test(trimmed);
  const isShort = trimmed.length <= 5;

  if (isShortNumeric || isShort) {
    return { fontSize: typeScale.metric.fontSize, fontWeight: typeScale.metric.fontWeight };
  }
  if (trimmed.length <= 12) {
    return { fontSize: typeScale.h2.fontSize, fontWeight: 800 as const };
  }
  return { fontSize: typeScale.h3.fontSize, fontWeight: 700 as const };
}

export default function MetricsSlide({
  content,
  brandPrimary,
}: MetricsSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const count = content.metrics.length;
  const gridCols = count <= 2 ? 2 : count === 3 ? 3 : count <= 4 ? 2 : 4;

  return (
    <div
      style={{
        ...slideContainerStyle(colors),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Decorative shapes */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 160, height: 160, backgroundColor: colors.mint, opacity: 0.15, borderRadius: radii.pill, right: -40, top: -40 }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 120, height: 120, backgroundColor: colors.coral, opacity: 0.12, borderRadius: radii.pill, left: -30, bottom: -30 }}
      />

      {/* Heading */}
      {content.heading && (
        <>
          <h2
            style={{
              ...headingStyle(),
              color: colors.white,
            }}
          >
            {content.heading}
          </h2>
          <div
            style={{
              width: spacing.accentBarWidth,
              height: spacing.accentBarHeight,
              backgroundColor: colors.mint,
              borderRadius: radii.pill,
              marginTop: spacing.accentBarGap,
            }}
          />
        </>
      )}

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: spacing.cardGap,
          marginTop: spacing.sectionGap,
          flex: 1,
          alignItems: "center",
        }}
      >
        {content.metrics.map((metric, i) => {
          const accent = getAccent(colors, i);
          const valStyle = getValueStyle(metric.value);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.elementGap,
                overflow: "hidden",
                borderRadius: radii.card,
                padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                textAlign: "center",
                backgroundColor: colors.darkCard,
                borderBottom: `3px solid ${accent}`,
              }}
            >
              {/* Small colored circle accent — top right */}
              <div
                className="pointer-events-none absolute"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: accent,
                  opacity: 0.3,
                  borderRadius: radii.pill,
                  top: 12,
                  right: 12,
                }}
              />

              {/* Metric value */}
              <span
                style={{
                  color: accent,
                  fontFamily: fonts.main,
                  fontSize: valStyle.fontSize,
                  fontWeight: valStyle.fontWeight,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  wordBreak: "break-word",
                }}
              >
                {metric.value}
              </span>

              {/* Label */}
              <span
                style={{
                  fontSize: typeScale.caption.fontSize,
                  fontWeight: typeScale.caption.fontWeight,
                  lineHeight: typeScale.caption.lineHeight,
                  color: "#e2e8f0",
                  fontFamily: fonts.main,
                }}
              >
                {metric.label}
              </span>

              {metric.subtitle && (
                <span
                  style={{
                    fontSize: typeScale.bodySmall.fontSize,
                    lineHeight: typeScale.bodySmall.lineHeight,
                    color: colors.muted,
                    fontFamily: fonts.main,
                  }}
                >
                  {metric.subtitle}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
