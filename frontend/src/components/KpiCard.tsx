import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  badgeText?: string;
  badgeColor?: string;
  borderHoverColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconTextColor,
  badgeText,
  badgeColor,
  borderHoverColor = 'hover:border-gray-700'
}) => {
  return (
    <div className={`relative bg-gray-900/80 border border-gray-800/90 rounded-2xl p-4 transition-all duration-300 ${borderHoverColor} hover:shadow-lg hover:shadow-black/50 group`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-gray-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`p-2.5 rounded-xl ${iconBgColor} ${iconTextColor} border border-white/5 transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>

          {badgeText && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor || 'bg-gray-800 text-gray-300 border-gray-700'}`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
