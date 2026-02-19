"use client";

import type { TextSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle } from "@/lib/slide-theme";

interface TextSlideProps {
  content: TextSlideContent;
  brandPrimary: string;
}

export default function TextSlide({ content, brandPrimary }: TextSlideProps) {
  const colors = getSlideColors(brandPrimary);

  return (
    <div
      style={{
        ...slideContainerStyle(colors),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle — right side */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          borderRadius: radii.pill,
          backgroundColor: colors.electric,
          opacity: 0.15,
          right: -40,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      {/* Small accent dot */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 12,
          height: 12,
          borderRadius: radii.pill,
          backgroundColor: colors.coral,
          opacity: 0.4,
          left: 32,
          bottom: 32,
        }}
      />

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

      {/* Content panel with mint left accent bar */}
      <div
        style={{
          marginTop: spacing.sectionGap,
          maxWidth: 720,
          borderRadius: radii.card,
          padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
          backgroundColor: colors.darkCard,
          borderLeft: `4px solid ${colors.mint}`,
        }}
      >
        <p
          className="whitespace-pre-line"
          style={{
            fontSize: typeScale.body.fontSize,
            lineHeight: typeScale.body.lineHeight,
            fontWeight: typeScale.body.fontWeight,
            color: colors.light,
            fontFamily: fonts.main,
          }}
        >
          {content.body}
        </p>
      </div>
    </div>
  );
}
