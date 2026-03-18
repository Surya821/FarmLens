# app.py - updated
import os
import io
import sys
import warnings
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import models, transforms
import joblib
import pandas as pd
from sklearn.exceptions import InconsistentVersionWarning
import timm
import tensorflow as tf
import numpy as np


# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "./frontend")
CHECKPOINT_PATH = os.path.join(BASE_DIR, "best_model_final.pth")
RF_MODEL_PATH = os.path.join(BASE_DIR, "models/random_forest_model.pkl")
SKIN_MODEL_PATH = os.path.join(BASE_DIR, "models/best_densenet_cattle.keras")

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Cattle Breed + Disease Prediction API")

# CORS middleware - MORE SPECIFIC FOR DEVELOPMENT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# -----------------------------
# Verify model file exists
# -----------------------------
if not os.path.exists(CHECKPOINT_PATH):
    print(f"ERROR: Model file not found at {CHECKPOINT_PATH}")
    sys.exit(1)

if not os.path.exists(RF_MODEL_PATH):
    print(f"ERROR: RF model file not found at {RF_MODEL_PATH}")
    sys.exit(1)

# -----------------------------
# Load Image Model (Breed Recognition) - safer torch.load
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = timm.create_model('convnext_tiny', num_classes=41)

try:
    # Try weight-only loading if available (safer wrt pickle execution)
    try:
        # Newer torch versions support weights_only=True
        state_dict = torch.load(CHECKPOINT_PATH, map_location=device, weights_only=True)
    except TypeError:
        # Older torch doesn't support weights_only argument
        state_dict = torch.load(CHECKPOINT_PATH, map_location=device)

    # Handle the specific checkpoint structure found in best_model_final.pth
    if isinstance(state_dict, dict):
        if 'model_state_dict' in state_dict:
            state_dict = state_dict['model_state_dict']
        elif 'state_dict' in state_dict:
            state_dict = state_dict['state_dict']

    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    print("Image model loaded successfully.")
except Exception as e:
    print(f"Error loading image model: {e}")
    sys.exit(1)

# Image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

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

# -----------------------------
# Load Random Forest Disease Model (joblib) - handle InconsistentVersionWarning
# -----------------------------
# We'll attempt to load and, if sklearn emits InconsistentVersionWarning, we'll resave
# the model in this environment to a new file and use that going forward.
RF_MODEL_RESAVED_PATH = RF_MODEL_PATH.replace(".pkl", "_resaved.pkl")

try:
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")
        rf_model = joblib.load(RF_MODEL_PATH)
        # Check if any of the captured warnings were InconsistentVersionWarning
        found_inconsistent = any(isinstance(warn.message, InconsistentVersionWarning) or
                                 (hasattr(warn.message, "category") and warn.message.category is InconsistentVersionWarning)
                                 for warn in w)

    if found_inconsistent:
        print("InconsistentVersionWarning detected when loading RF model. Resaving with current sklearn version...")
        try:
            joblib.dump(rf_model, RF_MODEL_RESAVED_PATH)
            # Switch to using resaved model file
            rf_model = joblib.load(RF_MODEL_RESAVED_PATH)
            print(f"Resaved RF model to {RF_MODEL_RESAVED_PATH} and loaded it.")
            RF_MODEL_PATH = RF_MODEL_RESAVED_PATH
        except Exception as e:
            # If resave fails, print but continue with the loaded model (we already loaded it)
            print(f"Warning: failed to resave RF model: {e}")
    else:
        print("Random Forest model loaded successfully (no version warnings).")

except Exception as e:
    print(f"Error loading RF model: {e}")
    sys.exit(1)

# -----------------------------
# Load Skin Disease Keras Model
# -----------------------------
print("Loading Skin Disease Keras Model...")
try:
    skin_model = tf.keras.models.load_model(SKIN_MODEL_PATH)
    print("Skin disease model loaded successfully.")
except Exception as e:
    print(f"Error loading Skin disease model: {e}")
    # We might not want to sys.exit if one model fails, but following existing pattern
    # sys.exit(1) 

SKIN_DISEASE_CLASSES = ["Foot and Mouth Disease (FMD)", "Healthy", "Lumpy Skin Disease (LSD)"]
# Note: I will map these based on standard alphabetical order if not specified, 
# but user said: "foot and mouth disease(FMD), lumpy skin disease(LSD) and healthy"
# Usually Keras flow_from_directory or similar uses alphabetical: [FMD, Healthy, LSD]
# If the user provides the exact mapping, I'll update it. For now, alphabetical is safest for Keras.

