import { Zone, Road, ShelterFacility, AlertItem } from '../types/disaster';
import { calculateZoneRisk } from '../engine/riskEngine';

// Initial User Incident Location
export const INCIDENT_LOCATION = {
  nodeId: 'N_INCIDENT',
  name: 'Zone A Downtown Emergency Command Post',
  lat: 12.9725,
  lng: 77.5880
};

// Raw initial zones configuration
const rawZonesData = [
  {
    id: 'zone_a',
    name: 'Zone A (Metro Downtown)',
    center: [12.9725, 77.5880] as [number, number],
    polygon: [
      [12.9780, 77.5820],
      [12.9790, 77.5940],
      [12.9690, 77.5950],
      [12.9670, 77.5840]
    ] as [number, number][],
    rainfall: 120,
    waterLevel: 2.8,
    elevation: 4,
    population: 8500,
    populationDensity: 8500
  },
  {
    id: 'zone_b',
    name: 'Zone B (Riverside District)',
    center: [12.9840, 77.5960] as [number, number],
    polygon: [
      [12.9890, 77.5900],
      [12.9900, 77.6040],
      [12.9800, 77.6050],
      [12.9790, 77.5940]
    ] as [number, number][],
    rainfall: 65,
    waterLevel: 1.4,
    elevation: 12,
    population: 4200,
    populationDensity: 4200
  },
  {
    id: 'zone_c',
    name: 'Zone C (North Hills)',
    center: [12.9980, 77.5850] as [number, number],
    polygon: [
      [13.0050, 77.5780],
      [13.0060, 77.5930],
      [12.9930, 77.5920],
      [12.9920, 77.5790]
    ] as [number, number][],
    rainfall: 25,
    waterLevel: 0.5,
    elevation: 25,
    population: 2100,
    populationDensity: 2100
  },
  {
    id: 'zone_d',
    name: 'Zone D (Industrial Harbor)',
    center: [12.9640, 77.6020] as [number, number],
    polygon: [
      [12.9690, 77.5950],
      [12.9700, 77.6100],
      [12.9580, 77.6110],
      [12.9570, 77.5970]
    ] as [number, number][],
    rainfall: 45,
    waterLevel: 1.0,
    elevation: 3,
    population: 3800,
    populationDensity: 3800
  },
  {
    id: 'zone_e',
    name: 'Zone E (East Suburbs)',
    center: [12.9750, 77.6150] as [number, number],
    polygon: [
      [12.9800, 77.6050],
      [12.9820, 77.6250],
      [12.9680, 77.6260],
      [12.9690, 77.6080]
    ] as [number, number][],
    rainfall: 15,
    waterLevel: 0.3,
    elevation: 18,
    population: 5100,
    populationDensity: 5100
  }
];

// Compute initial zones with risk engine
export const INITIAL_ZONES: Zone[] = rawZonesData.map(z => {
  const calc = calculateZoneRisk(z.rainfall, z.waterLevel, z.elevation, z.populationDensity);
  return {
    ...z,
    riskScore: calc.score,
    riskLevel: calc.level,
    riskFactors: calc.factors,
    rationale: calc.rationale,
    lastUpdated: 'Just now'
  };
});

// Initial roads graph
export const INITIAL_ROADS: Road[] = [
  {
    id: 'R1',
    name: 'Downtown Main Ave',
    startNode: 'N_INCIDENT',
    endNode: 'N1',
    distance: 1.8,
    status: 'Open',
    riskLevel: 'LOW',
    speedLimitKmH: 50,
    coordinates: [
      [12.9725, 77.5880],
      [12.9760, 77.5910]
    ]
  },
  {
    id: 'R2',
    name: 'Riverfront Expressway',
    startNode: 'N1',
    endNode: 'S1',
    distance: 2.2,
    status: 'Open',
    riskLevel: 'MEDIUM',
    speedLimitKmH: 60,
    coordinates: [
      [12.9760, 77.5910],
      [12.9800, 77.5960],
      [12.9840, 77.5980]
    ]
  },
  {
    id: 'R3',
    name: 'Central Bridge Way',
    startNode: 'N1',
    endNode: 'S2',
    distance: 1.5,
    status: 'Blocked',
    riskLevel: 'HIGH',
    speedLimitKmH: 40,
    coordinates: [
      [12.9760, 77.5910],
      [12.9780, 77.6010],
      [12.9810, 77.6080]
    ]
  },
  {
    id: 'R4',
    name: 'Metro Bypass Arterial',
    startNode: 'N_INCIDENT',
    endNode: 'N2',
    distance: 2.4,
    status: 'Open',
    riskLevel: 'LOW',
    speedLimitKmH: 70,
    coordinates: [
      [12.9725, 77.5880],
      [12.9810, 77.5860],
      [12.9880, 77.5850]
    ]
  },
  {
    id: 'R5',
    name: 'South Tunnel Causeway',
    startNode: 'N_INCIDENT',
    endNode: 'N3',
    distance: 2.1,
    status: 'High Risk',
    riskLevel: 'HIGH',
    speedLimitKmH: 50,
    coordinates: [
      [12.9725, 77.5880],
      [12.9660, 77.5920],
      [12.9640, 77.6010]
    ]
  },
  {
    id: 'R6',
    name: 'North Ridge Connector',
    startNode: 'N2',
    endNode: 'S3',
    distance: 1.9,
    status: 'Open',
    riskLevel: 'LOW',
    speedLimitKmH: 50,
    coordinates: [
      [12.9880, 77.5850],
      [12.9940, 77.5840],
      [12.9980, 77.5850]
    ]
  },
  {
    id: 'R7',
    name: 'Highland Link Road',
    startNode: 'N2',
    endNode: 'S2',
    distance: 3.1,
    status: 'Open',
    riskLevel: 'LOW',
    speedLimitKmH: 60,
    coordinates: [
      [12.9880, 77.5850],
      [12.9850, 77.5980],
      [12.9810, 77.6080]
    ]
  },
  {
    id: 'R8',
    name: 'East Boulevard Link',
    startNode: 'N3',
    endNode: 'S2',
    distance: 2.7,
    status: 'Open',
    riskLevel: 'LOW',
    speedLimitKmH: 50,
    coordinates: [
      [12.9640, 77.6010],
      [12.9720, 77.6060],
      [12.9810, 77.6080]
    ]
  }
];

