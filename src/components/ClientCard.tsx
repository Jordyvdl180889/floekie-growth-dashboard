"use client";

import Link from "next/link";
import { FlaskConical, Layers, CalendarDays } from "lucide-react";

interface ClientCardProps {
  name: string;
  slug: string;
  brandPrimary?: string | null;
  brandGradient?: string | null;
  experimentCount: number;
  inTestCount: number;
  sprintCount: number;
}

export function ClientCard({
  name,
  slug,
  brandPrimary,
  brandGradient,
  experimentCount,
  inTestCount,
  sprintCount,
}: ClientCardProps) {
  const primary = brandPrimary || "#3ecda5";
  const gradientColors = brandGradient?.split(",") || [primary, `${primary}cc`];
  const gradient = `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1] || gradientColors[0]})`;

  return (
    <Link href={`/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
          style={{ background: gradient }}
        />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ background: gradient }}
            >
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-xs text-muted-foreground">/{slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <FlaskConical className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-bold" style={{ color: primary }}>
                {experimentCount}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Experiments
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <Layers className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-bold" style={{ color: primary }}>
                {inTestCount}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                In Test
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <CalendarDays className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-bold" style={{ color: primary }}>
                {sprintCount}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Sprints
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
