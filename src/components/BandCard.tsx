import type { LinkStatus } from "../types/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function classFor(connected: boolean, stale: boolean): string {
  return stale ? "warning" : connected ? "connected" : "disconnected";
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

  const linkState = link.stale
    ? "Stale"
    : link.main_connected && link.secondary_connected
      ? "Connected"
      : "Attention";

  return (
    <Card className="overflow-hidden border-zinc-700 bg-zinc-900 text-zinc-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Band status</CardTitle>
            <CardDescription className="text-zinc-400">
              Connection health for the two bands and bridge state.
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={
              link.stale
                ? "border-[#EE6707] bg-[#EE6707] text-white hover:bg-[#d85d06]"
                : link.main_connected && link.secondary_connected
                  ? "border-[#027FE3] bg-[#027FE3] text-white hover:bg-[#026fc7]"
: "border-[#EE6707] bg-[#EE6707] text-white hover:bg-[#d85d06]"
            }
          >
            {linkState}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
      
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3.5 w-3.5 rounded-full ${
                mainCls === "connected"
                  ? "bg-[#027FE3]"
                  : mainCls === "disconnected"
                    ? "bg-rose-500"
                    : "bg-[#EE6707]"
              }`}
            />
            <div>
              <div className="text-sm font-semibold text-zinc-100">
                Main band
              </div>
              <div className="text-sm text-zinc-400">
                {labelFor(link.main_connected, link.stale, link.state)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3.5 w-3.5 rounded-full ${
                secCls === "connected"
                  ? "bg-[#027FE3]"
                  : secCls === "disconnected"
                    ? "bg-rose-500"
                    : "bg-[#EE6707]"
              }`}
            />
            <div>
              <div className="text-sm font-semibold text-zinc-100">
                Secondary band
              </div>
              <div className="text-sm text-zinc-400">
                {labelFor(link.secondary_connected, link.stale, null)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}