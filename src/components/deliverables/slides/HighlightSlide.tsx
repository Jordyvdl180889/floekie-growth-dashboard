"use client";

import type { HighlightSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, radii, slideContainerStyle } from "@/lib/slide-theme";

interface HighlightSlideProps {
  content: HighlightSlideContent;
  brandPrimary: string;
}

export default function HighlightSlide({ content, brandPrimary }: HighlightSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const accentColor = content.accent === "coral" ? colors.coral
    : content.accent === "electric" ? colors.electric
    : content.accent === "sunny" ? colors.sunny
    : colors.mint;
  const textOnAccent = content.accent === "sunny" ? colors.darkBg : colors.white;

  return (
    <div
      style={{
        ...slideContainerStyle(colors),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Large decorative circles */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          borderRadius: radii.pill,
          backgroundColor: accentColor,
          opacity: 0.12,
          left: -60,
          top: -60,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          borderRadius: radii.pill,
          backgroundColor: colors.coral,
          opacity: 0.1,
          right: -40,
          bottom: -40,
        }}
      />

      {/* Accent dots */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 12,
          height: 12,
          borderRadius: radii.pill,
          backgroundColor: colors.sunny,
          opacity: 0.5,
          right: "25%",
          top: "15%",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 8,
          height: 8,
          borderRadius: radii.pill,
          backgroundColor: colors.electric,
          opacity: 0.4,
          left: "20%",
          bottom: "20%",
        }}
      />

      {/* Optional heading */}
      {content.heading && (
        <span
          style={{
            marginBottom: 24,
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: typeScale.overline.fontSize,
            fontWeight: typeScale.overline.fontWeight,
            letterSpacing: typeScale.overline.letterSpacing,
            lineHeight: typeScale.overline.lineHeight,
            color: colors.muted,
            fontFamily: fonts.main,
          }}
        >
          {content.heading}
        </span>
      )}

      {/* Main highlight box */}
      <div
        className="relative"
        style={{
          zIndex: 10,
          maxWidth: 640,
          borderRadius: radii.cardLg,
          padding: "28px 36px",
          backgroundColor: accentColor,
          boxShadow: `0 0 60px ${accentColor}30`,
        }}
      >
        <p
          className="whitespace-pre-line"
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.6,
            color: textOnAccent,
            fontFamily: fonts.main,
          }}
        >
          {content.body}
        </p>
      </div>
    </div>
  );
}
