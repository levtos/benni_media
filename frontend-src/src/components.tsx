import { useState, type ComponentType, type ReactNode } from "react";
import {
  Activity, AlertTriangle, Apple, AudioLines, BellRing, ChevronRight, CircleGauge, CloudSun, Gamepad2,
  Headphones, Heart, House, Info, LayoutDashboard, Lightbulb, ListMusic, LockKeyhole, Menu, Monitor,
  Moon, Music2, Pause, Play, Radio, RefreshCw, Save, Search, Settings2, ShieldCheck, SlidersHorizontal,
  Sparkles, Speaker, SunMedium, Tv, Volume2, WandSparkles, X
} from "lucide-react";
import type { DeviceState, FormulaPart, ModuleHealth, PageId } from "./types";
import { pct, points, stateLabel, titleCase } from "./format";
import { resolveArtworkUrl, safeArtworkSource, type ArtworkCandidate } from "./artwork";

export const Icon = { Activity, AlertTriangle, Apple, AudioLines, BellRing, ChevronRight, CircleGauge, CloudSun, Gamepad2, Headphones, Heart, House, Info, LayoutDashboard, Lightbulb, ListMusic, LockKeyhole, Menu, Monitor, Moon, Music2, Pause, Play, Radio, RefreshCw, Save, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Speaker, SunMedium, Tv, Volume2, WandSparkles, X };

