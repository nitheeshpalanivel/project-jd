import React from 'react';
import { Road, ShelterFacility, EvacuationRoute } from '../types/disaster';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Building2, 
  Clock, 
  Milestone, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon 
} from 'lucide-react';

interface EvacuationViewProps {
  roads: Road[];
  shelters: ShelterFacility[];
  evacuationRoute: EvacuationRoute | null;
  onRecalculateRoute: () => void;
}

export const EvacuationView: React.FC<EvacuationViewProps> = ({
  roads,
  shelters,
  evacuationRoute,
  onRecalculateRoute
}) => {
  const openRoads = roads.filter(r => r.status === 'Open');
  const highRiskRoads = roads.filter(r => r.status === 'High Risk');
  const blockedRoads = roads.filter(r => r.status === 'Blocked');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Dynamic Evacuation Routing System</span>
          </h2>
          <p className="text-xs text-gray-400">
            Graph-based Dijkstra shortest path algorithm with dynamic blocked-road pruning & high-risk corridor penalties.
          </p>
        </div>

        <button
          onClick={onRecalculateRoute}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>FORCE RECALCULATE ROUTE</span>
        </button>
      </div>

      {/* Top Metrics Banner */}
      {evacuationRoute ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          <div className="bg-gradient-to-br from-cyan-950/80 to-gray-900 border border-cyan-800/60 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Destination Shelter
            </span>
            <h3 className="text-sm font-extrabold text-white truncate">
              {evacuationRoute.targetShelter.name}
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono font-bold block mt-0.5">
              Available: {evacuationRoute.targetShelter.availableCapacity} beds
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Route Distance
            </span>
            <h3 className="text-xl font-black text-white font-mono">
              {evacuationRoute.totalDistanceKm} <span className="text-xs font-normal text-gray-400">km</span>
            </h3>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Optimal Dijkstra path
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Estimated Travel Time
            </span>
            <h3 className="text-xl font-black text-cyan-300 font-mono">
              ~{evacuationRoute.estimatedTimeMinutes} <span className="text-xs font-normal text-gray-400">mins</span>
            </h3>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Avg emergency transit speed
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Blocked Roads Avoided
            </span>
            <h3 className="text-xl font-black text-amber-400 font-mono">
              {evacuationRoute.blockedRoadsAvoided}
            </h3>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Automatically pruned
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Routing Engine Status
            </span>
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              SAFE PATH COMPUTED
            </h3>
            <span className="text-[10px] text-gray-500 font-mono block mt-1">
              Updated: {evacuationRoute.calculatedAt}
            </span>
          </div>

        </div>
      ) : null}

      {/* Main Grid: Step-by-Step Directions & Road Graph Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Step-by-Step Directions Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
              <Milestone className="w-4 h-4 text-cyan-400" />
              Step-by-Step Evacuation Navigation Path
            </h3>

            {/* Origin Node */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/40 border border-red-900/60">
              <div className="p-2 rounded-lg bg-red-600 text-white font-bold text-xs shrink-0 mt-0.5">
                ORIGIN
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block">
                  CURRENT LOCATION (Incident Origin - Zone A Downtown Command)
                </span>
                <span className="text-[11px] text-red-300">
                  Coordinates: Lat 12.9725, Lng 77.5880 | High risk evacuation origin
                </span>
              </div>
            </div>

            {/* Path Steps */}
            {evacuationRoute?.stepByStep.map((step, idx) => (
              <div key={idx} className="relative pl-6 space-y-1 border-l-2 border-cyan-500/60 ml-4 pb-4 last:pb-0">
                
                {/* Node Point */}
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-cyan-500 border-2 border-gray-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-cyan-300">Step {step.stepIndex}: {step.roadName} ({step.roadId})</span>
                    <span className="text-gray-400 font-mono">{step.distanceKm} km</span>
                  </div>

                  <p className="text-xs text-gray-300">
                    {step.instruction}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      step.status === 'Open' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      step.status === 'High Risk' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      Road Status: {step.status}
                    </span>
                  </div>
                </div>

              </div>
            ))}

            {/* Destination Shelter Node */}
            {evacuationRoute && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-950/60 border border-cyan-700">
                <div className="p-2 rounded-lg bg-cyan-500 text-black font-extrabold text-xs shrink-0 mt-0.5">
                  DESTINATION
                </div>
                <div>
                  <span className="text-xs font-extrabold text-white block">
                    SAFE SHELTER: {evacuationRoute.targetShelter.name}
                  </span>
                  <span className="text-[11px] text-cyan-300 block">
                    📍 {evacuationRoute.targetShelter.address} | Phone: {evacuationRoute.targetShelter.contactPhone}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold block mt-0.5">
                    Capacity Status: SAFE | {evacuationRoute.targetShelter.availableCapacity} available spaces
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Road Graph Status Registry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                Urban Road Graph Status Registry
              </h3>
              <span className="text-[10px] font-mono text-gray-400">Total Roads: {roads.length}</span>
            </div>

            <div className="space-y-2">
              {roads.map(road => {
                const isUsedInCurrentRoute = evacuationRoute?.roadIds.includes(road.id);

                return (
                  <div
                    key={road.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      road.status === 'Blocked' ? 'bg-red-950/30 border-red-900/60 text-red-200' :
                      road.status === 'High Risk' ? 'bg-amber-950/30 border-amber-900/60 text-amber-200' :
                      'bg-gray-950 border-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{road.id} - {road.name}</span>
                        {isUsedInCurrentRoute && (
                          <span className="bg-cyan-950 text-cyan-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-800 uppercase">
                            ON ACTIVE ROUTE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Connects {road.startNode} ↔ {road.endNode} | Dist: {road.distance} km
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      road.status === 'Blocked' ? 'bg-red-900 text-white border border-red-700' :
                      road.status === 'High Risk' ? 'bg-amber-900 text-amber-200 border border-amber-700' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {road.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
