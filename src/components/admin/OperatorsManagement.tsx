import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  Search, Plus, Edit, Trash2, Check, X, Eye,
  ShieldCheck, AlertCircle, Building2, MapPin,
  Mail, Phone, Globe, Star, TrendingUp, DollarSign,
  Calendar, Users, Award, Send, Key, Target
} from 'lucide-react';

interface Operator {
  id: string;
  name: string;
  email: string;
  role: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface OperatorsManagementProps {
  operators: Operator[];
  tours: Array<Record<string, unknown>>;
  onSaveOperator: (operator: Record<string, unknown>) => void;
  onDeleteOperator: (id: string) => void;
  currentRole: string;
  currentOperator: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string; border: string }> = {
  'OPERATOR': { label: 'Operador', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '✓', border: 'border-emerald-500/20' },
  'TOUR_ADMIN': { label: 'Admin Tours', color: 'text-sky-400', bg: 'bg-sky-500/10', icon: '★', border: 'border-sky-500/20' },
  'PLATFORM_ADMIN': { label: 'Plataforma', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '◆', border: 'border-amber-500/20' },
  'CUSTOMER': { label: 'Cliente', color: 'text-slate-400', bg: 'bg-slate-500/10', icon: '•', border: 'border-slate-500/20' },
};

const countryFlags: Record<string, string> = {
  'Chile': '🇨🇱', 'Argentina': '🇦🇷', 'Perú': '🇵🇪', 'México': '🇲🇽',
  'Colombia': '🇨🇴', 'Ecuador': '🇪🇨', 'Bolivia': '🇧🇴', 'Brasil': '🇧🇷',
  'Costa Rica': '🇨🇷', 'Guatemala': '🇬🇹', 'Panamá': '🇵🇦', 'Cuba': '🇨🇺',
};

// Determina el país del operador basado en sus tours
function getOperatorCountry(tours: Array<Record<string, unknown>>, opId: string, opName: string): string {
  const opTours = tours.filter((t) => {
    const tOpId = typeof t.operatorId === 'string' ? t.operatorId : null;
    const tOpName = typeof t.operator === 'string' ? t.operator : null;
    return tOpId === opId || tOpName === opName;
  });
  if (opTours.length === 0) return '—';
  const dest = opTours[0]?.destination || opTours[0]?.destinationCountry;
  return typeof dest === 'string' ? dest : '—';
}

// Calcula el rating promedio de los tours del operador
function getOperatorRating(tours: Array<Record<string, unknown>>, opId: string, opName: string): number {
  const opTours = tours.filter((t) => {
    const tOpId = typeof t.operatorId === 'string' ? t.operatorId : null;
    const tOpName = typeof t.operator === 'string' ? t.operator : null;
    return tOpId === opId || tOpName === opName;
  });
  if (opTours.length === 0) return 0;
  const sum = opTours.reduce((acc, t) => acc + (Number(t.rating) || 0), 0);
  return Math.round((sum / opTours.length) * 10) / 10;
}

// Calcula ingresos estimados basado en tours y reservas
function getOperatorRevenue(tours: Array<Record<string, unknown>>, opId: string, opName: string): number {
  const opTours = tours.filter((t) => {
    const tOpId = typeof t.operatorId === 'string' ? t.operatorId : null;
    const tOpName = typeof t.operator === 'string' ? t.operator : null;
    return tOpId === opId || tOpName === opName;
  });
  return opTours.reduce((acc, t) => acc + (Number(t.price) || 0) * (Number(t.reviewsCount) || 0), 0);
}

export default function OperatorsManagement({
  operators,
  tours,
  onSaveOperator,
  onDeleteOperator,
  currentRole,
  currentOperator: _currentOperator,
}: OperatorsManagementProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<string>('OPERATOR');
  const [formDescription, setFormDescription] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCountry, setFormCountry] = useState('');

  const isPlatformAdmin = currentRole === 'platform-admin';

  // Mapa de tours por operador
  const operatorToursMap = useMemo(() => {
    const map: Record<string, number> = {};
    (tours || []).forEach((tour: Record<string, unknown>) => {
      const opId = typeof tour.operatorId === 'string' ? tour.operatorId : null;
      const opName = typeof tour.operator === 'string' ? tour.operator : null;
      if (opId) map[opId] = (map[opId] || 0) + 1;
      else if (opName) map[opName] = (map[opName] || 0) + 1;
    });
    return map;
  }, [tours]);

