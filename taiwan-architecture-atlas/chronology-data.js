/* Chronology corrections — version 03.
 * Dates are explicitly typed to avoid mixing founding, degree, work completion,
 * first public operation, award year and relative-only diagram placement.
 * chronology.year drives placement; node.year continues to describe the original
 * source event (often an award). Positions are NOT evidence of direct influence.
 */
(() => {
 "use strict";
 const D=window.ATLAS_DATA;if(!D)return;
 const sources=[
 ["S49","黃聲遠、田中央：2018 臺灣館官方手冊人物年表","https://themefile.culture.tw/file/2018-06-07/68ab0a5d-1beb-40d9-bfd3-ff48562b4fd2/Taiwan%20pavilion%20-%20Forum%20booklet.pdf","2018 威尼斯建築雙年展臺灣館 / Ministry of Culture"],
 ["S50","Huang Sheng-Yuan biography / education, practice and early employment","https://arch.rice.edu/latest/events/huang-sheng-yuan","Rice School of Architecture"],
 ["S51","淡江建築系：起源、發展、歷屆系主任（1964 年成立）","https://www.engineering.tku.edu.tw/engineering/File/Archive/F1-20-CB-5D-6D-16-84-7B-C4-0B-E4-89-38-12-1F-CA.pdf","淡江大學建築學系官方系史"],
 ["S52","羅東文化工場：2012年試營運與2013年正式營運","https://lcwh.e-land.gov.tw/cp.aspx?n=2760","宜蘭縣羅東文化工場"],
 ["S53","淡水雲門劇場：原設計與合作團隊","https://www.cloudgate.org.tw/cgt/about/architecture-and-environment","雲門舞集官方網站"],
 ["S54","雲門劇場2014年落成報導","https://www.cna.com.tw/news/ahel/201411100212.aspx","中央通訊社"],
 ["S55","雲門劇場2015年4月開幕","https://www.cloudgate.org.tw/cgt/about/cloud-gate-theater","雲門舞集官方網站"],
 ["S56","黃聲遠：耶魯後於莫斯事務所工作，1993回台、1994開業","https://www.verse.com.tw/article/huangshengyuan-people-land","VERSE 文化雜誌"],
 ["S57","東海大學建築學系：1960年創系官方沿革","https://arch.thu.edu.tw/about/1/","東海大學建築學系"]
 ];
 const existingSources=new Set(D.sources.map(s=>s.id));
 sources.forEach(([id,title,url,publisher])=>{if(!existingSources.has(id))D.sources.push({id,title,url,publisher});});
 const get=name=>D.nodes.find(n=>n.name===name);
 function cite(node,ids){
  const names=new Set(node.sources||[]);
  ids.forEach(id=>names.add(id));node.sources=[...names];
 }
 function anchor(name,year,basis,label,src){
  const n=get(name);if(!n)return;
  n.chronology={year,basis,label,source:src};
  if(src)cite(n,[src]);
 }
 // A school's actual founding date can be documented separately from a
 // person's later graduation. Yale's placement is the latter: NOT founding.
 anchor("淡江大學建築學系",1964,"founded","1964 建築系成立","S51");
 anchor("東海大學建築學系",1960,"founded","1960 建築系成立","S57");
 anchor("國立成功大學建築學系",1944,"founded","1944 建築系創辦（圖上起點為 1945）","S27");
 anchor("耶魯大學建築學院",1990,"education-context","1991 黃聲遠取得建築碩士；圖示於其畢業前一年，並非建校時間","S49");
 anchor("Eric Owen Moss Architects",1991,"career-context","黃聲遠 1991 年起任 Project Associate；事務所本身創立年份未核實","S49");
 anchor("北卡羅萊納州立大學",1992,"career-context","黃聲遠 1993 年返台前曾任教；1992 僅作視覺時間參照","S49");
 anchor("黃聲遠",1993,"career","1993 年返臺，後於宜蘭從事在地建築實踐","S49");
 anchor("田中央",1994,"founded","1994 年於宜蘭成立","S49");
 anchor("羅東文化工場",2012,"trial-opening","2012 年試營運；2013 年正式營運","S52");
 anchor("東海大學",1955,"campus","東海大學於1955年開始招生；此為校園時間參照","S02");
 // Existing work from a historic award index; preserve its award date as
 // awardYear but locate building at verified completion date.
 const cloud=get("雲門劇場");
 if(cloud){
  cloud.awardYear=cloud.year;
  cloud.chronology={year:2014,basis:"completed",label:"2014 年建築落成；2015 年開幕營運",source:"S54"};
  cloud.desc="雲門劇場位於新北市淡水，由黃聲遠主持的田中央聯合建築師事務所擔任建築設計，乙太設計顧問公司負責劇場專業設計。2014年落成、2015年正式開幕。建築設計與劇場專業設計應分別歸屬。";
  cite(cloud,["S53","S54","S55"]);
 }
 // Career, alumni and design edges: time applies to the documented event.
 function revise(nameA,nameB,type,label,year,source){
  const a=get(nameA),b=get(nameB);if(!a||!b)return false;
  const e=D.edges.find(e=>e.type===type&&((e.a===a.id&&e.b===b.id)||(e.a===b.id&&e.b===a.id)));
  if(e){e.year=year;e.label=label;e.src=[...new Set([...(e.src||[]),source])];}
  else D.edges.push({a:a.id,b:b.id,type,label,year,src:[source]});
  cite(a,[source]);cite(b,[source]);return true;
 }
 revise("黃聲遠","耶魯大學建築學院","education","1991年取得耶魯建築碩士",1991,"S49");
 revise("黃聲遠","Eric Owen Moss Architects","affiliation","1991年起任 Project Associate；任職截止年份未明，1993年返台",1991,"S49");
 revise("黃聲遠","北卡羅萊納州立大學","education","1993年返台前曾任教（任職確切年份待考）",undefined,"S49");
 revise("黃聲遠","田中央","affiliation","1994年在宜蘭創辦",1994,"S49");
 revise("田中央","羅東文化工場","design","建築設計；2012年試營運，2013年正式營運",2012,"S52");
 revise("田中央","雲門劇場","design","建築設計；2014年落成，2015年開幕",2014,"S53");
 // The practice and the named architect share project attribution, but this
 // should not generate fictitious Yale↔Eric or Eric↔Fieldoffice edges.
 revise("黃聲遠","雲門劇場","design","田中央主持建築師；2014年落成的雲門劇場",2014,"S53");
 const theatre=get("雲門劇場");
 if(theatre&&get("田中央"))theatre.designPracticeId=get("田中央").id;
 const luodong=get("羅東文化工場");
 if(luodong){luodong.desc="田中央設計的宜蘭公共文化建築。羅東文化工場於2012年7月起試營運、2013年2月開始正式營運；年份據官方場館沿革，與得獎年份分開記錄。";cite(luodong,["S52"]);}
 const huang=get("黃聲遠");if(huang){
   huang.desc="東海建築系1986年畢業、1991年取得耶魯建築碩士。曾於Eric Owen Moss Architects擔任Project Associate，返台前亦任教北卡羅萊納州立大學；1993年回台，1994年在宜蘭成立田中央。羅東文化工場及雲門劇場為其代表公共建築作品。";
   cite(huang,["S49","S50"]);
 }
 const yale=get("耶魯大學建築學院");if(yale){
  yale.desc="耶魯大學建築學院。與臺灣建築網絡之此條連結為黃聲遠1991年取得建築碩士的學歷紀錄；圖上年份代表該學歷事件之前的背景節點位置，不代表學院成立年份。";
 }
 const tamkang=get("淡江大學建築學系");if(tamkang){
   tamkang.year=1964;tamkang.desc="淡江大學建築學系，1964年成立（官方系史及歷屆系主任記錄）。與建築師的教學、就讀連結依個別履歷記載時間；1964為系所成立年，不是校友畢業年。";
   cite(tamkang,["S51"]);
 }
 const moss=get("Eric Owen Moss Architects");if(moss){
   moss.desc="黃聲遠取得耶魯建築碩士後，1991年起曾於美國Eric Owen Moss Architects擔任Project Associate。此節點依黃聲遠的任職事件定位，並非事務所創立年。";
 }
 const field=get("田中央");if(field){
   field.year=1994;field.desc="田中央由黃聲遠於1994年在宜蘭創立。圖譜中作品依能查證的落成或試營運年份排序；得獎日期另記，不視同落成年。";
 }
 // Curated ordered milestones: relationship associations only, NOT new edges
 // between Yale and Eric Owen Moss, since the two are not proven linked.
 D.stories=D.stories||{};
 D.stories.huang=[
  {node:"東海大學建築學系",year:1986,role:"education",label:"建築學士畢業",src:"S49"},
  {node:"耶魯大學建築學院",year:1991,role:"education",label:"建築碩士畢業",src:"S49"},
  {node:"Eric Owen Moss Architects",year:1991,role:"employment",label:"Project Associate（任期約略，起於1991）",src:"S49"},
  {node:"北卡羅萊納州立大學",year:null,role:"teaching",label:"1993返臺前任教，年份未詳",src:"S49"},
  {node:"黃聲遠",year:1993,role:"career",label:"返臺",src:"S49"},
  {node:"田中央",year:1994,role:"foundation",label:"宜蘭創立",src:"S49"},
  {node:"羅東文化工場",year:2012,role:"completed",label:"2012試營運／2013正式營運",src:"S52"},
  {node:"雲門劇場",year:2014,role:"completed",label:"2014落成／2015開幕",src:"S54"}
 ];
 D.researchNotes=D.researchNotes||{};
 D.researchNotes.chronology="Timeline x-axis is chronology-placement, not a uniform founded/award field. Specific event basis is preserved per node and sourced; other entities use visibly qualified layout anchors.";
})();
