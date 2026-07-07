import { SIGNAL_KEYS } from "../types/types";
import type { MotionInfo, SignalKey } from "../types/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

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
  motions, reference, setReference,
  order, setOrder, signal, setSignal,
  active, canStart, onStart, onStop, onRefresh,
}: ComparePanelProps) {
  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Compare motion</CardTitle>
            <CardDescription>Stream live reps and compare them against a saved reference.</CardDescription>
          </div>
          <Badge variant={active ? "default" : "secondary"}>{active ? "Live" : "Ready"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="referenceSelect" className="text-sm font-medium text-zinc-700">Reference motion</label>
          <Select id="referenceSelect" value={reference} onChange={(e) => setReference(e.target.value)}>
            {motions.length === 0 && <option value="">No saved motions</option>}
            {motions.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="compareOrder" className="text-sm font-medium text-zinc-700">Bezier order</label>
            <Input id="compareOrder" type="number" min={2} max={16} value={order} onChange={(e) => setOrder(Number(e.target.value) || 8)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="signalSelect" className="text-sm font-medium text-zinc-700">Signal</label>
            <Select id="signalSelect" value={signal} onChange={(e) => setSignal(e.target.value as SignalKey)}>
              {SIGNAL_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={onStart} disabled={active || !canStart}>Start compare</Button>
          <Button variant="destructive" onClick={onStop} disabled={!active}>Stop</Button>
          <Button variant="ghost" onClick={onRefresh}>Refresh</Button>
        </div>
      </CardContent>
    </Card>
  );
}
