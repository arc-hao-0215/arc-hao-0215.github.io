# Taiwan Architecture Atlas / 臺灣建築知識網絡

An independently developed, evidence-linked **research prototype** inspired by the *network-visualisation approach* of Architecture All At Once. This project does not reproduce their source code, graphical assets or proprietary data.

**Public site:** https://arc-hao-0215.github.io/taiwan-architecture-atlas/

## Current scope

- 37 entity records: people, practices, educational/cultural institutions, and buildings.
- 39 documented relationships with typed descriptions.
- 17 linked official, academic, practice, governmental or professional sources.
- 1945–present research framing; the starter dataset is selective and focused on documented post-war cases, **not an authoritative full history**.
- Search in Traditional Chinese or English, browse index, filter entity types and dates, click nodes to inspect their relationships and evidence, pan/zoom the SVG graph, deep-link a node, and download documented edges as CSV.

**Important methodological distinction:** `year` is the illustrative historical event anchor for each entity in this graph, **not the person's birth date**, a firm's incorporation date, or a complete interval of activity. If a relationship's date is unsupported, omit its optional `year` rather than invent one.

## Files

- `index.html`: standalone semantic website
- `styles.css`: responsive editorial interface
- `data.js`: graph content with relationship-level provenance
- `app.js`: dependency-free interactive SVG graph, search/filter, details and CSV export

The site has no build step and works on GitHub Pages. All files live in this directory so they do **not** alter the parent portfolio's layout or scripts.

## Editorial principles

1. **Source each edge.** Each connection in `edges` must include `src: ["SXX"]` and describe what the source actually supports.
2. **Differentiate relationship types.** Use `design`, `affiliation`, `education`, `engineering`, or `client`. Do not treat overlapping employment or stylistic resemblance as evidence of direct mentorship or influence.
3. **Disclose attribution complexity.** The Luce Memorial Chapel involves multiple recorded contributors and potentially contested attribution; avoid collapsing the work to one author.
4. **Avoid assumed completeness.** Geographic, gender, educational, intergenerational and Indigenous representation remain priorities for future research; absence from this dataset implies nothing about significance.
5. **Respect copyrights and licences.** Links are not permission to copy images, diagrams or archival records. This prototype displays no remote copyrighted photographs.
6. **Use names consistently.** Search supports both Chinese and English names; aliases may be added in a future schema revision.
7. **Do not add guesses.** Unverified biographical dates, awards, educational history, firm associations and personal relationships must be left out pending verification.

## Adding records

In `data.js`, add one `sources` record (public primary or credible professional source) if needed, then a `nodes` entry with a unique `id`, `name`, `en`, `type`, `year`, `lane` (0–3), `offset` (visual spacing), `desc`, and `sources`. Finally add a typed `edges` record with `a`, `b`, `type`, `label`, optional `year`, and `src`. Validate that all edge endpoint IDs and source IDs resolve.

Public contributions should initially use a GitHub Issue with a concise claim, exact relationship, relevant date, official source URL and editorial caveat.

## Publication

GitHub Pages is already used by the owner repository. After a commit appears on `main`, the project should be served from `/taiwan-architecture-atlas/` once the Pages deployment updates. If Pages is disabled or configured for another branch, check **Settings → Pages** in the GitHub repository.

## Notes

This prototype was independently created on 2026-10-11. It prioritizes provenance and human-readable exploration. Network distances, spatial proximity and node position do **not** encode quantitative influence, institutional prestige or social hierarchy.

Further work: multilingual aliases, broader sources and historical coverage, uncertain/contested attribution flags, source review log, stronger keyboard accessibility, clustering for datasets beyond several hundred entities, and dedicated comparison/pathfinding features.
