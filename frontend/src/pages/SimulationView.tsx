import React from 'react';
import { ScenarioPreset } from '../types/disaster';
import { Sliders, Play, CheckCircle2, CloudRain, AlertTriangle, Flame, Sparkles, ArrowRight, Activity } from 'lucide-react';

interface SimulationViewProps {
  currentPreset: ScenarioPreset;
  onSelectPreset: (preset: ScenarioPreset) => void;
  onRunAutopilotDemo: () => void;
  isAutopilotRunning: boolean;
  stepDescription: string;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  currentPreset,
  onSelectPreset,
  onRunAutopilotDemo,
  isAutopilotRunning,
  stepDescription
}) => {
  const demoSteps = [
    { num: 1, title: 'Normal Baseline Conditions', desc: 'Rainfall 15mm, all risk scores LOW, all corridors open.' },
    { num: 2, title: 'Precipitation Surge', desc: 'Rainfall reaches 120mm with water level 2.8m in Zone A.' },
    { num: 3, title: 'AI Risk Recalculation', desc: 'Zone A risk score calculated at 82/100 -> HIGH RISK threshold crossed.' },
    { num: 4, title: 'Road Blockage Event', desc: 'Central Bridge Way (R3) flooded & marked IMPASSABLE.' },
    { num: 5, title: 'Dynamic Dijkstra Rerouting', desc: 'Algorithm removes R3 & penalizes R5, calculating safest path to Shelter S2.' },
    { num: 6, title: 'Command Center Alerting', desc: 'Critical alert dispatched to command dashboard & visual route highlighted.' }
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Disaster Scenario Simulator & Presentation Mode</span>
          </h2>
          <p className="text-xs text-gray-400">
            Simulate dynamic hydrological changes to test automated risk prediction, road blockages, and route optimization.
          </p>
        </div>

        <button
          onClick={onRunAutopilotDemo}
          disabled={isAutopilotRunning}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-xl transition-all ${isAutopilotRunning
              ? 'bg-purple-900 border border-purple-500 text-purple-200 cursor-wait'
              : 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white shadow-purple-950/50 hover:scale-[1.02] active:scale-95'
            }`}
        >
          <Play className={`w-4 h-4 fill-current ${isAutopilotRunning ? 'animate-spin' : ''}`} />
          <span>{isAutopilotRunning ? 'RUNNING AUTOMATED DEMO MODE...' : '⚡ RUN DISASTER SIMULATION DEMO FOR JUDGES'}</span>
        </button>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Normal */}
        <div
          onClick={() => onSelectPreset('NORMAL')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 space-y-3 ${currentPreset === 'NORMAL'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500'
              : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {currentPreset === 'NORMAL' && (
              <span className="text-[9px] font-black bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 uppercase">
                ACTIVE PRESET
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Normal Conditions</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Low rainfall (15mm), clear waterways, all roads open.
            </p>
          </div>
        </div>

        {/* Heavy Rain */}
        <div
          onClick={() => onSelectPreset('HEAVY_RAINFALL')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 space-y-3 ${currentPreset === 'HEAVY_RAINFALL'
              ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-950/30 ring-1 ring-blue-500'
              : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              <CloudRain className="w-5 h-5" />
            </div>
            {currentPreset === 'HEAVY_RAINFALL' && (
              <span className="text-[9px] font-black bg-blue-900 text-blue-300 px-2 py-0.5 rounded border border-blue-700 uppercase">
                ACTIVE PRESET
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Heavy Rainfall</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Rainfall 75mm, rising water table, Zone A MEDIUM risk.
            </p>
          </div>
        </div>

        {/* Flood Warning */}
        <div
          onClick={() => onSelectPreset('FLOOD_WARNING')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 space-y-3 ${currentPreset === 'FLOOD_WARNING'
              ? 'bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500'
              : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            {currentPreset === 'FLOOD_WARNING' && (
              <span className="text-[9px] font-black bg-amber-900 text-amber-300 px-2 py-0.5 rounded border border-amber-700 uppercase">
                ACTIVE PRESET
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Flood Warning</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Rain 120mm, Zone A HIGH risk (82/100), Road R3 BLOCKED!
            </p>
          </div>
        </div>

        {/* Severe Flood */}
        <div
          onClick={() => onSelectPreset('SEVERE_FLOOD')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 space-y-3 ${currentPreset === 'SEVERE_FLOOD'
              ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500'
              : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <Flame className="w-5 h-5" />
            </div>
            {currentPreset === 'SEVERE_FLOOD' && (
              <span className="text-[9px] font-black bg-rose-900 text-rose-300 px-2 py-0.5 rounded border border-rose-700 uppercase">
                ACTIVE PRESET
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Severe Flood</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Extreme rain (185mm), multiple blocked roads, rerouting to High Ground S3.
            </p>
          </div>
        </div>

      </div>

      {/* Current Step Description Banner */}
      {stepDescription && (
        <div className="bg-gray-900 border border-amber-900/60 p-4 rounded-2xl flex items-start gap-3">
          <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Simulation Telemetry Log:
            </span>
            <p className="text-xs text-gray-200 mt-0.5 font-medium">
              {stepDescription}
            </p>
          </div>
        </div>
      )}

      {/* Hackathon Judging Demo Flow Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Hackathon Presentation Demo Flow Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoSteps.map((step, idx) => (
            <div key={idx} className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-[10px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <h4 className="text-xs font-bold text-gray-200">{step.title}</h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
