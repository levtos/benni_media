import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RadioShortcuts } from "./RadioShortcuts";
import { MusicPage } from "./pages/MusicPage";
import { OverviewPage } from "./pages/OverviewPage";
import { WS } from "./api";

const variants = Array.from({ length: 6 }, (_, i) => [
  { key: `station-${i}`, name: `Sender ${i}`, provider: "radiobrowser", uri: `radiobrowser://radio/resolved-${i}`, playing: i === 0 },
  { key: `station-${i}`, name: `Sender ${i} (TuneIn)`, provider: "tunein", uri: `tunein--instance://radio/s${i}` }
]).flat();
const response = (results: unknown = variants) => ({ ok: true, result: { results } });
const backend = (results: unknown = variants) => ({ callWS: vi.fn().mockImplementation(async (message) => message.action === "radio_shortcuts" ? response(results) : { ok: true, result: { played: message.params.media_id } }) });

it.each(["music", "overview"])("%s uses the gateway envelope and six grouped stations instead of static defaults", async (page) => {
  const hass = backend();
  const apply = { radio: { defaults: [{ key: "obsolete", name: "Old static station", uri: "radiobrowser://radio/obsolete" }] } };
  render(page === "music" ? <MusicPage hass={hass} apply={apply} onChanged={vi.fn()} /> : <OverviewPage hass={hass} data={{ raw: { apply } }} onChanged={vi.fn()} />);
  expect(await screen.findAllByRole("group", { name: /^Sender/ })).toHaveLength(6);
  expect(screen.queryByText("Old static station")).not.toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /: Radio Browser$/ })).toHaveLength(6);
  expect(screen.getAllByRole("button", { name: /: TuneIn$/ })).toHaveLength(6);
  expect(hass.callWS).toHaveBeenCalledWith({ type: WS.action, module: "apply", action: "radio_shortcuts", params: {} });
});

it.each(["Radio Browser", "TuneIn"])("dispatches the exact resolved %s URI through the manual action", async (provider) => {
  const hass = backend(); const changed = vi.fn();
  render(<RadioShortcuts hass={hass} onChanged={changed} />);
  fireEvent.click(await screen.findByRole("button", { name: `Sender 2: ${provider}` }));
  await waitFor(() => expect(changed).toHaveBeenCalledOnce());
  expect(hass.callWS).toHaveBeenLastCalledWith({ type: WS.action, module: "apply", action: "play_radio", params: { media_id: provider === "TuneIn" ? variants[5].uri : variants[4].uri } });
});

it("disables absent or invalid sources and never substitutes another provider", async () => {
  const hass = backend([variants[0], { ...variants[1], uri: "library://radio/3" }, { ...variants[2], provider: "unknown" }, null]);
  render(<RadioShortcuts hass={hass} onChanged={vi.fn()} />);
  expect(await screen.findByRole("button", { name: "Sender 0: Radio Browser" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Sender 0: TuneIn" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Sender 1: Radio Browser" })).toBeDisabled();
  expect(within(screen.getByRole("group", { name: "Sender 0" })).getByText("Live")).toBeInTheDocument();
});

it("shows loading, handles failure without leaking backend text, and allows retry", async () => {
  const hass = { callWS: vi.fn().mockRejectedValueOnce(new Error("private backend detail")).mockResolvedValueOnce(response()) };
  render(<RadioShortcuts hass={hass} onChanged={vi.fn()} />);
  expect(screen.getByRole("status")).toHaveTextContent("Sender werden geladen");
  expect(await screen.findByRole("alert")).toHaveTextContent("Sender konnten nicht geladen werden");
  expect(document.body.textContent).not.toContain("private backend detail");
  fireEvent.click(screen.getByRole("button", { name: "Erneut laden" }));
  expect(await screen.findAllByRole("group")).toHaveLength(6);
});

it.each([undefined, {}, { ok: false, result: { results: variants } }, response({})])("rejects malformed or failed envelopes: %j", async (value) => {
  render(<RadioShortcuts hass={{ callWS: vi.fn().mockResolvedValue(value) }} onChanged={vi.fn()} />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Sender konnten nicht geladen werden");
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

it("distinguishes an empty catalogue", async () => {
  render(<RadioShortcuts hass={backend([])} onChanged={vi.fn()} />);
  expect(await screen.findByText("Keine Radiosender verfügbar.")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("prevents concurrent manual dispatch and leaves failed starts visible", async () => {
  let reject!: (reason: Error) => void;
  const hass = backend(); const changed = vi.fn();
  hass.callWS.mockImplementation(async (message) => message.action === "radio_shortcuts" ? response() : new Promise((_, fail) => { reject = fail; }));
  render(<RadioShortcuts hass={hass} onChanged={changed} />);
  const rb = await screen.findByRole("button", { name: "Sender 0: Radio Browser" });
  fireEvent.click(rb); fireEvent.click(screen.getByRole("button", { name: "Sender 0: TuneIn" }));
  expect(hass.callWS.mock.calls.filter(([message]) => message.action === "play_radio")).toHaveLength(1);
  expect(rb).toBeDisabled();
  await act(async () => reject(new Error("failure")));
  expect(await screen.findByRole("alert")).toHaveTextContent("Der Start ist fehlgeschlagen");
  expect(changed).not.toHaveBeenCalled();
  expect(rb).toBeEnabled();
});

it("ignores a late catalogue response after unmount", async () => {
  let resolve!: (value: unknown) => void;
  const hass = { callWS: vi.fn().mockImplementation(() => new Promise((done) => { resolve = done; })) };
  const view = render(<RadioShortcuts hass={hass} onChanged={vi.fn()} />);
  view.unmount();
  await act(async () => resolve(response()));
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});
