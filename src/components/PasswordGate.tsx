"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

interface PasswordGateProps {
  slug: string;
  clientName: string;
  brandPrimary?: string | null;
}

export function PasswordGate({
  slug,
  clientName,
  brandPrimary,
}: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });

      if (res.ok) {
        router.push(`/${slug}`);
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const accentColor = brandPrimary || "#3ecda5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <Card className="w-full max-w-md relative overflow-hidden rounded-3xl shadow-xl border-0">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, ${accentColor}, ${accentColor}99)`,
          }}
        />
        <CardHeader className="text-center pt-10 pb-2">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-4"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
            }}
          >
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">{clientName}</h1>
          <p className="text-sm text-muted-foreground">
            Growth Experiment Dashboard
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl text-center text-lg"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full h-12 rounded-xl text-base font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              }}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
