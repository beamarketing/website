# Beamr Marketing Tracker

A self-contained tool to track progress against the marketing department's
Q3–Q4 objectives across four strategic pillars:

1. **Solution Provider** — must-have positioning (content, PR, dev hub, Blueprint)
2. **Revenue** — sales kits, packs, renewals, MQL/SQL/opportunity targets
3. **Market Position M&E** — IBC / SR launch, media, sports-tech push
4. **Decision Making** — dashboard, funnel tracking, HubSpot as source of truth

## How to use

Open `index.html` in any browser (double-click the file, or serve the folder).
No build step, no dependencies.

For each objective you can:

- Set a **status** (Not started → In progress → At risk / Blocked → Done)
- Assign an **owner**
- For numeric goals (**metrics**), enter the current count against the target
- Add **notes / next step**

The header shows overall completion, a status breakdown, and how many items
are **overdue** (deadline passed and not complete). Filter by status or quarter,
or search across titles, owners, and notes. Click a pillar heading to collapse it.

Switch between **Cards** and **List** view (top-right); the List view is a
sortable table — click a column header (or use the Sort dropdown) to sort by
due date, status, pillar, owner, or name.

Click the **✎** on any objective to **edit** it — title, detail, pillar,
quarter, deadline, and numeric target (set a target to turn a task into a
tracked metric). Use **+ Add objective** to add anything not in the original plan.

## Saving & sharing

- Edits save automatically to your **browser's local storage** (per browser/device).
- **Export** downloads a JSON snapshot to share with the team or back up.
- **Import** loads a JSON snapshot (replaces current state).
- **Reset** restores the original plan and clears your local edits.

> Because state lives in the browser, the export/import JSON is how you sync
> progress between people. Whoever "owns" the tracker can export weekly and
> re-import to keep a shared source of truth — or paste it into HubSpot / the
> marketing dashboard once that's live.

## Files

| File | Purpose |
|---|---|
| `index.html` | The tracker UI and logic |
| `data.js` | The seed objectives (edit here to change the baseline plan) |

To change the baseline plan for everyone (deadlines, targets, wording), edit
`data.js`. Existing status/notes are keyed by objective `id`, so they survive
edits as long as the `id` stays the same.
