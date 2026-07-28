import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../data/translations';
import { User, Settings, Bell, Calendar, Heart, Star, Save, Trash2, Send, Download, MapPin, Navigation, Phone, MessageSquare, X } from 'lucide-react';

interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  totalPriceUSD: number;
  gateway: string;
  tourImage: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
}

interface CustomerPortalProps {
  bookings: Booking[];
  tours: Tour[];
  wishlist: string[];
  ecoPoints: number;
  onBack: () => void;
  onRemoveFromWishlist: (id: string) => void;
  onSelectTour: (id: string) => void;
}

export default function CustomerPortal({ bookings, tours, wishlist, ecoPoints, onBack, onRemoveFromWishlist, onSelectTour }: CustomerPortalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('account');
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);
  const [selectedGpsBooking, setSelectedGpsBooking] = useState(null);
  const [gpsSecondsLeft, setGpsSecondsLeft] = useState(504);
  const [gpsTab, setGpsTab] = useState('status');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'driver', text: '¡Hola! Soy Carlos, tu conductor de Busca Tours. Ya voy en camino a buscarte al hotel.', time: '08:32 AM' },
    { id: 2, sender: 'driver', text: 'Voy en una Mercedes Sprinter color gris plata.', time: '08:33 AM' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef(null);

  const [accountForm, setAccountForm] = useState({ name: 'Usuario BuscaTours', email: 'cliente@buscatours.com', phone: '+54 9 11 5555-1234' });
  const [settingsForm, setSettingsForm] = useState({ notifications: true, emailAlerts: true, smsAlerts: false, publicProfile: true });
  const [inbox] = useState([
    { id: 1, type: 'confirmacion', title: 'Reserva Confirmada', message: 'Tu tour a Machu Picchu ha sido confirmado para el 15/08/2026.', time: 'Hace 2 horas', read: false },
    { id: 2, type: 'recordatorio', title: 'Recordatorio de Salida', message: 'Recuerda que mañana tienes tu tour a las 08:30 AM.', time: 'Hace 5 horas', read: false },
    { id: 3, type: 'cancelacion', title: 'Cancelación de Reserva', message: 'Tu reserva para el tour de Patagonia ha sido cancelada.', time: 'Hace 1 día', read: true },
    { id: 4, type: 'info', title: 'Nueva función: Seguimiento GPS', message: 'Ahora puedes seguir tu minibús en tiempo real.', time: 'Hace 2 días', read: true }
  ]);
  const [reviews, setReviews] = useState([
    { id: 1, tour: 'Machu Picchu Full Day', rating: 5, comment: 'Increíble experiencia, muy bien organizado.', date: '2026-06-15' },
    { id: 2, tour: 'Patagonia Express', rating: 4, comment: 'Hermosos paisajes, el conductor muy amable.', date: '2026-05-20' }
  ]);
  const [newReview, setNewReview] = useState({ tourId: '', rating: 5, comment: '' });

  const favoriteTours = tours.filter((t) => wishlist.includes(t.id));

  const handleSendQuickMessage = (text) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text, time: timeNow };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '¡Recibido! Estaré allí en unos minutos.';
      if (text.includes('esperarme')) replyText = 'Sin problema, te espero en el lobby. Avísame cuando bajes.';
      else if (text.includes('patente')) replyText = 'La patente es AX-120-WT. Es un minibús gris de la empresa.';
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'driver', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const formatGpsEta = (seconds) => `${Math.floor(seconds / 60)} min, ${(seconds % 60).toString().padStart(2, '0')} s`;

  const handleSaveAccount = () => alert('Datos de cuenta actualizados correctamente.');
  const handleDeleteAccount = () => { if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) { alert('Cuenta eliminada.'); onBack(); } };
  const handleSaveSettings = () => alert('Configuración guardada correctamente.');
  const handleSubmitReview = () => { if (!newReview.tourId || !newReview.comment) return alert('Completa todos los campos.'); const tour = tours.find(t => t.id === newReview.tourId); setReviews([...reviews, { id: Date.now(), tour: tour ? tour.title : 'Tour desconocido', rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split('T')[0] }]); setNewReview({ tourId: '', rating: 5, comment: '' }); alert('Reseña enviada.'); };

  const inboxIcon = (type) => {
    switch (type) {
      case 'confirmacion': return <Star size={14} color="#22c55e" />;
      case 'recordatorio': return <Bell size={14} color="var(--primary)" />;
      case 'cancelacion': return <X size={14} color="#ef4444" />;
      default: return <MessageSquare size={14} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <button onClick={onBack} className="text-xs text-slate-400 hover:text-white mb-1">&larr; {t('admin.backToSite', 'Volver al sitio')}</button>
          <h1 className="text-lg font-extrabold text-white">{t('profileMyAccount', 'Mi Cuenta Busca Tours')}</h1>
          <p className="text-xs text-slate-400">{t('profileMemberSince', 'Miembro desde Junio 2026 • Categoría: Explorador Frecuente')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-slate-950/50 overflow-x-auto">
        <button onClick={() => setActiveTab('account')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'account' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <User size={13} /> {t('profileTabAccount', 'Mi cuenta')}
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'settings' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Settings size={13} /> {t('profileTabSettings', 'Ajustes')}
        </button>
        <button onClick={() => setActiveTab('inbox')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'inbox' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Bell size={13} /> {t('profileTabInbox', 'Bandeja')}
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'bookings' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Calendar size={13} /> {t('profileMyBookings', 'Reservas')} ({bookings.length})
        </button>
        <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'wishlist' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Heart size={13} /> {t('profileMyFavorites', 'Favoritos')} ({favoriteTours.length})
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Star size={13} /> {t('profileTabReviews', 'Reseñas')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedGpsBooking ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelectedGpsBooking(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              <h3 className="text-sm font-bold text-white">{t('profileTrackingTitle', 'Seguimiento de Traslado')}</h3>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-emerald-400 font-bold">● {t('profileBusOnWay', 'Minibús en camino')} • {selectedGpsBooking.tourTitle}</span>
                <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">{t('profileGpsLive', 'GPS VIVO')}</span>
              </div>
              <div className="bg-slate-950 border border-white/5 rounded p-3 mb-3">
                <div className="flex justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{t('profileEta', 'Arribo Estimado')}</span>
                    <span className="text-lg font-mono font-bold text-amber-500">{formatGpsEta(gpsSecondsLeft)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{t('profileDistance', 'Distancia')}</span>
                    <span className="text-sm font-bold text-white">{(gpsSecondsLeft * 0.005).toFixed(2)} km</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950/50 border border-white/5 rounded">
                <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-lg">👨‍✈️</div>
                <div>
                  <div className="text-xs font-bold text-white">Carlos Gómez <Star size={10} fill="var(--primary)" className="inline text-amber-500" /> 4.9</div>
                  <div className="text-[10px] text-slate-400">Mercedes Sprinter • AX-120-WT</div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedVoucherBooking ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelectedVoucherBooking(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              <h3 className="text-sm font-bold text-white">{t('profileVoucherTitle', 'Voucher de Embarque Digital')}</h3>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{t('profileBoardingPass', 'PASE DE ABORDAJE')}</span>
                  <strong className="text-sm text-white">BuscaTours Voucher</strong>
                </div>
                <Navigation size={18} className="text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('profileTourExp', 'TOUR / EXPERIENCIA')}</span>
                  <strong className="text-xs text-white block truncate">{selectedVoucherBooking.tourTitle}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('profileDateHour', 'FECHA / HORA')}</span>
                  <strong className="text-xs text-white block">{selectedVoucherBooking.date} (08:30 AM)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('profileHolder', 'TITULAR')}</span>
                  <strong className="text-xs text-white block">{selectedVoucherBooking.fullName || 'Cliente BuscaTours'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('profilePassengers', 'PASAJEROS')}</span>
                  <strong className="text-xs text-white block">{selectedVoucherBooking.guests} {selectedVoucherBooking.guests > 1 ? t('profileTravelers', 'Viajeros') : t('profileTraveler', 'Viajero')}</strong>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t('profileBookingCode', 'CÓDIGO DE RESERVA')}</span>
                  <span className="text-sm font-mono font-bold text-amber-500">{selectedVoucherBooking.bookingId}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Eco Points Card */}
            <div className="mb-6 p-4 rounded-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-blue-500/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{t('profileEcoWallet', 'Billetera Ecológica (Green Ledger)')}</span>
                  <h4 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">🪙 {ecoPoints || 0} <span className="text-xs font-medium text-slate-400">{t('profileEcoPoints', 'Eco-Puntos')}</span></h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">{t('profileCo2Neutralized', 'CO₂ Neutralizado')}</span>
                  <strong className="text-sm text-emerald-400">{((ecoPoints || 0) * 0.15).toFixed(1)} kg CO₂ 🌳</strong>
                </div>
              </div>
            </div>

            {activeTab === 'account' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><User size={16} /> {t('profileAccountTitle', 'Datos de mi cuenta')}</h4>
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  {t('profileName', 'Nombre')}
                  <input value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} className="px-3 py-2 rounded border border-white/10 bg-slate-950 text-white text-sm" />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  {t('profileEmail', 'Correo electrónico')}
                  <input value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} className="px-3 py-2 rounded border border-white/10 bg-slate-950 text-white text-sm" />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  {t('profilePhone', 'Teléfono')}
                  <input value={accountForm.phone} onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })} className="px-3 py-2 rounded border border-white/10 bg-slate-950 text-white text-sm" />
                </label>
                <div className="flex justify-between">
                  <button onClick={handleSaveAccount} className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors"><Save size={14} /> {t('profileSaveChanges', 'Guardar cambios')}</button>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 rounded border border-red-500/40 bg-red-500/10 text-red-400 font-bold text-xs flex items-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /> {t('profileDeleteAccount', 'Eliminar cuenta')}</button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><Settings size={16} /> {t('profileSettingsTitle', 'Ajustes de cuenta')}</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { key: 'notifications', label: t('profileSettingNotifications', 'Notificaciones push') },
                    { key: 'emailAlerts', label: t('profileSettingEmails', 'Alertas por correo') },
                    { key: 'smsAlerts', label: t('profileSettingSms', 'Alertas por SMS') },
                    { key: 'publicProfile', label: t('profileSettingPublic', 'Perfil público') }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded border border-white/5 bg-slate-950/30">
                      <span className="text-xs text-slate-300 font-semibold">{item.label}</span>
                      <input type="checkbox" checked={settingsForm[item.key]} onChange={(e) => setSettingsForm({ ...settingsForm, [item.key]: e.target.checked })} />
                    </label>
                  ))}
                </div>
                <button onClick={handleSaveSettings} className="self-start px-4 py-2 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors"><Save size={14} /> {t('profileSaveSettings', 'Guardar ajustes')}</button>
              </div>
            )}

            {activeTab === 'inbox' && (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><Bell size={16} /> {t('profileInboxTitle', 'Bandeja de entrada')}</h4>
                {inbox.length === 0 ? <p className="text-xs text-slate-400">{t('profileNoInbox', 'No tienes mensajes nuevos.')}</p> : inbox.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded border border-white/5 flex gap-3 ${msg.read ? 'bg-slate-950/30' : 'bg-amber-500/5 border-amber-500/20'}`}>
                    <div className="mt-0.5">{inboxIcon(msg.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs text-white">{msg.title}</strong>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">{t('profileNoBookings', 'Aún no tienes excursiones reservadas.')}</p>
                  </div>
                ) : bookings.map((b) => (
                  <div key={b.bookingId} className="border border-white/5 rounded-lg p-4 flex flex-col gap-3 bg-slate-950/30">
                    <div className="flex gap-3 items-center">
                      <img src={b.tourImage} alt={b.tourTitle} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-bold text-white">{b.tourTitle}</h4>
                          <span className="text-xs font-bold text-amber-500">{formatPrice(b.totalPriceUSD, 'USD')}</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-slate-400">
                          <span>{t('profileFecha', 'Fecha')}: {b.date}</span>
                          <span>{t('profilePasajeros', 'Pasajeros')}: {b.guests}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-[10px] text-emerald-400 font-bold">● {t('profilePaymentConfirmed', 'Pago Confirmado')} ({b.gateway})</span>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedVoucherBooking(b)} className="text-[11px] text-amber-500 font-bold hover:underline">{t('profileViewQr', 'Ver QR')}</button>
                        <button onClick={() => alert(`Descargando Voucher PDF para reserva: ${b.bookingId}`)} className="text-[11px] text-emerald-400 font-bold hover:underline flex items-center gap-1"><Download size={10} /> {t('profileDownloadVoucher', 'Descargar Voucher')}</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/50 border border-dashed border-white/10 rounded p-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={10} className="text-amber-500" /> {t('profilePickup', 'Recogida')}: 08:30 AM (Lobby)</span>
                      <button onClick={() => { setSelectedGpsBooking(b); setGpsSecondsLeft(504); setGpsTab('status'); }} className="text-[10px] font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500/20 transition-colors flex items-center gap-1">
                        <Navigation size={10} /> {t('profileFollowBus', 'Seguir Minibús en Vivo')} 📍
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-3">
                {favoriteTours.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Heart size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">{t('profileNoFavorites', 'Aún no has guardado favoritos.')}</p>
                  </div>
                ) : favoriteTours.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 border border-white/5 rounded bg-slate-950/30">
                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => { onSelectTour(t.id); onBack(); }}>
                      <img src={t.image} alt={t.title} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.title}</h4>
                        <span className="text-[10px] text-slate-400">{t.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-500">{formatPrice(t.price, 'USD')}</span>
                      <button onClick={() => onRemoveFromWishlist(t.id)} className="text-red-400 hover:text-red-300"><Heart size={16} fill="currentColor" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><Star size={16} /> {t('profileReviewsTitle', 'Mis reseñas')}</h4>
                {reviews.length === 0 ? <p className="text-xs text-slate-400">{t('profileNoReviews', 'Aún no has escrito reseñas.')}</p> : reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded border border-white/5 bg-slate-950/30">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-xs text-white">{review.tour}</strong>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? 'var(--primary)' : 'none'} color={i < review.rating ? 'var(--primary)' : 'var(--text-muted)'} />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-1">{review.comment}</p>
                    <span className="text-[10px] text-slate-500">{review.date}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                  <h5 className="text-xs font-bold text-white">{t('profileWriteReview', 'Escribir reseña')}</h5>
                  <select value={newReview.tourId} onChange={(e) => setNewReview({ ...newReview, tourId: e.target.value })} className="px-3 py-2 rounded border border-white/10 bg-slate-950 text-white text-xs">
                    <option value="">{t('profileSelectTour', 'Selecciona un tour')}</option>
                    {tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.title}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{t('profileRating', 'Calificación')}:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="bg-transparent border-none cursor-pointer p-0">
                        <Star size={16} fill={star <= newReview.rating ? 'var(--primary)' : 'none'} color={star <= newReview.rating ? 'var(--primary)' : 'var(--text-muted)'} />
                      </button>
                    ))}
                  </div>
                  <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder={t('profileReviewPlaceholder', 'Comparte tu experiencia...')} className="px-3 py-2 rounded border border-white/10 bg-slate-950 text-white text-xs min-h-[60px] resize-y" />
                  <button onClick={handleSubmitReview} className="self-start px-4 py-2 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors"><Send size={14} /> {t('profileSubmitReview', 'Enviar reseña')}</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
