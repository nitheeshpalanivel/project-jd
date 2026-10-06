import React, { useState } from 'react';
import { Zone, Road, ShelterFacility, EvacuationRoute } from '../types/disaster';
import { InteractiveMap } from '../components/InteractiveMap';
import { ExplainableRiskCard } from '../components/ExplainableRiskCard';
import { Map, Layers, Filter, CloudRain, Waves, Mountain, Users, X, Info } from 'lucide-react';

interface RiskMapViewProps {
  zones: Zone[];
  roads: Road[];
  shelters: ShelterFacility[];
  evacuationRoute: EvacuationRoute | null;
}

export const RiskMapView: React.FC<RiskMapViewProps> = ({
  zones,
  roads,
  shelters,
  evacuationRoute
}) => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0]);
  const [selectedShelter, setSelectedShelter] = useState<ShelterFacility | null>(null);

  return (
    <div className="space-y-4 pb-10">
      
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-400" />
            <span>Interactive Urban Risk Map</span>
          </h2>
          <p className="text-xs text-gray-400">
            Click any zone, road, or shelter marker to inspect hydrological parameters and dynamic route status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800">
          <span>Active Layers:</span>
          <span className="text-emerald-400 font-bold">Zones</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">Roads</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">Evacuation Polyline</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Map Column */}
        <div className="lg:col-span-8 h-[650px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <InteractiveMap
            zones={zones}
            roads={roads}
            shelters={shelters}
            evacuationRoute={evacuationRoute}
            selectedZoneId={selectedZone?.id}
            onSelectZone={zone => {
              setSelectedZone(zone);
              setSelectedShelter(null);
            }}
            onSelectShelter={shelter => {
              setSelectedShelter(shelter);
            }}
          />
        </div>

        {/* Inspector Side Panel */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto max-h-[650px] pr-1">
          
          {/* Selected Zone Inspector */}
          {selectedZone ? (
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3 relative">
                
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div>
                    <h3 className="text-base font-extrabold text-white">{selectedZone.name}</h3>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">ID: {selectedZone.id}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                    selectedZone.riskLevel === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-800' :
                    selectedZone.riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {selectedZone.riskLevel} RISK
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Rainfall</span>
                      <span className="font-bold text-white text-xs">{selectedZone.rainfall} mm</span>
                    </div>
                  </div>

                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 flex items-center gap-2">
                    <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Water Level</span>
                      <span className="font-bold text-white text-xs">{selectedZone.waterLevel} m</span>
                    </div>
                  </div>

                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Elevation</span>
                      <span className="font-bold text-white text-xs">{selectedZone.elevation} m</span>
                    </div>
                  </div>

                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Population</span>
                      <span className="font-bold text-white text-xs">{selectedZone.population.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 text-xs text-gray-300 leading-relaxed">
                  <span className="font-bold text-gray-200 block mb-1">Risk Assessment Rationale:</span>
                  {selectedZone.rationale}
                </div>

              </div>

              {/* Explainable AI breakdown for selected zone */}
              <ExplainableRiskCard
                zone={selectedZone}
                targetShelterName={evacuationRoute?.targetShelter.name}
              />
            </div>
          ) : selectedShelter ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedShelter.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">{selectedShelter.type}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {selectedShelter.safetyStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span>Capacity:</span>
                  <span className="font-mono text-white font-bold">{selectedShelter.currentOccupancy} / {selectedShelter.totalCapacity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span>Available Beds:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedShelter.availableCapacity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span>Contact Emergency:</span>
                  <span className="font-mono text-cyan-300">{selectedShelter.contactPhone}</span>
                </div>
              </div>

              <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-xs">
                <span className="font-bold text-gray-300 block mb-1">Amenities & Services:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedShelter.amenities.map((item, idx) => (
                    <span key={idx} className="bg-gray-900 text-gray-300 px-2 py-0.5 rounded text-[10px] border border-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400 text-xs">
              <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              Select a zone or shelter on the map to inspect properties.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
