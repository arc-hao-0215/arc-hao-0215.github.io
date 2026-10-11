/* Evidence-led education and employment links, based on university and office biographies.
 * Distinguishes alumni / teaching / former employment, no inferred mentorship.
 */
(() => {
 const D=window.ATLAS_DATA;if(!D)return;
 const citations=[
 ["S43","姚仁喜｜大元建築工場：建築師與團隊經歷","https://krisyaoartech.com/zh-tw/team","Kris Yao | Artech（事務所官網）"],
 ["S44","郭旭原｜實踐大學建築設計學系：學歷及經歷","https://www.arch.usc.edu.tw/scad/about/faculty/vis/hsu-yuan.html","實踐大學建築設計學系"],
 ["S45","東海大學建築學系：畢業發展及著名校友","https://arch.thu.edu.tw/about/5/?page=5","東海大學建築學系"],
 ["S46","黃聲遠｜東海、耶魯建築教育與宜蘭實踐","https://tvcast.asia.edu.tw/media/412","亞洲大學講座影音"]
 ];
 const hasS=new Set(D.sources.map(s=>s.id));
 citations.forEach(([id,title,url,publisher])=>{if(!hasS.has(id))D.sources.push({id,title,url,publisher});});
 const lookup=name=>D.nodes.find(n=>n.name===name);
 let next=0;
 function node(name,type,year,desc,source,en){
  const found=lookup(name);if(found)return found;
  const o={id:"edu-"+String(++next).padStart(3,"0"),name,en:en||name,type,year,lane:next%4,offset:next%5-2,desc,sources:[source]};
  D.nodes.push(o);return o;
 }
 const edgeIds=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
 function edge(a,b,type,label,year,source){
   const x=lookup(a),y=lookup(b);if(!x||!y)return;
   const id=[x.id,y.id].sort().join("|")+"|"+type;
   if(edgeIds.has(id))return;
   edgeIds.add(id);D.edges.push({a:x.id,b:y.id,type,label,year,src:[source]});
 }
 function cite(name,id){const n=lookup(name);if(n&&!n.sources.includes(id))n.sources.push(id);}
 const thu="東海大學建築學系",ncku="國立成功大學建築學系";
 const berkeley=node("加州大學柏克萊分校環境設計學院","institution",null,"姚仁喜於1978年取得柏克萊加州大學建築碩士，事務所官方履歷有明確紀錄。","S43","UC Berkeley College of Environmental Design");
 edge("姚仁喜",thu,"education","東海大學建築系畢業（1975）",1975,"S43");
 edge("姚仁喜",berkeley.name,"education","柏克萊加州大學建築碩士（1978）",1978,"S43");
 cite("姚仁喜","S43");
 const yao=lookup("姚仁喜");if(yao)yao.desc="1975年畢業於東海大學建築系，1978年取得美國柏克萊加州大學建築碩士，為姚仁喜｜大元建築工場創始人。其建築作品包含故宮南院、新北市美術館、蘭陽博物館等。資料見事務所官方團隊履歷及建築專業獎項記錄。";
 const mit=node("麻省理工學院建築學系","institution",null,"實踐大學所刊郭旭原履歷記錄其取得麻省理工學院建築碩士學位，未記載取得年份。","S44","MIT Department of Architecture");
 edge("郭旭原",thu,"education","東海大學建築學士，並於1998–2003年擔任兼任講師；確切畢業年待考",undefined,"S44");
 edge("郭旭原",mit.name,"education","麻省理工學院建築碩士，畢業年份未提供",undefined,"S44");
 edge("郭旭原","李祖原建築師事務所","affiliation","1988–1995年任專案建築師；任職關係不等於師徒關係",1988,"S44");
 edge("郭旭原",ncku,"education","2016–2020年建築學系助理教授",2016,"S44");
 edge("郭旭原","淡江大學建築學系","education","2013–2014年建築系兼任講師",2013,"S44");
 cite("郭旭原","S44");
 const kuo=lookup("郭旭原");if(kuo)kuo.desc="郭旭原畢業於東海建築系，獲麻省理工學院建築碩士。1988–1995年任李祖原事務所專案建築師，1999年起任郭旭原聯合建築師事務所主持建築師；曾於東海、淡江、成大建築系教學。此經歷由實踐大學建築設計學系官方師資履歷記載。";
 const alumni=["姚仁喜","黃聲遠","王重平","龔書章","廖偉立","姜樂靜","陳良全","陳永興","郭旭原","黃明威","楊秀川","高雅楓"];
 alumni.forEach(name=>{
   const a=node(name,"person",null,"東海大學建築學系官網『畢業發展』頁面明列之校友；如尚無其他履歷，教育及專業年份保持未定，不推測師生關係。","S45",name);
   edge(name,thu,"education","東海大學建築學系官方列名校友（畢業年份待考）",undefined,"S45");
   cite(name,"S45");
 });
 const yu=node("虞永威","person",null,"大元事務所資深諮詢顧問（1990–2020年負責營運及合約管理），畢業於東海建築系並取得柏克萊加州大學建築碩士；資料見事務所官方團隊履歷。","S43","Yu Yung-wei");
 edge(yu.name,thu,"education","東海大學建築系畢業，年份未載",undefined,"S43");
 edge(yu.name,berkeley.name,"education","柏克萊加州大學建築碩士，年份未載",undefined,"S43");
 edge(yu.name,"大元聯合建築師事務所","affiliation","1990–2020年間負責事務所營運與合約管理",1990,"S43");
 const wu=node("吳建毅","person",null,"2009年加入姚仁喜｜大元建築工場之建築師，長期參與文化公共工程設計及落實工作，資料見事務所官網。","S43","Wu Chien-yi");
 edge(wu.name,"大元聯合建築師事務所","affiliation","2009年加入並擔任協同主持人",2009,"S43");
 const bao=node("包曉雯","person",null,"大元事務所上海辦公室協同主持建築師及總經理，2000年取得上海同濟大學建築學士，2003年加入該團隊。","S43","Bao Xiao-wen");
 const tongji=node("同濟大學建築與城市規劃學院","institution",null,"包曉雯於2000年獲同濟大學建築學士之機構；校院名稱做機構索引，未核實學院歷史成立日期。","S43","Tongji University Architecture");
 edge(bao.name,tongji.name,"education","同濟大學建築學士（2000）",2000,"S43");
 edge(bao.name,"大元聯合建築師事務所","affiliation","2003年加入上海辦公室，現為協同主持與總經理",2003,"S43");
 const yale=node("耶魯大學建築學院","institution",null,"黃聲遠建築教育相關機構，亞洲大學講座文字記錄其取得耶魯建築碩士，未載明授予年度。","S46","Yale School of Architecture");
 edge("黃聲遠",yale.name,"education","取得耶魯大學建築碩士，亞洲大學講座文字未載學位授予年份",undefined,"S46");
 cite("黃聲遠","S46");
 D.researchNotes.schoolConnections="新一輪依事務所、系所官網履歷建立跨代教育和雇用連結；師生、校友、曾任教、曾任職分開在文案中註明，未核實畢業年份保留空白。";
})();
