import React from 'react';
import { Zone } from '../types/disaster';
import { BrainCircuit, AlertTriangle, CloudRain, Waves, Mountain, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface ExplainableRiskCardProps {
  zone: Zone;
  targetShelterName?: string;
  blockedRoadName?: string;
}

export const ExplainableRiskCard: React.FC<ExplainableRiskCardProps> = ({
  zone,
  targetShelterName = 'Shelter S2 (Metro Arena)',
  blockedRoadName = 'Road R3 (Central Bridge Way)'
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain': return CloudRain;
      case 'Waves': return Waves;
      case 'Mountain': return Mountain;
      case 'Users': return Users;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900/90 to-[#121929] border border-purple-900/40 rounded-2xl p-5 shadow-xl shadow-purple-950/20 relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Explainable AI Risk Attribution
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
                <Sparkles className="w-3 h-3 text-purple-400" />
                XAI Powered
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Factor contribution breakdown for {zone.name}
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-2xl font-black text-red-500">{zone.riskScore}</span>
            <span className="text-xs text-gray-400 font-semibold">/ 100</span>
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
            zone.riskLevel === 'HIGH' ? 'bg-red-950 text-red-400 border-red-800' :
            zone.riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-800' :
            'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            {zone.riskLevel} RISK
          </span>
        </div>
      </div>

      {/* Factors List */}
      <div className="space-y-3 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Top Risk Contributors:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {zone.riskFactors.map((factor, idx) => {
            const IconComponent = getIcon(factor.icon);
            const percentage = Math.round((factor.points / factor.maxPoints) * 100);

            return (
              <div
                key={idx}
                className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-purple-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-bold text-gray-200">{factor.factor}</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 font-mono">
                    +{factor.points} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden my-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      factor.points > 25 ? 'bg-gradient-to-r from-amber-500 to-red-500' :
                      factor.points > 15 ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.max(8, percentage)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>Val: {factor.valueString}</span>
                  <span>{percentage}% of max</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated Recommendation Box */}
      <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-extrabold text-red-300 uppercase tracking-wider mb-0.5">
            Actionable AI Recommendation:
          </div>
          <p className="text-xs text-red-200 leading-relaxed font-medium">
            "Immediate evacuation recommended for residents in {zone.name}. Avoid {blockedRoadName} due to active flood hazard and proceed along safe corridors to {targetShelterName}."
          </p>
        </div>
      </div>

    </div>
  );
};
