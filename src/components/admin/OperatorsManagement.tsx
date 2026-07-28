import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  Search, Plus, Edit, Trash2, Check, X, Eye,
  ShieldCheck, AlertCircle, Building2, MapPin,
  ChevronDown, ChevronUp, Mail, Phone
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

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  'OPERATOR': { label: 'Operador', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: '✓' },
  'TOUR_ADMIN': { label: 'Admin Tours', color: 'text-sky-500', bg: 'bg-sky-500/10', icon: '★' },
  'PLATFORM_ADMIN': { label: 'Plataforma', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: '◆' },
  'CUSTOMER': { label: 'Cliente', color: 'text-slate-500', bg: 'bg-slate-500/10', icon: '•' },
};

const countryFlags: Record<string, string> = {
  'Chile': '🇨🇱',
  'Argentina': '🇦🇷',
  'Perú': '🇵🇪',
  'México': '🇲🇽',
  'Colombia': '🇨🇴',
  'Ecuador': '🇪🇨',
  'Bolivia': '🇧🇴',
  'Brasil': '🇧🇷',
};

export default function OperatorsManagement({
  operators,
  tours,
  onSaveOperator,
  onDeleteOperator,
  currentRole,
  currentOperator,
}: OperatorsManagementProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<string>('OPERATOR');
  const [formDescription, setFormDescription] = useState('');

  const isPlatformAdmin = currentRole === 'platform-admin';
  const isTourAdmin = currentRole === 'tour-admin';

  const operatorToursMap = useMemo(() => {
    const map: Record<string, number> = {};
    (tours || []).forEach((tour: Record<string, unknown>) => {
      const opId = typeof tour.operatorId === 'string' ? tour.operatorId : null;
      const opName = typeof tour.operator === 'string' ? tour.operator : null;
      if (opId) {
        map[opId] = (map[opId] || 0) + 1;
      } else if (opName) {
        map[opName] = (map[opName] || 0) + 1;
      }
    });
    return map;
  }, [tours]);

  const filteredOperators = operators.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = useMemo(() => {
    const total = operators.length;
    const operatorsCount = operators.filter((o) => o.role === 'OPERATOR').length;
    const tourAdminsCount = operators.filter((o) => o.role === 'TOUR_ADMIN').length;
    const platformAdminsCount = operators.filter((o) => o.role === 'PLATFORM_ADMIN').length;
    return { total, operatorsCount, tourAdminsCount, platformAdminsCount };
  }, [operators]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('OPERATOR');
    setFormDescription('');
    setEditingOperator(null);
  };

  const handleOpenForm = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormName(operator.name);
      setFormEmail(operator.email);
      setFormRole(operator.role);
      setFormDescription(operator.description || '');
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
    };
    if (editingOperator) {
      data.id = editingOperator.id;
    }
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

  const getToursCount = (op: Operator): number => {
    return operatorToursMap[op.id] || operatorToursMap[op.name] || 0;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-amber-500">👥</span>
            {t('operators.title', 'Gestión de Operadores')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t('operators.subtitle', 'Tour operadores registrados, de prueba y formulario de alta')}</p>
        </div>
        {isPlatformAdmin && (
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            {t('operators.addNew', 'Nuevo Operador')}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('operators.stats.total', 'Total')}</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">{t('operators.stats.operators', 'Operadores')}</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.operatorsCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-1">{t('operators.stats.admins', 'Admins')}</div>
          <div className="text-2xl font-bold text-sky-400">{stats.tourAdminsCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">{t('operators.stats.platform', 'Plataforma')}</div>
          <div className="text-2xl font-bold text-amber-400">{stats.platformAdminsCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('operators.searchPlaceholder', 'Buscar por nombre, email, descripción...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none appearance-none"
        >
          <option value="all">{t('operators.filter.all', 'Todos los roles')}</option>
          <option value="OPERATOR">{t('operators.filter.operators', 'Operadores')}</option>
          <option value="TOUR_ADMIN">{t('operators.filter.admins', 'Admins Tours')}</option>
          <option value="PLATFORM_ADMIN">{t('operators.filter.platform', 'Plataforma')}</option>
        </select>
      </div>

      {/* Operators Table */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-slate-900/50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.table.name', 'Operador')}</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.table.contact', 'Contacto')}</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.table.role', 'Rol')}</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.table.tours', 'Tours')}</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('operators.table.registered', 'Registro')}</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-32">{t('operators.table.actions', 'Acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    {t('operators.empty', 'No se encontraron operadores')}
                  </td>
                </tr>
              ) : (
                filteredOperators.map((operator) => {
                  const roleKey = operator.role || 'CUSTOMER';
                  const status = statusConfig[roleKey] || statusConfig['CUSTOMER'];
                  const toursCount = getToursCount(operator);
                  return (
                    <tr key={operator.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
                            {operator.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{operator.name}</p>
                            <p className="text-[10px] text-slate-500">{operator.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[10px] text-slate-400">
                          <p className="flex items-center gap-1">
                            <Mail size={9} />
                            {operator.email}
                          </p>
                          <p className="flex items-center gap-1">
                            <Phone size={9} />
                            {t('operators.table.noPhone', 'Sin teléfono')}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
                          {status.icon}
                          {t(`operators.status.${roleKey.toLowerCase()}`, status.label)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">{toursCount}</td>
                      <td className="px-4 py-3 text-[10px] text-slate-500">{operator.createdAt ? new Date(operator.createdAt).toISOString().split('T')[0] : '—'}</td>
                      <td className="px-4 py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewDetail(operator)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                            title={t('operators.actions.view', 'Ver detalles')}
                          >
                            <Eye size={13} />
                          </button>
                          {isPlatformAdmin && (
                            <>
                              <button
                                onClick={() => handleOpenForm(operator)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded transition-colors"
                                title={t('operators.actions.edit', 'Editar')}
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(operator)}
                                className="p-1.5 bg-slate-800/30 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                title={t('operators.actions.delete', 'Eliminar')}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
              {/* Status Badge */}
              <div className="flex items-center gap-4 flex-wrap">
                {(() => {
                  const roleKey = selectedOperator.role || 'CUSTOMER';
                  const status = statusConfig[roleKey] || statusConfig['CUSTOMER'];
                  return (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
                      {status.icon}
                      {t(`operators.status.${roleKey.toLowerCase()}`, status.label)}
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">{t('operators.detail.info', 'Información General')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-sm">{t('operators.detail.name', 'Nombre')}</span>
                      <span className="text-white font-medium">{selectedOperator.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-sm">{t('operators.detail.email', 'Email')}</span>
                      <span className="text-white font-medium">{selectedOperator.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-sm">{t('operators.detail.role', 'Rol')}</span>
                      <span className="text-white font-medium">{(statusConfig[selectedOperator.role] || statusConfig['CUSTOMER']).label}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-sm">{t('operators.detail.created', 'Creado')}</span>
                      <span className="text-white font-medium">{selectedOperator.createdAt ? new Date(selectedOperator.createdAt).toISOString().split('T')[0] : '—'}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">{t('operators.detail.description', 'Descripción')}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedOperator.description || '—'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">{t('operators.detail.tours', 'Tours del operador')}</h3>
                  {(() => {
                    const opTours = (tours || []).filter((tour: Record<string, unknown>) => {
                      const opId = typeof tour.operatorId === 'string' ? tour.operatorId : null;
                      const opName = typeof tour.operator === 'string' ? tour.operator : null;
                      return opId === selectedOperator.id || opName === selectedOperator.name;
                    });
                    if (opTours.length === 0) {
                      return <p className="text-slate-500 text-sm">{t('operators.detail.noTours', 'Sin tours asociados')}</p>;
                    }
                    return (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {opTours.map((tour: Record<string, unknown>) => (
                          <div key={tour.id as string} className="p-3 bg-slate-900/50 border border-white/5 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{tour.title as string}</p>
                              <p className="text-[10px] text-slate-500">{tour.location as string}</p>
                            </div>
                            <span className="text-[10px] text-slate-400">{(tour.status as string) || 'PUBLISHED'}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-500">{getToursCount(selectedOperator)}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('operators.detail.toursCount', 'Tours Activos')}</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-white">{selectedOperator.createdAt ? new Date(selectedOperator.createdAt).toISOString().split('T')[0] : '—'}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('operators.detail.registered', 'Fecha Registro')}</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-400">{(statusConfig[selectedOperator.role] || statusConfig['CUSTOMER']).label}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('operators.detail.role', 'Rol')}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setShowDetail(false)} className="fixed bottom-4 right-4 z-50 p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-xl transition-colors">
              <X size={24} />
            </button>
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
                {editingOperator ? t('operators.form.editTitle', 'Editar Operador') : t('operators.form.newTitle', 'Nuevo Operador')}
              </h2>
              <button onClick={handleCloseForm} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmitForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('operators.form.name', 'Nombre del Operador')}</label>
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
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('operators.form.email', 'Email')}</label>
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

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('operators.form.role', 'Rol')}</label>
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
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('operators.form.description', 'Descripción')}</label>
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
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors"
                >
                  {t('common.cancel', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check size={16} />
                  {editingOperator ? t('common.save', 'Guardar') : t('common.create', 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
