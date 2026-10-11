/* Editorial depth layer: compact, attributable field notes derived from
 * professional journals and original architect/project accounts, not generic awards.
 * These interpret evidence but do not assert undocumented mentor relationships.
 */
(() => {
const D=window.ATLAS_DATA;if(!D)return;
const refs=[
 ["S32","2023臺灣建築獎／壽山動物園、科技藝術館與基隆太平國小","https://www.twarchitect.org.tw/awards/2023/","《建築師》雜誌"],
 ["S33","2024臺灣建築獎評選及作品評述","https://www.twarchitect.org.tw/awards/2024/","《建築師》雜誌"],
 ["S34","臺灣大學人文館／作品檔案與基地歷史","https://www.twarchitect.org.tw/works/%E8%87%BA%E7%81%A3%E5%A4%A7%E5%AD%B8%E4%BA%BA%E6%96%87%E9%A4%A8/","竹間聯合建築師事務所／《建築師》雜誌"],
 ["S35","壽山動物園／作品檔案與動物福利、參觀動線","https://www.twarchitect.org.tw/works/%E5%A3%BD%E5%B1%B1%E5%8B%95%E7%89%A9%E5%9C%92/","邱文傑建築師事務所／《建築師》雜誌"],
 ["S36","2025臺灣建築獎／新北市美術館、宜蘭轉運站、基隆塔","https://www.twarchitect.org.tw/awards/2025-2/","《建築師》雜誌"],
 ["S37","十年磨一劍：蘆葦叢中的美術館","https://www.twarchitect.org.tw/special/%E5%8D%81%E5%B9%B4%E7%A3%A8%E4%B8%80%E5%8A%8D%EF%BC%9A%E8%98%86%E8%91%A6%E5%8F%A2%E4%B8%AD%E7%9A%84%E7%BE%8E%E8%A1%93%E9%A4%A8/","姚仁喜、楊孟凡／《建築師》雜誌"],
 ["S38","屏東縣立圖書館總館／作品檔案","https://www.twarchitect.org.tw/works/%E5%B1%8F%E6%9D%B1%E7%B8%A3%E7%AB%8B%E5%9C%96%E6%9B%B8%E9%A4%A8%E7%B8%BD%E9%A4%A8/","MAYU architects／《建築師》雜誌"],
 ["S39","小城市的文化風景／屏東縣立圖書館總館","https://www.twarchitect.org.tw/special/%E5%B0%8F%E5%9F%8E%E5%B8%82%E7%9A%84%E6%96%87%E5%8C%96%E9%A2%A8%E6%99%AF/","陳玉霖／《建築師》雜誌"],
 ["S40","2010臺灣建築獎／蘭陽博物館與花博新生三館","https://www.twarchitect.org.tw/awards/2010-2/","《建築師》雜誌"],
 ["S41","2021臺灣建築獎／再生建築與公共空間","https://www.twarchitect.org.tw/awards/2021/","《建築師》雜誌"],
 ["S42","臺灣戰後第一代建築系與地域性轉化／陳其寬","https://www.twarchitect.org.tw/special/%E8%87%BA%E7%81%A3%E6%88%B0%E5%BE%8C%E7%8F%BE%E4%BB%A3%E5%BB%BA%E7%AF%89%E7%9A%84%E5%9C%B0%E5%9F%9F%E6%80%A7%E8%BD%89%E5%8C%96-%E5%BE%9E%E6%9D%B1%E6%B5%B7%E6%A0%A1%E5%9C%92%E4%BD%8F%E5%AE%BF%E8%A8%AD/","薛孟淇／《建築師》雜誌"]
];
const oldSources=new Set(D.sources.map(s=>s.id));
refs.forEach(([id,title,url,publisher])=>{if(!oldSources.has(id))D.sources.push({id,title,url,publisher});});
function get(name){return D.nodes.find(n=>n.name===name);}
const notes=[
 ["臺灣大學人文館","臺大人文館位於臺大校門旁的文化資產密集區，與原有農業陳列館共處一處歷史基地。竹間在2007年至2018年間進行設計、2019年至2024年間施工，必須在保留舊館、維持校園尺度與整合文學院需求之間協調。它的價值不只是一件獲獎的新建築，也在於透過長時間的文化資產、校園規劃與公共程序協商所形成的空間成果。",["S34","S33"]],
 ["壽山動物園","壽山動物園既有園區更新由邱文傑建築師事務所及合作團隊參與。新增空中遊園路徑、懸掛式展廊與山形展館，同時打開老舊獸舍引入通風採光。設計者將動物福利、動線改造與遊客觀察方式並置，使園區改建不再只是展館形式的更新；2023年臺灣建築獎評審亦特別討論了人與動物的觀看關係。",["S35","S32"]],
 ["臺北藝術大學科技藝術館","臺北藝術大學科技藝術館位於校園軸線端點。設計運用架高的黑盒子與灰盒子為科技藝術提供展演空間，讓地面與校園延伸動線保持連續。2023年臺灣建築獎評述強調，其建築量體與校園軸線的關係，是理解此案的關鍵，而非單純將之視為形式強烈的展覽建築。",["S32"]],
 ["基隆太平國小","太平國小為已停止原有教學用途的校園更新案例。設計透過外加樓梯、城市眺望點與連接山徑的空橋，使既有校舍與基隆山城的步行路線重新產生關係。獲2023年臺灣建築轉生特別獎；評審將其視為非文資的閒置公共建築如何延續使用價值的重要案例。",["S32"]],
 ["高雄流行音樂中心","此案沿高雄港分布主展演場館、展示空間與多個中小型演出單元。2023年臺灣建築獎評審注意到其港灣城市介面、複合活動安排與戶外遮蔭空間；名錄中的設計單位並包含海外合作建築師，能作為研究臺灣文化設施國際合作關係的具體例證。",["S32"]],
 ["礁溪國小運動場及地下停車場","田中央將礁溪國小的停車需求與學童通學、雨天接送、地方步行動線聯繫起來。2024年臺灣建築獎評審認為這個案例的意義並不只在停車場機能，而是在交通基礎設施的設置過程中如何形成面向市民與學校的公共空間。",["S33"]],
 ["新竹香山那魯灣集會所","林柏陽建築師事務所設計的集會所位於新竹香山濕地與自行車道路徑附近，與在地居民的集會、放學後使用及日常市集相關。2024年臺灣建築新人獎評述特別提到其沒有明顯正門、以開放水平構架容納不同活動的空間特性；此案提醒我們地方公共建築不只有行政服務，也涉及生活文化。",["S33"]],
 ["新北市美術館","新北市美術館坐落於大漢溪沿岸的三鶯地區。大元團隊於2014年參與國際競圖，經長期公共文化設施建設而形成作品；2025年獲臺灣建築獎。建築師公開敘述將河岸蘆葦地景、開放的藝術街坊、公共雕塑空間與上方彈性展覽場館視為重要構成，使其兼具都市公共性與藝術機構的專業展覽條件。",["S37","S36"]],
 ["宜蘭轉運站","宜蘭轉運站因既有交通服務設施日益飽和而原地重建。《建築師》雜誌2025年得獎評述記錄，田中央將轉乘功能與宜蘭都市綠軸相互聯繫，讓交通設施除運量與車輛組織外，也涉及城市步行環境與公共空間的連續性。",["S36"]],
 ["基隆塔","基隆塔是基隆山海城串聯計畫的一部分，利用垂直交通與高處步行路線連接港邊城市、山城與希望之丘周邊。2025年臺灣建築獎都市觸媒特別獎將其視為城市關係重新連結的案例，值得從公共交通、地方觀光與山坡都市地形一併檢視，而不只是一個地標量體。",["S36"]],
 ["屏東縣立圖書館總館","屏東縣立圖書館總館改造原1983年中正文化中心建築。MAYU團隊透過新增開放的大廳，使原本面向公園內部的建築重新與城市接觸。作品說明記錄設計期間為2017–2018年、施工期間為2018–2020年；建築師進一步將新大廳理解為圖書館連接策展、交流、餐飲、市集及閱讀的公共介面，而非單純增加藏書空間。",["S38","S39"]],
 ["蘭陽博物館","蘭陽博物館由姚仁喜／大元聯合建築師事務所參與設計。2010年臺灣建築獎評述強調建築形體對宜蘭單面山地形的回應，以及建築材料、地景與蘭陽環境關係的抽象轉化。這個案例能用來討論臺灣地域主義如何超越直接的地方圖騰與形式模仿。",["S40"]],
 ["陳其寬","陳其寬參與東海大學早期校園及路思義教堂設計，並於1960年擔任東海建築系創系系主任。《建築師》雜誌刊載的研究分析了1957–1962年間其於東海校園住宿設施中的地域性轉化，指出其作品如何逐漸與傳統居住方式、地方生活與空間觀念形成對話。相關學術論述應和具體設計歸屬分開記錄。",["S42","S28","S01"]],
 ["田中央","以黃聲遠長期投入宜蘭的實踐為基礎，田中央在公共建築、地方文化與日常空間之間形成多項被《建築師》雜誌記錄的作品，從宜蘭河畔舊城生活廊帶、關埔國小、礁溪運動場到宜蘭轉運站。對這個團隊的分析不能只比對外觀風格，而應觀察不同公共機關委託、地景與社區生活在各時期的關係。",["S18","S33","S36"]]
];
notes.forEach(([name,desc,ids])=>{
 const n=get(name);if(!n)return;
 n.desc=desc;
 const seen=new Set(n.sources||[]);
 ids.forEach(id=>{if(!seen.has(id)){n.sources.push(id);seen.add(id);}});
});
const zoo=get("壽山動物園");
const axb=D.nodes.find(n=>n.name==="AxB 建築工作室");
if(zoo&&!axb){
 const practice={id:"edit-axb",name:"AxB 建築工作室",en:"AxB Architecture Studio",type:"practice",year:2023,lane:2,offset:1,desc:"壽山動物園得獎資料列名的建築設計協作團隊，參見2023年臺灣建築獎詳細頁面。",sources:["S32"]};
 D.nodes.push(practice);
 D.edges.push({a:practice.id,b:zoo.id,type:"design",label:"2023年得獎作品設計協作單位",year:2023,src:["S32"]});
}
const ntu=get("國立臺灣大學")||{id:"edit-ntu",name:"國立臺灣大學",en:"National Taiwan University",type:"institution",year:null,lane:1,offset:0,desc:"位於臺北市的研究型大學，其校園內臺灣大學人文館涉及既有歷史建築與當代學術設施的整合。",sources:["S34"]};
if(!get("國立臺灣大學"))D.nodes.push(ntu);
const humanities=get("臺灣大學人文館");
if(humanities&&!D.edges.some(e=>[e.a,e.b].includes(ntu.id)&&[e.a,e.b].includes(humanities.id))){
 D.edges.push({a:ntu.id,b:humanities.id,type:"education",label:"校園新建文學院設施",year:2024,src:["S34"]});
}
const agri=get("臺大農業陳列館")||{id:"edit-agri",name:"臺大農業陳列館",en:"NTU Agricultural Exhibition Hall",type:"work",year:null,lane:1,offset:0,desc:"臺大校園人文館基地所保留的既有歷史建築。人文館的設計須處理與農陳館的基地關係、歷史保存及建築尺度的調和。",sources:["S34"]};
if(!get("臺大農業陳列館"))D.nodes.push(agri);
D.relations.context="保存環境／基地關係";
if(humanities&&!D.edges.some(e=>e.type==="context"&&[e.a,e.b].includes(humanities.id)&&[e.a,e.b].includes(agri.id))){
 D.edges.push({a:humanities.id,b:agri.id,type:"context",label:"鄰接之保留歷史建築與基地脈絡，並非同一設計者",year:2024,src:["S34"]});
}
})();