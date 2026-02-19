"use client";

import type { TimelineSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface TimelineSlideProps {
  content: TimelineSlideContent;
  brandPrimary: string;
}

export default function TimelineSlide({
  content,
  brandPrimary,
}: TimelineSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const steps = content.steps;

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
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          borderRadius: radii.pill,
          backgroundColor: colors.electric,
          opacity: 0.1,
          right: -30,
          bottom: -30,
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

      {/* Timeline */}
      <div
        className="relative flex items-center"
        style={{ marginTop: spacing.sectionGap, flex: 1 }}
      >
        {/* Connecting gradient line */}
        <div
          className="absolute"
          style={{
            left: 24,
            right: 24,
            top: 26,
            height: 3,
            background: `linear-gradient(90deg, ${colors.mint}, ${colors.coral}, ${colors.electric})`,
            borderRadius: 2,
          }}
        />

        <div
          className="relative"
          style={{
            display: "grid",
            width: "100%",
            gap: spacing.cardGap,
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            zIndex: 10,
          }}
        >
          {steps.map((step, i) => {
            const accent = getAccent(colors, i);
            return (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ gap: spacing.cardGap }}
              >
                {/* Step circle with number */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: radii.pill,
                    backgroundColor: accent,
                    color: accent === colors.sunny ? colors.darkBg : colors.white,
                    fontSize: typeScale.h3.fontSize,
                    fontWeight: 700,
                    fontFamily: fonts.main,
                    boxShadow: `0 0 24px ${accent}50`,
                  }}
                >
                  {i + 1}
                </div>

                {/* Step content card */}
                <div
                  className="flex flex-col items-center"
                  style={{
                    width: "100%",
                    gap: spacing.elementGap,
                    borderRadius: radii.card,
                    padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                    backgroundColor: colors.darkCard,
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: typeScale.h3.fontSize,
                      fontWeight: typeScale.h3.fontWeight,
                      lineHeight: typeScale.h3.lineHeight,
                      color: accent,
                      fontFamily: fonts.main,
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontSize: typeScale.bodySmall.fontSize,
                      fontWeight: typeScale.bodySmall.fontWeight,
                      lineHeight: typeScale.bodySmall.lineHeight,
                      color: colors.light,
                      fontFamily: fonts.main,
                    }}
                  >
                    {step.description}
                  </span>
                  {step.timing && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        borderRadius: radii.pill,
                        padding: "4px 12px",
                        fontSize: typeScale.overline.fontSize,
                        fontWeight: typeScale.overline.fontWeight,
                        textTransform: "uppercase",
                        letterSpacing: typeScale.overline.letterSpacing,
                        backgroundColor: `${accent}20`,
                        color: accent,
                        fontFamily: fonts.main,
                      }}
                    >
                      {step.timing}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
