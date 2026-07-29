import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  LayoutDashboard, Map, Sparkles, Compass, Sliders,
  CalendarCheck, Users, QrCode, ChevronLeft, ChevronRight,
  LogOut, UserCheck, ShieldCheck, Activity, ShieldAlert, CheckCircle2, Menu, X, Lock
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import { normalizeDbRole } from '../../services/mappers';
import { useAuth } from '../../context/AuthContext';
import { Tour, Booking, Guide, Vehicle, Slide, PwaCheckin, UserRole, ActiveTab } from './types';

import TabErrorBoundary from './ErrorBoundary';
import Sidebar from './Sidebar';

// Lazy-load all tab components for code-splitting
const DashboardOverview = lazy(() => import('./DashboardOverview'));
const LogisticsMap = lazy(() => import('./LogisticsMap'));
const AiCopilot = lazy(() => import('./AiCopilot'));
const ToursManagement = lazy(() => import('./ToursManagement'));
const SliderManagement = lazy(() => import('./SliderManagement'));
const BookingsManagement = lazy(() => import('./BookingsManagement'));
const ResourcesManagement = lazy(() => import('./ResourcesManagement'));
const PwaCheckinComponent = lazy(() => import('./PwaCheckin'));
const TouristsManagement = lazy(() => import('./TouristsManagement'));
const OperatorsManagement = lazy(() => import('./OperatorsManagement'));
const CustomerPortal = lazy(() => import('./CustomerPortal'));

interface AdminPanelProps {
  tours?: Tour[];
  bookings?: Booking[];
  guides?: Guide[];
  vehicles?: Vehicle[];
  slides?: Slide[];
  offlineQueue?: PwaCheckin[];
  prefilledTour?: Tour | null;
  onSaveTour?: (tour: Tour) => void;
  onDeleteTour?: (id: string) => void;
  onSaveSlide?: (slide: Slide) => void;
  onDeleteSlide?: (id: string) => void;
  onSaveBooking?: (booking: Booking) => void;
  onDeleteBooking?: (id: string) => void;
  onSaveGuide?: (guide: Guide) => void;
  onDeleteGuide?: (id: string) => void;
  onSaveVehicle?: (vehicle: Vehicle) => void;
  onDeleteVehicle?: (id: string) => void;
  onAddOfflineCheckin?: (checkin: PwaCheckin) => void;
  onSyncQueue?: () => void;
  onAddGeneratedTour?: (tour: Tour) => void;
  currentUser?: unknown;
  users?: unknown[];
  currentHash?: string;
  onHashChange?: (hash: string) => void;
}

const MENU_ITEMS: { id: ActiveTab; label: string; desc: string; icon: React.ElementType; roles: string[] }[] = [
  { id: 'dashboard', label: 'admin.dashboard', desc: 'admin.dashboardDesc', icon: LayoutDashboard, roles: ['platform-admin', 'tour-admin', 'operator'] },
  { id: 'logistics', label: 'admin.logistics', desc: 'admin.logisticsDesc', icon: Map, roles: ['platform-admin', 'tour-admin'] },
  { id: 'copilot', label: 'admin.copilot', desc: 'admin.copilotDesc', icon: Sparkles, roles: ['platform-admin', 'tour-admin'] },
  { id: 'tours', label: 'admin.tours', desc: 'admin.toursDesc', icon: Compass, roles: ['platform-admin', 'tour-admin', 'operator'] },
  { id: 'slider', label: 'admin.slider', desc: 'admin.sliderDesc', icon: Sliders, roles: ['platform-admin', 'tour-admin'] },
  { id: 'bookings', label: 'admin.bookings', desc: 'admin.bookingsDesc', icon: CalendarCheck, roles: ['platform-admin', 'tour-admin', 'operator'] },
  { id: 'resources', label: 'admin.resources', desc: 'admin.resourcesDesc', icon: Users, roles: ['platform-admin', 'tour-admin', 'operator'] },
  { id: 'pwa', label: 'admin.pwa', desc: 'admin.pwaDesc', icon: QrCode, roles: ['platform-admin', 'tour-admin', 'operator'] },
  { id: 'operators', label: 'admin.operators', desc: 'admin.operatorsDesc', icon: Users, roles: ['platform-admin', 'tour-admin'] },
  { id: 'tourists', label: 'admin.tourists', desc: 'admin.touristsDesc', icon: UserCheck, roles: ['platform-admin'] },
];

