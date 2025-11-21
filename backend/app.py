import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import models, transforms
import sys
import joblib
import pandas as pd

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend")
CHECKPOINT_PATH = os.path.join(BASE_DIR, "best_resnet.pth")
RF_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_model.pkl")

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Cattle Breed + Disease Prediction API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# -----------------------------
# Verify model file exists
# -----------------------------
if not os.path.exists(CHECKPOINT_PATH):
    print(f"ERROR: Model file not found at {CHECKPOINT_PATH}")
    sys.exit(1)

# -----------------------------
# Load Image Model (Breed Recognition)
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.resnet50(weights=None)
num_ftrs = model.fc.in_features
num_classes = 5
model.fc = torch.nn.Linear(num_ftrs, num_classes)

try:
    model.load_state_dict(torch.load(CHECKPOINT_PATH, map_location=device))
    model = model.to(device)
    model.eval()
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# Image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

CLASS_NAMES = [
    "Ayrshire cattle",
    "Brown Swiss cattle",
    "Holstein Friesian cattle",
    "Jersey cattle",
    "Red Dane cattle",
]

# -----------------------------
# Load Random Forest Disease Model
# -----------------------------
if not os.path.exists(RF_MODEL_PATH):
    raise FileNotFoundError("random_forest.pkl not found!")

rf_model = joblib.load(RF_MODEL_PATH)

# Symptoms list (MUST MATCH TRAINING DATA - from l1)
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

@app.get("/", response_class=HTMLResponse)
async def index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Frontend not found</h1>", status_code=404)

# -----------------------------
# GET SYMPTOMS LIST (NEW ENDPOINT)
# -----------------------------
@app.get("/symptoms")
async def get_symptoms():
    """Return the list of available symptoms"""
    return JSONResponse({"symptoms": SYMPTOM_LIST})

# -----------------------------
# IMAGE PREDICTION (BREED)
# -----------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            predicted_class = CLASS_NAMES[predicted.item()]

        return JSONResponse({"filename": file.filename, "predicted_class": predicted_class})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# -----------------------------
# DISEASE PREDICTION (RANDOM FOREST)
# -----------------------------
@app.post("/disease")
async def disease_prediction(data: dict):
    try:
        # Create symptom vector as a list
        symptom_vector = []

        for symptom in SYMPTOM_LIST:
            symptom_vector.append(1 if symptom in data.get("symptoms", []) else 0)

        # Convert to pandas DataFrame with feature names
        symptom_df = pd.DataFrame([symptom_vector], columns=SYMPTOM_LIST)

        # Predict disease using DataFrame
        predicted_idx = rf_model.predict(symptom_df)[0]
        predicted_disease = DISEASES[predicted_idx]

        return JSONResponse({
            "input_symptoms": data.get("symptoms", []),
            "predicted_disease": predicted_disease
        })

    except Exception as e:
        print(f"Error in disease prediction: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)

# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy",
        "breed_model_loaded": True,
        "disease_model_loaded": True,
        "num_symptoms": len(SYMPTOM_LIST),
        "num_diseases": len(DISEASES)
    })