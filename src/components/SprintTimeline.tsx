"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SprintActivity } from "@/types";

interface SprintTimelineProps {
  sprints: Array<{
    id: number;
    number: number;
    name: string;
    weeks: string | null;
    focus: string | null;
    activities: SprintActivity[] | null;
    successCriteria: string[] | null;
    status: string;
  }>;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-slate-100 text-slate-700",
  active:
    "bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0",
  completed: "bg-blue-100 text-blue-700",
};

export function SprintTimeline({ sprints }: SprintTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sprints.map((sprint, i) => (
          <div key={sprint.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                sprint.status === "active"
                  ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white"
                  : sprint.status === "completed"
                    ? "bg-blue-500 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {sprint.number}
            </div>
            {i < sprints.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  sprint.status === "completed"
                    ? "bg-blue-500"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {sprints.map((sprint) => (
          <Card
            key={sprint.id}
            className={`rounded-2xl overflow-hidden transition-shadow hover:shadow-md ${
              sprint.status === "active" ? "ring-2 ring-teal-500/20" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{sprint.name}</h3>
                    <Badge className={statusColors[sprint.status] || statusColors.upcoming}>
                      {sprint.status}
                    </Badge>
                  </div>
                  {sprint.weeks && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {sprint.weeks}
                    </p>
                  )}
                </div>
              </div>
              {sprint.focus && (
                <p className="text-sm text-muted-foreground">{sprint.focus}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {sprint.activities && sprint.activities.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Dag
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Activiteit
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Owner
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground">
                          Deliverable
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sprint.activities.map((activity, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 text-muted-foreground">
                            {activity.day}
                          </td>
                          <td className="py-2 pr-4">{activity.activity}</td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            {activity.owner}
                          </td>
                          <td className="py-2">{activity.deliverable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sprint.successCriteria &&
                sprint.successCriteria.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Success Criteria
                    </p>
                    <ul className="space-y-1">
                      {sprint.successCriteria.map((c, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-teal-500 mt-0.5">&#10003;</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
