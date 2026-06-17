# DermacareVision AI

An intelligent skin lesion analysis platform powered by deep learning. DermacareVision AI performs multi-class skin disease classification using medical image analysis with PyTorch-based convolutional neural networks, wrapped in a secured three-tier architecture with persistence, analytics, and explainable-AI heatmaps.

LIVE at https://skin-disease-ist.vercel.app/

> **Disclaimer:** This system is an educational clinical support prototype and is not intended for professional medical diagnosis.

## Architecture

```
  React Frontend (Vite, Tailwind, Recharts)        :5173
        │  JWT-authenticated REST
        ▼
  Spring Boot API Gateway                          :8080
   • Authentication (JWT) & security
   • Persistence (JPA → H2 dev / MySQL prod)
   • Prediction history & dashboard analytics
   • Image storage, proxy to inference service
        │  multipart / JSON
        ▼
  Python Inference Microservice (Flask + PyTorch)  :5001
   • Prediction + confidence distribution
   • Grad-CAM explainability heatmaps
   • Disease insight knowledge base
        │
        ▼
  MySQL (prod)  /  H2 in-memory (dev)
```

## Core Features

- **Unified deep-learning model** — a single custom-trained model covering 25+ skin conditions.
- **Confidence breakdown** — full class-probability distribution, visualized with charts.
- **Explainable AI (Grad-CAM)** — heatmaps highlighting the regions that drove each prediction.
- **Disease insights** — overview, symptoms, risk indicators, and precautions per condition.
- **Prediction history** — every analysis is saved per user with image, result, and timestamp.
- **Clinical dashboard** — analytics: totals, average confidence, model usage, top conditions, 7-day trend.
- **Secure accounts** — JWT registration/login; history and dashboard are per-user protected.

| Model | Conditions | Validation Accuracy |
|-------|-----------|-------------------|
| DermaVision Skin Analyzer | 25+ skin diseases | ~92% |

## Quick Start

Run the three tiers in separate terminals. (On first run the gateway seeds a demo
account: **demo / demo12345**.)

### 1. Python inference service (port 5001)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

If the native PyTorch libraries cannot load in your environment, start it in
deterministic mock mode (everything else works unchanged):

```bash
# bash
DERMA_MOCK=1 python app.py
# PowerShell
$env:DERMA_MOCK=1; python app.py
```

### 2. Spring Boot gateway (port 8080)

Requires JDK 17+.

```bash
cd gateway
./mvnw spring-boot:run        # or: mvn spring-boot:run
```

Uses an in-memory **H2** database by default — no MySQL required for development.

### 3. React frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Production (MySQL)

Activate the `prod` profile and provide the database/JWT environment variables:

```bash
cd gateway
MYSQL_HOST=localhost MYSQL_DB=dermacare MYSQL_USER=root MYSQL_PASSWORD=secret \
JWT_SECRET="a-long-random-secret-at-least-256-bits-long-xxxxxxxxxxxxxxxx" \
java -jar target/gateway-1.0.0.jar --spring.profiles.active=prod
```

The schema is created automatically (`ddl-auto: update`).

For a free live deployment path with Vercel, Render, Hugging Face Spaces, and TiDB, see [DEPLOYMENT.md](DEPLOYMENT.md).

## API Overview (gateway, `/api`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | – | Create account, returns JWT |
| POST | `/auth/login` | – | Log in, returns JWT |
| GET | `/auth/me` | JWT | Current user |
| GET | `/models` | – | Available models |
| POST | `/predict` | optional | Analyze image (saved to history if logged in) |
| GET | `/predictions` | JWT | User's history |
| GET | `/predictions/{id}` | JWT | Detail + probabilities + insight |
| GET | `/predictions/{id}/heatmap` | – | Grad-CAM heatmap (base64 PNG) |
| GET | `/images/{filename}` | – | Stored lesion image |
| GET | `/insights?label=` | – | Disease insight |
| GET | `/dashboard/stats` | JWT | Aggregated analytics |

## Project Structure

```
DermacareVisionAI/
├── backend/                 # Python inference microservice
│   ├── app.py               # Flask routes
│   ├── inference.py         # Modular pipeline (torch + mock fallback, Grad-CAM)
│   ├── insights.py          # Disease insight knowledge base
│   └── models_config.py     # Model registry
├── gateway/                 # Spring Boot API gateway
│   └── src/main/java/com/dermacarevision/gateway/
│       ├── auth/            # Registration / login (JWT)
│       ├── security/        # JWT service & filter
│       ├── prediction/      # Predict, history, image, heatmap
│       ├── dashboard/       # Analytics
│       ├── proxy/           # Models / insights pass-through
│       └── config/          # Security, properties, seeding
├── frontend/                # React client
│   └── src/
│       ├── pages/           # Home, Analyze, Results, Login, Dashboard, History
│       ├── components/      # UI + charts + Grad-CAM viewer + insight panel
│       ├── context/         # Auth context
│       └── services/        # API client (JWT-aware)
├── model 1/ model 2/ model 3/   # Trained weights + legacy training scripts
└── docs/
```

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS v4, Recharts, Axios
- **Gateway:** Spring Boot 3, Spring Security (JWT), Spring Data JPA, H2 / MySQL
- **ML Inference:** Python, Flask, PyTorch, Grad-CAM
- **Image Processing:** Pillow, torchvision, NumPy

## License

MIT License — see [LICENSE](LICENSE).

## Authors

Developed by **Ibrahim Shaikh**, **Sahil Sahare**, and **Tohid Pathan**.
