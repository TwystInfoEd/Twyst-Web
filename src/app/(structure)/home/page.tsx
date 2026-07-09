"use client";

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
import Logo from "@/src/components/Logo";
import Maimuta from "@/src/components/Maimuta";

const BLUE = "#027FE3";
const ORANGE = "#EE6707";

export default function HomePage() {
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
              Dual-Band Telemetry Integration
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-zinc-100">
              Precision Motion Analysis & Real-time Stream Tracking
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Connect your secondary and main bands to map raw signal
              structures, detect curve alignments using live Bezier processing,
              and capture high-fidelity performance loops instantly.
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
                  CHANNELS
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold text-zinc-200">22 Axes</p>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/30 col-span-2 sm:col-span-1">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  LATENCY
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-semibold text-emerald-400">
                  &lt; 8ms
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
                <span className="text-zinc-400">Stream Transport Target</span>
                <span className="font-mono text-zinc-300">
                  /compare/session
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Primary Band Engine</span>
                <span className="font-mono text-zinc-500">
                  Awaiting Active Link...
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
