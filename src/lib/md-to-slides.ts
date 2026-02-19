import type {
  SlideContent,
  TitleSlideContent,
  SectionDividerSlideContent,
  BulletsSlideContent,
  TableSlideContent,
  MetricsSlideContent,
  QuoteSlideContent,
  PersonaSlideContent,
  TimelineSlideContent,
  TextSlideContent,
} from "@/types";

const MAX_BULLETS_PER_SLIDE = 8;
const MAX_TABLE_ROWS_PER_SLIDE = 10;
const MAX_METRICS_PER_SLIDE = 4;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip markdown bold/italic wrappers but keep inner text. */
function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

/** Check whether a string looks numeric / percentage / currency. */
function isNumericish(value: string): boolean {
  const cleaned = value.trim().replace(/[,$%€£]/g, "").replace(/\s/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "n/a") return false;
  return /^-?\d+(\.\d+)?[xX]?$/.test(cleaned);
}

/** Return true when the majority of data cells are numeric. */
function isMetricTable(rows: string[][]): boolean {
  if (rows.length === 0) return false;
  let numeric = 0;
  let total = 0;
  for (const row of rows) {
    for (let i = 1; i < row.length; i++) {
      total++;
      if (isNumericish(row[i])) numeric++;
    }
  }
  return total > 0 && numeric / total > 0.5;
}

/** Parse a single markdown table (including alignment row) into headers + rows. */
function parseTable(lines: string[]): { headers: string[]; rows: string[][] } {
  const cleaned = lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));

  if (cleaned.length < 2) return { headers: [], rows: [] };

  const splitRow = (line: string): string[] =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => cleanInlineMarkdown(c));

  const headers = splitRow(cleaned[0]);

  // Skip alignment row (contains only dashes, colons, spaces)
  const dataStart = /^[\s|:\-]+$/.test(cleaned[1]) ? 2 : 1;
  const rows = cleaned.slice(dataStart).map(splitRow);

  return { headers, rows };
}

/** Split an array into chunks of `size`. */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/** Extract blockquote lines from a set of lines, returning quote text + remaining lines. */
function extractBlockquotes(
  lines: string[]
): { quotes: string[]; remaining: string[] } {
  const quotes: string[] = [];
  const remaining: string[] = [];
  let currentQuote: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith(">")) {
      currentQuote.push(
        line
          .trimStart()
          .replace(/^>\s?/, "")
          .trim()
      );
    } else {
      if (currentQuote.length > 0) {
        quotes.push(currentQuote.join(" "));
        currentQuote = [];
      }
      remaining.push(line);
    }
  }
  if (currentQuote.length > 0) {
    quotes.push(currentQuote.join(" "));
  }

  return { quotes, remaining };
}

/** Parse bullet lines, handling nested sub-items. */
function parseBullets(
  lines: string[]
): { text: string; sub?: string }[] {
  const bullets: { text: string; sub?: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (!bulletMatch) continue;

    const content = cleanInlineMarkdown(bulletMatch[1]);

    // Nested bullet (indented 2+ spaces or tab)
    if (indent >= 2 && bullets.length > 0) {
      const parent = bullets[bullets.length - 1];
      parent.sub = parent.sub ? `${parent.sub}; ${content}` : content;
    } else {
      bullets.push({ text: content });
    }
  }

  return bullets;
}

/** Detect persona pattern: has both pain-point-like and goal-like content. */
function detectPersona(
  heading: string,
  lines: string[]
): PersonaSlideContent | null {
  const joined = lines.join("\n");
  const hasPain =
    /pain\s*points?/i.test(joined) ||
    /pain\s*points?/i.test(heading) ||
    /frustraties?/i.test(joined) ||
    /uitdagingen/i.test(joined) ||
    /challenges/i.test(joined);
  const hasGoals =
    /goals?/i.test(joined) ||
    /doelen/i.test(joined) ||
    /objectives?/i.test(joined) ||
    /wensen/i.test(joined);

  if (!hasPain || !hasGoals) return null;

  const painPoints: string[] = [];
  const goals: string[] = [];
  let section: "none" | "pain" | "goal" = "none";

  for (const line of lines) {
    const trimmed = line.trim();
    if (/pain\s*points?|frustraties?|uitdagingen|challenges/i.test(trimmed)) {
      section = "pain";
      continue;
    }
    if (/goals?|doelen|objectives?|wensen/i.test(trimmed)) {
      section = "goal";
      continue;
    }
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (bulletMatch) {
      const text = cleanInlineMarkdown(bulletMatch[1]);
      if (section === "pain") painPoints.push(text);
      else if (section === "goal") goals.push(text);
    }
  }

  // Extract name/role from heading
  const name = cleanInlineMarkdown(heading);

  return {
    layout: "persona",
    name,
    role: undefined,
    painPoints,
    goals,
  };
}

