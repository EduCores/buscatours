import React, { useState } from 'react';
import { 
  CalendarCheck, Plus, Edit2, Trash2, Search, AlertTriangle, 
  CheckCircle, X, ShieldAlert
} from 'lucide-react';
import { Booking, Tour, Guide, Vehicle, UserRole } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

interface BookingsManagementProps {
  bookings: Booking[];
  tours: Tour[];
  guides: Guide[];
  vehicles: Vehicle[];
  onSaveBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
  currentRole: UserRole;
  currentOperator: string;
}

export default function BookingsManagement({
  bookings,
  tours,
  guides,
  vehicles,
  onSaveBooking,
  onDeleteBooking,
  currentRole,
  currentOperator
}: BookingsManagementProps) {
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form Fields
  const [tourId, setTourId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('2026-07-05');
  const [pax, setPax] = useState(2);
  const [status, setStatus] = useState<Booking['status']>('Confirmada');

  // Helper to detect conflicts dynamically
  const detectConflict = (bookingId: string | undefined, checkTourId: string, checkDate: string) => {
    // Find the tour in question
    const tourToCheck = tours.find(t => t.id === checkTourId);
    if (!tourToCheck) return null;

    const currentGuideId = tourToCheck.guideId;
    const currentVehicleId = tourToCheck.vehicleId;

    // Scan other bookings on the same date
    for (const b of bookings) {
      if (b.id === bookingId) continue; // skip self
      if (b.date !== checkDate) continue; // must be same date

      const otherTour = tours.find(t => t.id === b.tourId);
      if (!otherTour) continue;

      // Guide conflict
      if (currentGuideId && otherTour.guideId === currentGuideId) {
        const guideName = guides.find(g => g.id === currentGuideId)?.name || 'Guía';
        return `⚠️ Conflicto de Recursos: El guía "${guideName}" ya está asignado a otro tour ("${otherTour.title}") para este mismo día.`;
      }

      // Vehicle conflict
      if (currentVehicleId && otherTour.vehicleId === currentVehicleId) {
        const vehicleName = vehicles.find(v => v.id === currentVehicleId)?.name || 'Vehículo';
        return `⚠️ Conflicto de Recursos: El vehículo "${vehicleName}" ya está ocupado por otro tour ("${otherTour.title}") para este mismo día.`;
      }
    }

    return null;
  };

  const handleOpenFormForCreate = () => {
    setEditingBooking(null);
    setTourId(tours[0]?.id || '');
    setCustomerName('');
    setDate('2026-07-05');
    setPax(2);
    setStatus('Confirmada');

    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setTourId(booking.tourId || '');
    setCustomerName(typeof booking.customerName === 'string' ? booking.customerName : '');
    setDate(typeof booking.date === 'string' ? booking.date : '');
    setPax(booking.pax ?? 2);
    setStatus(typeof booking.status === 'string' ? booking.status : 'Confirmada');

    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !tourId) {
      alert(t('book.alertSelect', 'Por favor selecciona un tour y escribe el nombre del cliente.'));
      return;
    }

    const selectedTour = tours.find(t => t.id === tourId);
    if (!selectedTour) return;

    // Calculate dynamic price based on tour price * pax
    const calculatedPrice = selectedTour.price * pax;

    const saved: Booking = {
      id: editingBooking?.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      tourId,
      tourTitle: selectedTour.title,
      customerName,
      date,
      pax,
      price: calculatedPrice,
      currency: 'USD',
      status
    };

    onSaveBooking(saved);
    setIsFormOpen(false);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const tour = tours.find(t => t.id === b.tourId);
    
    // Operator level filter
    if (currentRole === 'operator' && tour?.operator !== currentOperator) {
      return false;
    }

    // Search query filter (defensive against missing fields)
    const q = searchQuery.toLowerCase();
    const cust = typeof b.customerName === 'string' ? b.customerName : '';
    const ttitle = typeof b.tourTitle === 'string' ? b.tourTitle : '';
    const bid = typeof b.id === 'string' ? b.id : '';
    const matchesSearch = cust.toLowerCase().includes(q) ||
                          ttitle.toLowerCase().includes(q) ||
                          bid.toLowerCase().includes(q);

    return matchesSearch;
  });

  return (
    <div id="bt-bookings-management">
      <div className="space-y-6 animate-fade-in">
        
        {/* Header sections */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <CalendarCheck size={20} className="text-amber-500" />
              {t('book.consoleTitle', 'Consola de Reservas B2B (Multi-operador)')}
            </h3>
            <p className="text-slate-400 text-xs">
              {t('book.subtitle', 'Coordinación y venta directa de cupos. El motor audita recursos duplicados (vehículos/guías) automáticamente por día de salida.')}
            </p>
          </div>

          <button
            id="btn-create-booking"
            onClick={handleOpenFormForCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 self-start md:self-auto"
          >
            <Plus size={15} />
            <span>{t('book.newSale', 'Registrar Venta / Cupo')}</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
          <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="booking-search-query"
            type="text"
            placeholder={t('book.searchPlaceholder', 'Buscar por código de reserva, titular o tour...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-slate-900 border border-white/5 rounded pl-9 pr-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Grid Table List (Responsive Dual Mode) */}
        {/* Mobile Card List (Only visible on mobile/tablet) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredBookings.map((b) => {
            const conflictMsg = detectConflict(b.id, b.tourId, b.date);
            const operatorName = tours.find(t => t.id === b.tourId)?.operator || 'Desconocido';

            return (
              <div 
                key={b.id} 
                id={`booking-card-mobile-${b.id}`}
                className={`glass-card p-4 relative overflow-hidden flex flex-col justify-between group border ${
                  conflictMsg 
                    ? 'border-red-500/30 bg-red-500/5' 
                    : 'border-white/5 bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="bg-slate-950 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-300">
                      {b.id}
                    </span>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                        b.status === 'Confirmada' 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                          : b.status === 'Pendiente'
                            ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                      }`}>
                        {b.status}
                      </span>
                      
                      {conflictMsg && (
                        <span className="flex items-center gap-1 text-[8px] text-red-400 font-bold font-mono animate-pulse bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10">
                          <AlertTriangle size={8} />
                           {t('book.conflict', 'Conflicto')}
                         </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-500 transition-colors">
                    {b.tourTitle}
                  </h4>
                  
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                           {t('book.operatorLabel', 'Operador')}: {operatorName}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">{t('book.colClient', 'CLIENTE')}</span>
                      <span className="text-xs text-slate-200 font-semibold truncate block">{b.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">{t('book.salida', 'SALIDA')}</span>
                      <span className="text-xs text-slate-300 font-mono block">{b.date ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">{t('book.colPax', 'PASAJEROS (PAX)')}</span>
                      <span className="text-xs text-slate-200 font-mono font-bold block">{b.pax ?? 0} Plazas</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">{t('book.colTotal', 'TOTAL MONTO')}</span>
                    <span className="text-xs text-amber-500 font-mono font-extrabold block">
                         ${(b.price ?? 0).toLocaleString('es-CL')} <span className="text-[8px] text-slate-400">{b.currency ?? 'USD'}</span>
                       </span>
                    </div>
                  </div>

                  {conflictMsg && (
                    <p className="text-[9px] text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10 mt-3 font-mono leading-relaxed">
                      <strong>Motivo:</strong> {conflictMsg}
                    </p>
                  )}
                </div>

                {/* Mobile Actions */}
                <div className="pt-3.5 border-t border-white/5 mt-4 flex gap-2">
                  <button
                    id={`btn-edit-booking-mobile-${b.id}`}
                    onClick={() => handleOpenFormForEdit(b)}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Edit2 size={10} />
                     <span>{t('book.modify', 'MODIFICAR RESERVA')}</span>
                  </button>

                  <button
                    id={`btn-delete-booking-mobile-${b.id}`}
                    onClick={() => {
                      if (confirm(t('book.confirmCancel', `¿Estás seguro de cancelar la reserva ${b.id}?`))) {
                        onDeleteBooking(b.id);
                      }
                    }}
                     className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/10 text-rose-400 rounded text-[10px] flex items-center justify-center"
                    title={t('book.cancel', 'Cancelar')}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="glass-card p-8 text-center text-slate-500 text-xs font-semibold">
              {t('book.noResults', 'No hay reservas coincidentes con los filtros aplicados.')}
            </div>
          )}
        </div>

        {/* Desktop Table List (Hidden on mobile/tablet) */}
        <div className="hidden md:block glass-card overflow-x-auto border border-white/5 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 uppercase font-mono tracking-wider font-bold bg-slate-950/40">
                 <th className="p-4">{t('book.colCode', 'CÓDIGO')}</th>
                 <th className="p-4">{t('book.colTourDest', 'TOUR DESTINO')}</th>
                 <th className="p-4">{t('book.colHolder', 'TITULAR / CLIENTE')}</th>
                 <th className="p-4">{t('book.salida', 'SALIDA')}</th>
                 <th className="p-4 text-center">{t('book.colPaxHead', 'PAX')}</th>
                 <th className="p-4">{t('book.colTotalHead', 'MONTO TOTAL')}</th>
                 <th className="p-4">{t('book.colStatus', 'ESTADO')}</th>
                 <th className="p-4 text-right">{t('book.colActions', 'ACCIONES')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((b) => {
                const conflictMsg = detectConflict(b.id, b.tourId, b.date);

                return (
                  <tr 
                    key={b.id} 
                    id={`booking-row-${b.id}`}
                    className={`hover:bg-white/2 transition-colors ${conflictMsg ? 'bg-red-500/5 border-l-2 border-l-red-500' : ''}`}
                  >
                    {/* Código */}
                    <td className="p-4 font-mono font-bold text-slate-300">
                      <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-[10px]">
                        {b.id}
                      </span>
                    </td>

                    {/* Tour title and operator */}
                    <td className="p-4 min-w-[200px]">
                      <div className="font-semibold text-white">{b.tourTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                         {t('book.operatorLabel', 'Operador')}: {tours.find(t => t.id === b.tourId)?.operator || 'Desconocido'}
                      </div>
                    </td>

                    {/* Titular */}
                    <td className="p-4 font-sans font-medium text-slate-200">
                      {b.customerName}
                    </td>

                    {/* Fecha */}
                    <td className="p-4 font-mono text-slate-400">
                      {b.date ?? '—'}
                    </td>

                    {/* Pax count */}
                      <td className="p-4 text-center font-mono font-bold text-slate-300">
                      {b.pax ?? 0}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-bold text-amber-500">
                      ${(b.price ?? 0).toLocaleString('es-CL')} <span className="text-[9px] text-slate-500">{b.currency ?? 'USD'}</span>
                    </td>

                    {/* Status badge and inline conflicts warnings */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                          b.status === 'Confirmada' 
                            ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                            : b.status === 'Pendiente'
                              ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                              : 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                        }`}>
                          {b.status}
                        </span>

                        {conflictMsg && (
                          <div 
                            className="text-[9px] text-rose-400 font-bold font-mono animate-pulse flex items-center gap-1 mt-1 max-w-[260px] leading-tight" 
                            title={conflictMsg}
                          >
                            <AlertTriangle size={10} className="flex-shrink-0" />
                             <span>{t('book.conflictResources', 'Conflicto Recursos')}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          id={`btn-edit-booking-${b.id}`}
                          onClick={() => handleOpenFormForEdit(b)}
                           className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded hover:text-white"
                           title={t('book.editTitle', 'Editar Reserva')}
                        >
                          <Edit2 size={11} />
                        </button>

                        <button
                          id={`btn-delete-booking-${b.id}`}
                          onClick={() => {
                            if (confirm(t('book.confirmCancel', `¿Estás seguro de cancelar la reserva ${b.id}?`))) {
                              onDeleteBooking(b.id);
                            }
                          }}
                           className="p-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/10 text-rose-400 rounded hover:text-rose-300"
                           title={t('book.cancelDelete', 'Cancelar / Borrar')}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
              {t('book.noResults', 'No hay reservas coincidentes con los filtros aplicados.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Form / Modal for Add/Edit Booking */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            
            {/* Form Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="font-display font-black text-base text-white tracking-tight">
                  {editingBooking ? t('book.editRecord', 'Editar Registro de Cupo') : t('book.newB2b', 'Nueva Venta B2B')}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {t('book.verifyAgenda', 'El sistema cruzará la agenda para verificar disponibilidad.')}
                </p>
              </div>

              <button
                id="btn-close-booking-form"
                onClick={() => setIsFormOpen(false)}
                className="relative z-10 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 rounded"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Tour select */}
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 font-mono">{t('book.selTour', 'SELECCIONAR TOUR DESTINO *')}</label>
                <select
                  id="form-booking-tour"
                  value={tourId}
                  onChange={(e) => setTourId(e.target.value)}
                   className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs"
                >
                  {tours
                    .filter(t => currentRole !== 'operator' || t.operator === currentOperator)
                    .map(t => (
                      <option key={t.id} value={t.id}>{t.title} (${t.price} USD) - {t.operator}</option>
                    ))}
                </select>
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 font-mono">{t('book.holderReserva', 'TITULAR DE LA RESERVA *')}</label>
                <input
                  id="form-booking-customer"
                  type="text"
                  required
                  placeholder="Ej: John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                   className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 font-mono">{t('book.fechaSalida', 'FECHA SALIDA *')}</label>
                   <input
                     id="form-booking-date"
                     type="date"
                     required
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                   />
                </div>

                {/* Pax count */}
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 font-mono">{t('book.paxLabel', 'PASAJEROS (PAX) *')}</label>
                   <input
                     id="form-booking-pax"
                     type="number"
                     required
                     min="1"
                     value={pax}
                     onChange={(e) => setPax(Number(e.target.value))}
                     className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                   />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-slate-400 font-mono block">{t('book.estadoReserva', 'ESTADO DE RESERVA')}</label>
                <select
                  id="form-booking-status"
                  value={status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                     className="w-full bg-slate-900 border border-white/5 rounded px-4 py-2 text-slate-200 text-xs font-bold"
                >
                   <option value="Confirmada">{t('book.statusConfirmed', '🟢 Confirmada')}</option>
                   <option value="Pendiente">{t('book.statusPending', '🟡 Pendiente Pago')}</option>
                   <option value="Cancelada">{t('book.statusCancelled', '🔴 Cancelada')}</option>
                </select>
              </div>

              {/* Dynamic Conflict Warning display inside form before saving */}
              {tourId && (
                (() => {
                  const conflict = detectConflict(editingBooking?.id, tourId, date);
                  if (conflict) {
                    return (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 text-[10px] text-rose-400 font-mono font-bold leading-relaxed">
                        <ShieldAlert size={16} className="flex-shrink-0 text-rose-400" />
                        <span>{conflict}</span>
                      </div>
                    );
                  }
                  return (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-1.5 text-[10px] text-emerald-400 font-mono font-bold">
                      <CheckCircle size={14} className="text-emerald-400" />
                       <span>{t('book.agendaFree', '✔ Agenda disponible: Sin conflictos detectados.')}</span>
                    </div>
                  );
                })()
              )}

              {/* Submit Slide */}
              <div className="pt-2">
                <button
                  id="btn-save-booking"
                  type="submit"
                   className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs transition-all duration-300 shadow-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={15} />
                  <span>{t('bookingsSave', 'Guardar Reserva')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
