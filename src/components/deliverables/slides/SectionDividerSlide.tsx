"use client";

import type { SectionDividerSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, getAccent } from "@/lib/slide-theme";

interface SectionDividerSlideProps {
  content: SectionDividerSlideContent;
  brandPrimary: string;
}

export default function SectionDividerSlide({
  content,
  brandPrimary,
}: SectionDividerSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const sectionNum = String(content.sectionNumber).padStart(2, "0");
  const accent = getAccent(colors, content.sectionNumber - 1);

  return (
    <div
      style={{
        ...slideContainerStyle(colors),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Large background number */}
      <span
        className="pointer-events-none absolute select-none"
        style={{
          fontSize: 200,
          fontFamily: fonts.main,
          fontWeight: 900,
          lineHeight: 1,
          color: accent,
          opacity: 0.08,
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {sectionNum}
      </span>

      {/* Decorative corner gradient */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          background: `linear-gradient(135deg, ${accent}50, transparent)`,
          borderRadius: "0 0 100% 0",
          left: 0,
          top: 0,
        }}
      />

      {/* Colored circle — bottom right */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 120,
          height: 120,
          backgroundColor: accent,
          opacity: 0.2,
          borderRadius: radii.pill,
          right: -20,
          bottom: -20,
        }}
      />

      {/* Small floating dots */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.coral, opacity: 0.4, borderRadius: radii.pill, right: "20%", top: "25%" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 8, height: 8, backgroundColor: colors.mint, opacity: 0.5, borderRadius: radii.pill, left: "40%", bottom: "20%" }}
      />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column" }}>
        {/* Section number circle + label */}
        <div style={{ display: "flex", alignItems: "center", gap: spacing.cardGap }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: radii.pill,
              backgroundColor: accent,
              color: accent === colors.sunny ? colors.darkBg : colors.white,
              fontSize: typeScale.h3.fontSize,
              fontWeight: 700,
              fontFamily: fonts.main,
            }}
          >
            {sectionNum}
          </span>
          <span
            style={{
              fontSize: typeScale.overline.fontSize,
              fontWeight: typeScale.overline.fontWeight,
              letterSpacing: typeScale.overline.letterSpacing,
              lineHeight: typeScale.overline.lineHeight,
              textTransform: "uppercase",
              color: accent,
              fontFamily: fonts.main,
            }}
          >
            Section
          </span>
          <div
            style={{ height: 2, minWidth: 60, flex: 1, backgroundColor: accent, opacity: 0.4 }}
          />
        </div>

        {/* Section heading */}
        <h2
          style={{
            fontSize: typeScale.h1.fontSize,
            fontWeight: typeScale.h1.fontWeight,
            lineHeight: typeScale.h1.lineHeight,
            letterSpacing: typeScale.h1.letterSpacing,
            color: colors.white,
            fontFamily: fonts.main,
            marginTop: spacing.sectionGap,
            maxWidth: "70%",
          }}
        >
          {content.heading}
        </h2>

        {content.subtitle && (
          <p
            style={{
              fontSize: typeScale.body.fontSize,
              fontWeight: typeScale.body.fontWeight,
              lineHeight: typeScale.body.lineHeight,
              color: colors.light,
              fontFamily: fonts.main,
              marginTop: spacing.accentBarGap,
              maxWidth: 480,
            }}
          >
            {content.subtitle}
          </p>
        )}

        {/* Accent bar */}
        <div
          style={{
            width: spacing.accentBarWidth,
            height: spacing.accentBarHeight,
            backgroundColor: accent,
            borderRadius: radii.pill,
            marginTop: spacing.accentBarGap,
          }}
        />
      </div>
    </div>
  );
}
