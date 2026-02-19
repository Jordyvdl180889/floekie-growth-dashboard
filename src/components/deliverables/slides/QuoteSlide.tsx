"use client";

import type { QuoteSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle } from "@/lib/slide-theme";

interface QuoteSlideProps {
  content: QuoteSlideContent;
  brandPrimary: string;
}

export default function QuoteSlide({
  content,
  brandPrimary,
}: QuoteSlideProps) {
  const colors = getSlideColors(brandPrimary);

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
      {/* Large decorative quote mark */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.mint,
          opacity: 0.25,
          borderRadius: radii.pill,
          left: 32,
          top: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="select-none"
          style={{
            fontSize: 120,
            fontFamily: fonts.main,
            fontWeight: 900,
            lineHeight: 1,
            color: colors.white,
            opacity: 0.5,
          }}
        >
          {"\u201C"}
        </span>
      </div>

      {/* Coral decorative circle — bottom right */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 120,
          height: 120,
          backgroundColor: colors.coral,
          opacity: 0.15,
          borderRadius: radii.pill,
          right: -30,
          bottom: -30,
        }}
      />

      {/* Small accent dots */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.electric, opacity: 0.5, borderRadius: radii.pill, right: "20%", top: "15%" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 8, height: 8, backgroundColor: colors.mint, opacity: 0.4, borderRadius: radii.pill, left: "15%", bottom: "25%" }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacing.sectionGap,
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {/* Quote text */}
        <p
          style={{
            fontSize: 24,
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.5,
            color: colors.white,
            fontFamily: fonts.main,
          }}
        >
          &ldquo;{content.quote}&rdquo;
        </p>

        {/* Attribution with mint dashes */}
        {content.attribution && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 2, backgroundColor: colors.mint }} />
            <span
              style={{
                fontSize: typeScale.caption.fontSize,
                fontWeight: typeScale.caption.fontWeight,
                lineHeight: typeScale.caption.lineHeight,
                letterSpacing: "0.04em",
                color: colors.mint,
                fontFamily: fonts.main,
              }}
            >
              {content.attribution}
            </span>
            <div style={{ width: 32, height: 2, backgroundColor: colors.mint }} />
          </div>
        )}
      </div>
    </div>
  );
}
