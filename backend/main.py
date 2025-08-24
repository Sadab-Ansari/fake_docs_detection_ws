from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello, FastAPI is working"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()  # reads file content
    # Dummy result for now
    return {
        "filename": file.filename,
        "isFake": True,
        "confidence": 0.87,
        "message": "This document is likely fake."
    }
