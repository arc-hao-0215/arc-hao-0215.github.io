"""
Portfolio project catalogue updates — October 2026.

This file is executed by build.py with an existing global `projects` list:

    exec((D / "project-updates.py").read_text())

Its job is to:
    1. Retain the two additional projects and their original credits.
    2. Keep the 2024 Ziqiang atrium competition separate from the
       2025–2026 First Teaching Building commission.
    3. Give all eleven projects a consistent four-level naming system:
         name/title   — conceptual or official project title
         subtitle     — architectural / design project typology
         place, field — location and keywords
         recognition  — prize, commission, or research support (if any)
    4. Preserve existing image IDs, URLs, narrative introductions and
       other build.py fields.
    5. Fix the display order explicitly, then renumber projects 01–11.

IMPORTANT:
    build.py currently renders name/place/field/award but does not render
    `subtitle` or `recognition` directly. Its Grid/Index templates must
    also be updated before rebuilding the site. Do not run the older
    build.py over manually edited HTML until those templates are updated.
"""

# ---------------------------------------------------------------------
# 1. KEEP THE PROJECTS PREVIOUSLY ADDED BY project-updates.py
# ---------------------------------------------------------------------

ADDITIONAL_PROJECTS = [
    dict(
        id="04",
        slug="theater-design",
        title="The Condenser",
        name="The Condenser",
        place="Wudaokou, Beijing",
        year="2025",
        field="Performance · Social Infrastructure · Public Life",
        type="Theater design · Academic project",
        image="theater-hero",
        award="",
        question="Can a theater be a civic space before and after the performance?",
        desc=(
            "The Condenser reimagines the theater as a social condenser "
            "within Wudaokou's mixture of universities, workplaces and "
            "housing. An open ground, generous stairs, shared foyers and "
            "a rooftop amphitheater bring formal performance into "
            "contact with the city's everyday gatherings."
        ),
        credit=(
            "Individual design · Hao Chang<br>"
            "Tsinghua University · Large-scale Public Building Design Studio<br>"
            "Spring 2025 · Unbuilt academic project"
        ),
    ),
    dict(
        id="02",
        slug="first-teaching-building",
        title="First Teaching Building Renewal",
        name="First Teaching Building Renewal",
        place="Tsinghua University, Beijing",
        year="2025–2026",
        field="Education · Adaptive Reuse · Interior Architecture",
        type="Commissioned project",
        image="first-teaching-hero",
        award="",
        question="How can small changes renew an enduring place of learning?",
        desc=(
            "A commissioned renewal of Tsinghua's First Teaching Building "
            "develops contemporary teaching environments within its "
            "inherited spatial order. The January 2026 third-floor proposal "
            "retains the building's structure, proportions and window "
            "openings, while integrating acoustics, lighting, services "
            "and adaptable furniture across classrooms and shared circulation."
        ),
        credit=(
            "Commissioned project · Hao Chang & Mengzhe Lee<br>"
            "Co-lead design · From May 2025<br>"
            "Design stage shown: 30 January 2026<br>"
            "Third-floor design area: 682 m²<br>"
            "Two 96-seat classrooms, a multifunctional classroom, "
            "circulation and teachers' lounge<br>"
            "Images show the design proposal."
        ),
    ),
    dict(
        id="05",
        slug="scaffold-of-care",
        title="Scaffold of Care",
        name="Scaffold of Care",
        place="Zhongli, Taiwan",
        year="2025",
        field="Migration · Public Space · Care",
        type="Academic project · Mixed-Use Architecture",
        image="scaffold-of-care-hero",
        award="Featured in ArchDaily Student Project Awards 2025",
        question="How can a temporary structure support lasting civic belonging?",
        desc=(
            "Scaffold of Care reclaims a neglected gap on Changjiang Road "
            "in Zhongli, Taiwan, as an infrastructure of coexistence. "
            "Modular scaffold platforms accommodate shared meals, learning, "
            "community gatherings and proposed NGO-led support services."
        ),
        credit=(
            "Individual design · Hao Chang<br>"
            "Tsinghua University · 2025<br>"
            "Mixed-Use Architecture · Unbuilt academic proposal<br>"
            "Featured in ArchDaily Student Project Awards 2025"
        ),
    ),
]

existing_slugs = {p["slug"] for p in projects}
for new_project in ADDITIONAL_PROJECTS:
    if new_project["slug"] not in existing_slugs:
        projects.append(new_project)
        existing_slugs.add(new_project["slug"])


