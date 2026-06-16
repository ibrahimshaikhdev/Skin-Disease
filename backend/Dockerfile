# DermacareVision AI - Inference Service (Hugging Face Spaces / Docker)
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan

FROM python:3.11-slim

# System libs needed by Pillow / torch at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# HF Spaces runs as a non-root user (uid 1000). Set up a writable home so the
# model cache and uploads work without permission errors.
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    HF_HOME=/home/user/.cache/huggingface \
    PORT=7860 \
    HOST=0.0.0.0 \
    PYTHONUNBUFFERED=1

WORKDIR /home/user/app

# Install CPU-only PyTorch first (smaller, no CUDA), then the rest.
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt gunicorn

# App code
COPY --chown=user . .

USER user
EXPOSE 7860

# Single worker, long timeout (model load + CPU inference can be slow on free tier).
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--timeout", "300", "app:app"]
