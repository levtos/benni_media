import { useEffect, useMemo, useState } from "react";
import { Card, EmptyState, Icon, Pill, SegmentedButton } from "../components";
import { applyReapplyNow, cancelReapply, getApplyStatus, getMatrix, scheduleReapply, setMatrix, setScalars } from "../api";
import type { ApplyData, HassLike, MatrixData, StateData } from "../types";
import { titleCase } from "../format";

const DAY_LABELS: Record<string, string> = {
  early_morning: "Früher Morgen", forenoon: "Vormittag", midday: "Mittag",
  afternoon: "Nachmittag", late_afternoon: "Später Nachmittag", evening: "Abend",
  late_evening: "Später Abend", early_night: "Frühe Nacht", late_night: "Späte Nacht",
  late_morning: "Später Morgen", early_evening: "Früher Abend",
};
const ACTIVITY_LABELS: Record<string, string> = { idle: "Inaktiv", free_time: "Freizeit", work_home: "Arbeit zuhause", work_away: "Arbeit außer Haus", household: "Haushalt" };
const ACTIVITIES = ["idle", "free_time", "work_home", "work_away", "household"];
const DEVICES = ["homepods", "denon"] as const;
type Device = typeof DEVICES[number];
type VolumeDimension = "base" | "scenario_off" | "activity_off" | "phase_max";
type Dimension = VolumeDimension | "boost_allowed";
type MatrixCell = number | boolean | null;
type Tab = "matrix" | "gaming" | "safety" | "delays";
type MatrixPatch = Partial<Record<Dimension, Partial<Record<Device, Record<string, MatrixCell>>>>>;
type SaveStatus = "idle" | "saving" | "saved" | "error";

const PRIVATE_DIAGNOSTICS: Record<string, string> = {
  "auto_blocked:denon_off": "Automatischer Eintritt blockiert: Denon ist ausgeschaltet.",
};

function privateDiagnostic(reason?: string | null) {
  if (!reason) return "Kein aktiver oder blockierter Grund";
  return PRIVATE_DIAGNOSTICS[reason] || reason;
}

function Help({ text }: { text: string }) {
  return <span className="rule-help" title={text} aria-label={text}><Icon.Info size={15} /></span>;
}

function PercentInput({ value, offset = false, overridden, disabled, resetToken = 0, onDraft, onClear, label }: { value?: number; offset?: boolean; overridden?: boolean; disabled?: boolean; resetToken?: number; onDraft?: (value: number | undefined) => void; onClear?: () => void; label?: string }) {
  const displayed = value == null ? "" : String(onClear ? Math.round(value * 1000) / 10 : Math.round(value * 100));
  const [draft, setDraft] = useState(displayed);
  useEffect(() => {
    const sync = window.setTimeout(() => setDraft(displayed), 0);
    return () => window.clearTimeout(sync);
  }, [displayed, resetToken]);
  const change = (raw: string) => {
    setDraft(raw);
    if (disabled || !onDraft) return;
    if (raw === "" && onClear) { onClear(); return; }
    const parsed = Number(raw);
    const valid = raw.trim() !== "" && Number.isFinite(parsed) && parsed >= (offset ? -100 : 0) && parsed <= 100;
    onDraft(valid ? (onClear ? Math.round(parsed * 10) / 1000 : parsed / 100) : undefined);
  };
  return <label className={`percent-input ${overridden ? "overridden" : ""} ${disabled ? "readonly" : ""}`} title={offset ? "Offset in Prozentpunkten" : "Lautstärke in Prozent"}>
    <input aria-label={label ?? (offset ? "Prozentpunkte" : "Prozent")} type="number" value={draft} min={offset ? -100 : 0} max={100} step={onClear ? 0.1 : undefined} placeholder={onClear ? "Global" : undefined} disabled={disabled} onChange={(event) => change(event.target.value)} />
    <span>{offset ? "Pkt." : "%"}</span>
  </label>;
}

function ReadValue({ value, unit = "", missing }: { value?: number | string | boolean | null; unit?: string; missing?: string }) {
  if (value == null) return <span className="contract-missing" title={missing || "Dieser Wert fehlt im aktuellen Umbrella-Contract."}>Contract fehlt</span>;
  const shown = typeof value === "boolean" ? (value ? "Ja" : "Nein") : value;
  return <strong className="read-value">{shown}{unit}</strong>;
}

