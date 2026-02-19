"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, LayoutGrid, Layers } from "lucide-react";

interface FilterBarProps {
  status: string;
  tier: string;
  aarrStage: string;
  sprint: string;
  funnelLayer: string;
  onStatusChange: (v: string) => void;
  onTierChange: (v: string) => void;
  onAarrStageChange: (v: string) => void;
  onSprintChange: (v: string) => void;
  onFunnelLayerChange: (v: string) => void;
  onReset: () => void;
  sprintNumbers: number[];
  hasFunnelData: boolean;
  viewMode: "funnel" | "grid";
  onViewModeChange: (v: "funnel" | "grid") => void;
}

export function FilterBar({
  status,
  tier,
  aarrStage,
  sprint,
  funnelLayer,
  onStatusChange,
  onTierChange,
  onAarrStageChange,
  onSprintChange,
  onFunnelLayerChange,
  onReset,
  sprintNumbers,
  hasFunnelData,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const hasFilters =
    status !== "all" ||
    tier !== "all" ||
    aarrStage !== "all" ||
    sprint !== "all" ||
    funnelLayer !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasFunnelData && (
        <div className="flex items-center rounded-lg border p-0.5 gap-0.5">
          <Button
            variant={viewMode === "funnel" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5"
            onClick={() => onViewModeChange("funnel")}
          >
            <Layers className="w-3.5 h-3.5 mr-1" />
            Funnel
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5"
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-1" />
            Grid
          </Button>
        </div>
      )}

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="planned">Planned</SelectItem>
          <SelectItem value="running">Running</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="stopped">Stopped</SelectItem>
        </SelectContent>
      </Select>

      {hasFunnelData && (
        <Select value={funnelLayer} onValueChange={onFunnelLayerChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Funnel Laag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Lagen</SelectItem>
            <SelectItem value="1">L1: Urgentie Creëren</SelectItem>
            <SelectItem value="2">L2: Urgentie Capteren</SelectItem>
            <SelectItem value="3">L3: Kwalificatie</SelectItem>
            <SelectItem value="backlog">Backlog</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={tier} onValueChange={onTierChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="1">Tier 1</SelectItem>
          <SelectItem value="2">Tier 2</SelectItem>
          <SelectItem value="3">Tier 3</SelectItem>
        </SelectContent>
      </Select>

      <Select value={aarrStage} onValueChange={onAarrStageChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="AARRR Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="Acquisition">Acquisition</SelectItem>
          <SelectItem value="Activation">Activation</SelectItem>
          <SelectItem value="Retention">Retention</SelectItem>
          <SelectItem value="Revenue">Revenue</SelectItem>
          <SelectItem value="Referral">Referral</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sprint} onValueChange={onSprintChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Sprint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sprints</SelectItem>
          {sprintNumbers.map((n) => (
            <SelectItem key={n} value={String(n)}>
              Sprint {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
