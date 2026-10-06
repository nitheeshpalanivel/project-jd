import React, { useState } from 'react';
import { calculateZoneRisk } from '../engine/riskEngine';
import { BrainCircuit, Sparkles, Sliders, Code2, CloudRain, Waves, Mountain, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RiskEngineView: React.FC = () => {
  // Interactive Slider State
  const [rainfall, setRainfall] = useState<number>(120);
  const [waterLevel, setWaterLevel] = useState<number>(2.8);
  const [elevation, setElevation] = useState<number>(4);
  const [populationDensity, setPopulationDensity] = useState<number>(8500);

  // Compute live risk
  const riskResult = calculateZoneRisk(rainfall, waterLevel, elevation, populationDensity);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <span>AI Risk Prediction Engine & XAI Analytics</span>
          </h2>
          <p className="text-xs text-gray-400">
            Interactive risk prediction simulator with transparent factor attribution and modular ML architecture.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-800/60 text-xs font-bold text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Explainable AI Mode: Active</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parameters Sliders */}
        <div className="lg:col-span-6 bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            Hydrological & Demographic Input Controls
          </h3>

          {/* Slider 1: Rainfall */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-400" />
                Rainfall Volume (mm)
              </span>
              <span className="font-mono font-bold text-blue-400 text-sm">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={rainfall}
              onChange={e => setRainfall(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>0 mm (Clear)</span>
              <span>100 mm (Heavy)</span>
              <span>200 mm (Extreme)</span>
            </div>
          </div>

          {/* Slider 2: Water Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                Water Level / Drainage Saturation (m)
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{waterLevel} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={waterLevel}
              onChange={e => setWaterLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>0.0 m (Normal)</span>
              <span>2.5 m (Alert)</span>
              <span>5.0 m (Severe Overflow)</span>
            </div>
          </div>

          {/* Slider 3: Elevation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-amber-400" />
                Terrain Elevation (m)
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">{elevation} m</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={elevation}
              onChange={e => setElevation(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>1 m (Low Basin)</span>
              <span>20 m (Mid Plateau)</span>
              <span>40 m (High Hill)</span>
            </div>
          </div>

          {/* Slider 4: Population Density */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                Population Density (people / km²)
              </span>
              <span className="font-mono font-bold text-purple-400 text-sm">{populationDensity.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={populationDensity}
              onChange={e => setPopulationDensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>500 (Suburban)</span>
              <span>7,500 (Urban)</span>
              <span>15,000 (Dense Metropolis)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Computed Risk & XAI Attribution */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Computed Score Display */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-[#121929] border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Computed Disaster Risk Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-4xl font-black ${
                    riskResult.level === 'HIGH' ? 'text-red-500' :
                    riskResult.level === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {riskResult.score}
                  </span>
                  <span className="text-gray-400 text-sm font-bold">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border uppercase tracking-wider ${
                  riskResult.level === 'HIGH' ? 'bg-red-950 text-red-300 border-red-800' :
                  riskResult.level === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {riskResult.level} RISK THRESHOLD
                </span>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  {riskResult.score >= 70 ? '70-100: HIGH' : riskResult.score >= 40 ? '40-69: MEDIUM' : '0-39: LOW'}
                </p>
              </div>
            </div>

            {/* Explainable Factor Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-gray-800">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                Factor Contribution Attribution:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {riskResult.factors.map((f, i) => (
                  <div key={i} className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-300">{f.factor}</span>
                      <span className="font-mono font-extrabold text-amber-400">+{f.points} pts</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Rationale */}
            <div className="bg-purple-950/30 border border-purple-900/60 p-3 rounded-xl text-xs text-purple-200 leading-relaxed font-medium">
              <span className="font-bold text-purple-300 block mb-0.5">XAI Rationale:</span>
              "{riskResult.rationale}"
            </div>

          </div>

          {/* Modular Engine Code Snippet */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                <Code2 className="w-4 h-4 text-purple-400" />
                Modular Risk Predictor Interface
              </span>
              <span className="text-[10px] text-emerald-400">scikit-learn ready</span>
            </div>
            <pre className="text-purple-300 overflow-x-auto p-2 bg-gray-900 rounded-lg">
{`# Python / scikit-learn drop-in interface
def predict_disaster_risk(rainfall, water_level, elevation, pop_density):
    # Features vector: [rainfall, water_level, elevation, pop_density]
    features = [[rainfall, water_level, elevation, pop_density]]
    # Trained Random Forest / Gradient Boosting model inference:
    risk_score = ml_model.predict(features)[0]
    return risk_score, classify_threshold(risk_score)`}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
