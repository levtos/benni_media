export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export interface HassLike {
  callWS<T = any>(message: Record<string, unknown>): Promise<T>;
}

export interface ModuleHealth {
  available: boolean;
  healthy: boolean;
  updated_at?: string | null;
  error?: string | null;
}

export interface Envelope<T = any> {
  contract: string;
  ok: boolean;
  updated_at: string;
  stale: boolean;
  errors: Array<{ module: string; error: string }>;
  warnings: unknown[];
  modules: Record<string, ModuleHealth>;
  data: T;
}

export interface DeviceState {
  active?: boolean;
  configured?: boolean;
  state?: string;
  icon?: string;
  title?: string;
  artist?: string;
  source?: string;
  app?: string;
  volume?: number;
  power_on?: boolean;
  ignored?: boolean;
  artwork_url?: string;
  artwork_candidates?: Array<{ url: string; source: string }>;
}

export interface FormulaPart {
  base?: number;
  scenario_offset?: number;
  window_offset?: number;
  activity_offset?: number;
  manual_nudge?: number;
  track_boost?: number;
  track_boost_effective?: number;
  effective_max?: number;
  cap_override?: number | null;
  result?: number;
  plays?: boolean;
}

export interface PolicyData {
  audio_owner?: string;
  audio_scenario?: string;
  audio_scenario_label?: string;
  audio_scenario_detail?: string;
  action?: string;
  volume_policy?: string;
  volume_target_homepods?: number;
  volume_target_denon?: number;
  subwoofer_allowed?: boolean;
  volume_apply_allowed?: boolean;
  quiet_mode?: boolean;
  is_grind?: boolean;
  music_muted?: boolean;
  track_boost_applied?: boolean;
  volume_formula?: { homepods?: FormulaPart; denon?: FormulaPart };
  reasons?: Array<{ severity?: string; text: string }>;
  nudge?: { manual_nudge?: number; min?: number; max?: number; boost_active?: boolean; boost_suppressed?: boolean };
  bindings?: Record<string, unknown>;
  [key: string]: any;
}

export interface StateData {
  context?: string;
  media_scenario?: string;
  subcontext?: string;
  device?: string;
  gaming_source?: string;
  gaming_platform?: string;
  entertainment_active?: boolean;
  quiet_mode?: boolean;
  headset_active?: boolean;
  active_reasons?: string[];
  now_playing?: DeviceState | null;
  devices?: Record<string, DeviceState>;
  classifiers?: Record<string, { enum?: number | null; label?: string | null; display_name?: string; original_title?: string; platform?: string; artwork_url?: string; entry_id?: string }>;
  context_cards?: Record<string, unknown>;
  activity_context?: string;
  bindings?: Record<string, unknown>;
  [key: string]: any;
}

export interface ApplyData {
  apply_enabled?: boolean;
  execute?: boolean;
  ramp_active?: boolean;
  ramp_step?: number;
  ramp_total?: number;
  debounce?: { window_s?: number; pending?: boolean; remaining_s?: number | null; plan?: Record<string, any> | null };
  reapply?: { pending?: boolean; delay_s?: number; remaining_s?: number | null; reason?: string | null };
  plan?: Record<string, any>;
  log?: Array<{ ts?: string; action?: string; homepods_target?: number; denon_target?: number; subwoofer_set?: boolean; quiet?: boolean; executed?: boolean }>;
  gates?: Record<string, any>;
  policy?: Record<string, any>;
  devices?: Record<string, DeviceState>;
  nachlauf?: Record<string, any>;
  sleep_tv?: Record<string, any>;
  wake?: Record<string, any>;
  settings?: Record<string, number>;
  radio?: { defaults?: Array<{ key?: string; name: string; uri: string; image?: string; playing?: boolean }>; autostart_enabled?: boolean; ready?: boolean; resume_pending?: boolean };
  bindings?: Record<string, unknown>;
  [key: string]: any;
}

export interface OverviewData {
  scenario?: string;
  subcontext?: string;
  device?: string;
  overview_device?: string;
  gaming_source?: string;
  gaming_platform?: string;
  audio_owner?: string;
  audio_scenario?: string;
  audio_scenario_label?: string;
  audio_scenario_detail?: string;
  overview_audio_scenario_label?: string;
  overview_audio_scenario_detail?: string;
  action?: string;
  volume_policy?: string;
  apply_enabled?: boolean;
  execute?: boolean;
  quiet_mode?: boolean;
  entertainment_active?: boolean;
  headset_active?: boolean;
  now_playing?: DeviceState | null;
  devices?: Record<string, DeviceState>;
  active_reasons?: string[];
  targets?: { homepods_volume?: number; denon_volume?: number; subwoofer_allowed?: boolean };
  raw?: { state?: StateData; policy?: PolicyData; apply?: ApplyData };
}

export interface MatrixData {
  catalog: { dayphases: string[]; scenarios: string[]; scenario_labels: Record<string, string>; activities: string[]; devices: string[] };
  base: Record<string, Record<string, number>>;
  scenario_off: Record<string, Record<string, number>>;
  activity_off: Record<string, Record<string, number>>;
  phase_max?: Record<string, Record<string, number>>;
  boost_allowed?: Record<string, Record<string, boolean>>;
  scalars: Record<string, number>;
  override: Record<string, Record<string, Record<string, number | boolean>>>;
}

export type PageId = "overview" | "music" | "gaming" | "tv" | "rules" | "diagnostics";

export interface CockpitData {
  overview?: Envelope<OverviewData>;
  state?: Envelope<StateData>;
  policy?: Envelope<PolicyData>;
  apply?: Envelope<ApplyData>;
  diagnostics?: Envelope<any>;
  matrix?: MatrixData;
}
