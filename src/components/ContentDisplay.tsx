"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown } from "lucide-react";
import type { ContentSection } from "@/types";

const typeLabels: Record<string, string> = {
  copy: "Copy",
  email: "Email",
  "social-post": "Social Post",
  outline: "Outline",
  template: "Template",
  assessment: "Assessment",
  article: "Artikel",
};

const typeColors: Record<string, string> = {
  copy: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  email:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "social-post":
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  outline:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  template:
    "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  assessment:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  article:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-2 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1 text-green-500" />
          <span className="text-xs text-green-500">Gekopieerd</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">{label || "Kopieer"}</span>
        </>
      )}
    </Button>
  );
}

interface ContentDisplayProps {
  sections: ContentSection[];
}

export function ContentDisplay({ sections }: ContentDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Geen content beschikbaar voor dit experiment</p>
      </div>
    );
  }

  const allText = sections
    .map((s) => `--- ${s.title} ---\n\n${s.body}`)
    .join("\n\n\n");

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardHeader
        className="pb-2 cursor-pointer select-none hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                isOpen ? "" : "-rotate-90"
              }`}
            />
            <h4 className="font-semibold text-sm">Alle content</h4>
            <span className="text-xs text-muted-foreground">
              {sections.length} {sections.length === 1 ? "sectie" : "secties"}
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <CopyButton text={allText} label="Kopieer alles" />
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 space-y-5">
          {sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">{section.title}</h4>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${
                      typeColors[section.type] || typeColors.copy
                    }`}
                  >
                    {typeLabels[section.type] || section.type}
                  </span>
                </div>
                <CopyButton text={section.body} />
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/50 rounded-xl p-4 overflow-x-auto">
                {section.body}
              </pre>
              {i < sections.length - 1 && (
                <hr className="mt-5 border-border/50" />
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
