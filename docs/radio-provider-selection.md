# Manual radio provider selection (#26)

Music and overview use the existing `benni_media/action` gateway. The
`apply/radio_shortcuts` response is `{ok: true, result: {results: [...]}}`.
Group those variants by the published station key; do not use static
`apply.radio.defaults` or maintain another station catalogue in the frontend.
Each compact station tile offers Radio Browser and TuneIn explicitly. Missing or
invalid sources are disabled. Failed/invalid loads have an explicit retry;
there is no silent fallback to static URIs. Manual play forwards the exact source
URI via `apply/play_radio`, without provider substitution or automatic retries.
Pending commands disable further shortcut dispatch; a failed command remains
visible and is not reported as successful playback. Live badges use Apply facts.

No Apply, State, Policy, persistence, YAML or device ownership behavior changes.
Automatic fallback and manual precedence remain the existing Apply contracts.
Requires Apply's resolved provider variants (available since 0.19.17). Native
radio services from 0.19.18 continue to use the existing configured YAML helpers;
they do not depend on the paused complete migration.

Media YAML migration #64, Apply design #65 and configuration inventory #50 are
ON HOLD until Wuschel is productively stable. Their documents and 40-entry
inventory are retained. No design Go or automatic resumption. Core Devices
remains the productive device owner; WebOS-WoL and HomeKit remain unchanged.

Tests cover both embedding pages, the actual gateway envelope, six grouped
stations, both exact provider URIs, missing/invalid sources, empty/error/loading
states, retry, concurrent-click exclusion and late responses after unmount.
Build/type/lint checks are technical evidence only; Benni owns installation,
real HA rendering and audible Wake/Resume/Stop verification.
