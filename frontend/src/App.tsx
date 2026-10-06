import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { RiskMapView } from './pages/RiskMapView';
import { EvacuationView } from './pages/EvacuationView';
import { RiskEngineView } from './pages/RiskEngineView';
import { SheltersView } from './pages/SheltersView';
import { AlertsView } from './pages/AlertsView';
import { SimulationView } from './pages/SimulationView';

import { 
  Zone, 
  Road, 
  ShelterFacility, 
  AlertItem, 
  ScenarioPreset, 
  EvacuationRoute 
} from './types/disaster';
import { 
  INITIAL_ZONES, 
  INITIAL_ROADS, 
  INITIAL_SHELTERS, 
  INITIAL_ALERTS, 
  INCIDENT_LOCATION 
} from './data/mockData';
import { applyScenarioPreset } from './engine/simulationEngine';
import { calculateDynamicEvacuationRoute } from './engine/routingEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentPreset, setCurrentPreset] = useState<ScenarioPreset>('FLOOD_WARNING');
  
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [roads, setRoads] = useState<Road[]>(INITIAL_ROADS);
  const [shelters, setShelters] = useState<ShelterFacility[]>(INITIAL_SHELTERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [evacuationRoute, setEvacuationRoute] = useState<EvacuationRoute | null>(null);
  
  const [isAutopilotRunning, setIsAutopilotRunning] = useState<boolean>(false);
  const [stepDescription, setStepDescription] = useState<string>('Flood Warning preset active.');

  // Helper to apply preset scenario
  const handleSelectPreset = (preset: ScenarioPreset) => {
    setCurrentPreset(preset);
    const result = applyScenarioPreset(preset, zones, roads, shelters, alerts);
    setZones(result.zones);
    setRoads(result.roads);
    setShelters(result.shelters);
    setAlerts(result.alerts);
    setEvacuationRoute(result.currentEvacuationRoute);
    setStepDescription(result.stepDescription);
  };

  // Force recalculate evacuation route
  const handleRecalculateRoute = () => {
    const route = calculateDynamicEvacuationRoute(
      INCIDENT_LOCATION.nodeId,
      roads,
      shelters
    );
    setEvacuationRoute(route);
  };

  // Initial calculation on mount
  useEffect(() => {
    handleSelectPreset('FLOOD_WARNING');
  }, []);

  // Autopilot Demo Runner for Judges
  const handleRunAutopilotDemo = async () => {
    if (isAutopilotRunning) return;
    setIsAutopilotRunning(true);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      // Step 1: Normal Conditions
      setActiveTab('dashboard');
      handleSelectPreset('NORMAL');
      setStepDescription('DEMO STEP 1/5: Normal baseline conditions loaded.');
      await delay(2500);

      // Step 2: Heavy Rainfall
      handleSelectPreset('HEAVY_RAINFALL');
      setStepDescription('DEMO STEP 2/5: Heavy rainfall initiated. Runoff saturating Zone A.');
      await delay(2500);

      // Step 3: Flood Warning (Zone A High Risk & Road R3 Blocked)
      handleSelectPreset('FLOOD_WARNING');
      setStepDescription('DEMO STEP 3/5: Flood threshold crossed! Zone A score = 82 (HIGH). Road R3 flooded & blocked!');
      await delay(3000);

      // Step 4: Switch to Evacuation Tab
      setActiveTab('evacuation');
      setStepDescription('DEMO STEP 4/5: Graph Dijkstra algorithm automatically pruned Road R3 and routed to Shelter S2.');
      await delay(3500);

      // Step 5: Return to Dashboard
      setActiveTab('dashboard');
      setStepDescription('DEMO COMPLETE: Command dashboard updated with live route & explainable AI attribution.');
    } finally {
      setIsAutopilotRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-gray-100 flex flex-col font-sans">
      
      {/* Command Header */}
      <Navbar
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onRunAutopilotDemo={handleRunAutopilotDemo}
        isAutopilotRunning={isAutopilotRunning}
      />

      {/* Main Content Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={alerts.filter(a => a.severity === 'CRITICAL').length}
        />

        {/* View Page Container */}
        <main className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh-65px)]">
          {activeTab === 'dashboard' && (
            <DashboardView
              zones={zones}
              roads={roads}
              shelters={shelters}
              evacuationRoute={evacuationRoute}
              alerts={alerts}
              onSelectZone={zone => {
                setActiveTab('risk-map');
              }}
              onSelectShelter={shelter => {
                setActiveTab('shelters');
              }}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'risk-map' && (
            <RiskMapView
              zones={zones}
              roads={roads}
              shelters={shelters}
              evacuationRoute={evacuationRoute}
            />
          )}

          {activeTab === 'evacuation' && (
            <EvacuationView
              roads={roads}
              shelters={shelters}
              evacuationRoute={evacuationRoute}
              onRecalculateRoute={handleRecalculateRoute}
            />
          )}

          {activeTab === 'risk-engine' && (
            <RiskEngineView />
          )}

          {activeTab === 'shelters' && (
            <SheltersView
              shelters={shelters}
              targetShelterId={evacuationRoute?.targetShelter.id}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onClearAlerts={() => setAlerts([])}
            />
          )}

          {activeTab === 'simulation' && (
            <SimulationView
              currentPreset={currentPreset}
              onSelectPreset={handleSelectPreset}
              onRunAutopilotDemo={handleRunAutopilotDemo}
              isAutopilotRunning={isAutopilotRunning}
              stepDescription={stepDescription}
            />
          )}
        </main>

      </div>

    </div>
  );
};

export default App;
