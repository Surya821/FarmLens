import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import models, transforms
import requests  # Added to download model

# -----------------------------
# Paths and model URL
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend")
CHECKPOINT_PATH = os.path.join(BASE_DIR, "best_resnet.pth")

# Google Drive direct download link
MODEL_URL = "https://drive.google.com/uc?export=download&id=1QWtoDvIjHqDV_eRcu16zrLhoisY_w9cB"

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Cattle Breed Recognition")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# -----------------------------
# Download model if not exists
# -----------------------------
if not os.path.exists(CHECKPOINT_PATH):
    print("Downloading model from Google Drive...")
    r = requests.get(MODEL_URL)
    with open(CHECKPOINT_PATH, "wb") as f:
        f.write(r.content)
    print("Model downloaded successfully!")

# -----------------------------
# Load model
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet50(pretrained=False)
num_ftrs = model.fc.in_features

num_classes = 5
model.fc = torch.nn.Linear(num_ftrs, num_classes)

model.load_state_dict(torch.load(CHECKPOINT_PATH, map_location=device))
model = model.to(device)
model.eval()

# -----------------------------
# Define transforms
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5,0.5,0.5], std=[0.5,0.5,0.5])
])

# -----------------------------
# Class names
# -----------------------------
CLASS_NAMES = [
    "Ayrshire cattle", 
    "Brown Swiss cattle", 
    "Holstein Friesian cattle",
    "Jersey cattle", 
    "Red Dane cattle",
]

# -----------------------------
# Routes
# -----------------------------
@app.get("/", response_class=HTMLResponse)
async def index():
    with open(os.path.join(FRONTEND_DIR, "index.html"), "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            predicted_class = CLASS_NAMES[predicted.item()]

        return JSONResponse({
            "filename": file.filename,
            "predicted_class": predicted_class
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
