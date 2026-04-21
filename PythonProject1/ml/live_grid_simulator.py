# import requests
# import random
# import time
# import numpy as np
# from datetime import datetime, UTC
#
# URL = "http://127.0.0.1:8000/predict"
#
# NUM_CUSTOMERS = 50
# NUM_TRANSFORMERS = 5
#
# TRANSFORMERS = [f"T{i}" for i in range(1, NUM_TRANSFORMERS + 1)]
# CUSTOMERS = [f"CUST{i:04d}" for i in range(NUM_CUSTOMERS)]
#
# # Assign each customer to transformer + base behavior
# customer_profiles = {}
#
# for cust in CUSTOMERS:
#     customer_profiles[cust] = {
#         "transformer_id": random.choice(TRANSFORMERS),
#         "base_usage": random.uniform(1.5, 5.0),
#         "theft_mode": False
#
#     }
#
# print("⚡ SMART GRID LIVE SIMULATION STARTED ⚡\n")
#
# while True:
#
#     now = datetime.now()
#     hour = now.hour
#     day = now.weekday()  # 0=Mon, 6=Sun
#
#     # Peak hour multiplier
#     peak_multiplier = 1.0
#     if 18 <= hour <= 22:
#         peak_multiplier = 1.6
#
#     # Weekend multiplier
#     weekend_multiplier = 1.0
#     if day >= 5:
#         weekend_multiplier = 1.2
#
#     # Track transformer totals
#     transformer_totals = {t: 0 for t in TRANSFORMERS}
#     current_payloads = []
#
#     # Generate data for all customers
#     for cust in CUSTOMERS:
#         profile = customer_profiles[cust]
#
#         # Randomly activate theft mode (rare event)
#         if random.random() < 0.01:
#             profile["theft_mode"] = True
#
#         # Randomly deactivate theft
#         if random.random() < 0.005:
#             profile["theft_mode"] = False
#
#         usage = profile["base_usage"] * peak_multiplier * weekend_multiplier
#         usage += np.random.normal(0, 0.3)
#
#         if profile["theft_mode"]:
#             usage *= random.uniform(0.3, 0.6)
#
#         usage = max(usage, 0.1)
#
#         transformer_totals[profile["transformer_id"]] += usage
#
#         payload = {
#             "cust_id": cust,
#             "transformer_id": profile["transformer_id"],
#             "timestamp": datetime.now(UTC).isoformat(),
#             "kw_usage": usage,
#             "voltage": random.normalvariate(220, 5),
#             "current": random.normalvariate(5, 1),
#             "pf": random.uniform(0.8, 0.99),
#             "short_circuit": int(random.random() < 0.002),
#             "meter_reset": int(random.random() < 0.001),
#             "meter_reverse": int(profile["theft_mode"])
#         }
#
#         current_payloads.append(payload)
#
#     # Send data to backend
#     for payload in current_payloads:
#         try:
#             r = requests.post(URL, json=payload, timeout=3)
#             if r.status_code == 200:
#                 res = r.json()
#                 print(
#                     f"{res['customer']} | "
#                     f"T:{payload['transformer_id']} | "
#                     f"Prob:{round(res['probability'],3)} | "
#                     f"{res['level']}"
#                 )
#             else:
#                 print("Server error:", r.status_code)
#
#         except Exception as e:
#             print("Connection error:", e)
#             break
#
#     print("\n🔌 Transformer Loads:")
#     for t in TRANSFORMERS:
#         print(f"{t} Total Load: {round(transformer_totals[t],2)} kW")
#
#     print("\n--------------------------------------------\n")
#
#     # Simulate 5-minute interval (accelerated)
#     time.sleep(5)
import requests
import random
import time
import numpy as np
from datetime import datetime, UTC

URL = "http://127.0.0.1:8000/predict"

NUM_CUSTOMERS = 50
NUM_TRANSFORMERS = 5

TRANSFORMERS = [f"T{i}" for i in range(1, NUM_TRANSFORMERS + 1)]
CUSTOMERS = [f"CUST{i:04d}" for i in range(NUM_CUSTOMERS)]

