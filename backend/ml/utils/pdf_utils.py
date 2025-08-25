from pdf2image import convert_from_path
from ml.utils.ocr_utils import extract_text

# Convert PDF to a list of PIL images
pages = convert_from_path('data/images/sample.pdf')

for i, page in enumerate(pages):
    # Optional: save page as PNG
    page_path = f'data/images/page_{i+1}.png'
    page.save(page_path, 'PNG')
    
    # Extract text from the page image
    text = extract_text(page_path)
    print(f"--- Page {i+1} ---\n{text}\n")
