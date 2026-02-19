"use client";

import type { DonutChartSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface DonutChartSlideProps {
  content: DonutChartSlideContent;
  brandPrimary: string;
}

export default function DonutChartSlide({ content, brandPrimary }: DonutChartSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const defaultColors = [colors.mint, colors.coral, colors.electric, colors.sunny, colors.mintDark, "#9B59B6"];
  const total = content.segments.reduce((sum, s) => sum + s.value, 0);

  // Build SVG donut segments
  const radius = 90;
  const cx = 120;
  const cy = 120;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const segmentPaths = content.segments.map((seg, i) => {
    const percent = total > 0 ? seg.value / total : 0;
    const offset = circumference * (1 - percent);
    const rotation = cumulativePercent * 360 - 90;
    cumulativePercent += percent;
    const segColor = seg.color || defaultColors[i % defaultColors.length];

    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={segColor}
        strokeWidth={28}
        strokeDasharray={`${circumference * percent} ${circumference * (1 - percent)}`}
        strokeDashoffset={0}
        transform={`rotate(${rotation} ${cx} ${cy})`}
        strokeLinecap="round"
      />
    );
  });

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

      <div
        className="flex items-center"
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          gap: 48,
        }}
      >
        {/* Donut SVG */}
        <div className="relative" style={{ flexShrink: 0 }}>
          <svg width={240} height={240} viewBox={`0 0 ${cx * 2} ${cy * 2}`}>
            {segmentPaths}
          </svg>
          {/* Center text */}
          {(content.centerValue || content.centerLabel) && (
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{ inset: 0 }}
            >
              {content.centerValue && (
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: colors.white,
                    fontFamily: fonts.main,
                  }}
                >
                  {content.centerValue}
                </span>
              )}
              {content.centerLabel && (
                <span
                  style={{
                    fontSize: typeScale.caption.fontSize,
                    fontWeight: 500,
                    color: colors.muted,
                    fontFamily: fonts.main,
                  }}
                >
                  {content.centerLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col" style={{ gap: spacing.listGap }}>
          {content.segments.map((seg, i) => {
            const segColor = seg.color || defaultColors[i % defaultColors.length];
            const percent = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center" style={{ gap: spacing.listGap }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: segColor,
                    borderRadius: radii.badge,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: typeScale.body.fontWeight,
                    color: colors.light,
                    fontFamily: fonts.main,
                  }}
                >
                  {seg.label}
                </span>
                <span
                  style={{
                    fontSize: typeScale.caption.fontSize,
                    fontWeight: 700,
                    color: segColor,
                    fontFamily: fonts.main,
                    marginLeft: "auto",
                  }}
                >
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
