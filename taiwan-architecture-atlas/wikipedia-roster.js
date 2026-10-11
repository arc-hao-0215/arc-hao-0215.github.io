/* Wikipedia-assisted roster reconciliation — 2026-10-11
 * All 62 names come from the explicit user-supplied roster.
 * A Wikipedia article is an attributed lead, not independent biography verification.
 * Birth years marked wikipedia-reported are searchable anchors with provisional
 * provenance; conflicting years remain null and deliberately unanchored.
 * No implied architecture licence or project authorship is introduced.
 */
(() => {
"use strict";
const D=window.ATLAS_DATA;if(!D)return;
const R=[{"id":"W001","name":"陳邁","title":"陳邁","url":"https://zh.wikipedia.org/wiki/%E9%99%B3%E9%82%81"},{"id":"W002","name":"張瑪龍","title":"張瑪龍","url":"https://zh.wikipedia.org/wiki/%E5%BC%B5%E7%91%AA%E9%BE%8D"},{"id":"W003","name":"張肇康","title":"張肇康","url":"https://zh.wikipedia.org/wiki/%E5%BC%B5%E8%82%87%E5%BA%B7"},{"id":"W004","name":"張清華","title":"張清華_(建築師)","url":"https://zh.wikipedia.org/wiki/%E5%BC%B5%E6%B8%85%E8%8F%AF_(%E5%BB%BA%E7%AF%89%E5%B8%AB)"},{"id":"W005","name":"呂阿玉","title":"呂阿玉","url":"https://zh.wikipedia.org/wiki/%E5%91%82%E9%98%BF%E7%8E%89"},{"id":"W006","name":"陳仁和","title":"陳仁和","url":"https://zh.wikipedia.org/wiki/%E9%99%B3%E4%BB%81%E5%92%8C"},{"id":"W007","name":"陳其寬","title":"陳其寬","url":"https://zh.wikipedia.org/wiki/%E9%99%B3%E5%85%B6%E5%AF%AC"},{"id":"W008","name":"莊智超","title":"莊智超","url":"https://zh.wikipedia.org/wiki/%E8%8E%8A%E6%99%BA%E8%B6%85"},{"id":"W009","name":"鄭自才","title":"鄭自才","url":"https://zh.wikipedia.org/wiki/%E9%84%AD%E8%87%AA%E6%89%8D"},{"id":"W010","name":"關頌聲","title":"關頌聲","url":"https://zh.wikipedia.org/wiki/%E9%97%9C%E9%A0%8C%E8%81%B2"},{"id":"W011","name":"漢寶德","title":"漢寶德","url":"https://zh.wikipedia.org/wiki/%E6%BC%A2%E5%AF%B6%E5%BE%B7"},{"id":"W012","name":"黃謙智","title":"黃謙智","url":"https://zh.wikipedia.org/wiki/%E9%BB%83%E8%AC%99%E6%99%BA"},{"id":"W013","name":"黃寶瑜","title":"黃寶瑜_(建築師)","url":"https://zh.wikipedia.org/wiki/%E9%BB%83%E5%AF%B6%E7%91%9C_(%E5%BB%BA%E7%AF%89%E5%B8%AB)"},{"id":"W014","name":"黃秋月","title":"黃秋月","url":"https://zh.wikipedia.org/wiki/%E9%BB%83%E7%A7%8B%E6%9C%88"},{"id":"W015","name":"黃聲遠","title":"黃聲遠","url":"https://zh.wikipedia.org/wiki/%E9%BB%83%E8%81%B2%E9%81%A0"},{"id":"W016","name":"姜樂靜","title":"姜樂靜","url":"https://zh.wikipedia.org/wiki/%E5%A7%9C%E6%A8%82%E9%9D%9C"},{"id":"W017","name":"龔書章","title":"龔書章","url":"https://zh.wikipedia.org/wiki/%E9%BE%94%E6%9B%B8%E7%AB%A0"},{"id":"W018","name":"李祖原","title":"李祖原","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E7%A5%96%E5%8E%9F"},{"id":"W019","name":"賴怡成","title":"賴怡成","url":"https://zh.wikipedia.org/wiki/%E8%B3%B4%E6%80%A1%E6%88%90"},{"id":"W020","name":"李政隆","title":"李政隆","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%94%BF%E9%9A%86"},{"id":"W021","name":"李重耀","title":"李重耀","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E9%87%8D%E8%80%80"},{"id":"W022","name":"林慶豐","title":"林慶豐","url":"https://zh.wikipedia.org/wiki/%E6%9E%97%E6%85%B6%E8%B1%90"},{"id":"W023","name":"林洲民","title":"林洲民","url":"https://zh.wikipedia.org/wiki/%E6%9E%97%E6%B4%B2%E6%B0%91"},{"id":"W024","name":"林明娥","title":"林明娥","url":"https://zh.wikipedia.org/wiki/%E6%9E%97%E6%98%8E%E5%A8%A5"},{"id":"W025","name":"劉培森","title":"劉培森","url":"https://zh.wikipedia.org/wiki/%E5%8A%89%E5%9F%B9%E6%A3%AE"},{"id":"W026","name":"李學忠","title":"李學忠_(建築師)","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E5%AD%B8%E5%BF%A0_(%E5%BB%BA%E7%AF%89%E5%B8%AB)"},{"id":"W027","name":"李顯榮","title":"李顯榮","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E9%A1%AF%E6%A6%AE"},{"id":"W028","name":"呂安德","title":"呂安德","url":"https://zh.wikipedia.org/wiki/%E5%91%82%E5%AE%89%E5%BE%B7"},{"id":"W029","name":"盧毓駿","title":"盧毓駿","url":"https://zh.wikipedia.org/wiki/%E7%9B%A7%E6%AF%93%E9%A7%BF"},{"id":"W030","name":"彭蔭宣","title":"彭蔭宣","url":"https://zh.wikipedia.org/wiki/%E5%BD%AD%E8%94%AD%E5%AE%A3"},{"id":"W031","name":"潘冀","title":"潘冀","url":"https://zh.wikipedia.org/wiki/%E6%BD%98%E5%86%80"},{"id":"W032","name":"符傳禎","title":"符傳禎","url":"https://zh.wikipedia.org/wiki/%E7%AC%A6%E5%82%B3%E7%A6%8E"},{"id":"W033","name":"阮慶岳","title":"阮慶岳","url":"https://zh.wikipedia.org/wiki/%E9%98%AE%E6%85%B6%E5%B2%B3"},{"id":"W034","name":"沈祖海","title":"沈祖海","url":"https://zh.wikipedia.org/wiki/%E6%B2%88%E7%A5%96%E6%B5%B7"},{"id":"W035","name":"王秋華","title":"王秋華","url":"https://zh.wikipedia.org/wiki/%E7%8E%8B%E7%A7%8B%E8%8F%AF"},{"id":"W036","name":"王重平","title":"王重平","url":"https://zh.wikipedia.org/wiki/%E7%8E%8B%E9%87%8D%E5%B9%B3"},{"id":"W037","name":"王維仁","title":"王維仁","url":"https://zh.wikipedia.org/wiki/%E7%8E%8B%E7%B6%AD%E4%BB%81"},{"id":"W038","name":"王大閎","title":"王大閎","url":"https://zh.wikipedia.org/wiki/%E7%8E%8B%E5%A4%A7%E9%96%8E"},{"id":"W039","name":"王澤","title":"王澤_(建築學家)","url":"https://zh.wikipedia.org/wiki/%E7%8E%8B%E6%BE%A4_(%E5%BB%BA%E7%AF%89%E5%AD%B8%E5%AE%B6)"},{"id":"W040","name":"夏涵人","title":"夏涵人","url":"https://zh.wikipedia.org/wiki/%E5%A4%8F%E6%B6%B5%E4%BA%BA"},{"id":"W041","name":"謝欽宗","title":"謝欽宗","url":"https://zh.wikipedia.org/wiki/%E8%AC%9D%E6%AC%BD%E5%AE%97"},{"id":"W042","name":"蕭佛助","title":"蕭佛助","url":"https://zh.wikipedia.org/wiki/%E8%95%AD%E4%BD%9B%E5%8A%A9"},{"id":"W043","name":"修澤蘭","title":"修澤蘭","url":"https://zh.wikipedia.org/wiki/%E4%BF%AE%E6%BE%A4%E8%98%AD"},{"id":"W044","name":"楊卓成","title":"楊卓成","url":"https://zh.wikipedia.org/wiki/%E6%A5%8A%E5%8D%93%E6%88%90"},{"id":"W045","name":"姚仁喜","title":"姚仁喜","url":"https://zh.wikipedia.org/wiki/%E5%A7%9A%E4%BB%81%E5%96%9C"},{"id":"W046","name":"葉根壯","title":"葉根壯","url":"https://zh.wikipedia.org/wiki/%E8%91%89%E6%A0%B9%E5%A3%AF"},{"id":"W047","name":"郭英釗","title":"郭英釗","url":"https://zh.wikipedia.org/wiki/%E9%83%AD%E8%8B%B1%E9%87%97"},{"id":"W048","name":"吳明修","title":"吳明修","url":"https://zh.wikipedia.org/wiki/%E5%90%B3%E6%98%8E%E4%BF%AE"},{"id":"W049","name":"孫德鴻","title":"孫德鴻","url":"https://zh.wikipedia.org/wiki/%E5%AD%AB%E5%BE%B7%E9%B4%BB"},{"id":"W050","name":"張紹載","title":"張紹載","url":"https://zh.wikipedia.org/wiki/%E5%BC%B5%E7%B4%B9%E8%BC%89"},{"id":"W051","name":"李承寬","title":"李承寬","url":"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%89%BF%E5%AF%AC"},{"id":"W052","name":"楊博宇","title":"楊博宇_(臺灣)","url":"https://zh.wikipedia.org/wiki/%E6%A5%8A%E5%8D%9A%E5%AE%87_(%E8%87%BA%E7%81%A3)"},{"id":"W053","name":"簡學義","title":"簡學義","url":"https://zh.wikipedia.org/wiki/%E7%B0%A1%E5%AD%B8%E7%BE%A9"},{"id":"W054","name":"蔡欲修","title":"蔡欲修","url":"https://zh.wikipedia.org/wiki/%E8%94%A1%E6%AC%B2%E4%BF%AE"},{"id":"W055","name":"蘇昭龍","title":"蘇昭龍","url":"https://zh.wikipedia.org/wiki/%E8%98%87%E6%98%AD%E9%BE%8D"},{"id":"W056","name":"謝自南","title":"謝自南","url":"https://zh.wikipedia.org/wiki/%E8%AC%9D%E8%87%AA%E5%8D%97"},{"id":"W057","name":"謝英俊","title":"謝英俊","url":"https://zh.wikipedia.org/wiki/%E8%AC%9D%E8%8B%B1%E4%BF%8A"},{"id":"W058","name":"賀陳詞","title":"賀陳詞","url":"https://zh.wikipedia.org/wiki/%E8%B3%80%E9%99%B3%E8%A9%9E"},{"id":"W059","name":"郭旭原","title":"郭旭原","url":"https://zh.wikipedia.org/wiki/%E9%83%AD%E6%97%AD%E5%8E%9F"},{"id":"W060","name":"金長銘","title":"金長銘","url":"https://zh.wikipedia.org/wiki/%E9%87%91%E9%95%B7%E9%8A%98"},{"id":"W061","name":"陳逸堅","title":"陳逸堅","url":"https://zh.wikipedia.org/wiki/%E9%99%B3%E9%80%B8%E5%A0%85"},{"id":"W062","name":"高而潘","title":"高而潘","url":"https://zh.wikipedia.org/wiki/%E9%AB%98%E8%80%8C%E6%BD%98"}];
const B={"陳邁":[1930,2019,"Taiwan — North"],"張瑪龍":[1957,null,"Taiwan — South"],"張清華":[1957,null,"Taiwan — North"],"呂阿玉":[1929,2003,"Taiwan — East"],"陳仁和":[1922,1989,"Taiwan — South"],"莊智超":[1978,null,"Taiwan — North"],"鄭自才":[1936,null,"Taiwan — North"],"關頌聲":[1892,1960,"Taiwan — North"],"黃謙智":[1978,null,"Taiwan — North"],"黃寶瑜":[1918,2000,"Taiwan — North"],"黃秋月":[1933,2018,"Taiwan — South"],"龔書章":[1962,null,"Taiwan — North"],"賴怡成":[1965,null,"Taiwan — North"],"李政隆":[1948,2021,"Taiwan — North"],"李重耀":[1925,2013,"Taiwan — North"],"林洲民":[1955,null,"Taiwan — North"],"林明娥":[1957,null,"Taiwan — North"],"李學忠":[1960,null,"Taiwan — North"],"李顯榮":[1947,null,"Taiwan — North"],"呂安德":[1915,1992,"Taiwan — Offshore Islands"],"盧毓駿":[1904,1975,"Taiwan — North"],"彭蔭宣":[1936,2012,"Taiwan — North"],"潘冀":[1942,null,"Taiwan — North"],"符傳禎":[1970,null,"Europe"],"阮慶岳":[1957,null,"Taiwan — North"],"沈祖海":[1926,2005,"Taiwan — North"],"王重平":[1947,null,"Taiwan — North"],"王澤":[1950,null,"Taiwan — North"],"謝欽宗":[1952,null,"Taiwan — North"],"蕭佛助":[1900,1984,"Taiwan — South"],"葉根壯":[1932,2014,"Taiwan — Offshore Islands"],"李承寬":[1915,null,"Europe"],"楊博宇":[1980,null,"Taiwan — North"],"簡學義":[1954,null,"Taiwan — North"],"謝自南":[1907,1990,"Taiwan — South"],"金長銘":[1917,null,"Taiwan — South"],"陳逸堅":[1966,null,"Taiwan — North"],"郭英釗":[1959,null,"Taiwan — North"]};
const F={"王大閎":[1917,1918],"楊卓成":[1914,1915],"劉培森":[1955,1956]};
const NOTES={"陳邁":"戰後臺灣建築師，曾就讀成大建築、瑞士蘇黎世聯邦理工學院及麻省理工學院，任教東海大學，並與費宗澄共同經營宗邁建築師事務所。","呂阿玉":"臺東地方建築工作者，曾於臺東縣政府建設部門服務。其作品與在地遮陽、空心磚及公共建築關係密切；報導指出未取得正式建築師執照，宜以建築實務者而非執照建築師理解。","莊智超":"具建築教育背景之創業者，淡江大學建築系及麻省理工學院畢業，後參與 IOH 開放個人經驗平台創立。Wikipedia 條目標示來源不足，須進一步核實。","鄭自才":"成大建築學系畢業、卡內基美隆大學建築碩士，曾從事建築及景觀設計，同時具有藝術與公共事務參與經歷。","關頌聲":"近現代建築工程師、企業家，基泰工程司創辦者，戰後於臺灣建築專業與工程領域活動。","黃謙智":"建築師及循環材料設計研發創業者，曾就讀康乃爾大學與哈佛大學，創立小智研發。Wikipedia 條目有來源與中立性問題待確認。","黃寶瑜":"戰後臺灣建築師及教育者，畢業於國立中央大學建築系，曾主持中原大學建築系，並參與國立故宮博物院本院設計。","黃秋月":"臺灣建築與都市計畫學者，畢業於成功大學建築學系及東京大學都市工學，曾主持成功大學都市計畫學系，參與臺南文資研究。","賴怡成":"建築教育研究者，東海建築學士、康乃爾大學建築與都市設計碩士，曾任淡江大學建築系系主任。","李政隆":"臺灣古蹟修復建築師及教育者，曾於成大及東京工業大學求學，參與歷史建築保存與無障礙環境倡議。","李重耀":"臺灣戰後第一代建築師，參與歷史建築修復及遷建，也設計寺廟建築，並於 1958 年成立事務所。","林明娥":"臺灣商業空間建築師，1988 年成立事務所，參與大型商場與影城等公共商業設施的設計。","李學忠":"具淡江大學建築、美國與西班牙建築相關研究背景之建築師，相關傳記條目曾標示來源與利益衝突問題。","李顯榮":"臺灣建築師，淡江建築系畢業，亦曾擔任地方民意代表與立法委員。","呂安德":"澎湖出生的建築專業人士，早年赴日本大學就讀建築科，後曾任澎湖地方公職與縣長。","盧毓駿":"戰後臺灣重要建築師與建築教育者，早年赴法國學習城市規劃，曾參與中國文化學院建築與都市設計系發展。","彭蔭宣":"臺灣建築師，取得哈佛大學建築碩士，曾於貝聿銘事務所工作，參與臺灣公共及校園建築。","符傳禎":"臺灣建築師，資料記載其參與多國高層建築與文化設施等項目；具體個案歸屬仍應逐案查核。","阮慶岳":"建築師、建築評論與文學作者，淡江建築系畢業、賓夕法尼亞大學建築碩士，曾任教元智大學。","王維仁":"出生臺灣、長期於香港從事建築教育與實踐的建築師，曾任香港大學建築系教授，作品以教育與公共建築為主。","王澤":"建築教育學者及漫畫創作者，曾於實踐大學建築相關學系任教，也從事建築研究與創作。","夏涵人":"具臺灣大學土木學士及密西根大學建築碩士背景的建築專業人士，曾任職李祖原建築師事務所，並參與企業與社會事務。","謝欽宗":"臺灣建築師與公共事務參與者，具有文化大學建築與都市設計學系學歷，曾任立法委員。","蕭佛助":"澎湖出生的營造業者，長期參與高雄戲院及都市建設，並創立富華營造廠；不應與持照建築設計師直接混為同類。","葉根壯":"澎湖傳統大木作匠師，參與多項宮廟木構及裝飾工藝，屬傳統匠作系譜而非一般現代建築師事務所體系。","李承寬":"受德國現代建築教育影響之華人建築師，曾在德國研究建築，相關出生年以 Wikipedia 所引身分文件資訊為準。","楊博宇":"臺灣建築師及公共事務參與者，畢業於臺灣科技大學建築系及臺灣大學相關研究所。","簡學義":"竹間聯合建築師事務所創辦者，東海大學建築系畢業，參與鶯歌陶瓷博物館等公共建築。","蔡欲修":"臺灣日治時期具跨日本與臺灣工程實務經驗的建築師，曾於名古屋工業大學求學，作品包括高雄興業信用組合建築。","蘇昭龍":"建築文化相關人物；本版保留使用者提供之 Wikipedia 條目供後續核實，具體生平與年代尚待確認。","謝自南":"澎湖傳統大木作匠師及營造實務者，涉及廟宇木構傳承、施工與設計；其工藝師承可與戰後專業建築教育區分研究。","金長銘":"戰後臺灣早期建築師與教師，曾於成功大學建築系任教，後赴美國取得建築碩士並從事實務。","陳逸堅":"跨領域建築與裝置藝術創作者，具有美國柏克萊大學建築碩士及 UCLA 藝術碩士背景。"};
const norm=s=>String(s||"").replace(/汉/g,"漢").replace(/\s+/g,"").replace(/[・·]/g,"");
const byName=name=>D.nodes.find(n=>n.type==="person"&&norm(n.name)===norm(name));
const existingSources=new Set(D.sources.map(x=>x.id));
const nodeIds=new Set(D.nodes.map(n=>n.id));
const personNames=new Set();
for(const r of R){
 if(!existingSources.has(r.id)){
  D.sources.push({id:r.id,title:r.title+"｜維基百科人物條目（生平待獨立核對）",url:r.url,publisher:"Wikipedia contributors / 中文維基百科"});
  existingSources.add(r.id);
 }
 let n=byName(r.name);
 if(!n){
  let id="wikipedia-person-"+r.id.toLowerCase();
  while(nodeIds.has(id))id+="-x";
  nodeIds.add(id);
  n={id,name:r.name,en:r.name,type:"person",year:null,lane:0,offset:0,
     desc:NOTES[r.name]||"本人物由使用者提供的建築相關名單及所附維基百科條目建立初步檔案；學歷、師承、設計作品與精確年代仍須逐筆查證。",
     sources:[r.id],birthYear:null,birthStatus:"unverified",workRegion:"Region to verify",role:"Architecture-related practitioner"};
  D.nodes.push(n);
 }else{
  n.sources=[...new Set([...(n.sources||[]),r.id])];
 }
 n.wikipediaUrl=r.url;
 n.wikipediaSourceId=r.id;
 n.rosterRequested=true;
 personNames.add(r.name);
 if(NOTES[r.name]&&(n.desc||"").includes("Wikipedia")===false&&n.desc.length<130)n.desc=NOTES[r.name];
 if(B[r.name]){
  const [birth,death,region]=B[r.name];
  if(!Number.isFinite(n.birthYear)||n.birthStatus==="unverified"){
   n.birthYear=birth;n.deathYear=death||n.deathYear||null;
   n.birthSourceIds=[...new Set([...(n.birthSourceIds||[]),r.id])];
   n.birthStatus="wikipedia-reported";
  }else if(n.birthYear!==birth){
   n.birthCandidates=[...new Set([n.birthYear,birth])].sort();
   n.birthYear=null;n.birthStatus="conflicting-sources";
   n.birthSourceIds=[...new Set([...(n.birthSourceIds||[]),r.id])];
  }
  if(!n.workRegion||n.workRegion==="Region to verify")n.workRegion=region;
 }
 if(F[r.name]){
  n.birthYear=null;n.birthStatus="conflicting-sources";
  n.birthCandidates=[...new Set([...(n.birthCandidates||[]),...F[r.name]])].sort();
  n.birthSourceIds=[...new Set([...(n.birthSourceIds||[]),r.id])];
 }
 if(["呂阿玉","蕭佛助","葉根壯","謝自南"].includes(r.name))n.role="Building practitioner / craft or construction";
}
D.userRoster={requested:R.length,matches:personNames.size,addedSourceCount:R.length,
 birthDataStatus:"wikipedia-attributed provisional",
 note:"Wikipedia citations give traceable leads, not unquestioned authority."};
})();
