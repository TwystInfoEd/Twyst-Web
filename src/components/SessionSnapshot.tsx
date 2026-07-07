import { fv } from "../api/api";
import type { FrameData } from "../types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface SessionInfo {
  session: string;
  frames: number;
  reference: string;
  reps: number;
  elapsed: string;
  status: string;
}

interface SessionSnapshotProps {
  session: SessionInfo;
  frame: FrameData | null;
}

export default function SessionSnapshot({ session, frame }: SessionSnapshotProps) {
  const cards: [string, string | number][] = [
    ["Session", session.session],
    ["Frames", session.frames],
    ["Reference", session.reference],
    ["Reps", session.reps],
    ["Elapsed", session.elapsed],
    ["Status", session.status],
  ];
  const entries = frame ? (Object.entries(frame) as [string, number][]) : [];

  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <CardTitle>Session snapshot</CardTitle>
        <CardDescription>Live counters and the latest frame payload from the active session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{k}</div>
              <div className="mt-1 text-sm font-medium text-zinc-950">{v ?? "—"}</div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr><th className="px-4 py-3 font-medium">Signal</th><th className="px-4 py-3 font-medium">Value</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {entries.length
                ? entries.map(([k, v]) => <tr key={k}><td className="px-4 py-3 font-medium text-zinc-700">{k}</td><td className="px-4 py-3 text-zinc-950">{fv(v)}</td></tr>)
                : <tr><td className="px-4 py-6 text-center text-zinc-500" colSpan={2}>No frame data.</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
