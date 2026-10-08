#!/usr/bin/env python3
"""Safely synchronize Hao Chang's GitHub Pages portfolio.

COMPATIBLE WITH: project-updates.py (October 2026 naming catalogue),
                 index.html, style.css, app.js and existing project pages.

The former build.py regenerated every HTML page from templates. That could
silently DELETE later manual edits (especially video embeds and narrative
revisions). This edition deliberately uses the existing HTML pages as the
source of truth for editorial content, and updates only:

* The eleven Grid and Index entries on the homepage, from project-updates.py.
* Each project's document <title> and first <h1>.
* The heading of the Next Project link, where present.
* 404.html, only if it was an exact mirror of index.html before the update.

Research pages, Info, images, videos, descriptions, figures, credits, custom
sections, CSS and JavaScript are untouched. It is an INCREMENTAL site builder,
not a destructive from-scratch recreation of the entire website.

Usage:
    python build.py                 # Update local HTML files
    python build.py --dry-run       # Preview affected file names
    python build.py --check         # CI verification; nonzero if stale
    python build.py --root ./site   # Build in another copy of the repo

The script uses only the Python standard library.
"""

from __future__ import annotations

import argparse
from html import escape
from pathlib import Path
import re
import sys
from typing import Any


# ---------------------------------------------------------------------------
# 1. Base catalogue. Existing project-updates.py enriches these nine entries
#    and adds the two separately documented 2025 projects. Maintain original
#    image identifiers and core credits for backward compatibility.
# ---------------------------------------------------------------------------

BASE_PROJECTS: list[dict[str, str]] = [
    dict(slug="rising-tides", name="Rising Tides, Resilient Lives", image="jakarta-hero",
         year="2025", place="Jakarta, Indonesia", field="Water / Collective life",
         type="Architecture & research", award="SOM China Fellowship — Winner",
         question="How can flood-prone infrastructure become a civic sanctuary?",
         credit="Individual project · Hao Chang<br>Instructor: Martijn de Geus<br>"
                "Kampung Melayu, Jakarta · February–March 2025"),
    dict(slug="erdai", name="Erdai Art Museum", image="erdai-hero", year="2024",
         place="Penghu, Taiwan", field="Memory / Landscape",
         type="Architecture & adaptive reuse", award="",
         question="How can a landscape of defence become a place of reflection?",
         credit="Individual studio project · Hao Chang<br>Instructor: Li Xiaodong<br>"
                "Penghu, Taiwan · September–October 2024"),
    dict(slug="spirited-a-way", name="Spirited A Way", image="kailash-hero",
         year="2024", place="Ngari, Tibet", field="Ritual / Ecology",
         type="Architecture & landscape", award="",
         question="How much architecture does a sacred landscape need?",
         credit="Collaborative studio · Hao Chang & Mengzhe Lee<br>"
                "Hao's role: research, modeling, renderings, and diagrams<br>"
                "Instructor: Yue Cao · November–December 2024"),
    dict(slug="books-above-bustles", name="Books Above Bustles", image="books-section",
         year="2024", place="Beijing, China", field="Knowledge / Infrastructure",
         type="Civic architecture", award="",
         question="Can a library reconnect a city?",
         credit="Collaborative studio · Hao Chang & Mengzhe Lee<br>"
                "Hao's role: lead concept, diagrams, modeling, and sections<br>"
                "Instructor: Martijn de Geus · April–June 2024"),
    dict(slug="teaching-building", name="Learning Beyond the Classroom", image="teaching",
         year="2024–", place="Beijing, China", field="Learning / Adaptive reuse",
         type="Competition & commission", award="",
         question="What if circulation space became a place to stay?",
         credit="Competition proposal: Hao Chang & Mengzhe Lee, 2024<br>"
                "Hao's role: concept, modeling, renderings<br>Instructor: Martijn de Geus"),
    dict(slug="their-story", name="Their Story", image="their-story", year="2024",
         place="Hong Kong", field="Community / Fieldwork",
         type="Community research", award="",
         question="How can everyday stories become a shared cultural record?",
         credit="Hong Kong Eastern District Community Calendar Project<br>"
                "Field research sponsored by Swire Properties<br>August–December 2024"),
    dict(slug="selected-studies", name="Selected Studies", image="photo",
         year="2017–2024", place="Across media", field="Body / Image / Material",
         type="Art & performance", award="",
         question="Other ways of observing, making, and inhabiting.",
         credit="Selected work by Hao Chang<br>Performance photographs document "
                "collaborative productions; roles are identified in captions."),
    dict(slug="ancient-trails", name="Ancient Trails and Their Possible Futures",
         image="gaoligong-project", year="2026", place="Gaoligong Mountain, Yunnan",
         field="Heritage / Production / Ecology",
         type="Graduation design & territorial research",
         award="Tsinghua Outstanding Graduation Thesis",
         question="Can a trail reconnect the livelihoods and landscapes it once sustained?",
         credit="Graduation research and design · Hao Chang<br>"
                "Tsinghua University / Politecnico di Torino collaboration · 2025–2026<br>"
                "Exhibited at Castello del Valentino, Turin · April 2026"),
    dict(slug="waterfront-plus", name="Waterfront+", image="shichahai-plan",
         year="2024", place="Shichahai, Beijing", field="Water / Heritage / Public life",
         type="Urban design & heritage renewal",
         award="China Human Settlements Academic Year Award — Gold Medal, 2025",
         question="How can the waterfront reconnect with the neighbourhood behind it?",
         credit="Collaborative design · Hao Chang & Mengzhe Lee<br>"
                "Shichahai, Beijing · 2024<br>"
                "Drawings reproduced from the original three project boards."),
]


