"use client";

import type { PersonaSlideContent } from "@/types";
import { getSlideColors, fonts, typeScale, spacing, radii, slideContainerStyle } from "@/lib/slide-theme";

interface PersonaSlideProps {
  content: PersonaSlideContent;
  brandPrimary: string;
}

export default function PersonaSlide({
  content,
  brandPrimary,
}: PersonaSlideProps) {
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
      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute"
        style={{ width: 160, height: 160, backgroundColor: colors.mint, opacity: 0.12, borderRadius: radii.pill, right: -40, top: -40 }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 12, height: 12, backgroundColor: colors.sunny, opacity: 0.5, borderRadius: radii.pill, right: "25%", bottom: "15%" }}
      />

      {/* Overline label */}
      <span
        style={{
          fontSize: typeScale.overline.fontSize,
          fontWeight: typeScale.overline.fontWeight,
          letterSpacing: typeScale.overline.letterSpacing,
          lineHeight: typeScale.overline.lineHeight,
          textTransform: "uppercase",
          color: colors.coral,
          fontFamily: fonts.main,
        }}
      >
        Target Persona
      </span>

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

      {/* Persona identity row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: spacing.sectionGap }}>
        {/* Gradient avatar circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: radii.pill,
            background: `linear-gradient(135deg, ${colors.mint}, ${colors.electric})`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.white,
              fontFamily: fonts.main,
            }}
          >
            {content.name.charAt(0)}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Name */}
          <span
            style={{
              fontSize: typeScale.h3.fontSize,
              fontWeight: typeScale.h3.fontWeight,
              lineHeight: typeScale.h3.lineHeight,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: colors.white,
              fontFamily: fonts.main,
            }}
          >
            {content.name}
          </span>
          {content.role && (
            <span
              style={{
                fontSize: typeScale.body.fontSize,
                lineHeight: typeScale.body.lineHeight,
                color: colors.light,
                fontFamily: fonts.main,
              }}
            >
              {content.role}
            </span>
          )}
        </div>
      </div>

      {/* Two-column: Pain Points / Goals */}
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
        {/* Pain Points */}
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.elementGap }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: radii.pill,
                backgroundColor: colors.coral,
                color: colors.white,
                fontSize: typeScale.bodySmall.fontSize,
                fontWeight: 700,
              }}
            >
              !
            </span>
            <span
              style={{
                fontSize: typeScale.overline.fontSize,
                fontWeight: typeScale.overline.fontWeight,
                letterSpacing: typeScale.overline.letterSpacing,
                lineHeight: typeScale.overline.lineHeight,
                textTransform: "uppercase",
                color: colors.coral,
                fontFamily: fonts.main,
              }}
            >
              Pain Points
            </span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: spacing.listGap, listStyle: "none", padding: 0, margin: 0 }}>
            {content.painPoints.map((point, i) => (
              <li
                key={i}
                style={{
                  borderRadius: radii.card,
                  padding: "16px 20px",
                  backgroundColor: colors.coral,
                  color: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    lineHeight: typeScale.body.lineHeight,
                    fontFamily: fonts.main,
                  }}
                >
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.elementGap }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: radii.pill,
                backgroundColor: colors.sunny,
                color: colors.darkBg,
                fontSize: typeScale.bodySmall.fontSize,
                fontWeight: 700,
              }}
            >
              {"\u2713"}
            </span>
            <span
              style={{
                fontSize: typeScale.overline.fontSize,
                fontWeight: typeScale.overline.fontWeight,
                letterSpacing: typeScale.overline.letterSpacing,
                lineHeight: typeScale.overline.lineHeight,
                textTransform: "uppercase",
                color: colors.sunny,
                fontFamily: fonts.main,
              }}
            >
              Goals
            </span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: spacing.listGap, listStyle: "none", padding: 0, margin: 0 }}>
            {content.goals.map((goal, i) => (
              <li
                key={i}
                style={{
                  borderRadius: radii.card,
                  padding: "16px 20px",
                  backgroundColor: colors.sunny,
                  color: colors.darkBg,
                }}
              >
                <span
                  style={{
                    fontSize: typeScale.body.fontSize,
                    fontWeight: 500,
                    lineHeight: typeScale.body.lineHeight,
                    fontFamily: fonts.main,
                  }}
                >
                  {goal}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
