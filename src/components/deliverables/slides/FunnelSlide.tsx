"use client";

import type { FunnelSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface FunnelSlideProps {
  content: FunnelSlideContent;
  brandPrimary: string;
}

export default function FunnelSlide({ content, brandPrimary }: FunnelSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const layers = content.layers;

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
          backgroundColor: colors.sunny,
          opacity: 0.08,
          right: -30,
          top: -30,
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

      {/* Funnel layers — progressively narrower */}
      <div
        className="flex flex-col items-center"
        style={{ marginTop: spacing.sectionGap, flex: 1, gap: spacing.listGap }}
      >
        {layers.map((layer, i) => {
          const accent = getAccent(colors, i);
          // Width narrows from 100% to ~45%
          const widthPercent = 100 - (i * (55 / Math.max(layers.length - 1, 1)));

          return (
            <div
              key={i}
              className="relative flex items-center justify-between"
              style={{
                width: `${widthPercent}%`,
                borderRadius: radii.cardLg,
                padding: "16px 24px",
                backgroundColor: accent,
                minHeight: 56,
              }}
            >
              {/* Layer label */}
              <div className="flex flex-col">
                <span
                  style={{
                    textTransform: "uppercase",
                    fontSize: typeScale.h3.fontSize,
                    fontWeight: typeScale.h3.fontWeight,
                    lineHeight: typeScale.h3.lineHeight,
                    color: accent === colors.sunny ? colors.darkBg : colors.white,
                    fontFamily: fonts.main,
                  }}
                >
                  {layer.label}
                </span>
                {layer.description && (
                  <span
                    style={{
                      fontSize: typeScale.bodySmall.fontSize,
                      fontWeight: typeScale.bodySmall.fontWeight,
                      lineHeight: typeScale.bodySmall.lineHeight,
                      color: accent === colors.sunny ? colors.darkBg : `${colors.white}CC`,
                      fontFamily: fonts.main,
                      marginTop: 2,
                    }}
                  >
                    {layer.description}
                  </span>
                )}
              </div>

              {/* Optional value */}
              {layer.value && (
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: accent === colors.sunny ? colors.darkBg : colors.white,
                    fontFamily: fonts.main,
                  }}
                >
                  {layer.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