export function Card({ children, className = "", title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return <section className={`card ${className}`}>
    {(title || action) && <div className="card-head">{title && <h2>{title}</h2>}{action}</div>}{children}
  </section>;
}

export function EmptyState({ icon: EmptyIcon = Info, title, text, compact = false }: { icon?: ComponentType<{ size?: number }>; title: string; text: string; compact?: boolean }) {
  return <div className={`empty ${compact ? "compact" : ""}`}><EmptyIcon size={compact ? 18 : 28} /><div><strong>{title}</strong><p>{text}</p></div></div>;
}

export function StatusDot({ health }: { health?: ModuleHealth }) {
  const tone = health?.healthy ? "good" : health?.available ? "warn" : "bad";
  return <span className={`status-dot ${tone}`} title={health?.error || (health?.healthy ? "Healthy" : "Nicht verfügbar")} />;
}

const deviceIcons: Record<string, ComponentType<{ size?: number }>> = { tv: Tv, apple_tv: Apple, ps5: Gamepad2, switch: Gamepad2, pc: Monitor, homepods: Speaker, denon: AudioLines, subwoofer: Volume2 };
const deviceNames: Record<string, string> = { tv: "TV", apple_tv: "Apple TV", ps5: "PlayStation 5", switch: "Nintendo Switch", pc: "PC", homepods: "HomePods", denon: "Denon AVR-X1400H", subwoofer: "Subwoofer" };

export function DeviceStatusGrid({ devices = {} }: { devices?: Record<string, DeviceState> }) {
  const entries = Object.entries(devices).filter(([, d]) => !d.ignored);
  if (!entries.length) return <EmptyState compact title="Keine Gerätedaten" text="Media State liefert aktuell keine Geräte-Matrix." />;
  return <div className="device-grid">{entries.map(([key, dev]) => {
    const DeviceIcon = deviceIcons[key] || Monitor;
    return <div className={`device-tile ${dev.active ? "active" : ""}`} key={key}>
      <DeviceIcon size={22} /><div><span>{deviceNames[key] || titleCase(key)}</span><strong>{stateLabel(dev.state)}{dev.volume != null ? ` · ${pct(dev.volume)}` : ""}</strong></div>
    </div>;
  })}</div>;
}

type ArtworkProps = { src?: string; candidates?: ArtworkCandidate[]; kind: "music" | "gaming" | "tv"; title?: string };

export function Artwork(props: ArtworkProps) {
  // Retry a new track/candidate set, never just because of a render tick.
  return <ArtworkAttempt key={JSON.stringify([props.title, props.src, props.candidates])} {...props} />;
}

function ArtworkAttempt({ src, candidates = [], kind, title }: ArtworkProps) {
  const Placeholder = kind === "music" ? Music2 : kind === "gaming" ? Gamepad2 : Tv;
  const sources = [...new Set([src, ...candidates.map((item) => item.url)].filter((item): item is string => Boolean(item)))];
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState<string>();
  const resolved = sources.map((value) => ({ source: safeArtworkSource(candidates.find((item) => item.url === value)?.source || "artwork_url"), ...resolveArtworkUrl(value, window.location.origin) }));
  const current = resolved.find((item) => item.url && !failed.has(item.url));
  const status = current ? loaded === current.url ? "ready" : "loading" : "unavailable";
  const diagnostics = resolved.map((item) => `${item.source}: ${item.reason || (failed.has(item.url!) ? "load_failed" : item === current ? status : "pending")} (${item.kind})`).join("; ") || "missing";
  return <div className={`artwork ${kind}`} aria-label={title ? `Artwork für ${title}` : "Artwork nicht verfügbar"}
    data-artwork-source={current?.source || "none"} data-artwork-state={status} title={diagnostics}>
    {current?.url ? <img key={current.url} src={current.url} alt="" referrerPolicy="no-referrer" onLoad={() => setLoaded(current.url)} onError={() => setFailed((value) => new Set(value).add(current.url!))} /> : <><Placeholder size={38} /><span>Artwork nicht verfügbar</span></>}
  </div>;
}

export function ActiveMediaCard({ kind, eyebrow, title, subtitle, detail, device, volume, artwork, artworkCandidates, badges, active = true, controls }: {
  kind: "music" | "gaming" | "tv"; eyebrow: string; title: string; subtitle?: string; detail?: string; device?: string; volume?: number; artwork?: string; artworkCandidates?: Array<{ url: string; source: string }>; badges?: ReactNode; active?: boolean; controls?: ReactNode;
}) {
  return <Card className={`media-card ${kind} ${active ? "active" : ""}`}>
    <div className="media-card-main"><Artwork src={artwork} candidates={artworkCandidates} kind={kind} title={title} /><div className="media-copy">
      <span className="eyebrow">{kind === "music" ? <Music2 /> : kind === "gaming" ? <Gamepad2 /> : <Tv />}{eyebrow}</span>
      <h3>{title}</h3>{subtitle && <p>{subtitle}</p>}{badges && <div className="effect-badges">{badges}</div>}{detail && <span className="session-detail">{detail}</span>}
    </div></div>
    {(device || volume != null || controls) && <div className="output-row"><Speaker size={19} /><div><span>{device || "Ausgabegerät"}</span><strong>{active ? "Aktiv" : "Bereit"}</strong></div><b>{pct(volume)}</b>{controls}</div>}
  </Card>;
}

const formulaItems: Array<[keyof FormulaPart, string]> = [
  ["base", "Basis"], ["scenario_offset", "Szenario / Grind"], ["window_offset", "Fenster"],
  ["activity_offset", "Activity"], ["manual_nudge", "Nudge"], ["track_boost", "Boost"], ["cap_override", "Cap / Override"]
];

export function VolumeBreakdown({ name, data, accent = "cyan" }: { name: string; data?: FormulaPart; accent?: "pink" | "cyan" }) {
  if (!data) return <Card title={name}><EmptyState compact title="Keine Formeldaten" text="Media Policy liefert für dieses Gerät noch keinen Breakdown." /></Card>;
  const active = formulaItems.filter(([key]) => data[key] != null);
  const expression = active.map(([key, label], index) => {
    const value = Number(data[key] || 0);
    return <span key={key} className={value < 0 ? "negative" : value > 0 && index ? "positive" : ""}>{index === 0 ? `${Math.round(value * 100)} % ${label}` : `${Math.abs(Math.round(value * 100))} ${label}`}</span>;
  });
  return <Card className={`volume-breakdown ${accent}`} title={name}>
    <div className="formula-compact">{expression}<strong>= {pct(data.result)}</strong></div>
    <div className="formula-grid">
      {formulaItems.map(([key, label]) => { const value = typeof data[key] === "number" ? data[key] as number : undefined; return <div key={key}><span>{label}</span><b>{key === "base" ? pct(value) : points(value)}</b></div>; })}
      {data.effective_max != null && <div><span>Wirksame Obergrenze</span><b>{new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 }).format(data.effective_max)}</b></div>}
      {data.track_boost_effective != null && data.track_boost !== data.track_boost_effective && <div><span>Wirksamer Boost</span><b>{points(data.track_boost_effective)}</b></div>}
    </div>
    <div className="volume-meter"><i style={{ width: `${Math.max(0, Math.min(100, Number(data.result || 0) * 100))}%` }} /></div>
  </Card>;
}

