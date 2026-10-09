# Portfolio Project Editorial Standard

Reference pages: **Lightly in the Forest** (`ancient-trails.html`) and **Disarming the Landscape** (`erdai.html`).

## One system, not one identical layout

Every project page should use the same editorial hierarchy, image caption system, rhythm, and structural grid. Images, technical plates, film, switches, and comparisons retain project-specific presentation.

### Shared tokens

| Element | Standard |
| --- | --- |
| Main content width | 1680px max, shared `--gutter` |
| Background | #f5f4f0 |
| Ink / secondary / rules | #181917 / #565852 / #d0cec8 |
| Accent (numbers and awards) | #8c332b |
| Project H1 | 50–88px, regular sans-serif |
| Project subtitle | 17–21px |
| Hero media height | clamp(380px, 52vw, 700px), mobile up to 520px |
| Chapter H2 | 35–45px |
| Subsection H3 | 25–30px |
| Prose | 16px / 1.75–1.78, Georgia / Times |
| Captions | 11px figure number, 13px label, 12px description |
| Chapter axis | 96px label + title + explanatory text |
| Major chapter breathing room | 76–108px, 56px on mobile |

### Standard reading order

1. Projects index + category / year
2. Project title + project subtitle + location / metadata
3. Hero media with figure number, label, context, and VIEW link
4. Project proposition: thesis at left, introduction at right
5. On-page chapter navigation
6. Major sections: chapter number / headline / explanatory text
7. Alternating custom illustration layouts, guided by **text left / image right** for editorial pairs
8. Scope & development, credits, next project

### Rules for illustrations

- Never crop, stretch, split or recompose a pre-laid-out architectural board, section, plan, axonometric or chart.
- `object-fit:contain` for complete drawings; `cover` only for photographic/rendered hero images or intentionally composed photographic scenes.
- Full-width studies, two-season comparisons, galleries, slide viewers, plan switches and lightboxes are permitted project-specific exceptions.
- Put the explanatory copy on the left for a two-column editorial pair. Keep the visual on the right, both aligned to the top; collapse to copy first on phones.
- Number captions in a consistent red accent; use the same title/description/zoom hierarchy. Do not invent new font sizes inside each page.

### Maintenance

Shared overrides are in `project-unified.css`, loaded **after page-local styles**, with versioned stylesheet URLs to avoid stale cached layouts. It is linked by seven pages:

- `rising-tides.html`
- `theater-design.html`
- `scaffold-of-care.html`
- `spirited-a-way.html`
- `books-above-bustles.html`
- `teaching-building.html`
- `waterfront-plus.html`

The two reference pages retain their carefully authored local presentation. `project-system.css` is an earlier baseline used on several pages; avoid adding further one-off overrides when a shared rule belongs in the new stylesheet.

**For a new project page:** reuse the layout conventions above and preferably extract common components into the shared system instead of creating a new visual grammar.
