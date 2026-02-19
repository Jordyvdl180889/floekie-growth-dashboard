import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} from "docx";
import type { AudienceSpecs, DesignBriefing, UtmSet } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

interface ContentSection {
  title: string;
  type: string;
  body: string;
}

// Stretch Innovation brand colors
const BRAND = {
  green: "3ecda5",
  greenDark: "2ab090",
  dark: "1c2333",
  gray: "64748b",
  grayLight: "f1f5f9",
  grayMid: "e2e8f0",
  white: "ffffff",
};

const FUNNEL_LABELS: Record<number, string> = {
  1: "L1: Urgentie Creëren",
  2: "L2: Urgentie Capteren",
  3: "L3: Kwalificatie + Sale",
};

const typeLabels: Record<string, string> = {
  copy: "Copy",
  email: "Email",
  "social-post": "Social Post",
  outline: "Outline",
  template: "Template",
  assessment: "Assessment",
  article: "Artikel",
};

const channelLabels: Record<string, string> = {
  "linkedin-ads": "LinkedIn Ads",
  "meta-ads": "Meta Ads",
  "google-ads": "Google Ads",
  "reddit-ads": "Reddit Ads",
  "cold-email": "Cold Email",
  "email-warm": "Email (Warm)",
  "email-cold": "Email (Cold)",
  outbound: "Outbound",
  popup: "Popup",
  "organic-social": "Organic Social",
  "landing-page": "Landing Page",
  seo: "SEO",
  event: "Event",
  referral: "Referral",
  "product-hunt": "Product Hunt",
};

const metricLabels: Record<string, string> = {
  cpl: "CPL",
  cpc: "CPC",
  ctr: "CTR",
  conversion_rate: "Conversie",
  open_rate: "Open Rate",
  click_rate: "Click Rate",
  click_to_open_rate: "Click-to-Open",
  reply_rate: "Reply Rate",
  meeting_booked_rate: "Meeting Booked",
  unsubscribe_rate: "Unsubscribe",
};

// ─── Text Parsing ───

function parseTextRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const parts = text.split(/(\*\*.*?\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
    } else if (part) {
      runs.push(new TextRun({ text: part }));
    }
  }
  return runs;
}

function isLabelLine(line: string): boolean {
  return /^(Primary text|Headline|CTA button|CTA|Description|Subject line|Preview text|Body|Intro|Closing|Hook|Subheadline|Button text)\s*(\(.*?\))?:/i.test(
    line
  );
}

function parseLabelLine(line: string): TextRun[] {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return parseTextRuns(line);
  const label = line.slice(0, colonIdx + 1);
  const rest = line.slice(colonIdx + 1);
  return [
    new TextRun({ text: label, bold: true, color: BRAND.dark }),
    ...parseTextRuns(rest),
  ];
}

function parseContentBody(body: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = body.split("\n");
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      i++;
      continue;
    }

    // ## Heading
    if (trimmed.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^##\s+/, ""),
              bold: true,
              size: 24,
              color: BRAND.dark,
            }),
          ],
          spacing: { before: 240, after: 120 },
        })
      );
      i++;
      continue;
    }

    // === HEADING ===
    if (/^===\s+.+\s+===$/.test(trimmed)) {
      const heading = trimmed.replace(/^===\s+/, "").replace(/\s+===$/, "");
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: heading, bold: true, size: 24, color: BRAND.dark }),
          ],
          spacing: { before: 240, after: 120 },
        })
      );
      i++;
      continue;
    }

    // Horizontal rule ---
    if (/^-{3,}$/.test(trimmed)) {
      paragraphs.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BRAND.grayMid },
          },
          spacing: { before: 160, after: 160 },
        })
      );
      i++;
      continue;
    }

    // Bullet points → or ->
    if (trimmed.startsWith("→ ") || trimmed.startsWith("-> ")) {
      const bulletText = trimmed.replace(/^(→|->)\s*/, "");
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: parseTextRuns(bulletText),
          spacing: { after: 60 },
        })
      );
      i++;
      continue;
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      paragraphs.push(
        new Paragraph({
          numbering: { reference: "numbered-list", level: 0 },
          children: parseTextRuns(numberedMatch[2]),
          spacing: { after: 60 },
        })
      );
      i++;
      continue;
    }

    // Label lines
    if (isLabelLine(trimmed)) {
      paragraphs.push(
        new Paragraph({
          children: parseLabelLine(trimmed),
          spacing: { after: 80 },
        })
      );
      i++;
      continue;
    }

    // Normal text
    paragraphs.push(
      new Paragraph({
        children: parseTextRuns(trimmed),
        spacing: { after: 80 },
      })
    );
    i++;
  }

  return paragraphs;
}

