# import pandas as pd

# import joblib
# from sklearn.ensemble import RandomForestClassifier
#
# df = pd.read_csv("advanced_usage.csv")
# labels = pd.read_csv("labels.csv")
#
# df["timestamp"] = pd.to_datetime(df["timestamp"])
#
# agg = df.groupby("cust_id").agg({
#     "kw_usage": ["mean","max","min","std"],
#     "voltage": ["mean","std"],
#     "current": ["mean","max"],
#     "pf": "mean",
#     "short_circuit": "sum",
#     "meter_reset": "sum",
#     "meter_reverse": "sum"
# })
#
# agg.columns = ["_".join(c) for c in agg.columns]
# agg = agg.reset_index()
#
# data = agg.merge(labels, on="cust_id")
#
# feature_cols = [c for c in data.columns if c not in ["cust_id","is_theft"]]
#
# X = data[feature_cols]
# y = data["is_theft"]
#
# model = RandomForestClassifier(n_estimators=300, random_state=42)
# model.fit(X, y)
#

# joblib.dump((model, feature_cols), "model_advanced.pkl")
#
# print("✔ Model trained")
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest

# LOAD DATA
df = pd.read_csv("advanced_usage.csv")
labels = pd.read_csv("labels.csv")

df["timestamp"] = pd.to_datetime(df["timestamp"])

# 🔹 OPTIONAL: time features
df["hour"] = df["timestamp"].dt.hour
df["day"] = df["timestamp"].dt.weekday

# AGGREGATION
agg = df.groupby("cust_id").agg({
    "kw_usage": ["mean","max","min","std"],
    "voltage": ["mean","std"],
    "current": ["mean","max"],
    "pf": "mean",
    "short_circuit": "sum",
    "meter_reset": "sum",
    "meter_reverse": "sum",
    "hour": "mean",
    "day": "mean"
})

agg.columns = ["_".join(c) for c in agg.columns]
agg = agg.reset_index()

data = agg.merge(labels, on="cust_id")

feature_cols = [c for c in data.columns if c not in ["cust_id","is_theft"]]

X = data[feature_cols]
y = data["is_theft"]

# 🔹 MODELS
clf = RandomForestClassifier(n_estimators=300, random_state=42)
clf.fit(X, y)

iso = IsolationForest(contamination=0.1, random_state=42)
iso.fit(X)

# SAVE
joblib.dump({
    "type": "hybrid",   # 🔥 THIS WAS MISSING
    "classifier": clf,
    "anomaly": iso,
    "features": feature_cols
}, "model.pkl")

print("✔ Training complete")