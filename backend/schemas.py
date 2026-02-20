from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from models import UserRole, CargoStatus, PaymentStatus, ShippingMethod

class UserBase(BaseModel):
    username: str
    email: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None

class ProductBase(BaseModel):
    product_name: str
    supplier_name: str
    order_number: str
    category: Optional[str] = None
    purchase_price: float
    currency: str
    exchange_rate: float
    margin_percent: float
    payment_status: PaymentStatus = PaymentStatus.UNPAID
    invoice_number: Optional[str] = None
    weight_kg: float
    volume_m3: float
    quantity: int
    warehouse_location: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_method: ShippingMethod
    status: CargoStatus = CargoStatus.PENDING
    departure_date: Optional[datetime] = None
    estimated_arrival_date: Optional[datetime] = None
    actual_arrival_date: Optional[datetime] = None
    logistics_notes: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    # Field names must match ProductBase but all are optional
    product_name: Optional[str] = None
    supplier_name: Optional[str] = None
    status: Optional[CargoStatus] = None
    payment_status: Optional[PaymentStatus] = None
    # Add others as needed for granular updates

class ProductResponse(ProductBase):
    id: int
    customs_cost: float
    delivery_cost: float
    final_total_cost: float
    outstanding_balance: float
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    details: Any
    timestamp: datetime
    class Config:
        from_attributes = True

class GlobalSettingsBase(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None

class GlobalSettingsResponse(GlobalSettingsBase):
    id: int
    class Config:
        from_attributes = True
