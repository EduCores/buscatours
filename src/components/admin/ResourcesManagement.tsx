import React, { useState } from 'react';
import { 
  Users, Car, Plus, Edit2, Trash2, CheckCircle, X, Award
} from 'lucide-react';
import { Guide, Vehicle, UserRole } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

interface ResourcesManagementProps {
  guides: Guide[];
  vehicles: Vehicle[];
  onSaveGuide: (guide: Guide) => void;
  onDeleteGuide: (id: string) => void;
  onSaveVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  currentRole: UserRole;
  currentOperator: string;
}

export default function ResourcesManagement({
  guides: _guides,
  vehicles: _vehicles,
  onSaveGuide,
  onDeleteGuide,
  onSaveVehicle,
  onDeleteVehicle,
  currentRole: _currentRole,
  currentOperator: _currentOperator
}: ResourcesManagementProps) {
  const { t } = useTranslation();
  
  const [activeSubTab, setActiveSubTab] = useState<'guides' | 'vehicles'>('guides');

  // Form states
  const [isGuideFormOpen, setIsGuideFormOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [guideName, setGuideName] = useState('');
  const [guideSpecialty, setGuideSpecialty] = useState('');
  const [guideStatus, setGuideStatus] = useState<Guide['status']>('Disponible');

  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleSeats, setVehicleSeats] = useState(10);
  const [vehicleStatus, setVehicleStatus] = useState<Vehicle['status']>('Disponible');

  const handleOpenGuideCreate = () => {
    setEditingGuide(null);
    setGuideName('');
    setGuideSpecialty('');
    setGuideStatus('Disponible');
    setIsGuideFormOpen(true);
  };

  const handleOpenGuideEdit = (guide: Guide) => {
    setEditingGuide(guide);
    setGuideName(guide.name);
    setGuideSpecialty(guide.specialty);
    setGuideStatus(guide.status);
    setIsGuideFormOpen(true);
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideName.trim() || !guideSpecialty.trim()) return;

    const saved: Guide = {
      id: editingGuide?.id || `gd-${Date.now()}`,
      name: guideName,
      specialty: guideSpecialty,
      status: guideStatus
    };

    onSaveGuide(saved);
    setIsGuideFormOpen(false);
  };

  const handleOpenVehicleCreate = () => {
    setEditingVehicle(null);
    setVehicleName('');
    setVehicleSeats(10);
    setVehicleStatus('Disponible');
    setIsVehicleFormOpen(true);
  };

  const handleOpenVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleName(vehicle.name);
    setVehicleSeats(vehicle.seats);
    setVehicleStatus(vehicle.status);
    setIsVehicleFormOpen(true);
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleName.trim()) return;

    const saved: Vehicle = {
      id: editingVehicle?.id || `vh-${Date.now()}`,
      name: vehicleName,
      seats: vehicleSeats,
      status: vehicleStatus
    };

    onSaveVehicle(saved);
    setIsVehicleFormOpen(false);
  };

  return (
    <div id="bt-resources-management">
      <div className="space-y-6 animate-fade-in">
        
        {/* Header controls with subtab switches */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <Users size={20} className="text-amber-500" />
              {t('res.title', 'Control Operativo de Recursos Locales')}
            </h3>
            <p className="text-slate-400 text-xs">
              {t('res.subtitle', 'Gestión y disponibilidad horaria de guías certificados de montaña y flota homologada de transporte.')}
            </p>
          </div>

          {/* Subtab switches */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/5 self-start md:self-auto">
            <button
              id="btn-subtab-guides"
              onClick={() => setActiveSubTab('guides')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-all duration-300 ${
                activeSubTab === 'guides'
                  ? 'bg-amber-500 text-slate-950 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users size={13} />
              <span>{t('res.guides', 'Guías Profesionales')}</span>
            </button>
            <button
              id="btn-subtab-vehicles"
              onClick={() => setActiveSubTab('vehicles')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-all duration-300 ${
                activeSubTab === 'vehicles'
                  ? 'bg-amber-500 text-slate-950 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car size={13} />
              <span>{t('res.vehicles', 'Vehículos Flota')}</span>
            </button>
          </div>
        </div>

        {/* Primary views */}
        {activeSubTab === 'guides' ? (
          <div className="space-y-4">
            
            <div className="flex justify-between items-center bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
              <span className="text-xs font-mono font-bold text-slate-300">
                {t('res.registered', 'Personal Registrado')}: <strong className="text-white">{_guides.length} {t('res.guidesCount', 'Guías')}</strong>
              </span>

               <button
                 id="btn-add-guide"
                 onClick={handleOpenGuideCreate}
                 className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-[11px] flex items-center gap-1"
               >
                  <Plus size={12} />
                  <span>{t('res.hireGuide', 'Contratar Guía')}</span>
               </button>
            </div>

            {/* Guides grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {_guides.map((guide) => (
                <div 
                  key={guide.id} 
                  id={`guide-card-${guide.id}`}
                  className="glass-card p-5 relative overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-white/5 text-amber-500 flex items-center justify-center font-display font-black text-sm">
                          {guide.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-500 transition-colors">
                            {guide.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono block">ID: {guide.id}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                        guide.status === 'Disponible' 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                          : guide.status === 'En tour'
                            ? 'bg-blue-500/15 border-blue-500/20 text-blue-400'
                            : 'bg-slate-500/15 border-white/5 text-slate-400'
                      }`}>
                        {guide.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 border border-white/5 rounded-xl font-medium mt-3.5 flex items-start gap-1.5 leading-snug">
                      <Award size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{guide.specialty}</span>
                    </p>
                  </div>

                  {/* Guide actions */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex gap-2">
                      <button
                        id={`btn-edit-guide-${guide.id}`}
                        onClick={() => handleOpenGuideEdit(guide)}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
                      >
                      <Edit2 size={10} />
                      <span>{t('res.modify', 'MODIFICAR')}</span>
                    </button>

                      <button
                        id={`btn-delete-guide-${guide.id}`}
                        onClick={() => {
                          if (confirm(`${t('res.confirmUnlinkGuide', '¿Estás seguro de desvincular a ')}${guide.name}?`)) {
                            onDeleteGuide(guide.id);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/10 text-rose-400 rounded text-[10px]"
                      >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="space-y-4">
            
            <div className="flex justify-between items-center bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
              <span className="text-xs font-mono font-bold text-slate-300">
                {t('res.fleetUnitsLabel', 'Unidades en Flota')}: <strong className="text-white">{_vehicles.length} {t('res.units', 'Unidades')}</strong>
              </span>

               <button
                 id="btn-add-vehicle"
                 onClick={handleOpenVehicleCreate}
                 className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-[11px] flex items-center gap-1"
               >
                <Plus size={12} />
                <span>{t('res.acquireUnit', 'Adquirir Unidad')}</span>
              </button>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {_vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  id={`vehicle-card-${vehicle.id}`}
                  className="glass-card p-5 relative overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-white/5 text-amber-500 flex items-center justify-center font-display">
                          <Car size={18} />
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-500 transition-colors">
                            {vehicle.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono block">ID: {vehicle.id}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                        vehicle.status === 'Disponible' 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                          : vehicle.status === 'En uso'
                            ? 'bg-blue-500/15 border-blue-500/20 text-blue-400'
                            : 'bg-slate-500/15 border-white/5 text-slate-400'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 border border-white/5 rounded-xl mt-3.5 flex items-center justify-between font-mono">
                      <span>{t('res.totalSeats', 'Asientos Totales:')}</span>
                      <strong className="text-white text-sm">{vehicle.seats} {t('res.seatsWord', 'Plazas')}</strong>
                    </p>
                  </div>

                  {/* Vehicle actions */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex gap-2">
                      <button
                        id={`btn-edit-vehicle-${vehicle.id}`}
                        onClick={() => handleOpenVehicleEdit(vehicle)}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all"
                      >
                      <Edit2 size={10} />
                      <span>{t('res.modify', 'MODIFICAR')}</span>
                    </button>

                      <button
                        id={`btn-delete-vehicle-${vehicle.id}`}
                        onClick={() => {
                          if (confirm(`${t('res.confirmRetireVehicle', '¿Estás seguro de retirar de servicio la unidad ')}${vehicle.name}?`)) {
                            onDeleteVehicle(vehicle.id);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/10 text-rose-400 rounded text-[10px]"
                      >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Guide Form Modal */}
      {isGuideFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="font-display font-black text-sm text-white tracking-tight">
                  {editingGuide ? t('res.editGuideTitle', 'Editar Guía Profesional') : t('res.hireGuideTitle', 'Contratar Guía Profesional')}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{t('res.guideFormSubtitle', 'Define especialidad de rescate y estatus.')}</p>
              </div>

              <button
                id="btn-close-guide-form"
                onClick={() => setIsGuideFormOpen(false)}
                className="relative z-10 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleGuideSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">{t('res.fullNameLabel', 'NOMBRE COMPLETO *')}</label>
                 <input
                   id="form-guide-name"
                   type="text"
                   required
                   placeholder={t('res.phGuideName', 'Ej: Sofía Huamán')}
                   value={guideName}
                   onChange={(e) => setGuideName(e.target.value)}
                   className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                 />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">{t('res.specialtyLabel', 'ESPECIALIDAD / PERMISOS *')}</label>
                <input
                  id="form-guide-specialty"
                  type="text"
                  required
                  placeholder={t('res.phGuideSpec', 'Ej: Glaciología certificada Torres del Paine')}
                  value={guideSpecialty}
                  onChange={(e) => setGuideSpecialty(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 font-mono block">{t('res.operationalStatus', 'ESTADO OPERATIVO')}</label>
                <select
                  id="form-guide-status"
                  value={guideStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGuideStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-slate-200 text-xs font-bold"
                >
                  <option value="Disponible">{t('res.statusAvailable', '🟢 Disponible')}</option>
                  <option value="En tour">{t('res.statusOnTour', '🔵 En tour activo')}</option>
                  <option value="Offline">{t('res.statusOffline', '🔴 Offline / Licencia')}</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  id="btn-save-guide"
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} />
                  <span>{t('res.saveGuide', 'Guardar Guía')}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Vehicle Form Modal */}
      {isVehicleFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="font-display font-black text-sm text-white tracking-tight">
                  {editingVehicle ? t('res.editVehicleTitle', 'Editar Unidad de Flota') : t('res.newVehicleTitle', 'Nueva Unidad de Transporte')}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{t('res.vehicleFormSubtitle', 'Indica plazas de seguridad homologadas.')}</p>
              </div>

              <button
                id="btn-close-vehicle-form"
                onClick={() => setIsVehicleFormOpen(false)}
                 className="relative z-10 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">{t('res.denominationLabel', 'DENOMINACIÓN / MARCA Y PATENTE *')}</label>
                <input
                  id="form-vehicle-name"
                  type="text"
                  required
                  placeholder={t('res.phVehicle', 'Ej: Sprinter Mercedes Benz')}
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">{t('res.seatsLabel', 'NÚMERO DE PLAZAS / ASIENTOS *')}</label>
                <input
                  id="form-vehicle-seats"
                  type="number"
                  required
                  min="2"
                  max="100"
                  value={vehicleSeats}
                  onChange={(e) => setVehicleSeats(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 font-mono block">{t('res.operationalStatus', 'ESTADO OPERATIVO')}</label>
                <select
                  id="form-vehicle-status"
                  value={vehicleStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVehicleStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-slate-200 text-xs font-bold"
                >
                  <option value="Disponible">{t('res.statusAvailable', '🟢 Disponible')}</option>
                  <option value="En uso">{t('res.statusOnRoute', '🔵 En ruta activa')}</option>
                  <option value="Offline">{t('res.statusMaintenance', '🔴 Mantenimiento')}</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  id="btn-save-vehicle"
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} />
                  <span>{t('res.saveVehicle', 'Guardar Vehículo')}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
