import joblib
import os
from sklearn.ensemble import RandomForestClassifier, IsolationForest

# ==============================
# 🔥 FIXED MODEL PATH (ABSOLUTE)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "model.pkl"))


# ==============================
# TRAIN MODEL
# ==============================
def train_model(X, y, model_type):

    if model_type == "rf":
        clf = RandomForestClassifier(n_estimators=300)
        clf.fit(X, y)

        model = {
            "type": "rf",
            "classifier": clf,
            "features": X.columns.tolist()
        }

    elif model_type == "iso":
        iso = IsolationForest(contamination=0.1)
        iso.fit(X)

        model = {
            "type": "iso",
            "anomaly": iso,
            "features": X.columns.tolist()
        }

    else:  # hybrid
        clf = RandomForestClassifier(n_estimators=300)
        clf.fit(X, y)

        iso = IsolationForest(contamination=0.1)
        iso.fit(X)

        model = {
            "type": "hybrid",
            "classifier": clf,
            "anomaly": iso,
            "features": X.columns.tolist()
        }

    # 🔥 SAVE MODEL SAFELY
    joblib.dump(model, MODEL_PATH)
    print(f"✅ Model saved at: {MODEL_PATH}")

    return model


# ==============================
# LOAD MODEL
# ==============================
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"❌ Model not found at {MODEL_PATH}")

    return joblib.load(MODEL_PATH)