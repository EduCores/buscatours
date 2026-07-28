import React from 'react';
import { 
  DollarSign, CalendarCheck, Compass, Users, Car, QrCode, 
  Sparkles, ArrowRight
} from 'lucide-react';
import { Tour, Booking, Guide, Vehicle, ActiveTab } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

interface DashboardOverviewProps {
  tours: Tour[];
  bookings: Booking[];
  guides: Guide[];
  vehicles: Vehicle[];
  offlineQueueLength: number;
  onNavigateToTab: (tab: ActiveTab) => void;
  currentRole: string;
}

export default function DashboardOverview({
  tours,
  bookings,
  guides,
  vehicles,
  offlineQueueLength,
  onNavigateToTab,
  currentRole
}: DashboardOverviewProps) {
  const { t } = useTranslation();
  
  const _tours = tours || [];
  const _bookings = bookings || [];
  const _guides = guides || [];
  const _vehicles = vehicles || [];
  
  // Calculate stats
  const totalRevenue = _bookings
    .filter(b => b.status === 'Confirmada')
    .reduce((sum, b) => sum + b.price, 0);

  const totalBookings = _bookings.length;
  const publishedTours = _tours.filter(t => t.status === 'PUBLISHED').length;

  const activeGuides = _guides.filter(g => g.status === 'Disponible' || g.status === 'En tour').length;
  const availableVehicles = _vehicles.filter(v => v.status === 'Disponible').length;

  // Horizontal bar percentages
  const outdoorCount = _tours.filter(t => t.category === 'Outdoor' || t.category === 'Glaciar' || t.category === 'Selva' || t.category === 'Montaña').length;
  const aventuraCount = _tours.filter(t => t.category === 'Aventura').length;
  const culturalCount = _tours.filter(t => t.category === 'Cultural' || t.category === 'Histórico').length;
  
  const totalCat = (outdoorCount + aventuraCount + culturalCount) || 1;
  const outdoorPercent = Math.round((outdoorCount / totalCat) * 100);
  const aventuraPercent = Math.round((aventuraCount / totalCat) * 100);
  const culturalPercent = Math.round((culturalCount / totalCat) * 100);

  return (
    <div className="space-y-6 animate-fade-in" id="bt-dashboard-overview">
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Ingresos Estimados */}
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">
                {t('dash.revenue', 'Ingresos Estimados')}
              </span>
              <span className="text-3xl font-black font-display text-white tracking-tight">
                ${totalRevenue.toLocaleString('es-CL')} <span className="text-xs text-amber-500 font-mono">USD</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                {t('dash.revenueSync', 'Sincronizado con pasarela LATAM')}
              </span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t('dash.last30', 'Últimos 30 días')}</span>
            <span className="text-emerald-400 font-bold">{t('dash.growth', '+18.5% de crecimiento')}</span>
          </div>
        </div>

        {/* KPI 2: Total Reservas */}
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">
                {t('dash.totalBookings', 'Total Reservas B2B')}
              </span>
              <span className="text-3xl font-black font-display text-white tracking-tight">
                {totalBookings} <span className="text-xs text-blue-400 font-mono">RESERVAS</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                {t('dash.operatorsToday', 'Operadores conectados hoy')}
              </span>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <CalendarCheck size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t('dash.conflictsDetected', 'Conflictos detectados')}</span>
            <span className={_bookings.some(b => b.conflict) ? 'text-rose-400 font-bold flex items-center gap-1' : 'text-emerald-400 font-bold'}>
              {_bookings.some(b => b.conflict) ? t('dash.alertsActive', '⚠️ Alertas activas') : t('dash.allCoordinated', '✔ Todo coordinado')}
            </span>
          </div>
        </div>

        {/* KPI 3: Tours Publicados */}
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1">
                {t('dash.catalogTours', 'Tours en Catálogo')}
              </span>
              <span className="text-3xl font-black font-display text-white tracking-tight">
                {publishedTours} <span className="text-xs text-emerald-400 font-mono">ACTIVOS</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                {t('dash.totalRegistered', 'Total registrado')}: {_tours.length}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Compass size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t('dash.draftReview', 'Nuevos en revisión (DRAFT)')}</span>
            <span className="text-slate-300 font-bold">{_tours.filter(t => t.status === 'DRAFT').length} {t('dash.pending', 'pendientes')}</span>
          </div>
        </div>

      </div>

      {/* Main Analysis and Metrics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Horizontal bar: Reservas por Categoría */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                <Compass size={16} className="text-amber-500" />
                {t('dash.byCategory', 'Reservas por Categoría (Estadísticas de la Red)')}
              </h3>
              <span className="text-[9px] font-mono text-slate-500 uppercase">LATAM Distribution</span>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Outdoor */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 font-bold">{t('dash.catOutdoor', 'Outdoor / Glaciares / Selva')}</span>
                  <span className="text-amber-400 font-extrabold">{outdoorPercent}%</span>
                </div>
                <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    style={{ width: `${outdoorPercent}%`, transition: 'width 1s ease-out' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                  />
                </div>
              </div>

              {/* Aventura */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 font-bold">{t('dash.catAdventure', 'Aventura / Deportes Extremos')}</span>
                  <span className="text-blue-400 font-extrabold">{aventuraPercent}%</span>
                </div>
                <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    style={{ width: `${aventuraPercent}%`, transition: 'width 1s ease-out' }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                  />
                </div>
              </div>

              {/* Cultural */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 font-bold">{t('dash.catCultural', 'Cultural / Arqueológico / Historia')}</span>
                  <span className="text-emerald-400 font-extrabold">{culturalPercent}%</span>
                </div>
                <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    style={{ width: `${culturalPercent}%`, transition: 'width 1s ease-out' }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 text-[10px] text-slate-500 font-mono flex justify-between items-center">
            <span>* {t('dash.dataNote', 'Datos en base al inventario activo de tours.')}</span>
            <span className="text-amber-500 font-bold">{t('dash.realtime', 'Actualizado en tiempo real')}</span>
          </div>
        </div>

        {/* Métricas Operativas */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                <Car size={16} className="text-amber-500" />
                {t('dash.opsAvailability', 'Disponibilidad y Sincronización Operativa')}
              </h3>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">SATCOM LIVE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/15">
                  <Users size={14} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">{t('dash.activeGuides', 'Guías Activos')}</span>
                <span className="text-xl font-black text-white block">{activeGuides}</span>
                <span className="text-[9px] text-emerald-400 font-mono">{t('dash.dispRoute', 'Disp. / En ruta')}</span>
              </div>

              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/15">
                  <Car size={14} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">{t('dash.freeVehicles', 'Vehículos Libres')}</span>
                <span className="text-xl font-black text-white block">{availableVehicles}</span>
                <span className="text-[9px] text-slate-500 font-mono">{t('dash.available', 'Disponibles')}</span>
              </div>

              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/15">
                  <QrCode size={14} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">{t('dash.pwaQueue', 'PWA en Cola')}</span>
                <span className="text-xl font-black text-white block">{offlineQueueLength}</span>
                <span className="text-[9px] text-amber-500 font-mono">{t('dash.pendingSync', 'Pendientes Sync')}</span>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] text-slate-400 font-mono leading-relaxed">
            <span className="text-slate-500">{t('dash.networkStatus', 'Estado de red local:')}</span> {t('dash.networkConnected', 'Conectado a la antena redundante de Patagonia y Cusco.')}
          </div>
        </div>

      </div>

      {/* Featured CTA: Generar Nuevo Tour con IA */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-950 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.04),transparent_50%)] pointer-events-none" />
        <div className="space-y-1 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-[9px] font-mono text-amber-400 font-bold">
            <Sparkles size={10} />
            {t('dash.geminiAi', 'INTELIGENCIA ARTIFICIAL GEMINI PRO')}
          </div>
          <h3 className="text-lg font-black text-white tracking-tight font-display">
            {t('dash.newTourTitle', '¿Tienes un nuevo destino o borrador de tour?')}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            {t('dash.newTourDesc', 'Usa el Copiloto IA de BuscaTours para estructurar un itinerario completo, sugerir precios inteligentes, redactar SEO y traducir automáticamente a inglés y portugués.')}
          </p>
        </div>

        <button
          id="btn-nav-to-ai-copilot"
          onClick={() => {
            if (currentRole === 'platform-admin') {
              onNavigateToTab('copilot');
            } else {
               alert(t('dash.needPerms', 'Esta acción requiere permisos de Platform Admin.'));
            }
          }}
          className={`px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded transition-all duration-300 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 text-xs flex-shrink-0 ${
            currentRole !== 'platform-admin' ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>{t('dash.structureBtn', 'Estructurar con Copiloto IA')}</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
