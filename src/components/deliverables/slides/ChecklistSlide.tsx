"use client";

import type { ChecklistSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle } from "@/lib/slide-theme";

interface ChecklistSlideProps {
  content: ChecklistSlideContent;
  brandPrimary: string;
}

export default function ChecklistSlide({ content, brandPrimary }: ChecklistSlideProps) {
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
          width: 120,
          height: 120,
          borderRadius: radii.pill,
          backgroundColor: colors.mint,
          opacity: 0.1,
          right: -20,
          bottom: -20,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 8,
          height: 8,
          borderRadius: radii.pill,
          backgroundColor: colors.sunny,
          opacity: 0.5,
          left: 40,
          bottom: 40,
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

      {/* Checklist items */}
      <div
        className="grid grid-cols-2"
        style={{
          marginTop: spacing.sectionGap,
          gap: spacing.cardGap,
        }}
      >
        {content.items.map((item, i) => {
          const isChecked = item.checked;
          const iconColor = isChecked ? colors.mint : colors.coral;
          const icon = isChecked ? "\u2713" : "\u2717";

          return (
            <div
              key={i}
              className="flex items-center"
              style={{
                gap: 16,
                borderRadius: radii.card,
                padding: "16px 20px",
                backgroundColor: colors.darkCard,
                borderLeft: `3px solid ${iconColor}`,
              }}
            >
              {/* Status circle */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: radii.pill,
                  backgroundColor: isChecked ? colors.mint : colors.coral,
                  color: isChecked ? colors.darkBg : colors.white,
                  fontSize: typeScale.bodySmall.fontSize,
                  fontWeight: 700,
                }}
              >
                {icon}
              </div>

              <span
                style={{
                  fontSize: typeScale.body.fontSize,
                  fontWeight: isChecked ? 500 : 400,
                  lineHeight: typeScale.body.lineHeight,
                  color: isChecked ? colors.white : colors.muted,
                  fontFamily: fonts.main,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
