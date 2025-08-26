import fitz  # PyMuPDF
from ml.utils.ocr_utils import extract_text, clean_text
import os

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract and clean text from a PDF file using PyMuPDF + Tesseract OCR.
    Returns a single string for all pages.
    """
    try:
        all_text = []

        # Open PDF with PyMuPDF
        pdf_document = fitz.open(pdf_path)

        # Temp folder for saving page images
        temp_folder = "data/temp_pdf_pages"
        os.makedirs(temp_folder, exist_ok=True)

        for i, page in enumerate(pdf_document):
            # Render page as image
            pix = page.get_pixmap()
            page_path = os.path.join(temp_folder, f"page_{i+1}.png")
            pix.save(page_path)

            # OCR and clean text
            raw_text = extract_text(page_path)
            cleaned = clean_text(raw_text)
            all_text.append(cleaned)

        # Combine all pages into one string
        full_text = " ".join(all_text)
        return full_text

    except Exception as e:
        return f"PDF OCR Error: {str(e)}"
