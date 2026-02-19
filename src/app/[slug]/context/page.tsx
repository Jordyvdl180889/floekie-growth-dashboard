import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ClientContext } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ContextPage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    select: { context: true, name: true },
  });

  if (!client) notFound();

  const ctx = client.context as ClientContext | null;

  if (!ctx) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Client Context</h1>
        <p className="text-muted-foreground">
          Geen context informatie beschikbaar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Context</h1>
        <p className="text-muted-foreground mt-1">
          Achtergrond over {client.name}
        </p>
      </div>

      {ctx.company && (
        <Card className="rounded-2xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {ctx.company.name || client.name}
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {ctx.company.description && (
              <p className="text-sm">{ctx.company.description}</p>
            )}
            {ctx.company.valueProp && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Value Proposition
                </p>
                <p className="text-sm font-medium">{ctx.company.valueProp}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {ctx.company.founded && (
                <div>
                  <p className="text-xs text-muted-foreground">Opgericht</p>
                  <p className="text-sm font-medium">{ctx.company.founded}</p>
                </div>
              )}
              {ctx.company.team && (
                <div>
                  <p className="text-xs text-muted-foreground">Team</p>
                  <p className="text-sm font-medium">{ctx.company.team}</p>
                </div>
              )}
              {ctx.company.website && (
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <p className="text-sm font-medium">{ctx.company.website}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {ctx.market && (
        <Card className="rounded-2xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">Markt</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ctx.market.tam && (
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">TAM</p>
                  <p className="text-lg font-bold">{ctx.market.tam}</p>
                </div>
              )}
              {ctx.market.sam && (
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">SAM</p>
                  <p className="text-lg font-bold">{ctx.market.sam}</p>
                </div>
              )}
              {ctx.market.som && (
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">SOM</p>
                  <p className="text-lg font-bold">{ctx.market.som}</p>
                </div>
              )}
            </div>
            {ctx.market.trends && ctx.market.trends.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Trends
                </p>
                <ul className="space-y-1">
                  {ctx.market.trends.map((t, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-teal-500">&#8226;</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {ctx.icp && ctx.icp.segments && ctx.icp.segments.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">ICP Segmenten</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {ctx.icp.segments.map((seg, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 space-y-2"
                >
                  <h3 className="font-medium">{seg.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {seg.description}
                  </p>
                  {seg.painPoints && seg.painPoints.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Pain Points
                      </p>
                      <ul className="text-sm space-y-0.5">
                        {seg.painPoints.map((p, j) => (
                          <li key={j}>&#8226; {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {seg.goals && seg.goals.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Goals
                      </p>
                      <ul className="text-sm space-y-0.5">
                        {seg.goals.map((g, j) => (
                          <li key={j}>&#8226; {g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {ctx.competitors && ctx.competitors.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">Concurrenten</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {ctx.competitors.map((comp, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 space-y-2"
                >
                  <h3 className="font-medium">{comp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {comp.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-emerald-600">
                        Sterktes
                      </p>
                      <ul className="text-xs space-y-0.5">
                        {comp.strengths.map((s, j) => (
                          <li key={j}>+ {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-500">
                        Zwaktes
                      </p>
                      <ul className="text-xs space-y-0.5">
                        {comp.weaknesses.map((w, j) => (
                          <li key={j}>- {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
