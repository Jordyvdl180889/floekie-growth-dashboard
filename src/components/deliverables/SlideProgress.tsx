"use client";

interface SlideProgressProps {
  current: number;
  total: number;
  brandPrimary: string;
}

export function SlideProgress({
  current,
  total,
  brandPrimary,
}: SlideProgressProps) {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200/60">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${brandPrimary}, ${brandPrimary}AA)`,
        }}
      />
    </div>
  );
}
