"use client";

import { useCallback, useRef, useState } from "react";
import { fetchJson, API_BASE } from "../../../api/api";
import { usePoll } from "../../../hooks/usePoll";
import type {
  LinkStatus,
  MotionInfo,
  RecordState,
  CompareState,
  SignalKey,
  Signals,
  BatteryStatus,
} from "../../../types/types";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import BandCard from "../../../components/BandCard";
import LinkDiagram from "../../../components/LinkDiagram";
import RecordPanel from "../../../components/RecordPanel";
import ComparePanel from "../../../components/ComparePanel";
import LiveChart from "../../../components/LiveChart";
import SessionSnapshot from "../../../components/SessionSnapshot";
import RepLog from "../../../components/RepLog";
import MotionLibrary from "../../../components/MotionLibrary";
import Sidebar from "../../../components/Sidebar";

const BLUE = "#027FE3";
const ORANGE = "#EE6707";

const emptySignals = {} as Signals;


export default function Dashboard() {
  const [link, setLink] = useState<LinkStatus>({
    main_connected: false,
    secondary_connected: false,
    stale: true,
    state: "unknown",
    last_update: null,
  });

  const [motions, setMotions] = useState<MotionInfo[]>([]);
  const [recordState, setRecordState] = useState<RecordState | null>(null);
  const [compareState, setCompareState] = useState<CompareState | null>(null);

  const [recordName, setRecordName] = useState("squat_reference");
  const [recordOrder, setRecordOrder] = useState(8);
  const [reference, setReference] = useState("");
  const [compareOrder, setCompareOrder] = useState(8);
  const [signal, setSignal] = useState<SignalKey>("pitch");

  const [recordMode, setRecordMode] = useState<"single" | "dual">("single");

  const suppressRecordUntil = useRef(0);
  const suppressCompareUntil = useRef(0);

  const refreshLinkStatus = useCallback(async () => {
    try {
      const p = await fetchJson<LinkStatus>("/link/status");
      setLink(p);
    } catch {
      setLink({
        main_connected: false,
        secondary_connected: false,
        stale: true,
        state: "unknown",
        last_update: null,
        error: true,
      });
    }
  }, []);

  const refreshBattery = useCallback(async () => {
    try {
      const p = await fetchJson<BatteryStatus>("/battery/status");
      setBattery(p);
    } catch {
      setBattery({
        available: false,
        voltage: null,
        percent: null,
        stale: true,
        last_update: null,
      });
    }
  }, []);

  const refreshMotions = useCallback(async () => {
    try {
      const p = await fetchJson<{ motions: string[] }>("/motions");
      const names = p.motions || [];
      const details = await Promise.all(
        names.map(async (name): Promise<MotionInfo> => {
          try {
            return await fetchJson<MotionInfo>(
              `/motions/${encodeURIComponent(name)}`,
            );
          } catch {
            return { name, n_frames: "?", n_reps_in_reference: "?" };
          }
        }),
      );
      setMotions(details);
      setReference((cur) => cur || (details[0] ? details[0].name : ""));
    } catch {}
  }, []);

  const refreshRecordState = useCallback(async () => {
    if (Date.now() < suppressRecordUntil.current) return;
    try {
      const p = await fetchJson<RecordState>("/record/state");
      setRecordState(p);
      if (p.active) {
        setCompareState(null);
        setRecordName((cur) => p.motion_name || cur);
        setRecordOrder((cur) => p.bezier_order ?? cur);
        if (p.mode) setRecordMode(p.mode);
      }
    } catch (e: any) {
      setRecordState({
        active: false,
        motion_name: null,
        frames_count: 0,
        elapsed_seconds: 0,
        last_frame: null,
        signals: emptySignals,
        status_text: e.message,
        reps_detected: 0,
      });
    }
  }, []);

  const refreshCompareState = useCallback(async () => {
    if (Date.now() < suppressCompareUntil.current) return;
    try {
      const p = await fetchJson<CompareState>("/compare/state");
      setCompareState(p);
      if (p.active) {
        setRecordState(null);
        setReference((cur) => p.reference_name || cur);
        setCompareOrder((cur) => p.bezier_order ?? cur);
      }
    } catch (e: any) {
      setCompareState({
        active: false,
        reference_name: null,
        bezier_order: null,
        frames_count: 0,
        elapsed_seconds: 0,
        reps_detected: 0,
        current_rep_progress: 0,
        last_rep_curve_distance: 0,
        last_rep_amplitude_diff: 0,
        score: 0,
        direction_ok: true,
        direction_hint: "",
        feedback: e.message,
        live_signals: emptySignals,
        reference_signals: emptySignals,
        completed_reps: [],
        last_frame: null,
      });
    }
  }, []);

  usePoll(refreshLinkStatus, 1000);
  usePoll(refreshBattery, 2000);
  usePoll(refreshMotions, 5000);
  usePoll(refreshRecordState, 400);
  usePoll(refreshCompareState, 400);

  const refreshAll = useCallback(() => {
    refreshLinkStatus().catch(() => {});
    refreshBattery().catch(() => {});
    refreshMotions().catch(() => {});
    refreshRecordState().catch(() => {});
    refreshCompareState().catch(() => {});
  }, [
    refreshCompareState,
    refreshLinkStatus,
    refreshBattery,
    refreshMotions,
    refreshRecordState,
  ]);

  const hasCompare = !!(compareState && compareState.active);
  const hasRecord = !!(recordState && recordState.active);

  async function startRecording() {
    const motion_name = recordName.trim();
    if (!motion_name) {
      alert("Enter a motion name.");
      return;
    }
    await fetchJson("/record/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motion_name, mode: recordMode }), 
    });
    suppressRecordUntil.current = Date.now() + 300;
    setCompareState(null);
    setRecordState({
      active: true,
      motion_name,
      bezier_order: recordOrder,
      mode: recordMode,
      frames_count: 0,
      elapsed_seconds: 0,
      last_frame: null,
      signals: emptySignals,
      status_text: "Recording…",
      reps_detected: 0,
    });
  }

  async function stopRecording() {
    const p = await fetchJson<{
      motion_name: string;
      reps_detected: number;
      n_frames: number;
    }>(`/record/stop?bezier_order=${encodeURIComponent(recordOrder)}`, {
      method: "POST",
    });
    suppressRecordUntil.current = Date.now() + 300;
    setRecordState(null);
    await refreshMotions();
    // alert(
    //   `Saved as ${p.motion_name}. ${p.reps_detected} reps from ${p.n_frames} frames.`,
    // );
  }

  async function startComparison() {
    if (!reference) {
      alert("Choose a saved motion.");
      return;
    }
    await fetchJson("/compare/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference_name: reference,
        bezier_order: compareOrder,
      }),
    });
    suppressCompareUntil.current = Date.now() + 300;
    setRecordState(null);
    setCompareState({
      active: true,
      reference_name: reference,
      bezier_order: compareOrder,
      frames_count: 0,
      elapsed_seconds: 0,
      reps_detected: 0,
      current_rep_progress: 0,
      last_rep_curve_distance: 0,
      last_rep_amplitude_diff: 0,
      direction_ok: true,
      direction_hint: "",
      live_signals: emptySignals,
      reference_signals: emptySignals,
      completed_reps: [],
      score: 0,
      feedback: "Comparison started…",
      last_frame: null,
    });
  }

  async function stopComparison() {
    const p = await fetchJson<{ overall_feedback?: string }>("/compare/stop", {
      method: "POST",
    });
    suppressCompareUntil.current = Date.now() + 300;
    setCompareState(null);
    // alert(p.overall_feedback || "Comparison stopped.");
  }

  async function deleteMotion(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    await fetchJson(`/motions/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    await refreshMotions();
  }

  const mode: "idle" | "recording" | "comparing" = hasCompare
    ? "comparing"
    : hasRecord
      ? "recording"
      : "idle";
  const modeLabel = {
    idle: "Idle",
    recording: "Recording",
    comparing: "Comparing",
  }[mode];
  const modeColor = { idle: "#71717a", recording: ORANGE, comparing: BLUE }[
    mode
  ];

  const sess = hasCompare ? compareState : recordState;
  const frames = sess ? (sess.frames_count ?? 0) : 0;
  const reps = hasCompare
    ? (compareState!.reps_detected ?? 0)
    : hasRecord
      ? (recordState!.reps_detected ?? 0)
      : 0;
  const refLabel = hasCompare
    ? compareState!.reference_name || "none"
    : hasRecord
      ? recordState!.motion_name || "none"
      : "none";
  const elapsed = sess ? `${(sess.elapsed_seconds ?? 0).toFixed(1)}s` : "0.0s";

  // Update UI to reflect whether we are in single or dual mode based on active session
  const activeModeTag = hasCompare
    ? compareState!.mode
    : hasRecord
      ? recordState!.mode
      : recordMode;

  const refText = hasCompare
    ? `Ref: ${refLabel}`
    : hasRecord
      ? `Rec: ${refLabel}`
      : "No reference";

  const chartTitle = hasCompare
    ? "Comparison stream"
    : hasRecord
      ? "Recording stream"
      : "Signal preview";
  const liveSignals = hasCompare
    ? compareState!.live_signals
    : hasRecord
      ? recordState!.signals
      : emptySignals;
  const referenceSignals = hasCompare ? compareState!.reference_signals : null;

  const feedback = hasCompare
    ? compareState!.feedback || "Waiting…"
    : hasRecord
      ? recordState!.status_text || "Recording…"
      : "Choose a motion, start recording, then compare live frames against it.";

  const completedReps = hasCompare ? compareState!.completed_reps || [] : [];
  const currentRepLabel = hasCompare
    ? `Rep ${completedReps.length + 1} (${Math.round((compareState!.current_rep_progress || 0) * 100)}%)`
    : hasRecord
      ? "Recording"
      : "—";

  const mainStatus = hasCompare
    ? "Comparing live reps"
    : hasRecord
      ? "Recording a baseline"
      : "Ready to start";

const [battery, setBattery] = useState<BatteryStatus>({
  available: false,
  voltage: null,
  percent: null,
  stale: true,
  last_update: null,
});
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0c] text-zinc-100 suppressHydrationWarning">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge
                className="border-0 text-white hover:opacity-90"
                style={{ backgroundColor: BLUE }}
              >
                Twyst Motion Studio
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                  Motion dashboard
                </h1>
                <p className="max-w-3xl text-sm text-zinc-400 sm:text-base">
                  Record a reference motion, stream incoming frames, and compare
                  each repetition in real time.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                  <button
                    disabled={hasRecord || hasCompare}
                    onClick={() => setRecordMode("single")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      recordMode === "single"
                        ? "bg-zinc-700 text-zinc-100 shadow"
                        : "text-zinc-400 hover:text-zinc-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Single-Band
                  </button>
                  <button
                    disabled={hasRecord || hasCompare}
                    onClick={() => setRecordMode("dual")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      recordMode === "dual"
                        ? "bg-zinc-700 text-zinc-100 shadow"
                        : "text-zinc-400 hover:text-zinc-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Dual-Band
                  </button>
                </div>

                <Button
                  onClick={refreshAll}
                  className="border-0 text-white hover:opacity-90 h-[36px]"
                  style={{ backgroundColor: BLUE }}
                >
                  Refresh all
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <a
                  href="/home"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-300 shadow-sm transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Home
                </a>
                <a
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-300 shadow-sm transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  href={`${API_BASE}/docs`}
                  target="_blank"
                  rel="noreferrer"
                >
                  API docs ↗
                </a>
                <a
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-300 shadow-sm transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  href={`${API_BASE}/health`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Health
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-5 bg-zinc-800" />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-800 bg-zinc-900/60 shadow-none">
              <CardHeader className="pb-3">
                <CardDescription className="text-zinc-500">
                  Session status
                </CardDescription>
                <CardTitle className="flex items-center gap-2 text-xl text-zinc-100">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: modeColor }}
                  />
                  {modeLabel}
                  <Badge
                    variant="outline"
                    className="ml-2 bg-zinc-800 text-zinc-300 border-zinc-700 font-normal"
                  >
                    {activeModeTag === "dual" ? "Dual-Band" : "Single-Band"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-zinc-500">
                {mainStatus}
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/60 shadow-none">
              <CardHeader className="pb-3">
                <CardDescription className="text-zinc-500">
                  Stream counts
                </CardDescription>
                <CardTitle className="text-xl text-zinc-100">
                  {frames} frame{frames === 1 ? "" : "s"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-zinc-500">
                {reps} rep{reps === 1 ? "" : "s"} tracked so far
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/60 shadow-none">
              <CardHeader className="pb-3">
                <CardDescription className="text-zinc-500">
                  Reference motion
                </CardDescription>
                <CardTitle className="text-xl text-zinc-100">
                  {refLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-zinc-500">
                {hasCompare
                  ? "Comparison is using the selected reference."
                  : hasRecord
                    ? "Recording will update the active reference."
                    : refText}
              </CardContent>
            </Card>
          </div>
        </div>

        <BandCard link={link} />

        <Card className="border-zinc-800 bg-zinc-900/60 shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="text-zinc-500">
              Secondary band battery
            </CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl text-zinc-100">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: !battery.available
                    ? "#71717a"
                    : (battery.percent ?? 0) < 20
                      ? "#EF4444"
                      : (battery.percent ?? 0) < 40
                        ? ORANGE
                        : "#22C55E",
                }}
              />
              {battery.available && battery.percent !== null
                ? `${Math.round(battery.percent)}%`
                : "Unavailable"}
              {battery.available && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-zinc-800 text-zinc-300 border-zinc-700 font-normal"
                >
                  {battery.voltage?.toFixed(2)}V
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-zinc-500">
            {!battery.available
              ? "No battery telemetry — check divider wiring or board config."
              : battery.stale
                ? "Reading is stale — no recent frames."
                : "Live reading from the secondary band."}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <LinkDiagram link={link} />

            <div className="grid gap-6 lg:grid-cols-2">
              <RecordPanel
                name={recordName}
                setName={setRecordName}
                order={recordOrder}
                setOrder={setRecordOrder}
                active={hasRecord}
                onStart={() => startRecording().catch((e) => alert(e.message))}
                onStop={() => stopRecording().catch((e) => alert(e.message))}
                onRefresh={() => refreshRecordState().catch(() => {})}
              />
              <ComparePanel
                motions={motions}
                reference={reference}
                setReference={setReference}
                order={compareOrder}
                setOrder={setCompareOrder}
                signal={signal}
                setSignal={setSignal}
                active={hasCompare}
                canStart={!!reference}
                onStart={() => startComparison().catch((e) => alert(e.message))}
                onStop={() => stopComparison().catch((e) => alert(e.message))}
                onRefresh={() => refreshCompareState().catch(() => {})}
              />
            </div>

            <LiveChart
              title={chartTitle}
              signal={signal}
              liveSignals={liveSignals}
              referenceSignals={referenceSignals}
              hasRef={hasCompare}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <SessionSnapshot
                session={{
                  session:
                    mode === "comparing"
                      ? "compare"
                      : mode === "recording"
                        ? "record"
                        : "idle",
                  frames,
                  reference: refLabel,
                  reps,
                  elapsed,
                  status: hasCompare
                    ? "Active"
                    : hasRecord
                      ? "Recording"
                      : "Idle",
                }}
                frame={
                  hasCompare
                    ? compareState!.last_frame
                    : hasRecord
                      ? recordState!.last_frame
                      : null
                }
              />
              <RepLog reps={completedReps} />
            </div>

            <MotionLibrary
              motions={motions}
              onUse={(name) => setReference(name)}
              onDelete={deleteMotion}
              onReload={() => refreshMotions().catch(() => {})}
            />
          </div>

          <Sidebar
            score={hasCompare ? compareState!.score || 0 : 0}
            completedCount={hasCompare ? completedReps.length : 0}
            currentRepLabel={currentRepLabel}
            curve={hasCompare ? compareState!.last_rep_curve_distance : null}
            amplitude={
              hasCompare ? compareState!.last_rep_amplitude_diff : null
            }
            progress={hasCompare ? compareState!.current_rep_progress : 0}
            feedback={feedback}
            reps={completedReps}
            activeProgress={hasCompare ? compareState!.current_rep_progress : 0}
            hasActive={hasCompare}
          />
        </div>

        <div className="pb-2 text-center text-xs text-zinc-500">
          Compare mode keeps the ESP32 bridge streaming while this page stays
          open.
        </div>
      </div>
    </div>
  );
}
