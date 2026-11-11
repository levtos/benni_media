import { RadioShortcuts } from "../RadioShortcuts";
import { ActiveMediaCard, Card, DeviceStatusGrid, EmptyState, Icon, Pill, ReasonPanel, SegmentedButton, VolumeBreakdown } from "../components";
import type { ApplyData, HassLike, OverviewData, PolicyData, StateData } from "../types";
import { dispatchAction } from "../api";
import { pct, stateLabel, time, titleCase } from "../format";

export function OverviewPage({ data, hass, onChanged }: { data?: OverviewData; hass: HassLike; onChanged: () => void }) {
  const state: StateData = data?.raw?.state || {};
  const policy: PolicyData = data?.raw?.policy || {};
  const apply: ApplyData = data?.raw?.apply || {};
  const devices = data?.devices || state.devices || {};
  const music = data?.now_playing || state.now_playing;
  const isGaming = state.context === "gaming" || data?.scenario === "gaming" || Boolean(state.gaming_platform);
  const gameDevice = devices.ps5?.active ? devices.ps5 : devices.pc?.active ? devices.pc : undefined;
  const gameTitle = gameDevice?.title || "Aktive Gaming-Session";
  const mediaContext = state.context || data?.scenario || "";
  const isTv = ["tv", "streaming"].includes(mediaContext);
  const tv = devices.tv; const atv = devices.apple_tv; const tvSource = atv?.app || atv?.source || tv?.source || state.subcontext;
  const tvTitle = atv?.title || tv?.title || tvSource || "TV aktiv";
  const musicClassifier = state.classifiers?.homepods;
  const boostRequested = musicClassifier?.label === "boost";
  const boostBlocked = boostRequested && !policy.track_boost_applied;
  const boostBlockReason = state.quiet_mode ? "Quiet Mode blockiert den Boost" : ["work_home", "work_away"].includes(String(state.activity_context || state.context_cards?.activity)) ? "Arbeitsmodus blockiert den Boost" : "Boost ist durch die aktuelle Regel gesperrt";
  const run = async (module: "state" | "policy" | "apply", action: string, params: Record<string, unknown> = {}) => { await dispatchAction(hass, module, action, params); onChanged(); };
  return <>
    <div className="section-heading"><h2>Aktive Medien</h2><Pill tone="green">{[Boolean(music), isGaming, isTv].filter(Boolean).length || 0} aktiv</Pill></div>
    <div className="overview-hero">
      <div className="session-grid">
        {music ? <ActiveMediaCard kind="music" eyebrow="Musik" title={music.title || "Unbekannter Titel"} subtitle={music.artist} detail="Musik läuft über die HomePods" device="HomePods" volume={music.volume ?? devices.homepods?.volume} artwork={music.artwork_url} artworkCandidates={music.artwork_candidates || devices.homepods?.artwork_candidates} badges={<>{policy.track_boost_applied && <Pill tone="pink">Track-Boost aktiv</Pill>}{policy.music_muted && <Pill tone="orange">Classifier-Mute</Pill>}{boostBlocked && <Pill tone="orange">Boost blockiert</Pill>}</>} controls={<SegmentedButton disabled title="Play/Pause benötigt einen additiven Backend-Contract" icon={Icon.Pause}>Pause</SegmentedButton>} /> : <Card><EmptyState icon={Icon.Music2} title="Keine Musik-Session" text="Sobald die HomePods spielen, erscheint die Session hier." /></Card>}
        {isGaming ? <ActiveMediaCard kind="gaming" eyebrow="Gaming" title={state.classifiers?.[state.gaming_platform || "ps5"]?.display_name || gameTitle} subtitle={titleCase(state.gaming_platform || data?.gaming_platform || data?.gaming_source)} detail={policy.is_grind ? "Grind-Modus aktiv" : state.headset_active ? "Headset-Modus aktiv" : titleCase(state.subcontext)} device={devices.denon?.active ? "Denon AVR-X1400H" : "Gaming-Audio"} volume={policy.volume_target_denon ?? data?.targets?.denon_volume} artwork={gameDevice?.artwork_url || state.classifiers?.[state.gaming_platform || "ps5"]?.artwork_url} artworkCandidates={gameDevice?.artwork_candidates} badges={<>{policy.is_grind && <Pill tone="pink">Grind</Pill>}{state.headset_active && <Pill tone="cyan">Headset</Pill>}{state.private_time_active && <Pill tone="violet">Private Time</Pill>}</>} /> : <Card><EmptyState icon={Icon.Gamepad2} title="Keine Gaming-Session" text="PlayStation- oder PC-Gaming wird parallel zur Musik eingeblendet." /></Card>}
        {isTv && <ActiveMediaCard kind="tv" eyebrow={mediaContext === "streaming" ? "Streaming" : "TV"} title={tvTitle} subtitle={tvSource ? `Quelle · ${tvSource}` : undefined} detail={policy.audio_scenario_detail || titleCase(state.subcontext)} artwork={atv?.artwork_url || tv?.artwork_url} artworkCandidates={mediaContext === "streaming" ? atv?.artwork_candidates : tv?.artwork_candidates} device="Denon AVR-X1400H" volume={policy.volume_target_denon ?? data?.targets?.denon_volume} />}
      </div>
      <ReasonPanel compact reasons={policy.reasons} activeReasons={data?.active_reasons || state.active_reasons} />
    </div>
    {(policy.track_boost_applied || policy.music_muted || policy.is_grind || state.headset_active || state.private_time_active || boostBlocked) && <Card className="effects-hero" title="Aktive Sonderregeln"><div className="effect-badges">{policy.track_boost_applied && <Pill tone="pink">Track-Boost aktiv</Pill>}{policy.music_muted && <Pill tone="orange">HomePods stumm</Pill>}{policy.is_grind && <Pill tone="pink">Grind-Modus</Pill>}{state.headset_active && <Pill tone="cyan">Headset-Modus</Pill>}{state.private_time_active && <Pill tone="violet">Private Time</Pill>}{boostBlocked && <Pill tone="orange">{boostBlockReason}</Pill>}</div></Card>}
    <div className="dashboard-grid volumes"><VolumeBreakdown name="HomePods" data={policy.volume_formula?.homepods} accent="pink" /><VolumeBreakdown name="Denon AVR-X1400H" data={policy.volume_formula?.denon} accent="cyan" /></div>
    <div className="dashboard-grid lower">
      <Card className="quick-control" title="Schnellsteuerung">
        <div className="button-row"><SegmentedButton icon={Icon.Volume2} onClick={() => void run("policy", "nudge_volume", { delta: -0.05 })}>− 5 %</SegmentedButton><SegmentedButton icon={Icon.RefreshCw} onClick={() => void run("policy", "reset_nudge")}>Nudge Reset</SegmentedButton><SegmentedButton icon={Icon.Volume2} onClick={() => void run("policy", "nudge_volume", { delta: 0.05 })}>+ 5 %</SegmentedButton><SegmentedButton active={data?.audio_owner === "private"} icon={Icon.Headphones} onClick={() => void run("state", "toggle_private")}>Private Time</SegmentedButton><SegmentedButton disabled={!policy.nudge?.boost_active} icon={Icon.WandSparkles} onClick={() => void run("policy", "reset_boost")}>Boost Reset</SegmentedButton></div>
        <h3>Radio-Schnellwahl</h3><RadioShortcuts hass={hass} onChanged={onChanged} />
      </Card>
      <Card title="Geräte-Status"><DeviceStatusGrid devices={devices} /></Card>
      <Card title="Letzte Aktionen"><div className="action-log">{(apply.log || []).slice(0, 6).map((entry, index) => <div key={`${entry.ts}-${index}`}><time>{time(entry.ts)}</time><Icon.Activity size={16} /><span>{titleCase(entry.action)}{entry.denon_target != null ? ` · Denon ${pct(entry.denon_target)}` : ""}{entry.homepods_target != null ? ` · HomePods ${pct(entry.homepods_target)}` : ""}</span><Pill tone={entry.executed ? "green" : "orange"}>{entry.executed ? "live" : "shadow"}</Pill></div>)}{!apply.log?.length && <EmptyState compact title="Noch keine Aktionen" text="Apply-Aktionen erscheinen nach dem nächsten relevanten Wechsel." />}</div></Card>
    </div>
    <div className="decision-strip"><div><span>Szenario</span><strong>{data?.overview_audio_scenario_label || data?.audio_scenario_label || titleCase(data?.scenario)}</strong></div><div><span>Modus</span><strong>{policy.is_grind ? "Grind-Modus" : titleCase(data?.volume_policy)}</strong></div><div><span>Audio-Routing</span><strong>{titleCase(data?.audio_owner)}</strong></div><div><span>HomePods</span><strong>{stateLabel(devices.homepods?.state)} · {pct(data?.targets?.homepods_volume)}</strong></div></div>
  </>;
}
