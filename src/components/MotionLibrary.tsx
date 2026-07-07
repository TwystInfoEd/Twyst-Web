import type { MotionInfo } from "../types/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface MotionLibraryProps {
  motions: MotionInfo[];
  onUse: (name: string) => void;
  onDelete: (name: string) => void;
  onReload: () => void;
}

export default function MotionLibrary({ motions, onUse, onDelete, onReload }: MotionLibraryProps) {
  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Motion library</CardTitle>
            <CardDescription>Saved references you can compare against live sessions.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onReload}>Reload</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {motions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-6 text-center text-sm text-zinc-500">
              No saved motions. Record a reference to populate this list.
            </div>
          )}
          {motions.map((m) => (
            <div key={m.name} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-zinc-950">{m.name}</div>
                  <div className="text-sm text-zinc-500">{m.n_frames ?? "?"} frames · {m.n_reps_in_reference ?? "?"} reference reps</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onUse(m.name)}>Use</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(m.name)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
