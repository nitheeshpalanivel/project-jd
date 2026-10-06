import React from 'react';
import { 
  Zone, 
  Road, 
  ShelterFacility, 
  EvacuationRoute, 
  AlertItem 
} from '../types/disaster';
import { KpiCard } from '../components/KpiCard';
import { ExplainableRiskCard } from '../components/ExplainableRiskCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Building2, 
  Users, 
  Navigation, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Bell 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend 
} from 'recharts';

interface DashboardProps {
  zones: Zone[];
  roads: Road[];
  shelters: ShelterFacility[];
  evacuationRoute: EvacuationRoute | null;
  alerts: AlertItem[];
  onSelectZone: (zone: Zone) => void;
  onSelectShelter: (shelter: ShelterFacility) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  zones,
  roads,
  shelters,
  evacuationRoute,
  alerts,
  onSelectZone,
  onSelectShelter,
  onNavigateToTab
}) => {
  // Calculations for KPIs
  const highRiskZones = zones.filter(z => z.riskLevel === 'HIGH');
  const mediumRiskZones = zones.filter(z => z.riskLevel === 'MEDIUM');
  const blockedRoads = roads.filter(r => r.status === 'Blocked');
  
  const safeShelters = shelters.filter(s => s.safetyStatus === 'SAFE');
  const totalAvailableBedCapacity = safeShelters.reduce((acc, s) => acc + s.availableCapacity, 0);
  
  const peopleAtRisk = zones
    .filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'MEDIUM')
    .reduce((acc, z) => acc + z.population, 0);

  const highestRiskZone = [...zones].sort((a, b) => b.riskScore - a.riskScore)[0];

  // Data formatting for Recharts
  const zoneRiskChartData = zones.map(z => ({
    name: z.name.split(' ')[0] + ' ' + (z.name.split(' ')[1] || ''),
    score: z.riskScore,
    level: z.riskLevel,
    rainfall: z.rainfall,
    waterLevel: z.waterLevel
  }));

  const shelterCapacityChartData = shelters.map(s => ({
    name: s.id + ' - ' + s.name.split(' ')[2],
    Occupied: s.currentOccupancy,
    Available: s.availableCapacity
  }));

  const populationChartData = zones.map(z => ({
    name: z.id.toUpperCase(),
    Population: z.population,
    riskLevel: z.riskLevel
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <span>Emergency Command Dashboard</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
              SECTOR 7 EOC
            </span>
          </h2>
          <p className="text-xs text-gray-400">
            Real-time urban risk prediction, explainable AI analytics & dynamic route optimization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('evacuation')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition-colors shadow-lg shadow-cyan-950/40"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View Dynamic Evacuation</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Overall Risk */}
        <KpiCard
          title="Overall Urban Risk"
          value={highestRiskZone ? `${highestRiskZone.riskLevel}` : 'LOW'}
          subtitle={`Highest: ${highestRiskZone?.riskScore || 0}/100 (${highestRiskZone?.id.toUpperCase()})`}
          icon={ShieldAlert}
          iconBgColor={highestRiskZone?.riskLevel === 'HIGH' ? 'bg-red-950' : highestRiskZone?.riskLevel === 'MEDIUM' ? 'bg-amber-950' : 'bg-emerald-950'}
          iconTextColor={highestRiskZone?.riskLevel === 'HIGH' ? 'text-red-400' : highestRiskZone?.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}
          badgeText={highestRiskZone?.riskLevel || 'LOW'}
          badgeColor={highestRiskZone?.riskLevel === 'HIGH' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'}
          borderHoverColor="hover:border-red-700"
        />

        {/* KPI 2: High Risk Zones */}
        <KpiCard
          title="High Risk Zones"
          value={highRiskZones.length}
          subtitle={`${mediumRiskZones.length} Medium Risk Zones`}
          icon={AlertOctagon}
          iconBgColor="bg-red-950/80"
          iconTextColor="text-red-400"
          badgeText={highRiskZones.length > 0 ? 'CRITICAL' : 'CLEAR'}
          badgeColor={highRiskZones.length > 0 ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'}
          borderHoverColor="hover:border-red-700"
        />

        {/* KPI 3: Blocked Roads */}
        <KpiCard
          title="Blocked Roads"
          value={blockedRoads.length}
          subtitle={blockedRoads.length > 0 ? `Avoided in routing graph` : 'All corridors passable'}
          icon={AlertTriangle}
          iconBgColor="bg-amber-950/80"
          iconTextColor="text-amber-400"
          badgeText={blockedRoads.length > 0 ? 'ROUTING AUTO-UPDATED' : 'PASSABLE'}
          badgeColor={blockedRoads.length > 0 ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'}
          borderHoverColor="hover:border-amber-700"
        />

        {/* KPI 4: Available Shelters */}
        <KpiCard
          title="Available Shelters"
          value={`${safeShelters.length} / ${shelters.length}`}
          subtitle={`${totalAvailableBedCapacity.toLocaleString()} Bed Spaces Open`}
          icon={Building2}
          iconBgColor="bg-emerald-950/80"
          iconTextColor="text-emerald-400"
          badgeText="SAFE STATUS"
          badgeColor="bg-emerald-950 text-emerald-400 border-emerald-800"
          borderHoverColor="hover:border-emerald-700"
        />

        {/* KPI 5: People at Risk */}
        <KpiCard
          title="People at Risk"
          value={peopleAtRisk.toLocaleString()}
          subtitle="In High & Medium Risk Zones"
          icon={Users}
          iconBgColor="bg-purple-950/80"
          iconTextColor="text-purple-400"
          badgeText="EXPOSED POPULATION"
          badgeColor="bg-purple-950 text-purple-300 border-purple-800"
          borderHoverColor="hover:border-purple-700"
        />

      </div>

      {/* Main Grid: Interactive Map & Explainable AI Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Tactical Risk Map & Corridors
            </h3>
            <button
              onClick={() => onNavigateToTab('risk-map')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Expand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <InteractiveMap
              zones={zones}
              roads={roads}
              shelters={shelters}
              evacuationRoute={evacuationRoute}
              onSelectZone={onSelectZone}
              onSelectShelter={onSelectShelter}
            />
          </div>
        </div>

        {/* Right Column: Explainable AI Risk Card & Route Recommendation */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Explainable AI Component */}
          {highestRiskZone && (
            <ExplainableRiskCard
              zone={highestRiskZone}
              targetShelterName={evacuationRoute?.targetShelter.name || 'Shelter S2'}
              blockedRoadName={blockedRoads[0]?.name || 'Road R3'}
            />
          )}

          {/* Current Evacuation Recommendation Card */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Recommended Evacuation Plan
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  GRAPH DIJKSTRA
                </span>
              </div>

              {evacuationRoute ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">DESTINATION SHELTER</span>
                      <span className="font-bold text-white text-xs block truncate">
                        {evacuationRoute.targetShelter.name}
                      </span>
                    </div>
                    <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">ESTIMATED TIME</span>
                      <span className="font-bold text-cyan-300 text-xs block font-mono">
                        {evacuationRoute.estimatedTimeMinutes} Mins ({evacuationRoute.totalDistanceKm} km)
                      </span>
                    </div>
                  </div>

                  {/* Route Steps Preview */}
                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Path Corridor:
                    </span>
                    <div className="flex items-center flex-wrap gap-1 text-[11px] font-mono text-gray-300">
                      <span className="px-2 py-0.5 bg-red-950 text-red-300 rounded border border-red-800 font-bold">
                        ORIGIN (Zone A)
                      </span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      {evacuationRoute.stepByStep.map((step, i) => (
                        <React.Fragment key={i}>
                          <span className="px-1.5 py-0.5 bg-gray-900 text-gray-200 rounded border border-gray-700">
                            {step.roadName} ({step.roadId})
                          </span>
                          <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                        </React.Fragment>
                      ))}
                      <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-700 font-bold">
                        {evacuationRoute.targetShelter.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Blocked Roads Avoided: <strong className="text-amber-400 font-mono">{evacuationRoute.blockedRoadsAvoided}</strong></span>
                    <span>Shelter Bed Space: <strong className="text-emerald-400 font-mono">{evacuationRoute.targetShelter.availableCapacity}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-4 text-center">
                  Calculating safe evacuation trajectory...
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateToTab('evacuation')}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-700 text-xs font-bold text-cyan-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>Inspect Step-by-Step Directions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Analytics & Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Risk Scores Chart */}
        <div className="lg:col-span-4 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Zone Risk Distribution
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneRiskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#f3f4f6', fontSize: '11px' }}
                />
                <Bar dataKey="score" name="Risk Score">
                  {zoneRiskChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.level === 'HIGH' ? '#ef4444' :
                        entry.level === 'MEDIUM' ? '#f59e0b' : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shelter Capacity Chart */}
        <div className="lg:col-span-4 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Shelter Capacity & Occupancy
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelterCapacityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Occupied" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Available" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts Panel */}
        <div className="lg:col-span-4 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-400 animate-pulse" />
                Live Command Alerts Feed
              </h4>
              <button
                onClick={() => onNavigateToTab('alerts')}
                className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider font-bold"
              >
                View Log ({alerts.length})
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {alerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                    alert.severity === 'CRITICAL' ? 'bg-red-950/40 border-red-900/80 text-red-200' :
                    alert.severity === 'WARNING' ? 'bg-amber-950/40 border-amber-900/80 text-amber-200' :
                    'bg-gray-950/80 border-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="truncate">{alert.title}</span>
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">{alert.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('alerts')}
            className="w-full mt-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-colors"
          >
            Open Full Command Log
          </button>
        </div>

      </div>

    </div>
  );
};
