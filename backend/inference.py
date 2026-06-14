# DermacareVision AI - Modular Inference Pipeline
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan
#
# Single unified model for multi-class skin disease classification (25+
# conditions). Provides prediction, a full probability distribution, and
# Grad-CAM explainability heatmaps.
#
# torch / transformers are imported lazily so the service still starts (in a
# deterministic MOCK mode) where the native ML stack cannot load.

import base64
import hashlib
import io
import os

import numpy as np
from PIL import Image

from models_config import CLASS_LABELS, HF_MODEL_REPO, MODEL_META

_FORCE_MOCK = os.environ.get("DERMA_MOCK", "").lower() in ("1", "true", "yes")
TORCH_AVAILABLE = False
_torch_import_error = None

if not _FORCE_MOCK:
    try:
        import torch
        import torch.nn.functional as F
        from transformers import AutoImageProcessor, AutoModelForImageClassification

        TORCH_AVAILABLE = True
    except Exception as exc:  # pragma: no cover - environment dependent
        _torch_import_error = str(exc)
        TORCH_AVAILABLE = False


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _seeded_unit_floats(seed_bytes, count):
    values = []
    counter = 0
    while len(values) < count:
        digest = hashlib.sha256(seed_bytes + counter.to_bytes(4, "big")).digest()
        for i in range(0, len(digest), 4):
            values.append(int.from_bytes(digest[i:i + 4], "big") / 0xFFFFFFFF)
            if len(values) >= count:
                break
        counter += 1
    return values[:count]


def _softmax_np(logits):
    arr = np.asarray(logits, dtype=np.float64)
    arr = arr - arr.max()
    exp = np.exp(arr)
    return exp / exp.sum()


def _jet_colormap(values):
    v = np.clip(values, 0.0, 1.0)
    four = 4.0 * v
    r = np.clip(np.minimum(four - 1.5, -four + 4.5), 0, 1)
    g = np.clip(np.minimum(four - 0.5, -four + 3.5), 0, 1)
    b = np.clip(np.minimum(four + 0.5, -four + 2.5), 0, 1)
    return (np.stack([r, g, b], axis=-1) * 255).astype(np.uint8)


def _overlay_heatmap(pil_image, cam, alpha=0.45):
    base = pil_image.convert("RGB").resize((224, 224))
    base_arr = np.asarray(base).astype(np.float32)
    cam_img = Image.fromarray((np.clip(cam, 0, 1) * 255).astype(np.uint8)).resize((224, 224))
    cam_resized = np.asarray(cam_img).astype(np.float32) / 255.0
    heat = _jet_colormap(cam_resized).astype(np.float32)
    blended = np.clip((1 - alpha) * base_arr + alpha * heat, 0, 255).astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(blended).save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


def _format_probabilities(probabilities, labels):
    pairs = [
        {"class": labels[i], "probability": round(float(probabilities[i]), 4)}
        for i in range(len(labels))
    ]
    pairs.sort(key=lambda x: x["probability"], reverse=True)
    return pairs


