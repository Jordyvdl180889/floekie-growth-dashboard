"use client";

import type { DeliverableData } from "@/types";
import { DeliverableCard } from "./DeliverableCard";

interface DeliverableOverviewProps {
  deliverables: DeliverableData[];
  slug: string;
  brandPrimary?: string | null;
}

export function DeliverableOverview({
  deliverables,
  slug,
  brandPrimary,
}: DeliverableOverviewProps) {
  if (deliverables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center">
        <p className="text-lg font-medium text-gray-500">
          Nog geen deliverables
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Deliverables verschijnen hier zodra ze zijn toegevoegd.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {deliverables.map((deliverable) => (
        <DeliverableCard
          key={deliverable.id}
          deliverable={deliverable}
          slug={slug}
          brandPrimary={brandPrimary}
        />
      ))}
    </div>
  );
}