# ==============================
# CUSTOMER PROFILES (STATEFUL)
# ==============================
customer_profiles = {}

for cust in CUSTOMERS:
    customer_profiles[cust] = {
        "transformer_id": random.choice(TRANSFORMERS),
        "base_usage": random.uniform(1.5, 5.0),

        "theft_mode": False,
        "theft_type": None,
        "theft_duration": 0,

        "last_flagged": False
    }

print("⚡ SMART GRID LIVE SIMULATION STARTED ⚡\n")


# ==============================
# THEFT PATTERN ENGINE
# ==============================
def apply_theft(profile, usage):
    if not profile["theft_mode"]:
        return usage

    t = profile["theft_type"]

    if t == "gradual":
        return usage * random.uniform(0.6, 0.85)

    elif t == "sudden":
        return usage * random.uniform(0.2, 0.5)

    elif t == "night":
        hour = datetime.now().hour
        if 0 <= hour <= 5:
            return usage * random.uniform(0.3, 0.6)

    return usage


# ==============================
# MAIN LOOP
# ==============================
while True:

    now = datetime.now()
    hour = now.hour
    day = now.weekday()

    peak_multiplier = 1.6 if 18 <= hour <= 22 else 1.0
    weekend_multiplier = 1.2 if day >= 5 else 1.0

    transformer_totals = {t: 0 for t in TRANSFORMERS}

    for cust in CUSTOMERS:
        profile = customer_profiles[cust]

        # Activate theft
        if not profile["theft_mode"] and random.random() < 0.01:
            profile["theft_mode"] = True
            profile["theft_type"] = random.choice(
                ["gradual", "sudden", "night"]
            )
            profile["theft_duration"] = random.randint(20, 100)

        # Reduce duration
        if profile["theft_mode"]:
            profile["theft_duration"] -= 1
            if profile["theft_duration"] <= 0:
                profile["theft_mode"] = False
                profile["theft_type"] = None

        # Base usage
        usage = profile["base_usage"] * peak_multiplier * weekend_multiplier
        usage += np.random.normal(0, 0.3)

        # Apply theft
        usage = apply_theft(profile, usage)
        usage = max(usage, 0.1)

        transformer_totals[profile["transformer_id"]] += usage

        payload = {
            "cust_id": cust,
            "transformer_id": profile["transformer_id"],
            "timestamp": datetime.now(UTC).isoformat(),
            "kw_usage": usage,
            "voltage": random.normalvariate(220, 5),
            "current": random.normalvariate(5, 1),
            "pf": random.uniform(0.8, 0.99),
            "short_circuit": int(random.random() < 0.002),
            "meter_reset": int(random.random() < 0.001),
            "meter_reverse": int(
                profile["theft_mode"] and random.random() < 0.7
            )
        }

        try:
            r = requests.post(URL, json=payload, timeout=3)

            # ==============================
            # SAFE RESPONSE HANDLING
            # ==============================
            if r.status_code == 200:
                res = r.json()

                # 🔥 HANDLE API ERROR
                if "error" in res:
                    print(f"⚠️ API Error: {res['error']}")
                    continue

                level = res.get("level", "UNKNOWN")
                prob = res.get("probability", 0)

                # Adaptive behavior
                if level in ["HIGH", "THEFT"]:
                    profile["last_flagged"] = True
                else:
                    profile["last_flagged"] = False

                print(
                    f"{res.get('customer','?')} | "
                    f"T:{payload['transformer_id']} | "
                    f"Usage:{round(payload['kw_usage'],2)} | "
                    f"Prob:{round(prob,3)} | "
                    f"{level}"
                )

            else:
                print(f"❌ Server error: {r.status_code}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Connection error: {e}")
            continue

    # Transformer load summary
    print("\n🔌 Transformer Loads:")
    for t in TRANSFORMERS:
        print(f"{t}: {round(transformer_totals[t],2)} kW")

    print("\n--------------------------------------------\n")

    time.sleep(5)