# Mintangle Backlog

Small, focused, mostly parallelizable tasks to build Mintangle from scratch.

Source of truth for behavior is [`PRODUCT.md`](../../PRODUCT.md). Structure and
coding rules come from [`AGENTS.md`](../../AGENTS.md). Every entry must preserve
`PRODUCT.md` semantics.

## Entry format

Each entry follows the same template:

- Header metadata: Status, Priority, Depends on, Parallelizable with, Affected files
- **Summary** — one paragraph of intent
- **Scope** — checklist of concrete work
- **Acceptance criteria** — how we know it's done
- **References** — pointers into `PRODUCT.md` / `AGENTS.md`

Statuses: `Not started`, `In progress`, `Blocked`, `Done`.

## Dependency overview

Foundational, no dependencies (start in parallel):

- BL-01 Extension scaffolding & metadata.json
- BL-02 Product constants module
- BL-03 Geometry base helpers
- BL-08 Runtime per-window state

Geometry families (need BL-03, parallel with each other):

- BL-04 Halves & corners
- BL-05 Thirds & two-thirds
- BL-06 Fourths & three-fourths
- BL-07 Maximize / center family

Logic & wiring:

- BL-09 Repeat-cycle resolution (BL-02, BL-08)
- BL-10 Action dispatch (BL-02, BL-04..07, BL-09)
- BL-11 Settings + schema (BL-02)
- BL-12 Keybinding registration (BL-02, BL-11)
- BL-13 Multi-monitor / display movement (BL-03, BL-10)
- BL-14 Extension lifecycle (BL-10, BL-11, BL-12)
- BL-15 Settings UI / prefs (BL-11)
- BL-16 Fail-safe handling & notifications (BL-10, BL-11, BL-12)

Docs & verification (mostly independent):

- BL-17 README user documentation
- BL-18 Manual test plan / acceptance checklist

## Index

| ID | Title | Depends on |
| --- | --- | --- |
| BL-01 | Extension scaffolding & metadata.json | — |
| BL-02 | Product constants module | — |
| BL-03 | Geometry base helpers (work area, margins, clamp) | — |
| BL-04 | Geometry: halves & corners | BL-03 |
| BL-05 | Geometry: thirds & two-thirds (orientation-aware) | BL-03 |
| BL-06 | Geometry: fourths & three-fourths (orientation-aware) | BL-03 |
| BL-07 | Geometry: maximize, almost-maximize, center family | BL-03 |
| BL-08 | Runtime per-window state | — |
| BL-09 | Repeat-cycle resolution (position-only) | BL-02, BL-08 |
| BL-10 | Action dispatch | BL-02, BL-04..07, BL-09 |
| BL-11 | Settings loading, validation & schema | BL-02 |
| BL-12 | Keybinding registration / unregistration | BL-02, BL-11 |
| BL-13 | Multi-monitor / display movement | BL-03, BL-10 |
| BL-14 | Extension lifecycle wiring | BL-10, BL-11, BL-12 |
| BL-15 | Settings UI (prefs) | BL-11 |
| BL-16 | Fail-safe handling & error notifications | BL-10, BL-11, BL-12 |
| BL-17 | README user documentation | — |
| BL-18 | Manual test plan / acceptance checklist | — |
