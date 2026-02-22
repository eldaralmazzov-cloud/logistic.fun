from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models, auth
from routers import auth as auth_router, products as products_router, settings as settings_router, upload as upload_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Logistics Management System",
    description="API for managing logistics products, orders, and media uploads.",
    version="1.0.0",
)

ALLOWED_ORIGINS = [
    "https://logistic-fun.netlify.app",   # production Netlify frontend
    "http://localhost:5173",              # local Vite dev
    "http://localhost:3000",              # fallback local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(products_router.router)
app.include_router(settings_router.router)
app.include_router(upload_router.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    # Create seed users for different roles
    seed_users = [
        {"username": "admin", "email": "admin@company.com", "role": models.UserRole.ADMIN, "password": "admin123"},
        {"username": "manager", "email": "manager@company.com", "role": models.UserRole.MANAGER, "password": "manager123"},
        {"username": "accountant", "email": "accountant@company.com", "role": models.UserRole.ACCOUNTANT, "password": "accountant123"},
        {"username": "logistics", "email": "logistics@company.com", "role": models.UserRole.LOGISTICS, "password": "logistics123"},
    ]
    
    for u_data in seed_users:
        try:
            existing = db.query(models.User).filter(models.User.username == u_data["username"]).first()
            if not existing:
                user = models.User(
                    username=u_data["username"],
                    email=u_data["email"],
                    role=u_data["role"],
                    hashed_password=auth.get_password_hash(u_data["password"])
                )
                db.add(user)
                db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error seeding user {u_data['username']}: {e}")
    
    # Initialize default settings
    default_settings = [
        {"key": "customs_rate_kg", "value": 2.5, "description": "Customs cost per kg (USD)"},
        {"key": "customs_percent", "value": 15.0, "description": "Customs cost as % of product value (e.g. 15)"},
        {"key": "delivery_rate_kg", "value": 1.5, "description": "Delivery cost per kg (USD)"},
        {"key": "delivery_rate_m3", "value": 350.0, "description": "Delivery cost per m3 (USD)"},
        {"key": "company_margin_percent", "value": 10.0, "description": "Standard company margin %"}
    ]
    
    for s_data in default_settings:
        existing = db.query(models.GlobalSettings).filter(models.GlobalSettings.key == s_data["key"]).first()
        if not existing:
            setting = models.GlobalSettings(**s_data)
            db.add(setting)
    
    db.commit()
    db.close()

@app.get("/")
def read_root():
    return {"message": "Logistics Management System API"}
