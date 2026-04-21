import pandas as pd

# ==============================
# 🔥 CLEAN DATA
# ==============================
def clean_data(df):

    # Convert timestamp safely
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    # Remove invalid rows
    df = df.dropna(subset=["timestamp"])

    # Time features
    df["hour"] = df["timestamp"].dt.hour
    df["day"] = df["timestamp"].dt.weekday

    return df


# ==============================
# 🔥 FEATURE ENGINEERING
# ==============================
def create_features(df):

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

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    # ==============================
    # 🔥 HANDLE NaN (VERY IMPORTANT)
    # ==============================
    agg = agg.fillna(0)

    # ==============================
    # 🔥 EXTRA FEATURES (STRONG BOOST)
    # ==============================
    agg["kw_range"] = agg["kw_usage_max"] - agg["kw_usage_min"]
    agg["voltage_fluctuation"] = agg["voltage_std"]
    agg["current_spike"] = agg["current_max"] - agg["current_mean"]

    # Tampering signal
    agg["tamper_flag"] = (
        agg["short_circuit_sum"] +
        agg["meter_reset_sum"] +
        agg["meter_reverse_sum"]
    )

    return agg.reset_index()