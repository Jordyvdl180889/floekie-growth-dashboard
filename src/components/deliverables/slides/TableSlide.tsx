"use client";

import type { TableSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle } from "@/lib/slide-theme";

interface TableSlideProps {
  content: TableSlideContent;
  brandPrimary: string;
}

function isMetricCell(value: string): boolean {
  return /^[\d$%+\-.,]+[%xk]?$/i.test(value.trim());
}

export default function TableSlide({
  content,
  brandPrimary,
}: TableSlideProps) {
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
      {/* Decorative dots */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.mint, opacity: 0.4, borderRadius: radii.pill, right: 48, top: 48 }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 8, height: 8, backgroundColor: colors.coral, opacity: 0.3, borderRadius: radii.pill, right: 80, top: 56 }}
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

      {/* Table container */}
      <div
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          overflow: "hidden",
          borderRadius: radii.card,
          backgroundColor: colors.darkCard,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {content.headers.map((header, i) => (
                <th
                  key={i}
                  style={{
                    padding: "20px 24px",
                    textAlign: "left",
                    fontSize: typeScale.h3.fontSize,
                    fontWeight: typeScale.h3.fontWeight,
                    lineHeight: typeScale.h3.lineHeight,
                    backgroundColor: colors.mint,
                    color: colors.darkBg,
                    fontFamily: fonts.main,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => {
                  const isMetric = cellIdx > 0 && isMetricCell(cell);
                  const isEvenRow = rowIdx % 2 === 0;
                  return (
                    <td
                      key={cellIdx}
                      style={{
                        padding: "16px 24px",
                        fontSize: typeScale.body.fontSize,
                        lineHeight: typeScale.body.lineHeight,
                        backgroundColor: isEvenRow ? "transparent" : `${colors.darkBg}60`,
                        borderBottom: `1px solid ${colors.darkBorder}`,
                        color: isMetric ? colors.sunny : cellIdx === 0 ? "#e2e8f0" : colors.light,
                        fontWeight: cellIdx === 0 ? 600 : isMetric ? 700 : 400,
                        fontFamily: fonts.main,
                      }}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
