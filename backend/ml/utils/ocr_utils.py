import pytesseract
from PIL import Image
import re

# Configure Tesseract path (Windows installation path)
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
    Clean OCR/Extracted text:
    - Remove headers/footers
    - Normalize spaces
    - Convert to lowercase
    - Keep useful symbols (-:/()%)
    """
    if not raw_text:
        return ""

    # Remove known junk headers/footers
    cleaned = re.sub(r"@ code 360|by codingninjas", "", raw_text, flags=re.IGNORECASE)

    # Normalize spaces
    cleaned = " ".join(cleaned.split())

    # Lowercase
    cleaned = cleaned.lower()

    # Keep useful symbols
    cleaned = re.sub(r"[^a-z0-9\s\-\:\./()%]", "", cleaned)

    return cleaned
