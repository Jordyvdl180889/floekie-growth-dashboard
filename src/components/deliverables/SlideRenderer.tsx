"use client";

import type { SlideContent } from "@/types";
import TitleSlide from "./slides/TitleSlide";
import SectionDividerSlide from "./slides/SectionDividerSlide";
import BulletsSlide from "./slides/BulletsSlide";
import TwoColumnSlide from "./slides/TwoColumnSlide";
import TableSlide from "./slides/TableSlide";
import MetricsSlide from "./slides/MetricsSlide";
import QuoteSlide from "./slides/QuoteSlide";
import PersonaSlide from "./slides/PersonaSlide";
import TimelineSlide from "./slides/TimelineSlide";
import TextSlide from "./slides/TextSlide";
import BigNumberSlide from "./slides/BigNumberSlide";
import ComparisonSlide from "./slides/ComparisonSlide";
import ChecklistSlide from "./slides/ChecklistSlide";
import IconGridSlide from "./slides/IconGridSlide";
import FunnelSlide from "./slides/FunnelSlide";
import HighlightSlide from "./slides/HighlightSlide";
import DonutChartSlide from "./slides/DonutChartSlide";
import BarChartSlide from "./slides/BarChartSlide";
import ProgressBarsSlide from "./slides/ProgressBarsSlide";
import ThreeColumnSlide from "./slides/ThreeColumnSlide";
import CardGridSlide from "./slides/CardGridSlide";
import PieChartSlide from "./slides/PieChartSlide";

interface SlideRendererProps {
  content: SlideContent;
  brandPrimary: string;
}

export default function SlideRenderer({
  content,
  brandPrimary,
}: SlideRendererProps) {
  switch (content.layout) {
    case "title":
      return <TitleSlide content={content} brandPrimary={brandPrimary} />;
    case "section-divider":
      return (
        <SectionDividerSlide content={content} brandPrimary={brandPrimary} />
      );
    case "bullets":
      return <BulletsSlide content={content} brandPrimary={brandPrimary} />;
    case "two-column":
      return <TwoColumnSlide content={content} brandPrimary={brandPrimary} />;
    case "table":
      return <TableSlide content={content} brandPrimary={brandPrimary} />;
    case "metrics":
      return <MetricsSlide content={content} brandPrimary={brandPrimary} />;
    case "quote":
      return <QuoteSlide content={content} brandPrimary={brandPrimary} />;
    case "persona":
      return <PersonaSlide content={content} brandPrimary={brandPrimary} />;
    case "timeline":
      return <TimelineSlide content={content} brandPrimary={brandPrimary} />;
    case "text":
      return <TextSlide content={content} brandPrimary={brandPrimary} />;
    case "big-number":
      return <BigNumberSlide content={content} brandPrimary={brandPrimary} />;
    case "comparison":
      return <ComparisonSlide content={content} brandPrimary={brandPrimary} />;
    case "checklist":
      return <ChecklistSlide content={content} brandPrimary={brandPrimary} />;
    case "icon-grid":
      return <IconGridSlide content={content} brandPrimary={brandPrimary} />;
    case "funnel":
      return <FunnelSlide content={content} brandPrimary={brandPrimary} />;
    case "highlight":
      return <HighlightSlide content={content} brandPrimary={brandPrimary} />;
    case "donut-chart":
      return <DonutChartSlide content={content} brandPrimary={brandPrimary} />;
    case "bar-chart":
      return <BarChartSlide content={content} brandPrimary={brandPrimary} />;
    case "progress-bars":
      return <ProgressBarsSlide content={content} brandPrimary={brandPrimary} />;
    case "three-column":
      return <ThreeColumnSlide content={content} brandPrimary={brandPrimary} />;
    case "card-grid":
      return <CardGridSlide content={content} brandPrimary={brandPrimary} />;
    case "pie-chart":
      return <PieChartSlide content={content} brandPrimary={brandPrimary} />;
    default: {
      const _exhaustive: never = content;
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-50 p-12 text-gray-400">
          Unknown slide layout
        </div>
      );
    }
  }
}
