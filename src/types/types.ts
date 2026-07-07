export interface LinkStatus {
  secondary_connected: boolean;
  main_connected: boolean;
  state: string;
  stale: boolean;
  last_update: number | null;
  error?: boolean;
}

export interface MotionInfo {
  name: string;
  bezier_order?: number;
  n_reps_in_reference?: number | string;
  n_frames?: number | string;
  state_dim?: number;
  ref_amplitude?: number;
  dominant_axis?: string;
  recorded_at?: number;
}

export interface FrameData {
  acc_x: number;
  acc_y: number;
  acc_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  roll: number;
  pitch: number;
  yaw: number;
  timestamp?: number;
}

export type SignalKey =
  | "roll" | "pitch" | "yaw"
  | "acc_x" | "acc_y" | "acc_z"
  | "gyro_x" | "gyro_y" | "gyro_z"
  | "acc_mag" | "gyro_mag";

export type Signals = Partial<Record<SignalKey, number[]>>;

export interface RecordState {
  active: boolean;
  motion_name: string | null;
  frames_count: number;
  elapsed_seconds: number;
  last_frame: FrameData | null;
  signals: Signals;
  status_text: string;
  reps_detected: number;
  bezier_order?: number;
}

export interface CompletedRep {
  rep: number;
  d_curve: number;
  delta_A: number;
  score: number;
  direction_ok: boolean;
  direction_hint: string;
  feedback: string;
}

export interface CompareState {
  active: boolean;
  reference_name: string | null;
  bezier_order: number | null;
  frames_count: number;
  elapsed_seconds: number;
  reps_detected: number;
  current_rep_progress: number;
  last_rep_curve_distance: number;
  last_rep_amplitude_diff: number;
  score: number;
  direction_ok: boolean;
  direction_hint: string;
  feedback: string;
  live_signals: Signals;
  reference_signals: Signals;
  completed_reps: CompletedRep[];
  last_frame: FrameData | null;
}

export const SIGNAL_KEYS: SignalKey[] = [
  "roll", "pitch", "yaw",
  "acc_x", "acc_y", "acc_z",
  "gyro_x", "gyro_y", "gyro_z",
  "acc_mag", "gyro_mag",
];
