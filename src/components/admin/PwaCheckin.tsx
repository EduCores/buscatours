import React, { useState } from 'react';
import { 
  Smartphone, WifiOff, RefreshCw, 
  Terminal as TerminalIcon, Database, Plus
} from 'lucide-react';
import { PwaCheckin } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

interface PwaCheckinProps {
  queue: PwaCheckin[];
  onAddOfflineCheckin: (checkin: PwaCheckin) => void;
  onSyncQueue: () => void;
}

export default function PwaCheckinComponent({
  queue: _queue,
  onAddOfflineCheckin,
  onSyncQueue
}: PwaCheckinProps) {
  const { t } = useTranslation();

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] PWA offline synchronization layer active.',
    '[SYSTEM] Listening on service-worker redundant port.',
    '[SYSTEM] Waiting for offline check-in payload...'
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const writeLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const simulateAndesCheckin = () => {
    const checkin: PwaCheckin = {
      id: `pwa-ck-${Date.now()}`,
      tourTitle: 'Camino Inca Sagrado a Machu Picchu',
      customerName: `Pasajero PWA ${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: 'Andes Expeditions',
      status: 'PENDIENTE_SYNC'
    };

    onAddOfflineCheckin(checkin);
    writeLog(`[OFFLINE_QUEUE] Registrado Check-in para "${checkin.customerName}" por operador Andes Expeditions.`);
  };

  const simulatePatagoniaCheckin = () => {
    const checkin: PwaCheckin = {
      id: `pwa-ck-${Date.now()}`,
      tourTitle: 'Expedición Extrema Glaciar Grey',
      customerName: `Pasajero PWA ${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: 'Patagonia Wild',
      status: 'PENDIENTE_SYNC'
    };

    onAddOfflineCheckin(checkin);
    writeLog(`[OFFLINE_QUEUE] Registrado Check-in para "${checkin.customerName}" por operador Patagonia Wild.`);
  };

  const handleSyncClick = () => {
    if (_queue.length === 0) {
      writeLog('[SYNC_ERROR] Cola de sincronización vacía. Nada que sincronizar.');
      return;
    }

    setIsSyncing(true);
    writeLog('[SYNC_START] Iniciando conexión bidireccional segura con servidor central BuscaTours...');
    
    setTimeout(() => {
      writeLog(`[SYNC_PROGRESS] Conciliando ${_queue.length} registros pendientes en base de datos...`);
      
      setTimeout(() => {
        onSyncQueue();
        setIsSyncing(false);
        writeLog('[SYNC_SUCCESS] Sincronización finalizada correctamente. Registros consolidados en la base central.');
        writeLog('[SYSTEM] Volviendo a modo de escucha offline/satelital.');
      }, 1000);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="bt-pwa-checkin">
      
      {/* Top Warning card */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/15 text-amber-500 rounded-xl border border-amber-500/20 mt-1">
            <WifiOff size={18} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-tight">
              {t('pwa.title', 'Sincronizador PWA para Zonas Sin Conectividad')}
            </h4>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              {t('pwa.desc', 'En Torres del Paine o el Amazonas profundo no hay cobertura 4G. El personal de BuscaTours realiza el check-in de turistas sin internet desde la PWA móvil; los registros se guardan localmente y se reconcilian al recuperar enlace satelital.')}
            </p>
          </div>
        </div>

        <button
          id="btn-sync-pwa-central"
          onClick={handleSyncClick}
          disabled={isSyncing || _queue.length === 0}
           className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded text-xs transition-all duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
              {isSyncing ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>{t('pwa.syncing', 'Sincronizando Cola...')}</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  <span>{t('pwa.syncCentral', 'Sincronizar Cola Central')}</span>
                </>
              )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Offline Queue List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Database size={14} className="text-amber-500" />
                {t('pwa.queueRecords', 'Registros en Cola Local Offline')}
              </h4>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {_queue.length} {t('pwa.pending', 'PENDIENTES')}
              </span>
            </div>

            {/* Simulated registration actions */}
            <div className="grid grid-cols-2 gap-3 pb-2">
               <button
                 id="btn-simulate-andes-checkin"
                 onClick={simulateAndesCheckin}
                 className="py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/5 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
               >
                <Plus size={11} />
                <span>{t('pwa.simAndes', 'Simular Andes Check-in')}</span>
              </button>
               <button
                 id="btn-simulate-patagonia-checkin"
                 onClick={simulatePatagoniaCheckin}
                 className="py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/5 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
               >
                <Plus size={11} />
                 <span>{t('pwa.simPatagonia', 'Simular Patagonia Check-in')}</span>
              </button>
            </div>

            {/* Queue rows list */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {_queue.map((ck) => (
                <div 
                  key={ck.id} 
                  id={`pwa-row-${ck.id}`}
                  className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        PWA-REG
                      </span>
                      <h5 className="font-sans font-bold text-xs text-white">
                        {ck.customerName}
                      </h5>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                       {t('pwa.tourLabel', 'Tour')}: {ck.tourTitle} ({ck.operator})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="bg-amber-500/10 text-amber-500 text-[8px] font-bold font-mono px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                       {t('pwa.waitingSync', 'ESPERANDO SYNC')}
                    </span>
                    <span className="text-[9px] text-slate-500 block font-mono mt-1">
                      {ck.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {_queue.length === 0 && (
                <div className="p-8 text-center text-slate-600 font-medium text-xs space-y-1">
                  <Smartphone size={20} className="mx-auto text-slate-800" />
                   <span>{t('pwa.queueEmpty', 'Cola vacía. El estado de la base de datos está consolidado.')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Sync log terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-950 rounded-2xl border border-white/10 p-5 flex-1 flex flex-col justify-between font-mono text-[10px] leading-relaxed shadow-xl min-h-[340px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[9px]">
                  <TerminalIcon size={12} className="text-amber-500" />
                   {t('pwa.auditConsole', 'Consola Auditoría Sincronización')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Logs area */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto text-slate-300 pr-1">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-slate-500 text-right text-[9px]">
              BuscaTours SATCOM Core Protocol v2.8
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
