"use client";

import type { ThreeColumnSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface ThreeColumnSlideProps {
  content: ThreeColumnSlideContent;
  brandPrimary: string;
}

export default function ThreeColumnSlide({ content, brandPrimary }: ThreeColumnSlideProps) {
  const colors = getSlideColors(brandPrimary);

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
      {/* Decorative */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.electric,
          opacity: 0.08,
          left: -40,
          bottom: -40,
          borderRadius: radii.pill,
        }}
      />

      {/* Heading */}
      {content.heading && (
        <>
          <h2
            style={{
              ...headingStyle(),
              color: colors.white,
              margin: 0,
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

      {/* Columns */}
      <div
        className="grid"
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          gap: spacing.cardGap,
          gridTemplateColumns: `repeat(${Math.min(content.columns.length, 4)}, 1fr)`,
          alignContent: "start",
        }}
      >
        {content.columns.map((col, i) => {
          const accent = getAccent(colors, i);
          return (
            <div
              key={i}
              className="flex flex-col"
              style={{
                gap: spacing.elementGap,
                padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                borderRadius: radii.card,
                backgroundColor: colors.darkCard,
                borderTop: `3px solid ${accent}`,
              }}
            >
              {/* Column number + heading */}
              <div className="flex items-center" style={{ gap: spacing.elementGap }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    backgroundColor: accent,
                    borderRadius: radii.pill,
                    color: accent === colors.sunny ? colors.darkBg : colors.white,
                    fontSize: typeScale.caption.fontSize,
                    fontWeight: 700,
                    fontFamily: fonts.main,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: typeScale.h3.fontSize,
                    fontWeight: typeScale.h3.fontWeight,
                    color: accent,
                    fontFamily: fonts.main,
                  }}
                >
                  {col.heading}
                </span>
              </div>

              {/* Body */}
              {col.body && (
                <p
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: typeScale.body.fontWeight,
                    color: colors.light,
                    fontFamily: fonts.main,
                    lineHeight: typeScale.body.lineHeight,
                    margin: 0,
                  }}
                >
                  {col.body}
                </p>
              )}

              {/* Bullets */}
              {col.bullets && col.bullets.length > 0 && (
                <ul className="flex flex-col" style={{ gap: spacing.listGap, margin: 0, padding: 0, listStyle: "none" }}>
                  {col.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start" style={{ gap: 8 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          backgroundColor: accent,
                          borderRadius: radii.pill,
                          flexShrink: 0,
                          marginTop: 7,
                        }}
                      />
                      <span
                        style={{
                          fontSize: typeScale.bodySmall.fontSize,
                          fontWeight: typeScale.bodySmall.fontWeight,
                          color: colors.light,
                          fontFamily: fonts.main,
                          lineHeight: typeScale.bodySmall.lineHeight,
                        }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
