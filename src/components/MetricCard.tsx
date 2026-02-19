"use client";

import { cn } from "@/lib/utils";
import {
  FlaskConical,
  Play,
  CheckCircle2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  Play,
  CheckCircle2,
  TrendingUp,
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  gradient?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  iconName,
  gradient = "from-teal-500 to-emerald-500",
}: MetricCardProps) {
  const Icon = iconMap[iconName] || FlaskConical;

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 opacity-10">
        <div
          className={cn(
            "w-full h-full rounded-full bg-gradient-to-br",
            gradient
          )}
        />
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br text-white",
            gradient
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