function ResetButton({ label, supported = true, onReset }: { label: string; supported?: boolean; onReset?: () => void }) {
  const missing = "Der Backend-Contract kann diesen Abschnitt noch nicht auf gespeicherte Defaults zurücksetzen.";
  return <button className="button section-reset" disabled={!supported} title={supported ? `${label} auf Backend-Defaults zurücksetzen` : missing} onClick={onReset}>
    <Icon.RefreshCw size={14} /> Zurücksetzen
  </button>;
}

function SectionHeader({ index, title, sub, unit, help, resetSupported = true, onReset, showDevices = true }: { index: number; title: string; sub: string; unit?: string; help: string; resetSupported?: boolean; onReset?: () => void; showDevices?: boolean }) {
  return <div className="rule-title"><span>{index}</span><div><h2>{title} <Help text={help} /></h2><p>{sub}</p></div><div className="rule-title-actions">{unit && <Pill tone="violet">{unit}</Pill>}<ResetButton label={title} supported={resetSupported} onReset={onReset} /></div>{showDevices && <div className="rule-device-head"><b>HomePods</b><b>Denon</b></div>}</div>;
}

function MatrixRows({ matrix, dimension, rows, labels, offset, resetToken, onDraft }: { matrix: MatrixData; dimension: VolumeDimension; rows: string[]; labels: Record<string, string>; offset?: boolean; resetToken: number; onDraft: (device: Device, key: string, value: number | undefined) => void }) {
  return <div className="rule-table">{rows.map((row) => <div className="rule-row" key={row}><span>{labels[row] || matrix.catalog.scenario_labels[row] || titleCase(row)}</span>{DEVICES.map((device) => <PercentInput key={device} offset={offset} resetToken={resetToken} value={matrix[dimension]?.[device]?.[row] ?? 0} overridden={matrix.override?.[dimension]?.[device]?.[row] !== undefined} onDraft={(value) => onDraft(device, row, value)} />)}</div>)}</div>;
}

