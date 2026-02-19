"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FlaskConical,
  Building2,
  Layers,
  CalendarDays,
  CalendarRange,
  Presentation,
  Menu,
  X,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
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

export function MobileNav({
  slug,
  clientName,
  brandPrimary,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden border-b bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: brandPrimary
                ? `linear-gradient(135deg, ${brandPrimary}, ${brandPrimary}dd)`
                : "linear-gradient(135deg, #3ecda5, #2ab090)",
            }}
          >
            {clientName.charAt(0)}
          </div>
          <span className="font-semibold text-sm">{clientName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      {open && (
        <nav className="px-4 pb-4 space-y-1">
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
                onClick={() => setOpen(false)}
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
          <div className="border-t pt-2 mt-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Switch Client
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
