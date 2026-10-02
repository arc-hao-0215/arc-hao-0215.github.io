"""Research publication renderer. Content and evidence live in research-studies.json."""
studies=json.loads((D/'research-studies.json').read_text())
def research_table(t):
 return '<div class="research-table-wrap" tabindex="0" aria-label="Research comparison table"><table class="research-table"><thead><tr>'+''.join(f'<th scope="col">{escape(h)}</th>' for h in t['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{escape(c)}</td>' for c in row)+'</tr>' for row in t['rows'])+'</tbody></table></div>'
def research_figure(name,caption):
 return f'<figure class="research-figure"><button class="zoom" data-zoom="assets/{name}.webp" aria-label="Enlarge research figure">{img(name,caption)}</button><figcaption>{escape(caption)}</figcaption></figure>'

# Geography is a navigation index. All locations are approximate, not site survey coordinates.
land=json.loads((D/'assets/world-land.geojson').read_text())
paths=[]
for f in land['features']:
 g=f['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
 for poly in polys:paths.append(' '.join('M'+'L'.join(f'{(lon+180)*1000/360:.2f},{(90-lat)*500/180:.2f}' for lon,lat,*_ in ring)+'Z' for ring in poly))
svg='<svg id="world-map" viewBox="0 0 1000 500" tabindex="0" role="group" aria-label="World research atlas. Plus and minus zoom; arrow keys pan; Home resets." aria-describedby="map-help"><g class="graticule">'
for x in range(0,1001,83):svg+=f'<path d="M{x} 0V500"/>'
for y in range(0,501,83):svg+=f'<path d="M0 {y}H1000"/>'
svg+='</g><g class="world-land">'+''.join(f'<path d="{path}"/>' for path in paths)+'</g><g class="map-markers">'
for e in studies[:4]:
 x=(e['lon']+180)*1000/360;y=(90-e['lat'])*500/180
 svg+=f'<g data-map-marker transform="translate({x:.3f} {y:.3f})"><a href="{e["slug"]}.html" aria-label="{e["number"]} {escape(e["place"])}: {escape(e["title"])}"><circle class="marker-hit" r="12"/><circle r="4"/><text x="8" y="-8">{e["number"]}</text><title>{escape(e["place"])} — {escape(e["title"])}</title></a></g>'
# Separate link targets at a shared city anchor, rather than inventing distant Beijing locations.
x=(116.39+180)*1000/360;y=(90-39.92)*500/180
svg+=f'<g data-map-marker transform="translate({x:.3f} {y:.3f})"><path class="city-leader" d="M-15 -13L0 0L15 -13"/>'
for dx,e in zip([-15,15],studies[4:]):
 svg+=f'<a href="{e["slug"]}.html" aria-label="{e["number"]} {escape(e["place"])}: {escape(e["title"])}" transform="translate({dx} -13)"><circle class="marker-hit" r="12"/><circle r="4"/><text x="-6" y="-9">{e["number"]}</text><title>{escape(e["title"])}</title></a>'
svg+='</g></g></svg>'
rows=''.join(f'<a class="research-row" href="{e["slug"]}.html"><span>{e["number"]}</span><h2>{e["title"]}</h2><span>{e["theme"]}</span><span>{e["place"]} · {e["year"]}</span></a>' for e in studies)
cards=''.join(f'<article class="research-card"><a class="research-card-image" href="{e["slug"]}.html">{img(e["image"],e["title"]+" Research drawing",small=True)}</a><div class="research-card-meta"><span>{e["number"]} / {e["theme"]}</span><span>{e["year"]}</span></div><h2><a href="{e["slug"]}.html">{e["title"]}</a></h2><p class="research-card-place">{e["place"]}</p><p class="research-card-question">{e["proposition"]}</p><a class="line-link" href="{e["slug"]}.html">Read the enquiry ↗</a></article>' for e in studies)
page('research.html','Research',f'''<section class="page-intro research-intro"><span class="eyebrow">Research / An ongoing enquiry</span><h1>Reading places.<br>Tracing relationships.</h1><div class="research-position"><p>How does architecture intervene when existing territorial relationships become fragmented, vulnerable or historically layered?</p><p>Six studies trace the relations between land, water, memory, production and collective life. Each moves from evidence and observation to an architectural consequence.</p></div></section><div class="research-sequence" aria-label="Research approach"><span>Condition / evidence</span><span>Observation</span><span>Question</span><span>Method</span><span>Finding</span><span>Architecture</span></div><section aria-label="Territories of enquiry"><div class="section-bar"><h2>Territories of enquiry <span>06 studies</span></h2><div class="text-switch"><button data-research="map" aria-pressed="true">Map</button><span>/</span><button data-research="index" aria-pressed="false">Index</button></div></div><div id="research-map" class="research-map"><div class="map-canvas">{svg}<div class="map-heading"><span class="eyebrow">Field atlas / 2024–2026</span><span>Approximate research locations</span></div><div class="map-controls" aria-label="Map controls"><button data-map-action="in" aria-label="Zoom in">+</button><button data-map-action="out" aria-label="Zoom out">−</button><button data-map-action="world">World</button><button data-map-action="sites">Research sites</button></div><span id="map-scale" aria-live="polite">1.0×</span></div><div class="map-caption"><p id="map-help">Drag to pan · Pinch or use + / − to zoom · Numbered sites open studies · Beijing has two enquiries</p><a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Basemap: Natural Earth</a></div><div class="atlas-key">{''.join(f'<a href="{e["slug"]}.html"><span>{e["number"]}</span>{e["place"]}</a>' for e in studies)}</div></div><div id="research-index" hidden>{rows}</div></section><section class="research-grid" aria-label="Six research studies">{cards}</section><div class="research-editorial-note"><span class="eyebrow">Evidence & authorship</span><p>Each enquiry distinguishes original drawings and design research from supporting literature. Sources, reported methods and unresolved questions accompany the argument. Architectural outcomes and project credits are collected under <a href="index.html">Projects</a>.</p></div>''','research','Six architectural enquiries into changing territorial relationships: heritage, water, memory, ritual, public life and collective knowledge.')
for i,e in enumerate(studies):
 nav=''.join(f'<a href="#{s["id"]}">{s["title"]}</a>' for s in e['sections'])
 content=f'<article class="research-article"><header class="essay-header"><a class="eyebrow" href="research.html">Research / Enquiry {e["number"]}</a><h1>{e["title"]}</h1><div class="essay-byline"><span>{e["theme"]}</span><span>{e["place"]} · {e["year"]}</span><span>Design research</span></div></header><div class="essay-layout"><aside><span class="eyebrow">In this enquiry</span><nav aria-label="Essay contents"><a href="#proposition">Opening proposition</a><a href="#question">Research question</a>{nav}<a href="#sources">Sources & authorship</a></nav><a class="line-link" href="{e["project"]}.html">View architectural project →</a></aside><div class="essay-body"><section id="proposition"><span class="eyebrow">Opening proposition</span><p class="opening-proposition">{e["proposition"]}</p><p>{e["opening"]}</p></section><section id="question" class="research-question"><h2>Research question</h2><p class="question-text">{e["question"]}</p></section>'
 for s in e['sections']:
  content+=f'<section id="{s["id"]}"><h2>{s["title"]}</h2>'+''.join(f'<p>{p}</p>' for p in s['paragraphs'])
  if s.get('table'):content+=research_table(s['table'])
  if s.get('statement'):content+=f'<blockquote class="research-pullquote">{s["statement"]}</blockquote>'
  if s.get('figure'):content+=research_figure(s['figure'],s['caption'])
  content+='</section>'
 content+='<section id="sources" class="essay-source"><h2>Sources & authorship</h2><p class="research-authorship">'+e['credit']+'</p><ol class="research-bibliography">'+''.join(f'<li id="ref-{s["code"]}"><span class="source-kind">{s["code"]} / {s["kind"]}</span><h3>{escape(s["title"])}</h3><p>{escape(s["detail"])}</p></li>' for s in e['sources'])+'</ol></section></div></div>'
 nxt=studies[(i+1)%len(studies)]
 content+=f'<div class="research-next"><a class="line-link" href="research.html">← All six enquiries</a><a href="{nxt["slug"]}.html"><span class="eyebrow">Next enquiry / {nxt["number"]}</span><span>{nxt["title"]} →</span></a></div></article>'
 page(e['slug']+'.html',e['title'],content,'research',e['question'])
