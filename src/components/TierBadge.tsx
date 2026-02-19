"use client";

import { Badge } from "@/components/ui/badge";

const tierConfig: Record<number, { label: string; className: string }> = {
  1: {
    label: "Tier 1",
    className:
      "bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0",
  },
  2: {
    label: "Tier 2",
    className:
      "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0",
  },
  3: {
    label: "Tier 3",
    className:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
  },
};

export function TierBadge({ tier }: { tier: number }) {
  const config = tierConfig[tier] || tierConfig[1];
  return <Badge className={config.className}>{config.label}</Badge>;
}