# -----------------------------
# Symptoms / Diseases (unchanged)
# -----------------------------
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
# ROUTES
# -----------------------------
@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "message": "Cattle Disease Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "/symptoms": "GET - List all symptoms",
            "/disease": "POST - Predict disease from symptoms",
            "/predict": "POST - Predict breed from image",
            "/predict-skin": "POST - Predict skin disease from image",
            "/health": "GET - Health check"
        }
    }

@app.get("/symptoms")
async def get_symptoms():
    """Return the list of available symptoms"""
    return {
        "symptoms": SYMPTOM_LIST,
        "total": len(SYMPTOM_LIST),
        "status": "success"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image)
            # Use softmax to get probabilities
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted = torch.max(probabilities, 0)
            
            # Confidence threshold - if too low, it's likely not a cattle or unidentified
            CONFIDENCE_THRESHOLD = 0.35
            
            if confidence.item() < CONFIDENCE_THRESHOLD:
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "error": "No cattle detected",
                        "message": "The AI could not identify a cattle in this image. Please upload a clear photo of your cattle."
                    }
                )

            predicted_class = CLASS_NAMES[predicted.item()]

        return {
            "status": "success",
            "filename": file.filename,
            "predicted_class": predicted_class,
            "confidence": float(confidence.item())
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
            }
        )

@app.post("/predict-skin")
async def predict_skin(file: UploadFile = File(...)):
    """Predict skin disease from an image after verifying it's a cattle photo"""
    try:
        # Load image once
        contents = await file.read()
        image_pil = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # --- PHASE 1: CATTLE VERIFICATION (Using Breed Model) ---
        # Reuse existing breed model transforms
        image_torch = transform(image_pil).unsqueeze(0).to(device)
        
        with torch.no_grad():
            breed_outputs = model(image_torch)
            breed_probs = torch.nn.functional.softmax(breed_outputs[0], dim=0)
            breed_conf, _ = torch.max(breed_probs, 0)
            
            # Use the same threshold as breed prediction
            VERIFICATION_THRESHOLD = 0.35 
            
            if breed_conf.item() < VERIFICATION_THRESHOLD:
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "error": "No cattle detected",
                        "message": "The AI could not identify a cattle in this image. Please upload a clear photo of your cattle."
                    }
                )

        # --- PHASE 2: SKIN DISEASE PREDICTION (Keras Model) ---
        # Preprocess for Keras
        image_keras = image_pil.resize((224, 224))
        img_array = np.array(image_keras) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        predictions = skin_model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        
        predicted_idx = np.argmax(predictions[0])
        
        # Determine confidence and class
        if np.isclose(np.sum(predictions[0]), 1.0, atol=1e-3):
            predicted_class = SKIN_DISEASE_CLASSES[predicted_idx]
            confidence = float(predictions[0][predicted_idx])
        else:
            predicted_class = SKIN_DISEASE_CLASSES[predicted_idx]
            confidence = float(score[predicted_idx])

        return {
            "status": "success",
            "filename": file.filename,
            "predicted_disease": predicted_class,
            "confidence": confidence,
            "all_predictions": {SKIN_DISEASE_CLASSES[i]: float(predictions[0][i]) for i in range(len(SKIN_DISEASE_CLASSES))}
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
            }
        )

@app.post("/disease")
async def disease_prediction(data: dict):
    try:
        symptoms = data.get("symptoms", [])

        if not symptoms:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "error": "No symptoms provided"
                }
            )

        # Create symptom vector as a list
        symptom_vector = []
        for symptom in SYMPTOM_LIST:
            symptom_vector.append(1 if symptom in symptoms else 0)

        # Convert to pandas DataFrame with feature names
        symptom_df = pd.DataFrame([symptom_vector], columns=SYMPTOM_LIST)

        # Predict disease using DataFrame
        predicted_idx = int(rf_model.predict(symptom_df)[0])
        predicted_disease = DISEASES[predicted_idx] if 0 <= predicted_idx < len(DISEASES) else "Unknown"

        return {
            "status": "success",
            "input_symptoms": symptoms,
            "predicted_disease": predicted_disease,
            "total_symptoms_checked": len(SYMPTOM_LIST)
        }

    except Exception as e:
        print(f"Error in disease prediction: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
            }
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "breed_model_loaded": True,
        "disease_model_loaded": True,
        "skin_model_loaded": skin_model is not None,
        "num_symptoms": len(SYMPTOM_LIST),
        "num_diseases": len(DISEASES),
        "api_version": "1.0.0"
    }

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    return {
        "message": "API is working correctly",
        "test_data": {
            "sample_symptoms": SYMPTOM_LIST[:5],
            "sample_diseases": DISEASES[:3]
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Cattle Disease Prediction API.")
    print(f"Total symptoms: {len(SYMPTOM_LIST)}")
    print(f"Total diseases: {len(DISEASES)}")
    print("API will run on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
