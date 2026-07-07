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

interface BandCardProps {
  link: LinkStatus;
}

export default function BandCard({ link }: BandCardProps) {
  const mainCls = classFor(link.main_connected, link.stale);
  const secCls = classFor(link.secondary_connected, link.stale);
  const linkState = link.stale ? "Stale" : link.main_connected && link.secondary_connected ? "Connected" : "Attention";

  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Band status</CardTitle>
            <CardDescription>Connection health for the two bands and bridge state.</CardDescription>
          </div>
          <Badge variant={link.stale ? "secondary" : link.main_connected && link.secondary_connected ? "default" : "outline"}>
            {linkState}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <div className="flex items-center gap-3">
            <div className={`h-3.5 w-3.5 rounded-full ${mainCls === "teal" ? "bg-emerald-500" : mainCls === "coral" ? "bg-rose-500" : "bg-amber-500"}`} />
            <div>
              <div className="text-sm font-semibold text-zinc-950">Main band</div>
              <div className="text-sm text-zinc-500">{labelFor(link.main_connected, link.stale, link.state)}</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <div className="flex items-center gap-3">
            <div className={`h-3.5 w-3.5 rounded-full ${secCls === "teal" ? "bg-emerald-500" : secCls === "coral" ? "bg-rose-500" : "bg-amber-500"}`} />
            <div>
              <div className="text-sm font-semibold text-zinc-950">Secondary band</div>
              <div className="text-sm text-zinc-500">{labelFor(link.secondary_connected, link.stale, null)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
