import type { LinkStatus } from "../types/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function classFor(connected: boolean, stale: boolean): string {
  return stale ? "amber" : connected ? "teal" : "coral";
}

function labelFor(connected: boolean, stale: boolean, detail: string | null): string {
  const label = stale ? "Unknown" : connected ? "Connected" : "Disconnected";
  return detail ? `${label} · ${detail}` : label;
}

interface LinkDiagramProps {
  link: LinkStatus;
}

export default function LinkDiagram({ link }: LinkDiagramProps) {
  const mainCls = classFor(link.main_connected, link.stale);
  const secCls = classFor(link.secondary_connected, link.stale);
  const line1Cls = link.stale ? "amber" : (link.main_connected && link.secondary_connected) ? "teal" : "";
  const line2Cls = link.stale ? "amber" : link.secondary_connected ? "teal" : "";

  const updatedText = link.last_update
    ? `Updated ${new Date(link.last_update * 1000).toLocaleTimeString()}`
    : link.error
      ? "Backend unreachable"
      : "Waiting for data…";

  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>Connection path</CardTitle>
            <CardDescription>{updatedText}</CardDescription>
          </div>
          <Badge variant={link.stale ? "secondary" : "default"}>{link.stale ? "Polling" : "Live"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 md:grid-cols-[1fr_72px_1fr_72px_1fr] md:items-center">
          <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <div className={`h-4 w-4 rounded-full ${mainCls === "teal" ? "bg-emerald-500" : mainCls === "coral" ? "bg-rose-500" : "bg-amber-500"}`} />
            <div>
              <div className="text-sm font-semibold text-zinc-950">Main band</div>
              <div className="text-sm text-zinc-500">{labelFor(link.main_connected, link.stale, link.state)}</div>
            </div>
          </div>

          <div className={`hidden h-px w-full bg-zinc-200 md:block ${line1Cls === "teal" ? "bg-emerald-300" : ""}`} />

          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`h-4 w-4 rounded-full ${secCls === "teal" ? "bg-emerald-500" : secCls === "coral" ? "bg-rose-500" : "bg-amber-500"}`} />
            <div>
              <div className="text-sm font-semibold text-zinc-950">Secondary band</div>
              <div className="text-sm text-zinc-500">{labelFor(link.secondary_connected, link.stale, null)}</div>
            </div>
          </div>

          <div className={`hidden h-px w-full bg-zinc-200 md:block ${line2Cls === "teal" ? "bg-emerald-300" : ""}`} />

          <div className="flex flex-col items-center gap-3 text-center md:items-end md:text-right">
            <div className="h-4 w-4 rounded-full bg-[#5e54b8] shadow-[0_0_0_4px_rgba(94,84,184,0.14)]" />
            <div>
              <div className="text-sm font-semibold text-zinc-950">Backend</div>
              <div className="text-sm text-zinc-500">This server</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
