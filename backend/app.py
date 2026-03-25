import os
import io
import sys
import warnings
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import transforms
import joblib
import pandas as pd
from sklearn.exceptions import InconsistentVersionWarning
import timm
import tensorflow as tf
import numpy as np
import gdown

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_PATH = os.path.join(BASE_DIR, "models/best_model_final.pth")
RF_MODEL_PATH = os.path.join(BASE_DIR, "models/random_forest_model.pkl")
SKIN_MODEL_PATH = os.path.join(BASE_DIR, "models/best_densenet_cattle.keras")

# Google Drive URLs (loaded from .env)
CHECKPOINT_GDRIVE_URL = os.environ.get("CHECKPOINT_GDRIVE_URL", "")
RF_MODEL_GDRIVE_URL = os.environ.get("RF_MODEL_GDRIVE_URL", "")
SKIN_MODEL_GDRIVE_URL = os.environ.get("SKIN_MODEL_GDRIVE_URL", "")

# -----------------------------
# Global model state (loaded at startup)
# -----------------------------
models_state = {
    "breed_model": None,
    "rf_model": None,
    "skin_model": None,
    "device": None,
    "transform": None,
    "ready": False
}

# -----------------------------
# Class Names & Labels
# -----------------------------
CLASS_NAMES = [
    "Alambadi", "Amritmahal", "Ayrshire", "Banni", "Bargur",
    "Bhadawari", "Brown_Swiss", "Dangi", "Deoni", "Gir",
    "Guernsey", "Hallikar", "Hariana", "Holstein_Friesian", "Jaffrabadi",
    "Jersey", "Kangayam", "Kankrej", "Kasargod", "Kenkatha",
    "Kherigarh", "Khillari", "Krishna_Valley", "Malnad_gidda", "Mehsana",
    "Murrah", "Nagori", "Nagpuri", "Nili_Ravi", "Nimari",
    "Ongole", "Pulikulam", "Rathi", "Red_Dane", "Red_Sindhi",
    "Sahiwal", "Surti", "Tharparkar", "Toda", "Umblachery",
    "Vechur"
]

SKIN_DISEASE_CLASSES = ["Foot and Mouth Disease (FMD)", "Healthy", "Lumpy Skin Disease (LSD)"]

SYMPTOM_LIST = ['anorexia','abdominal_pain','anaemia','abortions','acetone','aggression','arthrogyposis',
    'ankylosis','anxiety','bellowing','blood_loss','blood_poisoning','blisters','colic','Condemnation_of_livers',
    'coughing','depression','discomfort','dyspnea','dysentery','diarrhoea','dehydration','drooling',
    'dull','decreased_fertility','diffculty_breath','emaciation','encephalitis','fever','facial_paralysis','frothing_of_mouth',
    'frothing','gaseous_stomach','highly_diarrhoea','high_pulse_rate','high_temp','high_proportion','hyperaemia','hydrocephalus',
    'isolation_from_herd','infertility','intermittent_fever','jaundice','ketosis','loss_of_appetite','lameness',
    'lack_of-coordination','lethargy','lacrimation','milk_flakes','milk_watery','milk_clots',
    'mild_diarrhoea','moaning','mucosal_lesions','milk_fever','nausea','nasel_discharges','oedema',
    'pain','painful_tongue','pneumonia','photo_sensitization','quivering_lips','reduction_milk_vields','rapid_breathing',
    'rumenstasis','reduced_rumination','reduced_fertility','reduced_fat','reduces_feed_intake','raised_breathing','stomach_pain',
    'salivation','stillbirths','shallow_breathing','swollen_pharyngeal','swelling','saliva','swollen_tongue',
    'tachycardia','torticollis','udder_swelling','udder_heat','udder_hardeness','udder_redness','udder_pain','unwillingness_to_move',
    'ulcers','vomiting','weight_loss','weakness']

DISEASES = ['mastitis','blackleg','bloat','coccidiosis','cryptosporidiosis',
        'displaced_abomasum','gut_worms','listeriosis','liver_fluke','necrotic_enteritis','peri_weaning_diarrhoea',
        'rift_valley_fever','rumen_acidosis',
        'traumatic_reticulitis','calf_diphtheria','foot_rot','foot_and_mouth','ragwort_poisoning','wooden_tongue','infectious_bovine_rhinotracheitis',
        'acetonaemia','fatty_liver_syndrome','calf_pneumonia','schmallen_berg_virus','trypanosomosis','fog_fever']

