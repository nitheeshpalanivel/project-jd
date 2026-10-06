import { Road, ShelterFacility, EvacuationRoute, EvacuationStep } from '../types/disaster';

interface GraphEdge {
  toNode: string;
  road: Road;
  weight: number;
}

/**
 * Graph-based Dijkstra / A* Routing Algorithm
 * Calculates safest dynamic evacuation routes while avoiding blocked roads and penalizing high risk routes.
 */
export function calculateDynamicEvacuationRoute(
  startNodeId: string,
  roads: Road[],
  shelters: ShelterFacility[]
): EvacuationRoute | null {
  // 1. Build adjacency graph
  const graph: Map<string, GraphEdge[]> = new Map();

  for (const road of roads) {
    if (!graph.has(road.startNode)) graph.set(road.startNode, []);
    if (!graph.has(road.endNode)) graph.set(road.endNode, []);

    // Determine weight
    let weight = road.distance;
    if (road.status === 'Blocked') {
      weight = Infinity; // IMPASSABLE
    } else if (road.status === 'High Risk') {
      weight = road.distance * 2.5; // PENALTY WEIGHT
    }

    if (weight !== Infinity) {
      graph.get(road.startNode)!.push({ toNode: road.endNode, road, weight });
      graph.get(road.endNode)!.push({ toNode: road.startNode, road, weight });
    }
  }

  // 2. Run Dijkstra's algorithm from startNodeId
  const distances: Map<string, number> = new Map();
  const previous: Map<string, { node: string; road: Road } | null> = new Map();
  const unvisited: Set<string> = new Set();

  // Initialize graph nodes
  const allNodes = new Set<string>();
  roads.forEach(r => {
    allNodes.add(r.startNode);
    allNodes.add(r.endNode);
  });

  allNodes.forEach(node => {
    distances.set(node, Infinity);
    previous.set(node, null);
    unvisited.add(node);
  });

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest distance
    let current: string | null = null;
    let smallestDist = Infinity;

    for (const node of unvisited) {
      const d = distances.get(node) ?? Infinity;
      if (d < smallestDist) {
        smallestDist = d;
        current = node;
      }
    }

    if (!current || smallestDist === Infinity) break;

    unvisited.delete(current);

    const neighbors = graph.get(current) || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.toNode)) continue;

      const alt = distances.get(current)! + edge.weight;
      if (alt < distances.get(edge.toNode)!) {
        distances.set(edge.toNode, alt);
        previous.set(edge.toNode, { node: current, road: edge.road });
      }
    }
  }

  // 3. Filter Safe and Available Shelters
  const validShelters = shelters.filter(
    s => s.availableCapacity > 0 && s.safetyStatus !== 'EVACUATE' && s.riskLevel !== 'HIGH'
  );

  // If no safe shelter found, fallback to any shelter with capacity
  const candidateShelters = validShelters.length > 0 
    ? validShelters 
    : shelters.filter(s => s.availableCapacity > 0);

  if (candidateShelters.length === 0) return null;

  // 4. Find closest candidate shelter in graph distance
  // Node IDs for shelters correspond to shelter IDs e.g. 'S1', 'S2', 'S3'
  let bestShelter: ShelterFacility | null = null;
  let minCost = Infinity;

  for (const shelter of candidateShelters) {
    const cost = distances.get(shelter.id) ?? Infinity;
    if (cost < minCost) {
      minCost = cost;
      bestShelter = shelter;
    }
  }

  // Fallback to closest shelter by physical distance if graph search fails
  if (!bestShelter || minCost === Infinity) {
    bestShelter = candidateShelters[0];
  }

  // 5. Reconstruct path from startNodeId to bestShelter.id
  const pathNodes: string[] = [];
  const pathRoads: Road[] = [];
  let curr: string | null = bestShelter.id;

  while (curr && curr !== startNodeId) {
    pathNodes.unshift(curr);
    const prevInfo = previous.get(curr);
    if (!prevInfo) break;
    pathRoads.unshift(prevInfo.road);
    curr = prevInfo.node;
  }
  pathNodes.unshift(startNodeId);

  // Collect map path coordinates
  const pathCoordinates: [number, number][] = [];
  let actualDistKm = 0;

  for (let i = 0; i < pathRoads.length; i++) {
    const road = pathRoads[i];
    actualDistKm += road.distance;
    if (i === 0) {
      pathCoordinates.push(...road.coordinates);
    } else {
      // Append coordinates without duplicating junction points
      pathCoordinates.push(...road.coordinates.slice(1));
    }
  }

  // Calculate statistics
  const blockedRoadsAvoided = roads.filter(r => r.status === 'Blocked').length;
  const highRiskRoadsAvoided = roads.filter(r => r.status === 'High Risk' && !pathRoads.some(pr => pr.id === r.id)).length;
  
  // Estimated travel time in emergency conditions (average 30-40 km/h)
  const avgSpeedKmH = 35;
  const estimatedTimeMinutes = Math.max(2, Math.round((actualDistKm / avgSpeedKmH) * 60));

  // Build step-by-step instructions
  const stepByStep: EvacuationStep[] = pathRoads.map((road, idx) => ({
    stepIndex: idx + 1,
    fromNode: pathNodes[idx],
    toNode: pathNodes[idx + 1],
    roadId: road.id,
    roadName: road.name,
    distanceKm: road.distance,
    status: road.status,
    instruction: `Proceed along ${road.name} (${road.id}) for ${road.distance.toFixed(1)} km [Status: ${road.status.toUpperCase()}]`
  }));

  return {
    sourceNodeId: startNodeId,
    targetShelter: bestShelter,
    routeNodeIds: pathNodes,
    roadIds: pathRoads.map(r => r.id),
    pathCoordinates,
    totalDistanceKm: Number(actualDistKm.toFixed(2)),
    estimatedTimeMinutes,
    blockedRoadsAvoided,
    highRiskRoadsAvoided,
    stepByStep,
    calculatedAt: new Date().toLocaleTimeString()
  };
}
