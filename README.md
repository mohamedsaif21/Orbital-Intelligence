# OrbitaGen

OrbitaGen is a full-stack project for geospatial remote-sensing analysis and alerting. It combines a Python/FastAPI backend for image preprocessing, NDVI and detection pipelines with a Next.js + TypeScript frontend for visualization and dashboards.

## Features
- REST API for processing and detection
- NDVI and remote-sensing preprocessing pipelines
- GIS integration and shapefile handling
- Frontend dashboard with maps, alerts, and charts

## Top Skills Used
- **Python**: Backend processing, data pipelines, and models.
- **FastAPI**: REST API routes and server endpoints.
- **Geospatial Analysis**: GIS, shapefiles, and map-based data handling.
- **Remote Sensing / NDVI**: Image preprocessing and vegetation detection.
- **Next.js & TypeScript**: Frontend UI, React components, and integration.

## Quickstart

Backend (Python / FastAPI):

1. Create and activate a virtual environment:

```bash
python -m venv .venv
# Windows PowerShell
. .venv\\Scripts\\Activate.ps1

# or on cmd
.venv\\Scripts\\activate.bat
```

2. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Run the API server (example):

```bash
pip install uvicorn
uvicorn backend.app.main:app --reload --port 8000
```

Frontend (Next.js):

1. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

## Project layout (selected)
- `backend/` - Python API, processing pipelines, models
- `app/` - Next.js frontend and UI components
- `data/` - sample data, shapefiles, and temp storage

## Contributing
Please open issues or PRs for bugs, feature requests, or documentation improvements.

## License
This project is provided under the MIT License. Replace with your preferred license as needed.