/** Detect timeline pattern: sequential numbered items with descriptions. */
function detectTimeline(
  heading: string,
  lines: string[]
): TimelineSlideContent | null {
  const steps: { label: string; description: string; timing?: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match patterns like "1. Step Name" or "1) Step Name" or "Step 1: Description"
    const numberedMatch = trimmed.match(
      /^(\d+)[.)]\s+(.+?)(?:\s*[-:]\s*(.+))?$/
    );
    if (numberedMatch) {
      const label = cleanInlineMarkdown(numberedMatch[2]);
      const description = numberedMatch[3]
        ? cleanInlineMarkdown(numberedMatch[3])
        : "";
      // Try to extract timing like "Week 1-4" or "(2 weken)"
      const timingMatch = label.match(
        /\b(week\s*\d+[-–]\d+|\d+\s*weken?|\d+\s*days?|\d+\s*dagen)\b/i
      );
      steps.push({
        label: timingMatch ? label.replace(timingMatch[0], "").trim() : label,
        description,
        timing: timingMatch ? timingMatch[1] : undefined,
      });
    }
  }

  if (steps.length < 3) return null;

  return {
    layout: "timeline",
    heading: cleanInlineMarkdown(heading),
    steps,
  };
}

// ---------------------------------------------------------------------------
// Line classification helpers
// ---------------------------------------------------------------------------

function isTableLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isAlignmentRow(line: string): boolean {
  return /^[\s|:\-]+$/.test(line.trim());
}

function isBulletLine(line: string): boolean {
  return /^\s*[-*+]\s+/.test(line);
}

function isBlockquoteLine(line: string): boolean {
  return line.trimStart().startsWith(">");
}

function isHorizontalRule(line: string): boolean {
  return /^\s*([-*_]){3,}\s*$/.test(line);
}

function isCodeFenceLine(line: string): boolean {
  return line.trimStart().startsWith("```");
}

function isEmptyLine(line: string): boolean {
  return line.trim() === "";
}

// ---------------------------------------------------------------------------
// Main converter
// ---------------------------------------------------------------------------

export function convertMarkdownToSlides(
  markdown: string,
  title: string,
  subtitle?: string
): SlideContent[] {
  const slides: SlideContent[] = [];

  // Slide #0: title
  const titleSlide: TitleSlideContent = {
    layout: "title",
    mainTitle: title,
    subtitle,
  };
  slides.push(titleSlide);

  // Normalize line endings
  const normalizedMd = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split at H1 boundaries
  const h1Sections = splitAtHeading(normalizedMd, 1);
  let sectionNumber = 0;

  for (const h1Section of h1Sections) {
    if (!h1Section.heading && !h1Section.body.trim()) continue;

    // Add section-divider for each H1
    if (h1Section.heading) {
      sectionNumber++;
      const divider: SectionDividerSlideContent = {
        layout: "section-divider",
        sectionNumber,
        heading: cleanInlineMarkdown(h1Section.heading),
      };
      slides.push(divider);
    }

    // Split H1 body at H2 boundaries
    const h2Sections = splitAtHeading(h1Section.body, 2);

    for (const h2Section of h2Sections) {
      const subsectionSlides = processSubsection(
        h2Section.heading,
        h2Section.body
      );
      slides.push(...subsectionSlides);
    }
  }

  return slides;
}

