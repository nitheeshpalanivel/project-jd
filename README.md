# ARCOVA Disaster Intelligence System 🚨
### AI-Based Urban Disaster Risk Prediction & Dynamic Evacuation Command Platform

**ARCOVA** is a complete, high-performance emergency command platform engineered for rapid urban disaster response, AI-driven risk scoring, transparent explainable factor attribution (XAI), dynamic Dijkstra evacuation route optimization, and real-time interactive mapping.

---

## 🚀 How to Run the Application

### 1. Run the Frontend (React + TypeScript + Vite + Leaflet)
```bash
cd frontend
npm install
npm run dev
```
The application will launch locally at: **`http-[#]127.0.0.1:5173/`**

To test or build the production bundle:
```bash
npm run build
```

---

### 2. Run the Backend API (Python FastAPI - Optional / Modular Engine)
```bash
cd backend
pip install fastapi uvicorn pydantic
python main.py
```
The FastAPI backend server will run at: **`http-[#]127.0.0.1:8000/`**
- Interactive Swagger API Docs: `http-[#]127.0.0.1:8000/docs`
- Endpoints:
  - `POST /api/predict-risk`: Hydrological & demographic risk scoring (0–100)
  - `POST /api/evacuation-route`: Graph Dijkstra route recalculation avoiding blocked roads

---

## 📁 Project Structure

```
hackathon/
├── frontend/                     # React + TypeScript + Vite Command Application
│   ├── src/
│   │   ├── components/           # UI Components & Map Wrappers
│   │   │   ├── Navbar.tsx        # Command Center header with live clock & quick scenario switcher
│   │   │   ├── Sidebar.tsx       # Navigation menu & live alert counter
│   │   │   ├── KpiCard.tsx       # KPI stat widgets with glowing indicators
│   │   │   ├── InteractiveMap.tsx# Leaflet interactive map with custom markers, polygons & polylines
│   │   │   ├── ExplainableRiskCard.tsx # XAI factor contribution breakdown (+32 Rain, +28 Water, etc.)
│   │   ├── engine/               # Core Algorithms & Logic
│   │   │   ├── riskEngine.ts     # Transparent AI Risk Scoring & Factor Attribution
│   │   │   ├── routingEngine.ts  # Graph Dijkstra / A* Evacuation Algorithm
│   │   │   ├── simulationEngine.ts# Preset scenarios & Autopilot Demo controller
│   │   ├── pages/                # Command Center Views
│   │   │   ├── DashboardView.tsx # Emergency Command Dashboard (KPIs, Map, Recharts, Alerts)
│   │   │   ├── RiskMapView.tsx   # Interactive Spatial Risk Map & Inspector
│   │   │   ├── EvacuationView.tsx# Dynamic Evacuation Step-by-Step Navigation & Road Graph
│   │   │   ├── RiskEngineView.tsx# AI Risk Engine Sandbox & Slider Simulator
│   │   │   ├── SheltersView.tsx  # Shelters & Emergency Facilities Registry
│   │   │   ├── AlertsView.tsx    # Command Alert Dispatch Log
│   │   │   ├── SimulationView.tsx# Disaster Simulator & Presentation Control Center
│   │   ├── data/
│   │   │   └── mockData.ts       # Realistic urban mock dataset (Zones, Roads, Shelters, Alerts)
│   │   ├── types/
│   │   │   └── disaster.ts       # TypeScript Interfaces
│   │   ├── App.tsx               # Root App Layout & State Orchestrator
│   │   ├── index.css             # Dark Emergency Aesthetic, Leaflet fixes, Animations
│   │   └── main.tsx              # Application Entrypoint
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                      # Python FastAPI Modular Backend
    ├── main.py                   # FastAPI REST server
    ├── risk_engine.py            # Python Risk Prediction Engine & XAI
    ├── routing.py                # Python Graph Dijkstra Evacuation Algorithm
    └── models.py                 # Pydantic data schemas
```

---

## 🌟 Key Features Implemented

1. **Emergency Command Dashboard**
   - Professional dark emergency control center aesthetic (`#080c14` background, translucent glassmorphism cards, glowing status LEDs).
   - Top KPI Widgets: Overall Risk Level, High Risk Zones, Blocked Roads, Available Shelters, Exposed Population.
   - Interactive Recharts Data Visualizations: Zone Risk Distribution, Shelter Capacity vs Occupancy, Affected Population per Zone.
   - Live Command Alert feed with real-time incident dispatch logs.