export default function AdminPanel({
  tours: toursProp,
  bookings: bookingsProp,
  guides: guidesProp,
  vehicles: vehiclesProp,
  slides: slidesProp,
  offlineQueue: offlineQueueProp,
  prefilledTour: prefilledTourProp,
  onSaveTour,
  onDeleteTour,
  onSaveSlide,
  onDeleteSlide,
  onSaveBooking,
  onDeleteBooking,
  onSaveGuide,
  onDeleteGuide,
  onSaveVehicle,
  onDeleteVehicle,
  onAddOfflineCheckin,
  onSyncQueue,
  onAddGeneratedTour,
  currentUser: _currentUserProp,
  users: _users,
  currentHash: currentHashProp,
  onHashChange,
}: AdminPanelProps) {
  const { t } = useTranslation();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [currentHash, setCurrentHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  });

  const _currentUser = _currentUserProp ?? auth.currentUser;
  const currentUserRecord = (_currentUser as Record<string, unknown> | undefined);
  const currentRole: UserRole = currentUserRecord?.role
    ? normalizeDbRole(currentUserRecord.role as string)
    : (auth.currentRole || 'customer');
  const currentOperator: string = (currentUserRecord?.operatorName as string) || auth.currentOperator || 'Andes Expeditions';
  const _currentOperator = currentOperator;

  const [tours, setTours] = useState<Tour[]>(toursProp || []);
  const [bookings, setBookings] = useState<Booking[]>(bookingsProp || []);
  const [guides, setGuides] = useState<Guide[]>(guidesProp || []);
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesProp || []);
  const [slides, setSlides] = useState<Slide[]>(slidesProp || []);
  const [offlineQueue, setOfflineQueue] = useState<PwaCheckin[]>(offlineQueueProp || []);
  const [prefilledTour, setPrefilledTour] = useState<Tour | null>(prefilledTourProp || null);
  const [operators, setOperators] = useState<Array<Record<string, unknown>>>([]);

  const resolveOperatorId = useCallback((tour: Record<string, unknown>): string | null => {
    if (tour && typeof tour.operatorId === 'string' && tour.operatorId) return tour.operatorId;
    const opName = typeof tour.operator === 'string' ? tour.operator : undefined;
    const users = Array.isArray(_users) ? (_users as Array<Record<string, unknown>>) : [];
    const match = users.find((u) => u && (u.name === opName || u.operatorName === opName));
    if (match && typeof match.id === 'string') return match.id;
    const cu = _currentUser as Record<string, unknown> | undefined;
    if (cu && typeof cu.operatorId === 'string') return cu.operatorId;
    return null;
  }, [_users, _currentUser]);

  const resolveCurrentOperatorId = useCallback((): string | null => {
    const cu = _currentUser as Record<string, unknown> | undefined;
    if (cu && typeof cu.operatorId === 'string' && cu.operatorId) return cu.operatorId;
    const users = Array.isArray(_users) ? (_users as Array<Record<string, unknown>>) : [];
    const match = users.find((u) => u && (u.name === _currentOperator || u.operatorName === _currentOperator));
    if (match && typeof match.id === 'string') return match.id;
    return null;
  }, [_users, _currentOperator, _currentUser]);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const applyProps = () => {
      if (toursProp) setTours(toursProp);
      if (bookingsProp) setBookings(bookingsProp);
      if (guidesProp) setGuides(guidesProp);
      if (vehiclesProp) setVehicles(vehiclesProp);
      if (slidesProp) setSlides(slidesProp);
      if (offlineQueueProp) setOfflineQueue(offlineQueueProp);
      if (prefilledTourProp !== undefined) setPrefilledTour(prefilledTourProp);
    };

    const hasAllProps = Boolean(toursProp && bookingsProp && guidesProp && vehiclesProp);
    const hasNoProps = Boolean(!toursProp && !bookingsProp && !guidesProp && !vehiclesProp);
    if (hasAllProps || hasNoProps) {
      applyProps();
    } else {
      dataService.getTours()
        .then(setTours)
        .catch((error) => {
          console.error('Error loading tours:', error);
          showToast(t('admin.errorLoadingTours', 'Error cargando tours.'), 'warning');
        });
      dataService.getBookings()
        .then(setBookings)
        .catch((error) => {
          console.error('Error loading bookings:', error);
        });
      dataService.getGuides()
        .then(setGuides)
        .catch((error) => {
          console.error('Error loading guides:', error);
        });
      dataService.getVehicles()
        .then(setVehicles)
        .catch((error) => {
          console.error('Error loading vehicles:', error);
        });
      dataService.getSliderSlides()
        .then(setSlides)
        .catch((error) => {
          console.error('Error loading slides:', error);
        });
    }
    // Load operators (users with role OPERATOR, TOUR_ADMIN, PLATFORM_ADMIN)
    dataService.getUsers()
      .then((users) => {
        const ops = (users as Array<Record<string, unknown>>).filter(
          (u) => u && (u.role === 'operator' || u.role === 'tour-admin' || u.role === 'platform-admin')
        );
        setOperators(ops);
      })
      .catch((error) => {
        console.error('Error loading operators:', error);
      });
  }, [
      toursProp,
      bookingsProp,
      guidesProp,
      vehiclesProp,
      slidesProp,
      offlineQueueProp,
      prefilledTourProp,
      t
    ]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#admin' || hash.startsWith('#admin/')) {
        showToast(t('admin.credentialsValidated', 'Credenciales B2B validadas. Bienvenido a BuscaTours.'), 'success');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [t, showToast]);

  const handleSaveTour = async (savedTour: Tour) => {
    const tourWithOperator = { ...(savedTour as Record<string, unknown>), operatorId: resolveOperatorId(savedTour as Record<string, unknown>) } as Tour;
    try {
      if (onSaveTour) {
        onSaveTour(tourWithOperator);
      } else {
        const result = await dataService.saveTour(tourWithOperator);
        setTours((prev) => {
          const exists = prev.some((t) => t.id === result.id);
          return exists ? prev.map((t) => (t.id === result.id ? result : t)) : [...prev, result];
        });
      }
      showToast(`${t('admin.tourConsolidatedStart', 'El tour "')}${savedTour.title}${t('admin.tourConsolidatedEnd', '" se ha consolidado en el catálogo.')}`, 'success');
    } catch (error) {
      showToast(t('admin.errorSavingTour', 'Error guardando tour: ') + (error as Error).message, 'error');
    }
  };

  const handleDeleteTour = async (id: string) => {
    try {
      if (onDeleteTour) {
        onDeleteTour(id);
      } else {
        await dataService.deleteTour(id);
        setTours((prev) => prev.filter((t) => t.id !== id));
      }
      showToast(t('admin.tourRemoved', 'El tour ha sido removido de forma definitiva.'), 'warning');
    } catch (error) {
      showToast(t('admin.errorDeletingTour', 'Error eliminando tour: ') + (error as Error).message, 'error');
    }
  };

  const handleSaveSlide = async (savedSlide: Slide) => {
    try {
      if (onSaveSlide) {
        onSaveSlide(savedSlide);
        return;
      }
      const result = await dataService.saveSliderSlides([savedSlide]);
      const saved = result[0];
      setSlides((prev) => {
        const exists = prev.some((s) => s.id === saved.id);
        return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
      });
      showToast(t('admin.slideSaved', 'La diapositiva de portada ha sido guardada.'), 'success');
    } catch (error) {
      showToast(t('admin.errorSavingSlide', 'Error guardando slide: ') + (error as Error).message, 'error');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      if (onDeleteSlide) {
        onDeleteSlide(id);
        return;
      }
      await dataService.deleteSliderSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      showToast(t('admin.slideRemoved', 'Diapositiva removida.'), 'warning');
    } catch (error) {
      showToast(t('admin.errorDeletingSlide', 'Error eliminando slide: ') + (error as Error).message, 'error');
    }
  };

  const handleSaveBooking = async (savedBooking: Booking) => {
    try {
      if (onSaveBooking) {
        onSaveBooking(savedBooking);
        return;
      }
      const result = await dataService.addBooking(savedBooking);
      setBookings((prev) => {
        const exists = prev.some((b) => b.id === result.id);
        return exists ? prev.map((b) => (b.id === result.id ? result : b)) : [result, ...prev];
      });
      showToast(`${t('admin.bookingConsolidated', 'Reserva consolidada para ')}${savedBooking.customerName}.`, 'success');
    } catch (error) {
      showToast(t('admin.errorSavingBooking', 'Error guardando reserva: ') + (error as Error).message, 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      if (onDeleteBooking) {
        onDeleteBooking(id);
        return;
      }
      await dataService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showToast(t('admin.bookingCancelled', 'Reserva cancelada y removida del panel.'), 'warning');
    } catch (error) {
      showToast(t('admin.errorDeletingBooking', 'Error eliminando reserva: ') + (error as Error).message, 'error');
    }
  };

  const handleSaveGuide = async (savedGuide: Guide) => {
    const guideWithOperator = { ...(savedGuide as Record<string, unknown>), operatorId: resolveCurrentOperatorId() } as Guide;
    try {
      if (onSaveGuide) {
        onSaveGuide(guideWithOperator);
        return;
      }
      const result = await dataService.saveGuide(guideWithOperator);
      setGuides((prev) => {
        const exists = prev.some((g) => g.id === result.id);
        return exists ? prev.map((g) => (g.id === result.id ? result : g)) : [...prev, result];
      });
      showToast(`${t('admin.guideUpdated', 'Guía ')}${savedGuide.name}${t('admin.guideUpdatedEnd', ' actualizado.')}`, 'success');
    } catch (error) {
      showToast(t('admin.errorSavingGuide', 'Error guardando guía: ') + (error as Error).message, 'error');
    }
  };

  const handleDeleteGuide = async (id: string) => {
    try {
      if (onDeleteGuide) {
        onDeleteGuide(id);
        return;
      }
      await dataService.deleteGuide(id);
      setGuides((prev) => prev.filter((g) => g.id !== id));
      showToast(t('admin.guideRemoved', 'Guía removido.'), 'warning');
    } catch (error) {
      showToast(t('admin.errorDeletingGuide', 'Error eliminando guía: ') + (error as Error).message, 'error');
    }
  };

  const handleSaveVehicle = async (savedVehicle: Vehicle) => {
    const vehicleWithOperator = { ...(savedVehicle as Record<string, unknown>), operatorId: resolveCurrentOperatorId() } as Vehicle;
    try {
      if (onSaveVehicle) {
        onSaveVehicle(vehicleWithOperator);
        return;
      }
      const result = await dataService.saveVehicle(vehicleWithOperator);
      setVehicles((prev) => {
        const exists = prev.some((v) => v.id === result.id);
        return exists ? prev.map((v) => (v.id === result.id ? result : v)) : [...prev, result];
      });
      showToast(`${t('admin.vehicleUpdated', 'Unidad de flota ')}${savedVehicle.name}${t('admin.vehicleUpdatedEnd', ' actualizada.')}`, 'success');
    } catch (error) {
      showToast(t('admin.errorSavingVehicle', 'Error guardando vehículo: ') + (error as Error).message, 'error');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      if (onDeleteVehicle) {
        onDeleteVehicle(id);
        return;
      }
      await dataService.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast(t('admin.vehicleRetired', 'Vehículo retirado de servicio.'), 'warning');
    } catch (error) {
      showToast(t('admin.errorDeletingVehicle', 'Error eliminando vehículo: ') + (error as Error).message, 'error');
    }
  };

  const handleAddOfflineCheckin = (checkin: PwaCheckin) => {
    setOfflineQueue((prev) => [...prev, checkin]);
    onAddOfflineCheckin?.(checkin);
  };

  const handleSyncQueue = async () => {
    if (offlineQueue.length === 0) {
      showToast(t('admin.queueEmpty', 'Cola de sincronización vacía.'), 'warning');
      return;
    }

    showToast(t('admin.syncingQueue', 'Sincronizando cola offline...'), 'success');
    
    try {
      if (onSyncQueue) {
        onSyncQueue();
      } else {
        await dataService.syncOfflineQueue(currentOperator);
      }
      setOfflineQueue([]);
      showToast(t('admin.syncComplete', 'Sincronización completada. Check-ins convertidos a reservas.'), 'success');
      
      const bookingsData = await dataService.getBookings();
      setBookings(bookingsData);
    } catch (error) {
      showToast(t('admin.errorSyncing', 'Error sincronizando: ') + (error as Error).message, 'error');
    }
  };

  const handleSaveOperator = async (savedOperator: Record<string, unknown>) => {
    try {
      // Use addUser to create/update the operator in the DB
      const result = await dataService.addUser({
        name: savedOperator.name as string,
        email: savedOperator.email as string,
        role: savedOperator.role as string,
      });
      const updatedOps = (result as Array<Record<string, unknown>>).filter(
        (u) => u && (u.role === 'operator' || u.role === 'tour-admin' || u.role === 'platform-admin')
      );
      setOperators(updatedOps);
      showToast(`Operador "${savedOperator.name}" guardado correctamente.`, 'success');
    } catch (error) {
      showToast('Error guardando operador: ' + (error as Error).message, 'error');
    }
  };

  const handleDeleteOperator = async (id: string) => {
    try {
      // Note: dataService doesn't have a deleteUser method, so we just remove from local state
      setOperators((prev) => prev.filter((o) => o.id !== id));
      showToast('Operador removido del listado.', 'warning');
    } catch (error) {
      showToast('Error eliminando operador: ' + (error as Error).message, 'error');
    }
  };

  const handleAddGeneratedTour = async (generated: Tour) => {
    try {
      const tourWithOperator = { ...(generated as Record<string, unknown>), operatorId: resolveOperatorId(generated as Record<string, unknown>) } as Tour;
      const result = await dataService.saveTour(tourWithOperator);
      setPrefilledTour(result);
      setActiveTab('tours');
      showToast(t('admin.tourImported', 'Tour generado importado al formulario. Revisa los campos y consolida.'), 'success');
    } catch (error) {
      showToast('Error guardando tour generado: ' + (error as Error).message, 'error');
    }
  };

  const isAdminRoute = currentHash === '#admin' || currentHash.startsWith('#admin/');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950" id="main-app-container">
      
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 max-w-sm backdrop-blur-md ${
            notification.type === 'error' 
              ? 'bg-rose-950/95 border-rose-800 text-rose-200' 
              : notification.type === 'warning'
              ? 'bg-amber-950/95 border-amber-800 text-amber-200'
              : 'bg-slate-900/95 border-white/5 text-slate-100'
          }`}
          id="notification-toast"
        >
          {notification.type === 'error' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400 flex-shrink-0">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : notification.type === 'warning' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 flex-shrink-0">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          <div className="text-xs font-semibold leading-snug">
            {notification.message}
          </div>
        </div>
      )}

      {!isAdminRoute ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden" id="portal-view">
          
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div 
            className="max-w-xl w-full text-center space-y-6 relative z-10"
          >
            <div className="inline-flex p-4 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-3xl text-slate-950 shadow-xl shadow-amber-500/10 mb-1">
              <Compass size={44} className="animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase block">{t('adminPlatformLabel')}</span>
              <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
                BuscaTours Admin Panel
              </h1>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                {t('adminConsoleDesc')}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-white/5 p-4.5 rounded-2xl text-left space-y-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold font-mono uppercase tracking-wider">
                <ShieldAlert size={14} className="text-amber-500" />
                <span>{t('adminLocalhostRoute')}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {t('adminLocalhostDesc1')}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {t('adminLocalhostDesc2')}
              </p>
              </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="btn-enter-admin"
                onClick={() => {
                  window.location.hash = '#admin';
                }}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/10 transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 text-xs"
              >
                <span>{t('adminEnterPanel')}</span>
                <span className="font-mono bg-slate-950 text-amber-500 px-1.5 py-0.5 rounded text-[9px]">HASH</span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen" id="admin-view">
          
          <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 w-full" id="bt-mobile-header">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-lg text-slate-950 font-black flex-shrink-0">
                <span className="font-display tracking-wider text-xs uppercase">BT</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white uppercase leading-none font-display">
                  BuscaTours
                </span>
                <span className="text-[8px] font-mono font-bold text-amber-500 leading-none mt-0.5">
                  B2B ADMIN
                </span>
              </div>
            </div>

            <button
              id="btn-toggle-mobile-sidebar"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>

          {mobileMenuOpen && (
              <>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-sm"
                  id="bt-mobile-drawer-backdrop"
                />
                <div
                  className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/5 z-50 md:hidden flex flex-col justify-between"
                  id="bt-mobile-drawer"
                >
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="p-5 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-slate-950 font-bold flex-shrink-0 shadow-lg shadow-amber-500/10">
                          <span className="font-display tracking-wider text-sm font-black">BT</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm tracking-tight text-white font-display uppercase leading-tight">
                            BuscaTours
                          </span>
                          <span className="text-[10px] font-mono font-bold text-amber-500 leading-none">
                            B2B ADMIN PORTAL
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <nav className="p-4 space-y-1 mt-2">
                      {MENU_ITEMS.map((item) => {
                        const IconComponent = item.icon;
                        const hasAccess = item.roles.includes(currentRole);
                        const isSelected = activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            id={`mobile-nav-${item.id}`}
                            disabled={!hasAccess}
                            onClick={() => {
                              setActiveTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                              isSelected 
                                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                                : !hasAccess 
                                  ? 'opacity-40 cursor-not-allowed border border-transparent' 
                                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5'
                            }`}
                          >
                            <div className="relative">
                              <IconComponent 
                                size={16} 
                                className={isSelected ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'} 
                              />
                              {!hasAccess && (
                                <div className="absolute -top-1 -right-1 bg-slate-950 p-0.5 rounded-full border border-white/10">
                                  <Lock size={8} className="text-red-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-start text-left">
                              <span>{item.label}</span>
                              <span className={`text-[9px] font-normal font-mono leading-none mt-0.5 ${
                                isSelected ? 'text-slate-800' : 'text-slate-500'
                              }`}>
                                {item.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </nav>

                    <div className="p-4 border-t border-white/5">
                      <div className="p-3 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-semibold text-slate-500 font-mono uppercase">{t('admin.platformConnection', 'CONEXIÓN PLATAFORMA')}</span>
                          <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ONLINE
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono leading-relaxed">
                          SATCOM: ACTIVE<br />
                          PWA: READY (SYNC OK)
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            window.location.hash = '';
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-950/20 border border-rose-500/10 transition-all"
                        >
                          <LogOut size={13} />
                          <span>{t('sidebarLogout')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <Sidebar 
              activeTab={activeTab} 
              onChangeTab={setActiveTab} 
              currentRole={currentRole} 
            />

            <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-slate-950">
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-20">
                
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-300">
                    {t('adminActiveOperator')} <strong className="text-amber-500">{currentRole === 'operator' ? currentOperator : t('adminAllPlatform')}</strong>
                  </div>
                </div>

                <div className="relative">
                </div>

              </div>

              <div className="flex-1 p-5 md:p-7 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
                      {t('admin.console', 'CONSOLA')} / {activeTab}
                    </span>
                    <h2 className="text-xl font-black font-display text-white tracking-tight mt-0.5 capitalize">
                      {activeTab === 'dashboard' ? t('tabTitleDashboard') : 
                       activeTab === 'logistics' ? t('tabTitleLogistics') : 
                       activeTab === 'copilot' ? t('tabTitleCopilot') : 
                       activeTab === 'tours' ? t('tabTitleTours') : 
                       activeTab === 'slider' ? t('tabTitleSlider') : 
                       activeTab === 'bookings' ? t('tabTitleBookings') : 
                       activeTab === 'resources' ? t('tabTitleResources') : 
                       activeTab === 'pwa' ? t('tabTitlePwa') :
                       activeTab === 'tourists' ? t('tabTitleTourists') :
                       t('tabTitleGeneral')}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs bg-slate-900 border border-white/5 rounded-xl px-3 py-1.5 font-sans text-slate-400 self-start sm:self-auto">
                    <Activity size={14} className="text-emerald-400 animate-pulse" />
                    <span>{t('admin.activeRole', 'Rol Activo')}: <strong className="text-white text-[11px]">{currentRole}</strong></span>
                  </div>
                </div>

                <div
                  key={activeTab + '-' + currentRole + '-' + currentOperator}
                >
                  <TabErrorBoundary key={activeTab + '-' + currentRole + '-' + currentOperator} tabName={activeTab}>
                  {activeTab === 'dashboard' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <DashboardOverview
                        tours={tours}
                        bookings={bookings}
                        guides={guides}
                        vehicles={vehicles}
                        offlineQueueLength={offlineQueue.length}
                        onNavigateToTab={setActiveTab}
                        currentRole={currentRole}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'logistics' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <LogisticsMap />
                    </Suspense>
                  )}

                  {activeTab === 'copilot' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <AiCopilot onAddGeneratedTour={handleAddGeneratedTour} />
                    </Suspense>
                  )}

                  {activeTab === 'tours' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <ToursManagement
                        tours={tours}
                        onSaveTour={handleSaveTour}
                        onDeleteTour={handleDeleteTour}
                        guides={guides}
                        vehicles={vehicles}
                        currentRole={currentRole}
                        currentOperator={currentOperator}
                        prefilledTour={prefilledTour}
                        onClearPrefilledTour={() => setPrefilledTour(null)}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'operators' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <OperatorsManagement
                        operators={operators}
                        tours={tours as unknown as Array<Record<string, unknown>>}
                        onSaveOperator={handleSaveOperator}
                        onDeleteOperator={handleDeleteOperator}
                        currentRole={currentRole}
                        currentOperator={currentOperator}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'slider' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <SliderManagement
                        slides={slides}
                        onSaveSlide={handleSaveSlide}
                        onDeleteSlide={handleDeleteSlide}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'bookings' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <BookingsManagement
                        bookings={bookings}
                        onSaveBooking={handleSaveBooking}
                        onDeleteBooking={handleDeleteBooking}
                        tours={tours}
                        activeCurrency={'USD'}
                        currentRole={currentRole}
                        currentOperator={currentOperator}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'resources' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <ResourcesManagement
                        guides={guides}
                        vehicles={vehicles}
                        onSaveGuide={handleSaveGuide}
                        onDeleteGuide={handleDeleteGuide}
                        onSaveVehicle={handleSaveVehicle}
                        onDeleteVehicle={handleDeleteVehicle}
                        currentRole={currentRole}
                        currentOperator={currentOperator}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'pwa' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <PwaCheckinComponent
                        offlineQueue={offlineQueue}
                        onAddOfflineCheckin={handleAddOfflineCheckin}
                        onSyncQueue={handleSyncQueue}
                        currentOperator={currentOperator}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'tourists' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
                      <TouristsManagement
                        tours={tours}
                        bookings={bookings}
                        currentRole={currentRole}
                        currentOperator={currentOperator}
                      />
                    </Suspense>
                  )}
                  </TabErrorBoundary>
                </div>

              </div>
            </main>
          </div>
      )}
    </div>
  );
}