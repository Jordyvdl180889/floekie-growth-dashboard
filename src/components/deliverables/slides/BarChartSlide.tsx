"use client";

import type { BarChartSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface BarChartSlideProps {
  content: BarChartSlideContent;
  brandPrimary: string;
}

export default function BarChartSlide({ content, brandPrimary }: BarChartSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const maxVal = content.maxValue || Math.max(...content.bars.map((b) => b.value), 1);

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

      {/* Bars — horizontal */}
      <div
        className="flex flex-col justify-center"
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          gap: spacing.cardGap,
        }}
      >
        {content.bars.map((bar, i) => {
          const percent = Math.min((bar.value / maxVal) * 100, 100);
          const barColor = getAccent(colors, i);

          return (
            <div key={i} className="flex items-center" style={{ gap: spacing.cardGap }}>
              {/* Label */}
              <span
                style={{
                  width: 140,
                  flexShrink: 0,
                  textAlign: "right",
                  fontSize: typeScale.body.fontSize,
                  fontWeight: typeScale.body.fontWeight,
                  color: colors.light,
                  fontFamily: fonts.main,
                }}
              >
                {bar.label}
              </span>

              {/* Bar track */}
              <div
                className="relative overflow-hidden"
                style={{
                  flex: 1,
                  height: 28,
                  backgroundColor: colors.darkCard,
                  borderRadius: radii.pill,
                }}
              >
                {/* Bar fill */}
                <div
                  className="absolute"
                  style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${percent}%`,
                    backgroundColor: barColor,
                    borderRadius: radii.pill,
                    boxShadow: shadows.glow(barColor),
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Value */}
              <span
                style={{
                  width: 64,
                  flexShrink: 0,
                  fontSize: typeScale.body.fontSize,
                  fontWeight: 700,
                  color: barColor,
                  fontFamily: fonts.main,
                }}
              >
                {bar.displayValue || bar.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