// Initial Shelters
export const INITIAL_SHELTERS: ShelterFacility[] = [
  {
    id: 'S1',
    name: 'S1 - Riverside Community Center',
    type: 'Shelter',
    lat: 12.9840,
    lng: 77.5980,
    totalCapacity: 500,
    currentOccupancy: 320,
    availableCapacity: 180,
    safetyStatus: 'SAFE',
    riskLevel: 'LOW',
    contactPhone: '+1 (800) 555-0191',
    amenities: ['Emergency Medical', 'Food Supply', 'Backup Generator', 'Wi-Fi'],
    address: '142 Riverside Drive, Sector 7'
  },
  {
    id: 'S2',
    name: 'S2 - Metro Arena Safe Complex',
    type: 'Shelter',
    lat: 12.9810,
    lng: 77.6080,
    totalCapacity: 1000,
    currentOccupancy: 450,
    availableCapacity: 550,
    safetyStatus: 'SAFE',
    riskLevel: 'LOW',
    contactPhone: '+1 (800) 555-0192',
    amenities: ['Helipad', 'Heavy Equipment Station', 'Medical Triage', 'Water Purification', 'Cots'],
    address: '88 Metro Boulevard, Sector 7'
  },
  {
    id: 'S3',
    name: 'S3 - North Hills Academy Gym',
    type: 'Shelter',
    lat: 12.9980,
    lng: 77.5850,
    totalCapacity: 750,
    currentOccupancy: 210,
    availableCapacity: 540,
    safetyStatus: 'SAFE',
    riskLevel: 'LOW',
    contactPhone: '+1 (800) 555-0193',
    amenities: ['High Ground Safety', 'Solar Backup', 'Childcare Area', 'Kitchen'],
    address: '502 Highland Avenue, Sector 7'
  },
  {
    id: 'H1',
    name: 'H1 - Sector 7 General Hospital',
    type: 'Hospital',
    lat: 12.9860,
    lng: 77.5910,
    totalCapacity: 400,
    currentOccupancy: 310,
    availableCapacity: 90,
    safetyStatus: 'SAFE',
    riskLevel: 'LOW',
    contactPhone: '+1 (800) 555-0911',
    amenities: ['ICU Units', 'Surgical Suites', 'Trauma Bay', 'Ambulance Fleet'],
    address: '10 Hospital Way, Sector 7'
  },
  {
    id: 'E1',
    name: 'E1 - Disaster Response HQ Depot',
    type: 'Emergency Center',
    lat: 12.9910,
    lng: 77.5890,
    totalCapacity: 300,
    currentOccupancy: 110,
    availableCapacity: 190,
    safetyStatus: 'SAFE',
    riskLevel: 'LOW',
    contactPhone: '+1 (800) 555-0199',
    amenities: ['Command Post', 'Satellite Communications', 'Rescue Boat Fleet'],
    address: '1 Defense Circle, Sector 7'
  }
];

// Initial Alerts
export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt_1',
    timestamp: '17:45:10',
    title: '🚨 HIGH RISK THRESHOLD EXCEEDED',
    message: 'Zone A (Metro Downtown) rainfall reached 120mm with water level 2.8m. Risk score calculated at 82/100 (HIGH).',
    severity: 'CRITICAL',
    category: 'RISK',
    zoneId: 'zone_a'
  },
  {
    id: 'alt_2',
    timestamp: '17:46:02',
    title: '⚠️ ROAD BLOCKED NOTICE',
    message: 'Road R3 (Central Bridge Way) flooded and marked IMPASSABLE. Avoid segment.',
    severity: 'WARNING',
    category: 'ROAD'
  },
  {
    id: 'alt_3',
    timestamp: '17:46:15',
    title: '🛟 DYNAMIC EVACUATION ROUTE READY',
    message: 'Routing engine dispatched optimal path avoiding Road R3. Destination Shelter S2 (Metro Arena Safe Complex) designated.',
    severity: 'INFO',
    category: 'EVACUATION'
  }
];
