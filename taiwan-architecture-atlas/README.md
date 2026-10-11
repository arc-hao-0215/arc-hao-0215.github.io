# Architecture in Taiwan, All at Once
## Research edition 05 — Birth-year anchored architectural culture map (2026-10-11)

**Public site:** https://arc-hao-0215.github.io/taiwan-architecture-atlas/

An independent, open-ended, source-based digital atlas of architecture in Taiwan. Its interactive **reading grammar**, not code or assets, is informed by Kyle Miller's [Architecture All At Once, Right Now](https://architectureallatonce.com/), where the **primary people map** has birth year on the horizontal axis and principal working geography on the vertical axis. It adds a substantial **practice-to-works** browsing system appropriate for documenting Taiwanese architecture.

**Do not treat this atlas as a comprehensive or fully verified national record.** The seed corpus is award-heavy, and many biography, education, authorship, collaboration and historic credits still require dedicated research.

### What changed in Edition 05

1. **People use verified birth years.** Person nodes no longer borrow graduation, professional return, award, firm creation or project years for the main X coordinate.
2. **Unverified births remain unverified.** People without a reliable birth date appear in a separate 'BIRTH YEAR NOT VERIFIED' register accessible from the left navigator and search, not falsely on the dated ruler. For conflicting dates (notably Wang Da-hong's 1917/1918 and Yang Cho-cheng's 1914/1915), the panel shows both sources and does not force a false resolution.
3. **Vertical groups represent practice geography**, not nationality, ethnicity, passport or birth location. Region classifications are provisional research tags, subject to further documentation.
4. **Other entities are annotations/satellites**, linked to related people or practices. Their horizontal positions are *not* birth/founding/completion dates.
5. **Separate relation types**: studied at, studied under/mentored, taught at, led, founded, worked at, collaboration, association, designed, technical contribution, awards, site context and research. Colors and dash patterns are used on the map, while each record in the panel includes its own wording, date kind and source link.
6. **Offices and their works are first-class.** OFFICE index → choose a practice → review its sourced design works chronologically. Completed/opening dates are distinguished from *Taiwan Architecture Award year*, and a person who merely worked for an office is **not credited for the office's entire subsequent portfolio**. Only persons documented as founders can browse all office projects as office-affiliated context; individual work authorship is shown only from its direct relation records.
7. **Navigation**: search, hover, click, pan/zoom, click birth-year ruler or work-region, source citations, browse ‹ / › history, highlights, connection filters, light/night, links to individual nodes and CSV export.

### Latest verified structure

- **373 entities** in the initial integrated dataset: 100 people, 90 practices, 150 works, plus institutions, publications and events.
- **351 evidence-linked relationship records**.
- **83 bibliographic/source records**.
- **17 birth-year-anchored people**, with the majority still marked unverified. The correct response is *more biographical research*, not synthetic birth years.

These totals are expected to change after source validation and new editorial contributions.

### A relationship is a claim, not a line for visual beauty

Each edge links two actual IDs and has `type`, a precise `label`, optional `year` and one or more source IDs. The presentation adapter `relationship-grammar.js` derives semantic categories. It NEVER creates new unverified mentorship, collaboration or authored-publication links by itself.

Do not infer that:

- People born the same year knew one another.
- Sharing an employer or alma mater means a direct teacher–student or philosophical influence.
- An architect employed by a firm designed *every* later firm work.
- A project recorded in an annual award database was completed in the award year.
- A studio physically shown near a person on the map was established the year the person was born.
- Geography tags equal citizenship/national identity.
- Missing links imply that no such historical relationship existed.

### Year semantics

| Field | Meaning |
|---|---|
| `birthYear` | Year a person was born, from an attributable biography. **Main x coordinate, people only** |
| `deathYear` | Died (when verified) |
| `year` (legacy node) | Original seed corpus reference or award-year record; **never interpret uniformly** |
| `chronology.year` | Specific evidenced professional/cultural event, tagged with `basis` |
| `edge.year` | Date of the particular relationship claim; `yearKind` distinguishes graduation, employment, awarded, etc. |
| `workRegion` | Provisional work-geography category used for a person's vertical band |
| Unverified birth | No dated X position; appears in a separate unknown-birth register |

### Data files

| File | Responsibility |
|---|---|
| `index.html` | Current published home page |
| `genealogy.css`, `genealogy.js` | Independent full-canvas interaction and visual UI |
| `data.js` | Initial sourced buildings / people / practice cases |
| `expanded-data.js` | Historical annual architecture award entries and publication nodes |
| `academic-data.js` | Official educational histories and institutional links |
| `editorial-data.js` | Publication-grounded contextual research notes |
| `education-data.js`, `lineage-bridges.js` | Alumni, degrees, teaching, documented office work |
| `chronology-data.js` | Particular event chronologies incl. Huang Sheng-yuan |
| `biographical-data.js`, `person-links.js` | Verified/contested birth-year facts and documented mentorship / collaboration |
| `relationship-grammar.js` | Relationship semantic interpretation and line styles |
| `index-genealogy.html` | Staging snapshot of edition 05 entry point |
| `README.md` | Research methodology and contribution protocol |
| `atlas-v2.js`, `atlas-v2.css`, `styles.css`, `app.js` | Unused archived earlier visual versions (kept to avoid destructive removal) |

### Validation

2026-10-11, Edition 05: Source URLs and relationship identifiers checked for internal referential integrity; all new JavaScript parsed; simulated interaction smoke test covered application initialisation, search, Huang Sheng-yuan source panel, Canvas draw and the full office index. A browser-based responsive visual QA and live GitHub Pages deployment check are **not** yet verified.

### Further work

The current graph is honest about its incompleteness. The next high-priority research tasks are to increase sourced birth years, distinguish university graduations from teaching appointments, collect true former-employer/co-author/collaboration records from primary biographies, assign qualified work-region metadata to more people, cross-check attribution in award inventories, and add original bibliographic entries and dates for the key theoretical authors and editors.

Submit contributions through [Issues](https://github.com/arc-hao-0215/arc-hao-0215.github.io/issues/new) with a specific relationship claim, who or what it connects, sources, dated event type (if known), and uncertainty.
