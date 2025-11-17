<img width="1920" height="1080" alt="Home Desktop" src="screenshots/home-desktop.png" />

<div id="top"></div>

<div align="center">

# 🐄 FARMLENS
*A Cattle Breed Recognition App Using Machine Learning & Image Uploads*

![last-commit](https://img.shields.io/github/last-commit/Surya821/FarmLens?style=flat&logo=git&logoColor=white&color=228B22)
![repo-top-language](https://img.shields.io/github/languages/top/Surya821/FarmLens?style=flat&color=228B22)
![repo-language-count](https://img.shields.io/github/languages/count/Surya821/FarmLens?style=flat&color=228B22)

**Tech Stack Used**

![React](https://img.shields.io/badge/React-20232A.svg?style=flat&logo=React&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C.svg?style=flat&logo=pytorch&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000.svg?style=flat&logo=vercel&logoColor=white)

</div>

---

## 📸 Screenshots

### 🖥️ Desktop View

| Home | Breed Info | Predict | Breed Info Card |
|:--:|:--:|:--:|:--:|
| ![Home](screenshots/home-desktop.png) | ![Breed Info](screenshots/breedinfo-desktop.png) | ![Predict](screenshots/predict-desktop.png) | ![Breed Info Card](screenshots/breedinfocard-desktop.png) |

### 📱 Mobile View

| Home | Breed Info | Predict | Breed Info Card |
|:--:|:--:|:--:|:--:|
| ![Home](screenshots/home-mobile.png) | ![Breed Info](screenshots/breedinfo-mobile.png) | ![Predict](screenshots/predict-mobile.png) | ![Breed Info Card](screenshots/breedinfocard-mobile.png) |

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Future Enhancements](#-future-enhancements)
- [Contact](#-contact)

---

## 🧐 Overview

**FarmLens** is a cattle breed recognition app powered by a **PyTorch model trained on 1000+ images**. Users can explore detailed information on **57 cattle breeds** and predict the breed of any cattle from an uploaded image.  
It uses a **Vite + React frontend** and a **FastAPI backend (`app.py`)** to serve predictions and breed data.

---

## 🔗 Demo

> Live Preview: https://farmlens.vercel.app

---

## ✨ Features

✅ Recognize cattle breed from uploaded image using ML model  
✅ Information on 58 different cattle breeds  
✅ PyTorch model trained on 1000+ images  
✅ FastAPI backend for serving predictions  
✅ Vite + React frontend for smooth UI  
✅ Fully responsive design – Desktop & Mobile 
✅ Theme switch (Light/Dark mode)  
✅ Language switch (Hindi / English)    


---

## ⚙️ Tech Stack

### **Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- Context API
- Theme & Language Switch implemented using React Context API

### **Backend:**
- Python (FastAPI)
- PyTorch (ML Model)
- Pillow (Image Processing)

### **Deployment:**
- Vercel / Any Python-friendly hosting for backend

---

## 📂 Project Structure

```bash
FarmLens/
├── frontend/                     # Frontend (React + Vite)
│   ├── public/
│   └── src/
│       ├── assets/images/
│       ├── components/
│       ├── data/
│       ├── pages/
│       └── App.jsx
└── backend/                     # Backend (FastAPI + PyTorch)
    ├── app.py                   
    ├── requirements.txt
    └── runtime.txt

```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js & npm installed
- Python 3.10+ installed
- PyTorch installed
- FastAPI & Uvicorn

---

### 👇 Installation

```bash
# Clone the repository
git clone https://github.com/Surya821/FarmLens

# Navigate to the project
cd FarmLens
```

### 🔧 Setup Client

``` bash
cd frontend
npm install
npm run dev
```

### 🖥️ Setup Server

``` bash
cd backend
npm install -r requirements.txt
uvicorn app:py --reload
```

---

---

## ▶️ Usage

1. **Open the app in browser**
2. **Browse cattle breeds and information**
3. **Upload image to predict cattle breed**
4. **View prediction and details**

---

## 🚧 Future Enhancements

- 🟦 Multi-image batch predictions  
- 🟦 Breed similarity suggestions
- 🟦 User accounts to save favorite breeds
- 🟦 Mobile-friendly app wrapper (PWA / App)
- 🟦 Voice recognition for breed info

---

## 📬 Contact

**Created by — Surya Pratap Singh**  
📩 **Contact Me:**  
[LinkedIn](https://www.linkedin.com/in/surya-pratap-singh1/) • [Gmail](mailto:surya30082005@gmail.com)

If you like this project, consider giving it a ⭐ on GitHub!

<p align="right">(<a href="#top">⬆️ Back to Top</a>)</p>


