import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MetricCard } from "@/components/MetricCard";
import { ExperimentCard } from "@/components/ExperimentCard";
import { StatusChart } from "@/components/StatusChart";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverview({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      experiments: { orderBy: { riseTotal: "desc" } },
      sprints: { orderBy: { number: "asc" } },
    },
  });

  if (!client) notFound();

  const experiments = client.experiments;
  const totalExperiments = experiments.length;
  const running = experiments.filter((e) => e.status === "running").length;
  const completed = experiments.filter((e) => e.status === "completed").length;
  const avgRISE =
    totalExperiments > 0
      ? (
          experiments.reduce((sum, e) => sum + e.riseTotal, 0) / totalExperiments
        ).toFixed(1)
      : "0";

  const top5 = experiments.slice(0, 5);

  const statusCounts = {
    planned: experiments.filter((e) => e.status === "planned").length,
    running,
    completed,
    paused: experiments.filter((e) => e.status === "paused").length,
    stopped: experiments.filter((e) => e.status === "stopped").length,
  };

  const activeSprint = client.sprints.find((s) => s.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Growth Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview van alle growth experimenten
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Experiments"
          value={totalExperiments}
          iconName="FlaskConical"
          gradient="from-teal-500 to-emerald-500"
        />
        <MetricCard
          title="Running"
          value={running}
          subtitle={`${totalExperiments > 0 ? Math.round((running / totalExperiments) * 100) : 0}% of total`}
          iconName="Play"
          gradient="from-emerald-500 to-green-500"
        />
        <MetricCard
          title="Completed"
          value={completed}
          subtitle={`${totalExperiments > 0 ? Math.round((completed / totalExperiments) * 100) : 0}% of total`}
          iconName="CheckCircle2"
          gradient="from-blue-500 to-indigo-500"
        />
        <MetricCard
          title="Avg RISE Score"
          value={avgRISE}
          iconName="TrendingUp"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StatusChart statusCounts={statusCounts} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Top 5 Experiments (RISE)</h2>
          <div className="grid gap-3">
            {top5.map((exp) => (
              <ExperimentCard
                key={exp.id}
                id={exp.id}
                slug={slug}
                name={exp.name}
                description={exp.description}
                tier={exp.tier}
                aarrStage={exp.aarrStage}
                riseReach={exp.riseReach}
                riseImpact={exp.riseImpact}
                riseConfidence={exp.riseConfidence}
                riseEase={exp.riseEase}
                riseTotal={exp.riseTotal}
                status={exp.status}
                sprint={exp.sprint}
                contentType={exp.contentType ?? null}
                funnelLayer={exp.funnelLayer}
                offerType={exp.offerType}
                channels={exp.channels}
              />
            ))}
          </div>
        </div>
      </div>

      {activeSprint && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Active Sprint</h2>
              <p className="text-sm text-muted-foreground">
                {activeSprint.name} &mdash; {activeSprint.weeks}
              </p>
            </div>
          </div>
          {activeSprint.focus && (
            <p className="text-sm text-muted-foreground">
              {activeSprint.focus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
