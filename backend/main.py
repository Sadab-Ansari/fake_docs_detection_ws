import os
import joblib
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ml.utils.pdf_utils import extract_text_from_pdf
from ml.utils.ocr_utils import extract_text
from datetime import datetime

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Paths for models
MODEL_PATH = "ml/models/text_model.pkl"
VECTORIZER_PATH = "ml/models/vectorizer.pkl"

#  Load ML model + vectorizer once at startup
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


# Health Check Route (for uptime monitoring / cold start prevention)
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# Default root endpoint
@app.get("/")
def root():
    return {"message": "Hello, FastAPI is working with trained model"}


# Upload + Prediction Route
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_bytes = await file.read()
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(file_bytes)

    try:
        try:
            # First try extracting text from PDF
            extracted_text = extract_text_from_pdf(temp_path)
        except Exception:
            # If PDF extraction fails, fallback to OCR
            extracted_text = extract_text(temp_path)

        # Transform + Predict
        X = vectorizer.transform([extracted_text])
        prediction = model.predict(X)[0]
        proba = float(model.predict_proba(X).max())

        best_label = "Fake Document" if prediction == 1 else "Real Document"
        is_fake = bool(prediction == 1)
        confidence = float(proba)

    except Exception as e:
        best_label = "Unknown"
        is_fake = None
        confidence = None
        extracted_text = f"Error: {str(e)}"

    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return {
        "filename": file.filename,
        "ocr_text": extracted_text[:500],
        "isFake": is_fake,
        "prediction": best_label,
        "confidence": confidence,
        "message": "Processed successfully."
    }
