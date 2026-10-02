# Hao Chang — Architecture & Research

Personal website: https://arc-hao-0215.github.io/

Projects, research, and selected studies by Hao Chang. This is a static website with locally stored images extracted from the supplied portfolio.

## Editing

Edit `build.py` for project content, then run `python build.py` to regenerate the HTML pages. Edit `style.css` for styling and `app.js` for interactions. Individual images and the downloadable CV are in `assets/`. Original portfolio image sources are recorded in `asset-sources.json`.

GitHub Pages serves the `main` branch from the repository root. Changes published to `main` update the website automatically.

## Credits

Project authorship and collaborators are recorded on each project page. All architectural and artistic work remains the property of its respective authors. No reuse license is granted by this repository.

## Research and homepage

`research-content.py` holds the separate research essays and generates their article pages and geographic index. The essays interpret the supplied portfolio; they do not claim independent publication or measured outcomes. The homepage rotates four portfolio photographs while retaining the introduction. Autoplay pauses on hover/focus, supports an explicit pause control, and respects reduced-motion preferences.

The atlas uses locally stored Natural Earth 1:110m land geometry (`assets/world-land.geojson`), public domain: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson. This generalized basemap supports a geographic research index, not street-level navigation. Use the map controls, drag, pinch, or keyboard (+/−, arrows, Home). Ctrl/⌘ + scroll zooms without intercepting ordinary page scrolling.
