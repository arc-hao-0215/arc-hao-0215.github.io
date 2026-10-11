# Architecture in Taiwan, All at Once / 臺灣建築關係圖譜

**Research edition 04 / relation grammar and documented chronology — updated 2026-10-11**

Live GitHub Pages path (subject to Pages publishing): **https://arc-hao-0215.github.io/taiwan-architecture-atlas/**

An independent, experimental, source-linked network atlas of Taiwan's architectural culture. Inspired by the interaction and visual-density concept of Kyle Miller's *Architecture All At Once, Right Now* (https://architectureallatonce.com/). No source code, images, archival data, identity assets or visual files have been copied from that project.

The previous three-column dashboard has been replaced by a full-window, zoomable/pannable Canvas network with minimalist black-on-off-white information design, nuanced node styling, thin curved connections and floating research tools.

## Dataset in this edition

- **364 entities**: 97 people, 89 practices, 18 institutions, 148 buildings/projects, 10 publications, 2 exhibition/award events.
- **334 evidence-linked relationships**. Every relationship records at least one source ID that resolves to a source URL; these are documented links, not stylistic similarity or inferred mentorship.
- **57 linked bibliography/reference records** across government archives, university histories, architectural practices, award registers, journal feature essays and relevant academic research.
- **34 entities explicitly marked undated** where the research record does not establish an adequate date. The timeline does **not** shove undated institutions to 2020–2026. Where a relationship provides some historical context, a node gets a visually inferred (non-factual) antecedent position; otherwise it stays in an undated start area. Such visual positions are not asserted as verified dates.

These counts describe the *curated prototype database*, not the entirety of Taiwan's architectural history. Sources and labels require continuing editorial fact-checking, particularly archive links and older multi-designer attributions.

## Research emphasis

1. **Award corpus** (1992–2025): works, designers and practice attribution based on entries in [《建築師》雜誌：歷屆得獎](https://www.twarchitect.org.tw/award_winner/). An award-source `year` is the **award year**, not the work's completion or firm's founding. Edition 03 uses separately sourced `chronology` records for known completion, opening, career and founding events. Some historical project titles are shortened for browsing; consult source listings for full archival names.
2. **Postwar practice**: architecture historians' accounts and National Taiwan Museum institutional history, including [戰後臺灣現代建築師譜系調查研究](https://nckur.lib.ncku.edu.tw/retrieve/466614/243946.pdf) and discussions of the 1967 建築金鼎獎.
3. **Education and careers**: historically attested architecture department chairs at NCKU and Tunghai, named alumni and graduated years, selective overseas education, past employers and university teaching relationships; based on [東海建築系](https://arch.thu.edu.tw/about/6/), [成大建築系](https://www.arch.ncku.edu.tw/cht/article/about.html), [姚仁喜事務所](https://krisyaoartech.com/zh-tw/team) and [郭旭原實踐大學官方履歷](https://www.arch.usc.edu.tw/scad/about/faculty/vis/hsu-yuan.html).
4. **Project contextual research**: richer essays from professional journals (not just award lists), including NTU Humanities Building, Shoushan Zoo, New Taipei City Art Museum, Pingtung Main Library, and Yilan's transport/civic infrastructure.
5. **Discourse**: selected journals, exhibitions and history publications, not yet a full bibliography nor a validated influence graph.


## Edition 03: chronological architectural genealogy

**Reason for the change:** the original graphic positioned `year: null` schools and employers in a late 'undated' cluster, so established schools such as Tamkang appeared after 2020. It also used award years as if they were project completion dates and placed several architect nodes on the same date as their buildings.

**New arrangement:** schools and documented educational affiliations are upstream; employment and career episodes lead towards the architect's local practice; the firm's documented founding or first recorded association precedes its projects; buildings are ordered by **confirmed completion / opening** years where established. For other entries, the chart uses a conditional relationship-context placement for legibility and describes that as **not** a verified historical date. Do not treat a diagrammatic positional constraint as a new claim of founding, graduation or historical influence.

**Case-study trace:** click **黃聲遠** at `#entity=huang`, or use **HIGHLIGHTS → Sheng-Yuan Huang / Career sequence**. The evidence-based chronological panel shows:

| Time | Record | Attribution and source |
| --- | --- | --- |
| 1986 | 東海大學建築系, B.Arch | 2018 Taiwan Pavilion research booklet; Rice Architecture biography |
| 1991 | 耶魯大學, M.Arch | Same |
| 1991 / before return in 1993 | Eric Owen Moss Architects, Project Associate | Taiwan Pavilion booklet (precise end date not established) |
| Before 1993 | North Carolina State University teaching | Taiwan Pavilion booklet, exact years not established |
| 1993 | Huang returns to Taiwan | Taiwan Pavilion booklet |
| 1994 | 田中央 established in Yilan | Taiwan Pavilion booklet / TOTO Gallery MA biographical record |
| 2012 trial / 2013 regular operation | 羅東文化工場 | Luodong Cultural Working House official institutional history |
| 2014 completed / 2015 opened | 雲門劇場 | Central News Agency completion report / Cloud Gate Dance Theatre official website |

Notice that **Yale University and Eric Owen Moss Architects are both connected to Huang**, **not** directly to one another. Their order in a person-centered chronology does not imply a relationship between those institutions.

**Tamkang Architecture:** established in **1964**, supported by the department's historical documentation. The institution's foundation appears in the historical 1960s context rather than in the right-hand 2020s.

**Source-first date semantics:** `n.chronology = {year, basis, label, source}` records a factually supported event. `_diagramYear` is a client-derived visual placement and should never be cited as founding/completion date if `_placementBasis === "relationship-context"`. Original `n.year` is retained for source records such as award years. For a school, `education-context` may locate the school near a known educational connection, **not** its institutional founding.



## Relation grammar edition — 2026-10-11

A distinction absent from earlier editions is now implemented: **relation types are part of the visual encoding**, not merely a list in an information panel.

- **Studied at / 就讀・畢業** — blue dashed lines; only documented degree or alumni statements.
- **Taught at / 任教** — pale blue dotted lines; not equivalent to graduating from a school.
- **Led / 主持** — amber solid line for department heads and leadership.
- **Founded / 創辦** — green solid line for a documented founding relationship.
- **Worked at / 任職** — ochre dashed line for explicit employment history.
- **Associated with / 關聯** — neutral dotted line if the source establishes some association but not a founder/employment claim.
- **Collaborated with / 合作** — light green line when the existing source text explicitly describes collaboration.
- **Designed / 設計** — violet solid line from named designer or design firm to the building/work.
- Further codes are available for technical contributions, publications, awards, site context, hosting and curatorial research.

Selection now shows a **grouped relationship panel** with the category header, target node, actual source-backed claim, event date where supported, *date kind* and clickable reference IDs; the graph shows matching colored line styles and local link captions. The graph has a persistent clickable legend to enable/disable particular semantic types; FILTER includes every available relation type.

The display also distinguishes **AWARD YEAR** from **GRADUATED**, **FOUNDED**, **EMPLOYMENT** and **BUILDING EVENT**. 175 relationships currently refer to award-year documentation; a dated award listing must not be mistaken for a completion-year statement.

### Present limits

This is still a **selective research dataset**, not the equivalently detailed biography corpus shown in Kyle Miller's example. In the current 334 source-linked relations, many are project/design associations and relatively few encode direct collaboration, employment, degree histories or authored publications. In particular, *Wrote* will only appear where a source actually verifies an authorship relationship; the site does not manufacture book–author or mentor–student links for visual symmetry. General `associated` links remain labeled broadly until stronger evidence establishes a more precise type.

The screenshot-based Kyle-inspired design uses distinct colors and dash patterns; it is an independent implementation, not copied code or data.


## Navigation and interactions

- Search by Traditional Chinese/English names; press `/` for immediate focus.
- Mouse drag to pan; wheel to zoom; `FIT VIEW` resets.
- Click a node to focus its documented local connections, see descriptions and original source URLs; its panel includes clickable **CHRONOLOGICAL RELATIONSHIPS**, when enough dated events are available.
- FILTER by people, firms, institutions, buildings, publications, events; independently limit relationship types and history year.
- HIGHLIGHTS are predefined introductory research threads, not verified intellectual lineages.
- COMPARE two nodes for the shortest **documented** path and common immediate neighbors. A path reflects only records present here; it does **not** establish mentoring, causation or historical influence.
- NIGHT view, direct URL to a selected node (`#entity=<id>`), CSV export, Guide and About.
- Mobile devices keep the interactive map with horizontally scrollable controls. This is not yet a complete accessible nonvisual directory.

## Implementation

Pure browser-native frontend — **no package manager or build step required**.

| File | Role |
| --- | --- |
| `index.html` | Site navigation, floating panels and canvas |
| `atlas-v2.css` | Responsive visual design |
| `atlas-v2.js` | Canvas rendering, focus, search, filters, comparison, exports |
| `data.js` | Initial museum/practice/works records |
| `expanded-data.js` | Architectural award corpus / journals |
| `academic-data.js` | Postwar academic historiography, schools and historical awards |
| `editorial-data.js` | Contextual journal-based analyses of individual works |
| `education-data.js` | Alumni, advanced education, career bridges |
| `lineage-bridges.js` | Verified graduation years and cross-office links |
| `chronology-data.js` | Source-backed founding / study / career / completion dates, Huang Sheng-yuan example |\n| `relationship-grammar.js` | Evidence-aware link semantics, readable colors/dashes, date event types |\n| `README.md` | Research and editorial guidelines |

Assets from the older first prototype (`styles.css` and `app.js`) are retained but no longer loaded.

## Editorial rules for contributions

- **Always provide an exact attributed claim and original source**; ideally add dates with their true meanings and linked independent corroboration where available.
- Differentiate `design`, `affiliation`, `education`, `client`, `recognition`, `curatorial`, `context` and `engineering` and use edge labels to state exact facts. A shared degree-granting institution, award or workplace is not necessarily mentorship.
- Record `year: null` if the reference year is unknown; *do not invent approximate graduation years or firm establishment dates*. Some old award list-derived event-year anchors are only visual references; consult the record descriptions.
- Keep historically ambiguous design authorship explicit. Credit local executive architects, collaborators and engineering teams, where documented.
- Institution and publication nodes should not be interpreted as personal lineage without citations.
- Respect original photographers' and archives' reproduction rights. Current interface uses generated Canvas shapes, not scraped unlicensed photos.
- The network is intentionally incomplete. Absence of a connection does not imply the absence of a real-world relationship.
- Edit via a GitHub PR or issue with the exact claim, relationship type, start/end dates if documented, and publicly accessible evidence.

## Validation

On 2026-10-11: syntax checks across all JS modules, dataset assembly, unique node/source IDs, valid edge endpoints, typed relationships and resolvable source IDs were tested; numerical x-order of all design relationships and the Huang example were also checked. **No in-browser cross-device test or live GitHub Pages publication validation was available during this build.** Source websites may change; links and older credits should be audited during subsequent scholarship.

## Suggested next research directions

- Chronological educational and employment network from oral histories, verified CVs and alumni rosters; don't infer teacher–student relations.
- Women practitioners, landscape architects, public-sector planning and Indigenous building culture (currently underrepresented).
- Further periodicals, research papers and architecture exhibition lineages.
- Expand under-covered periods including Japanese colonial built heritage and earlier architectural histories; be explicit about disciplinary boundaries and periodization.
- Community-reviewed factual corrections and source health checks, then searchable bibliography / structured export.
