/* University and disciplinary history network:
 * Departmental tenure from NCKU's official list, Tunghai dept history,
 * and first Architects Golden Tripod distinction from Academia Sinica.
 * Uncertain dates are not represented as verified tenure dates.
 */
(() => {
const D=window.ATLAS_DATA;if(!D)return;
const SRC=[
 ["S27","歷史沿革／歷任系主任｜國立成功大學建築學系","https://www.arch.ncku.edu.tw/cht/article/about.html","NCKU Department of Architecture"],
 ["S28","歷史沿革／歷任系務主持｜東海大學建築學系","https://arch.thu.edu.tw/about/1/","Tunghai Department of Architecture"],
 ["S29","《臺灣史研究》31(3)：戰後建築史與1967年建築金鼎獎專論","https://www.ith.sinica.edu.tw/quarterly_download.php?filename=173494239621.pdf&name=4+%E9%83%AD%E8%81%96%E5%82%91.pdf","中央研究院臺灣史研究所 / 郭聖傑"],
 ["S30","誰是建築師？二戰後臺灣現代建築師制度的演變／展覽紀錄","https://www.taiwan-museum.org.tw/achievement/%E3%80%8C%E8%AA%B0%E6%98%AF%E5%BB%BA%E7%AF%89%E5%B8%AB%EF%BC%9F%E4%BA%8C%E6%88%B0%E5%BE%8C%E8%87%BA%E7%81%A3%E7%8F%BE%E4%BB%A3%E5%BB%BA%E7%AF%89%E5%B8%AB%E5%88%B6%E5%BA%A6%E7%9A%84%E6%BC%94%E8%AE%8A/","臺灣博物館文教基金會"],
 ["S31","誰是建築師？／專業養成、專業制度、專業實踐","https://www.taiwan-museum.org.tw/%E9%A0%90%E5%91%8A%E3%80%8C%E8%AA%B0%E6%98%AF%E5%BB%BA%E7%AF%89%E5%B8%AB%EF%BC%9F%E4%BA%8C%E6%88%B0%E5%BE%8C%E8%87%BA%E7%81%A3%E7%8F%BE%E4%BB%A3%E5%BB%BA%E7%AF%89%E5%B8%AB%E5%88%B6%E5%BA%A6%E7%9A%84/","臺灣博物館文教基金會"]
];
const sr=new Set(D.sources.map(s=>s.id));
SRC.forEach(([id,title,url,publisher])=>{if(!sr.has(id))D.sources.push({id,title,url,publisher});});
D.categories.event={zh:"獎項與展覽",en:"Events",color:"#a48b64"};
D.relations.recognition="獲獎／表揚";D.relations.curatorial="研究／策展";
const names=new Map(D.nodes.map(n=>[n.name,n]));
const ids=new Set(D.nodes.map(n=>n.id));
let count=0;
function get(name){return names.get(name)||D.nodes.find(n=>n.name===name);}
function add(name,type,year,desc,source,en=""){
 const old=get(name);if(old)return old;
 let id="hist-"+String(++count).padStart(3,"0");while(ids.has(id))id="hist-"+String(++count).padStart(3,"0");
 const n={id,name,en:en||name,type,year,lane:count%4,offset:(count%5)-2,desc,sources:[source]};
 D.nodes.push(n);names.set(name,n);ids.add(id);return n;
}
const linkKeys=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
function edge(n1,n2,type,label,year,sid){
 const a=typeof n1==="string"?get(n1):n1,b=typeof n2==="string"?get(n2):n2;
 if(!a||!b||a.id===b.id)return;
 const key=[a.id,b.id].sort().join("|")+"|"+type;if(linkKeys.has(key))return;
 linkKeys.add(key);D.edges.push({a:a.id,b:b.id,type,label,year,src:[sid]});
}
// Precise historical starting dates as listed by the university (not birth years).
const ncku=get("國立成功大學建築學系");
const chairs=`
1944|千千岩助太郎|1944–1947
1947|溫文華|1947–1949
1949|朱尊誼|1949–1965
1965|王濟昌|1965–1972
1972|吳讓治|1972–1974
1974|賀陳詞|1974–1977
1977|洪見振|1977–1979
1979|許茂雄|1979–1982
1984|翁金山|1984–1990
1990|孫全文|1990–1993
1993|徐明福|1993–1996
1996|賴榮平|1996–1999
1999|張嘉祥|1999–2002
2002|江哲銘|2002–2005
2005|傅朝卿|2005–2008
2008|姚昭智|2008–2011
2011|鄭泰昇|2011–2017
2017|吳光庭|2017–2020
2020|杜怡萱|2020–2023
2023|薛丞倫|2023–2026
2026|黃恩宇|2026–present
`.trim().split(/\n/);
chairs.forEach(row=>{
 const [year,name,range]=row.split("|");
 const when=Number(year), anchor=Math.max(1945,when);
 const who=add(name,"person",anchor,"國立成功大學建築學系官網歷史沿革記載其曾任系主任（"+range+"）。此處僅表示可查證之行政教學關聯，不代表師承或畢業關係。","S27");
 edge(who,ncku,"education","歷任建築學系系主任（"+range+"）",when,"S27");
});
ncku.year=1945;ncku.desc="創系於1944年，成大建築學系官方歷史沿革與歷任系主任資料可供查證。本網絡以1945作為顯示範圍起點，並不改寫系所創立日期。";
if(ncku.sources&&!ncku.sources.includes("S27"))ncku.sources.push("S27");
// Recorded heads (not dates) at Tunghai: link only when source states appointment.
const tunghai=get("東海大學建築學系");
const thuHeads=["胡兆煇","詹耀文","張樞","洪文雄","黃業強","曾成德","羅時瑋","劉舜仁","陳格理","關華山","邱浩修"];
thuHeads.forEach((name,index)=>{
 const who=add(name,"person",null,"東海大學建築系歷史沿革將其列為曾主持系務之教授；原網頁並未於此提供精確任職區間，因此圖譜年份僅為暫定視覺座標。","S28");
 edge(who,tunghai,"education","官方系史列名曾主持建築系系務（任職年份待考）",undefined,"S28");
});
for(const name of ["陳其寬","漢寶德"]){
 const who=get(name);if(who){edge(who,tunghai,"education","系史記錄其曾主持系務",undefined,"S28");
 if(who.sources&&!who.sources.includes("S28"))who.sources.push("S28");}
}
// Original ten recipients from a 1967 award as documented in academic history scholarship.
const golden=add("1967年第一屆建築金鼎獎","event",1967,
 "學術論文列有1967年第一屆建築金鼎獎之十位優秀建築師，呈現戰後專業組成與多系譜並存。這裡的線代表榜單列名，並非師徒關係。","S29","First Architects' Golden Tripod Awards");
["王大閎","陳其寬","林慶豐","陳仁和","楊卓成","沈祖海","修澤蘭","張紹載","林柏年","陳濯"].forEach(name=>{
 const p=add(name,"person",1967,"1967年第一屆建築金鼎獎十大優秀建築師之一，見中央研究院臺灣史研究所期刊之歷史文獻引述。","S29");
 edge(p,golden,"recognition","1967年第一屆建築金鼎獎優秀建築師名單",1967,"S29");
});
const waseda=add("早稻田大學","institution",null,"日本建築教育機構；學術文獻指出林慶豐、陳仁和及吉阪隆正等與早稻田建築教育體系相關。1945只是本圖時間顯示起點，非學校創立年。","S29","Waseda University");
const yoshizaka=add("吉阪隆正","person",null,"早稻田大學建築教育體系相關建築師；臺灣戰後建築史文獻將其與臺灣建築師的日本系譜並述。圖譜年份僅為定位，非確切畢業年。","S29","Takamasa Yoshizaka");
["林慶豐","陳仁和","吉阪隆正"].forEach(name=>edge(name,waseda,"education","建築史論文指出其出自早稻田建築教育體系",undefined,"S29"));
const exhibition=add("誰是建築師？二戰後臺灣現代建築師制度的演變","event",2022,
"國立臺灣博物館於2022年舉辦之研究特展，展示戰後臺灣專業制度及建築師文化變遷，源自早期建築師譜系研究。","S30","Who Is an Architect? Postwar Taiwan");
const museum=add("國立臺灣博物館","institution",2022,"典藏、研究臺灣戰後現代建築相關圖說、文物、建築師制度檔案的重要機構。圖譜年份為展覽事件年份。","S30","National Taiwan Museum");
edge(museum,exhibition,"curatorial","2022年特展之合作主辦與展覽機構",2022,"S30");
edge(ncku,exhibition,"curatorial","成大建築系研究團隊參與展覽研究",2022,"S30");
edge("吳光庭",exhibition,"curatorial","策展研究主要主持人（相關展覽紀錄）",2022,"S30");
const lineage=add("戰後臺灣現代建築師譜系調查研究（1945–1971）","publication",2019,
"國立臺灣博物館委託並由成大團隊執行的戰後建築史譜系研究，調查學緣、專業資格與實踐關係。","S19","Taiwanese Architects' Lineage Survey");
edge(ncku,lineage,"curatorial","建築系研究團隊參與譜系調查",2019,"S19");
edge(museum,lineage,"curatorial","建築文獻調查研究之典藏與委託單位",2019,"S30");
edge(lineage,exhibition,"curatorial","特展承接前期調查研究",2022,"S30");
D.researchNotes.education="新增成大歷任系主任官方名錄、東海歷任系務主持紀錄與戰後建築師譜系研究。教師、主任與師生關係須嚴格區分。";
})();