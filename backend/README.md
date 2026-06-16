---
title: DermacareVision AI Inference
emoji: 🔬
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# DermacareVision AI — Inference Service

Python ML microservice for the DermacareVision AI platform. Serves skin-disease
classification, confidence distribution, and disease insights.

Developed by Ibrahim Shaikh, Sahil Sahare, and Tohid Pathan.

## Endpoints

- `GET /api/health` — service status and model mode
- `GET /api/models` — model metadata
- `POST /api/predict` — multipart `file` upload → prediction + insight
- `GET /api/insights?label=<condition>` — disease insight lookup