# --------------------------------------------------------------------------- #
# Inference engine
# --------------------------------------------------------------------------- #
class InferenceEngine:
    def __init__(self):
        self.mock = not TORCH_AVAILABLE
        self._model = None
        self._processor = None
        self._labels = list(CLASS_LABELS)

    @property
    def mode(self):
        return "mock" if self.mock else "torch"

    @property
    def labels(self):
        return self._labels

    @property
    def model_name(self):
        return MODEL_META["name"]

    def warmup(self):
        if not self.mock:
            self._ensure_loaded()

    def _ensure_loaded(self):
        if self._model is not None:
            return
        print(f"Loading model {HF_MODEL_REPO} ...")
        self._processor = AutoImageProcessor.from_pretrained(HF_MODEL_REPO)
        self._model = AutoModelForImageClassification.from_pretrained(HF_MODEL_REPO)
        self._model.eval()
        # Prefer the model's own label names if present.
        id2label = getattr(self._model.config, "id2label", None)
        if id2label:
            self._labels = [self._pretty(id2label[i]) for i in range(len(id2label))]
        print(f"Model loaded: {len(self._labels)} classes.")

    @staticmethod
    def _pretty(label):
        cleaned = str(label).replace("_", " ").strip()
        # Title-case lowercase labels while keeping acronyms intact.
        if cleaned and cleaned[0].islower():
            cleaned = cleaned.title()
        return cleaned

    # -- prediction --------------------------------------------------------- #
    def predict(self, image_bytes, model_id=1):
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if self.mock:
            probs = self._mock_probabilities(image_bytes, len(self._labels))
        else:
            self._ensure_loaded()
            inputs = self._processor(images=pil_image, return_tensors="pt")
            with torch.no_grad():
                logits = self._model(**inputs).logits
                probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

        idx = int(np.argmax(probs))
        return {
            "label": self._labels[idx],
            "confidence": round(float(probs[idx]), 4),
            "class_index": idx,
            "probabilities": _format_probabilities(probs, self._labels),
        }

    # -- Grad-CAM ----------------------------------------------------------- #
    def gradcam(self, image_bytes, model_id=1, target_index=None):
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if self.mock:
            probs = self._mock_probabilities(image_bytes, len(self._labels))
            idx = target_index if target_index is not None else int(np.argmax(probs))
            cam = self._mock_cam(image_bytes)
            return {
                "label": self._labels[idx],
                "class_index": idx,
                "confidence": round(float(probs[idx]), 4),
                "heatmap": _overlay_heatmap(pil_image, cam),
            }

        self._ensure_loaded()
        cam, idx, confidence = self._vit_gradcam(pil_image, target_index)
        return {
            "label": self._labels[idx],
            "class_index": idx,
            "confidence": round(float(confidence), 4),
            "heatmap": _overlay_heatmap(pil_image, cam),
        }

    def _vit_gradcam(self, pil_image, target_index):
        """Grad-CAM for a DINOv2 / ViT classifier via the last encoder block."""
        inputs = self._processor(images=pil_image, return_tensors="pt")

        activations = {}
        gradients = {}

        # Locate the transformer encoder layers (handles HF naming variants).
        base = getattr(self._model, "dinov2", None) or getattr(self._model, "vit", None)
        layers = base.encoder.layer
        target_layer = layers[-1]

        def fwd_hook(_m, _i, output):
            activations["v"] = (output[0] if isinstance(output, tuple) else output).detach()

        def bwd_hook(_m, grad_in, grad_out):
            gradients["v"] = grad_out[0].detach()

        h1 = target_layer.register_forward_hook(fwd_hook)
        h2 = target_layer.register_full_backward_hook(bwd_hook)
        try:
            logits = self._model(**inputs).logits
            probs = F.softmax(logits, dim=1).squeeze(0)
            idx = int(target_index) if target_index is not None else int(torch.argmax(probs))
            confidence = float(probs[idx])
            self._model.zero_grad()
            logits[0, idx].backward()

            acts = activations["v"][0]      # [T, C]
            grads = gradients["v"][0]       # [T, C]
        finally:
            h1.remove()
            h2.remove()

        tokens = acts.shape[0]
        # Determine how many leading non-patch tokens (CLS + optional registers).
        for offset in (1, 5, 0):
            n = tokens - offset
            side = int(round(n ** 0.5))
            if side * side == n and n > 0:
                patch_acts = acts[offset:]
                patch_grads = grads[offset:]
                break
        else:
            side = int(round(tokens ** 0.5))
            patch_acts, patch_grads = acts, grads

        weights = patch_grads.mean(dim=0)                  # [C]
        cam = torch.relu((patch_acts * weights).sum(dim=-1))  # [P]
        cam = cam.reshape(side, side).cpu().numpy()
        if cam.max() > cam.min():
            cam = (cam - cam.min()) / (cam.max() - cam.min())
        else:
            cam = np.zeros_like(cam)
        return cam, idx, confidence

    # -- mock generators ---------------------------------------------------- #
    def _mock_probabilities(self, image_bytes, num_classes):
        seed = hashlib.sha256(image_bytes).digest()
        raw = np.array(_seeded_unit_floats(seed, num_classes))
        logits = raw * 8.0
        logits[int(np.argmax(raw))] += 4.0
        return _softmax_np(logits)

    def _mock_cam(self, image_bytes, size=56):
        seed = _seeded_unit_floats(hashlib.sha256(image_bytes).digest(), 5)
        cy, cx = 0.3 + 0.4 * seed[0], 0.3 + 0.4 * seed[1]
        sigma = 0.12 + 0.10 * seed[2]
        ys = np.linspace(0, 1, size)[:, None]
        xs = np.linspace(0, 1, size)[None, :]
        cam = np.exp(-(((ys - cy) ** 2 + (xs - cx) ** 2) / (2 * sigma ** 2)))
        cam = cam / cam.max()
        return cam


engine = InferenceEngine()
