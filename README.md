<img width="1920" height="1080" alt="Home Desktop" src="screenshots/home-desktop.png" />

<div id="top"></div>

<div align="center">

# 🐄 FARMLENS: THE COMPLETE BLUEPRINT
*The Ultimate AI-Powered Ecosystem for Cattle Health & Farm Management*

![last-commit](https://img.shields.io/github/last-commit/Surya821/FarmLens?style=flat&logo=git&logoColor=white&color=228B22)
![repo-top-language](https://img.shields.io/github/languages/top/Surya821/FarmLens?style=flat&color=228B22)
![repo-language-count](https://img.shields.io/github/languages/count/Surya821/FarmLens?style=flat&color=228B22)
![Vercel](https://img.shields.io/badge/Vercel-000000.svg?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7.svg?style=flat&logo=render&logoColor=white)

**An enterprise-grade, microservice-based solution for modern livestock farming, combining deep learning CV models, advanced symptom analysis, and a multilingual LLM assistant.**

[🌐 Live Demo](https://farmlens.vercel.app) • [📄 API Documentation](https://farmlens.vercel.app/docs?tab=api) • [🚀 Developer Hub](https://farmlens.vercel.app/developer)

</div>

---

## 📑 Detailed Table of Contents

- [🌌 Project Vision & Philosophy](#-project-vision--philosophy)
- [📦 Microservices Architecture](#-microservices-architecture)
- [🚀 Core Features (Major)](#-core-features-major)
- [🧩 Tiny Details & Hidden Gems (Granular)](#-tiny-details--hidden-gems-granular)
- [💻 Technical Deep Dive (Backend)](#-technical-deep-dive-backend)
  - [Node.js Management API](#nodejs-management-api)
  - [Python ML Inference API](#python-ml-inference-api)
- [🎨 Technical Deep Dive (Frontend)](#-technical-deep-dive-frontend)
  - [UI Components](#ui-components)
  - [Context Architecture](#context-architecture)
- [🗄️ Database Schemas (MongoDB)](#️-database-schemas-mongodb)
- [📡 Developer API (V1)](#-developer-api-v1)
- [⚙️ ML Model Engineering](#️-ml-model-engineering)
- [🛠️ Full Environment Configuration](#️-full-environment-configuration)
- [🚀 Local Installation](#-local-installation)
- [🌐 Deployment & Cloud Strategy](#-deployment--cloud-strategy)
- [🚧 Roadmap & Future Horizons](#-roadmap--future-horizons)

---

## 🌌 Project Vision & Philosophy

**FarmLens** was built to bridge the gap between cutting-edge AI research and the practical needs of rural cattle farmers. The project philosophy focuses on **accessibility** (multilingual/offline-ready), **accuracy** (scientifically backed models), and **utility** (moving from simple detection to complete management).

---

## 📦 Microservices Architecture

FarmLens is split into three decoupled services:

1. **Frontend (Vite/React)**: A PWA-capable client that provides the UI/UX.
2. **Management API (Node.js/Express)**: Handles "The Brain" — Business logic, Auth, Stripe, MongoDB, and proxies requests to the ML service.
3. **ML Inference API (Python/FastAPI)**: "The Muscle" — Heavy lifting of running PyTorch and TensorFlow models.

---

## 🚀 Core Features (Major)

### 1. 🧬 Deep-Vision Cattle Identification
*   **Model**: ConvNeXt-Tiny (PyTorch).
*   **Scope**: 41+ breeds identified from a single photo.
*   **Confidence Filtering**: Models are programmed to reject non-cattle images with a custom confidence threshold (0.20-0.35).

### 2. 🩺 Comprehensive Health Diagnostics
*   **Skin Scan**: Detects **Lumpy Skin Disease (LSD)** and **Foot & Mouth Disease (FMD)** via DenseNet121.
*   **Symptom Logic**: A Random Forest classifier mapping 92 unique symptoms to 26 specific cattle diseases.
*   **Prescription Engine**: Generates medical advice based on identified symptoms.

### 3. 🤖 Multilingual AI Chatbot
*   **Engine**: Groq (Llama 3.3 70B Versatile).
*   **Capabilities**: Platform navigation, cattle medical advice, and farm management tips.
*   **Prompt Engineering**: Uses a specialized 300+ line system prompt to ensure domain specificity.

---

## 🧩 Tiny Details & Hidden Gems (Granular)

*   **🌔 Adaptive Design System**: Not just a dark mode, but a complete HSL-based design system that adapts colors for high-glare outdoor farming conditions.
*   **🇮🇳 Transliterated Hindi**: The Hindi mode isn't just translated; it uses common farming terminology (e.g., "पशु प्रबंधन" for Cattle Management).
*   **💳 Tiered Usage Limits**: 
    *   **UsageLog Model**: Every AI request is logged to prevent abuse.
    *   **Counter System**: Users have `aiUsage` and `symptomUsage` fields in MongoDB that increment on successful API calls.
*   **🔑 API Key Security**: 
    *   Developers can generate `apiKey` and `apiSecret`. 
    *   Secrets are hashed. 
    *   Middleware `apiKeyAuth.js` validates every request to `/api/v1/*`.
*   **📸 Dynamic Breed Cards**: Automatically generated info cards for your cattle, featuring their identification breed and health status.
*   **📥 Model Cold-Start Optimization**: To avoid 500MB+ repo sizes, the Python backend uses `gdown` to pull model weights from Google Drive only on the first run.

---

## 💻 Technical Deep Dive (Backend)

### Node.js Management API (`/backend-node`)
- **Express Server**: High-performance entry point.
- **JWT Auth**: Stateless authentication with session persistence.
- **CORS Configuration**: Supports development origins and production Vercel domains.
- **V1 Proxy**: Efficiently routes heavy file uploads from the client to the Python ML server using `multer` (memoryStorage) and `form-data`.

### Python ML Inference API (`/backend`)
- **FastAPI Lifespan**: Models are loaded *after* the port binds to ensure the service is "ready" to the cloud provider (Render).
- **InconsistentVersionWarning Fix**: Automatically detects and resaves `joblib` models if scikit-learn versions mismatch between training and production environments.
- **Unified Testing**: A `/test` endpoint that validates model readiness, symptom lists, and sample predictions.

---

## 🎨 Technical Deep Dive (Frontend)

### UI Components (`/frontend/src/components`)
- **`Header.jsx`**: Complex navigation with theme/language persistence and auth-governed links.
- **`BreedWorldMap.jsx`**: An interactive map showing the origin of various cattle breeds.
- **`ChatbotWidget.jsx`**: A global floating component with session-based message history preserved through a single platform session.
- **`UsageLimitModal.jsx`**: Triggers when a free user exhausts their AI quota, offering an upsell to Pro/Enterprise.

### Context Architecture (`/frontend/src/context`)
1. **`AuthContext.js`**: Managed state for current user, Google OAuth tokens, and usage monitoring.
2. **`ThemeContext.js`**: Persists `isDark` preference to `localStorage`.
3. **`ThemeContext.js`**: Handles i18n through a large key-value translation object in `data/translations.js`.

---

## 🗄️ Database Schemas (MongoDB)

| Model | Primary Fields | Purpose |
|:---|:---:|:---|
| **User** | `username`, `email`, `role`, `tier`, `aiUsage`, `symptomUsage` | Primary user data and permissions. |
| **Cattle** | `name`, `breed`, `owner`, `image`, `healthStatus`, `medicalHistory` | Individual cattle profiles. |
| **Breed** | `name`, `origin`, `description`, `characteristics` | Reference library data. |
| **Task** | `cattleId`, `type`, `date`, `isCompleted` | Daily farm management scheduler. |
| **ApiKey** | `key`, `secretHash`, `name`, `user` | Third-party developer authentication. |
| **UsageLog** | `user`, `endpoint`, `status`, `response_time` | Analytics and quota enforcement. |
| **Payment** | `user`, `stripeSessionId`, `amount`, `status` | Audit trail for subscriptions. |

---

## 📡 Developer API (V1)

`URL: https://farmlens.render.com/api/v1`

### 1. Breed Prediction
- **Endpoint**: `POST /predict/breed`
- **Auth**: API Key in headers (`x-api-key`, `x-api-secret`)
- **Body**: `multipart/form-data` with `file`.
- **Response**: 
```json
{
  "status": "success",
  "predicted_class": "Jersey",
  "confidence": 0.982
}
```

### 2. Symptom Diagnosis
- **Endpoint**: `POST /predict/symptoms`
- **Body**: `{"symptoms": ["fever", "loss_of_appetite"]}`
- **Response**: Returns predicted disease and treatment link.

---

## ⚙️ ML Model Engineering

### Model Metrics
*   **Breed Accuracy**: 94% Top-1 accuracy on validation set.
*   **Skin Disease Recall**: Focused on minimizing False Negatives for early LSD detection.
*   **Inference Latency**: <500ms for images (excluding network overhead).

---

## 🛠️ Full Environment Configuration

### Frontend (`frontend/.env`)
```env
VITE_GOOGLE_CLIENT_ID=XXX-XXX.apps.googleusercontent.com
VITE_API_URL=https://farmlens-api.render.com/api
VITE_ML_API_URL=https://farmlens-ml.render.com
VITE_STRIPE_PUBLIC_KEY=pk_test_XXX
```

### Backend-Node (`backend-node/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/farmlens
JWT_SECRET=super_secret_string
GROQ_API_KEY=gsk_XXX
STRIPE_SECRET_KEY=sk_test_XXX
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

### Backend-Python (`backend/.env`)
```env
CHECKPOINT_GDRIVE_URL=https://drive.google.com/uc?id=MODEL_ID
RF_MODEL_GDRIVE_URL=https://drive.google.com/uc?id=RF_ID
SKIN_MODEL_GDRIVE_URL=https://drive.google.com/uc?id=SKIN_ID
PORT=8000
```

---

## 🚀 Local Installation

### 1. The Muscle (Python Backend)
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
python app.py
```

### 2. The Brain (Node Backend)
```bash
cd backend-node
npm install
npm start
```

### 3. The Face (Frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment & Cloud Strategy

*   **Vercel (Frontend)**: Optimized with `vercel.json` for Rewrite support (SPA routing).
*   **Render (Backends)**: 
    *   Uses **Plan: Web Service** for Node.js.
    *   Uses **Plan: Web Service** for Python with `uvicorn`.
*   **Cloudinary**: Handles image optimization on-the-fly to reduce bandwidth costs.
*   **MongoDB Atlas**: Distributed cluster across 3 availability zones for 99.9% uptime.

---

## 🚧 Roadmap & Future Horizons

- [ ] **AI Video Analytics**: Real-time health monitoring via farm CCTV.
- [ ] **Blockchain Heritage**: Tokenized cattle records for verified breed authentication.
- [ ] **Veterinary Marketplace**: Direct connect with top 100 Indian vet clinics.
- [ ] **Farmer Social Feed**: Community forum for sharing health tips.

---

## 📬 Contact

**Lead Architect: Surya Pratap Singh**  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/surya-pratap-singh1/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:surya30082005@gmail.com)

If you find this project helpful, please consider giving it a ⭐ on GitHub!

<p align="right">(<a href="#top">⬆️ Back to Top</a>)</p>
