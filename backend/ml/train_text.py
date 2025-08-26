# backend/ml/train_text.py

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. Load dataset
DATA_PATH = "../data/fake_docs.xlsx"   # <-- update filename if needed
df = pd.read_excel(DATA_PATH)

# Check if dataset has required columns
if "Text" not in df.columns or "Flag" not in df.columns:
    raise ValueError("Dataset must have 'Text' and 'Flag' columns")

texts = df["Text"].astype(str)
labels = df["Flag"]

# 2. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=42, stratify=labels
)

# 3. Vectorize text
vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 4. Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# 5. Evaluate
y_pred = model.predict(X_test_vec)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 6. Save model + vectorizer
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/text_model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print(" Model and vectorizer saved in 'ml/models/'")
