"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Loader2 } from "lucide-react";
import type { UtmSet } from "@/types";
import { CHANNEL_LABELS } from "@/types";

interface ExperimentTrackingProps {
  utmSets: UtmSet[];
  experimentCode: string;
  experimentId: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-colors"
      title="Kopieer"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

function CopyAllButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 mr-1" />
      )}
      {copied ? "Gekopieerd" : "Kopieer base UTMs"}
    </Button>
  );
}

export function ExperimentTracking({
  utmSets,
  experimentCode,
  experimentId,
}: ExperimentTrackingProps) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/experiments/${experimentId}/generate-utms`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setRegenerating(false);
    }
  }

  if (!utmSets.length) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {experimentCode}
              </span>
              <span className="text-sm text-muted-foreground">
                Geen UTM sets — experiment heeft geen kanaal
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
              )}
              Regenereer UTMs
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-3 py-1 text-sm font-bold text-primary">
            {experimentCode}
          </span>
          <span className="text-sm text-muted-foreground">
            {utmSets.length} kanaal{utmSets.length !== 1 ? "en" : ""}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          {regenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
          )}
          Regenereer UTMs
        </Button>
      </div>

      {utmSets.map((set, index) => {
        const channelLabel = CHANNEL_LABELS[set.channel] || set.channel;
        const baseParams = [
          { label: "utm_campaign", value: set.utm_campaign },
          { label: "utm_medium", value: set.utm_medium },
          { label: "utm_source", value: set.utm_source },
        ];
        const baseUtmString = baseParams
          .map((p) => `${p.label}=${p.value}`)
          .join("&");

        return (
          <Card key={index} className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{channelLabel}</span>
                <CopyAllButton text={baseUtmString} />
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Base UTM parameters</p>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {baseParams.map((p) => (
                        <tr key={p.label} className="border-b last:border-b-0">
                          <td className="px-3 py-2 bg-muted/50 font-mono text-xs text-muted-foreground w-[140px]">
                            {p.label}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="select-all">{p.value}</span>
                              <CopyButton text={p.value} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-medium text-muted-foreground">utm_term</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                    per audience invullen
                  </span>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{set.termGuideline}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-medium text-muted-foreground">utm_content</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                    per creative invullen
                  </span>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{set.contentGuideline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
