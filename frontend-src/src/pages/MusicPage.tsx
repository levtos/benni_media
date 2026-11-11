import { useState } from "react";
import { ActiveMediaCard, Card, DeviceStatusGrid, EmptyState, Icon, Pill, SegmentedButton } from "../components";
import { dispatchAction } from "../api";
import type { ApplyData, HassLike, PolicyData, StateData } from "../types";
import { pct } from "../format";
import { RadioShortcuts } from "../RadioShortcuts";

export function MusicPage({ state = {}, policy = {}, hass, onChanged }: { state?: StateData; policy?: PolicyData; apply?: ApplyData; hass: HassLike; onChanged: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ name: string; uri: string; image?: string; favorite?: boolean }>>([]);
  const [searching, setSearching] = useState(false);
  const now = state.now_playing;
  const play = async (uri: string) => { await dispatchAction(hass, "apply", "play_radio", { media_id: uri }); onChanged(); };
  const search = async () => { if (!query.trim()) return; setSearching(true); try { const res: any = await dispatchAction(hass, "apply", "search_radio", { query }); setResults(res?.result?.results || []); } finally { setSearching(false); } };
  const librarySections = ["Zuletzt gespielt", "Favoriten", "Playlists", "Kürzlich hinzugefügt"];
  return <div className="music-layout">
    <div className="music-main">
      <div className="now-playing-wide">{now ? <ActiveMediaCard kind="music" eyebrow="Aktuelle Wiedergabe" title={now.title || "Unbekannter Titel"} subtitle={now.artist} detail={`HomePods · ${pct(now.volume ?? state.devices?.homepods?.volume)}`} artwork={now.artwork_url} device="HomePods" volume={policy.volume_target_homepods} controls={<SegmentedButton disabled icon={Icon.Pause} title="Play/Pause ist im aktuellen Umbrella-Contract nicht vorhanden">Pause</SegmentedButton>} /> : <Card><EmptyState icon={Icon.Music2} title="Gerade läuft keine Musik" text="Radio oder Music Assistant starten; die Wiedergabe erscheint automatisch." /></Card>}</div>
      <Card title="Radiosender" action={<Pill tone="pink">Music Assistant</Pill>}>
        <RadioShortcuts hass={hass} onChanged={onChanged} />
      </Card>
      <Card title="Radio suchen"><div className="search-box"><Icon.Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void search()} placeholder="Sender in Music Assistant suchen …" /><button onClick={() => void search()} disabled={searching}>{searching ? "Suche …" : "Suchen"}</button></div>
        {results.length > 0 && <div className="search-results">{results.map((result) => <div key={result.uri}>{result.image ? <img src={result.image} alt="" /> : <Icon.Radio />}<div><b>{result.name}</b><small>{result.favorite ? "Favorit" : "Radio"}</small></div><button onClick={() => void play(result.uri)}><Icon.Play size={17} />Abspielen</button></div>)}</div>}
      </Card>
      <div className="library-grid">{librarySections.map((section) => <Card title={section} key={section}><EmptyState compact icon={section === "Favoriten" ? Icon.Heart : Icon.ListMusic} title="Backend-Daten fehlen" text="Für diesen Music-Assistant-Bereich existiert noch kein Umbrella-Contract." /></Card>)}</div>
    </div>
    <aside className="music-aside"><Card title="Wiedergabegeräte"><DeviceStatusGrid devices={Object.fromEntries(Object.entries(state.devices || {}).filter(([key]) => ["homepods", "denon"].includes(key)))} /></Card><Card title="Musik-Entscheidung"><div className="key-values"><span>Audio Owner<b>{policy.audio_owner || "—"}</b></span><span>Ziel HomePods<b>{pct(policy.volume_target_homepods)}</b></span><span>Boost<b>{policy.track_boost_applied ? "Aktiv" : "Aus"}</b></span><span>Quiet Mode<b>{policy.quiet_mode ? "Aktiv" : "Aus"}</b></span></div></Card></aside>
  </div>;
}
