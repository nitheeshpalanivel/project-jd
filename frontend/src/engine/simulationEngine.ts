import { Zone, Road, ShelterFacility, AlertItem, ScenarioPreset } from '../types/disaster';
import { calculateZoneRisk } from './riskEngine';
import { calculateDynamicEvacuationRoute } from './routingEngine';
import { INCIDENT_LOCATION } from '../data/mockData';

export interface SimulationState {
  preset: ScenarioPreset;
  zones: Zone[];
  roads: Road[];
  shelters: ShelterFacility[];
  alerts: AlertItem[];
  currentEvacuationRoute: ReturnType<typeof calculateDynamicEvacuationRoute>;
  simulationActive: boolean;
  stepDescription: string;
}

export function applyScenarioPreset(
  preset: ScenarioPreset,
  currentZones: Zone[],
  currentRoads: Road[],
  currentShelters: ShelterFacility[],
  existingAlerts: AlertItem[]
): SimulationState {
  const timestamp = new Date().toLocaleTimeString();

  // Create deep clones
  let newZones: Zone[] = JSON.parse(JSON.stringify(currentZones));
  let newRoads: Road[] = JSON.parse(JSON.stringify(currentRoads));
  let newShelters: ShelterFacility[] = JSON.parse(JSON.stringify(currentShelters));
  let newAlerts: AlertItem[] = [...existingAlerts];
  let stepDescription = '';

  switch (preset) {
    case 'NORMAL':
      newZones = newZones.map(z => ({
        ...z,
        rainfall: 15,
        waterLevel: 0.3
      }));
      newRoads = newRoads.map(r => ({
        ...r,
        status: 'Open',
        riskLevel: 'LOW'
      }));
      newShelters = newShelters.map(s => ({
        ...s,
        safetyStatus: 'SAFE',
        riskLevel: 'LOW'
      }));
      stepDescription = 'Normal meteorological conditions. All transportation corridors and shelters clear.';
      newAlerts.unshift({
        id: `alt_${Date.now()}`,
        timestamp,
        title: '✅ NORMAL CONDITIONS RESTORED',
        message: 'All urban risk metrics returned to baseline safe parameters.',
        severity: 'INFO',
        category: 'RISK'
      });
      break;

    case 'HEAVY_RAINFALL':
      newZones = newZones.map(z => {
        if (z.id === 'zone_a') return { ...z, rainfall: 75, waterLevel: 1.6 };
        if (z.id === 'zone_b') return { ...z, rainfall: 50, waterLevel: 1.1 };
        if (z.id === 'zone_d') return { ...z, rainfall: 35, waterLevel: 0.8 };
        return { ...z, rainfall: 20, waterLevel: 0.4 };
      });
      newRoads = newRoads.map(r => {
        if (r.id === 'R2' || r.id === 'R5') return { ...r, status: 'High Risk', riskLevel: 'MEDIUM' };
        return { ...r, status: 'Open', riskLevel: 'LOW' };
      });
      stepDescription = 'Heavy rainfall detected (75mm). Surface runoff elevating water level in Zone A.';
      newAlerts.unshift({
        id: `alt_${Date.now()}`,
        timestamp,
        title: '⚠️ HEAVY RAINFALL ADVISORY',
        message: 'Precipitation surging across Zone A & B. Drivers advised to monitor road conditions.',
        severity: 'WARNING',
        category: 'RISK',
        zoneId: 'zone_a'
      });
      break;

    case 'FLOOD_WARNING':
      newZones = newZones.map(z => {
        if (z.id === 'zone_a') return { ...z, rainfall: 120, waterLevel: 2.8 };
        if (z.id === 'zone_b') return { ...z, rainfall: 65, waterLevel: 1.4 };
        if (z.id === 'zone_d') return { ...z, rainfall: 45, waterLevel: 1.0 };
        return { ...z, rainfall: 25, waterLevel: 0.5 };
      });
      newRoads = newRoads.map(r => {
        if (r.id === 'R3') return { ...r, status: 'Blocked', riskLevel: 'HIGH' };
        if (r.id === 'R5') return { ...r, status: 'High Risk', riskLevel: 'HIGH' };
        return { ...r, status: 'Open', riskLevel: 'LOW' };
      });
      stepDescription = 'Severe inundation in Zone A (120mm rain / 2.8m water). Road R3 flooded & blocked. Evacuation rerouted!';
      newAlerts.unshift(
        {
          id: `alt_${Date.now()}_1`,
          timestamp,
          title: '🚨 HIGH RISK ALERT - ZONE A',
          message: 'Zone A risk score reached 82/100 (HIGH). Immediate evacuation recommended.',
          severity: 'CRITICAL',
          category: 'RISK',
          zoneId: 'zone_a'
        },
        {
          id: `alt_${Date.now()}_2`,
          timestamp,
          title: '⚠️ ROAD R3 BLOCKED',
          message: 'Central Bridge Way (R3) submerged under flood waters. Removed from routing graph.',
          severity: 'WARNING',
          category: 'ROAD'
        }
      );
      break;

    case 'SEVERE_FLOOD':
      newZones = newZones.map(z => {
        if (z.id === 'zone_a') return { ...z, rainfall: 185, waterLevel: 4.2 };
        if (z.id === 'zone_b') return { ...z, rainfall: 140, waterLevel: 3.1 };
        if (z.id === 'zone_d') return { ...z, rainfall: 110, waterLevel: 2.6 };
        return { ...z, rainfall: 45, waterLevel: 0.9 };
      });
      newRoads = newRoads.map(r => {
        if (r.id === 'R2' || r.id === 'R3' || r.id === 'R5') return { ...r, status: 'Blocked', riskLevel: 'HIGH' };
        if (r.id === 'R8') return { ...r, status: 'High Risk', riskLevel: 'HIGH' };
        return { ...r, status: 'Open', riskLevel: 'LOW' };
      });
      newShelters = newShelters.map(s => {
        if (s.id === 'S1') return { ...s, safetyStatus: 'AT_RISK', riskLevel: 'HIGH' };
        return s;
      });
      stepDescription = 'Catastrophic Urban Flood! Zones A, B & D flooded. Multiple roads blocked. Route recalculating to High Ground Shelter S3!';
      newAlerts.unshift(
        {
          id: `alt_${Date.now()}_1`,
          timestamp,
          title: '🚨 CATASTROPHIC FLOOD EMERGENCY',
          message: 'Multiple zones exceeding critical flood thresholds. Extreme emergency in progress.',
          severity: 'CRITICAL',
          category: 'RISK'
        },
        {
          id: `alt_${Date.now()}_2`,
          timestamp,
          title: '🛟 EVACUATION ROUTE TO NORTH SHELTER S3 ACTIVATED',
          message: 'Rerouting traffic away from lowland routes directly to High-Ground Shelter S3.',
          severity: 'CRITICAL',
          category: 'EVACUATION'
        }
      );
      break;
  }

  // Recalculate risk scores for all zones
  newZones = newZones.map(z => {
    const calc = calculateZoneRisk(z.rainfall, z.waterLevel, z.elevation, z.populationDensity);
    return {
      ...z,
      riskScore: calc.score,
      riskLevel: calc.level,
      riskFactors: calc.factors,
      rationale: calc.rationale,
      lastUpdated: timestamp
    };
  });

  // Calculate dynamic evacuation route
  const currentEvacuationRoute = calculateDynamicEvacuationRoute(
    INCIDENT_LOCATION.nodeId,
    newRoads,
    newShelters
  );

  return {
    preset,
    zones: newZones,
    roads: newRoads,
    shelters: newShelters,
    alerts: newAlerts.slice(0, 20), // limit to top 20
    currentEvacuationRoute,
    simulationActive: preset !== 'NORMAL',
    stepDescription
  };
}
