/* Extended research corpus — curated from published award listings and scholarship.
 * The year in award rows is the AWARD / documentation year, not necessarily completion.
 * Do not infer mentorship from shared awards, schools or visually close nodes.
 */
(() => {
 const D=window.ATLAS_DATA;if(!D)return;
 const S=[
 ["S18","臺灣建築獎歷屆得獎名單（設計者／起造／獎項）","https://www.twarchitect.org.tw/award_winner/","《建築師》雜誌 / Taiwan Architect"],
 ["S19","戰後臺灣現代建築師譜系調查研究（1945–1971）","https://nckur.lib.ncku.edu.tw/retrieve/466614/243946.pdf","國立成功大學 / 國立臺灣博物館"],
 ["S20","戰後臺灣現代建築師譜系構成｜現代美術+","https://map.tfam.museum/content/JO0048_01","臺北市立美術館 / 柳青薰"],
 ["S21","〈年表〉1975–2024 建築師雜誌","https://www.twarchitect.org.tw/special/%E3%80%88%E5%B9%B4%E8%A1%A8%E3%80%89/","《建築師》雜誌"],
 ["S22","傳統作為一種辯證行動：臺灣戰後至當代建築的非傳統論述","https://map.tfam.museum/content/JO0046_02","臺北市立美術館"],
 ["S23","臺灣戰後現代建築的地域性轉化：陳其寬與東海校園","https://www.twarchitect.org.tw/special/%E8%87%BA%E7%81%A3%E6%88%B0%E5%BE%8C%E7%8F%BE%E4%BB%A3%E5%BB%BA%E7%AF%89%E7%9A%84%E5%9C%B0%E5%9F%9F%E6%80%A7%E8%BD%89%E5%8C%96-%E5%BE%9E%E6%9D%B1%E6%B5%B7%E6%A0%A1%E5%9C%92%E4%BD%8F%E5%AE%BF%E8%A8%AD/","《建築師》雜誌 / 薛孟淇"],
 ["S24","臺灣建築25年獎首屆得獎","https://www.twarchitect.org.tw/%E6%AD%B7%E5%B1%86%E5%BE%97%E7%8D%8E-25/","《建築師》雜誌"],
 ["S25","2022 臺灣建築獎專題與評審紀錄","https://www.twarchitect.org.tw/awards/2022/","《建築師》雜誌"],
 ["S26","2024 臺灣建築獎專題與評審紀錄","https://www.twarchitect.org.tw/awards/2024/","《建築師》雜誌"]
 ];
 const alreadySources = new Set(D.sources.map(s=>s.id));
 S.forEach(([id,title,url,publisher])=>{if(!alreadySources.has(id))D.sources.push({id,title,url,publisher});});
 D.categories.publication={zh:"出版與研究",en:"Publications",color:"#90795b"};
 const recordNames=new Map(D.nodes.map(n=>[n.name,n]));
 const usedIds=new Set(D.nodes.map(n=>n.id));
 const personPairs=[];
 const norm=s=>s.replace(/\s+/g,"").replace(/臺/g,"台").replace(/[・·]/g,"").toLowerCase();
 const byName=name=>D.nodes.find(n=>norm(n.name)===norm(name));
 let incr=0;
 function addNode(name,type,year,source,desc,en=""){
   const existent=byName(name);if(existent)return existent;
   let id="ext"+String(++incr).padStart(3,"0");
   while(usedIds.has(id))id="ext"+String(++incr).padStart(3,"0");
   usedIds.add(id);
   const n={id,name,en:en||name,type,year,lane:incr%4,offset:(incr%7)-3,desc,sources:[source]};
   D.nodes.push(n);recordNames.set(name,n);return n;
 }
 const edgeKeys=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
 function addEdge(a,b,type,label,year,src){
   const n1=typeof a==="string"?byName(a):a,n2=typeof b==="string"?byName(b):b;
   if(!n1||!n2||n1.id===n2.id)return;
   const k=[n1.id,n2.id].sort().join("|")+"|"+type;
   if(edgeKeys.has(k))return;
   edgeKeys.add(k);D.edges.push({a:n1.id,b:n2.id,type,label,year,src:[src]});
 }
 /* Transcribed documented award entries. 'year' is *award year*. Firm names
  * in the 1990s are kept close to the award register's historical naming.
  */
 const rows = `
2025|新北市美術館|大元聯合建築師事務所
2025|育賢二期社會住宅|戴育澤建築師事務所
2025|上海商業儲蓄銀行總行大樓|潘冀聯合建築師事務所
2025|宜蘭轉運站|田中央
2025|基隆塔|邱文傑建築師事務所
2024|臺灣大學人文館|竹間聯合建築師事務所
2024|南竿二六據點轉譯活化再利用|常式建築師事務所
2024|萬大水力發電廠辦公室|黃明威建築師事務所&擊壤設計
2024|礁溪國小運動場及地下停車場|田中央
2024|新竹香山那魯灣集會所|林柏陽建築師事務所
2023|壽山動物園|邱文傑建築師事務所
2023|臺北藝術大學科技藝術館|郭旭原聯合建築師事務所
2023|波光市集|曾泊銘建築師事務所&嶼山工房
2023|永恆之丘|十彥建築師事務所&Behet Bondzio Lin Architekten
2023|維豐橡膠辦公大樓|呂昆益建築師事務所&691點創創設計
2023|基隆太平國小|郭旭原聯合建築師事務所
2023|高雄流行音樂中心|翁祖模建築師事務所
2022|橫山書法館|潘天壹建築師事務所
2022|巨大集團全球營運總部|潘冀聯合建築師事務所
2022|德光教會|立建築師事務所
2022|臺南市美術館二館|坂茂建築設計&石昭永建築師事務所
2021|台豐球場嘉卿會所與西薩會所|Álvaro Siza / Carlos Castanheira&黃明威建築師事務所
2021|嘉義市立美術館|黃明威建築師事務所&王銘顯建築師事務所
2021|屏東縣立圖書館總館|張瑪龍陳玉霖聯合建築師事務所
2021|樸山村|半畝塘環境整合
2021|濟南教會新宣教中心|張哲夫建築師事務所
2021|淡江教會文教中心|Behet Bondzio Lin Architekten&十彥建築師事務所
2021|利澤飛灰暫置場|田中央
2020|關埔國小第一期|田中央
2020|臺中車站|張樞建築師事務所&台灣世曦工程顧問
2020|新竹市立動物園|邱文傑建築師事務所
2020|太平育賢社會住宅|竹間聯合建築師事務所
2020|山屋|邱文傑建築師事務所
2019|基隆東岸廣場|吳明杰建築師事務所&禾磊設計
2019|富邦藝旅|大尺建築&郭旭原聯合建築師事務所&大矩聯合建築師事務所
2019|壯圍沙丘|田中央
2019|臺大次震宇宙館|大元聯合建築師事務所
2018|渭水之丘|田中央
2018|高雄美國學校運動中心|張瑪龍陳玉霖聯合建築師事務所
2018|青林書屋|楊紹凱建築師事務所&簡安祥建築師事務所
2018|實踐大學民生學院教學大樓更新|蘇富源建築師事務所&嶼山工房
2018|嘉義車站站前西側廣場|沈庭增建築師事務所
2017|臺北市網球中心|竹間聯合建築師事務所
2017|中山小巨蛋與通學廊道|田中央
2017|三星鄉公所暨周邊空間活化|寬和建築師事務所
2016|毓繡美術館|立建築師事務所
2016|雲門劇場|田中央
2016|中和國民運動中心|曾永信建築師事務所&郭恆成建築師事務所
2016|高雄市立圖書館總館|劉培森建築師事務所
2016|臺東大學圖書資訊館|境向聯合建築師事務所
2015|雲林農博公園|大藏聯合建築師事務所
2015|法鼓文理學院|大元聯合建築師事務所
2015|臺中文創園區R04改建|台灣餘弦建築師事務所
2015|華山綠工場|吳明杰建築師事務所&禾磊設計
2014|桃園機場第一航廈改善|許宗熙建築師事務所&團紀彦建築設計事務所
2014|臺鐵苗栗車站|九典聯合建築師事務所
2014|草嶺生態地質國民小學|郭俊沛建築師事務所
2013|法鼓山農禪寺|大元聯合建築師事務所
2013|苗栗客家文化園區|劉培森建築師事務所&竹中工務店
2013|臺灣大學社會科學院|伊東豊雄建築設計事務所&宗邁建築師事務所&陳信樟建築師事務所
2013|烏來立體停車場增建|曾永信建築師事務所
2013|佳佳西市場|王秀蓮建築師事務所&打開聯合文化創意
2012|大溪齋明寺增建|孫德鴻建築師事務所
2012|馬祖高中校園改建|境向聯合建築師事務所
2012|醫療器材宜蘭廠|台灣餘弦建築師事務所
2012|那瑪夏民權國民小學|九典聯合建築師事務所
2012|國立臺灣歷史博物館|竹間聯合建築師事務所
2012|大東文化藝術中心|張瑪龍陳玉霖聯合建築師事務所&de Architekten Cie.
2012|富貴三義館|江文淵建築師事務所&半畝塘環境整合
2012|六堆客家文化園區|謝英俊建築師事務所&打開聯合文化創意
2011|向山行政暨遊客中心|蘇懋彬建築師事務所&團紀彦建築設計事務所
2011|勤和部落避難屋|謝英俊建築師事務所
2011|實踐大學體育館及圖資大樓|大元聯合建築師事務所
2011|臺灣大學博雅教學館|境向聯合建築師事務所
2010|臺北花博夢想館|九典聯合建築師事務所
2010|蘭陽博物館|大元聯合建築師事務所
2010|櫻花陵園D墓區納骨廊|田中央
2010|救恩之光教會|廖偉立建築師事務所
2010|東海大學音樂系暨美術系系館|台灣餘弦建築師事務所
2009|高雄世運主場館|劉培森建築師事務所&伊東豊雄建築設計事務所&竹中工務店
2009|車埕木業展示館|中冶建築師事務所&謝伯昌建築師事務所
2009|雲林勞工育樂中心|廖偉立建築師事務所
2009|工研悠活館|廖偉立建築師事務所
2009|泰安連雲接雲樓|李天鐸建築師事務所
2008|元智大學遠東有庠通訊大樓|台灣餘弦建築師事務所
2008|羅東新林場文化二館|田中央
2008|平均律|張景堯建築師事務所&許錦榮建築師事務所
2008|國立新港藝術高中|原相聯合建築師事務所
2008|新店高中學生活動中心|戴嘉惠建築師事務所
2007|紅瓦厝國小校舍|徐岩奇建築師事務所
2006|臺灣高鐵新竹車站|大元聯合建築師事務所
2006|屏北高級中學|原相聯合建築師事務所
2006|信義計畫區人行天橋|張樞建築師事務所
2006|礁溪生活學習館|田中央
2006|東海大學基礎科學實驗館|張樞建築師事務所
2006|交大機車D棚|潘冀聯合建築師事務所
2006|黑面琵鷺保育管理中心|廖偉立建築師事務所
2006|內湖國民小學|郭俊沛建築師事務所
2005|彰化福興農會穀倉修復|莊學能建築師事務所&石昭永建築師事務所
2005|王功生態景觀橋|廖偉立建築師事務所
2005|廣達研發設計中心|大元聯合建築師事務所
2005|東海大學人文大樓|姜樂靜建築師事務所&黃明威建築師事務所
2005|埔里花卉展售中心|境向聯合建築師事務所
2004|九二一地震教育園區一期|莊學能建築師事務所
2004|宜蘭河畔舊城生活廊帶|田中央
2004|宜蘭縣政中心社區公園|原相聯合建築師事務所
2004|國立臺灣美術館整建|張哲夫建築師事務所&台灣餘弦建築師事務所
2003|花蓮西寶國小|大藏聯合建築師事務所
2003|苗栗木雕博物館擴建|華峰建築師事務所
2003|實踐大學設計教學大樓|大元聯合建築師事務所
2002|中台禪寺|李祖原建築師事務所
2002|十三行博物館|孫德鴻建築師事務所
2002|公務人力發展中心|吳明修建築師事務所
2002|民和國小|林洲民仲觀聯合建築師事務所
2002|礁溪行政中心再生|田中央
2002|邵族文化生活區自立造屋|謝英俊建築師事務所
2002|涵碧樓|戴育澤建築師事務所&Kerry Hill Architects
2001|仁寶電腦總部|大元聯合建築師事務所
2001|鶯歌陶瓷博物館|竹間聯合建築師事務所
2001|成大研究總中心|石昭永建築師事務所&大磊聯合建築師事務所
2001|國立傳統藝術中心傳習所區|境向聯合建築師事務所
2001|宜蘭西堤社福館|田中央
2000|新竹之心東門城廣場|大涵設計顧問&金瑞涵建築師事務所
2000|大南澳教師宿舍|文毓義建築師事務所
2000|敦煌書局內湖書庫|境向聯合建築師事務所
2000|羅東高中美術音樂館|張仲堅建築師事務所&台灣餘弦建築師事務所
1999|礁溪竹林養護院|田中央
1999|臺中養慧學苑|大元聯合建築師事務所
1999|大陸工程總部|大元聯合建築師事務所
1999|柳原教會百週年籌建|陳柏年建築師事務所
1999|南屏國小校園|黃建興建築師事務所
1998|元智大學圖書資訊大樓|大元聯合建築師事務所
1998|礁溪林宅|田中央
1997|新竹縣立文化中心|謝英俊建築師事務所
1995|富邦金融中心|大元聯合建築師事務所&SOM
1993|中正大學圖書資訊大樓|潘冀聯合建築師事務所&王秋華建築師
1992|冬山河親水公園|高而潘建築師事務所
`.trim().split(/\n/).map(line=>line.split("|"));
 const aliases=new Map([
  ["大元聯合建築師事務所","krisyao"],
  ["田中央","fieldoffice"],
  ["九典聯合建築師事務所","bioarch"],
  ["伊東豊雄建築設計事務所","itoassoc"],
  ["李祖原建築師事務所","cylee"],
  ["大矩聯合建築師事務所","daju"],
  ["OMA","oma"],
  ["Mecanoo","mecanoo"],
  ["SOM","som-practice"]
 ]);
 let awardEdges=0;
 rows.forEach(([rawYear,project,firms])=>{
   const year=Number(rawYear);
   let work=byName(project);
   if(!work){
     work=addNode(project,"work",year,"S18","《建築師》雜誌歷屆臺灣建築獎得獎名錄列示的作品，設計歸屬與獎項資訊見原始頁面。本圖的年份為獎項年份，不一定是完工年份。");
   }
   firms.split("&").forEach(firmName=>{
     let firm;
     if(aliases.has(firmName))firm=D.nodes.find(n=>n.id===aliases.get(firmName));
     if(!firm){
       firm=addNode(firmName,"practice",year,"S18","《建築師》雜誌歷屆得獎名錄所列的設計團隊。此年份代表本圖最早記錄的獎項參照年份，不代表事務所成立年份。");
     }
     addEdge(firm,work,"design",rawYear+" 年臺灣建築獎名錄所列設計團隊",year,"S18");
     awardEdges++;
   });
 });
 // Architecture publications and historical research—records linked only when explicitly supported.
 const journals=[
  ["今日建築",1954,"《今日建築》","S22"],
  ["建築雙月刊",1962,"《建築雙月刊》","S22"],
  ["建築與計畫",1969,"《建築與計畫》","S22"],
  ["境與象",1971,"《境與象》","S22"],
  ["建築師",1975,"《建築師》雜誌","S21"],
  ["雅砌",1990,"《雅砌》","S22"],
  ["ta 台灣建築",1995,"《ta 台灣建築》","S22"],
  ["建築Dialogue",1997,"《建築Dialogue》","S22"],
  ["實構築",2019,"《實構築》","S22"]
 ];
 journals.forEach(([name,year,en,src])=>addNode(name,"publication",year,src,"臺灣建築專業出版史中的刊物；刊行時期與論述背景參考現代美術學報及《建築師》雜誌年表。",en));
 const historicalSchools=[
  ["國立成功大學建築學系",1945,"NCKU Department of Architecture"],
  ["國立臺北科技大學建築學系",1950,"Taipei Tech Architecture"],
  ["中原大學建築學系",1960,"Chung Yuan Architecture"],
  ["逢甲大學建築學系",1963,"Feng Chia Architecture"],
  ["淡江大學建築學系",1964,"Tamkang Architecture"]
 ];
 historicalSchools.forEach(([name,year,en])=>addNode(name,"institution",null,"S19","臺灣戰後建築教育體系相關單位。此版尚未逐一核實成立年度，因此以 UNDATED 顯示，不將年代估計當成史實。",en));
 addEdge("國立成功大學建築學系","今日建築","education","學系曾創辦《今日建築》刊物（1954–1955）",1954,"S22");
 // Work directly documented in 25-year award, including architect attribution.
 addNode("王秋華","person",1993,"S24","臺灣重要建築師；《建築師》雜誌首屆建築25年獎資料記錄其參與中原大學張靜愚紀念圖書館設計。","Wang Chiu-hwa");
 addNode("潘冀","person",1993,"S24","潘冀建築師與王秋華共同列名於張靜愚紀念圖書館的得獎設計資料。","J. J. Pan");
 const library=addNode("張靜愚紀念圖書館","work",2024,"S24","中原大學校園圖書館，獲《建築師》雜誌首屆臺灣建築25年獎。2024為25年獎評選年，非完工年。","Chang Ching Yu Memorial Library");
 const chyu=addNode("中原大學","institution",1960,"S24","張靜愚紀念圖書館所在校園；1960僅為本圖歷史佈點參考。","Chung Yuan Christian University");
 addEdge("潘冀",library,"design","《建築師》雜誌記錄的建築設計",2024,"S24");
 addEdge("王秋華",library,"design","《建築師》雜誌記錄的建築設計",2024,"S24");
 addEdge("潘冀聯合建築師事務所",library,"design","名錄列示潘冀建築師事務所參與",2024,"S24");
 addEdge(chyu,library,"education","校園圖書館／獲臺灣建築25年獎",2024,"S24");
 // Named architect-to-office relationships are NOT mentorship or employment claims.
 const namedPeople=[
 ["邱文傑","邱文傑建築師事務所",2023,"Chiu Wen-chieh"],
 ["郭旭原","郭旭原聯合建築師事務所",2023,"Kuo Hsu-yuan"],
 ["石昭永","石昭永建築師事務所",2005,"Shih Chao-yung"],
 ["謝英俊","謝英俊建築師事務所",2002,"Hsieh Ying-chun"],
 ["張瑪龍","張瑪龍陳玉霖聯合建築師事務所",2018,"Chang Ma-long"],
 ["陳玉霖","張瑪龍陳玉霖聯合建築師事務所",2018,"Chen Yu-lin"],
 ["曾泊銘","曾泊銘建築師事務所",2023,"Tseng Po-ming"],
 ["黃明威","黃明威建築師事務所",2021,"Huang Ming-wei"],
 ["林柏陽","林柏陽建築師事務所",2024,"Lin Po-yang"],
 ["潘天壹","潘天壹建築師事務所",2022,"Pan Tian-yi"],
 ["林洲民","林洲民仲觀聯合建築師事務所",2002,"Lin Chou-min"],
 ["廖偉立","廖偉立建築師事務所",2009,"Liao Wei-li"],
 ["孫德鴻","孫德鴻建築師事務所",2002,"Sun Te-hung"],
 ["張樞","張樞建築師事務所",2006,"Chang Shu"],
 ["王秀蓮","王秀蓮建築師事務所",2013,"Wang Hsiu-lien"],
 ["戴育澤","戴育澤建築師事務所",2025,"Tai Yu-tse"],
 ["劉培森","劉培森建築師事務所",2016,"Ricky Liu"],
 ["吳明杰","吳明杰建築師事務所",2019,"Wu Ming-chieh"],
 ["郭俊沛","郭俊沛建築師事務所",2014,"Kuo Chun-pei"],
 ["徐岩奇","徐岩奇建築師事務所",2007,"Hsu Yen-chi"],
 ["王銘顯","王銘顯建築師事務所",2021,"Wang Ming-hsien"],
 ["翁祖模","翁祖模建築師事務所",2023,"Weng Tsu-mo"],
 ["張哲夫","張哲夫建築師事務所",2021,"Chang Che-fu"],
 ["曾永信","曾永信建築師事務所",2016,"Tseng Yung-hsin"],
 ["吳明修","吳明修建築師事務所",2002,"Wu Ming-hsiu"],
 ["高而潘","高而潘建築師事務所",1992,"Kao Erh-pan"],
 ["團紀彦","團紀彦建築設計事務所",2014,"Norihiko Dan"],
 ["坂茂","坂茂建築設計",2022,"Shigeru Ban"],
 ["戴嘉惠","戴嘉惠建築師事務所",2008,"Tai Chia-hui"],
 ["呂昆益","呂昆益建築師事務所",2023,"Lu Kun-yi"]
 ];
 namedPeople.forEach(([name,office,year,en])=>{
   const firm=byName(office);if(!firm)return;
   const who=addNode(name,"person",year,"S18","《建築師》雜誌獎項資料列有以此建築師姓名命名的設計團隊；本資料僅標示具名專業關聯，並不推斷任職年限、學歷或師承。",en);
   addEdge(who,firm,"affiliation","獎項資料中的具名建築師與設計團隊",year,"S18");
 });
 D.version="2026-10-11 / Edition 02 — expanded curated award corpus";
 D.researchNotes={
   entries:rows.length,
   "award-year":"獎項年份作為歷史座標，並不保證為建築物的建成年份",
   "lineage":"學校、師承與思想影響僅在文獻明載時建立關係",
   "completeness":"開放式研究，並非完整臺灣建築史名錄",
   "source":"《建築師》雜誌歷屆獎項＋臺灣現代建築學術研究"
 };
})();