2. **Interactive Spatial Risk Map**
   - Full Leaflet + OpenStreetMap dark theme map (`CartoDB Dark Matter`).
   - Color-coded risk zone polygons (Green = LOW, Yellow = MEDIUM, Red = HIGH).
   - Interactive Road Polylines (Open corridors, High-Risk corridors, Blocked roads dashed in red).
   - Custom SVG markers for Safe Shelters, Hospitals, and Emergency Centers with capacity indicators.
   - Pulsing HQ Radar Pin for Incident Location.
   - **Glowing Animated Evacuation Polyline**: Cyan path (`#06b6d4`) with dash animation.

3. **Transparent AI Risk Prediction & Explainable AI (XAI)**
   - Inputs: Rainfall (mm), Water Level (m), Terrain Elevation (m), Population Density (people/km²).
   - Deterministic risk scoring formula from 0–100 with threshold classification (0–39 LOW, 40–69 MEDIUM, 70–100 HIGH).
   - **Innovation Feature - Explainable AI Attribution**: Numerical weight attribution (+32 Rainfall, +28 Water Level, +17 Low Elevation, +7 Population Density) and automated natural language rationale explaining *why* the zone exceeded safety thresholds.
   - Modular architecture ready for seamless replacement with trained `scikit-learn` or PyTorch models.

4. **Dynamic Evacuation Routing Algorithm**
   - Graph adjacency representation of urban road network.
   - **Graph Dijkstra Algorithm**:
     - Automatically prunes `Blocked` roads (sets weight = `Infinity`).
     - Applies heavy cost penalty to `High Risk` corridors (`distance * 2.5`).
     - Filters out unsafe shelters or shelters with zero capacity (`availableCapacity <= 0`).
     - Selects optimal safe shelter and returns step-by-step navigation directions, distance (km), estimated transit time (mins), and blocked roads avoided count.
     - Auto-recalculates dynamically whenever simulation state or road conditions change!

5. **Shelters & Emergency Facilities Management**
   - Filterable directory of Shelters, Hospitals, and Emergency Centers.
   - Live bed space availability, occupancy progress bars, safety status badges, phone contacts, and amenities list.

6. **Real-Time Disaster Scenario Simulator & Autopilot Demo**
   - Scenario Presets: `Normal Conditions`, `Heavy Rainfall`, `Flood Warning`, `Severe Flood`.
   - Prominent **"⚡ RUN DEMO FOR JUDGES"** autopilot sequence:
     - Automatically transitions through all 10 hackathon presentation steps in 15 seconds with visual progress alerts.

---

## 🏆 Demo Flow for Hackathon Judges

1. **Step 1: Normal Baseline**
   - Click `Normal` preset or launch autopilot demo.
   - Observe all 5 zones colored GREEN (LOW risk score < 40). All roads open, traffic flowing normally.
2. **Step 2: Rainfall Surge & Hydrological Change**
   - Click `Heavy Rain` or `Flood Warning`.
   - Rainfall surges to 120mm and water level reaches 2.8m in Zone A.
3. **Step 3: AI Risk Scoring & XAI Attribution**
   - Observe Zone A turn RED on the map (Risk score = 82/100, HIGH RISK).
   - Inspect the Explainable AI card to see exact factor weights (+32 Rainfall, +28 Water Level, +17 Low Elevation, +7 Population).
4. **Step 4: Road Blockage & Dynamic Graph Rerouting**
   - Road R3 (Central Bridge Way) becomes flooded and marked BLOCKED (red dashed line).
   - Routing engine instantly prunes R3 from graph and calculates alternative safe path via Metro Bypass (R4) and Highland Link (R7).
5. **Step 5: Shelter Selection & Navigation**
   - System auto-selects Safe Shelter S2 (Metro Arena, 550 available bed spaces).
   - Displays glowing cyan evacuation route on map and step-by-step navigation timeline!

---

## 💡 Key Assumptions

- **Mock Data**: Uses local urban grid dataset around Sector 7 command center, allowing complete offline execution without external API keys or satellite dependencies.
- **Deterministic AI Model**: Transparent weight scoring guarantees predictable, explainable behavior suitable for emergency command decisions.
- **Architecture**: Modular codebase separates frontend UI, risk prediction engine, graph routing engine, and backend FastAPI endpoints.
