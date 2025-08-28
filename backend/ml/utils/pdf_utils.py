import fitz  # PyMuPDF
import os
from ml.utils.ocr_utils import extract_text, clean_text

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract and clean text from a PDF file.
    - Try embedded text first
    - Fallback to OCR for image-only pages
    """
    try:
        all_text = []
        pdf_document = fitz.open(pdf_path)

        # Temp folder for saving page images (for OCR fallback)
        temp_folder = "data/temp_pdf_pages"
        os.makedirs(temp_folder, exist_ok=True)

        for i, page in enumerate(pdf_document):
            # Try embedded text
            text = page.get_text("text")
            if text.strip():
                all_text.append(clean_text(text))
            else:
                # Fallback to OCR
                pix = page.get_pixmap()
                page_path = os.path.join(temp_folder, f"page_{i+1}.png")
                pix.save(page_path)

                raw_text = extract_text(page_path)
                all_text.append(clean_text(raw_text))

        return " ".join(all_text)

    except Exception as e:
        return f"PDF OCR Error: {str(e)}"
