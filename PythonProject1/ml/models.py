from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from database import Base
import datetime

class MeterReading(Base):
    __tablename__ = "meter_readings"

    id = Column(Integer, primary_key=True, index=True)
    cust_id = Column(String, index=True)
    transformer_id = Column(String, default="T1")
    timestamp = Column(DateTime, index=True)

    kw_usage = Column(Float)
    voltage = Column(Float)
    current = Column(Float)
    pf = Column(Float)

    short_circuit = Column(Integer)
    meter_reset = Column(Integer)
    meter_reverse = Column(Integer)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True)
    cust_id = Column(String, index=True)

    probability = Column(Float)
    level = Column(String)

    model_type = Column(String)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    cust_id = Column(String, index=True)
    transformer_id = Column(String)

    probability = Column(Float)
    alert_level = Column(String)

    model_type = Column(String)
    resolved = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(Integer, primary_key=True)
    cust_id = Column(String, unique=True, index=True)

    avg_risk_score = Column(Float, default=0.0)
    risk_count = Column(Integer, default=0)

    total_alerts = Column(Integer, default=0)
    theft_count = Column(Integer, default=0)

    last_level = Column(String, default="NORMAL")
    consecutive_high = Column(Integer, default=0)

    last_alert_time = Column(DateTime, nullable=True)


class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    id = Column(Integer, primary_key=True)
    model_type = Column(String)
    features = Column(Text)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)