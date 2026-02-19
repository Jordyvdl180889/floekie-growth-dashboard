"use client";

import type { ComparisonSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle } from "@/lib/slide-theme";

interface ComparisonSlideProps {
  content: ComparisonSlideContent;
  brandPrimary: string;
}

export default function ComparisonSlide({ content, brandPrimary }: ComparisonSlideProps) {
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
          borderRadius: radii.pill,
          backgroundColor: colors.coral,
          opacity: 0.1,
          right: -40,
          top: -40,
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

      {/* Two comparison columns */}
      <div
        className="grid grid-cols-2"
        style={{
          marginTop: spacing.sectionGap,
          gap: spacing.cardGap,
          alignContent: "start",
          flex: 1,
        }}
      >
        {/* LEFT — coral theme (before / problem) */}
        <div className="flex flex-col" style={{ gap: spacing.listGap }}>
          <div
            style={{
              borderRadius: radii.pill,
              padding: "12px 20px",
              backgroundColor: colors.coral,
            }}
          >
            <span
              style={{
                textTransform: "uppercase",
                fontSize: typeScale.overline.fontSize,
                fontWeight: typeScale.overline.fontWeight,
                letterSpacing: typeScale.overline.letterSpacing,
                color: colors.white,
                fontFamily: fonts.main,
              }}
            >
              {content.left.label}
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: spacing.listGap }}>
            {content.left.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{
                  gap: 12,
                  borderRadius: radii.card,
                  padding: "16px 20px",
                  backgroundColor: colors.darkCard,
                }}
              >
                <span
                  style={{
                    color: colors.coral,
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 700,
                    lineHeight: typeScale.body.lineHeight,
                  }}
                >
                  {"\u2717"}
                </span>
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: typeScale.body.fontWeight,
                    lineHeight: typeScale.body.lineHeight,
                    color: colors.light,
                    fontFamily: fonts.main,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — mint theme (after / solution) */}
        <div className="flex flex-col" style={{ gap: spacing.listGap }}>
          <div
            style={{
              borderRadius: radii.pill,
              padding: "12px 20px",
              backgroundColor: colors.mint,
            }}
          >
            <span
              style={{
                textTransform: "uppercase",
                fontSize: typeScale.overline.fontSize,
                fontWeight: typeScale.overline.fontWeight,
                letterSpacing: typeScale.overline.letterSpacing,
                color: colors.darkBg,
                fontFamily: fonts.main,
              }}
            >
              {content.right.label}
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: spacing.listGap }}>
            {content.right.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{
                  gap: 12,
                  borderRadius: radii.card,
                  padding: "16px 20px",
                  backgroundColor: colors.darkCard,
                }}
              >
                <span
                  style={{
                    color: colors.mint,
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 700,
                    lineHeight: typeScale.body.lineHeight,
                  }}
                >
                  {"\u2713"}
                </span>
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: typeScale.body.fontWeight,
                    lineHeight: typeScale.body.lineHeight,
                    color: colors.light,
                    fontFamily: fonts.main,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
