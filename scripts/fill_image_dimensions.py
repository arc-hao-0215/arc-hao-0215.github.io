#!/usr/bin/env python3
"""Fill missing HTML img width/height from local asset headers without changing layouts.

Reads only sitemap-listed HTML pages, preserves image src, alt, styles, ordering,
captions and lazy-loading attributes. Remote images and undecodable assets remain
unchanged. Run with --check to report outstanding local images instead of writing.
"""
from __future__ import annotations

import argparse
import html
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

SITE = Path(__file__).resolve().parents[1]
IMG = re.compile(r"<img\b[^>]*>", re.IGNORECASE | re.DOTALL)
SRC = re.compile(r"""\bsrc\s*=\s*(["'])(.*?)\1""", re.IGNORECASE | re.DOTALL)
W = re.compile(r"""\bwidth\s*=\s*(["'])(.*?)\1""", re.IGNORECASE)
H = re.compile(r"""\bheight\s*=\s*(["'])(.*?)\1""", re.IGNORECASE)


def dimensions(path: Path) -> tuple[int, int] | None:
    try:
        ext = path.suffix.lower()
        if ext == ".svg":
            root = ET.parse(path).getroot()
            box = root.get("viewBox") or root.get("viewbox")
            if box:
                values = [float(x) for x in re.split(r"[\s,]+", box.strip())]
                if len(values) == 4 and values[2] > 0 and values[3] > 0:
                    return round(values[2]), round(values[3])
            def px(value: str | None) -> int | None:
                if not value:
                    return None
                m = re.fullmatch(r"([\d.]+)(?:px)?", value.strip())
                return round(float(m.group(1))) if m else None
            w, h = px(root.get("width")), px(root.get("height"))
            return (w, h) if w and h else None
        data = path.read_bytes()
        if data.startswith(b"\x89PNG\r\n\x1a\n") and len(data) >= 24:
            return struct.unpack(">II", data[16:24])
        if data[:3] == b"GIF" and len(data) >= 10:
            return struct.unpack("<HH", data[6:10])
        if data[:4] == b"RIFF" and data[8:12] == b"WEBP" and len(data) >= 30:
            kind = data[12:16]
            if kind == b"VP8X":
                return (1 + int.from_bytes(data[24:27], "little"),
                        1 + int.from_bytes(data[27:30], "little"))
            if kind == b"VP8 " and data[23:26] == b"\x9d\x01\x2a":
                return (int.from_bytes(data[26:28], "little") & 0x3FFF,
                        int.from_bytes(data[28:30], "little") & 0x3FFF)
            if kind == b"VP8L" and data[20] == 0x2F:
                a, b, c, d = data[21:25]
                return (1 + a + ((b & 0x3F) << 8),
                        1 + (b >> 6) + (c << 2) + ((d & 0x0F) << 10))
        if data.startswith(b"\xff\xd8"):
            i = 2
            sof = {0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF}
            while i < len(data) - 9:
                if data[i] != 0xFF:
                    i += 1
                    continue
                while i < len(data) and data[i] == 0xFF:
                    i += 1
                if i >= len(data):
                    break
                marker = data[i]
                i += 1
                if marker in (0xD8, 0xD9, 0x01) or 0xD0 <= marker <= 0xD7:
                    continue
                if marker == 0xDA:
                    break
                if i + 2 > len(data):
                    break
                length = int.from_bytes(data[i:i+2], "big")
                if length < 2 or i + length > len(data):
                    break
                if marker in sof:
                    h, w = struct.unpack(">HH", data[i+3:i+7])
                    return (w, h)
                i += length
    except (OSError, ValueError, IndexError, ET.ParseError, struct.error):
        return None
    return None


def local_image(src: str) -> Path | None:
    url = urlsplit(html.unescape(src))
    if url.scheme or url.netloc or src.startswith("//"):
        return None
    relative = unquote(url.path).lstrip("/")
    if not relative:
        return None
    p = (SITE / relative).resolve()
    if not p.is_relative_to(SITE) or not p.is_file():
        return None
    return p


def update_tag(match: re.Match[str], stats: dict[str, int]) -> str:
    tag = match.group(0)
    src = SRC.search(tag)
    if not src:
        return tag
    stats["images"] += 1
    has_w, has_h = bool(W.search(tag)), bool(H.search(tag))
    if has_w and has_h:
        return tag
    path = local_image(src.group(2))
    if not path:
        stats["external_or_missing"] += 1
        return tag
    size = dimensions(path)
    if not size or min(size) <= 0:
        stats["unsupported"] += 1
        return tag
    attrs = ("" if has_w else f' width="{size[0]}"') + ("" if has_h else f' height="{size[1]}"')
    stats["updated"] += 1
    end = tag.rfind("/>")
    if end != -1:
        return tag[:end] + attrs + tag[end:]
    end = tag.rfind(">")
    return tag[:end] + attrs + tag[end:]


def published_pages() -> list[Path]:
    sitemap = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    pages = []
    for loc in re.findall(r"<loc>(.*?)</loc>", sitemap):
        filename = urlsplit(html.unescape(loc)).path.rsplit("/", 1)[-1]
        path = SITE / filename
        if filename.endswith(".html") and path.is_file() and path not in pages:
            pages.append(path)
    return pages


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Report updates without writing; exit 1 when updates exist")
    args = parser.parse_args()
    changed_pages, totals = 0, {"images": 0, "updated": 0, "external_or_missing": 0, "unsupported": 0}
    for page in published_pages():
        source = page.read_text(encoding="utf-8")
        new = IMG.sub(lambda m: update_tag(m, totals), source)
        if source == new:
            continue
        changed_pages += 1
        print(f'{"WOULD UPDATE" if args.check else "UPDATED"} {page.name}')
        if not args.check:
            page.write_text(new, encoding="utf-8")
    print(f'Pages: {changed_pages}; img tags: {totals["images"]}; updated: {totals["updated"]}; remote/missing: {totals["external_or_missing"]}; unsupported: {totals["unsupported"]}')
    return 1 if args.check and changed_pages else 0


if __name__ == "__main__":
    raise SystemExit(main())
