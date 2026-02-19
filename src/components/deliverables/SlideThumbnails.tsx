"use client";

import type { SlideContent } from "@/types";

interface SlideThumbnailsProps {
  slides: SlideContent[];
  currentSlide: number;
  onSelect: (index: number) => void;
  brandPrimary: string;
}

const LAYOUT_LABELS: Record<string, string> = {
  title: "Title",
  "section-divider": "Section",
  bullets: "Bullets",
  "two-column": "Two Column",
  table: "Table",
  metrics: "Metrics",
  quote: "Quote",
  persona: "Persona",
  timeline: "Timeline",
  text: "Text",
};

function getSlideLabel(slide: SlideContent): string {
  switch (slide.layout) {
    case "title":
      return slide.mainTitle;
    case "section-divider":
      return slide.heading;
    case "bullets":
      return slide.heading;
    case "two-column":
      return slide.heading || "Two Column";
    case "table":
      return slide.heading || "Table";
    case "metrics":
      return slide.heading || "Metrics";
    case "quote":
      return slide.quote.slice(0, 40) + (slide.quote.length > 40 ? "..." : "");
    case "persona":
      return slide.name;
    case "timeline":
      return slide.heading || "Timeline";
    case "text":
      return slide.heading || "Text";
    default:
      return "Slide";
  }
}

export function SlideThumbnails({
  slides,
  currentSlide,
  onSelect,
  brandPrimary,
}: SlideThumbnailsProps) {
  return (
    <div className="flex h-full w-[200px] flex-col gap-2 overflow-y-auto border-l border-gray-200 bg-gray-50/80 p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Slides
      </p>
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`flex flex-col gap-1 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
              isActive
                ? "bg-white shadow-sm"
                : "border-transparent bg-white/60 hover:bg-white hover:shadow-sm"
            }`}
            style={{
              borderColor: isActive ? brandPrimary : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                style={{
                  backgroundColor: isActive ? brandPrimary : "#94a3b8",
                }}
              >
                {index + 1}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                {LAYOUT_LABELS[slide.layout] || slide.layout}
              </span>
            </div>
            <p className="truncate text-xs text-gray-600">
              {getSlideLabel(slide)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
