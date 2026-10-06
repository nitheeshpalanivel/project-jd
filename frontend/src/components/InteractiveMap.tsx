import React, { useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  Marker, 
  Popup, 
  Tooltip, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zone, Road, ShelterFacility, EvacuationRoute } from '../types/disaster';
import { INCIDENT_LOCATION } from '../data/mockData';

// Fix standard Leaflet default icon paths if needed
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  zones: Zone[];
  roads: Road[];
  shelters: ShelterFacility[];
  evacuationRoute: EvacuationRoute | null;
  selectedZoneId?: string;
  onSelectZone?: (zone: Zone) => void;
  onSelectShelter?: (shelter: ShelterFacility) => void;
}

// Component to dynamically fit bounds when route or zone changes
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const InteractiveMap: React.FC<MapProps> = ({
  zones,
  roads,
  shelters,
  evacuationRoute,
  selectedZoneId,
  onSelectZone,
  onSelectShelter
}) => {
  const mapCenter: [number, number] = [12.9810, 77.5960];

  // Helper for Zone Polygon colors
  const getZoneStyle = (level: string, isSelected: boolean) => {
    switch (level) {
      case 'HIGH':
        return {
          fillColor: '#ef4444',
          fillOpacity: isSelected ? 0.65 : 0.45,
          color: '#f87171',
          weight: isSelected ? 4 : 2
        };
      case 'MEDIUM':
        return {
          fillColor: '#f59e0b',
          fillOpacity: isSelected ? 0.60 : 0.40,
          color: '#fbbf24',
          weight: isSelected ? 4 : 2
        };
      default:
        return {
          fillColor: '#10b981',
          fillOpacity: isSelected ? 0.50 : 0.30,
          color: '#34d399',
          weight: isSelected ? 4 : 1.5
        };
    }
  };

  // Helper for Road Polyline colors
  const getRoadStyle = (status: string) => {
    switch (status) {
      case 'Blocked':
        return { color: '#ef4444', weight: 5, dashArray: '8, 8', opacity: 0.9 };
      case 'High Risk':
        return { color: '#f59e0b', weight: 4, dashArray: '6, 6', opacity: 0.85 };
      default:
        return { color: '#10b981', weight: 3.5, opacity: 0.8 };
    }
  };

  // Custom Icon for User Incident Location
  const userLocationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-red-500/30 rounded-full animate-ping"></div>
        <div class="relative flex items-center justify-center w-7 h-7 bg-red-600 border-2 border-white rounded-full shadow-lg shadow-red-950">
          <span class="text-white text-[10px] font-black">HQ</span>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  // Custom Icon for Shelters & Facilities
  const createShelterIcon = (facility: ShelterFacility, isTarget: boolean) => {
    const isHospital = facility.type === 'Hospital';
    const isSafe = facility.safetyStatus === 'SAFE';

    const bgClass = isTarget
      ? 'bg-cyan-500 text-black border-2 border-white scale-110 shadow-cyan-500/50'
      : isSafe
      ? 'bg-emerald-600 text-white border-2 border-emerald-300'
      : 'bg-red-600 text-white border-2 border-red-300';

    const iconSymbol = isHospital ? '🏥' : facility.type === 'Emergency Center' ? '🚨' : '🛟';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative group cursor-pointer">
          <div class="flex items-center justify-center w-8 h-8 rounded-xl ${bgClass} shadow-md font-bold text-xs transition-all">
            ${iconSymbol}
          </div>
          ${isTarget ? `<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rotate-45"></div>` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-[#0b0f19]">
      
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={mapCenter} />

        {/* Dark CartoDB Map Tiles */}
        <TileLayer
          attribution='&copy; Google Maps'
          url={`https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=cb1_4buo_1_ef84259b41ac2b540aa5c5b7`}
          maxZoom={21}
        />

        {/* Risk Zones Polygons */}
        {zones.map(zone => {
          const isSelected = zone.id === selectedZoneId;
          const style = getZoneStyle(zone.riskLevel, isSelected);

          return (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={style}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(zone)
              }}
            >
              <Tooltip sticky direction="top" className="custom-tooltip">
                <div className="text-xs p-1 font-bold">
                  <div className="text-white">{zone.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-gray-300">Risk Score:</span>
                    <span className={`font-mono ${
                      zone.riskLevel === 'HIGH' ? 'text-red-400 font-black' :
                      zone.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {zone.riskScore}/100 ({zone.riskLevel})
                    </span>
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div className="p-2 space-y-2 text-xs min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-1.5">
                    <h4 className="font-extrabold text-white text-sm">{zone.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      zone.riskLevel === 'HIGH' ? 'bg-red-900 text-red-300' :
                      zone.riskLevel === 'MEDIUM' ? 'bg-amber-900 text-amber-300' :
                      'bg-emerald-900 text-emerald-300'
                    }`}>
                      {zone.riskLevel} RISK
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-gray-300 text-[11px]">
                    <div>🌧 Rainfall: <span className="font-bold text-white">{zone.rainfall} mm</span></div>
                    <div>🌊 Water Level: <span className="font-bold text-white">{zone.waterLevel} m</span></div>
                    <div>🏔 Elevation: <span className="font-bold text-white">{zone.elevation} m</span></div>
                    <div>👥 Population: <span className="font-bold text-white">{zone.population}</span></div>
                  </div>

                  <div className="bg-gray-900/80 p-2 rounded border border-gray-700 text-[10px] text-gray-300 leading-tight">
                    {zone.rationale}
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Roads Polylines */}
        {roads.map(road => {
          const style = getRoadStyle(road.status);
          return (
            <Polyline
              key={road.id}
              positions={road.coordinates}
              pathOptions={style}
            >
              <Tooltip sticky direction="center">
                <div className="text-[11px] font-semibold text-gray-200">
                  🛣 {road.name} ({road.id}) - <span className={
                    road.status === 'Blocked' ? 'text-red-400 font-bold' :
                    road.status === 'High Risk' ? 'text-amber-400 font-bold' : 'text-emerald-400'
                  }>{road.status.toUpperCase()}</span>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Dynamic Evacuation Route Polyline (Glow animation) */}
        {evacuationRoute && evacuationRoute.pathCoordinates.length > 0 && (
          <>
            {/* Outer Glow Line */}
            <Polyline
              positions={evacuationRoute.pathCoordinates}
              pathOptions={{
                color: '#06b6d4',
                weight: 9,
                opacity: 0.4
              }}
            />
            {/* Core Animated Dash Line */}
            <Polyline
              positions={evacuationRoute.pathCoordinates}
              pathOptions={{
                color: '#22d3ee',
                weight: 5,
                opacity: 1,
                className: 'route-animated'
              }}
            >
              <Popup>
                <div className="p-2 text-xs text-cyan-200 font-bold space-y-1">
                  <div className="text-white text-sm">🛟 Active Evacuation Corridor</div>
                  <div>Distance: {evacuationRoute.totalDistanceKm} km</div>
                  <div>Est. Travel Time: {evacuationRoute.estimatedTimeMinutes} mins</div>
                  <div>Avoided Blocked Roads: {evacuationRoute.blockedRoadsAvoided}</div>
                  <div>Destination: {evacuationRoute.targetShelter.name}</div>
                </div>
              </Popup>
            </Polyline>
          </>
        )}

        {/* Incident / User Origin Marker */}
        <Marker
          position={[INCIDENT_LOCATION.lat, INCIDENT_LOCATION.lng]}
          icon={userLocationIcon}
        >
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-bold text-red-400">🚨 INCIDENT COMMAND ORIGIN</span>
              <p className="text-gray-300 text-[11px] mt-0.5">{INCIDENT_LOCATION.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Shelters & Facilities Markers */}
        {shelters.map(shelter => {
          const isTarget = evacuationRoute?.targetShelter.id === shelter.id;
          const icon = createShelterIcon(shelter, isTarget);

          return (
            <Marker
              key={shelter.id}
              position={[shelter.lat, shelter.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectShelter && onSelectShelter(shelter)
              }}
            >
              <Popup>
                <div className="p-2 text-xs space-y-2 min-w-[210px]">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                    <span className="font-bold text-white">{shelter.name}</span>
                    {isTarget && (
                      <span className="bg-cyan-900 text-cyan-300 text-[9px] font-black px-1.5 py-0.5 rounded border border-cyan-700 uppercase">
                        TARGET DESTINATION
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-gray-300 text-[11px]">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-semibold text-white">{shelter.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupancy:</span>
                      <span className="font-mono text-white">
                        {shelter.currentOccupancy} / {shelter.totalCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Space:</span>
                      <span className="font-mono text-emerald-400 font-extrabold">
                        {shelter.availableCapacity} beds
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Safety Status:</span>
                      <span className={`font-bold ${
                        shelter.safetyStatus === 'SAFE' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {shelter.safetyStatus}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-1.5 rounded text-[10px] text-gray-400">
                    📍 {shelter.address}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[400] bg-[#0d1322]/90 backdrop-blur-md border border-gray-800 rounded-xl p-3 shadow-2xl text-[11px] space-y-1.5 max-w-[200px] pointer-events-auto">
        <div className="font-extrabold text-gray-200 uppercase tracking-wider text-[10px] border-b border-gray-800 pb-1 mb-1">
          Map Legend
        </div>

        <div className="grid grid-cols-1 gap-1 font-semibold text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-400"></span>
            <span>LOW RISK ZONE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400"></span>
            <span>MEDIUM RISK ZONE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500/60 border border-red-400"></span>
            <span>HIGH RISK ZONE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-red-500 border-t border-b border-dashed border-red-300"></span>
            <span>BLOCKED ROAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">🛟</span>
            <span>SAFE SHELTER</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">🏥</span>
            <span>EMERGENCY FACILITY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded bg-cyan-400 shadow-sm shadow-cyan-500"></span>
            <span className="text-cyan-300 font-bold">EVACUATION ROUTE</span>
          </div>
        </div>
      </div>

    </div>
  );
};
