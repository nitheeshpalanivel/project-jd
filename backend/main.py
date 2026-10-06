from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from pydantic import BaseModel

from risk_engine import calculate_zone_risk
from routing import calculate_dijkstra_evacuation_route

app = FastAPI(
    title="ARCOVA Disaster Intelligence API",
    description="AI-Based Urban Disaster Risk Prediction & Dynamic Evacuation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskRequest(BaseModel):
    rainfall: float
    waterLevel: float
    elevation: float
    populationDensity: float

class RouteRequest(BaseModel):
    startNodeId: str = "N_INCIDENT"
    roads: List[Dict[str, Any]]
    shelters: List[Dict[str, Any]]

@app.get("/")
def read_root():
    return {
        "system": "ARCOVA Disaster Intelligence System API",
        "status": "ONLINE",
        "version": "1.0.0"
    }

@app.post("/api/predict-risk")
def predict_risk(req: RiskRequest):
    return calculate_zone_risk(
        req.rainfall,
        req.waterLevel,
        req.elevation,
        req.populationDensity
    )

@app.post("/api/evacuation-route")
def compute_route(req: RouteRequest):
    route = calculate_dijkstra_evacuation_route(
        req.startNodeId,
        req.roads,
        req.shelters
    )
    if not route:
        raise HTTPException(status_code=404, detail="No safe evacuation route found.")
    return route

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
