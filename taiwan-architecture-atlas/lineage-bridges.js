/* Curated network bridges with university-sourced year-specific graduation and career facts. */
(() => {
 const D=window.ATLAS_DATA;if(!D)return;
 const additions=[
 ["S47","得獎與成就：東海大學建築學系校友與畢業年級","https://arch.thu.edu.tw/about/6/","東海大學建築學系"],
 ["S48","黃聲遠於哈佛大學設計學院演講：簡歷與北美任職","https://arch.thu.edu.tw/news/159/","東海大學建築學系"]
 ];
 const sourceIds=new Set(D.sources.map(x=>x.id));
 additions.forEach(([id,title,url,publisher])=>{if(!sourceIds.has(id))D.sources.push({id,title,url,publisher});});
 const get=name=>D.nodes.find(n=>n.name===name);
 let c=0;
 const add=(name,type,desc,source,en)=>{
  let found=get(name);if(found)return found;
  const n={id:"bridge-"+String(++c).padStart(3,"0"),name,en:en||name,type,year:null,lane:c%4,offset:0,desc,sources:[source]};
  D.nodes.push(n);return n;
 };
 const eids=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
 function connect(a,b,type,label,year,source){
  const x=get(a),y=get(b);if(!x||!y)return;
  const sig=[x.id,y.id].sort().join("|")+"|"+type;
  if(eids.has(sig))return;
  eids.add(sig);D.edges.push({a:x.id,b:y.id,type,label,year,src:[source]});
 }
 function cite(name,source){
  const n=get(name);if(n&&!n.sources.includes(source))n.sources.push(source);
 }
 // East THU source lists actual program and graduation dates for specific alumni.
 for(const [name,year,detail] of [
   ["姚仁喜",1975,"建築系大學部畢業（1975）"],
   ["黃聲遠",1986,"建築系大學部畢業（1986）"],
   ["王重平",1971,"建築系大學部畢業（1971）"],
   ["龔書章",1986,"建築系大學部畢業（1986）"],
   ["廖偉立",1990,"建築系碩士班畢業（1990）"],
   ["姜樂靜",1987,"建築系碩士班畢業（1987）"]
 ]){
  const n=get(name);if(!n)continue;
  const ed=D.edges.find(e=>e.type==="education"&&([e.a,e.b].sort().join("|")===[n.id,get("東海大學建築學系").id].sort().join("|")));
  if(ed){ed.label=detail;ed.year=year;if(!ed.src.includes("S47"))ed.src.push("S47");}
  else connect(name,"東海大學建築學系","education",detail,year,"S47");
  cite(name,"S47");
 }
 // Named practices explicitly present in THU awards' graduate career table.
 add("姜樂靜建築師事務所","practice","東海大學建築系獎項資訊將其列為1987年碩士校友姜樂靜的事務所。","S47","Chiang Le-ching Architects");
 add("原相聯合建築師事務所","practice","東海建築學系獎項紀錄列出龔書章與原相聯合建築師事務所的專業關係。","S47","Origin Architects");
 connect("王重平","李祖原建築師事務所","affiliation","東海大學建築學系獎項頁列出所屬專業實踐團隊",undefined,"S47");
 connect("龔書章","原相聯合建築師事務所","affiliation","東海大學建築學系獎項頁列出所屬專業實踐團隊",undefined,"S47");
 connect("姜樂靜","姜樂靜建築師事務所","affiliation","東海大學建築學系獎項頁列出具名事務所",undefined,"S47");
 connect("廖偉立","廖偉立建築師事務所","affiliation","東海大學建築學系獎項頁列出具名事務所",undefined,"S47");
 // Award source explicitly lists collaborative architect for this work.
 connect("大元聯合建築師事務所","臺北表演藝術中心","design","東海大學建築學系得獎與成就名錄列名臺北表演藝術中心協作設計單位",2022,"S47");
 // THU reports actual former employer and lecturer role, but not duration.
 add("Eric Owen Moss Architects","practice","黃聲遠曾於美國 Eric Owen Moss Architects 擔任 Project Associate，東海大學建築系官網的演講介紹予以記錄，未記任期。","S48","Eric Owen Moss Architects");
 add("北卡羅萊納州立大學","institution","東海大學建築系官網刊載黃聲遠曾於 North Carolina State University 建築領域任教，未記任職年份。","S48","North Carolina State University");
 connect("黃聲遠","Eric Owen Moss Architects","affiliation","曾任 Project Associate，未見精確任職區間",undefined,"S48");
 connect("黃聲遠","北卡羅萊納州立大學","education","曾任教，未見精確任職區間",undefined,"S48");
 cite("黃聲遠","S48");
 D.researchNotes.verifiedGraduations="東海大學官方資料列有 1971、1975、1986、1987、1990 等具體建築師畢業年份；職涯任職年份若來源未載則保留不明。";
})();