export function ReasonPanel({ reasons = [], activeReasons = [], compact = false }: { reasons?: Array<{ text: string; severity?: string }>; activeReasons?: string[]; compact?: boolean }) {
  const normalized = reasons.length ? reasons : activeReasons.map((text) => ({ text: humanReason(text), severity: text.includes("unavailable") ? "warn" : "ok" }));
  return <Card className={compact ? "reason compact" : "reason"} title="Warum so?">
    {normalized.length ? <div className="reason-list">{normalized.slice(0, compact ? 5 : 10).map((r, index) => <div key={`${r.text}-${index}`} className={`reason-item ${r.severity || "ok"}`}>
      {r.severity === "warn" ? <AlertTriangle size={17} /> : index === 0 ? <Sparkles size={17} /> : <ChevronRight size={17} />}<span>{humanReason(r.text)}</span>
    </div>)}</div> : <EmptyState compact title="Keine aktiven Gründe" text="Die Decision Engine meldet derzeit keinen Why-Stack." />}
  </Card>;
}

export function humanReason(raw: string) {
  const exact: Record<string, string> = {
    "scenario:gaming": "Benni spielt gerade.", "grind": "Grind-Modus ist aktiv.", "audio:homepods": "Musik läuft über die HomePods.",
    "window:tilted": "Fenster gekippt, Lautstärke reduziert.", "audio_only_idle": "Musik läuft, ohne ein Bildschirm-Szenario zu aktivieren.",
    "private:manual:switch+pc": "Private Time wurde manuell aktiviert.", "away_gate": "Niemand ist zuhause; Medien bleiben aus."
  };
  if (exact[raw]) return exact[raw];
  return raw.replaceAll("_", " ").replaceAll(":", " · ").replace(/\bps5\b/gi, "PlayStation 5").replace(/\bhomepods\b/gi, "HomePods").replace(/^./, (m) => m.toUpperCase());
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "pink" | "cyan" | "orange" | "violet" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export const pageInfo: Record<PageId, { label: string; sub: string; icon: ComponentType<{ size?: number }> }> = {
  overview: { label: "Übersicht", sub: "Aktueller Medienstatus und Steuerung", icon: LayoutDashboard },
  music: { label: "Musik", sub: "Wiedergabe, Radios und Bibliothek", icon: Music2 },
  gaming: { label: "Gaming", sub: "Spiel, Modus und Audio-Routing", icon: Gamepad2 },
  tv: { label: "TV & Streaming", sub: "Quelle, Geräte und aktuelle Entscheidung", icon: Tv },
  rules: { label: "Regeln", sub: "Persistierte Volume-Matrix und Sicherheitswerte", icon: SlidersHorizontal },
  diagnostics: { label: "Diagnose", sub: "State, Policy, Apply, Bindings und Raw JSON", icon: Settings2 }
};

export function SegmentedButton({ active, onClick, icon: ButtonIcon, children, disabled, title }: { active?: boolean; onClick?: () => void; icon?: ComponentType<{ size?: number }>; children: ReactNode; disabled?: boolean; title?: string }) {
  return <button className={`button ${active ? "active" : ""}`} onClick={onClick} disabled={disabled} title={title}>{ButtonIcon && <ButtonIcon size={17} />}{children}</button>;
}
