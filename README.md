# AEC Qualification Checker

Production-style internal tool for checking AEC qualification status for EEE component lists uploaded via CSV/XLSX.

## Stack
- Frontend: React + TypeScript + Tailwind + Framer Motion + TanStack Table
- Backend: FastAPI + pandas + openpyxl

## Features
- Drag/drop upload for `.csv` and `.xlsx`
- Validates required columns: `Part Number`, `Manufacturer`
- PN normalization (spaces/dashes/suffix handling)
- AEC output fields: Status, Standard, Grade, Source, Notes, Confidence
- Searchable/report-ready tabular output
- CSV/JSON export (JSON is Excel-friendly)
- Graceful invalid row handling

## Quick Start

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL=http://localhost:8000` if needed.

## API
`POST /api/v1/process`
- multipart form-data: `file`
- returns summary + detailed row-level results

## Notes on Trusted Source Logic
The `qualification_service` ships with a mock trusted dataset and a modular lookup interface for plugging in:
- manufacturer APIs
- distributor APIs
- controlled web/PDF extraction pipelines

For enterprise deployment, replace mock lookup with async connectors and source ranking.
