import type { MotionInfo } from "../types/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const BLUE = "#027FE3";
const ORANGE = "#EE6707";

interface MotionLibraryProps {
  motions: MotionInfo[];
  onUse: (name: string) => void;
  onDelete: (name: string) => void;
  onReload: () => void;
}

export default function MotionLibrary({ motions, onUse, onDelete, onReload }: MotionLibraryProps) {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/95">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-zinc-100">Motion library</CardTitle>
            <CardDescription className="text-zinc-400">Saved references you can compare against live sessions.</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReload}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Reload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {motions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-500">
              No saved motions. Record a reference to populate this list.
            </div>
          )}
          {motions.map((m) => (
            <div key={m.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-zinc-100">{m.name}</div>
                  <div className="text-sm text-zinc-500">{m.n_frames ?? "?"} frames · {m.n_reps_in_reference ?? "?"} reference reps</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => onUse(m.name)}
                    className="border-0 text-white hover:opacity-90"
                    style={{ backgroundColor: BLUE }}
                  >
                    Use
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(m.name)}
                    className="border-0 text-white hover:opacity-90"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}