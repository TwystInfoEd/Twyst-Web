import { SIGNAL_KEYS } from "../types/types";
import type { MotionInfo, SignalKey } from "../types/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ComparePanelProps {
  motions: MotionInfo[];
  reference: string;
  setReference: (v: string) => void;
  order: number;
  setOrder: (v: number) => void;
  signal: SignalKey;
  setSignal: (v: SignalKey) => void;
  active: boolean;
  canStart: boolean;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
}

export default function ComparePanel({
  motions,
  reference,
  setReference,
  order,
  setOrder,
  signal,
  setSignal,
  active,
  canStart,
  onStart,
  onStop,
  onRefresh,
}: ComparePanelProps) {
  return (
    <Card className="overflow-hidden border-zinc-700 bg-zinc-900 text-zinc-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Compare motion</CardTitle>
            <CardDescription className="text-zinc-400">
              Stream live reps and compare them against a saved reference.
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={
              active
? "border-[#027FE3] bg-[#027FE3] text-white hover:bg-[#026fc7]"
: "border-[#EE6707] bg-[#EE6707] text-white hover:bg-[#d85d06]"
            }
          >
            {active ? "Live" : "Ready"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="referenceSelect"
            className="text-sm font-medium text-zinc-300"
          >
            Reference motion
          </label>

          <Select
  value={reference}
  onValueChange={setReference}
>
  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
    <SelectValue placeholder="Select a motion" />
  </SelectTrigger>

  <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-100">
    {motions.length === 0 ? (
      <SelectItem value="none" disabled>
        No saved motions
      </SelectItem>
    ) : (
      motions.map((m) => (
        <SelectItem key={m.name} value={m.name}>
          {m.name}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="compareOrder"
              className="text-sm font-medium text-zinc-300"
            >
              Bezier order
            </label>

            <Input
              id="compareOrder"
              type="number"
              min={2}
              max={16}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 8)}
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="signalSelect"
              className="text-sm font-medium text-zinc-300"
            >
              Signal
            </label>

            <Select
  value={signal}
  onValueChange={(value) => setSignal(value as SignalKey)}
>
  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
    <SelectValue />
  </SelectTrigger>

  <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-100">
    {SIGNAL_KEYS.map((k) => (
      <SelectItem key={k} value={k}>
        {k}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
  <Button
    onClick={onStart}
    disabled={active || !canStart}
  >
    Start compare
  </Button>

  <Button
    variant="destructive"
    onClick={onStop}
    disabled={!active}
  >
    Stop
  </Button>

  <Button
    variant="outline"
    onClick={onRefresh}
  >
    Refresh
  </Button>
</div>
      </CardContent>
    </Card>
  );
}