### Project Structure

```
DermacareVisionAI/
├── LICENSE
├── README.md
├── backend/
│   ├── app.py                    # Unified Flask API server (all 3 models)
│   ├── requirements.txt
│   └── uploads/                  # Temporary upload directory (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ConfidenceBar.jsx
│   │   │   ├── ProbabilityChart.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   └── Disclaimer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Analyze.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── predictionService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── model 1/
│   ├── app.py                    # Legacy Flask inference server
│   ├── models/
│   │   └── skin_disease_model.pth
│   ├── requirements.txt
│   ├── src/
│   │   └── main.py               # Training script
│   └── templates/
├── model 2/
│   └── (same structure)
└── model 3/
    └── (same structure)
```

### Top-Level Files

- **`LICENSE`**: MIT License with ownership by Ibrahim Shaikh, Sahil Sahare, and Tohid Pathan.
- **`README.md`**: Project overview, setup instructions, and usage guidelines.

### Backend (`backend/`)

Unified Flask API server that loads all 3 models and serves predictions via JSON endpoints.

- **`app.py`**: Flask app with `/api/models`, `/api/predict`, and `/api/health` routes.
- **`requirements.txt`**: Python dependencies (Flask, flask-cors, torch, torchvision, Pillow, numpy).

### Frontend (`frontend/`)

React single-page application built with Vite and Tailwind CSS.

- **`src/pages/`**: Route-level page components (Home, Analyze, Results).
- **`src/components/`**: Reusable UI components (Navbar, Footer, ModelSelector, etc.).
- **`src/services/`**: Axios-based API client for backend communication.

### Model Directories (`model X/`)

Each model directory contains a complete, independent skin disease classification pipeline (legacy).

- **`app.py`**: Flask web server that handles image uploads and returns disease predictions.
- **`models/`**: Contains the pre-trained PyTorch model weights (`skin_disease_model.pth`).
- **`requirements.txt`**: Python dependencies for the model.
- **`src/main.py`**: Training script for retraining the model from scratch.
