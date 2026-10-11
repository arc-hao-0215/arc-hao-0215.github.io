# Architecture in Taiwan, All at Once / 臺灣建築關係圖譜

**Research edition 02 — updated 2026-10-11**

Live GitHub Pages path (subject to Pages publishing): **https://arc-hao-0215.github.io/taiwan-architecture-atlas/**

An independent, experimental, source-linked network atlas of Taiwan's architectural culture. Inspired by the interaction and visual-density concept of Kyle Miller's *Architecture All At Once, Right Now* (https://architectureallatonce.com/). No source code, images, archival data, identity assets or visual files have been copied from that project.

The previous three-column dashboard has been replaced by a full-window, zoomable/pannable Canvas network with minimalist black-on-off-white information design, nuanced node styling, thin curved connections and floating research tools.

## Dataset in this edition

- **364 entities**: 97 people, 89 practices, 18 institutions, 148 buildings/projects, 10 publications, 2 exhibition/award events.
- **333 typed relationships**. Every relationship records at least one source ID that resolves to a source URL; these are documented links, not stylistic similarity or inferred mentorship.
- **48 linked bibliography/reference records** across government archives, university histories, architectural practices, award registers, journal feature essays and relevant academic research.
- **34 entities explicitly marked undated** where the research record does not establish an adequate date. The timeline presents these in an UNDATED right-hand group instead of fabricating graduation/founding years.

These counts describe the *curated prototype database*, not the entirety of Taiwan's architectural history. Sources and labels require continuing editorial fact-checking, particularly archive links and older multi-designer attributions.

## Research emphasis

1. **Award corpus** (1992–2025): works, designers and practice attribution based on entries in [《建築師》雜誌：歷屆得獎](https://www.twarchitect.org.tw/award_winner/). The node's `year` refers to the **award year**, not the work's completion or firm's founding. Some historical project titles are shortened for browsing; consult source listings for full archival names.
2. **Postwar practice**: architecture historians' accounts and National Taiwan Museum institutional history, including [戰後臺灣現代建築師譜系調查研究](https://nckur.lib.ncku.edu.tw/retrieve/466614/243946.pdf) and discussions of the 1967 建築金鼎獎.
3. **Education and careers**: historically attested architecture department chairs at NCKU and Tunghai, named alumni and graduated years, selective overseas education, past employers and university teaching relationships; based on [東海建築系](https://arch.thu.edu.tw/about/6/), [成大建築系](https://www.arch.ncku.edu.tw/cht/article/about.html), [姚仁喜事務所](https://krisyaoartech.com/zh-tw/team) and [郭旭原實踐大學官方履歷](https://www.arch.usc.edu.tw/scad/about/faculty/vis/hsu-yuan.html).
4. **Project contextual research**: richer essays from professional journals (not just award lists), including NTU Humanities Building, Shoushan Zoo, New Taipei City Art Museum, Pingtung Main Library, and Yilan's transport/civic infrastructure.
5. **Discourse**: selected journals, exhibitions and history publications, not yet a full bibliography nor a validated influence graph.

## Navigation and interactions

- Search by Traditional Chinese/English names; press `/` for immediate focus.
- Mouse drag to pan; wheel to zoom; `FIT VIEW` resets.
- Click a node to focus its documented local connections, see descriptions and original source URLs.
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
| `README.md` | Research and editorial guidelines |

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

On 2026-10-11: syntax checks across all JS modules, dataset assembly, unique node/source IDs, valid edge endpoints, typed relationships and resolvable source IDs were tested. **No in-browser cross-device test or live GitHub Pages publication validation was available during this build.** Source websites may change; links and older credits should be audited during subsequent scholarship.

## Suggested next research directions

- Chronological educational and employment network from oral histories, verified CVs and alumni rosters; don't infer teacher–student relations.
- Women practitioners, landscape architects, public-sector planning and Indigenous building culture (currently underrepresented).
- Further periodicals, research papers and architecture exhibition lineages.
- Expand under-covered periods including Japanese colonial built heritage and earlier architectural histories; be explicit about disciplinary boundaries and periodization.
- Community-reviewed factual corrections and source health checks, then searchable bibliography / structured export.
