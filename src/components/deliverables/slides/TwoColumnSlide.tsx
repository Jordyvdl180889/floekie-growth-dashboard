"use client";

import type { TwoColumnSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle, headingStyle } from "@/lib/slide-theme";

interface TwoColumnSlideProps {
  content: TwoColumnSlideContent;
  brandPrimary: string;
}

function Column({
  data,
  bgColor,
  textColor,
  bulletColor,
  subColor,
}: {
  data: { heading: string; body?: string; bullets?: string[] };
  bgColor: string;
  textColor: string;
  bulletColor: string;
  subColor: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: spacing.elementGap,
        borderRadius: radii.card,
        padding: `${spacing.cardPy}px ${spacing.cardPx}px`,
        backgroundColor: bgColor,
      }}
    >
      {/* Column heading — overline style */}
      <h3
        style={{
          fontSize: typeScale.overline.fontSize,
          fontWeight: typeScale.overline.fontWeight,
          letterSpacing: typeScale.overline.letterSpacing,
          lineHeight: typeScale.overline.lineHeight,
          textTransform: "uppercase",
          color: textColor,
          fontFamily: fonts.main,
          opacity: 0.85,
        }}
      >
        {data.heading}
      </h3>

      {/* Divider */}
      <div style={{ width: 40, height: 2, backgroundColor: textColor, opacity: 0.3 }} />

      {data.body && (
        <p
          style={{
            fontSize: typeScale.body.fontSize,
            fontWeight: typeScale.body.fontWeight,
            lineHeight: typeScale.body.lineHeight,
            color: subColor,
            fontFamily: fonts.main,
          }}
        >
          {data.body}
        </p>
      )}

      {data.bullets && data.bullets.length > 0 && (
        <ul style={{ display: "flex", flexDirection: "column", gap: spacing.listGap, listStyle: "none", padding: 0, margin: 0 }}>
          {data.bullets.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: bulletColor,
                  borderRadius: radii.pill,
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <span
                style={{
                  fontSize: typeScale.body.fontSize,
                  lineHeight: typeScale.body.lineHeight,
                  color: textColor,
                  fontFamily: fonts.main,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TwoColumnSlide({
  content,
  brandPrimary,
}: TwoColumnSlideProps) {
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
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 120,
          height: 120,
          backgroundColor: colors.sunny,
          opacity: 0.12,
          borderRadius: radii.pill,
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

      {/* Two columns */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "stretch",
          gap: spacing.cardGap,
          marginTop: spacing.sectionGap,
        }}
      >
        <Column
          data={content.left}
          bgColor={colors.mint}
          textColor={colors.darkBg}
          bulletColor="rgba(15,27,45,0.5)"
          subColor="rgba(15,27,45,0.8)"
        />
        <Column
          data={content.right}
          bgColor={colors.electric}
          textColor={colors.white}
          bulletColor="rgba(255,255,255,0.5)"
          subColor="rgba(255,255,255,0.8)"
        />
      </div>
    </div>
  );
}
