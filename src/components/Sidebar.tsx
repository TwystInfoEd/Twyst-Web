import { clamp, fv } from "../api/api";
import type { CompletedRep } from "../types/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

const BLUE = "#027FE3";
const ORANGE = "#EE6707";

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
  const barColor = v >= 60 ? BLUE : ORANGE;
  const feedbackTone = scoreClass(feedback);

  const feedbackClasses =
    feedbackTone === "good"
      ? "border-blue-900/50 bg-blue-950/40 text-blue-300"
      : feedbackTone === "warn"
        ? "border-orange-900/50 bg-orange-950/30 text-orange-300"
        : feedbackTone === "bad"
          ? "border-orange-800/60 bg-orange-950/50 text-orange-200"
          : "border-zinc-800 bg-zinc-900/60 text-zinc-400";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-zinc-100">Comparison score</CardTitle>
              <CardDescription className="text-zinc-400">How closely the current motion matches the reference.</CardDescription>
            </div>
            <Badge className="border-0 text-white" style={{ backgroundColor: barColor }}>
              {Math.round(v)}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="text-sm font-medium text-zinc-500">Overall score</div>
              <div className="text-4xl font-semibold tracking-tight text-zinc-100">{v.toFixed(0)}<span className="text-base text-zinc-500">/ 100</span></div>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div className="h-full rounded-full transition-all" style={{ width: `${v}%`, background: barColor }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Completed</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{completedCount}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Current rep</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{currentRepLabel}</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">d_curve</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{fv(curve)}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">ΔA</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{fv(amplitude)}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Progress</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{Math.round((progress || 0) * 100)}%</div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          <div className={`rounded-2xl border px-4 py-3 text-sm ${feedbackClasses}`}>
            {feedback || "Waiting…"}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
        <CardHeader className="pb-4">
          <CardTitle className="text-zinc-100">Rep timeline</CardTitle>
          <CardDescription className="text-zinc-400">Completed repetitions and the current in-progress rep.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(!reps || reps.length === 0) && !hasActive && (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-500">
                No reps yet.
              </div>
            )}
            {(reps || []).map((r, i) => {
              const sc = Number.isFinite(r.score) ? clamp(r.score, 0, 100) : 0;
              return (
                <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-100">Rep {r.rep ?? "—"}</div>
                    <Badge className="border-0 text-white" style={{ backgroundColor: BLUE }}>{sc.toFixed(0)}/100</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">{r.feedback || "Completed"}</div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-800">
                    <div className="h-full rounded-full" style={{ width: `${sc}%`, backgroundColor: BLUE }} />
                  </div>
                </div>
              );
            })}
            {hasActive && (
              <div className="rounded-2xl border border-orange-900/50 bg-orange-950/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-100">Rep {(reps?.length || 0) + 1}</div>
                  <Badge className="border-0 text-white" style={{ backgroundColor: ORANGE }}>Active</Badge>
                </div>
                <div className="mt-2 text-sm text-zinc-400">In progress</div>
                <div className="mt-3 h-2 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full" style={{ width: `${clamp(activeProgress || 0, 0, 1) * 100}%`, backgroundColor: ORANGE }} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}