# ---------------------------------------------------------------------------
# 2. Catalogue loading. Execute the existing project-updates.py against its
#    expected `projects` variable rather than duplicating the 11 titles here.
# ---------------------------------------------------------------------------

def load_projects(root: Path) -> list[dict[str, Any]]:
    patch = root / "project-updates.py"
    if not patch.is_file():
        raise FileNotFoundError(f"Missing catalogue file: {patch}")

    projects: list[dict[str, Any]] = []
    for item in BASE_PROJECTS:
        project = dict(item)
        project.setdefault("id", "00")
        project.setdefault("title", project["name"])
        project.setdefault("desc", "")
        projects.append(project)

    context: dict[str, Any] = {"projects": projects}
    exec(compile(patch.read_text(encoding="utf-8"), str(patch), "exec"), context)
    projects = context["projects"]

    if len(projects) != 11:
        raise ValueError(f"Expected exactly 11 projects, got {len(projects)}")
    if len({p["slug"] for p in projects}) != len(projects):
        raise ValueError("Project slugs must be unique")
    for index, p in enumerate(projects, 1):
        needed = ("id", "slug", "name", "subtitle", "place", "field",
                  "recognition", "year", "type")
        missing = [key for key in needed if key not in p]
        if missing:
            raise KeyError(f"Project {p.get('slug')} missing: {missing}")
        if p["id"] != f"{index:02d}":
            raise ValueError(f"Invalid catalogue ordering at {p['slug']}")
        if not re.fullmatch(r"[a-z0-9-]+", str(p["slug"])):
            raise ValueError(f"Unsafe project slug: {p['slug']}")
    return projects


def e(value: object) -> str:
    """Escape an HTML text node or attribute safely."""
    return escape(str(value), quote=True)


# ---------------------------------------------------------------------------
# 3. HTML region tools. Match nested containers without reformatting the
#    rest of the manually edited HTML document.
# ---------------------------------------------------------------------------

DIV_TOKEN = re.compile(r"<(/?)div\b[^>]*>", re.IGNORECASE | re.DOTALL)
ARTICLE = re.compile(r"<article\b[^>]*\bproject-card\b[^>]*>.*?</article>",
                     re.IGNORECASE | re.DOTALL)
