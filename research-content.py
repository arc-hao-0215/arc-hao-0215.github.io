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
# A shared anchor gives nearby studies separate, keyboard-reachable targets.
groups={}
for e in studies:
 group='Beijing' if e['slug'] in ['research-shichahai','research-civic'] else 'Taiwan' if e['slug'] in ['research-ground','research-rurbanity'] else e['slug']
 groups.setdefault(group,[]).append(e)
for group,items in groups.items():
 lon=sum(e['lon'] for e in items)/len(items);lat=sum(e['lat'] for e in items)/len(items)
 x=(lon+180)*1000/360;y=(90-lat)*500/180
 svg+=f'<g data-map-marker transform="translate({x:.3f} {y:.3f})">'
 for i,e in enumerate(items):
  dx=(i-(len(items)-1)/2)*34;dy=-10 if len(items)>1 else 0
  if len(items)>1:svg+=f'<path class="city-leader" d="M0 0L{dx} {dy}"/>'
  svg+=f'<a href="{e["slug"]}.html" aria-label="{e["number"]} {escape(e["place"])}: {escape(e["title"])}" transform="translate({dx} {dy})"><circle class="marker-hit" r="12"/><circle r="4"/><text x="7" y="-7">{e["number"]}</text><title>{escape(e["place"])} — {escape(e["title"])}</title></a>'
 svg+='</g>'
svg+='</g></svg>'
rows=''.join(f'<a class="research-row" href="{e["slug"]}.html"><span>{e["number"]}</span><h2>{e["title"]}</h2><span>{e["theme"]}</span><span>{e["place"]} · {e["year"]}</span></a>' for e in studies)
cards=''.join(f'<article class="research-card"><a class="research-card-image" href="{e["slug"]}.html">{img(e["image"],e["title"]+" — Research study",small=True)}</a><div class="research-card-meta"><span>{e["number"]} / {e["theme"]}</span><span>{e["year"]}</span></div><h2><a href="{e["slug"]}.html">{e["title"]}</a></h2><p class="research-card-place">{e["place"]}</p><p class="research-card-question">{e["proposition"]}</p><a class="line-link" href="{e["slug"]}.html">Read the enquiry ↗</a></article>' for e in studies)
page('research.html','Research',f'''<section class="page-intro research-intro"><span class="eyebrow">Research / An ongoing enquiry</span><h1>Reading places.<br>Tracing relationships.</h1><div class="research-position"><p>How does architecture intervene when existing territorial relationships become fragmented, vulnerable or historically layered?</p><p>Ten studies trace the relations between land, water, memory, production and collective life. Field enquiries, design research and glossary essays connect evidence with architectural questions.</p></div></section><div class="research-sequence" aria-label="Research approach"><span>Condition / evidence</span><span>Observation</span><span>Question</span><span>Method</span><span>Finding</span><span>Architecture</span></div><section aria-label="Territories of enquiry"><div class="section-bar"><h2>Territories of enquiry <span>10 studies</span></h2><div class="text-switch"><button data-research="map" aria-pressed="true">Map</button><span>/</span><button data-research="index" aria-pressed="false">Index</button></div></div><div id="research-map" class="research-map"><div class="map-canvas">{svg}<div class="map-heading"><span class="eyebrow">Field atlas / 2024–2026</span><span>Approximate research locations</span></div><div class="map-controls" aria-label="Map controls"><button data-map-action="in" aria-label="Zoom in">+</button><button data-map-action="out" aria-label="Zoom out">−</button><button data-map-action="world">World</button><button data-map-action="sites">Research sites</button></div><span id="map-scale" aria-live="polite">1.0×</span></div><div class="map-caption"><p id="map-help">Drag to pan · Pinch or use + / − to zoom · Numbered sites open studies · Clustered markers distinguish related enquiries</p><a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Basemap: Natural Earth</a></div><div class="atlas-key">{''.join(f'<a href="{e["slug"]}.html"><span>{e["number"]}</span>{e["place"]}</a>' for e in studies)}</div></div><div id="research-index" hidden>{rows}</div></section><section class="research-grid" aria-label="Ten research studies">{cards}</section><div class="research-editorial-note"><span class="eyebrow">Evidence & authorship</span><p>The essays distinguish authored observations and design research from external scholarship. References list professional literature and published institutional sources; figure captions credit the drawings and photographs. Architectural outcomes are collected under <a href="index.html">Projects</a>.</p></div>''','research','Ten architectural enquiries into changing territorial relationships: heritage, water, memory, ritual, public life and collective knowledge.')
def research_cta(e):
 url=e.get('cta_url') or (e.get('project','')+'.html')
 label=e.get('cta_label','View architectural project →')
 return f'<a class="line-link" href="{escape(url)}">{escape(label)}</a>'
def bibliography(e):
 output=''
 for r in e['sources']:
  link=f'<a class="reference-url" href="{escape(r["url"])}" target="_blank" rel="noopener">Read reference ↗</a>' if r.get('url') else ''
  output+=f'<li id="ref-{r["code"]}"><span class="source-kind">{r["code"]} / {r["kind"]}</span><h3>{escape(r["title"])}</h3><p>{escape(r["detail"])}</p>{link}</li>'
 return output
for i,e in enumerate(studies):
 nav=''.join(f'<a href="#{s["id"]}">{s["title"]}</a>' for s in e['sections'])
 content=f'<article class="research-article"><header class="essay-header"><a class="eyebrow" href="research.html">Research / Enquiry {e["number"]}</a><h1>{e["title"]}</h1><div class="essay-byline"><span>{e["theme"]}</span><span>{e["place"]} · {e["year"]}</span><span>{e.get("kind","Design research")}</span></div></header><div class="essay-layout"><aside><span class="eyebrow">In this enquiry</span><nav aria-label="Essay contents"><a href="#proposition">Opening proposition</a><a href="#question">Research question</a>{nav}<a href="#sources">References</a></nav>{research_cta(e)}</aside><div class="essay-body"><section id="proposition"><span class="eyebrow">Opening proposition</span><p class="opening-proposition">{e["proposition"]}</p><p>{e["opening"]}</p>{("<div class=research-destination>"+research_cta(e)+"<p>"+escape(e.get("cta_note","Related programme and research context"))+"</p></div>") if e.get("cta_url") else ""}</section><section id="question" class="research-question"><h2>Research question</h2><p class="question-text">{e["question"]}</p></section>'
 for s in e['sections']:
  content+=f'<section id="{s["id"]}"><h2>{s["title"]}</h2>'+''.join(f'<p>{p}</p>' for p in s['paragraphs'])
  if s.get('table'):content+=research_table(s['table'])
  if s.get('statement'):content+=f'<blockquote class="research-pullquote">{s["statement"]}</blockquote>'
  if s.get('figure'):content+=research_figure(s['figure'],s['caption'])
  content+='</section>'
 content+='<section class="research-authorship-block"><span class="eyebrow">Authorship</span><p class="research-authorship">'+e['credit']+'</p></section><section id="sources" class="essay-source"><h2>References</h2><ol class="research-bibliography">'+bibliography(e)+'</ol></section></div></div>'

 nxt=studies[(i+1)%len(studies)]
 content+=f'<div class="research-next"><a class="line-link" href="research.html">← All ten enquiries</a><a href="{nxt["slug"]}.html"><span class="eyebrow">Next enquiry / {nxt["number"]}</span><span>{nxt["title"]} →</span></a></div></article>'
 page(e['slug']+'.html',e['title'],content,'research',e['question'])
