"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { fetchJson } from "../../../api/api";
import type { LinkStatus } from "../../../types/types";
import Logo from "@/src/components/Logo";
import Maimuta from "@/src/components/Maimuta";

const BLUE = "#027FE3";
const ORANGE = "#EE6707";

function useLinkStatus() {
  const [link, setLink] = useState<LinkStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const p = await fetchJson<LinkStatus>("/link/status");
        if (!cancelled) setLink(p);
      } catch {
        if (!cancelled) setLink(null);
      }
    }
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return link;
}

const FEATURES = [
  {
    title: "Reference recording",
    desc: "Record a baseline rep from either band. The stream is automatically segmented into repetitions using PCA on the IMU signal — no manual tagging of rep boundaries.",
  },
  {
    title: "Bézier curve scoring",
    desc: "Each rep is refit to an 8th-order Bézier curve (configurable) and scored against the reference using phase-aligned curve distance and amplitude difference.",
  },
  {
    title: "Direction & form feedback",
    desc: "Detects which axis — roll, pitch, or yaw — dominates the reference motion, and flags a rep immediately if it's moving in the wrong plane.",
  },
  {
    title: "Single-band mode",
    desc: "Score using just the wrist-worn secondary band's 9-axis IMU (8 axes once yaw, which stays at zero on this hardware, is dropped).",
  },
  {
    title: "Dual-band mode",
    desc: "Combine both ESP32 bands into one 18-axis signal (16 after dropping both yaw columns) for full-limb motion capture in a single comparison.",
  },
  {
    title: "Motion library",
    desc: "Save, reuse, and delete named reference motions. Each one remembers which mode — single or dual — it was recorded in.",
  },
];

export default function HomePage() {
  const link = useLinkStatus();

  const linkSummary = !link
    ? "Checking…"
    : link.stale
      ? "No recent data"
      : link.main_connected && link.secondary_connected
        ? "Both bands linked"
        : link.secondary_connected
          ? "Secondary band only"
          : "No bands linked";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-blue-600/30">
      <header className="border-b border-zinc-900 bg-zinc-950/100 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge
              variant="secondary"
              className="border-zinc-900 text-zinc-600 font-normal"
            >
              v0.4.0
            </Badge>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                className="rounded-xl font-medium text-white transition-all shadow-md shadow-blue-950/20"
                style={{ backgroundColor: BLUE }}
              >
                Launch Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8 lg:max-w-2xl">
          <div className="space-y-4">
            <Badge className="bg-orange-600/10 text-[#EE6707] border-orange-500/20 hover:bg-orange-600/20 px-3 py-1 text-xs font-medium rounded-full">
              Single & Dual-Band Motion Capture
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-zinc-100">
              Repetition Scoring for Wearable IMU Motion Capture
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Record a reference motion from an ESP32 wrist band's IMU — or from both
              bands at once — then stream live reps back for automatic segmentation,
              Bézier curve comparison, and a 0–100 form score with direction feedback.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-xl text-white px-6"
                style={{ backgroundColor: BLUE }}
              >
                Open Live Streams
              </Button>
            </Link>
            {/* put the actual documentation wroar */}
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800 rounded-xl px-6"
              >
                Documentation
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <Card className="border-zinc-800 bg-zinc-900/30">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  LIVE BUFFER
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold text-zinc-200">200 pts</p>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/30">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  AXES (DUAL MODE)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold text-zinc-200">18 Axes</p>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/30 col-span-2 sm:col-span-1">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  ANALYSIS WINDOW
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold" style={{ color: ORANGE }}>
                  240 frames
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-[380px] space-y-6">
          <Card className="border-zinc-800 bg-zinc-950/95 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-200 text-sm font-medium">
                Quick Engine Access
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Verify your pipeline configuration before starting stream
                listeners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Default Interpolation</span>
                <span className="font-mono text-zinc-300">
                  Bezier Curve (N=8)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Frame Ingestion</span>
                <span className="font-mono text-zinc-300">
                  /frame · /frame/main
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Band Link Status</span>
                <span
                  className="font-mono"
                  style={{ color: link?.main_connected && link?.secondary_connected && !link?.stale ? BLUE : "#71717a" }}
                >
                  {linkSummary}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent pointer-events-none" />
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Maimuta />
            </CardContent>
          </Card>
        </div>
      </main>

      <section id="features" className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-2 mb-8">
          <Badge className="bg-blue-600/10 text-[#027FE3] border-blue-500/20 px-3 py-1 text-xs font-medium rounded-full">
            How it works
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            What the pipeline actually does
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-zinc-800 bg-zinc-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-100">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div>
            © {new Date().getFullYear()} Twyst Analytics Platform. All rights
            reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">
              Security API
            </span>
            <span className="hover:text-zinc-400 cursor-pointer">
              Status Dashboard
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}