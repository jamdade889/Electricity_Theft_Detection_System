import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

def simulate(customers=50, readings=100):
    rows = []
    labels = {}

    start = datetime.now()

    for cid in range(customers):
        cust_id = f"CUST{cid:04d}"
        is_thief = random.random() < 0.25
        labels[cust_id] = is_thief

        base = random.uniform(0.8, 2.0)

        for i in range(readings):
            ts = start + timedelta(minutes=15 * i)

            usage = base + np.random.normal(0, 0.2)

            if is_thief and i > readings // 2:
                usage *= random.uniform(0.3, 0.6)

            rows.append([
                cust_id,
                ts,
                max(usage, 0.1),
                random.normalvariate(220, 8),
                random.normalvariate(2.0, 0.3),
                random.uniform(0.75, 0.95),
                int(random.random() < 0.01),
                int(random.random() < 0.005),
                int(random.random() < 0.01)
            ])

    df = pd.DataFrame(rows, columns=[
        "cust_id","timestamp",
        "kw_usage","voltage","current","pf",
        "short_circuit","meter_reset","meter_reverse"
    ])

    df.to_csv("advanced_usage.csv", index=False)

    pd.DataFrame([
        {"cust_id": k, "is_theft": v} for k, v in labels.items()
    ]).to_csv("labels.csv", index=False)

    print("✔ Data generated")

if __name__ == "__main__":
    simulate(customers=50, readings=100)