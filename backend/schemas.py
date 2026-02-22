from pydantic import BaseModel, Field
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
    product_name: str = Field(..., description="Name of the product")
    supplier_name: str = Field(..., description="Name of the supplier")
    order_number: str = Field(..., description="Unique order identification number")
    category: Optional[str] = Field(None, description="Product category (e.g., Electronics, Furniture)")
    purchase_price: float = Field(..., description="Original purchase price per unit")
    currency: str = Field("USD", description="Currency code (e.g., USD, CNY)")
    exchange_rate: float = Field(1.0, description="Exchange rate at the time of purchase")
    margin_percent: float = Field(0.0, description="Target margin percentage")
    payment_status: PaymentStatus = Field(PaymentStatus.UNPAID, description="Current payment status")
    invoice_number: Optional[str] = Field(None, description="Invoice reference number")
    weight_kg: float = Field(0.0, description="Total weight in kilograms for logistics calculations")
    volume_m3: float = Field(0.0, description="Total volume in cubic meters for logistics calculations")
    quantity: int = Field(0, description="Quantity of items")
    warehouse_location: Optional[str] = Field(None, description="Storage location in the warehouse")
    tracking_number: Optional[str] = Field(None, description="Logistics tracking number")
    shipping_method: ShippingMethod = Field(ShippingMethod.TRUCK, description="Method of shipping")
    status: CargoStatus = Field(CargoStatus.PENDING, description="Current cargo/order status")
    departure_date: Optional[datetime] = None
    estimated_arrival_date: Optional[datetime] = None
    actual_arrival_date: Optional[datetime] = None
    logistics_notes: Optional[str] = Field(None, description="Additional logistics notes")
    
    # New Fields (Data Tab)
    media_urls: Optional[List[str]] = Field(None, description="List of Cloudinary URLs for images/videos")
    characteristics: Optional[str] = Field(None, description="Technical characteristics or description")
    price: float = Field(0.0, description="Selling price (calculated or manual)")
    weight: Optional[float] = Field(None, description="Net weight of a single unit")
    size: Optional[str] = Field(None, description="Dimensions of the product")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    supplier_name: Optional[str] = None
    status: Optional[CargoStatus] = None
    payment_status: Optional[PaymentStatus] = None
    media_urls: Optional[List[str]] = None
    characteristics: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[float] = None
    size: Optional[str] = None
    quantity: Optional[int] = None
    category: Optional[str] = None
    purchase_price: Optional[float] = None
    currency: Optional[str] = None
    exchange_rate: Optional[float] = None
    margin_percent: Optional[float] = None
    invoice_number: Optional[str] = None
    weight_kg: Optional[float] = None
    volume_m3: Optional[float] = None
    warehouse_location: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_method: Optional[ShippingMethod] = None
    departure_date: Optional[datetime] = None
    estimated_arrival_date: Optional[datetime] = None
    actual_arrival_date: Optional[datetime] = None
    logistics_notes: Optional[str] = None

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
