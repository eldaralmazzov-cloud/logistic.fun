# Logistics Cost Calculation & Management System

A professional logistics management platform with strict RBAC and real-time calculation logic.

## Project Structure
- `/backend`: FastAPI Python server with SQLite/Postgres support.
- `/frontend`: React + Tailwind CSS dashboard application.

## Quick Start

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API Documentation available at: `http://localhost:8000/docs`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Credentials
- **Admin**: admin / admin123
- **Test Manager**: manager / manager123 (Add via Admin panel)
- **Test Accountant**: accountant / accountant123 (Add via Admin panel)
- **Test Logistics**: logistics / logistics123 (Add via Admin panel)
