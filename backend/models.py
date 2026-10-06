from pydantic import BaseModel
from typing import List, Optional, Tuple, Literal

RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]
RoadStatus = Literal["Open", "Blocked", "High Risk"]
FacilityType = Literal["Shelter", "Hospital", "Emergency Center"]
FacilityStatus = Literal["SAFE", "AT_RISK", "EVACUATE"]

class RiskFactor(BaseModel):
    factor: str
    points: float
    maxPoints: float
    icon: str
    valueString: str
    description: str

class ZoneModel(BaseModel):
    id: str
    name: str
    center: Tuple[float, float]
    polygon: List[Tuple[float, float]]
    rainfall: float
    waterLevel: float
    elevation: float
    population: int
    populationDensity: float
    riskScore: float
    riskLevel: RiskLevel
    riskFactors: List[RiskFactor]
    rationale: str
    lastUpdated: str

class RoadModel(BaseModel):
    id: str
    name: str
    startNode: str
    endNode: str
    distance: float
    status: RoadStatus
    riskLevel: RiskLevel
    coordinates: List[Tuple[float, float]]
    speedLimitKmH: float

class ShelterFacilityModel(BaseModel):
    id: str
    name: str
    type: FacilityType
    lat: float
    lng: float
    totalCapacity: int
    currentOccupancy: int
    availableCapacity: int
    safetyStatus: FacilityStatus
    riskLevel: RiskLevel
    contactPhone: str
    amenities: List[str]
    address: str

class EvacuationStepModel(BaseModel):
    stepIndex: int
    fromNode: str
    toNode: str
    roadId: str
    roadName: str
    distanceKm: float
    status: RoadStatus
    instruction: str

class EvacuationRouteModel(BaseModel):
    sourceNodeId: str
    targetShelter: ShelterFacilityModel
    routeNodeIds: List[str]
    roadIds: List[str]
    pathCoordinates: List[Tuple[float, float]]
    totalDistanceKm: float
    estimatedTimeMinutes: int
    blockedRoadsAvoided: int
    highRiskRoadsAvoided: int
    stepByStep: List[EvacuationStepModel]
    calculatedAt: str

class AlertModel(BaseModel):
    id: str
    timestamp: str
    title: str
    message: str
    severity: Literal["CRITICAL", "WARNING", "INFO"]
    category: Literal["RISK", "ROAD", "EVACUATION", "SHELTER"]
    zoneId: Optional[str] = None
