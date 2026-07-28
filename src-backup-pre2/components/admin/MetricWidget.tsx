import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricWidgetProps {
  id: string;
  title: string;
  value: string;
  subvalue?: string;
  change: number; // e.g. +12.4 or -2.3
  changeLabel: string;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose';
  sparklineData: number[]; // mini data series for sparkline
  isActive?: boolean;
  onClick?: () => void;
}

export default function MetricWidget({
  id,
  title,
  value,
  subvalue,
  change,
  changeLabel,
  icon: Icon,
  color,
  sparklineData,
  isActive = false,
  onClick
}: MetricWidgetProps) {
  const colorMap = {
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      borderActive: 'border-blue-500',
      glow: 'shadow-blue-500/10',
      stroke: '#3b82f6',
      gradient: 'from-blue-500/20 to-transparent'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      borderActive: 'border-emerald-500',
      glow: 'shadow-emerald-500/10',
      stroke: '#10b981',
      gradient: 'from-emerald-500/20 to-transparent'
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      borderActive: 'border-amber-500',
      glow: 'shadow-amber-500/10',
      stroke: '#f59e0b',
      gradient: 'from-amber-500/20 to-transparent'
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      borderActive: 'border-indigo-500',
      glow: 'shadow-indigo-500/10',
      stroke: '#6366f1',
      gradient: 'from-indigo-500/20 to-transparent'
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      borderActive: 'border-rose-500',
      glow: 'shadow-rose-500/10',
      stroke: '#f43f5e',
      gradient: 'from-rose-500/20 to-transparent'
    }
  };

  const currentTheme = colorMap[color] || colorMap.blue;
  const isPositive = change >= 0;

  // Mini-Sparkline calculation
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  
  const width = 80;
  const height = 30;
  const padding = 2;
  const points = sparklineData.map((val, idx) => {
    const x = padding + (idx / (sparklineData.length - 1)) * (width - padding * 2);
    const y = padding + (height - padding * 2) * (1 - (val - minVal) / range);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer p-5 bg-slate-900/40 backdrop-blur-md border rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-1 hover:scale-[1.01] ${
        isActive 
          ? `${currentTheme.borderActive} bg-slate-900/90 shadow-lg ${currentTheme.glow}` 
          : 'border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60'
      }`}
      id={`metric-widget-${id}`}
    >
      {/* Background soft gradient when active */}
      {isActive && (
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentTheme.gradient} opacity-50 pointer-events-none`} />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Title and Icon */}
        <div className="space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-display text-white tracking-tight">
              {value}
            </span>
            {subvalue && (
              <span className="text-slate-500 text-xs font-mono">
                {subvalue}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Icon circle */}
        <div className={`p-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
          <Icon size={18} />
        </div>
      </div>

      {/* Sparkline and Percentage Row */}
      <div className="flex items-end justify-between mt-5 gap-3">
        {/* Trend Info */}
        <div className="flex flex-col gap-0.5">
          <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">
            {changeLabel}
          </span>
        </div>

        {/* Micro SVG Sparkline */}
        <div className="opacity-80" title="Tendencia reciente">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={currentTheme.stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* Soft pulse on last point of sparkline */}
            {sparklineData.length > 0 && (
              <circle
                cx={width - padding}
                cy={padding + (height - padding * 2) * (1 - (sparklineData[sparklineData.length - 1] - minVal) / range)}
                r={2}
                fill={currentTheme.stroke}
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </div>
      </div>
  );
}