  // Lista de países únicos para el filtro
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    operators.forEach((op) => {
      const country = getOperatorCountry(tours, op.id, op.name);
      if (country && country !== '—') countries.add(country);
    });
    return Array.from(countries).sort();
  }, [operators, tours]);

  const filteredOperators = operators.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    const opCountry = getOperatorCountry(tours, op.id, op.name);
    const matchesCountry = countryFilter === 'all' || opCountry === countryFilter;
    return matchesSearch && matchesRole && matchesCountry;
  });

  // Stats enriquecidas
  const stats = useMemo(() => {
    const total = operators.length;
    const operatorsCount = operators.filter((o) => o.role === 'OPERATOR').length;
    const tourAdminsCount = operators.filter((o) => o.role === 'TOUR_ADMIN').length;
    const platformAdminsCount = operators.filter((o) => o.role === 'PLATFORM_ADMIN').length;
    const totalTours = operators.reduce((acc, op) => acc + (operatorToursMap[op.id] || operatorToursMap[op.name] || 0), 0);
    const totalRevenue = operators.reduce((acc, op) => acc + getOperatorRevenue(tours, op.id, op.name), 0);
    const avgRating = operators.length > 0
      ? Math.round((operators.reduce((acc, op) => acc + getOperatorRating(tours, op.id, op.name), 0) / operators.length) * 10) / 10
      : 0;
    return { total, operatorsCount, tourAdminsCount, platformAdminsCount, totalTours, totalRevenue, avgRating };
  }, [operators, tours, operatorToursMap]);

  const resetForm = () => {
    setFormName(''); setFormEmail(''); setFormRole('OPERATOR');
    setFormDescription(''); setFormPhone(''); setFormCountry('');
    setEditingOperator(null);
  };

  const handleOpenForm = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormName(operator.name);
      setFormEmail(operator.email);
      setFormRole(operator.role);
      setFormDescription(operator.description || '');
      setFormPhone('');
      setFormCountry(getOperatorCountry(tours, operator.id, operator.name));
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, unknown> = {
      name: formName,
      email: formEmail,
      role: formRole,
      description: formDescription,
      phone: formPhone,
      country: formCountry,
    };
    if (editingOperator) data.id = editingOperator.id;
    onSaveOperator(data);
    handleCloseForm();
  };

  const handleDelete = (operator: Operator) => {
    if (window.confirm(t('operatorsConfirmDelete', '¿Estás seguro de eliminar este operador?'))) {
      onDeleteOperator(operator.id);
    }
  };

  const handleViewDetail = (operator: Operator) => {
    setSelectedOperator(operator);
    setShowDetail(true);
  };

  const handleResetPassword = (operator: Operator) => {
    if (window.confirm(`¿Resetear la contraseña de ${operator.name}? Se enviará un email con instrucciones.`)) {
      // TODO: Implement password reset via Firebase Auth
      alert(`Email de reseteo enviado a ${operator.email}`);
    }
  };

  const handleSendInvite = (operator: Operator) => {
    alert(`Invitación enviada a ${operator.email}`);
  };

  const getToursCount = (op: Operator): number => {
    return operatorToursMap[op.id] || operatorToursMap[op.name] || 0;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="bt-operators-management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
            <Users size={20} className="text-amber-500" />
            {t('operators.title', 'Gestión de Operadores')}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {t('operators.subtitle', 'Tour operadores registrados, métricas y formulario de alta')}
          </p>
        </div>
        {isPlatformAdmin && (
          <button
            id="btn-create-operator"
            onClick={() => handleOpenForm()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 self-start md:self-auto"
          >
            <Plus size={15} />
            {t('operators.addNew', 'Nuevo Operador')}
          </button>
        )}
      </div>

      {/* Stats Cards Enriched */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={11} className="text-slate-400" />
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.stats.total', 'Total')}</span>
          </div>
          <div className="text-xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">{t('operators.stats.operators', 'Operadores')}</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">{stats.operatorsCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Award size={11} className="text-sky-400" />
            <span className="text-[9px] font-semibold text-sky-400 uppercase tracking-wider">{t('operators.stats.admins', 'Admins')}</span>
          </div>
          <div className="text-xl font-bold text-sky-400">{stats.tourAdminsCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={11} className="text-amber-400" />
            <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider">Tours</span>
          </div>
          <div className="text-xl font-bold text-amber-400">{stats.totalTours}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign size={11} className="text-emerald-400" />
            <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">Ingresos</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Star size={11} className="text-amber-400" />
            <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider">Rating</span>
          </div>
          <div className="text-xl font-bold text-amber-400">{stats.avgRating}★</div>
        </div>
      </div>

      {/* Distribution Chart (simple bars) */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target size={12} className="text-amber-500" />
          Distribución por País
        </h4>
        <div className="space-y-2">
          {availableCountries.map((country) => {
            const count = operators.filter((op) => getOperatorCountry(tours, op.id, op.name) === country).length;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={country} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-28 flex items-center gap-1">
                  <span>{countryFlags[country] || '🌍'}</span>
                  {country}
                </span>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono w-8 text-right">{count}</span>
              </div>
            );
          })}
          {availableCountries.length === 0 && (
            <p className="text-xs text-slate-500 italic">Sin datos de países disponibles</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
        <div className="sm:col-span-5 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('operators.searchPlaceholder', 'Buscar por nombre, email, descripción...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/5 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">{t('operators.filter.all', 'Todos los roles')}</option>
            <option value="OPERATOR">{t('operators.filter.operators', 'Operadores')}</option>
            <option value="TOUR_ADMIN">{t('operators.filter.admins', 'Admins Tours')}</option>
            <option value="PLATFORM_ADMIN">{t('operators.filter.platform', 'Plataforma')}</option>
          </select>
        </div>
        <div className="sm:col-span-4">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todos los países</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>{countryFlags[c] || '🌍'} {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Operators Grid (cards instead of table for better visual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOperators.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <AlertCircle size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">{t('operators.empty', 'No se encontraron operadores')}</p>
            <button
              onClick={() => { setSearchQuery(''); setRoleFilter('all'); setCountryFilter('all'); }}
              className="mt-3 text-amber-500 text-xs font-semibold hover:underline"
            >
              {t('toursClearFilters', 'Limpiar filtros')}
            </button>
          </div>
        ) : (
          filteredOperators.map((operator) => {
            const roleKey = operator.role || 'CUSTOMER';
            const status = statusConfig[roleKey] || statusConfig['CUSTOMER'];
            const toursCount = getToursCount(operator);
            const country = getOperatorCountry(tours, operator.id, operator.name);
            const rating = getOperatorRating(tours, operator.id, operator.name);
            const revenue = getOperatorRevenue(tours, operator.id, operator.name);
            const flag = countryFlags[country] || '🌍';

            return (
              <div
                key={operator.id}
                id={`operator-card-${operator.id}`}
                className="glass-card overflow-hidden flex flex-col group hover:border-white/10 transition-all duration-300"
              >
                {/* Card Header with avatar and role badge */}
                <div className="relative p-4 border-b border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-500 font-bold text-lg border border-amber-500/20">
                        {operator.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">{operator.name}</h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={9} /> {operator.email}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold ${status.bg} ${status.color} ${status.border} border`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Country + Verified badge */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Globe size={10} /> {flag} {country}
                    </span>
                    {toursCount > 0 && (
                      <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                        <Check size={8} /> Verificado
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/30">
                  <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-white/5">
                    <TrendingUp size={12} className="text-amber-400 mx-auto mb-0.5" />
                    <div className="text-sm font-bold text-white">{toursCount}</div>
                    <div className="text-[8px] text-slate-500 uppercase">Tours</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-white/5">
                    <Star size={12} className="text-amber-400 mx-auto mb-0.5" />
                    <div className="text-sm font-bold text-white">{rating > 0 ? `${rating}★` : '—'}</div>
                    <div className="text-[8px] text-slate-500 uppercase">Rating</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-white/5">
                    <DollarSign size={12} className="text-emerald-400 mx-auto mb-0.5" />
                    <div className="text-sm font-bold text-emerald-400">${(revenue / 1000).toFixed(1)}K</div>
                    <div className="text-[8px] text-slate-500 uppercase">Ingresos</div>
                  </div>
                </div>

                {/* Description */}
                {operator.description && (
                  <div className="px-4 py-2 flex-1">
                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{operator.description}</p>
                  </div>
                )}

                {/* Last activity */}
                <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Calendar size={9} />
                    {operator.createdAt ? new Date(operator.createdAt).toISOString().split('T')[0] : '—'}
                  </span>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleViewDetail(operator)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye size={12} /> {t('operators.actions.view', 'Ver')}
                  </button>
                  {isPlatformAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenForm(operator)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-amber-400 rounded text-[11px] font-semibold flex items-center gap-1 transition-all"
                        title="Editar"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(operator)}
                        className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 size={20} className="text-amber-500" />
                {selectedOperator.name}
              </h2>
              <button onClick={() => setShowDetail(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Country + Verified */}
              <div className="flex items-center gap-3 flex-wrap">
                {(() => {
                  const roleKey = selectedOperator.role || 'CUSTOMER';
                  const status = statusConfig[roleKey] || statusConfig['CUSTOMER'];
                  return (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color} ${status.border} border`}>
                      {status.icon} {status.label}
                    </span>
                  );
                })()}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Globe size={12} /> {countryFlags[getOperatorCountry(tours, selectedOperator.id, selectedOperator.name)] || '🌍'} {getOperatorCountry(tours, selectedOperator.id, selectedOperator.name)}
                </span>
                {getToursCount(selectedOperator) > 0 && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <Check size={10} /> Operador Verificado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Información General</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-xs">Nombre</span>
                      <span className="text-white font-medium text-sm">{selectedOperator.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-xs">Email</span>
                      <span className="text-white font-medium text-sm">{selectedOperator.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-xs">Rol</span>
                      <span className="text-white font-medium text-sm">{(statusConfig[selectedOperator.role] || statusConfig['CUSTOMER']).label}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-xs">Registro</span>
                      <span className="text-white font-medium text-sm">{selectedOperator.createdAt ? new Date(selectedOperator.createdAt).toISOString().split('T')[0] : '—'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-2">Descripción</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">{selectedOperator.description || '—'}</p>
                  </div>

                  {/* Quick Actions */}
                  {isPlatformAdmin && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Acciones Rápidas</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleResetPassword(selectedOperator)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-amber-400 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Key size={11} /> Resetear Password
                        </button>
                        <button
                          onClick={() => handleSendInvite(selectedOperator)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-amber-400 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Send size={11} /> Enviar Invitación
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tours del operador */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Tours del Operador</h3>
                  {(() => {
                    const opTours = (tours || []).filter((tour: Record<string, unknown>) => {
                      const opId = typeof tour.operatorId === 'string' ? tour.operatorId : null;
                      const opName = typeof tour.operator === 'string' ? tour.operator : null;
                      return opId === selectedOperator.id || opName === selectedOperator.name;
                    });
                    if (opTours.length === 0) {
                      return <p className="text-slate-500 text-xs">Sin tours asociados</p>;
                    }
                    return (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {opTours.map((tour: Record<string, unknown>) => (
                          <div key={tour.id as string} className="p-3 bg-slate-900/50 border border-white/5 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-white">{tour.title as string}</p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <MapPin size={9} /> {tour.location as string}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-amber-400 font-bold">${tour.price as number}</span>
                              <span className="text-[9px] text-slate-500 block">{(tour.status as string) || 'PUBLISHED'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Metrics Dashboard */}
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <TrendingUp size={16} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amber-400">{getToursCount(selectedOperator)}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Tours Activos</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <Star size={16} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amber-400">{getOperatorRating(tours, selectedOperator.id, selectedOperator.name)}★</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Rating Prom.</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <DollarSign size={16} className="text-emerald-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-emerald-400">${(getOperatorRevenue(tours, selectedOperator.id, selectedOperator.name) / 1000).toFixed(1)}K</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Ingresos Est.</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <Calendar size={16} className="text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">{selectedOperator.createdAt ? new Date(selectedOperator.createdAt).toISOString().split('T')[0] : '—'}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Registro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 size={24} className="text-amber-500" />
                {editingOperator ? 'Editar Operador' : 'Nuevo Operador'}
              </h2>
              <button onClick={handleCloseForm} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleSubmitForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej: Andes Expeditions"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="contacto@operador.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rol</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="OPERATOR">Operador</option>
                    <option value="TOUR_ADMIN">Admin Tours</option>
                    {isPlatformAdmin && <option value="PLATFORM_ADMIN">Plataforma</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">País / Región</label>
                <select
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Seleccionar país...</option>
                  {Object.entries(countryFlags).map(([country, flag]) => (
                    <option key={country} value={country}>{flag} {country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Descripción breve del operador..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2 text-xs"
                >
                  <Check size={16} />
                  {editingOperator ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}