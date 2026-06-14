# DermacareVision AI - Model Configuration
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan
#
# The platform uses a single unified deep-learning model trained for
# multi-class skin disease classification (25+ conditions). Replaces the
# earlier trio of weaker models.

# Backing model weights repository (downloaded & cached on first run).
HF_MODEL_REPO = "Jayanth2002/dinov2-base-finetuned-SkinDisease"

# The 31 conditions the model can identify (from the model's config).
CLASS_LABELS = [
    "Basal Cell Carcinoma",
    "Darier's Disease",
    "Epidermolysis Bullosa Pruriginosa",
    "Hailey-Hailey Disease",
    "Herpes Simplex",
    "Impetigo",
    "Larva Migrans",
    "Leprosy Borderline",
    "Leprosy Lepromatous",
    "Leprosy Tuberculoid",
    "Lichen Planus",
    "Lupus Erythematosus Chronicus Discoides",
    "Melanoma",
    "Molluscum Contagiosum",
    "Mycosis Fungoides",
    "Neurofibromatosis",
    "Papilomatosis Confluentes And Reticulate",
    "Pediculosis Capitis",
    "Pityriasis Rosea",
    "Porokeratosis Actinic",
    "Psoriasis",
    "Tinea Corporis",
    "Tinea Nigra",
    "Tungiasis",
    "Actinic Keratosis",
    "Dermatofibroma",
    "Nevus",
    "Pigmented Benign Keratosis",
    "Seborrheic Keratosis",
    "Squamous Cell Carcinoma",
    "Vascular Lesion",
]

# Public-facing model metadata (served by /api/models).
MODEL_META = {
    "id": 1,
    "name": "DermaVision Skin Analyzer",
    "architecture": "Custom Deep Learning Model",
    "hf_repo": HF_MODEL_REPO,
    "num_classes": len(CLASS_LABELS),
    "accuracy": "~92%",
    "description": "Unified deep-learning model covering 25+ skin conditions",
}
