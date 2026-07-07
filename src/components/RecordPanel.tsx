import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface RecordPanelProps {
  name: string;
  setName: (v: string) => void;
  order: number;
  setOrder: (v: number) => void;
  active: boolean;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
}

export default function RecordPanel({
  name, setName, order, setOrder,
  active, onStart, onStop, onRefresh,
}: RecordPanelProps) {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-zinc-100">Record reference</CardTitle>
            <CardDescription className="text-zinc-400">Capture a baseline motion that comparison mode can score against.</CardDescription>
          </div>
          <Badge
            className="border-0 text-white"
            style={{ backgroundColor: active ? "#EE6707" : "#3f3f46" }}
          >
            {active ? "Recording" : "Idle"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="recordName" className="text-sm font-medium text-zinc-300">Motion name</label>
          <Input
            id="recordName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="squat_reference"
            className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="recordOrder" className="text-sm font-medium text-zinc-300">Bezier order</label>
          <Input
            id="recordOrder"
            type="number"
            min={2}
            max={16}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 8)}
            className="border-zinc-700 bg-zinc-900 text-zinc-100"
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={onStart}
            disabled={active}
            className="border-0 text-white hover:opacity-90"
            style={{ backgroundColor: "#027FE3" }}
          >
            Start recording
          </Button>
          <Button
          variant='destructive'
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