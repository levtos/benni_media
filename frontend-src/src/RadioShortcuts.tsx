import { useEffect, useRef, useState } from "react";
import { dispatchAction } from "./api";
import { Icon } from "./components";
import type { HassLike } from "./types";

type Provider = "radiobrowser" | "tunein";
type Station = { key: string; name: string; sources: Partial<Record<Provider, string>>; playing?: Provider };
const providers: Array<{ key: Provider; label: string }> = [
  { key: "radiobrowser", label: "Radio Browser" }, { key: "tunein", label: "TuneIn" }
];

// Only group Apply's published variants; never construct a station URI here.
function stationsFrom(rows: unknown[]): Station[] {
  const stations = new Map<string, Station>();
  for (const value of rows) {
    if (!value || typeof value !== "object") continue;
    const row = value as Record<string, unknown>;
    if (typeof row.key !== "string" || !row.key.trim() || typeof row.name !== "string" || !row.name.trim()) continue;
    const station: Station = stations.get(row.key) || { key: row.key, name: row.name.replace(/ \(TuneIn\)$/, ""), sources: {} };
    stations.set(row.key, station);
    if ((row.provider === "radiobrowser" || row.provider === "tunein") && typeof row.uri === "string") {
      const valid = row.provider === "radiobrowser" ? /^radiobrowser:\/\/radio\/[^\s]+$/.test(row.uri) : /^tunein(?:--[^\s:/]+)?:\/\/radio\/[^\s]+$/.test(row.uri);
      if (valid) {
        station.sources[row.provider] = row.uri;
        if (row.playing === true) station.playing = row.provider;
      }
    }
  }
  return [...stations.values()];
}

export function RadioShortcuts({ hass, onChanged }: { hass: HassLike; onChanged: () => void }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [pending, setPending] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);
  useEffect(() => {
    let active = true;
    void dispatchAction(hass, "apply", "radio_shortcuts").then((response) => {
      if (response?.ok !== true || !Array.isArray(response.result?.results)) throw new Error("Invalid shortcuts response");
      if (active) { setStations(stationsFrom(response.result.results)); setLoadError(false); setLoading(false); }
    }).catch(() => { if (active) { setStations([]); setLoadError(true); setLoading(false); } });
    return () => { active = false; };
  }, [hass, attempt]);
  const play = async (uri: string) => {
    if (busy.current) return;
    busy.current = true; setPending(uri); setPlayError(false);
    try {
      const response = await dispatchAction(hass, "apply", "play_radio", { media_id: uri });
      if (response?.ok !== true || response.result?.ok === false) throw new Error("Radio command failed");
      onChanged();
    } catch { setPlayError(true); }
    finally { busy.current = false; setPending(undefined); }
  };
  return <div className="radio-shortcuts">
    {loading && <p role="status">Sender werden geladen …</p>}
    {loadError && <div role="alert">Sender konnten nicht geladen werden. <button onClick={() => { setLoading(true); setLoadError(false); setAttempt(attempt + 1); }}>Erneut laden</button></div>}
    {!loading && !loadError && !stations.length && <p>Keine Radiosender verfügbar.</p>}
    {playError && <p role="alert">Der Start ist fehlgeschlagen. Prüfe die Wiedergabediagnose oder wähle die andere Quelle.</p>}
    <div className="radio-station-grid">{stations.map((station) => <div className="radio-station" role="group" aria-label={station.name} key={station.key}>
      <b><Icon.Radio size={17} />{station.name}</b>
      <div className="radio-provider-buttons">{providers.map((provider) => {
        const uri = station.sources[provider.key];
        return <button key={provider.key} disabled={!uri || Boolean(pending)} onClick={() => uri && void play(uri)} aria-label={`${station.name}: ${provider.label}`} title={uri ? `Über ${provider.label} abspielen` : `${provider.label} nicht verfügbar`}>
          {pending === uri && uri ? "Start wird angefordert …" : provider.label}{station.playing === provider.key && <small>Live</small>}{!uri && <small>Nicht verfügbar</small>}
        </button>;
      })}</div>
    </div>)}</div>
  </div>;
}