# -----------------------------
# Helper: Download from Google Drive
# -----------------------------
def download_from_gdrive(path, url, name):
    if not os.path.exists(path):
        if not url or url.startswith("YOUR_"):
            print(f"ERROR: {name} not found and no Google Drive link provided.")
            sys.exit(1)
        print(f"{name} not found locally. Downloading from Google Drive...")
        try:
            gdown.download(url=url, output=path, quiet=False, fuzzy=True)
            print(f"Successfully downloaded {name}")
        except Exception as e:
            print(f"ERROR: Failed to download {name}: {e}")
            sys.exit(1)

# -----------------------------
# Lifespan: Load models AFTER port binds
# -----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: download & load all models. This runs AFTER the port is bound."""
    print("==> Starting model loading...")

    # Download models if missing
    download_from_gdrive(CHECKPOINT_PATH, CHECKPOINT_GDRIVE_URL, "Breed Model")
    download_from_gdrive(RF_MODEL_PATH, RF_MODEL_GDRIVE_URL, "Random Forest Model")
    download_from_gdrive(SKIN_MODEL_PATH, SKIN_MODEL_GDRIVE_URL, "Skin Disease Model")

    # Load Breed Model (PyTorch)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    models_state["device"] = device

    breed_model = timm.create_model('convnext_tiny', num_classes=41)
    try:
        try:
            state_dict = torch.load(CHECKPOINT_PATH, map_location=device, weights_only=True)
        except TypeError:
            state_dict = torch.load(CHECKPOINT_PATH, map_location=device)

        if isinstance(state_dict, dict):
            if 'model_state_dict' in state_dict:
                state_dict = state_dict['model_state_dict']
            elif 'state_dict' in state_dict:
                state_dict = state_dict['state_dict']

        breed_model.load_state_dict(state_dict)
        breed_model = breed_model.to(device)
        breed_model.eval()
        models_state["breed_model"] = breed_model
        print("==> Breed model loaded.")
    except Exception as e:
        print(f"ERROR loading breed model: {e}")
        sys.exit(1)

    # Image transform
    models_state["transform"] = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])

    # Load Random Forest Model (joblib)
    RF_RESAVED_PATH = RF_MODEL_PATH.replace(".pkl", "_resaved.pkl")
    try:
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            rf = joblib.load(RF_MODEL_PATH)
            found_inconsistent = any(
                isinstance(warn.message, InconsistentVersionWarning) for warn in w
            )
        if found_inconsistent:
            print("Resaving RF model with current sklearn version...")
            try:
                joblib.dump(rf, RF_RESAVED_PATH)
                rf = joblib.load(RF_RESAVED_PATH)
            except Exception as e:
                print(f"Warning: could not resave RF model: {e}")
        models_state["rf_model"] = rf
        print("==> Random Forest model loaded.")
    except Exception as e:
        print(f"ERROR loading RF model: {e}")
        sys.exit(1)

    # Load Skin Disease Model (Keras/TensorFlow)
    try:
        skin = tf.keras.models.load_model(SKIN_MODEL_PATH)
        models_state["skin_model"] = skin
        print("==> Skin disease model loaded.")
    except Exception as e:
        print(f"ERROR loading skin model: {e}")

    models_state["ready"] = True
    print("==> All models ready. API is live.")

    yield  # App runs here

    # Shutdown cleanup (optional)
    print("==> Shutting down...")


# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI(title="Cattle Breed + Disease Prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# -----------------------------
# Routes
# -----------------------------
@app.get("/")
async def root():
    return {"message": "API working", "status": "success", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if models_state["ready"] else "loading",
        "models_ready": models_state["ready"],
        "breed_model_loaded": models_state["breed_model"] is not None,
        "rf_model_loaded": models_state["rf_model"] is not None,
        "skin_model_loaded": models_state["skin_model"] is not None,
        "num_symptoms": len(SYMPTOM_LIST),
        "num_diseases": len(DISEASES),
    }


