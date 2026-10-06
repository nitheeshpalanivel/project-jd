export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RoadStatus = 'Open' | 'Blocked' | 'High Risk';
export type FacilityType = 'Shelter' | 'Hospital' | 'Emergency Center';
export type FacilityStatus = 'SAFE' | 'AT_RISK' | 'EVACUATE';

export interface RiskFactor {
  factor: string;
  points: number;
  maxPoints: number;
  icon: string;
  valueString: string;
  description: string;
}

export interface Zone {
  id: string;
  name: string;
  center: [number, number];
  polygon: [number, number][];
  rainfall: number; // in mm
  waterLevel: number; // in meters
  elevation: number; // in meters
  population: number; // count
  populationDensity: number; // people per sq km
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  rationale: string;
  lastUpdated: string;
}

export interface Road {
  id: string;
  name: string;
  startNode: string;
  endNode: string;
  distance: number; // in km
  status: RoadStatus;
  riskLevel: RiskLevel;
  coordinates: [number, number][];
  speedLimitKmH: number;
}

export interface ShelterFacility {
  id: string;
  name: string;
  type: FacilityType;
  lat: number;
  lng: number;
  totalCapacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  safetyStatus: FacilityStatus;
  riskLevel: RiskLevel;
  contactPhone: string;
  amenities: string[];
  address: string;
}

export interface EvacuationStep {
  stepIndex: number;
  fromNode: string;
  toNode: string;
  roadId: string;
  roadName: string;
  distanceKm: number;
  status: RoadStatus;
  instruction: string;
}

export interface EvacuationRoute {
  sourceNodeId: string;
  targetShelter: ShelterFacility;
  routeNodeIds: string[];
  roadIds: string[];
  pathCoordinates: [number, number][];
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  blockedRoadsAvoided: number;
  highRiskRoadsAvoided: number;
  stepByStep: EvacuationStep[];
  calculatedAt: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'RISK' | 'ROAD' | 'EVACUATION' | 'SHELTER';
  zoneId?: string;
}

export type ScenarioPreset = 'NORMAL' | 'HEAVY_RAINFALL' | 'FLOOD_WARNING' | 'SEVERE_FLOOD';
