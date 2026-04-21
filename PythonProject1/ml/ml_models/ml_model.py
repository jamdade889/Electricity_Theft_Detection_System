# import pandas as pd
#
#
# def predict(model, X, latest_data):
#     """
#     model: loaded model dict (rf / iso / hybrid)
#     X: feature dataframe (1 row)
#     latest_data: latest raw reading (dict)
#     """
#
#     # ==============================
#     # 🔹 MODEL PREDICTION
#     # ==============================
#
#     if model["type"] == "rf":
#         prob = model["classifier"].predict_proba(X)[0][1]
#
#     elif model["type"] == "iso":
#         score = model["anomaly"].decision_function(X)[0]
#
#         # Convert anomaly score to probability-like value
#         prob = 0.5 if score < -0.05 else 0.2
#
#     else:  # 🔥 HYBRID MODEL
#         clf_prob = model["classifier"].predict_proba(X)[0][1]
#         iso_score = model["anomaly"].decision_function(X)[0]
#
#         anomaly_flag = 1 if iso_score < -0.05 else 0
#
#         prob = clf_prob + (0.15 * anomaly_flag)
#
#     # ==============================
#     # 🔥 RULE-BASED BOOST (VERY IMPORTANT)
#     # ==============================
#
#     if latest_data.get("meter_reverse", 0) == 1:
#         prob += 0.08
#
#     if latest_data.get("short_circuit", 0) == 1:
#         prob += 0.05
#
#     # Clamp probability
#     prob = min(prob, 1.0)
#
#     # ==============================
#     # 🔥 RISK LEVEL CLASSIFICATION
#     # ==============================
#
#     if prob >= 0.9:
#         level = "THEFT"
#     elif prob >= 0.75:
#         level = "HIGH"
#     elif prob >= 0.55:
#         level = "SUSPICIOUS"
#     else:
#         level = "NORMAL"
#
#     return float(prob), level
import numpy as np

def predict(model, X, latest_data):

    # ==============================
    # 🔹 BASE MODEL OUTPUT
    # ==============================

    if model["type"] == "rf":
        prob = model["classifier"].predict_proba(X)[0][1]

    elif model["type"] == "iso":
        score = model["anomaly"].decision_function(X)[0]

        # Normalize anomaly score
        prob = 1 - (score + 0.5)

    else:  # HYBRID
        clf_prob = model["classifier"].predict_proba(X)[0][1]
        iso_score = model["anomaly"].decision_function(X)[0]

        anomaly_strength = max(0, -iso_score)  # stronger anomaly = bigger boost

        prob = clf_prob + (0.3 * anomaly_strength)

    # ==============================
    # 🔥 STRONG RULE-BASED SIGNALS
    # ==============================

    tamper_score = (
        latest_data.get("meter_reverse", 0) * 0.4 +
        latest_data.get("meter_reset", 0) * 0.3 +
        latest_data.get("short_circuit", 0) * 0.3
    )

    prob += tamper_score

    # ==============================
    # 🔥 USAGE-BASED ANOMALY
    # ==============================

    usage = latest_data.get("kw_usage", 0)

    if usage < 1:           # very low usage → theft suspicion
        prob += 0.25
    elif usage > 8:         # unusually high spike
        prob += 0.2

    # ==============================
    # 🔥 ADD RANDOMNESS (IMPORTANT)
    # ==============================

    prob += np.random.uniform(-0.1, 0.1)

    # Clamp
    prob = max(0, min(1, prob))

    # ==============================
    # 🔥 FINAL CLASSIFICATION
    # ==============================

    if prob >= 0.85:
        level = "THEFT"
    elif prob >= 0.65:
        level = "HIGH"
    elif prob >= 0.4:
        level = "SUSPICIOUS"
    else:
        level = "NORMAL"

    return float(prob), level