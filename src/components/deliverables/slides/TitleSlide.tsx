"use client";

import type { TitleSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, getAccent } from "@/lib/slide-theme";

interface TitleSlideProps {
  content: TitleSlideContent;
  brandPrimary: string;
}

export default function TitleSlide({ content, brandPrimary }: TitleSlideProps) {
  const colors = getSlideColors(brandPrimary);

  return (
    <div
      style={{
        ...slideContainerStyle(colors),
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
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
          backgroundColor: colors.mint,
          opacity: 0.25,
          borderRadius: radii.pill,
          right: -40,
          top: -40,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 120,
          height: 120,
          backgroundColor: colors.coral,
          opacity: 0.2,
          borderRadius: radii.pill,
          right: 120,
          top: 32,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.electric,
          opacity: 0.2,
          borderRadius: radii.pill,
          bottom: -40,
          left: -20,
        }}
      />

      {/* Small accent dots */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.sunny, opacity: 0.6, borderRadius: radii.pill, right: "30%", top: "20%" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 8, height: 8, backgroundColor: colors.coral, opacity: 0.5, borderRadius: radii.pill, right: "15%", top: "55%" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.mint, opacity: 0.3, borderRadius: radii.pill, left: "60%", bottom: "30%" }}
      />

      {/* Diagonal mint accent stripe */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 8,
          backgroundColor: colors.mint,
          opacity: 0.5,
          right: -80,
          bottom: 0,
          transformOrigin: "bottom right",
          transform: "rotate(-12deg)",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column" }}>
        {/* Mint accent bar */}
        <div
          style={{
            width: spacing.accentBarWidth,
            height: spacing.accentBarHeight,
            backgroundColor: colors.mint,
            borderRadius: radii.pill,
            marginBottom: spacing.sectionGap,
          }}
        />

        {/* Main title */}
        <h1
          style={{
            fontSize: typeScale.h1.fontSize,
            fontWeight: typeScale.h1.fontWeight,
            lineHeight: typeScale.h1.lineHeight,
            letterSpacing: typeScale.h1.letterSpacing,
            color: colors.white,
            fontFamily: fonts.main,
            maxWidth: "85%",
          }}
        >
          {content.mainTitle}
        </h1>

        {content.subtitle && (
          <p
            style={{
              fontSize: typeScale.body.fontSize,
              fontWeight: typeScale.body.fontWeight,
              lineHeight: typeScale.body.lineHeight,
              color: colors.light,
              fontFamily: fonts.main,
              marginTop: spacing.accentBarGap,
              maxWidth: "80%",
            }}
          >
            {content.subtitle}
          </p>
        )}

        {/* Metadata pills */}
        {content.metadata && content.metadata.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.elementGap, marginTop: spacing.sectionGap }}>
            {content.metadata.map((item, i) => {
              const accent = getAccent(colors, i);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: radii.pill,
                    padding: "8px 20px",
                    fontSize: typeScale.caption.fontSize,
                    fontWeight: typeScale.caption.fontWeight,
                    lineHeight: typeScale.caption.lineHeight,
                    backgroundColor: `${accent}22`,
                    color: accent === colors.sunny ? colors.sunny : colors.white,
                    border: `1px solid ${accent}44`,
                    fontFamily: fonts.main,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{item.label}</span>
                  <span style={{ opacity: 0.7 }}>{item.value}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
