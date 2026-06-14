# DermacareVision AI - Disease Insights Knowledge Base
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan
#
# Educational clinical-support content only. Each profile is matched to a
# predicted label by keyword so that labels from all three models resolve
# to the most relevant guidance.

# Ordered list of (keywords, profile). The first profile whose any keyword
# appears in the (lower-cased) predicted label wins. Order matters: place
# more specific conditions before broad ones.
_PROFILES = [
    {
        "keywords": ["melanoma"],
        "name": "Melanoma",
        "severity": "high",
        "overview": "Melanoma is a serious form of skin cancer that develops in melanocytes, the cells that produce pigment. Early detection dramatically improves outcomes.",
        "symptoms": [
            "Asymmetric mole with irregular borders",
            "Multiple or uneven colors within a single lesion",
            "Diameter larger than 6 mm",
            "A mole that changes in size, shape, or color over time",
        ],
        "risk_indicators": [
            "History of intense, intermittent sun exposure or sunburns",
            "Fair skin, light hair, and many moles",
            "Family or personal history of melanoma",
        ],
        "precautions": [
            "Seek prompt evaluation by a dermatologist for biopsy",
            "Perform monthly skin self-examinations using the ABCDE rule",
            "Use broad-spectrum SPF 30+ sunscreen daily",
        ],
        "awareness": "Any rapidly changing or bleeding pigmented lesion warrants urgent professional assessment.",
    },
    {
        "keywords": ["basal cell", "bcc", "malignant", "actinic keratosis", "carcinoma", "cancer"],
        "name": "Malignant / Pre-malignant Lesion",
        "severity": "high",
        "overview": "This category covers malignant and pre-malignant skin lesions such as basal cell carcinoma and actinic keratosis, often linked to cumulative UV damage.",
        "symptoms": [
            "Pearly or waxy bump, sometimes with visible blood vessels",
            "Flat, scaly, or crusty patch that does not heal",
            "Sore that bleeds, oozes, or recurs",
        ],
        "risk_indicators": [
            "Chronic sun exposure and outdoor occupations",
            "Older age and fair complexion",
            "Prior radiation or immunosuppression",
        ],
        "precautions": [
            "Obtain a dermatological evaluation and biopsy",
            "Avoid further UV exposure and tanning beds",
            "Schedule regular full-body skin checks",
        ],
        "awareness": "Non-healing or growing lesions should never be ignored; most skin cancers are highly treatable when caught early.",
    },
    {
        "keywords": ["acne", "rosacea"],
        "name": "Acne & Rosacea",
        "severity": "low",
        "overview": "Acne and rosacea are common inflammatory conditions affecting the face. Acne involves clogged follicles, while rosacea causes persistent redness.",
        "symptoms": [
            "Whiteheads, blackheads, papules, or pustules",
            "Facial redness and flushing",
            "Visible small blood vessels (rosacea)",
        ],
        "risk_indicators": [
            "Hormonal fluctuations and adolescence",
            "Oily skin and certain cosmetics",
            "Triggers such as spicy food, alcohol, or heat (rosacea)",
        ],
        "precautions": [
            "Use gentle, non-comedogenic cleansers",
            "Avoid picking or squeezing lesions",
            "Consult a dermatologist for persistent or scarring cases",
        ],
        "awareness": "Consistent skincare and trigger avoidance manage most cases; persistent inflammation benefits from professional treatment.",
    },
    {
        "keywords": ["eczema", "atopic dermatitis", "contact dermatitis", "poison ivy"],
        "name": "Eczema / Dermatitis",
        "severity": "moderate",
        "overview": "Eczema and dermatitis are inflammatory skin reactions causing itchy, dry, and irritated skin, often triggered by allergens or irritants.",
        "symptoms": [
            "Intense itching, especially at night",
            "Dry, scaly, or cracked skin",
            "Red to brownish-gray patches",
        ],
        "risk_indicators": [
            "Personal or family history of allergies or asthma",
            "Exposure to irritants, soaps, or allergens",
            "Dry climate and frequent hand washing",
        ],
        "precautions": [
            "Moisturize frequently with fragrance-free emollients",
            "Identify and avoid triggers",
            "Use prescribed topical treatments during flares",
        ],
        "awareness": "Eczema is chronic but manageable; consistent moisturizing and trigger control reduce flares.",
    },
    {
        "keywords": ["psoriasis", "lichen planus"],
        "name": "Psoriasis & Lichen Planus",
        "severity": "moderate",
        "overview": "Psoriasis is a chronic autoimmune condition causing rapid skin-cell buildup, while lichen planus produces itchy, flat-topped bumps.",
        "symptoms": [
            "Thick, silvery scales on red plaques",
            "Itching, burning, or soreness",
            "Affected scalp, elbows, knees, or lower back",
        ],
        "risk_indicators": [
            "Family history of psoriasis",
            "Stress, infections, or certain medications",
            "Smoking and obesity",
        ],
        "precautions": [
            "Keep skin moisturized and avoid known triggers",
            "Follow prescribed topical or systemic therapy",
            "Manage stress and maintain a healthy weight",
        ],
        "awareness": "These are chronic immune-mediated conditions; dermatologist-guided therapy controls symptoms effectively.",
    },
    {
        "keywords": ["tinea", "ringworm", "candidiasis", "fungal", "nail fungus"],
        "name": "Fungal Infection",
        "severity": "low",
        "overview": "Fungal infections such as ringworm, candidiasis, and nail fungus are caused by dermatophytes or yeast thriving in warm, moist areas.",
        "symptoms": [
            "Ring-shaped, scaly, itchy rash",
            "Discolored, thickened, or brittle nails",
            "Redness and itching in skin folds",
        ],
        "risk_indicators": [
            "Excess moisture and sweating",
            "Shared facilities (pools, locker rooms)",
            "Weakened immunity or diabetes",
        ],
        "precautions": [
            "Keep affected areas clean and dry",
            "Use antifungal creams or as prescribed",
            "Avoid sharing towels, shoes, or nail tools",
        ],
        "awareness": "Most fungal infections respond well to antifungal therapy; persistent cases need medical evaluation.",
    },
    {
        "keywords": ["wart", "molluscum", "viral", "herpes", "hpv", "std"],
        "name": "Viral Skin Infection",
        "severity": "low",
        "overview": "Viral skin infections, including warts, molluscum contagiosum, and herpes, are caused by viruses and are often contagious through contact.",
        "symptoms": [
            "Small, firm, raised bumps or growths",
            "Clustered blisters (herpes)",
            "Painless pearly papules (molluscum)",
        ],
        "risk_indicators": [
            "Skin-to-skin contact with an infected person",
            "Weakened immune system",
            "Breaks in the skin barrier",
        ],
        "precautions": [
            "Avoid direct contact and sharing personal items",
            "Do not scratch or pick lesions",
            "Seek treatment for painful or spreading lesions",
        ],
        "awareness": "Many viral skin lesions resolve over time; antiviral or removal treatments help persistent cases.",
    },
    {
        "keywords": ["bacterial", "cellulitis", "impetigo"],
        "name": "Bacterial Skin Infection",
        "severity": "moderate",
        "overview": "Bacterial infections such as cellulitis and impetigo cause inflamed, sometimes painful skin and can spread if untreated.",
        "symptoms": [
            "Red, swollen, warm, and tender skin",
            "Honey-colored crusts (impetigo)",
            "Fever or spreading redness (cellulitis)",
        ],
        "risk_indicators": [
            "Cuts, wounds, or insect bites",
            "Diabetes or poor circulation",
            "Weakened immune system",
        ],
        "precautions": [
            "Keep wounds clean and covered",
            "Seek prompt care for spreading redness or fever",
            "Complete the full course of prescribed antibiotics",
        ],
        "awareness": "Spreading redness, warmth, or fever may signal cellulitis and needs urgent medical care.",
    },
    {
        "keywords": ["hair", "alopecia", "hairloss"],
        "name": "Hair Loss / Alopecia",
        "severity": "low",
        "overview": "Hair loss conditions range from pattern baldness to autoimmune alopecia areata, producing thinning or patchy hair loss.",
        "symptoms": [
            "Gradual thinning on the scalp",
            "Circular or patchy bald spots",
            "Sudden loosening or shedding of hair",
        ],
        "risk_indicators": [
            "Family history and hormonal changes",
            "Stress, illness, or nutritional deficiency",
            "Autoimmune conditions",
        ],
        "precautions": [
            "Maintain a balanced, protein-rich diet",
            "Avoid harsh styling and excessive heat",
            "Consult a dermatologist for sudden or patchy loss",
        ],
        "awareness": "Many forms of hair loss are treatable or reversible when the underlying cause is addressed early.",
    },
    {
        "keywords": ["pigmentation", "light disease", "vitiligo"],
        "name": "Pigmentation Disorder",
        "severity": "low",
        "overview": "Pigmentation disorders alter skin color through loss or excess of melanin, as seen in vitiligo and related conditions.",
        "symptoms": [
            "Patches of lighter or darker skin",
            "Symmetrical depigmented areas (vitiligo)",
            "Gradual spread of affected patches",
        ],
        "risk_indicators": [
            "Autoimmune conditions",
            "Family history of pigment disorders",
            "Sun exposure history",
        ],
        "precautions": [
            "Protect affected skin from the sun",
            "Consider cosmetic or medical options with a dermatologist",
            "Monitor for any changes in patches",
        ],
        "awareness": "Pigmentation changes are usually benign but should be evaluated to rule out other conditions.",
    },
    {
        "keywords": ["urticaria", "hives", "exanthem", "drug eruption", "allergy"],
        "name": "Allergic Reaction / Hives",
        "severity": "moderate",
        "overview": "Urticaria (hives) and drug eruptions are allergic or hypersensitivity reactions producing raised, itchy welts or widespread rashes.",
        "symptoms": [
            "Raised, itchy welts that may move around",
            "Sudden onset rash after a trigger",
            "Swelling of lips or eyelids in severe cases",
        ],
        "risk_indicators": [
            "Known food, drug, or environmental allergies",
            "Recent new medication",
            "History of atopy",
        ],
        "precautions": [
            "Identify and avoid the triggering substance",
            "Use antihistamines as directed",
            "Seek emergency care for breathing difficulty or facial swelling",
        ],
        "awareness": "Most hives are self-limited, but airway swelling or breathing trouble is a medical emergency.",
    },
    {
        "keywords": ["keratos", "benign", "nevi", "nevus", "mole", "tumor", "vascular"],
        "name": "Benign Lesion / Mole",
        "severity": "low",
        "overview": "Benign lesions such as seborrheic keratoses, melanocytic nevi, and benign tumors are common, non-cancerous skin growths.",
        "symptoms": [
            "Well-defined, stable growth or mole",
            "Uniform color and smooth or waxy surface",
            "No recent change in size or shape",
        ],
        "risk_indicators": [
            "Increasing age",
            "Sun exposure history",
            "Genetic predisposition to moles",
        ],
        "precautions": [
            "Monitor for any change using the ABCDE rule",
            "Have new or changing lesions assessed",
            "Use sun protection",
        ],
        "awareness": "Benign lesions are harmless, but any change in a mole should be checked to exclude malignancy.",
    },
    {
        "keywords": ["lupus", "connective tissue", "systemic", "vasculitis", "bullous"],
        "name": "Systemic / Autoimmune Skin Disease",
        "severity": "high",
        "overview": "Some skin findings reflect systemic autoimmune disease such as lupus, vasculitis, or bullous disorders, which can affect internal organs.",
        "symptoms": [
            "Butterfly-shaped facial rash (lupus)",
            "Blisters or skin breakdown (bullous disease)",
            "Purple or red spots from inflamed vessels (vasculitis)",
        ],
        "risk_indicators": [
            "Existing autoimmune diagnosis",
            "Family history of autoimmune disease",
            "Systemic symptoms such as joint pain or fatigue",
        ],
        "precautions": [
            "Seek evaluation from a dermatologist and rheumatologist",
            "Protect skin from sun, which can trigger flares",
            "Adhere to systemic therapy and monitoring",
        ],
        "awareness": "Skin signs may be the first clue of systemic illness and warrant comprehensive medical evaluation.",
    },
    {
        "keywords": ["scabies", "lyme", "infestation", "bite"],
        "name": "Infestation / Bite",
        "severity": "moderate",
        "overview": "Infestations such as scabies and insect-borne conditions like Lyme disease cause itching, rashes, and sometimes systemic symptoms.",
        "symptoms": [
            "Intense itching, worse at night (scabies)",
            "Burrow tracks or rash in skin folds",
            "Expanding bull's-eye rash (Lyme disease)",
        ],
        "risk_indicators": [
            "Close contact or crowded living conditions",
            "Outdoor or wooded-area exposure",
            "Recent tick or mite exposure",
        ],
        "precautions": [
            "Seek treatment and treat close contacts (scabies)",
            "Remove ticks promptly and monitor for rash",
            "Wash bedding and clothing in hot water",
        ],
        "awareness": "A spreading bull's-eye rash after a tick bite needs prompt medical care to prevent complications.",
    },
    {
        "keywords": ["darier"],
        "name": "Darier's Disease",
        "severity": "moderate",
        "overview": "Darier's disease is a rare inherited disorder causing wart-like, greasy, crusted papules, typically in skin folds and areas rich in oil glands.",
        "symptoms": [
            "Yellow-brown, greasy, crusted bumps",
            "Papules in the chest, back, and skin folds",
            "Worsening with heat, sweat, and sunlight",
        ],
        "risk_indicators": [
            "Family history (autosomal dominant inheritance)",
            "Heat, humidity, and UV exposure",
            "Skin friction and infection",
        ],
        "precautions": [
            "Keep skin cool, dry, and protected from the sun",
            "Use prescribed topical retinoids or emollients",
            "Seek dermatological care for flares or infection",
        ],
        "awareness": "Darier's disease is chronic and genetic; dermatologist-guided care manages flares effectively.",
    },
    {
        "keywords": ["epidermolysis bullosa", "hailey"],
        "name": "Blistering Skin Disorder",
        "severity": "high",
        "overview": "Inherited blistering disorders such as epidermolysis bullosa and Hailey-Hailey disease cause fragile skin that blisters or erodes with minor friction.",
        "symptoms": [
            "Blisters or erosions after minor trauma or friction",
            "Painful raw areas, often in skin folds",
            "Recurrent cracking and crusting",
        ],
        "risk_indicators": [
            "Family history of blistering disease",
            "Heat, sweating, and friction",
            "Secondary bacterial infection",
        ],
        "precautions": [
            "Protect skin from friction and trauma",
            "Keep affected areas clean to prevent infection",
            "Follow specialist dermatological management",
        ],
        "awareness": "These genetic conditions need specialist care; protecting fragile skin and preventing infection is key.",
    },
    {
        "keywords": ["leprosy", "hansen"],
        "name": "Leprosy (Hansen's Disease)",
        "severity": "high",
        "overview": "Leprosy is a chronic bacterial infection (Mycobacterium leprae) affecting skin and nerves. It is curable with multi-drug therapy, and early treatment prevents disability.",
        "symptoms": [
            "Pale or reddish patches with loss of sensation",
            "Numbness in hands, feet, or affected skin",
            "Thickened nerves and muscle weakness",
        ],
        "risk_indicators": [
            "Prolonged close contact with untreated cases",
            "Living in or travel to endemic regions",
            "Weakened immune response",
        ],
        "precautions": [
            "Seek medical care promptly — leprosy is curable",
            "Complete the full course of multi-drug therapy",
            "Protect numb areas from injury and burns",
        ],
        "awareness": "Leprosy is treatable and curable; early diagnosis prevents nerve damage and disability.",
    },
    {
        "keywords": ["larva migrans", "tungiasis", "pediculosis", "lice"],
        "name": "Parasitic Skin Infestation",
        "severity": "moderate",
        "overview": "Parasitic infestations such as cutaneous larva migrans, tungiasis, and pediculosis (lice) are caused by parasites burrowing into or living on the skin.",
        "symptoms": [
            "Intense itching, often worse at night",
            "Winding, raised tracks (larva migrans) or burrowing lesions",
            "Visible parasites, eggs, or nits (lice)",
        ],
        "risk_indicators": [
            "Walking barefoot on contaminated soil or sand",
            "Crowded living conditions or close contact",
            "Poor sanitation or travel to endemic areas",
        ],
        "precautions": [
            "Seek antiparasitic treatment from a clinician",
            "Avoid barefoot contact with contaminated soil",
            "Wash bedding, clothing, and treat close contacts",
        ],
        "awareness": "Parasitic infestations respond well to targeted antiparasitic treatment and good hygiene.",
    },
    {
        "keywords": ["mycosis fungoides", "cutaneous lymphoma"],
        "name": "Cutaneous Lymphoma (Mycosis Fungoides)",
        "severity": "high",
        "overview": "Mycosis fungoides is the most common cutaneous T-cell lymphoma — a slow-growing cancer of the skin's immune cells that often mimics eczema or psoriasis early on.",
        "symptoms": [
            "Persistent, scaly red patches resembling eczema",
            "Patches that do not respond to usual treatments",
            "Progression to raised plaques or tumors over time",
        ],
        "risk_indicators": [
            "Older age and chronic unexplained dermatitis",
            "Long-standing patches resistant to therapy",
        ],
        "precautions": [
            "Seek dermatology evaluation and biopsy for persistent patches",
            "Follow specialist (oncology/dermatology) treatment plans",
            "Attend regular monitoring appointments",
        ],
        "awareness": "Any rash that persists or resists treatment for months should be biopsied to rule out cutaneous lymphoma.",
    },
    {
        "keywords": ["neurofibromatosis"],
        "name": "Neurofibromatosis",
        "severity": "moderate",
        "overview": "Neurofibromatosis is a genetic condition causing benign nerve-tissue tumors and characteristic skin findings such as café-au-lait spots.",
        "symptoms": [
            "Light-brown 'café-au-lait' patches",
            "Soft, rubbery skin lumps (neurofibromas)",
            "Freckling in the armpits or groin",
        ],
        "risk_indicators": [
            "Family history (autosomal dominant inheritance)",
            "Genetic mutation in NF genes",
        ],
        "precautions": [
            "Seek genetic counseling and specialist follow-up",
            "Monitor for new or changing growths",
            "Coordinate multidisciplinary care as needed",
        ],
        "awareness": "Neurofibromatosis is genetic and lifelong; regular monitoring catches complications early.",
    },
    {
        "keywords": ["papilomatosis", "papillomatosis", "confluent"],
        "name": "Confluent and Reticulated Papillomatosis",
        "severity": "low",
        "overview": "Confluent and reticulated papillomatosis is an uncommon condition producing scaly brown patches that merge into a net-like pattern, usually on the trunk.",
        "symptoms": [
            "Brown, slightly scaly papules and patches",
            "Net-like (reticulated) pattern on the chest or back",
            "Usually painless, occasionally mildly itchy",
        ],
        "risk_indicators": [
            "Adolescence and young adulthood",
            "Oily skin and possible yeast involvement",
        ],
        "precautions": [
            "Consult a dermatologist for diagnosis",
            "Follow prescribed treatment (often antibiotics or retinoids)",
            "Maintain gentle skin care",
        ],
        "awareness": "This is a benign cosmetic condition that typically responds well to dermatological treatment.",
    },
    {
        "keywords": ["pityriasis rosea"],
        "name": "Pityriasis Rosea",
        "severity": "low",
        "overview": "Pityriasis rosea is a common, self-limiting rash, often starting with a single 'herald patch' followed by a spreading pattern of smaller patches.",
        "symptoms": [
            "A larger initial 'herald patch'",
            "Smaller oval patches in a 'Christmas-tree' pattern",
            "Mild itching, usually on the trunk",
        ],
        "risk_indicators": [
            "Recent viral infection (suspected trigger)",
            "Most common in adolescents and young adults",
        ],
        "precautions": [
            "Use soothing moisturizers and gentle skin care",
            "Antihistamines may relieve itching",
            "Consult a clinician to confirm the diagnosis",
        ],
        "awareness": "Pityriasis rosea is harmless and usually clears on its own within 6–8 weeks.",
    },
    {
        "keywords": ["dermatofibroma"],
        "name": "Dermatofibroma",
        "severity": "low",
        "overview": "A dermatofibroma is a common, benign skin nodule — a firm bump that often forms after minor skin injury such as an insect bite.",
        "symptoms": [
            "A small, firm, raised nodule",
            "Brownish or pinkish color",
            "'Dimple sign' when pinched",
        ],
        "risk_indicators": [
            "Prior minor skin trauma or insect bites",
            "More common in adults, often on the legs",
        ],
        "precautions": [
            "Usually no treatment needed if stable",
            "Have it checked if it changes or bleeds",
            "Removal is optional for comfort or cosmetics",
        ],
        "awareness": "Dermatofibromas are harmless; evaluation is only needed if the lesion changes.",
    },
    {
        "keywords": ["porokeratosis"],
        "name": "Porokeratosis",
        "severity": "moderate",
        "overview": "Porokeratosis is a disorder of keratin growth producing ring-shaped patches with a distinctive raised border; some types carry a small skin-cancer risk.",
        "symptoms": [
            "Ring-shaped lesions with a thin raised rim",
            "Central dry, scaly area",
            "Often on sun-exposed skin",
        ],
        "risk_indicators": [
            "Sun exposure and fair skin",
            "Immunosuppression",
            "Genetic predisposition",
        ],
        "precautions": [
            "Use sun protection on affected areas",
            "Have lesions monitored by a dermatologist",
            "Report any change, growth, or bleeding",
        ],
        "awareness": "Porokeratosis should be monitored, as some lesions can rarely transform into skin cancer.",
    },
    {
        "keywords": ["normal", "healthy"],
        "name": "Normal / Healthy Skin",
        "severity": "none",
        "overview": "The analyzed image is most consistent with normal, healthy skin showing no signs of the conditions in this model's scope.",
        "symptoms": [
            "Even tone and texture",
            "No suspicious lesions or growths",
            "No persistent itching, scaling, or bleeding",
        ],
        "risk_indicators": [
            "Routine sun exposure",
            "General skin care habits",
        ],
        "precautions": [
            "Continue daily sun protection",
            "Perform regular skin self-examinations",
            "Consult a professional if anything changes",
        ],
        "awareness": "Maintaining sun protection and routine self-checks supports long-term skin health.",
    },
]

_GENERIC = {
    "name": "General Skin Condition",
    "severity": "moderate",
    "overview": "This condition involves changes to the skin that benefit from professional dermatological evaluation for an accurate diagnosis.",
    "symptoms": [
        "Visible change in skin color, texture, or growth",
        "Possible itching, scaling, or discomfort",
        "Lesion that persists or changes over time",
    ],
    "risk_indicators": [
        "Sun exposure history",
        "Personal or family history of skin disease",
        "Skin irritation or compromised immunity",
    ],
    "precautions": [
        "Consult a dermatologist for an accurate diagnosis",
        "Avoid scratching or irritating the area",
        "Practice daily sun protection",
    ],
    "awareness": "When in doubt, a dermatologist's evaluation is the safest path to an accurate diagnosis.",
}


def get_insight(label):
    """Return the best-matching insight profile for a predicted label."""
    if not label:
        return dict(_GENERIC)
    text = label.lower()
    for profile in _PROFILES:
        if any(kw in text for kw in profile["keywords"]):
            result = dict(profile)
            result.pop("keywords", None)
            result["matched_label"] = label
            return result
    result = dict(_GENERIC)
    result["matched_label"] = label
    return result
