from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON, Text
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    ACCOUNTANT = "Accountant"
    LOGISTICS = "Logistics"

class CargoStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_WAREHOUSE = "In Warehouse"
    IN_TRANSIT = "In Transit"
    DELIVERED = "Delivered"

class PaymentStatus(str, enum.Enum):
    UNPAID = "Unpaid"
    PARTIALLY_PAID = "Partially Paid"
    PAID = "Paid"

class ShippingMethod(str, enum.Enum):
    AIR = "Air"
    SEA = "Sea"
    RAIL = "Rail"
    TRUCK = "Truck"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.LOGISTICS)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True) # Product ID (auto-generated)
    product_name = Column(String, index=True)
    supplier_name = Column(String, index=True)
    order_number = Column(String, index=True)
    category = Column(String)
    
    # Financial Fields
    purchase_price = Column(Float)
    currency = Column(String) # CNY, USD, etc.
    exchange_rate = Column(Float)
    customs_cost = Column(Float)
    delivery_cost = Column(Float)
    margin_percent = Column(Float)
    final_total_cost = Column(Float)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    payment_date = Column(DateTime, nullable=True)
    outstanding_balance = Column(Float)
    invoice_number = Column(String)
    
    # Logistics Fields
    weight_kg = Column(Float)
    volume_m3 = Column(Float)
    quantity = Column(Integer, nullable=False, default=0)
    warehouse_location = Column(String)
    tracking_number = Column(String, index=True)
    shipping_method = Column(Enum(ShippingMethod))
    status = Column(Enum(CargoStatus), default=CargoStatus.PENDING)
    departure_date = Column(DateTime, nullable=True)
    estimated_arrival_date = Column(DateTime, nullable=True)
    actual_arrival_date = Column(DateTime, nullable=True)
    logistics_notes = Column(Text, nullable=True)
    
    # New Fields
    media_urls = Column(JSON, nullable=True)
    characteristics = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    weight = Column(Float, nullable=True)
    size = Column(String(100), nullable=True)
    packaging_size = Column(String(100), nullable=True)
    
    # KGS Calculation Fields
    price_cny = Column(Float, nullable=True, default=0.0)
    delivery_usd_per_kg = Column(Float, nullable=True, default=0.0)
    total_cost_som = Column(Float, nullable=True, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GlobalSettings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON) # Store rates and formulas as JSON
    description = Column(String)

class ExchangeRate(Base):
    __tablename__ = "exchange_rates"
    id = Column(Integer, primary_key=True, index=True)
    currency_from = Column(String)
    currency_to = Column(String)
    rate = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    action = Column(String) # e.g., "Created Product", "Updated Status"
    details = Column(JSON) # Store before/after state
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    product = relationship("Product")
