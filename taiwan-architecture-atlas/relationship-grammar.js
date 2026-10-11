/* Explicit relationship grammar for the Taiwan Architecture Atlas.
 * A link's style is tied to the evidence-bearing relation, NOT just its node type.
 * This adapter does not add unverified biographical, mentorship or authorship links.
 */
(() => {
  "use strict";
  const D=window.ATLAS_DATA;if(!D)return;
  const byId=new Map(D.nodes.map(n=>[n.id,n]));
  const rules={
    studied:{en:"STUDIED AT",zh:"就讀／畢業",color:"#83afd8",dash:[5,3],order:10},
    mentored:{en:"STUDIED UNDER",zh:"師承／受教",color:"#8cbbeb",dash:[4,2],order:15},
    family:{en:"FAMILY / KINSHIP",zh:"親屬（不代表師承）",color:"#ab96a7",dash:[2,6],order:65},
    taught:{en:"TAUGHT AT",zh:"任教",color:"#a6c7d7",dash:[2,3],order:20},
    led:{en:"LED",zh:"主持／領導",color:"#dbaf76",dash:[],order:30},
    founded:{en:"FOUNDED",zh:"創辦",color:"#acd0ab",dash:[],order:40},
    worked:{en:"WORKED AT",zh:"任職",color:"#d4c28f",dash:[9,3],order:50},
    associated:{en:"AFFILIATED WITH",zh:"所屬／關聯",color:"#c4bb9c",dash:[3,4],order:60},
    collaborated:{en:"COLLABORATED WITH",zh:"合作",color:"#a1c7ae",dash:[],order:70},
    designed:{en:"DESIGNED",zh:"設計作品",color:"#c2a5d4",dash:[],order:80},
    consulted:{en:"CONTRIBUTED TO",zh:"工程／技術",color:"#ccada9",dash:[8,4],order:90},
    authored:{en:"WROTE",zh:"出版／撰寫",color:"#e4bd8d",dash:[3,3],order:100},
    recognized:{en:"RECOGNIZED BY",zh:"獲獎／獲選",color:"#e0b37e",dash:[2,5],order:110},
    curated:{en:"RESEARCHED / CURATED",zh:"研究／策展",color:"#92c7bf",dash:[4,3],order:120},
    belonged:{en:"PART OF / HOSTED BY",zh:"隸屬／營運",color:"#a1a9b1",dash:[5,3],order:130},
    contextual:{en:"SITE CONTEXT",zh:"基地／保存關係",color:"#9b9c9f",dash:[2,5],order:140}
  };
  function classify(e){
    const a=byId.get(e.a),b=byId.get(e.b),label=(e.label||"");
    const person=[a,b].find(n=>n?.type==="person");
    const institution=[a,b].find(n=>n?.type==="institution");
    const work=[a,b].find(n=>n?.type==="work");
    const practice=[a,b].find(n=>n?.type==="practice");
    if(e.type==="mentorship")return "mentored";
    if(e.type==="family")return "family";
    if(e.type==="collaboration")return "collaborated";
    if(e.type==="recognition")return "recognized";
    if(e.type==="context")return "contextual";
    if(e.type==="curatorial")return "curated";
    if(e.type==="client")return "belonged";
    if(e.type==="design")return "designed";
    if(e.type==="engineering")return /合作|協作|共同/.test(label)?"collaborated":"consulted";
    if(e.type==="education"){
      if(person&&institution){
        if(/主任|主持系務|領導|院長|校長/.test(label))return "led";
        if(/任教|兼任|專任|講師|教授|授課/.test(label))return "taught";
        if(/畢業|學士|碩士|就讀|校友|學歷|留學|取得/.test(label))return "studied";
        return "associated";
      }
      return "belonged";
    }
    if(e.type==="affiliation"){
      if(person&&practice){
        if(/創立|創辦|共同創辦|創始|成立/.test(label))return "founded";
        if(/任職|任專案|加入|Project Associate|工作|顧問|管理|主持人/.test(label))return "worked";
        return "associated";
      }
      return /合作|共同/.test(label)?"collaborated":"associated";
    }
    return "associated";
  }
  function yearKind(e){
    const label=e.label||"";
    if(!Number.isFinite(e.year))return null;
    if(/建築獎名錄|得獎名錄|得獎作品|獲獎/.test(label))return "AWARD YEAR";
    if(e.semantic==="recognized")return "AWARDED";
    if(e.semantic==="studied")return /畢業|取得/.test(label)?"GRADUATED":"EDUCATION";
    if(e.semantic==="taught")return "TEACHING";
    if(e.semantic==="led")return "LEADERSHIP";
    if(e.semantic==="founded")return "FOUNDED";
    if(e.semantic==="worked")return "EMPLOYMENT";
    if(e.semantic==="designed"){
      if(/試營運/.test(label))return "TRIAL OPENING";
      if(/開幕|啟用|落成|完工/.test(label))return "BUILDING EVENT";
      return "DOCUMENTED";
    }
    if(e.semantic==="curated")return "RESEARCH";
    if(e.semantic==="contextual")return "SITE RECORD";
    if(e.semantic==="belonged")return "FACILITY";
    return "RECORD";
  }

  // Keep actor/target orientation as sidecar metadata for the relation panel.
  // Its canonical edge endpoints and original source text remain unchanged.
  D.edges.forEach(e=>{
    e.semantic=classify(e);
    e.visual=rules[e.semantic];
    e.yearKind=yearKind(e);
  });
  D.relationshipGrammar=rules;
  D.relationLegend=["studied","mentored","taught","led","founded","worked","associated","family","collaborated","designed","consulted","authored","recognized","curated","belonged","contextual"];
})();
