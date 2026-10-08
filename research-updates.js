/* RESEARCH CONTENT UPDATE
   Central catalogue for 11 research studies.
   Does not modify project pages or research article bodies.
*/

(() => {
  const studies = [
    {
      file: "research-netherlands.html",
      year: "2026",
      title: "The Work Behind the Water",
      subtitle: "Dutch Water Management & Governance",
      place: "Dutch Delta & Canal Cities",
      keywords: "Infrastructure · Maintenance · Resilience",
      abstract:
        "Floating homes and canal districts rely on more than flood barriers. This study examines the infrastructure, utilities and institutions that make everyday life with water possible."
    },
    {
      file: "research-italy.html",
      year: "2026",
      title: "The Trail as Livelihood",
      subtitle: "Historic Routes & Rural Economies",
      place: "Valle d’Aosta, Italy",
      keywords: "Heritage · Tourism · Rural Life",
      abstract:
        "Restoring a historic trail does not necessarily revive the communities along it. This study explores how access, local economies and long-term stewardship can give heritage routes a continuing role."
    },
    {
      file: "research-gaoligong.html",
      year: "2026",
      title: "A Working Mountain",
      subtitle: "Tea Heritage, Rural Production & Ecology",
      place: "Gaoligong Mountains, Yunnan",
      keywords: "Tea Cultivation · Landscape · Access",
      abstract:
        "The ancient tea landscape is both ecological habitat and a place of everyday production. This research examines how trails, cultivation and rural livelihoods intersect with environmental protection."
    },
    {
      file: "research-rurbanity.html",
      year: "2026",
      title: "Industry and Land Rights",
      subtitle: "Industrial Development & Settlement Change",
      place: "Taichung · Changhua · Xindian, Taiwan",
      keywords: "Land Use · Industry · Community",
      abstract:
        "Factories and settlements cannot be understood as isolated points on a map. This inquiry examines how industrial development, changing land use and collective rights reshape the relationship between people and territory."
    },
    {
      file: "research-water.html",
      year: "2025",
      title: "Beyond the Raised Floor",
      subtitle: "Flood Adaptation & Community Infrastructure",
      place: "Kampung Melayu, Jakarta",
      keywords: "Flooding · Housing · Everyday Services",
      abstract:
        "A raised floor can protect a home, but not the networks that sustain daily life. This investigation considers access routes, sanitation and essential services as part of neighbourhood-scale flood resilience."
    },
    {
      file: "research-theater.html",
      year: "2025",
      title: "The Theatre Between Shows",
      subtitle: "Theatre Programming & Public Access",
      place: "Wudaokou, Beijing",
      keywords: "Performance · Public Space · Everyday Use",
      abstract:
        "A theatre's civic role extends beyond scheduled performances. This study explores how entrances, foyers and shared spaces can support public life even when the auditorium is closed."
    },
    {
      file: "research-ground.html",
      year: "2024",
      title: "After the Battery",
      subtitle: "Military Heritage & Landscape Reuse",
      place: "Fenggui Peninsula, Penghu",
      keywords: "Memory · Adaptive Reuse · Landscape",
      abstract:
        "Transforming a former coastal battery into an art museum requires more than introducing a new programme. This investigation considers how public access and cultural use can coexist with the site's military history."
    },
    {
      file: "research-ritual.html",
      year: "2024",
      title: "When Not to Build",
      subtitle: "Pilgrimage, Ecology & Minimal Intervention",
      place: "Mount Kailash",
      keywords: "Sacred Landscape · Access · Conservation",
      abstract:
        "Improving a pilgrimage route does not always require more construction. This inquiry evaluates safety, sacred meaning and ecological disturbance to understand where architectural intervention is justified—and where restraint is preferable."
    },
    {
      file: "research-shichahai.html",
      year: "2024",
      title: "Access to the Waterfront",
      subtitle: "Historic Waterfronts & Everyday Public Life",
      place: "Shichahai, Beijing",
      keywords: "Water · Heritage · Public Access",
      abstract:
        "Opening a historic waterfront can expand public life while increasing pressure on nearby communities. This study examines who benefits from improved access and how heritage, local life and public space can coexist."
    },
    {
      file: "research-civic.html",
      year: "2024",
      title: "The Public Floor",
      subtitle: "Urban Libraries & Civic Ground Space",
      place: "Beijing",
      keywords: "Knowledge · Urban Infrastructure · Public Life",
      abstract:
        "Raising a library creates an opportunity for public space at ground level. Whether that space becomes genuinely civic depends on circulation, programming and the conditions of everyday access."
    },
    {
      file: "research-hong-kong.html",
      year: "2024",
      title: "Beyond Opening Day",
      subtitle: "Cultural Infrastructure & Long-Term Stewardship",
      place: "Hong Kong",
      keywords: "Culture · Community · Public Participation",
      abstract:
        "A cultural building's public value is not secured by its opening. This study explores how everyday programming, accessibility and long-term stewardship sustain its role within the surrounding community."
    }
  ];

  const byFile = new Map(
    studies.map((study) => [study.file, study])
  );

  const filename = (href) =>
    (href || "").split("#")[0].split("?")[0].split("/").pop();

  const updateText = (element, value) => {
    if (element) element.textContent = value;
  };

  const page = filename(window.location.pathname);

  // 1. Research overview: 11 editorial cards.
  document.querySelectorAll(
    ".research-grid .research-card"
  ).forEach((card) => {
    const link = card.querySelector("h2 a[href]");
    const study = byFile.get(
      filename(link?.getAttribute("href"))
    );

    if (!study) return;

    updateText(link, study.title);

    let subtitle = card.querySelector(
      ".research-card-subtitle"
    );

    if (!subtitle) {
      subtitle = document.createElement("p");
      subtitle.className = "research-card-subtitle";
      card.querySelector("h2").after(subtitle);
    }

    updateText(subtitle, study.subtitle);

    updateText(
      card.querySelector(".research-card-place"),
      `${study.place} / ${study.keywords}`
    );

    updateText(
      card.querySelector(".research-card-question"),
      study.abstract
    );

    const meta = card.querySelectorAll(
      ".research-card-meta span"
    );

    const number = String(
      studies.indexOf(study) + 1
    ).padStart(2, "0");

    updateText(meta[0], `${number} / RESEARCH`);
    updateText(meta[1], study.year);

    updateText(
      card.querySelector(".line-link"),
      "Explore research ↗"
    );
  });

  // 2. Research Index view.
  document.querySelectorAll(
    "#research-index .research-row"
  ).forEach((row) => {
    const study = byFile.get(
      filename(row.getAttribute("href"))
    );

    if (!study) return;

    updateText(row.querySelector("h2"), study.title);

    const spans = row.querySelectorAll(
      ":scope > span"
    );

    updateText(spans[1], study.subtitle);
    updateText(
      spans[2],
      `${study.place} · ${study.year}`
    );
  });

  // 3. World map marker titles and accessibility.
  document.querySelectorAll(
    ".map-markers a[href]"
  ).forEach((marker) => {
    const study = byFile.get(
      filename(marker.getAttribute("href"))
    );

    if (!study) return;

    const number = String(
      studies.indexOf(study) + 1
    ).padStart(2, "0");

    const label =
      `${number} ${study.place}: ${study.title}`;

    marker.setAttribute("aria-label", label);

    updateText(
      marker.querySelector("title"),
      `${study.place} — ${study.title}`
    );
  });

  // 4. Individual research article headers.
  const activeStudy = byFile.get(page);

  if (activeStudy) {
    updateText(
      document.querySelector(".essay-header h1"),
      activeStudy.title
    );

    updateText(
      document.querySelector(
        ".essay-header .essay-subtitle"
      ),
      activeStudy.subtitle
    );

    const byline = document.querySelectorAll(
      ".essay-header .essay-byline span"
    );

    updateText(
      byline[0],
      activeStudy.keywords
    );

    updateText(
      byline[1],
      `${activeStudy.place} · ${activeStudy.year}`
    );

    document.title =
      `${activeStudy.title} — Hao Chang`;
  }

  // 5. Next enquiry navigation in article pages.
  document.querySelectorAll(
    ".research-next a[href]"
  ).forEach((link) => {
    const study = byFile.get(
      filename(link.getAttribute("href"))
    );

    if (!study) return;

    const spans = link.querySelectorAll("span");

    if (spans.length) {
      updateText(
        spans[spans.length - 1],
        `${study.title} →`
      );
    }
  });

})();
