export interface TimelineRange {
  startWeek: number;
  endWeek: number;
}

const SPRINT_RANGES: Record<number, TimelineRange> = {
  1: { startWeek: 1, endWeek: 4 },
  2: { startWeek: 5, endWeek: 8 },
  3: { startWeek: 9, endWeek: 12 },
};

export function parseTimeline(
  timeline: string | null,
  sprint: number | null
): TimelineRange {
  if (timeline) {
    const weekMatch = timeline.match(/Week\s*(\d+)(?:\s*-\s*(\d+))?/i);
    if (weekMatch) {
      const start = parseInt(weekMatch[1], 10);
      const end = weekMatch[2] ? parseInt(weekMatch[2], 10) : start + 2;
      return { startWeek: Math.max(1, start), endWeek: Math.min(16, end) };
    }

    const lower = timeline.toLowerCase();
    if (
      lower.includes("doorlopend") ||
      lower.includes("ongoing") ||
      lower.includes("maandelijks") ||
      lower.includes("monthly")
    ) {
      const sprintStart = sprint ? (SPRINT_RANGES[sprint]?.startWeek ?? 1) : 1;
      return { startWeek: sprintStart, endWeek: 16 };
    }
  }

  if (sprint && SPRINT_RANGES[sprint]) {
    return SPRINT_RANGES[sprint];
  }

  return { startWeek: 1, endWeek: 4 };
}

export const FUNNEL_LAYER_CONFIG: Record<
  number,
  { label: string; color: string; hex: string; border: string }
> = {
  1: {
    label: "L1: Urgentie Creëren",
    color: "text-blue-700 dark:text-blue-400",
    hex: "#3b82f6",
    border: "border-blue-500/30",
  },
  2: {
    label: "L2: Urgentie Capteren",
    color: "text-amber-700 dark:text-amber-400",
    hex: "#f59e0b",
    border: "border-amber-500/30",
  },
  3: {
    label: "L3: Kwalificatie + Sale",
    color: "text-rose-700 dark:text-rose-400",
    hex: "#f43f5e",
    border: "border-rose-500/30",
  },
  0: {
    label: "Backlog",
    color: "text-zinc-600 dark:text-zinc-400",
    hex: "#a1a1aa",
    border: "border-zinc-400/30",
  },
};

export const SPRINT_LABELS = [
  { label: "Sprint 1 (Week 1-4)", startWeek: 1, endWeek: 4 },
  { label: "Sprint 2 (Week 5-8)", startWeek: 5, endWeek: 8 },
  { label: "Sprint 3 (Week 9-12)", startWeek: 9, endWeek: 12 },
  { label: "Optimalisatie", startWeek: 13, endWeek: 16 },
];
