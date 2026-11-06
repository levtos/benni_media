import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RulesPage } from "./RulesPage";
import type { HassLike, MatrixData } from "../types";

const matrix: MatrixData = {
  catalog: { dayphases: ["early_morning"], scenarios: ["off", "private", "gaming", "tv", "music"], scenario_labels: { off: "Aus", private: "Privat", gaming: "Gaming", tv: "TV", music: "Musik" }, activities: ["work_home", "work_away"], devices: ["homepods", "denon"] },
  base: { homepods: { early_morning: .25 }, denon: { early_morning: .2 } },
  scenario_off: { homepods: { off: 0, private: 0, gaming: 0, tv: 0, music: 0 }, denon: { off: 0, private: 0, gaming: -.1, tv: 0, music: 0 } },
  activity_off: { homepods: {}, denon: {} },
  scalars: { opening_offset_homepods: -.05, opening_offset_denon: -.05, grind_homepods_offset: 0, grind_denon_offset: -.1, private_denon_cap: .15, ducked_target: .1, boost_offset: .15, homepods_max: .65, denon_max: .7, active_min: .05 },
  override: {},
};
const hass: HassLike = { callWS: async <T,>() => matrix as T };

function persistentHass(fail = false, initial = matrix) {
  let stored = structuredClone(initial);
  const calls: Record<string, unknown>[] = [];
  const client: HassLike = { callWS: async <T,>(message: Record<string, unknown>) => {
    calls.push(message);
    if (message.type === "benni_media_apply/get_status") return { reapply: { pending: false } } as T;
    if (message.type === "benni_media_apply/schedule_reapply") return { reapply: { pending: true, remaining_s: 30 } } as T;
    if (message.type === "benni_media_apply/cancel_reapply") return { reapply: { pending: false } } as T;
    if (fail && message.type === "benni_media_policy/set_scalars") throw new Error("Backend nicht erreichbar");
    if (message.type === "benni_media_policy/set_scalars") stored = { ...stored, scalars: { ...stored.scalars, ...(message.patch as Record<string, number>) } };
    if (message.type === "benni_media_policy/set_matrix") {
      type Value = number | boolean;
      const patch = message.patch as Record<string, Record<string, Record<string, Value | null>>>;
      const effective = stored as unknown as Record<string, Record<string, Record<string, Value>>>;
      for (const [dimension, devices] of Object.entries(patch)) {
        for (const [device, values] of Object.entries(devices)) {
          const overrides = (stored.override[dimension] ??= {})[device] ??= {};
          for (const [phase, value] of Object.entries(values)) {
            if (value === null) {
              delete overrides[phase];
              delete effective[dimension][device][phase];
            } else {
              overrides[phase] = value;
              effective[dimension][device][phase] = value;
            }
          }
        }
      }
    }
    return structuredClone(stored) as T;
  } };
  return { client, calls, stored: () => stored };
}

function grindDenonInput() {
  const row = screen.getByText("Zusätzlicher Grind-Offset").closest(".rule-row");
  if (!row) throw new Error("Grind-Zeile fehlt");
  return within(row as HTMLElement).getAllByRole("spinbutton", { name: "Prozentpunkte" })[1];
}

it("shows the canonical activity inventory and separates special modes", () => {
  render(<RulesPage matrix={matrix} hass={hass} onMatrix={() => undefined} />);
  expect(screen.getByText("Geschlossen")).toBeInTheDocument();
  expect(screen.getByText("Gekippt")).toBeInTheDocument();
  expect(screen.getByText("Offen")).toBeInTheDocument();
  expect(screen.getByText("Freizeit")).toBeInTheDocument();
  expect(screen.getByText("Haushalt")).toBeInTheDocument();
  expect(screen.queryByText("Privat")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Gaming-Modi" }));
  expect(screen.getByText("Gaming Grind")).toBeInTheDocument();
  expect(screen.getByText("Immer gesperrt · nicht editierbar")).toBeInTheDocument();
  expect(screen.getByText("Spielton über Headset")).toBeInTheDocument();
});

it("translates private diagnostics and names the exact matrix reset scope", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  render(<RulesPage matrix={matrix} state={{ private_blocked_reason: "auto_blocked:denon_off" }} hass={hass} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Caps & Private Time" }));
  expect(screen.getByText("Automatischer Eintritt blockiert: Denon ist ausgeschaltet.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Matrixwerte auf Standard zurücksetzen" }));
  expect(confirm).toHaveBeenCalledWith(expect.stringContaining("Szenario-Offsets einschließlich Gaming Normal"));
  expect(confirm).toHaveBeenCalledWith(expect.stringContaining("Fensterwerte, Grind-Offsets, Private-Time-Cap"));
  confirm.mockRestore();
});

