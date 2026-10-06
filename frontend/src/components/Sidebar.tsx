import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Navigation, 
  BrainCircuit, 
  Building2, 
  Bell, 
  Sliders, 
  Zap,
  ChevronRight
} from 'lucide-react';

export type TabType = 'dashboard' | 'risk-map' | 'evacuation' | 'risk-engine' | 'shelters' | 'alerts' | 'simulation';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, alertCount }) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Command Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'System overview & KPIs'
    },
    {
      id: 'risk-map' as TabType,
      label: 'Interactive Risk Map',
      icon: Map,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      description: 'Spatial risk & road status'
    },
    {
      id: 'evacuation' as TabType,
      label: 'Dynamic Evacuation',
      icon: Navigation,
      badge: 'AUTO',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800',
      description: 'Dijkstra route recalculation'
    },
    {
      id: 'risk-engine' as TabType,
      label: 'AI Risk Engine & XAI',
      icon: BrainCircuit,
      badge: 'AI',
      badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
      description: 'Explainable AI scoring'
    },
    {
      id: 'shelters' as TabType,
      label: 'Shelters & Facilities',
      icon: Building2,
      badge: null,
      description: 'Capacity & safety status'
    },
    {
      id: 'alerts' as TabType,
      label: 'Alert Command Log',
      icon: Bell,
      badge: alertCount > 0 ? `${alertCount}` : null,
      badgeColor: 'bg-red-950 text-red-400 border-red-800 animate-pulse',
      description: 'Live hazard notifications'
    },
    {
      id: 'simulation' as TabType,
      label: 'Disaster Simulator',
      icon: Sliders,
      badge: 'DEMO',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
      description: 'Scenario test environment'
    }
  ];

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-gray-800/80 flex flex-col shrink-0 min-h-[calc(100vh-65px)] select-none">
      
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-800/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Navigation Menu</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-gray-800/90 to-gray-900 border border-gray-700/80 text-white shadow-lg shadow-black/40'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-900/60 text-gray-400 group-hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                      item.badgeColor || 'bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-red-400 translate-x-0.5' : 'text-gray-600 group-hover:text-gray-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 m-3 rounded-xl bg-gray-900/80 border border-gray-800/80 text-[11px] text-gray-400">
        <div className="flex items-center justify-between font-semibold text-gray-300 mb-1">
          <span>Hackathon Build</span>
          <span className="text-[10px] text-emerald-400 font-mono">v1.0.0</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-tight">
          Deterministic Dijkstra Routing & Explainable AI Disaster Assessment Engine
        </p>
      </div>

    </aside>
  );
};
