from ml.utils.ocr_utils import extract_text
from ml.utils.pdf_utils import extract_text_from_pdf


if __name__ == "__main__":
    try:
        result = extract_text("data/images/sample.pdf")
        print("Extracted Text:\n", result)
    except Exception as e:
        print("Error:", e)
