import React, { useState } from 'react';
import { ShelterFacility } from '../types/disaster';
import { Building2, Phone, MapPin, CheckCircle2, ShieldAlert, HeartPulse, Search, Filter } from 'lucide-react';

interface SheltersViewProps {
  shelters: ShelterFacility[];
  targetShelterId?: string;
  onSelectShelter?: (shelter: ShelterFacility) => void;
}

export const SheltersView: React.FC<SheltersViewProps> = ({
  shelters,
  targetShelterId,
  onSelectShelter
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredShelters = shelters.filter(s => {
    const matchesType = filterType === 'ALL' || s.type === filterType;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Safe Shelters & Emergency Facilities</span>
          </h2>
          <p className="text-xs text-gray-400">
            Real-time occupancy monitoring, bed space availability, and facility safety statuses.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs">
            {['ALL', 'Shelter', 'Hospital', 'Emergency Center'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterType === type ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelters.map(facility => {
          const isTarget = facility.id === targetShelterId;
          const occupancyPercent = Math.round((facility.currentOccupancy / facility.totalCapacity) * 100);
          const isSafe = facility.safetyStatus === 'SAFE';

          return (
            <div
              key={facility.id}
              onClick={() => onSelectShelter && onSelectShelter(facility)}
              className={`bg-gray-900 border rounded-2xl p-5 space-y-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] shadow-xl ${
                isTarget
                  ? 'border-cyan-500/80 shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-400">{facility.id}</span>
                    <h3 className="text-sm font-extrabold text-white">{facility.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-950 text-gray-400 border border-gray-800 uppercase">
                    {facility.type}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isSafe ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-red-950 text-red-300 border-red-800'
                  }`}>
                    {facility.safetyStatus}
                  </span>
                  {isTarget && (
                    <span className="text-[9px] font-extrabold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700 uppercase">
                      ACTIVE ROUTE TARGET
                    </span>
                  )}
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-white font-mono">{facility.currentOccupancy} / {facility.totalCapacity} ({occupancyPercent}%)</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 85 ? 'bg-red-500' : occupancyPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-400">Available Bed Spaces:</span>
                  <span className="text-emerald-400 font-mono">{facility.availableCapacity} beds</span>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{facility.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{facility.contactPhone}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1">
                {facility.amenities.map((item, idx) => (
                  <span key={idx} className="bg-gray-950 text-gray-400 px-2 py-0.5 rounded text-[10px] border border-gray-800">
                    ✓ {item}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
