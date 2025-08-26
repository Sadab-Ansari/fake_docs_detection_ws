from pdf2image import convert_from_path
from ml.utils.ocr_utils import extract_text, clean_text
import os

def extract_text_from_pdf(pdf_path: str, poppler_path: str = None) -> str:
    """
    Extract and clean text from a PDF file using pdf2image + Tesseract OCR.
    Returns a single string for all pages.
    """
    try:
        # Convert PDF pages to images
        pages = convert_from_path(pdf_path, poppler_path=poppler_path)
        all_text = []

        # Create temp folder for page images
        temp_folder = "data/temp_pdf_pages"
        os.makedirs(temp_folder, exist_ok=True)

        for i, page in enumerate(pages):
            page_path = os.path.join(temp_folder, f"page_{i+1}.png")
            page.save(page_path, 'PNG')

            # OCR and clean text
            raw_text = extract_text(page_path)
            cleaned = clean_text(raw_text)
            all_text.append(cleaned)

        # Combine all pages into one string
        full_text = " ".join(all_text)
        return full_text

    except Exception as e:
        return f"PDF OCR Error: {str(e)}"
