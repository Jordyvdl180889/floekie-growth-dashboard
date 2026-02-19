"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FlaskConical,
  Building2,
  Layers,
  CalendarDays,
  CalendarRange,
  Presentation,
  LogOut,
  ArrowLeftRight,
} from "lucide-react";

interface DashboardSidebarProps {
  slug: string;
  clientName: string;
  brandPrimary?: string | null;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "" },
  { label: "Experiments", icon: FlaskConical, path: "/experiments" },
  { label: "Context", icon: Building2, path: "/context" },
  { label: "Growth Engine", icon: Layers, path: "/growth-engine" },
  { label: "Sprints", icon: CalendarDays, path: "/sprints" },
  { label: "Roadmap", icon: CalendarRange, path: "/roadmap" },
  { label: "Deliverables", icon: Presentation, path: "/deliverables" },
];

export function DashboardSidebar({
  slug,
  clientName,
  brandPrimary,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: brandPrimary
                ? `linear-gradient(135deg, ${brandPrimary}, ${brandPrimary}dd)`
                : "linear-gradient(135deg, #3ecda5, #2ab090)",
            }}
          >
            {clientName.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-sm">{clientName}</h2>
            <p className="text-xs text-muted-foreground">Growth Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const href = `/${slug}${item.path}`;
          const isActive =
            item.path === ""
              ? pathname === `/${slug}` || pathname === `/${slug}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={
                isActive && brandPrimary
                  ? {
                      backgroundColor: `${brandPrimary}15`,
                      color: brandPrimary,
                    }
                  : undefined
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Switch Client
        </Link>
        <Link
          href={`/login/${slug}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
