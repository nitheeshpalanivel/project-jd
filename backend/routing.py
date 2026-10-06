import heapq
from typing import List, Dict, Any, Optional
from datetime import datetime

def calculate_dijkstra_evacuation_route(
    start_node_id: str,
    roads: List[Dict[str, Any]],
    shelters: List[Dict[str, Any]]
) -> Optional[Dict[str, Any]]:
    """
    Graph-based Dijkstra algorithm for dynamic route optimization avoiding blocked roads.
    """
    # 1. Build adjacency list
    graph: Dict[str, List[Dict[str, Any]]] = {}

    for road in roads:
        u = road["startNode"]
        v = road["endNode"]

        if u not in graph: graph[u] = []
        if v not in graph: graph[v] = []

        status = road.get("status", "Open")
        dist = road.get("distance", 1.0)

        if status == "Blocked":
            weight = float("inf")
        elif status == "High Risk":
            weight = dist * 2.5
        else:
            weight = dist

        if weight != float("inf"):
            graph[u].append({"to": v, "road": road, "weight": weight})
            graph[v].append({"to": u, "road": road, "weight": weight})

    # 2. Priority queue Dijkstra
    distances: Dict[str, float] = {start_node_id: 0.0}
    previous: Dict[str, Optional[Dict[str, Any]]] = {start_node_id: None}
    pq = [(0.0, start_node_id)]

    visited = set()

    while pq:
        d, curr = heapq.heappop(pq)

        if curr in visited: continue
        visited.add(curr)

        for edge in graph.get(curr, []):
            nxt = edge["to"]
            weight = edge["weight"]
            if d + weight < distances.get(nxt, float("inf")):
                distances[nxt] = d + weight
                previous[nxt] = {"node": curr, "road": edge["road"]}
                heapq.heappush(pq, (distances[nxt], nxt))

    # 3. Find candidate shelter
    safe_shelters = [
        s for s in shelters 
        if s.get("availableCapacity", 0) > 0 and s.get("safetyStatus") != "EVACUATE"
    ]

    candidate_shelters = safe_shelters if safe_shelters else shelters
    if not candidate_shelters: return None

    best_shelter = None
    min_cost = float("inf")

    for shelter in candidate_shelters:
        s_id = shelter["id"]
        c = distances.get(s_id, float("inf"))
        if c < min_cost:
            min_cost = c
            best_shelter = shelter

    if not best_shelter or min_cost == float("inf"):
        best_shelter = candidate_shelters[0]

    # 4. Reconstruct path
    path_nodes = []
    path_roads = []
    curr = best_shelter["id"]

    while curr and curr != start_node_id:
        path_nodes.insert(0, curr)
        prev_info = previous.get(curr)
        if not prev_info: break
        path_roads.insert(0, prev_info["road"])
        curr = prev_info["node"]

    path_nodes.insert(0, start_node_id)

    path_coords = []
    actual_dist = 0.0

    for i, road in enumerate(path_roads):
        actual_dist += road["distance"]
        coords = road.get("coordinates", [])
        if i == 0:
            path_coords.extend(coords)
        else:
            path_coords.extend(coords[1:])

    blocked_avoided = sum(1 for r in roads if r.get("status") == "Blocked")
    est_time_mins = max(2, int((actual_dist / 35.0) * 60.0))

    step_by_step = [
        {
            "stepIndex": idx + 1,
            "fromNode": path_nodes[idx],
            "toNode": path_nodes[idx + 1],
            "roadId": road["id"],
            "roadName": road["name"],
            "distanceKm": road["distance"],
            "status": road.get("status", "Open"),
            "instruction": f"Proceed along {road['name']} ({road['id']}) for {road['distance']} km"
        }
        for idx, road in enumerate(path_roads)
    ]

    return {
        "sourceNodeId": start_node_id,
        "targetShelter": best_shelter,
        "routeNodeIds": path_nodes,
        "roadIds": [r["id"] for r in path_roads],
        "pathCoordinates": path_coords,
        "totalDistanceKm": round(actual_dist, 2),
        "estimatedTimeMinutes": est_time_mins,
        "blockedRoadsAvoided": blocked_avoided,
        "highRiskRoadsAvoided": 0,
        "stepByStep": step_by_step,
        "calculatedAt": datetime.now().strftime("%H:%M:%S")
    }