@app.get("/symptoms")
async def get_symptoms():
    return {"symptoms": SYMPTOM_LIST, "total": len(SYMPTOM_LIST), "status": "success"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not models_state["ready"]:
        return JSONResponse(status_code=503, content={"status": "error", "error": "Models are still loading. Please try again shortly."})
    try:
        image = Image.open(file.file).convert("RGB")
        image = models_state["transform"](image).unsqueeze(0).to(models_state["device"])

        with torch.no_grad():
            outputs = models_state["breed_model"](image)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted = torch.max(probabilities, 0)

            if confidence.item() < 0.20:
                return JSONResponse(status_code=400, content={
                    "status": "error",
                    "error": "No cattle detected",
                    "message": "The AI could not identify cattle in this image."
                })

        return {
            "status": "success",
            "filename": file.filename,
            "predicted_class": CLASS_NAMES[predicted.item()],
            "confidence": float(confidence.item())
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "error": str(e)})


@app.post("/predict-skin")
async def predict_skin(file: UploadFile = File(...)):
    if not models_state["ready"]:
        return JSONResponse(status_code=503, content={"status": "error", "error": "Models are still loading. Please try again shortly."})
    try:
        contents = await file.read()
        image_pil = Image.open(io.BytesIO(contents)).convert("RGB")

        # Phase 1: Cattle verification
        image_torch = models_state["transform"](image_pil).unsqueeze(0).to(models_state["device"])
        with torch.no_grad():
            breed_outputs = models_state["breed_model"](image_torch)
            breed_probs = torch.nn.functional.softmax(breed_outputs[0], dim=0)
            breed_conf, _ = torch.max(breed_probs, 0)

            if breed_conf.item() < 0.35:
                return JSONResponse(status_code=400, content={
                    "status": "error",
                    "error": "No cattle detected",
                    "message": "The AI could not identify cattle in this image."
                })

        # Phase 2: Skin disease prediction
        image_keras = image_pil.resize((224, 224))
        img_array = np.array(image_keras) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = models_state["skin_model"].predict(img_array)
        score = tf.nn.softmax(predictions[0])
        predicted_idx = np.argmax(predictions[0])

        if np.isclose(np.sum(predictions[0]), 1.0, atol=1e-3):
            confidence = float(predictions[0][predicted_idx])
        else:
            confidence = float(score[predicted_idx])

        return {
            "status": "success",
            "filename": file.filename,
            "predicted_disease": SKIN_DISEASE_CLASSES[predicted_idx],
            "confidence": confidence,
            "all_predictions": {SKIN_DISEASE_CLASSES[i]: float(predictions[0][i]) for i in range(len(SKIN_DISEASE_CLASSES))}
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "error": str(e)})


@app.post("/disease")
async def disease_prediction(data: dict):
    if not models_state["ready"]:
        return JSONResponse(status_code=503, content={"status": "error", "error": "Models are still loading. Please try again shortly."})
    try:
        symptoms = data.get("symptoms", [])
        if not symptoms:
            return JSONResponse(status_code=400, content={"status": "error", "error": "No symptoms provided"})

        symptom_vector = [1 if s in symptoms else 0 for s in SYMPTOM_LIST]
        symptom_df = pd.DataFrame([symptom_vector], columns=SYMPTOM_LIST)

        predicted_idx = int(models_state["rf_model"].predict(symptom_df)[0])
        predicted_disease = DISEASES[predicted_idx] if 0 <= predicted_idx < len(DISEASES) else "Unknown"

        return {
            "status": "success",
            "input_symptoms": symptoms,
            "predicted_disease": predicted_disease,
            "total_symptoms_checked": len(SYMPTOM_LIST)
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "error": str(e)})


@app.get("/test")
async def test_endpoint():
    return {
        "message": "API is working correctly",
        "models_ready": models_state["ready"],
        "test_data": {
            "sample_symptoms": SYMPTOM_LIST[:5],
            "sample_diseases": DISEASES[:3]
        }
    }


# -----------------------------
# Port & Entry Point
# -----------------------------
PORT = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    print(f"Starting API on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
