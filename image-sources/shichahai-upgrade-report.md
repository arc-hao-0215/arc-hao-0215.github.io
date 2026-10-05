# Waterfront+ image replacement report

Prepared before committing. KiB = 1024 bytes.

## Corresponding images

| Asset | Old full/lightbox file | New original | New full/lightbox file |
|---|---|---|---|
| shichahai-plan | 820 × 973; lossy WebP; 265,472 bytes | 总平面图.jpg | 1976 × 2356; lossless WebP; 4,259,552 bytes |
| shichahai-section | 822 × 242; lossy WebP; 10,988 bytes | 图10 南区首层平面图&剖面图.jpg | 3957 × 774; lossless WebP; 433,548 bytes |

The south section corresponds to the same architectural section in the supplied original raster export. Its labels and framing differ from the old board image. The section rectangle (68, 2054)–(4025, 2828) is isolated directly from the original JPEG; no PDF or preview is used. Its inline display box retains the previous aspect ratio, using contain without stretching.

## Responsive derivatives

| File | Pixels | Format | Bytes | KiB |
|---|---|---|---:|---:|
| shichahai-plan-original-480.webp | 480 × 572 | Lossless WebP | 342,816 | 334.8 |
| shichahai-plan-original-960.webp | 960 × 1145 | Lossless WebP | 1,244,010 | 1214.9 |
| shichahai-plan-original-1440.webp | 1440 × 1717 | Lossless WebP | 2,567,128 | 2507.0 |
| shichahai-plan-original-1976.webp | 1976 × 2356 | Lossless WebP | 4,259,552 | 4159.7 |
| shichahai-section-original-800.webp | 800 × 156 | Lossless WebP | 30,366 | 29.7 |
| shichahai-section-original-1600.webp | 1600 × 313 | Lossless WebP | 89,422 | 87.3 |
| shichahai-section-original-2400.webp | 2400 × 469 | Lossless WebP | 188,604 | 184.2 |
| shichahai-section-original-3957.webp | 3957 × 774 | Lossless WebP | 433,548 | 423.4 |

The browser chooses inline files through srcset/sizes. The existing lightbox loads the largest variant when opened. Thumbnail references also use the new source. No upscaling. Lossless WebP does not reverse compression already present in the JPEG masters.

## Unmatched figures retained

| Existing image | Pixels | Format | Bytes | Reason |
|---|---|---|---:|---|
| shichahai-history | 408 × 240 | WebP | 24,214 | Historical timeline not supplied. |
| shichahai-analysis | 401 × 418 | WebP | 53,494 | Existing six-panel analysis differs from the supplied eight-panel annotated analysis. |
| shichahai-before-after | 821 × 178 | WebP | 49,724 | Existing ten-view before/after montage not supplied. |
| shichahai-seam | 819 × 240 | WebP | 53,448 | Existing two-panel diagram differs from the supplied landscape analysis. |
| shichahai-courtyard | 823 × 118 | WebP | 36,674 | Existing four-panel courtyard strategy strip not supplied; the landscape sheet is a different diagram. |

The Research article uses the history, analysis and courtyard figures. It remains unchanged because none of these has a direct matching export in this ZIP. Remaining originals are preserved but not inserted into the website.

## Preserved masters

Original ZIP: 1003LINK.zip — 277,916,839 bytes.
SHA-256: `5f3d77407932ff7b9946247866f7cf3383cd3e91efd6f670d4b505f24f1d3307`

The originally supplied archive remains unchanged and retains all 16 masters. The website repository stores derivatives, this report, a checksum inventory and a reproducible preparation script.

| Original | Pixels | Format | Bytes |
|---|---|---|---:|
| p2-1 研究框架.jpg | 8328 × 5041 | JPEG | 2,988,462 |
| 分析圖.jpg | 3508 × 2230 | JPEG | 1,898,819 |
| 商业-地百.jpg | 5760 × 3654 | JPEG | 18,713,681 |
| 图10 南区首层平面图&剖面图.jpg | 4093 × 2894 | JPEG | 6,682,660 |
| 图4场地微观议题分析.jpg | 4093 × 2119 | JPEG | 1,087,352 |
| 图8 微观空间再生设计导则.jpg | 2514 × 2894 | JPEG | 1,081,408 |
| 图9 北区首层平面图&剖面图.jpg | 4093 × 2894 | JPEG | 6,764,369 |
| 大轴测.jpg | 14998 × 8284 | JPEG | 55,919,658 |
| 总平面图.jpg | 1976 × 2356 | JPEG | 1,563,973 |
| 文化-浅水池.jpg | 5760 × 3654 | JPEG | 16,035,768 |
| 文化-火神庙.jpg | 5760 × 3654 | JPEG | 21,824,042 |
| 景观分析-01.jpg | 3508 × 2480 | JPEG | 54,519,633 |
| 概念分析-01.jpg | 14125 × 4283 | JPEG | 35,818,821 |
| 社区-书局.jpg | 5760 × 3654 | JPEG | 21,058,566 |
| 社区-书局室外.jpg | 5760 × 3654 | JPEG | 20,766,485 |
| 社区-滨水.jpg | 5760 × 3654 | JPEG | 15,344,556 |

## Validation

- No prose, captions, navigation, CSS or JavaScript changed.
- Existing image slots and lightbox interaction retained.
- Shared site-plan thumbnails also update on the homepage, its 404 copy and the preceding project’s Next project link.
- Research page remains byte-for-byte unchanged.
- Full-resolution WebP pixels verified against decoded original or original crop.
- All 16 master hashes verified.
- Updated HTML text, element order and image references checked.
