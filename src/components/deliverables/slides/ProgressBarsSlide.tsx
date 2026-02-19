"use client";

import type { ProgressBarsSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface ProgressBarsSlideProps {
  content: ProgressBarsSlideContent;
  brandPrimary: string;
}

export default function ProgressBarsSlide({ content, brandPrimary }: ProgressBarsSlideProps) {
  const colors = getSlideColors(brandPrimary);

  function getBarColor(percent: number) {
    if (percent >= 75) return colors.mint;
    if (percent >= 50) return colors.electric;
    if (percent >= 25) return colors.sunny;
    return colors.coral;
  }

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
          width: 100,
          height: 100,
          backgroundColor: colors.mint,
          opacity: 0.08,
          right: -20,
          top: -20,
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

      {/* Progress items */}
      <div
        className="flex flex-col justify-center"
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          gap: 24,
        }}
      >
        {content.items.map((item, i) => {
          const max = item.max || 100;
          const percent = Math.min((item.value / max) * 100, 100);
          const barColor = getBarColor(percent);

          return (
            <div key={i} className="flex flex-col" style={{ gap: 8 }}>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 500,
                    color: colors.white,
                    fontFamily: fonts.main,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 700,
                    color: barColor,
                    fontFamily: fonts.main,
                  }}
                >
                  {item.displayValue || `${Math.round(percent)}%`}
                </span>
              </div>

              {/* Track */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: 12,
                  backgroundColor: colors.darkCard,
                  borderRadius: radii.pill,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}BB)`,
                    borderRadius: radii.pill,
                    boxShadow: shadows.glow(barColor),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
