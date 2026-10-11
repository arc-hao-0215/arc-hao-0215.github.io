/* Additional source-based person anchors and confirmed interpersonal links.
 * No unsourced author/teacher/co-designer relationships are created.
 */
(() => {
 const D=window.ATLAS_DATA;if(!D)return;
 const defs=[
  ["B20","王秋華1925年生、與潘冀合作、古德曼事務所經歷｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%40297ef72272b7f76d017308f973330116","國家文化藝術基金會"],
  ["B21","修澤蘭1925年生、1956創辦澤群｜臺灣女人","https://women.nmth.gov.tw/?p=20100","國立臺灣歷史博物館"],
  ["B22","郭旭原1962年生、1986東海畢業｜事務所官方簡介","https://www.khaa.com.tw/about_ems/","大尺建築+郭旭原聯合建築師事務所"],
  ["B23","高而潘1928年生及1966年創業｜文化部","https://www.moc.gov.tw/News_Content.aspx?n=105&s=95465","文化部"],
  ["B24","楊卓成生年1914之記錄｜具家族關係作者之回憶文章","https://www.chinese-heritage.com/index.php/%E8%B3%A6%E6%A2%85%E8%8A%B1%E9%A4%A8%E6%B8%85%E8%B3%9E/%E6%B0%91%E5%9C%8B%E5%B9%B4%E8%8F%AF/item/327-%E4%B8%AD%E5%9C%8B%E5%BB%BA%E7%AF%89%E5%AE%97%E5%B8%AB%E6%A5%8A%E5%8D%93%E6%88%90%E5%85%88%E7%94%9F.html","Chinese Heritage"],
  ["B25","楊卓成1915年之百科版本（生年存在衝突）","https://zh.wikipedia.org/wiki/%E6%A5%8A%E5%8D%93%E6%88%90","維基百科／待查證"]
 ];
 const src=new Set(D.sources.map(s=>s.id));
 defs.forEach(([id,title,url,publisher])=>{if(!src.has(id))D.sources.push({id,title,url,publisher});});
 const get=name=>D.nodes.find(n=>n.name===name||n.en===name);
 function person(name,year,region,source,death=null){
   const n=get(name);if(!n)return;
   n.birthYear=year;n.birthStatus="source-documented";n.birthSourceIds=[source];
   n.workRegion=region;n.deathYear=death;n.sources=[...new Set([...(n.sources||[]),source])];
 }
 person("王秋華",1925,"Taiwan — North","B20",2021);
 person("修澤蘭",1925,"Taiwan — North","B21",2016);
 person("郭旭原",1962,"Taiwan — North","B22");
 const yang=get("楊卓成");
 if(yang){
  yang.birthYear=null;yang.birthStatus="conflicting-sources";yang.birthCandidates=[1914,1915];
  yang.birthSourceIds=["B24","B25"];yang.workRegion="Taiwan — North";
  yang.sources=[...new Set([...(yang.sources||[]),"B24","B25"])];
 }
 D.relations.collaboration="具名人物合作";
 D.relations.mentorship="明確師承／指導";
 const ex=new Set(D.nodes.map(n=>n.id));
 const edgeKeys=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
 function connect(a,b,type,label,year,src){
  const x=get(a),y=get(b);if(!x||!y)return;
  const k=[x.id,y.id].sort().join("|")+"|"+type;if(edgeKeys.has(k))return;
  edgeKeys.add(k);D.edges.push({a:x.id,b:y.id,type,label,year,src:[src]});
 }
 function add(name,type,src,desc,en){
  const existing=get(name);if(existing)return existing;
  const n={id:"verified-"+(++add.counter),name,en:en||name,type,year:null,lane:0,offset:0,desc,sources:[src]};
  if(type==="person"){n.birthYear=null;n.birthStatus="unverified";n.workRegion="Region to verify";}
  D.nodes.push(n);return n;
 }
 add.counter=0;
 const goodman=add("Percival Goodman","person","B20","王秋華赴美國求學時師從的建築師；王秋華之後進入其建築事務所並成為合夥人，國家文藝獎介紹有明確紀錄。","Percival Goodman");
 const columbia=add("哥倫比亞大學建築、規劃及保存學院","institution","B20","王秋華早期留美求學及都市設計研究的機構；資料以國家文藝獎介紹為準。","Columbia GSAPP");
 connect("王秋華",columbia.name,"education","赴美於哥倫比亞大學建築與都市設計研究所求學",undefined,"B20");
 connect("王秋華",goodman.name,"mentorship","於美國求學時師從Percival Goodman（具明確文獻）",undefined,"B20");
 connect("王秋華","潘冀","collaboration","1981年與潘冀成立聯合事務所，共同設計多座圖書館",1981,"B20");
 connect("王秋華","潘冀聯合建築師事務所","affiliation","1981年與潘冀共同創辦聯合事務所；原事務所法人沿革另待確認",1981,"B20");
 connect("郭旭原","東海大學建築學系","education","1986年東海建築系畢業，見本人事務所官方簡介",1986,"B22");
 const sz=add("澤群建築師事務所","practice","B21","修澤蘭與傅積寬1956年共同設立的建築師事務所，國立臺灣歷史博物館文章有記錄。","Zequn Architects");
 connect("修澤蘭",sz.name,"affiliation","1956年與傅積寬共同創辦",1956,"B21");
 const zhongshan=add("陽明山中山樓","work","B21","修澤蘭設計，1965年獲委託，建築歷史與實際竣工日期需另據文資資料核對。","Chung-Shan Hall");
 connect("修澤蘭",zhongshan.name,"design","1965年受託設計陽明山中山樓（非竣工年）",1965,"B21");
 D.biographicalEdition="birth-year anchored with further verified people and mentorship links";
})();
