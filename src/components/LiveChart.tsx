'use client';

import { useEffect, useRef } from "react";
import type { SignalKey, Signals } from "../types/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function resizeCanvas(c: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  const w = Math.max(300, Math.floor(rect.width * dpr));
  const h = Math.max(140, Math.floor(rect.height * dpr));
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  return { w, h, dpr };
}

function drawChart(canvas: HTMLCanvasElement, sig: SignalKey, liveSig: Signals | null, refSig: Signals | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { w, h, dpr } = resizeCanvas(canvas);
  const pad = 28 * dpr;
  ctx.clearRect(0, 0, w, h);

  const live = liveSig?.[sig] ? liveSig[sig]!.slice() : [];
  const ref = refSig?.[sig] ? refSig[sig]!.slice() : [];
  const all = [...live, ...ref];
  const minR = all.length ? Math.min(...all) : -1;
  const maxR = all.length ? Math.max(...all) : 1;
  const range = Math.max(1e-6, maxR - minR);
  const min = minR - range * 0.06;
  const max = maxR + range * 0.06;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  ctx.save();
  ctx.translate(0.5, 0.5);
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = dpr;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (ph / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  const mx = (i: number, n: number) => (n <= 1 ? pad : pad + (i / (n - 1)) * pw);
  const my = (v: number) => h - pad - ((v - min) / (max - min)) * ph;

  function line(vals: number[], color: string, lw: number) {
    if (!vals || vals.length < 2) return;
    ctx!.strokeStyle = color;
    ctx!.lineWidth = lw * dpr;
    ctx!.lineJoin = "round";
    ctx!.beginPath();
    vals.forEach((v, i) => {
      i === 0 ? ctx!.moveTo(mx(i, vals.length), my(v)) : ctx!.lineTo(mx(i, vals.length), my(v));
    });
    ctx!.stroke();
  }

  line(ref, "rgba(201,165,93,0.55)", 1.5);
  line(live, "rgba(93,201,176,0.9)", 1.5);

  ctx.fillStyle = "rgba(99,109,126,0.6)";
  ctx.font = `${10 * dpr}px SFMono-Regular,Consolas,monospace`;
  ctx.fillText(`${sig}  ·  live ${live.length}${ref.length ? `  ·  ref ${ref.length}` : ""}`, pad, h - 7 * dpr);
  ctx.restore();
}

interface LiveChartProps {
  title: string;
  signal: SignalKey;
  liveSignals: Signals | null;
  referenceSignals: Signals | null;
  hasRef: boolean;
}

export default function LiveChart({ title, signal, liveSignals, referenceSignals, hasRef }: LiveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawChart(canvasRef.current, signal, liveSignals, referenceSignals);
  }, [signal, liveSignals, referenceSignals]);

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) drawChart(canvasRef.current, signal, liveSignals, referenceSignals);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [signal, liveSignals, referenceSignals]);

  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>Current stream for the selected signal, with the reference overlay when comparison is active.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">live {signal}</Badge>
            {hasRef && <Badge>ref {signal}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
          <canvas ref={canvasRef} width={1200} height={400} className="h-[340px] w-full rounded-xl bg-white" />
        </div>
      </CardContent>
    </Card>
  );
}