// ─── Styled Table Helpers ───

function brandHeaderCell(text: string, width?: number): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, size: 18, color: BRAND.white, font: "Calibri" }),
        ],
        spacing: { before: 60, after: 60 },
      }),
    ],
    shading: { type: ShadingType.CLEAR, fill: BRAND.dark },
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
}

function dataCell(text: string, bold = false, fill?: string): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold, size: 18, font: "Calibri" }),
        ],
        spacing: { before: 40, after: 40 },
      }),
    ],
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
  });
}

function accentDataCell(text: string): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, size: 18, color: BRAND.green, font: "Calibri" }),
        ],
        spacing: { before: 40, after: 40 },
      }),
    ],
  });
}

// ─── Section Builders ───

function sectionDivider(title: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 400 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: `  ${title}  `,
          bold: true,
          size: 26,
          color: BRAND.white,
          font: "Calibri",
        }),
      ],
      shading: { type: ShadingType.CLEAR, fill: BRAND.green },
      spacing: { after: 200 },
    }),
  ];
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: "▎ ", color: BRAND.green, size: 24 }),
      new TextRun({ text, bold: true, size: 24, color: BRAND.dark, font: "Calibri" }),
    ],
    spacing: { before: 280, after: 100 },
  });
}

function bodyText(text: string, italic = false): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, italics: italic, size: 20, font: "Calibri" })],
    spacing: { after: 100 },
  });
}

function fmtVal(v: number, u: string): string {
  if (u === "EUR") return `€${v % 1 === 0 ? v : v.toFixed(2)}`;
  if (u === "%") return `${v % 1 === 0 ? v : v.toFixed(1)}%`;
  return String(v);
}

// ─── Audience Section ───

function buildAudienceSection(audienceSpecs: AudienceSpecs): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [...sectionDivider("AUDIENCE & TARGETING")];

  for (const ch of audienceSpecs.channels) {
    const label = channelLabels[ch.channel] || ch.channel;

    // Channel subheader
    items.push(sectionHeading(label));

    // Quick stats row
    const stats: string[] = [];
    if (ch.estimatedSize) stats.push(`Bereik: ${ch.estimatedSize}`);
    if (ch.budget) stats.push(`Budget: ${ch.budget}`);
    if (stats.length > 0) {
      items.push(
        new Paragraph({
          children: stats.map(
            (s, i) =>
              new TextRun({
                text: i > 0 ? `  ·  ${s}` : s,
                bold: true,
                size: 20,
                color: BRAND.green,
                font: "Calibri",
              })
          ),
          spacing: { after: 120 },
        })
      );
    }

    // Targeting details as a compact table
    const targetingRows: TableRow[] = [];
    const t = ch.targeting;

    const addRow = (label: string, values: string[] | undefined) => {
      if (!values || values.length === 0) return;
      targetingRows.push(
        new TableRow({
          children: [
            dataCell(label, true, BRAND.grayLight),
            dataCell(values.join(", ")),
          ],
        })
      );
    };

    addRow("Job Titles", t.jobTitles);
    addRow("Industries", t.industries);
    addRow("Seniority", t.seniority);
    addRow("Interests", t.interests);
    addRow("Skills", t.skills);
    addRow("Keywords", t.keywords);
    addRow("Groups", t.groups);
    addRow("Behaviors", t.behaviors);
    addRow("Subreddits", t.subreddits);
    addRow("Communities", t.communities);
    addRow("Hashtags", t.hashtags);
    if (t.companySize)
      targetingRows.push(
        new TableRow({
          children: [
            dataCell("Company Size", true, BRAND.grayLight),
            dataCell(t.companySize),
          ],
        })
      );

    if (t.customAudience) {
      targetingRows.push(
        new TableRow({
          children: [
            dataCell("Custom Audience", true, BRAND.grayLight),
            dataCell(
              `${t.customAudience.type}: ${t.customAudience.description}${t.customAudience.window ? ` (${t.customAudience.window})` : ""}`
            ),
          ],
        })
      );
    }

    if (t.lookalike) {
      targetingRows.push(
        new TableRow({
          children: [
            dataCell("Lookalike", true, BRAND.grayLight),
            dataCell(
              `${t.lookalike.source} — ${t.lookalike.percentage} — ${t.lookalike.country}`
            ),
          ],
        })
      );
    }

    if (t.retargeting) {
      targetingRows.push(
        new TableRow({
          children: [
            dataCell("Retargeting", true, BRAND.grayLight),
            dataCell(
              `${t.retargeting.source} (${t.retargeting.window})${t.retargeting.excludeConverted ? " — excl. geconverteerd" : ""}`
            ),
          ],
        })
      );
    }

    if (targetingRows.length > 0) {
      items.push(
        new Table({
          rows: targetingRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    }

    if (ch.notes) {
      items.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Notities: ", bold: true, size: 18, font: "Calibri" }),
            new TextRun({ text: ch.notes, italics: true, size: 18, font: "Calibri", color: BRAND.gray }),
          ],
          spacing: { before: 80, after: 120 },
        })
      );
    }

    items.push(new Paragraph({ spacing: { after: 160 } }));
  }

  return items;
}

