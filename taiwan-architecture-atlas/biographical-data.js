/* Architecture in Taiwan — birth-year anchors and sourced professional biography.
 * NEVER infer a birth year from an award, graduation, career or office date.
 * Unknown / disputed births remain unanchored. Region represents a person's
 * primary work setting for THIS research corpus, not passport or birthplace.
 */
(() => {
  "use strict";
  const D=window.ATLAS_DATA;if(!D)return;
  const refs=[
    ["B01","黃聲遠生於1963年、創立田中央及宜蘭實踐｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%4047262","國家文化藝術基金會"],
    ["B02","漢寶德（1934–2014）｜文化部","https://www.moc.gov.tw/en/News_Content2.aspx?n=479&s=17430","文化部"],
    ["B03","高而潘（1928–2022）｜文化部追思與教育實務","https://www.moc.gov.tw/News_Content.aspx?n=105&s=95465","文化部"],
    ["B04","李祖原，1938年生、1978年成立事務所｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401258","國家文化藝術基金會"],
    ["B05","姚仁喜生於1951年｜人名規範資料庫（原資料引自維基，待交叉查證）","https://authority.dila.edu.tw/person/search.php?aid=A047259","法鼓文理學院人名規範資料庫"],
    ["B06","陳其寬（1921）｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401236","國家文化藝術基金會"],
    ["B07","張肇康（1922）｜國立臺灣博物館展覽","https://www.ntm.gov.tw/News_Content.aspx?n=5651&s=185158","國立臺灣博物館"],
    ["B08","I. M. Pei (1917) | Pritzker Architecture Prize","https://www.pritzkerprize.com/biography-im-pei","Pritzker Architecture Prize"],
    ["B09","Toyo Ito (1941), practice founded 1971 | Pritzker Prize","https://www.pritzkerprize.com/biography-toyo-ito","Pritzker Architecture Prize"],
    ["B10","Rem Koolhaas (1944), OMA founded 1975 | OMA","https://www.oma.com/partners/rem-koolhaas","OMA"],
    ["B11","Shigeru Ban (1957) | Pritzker Prize","https://www.pritzkerprize.com/biography-shigeru-ban","Pritzker Architecture Prize"],
    ["B12","Francine Houben (1955) | biography","https://www.atlasofatmosphere.com/houben","Atlas of Atmosphere"],
    ["B13","謝英俊（1954）｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401282","國家文化藝術基金會"],
    ["B14","王大閎1918年生｜國家文藝獎（其他資料有1917年）","https://www.ncafroc.org.tw/artsaward/winnerDetail%401263","國家文化藝術基金會"],
    ["B15","王大閎1917年生｜百科條目（與文藝獎年份不一致）","https://zh.wikipedia.org/wiki/%E7%8E%8B%E5%A4%A7%E9%96%8E","維基百科／需再次查證"],
    ["B16","高而潘出生、1951成大畢業、1965淡江任教、1966開業｜文化部","https://www.moc.gov.tw/News_Content.aspx?n=105&s=95465","文化部"],
    ["B17","王大閎、貝聿銘及葛羅培於哈佛相關師承｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401263","國家文化藝術基金會"],
    ["B18","李祖原建築教育及創業年表｜臺灣建築學會","https://www.architw.org.tw/view_article.php?id=7030","臺灣建築學會"],
    ["B19","謝英俊淡江學歷（1977）、1984開業｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401282","國家文化藝術基金會"],
    ["B26","姚仁喜1951年出生、柏克萊教育背景及Sam Davis授業紀錄｜國家文藝獎","https://www.ncafroc.org.tw/artsaward/winnerDetail%401253","國家文化藝術基金會"]
  ];
  const knownSources=new Set(D.sources.map(s=>s.id));
  refs.forEach(([id,title,url,publisher])=>{if(!knownSources.has(id))D.sources.push({id,title,url,publisher});});
  const get=name=>D.nodes.find(n=>n.name===name||n.en===name);
  const mark=(name,birth,region,refs,death=null)=>{
    const n=get(name);if(!n)return;
    n.birthYear=birth;
    n.birthSourceIds=refs;
    n.deathYear=death;
    n.workRegion=region;
    n.birthStatus="source-documented";
    n.sources=[...new Set([...(n.sources||[]),...refs])];
  };
  mark("黃聲遠",1963,"Taiwan — North & Yilan",["B01"]);
  mark("漢寶德",1934,"Taiwan — Across Regions",["B02"],2014);
  mark("高而潘",1928,"Taiwan — North",["B03"],2022);
  mark("李祖原",1938,"Taiwan — North",["B04","B18"]);
  mark("姚仁喜",1951,"Taiwan — North",["B26"]);
  mark("陳其寬",1921,"Taiwan — Central",["B06"],2007);
  mark("張肇康",1922,"Taiwan — Central",["B07"]);
  mark("貝聿銘",1917,"United States / Global",["B08"],2019);
  mark("伊東豊雄",1941,"Japan / East Asia",["B09"]);
  mark("雷姆・庫哈斯",1944,"Europe",["B10"]);
  mark("坂茂",1957,"Japan / East Asia",["B11"]);
  mark("法蘭馨・侯班",1955,"Europe",["B12"]);
  mark("謝英俊",1954,"Taiwan — Across Regions",["B13"]);
  // Conflicting reputable biographical records: do not silently choose.
  const wang=get("王大閎");
  if(wang){
    wang.birthYear=null;
    wang.birthStatus="conflicting-sources";
    wang.birthCandidates=[1917,1918];
    wang.birthSourceIds=["B14","B15"];
    wang.workRegion="Taiwan — North";
    wang.deathYear=2018;
    wang.sources=[...new Set([...(wang.sources||[]),"B14","B15"])];
  }
  // Everyone else stays unanchored until a published birth year is checked.
  D.nodes.filter(n=>n.type==="person").forEach(n=>{
    if(n.birthYear===undefined)n.birthYear=null;
    if(!n.birthStatus)n.birthStatus="unverified";
    if(!n.workRegion)n.workRegion="Region to verify";
  });
  const aliases={"Krish Yao":"姚仁喜"};
  function add(name,type,source,desc,en){
    const old=get(name);if(old)return old;
    const safe=name.replace(/[^a-z0-9\u4e00-\u9fff]+/gi,"").slice(0,14);
    const n={id:"bio-"+safe,name,en:en||name,type,year:null,lane:0,offset:0,desc,sources:[source]};
    if(type==="person"){n.birthYear=null;n.birthStatus="unverified";n.workRegion="Region to verify";}
    D.nodes.push(n);return n;
  }
  const edgeKeys=new Set(D.edges.map(e=>[e.a,e.b].sort().join("|")+"|"+e.type));
  function edge(a,b,type,label,year,src){
    const x=get(a),y=get(b);if(!x||!y)return;
    const k=[x.id,y.id].sort().join("|")+"|"+type;if(edgeKeys.has(k))return;
    edgeKeys.add(k);D.edges.push({a:x.id,b:y.id,type,label,year,src:[src]});
  }
  // Confirmed education and office histories; not inferred direct mentorship.
  const princeton=add("普林斯頓大學建築學院","institution","B18","李祖原於1966年取得普林斯頓大學建築碩士；此節點為學校與其教育關係。","Princeton University School of Architecture");
  edge("李祖原","國立成功大學建築學系","education","1961年畢業於成功大學建築系",1961,"B18");
  edge("李祖原",princeton.name,"education","1966年取得普林斯頓大學建築藝術碩士",1966,"B18");
  edge("李祖原","李祖原建築師事務所","affiliation","1978年創立李祖原建築師事務所",1978,"B18");
  edge("謝英俊","淡江大學建築學系","education","1977年畢業於淡江大學建築系",1977,"B19");
  edge("高而潘","國立成功大學建築學系","education","1951年畢業於臺南工學院建築系（今成功大學）",1951,"B16");
  edge("高而潘","淡江大學建築學系","education","自1965年起於淡江大學建築系任教",1965,"B16");
  edge("高而潘","高而潘建築師事務所","affiliation","1966年創立高而潘建築師事務所",1966,"B16");
  const gropius=add("華特・葛羅培斯","person","B17","王大閎與貝聿銘於哈佛相關課程曾受其指導；文獻記載此教育背景，不推定兩人其後的所有設計思想皆源於他。","Walter Gropius");
  gropius.birthYear=1883;gropius.birthStatus="source-documented";gropius.birthSourceIds=["B17"];gropius.deathYear=1969;gropius.workRegion="United States / Global";
  const harvard=add("哈佛大學設計研究所","institution","B17","王大閎及貝聿銘的建築學習機構；就讀與指導關係需各自從傳記來源確認。","Harvard Graduate School of Design");
  edge("王大閎",harvard.name,"education","哈佛大學建築研究所畢業，與貝聿銘同時受葛羅培斯教導",undefined,"B17");
  edge("貝聿銘",harvard.name,"education","1946年哈佛設計研究所建築碩士",1946,"B08");
  edge("王大閎",gropius.name,"education","於哈佛相關學習期間受葛羅培斯指導",undefined,"B17");
  edge("貝聿銘",gropius.name,"education","於哈佛建築教育期間受葛羅培斯指導",undefined,"B17");
  const tfam=add("臺北市立美術館","work","B03","高而潘重要建築作品，文化部記載其設計及戰後建築文化的重要性。","Taipei Fine Arts Museum");
  edge("高而潘",tfam.name,"design","臺北市立美術館原建築設計",undefined,"B03");
  D.biographicalEdition="birth-year primary coordinates; verified professional relations";
})();
