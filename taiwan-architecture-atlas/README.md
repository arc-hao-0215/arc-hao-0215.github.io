# 臺灣建築關係圖譜 / Taiwan Architecture, All Connected

A standalone GitHub Pages research prototype inspired by the **time × geography × network** method of [Architecture All At Once](https://architectureallatonce.com/). The Taiwanese research database, code, interface and editorial selections are independently authored.

**Public path:** https://arc-hao-0215.github.io/taiwan-architecture-atlas/

## Scope & current baseline
- Architecture culture in post-1945 Taiwan, including earlier-born architects active in Taiwan and documented international collaborators.
- 51 source-linked entities in seven classes: person, office, school, institution, building, publication and collective.
- 58 evidence-linked typed relationships.
- Each node has a stable ID, a Chinese and English label, a research region, summary, reference URLs, and a year or `null`.
- 19 records currently have no sufficiently verified date. These intentionally appear in a separate **年份待考 / YEAR UNKNOWN** area.

This is a **curated first sample**, not an exhaustive directory, professional ranking or inference engine.

## Files

| File | Purpose |
|---|---|
| `index.html` | Accessible bilingual visual interface; search, filters, highlights, story paths, details |
| `style.css` | Layout, typography, responsive and dark mode design |
| `app.js` | Dependency-free interactive SVG time × region graph, wheel zoom, drag pan, source drawer |
| `data.js` | Standalone typed nodes and relation records and citation URLs |
| `methodology.html` | Citation policy, selection criteria, date conventions, interpretation and limitations |

## How to add a researched entity

Edit **`data.js`**. Add a `nodes` record using the existing format:

```js
{
  id: "stable-slug",
  name: "正式中文名稱",
  english: "Documented Romanization",
  type: "person",                 // one of metadata's declared types
  year: null,                    // birth year for people, never infer
  region: "central",             // north / central / south / east / trans
  summary: "可考證的一句簡介",
  sources: ["https://source.example/verified-biography"]
}
```

Then add an evidence-backed relationship as a separate record:

```js
{
  id: "unique-relation-id",
  from: "stable-slug",
  to: "another-existing-id",
  type: "education",             // relation types are defined in data.js
  label: "曾任教",
  source: "https://source.example/reliable-record",
  year: 1980                     // optional: use null when undated
}
```

Never add a person-to-person edge based only on co-location, stylistic resemblance or adjacent years. A building's architect, partners and consultant roles should be distinguished when primary sources permit. Don't insert a birth year purely to force a node onto the time axis.

## Display semantics
- **X axis:** people's birth year; other entities' documented event/completion/publication year.
- **Y axis:** a single editorial geographic band for the node's Taiwan-related practice or location. It is *not* birthplace or citizenship.
- **Undated:** right-hand holding area, not the current year or inferred year.
- **Lines:** specific asserted relations with linked supporting sources, not universal causation or influence.
- **Highlights:** hand-curated reading groups, independent of filters. Not algorithmically calculated centrality.

## Testing
- Check `new Function(appJsSource)` and `new Function(dataJsSource)` for syntax.
- Ensure node IDs are unique; all `edge.from` / `edge.to` resolve.
- Ensure every node has at least one citation URL and every relation has a source URL.
- Check desktop/mobile, keyboard Enter, Escape, / to search, panning, zooming, filter and highlight combinations.
- Confirm GitHub Actions **pages build and deployment** succeeded after publishing changes.

## Long-term research improvements
Document institution histories and start/end dates, separate office roles from personal credits, include more community and regional practitioners, add evidence reliability tiers, version history and provenance per claim, and assess coverage bias and inclusion criteria before expanding aggressively.

Images from third parties are deliberately not republished here. Original publishers retain copyright. No backend services or site visitor account is required.