// ─── Design Briefing Section ───

function buildDesignBriefingSection(
  briefing: DesignBriefing
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [...sectionDivider("CREATIVE BRIEFING")];

  if (briefing.generalNotes) {
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: briefing.generalNotes,
            italics: true,
            size: 20,
            color: BRAND.gray,
            font: "Calibri",
          }),
        ],
        shading: { type: ShadingType.CLEAR, fill: BRAND.grayLight },
        spacing: { after: 200 },
      })
    );
  }

  for (const asset of briefing.assets) {
    // Asset header
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `▎ ${asset.type}`,
            bold: true,
            size: 22,
            color: BRAND.dark,
            font: "Calibri",
          }),
          new TextRun({
            text: `  ${asset.format}`,
            bold: true,
            size: 20,
            color: BRAND.green,
            font: "Calibri",
          }),
          ...(asset.variants
            ? [
                new TextRun({
                  text: `  ×${asset.variants} varianten`,
                  size: 18,
                  color: BRAND.gray,
                  font: "Calibri",
                }),
              ]
            : []),
        ],
        spacing: { before: 200, after: 80 },
      })
    );

    // Description
    items.push(bodyText(asset.description));

    // Copy on asset (highlighted box)
    if (asset.copyOnAsset) {
      items.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Copy: ", bold: true, size: 18, font: "Calibri" }),
            new TextRun({ text: asset.copyOnAsset, size: 18, font: "Calibri" }),
          ],
          shading: { type: ShadingType.CLEAR, fill: "e6faf3" },
          spacing: { before: 60, after: 60 },
        })
      );
    }

    // Style
    if (asset.style) {
      items.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Stijl: ", bold: true, size: 18, font: "Calibri" }),
            new TextRun({
              text: asset.style,
              italics: true,
              size: 18,
              font: "Calibri",
              color: BRAND.gray,
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    items.push(new Paragraph({ spacing: { after: 120 } }));
  }

  return items;
}

// ─── UTM Tracking Section ───

function buildUtmTrackingSection(
  experimentCode: string,
  utmSets: UtmSet[]
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [...sectionDivider("UTM TRACKING")];

  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Experiment Code: `,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: experimentCode,
          bold: true,
          size: 26,
          color: BRAND.green,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  const headerRow = new TableRow({
    children: [
      brandHeaderCell("Channel"),
      brandHeaderCell("utm_campaign"),
      brandHeaderCell("utm_medium"),
      brandHeaderCell("utm_source"),
      brandHeaderCell("utm_term"),
      brandHeaderCell("utm_content"),
    ],
  });

  const dataRows = utmSets.map(
    (set, i) =>
      new TableRow({
        children: [
          dataCell(
            channelLabels[set.channel] || set.channel,
            true,
            i % 2 === 0 ? BRAND.grayLight : undefined
          ),
          dataCell(set.utm_campaign, false, i % 2 === 0 ? BRAND.grayLight : undefined),
          dataCell(set.utm_medium, false, i % 2 === 0 ? BRAND.grayLight : undefined),
          dataCell(set.utm_source, false, i % 2 === 0 ? BRAND.grayLight : undefined),
          dataCell(set.utm_term, false, i % 2 === 0 ? BRAND.grayLight : undefined),
          dataCell(set.utm_content, false, i % 2 === 0 ? BRAND.grayLight : undefined),
        ],
      })
  );

  items.push(
    new Table({
      rows: [headerRow, ...dataRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );

  // Full URLs
  items.push(new Paragraph({ spacing: { after: 120 } }));
  items.push(sectionHeading("Volledige URLs"));

  for (const set of utmSets) {
    const label = channelLabels[set.channel] || set.channel;
    const url = `https://example.com/lp?utm_campaign=${encodeURIComponent(set.utm_campaign)}&utm_medium=${encodeURIComponent(set.utm_medium)}&utm_source=${encodeURIComponent(set.utm_source)}&utm_term=${encodeURIComponent(set.utm_term)}&utm_content=${encodeURIComponent(set.utm_content)}`;

    items.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true, size: 18, font: "Calibri" }),
        ],
        spacing: { before: 80, after: 40 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: url, size: 16, font: "Calibri", color: BRAND.gray }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  return items;
}

