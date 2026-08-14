# Pipeline Overload — the AV data pressure test

A single-file, no-dependency HTML game used as an AV/ML lead magnet for Beamr.
Everything lives in [`pipeline-overload.html`](./pipeline-overload.html)
(HTML + CSS + JS + embedded font, no external assets).

## Controls

- **Steer:** ← / → or A / D
- **Speed:** ↑ / W accelerate · ↓ / S brake (eases back to cruise on release)
- **Confirm:** Space · **Mute:** M · Mouse / touch also steer

## Configuration

All config constants live at the top of the `<script>` in
`pipeline-overload.html`:

| Constant | Purpose | Default |
|---|---|---|
| `HUBSPOT_PORTAL_ID` | HubSpot account/portal id | `""` (off) |
| `HUBSPOT_FORM_GUID` | HubSpot form GUID | `""` (off) |
| `LEAD_ENDPOINT` | Optional extra JSON POST target (Zapier/Formspree/your API) | `""` |
| `BLUEPRINT_URL` | Destination for the “Explore your ML-safe range” CTA | `""` |
| `MLSAFE_REDUCTION` | Illustrative benchmark reduction (0.50 = 50% less data) | `0.50` |

Every submission also lands in `window.__LEADS` for debugging.

## HubSpot connection

Lead submissions POST straight to HubSpot's **Forms Submissions API**
(`https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`)
— no HubSpot JS embed required, and it is CORS-enabled for browser use.

To connect:

1. Create a HubSpot form (or a non-HubSpot form; the API accepts either) with
   the fields below, using these **internal property names**.
2. Put the **Portal ID** and **Form GUID** into the two constants above.

### Fields the game submits

Questions shown to the player and the values sent:

| Field label (in game) | HubSpot internal name | Type | Options / value |
|---|---|---|---|
| NAME | `firstname` + `lastname` | default contact props | full name is split on the first space |
| WORK EMAIL | `email` | default contact prop | email |
| COMPANY | `company` | default contact prop | text |
| DATA PER DAY | `av_data_per_day` | dropdown (enumeration) | `< 10 TB` · `10 - 100 TB` · `100 TB - 1 PB` · `> 1 PB` · `NOT SURE YET` |
| BIGGEST DATA CONSTRAINT | `biggest_data_constraint` | dropdown (enumeration) | `STORAGE` · `VEHICLE OFFLOAD` · `UPLOAD / NETWORK` · `CLOUD INGEST` · `TRAINING THROUGHPUT` · `COMPRESSION RISK TO MODELS` · `NOT SURE YET` |

Optional hidden run-telemetry fields (create these contact properties if you
want the player's run stored on the contact; the game only sends the ones you
create — extras are harmless):

| HubSpot internal name | Type | Meaning |
|---|---|---|
| `game_data_collected_mb` | number | MB of video collected in the run |
| `game_run_seconds` | number | run length (seconds) |
| `game_sensor_stack` | number (1–7) | sensors bolted on |
| `game_peak_load` | number (%) | peak pipeline load reached |
| `game_mlsafe_scenario_mb` | number | illustrative reduced MB (`mb × (1 − MLSAFE_REDUCTION)`) |
| `game_ending` | single-line text | `del` (deleted data) or `crush` (compressed blindly) |

**What we need from HubSpot to finish wiring:** the **Portal ID** and the
**Form GUID**. Field internal names can be adjusted in `submitHubSpot()` if you
prefer different ones.

## Embedding in Framer

Two options:

1. **Code component (recommended):** import
   [`code/PipelineOverloadGame.tsx`](./code/PipelineOverloadGame.tsx) into
   Framer (Assets → Code → +). Host `pipeline-overload.html` at a public URL
   and paste it into the component's **Game URL** control. The component keeps
   a responsive 16:9 frame. Hosting options: GitHub Pages on this repo
   (`https://beamarketing.github.io/website/pipeline-overload.html`), any
   CDN/static host, or your own site.

2. **No-code Embed:** Framer's built-in **Insert → Embed → HTML** element
   accepts the entire contents of `pipeline-overload.html` pasted directly —
   no hosting required.

Click the frame once on the live page to give it keyboard focus before driving.
