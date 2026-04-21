from database import SessionLocal
from PythonProject1.ml.models import MeterReading, Alert

db = SessionLocal()

print("\n--- TOTAL METER READINGS ---")
print(db.query(MeterReading).count())

print("\n--- LAST 5 METER READINGS ---")
readings = db.query(MeterReading).order_by(MeterReading.id.desc()).limit(5).all()

for r in readings:
    print(
        "ID:", r.id,
        "| Cust:", r.cust_id,
        "| Transformer:", r.transformer_id,
        "| Usage:", r.kw_usage,
        "| Time:", r.timestamp
    )

print("\n--- TOTAL ALERTS ---")
print(db.query(Alert).count())

print("\n--- ALERTS LIST ---")
alerts = db.query(Alert).all()

for a in alerts:
    print(
        "Cust:", a.cust_id,
        "| Prob:", round(a.probability, 3),
        "| Level:", a.alert_level,
        "| Time:", a.created_at
    )

db.close()