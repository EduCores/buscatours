import React, { useState } from 'react';
import { 
  Compass, Thermometer, Wind, Activity, Wifi, ShieldAlert
} from 'lucide-react';
import { LogisticNode } from './types';
import { LOGISTICS_NODES } from './mockData';
import { useTranslation } from '../../i18n/LanguageContext';

export default function LogisticsMap() {
  const { t } = useTranslation();

  const [selectedNode, setSelectedNode] = useState<LogisticNode>(LOGISTICS_NODES[0]);
  const [checklist, setChecklist] = useState({
    offlineReconciled: true,
    weatherAlertsChecked: true,
    garminHeartbeatOk: true,
    chilePermitActive: true
  });

  const totalPax = LOGISTICS_NODES.reduce((sum, node) => sum + node.pax, 0);

  return (
    <div className="space-y-6 animate-fade-in" id="bt-logistics-map">
      
      {/* Top Banner Statuses */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-bold text-slate-300">
            {t('log.satcom', 'SATCOM TELEMETRY')}: <strong className="text-emerald-400">100% ONLINE</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-xs text-slate-300">
            {t('log.activeNodes', 'Nodos Activos')}: <strong className="text-white">{LOGISTICS_NODES.length}</strong>
          </span>
        </div>

        <div className="flex gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
              {t('log.satcomOnline', '🛰️ SATCOM 100% ONLINE')}
          </span>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
            👥 {totalPax} {t('log.touristsOnRoute', 'Turistas en Ruta')}
          </span>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stylized Map View (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="font-display font-extrabold text-sm text-white tracking-tight flex items-center gap-2 mb-2">
              <Compass size={16} className="text-amber-500 animate-spin-slow" />
              {t('log.routeMapTitle', 'Mapa de Ruta de Operadores (Sudamérica)')}
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              {t('log.selectNode', 'Selecciona un nodo pulsante para captar las coordenadas, telemetría y reportes climáticos en tiempo real.')}
            </p>
          </div>

          {/* Interactive SVG South America Map */}
          <div className="relative w-full aspect-[4/5] max-w-[360px] mx-auto bg-slate-950/50 border border-white/5 rounded-2xl overflow-hidden p-4 flex items-center justify-center">
            {/* Minimalist Stylized Outline of South America */}
            <svg 
              viewBox="0 0 400 500" 
              className="w-full h-full text-slate-800 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Artistic custom stylized path approximating South America */}
              <path 
                d="M 180 40 
                   C 230 42, 280 65, 300 110 
                   C 320 150, 310 180, 280 210 
                   C 260 230, 240 250, 230 270 
                   C 220 290, 210 320, 200 350 
                   C 190 380, 180 420, 175 460
                   C 173 480, 168 490, 160 490
                   C 155 490, 150 480, 152 460
                   C 155 420, 150 380, 140 340
                   C 130 300, 115 280, 100 260
                   C 80 230, 75 210, 80 180
                   C 85 150, 100 120, 115 100
                   C 130 80, 145 60, 160 48
                   Z" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="2.5"
                className="fill-slate-900/40"
              />
              
              {/* Grid Lat/Lng background lines for a technical look */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="0" y1="300" x2="400" y2="300" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="0" y1="400" x2="400" y2="400" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="100" y1="0" x2="100" y2="500" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="500" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              <line x1="300" y1="0" x2="300" y2="500" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />

              {/* Equator and Tropic indicators */}
              <text x="10" y="95" className="fill-slate-600 font-mono text-[8px]">EQ: 0.0000°</text>
              <text x="10" y="295" className="fill-slate-600 font-mono text-[8px]">TROPIC OF CAPRICORN</text>
            </svg>

            {/* 4 Absolute Pulsing Nodes */}
            {LOGISTICS_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  id={`btn-node-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  style={{ top: node.top, left: node.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-2 group focus:outline-none"
                >
                  <span className="relative flex h-3.5 w-3.5">
                    {/* Pulsing ring outer */}
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? 'bg-amber-400' : 'bg-amber-500/60'
                    }`} />
                    {/* Inner core circle */}
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-slate-950 ${
                      isSelected ? 'bg-amber-400 scale-125' : 'bg-amber-600'
                    } transition-transform duration-300`} />
                  </span>

                  {/* Tooltip on hover */}
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-950 text-white border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap font-mono font-bold shadow-xl">
                    {node.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-center text-[10px] font-mono text-slate-500">
            {t('log.timezoneLabel', 'Huso horario estandarizado')}: <strong className="text-slate-400">GMT-5 / GMT-3 (LATAM)</strong>
          </div>
        </div>

        {/* Right Column: Telemetry Panel & Checklist (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Telemetry Detail Panel */}
          <div className="glass-card p-5 relative overflow-hidden flex-1 flex flex-col justify-between border-l-4 border-l-amber-500">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
                    {t('log.live', 'TELEMETRÍA EN VIVO')}
                  </span>
                  <h4 className="font-display font-black text-base text-white tracking-tight mt-0.5">
                    {selectedNode.name}
                  </h4>
                </div>
                <span className="bg-slate-900 border border-white/5 px-2.5 py-1 rounded-xl text-[10px] text-slate-400 font-mono">
                  {selectedNode.operator}
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-3.5 my-4">
                
                {/* Guía */}
                <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono block">{t('logGuideAssigned', 'Guía Asignado')}</span>
                  <span className="text-xs font-bold text-slate-200 block truncate">{selectedNode.guide}</span>
                </div>

                {/* Turistas */}
                <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono block">{t('logActiveTourists', 'Turistas Activos')}</span>
                  <span className="text-xs font-bold text-slate-200 block">{selectedNode.pax} PAX</span>
                </div>

                {/* Vehículo */}
                <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl space-y-1 col-span-2">
                  <span className="text-[9px] text-slate-500 font-mono block">{t('log.transportLogistics', 'Logística de Transporte')}</span>
                  <span className="text-xs font-bold text-slate-200 block truncate">{selectedNode.vehicle}</span>
                </div>

                {/* Clima */}
                <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono block flex items-center gap-1">
                    <Thermometer size={10} className="text-amber-500" /> {t('log.temperature', 'Temperatura')}
                  </span>
                  <span className="text-xs font-bold text-slate-200 block">{selectedNode.weather.temp}</span>
                </div>

                <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono block flex items-center gap-1">
                    <Wind size={10} className="text-blue-400" /> {t('log.wind', 'Viento')}
                  </span>
                  <span className="text-xs font-bold text-slate-200 block truncate">{selectedNode.weather.wind}</span>
                </div>

              </div>

              {/* Status Report text area */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1 mb-4">
                <span className="text-[9px] text-amber-500 font-mono font-bold block flex items-center gap-1">
                  <Activity size={10} /> {t('log.tourStatusReport', 'REPORTE DE ESTADO DEL TOUR')}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                  "{selectedNode.currentStatus}"
                </p>
              </div>

              {/* Connection Specs */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/40 p-2.5 border border-white/5 rounded-xl">
                <Wifi size={12} className="text-emerald-400 animate-pulse" />
                 <span>{t('log.connectionMode', 'Modo Conexión')}: <strong className="text-white">{selectedNode.connection}</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono text-right">
              {t('log.satelliteCoord', 'Latitud/Longitud coordinada satelitalmente')}
            </div>
          </div>

          {/* Checklist Operativa Box */}
          <div className="glass-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-500" />
                {t('log.operationalChecklist', 'Checklist Operativa Nacional')}
              </h4>
              <span className="text-[9px] font-mono text-slate-500">Platform Admin</span>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checklist.offlineReconciled}
                  onChange={(e) => setChecklist(prev => ({ ...prev, offlineReconciled: e.target.checked }))}
                  className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                />
                 <span className="text-slate-300">{t('log.checkOfflineReconciled', 'Check-in offline conciliado con PWA')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checklist.weatherAlertsChecked}
                  onChange={(e) => setChecklist(prev => ({ ...prev, weatherAlertsChecked: e.target.checked }))}
                  className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                />
                 <span className="text-slate-300">{t('log.weatherAlerts', 'Alertas clima extremas cruzadas (Inrena)')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checklist.garminHeartbeatOk}
                  onChange={(e) => setChecklist(prev => ({ ...prev, garminHeartbeatOk: e.target.checked }))}
                  className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                />
                 <span className="text-slate-300">{t('log.garminHeartbeat', 'Heartbeat satelital Garmin activo')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={checklist.chilePermitActive}
                  onChange={(e) => setChecklist(prev => ({ ...prev, chilePermitActive: e.target.checked }))}
                  className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                />
                 <span className="text-slate-300">{t('log.conafPermits', 'Permisos forestales de Conaf vigentes')}</span>
              </label>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