// ---------------------------------------------------------------------------
// Section splitting
// ---------------------------------------------------------------------------

interface HeadingSection {
  heading: string;
  body: string;
}

function splitAtHeading(text: string, level: number): HeadingSection[] {
  const prefix = "#".repeat(level);
  const regex = new RegExp(`^${prefix}\\s+(.+)$`, "m");
  const splitRegex = new RegExp(`(?=^${prefix}\\s+)`, "m");

  const parts = text.split(splitRegex);
  const sections: HeadingSection[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(regex);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      const bodyStart = trimmed.indexOf("\n");
      const body = bodyStart >= 0 ? trimmed.slice(bodyStart + 1) : "";
      sections.push({ heading, body });
    } else {
      // Content before the first heading at this level
      sections.push({ heading: "", body: trimmed });
    }
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Subsection processing — detects content type and builds slides
// ---------------------------------------------------------------------------

function processSubsection(heading: string, body: string): SlideContent[] {
  const slides: SlideContent[] = [];
  const lines = body.split("\n");

  // Filter out horizontal rules and code blocks
  const filtered: string[] = [];
  let inCodeBlock = false;
  const codeBlockContent: string[] = [];

  for (const line of lines) {
    if (isCodeFenceLine(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    if (isHorizontalRule(line)) continue;
    filtered.push(line);
  }

  // If there was a code block, treat its content as plain text later
  if (codeBlockContent.length > 0) {
    filtered.push(...codeBlockContent);
  }

  // Skip empty sections
  if (filtered.every(isEmptyLine)) return slides;

  // Extract blockquotes first — they become separate quote slides
  const { quotes, remaining } = extractBlockquotes(filtered);
  for (const q of quotes) {
    // Try to split attribution: "text -- Author" or "text - Author"
    const attrMatch = q.match(/^(.+?)\s*[-–—]{1,2}\s*([A-Z].{2,})$/);
    const quoteSlide: QuoteSlideContent = {
      layout: "quote",
      quote: attrMatch ? cleanInlineMarkdown(attrMatch[1]) : cleanInlineMarkdown(q),
      attribution: attrMatch ? cleanInlineMarkdown(attrMatch[2]) : undefined,
    };
    slides.push(quoteSlide);
  }

  // If only quotes existed, done
  if (remaining.every(isEmptyLine)) return slides;

  // Classify remaining content into contiguous blocks
  const blocks = classifyBlocks(remaining);

  for (const block of blocks) {
    switch (block.type) {
      case "table":
        slides.push(...buildTableSlides(heading, block.lines));
        break;
      case "bullets":
        slides.push(...buildBulletSlides(heading, block.lines, remaining));
        break;
      case "text":
        slides.push(...buildTextSlides(heading, block.lines));
        break;
    }
  }

  return slides;
}

// ---------------------------------------------------------------------------
// Block classification
// ---------------------------------------------------------------------------

interface ContentBlock {
  type: "table" | "bullets" | "text";
  lines: string[];
}

function classifyBlocks(lines: string[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let current: ContentBlock | null = null;

  const flush = () => {
    if (current && current.lines.some((l) => l.trim() !== "")) {
      blocks.push(current);
    }
    current = null;
  };

  for (const line of lines) {
    if (isEmptyLine(line)) {
      // Empty lines can separate blocks but don't force a new one
      if (current) current.lines.push(line);
      continue;
    }

    if (isTableLine(line) || (current?.type === "table" && isAlignmentRow(line))) {
      if (current?.type !== "table") {
        flush();
        current = { type: "table", lines: [] };
      }
      current!.lines.push(line);
    } else if (isBulletLine(line)) {
      if (current?.type !== "bullets") {
        flush();
        current = { type: "bullets", lines: [] };
      }
      current!.lines.push(line);
    } else {
      // Numbered list items — could be timeline or just text
      if (current?.type !== "text") {
        flush();
        current = { type: "text", lines: [] };
      }
      current!.lines.push(line);
    }
  }

  flush();
  return blocks;
}

// ---------------------------------------------------------------------------
// Slide builders
// ---------------------------------------------------------------------------

function buildTableSlides(heading: string, lines: string[]): SlideContent[] {
  const slides: SlideContent[] = [];
  const { headers, rows } = parseTable(lines);

  if (headers.length === 0) return slides;

  // Check if this should be a metrics slide
  if (isMetricTable(rows) && rows.length <= MAX_METRICS_PER_SLIDE) {
    const metrics = rows.map((row) => ({
      label: row[0] || "",
      value: row[1] || "",
      subtitle: row.length > 2 ? row[2] : undefined,
    }));
    const metricsSlide: MetricsSlideContent = {
      layout: "metrics",
      heading: heading ? cleanInlineMarkdown(heading) : undefined,
      metrics,
    };
    slides.push(metricsSlide);
    return slides;
  }

  // If metric-like but more than 4 rows, chunk into metric slides
  if (isMetricTable(rows) && headers.length <= 3) {
    const chunks = chunk(rows, MAX_METRICS_PER_SLIDE);
    for (const ch of chunks) {
      const metrics = ch.map((row) => ({
        label: row[0] || "",
        value: row[1] || "",
        subtitle: row.length > 2 ? row[2] : undefined,
      }));
      const metricsSlide: MetricsSlideContent = {
        layout: "metrics",
        heading: heading ? cleanInlineMarkdown(heading) : undefined,
        metrics,
      };
      slides.push(metricsSlide);
    }
    return slides;
  }

  // Regular table — split if too many rows
  const chunks = chunk(rows, MAX_TABLE_ROWS_PER_SLIDE);
  for (const ch of chunks) {
    const tableSlide: TableSlideContent = {
      layout: "table",
      heading: heading ? cleanInlineMarkdown(heading) : undefined,
      headers,
      rows: ch,
    };
    slides.push(tableSlide);
  }

  return slides;
}

function buildBulletSlides(
  heading: string,
  bulletLines: string[],
  allLines: string[]
): SlideContent[] {
  const slides: SlideContent[] = [];
  const cleanHeading = heading ? cleanInlineMarkdown(heading) : "";

  // Try persona detection first (needs all section lines for context)
  const persona = detectPersona(heading, allLines);
  if (persona) {
    slides.push(persona);
    return slides;
  }

  // Try timeline detection
  // (timeline uses numbered items which are in text blocks, not bullet blocks,
  // so this is a fallback check)

  const bullets = parseBullets(bulletLines);
  if (bullets.length === 0) return slides;

  // Split into chunks if too many
  const chunks = chunk(bullets, MAX_BULLETS_PER_SLIDE);
  for (const ch of chunks) {
    const bulletSlide: BulletsSlideContent = {
      layout: "bullets",
      heading: cleanHeading,
      bullets: ch,
    };
    slides.push(bulletSlide);
  }

  return slides;
}

function buildTextSlides(heading: string, lines: string[]): SlideContent[] {
  const slides: SlideContent[] = [];
  const cleanHeading = heading ? cleanInlineMarkdown(heading) : "";

  // Try timeline detection on numbered lines
  const timeline = detectTimeline(heading, lines);
  if (timeline) {
    slides.push(timeline);
    return slides;
  }

  // Collect non-empty lines as a paragraph
  const body = lines
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .map(cleanInlineMarkdown)
    .join("\n");

  if (!body) return slides;

  const textSlide: TextSlideContent = {
    layout: "text",
    heading: cleanHeading || undefined,
    body,
  };
  slides.push(textSlide);

  return slides;
}

// ---------------------------------------------------------------------------
// Deliverable helper
// ---------------------------------------------------------------------------

export function convertMarkdownToDeliverable(
  markdown: string,
  title: string,
  subtitle: string | undefined,
  slug: string,
  category: string,
  sortOrder: number
): {
  title: string;
  subtitle: string | undefined;
  slug: string;
  category: string;
  slideCount: number;
  slides: SlideContent[];
  sortOrder: number;
} {
  const slides = convertMarkdownToSlides(markdown, title, subtitle);

  return {
    title,
    subtitle,
    slug,
    category,
    slideCount: slides.length,
    slides,
    sortOrder,
  };
}
