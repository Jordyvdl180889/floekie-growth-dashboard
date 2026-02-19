"use client";

import type { IconGridSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface IconGridSlideProps {
  content: IconGridSlideContent;
  brandPrimary: string;
}

export default function IconGridSlide({ content, brandPrimary }: IconGridSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const count = content.items.length;
  const cols = count <= 3 ? count : count <= 4 ? 2 : 3;

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
          borderRadius: radii.pill,
          backgroundColor: colors.electric,
          opacity: 0.08,
          left: -50,
          bottom: -50,
        }}
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

      {/* Icon grid */}
      <div
        style={{
          marginTop: spacing.sectionGap,
          display: "grid",
          flex: 1,
          gap: spacing.cardGap,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          alignContent: "start",
        }}
      >
        {content.items.map((item, i) => {
          const accent = getAccent(colors, i);
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                gap: spacing.elementGap,
                borderRadius: radii.card,
                padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                backgroundColor: colors.darkCard,
                borderTop: `3px solid ${accent}`,
                textAlign: "center",
              }}
            >
              {/* Icon container */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radii.card,
                  backgroundColor: `${accent}20`,
                  fontSize: 24,
                }}
              >
                {item.icon}
              </div>

              <span
                style={{
                  fontSize: typeScale.h3.fontSize,
                  fontWeight: typeScale.h3.fontWeight,
                  lineHeight: typeScale.h3.lineHeight,
                  color: accent,
                  fontFamily: fonts.main,
                }}
              >
                {item.title}
              </span>

              {item.description && (
                <span
                  style={{
                    fontSize: typeScale.bodySmall.fontSize,
                    fontWeight: typeScale.bodySmall.fontWeight,
                    lineHeight: typeScale.bodySmall.lineHeight,
                    color: colors.light,
                    fontFamily: fonts.main,
                  }}
                >
                  {item.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
