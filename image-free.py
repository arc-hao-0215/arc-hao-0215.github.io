"""Temporary text-only publication while replacement originals are prepared.

Keep source image mappings for future replacement; never emit stale image URLs.
Uses only the Python standard library so normal builds remain reproducible.
"""
from html.parser import HTMLParser
from html import escape

VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class Node:
    def __init__(self, tag='', attrs=(), raw=''):
        self.tag, self.attrs, self.raw, self.children = tag, dict(attrs), raw, []

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.get_starttag_text())
        self.stack[-1].children.append(n)
        if tag not in VOID: self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs, self.get_starttag_text()))
    def handle_endtag(self, tag):
        if len(self.stack)>1 and self.stack[-1].tag==tag: self.stack.pop()
    def handle_data(self, data): self.stack[-1].children.append(data)
    def handle_entityref(self, name): self.handle_data('&'+name+';')
    def handle_charref(self, name): self.handle_data('&#'+name+';')
    def handle_decl(self, decl): self.handle_data('<!'+decl+'>')
    def handle_comment(self, data): self.handle_data('<!--'+data+'-->')

def image_free(source):
    def render(n, studies=False):
        if isinstance(n,str): return n
        a=n.attrs.copy(); classes=set((a.get('class') or '').split())
        studies = studies or 'studies-grid' in classes
        if n.tag in {'img','picture','svg','image'}: return ''
        if n.tag=='link' and a.get('rel')=='icon': return ''
        if n.tag=='meta' and 'image' in (a.get('property','') or a.get('name','')): return ''
        if a.get('id') in {'lightbox','research-map','section-overlay','journey-current'}: return ''
        if classes & {'hero-slide','hero-scrim','hero-bottom','project-image','research-card-image','annotated-map','section-explorer'}: return ''
        if n.tag=='figure':
            if studies:
                captions=[c for c in n.children if isinstance(c,Node) and c.tag=='figcaption']
                return '<div class="study-text">'+''.join(render(c) for c in captions)+'</div>'
            return ''
        if classes & {'text-switch'} and any(isinstance(c,Node) and any(k in c.attrs for k in ['data-season','data-layer','data-research']) for c in n.children): return ''
        if n.tag=='a' and (a.get('href') or '').lower().split('?')[0].endswith(('.webp','.jpg','.jpeg','.png','.svg','.gif','.avif')): return ''
        for key in ['data-preview','data-zoom','srcset','poster']: a.pop(key,None)
        if 'hero-carousel' in classes:
            a['class']=a['class'].replace('hero-carousel','hero-text')
            a.pop('aria-roledescription',None);a['aria-label']='Introduction'
        if a.get('id')=='research-index': a.pop('hidden',None)
        if n.tag=='body': a['class']=((a.get('class') or '')+' image-free').strip()
        if a.get('data-mode')=='visual': n.children=['Grid']
        inner=''.join(render(c,studies) for c in n.children)
        if not n.tag: return inner
        if not inner.strip() and classes & {'two-images','narrow-drawing','journey-scenes'}: return ''
        start='<'+n.tag+''.join(' '+k if v is None else ' '+k+'="'+escape(v,quote=True)+'"' for k,v in a.items())+'>'
        return start if n.tag in VOID else start+inner+'</'+n.tag+'>'
    return render(Document(source).root)
