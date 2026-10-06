import { Zone, RiskLevel, RiskFactor } from '../types/disaster';

export interface RiskCalculationResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  rationale: string;
}

/**
 * Transparent & Explainable AI Risk Prediction Engine
 * Computes deterministic disaster risk scores (0-100) and provides weight attribution.
 */
export function calculateZoneRisk(
  rainfall: number,
  waterLevel: number,
  elevation: number,
  populationDensity: number
): RiskCalculationResult {
  // 1. Rainfall score (max 35 pts)
  const rainfallCap = 160;
  const rainfallPts = Math.min(35, Math.round((rainfall / rainfallCap) * 35));

  // 2. Water level score (max 35 pts)
  const waterLevelCap = 4.5;
  const waterPts = Math.min(35, Math.round((waterLevel / waterLevelCap) * 35));

  // 3. Elevation vulnerability score (max 20 pts)
  // Low elevation (< 5m) gets high points; high elevation (> 25m) gets ~0 points
  const elevationMaxPts = 20;
  let elevationPts = 0;
  if (elevation < 30) {
    elevationPts = Math.round(((30 - Math.max(0, elevation)) / 30) * elevationMaxPts);
  }
  elevationPts = Math.max(0, Math.min(20, elevationPts));

  // 4. Population density impact bonus (max 10 pts)
  const popDensityCap = 10000;
  const popPts = Math.min(10, Math.round((populationDensity / popDensityCap) * 10));

  // Total raw score capped at 100
  const rawScore = rainfallPts + waterPts + elevationPts + popPts;
  const score = Math.min(100, Math.max(0, rawScore));

  // Risk Classification
  let level: RiskLevel = 'LOW';
  if (score >= 70) {
    level = 'HIGH';
  } else if (score >= 40) {
    level = 'MEDIUM';
  }

  // Explainable AI Risk Factor Attribution
  const factors: RiskFactor[] = [
    {
      factor: 'Rainfall Volume',
      points: rainfallPts,
      maxPoints: 35,
      icon: 'CloudRain',
      valueString: `${rainfall} mm`,
      description: rainfall > 100 ? 'Extreme precipitation overloading urban drainage' : rainfall > 50 ? 'Moderate rainfall saturation' : 'Normal rainfall levels'
    },
    {
      factor: 'Water Level',
      points: waterPts,
      maxPoints: 35,
      icon: 'Waves',
      valueString: `${waterLevel} m`,
      description: waterLevel > 2.5 ? 'River/drainage bank overflow hazard' : waterLevel > 1.2 ? 'Elevated waterway runoff' : 'Normal water level'
    },
    {
      factor: 'Terrain Low Elevation',
      points: elevationPts,
      maxPoints: 20,
      icon: 'Mountain',
      valueString: `${elevation} m`,
      description: elevation < 6 ? 'Low-lying basin highly susceptible to flooding' : elevation < 15 ? 'Moderate terrain elevation' : 'High ground natural protection'
    },
    {
      factor: 'Population Density',
      points: popPts,
      maxPoints: 10,
      icon: 'Users',
      valueString: `${populationDensity.toLocaleString()} /km²`,
      description: populationDensity > 7000 ? 'High human exposure & evacuation congestion risk' : 'Moderate population footprint'
    }
  ];

  // Sort factors by highest weight contribution
  factors.sort((a, b) => b.points - a.points);

  // Generate automated natural language rationale
  let rationale = '';
  if (level === 'HIGH') {
    rationale = `CRITICAL WARNING: Zone risk score reaches ${score}/100. Heavy precipitation (${rainfall}mm) and elevated water level (${waterLevel}m) on low elevation terrain (${elevation}m) exceed safe thresholds. Immediate evacuation recommended.`;
  } else if (level === 'MEDIUM') {
    rationale = `ELEVATED RISK: Zone risk score is ${score}/100. Moderate rainfall (${rainfall}mm) and rising water table require active monitoring and route preparation.`;
  } else {
    rationale = `NORMAL STATUS: Zone risk score is ${score}/100. Atmospheric and hydrological parameters remain within safe operational bounds.`;
  }

  return {
    score,
    level,
    factors,
    rationale
  };
}

/**
 * Recalculates risk for an array of zones
 */
export function updateZonesRisk(zones: Zone[]): Zone[] {
  return zones.map(zone => {
    const res = calculateZoneRisk(zone.rainfall, zone.waterLevel, zone.elevation, zone.populationDensity);
    return {
      ...zone,
      riskScore: res.score,
      riskLevel: res.level,
      riskFactors: res.factors,
      rationale: res.rationale,
      lastUpdated: new Date().toLocaleTimeString()
    };
  });
}
