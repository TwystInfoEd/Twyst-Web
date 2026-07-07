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

interface LinkDiagramProps {
  link: LinkStatus;
}

export default function LinkDiagram({ link }: LinkDiagramProps) {
  const mainCls = classFor(link.main_connected, link.stale);
  const secCls = classFor(link.secondary_connected, link.stale);

  const line1Cls = link.stale
    ? "bg-[#EE6707]"
    : link.main_connected && link.secondary_connected
      ? "bg-[#027FE3]"
      : "bg-zinc-700";

  const line2Cls = link.stale
    ? "bg-[#EE6707]"
    : link.secondary_connected
      ? "bg-[#027FE3]"
      : "bg-zinc-700";

  const updatedText = link.last_update
    ? `Updated ${new Date(link.last_update * 1000).toLocaleTimeString()}`
    : link.error
      ? "Backend unreachable"
      : "Waiting for data…";

  return (
    <Card className="overflow-hidden border-zinc-700 bg-zinc-900 text-zinc-100">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>Connection path</CardTitle>
            <CardDescription className="text-zinc-400">
              {updatedText}
            </CardDescription>
          </div>

          <Badge
            variant={link.stale ? "secondary" : "default"}
            className={
              link.stale
                ? "bg-[#EE6707] text-white hover:bg-[#90C3EB]"
                : "bg-[#027FE3] text-white hover:bg-[#90C3EB]"
            }
          >
            {link.stale ? "Polling" : "Live"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 md:grid-cols-[1fr_72px_1fr_72px_1fr] md:items-center">
          {/* Main band */}
          <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <div
              className={`h-4 w-4 rounded-full ${
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

          {/* Line 1 */}
          <div className={`hidden h-px w-full md:block ${line1Cls}`} />

          {/* Secondary band */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={`h-4 w-4 rounded-full ${
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

          {/* Line 2 */}
          <div className={`hidden h-px w-full md:block ${line2Cls}`} />

          {/* Backend */}
          <div className="flex flex-col items-center gap-3 text-center md:items-end md:text-right">
            <div className="h-4 w-4 rounded-full bg-[#027FE3] shadow-[0_0_0_4px_rgba(2,127,227,0.18)]" />
            <div>
              <div className="text-sm font-semibold text-zinc-100">
                Backend
              </div>
              <div className="text-sm text-zinc-500">This server</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}