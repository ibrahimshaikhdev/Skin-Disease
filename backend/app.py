# DermacareVision AI - Inference Microservice
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan
#
# Stateless ML service fronted by the Spring Boot gateway. Serves a single
# unified skin-disease model: prediction, Grad-CAM, and disease insights.

from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS

from inference import TORCH_AVAILABLE, _torch_import_error, engine
from insights import get_insight
from models_config import MODEL_META

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max upload

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _read_upload():
    if "file" not in request.files:
        return None, {"error": "No file provided"}, 400
    file = request.files["file"]
    if file.filename == "":
        return None, {"error": "No file selected"}, 400
    if not _allowed(file.filename):
        return None, {"error": "Invalid file type. Allowed: png, jpg, jpeg, webp, bmp"}, 400
    return file.read(), None, None


def _model_descriptor():
    return {
        "id": MODEL_META["id"],
        "name": MODEL_META["name"],
        "architecture": MODEL_META["architecture"],
        "num_classes": len(engine.labels),
        "classes": list(engine.labels),
        "accuracy": MODEL_META["accuracy"],
        "description": MODEL_META["description"],
    }


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "mode": engine.mode,
        "torch_available": TORCH_AVAILABLE,
        "torch_error": _torch_import_error,
        "model": MODEL_META["name"],
        "num_classes": len(engine.labels),
    })


@app.route("/api/models", methods=["GET"])
def get_models():
    # Single unified model (kept as a list for API compatibility).
    return jsonify({"models": [_model_descriptor()]})


@app.route("/api/predict", methods=["POST"])
def predict_route():
    image_bytes, err, status = _read_upload()
    if err:
        return jsonify(err), status

    try:
        result = engine.predict(image_bytes)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify({
        "success": True,
        "mode": engine.mode,
        "model_id": MODEL_META["id"],
        "model_name": MODEL_META["name"],
        "prediction": result,
        "insight": get_insight(result["label"]),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })


@app.route("/api/gradcam", methods=["POST"])
def gradcam_route():
    image_bytes, err, status = _read_upload()
    if err:
        return jsonify(err), status

    target_index = request.form.get("class_index")
    if target_index is not None:
        try:
            target_index = int(target_index)
        except ValueError:
            target_index = None

    try:
        result = engine.gradcam(image_bytes, target_index=target_index)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Grad-CAM failed: {exc}"}), 500

    return jsonify({
        "success": True,
        "mode": engine.mode,
        "model_id": MODEL_META["id"],
        "model_name": MODEL_META["name"],
        **result,
    })


@app.route("/api/insights", methods=["GET"])
def insights_route():
    label = request.args.get("label", "")
    if not label:
        return jsonify({"error": "No label provided"}), 400
    return jsonify({"insight": get_insight(label)})


if __name__ == "__main__":
    print(f"DermacareVision AI inference service starting (mode={engine.mode})")
    if engine.mode == "torch":
        print("Warming up model (first run downloads weights)...")
        engine.warmup()
    else:
        print(f"Running in MOCK mode (torch unavailable: {_torch_import_error})")
    print("Listening on http://0.0.0.0:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