export function RulesPage({ matrix: backendMatrix, apply = {}, state = {}, hass, onMatrix, onDirtyChange }: { matrix?: MatrixData; apply?: ApplyData; state?: StateData; hass: HassLike; onMatrix: (matrix: MatrixData) => void; onDirtyChange?: (dirty: boolean) => void }) {
  const [tab, setTab] = useState<Tab>("matrix");
  const [matrix, setDraftMatrix] = useState<MatrixData | undefined>(backendMatrix);
  const [matrixPatch, setMatrixPatch] = useState<MatrixPatch>({});
  const [scalarPatch, setScalarPatch] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [resetToken, setResetToken] = useState(0);
  const [reapply, setReapply] = useState<ApplyData["reapply"]>(apply.reapply);
  const matrixDirtyCount = Object.values(matrixPatch).reduce((dimensions, devices) => dimensions + Object.values(devices || {}).reduce((sum, values) => sum + Object.keys(values || {}).length, 0), 0);
  const dirtyCount = matrixDirtyCount + Object.keys(scalarPatch).length + invalidFields.size;
  const dirty = dirtyCount > 0;
  const scenarios = useMemo(() => matrix?.catalog.scenarios.filter((item) => !["gaming", "private", "private_time"].includes(item)) || [], [matrix]);
  useEffect(() => {
    if (dirty) return;
    const sync = window.setTimeout(() => setDraftMatrix(backendMatrix), 0);
    return () => window.clearTimeout(sync);
  }, [backendMatrix, dirty]);
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (!dirty) return; event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    let stopped = false;
    const refresh = async () => {
      try {
        const status = await getApplyStatus(hass) as ApplyData;
        if (!stopped) setReapply(status.reapply);
      } catch { /* Der normale Modul-Health zeigt Backend-Ausfälle. */ }
    };
    void refresh();
    const timer = window.setInterval(() => { if (reapply?.pending) void refresh(); }, 1000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [hass, reapply?.pending]);
  if (!matrix) return <Card><EmptyState icon={Icon.SlidersHorizontal} title="Regel-Contract nicht verfügbar" text="benni_media_policy/get_matrix konnte nicht geladen werden. Es wird nichts lokal gespeichert." /></Card>;

  const stageCell = (dimension: Dimension, device: Device, key: string, value: MatrixCell) => {
    setSaveStatus("idle"); setSaveError("");
    setMatrixPatch((current) => {
      const next = structuredClone(current);
      const original = backendMatrix?.[dimension]?.[device]?.[key];
      const originalOverride = backendMatrix?.override?.[dimension]?.[device]?.[key];
      const unchanged = value === null ? originalOverride === undefined : original === value;
      if (unchanged) {
        delete next[dimension]?.[device]?.[key];
        if (next[dimension]?.[device] && Object.keys(next[dimension]![device]!).length === 0) delete next[dimension]![device];
        if (next[dimension] && Object.keys(next[dimension]!).length === 0) delete next[dimension];
      } else {
        next[dimension] ||= {}; next[dimension]![device] ||= {}; next[dimension]![device]![key] = value;
      }
      return next;
    });
    setDraftMatrix((current) => {
      const next = structuredClone(current!);
      if (dimension === "boost_allowed") {
        if (typeof value === "boolean") next.boost_allowed![device][key] = value;
      } else if (typeof value === "number") {
        next[dimension]![device][key] = value;
      } else if (dimension === "phase_max") {
        delete next.phase_max![device][key];
      }
      return next;
    });
  };
  const stageCellDraft = (dimension: Dimension, device: Device, key: string, value: MatrixCell | undefined) => {
    const field = `${dimension}.${device}.${key}`;
    setInvalidFields((current) => { const next = new Set(current); if (value === undefined) next.add(field); else next.delete(field); return next; });
    if (value !== undefined) stageCell(dimension, device, key, value);
    else { setSaveStatus("idle"); setSaveError(""); }
  };
  const stageScalar = (key: string, value: number) => {
    setSaveStatus("idle"); setSaveError("");
    setScalarPatch((current) => { const next = { ...current }; if (backendMatrix?.scalars[key] === value) delete next[key]; else next[key] = value; return next; });
    setDraftMatrix((current) => { const next = structuredClone(current!); next.scalars[key] = value; return next; });
  };
  const stageScalarDraft = (key: string, value: number | undefined) => {
    const field = `scalar.${key}`;
    setInvalidFields((current) => { const next = new Set(current); if (value === undefined) next.add(field); else next.delete(field); return next; });
    if (value !== undefined) stageScalar(key, value);
    else { setSaveStatus("idle"); setSaveError(""); }
  };
  const discard = () => {
    setMatrixPatch({}); setScalarPatch({}); setInvalidFields(new Set());
    setDraftMatrix(backendMatrix); setSaveStatus("idle"); setSaveError("");
    setResetToken((current) => current + 1);
  };
  const resetCells = (label: string, dimension: Dimension, rows: string[]) => {
    if (!window.confirm(`${label} zurücksetzen? Es werden nur die gespeicherten Overrides dieses Abschnitts gelöscht; andere Regeln bleiben unverändert.`)) return;
    DEVICES.forEach((device) => {
      const keys = dimension === "base" ? Object.keys(backendMatrix?.override?.base?.[device] || {}) : rows;
      keys.forEach((row) => stageCell(dimension, device, row, null));
    });
  };
  const resetAllMatrix = () => {
    if (!window.confirm("Matrixwerte auf Standard zurücksetzen? Betroffen sind Tagesphasen-Basis, Phasen-Maxima und Boost-Freigaben sowie Szenario-Offsets einschließlich Gaming Normal und Activity-Offsets. Fensterwerte, Grind-Offsets, Private-Time-Cap, Quiet/Ducking, Boost-Höhe, globale Maxima sowie Apply-Optionen und Delays bleiben unverändert. Der Reset wird erst mit „Änderungen speichern“ persistiert.")) return;
    (["base", "scenario_off", "activity_off", "phase_max", "boost_allowed"] as Dimension[]).forEach((dimension) => DEVICES.forEach((device) => Object.keys(backendMatrix?.override?.[dimension]?.[device] || {}).forEach((key) => stageCell(dimension, device, key, null))));
  };
  const persist = async () => {
    if (!dirty || invalidFields.size || saveStatus === "saving") return;
    setSaveStatus("saving"); setSaveError("");
    let matrixSaved = false; let scalarsSaved = false;
    try {
      setReapply((await scheduleReapply(hass, 30) as ApplyData).reapply);
      if (Object.keys(matrixPatch).length) { await setMatrix(hass, matrixPatch as Record<string, unknown>); matrixSaved = true; }
      if (Object.keys(scalarPatch).length) { await setScalars(hass, scalarPatch); scalarsSaved = true; }
      const loaded = await getMatrix(hass);
      for (const dimension of Object.keys(matrixPatch) as Dimension[]) for (const device of DEVICES) for (const [key, expected] of Object.entries(matrixPatch[dimension]?.[device] || {})) {
        const actual = expected === null ? loaded.override?.[dimension]?.[device]?.[key] : loaded[dimension]?.[device]?.[key];
        if (expected === null ? actual !== undefined : actual !== expected) throw new Error(`${dimension}.${device}.${key} wurde vom Backend nicht bestätigt.`);
      }
      for (const [key, expected] of Object.entries(scalarPatch)) if (loaded.scalars[key] !== expected) throw new Error(`Skalar ${key} wurde vom Backend nicht bestätigt.`);
      setMatrixPatch({}); setScalarPatch({}); setInvalidFields(new Set()); setDraftMatrix(loaded); onMatrix(loaded); setSaveStatus("saved");
    } catch (reason) {
      try { setReapply((await cancelReapply(hass) as ApplyData).reapply); } catch { /* Primärfehler bewahren. */ }
      const partial = [matrixSaved && "Matrixwerte gespeichert", scalarsSaved && "Skalare gespeichert"].filter(Boolean).join("; ");
      setSaveError(`${partial ? `${partial}; ` : ""}${reason instanceof Error ? reason.message : String(reason)}`); setSaveStatus("error");
    }
  };
  const hasPhaseSettings = matrix.phase_max != null && matrix.boost_allowed != null;
  const scalar = (key: string) => matrix.scalars[key];
  const privateSource = state.private_time_active ? (state.private_source === "automatic" ? "Automatischer Pfad aktiv" : state.private_source === "manual" ? "Manueller Pfad aktiv" : "Private Time aktiv") : "Kein Pfad aktiv";
  const saveBar = <div className={`rules-save-bar ${saveStatus}`} role="status" aria-live="polite">
    <div>
      <b>{saveStatus === "saving" ? "Änderungen werden gespeichert …" : saveStatus === "saved" ? "Änderungen gespeichert" : saveStatus === "error" ? "Speichern fehlgeschlagen" : dirty ? "Ungespeicherte Änderungen" : "Keine ungespeicherten Änderungen"}</b>
      {saveStatus === "error" && <span>{saveError}</span>}
      {dirty && saveStatus !== "error" && <span>{dirtyCount} geänderte {dirtyCount === 1 ? "Einstellung" : "Einstellungen"}{invalidFields.size ? ` · ${invalidFields.size} ungültig` : ""}</span>}
      {reapply?.pending && <span>Neue Ziele werden in {Math.ceil(Number(reapply.remaining_s || 0))} s mit aktuellem Medienkontext angewendet.</span>}
    </div>
    <div className="rules-save-actions">
      {reapply?.pending && <><button className="button" onClick={() => void applyReapplyNow(hass).then((status: ApplyData) => setReapply(status.reapply))}><Icon.Play size={16} /> Jetzt anwenden</button><button className="button" onClick={() => void cancelReapply(hass).then((status: ApplyData) => setReapply(status.reapply))}>Anwendung abbrechen</button></>}
      <button className="button" disabled={!dirty || saveStatus === "saving"} onClick={discard}>Änderungen verwerfen</button>
      <button className="button primary" disabled={!dirty || invalidFields.size > 0 || saveStatus === "saving"} onClick={() => void persist()}><Icon.Save size={17} /> Änderungen speichern</button>
    </div>
  </div>;

  return <div className={`rules-page ${saveStatus === "saving" ? "busy" : ""}`}>
    <div className="rules-tabs">
      <SegmentedButton active={tab === "matrix"} onClick={() => setTab("matrix")} icon={Icon.SlidersHorizontal}>Matrix</SegmentedButton>
      <SegmentedButton active={tab === "gaming"} onClick={() => setTab("gaming")} icon={Icon.Gamepad2}>Gaming-Modi</SegmentedButton>
      <SegmentedButton active={tab === "safety"} onClick={() => setTab("safety")} icon={Icon.ShieldCheck}>Caps & Private Time</SegmentedButton>
      <SegmentedButton active={tab === "delays"} onClick={() => setTab("delays")} icon={Icon.Activity}>Delays, Sleep & Waking</SegmentedButton>
      <span />
      <button className="button danger" title="Merkt das Löschen der Matrix-Overrides vor; gespeichert wird erst über den Save-Button." onClick={resetAllMatrix}><Icon.RefreshCw size={17} />Matrixwerte auf Standard zurücksetzen</button>
    </div>
    <p className="reset-explainer"><Icon.Info size={14} /> Der globale Reset löscht nur den Policy-Matrix-Store. Skalare und Apply-Optionen besitzen im aktuellen Contract keinen Reset-Endpunkt.</p>
    {saveBar}

    {tab === "matrix" && <>
      <Card className="rule-section">
        <SectionHeader index={1} title="Basiswerte je Tagesphase" sub={hasPhaseSettings ? "Leere Maximalfelder übernehmen das globale Geräte-Maximum." : "Grundlautstärke je Tagesphase und Gerät"} unit="Prozent" help="Der niedrigere Wert aus Phasen-Maximum und globalem Maximum begrenzt das Ziel. Titel-Boost gilt nur für HomePods." onReset={() => resetCells("Tagesphasen-Basis", "base", matrix.catalog.dayphases)} showDevices={!hasPhaseSettings} />
        {hasPhaseSettings ? <div className="phase-rules">
          <table>
            <thead><tr><th scope="col">Tagesphase</th><th scope="col">HomePods</th><th scope="col">Denon</th><th scope="col">Max HomePods</th><th scope="col">Max Denon</th><th scope="col">Titel-Boost</th></tr></thead>
            <tbody>{matrix.catalog.dayphases.map((phase) => {
              const label = DAY_LABELS[phase] || titleCase(phase);
              return <tr key={phase}>
                <th scope="row">{label}</th>
                {DEVICES.map((device) => <td key={device}><PercentInput resetToken={resetToken} value={matrix.base[device]?.[phase]} overridden={matrix.override?.base?.[device]?.[phase] !== undefined} label={`${label} ${device === "homepods" ? "HomePods" : "Denon"}`} onDraft={(value) => stageCellDraft("base", device, phase, value)} /></td>)}
                {DEVICES.map((device) => <td key={device}><PercentInput resetToken={resetToken} value={matrix.phase_max?.[device]?.[phase]} overridden={matrix.override?.phase_max?.[device]?.[phase] !== undefined} label={`${label} Max ${device === "homepods" ? "HomePods" : "Denon"}`} onDraft={(value) => stageCellDraft("phase_max", device, phase, value)} onClear={() => stageCellDraft("phase_max", device, phase, null)} /></td>)}
                <td><label className="phase-boost">
                  <input type="checkbox" aria-label={`${label} Titel-Boost`} checked={matrix.boost_allowed?.homepods?.[phase] === true} onChange={(event) => stageCell("boost_allowed", "homepods", phase, event.target.checked)} />
                </label></td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <MatrixRows matrix={matrix} dimension="base" rows={matrix.catalog.dayphases} labels={DAY_LABELS} resetToken={resetToken} onDraft={(device, key, value) => stageCellDraft("base", device, key, value)} />}
      </Card>
      <Card className="rule-section"><SectionHeader index={2} title="Fenster" sub="Geschlossen ohne Abzug; gekippt und offen verwenden denselben Wert" unit="Prozentpunkte" help="Der Öffnungs-Master unterscheidet geschlossen, gekippt und offen. Die Policy wendet für gekippt und offen bewusst denselben gerätespezifischen Offset an." resetSupported={false} />
        <div className="rule-table"><div className="rule-row"><span>Geschlossen <Pill tone="green">fest 0</Pill></span>{DEVICES.map((device) => <PercentInput key={device} value={0} offset disabled />)}</div><div className="rule-row"><span>Gekippt <Pill tone="orange">additiv</Pill></span><PercentInput resetToken={resetToken} value={scalar("opening_offset_homepods")} offset onDraft={(value) => stageScalarDraft("opening_offset_homepods", value)} /><PercentInput resetToken={resetToken} value={scalar("opening_offset_denon")} offset onDraft={(value) => stageScalarDraft("opening_offset_denon", value)} /></div><div className="rule-row"><span>Offen <Pill tone="violet">wie gekippt</Pill></span><PercentInput value={scalar("opening_offset_homepods")} offset disabled /><PercentInput value={scalar("opening_offset_denon")} offset disabled /></div></div>
      </Card>
      <Card className="rule-section"><SectionHeader index={3} title="Szenario-Offsets" sub="Allgemeine additive Offsets; Gaming und Private Time sind separat modelliert" unit="Prozentpunkte" help="Private Time ist kein normaler Szenario-Offset. Gaming besitzt eigene Modusregeln und wird deshalb im nächsten Reiter dargestellt." onReset={() => resetCells("Szenario-Offsets", "scenario_off", scenarios)} /><MatrixRows matrix={matrix} dimension="scenario_off" rows={scenarios} labels={{}} offset resetToken={resetToken} onDraft={(device, key, value) => stageCellDraft("scenario_off", device, key, value)} /></Card>
      <Card className="rule-section"><SectionHeader index={4} title="Activity-Offsets" sub="Vollständiger Activity-Katalog aus dem Lastenheft" unit="Prozentpunkte" help="Der Backend-Store akzeptiert offene Activity-Keys. Die UX zeigt deshalb auch idle, free_time und household, obwohl der aktuelle Katalog-Endpunkt nur die beiden Work-Werte listet." onReset={() => resetCells("Activity-Offsets", "activity_off", ACTIVITIES)} /><MatrixRows matrix={matrix} dimension="activity_off" rows={ACTIVITIES} labels={ACTIVITY_LABELS} offset resetToken={resetToken} onDraft={(device, key, value) => stageCellDraft("activity_off", device, key, value)} /></Card>
    </>}

    {tab === "gaming" && <div className="mode-stack">
      <Card className="rule-section"><SectionHeader index={1} title="Gaming Normal" sub="Allgemeiner Gaming-Szenario-Offset je Gerät" unit="Prozentpunkte" help="Diese beiden Matrixzellen bilden den Normal-Modus. Sie werden auch als Grundanteil im Grind-Modus berücksichtigt." onReset={() => resetCells("Gaming Normal", "scenario_off", ["gaming"])} /><div className="rule-table"><div className="rule-row"><span>Gaming Normal <Pill tone="cyan">Normal</Pill></span>{DEVICES.map((device) => <PercentInput key={device} resetToken={resetToken} offset value={matrix.scenario_off?.[device]?.gaming ?? 0} overridden={matrix.override?.scenario_off?.[device]?.gaming !== undefined} onDraft={(value) => stageCellDraft("scenario_off", device, "gaming", value)} />)}</div></div></Card>
      <Card className="rule-section"><SectionHeader index={2} title="Gaming Grind" sub="Zusätzliche Grind-Offsets; HomePods dominant, Denon als Kulisse" unit="Prozentpunkte" help="Berechnung: Gaming-Normal-Offset plus Grind-Offset. Der Subwoofer-Block ist eine feste R16-Regel und kein gewöhnlicher Offset." resetSupported={false} /><div className="rule-table"><div className="rule-row"><span>Zusätzlicher Grind-Offset <Pill tone="pink">Grind</Pill></span><PercentInput resetToken={resetToken} offset value={scalar("grind_homepods_offset")} onDraft={(value) => stageScalarDraft("grind_homepods_offset", value)} /><PercentInput resetToken={resetToken} offset value={scalar("grind_denon_offset")} onDraft={(value) => stageScalarDraft("grind_denon_offset", value)} /></div><div className="rule-row hard-rule"><span>Subwoofer <Pill tone="orange">Hard-Override</Pill></span><strong className="span-devices">Immer gesperrt · nicht editierbar</strong></div></div></Card>
      <Card className="rule-section"><SectionHeader index={3} title="Gaming Headset" sub="Definierter Classifier-Modus: Das Headset trägt den Spielton" help="Der Title Classifier liefert gaming_headset (Enum 2). Die feste Headset-Regel sperrt den Subwoofer; auf dem PC bleibt Raum-Musik erhalten und der Denon aus. Lediglich ein editierbarer Geräte-Offset-Contract ist noch nicht implementiert." resetSupported={false} /><div className="fixed-rule-grid"><div><Pill tone="cyan">Classifier 2</Pill><b>Spielton über Headset</b><span>Der definierte Modus ist <code>gaming_headset</code>.</span></div><div><Pill tone="orange">Hard-Override</Pill><b>Subwoofer gesperrt</b><span>Gilt, sobald <code>headset_active</code> gesetzt ist.</span></div><div><Pill tone="orange">Umsetzungslücke</Pill><b>Kein editierbarer Geräte-Offset</b><span>Das Feld bleibt read-only, bis ein persistenter Backend-Contract existiert.</span></div></div></Card>
    </div>}

    {tab === "safety" && <div className="safety-grid">
      <Card className="private-card" title="Private Time" action={<ResetButton label="Private Time" supported={false} />}><div className="private-paths"><div><Pill tone="violet">Automatisch</Pill><b>Classifier + PC + Denon</b><span>Alle drei Bedingungen müssen gleichzeitig aktiv sein.</span></div><div><Pill tone="cyan">Manuell</Pill><b>Schalter + PC</b><span>Headset-Pfad ohne Denon und ohne Classifier; schaltet Denon nie ein.</span></div></div><div className="hard-rule-banner"><Icon.LockKeyhole size={18} /><div><b>HomePods bleiben aus</b><span>Beide Private-Time-Pfade übersteuern die normale Matrix. Private Time startet niemals eine Wake-Sequenz.</span></div></div><div className="private-values"><div><span>Denon-Cap</span><PercentInput resetToken={resetToken} value={scalar("private_denon_cap")} onDraft={(value) => stageScalarDraft("private_denon_cap", value)} /></div><div><span>Exit-Delay</span><ReadValue value={apply.private_exit?.delay_s} unit=" s" missing="Apply besitzt die Option private_exit_delay_seconds, veröffentlicht den aktuellen Wert aber nicht im Status." /></div><div><span>Aktiver Pfad</span><strong>{privateSource}</strong></div><div><span>Diagnose</span><strong>{privateDiagnostic(state.private_reason || state.private_blocked_reason)}</strong></div></div></Card>
      <Card title="Quiet, Boost & Mute" action={<ResetButton label="Quiet, Boost & Mute" supported={false} />}><div className="scalar-list detailed"><div><span>Quiet / Ducking <small>gemeinsamer Contract für beide Geräte</small></span><PercentInput resetToken={resetToken} value={scalar("ducked_target")} onDraft={(value) => stageScalarDraft("ducked_target", value)} /></div><div><span>Track Boost <small>nur HomePods</small></span><PercentInput resetToken={resetToken} offset value={scalar("boost_offset")} onDraft={(value) => stageScalarDraft("boost_offset", value)} /></div></div><div className="rule-notes"><p><Pill tone="orange">Hard-Override</Pill> Quiet setzt aktive Ausgaben direkt auf das Ducking-Ziel innerhalb der wirksamen Geräteobergrenze.</p><p><Pill tone="violet">Boost-Block</Pill> Blockiert bei Arbeit zuhause, Arbeit außer Haus, Quiet Mode und fehlender Phasenfreigabe.</p><p><Pill tone="orange">Hard-Mute</Pill> HomePods-Classifier „Stumm“ setzt die HomePods unabhängig von der Matrix auf 0.</p><p className="contract-warning">Der Contract hat nur einen gemeinsamen Ducking-Wert. Getrennte HomePods-/Denon-Werte fehlen.</p></div></Card>
      <Card title="Caps & Grenzen" action={<ResetButton label="Caps & Grenzen" supported={false} />}><div className="device-scalar-head"><b>HomePods</b><b>Denon</b></div><div className="paired-values"><span>Maximalpegel</span><PercentInput resetToken={resetToken} value={scalar("homepods_max")} onDraft={(value) => stageScalarDraft("homepods_max", value)} /><PercentInput resetToken={resetToken} value={scalar("denon_max")} onDraft={(value) => stageScalarDraft("denon_max", value)} /><span>Aktiv-Mindestpegel</span><PercentInput resetToken={resetToken} value={scalar("active_min")} onDraft={(value) => stageScalarDraft("active_min", value)} /><PercentInput value={scalar("active_min")} disabled /></div><p className="muted-copy">Der Mindestpegel ist ein gemeinsamer Policy-Wert. Caps greifen nach additiver Matrix und Nudge; Hard-Overrides bleiben dominant.</p></Card>
    </div>}

    {tab === "delays" && <div className="delay-grid">
      <Card title="Sleep" action={<ResetButton label="Sleep" supported={false} />}><div className="key-values rule-values"><span>HomePods im Sleep<b><Pill tone="orange">Aus · Hard-Override</Pill></b></span><span>Denon-Sleep-Ziel<ReadValue missing="R25 fordert einen eigenen Denon-Sleep-Zielwert; Policy-Property und Berechnung fehlen." /></span><span>TV automatisch aus<ReadValue value={apply.sleep_tv?.delay_s} unit=" s" /></span><span>Warn-Vorlauf<ReadValue value={apply.sleep_tv?.warn_lead_s} unit=" s" /></span></div></Card>
      <Card title="Denon-Nachlauf & Private Exit" action={<ResetButton label="Nachlauf & Private Exit" supported={false} />}><div className="key-values rule-values"><span>Nachlauf PC<ReadValue missing="Option denon_nachlauf_pc_seconds existiert, wird aber im Apply-Status nicht als konfigurierter Wert veröffentlicht." /></span><span>Nachlauf TV<ReadValue missing="Option denon_nachlauf_tv_seconds existiert, wird aber im Apply-Status nicht als konfigurierter Wert veröffentlicht." /></span><span>Private-Time-Exit<ReadValue value={apply.private_exit?.delay_s} unit=" s" missing="Option private_exit_delay_seconds existiert, wird aber im Apply-Status nicht veröffentlicht." /></span><span>Timer aktuell aktiv<ReadValue value={Boolean(apply.nachlauf?.active)} /></span></div></Card>
      <Card title="HomePods-Ramp" action={<ResetButton label="HomePods-Ramp" supported={false} />}><div className="key-values rule-values"><span>Ramp-Schritte<ReadValue value={apply.settings?.ramp_steps} /></span><span>Ramp-Intervall<ReadValue value={apply.settings?.ramp_step_delay_s} unit=" s" /></span><span>Tiny Delta<ReadValue value={apply.settings?.tiny_delta != null ? `${Math.round(Number(apply.settings.tiny_delta) * 100)} %` : null} /></span><span>Ramp aktuell<ReadValue value={Boolean(apply.ramp_active)} /></span></div></Card>
      <Card className="waking-card" title="Waking" action={<ResetButton label="Waking" supported={false} />}><div className="waking-formula"><span>Tagesphasen-Basis HomePods</span><b>+</b><span className="missing-field">Waking-Offset: Contract fehlt</span><b>=</b><span>Ergebnis auf 0–100 % begrenzen</span></div><p>Der neue Offset gilt ausschließlich für HomePods bei <code>bio_state=waking</code>. Denon bleibt unberührt. Die Startlautstärke der Wake-Rampe ist davon getrennt.</p><div className="key-values rule-values"><span>Benötigte Property<b><code>waking_homepods_offset</code></b></span><span>Wake-Startlautstärke<ReadValue value={apply.wake?.start_volume != null ? `${Math.round(Number(apply.wake.start_volume) * 100)} %` : null} /></span><span>Wake-Debounce<ReadValue value={apply.wake?.debounce_s} unit=" s" /></span></div><div className="contract-warning">Das Eingabefeld bleibt deaktiviert, bis Policy-Persistenz, `get_matrix.scalars`, `set_scalars` und die Berechnung nach der Tagesphasen-Basis vorhanden sind.</div></Card>
      <Card><EmptyState icon={Icon.LockKeyhole} title="Apply-Werte nur lesbar" text="Apply-Delays, Sleep und Wake sind im Options-Flow konfigurierbar, besitzen aber keine persistente Umbrella-Schreib- oder Reset-API. Fehlende Snapshot-Werte werden nicht durch Defaults vorgetäuscht." /></Card>
    </div>}
  </div>;
}