it("does not invent a waking offset when the contract is absent", () => {
  render(<RulesPage matrix={matrix} hass={hass} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Delays, Sleep & Waking" }));
  expect(screen.getByText("Waking-Offset: Contract fehlt")).toBeInTheDocument();
  expect(screen.getByText("waking_homepods_offset")).toBeInTheDocument();
});

it("keeps scalar edits dirty until the explicit save and reloads the persisted value", async () => {
  const backend = persistentHass();
  const view = render(<RulesPage matrix={matrix} hass={backend.client} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Gaming-Modi" }));
  fireEvent.change(grindDenonInput(), { target: { value: "-9" } });
  expect(screen.getByText("Ungespeicherte Änderungen")).toBeInTheDocument();
  expect(backend.calls.filter((call) => String(call.type).includes("set_"))).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Änderungen speichern" }));
  await waitFor(() => expect(screen.getByText("Änderungen gespeichert")).toBeInTheDocument());
  expect(backend.calls.map((call) => call.type)).toContain("benni_media_apply/schedule_reapply");
  const scalarCall = backend.calls.find((call) => call.type === "benni_media_policy/set_scalars");
  expect(scalarCall?.patch).toEqual({ grind_denon_offset: -.09 });
  expect(screen.queryByText("Ungespeicherte Änderungen")).not.toBeInTheDocument();
  view.unmount();
  render(<RulesPage matrix={backend.stored()} hass={backend.client} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Gaming-Modi" }));
  expect(grindDenonInput()).toHaveValue(-9);
});

it("uses set_matrix for matrix edits", async () => {
  const backend = persistentHass();
  render(<RulesPage matrix={matrix} hass={backend.client} onMatrix={() => undefined} />);
  const baseInput = screen.getAllByRole("spinbutton", { name: "Prozent" })[0];
  fireEvent.change(baseInput, { target: { value: "26" } }); fireEvent.blur(baseInput);
  fireEvent.click(screen.getByRole("button", { name: "Änderungen speichern" }));
  await waitFor(() => expect(screen.getByText("Änderungen gespeichert")).toBeInTheDocument());
  expect(backend.calls.find((call) => call.type === "benni_media_policy/set_matrix")).toMatchObject({ type: "benni_media_policy/set_matrix", patch: { base: { homepods: { early_morning: .26 } } } });
});

it("persists independent maxima and the title-boost toggle and can clear a maximum", async () => {
  const backend = persistentHass(false, {
    ...matrix,
    phase_max: { homepods: {}, denon: {} },
    boost_allowed: { homepods: { early_morning: true } },
  });
  const renderRules = () => render(<RulesPage matrix={backend.stored()} hass={backend.client} onMatrix={() => undefined} />);
  const save = async () => {
    fireEvent.click(screen.getByRole("button", { name: "Änderungen speichern" }));
    await waitFor(() => expect(screen.getByText("Änderungen gespeichert")).toBeInTheDocument());
  };
  const homepods = () => screen.getByRole("spinbutton", { name: "Früher Morgen Max HomePods" });
  const denon = () => screen.getByRole("spinbutton", { name: "Früher Morgen Max Denon" });
  const boost = () => screen.getByRole("checkbox", { name: "Früher Morgen Titel-Boost" });
  const first = renderRules();
  expect(homepods()).toHaveValue(null);
  expect(denon()).toHaveValue(null);
  expect(boost()).toBeChecked();
  fireEvent.change(homepods(), { target: { value: "32.5" } });
  fireEvent.change(denon(), { target: { value: "0" } });
  fireEvent.click(boost());
  await save();
  expect(backend.calls.find((call) => call.type === "benni_media_policy/set_matrix")?.patch).toEqual({
    phase_max: { homepods: { early_morning: .325 }, denon: { early_morning: 0 } },
    boost_allowed: { homepods: { early_morning: false } },
  });
  expect(backend.stored().base).toEqual(matrix.base);

  first.unmount();
  const second = renderRules();
  expect(homepods()).toHaveValue(32.5);
  expect(denon()).toHaveValue(0);
  expect(boost()).not.toBeChecked();
  fireEvent.change(homepods(), { target: { value: "" } });
  await save();
  expect(backend.calls.filter((call) => call.type === "benni_media_policy/set_matrix").at(-1)?.patch).toEqual({
    phase_max: { homepods: { early_morning: null } },
  });
  second.unmount();
  renderRules();
  expect(homepods()).toHaveValue(null);
  expect(denon()).toHaveValue(0);
  expect(boost()).not.toBeChecked();
});

it("marks typing dirty immediately, blocks invalid input and can discard it", async () => {
  const backend = persistentHass();
  render(<RulesPage matrix={matrix} hass={backend.client} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Gaming-Modi" }));
  fireEvent.change(grindDenonInput(), { target: { value: "" } });
  expect(screen.getByText("Ungespeicherte Änderungen")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Änderungen speichern" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Änderungen verwerfen" }));
  await waitFor(() => expect(grindDenonInput()).toHaveValue(-10));
  expect(screen.getByRole("button", { name: "Änderungen speichern" })).toBeDisabled();
});

it("keeps dirty state and shows the backend error when saving fails", async () => {
  const backend = persistentHass(true);
  render(<RulesPage matrix={matrix} hass={backend.client} onMatrix={() => undefined} />);
  fireEvent.click(screen.getByRole("button", { name: "Gaming-Modi" }));
  fireEvent.change(grindDenonInput(), { target: { value: "-8" } }); fireEvent.blur(grindDenonInput());
  fireEvent.click(screen.getByRole("button", { name: "Änderungen speichern" }));
  await waitFor(() => expect(screen.getByText("Backend nicht erreichbar")).toBeInTheDocument());
  expect(screen.getByText("Speichern fehlgeschlagen")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Änderungen speichern" })).toBeEnabled();
});
