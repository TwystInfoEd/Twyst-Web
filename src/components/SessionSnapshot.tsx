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
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
      <CardHeader className="pb-4">
        <CardTitle className="text-zinc-100">Session snapshot</CardTitle>
        <CardDescription className="text-zinc-400">Live counters and the latest frame payload from the active session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3"
              style={{ borderLeft: "3px solid #027FE3" }}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{k}</div>
              <div className="mt-1 text-sm font-medium text-zinc-100">{v ?? "—"}</div>
            </div>
          ))}
        </div>
        <Separator className="bg-zinc-800" />
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr><th className="whitespace-nowrap px-4 py-3 font-medium">Signal</th><th className="whitespace-nowrap px-4 py-3 font-medium">Value</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {entries.length
                  ? entries.map(([k, v]) => (
                      <tr key={k}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-400">{k}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold" style={{ color: "#EE6707" }}>{fv(v)}</td>
                      </tr>
                    ))
                  : <tr><td className="px-4 py-6 text-center text-zinc-500" colSpan={2}>No frame data.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}