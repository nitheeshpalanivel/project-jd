const http = require('http');

const PORT = process.env.PORT || 8000;

function calculateZoneRisk(rainfall, waterLevel, elevation, populationDensity) {
  const rainfallPts = Math.min(35.0, Math.round((rainfall / 160.0) * 35.0 * 10) / 10);
  const waterPts = Math.min(35.0, Math.round((waterLevel / 4.5) * 35.0 * 10) / 10);
  let elevationPts = 0.0;
  if (elevation < 30.0) {
    elevationPts = Math.round(((30.0 - Math.max(0.0, elevation)) / 30.0) * 20.0 * 10) / 10;
  }
  elevationPts = Math.max(0.0, Math.min(20.0, elevationPts));
  const popPts = Math.min(10.0, Math.round((populationDensity / 10000.0) * 10.0 * 10) / 10);

  const rawScore = rainfallPts + waterPts + elevationPts + popPts;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let level = "LOW";
  if (score >= 70) level = "HIGH";
  else if (score >= 40) level = "MEDIUM";

  const factors = [
    { factor: "Rainfall Volume", points: rainfallPts, maxPoints: 35.0, icon: "CloudRain", valueString: `${rainfall} mm`, description: "Precipitation level impacting urban drainage." },
    { factor: "Water Level", points: waterPts, maxPoints: 35.0, icon: "Waves", valueString: `${waterLevel} m`, description: "Drainage runoff & river bank elevation." },
    { factor: "Terrain Low Elevation", points: elevationPts, maxPoints: 20.0, icon: "Mountain", valueString: `${elevation} m`, description: "Basin elevation flood vulnerability." },
    { factor: "Population Density", points: popPts, maxPoints: 10.0, icon: "Users", valueString: `${Math.round(populationDensity)} /km²`, description: "Human exposure & congestion impact." }
  ].sort((a, b) => b.points - a.points);

  let rationale = `NORMAL: Zone risk score is ${score}/100. Operational parameters within baseline bounds.`;
  if (level === "HIGH") {
    rationale = `CRITICAL: Zone risk score reaches ${score}/100 due to heavy rainfall (${rainfall}mm) and high water level (${waterLevel}m) on low terrain (${elevation}m).`;
  } else if (level === "MEDIUM") {
    rationale = `ELEVATED: Zone risk score is ${score}/100. Moderate hydrological runoff requires monitoring.`;
  }

  return { score, level, factors, rationale };
}

function calculateDijkstraRoute(startNodeId, roads, shelters) {
  const graph = {};

  roads.forEach(road => {
    const u = road.startNode;
    const v = road.endNode;
    if (!graph[u]) graph[u] = [];
    if (!graph[v]) graph[v] = [];

    const status = road.status || "Open";
    const dist = road.distance || 1.0;
    let weight = dist;
    if (status === "Blocked") weight = Infinity;
    else if (status === "High Risk") weight = dist * 2.5;

    if (weight !== Infinity) {
      graph[u].push({ to: v, road, weight });
      graph[v].push({ to: u, road, weight });
    }
  });

  const distances = { [startNodeId]: 0 };
  const previous = { [startNodeId]: null };
  const unvisited = new Set(Object.keys(graph));

  while (unvisited.size > 0) {
    let curr = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if ((distances[node] ?? Infinity) < minDist) {
        minDist = distances[node];
        curr = node;
      }
    }

    if (!curr || minDist === Infinity) break;
    unvisited.delete(curr);

    const neighbors = graph[curr] || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.to)) continue;
      const alt = distances[curr] + edge.weight;
      if (alt < (distances[edge.to] ?? Infinity)) {
        distances[edge.to] = alt;
        previous[edge.to] = { node: curr, road: edge.road };
      }
    }
  }

  const safeShelters = shelters.filter(s => (s.availableCapacity || 0) > 0 && s.safetyStatus !== "EVACUATE");
  const candidates = safeShelters.length > 0 ? safeShelters : shelters;
  if (!candidates || candidates.length === 0) return null;

  let bestShelter = null;
  let minCost = Infinity;

  candidates.forEach(s => {
    const cost = distances[s.id] ?? Infinity;
    if (cost < minCost) {
      minCost = cost;
      bestShelter = s;
    }
  });

  if (!bestShelter || minCost === Infinity) {
    bestShelter = candidates[0];
  }

  const pathNodes = [];
  const pathRoads = [];
  let curr = bestShelter.id;

  while (curr && curr !== startNodeId) {
    pathNodes.unshift(curr);
    const prevInfo = previous[curr];
    if (!prevInfo) break;
    pathRoads.unshift(prevInfo.road);
    curr = prevInfo.node;
  }
  pathNodes.unshift(startNodeId);

  const pathCoords = [];
  let actualDist = 0;

  pathRoads.forEach((road, i) => {
    actualDist += road.distance;
    const coords = road.coordinates || [];
    if (i === 0) {
      pathCoords.push(...coords);
    } else {
      pathCoords.push(...coords.slice(1));
    }
  });

  const blockedAvoided = roads.filter(r => r.status === "Blocked").length;
  const estTimeMins = Math.max(2, Math.round((actualDist / 35.0) * 60.0));

  const stepByStep = pathRoads.map((road, idx) => ({
    stepIndex: idx + 1,
    fromNode: pathNodes[idx],
    toNode: pathNodes[idx + 1],
    roadId: road.id,
    roadName: road.name,
    distanceKm: road.distance,
    status: road.status || "Open",
    instruction: `Proceed along ${road.name} (${road.id}) for ${road.distance} km`
  }));

  return {
    sourceNodeId: startNodeId,
    targetShelter: bestShelter,
    routeNodeIds: pathNodes,
    roadIds: pathRoads.map(r => r.id),
    pathCoordinates: pathCoords,
    totalDistanceKm: Math.round(actualDist * 100) / 100,
    estimatedTimeMinutes: estTimeMins,
    blockedRoadsAvoided: blockedAvoided,
    highRiskRoadsAvoided: 0,
    stepByStep: stepByStep,
    calculatedAt: new Date().toLocaleTimeString('en-US', { hour12: false })
  };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      system: "ARCOVA Disaster Intelligence System API",
      status: "ONLINE",
      version: "1.0.0"
    }));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        if (req.url === '/api/predict-risk') {
          const result = calculateZoneRisk(
            Number(payload.rainfall || 0),
            Number(payload.waterLevel || 0),
            Number(payload.elevation || 0),
            Number(payload.populationDensity || 0)
          );
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/evacuation-route') {
          const result = calculateDijkstraRoute(
            payload.startNodeId || "N_INCIDENT",
            payload.roads || [],
            payload.shelters || []
          );
          if (!result) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ detail: "No safe evacuation route found." }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Endpoint not found" }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON body", detail: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ARCOVA Backend API active on http://127.0.0.1:${PORT}`);
});
