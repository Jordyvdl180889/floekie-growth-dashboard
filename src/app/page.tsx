import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { AdminPasswordGate } from "@/components/AdminPasswordGate";
import { ClientCard } from "@/components/ClientCard";

export default async function Home() {
  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    return <AdminPasswordGate />;
  }

  const clients = await prisma.client.findMany({
    select: {
      name: true,
      slug: true,
      brandPrimary: true,
      brandGradient: true,
      _count: { select: { experiments: true, sprints: true } },
      experiments: {
        where: { funnelLayer: { not: null } },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5 blur-3xl bg-indigo-500" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5 blur-3xl bg-emerald-500" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-400 mb-4">
            Stretch Innovation
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Growth Dashboard
          </h1>
          <p className="text-muted-foreground">
            Select a client to view their growth experiments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.slug}
              name={client.name}
              slug={client.slug}
              brandPrimary={client.brandPrimary}
              brandGradient={client.brandGradient}
              experimentCount={client._count.experiments}
              inTestCount={client.experiments.length}
              sprintCount={client._count.sprints}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
