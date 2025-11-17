import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import models, transforms
import sys

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend")
CHECKPOINT_PATH = os.path.join(BASE_DIR, "best_resnet.pth")

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
# Verify model file exists
# -----------------------------
if not os.path.exists(CHECKPOINT_PATH):
    print(f"ERROR: Model file not found at {CHECKPOINT_PATH}")
    print("Please ensure best_resnet.pth is in the backend directory")
    sys.exit(1)

print(f"✓ Model file found at: {CHECKPOINT_PATH}")
print(f"✓ Model file size: {os.path.getsize(CHECKPOINT_PATH) / (1024*1024):.2f} MB")

# -----------------------------
# Load model
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"✓ Using device: {device}")

model = models.resnet50(weights=None)
num_ftrs = model.fc.in_features
num_classes = 5
model.fc = torch.nn.Linear(num_ftrs, num_classes)

# Load checkpoint
print(f"Loading model from {CHECKPOINT_PATH}...")
try:
    model.load_state_dict(torch.load(CHECKPOINT_PATH, map_location=device))
    model = model.to(device)
    model.eval()
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"ERROR loading model: {e}")
    sys.exit(1)

# -----------------------------
# Define transforms
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
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
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Frontend not found</h1>", status_code=404)


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


@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device)
    })