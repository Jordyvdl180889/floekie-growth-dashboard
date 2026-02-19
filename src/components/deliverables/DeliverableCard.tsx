"use client";

import Link from "next/link";
import { FileText, BarChart3, BookOpen, Presentation } from "lucide-react";
import type { DeliverableData } from "@/types";

interface DeliverableCardProps {
  deliverable: DeliverableData;
  slug: string;
  brandPrimary?: string | null;
}

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  positioning: FileText,
  audit: BarChart3,
  playbook: BookOpen,
};

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category.toLowerCase()] || Presentation;
}

export function DeliverableCard({
  deliverable,
  slug,
  brandPrimary,
}: DeliverableCardProps) {
  const color = brandPrimary || "#6366f1";
  const Icon = getCategoryIcon(deliverable.category);

  return (
    <Link href={`/${slug}/deliverables/${deliverable.id}`}>
      <div
        className="group relative flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${color}20, 0 4px 12px rgba(0,0,0,0.08)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.06)";
        }}
      >
        {/* Gradient border accent top */}
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}66)`,
          }}
        />

        {/* Icon + Category */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${color}18, ${color}08)`,
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color }}
            />
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-medium capitalize"
            style={{
              backgroundColor: `${color}12`,
              color,
            }}
          >
            {deliverable.category}
          </span>
        </div>

        {/* Title + Subtitle */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {deliverable.title}
          </h3>
          {deliverable.subtitle && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {deliverable.subtitle}
            </p>
          )}
        </div>

        {/* Slide count badge */}
        <div className="mt-auto flex items-center gap-2">
          <Presentation className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {deliverable.slideCount} slide{deliverable.slideCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
