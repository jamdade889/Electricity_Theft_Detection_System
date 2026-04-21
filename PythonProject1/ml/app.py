from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine, Base
from models import MeterReading, Alert, Prediction, CustomerProfile, ModelMetadata

from services.data_processor import clean_data, create_features
from services.model_service import train_model, load_model
from ml_models.ml_model import predict

from datetime import datetime
import pandas as pd
import os

# ==============================
# INIT
# ==============================
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Grid Intelligence API")
# ==============================
# 🔥 GLOBAL SETTINGS (NEW)
# ==============================

settings_store = {
    "low": 34,
    "medium": 64
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# 🔥 SAFE MODEL LOADER (NEW)
# ==============================
# def get_or_train_model(X=None, y=None):
#     try:
#         return load_model()
#     except Exception as e:
#         print("⚠️ Model not found. Training new model...")
#
#         if X is None or y is None:
#             raise Exception("No model found and no training data provided")
#
#         model = train_model(X, y, "rf")  # default RandomForest
#         return model
def get_or_train_model(X=None):
    try:
        return load_model()
    except Exception:
        print("⚠️ Model not found. Training fallback model...")

        import numpy as np

        if X is None:
            raise Exception("No model and no data to train")

        # 🔥 Create dummy labels (assume normal)
        y_dummy = np.zeros(len(X))

        # 🔥 Train anomaly model instead of classifier
        model = train_model(X, y_dummy, "iso")

        return model


# ==============================
# HEALTH
# ==============================
@app.get("/health")
def health():
    return {"status": "Running"}


# ==============================
# 🔥 PREDICT (FIXED + ROBUST)
# ==============================
@app.post("/predict")
async def predict_api(data: dict):

    db = SessionLocal()

    try:
        timestamp = datetime.fromisoformat(
            data["timestamp"].replace("Z", "+00:00")
        )

        reading = MeterReading(
            cust_id=data["cust_id"],
            transformer_id=data.get("transformer_id", "T1"),
            timestamp=timestamp,
            kw_usage=data["kw_usage"],
            voltage=data["voltage"],
            current=data["current"],
            pf=data["pf"],
            short_circuit=data["short_circuit"],
            meter_reset=data["meter_reset"],
            meter_reverse=data["meter_reverse"]
        )

        db.add(reading)
        db.commit()

        # ==============================
        # GET HISTORY
        # ==============================
        readings = db.query(MeterReading)\
            .filter(MeterReading.cust_id == data["cust_id"])\
            .order_by(MeterReading.timestamp.desc())\
            .limit(50)\
            .all()

        if len(readings) < 5:
            return {"error": "Not enough data"}

        # ==============================
        # CREATE FEATURES
        # ==============================
        df = pd.DataFrame([{
            "cust_id": r.cust_id,
            "timestamp": r.timestamp,
            "kw_usage": r.kw_usage,
            "voltage": r.voltage,
            "current": r.current,
            "pf": r.pf,
            "short_circuit": r.short_circuit,
            "meter_reset": r.meter_reset,
            "meter_reverse": r.meter_reverse
        } for r in readings])

        df = clean_data(df)
        features = create_features(df)

        X = features.drop(columns=["cust_id"])

        # ==============================
        # LOAD MODEL
        # ==============================
        # try:
        #     model = load_model() 4/4/26
        # except:
        #     return {"error": "Model not trained yet. Upload training data first."}
        model = get_or_train_model(X)
        # ==============================
        # ALIGN FEATURES
        # ==============================
        model_features = model["features"]

        for col in model_features:
            if col not in X.columns:
                X[col] = 0

        X = X[model_features]

        # ==============================
        # 🔥 PREDICT (FIXED)
        # ==============================
        try:
            prob, level = predict(model, X, data)

            # ==============================
            # 🔥 APPLY DYNAMIC THRESHOLDS
            # ==============================
            # low = settings_store["low"] / 100
            # medium = settings_store["medium"] / 100
            #
            # if prob <= low:
            #     level = "NORMAL"
            # elif prob <= medium:
            #     level = "SUSPICIOUS"
            # elif prob <= 0.85:
            #     level = "HIGH"
            # else:
            #     level = "THEFT"
        except Exception as e:
            print("❌ Prediction error:", str(e))
            return {"error": f"Prediction failed: {str(e)}"}

        if prob is None or level is None:
            return {"error": "Prediction returned empty values"}

        # ==============================
        # STORE PREDICTION
        # ==============================
        db.add(Prediction(
            cust_id=data["cust_id"],
            probability=float(prob),
            level=level,
            model_type=model["type"]
        ))

        # ==============================
        # ALERT
        # ==============================
        if level in ["HIGH", "THEFT"]:
            db.add(Alert(
                cust_id=data["cust_id"],
                transformer_id=data.get("transformer_id", "T1"),
                probability=float(prob),
                alert_level=level,
                model_type=model["type"]
            ))

        # ==============================
        # CUSTOMER PROFILE
        # ==============================
        profile = db.query(CustomerProfile)\
            .filter_by(cust_id=data["cust_id"])\
            .first()

        if not profile:
            profile = CustomerProfile(
                cust_id=data["cust_id"],
                avg_risk_score=0,
                total_alerts=0,
                theft_count=0
            )
            db.add(profile)

        profile.avg_risk_score = (profile.avg_risk_score + float(prob)) / 2
        profile.last_level = level

        if level in ["HIGH", "THEFT"]:
            profile.total_alerts += 1

        if level == "THEFT":
            profile.theft_count += 1

        db.commit()

        return {
            "customer": data["cust_id"],
            "probability": float(prob),
            "level": level
        }

    finally:
        db.close()
# ==============================
# 🔥 REPORTS
# ==============================
from models import Prediction

@app.get("/reports")
def reports(risk: str = "all", limit: int = 100):

    db = SessionLocal()

    try:
        query = db.query(Prediction)

        # 🔥 Risk filter (fixed)
        if risk != "all":
            query = query.filter(Prediction.level.ilike(f"%{risk}%"))

        # 🔥 Handle full download vs limited view
        if limit == -1:
            data = query.order_by(Prediction.id.desc()).all()
        else:
            data = query.order_by(Prediction.id.desc()).limit(limit).all()

        return [
            {
                "customer": p.cust_id,
                "probability": p.probability,
                "level": p.level,
                "status": "active"
            }
            for p in data
        ]

    finally:
        db.close()

# from models import Prediction
#
# @app.get("/reports")
# def reports(risk: str = "all", limit: int = 100):
#
#     db = SessionLocal()
#
#     try:
#         query = db.query(Prediction)
#
#         # if risk != "all":
#         #     query = query.filter(Prediction.level.ilike(risk))
#         if risk != "all":
#             query = query.filter(Prediction.level.ilike(f"%{risk}%"))
#         data = query.order_by(Prediction.id.desc()).limit(limit).all()
#
#         return [
#             {
#                 "customer": p.cust_id,
#                 "probability": p.probability,
#                 "level": p.level,
#                 "status": "active"
#             }
#             for p in data
#         ]
#
#     finally:
#         db.close()

# ==============================
# 🔥 DASHBOARD
# ==============================
@app.get("/dashboard")
def dashboard():

    db = SessionLocal()

    try:
        readings = db.query(MeterReading).all()
        predictions = db.query(Prediction).all()

        total_readings = len(readings)

        normal = sum(1 for p in predictions if p.level == "NORMAL")
        suspicious = sum(1 for p in predictions if p.level == "SUSPICIOUS")
        high_risk = sum(1 for p in predictions if p.level == "HIGH")
        theft = sum(1 for p in predictions if p.level == "THEFT")

        # 🔥 REAL TREND (last 10 predictions)
        recent = predictions[-10:]

        trend = [
            {
                "time": i,
                "normal": 1 if p.level == "NORMAL" else 0,
                "suspicious": 1 if p.level == "SUSPICIOUS" else 0,
                "high": 1 if p.level == "HIGH" else 0,
                "theft": 1 if p.level == "THEFT" else 0,
            }
            for i, p in enumerate(recent)
        ]

        return {
            "total_readings": total_readings,
            "normal": normal,
            "suspicious": suspicious,
            "high_risk": high_risk,
            "theft": theft,
            "trend": trend
        }

    finally:
        db.close()

# ==============================
# 🔥 TRAIN CSV
# ==============================
@app.post("/train-csv")
async def train_csv(
    usage: UploadFile = File(...),
    labels: UploadFile = File(...),
    model_type: str = Form(...)
):
    df = pd.read_csv(usage.file)
    labels_df = pd.read_csv(labels.file)

    df = clean_data(df)
    features = create_features(df)

    data = features.merge(labels_df, on="cust_id")

    X = data.drop(columns=["cust_id", "is_theft"])
    y = data["is_theft"]

    model = train_model(X, y, model_type)

    db = SessionLocal()
    db.add(ModelMetadata(
        model_type=model_type,
        features=",".join(X.columns)
    ))
    db.commit()
    db.close()

    return {"message": "Model trained successfully"}


# ==============================
# 🔥 DETECT CSV
# ==============================
@app.post("/detect-csv")
async def detect_csv(
    usage: UploadFile = File(...),
    model_type: str = Form(...)
):
    df = pd.read_csv(usage.file)

    df = clean_data(df)
    features = create_features(df)

    try:
        model = load_model()
    except:
        return {"error": "Model not trained yet"}

    results = []

    for _, row in features.iterrows():
        cust_id = row["cust_id"]

        X = row.drop("cust_id").to_frame().T

        model_features = model["features"]

        for col in model_features:
            if col not in X.columns:
                X[col] = 0

        X = X[model_features]
        latest = df[df["cust_id"] == cust_id].iloc[-1].to_dict()

        prob, level = predict(model, X, latest)

        results.append({
            "cust_id": cust_id,
            "prob": float(prob),
            "level": level
        })

    return {"results": results}
# ==============================
# 🔥 SETTINGS API (NEW)
# ==============================
@app.get("/settings")
def get_settings():
    return settings_store


@app.post("/settings")
def save_settings(data: dict):
    settings_store["low"] = data.get("low", 34)
    settings_store["medium"] = data.get("medium", 64)

    return {"message": "Settings saved"}