// ─── Main Export Handler ───

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);

    if (isNaN(experimentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: {
        client: { select: { name: true, brandPrimary: true } },
        targets: { orderBy: [{ channel: "asc" }, { metricName: "asc" }] },
      },
    });

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      );
    }

    const clientName = experiment.client.name;
    const riseTotal = Number.isInteger(experiment.riseTotal)
      ? String(experiment.riseTotal)
      : experiment.riseTotal.toFixed(1);

    // ─── Title Block ───
    const titleBlock: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: "STRETCH INNOVATION",
            bold: true,
            size: 16,
            color: BRAND.green,
            font: "Calibri",
            allCaps: true,
          }),
        ],
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [
          ...(experiment.experimentCode
            ? [
                new TextRun({
                  text: `${experiment.experimentCode}  `,
                  bold: true,
                  size: 44,
                  color: BRAND.green,
                  font: "Calibri",
                }),
              ]
            : []),
          new TextRun({
            text: experiment.name,
            bold: true,
            size: 44,
            color: BRAND.dark,
            font: "Calibri",
          }),
        ],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${clientName}  ·  Growth Experiment`,
            size: 22,
            color: BRAND.gray,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      }),
      // Green accent line
      new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND.green },
        },
        spacing: { after: 300 },
      }),
    ];

    // ─── Properties Table (styled) ───
    const funnelLabel = experiment.funnelLayer
      ? FUNNEL_LABELS[experiment.funnelLayer] || `L${experiment.funnelLayer}`
      : "—";

    const propsHeaderRow = new TableRow({
      children: [
        brandHeaderCell("Eigenschap", 25),
        brandHeaderCell("Waarde", 25),
        brandHeaderCell("Eigenschap", 25),
        brandHeaderCell("Waarde", 25),
      ],
    });

    const propsRows = [
      propsHeaderRow,
      new TableRow({
        children: [
          dataCell("Status", true, BRAND.grayLight),
          accentDataCell(
            experiment.status.charAt(0).toUpperCase() +
              experiment.status.slice(1)
          ),
          dataCell("AARRR Stage", true, BRAND.grayLight),
          dataCell(experiment.aarrStage),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Tier", true, BRAND.grayLight),
          dataCell(String(experiment.tier)),
          dataCell("Sprint", true, BRAND.grayLight),
          dataCell(experiment.sprint ? String(experiment.sprint) : "—"),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Timeline", true, BRAND.grayLight),
          dataCell(experiment.timeline || "—"),
          dataCell("Kosten", true, BRAND.grayLight),
          dataCell(experiment.cost || "—"),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Funnel Layer", true, BRAND.grayLight),
          dataCell(funnelLabel),
          dataCell("Channels", true, BRAND.grayLight),
          dataCell(
            experiment.channels.length > 0
              ? experiment.channels.map(ch => channelLabels[ch] || ch).join(", ")
              : "—"
          ),
        ],
      }),
      new TableRow({
        children: [
          dataCell("RISE Score", true, BRAND.grayLight),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `R:${experiment.riseReach} I:${experiment.riseImpact} C:${experiment.riseConfidence} E:${Number.isInteger(experiment.riseEase) ? experiment.riseEase : experiment.riseEase.toFixed(1)}  =  `,
                    size: 18,
                    font: "Calibri",
                  }),
                  new TextRun({
                    text: `${riseTotal}/50`,
                    bold: true,
                    size: 20,
                    color: BRAND.green,
                    font: "Calibri",
                  }),
                ],
                spacing: { before: 40, after: 40 },
              }),
            ],
            columnSpan: 3,
          }),
        ],
      }),
    ];

    const propertiesTable = new Table({
      rows: propsRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    // ─── Overview Section ───
    const overviewItems: Paragraph[] = [...sectionDivider("OVERZICHT")];

    const overviewFields: [string, string | null, boolean][] = [
      ["Beschrijving", experiment.description, false],
      ["Hypothese", experiment.hypothesis, true],
      ["Verwacht Effect", experiment.expectedEffect, false],
      ["Success Metric", experiment.successMetric, false],
      ["Guardrail Metric", experiment.guardrailMetric, false],
    ];

    for (const [label, value, italic] of overviewFields) {
      if (value) {
        overviewItems.push(sectionHeading(label), bodyText(value, italic));
      }
    }

    // ─── Implementation Steps ───
    const implItems: Paragraph[] = [];
    const steps = experiment.implementationSteps as string[] | null;
    if (steps && steps.length > 0) {
      implItems.push(...sectionDivider("IMPLEMENTATIE"));
      steps.forEach((step, idx) => {
        implItems.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${idx + 1}`,
                bold: true,
                size: 20,
                color: BRAND.green,
                font: "Calibri",
              }),
              new TextRun({ text: `  ${step}`, size: 20, font: "Calibri" }),
            ],
            spacing: { after: 80 },
          })
        );
      });
    }

    // ─── Benchmark Targets ───
    const targetsItems: (Paragraph | Table)[] = [];
    if (experiment.targets && experiment.targets.length > 0) {
      targetsItems.push(...sectionDivider("BENCHMARK TARGETS"));

      const headerRow = new TableRow({
        children: [
          brandHeaderCell("Channel"),
          brandHeaderCell("Metric"),
          brandHeaderCell("Pessim."),
          brandHeaderCell("Target"),
          brandHeaderCell("Stretch"),
          brandHeaderCell("Actueel"),
        ],
      });

      const dataRows = experiment.targets.map(
        (t, i) =>
          new TableRow({
            children: [
              dataCell(
                channelLabels[t.channel] || t.channel,
                false,
                i % 2 === 0 ? BRAND.grayLight : undefined
              ),
              dataCell(
                metricLabels[t.metricName] || t.metricName,
                false,
                i % 2 === 0 ? BRAND.grayLight : undefined
              ),
              dataCell(
                fmtVal(t.pessimistic, t.unit),
                false,
                i % 2 === 0 ? BRAND.grayLight : undefined
              ),
              dataCell(
                fmtVal(t.realistic, t.unit),
                true,
                i % 2 === 0 ? BRAND.grayLight : undefined
              ),
              dataCell(
                fmtVal(t.optimistic, t.unit),
                false,
                i % 2 === 0 ? BRAND.grayLight : undefined
              ),
              t.actual != null
                ? accentDataCell(fmtVal(t.actual, t.unit))
                : dataCell(
                    "—",
                    false,
                    i % 2 === 0 ? BRAND.grayLight : undefined
                  ),
            ],
          })
      );

      targetsItems.push(
        new Table({
          rows: [headerRow, ...dataRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    // ─── Audience Specs ───
    const audienceItems: (Paragraph | Table)[] = [];
    const audienceSpecs = experiment.audienceSpecs as AudienceSpecs | null;
    if (audienceSpecs?.channels && audienceSpecs.channels.length > 0) {
      audienceItems.push(...buildAudienceSection(audienceSpecs));
    }

    // ─── Design Briefing ───
    const designItems: (Paragraph | Table)[] = [];
    const designBriefing = experiment.designBriefing as DesignBriefing | null;
    if (designBriefing?.assets && designBriefing.assets.length > 0) {
      designItems.push(...buildDesignBriefingSection(designBriefing));
    }

    // ─── UTM Tracking ───
    const utmItems: (Paragraph | Table)[] = [];
    const utmSets = experiment.utmSets as UtmSet[] | null;
    if (experiment.experimentCode && utmSets && utmSets.length > 0) {
      utmItems.push(...buildUtmTrackingSection(experiment.experimentCode, utmSets));
    }

    // ─── Content Sections ───
    const contentItems: Paragraph[] = [];
    const content = experiment.content as {
      sections: ContentSection[];
    } | null;

    if (content?.sections && content.sections.length > 0) {
      contentItems.push(...sectionDivider("CONTENT"));

      for (const section of content.sections) {
        const typeLabel = typeLabels[section.type] || section.type;

        contentItems.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `▎ ${section.title}`,
                bold: true,
                size: 24,
                color: BRAND.dark,
                font: "Calibri",
              }),
              new TextRun({
                text: `  [${typeLabel}]`,
                italics: true,
                size: 18,
                color: BRAND.gray,
                font: "Calibri",
              }),
            ],
            spacing: { before: 280, after: 120 },
          })
        );

        contentItems.push(...parseContentBody(section.body));
        contentItems.push(new Paragraph({ spacing: { after: 200 } }));
      }
    }

    // ─── Results & Learnings ───
    const resultsItems: Paragraph[] = [];
    if (
      experiment.resultMetric ||
      experiment.improvement ||
      experiment.decision ||
      experiment.learnings
    ) {
      resultsItems.push(...sectionDivider("RESULTATEN & LEARNINGS"));

      const resultFields: [string, string | null][] = [
        ["Resultaat", experiment.resultMetric],
        ["Verbetering", experiment.improvement],
        ["Beslissing", experiment.decision],
        ["Learnings", experiment.learnings],
      ];

      for (const [label, value] of resultFields) {
        if (value) {
          resultsItems.push(sectionHeading(label), bodyText(value));
        }
      }
    }

    // ─── Assemble Document ───
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "numbered-list",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 360 },
                  },
                },
              },
            ],
          },
        ],
      },
      styles: {
        default: {
          document: {
            run: {
              font: "Calibri",
              size: 20,
            },
          },
        },
      },
      sections: [
        {
          headers: {
            default: {
              options: {
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Stretch Innovation",
                        color: BRAND.green,
                        size: 16,
                        bold: true,
                        font: "Calibri",
                      }),
                      new TextRun({
                        text: `  ·  ${clientName}  ·  Growth Experiment`,
                        color: BRAND.gray,
                        size: 16,
                        font: "Calibri",
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              },
            },
          },
          footers: {
            default: {
              options: {
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Gegenereerd door Stretch Innovation Growth Dashboard",
                        color: BRAND.gray,
                        size: 14,
                        italics: true,
                        font: "Calibri",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    border: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: 1,
                        color: BRAND.grayMid,
                      },
                    },
                    spacing: { before: 100 },
                  }),
                ],
              },
            },
          },
          children: [
            ...titleBlock,
            propertiesTable,
            ...overviewItems,
            ...implItems,
            ...targetsItems,
            ...audienceItems,
            ...designItems,
            ...utmItems,
            ...contentItems,
            ...resultsItems,
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    const safeName = experiment.name
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}-export.docx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