# ---------------------------------------------------------------------
# 2. PRESERVE PROJECT-SPECIFIC AWARDS, FACTS AND CREDITS
# ---------------------------------------------------------------------

for p in projects:
    slug = p["slug"]

    if slug == "teaching-building":
        # This is the 2024 competition, NOT the separate 2025 commission.
        p.update(
            year="2024",
            type="Competition proposal",
            award="1st Prize · Ziqiang Technology Building Atrium Design Competition",
            question="How can an atrium become a shared learning landscape?",
            desc=(
                "The atrium proposal turns underused circulation into "
                "places for informal learning, conversation and gathering. "
                "Flexible occupation and a connected interior landscape "
                "extend the building's life beyond the classroom. "
                "The design received first prize in the competition."
            ),
            credit=(
                "Competition proposal · Hao Chang & Mengzhe Lee · 2024<br>"
                "Hao's role: concept, modelling and renderings<br>"
                "Instructor: Martijn de Geus<br>"
                "Recognition: 1st Prize · Ziqiang Technology Building "
                "Atrium Design Competition"
            ),
        )

    elif slug == "waterfront-plus":
        p["award"] = (
            "Gold Award · Urban Design · "
            "China Human Settlements Academic Year Award, 2025"
        )
        chinese_recognition = "中國人居環境學年獎 · 城市設計組 · 金獎（2025）"
        if chinese_recognition not in p["credit"]:
            p["credit"] += "<br>" + chinese_recognition

    elif slug == "ancient-trails":
        p["award"] = "Outstanding Graduation Thesis · Tsinghua University"

    elif slug == "rising-tides":
        p["award"] = "SOM China Fellowship · Winner"


# ---------------------------------------------------------------------
# 3. SINGLE SOURCE OF TRUTH: TITLE / SUBTITLE / PLACE / KEYWORDS
# ---------------------------------------------------------------------

PROJECT_DETAILS = {
    "ancient-trails": dict(
        title="Lightly in the Forest",
        subtitle="Eco-Resort Design",
        place="Gaoligong Mountains, Yunnan",
        keywords="Tea Heritage · Ecology · Low-Impact Architecture",
        recognition="Outstanding Graduation Thesis · Tsinghua University",
        year="2026",
        type="Graduation design & territorial research",
    ),
    "first-teaching-building": dict(
        title="First Teaching Building Renewal",
        subtitle="University Classroom Renovation",
        place="Tsinghua University, Beijing",
        keywords="Education · Adaptive Reuse · Interior Architecture",
        recognition="Commissioned by Tsinghua University",
        year="2025–2026",
        type="Commissioned project",
    ),
    "rising-tides": dict(
        title="Rising Tides, Resilient Lives",
        subtitle="Water-Resilient Community Design",
        place="Kampung Melayu, Jakarta",
        keywords="Flood Resilience · Civic Infrastructure · Collective Life",
        recognition="SOM China Fellowship · Winner",
        year="2025",
        type="Architecture & research",
    ),
    "theater-design": dict(
        title="The Condenser",
        subtitle="Theater & Civic Space Design",
        place="Wudaokou, Beijing",
        keywords="Performance · Social Infrastructure · Public Life",
        recognition="",
        year="2025",
        type="Theater design · Academic project",
    ),
    "scaffold-of-care": dict(
        title="Scaffold of Care",
        subtitle="Mixed-Use Civic Architecture",
        place="Zhongli, Taiwan",
        keywords="Migration · Public Space · Care",
        recognition="Featured in ArchDaily Student Project Awards 2025",
        year="2025",
        type="Academic project · Mixed-Use Architecture",
    ),
    "erdai": dict(
        title="Disarming the Landscape",
        subtitle="Erdai Art Museum & Military Heritage Reuse",
        place="Fenggui Peninsula, Penghu",
        keywords="Military Heritage · Memory · Landscape",
        recognition="",
        year="2024",
        type="Architecture & adaptive reuse",
    ),
    "spirited-a-way": dict(
        title="Spirited A Way",
        subtitle="Pilgrimage Architecture & Landscape Design",
        place="Mount Kailash, Tibet",
        keywords="Ritual · Ecology · Shelter",
        recognition="",
        year="2024",
        type="Architecture & landscape",
    ),
    "books-above-bustles": dict(
        title="Books Above Bustles",
        subtitle="Urban Library Design",
        place="Chang’an Avenue, Beijing",
        keywords="Knowledge · Civic Life · Infrastructure",
        recognition="",
        year="2024",
        type="Civic architecture",
    ),
    "teaching-building": dict(
        title="Learning in Between",
        subtitle="Campus Atrium Design",
        place="Tsinghua University, Beijing",
        keywords="Informal Learning · Shared Space · Adaptive Reuse",
        recognition=(
            "1st Prize · Ziqiang Technology Building "
            "Atrium Design Competition"
        ),
        year="2024",
        type="Competition proposal",
    ),
    "waterfront-plus": dict(
        title="Waterfront+",
        subtitle="Historic Waterfront Urban Design",
        place="Shichahai, Beijing",
        keywords="Water · Heritage · Urban Regeneration",
        recognition=(
            "Gold Award · Urban Design · "
            "China Human Settlements Academic Year Award, 2025"
        ),
        year="2024",
        type="Urban design & heritage renewal",
    ),
    "selected-studies": dict(
        title="Other Ways of Making",
        subtitle="Art, Performance & Editorial Design",
        place="Across Media",
        keywords="Drawing · Editorial Design · Photography · Performance",
        recognition="",
        year="2017–2024",
        type="Art & performance",
    ),
}


