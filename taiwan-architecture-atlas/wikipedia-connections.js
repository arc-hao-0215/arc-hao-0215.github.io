/* Scoped Wikipedia relationship additions.
 * Every connection below is explicitly mentioned in the corresponding
 * biographical article. Source year is an event year, never assumed to be
 * a person's birth year or an unrelated project's construction year.
 */
(() => {
"use strict";
const D=window.ATLAS_DATA;if(!D)return;
const norm=s=>String(s||"").replace(/汉/g,"漢").replace(/\s+/g,"");
const get=name=>D.nodes.find(n=>norm(n.name)===norm(name));
let serial=0;
function node(name,type,source,desc,year=null){
 const exists=get(name);if(exists)return exists;
 const n={id:"wikilink-"+(++serial),name,en:name,type,year,lane:0,offset:0,desc,sources:[source]};
 if(type==="person"){n.birthYear=null;n.birthStatus="unverified";n.workRegion="Region to verify";}
 D.nodes.push(n);return n;
}
const edgeKey=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
function relation(a,b,type,label,year,source){
 const x=get(a),y=get(b);if(!x||!y||x.id===y.id)return;
 const key=[x.id,y.id].sort().join("|")+"|"+type;
 if(edgeKey.has(key)){
   // Preserve prior sourced claims; additional relationship text may contain
   // new dates, but should be verified before overwriting the older record.
   const existing=D.edges.find(e=>[e.a,e.b].sort().join("|")+"|"+e.type===key);
   if(existing&&!existing.src.includes(source))existing.src.push(source);
   return;
 }
 edgeKey.add(key);D.edges.push({a:x.id,b:y.id,type,label,year,src:[source]});
}
const src=name=>D.nodes.find(n=>n.name===name)?.wikipediaSourceId||null;
const e=(name,target,type,label,year)=>relation(name,target,type,label,year,src(name));
node("宗邁建築師事務所","practice",src("陳邁"),"陳邁與費宗澄共同創立，曾承接大型公共工程、醫療及交通建築。");
e("陳邁","國立成功大學建築學系","education","成大建築系畢業（畢業年份未由此頁核實）",undefined);
e("陳邁","東海大學建築學系","education","曾任東海大學建築系專任教授",undefined);
e("陳邁","宗邁建築師事務所","affiliation","與費宗澄合夥創立宗邁建築師事務所；成立年份待查",undefined);
node("費宗澄","person",src("陳邁"),"與陳邁共同創辦宗邁建築師事務所之建築師；出生年份待考。");
relation("費宗澄","宗邁建築師事務所","affiliation","與陳邁共同創辦",undefined,src("陳邁"));
node("小智研發","practice",src("黃謙智"),"黃謙智創立的循環材料與設計研發企業，並非傳統持照建築師事務所。");
e("黃謙智","小智研發","affiliation","2005年創立小智研發",2005);
e("黃謙智","哈佛大學設計研究所","education","哈佛大學建築碩士（2004）",2004);
e("莊智超","淡江大學建築學系","education","淡江大學建築系畢業，年份待核實",undefined);
e("莊智超","麻省理工學院建築學系","education","取得麻省理工學院相關碩士；精確學院及年份待核實",undefined);
e("鄭自才","國立成功大學建築學系","education","畢業於成功大學建築學系",undefined);
node("卡內基美隆大學","institution",src("鄭自才"),"鄭自才在美國取得建築碩士的學校。");
e("鄭自才","卡內基美隆大學","education","卡內基美隆大學建築碩士",undefined);
node("基泰工程司","practice",src("關頌聲"),"關頌聲創辦的建築工程司，在臺灣及其他地區參與現代建築與工程。");
e("關頌聲","基泰工程司","affiliation","創辦基泰工程司，年份待核實",undefined);
node("國立故宮博物院本院","work",src("黃寶瑜"),"位於臺北士林之外雙溪國立故宮博物院建築，由黃寶瑜設計，於1965年落成。");
e("黃寶瑜","國立故宮博物院本院","design","國立故宮博物院本院建築設計；1965年落成",1965);
const np=get("國立故宮博物院本院");if(np)np.chronology={year:1965,basis:"completed",label:"1965年建築落成",source:src("黃寶瑜")};
node("大壯建築師事務所","practice",src("黃寶瑜"),"黃寶瑜1961年創立的建築師事務所。");
e("黃寶瑜","大壯建築師事務所","affiliation","1961年創立大壯建築師事務所",1961);
e("黃寶瑜","國立成功大學建築學系","education","1949年來臺後曾擔任省立工學院建築系講師",undefined);
node("中原大學建築學系","institution",src("黃寶瑜"),"戰後臺灣建築教育的重要學系之一，黃寶瑜1961–1973年擔任首任系主任。");
e("黃寶瑜","中原大學建築學系","education","1961–1973年擔任首任系主任",1961);
node("東京大學都市工學系","institution",src("黃秋月"),"黃秋月於東京大學都市工學科修習研究生及碩士課程。");
e("黃秋月","東京大學都市工學系","education","1968年取得東京大學都市工學碩士",1968);
e("黃秋月","國立成功大學建築學系","education","成大建築系畢業，並曾任講師及助教",undefined);
node("國立成功大學都市計畫學系","institution",src("黃秋月"),"黃秋月曾於1978至1984年間擔任系主任之機構。");
e("黃秋月","國立成功大學都市計畫學系","education","1978–1984年間擔任系主任",1978);
e("賴怡成","東海大學建築學系","education","東海大學建築系畢業",undefined);
node("康乃爾大學建築學院","institution",src("賴怡成"),"賴怡成於1994年取得建築與都市設計碩士學位的學校。");
e("賴怡成","康乃爾大學建築學院","education","1994年取得建築暨都市設計碩士",1994);
e("賴怡成","淡江大學建築學系","education","曾擔任淡江大學建築系系主任與所長，任期待核實",undefined);
e("李政隆","國立成功大學建築學系","education","曾於成功大學攻讀建築研究所碩士",undefined);
e("李政隆","淡江大學建築學系","education","曾在淡江大學任教",undefined);
node("指南宮凌霄寶殿","work",src("李重耀"),"李重耀1966年設計的木柵指南宮凌霄寶殿；1966年是設計年代而非直接認定完工年。");
e("李重耀","指南宮凌霄寶殿","design","1966年建築設計，完工年份未核實",1966);
node("李重耀建築師事務所","practice",src("李重耀"),"李重耀於1958年獨立開設的建築師事務所。");
e("李重耀","李重耀建築師事務所","affiliation","1958年成立個人建築師事務所",1958);
relation("李學忠","李重耀","family","李重耀之子，兩人皆從事建築實務；親屬關係不等同師承",undefined,src("李學忠"));
node("林明娥建築師事務所","practice",src("林明娥"),"林明娥1988年成立，涉及商場、影城及商業建築設計。");
e("林明娥","林明娥建築師事務所","affiliation","1988年創立",1988);
node("台茂購物中心","work",src("林明娥"),"林明娥的商業空間相關設計作品；完整歸屬、階段及實際建築年份待核實。");
e("林明娥建築師事務所","台茂購物中心","design","Wikipedia列為相關商業建築作品；設計階段與完工年仍待查證",undefined);
node("實踐大學建築設計學系","institution",src("王澤"),"王澤曾擔任專任教授的建築設計教學機構。");
e("王澤","實踐大學建築設計學系","education","曾任實踐大學建築系專任教授",undefined);
e("李顯榮","淡江大學建築學系","education","淡江大學建築系畢業",undefined);
e("王維仁","國立臺灣大學","education","國立臺灣大學地質學士與土木相關碩士",undefined);
e("王維仁","加州大學柏克萊分校環境設計學院","education","取得柏克萊加州大學建築碩士",undefined);
node("香港大學建築學系","institution",src("王維仁"),"王維仁曾任教並主持系務的香港大學建築學系。");
e("王維仁","香港大學建築學系","education","2012年起任教，並曾擔任系主任",2012);
e("林洲民","淡江大學建築學系","education","淡江大學建築系畢業",undefined);
node("貝聿銘與合夥人建築師事務所","practice",src("林洲民"),"由貝聿銘及合夥人組成之國際建築師事務所；人物任職關係依個人傳記核實。");
e("林洲民","貝聿銘與合夥人建築師事務所","affiliation","1988–1995年擔任建築師，為任職而非師徒關係",1988);
e("彭蔭宣","貝聿銘與合夥人建築師事務所","affiliation","曾於貝聿銘建築公司工作約十年，確切期間待核實",undefined);
e("彭蔭宣","哈佛大學設計研究所","education","哈佛大學建築學碩士",undefined);
node("竹間聯合建築師事務所","practice",src("簡學義"),"由簡學義創辦的竹間建築工作室逐步發展而來，1992年使用聯合建築師事務所名稱。");
e("簡學義","竹間聯合建築師事務所","affiliation","1987年成立竹間建築工作室，1992年更名為竹間聯合建築師事務所",1987);
e("簡學義","東海大學建築學系","education","東海大學建築系畢業；該維基條目年份敘述不一致，暫不標註畢業年",undefined);
e("阮慶岳","淡江大學建築學系","education","淡江大學建築系畢業",undefined);
node("賓夕法尼亞大學建築學院","institution",src("阮慶岳"),"阮慶岳取得建築碩士及張清華取得建築碩士的美國大學建築學院，實際系所名稱與時期待核實。");
e("阮慶岳","賓夕法尼亞大學建築學院","education","美國賓夕法尼亞大學建築碩士",undefined);
e("張清華","賓夕法尼亞大學建築學院","education","1984年取得賓夕法尼亞大學建築碩士",1984);
e("張清華","國立成功大學建築學系","education","1979年建築系畢業",1979);
e("郭英釗","國立成功大學建築學系","education","1982年建築系畢業",1982);
e("郭英釗","加州大學柏克萊分校環境設計學院","education","1989年取得建築碩士",1989);
e("張清華","九典聯合建築師事務所","affiliation","1999年與郭英釗共同創立",1999);
e("郭英釗","九典聯合建築師事務所","affiliation","1999年與張清華共同創立",1999);
relation("張清華","郭英釗","collaboration","1999年共同創立九典聯合建築師事務所",1999,src("張清華"));
e("王重平","李祖原建築師事務所","affiliation","1978年與李祖原共事並創立聯合事務所，1980年成為合夥人",1978);
e("張瑪龍","國立成功大學建築學系","education","1979年建築系畢業、1999年建築博士",1979);
node("張瑪龍陳玉霖聯合建築師事務所","practice",src("張瑪龍"),"張瑪龍與陳玉霖共同主持的建築設計團隊，設計公共文化及教育設施。");
e("張瑪龍","張瑪龍陳玉霖聯合建築師事務所","affiliation","主持建築師；1999年最初創立個人事務所，聯合團隊沿革需另查",undefined);
e("姜樂靜","東海大學建築學系","education","1987年東海建築系碩士畢業",1987);
e("龔書章","淡江大學建築學系","education","曾於淡江建築系任教",undefined);
e("謝欽宗","謝欽宗建築師事務所","affiliation","擔任事務所負責人，成立年份待考",undefined);
node("謝欽宗建築師事務所","practice",src("謝欽宗"),"謝欽宗主持的建築師事務所；原始 Wikipedia 條目列名負責人。");
e("謝欽宗","謝欽宗建築師事務所","affiliation","事務所負責人，成立年份不詳",undefined);
e("金長銘","國立成功大學建築學系","education","1947年開始於省立工學院建築系任教",1947);
node("謝江","person",src("謝自南"),"澎湖傳統大木匠師，謝自南之父及老師；出生年份未有充分資料，不應憑徒弟年代推估。");
relation("謝自南","謝江","mentorship","傳統大木作技藝直接由父親謝江傳授，屬工藝師承",undefined,src("謝自南"));
node("國立臺灣科技大學建築系","institution",src("楊博宇"),"楊博宇建築學士教育相關機構。");
e("楊博宇","國立臺灣科技大學建築系","education","取得臺灣科技大學建築學士，年份待考",undefined);
node("楊博宇建築師事務所","practice",src("楊博宇"),"楊博宇主持的建築師事務所，創立年份待查。");
e("楊博宇","楊博宇建築師事務所","affiliation","事務所負責人（成立年份待查）",undefined);
node("中國文化大學建築及都市設計學系","institution",src("盧毓駿"),"1961年盧毓駿參與中國文化學院相關建築學系創建與主持。");
e("盧毓駿","中國文化大學建築及都市設計學系","education","1961年主持建築及都市設計學系創設與系務",1961);
D.rosterRelationsAdded=true;
})();
