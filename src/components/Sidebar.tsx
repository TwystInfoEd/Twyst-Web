import { clamp, fv } from "../api/api";
import type { CompletedRep } from "../types/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

function scoreClass(t: string): string {
  const n = (t || "").toLowerCase();
  if (n.includes("great") || n.includes("excellent") || n.includes("good")) return "good";
  if (n.includes("warning") || n.includes("acceptable") || n.includes("slight")) return "warn";
  if (n.includes("needs") || n.includes("off") || n.includes("deviates")) return "bad";
  return "";
}

interface SidebarProps {
  score: number;
  completedCount: number;
  currentRepLabel: string;
  curve: number | null;
  amplitude: number | null;
  progress: number;
  feedback: string;
  reps: CompletedRep[];
  activeProgress: number;
  hasActive: boolean;
}

export default function Sidebar({
  score, completedCount, currentRepLabel,
  curve, amplitude, progress, feedback,
  reps, activeProgress, hasActive,
}: SidebarProps) {
  const v = Number.isFinite(score) ? clamp(score, 0, 100) : 0;
  const barColor = v >= 85 ? "var(--teal)" : v >= 60 ? "var(--amber)" : "var(--coral)";
  const feedbackTone = scoreClass(feedback);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-[#ddd6fe] bg-white/95">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Comparison score</CardTitle>
              <CardDescription>How closely the current motion matches the reference.</CardDescription>
            </div>
            <Badge variant={v >= 85 ? "default" : v >= 60 ? "secondary" : "destructive"}>{Math.round(v)}/100</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="text-sm font-medium text-zinc-500">Overall score</div>
              <div className="text-4xl font-semibold tracking-tight text-zinc-950">{v.toFixed(0)}<span className="text-base text-zinc-400">/ 100</span></div>
            </div>
            <div className="h-2 rounded-full bg-zinc-200">
              <div className="h-full rounded-full" style={{ width: `${v}%`, background: barColor }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Completed</div>
              <div className="mt-1 text-lg font-semibold text-zinc-950">{completedCount}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Current rep</div>
              <div className="mt-1 text-lg font-semibold text-zinc-950">{currentRepLabel}</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">d_curve</div>
              <div className="mt-1 text-lg font-semibold text-zinc-950">{fv(curve)}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">ΔA</div>
              <div className="mt-1 text-lg font-semibold text-zinc-950">{fv(amplitude)}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Progress</div>
              <div className="mt-1 text-lg font-semibold text-zinc-950">{Math.round((progress || 0) * 100)}%</div>
            </div>
          </div>

          <Separator />

          <div className={`rounded-2xl border px-4 py-3 text-sm ${feedbackTone === "good" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : feedbackTone === "warn" ? "border-amber-200 bg-amber-50 text-amber-900" : feedbackTone === "bad" ? "border-rose-200 bg-rose-50 text-rose-900" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}>
            {feedback || "Waiting…"}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
        <CardHeader className="pb-4">
          <CardTitle>Rep timeline</CardTitle>
          <CardDescription>Completed repetitions and the current in-progress rep.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(!reps || reps.length === 0) && !hasActive && <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-6 text-center text-sm text-zinc-500">No reps yet.</div>}
            {(reps || []).map((r, i) => {
              const sc = Number.isFinite(r.score) ? clamp(r.score, 0, 100) : 0;
              return (
                <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-950">Rep {r.rep ?? "—"}</div>
                    <Badge variant="secondary">{sc.toFixed(0)}/100</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">{r.feedback || "Completed"}</div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-200"><div className="h-full rounded-full bg-[#5e54b8]" style={{ width: `${sc}%` }} /></div>
                </div>
              );
            })}
            {hasActive && (
              <div className="rounded-2xl border border-[#ddd6fe] bg-[#ebe8ff]/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-950">Rep {(reps?.length || 0) + 1}</div>
                  <Badge>Active</Badge>
                </div>
                <div className="mt-2 text-sm text-zinc-600">In progress</div>
                <div className="mt-3 h-2 rounded-full bg-zinc-200"><div className="h-full rounded-full bg-[#5e54b8]" style={{ width: `${clamp(activeProgress || 0, 0, 1) * 100}%` }} /></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