# ---------------------------------------------------------------------
# 4. APPLY THE METADATA WITHOUT DISCARDING EXISTING CONTENT
# ---------------------------------------------------------------------

for p in projects:
    slug = p["slug"]
    if slug not in PROJECT_DETAILS:
        # Leave any future project outside the 10-item catalogue untouched.
        continue

    data = PROJECT_DETAILS[slug]

    # `name` is used for the page <title>, image captions, next-project
    # labels and homepage links. `title` is used for the page <h1>.
    p["name"] = data["title"]
    p["title"] = data["title"]

    # New four-level homepage fields.
    p["subtitle"] = data["subtitle"]
    p["place"] = data["place"]
    p["field"] = data["keywords"]
    p["recognition"] = data["recognition"]

    # Optional explicit aliases for future templates or JSON exports.
    p["keywords"] = data["keywords"]
    p["location"] = data["place"]

    # Keep fields that the existing build.py already expects.
    p["year"] = data["year"]
    p["type"] = data["type"]

    # Existing project narratives, image identifiers, questions, and
    # credits are deliberately preserved, except the corrections above.


# ---------------------------------------------------------------------
# 5. EXPLICIT ORDER — DO NOT RELY ON SORTING BY YEAR ALONE
# ---------------------------------------------------------------------

PROJECT_ORDER = [
    "ancient-trails",          # 01
    "first-teaching-building", # 02
    "rising-tides",            # 03
    "theater-design",          # 04
    "scaffold-of-care",        # 05
    "erdai",                   # 06
    "spirited-a-way",          # 07
    "books-above-bustles",     # 08
    "teaching-building",       # 09
    "waterfront-plus",         # 10
    "selected-studies",        # 11 (always last)
]

order_index = {slug: i for i, slug in enumerate(PROJECT_ORDER)}
projects.sort(key=lambda p: order_index.get(p["slug"], len(PROJECT_ORDER)))

for number, p in enumerate(projects, start=1):
    p["id"] = f"{number:02d}"


# ---------------------------------------------------------------------
# 6. SANITY CHECKS FOR MISSING OR DUPLICATED CATALOGUE ENTRIES
# ---------------------------------------------------------------------

catalogue_slugs = [p["slug"] for p in projects if p["slug"] in order_index]
if len(catalogue_slugs) != len(set(catalogue_slugs)):
    raise ValueError("Duplicate project slug in the portfolio catalogue.")

missing_slugs = set(PROJECT_ORDER) - set(catalogue_slugs)
if missing_slugs:
    raise ValueError(
        "Missing required portfolio projects: " + ", ".join(sorted(missing_slugs))
    )

# NOTE: Updating `subtitle` and `recognition` in this file alone will not
# change the HTML markup output by the CURRENT build.py.
# When you later update build.py, its cards and rows should read:
#   p["name"]         -> conceptual title
#   p["subtitle"]     -> project typology
#   p["place"]        -> geographic location
#   p["field"]        -> keywords
#   p["recognition"]  -> awards, commissions or support
