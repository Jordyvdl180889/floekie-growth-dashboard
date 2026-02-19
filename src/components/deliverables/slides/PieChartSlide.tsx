"use client";

import type { PieChartSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface PieChartSlideProps {
  content: PieChartSlideContent;
  brandPrimary: string;
}

export default function PieChartSlide({ content, brandPrimary }: PieChartSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const defaultColors = [colors.mint, colors.coral, colors.electric, colors.sunny, colors.mintDark, "#9B59B6"];
  const total = content.slices.reduce((sum, s) => sum + s.value, 0);

  // Build SVG pie slices using path arcs
  const cx = 120;
  const cy = 120;
  const r = 100;
  let startAngle = -90; // start from top

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const slicePaths = content.slices.map((slice, i) => {
    const percent = total > 0 ? slice.value / total : 0;
    const angle = percent * 360;
    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const sliceColor = slice.color || defaultColors[i % defaultColors.length];

    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

    startAngle = endAngle;

    return (
      <path
        key={i}
        d={d}
        fill={sliceColor}
        stroke={colors.darkBg}
        strokeWidth={2}
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
        {/* Pie SVG */}
        <div style={{ flexShrink: 0 }}>
          <svg width={240} height={240} viewBox={`0 0 ${cx * 2} ${cy * 2}`}>
            {slicePaths}
          </svg>
        </div>

        {/* Legend with values */}
        <div className="flex flex-col" style={{ gap: spacing.listGap }}>
          {content.slices.map((slice, i) => {
            const sliceColor = slice.color || defaultColors[i % defaultColors.length];
            const percent = total > 0 ? Math.round((slice.value / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center" style={{ gap: spacing.listGap }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: sliceColor,
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
                    flex: 1,
                  }}
                >
                  {slice.label}
                </span>
                <span
                  style={{
                    fontSize: typeScale.caption.fontSize,
                    fontWeight: 700,
                    color: sliceColor,
                    fontFamily: fonts.main,
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
