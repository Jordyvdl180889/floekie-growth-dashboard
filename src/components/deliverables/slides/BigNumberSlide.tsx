"use client";

import type { BigNumberSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle } from "@/lib/slide-theme";

interface BigNumberSlideProps {
  content: BigNumberSlideContent;
  brandPrimary: string;
}

export default function BigNumberSlide({ content, brandPrimary }: BigNumberSlideProps) {
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
      {/* Large decorative ring */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 320,
          height: 320,
          borderRadius: radii.pill,
          border: `3px solid ${colors.mint}`,
          opacity: 0.15,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Smaller offset ring */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 220,
          height: 220,
          borderRadius: radii.pill,
          border: `2px solid ${colors.coral}`,
          opacity: 0.12,
          top: "50%",
          left: "50%",
          transform: "translate(-45%, -55%)",
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
          left: "15%",
          top: "20%",
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
          right: "18%",
          bottom: "25%",
        }}
      />

      {/* Optional heading */}
      {content.heading && (
        <span
          style={{
            marginBottom: 16,
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

      {/* Giant number */}
      <span
        className="relative"
        style={{
          zIndex: 10,
          fontSize: typeScale.hero.fontSize,
          fontWeight: typeScale.hero.fontWeight,
          lineHeight: typeScale.hero.lineHeight,
          letterSpacing: typeScale.hero.letterSpacing,
          color: colors.mint,
          fontFamily: fonts.main,
          textShadow: `0 0 60px ${colors.mint}40`,
        }}
      >
        {content.number}
      </span>

      {/* Mint accent bar */}
      <div
        style={{
          width: 64,
          height: spacing.accentBarHeight,
          backgroundColor: colors.mint,
          borderRadius: radii.pill,
          marginTop: 20,
        }}
      />

      {/* Label */}
      <span
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: typeScale.h2.fontSize,
          fontWeight: typeScale.h2.fontWeight,
          lineHeight: typeScale.h2.lineHeight,
          color: colors.white,
          fontFamily: fonts.main,
        }}
      >
        {content.label}
      </span>

      {/* Context */}
      {content.context && (
        <span
          style={{
            marginTop: 12,
            maxWidth: 448,
            textAlign: "center",
            fontSize: typeScale.body.fontSize,
            fontWeight: typeScale.body.fontWeight,
            lineHeight: typeScale.body.lineHeight,
            color: colors.light,
            fontFamily: fonts.main,
          }}
        >
          {content.context}
        </span>
      )}
    </div>
  );
}
