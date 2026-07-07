import { fv } from "../api/api";
import type { CompletedRep } from "../types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RepLogProps {
  reps: CompletedRep[];
}

export default function RepLog({ reps }: RepLogProps) {
  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <CardTitle>Repetition log</CardTitle>
        <CardDescription>Completed repetitions from the active comparison session.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr><th className="px-4 py-3 font-medium">Rep</th><th className="px-4 py-3 font-medium">Score</th><th className="px-4 py-3 font-medium">d_curve</th><th className="px-4 py-3 font-medium">ΔA</th><th className="px-4 py-3 font-medium">Feedback</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {reps && reps.length
                ? reps.map((r, i) => (
                    <tr key={i} className="align-top">
                      <td className="px-4 py-3 font-medium text-zinc-700">{r.rep ?? "—"}</td>
                      <td className="px-4 py-3 text-zinc-950">{fv(r.score)}</td>
                      <td className="px-4 py-3 text-zinc-950">{fv(r.d_curve)}</td>
                      <td className="px-4 py-3 text-zinc-950">{fv(r.delta_A)}</td>
                      <td className="px-4 py-3 text-zinc-700">{r.feedback || "—"}</td>
                    </tr>
                  ))
                : <tr><td className="px-4 py-6 text-center text-zinc-500" colSpan={5}>No completed reps.</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
