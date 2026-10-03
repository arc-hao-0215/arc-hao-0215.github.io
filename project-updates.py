"""Project catalogue additions and corrected credits, October 2026."""
for p in projects:
 if p['slug']=='teaching-building':
  p.update(title='Ziqiang Technology Building<br>Atrium Design',name='Ziqiang Technology Building Atrium',year='2024',type='Competition · 1st Prize',award='1st Prize · Atrium Design Competition',question='How can an atrium become a shared learning landscape?',desc='The atrium proposal turns underused circulation into places for informal learning, conversation and gathering. Flexible occupation and a connected interior landscape extend the building’s life beyond the classroom. The design received first prize in the competition.',credit='Competition proposal · Hao Chang & Mengzhe Lee · 2024<br>Hao’s role: concept, modelling and renderings<br>Instructor: Martijn de Geus<br>Recognition: 1st Prize · Ziqiang Technology Building Atrium Design')
 if p['slug']=='waterfront-plus':
  p['award']='Gold Award · Urban Design · China Human Settlements Academic Year Award, 2025'
  p['credit']+='<br>中國人居環境學年獎 · 城市設計組 · 金獎（2025）'
 if p['slug']=='selected-studies':p.update(name='Selected Other Work',title='Selected Other Work')
projects.extend([
 dict(id='010',slug='theater-design',title='The Condenser',name='The Condenser · Theater Design',place='Wudaokou, Beijing',year='2025',field='Performance / Public life',type='Theater design · Academic project',image='theater-hero',award='',question='Can a theater be a civic space before and after the performance?',desc='The Condenser reimagines the theater as a social condenser within Wudaokou’s mixture of universities, workplaces and housing. An open ground, generous stairs, shared foyers and a rooftop amphitheater bring formal performance into contact with the city’s everyday gatherings.',credit='Individual design · Hao Chang<br>Tsinghua University · Large-scale Public Building Design Studio<br>Spring 2025 · Unbuilt academic project'),
 dict(id='011',slug='first-teaching-building',title='First Teaching Building<br>Renewal',name='First Teaching Building Renewal',place='Tsinghua University, Beijing',year='2025–2026',field='Learning / Adaptive reuse',type='Commissioned project',image='first-teaching-hero',award='',question='How can small changes renew an enduring place of learning?',desc='A commissioned renewal of Tsinghua’s First Teaching Building develops contemporary teaching environments within its inherited spatial order. The January 2026 third-floor proposal retains the building’s structure, proportions and window openings, while integrating acoustics, lighting, services and adaptable furniture across classrooms and shared circulation.',credit='Commissioned project · Hao Chang & Mengzhe Lee<br>Co-lead design · From May 2025<br>Design stage shown: 30 January 2026<br>Third-floor design area: 682 m²<br>Two 96-seat classrooms, a multifunctional classroom, circulation and teachers’ lounge<br>Images show the design proposal.')
])
# Newest work first; the cross-media collection remains the final entry.
import re
projects.sort(key=lambda p:(p['slug']=='selected-studies',-max(map(int,re.findall(r'20\d{2}',p['year'])))))
# Display numbering follows the current chronological catalogue, never storage order.
places={'rising-tides':'Kampung Melayu · Jakarta','erdai':'Fenggui Peninsula · Penghu Archipelago','spirited-a-way':'Mount Kailash','books-above-bustles':'Beijing','teaching-building':'Tsinghua University · Beijing','their-story':'Hong Kong','ancient-trails':'Gaoligong Mountains','waterfront-plus':'Shichahai · Beijing','theater-design':'Wudaokou · Beijing','first-teaching-building':'Tsinghua University · Beijing'}
for number,p in enumerate(projects,1):
 p['id']=f'{number:02}'
 p['place']=places.get(p['slug'],p['place'])
 if p['slug']=='teaching-building':p['type']='Competition proposal'
