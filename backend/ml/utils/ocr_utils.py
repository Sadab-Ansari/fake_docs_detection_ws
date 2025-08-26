import pytesseract
from PIL import Image
import re

# Configure the path to Tesseract (Windows installation path)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text(image_path: str) -> str:
    """
    Extract raw text from an image using Tesseract OCR.
    """
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        return f"OCR Error: {str(e)}"

def clean_text(raw_text: str) -> str:
    """
    Clean OCR output for model input:
    - Remove headers/footers
    - Remove extra line breaks and spaces
    - Convert to lowercase
    - Remove unwanted symbols
    """
    if not raw_text:
        return ""
    
    # Remove common headers/footers (add more if needed)
    cleaned = re.sub(r"@ code 360|by codingninjas", "", raw_text, flags=re.IGNORECASE)
    
    # Remove extra line breaks and spaces
    cleaned = " ".join(cleaned.split())
    
    # Convert to lowercase
    cleaned = cleaned.lower()
    
    # Remove unwanted symbols (keep letters, numbers, spaces)
    cleaned = re.sub(r"[^a-z0-9\s]", "", cleaned)
    
    return cleaned
