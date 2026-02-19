"use client";

import type { CardGridSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, shadows, slideContainerStyle, headingStyle, getAccent } from "@/lib/slide-theme";

interface CardGridSlideProps {
  content: CardGridSlideContent;
  brandPrimary: string;
}

export default function CardGridSlide({ content, brandPrimary }: CardGridSlideProps) {
  const colors = getSlideColors(brandPrimary);
  const accentMap: Record<string, string> = {
    mint: colors.mint,
    coral: colors.coral,
    electric: colors.electric,
    sunny: colors.sunny,
  };
  const defaultAccents = [colors.mint, colors.electric, colors.coral, colors.sunny, colors.mintDark, colors.electric];
  const count = content.cards.length;
  const cols = count <= 2 ? 2 : count <= 3 ? 3 : count <= 4 ? 2 : 3;

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
          width: 140,
          height: 140,
          backgroundColor: colors.sunny,
          opacity: 0.08,
          right: -30,
          bottom: -30,
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

      {/* Card grid */}
      <div
        className="grid"
        style={{
          marginTop: spacing.sectionGap,
          flex: 1,
          gap: spacing.cardGap,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          alignContent: "start",
        }}
      >
        {content.cards.map((card, i) => {
          const accent = card.accent ? (accentMap[card.accent] || defaultAccents[i % defaultAccents.length]) : defaultAccents[i % defaultAccents.length];
          const isFilled = i % 3 === 0;

          return (
            <div
              key={i}
              className="flex flex-col"
              style={{
                gap: spacing.elementGap,
                padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
                borderRadius: radii.card,
                backgroundColor: isFilled ? accent : colors.darkCard,
                borderLeft: isFilled ? "none" : `3px solid ${accent}`,
              }}
            >
              <span
                style={{
                  fontSize: typeScale.h3.fontSize,
                  fontWeight: typeScale.h3.fontWeight,
                  color: isFilled
                    ? (accent === colors.sunny ? colors.darkBg : colors.white)
                    : accent,
                  fontFamily: fonts.main,
                }}
              >
                {card.title}
              </span>
              <p
                style={{
                  fontSize: typeScale.body.fontSize,
                  fontWeight: typeScale.body.fontWeight,
                  color: isFilled
                    ? (accent === colors.sunny ? colors.darkBg : `${colors.white}DD`)
                    : colors.light,
                  fontFamily: fonts.main,
                  lineHeight: typeScale.body.lineHeight,
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