IMAGE_LINK = re.compile(
    r'<a\b(?=[^>]*class=["\'][^"\']*\bproject-image\b)[^>]*>.*?</a>',
    re.IGNORECASE | re.DOTALL,
)
HREF = re.compile(r'\bhref\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
PREVIEW_ATTR = re.compile(r'\bdata-preview\s*=\s*["\']([^"\']+)["\']',
                          re.IGNORECASE)


def find_div_by_id(html: str, element_id: str) -> tuple[int, int, str]:
    """Return offsets including the outer <div> and its matching </div>."""
    start = re.search(
        r'<div\b(?=[^>]*\bid\s*=\s*["\']' + re.escape(element_id) +
        r'["\'])[^>]*>', html, re.IGNORECASE | re.DOTALL,
    )
    if not start:
        raise ValueError(f"Cannot locate <div id={element_id!r}> in index.html")
    depth = 1
    for token in DIV_TOKEN.finditer(html, start.end()):
        depth += -1 if token.group(1) else 1
        if depth == 0:
            return start.start(), token.end(), html[start.start():token.end()]
    raise ValueError(f"Unclosed <div id={element_id!r}> in index.html")


def existing_card_images(visual_html: str) -> dict[str, str]:
    """Preserve existing thumbnail markup, but never introduce new images."""
    images: dict[str, str] = {}
    for block in ARTICLE.findall(visual_html):
        image = IMAGE_LINK.search(block)
        if not image:
            continue
        href = HREF.search(image.group())
        if href and href.group(1).endswith(".html"):
            images[href.group(1).removesuffix(".html")] = image.group()
    return images


def existing_index_previews(index_html: str) -> dict[str, str]:
    previews: dict[str, str] = {}
    for anchor in re.finditer(r'<a\b[^>]*class=["\'][^"\']*\bindex-row\b[^>]*>',
                              index_html, re.IGNORECASE):
        href, preview = HREF.search(anchor.group()), PREVIEW_ATTR.search(anchor.group())
        if href and preview and href.group(1).endswith(".html"):
            previews[href.group(1).removesuffix(".html")] = preview.group(1)
    return previews


# ---------------------------------------------------------------------------
# 4. Grid and Index markup. Identical source fields in both views.
# ---------------------------------------------------------------------------

def render_card(p: dict[str, Any], preserved_image: str = "") -> str:
    slug = e(p["slug"])
    recognition = (
        f'\n        <p class="recognition">{e(p["recognition"])}</p>'
        if p["recognition"] else ""
    )
    image = f"\n    {preserved_image}" if preserved_image else ""
    return f'''  <article class="project-card card-{e(p["id"])}">{image}
    <div class="card-caption">
      <span class="eyebrow">{e(p["id"])}</span>
      <div>
        <h2><a href="{slug}.html">{e(p["name"])}</a></h2>
        <p class="project-subtitle">{e(p["subtitle"])}</p>
        <p class="project-context">{e(p["place"])} / {e(p["field"])}</p>{recognition}
      </div>
      <span class="year">{e(p["year"])}</span>
    </div>
  </article>'''


def render_row(p: dict[str, Any], preview: str = "") -> str:
    recognition = (
        f'\n        <p class="recognition">{e(p["recognition"])}</p>'
        if p["recognition"] else ""
    )
    preview_attr = f' data-preview="{e(preview)}"' if preview else ""
    return f'''  <a class="index-row" href="{e(p["slug"])}.html"{preview_attr}>
    <span>{e(p["id"])}</span>
    <div class="index-project">
      <h2>{e(p["name"])}</h2>
      <p class="project-subtitle">{e(p["subtitle"])}</p>{recognition}
    </div>
    <span>{e(p["place"])}</span>
    <span>{e(p["field"])}</span>
    <span>{e(p["year"])}</span>
  </a>'''


def update_home(html: str, projects: list[dict[str, Any]]) -> str:
    v_start, v_end, old_visual = find_div_by_id(html, "visual-view")
    _i_start, _i_end, old_index = find_div_by_id(html, "index-view")
    images = existing_card_images(old_visual)
    previews = existing_index_previews(old_index)

    visual = ('<div id="visual-view" class="editorial-grid">\n' +
              '\n'.join(render_card(p, images.get(p["slug"], "")) for p in projects) +
              '\n</div>')
    index = ('''<div id="index-view" hidden>
  <div class="index-head">
    <span>No.</span><span>Project</span><span>Place</span>
    <span>Territory</span><span>Year</span>
  </div>
''' + '\n'.join(render_row(p, previews.get(p["slug"], "")) for p in projects) +
             '\n</div>')

    # Replace in reverse offset order, preserving everything outside the two
    # containers (hero, header, custom styles, scripts, closing statement).
    spans = [(v_start, v_end, visual), (_i_start, _i_end, index)]
    for start, end, new_html in sorted(spans, key=lambda x: x[0], reverse=True):
        html = html[:start] + new_html + html[end:]

    # This style-independent header adjustment supports a future larger list.
    html = re.sub(r'(Selected projects\s*<span>\s*\()\d+(\)\s*</span>)',
                  lambda m: m.group(1) + str(len(projects)) + m.group(2),
                  html, count=1, flags=re.IGNORECASE)
    return html


# ---------------------------------------------------------------------------
# 5. Project headings ONLY — never regenerate editorial sections or videos.
# ---------------------------------------------------------------------------

def update_detail(html: str, project: dict[str, Any],
                  by_slug: dict[str, dict[str, Any]]) -> str:
    title = e(project["name"])
    # The browser tab title, not chapter titles or embedded media titles.
    html = re.sub(r"(<title\b[^>]*>).*?(</title>)",
                  lambda m: m.group(1) + title + " — Hao Chang" + m.group(2),
                  html, count=1, flags=re.IGNORECASE | re.DOTALL)

    # Only the <h1> in the project-top block; its contents may contain <br>.
    top = re.search(r'<div\b[^>]*class=["\'][^"\']*\bproject-top\b[^"\']*["\'][^>]*>',
                    html, re.IGNORECASE)
    if not top:
        raise ValueError(f"Missing project-top in {project['slug']}.html")
    heading = re.search(r'<h1\b[^>]*>.*?</h1>', html[top.end():],
                        flags=re.IGNORECASE | re.DOTALL)
    if not heading:
        raise ValueError(f"Missing project h1 in {project['slug']}.html")
    start, end = top.end() + heading.start(), top.end() + heading.end()
    old_heading = html[start:end]
    updated_heading = re.sub(r"(?<=>).*?(?=</h1>)", title, old_heading,
                             count=1, flags=re.DOTALL)
    html = html[:start] + updated_heading + html[end:]

    # Update only label within an existing next-project link, not its image,
    # route, caption, scene contents, or custom animation.
    next_link = re.compile(
        r'(<a\b[^>]*class=["\'][^"\']*\bnext-project\b[^"\']*["\'][^>]*>)'
        r'(.*?)(</a>)', re.IGNORECASE | re.DOTALL,
    )

    def update_next(match: re.Match[str]) -> str:
        opening, content, closing = match.groups()
        dest = HREF.search(opening)
        if not dest:
            return match.group()
        destination = dest.group(1).split("?", 1)[0].split("#", 1)[0]
        destination_slug = Path(destination).stem
        target = by_slug.get(destination_slug)
        if not target:
            return match.group()
        content = re.sub(r'(<h2\b[^>]*>).*?(</h2>)',
                         lambda m: m.group(1) + e(target["name"]) + m.group(2),
                         content, count=1, flags=re.IGNORECASE | re.DOTALL)
        return opening + content + closing

    return next_link.sub(update_next, html, count=1)


# ---------------------------------------------------------------------------
# 6. Safe write, dry-run and continuous integration checks.
# ---------------------------------------------------------------------------

def write_if_changed(path: Path, new: str, old: str, *, dry_run: bool) -> bool:
    if new == old:
        return False
    print(("WOULD UPDATE" if dry_run else "UPDATED"), path.name)
    if not dry_run:
        path.write_text(new, encoding="utf-8")
    return True


def build(root: Path, *, dry_run: bool = False) -> int:
    projects = load_projects(root)
    by_slug = {p["slug"]: p for p in projects}
    homepage = root / "index.html"
    if not homepage.is_file():
        raise FileNotFoundError(f"Missing homepage: {homepage}")

    # Preflight: if a required page is missing, fail before touching any file.
    required = [root / f"{p['slug']}.html" for p in projects]
    missing = [p.name for p in required if not p.is_file()]
    if missing:
        raise FileNotFoundError("Missing project pages: " + ", ".join(missing))

    current_home = homepage.read_text(encoding="utf-8")
    next_home = update_home(current_home, projects)
    changes: list[tuple[Path, str, str]] = [(homepage, current_home, next_home)]

    for project, path in zip(projects, required):
        current = path.read_text(encoding="utf-8")
        updated = update_detail(current, project, by_slug)
        changes.append((path, current, updated))

    # On the published site 404.html sometimes mirrors index.html exactly.
    # Only update that duplicate when it still matches the old homepage.
    fallback = root / "404.html"
    if fallback.is_file():
        existing_404 = fallback.read_text(encoding="utf-8")
        if existing_404 == current_home:
            changes.append((fallback, existing_404, next_home))

    changed = 0
    for path, old, new in changes:
        changed += int(write_if_changed(path, new, old, dry_run=dry_run))
    print(f"Catalogue: {len(projects)} projects | Changed: {changed} files")
    print("Research, Info, assets, videos, captions, CSS and JS: untouched")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent,
                        help="Root folder containing project-updates.py and index.html")
    exclusive = parser.add_mutually_exclusive_group()
    exclusive.add_argument("--dry-run", action="store_true", help="List changes without writing")
    exclusive.add_argument("--check", action="store_true", help="Exit 1 if files need changes")
    args = parser.parse_args()
    try:
        changed = build(args.root.resolve(), dry_run=args.dry_run or args.check)
    except (OSError, ValueError, KeyError, SyntaxError) as exc:
        print(f"Build failed safely: {exc}", file=sys.stderr)
        return 2
    if args.check and changed:
        print("Site is out of sync. Run: python build.py")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
