# import pandas as pd
# import requests
# import time
# from datetime import datetime, UTC
#
# URL = "http://127.0.0.1:8000/predict"
#
# df = pd.read_csv("advanced_usage.csv")
# df = df.sample(frac=1).reset_index(drop=True)
#
# print(f"Streaming {len(df)} records...\n")
#
# for i, row in df.iterrows():
#     payload = row.to_dict()
#
#     # Overwrite timestamp with live time
#     payload["timestamp"] = datetime.now(UTC).isoformat()
#
#     try:
#         r = requests.post(URL, json=payload, timeout=5)
#
#         if r.status_code == 200:
#             response = r.json()
#             print(
#                 f"[{i+1}/{len(df)}] "
#                 f"Cust: {response['customer']} | "
#                 f"Prob: {round(response['probability'],3)} | "
#                 f"Level: {response['level']}"
#             )
#         else:
#             print(f"[{i+1}] Server Error:", r.status_code, r.text)
#
#     except requests.exceptions.RequestException as e:
#         print("Connection error:", e)
#         break
#
#     time.sleep(0.2)
#
# print("\nStreaming finished.")