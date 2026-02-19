"use client";

import type { BulletsSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface BulletsSlideProps {
  content: BulletsSlideContent;
  brandPrimary: string;
}

export default function BulletsSlide({
  content,
  brandPrimary,
}: BulletsSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const bulletCount = content.bullets.length;
  const useCards = bulletCount <= 4;

  const cardStyles = [
    { bg: colors.mint, text: colors.darkBg, sub: "rgba(15,27,45,0.7)" },
    { bg: colors.coral, text: colors.white, sub: "rgba(255,255,255,0.7)" },
    { bg: colors.darkCard, text: "#e2e8f0", sub: colors.muted },
    { bg: colors.darkCard, text: "#e2e8f0", sub: colors.muted },
  ];

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
      {/* Decorative circle — top right */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.mint,
          opacity: 0.15,
          borderRadius: radii.pill,
          right: -40,
          top: -40,
        }}
      />

      {/* Heading */}
      <h2
        style={{
          ...headingStyle(),
          color: colors.white,
        }}
      >
        {content.heading}
      </h2>

      {/* Accent bar */}
      <div
        style={{
          width: spacing.accentBarWidth,
          height: spacing.accentBarHeight,
          backgroundColor: colors.mint,
          borderRadius: radii.pill,
          marginTop: spacing.accentBarGap,
        }}
      />

      {content.intro && (
        <p
          style={{
            fontSize: typeScale.body.fontSize,
            fontWeight: typeScale.body.fontWeight,
            lineHeight: typeScale.body.lineHeight,
            color: colors.light,
            fontFamily: fonts.main,
            marginTop: spacing.accentBarGap,
            maxWidth: "90%",
          }}
        >
          {content.intro}
        </p>
      )}

      {useCards ? (
        /* 2-column card grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: spacing.cardGap,
            marginTop: spacing.sectionGap,
            flex: 1,
            alignContent: "start",
          }}
        >
          {content.bullets.map((bullet, i) => {
            const style = cardStyles[i % cardStyles.length];
            const isColored = style.bg === colors.mint || style.bg === colors.coral;
            const dotColor = getAccent(colors, i);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.elementGap,
                  borderRadius: radii.card,
                  padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                  backgroundColor: style.bg,
                  borderLeft: isColored ? "none" : `4px solid ${dotColor}`,
                }}
              >
                {/* Number badge */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: radii.pill,
                    backgroundColor: isColored ? "rgba(255,255,255,0.2)" : `${dotColor}25`,
                    color: isColored ? (style.bg === colors.mint ? colors.darkBg : colors.white) : dotColor,
                    fontSize: typeScale.bodySmall.fontSize,
                    fontWeight: 700,
                    fontFamily: fonts.main,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 500,
                    lineHeight: typeScale.body.lineHeight,
                    color: style.text,
                    fontFamily: fonts.main,
                  }}
                >
                  {bullet.text}
                </span>
                {bullet.sub && (
                  <p
                    style={{
                      fontSize: typeScale.bodySmall.fontSize,
                      lineHeight: typeScale.bodySmall.lineHeight,
                      color: style.sub,
                      fontFamily: fonts.main,
                    }}
                  >
                    {bullet.sub}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Clean list layout for many bullets */
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.listGap,
            marginTop: spacing.sectionGap,
            listStyle: "none",
            padding: 0,
            margin: 0,
            marginBlockStart: spacing.sectionGap,
          }}
        >
          {content.bullets.map((bullet, i) => {
            const dotColor = getAccent(colors, i);
            return (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: dotColor,
                    borderRadius: radii.pill,
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: typeScale.body.fontSize,
                      fontWeight: 500,
                      lineHeight: typeScale.body.lineHeight,
                      color: "#e2e8f0",
                      fontFamily: fonts.main,
                    }}
                  >
                    {bullet.text}
                  </span>
                  {bullet.sub && (
                    <p
                      style={{
                        fontSize: typeScale.bodySmall.fontSize,
                        lineHeight: typeScale.bodySmall.lineHeight,
                        color: colors.muted,
                        fontFamily: fonts.main,
                        marginTop: 4,
                      }}
                    >
                      {bullet.sub}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
