import { fv } from "../api/api";
import type { CompletedRep } from "../types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RepLogProps {
  reps: CompletedRep[];
}

export default function RepLog({ reps }: RepLogProps) {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
      <CardHeader className="pb-4">
        <CardTitle className="text-zinc-100">Repetition log</CardTitle>
        <CardDescription className="text-zinc-400">Completed repetitions from the active comparison session.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr><th className="whitespace-nowrap px-4 py-3 font-medium">Rep</th><th className="whitespace-nowrap px-4 py-3 font-medium">Score</th><th className="whitespace-nowrap px-4 py-3 font-medium">d_curve</th><th className="whitespace-nowrap px-4 py-3 font-medium">ΔA</th><th className="whitespace-nowrap px-4 py-3 font-medium">Feedback</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {reps && reps.length
                  ? reps.map((r, i) => (
                      <tr key={i} className="align-top">
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold text-white"
                            style={{ backgroundColor: "#027FE3" }}
                          >
                            {r.rep ?? "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium" style={{ color: "#EE6707" }}>{fv(r.score)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-100">{fv(r.d_curve)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-100">{fv(r.delta_A)}</td>
                        <td className="px-4 py-3 text-zinc-400">{r.feedback || "—"}</td>
                      </tr>
                    ))
                  : <tr><td className="px-4 py-6 text-center text-zinc-500" colSpan={5}>No completed reps.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}