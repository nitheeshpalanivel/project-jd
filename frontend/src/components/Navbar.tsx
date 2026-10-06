import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Play, 
  CloudRain, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  RotateCcw, 
  Clock
} from 'lucide-react';
import { ScenarioPreset } from '../types/disaster';

interface NavbarProps {
  currentPreset: ScenarioPreset;
  onSelectPreset: (preset: ScenarioPreset) => void;
  onRunAutopilotDemo: () => void;
  isAutopilotRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  onSelectPreset,
  onRunAutopilotDemo,
  isAutopilotRunning
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1322]/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-0.5 shadow-lg shadow-red-900/30">
            <div className="flex items-center justify-center w-full h-full bg-[#0b0f19] rounded-[10px]">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wide text-white uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                ARCOVA
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 uppercase tracking-widest">
                Disaster Intelligence
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              AI-Based Urban Disaster Risk Prediction & Dynamic Evacuation Command
            </p>
          </div>
        </div>

        {/* Center: Quick Scenario Switcher */}
        <div className="hidden lg:flex items-center gap-1.5 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => onSelectPreset('NORMAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPreset === 'NORMAL'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Normal
          </button>

          <button
            onClick={() => onSelectPreset('HEAVY_RAINFALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPreset === 'HEAVY_RAINFALL'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            Heavy Rain
          </button>

          <button
            onClick={() => onSelectPreset('FLOOD_WARNING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPreset === 'FLOOD_WARNING'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Flood Warning
          </button>

          <button
            onClick={() => onSelectPreset('SEVERE_FLOOD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPreset === 'SEVERE_FLOOD'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Severe Flood
          </button>
        </div>

        {/* Right: Autopilot Demo & Live Clock */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={onRunAutopilotDemo}
            disabled={isAutopilotRunning}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
              isAutopilotRunning
                ? 'bg-purple-900/60 border border-purple-500 text-purple-200 cursor-wait'
                : 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 shadow-red-950/50 hover:shadow-purple-900/50 border border-purple-400/40 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isAutopilotRunning ? 'animate-spin' : ''}`} />
            <span>{isAutopilotRunning ? 'RUNNING DEMO MODE...' : '⚡ RUN DEMO FOR JUDGES'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-900/90 rounded-lg border border-gray-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 uppercase text-[10px] tracking-wider">EOC ONLINE</span>
            <span className="text-gray-600">|</span>
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono text-gray-300">{timeString}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
