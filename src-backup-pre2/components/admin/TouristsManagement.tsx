import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Mail, Phone, Calendar, MessageSquare, Star, 
  MapPin, Send,
  Navigation, Compass, Award
} from 'lucide-react';
import { Booking, Tour, Tourist, ChatMessage } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

// Mock Tourists matching bookings
const INITIAL_TOURISTS: Tourist[] = [
  {
    id: 'tst-1',
    name: 'Thomas Müller',
    email: 'thomas.muller@domain.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    ecoPoints: 450,
    phone: '+49 172 883921',
    status: 'En ruta',
    country: 'Alemania',
    flag: '🇩🇪'
  },
  {
    id: 'tst-2',
    name: 'Claire Laurent',
    email: 'claire.laurent@domain.fr',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    ecoPoints: 600,
    phone: '+33 6 5543 2109',
    status: 'Activo',
    country: 'Francia',
    flag: '🇫🇷'
  },
  {
    id: 'tst-3',
    name: 'Lucas Silva',
    email: 'lucas.silva@domain.br',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ecoPoints: 200,
    phone: '+55 11 98827 3341',
    status: 'Activo',
    country: 'Brasil',
    flag: '🇧🇷'
  },
  {
    id: 'tst-4',
    name: 'Amara Walker',
    email: 'amara.walker@domain.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    ecoPoints: 850,
    phone: '+1 415 992 1083',
    status: 'Completado',
    country: 'EE.UU.',
    flag: '🇺🇸'
  }
];

// Initial mock chat messages
const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  'tst-1': [
    { id: 'm1', sender: 'tourist', text: 'Hola, ¿a qué hora pasa el transfer por mi hotel en Cusco?', timestamp: '08:15 AM' },
    { id: 'm2', sender: 'operator', text: 'Buenos días Thomas. El transfer está programado para las 08:45 AM en la puerta de la Posada del Sol.', timestamp: '08:18 AM' },
    { id: 'm3', sender: 'tourist', text: 'Perfecto, ya estoy listo en el lobby. ¿Me avisarán cuando llegue?', timestamp: '08:20 AM' },
    { id: 'm4', sender: 'operator', text: 'Sí, el conductor te notificará al llegar y puedes seguir la ubicación del vehículo desde este mismo panel.', timestamp: '08:22 AM' }
  ],
  'tst-2': [
    { id: 'm1', sender: 'tourist', text: 'Hola! Tengo una duda sobre el equipamiento para el Glaciar Grey. ¿Es necesario llevar crampones propios?', timestamp: 'Ayer' },
    { id: 'm2', sender: 'operator', text: 'Hola Claire! No es necesario, nosotros proveemos crampones, arnés y casco para la expedición sobre el glaciar.', timestamp: 'Ayer' }
  ],
  'tst-3': [
    { id: 'm1', sender: 'tourist', text: 'Hola, mi reserva del Safari Amazónico sigue saliendo como pendiente.', timestamp: '10:05 AM' }
  ],
  'tst-4': []
};

// Initial mock reviews
interface TouristReview {
  id: string;
  touristId: string;
  tourName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Aprobado' | 'Pendiente' | 'Oculto';
}

const INITIAL_REVIEWS: TouristReview[] = [
  {
    id: 'rev-1',
    touristId: 'tst-4',
    tourName: 'Cenotes Sagrados & Ruinas de Tulum',
    rating: 5,
    comment: '¡Una experiencia increíble! El guía Diego fue muy atento y conocía toda la historia maya. Sac Actun es mágico.',
    date: '2026-06-25',
    status: 'Aprobado'
  },
  {
    id: 'rev-2',
    touristId: 'tst-1',
    tourName: 'Camino Inca Sagrado a Machu Picchu',
    rating: 4,
    comment: 'El camino fue desafiante pero las vistas valieron cada segundo. Recomiendo entrenar un poco antes de venir.',
    date: '2026-06-28',
    status: 'Pendiente'
  }
];

interface TouristsManagementProps {
  bookings: Booking[];
  tours: Tour[];
  currentRole: string;
  currentOperator: string;
}

export default function TouristsManagement({
  bookings,
  tours,
  currentRole,
  currentOperator
}: TouristsManagementProps) {
  const { t } = useTranslation();
  const tourists = useState<Tourist[]>(INITIAL_TOURISTS)[0];
  const [selectedTouristId, setSelectedTouristId] = useState<string>('tst-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  
  // Tab states for profile detailed view
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'chat' | 'reviews' | 'gps'>('gps');

  // Simulated Chat states
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulated Reviews state
  const [reviews, setReviews] = useState<TouristReview[]>(INITIAL_REVIEWS);

  // Simulated Transfer GPS tracking telemetry states
  const [gpsProgress, setGpsProgress] = useState<number>(35); // percentage of pickup route completed
  const [gpsStatusText, setGpsStatusText] = useState<string>(t('tm.gpsTransit', 'Transfer en tránsito - Acercándose al Hotel'));
  const [gpsSpeed, setGpsSpeed] = useState<number>(45); // km/h
  const [gpsDistance, setGpsDistance] = useState<number>(2.4); // km away
  const [gpsEta, setGpsEta] = useState<number>(6); // minutes

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedTouristId, isTyping]);

  // Telemetry loop simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Derive telemetry status/speed/distance/eta from progress (outside the state updater)
  useEffect(() => {
    if (gpsProgress >= 100) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional GPS simulation derived from progress
      setGpsStatusText(t('tm.gpsArrived', 'Transfer ha llegado al punto de recogida (Pasajero abordando)'));
      setGpsSpeed(0);
      setGpsDistance(0);
      setGpsEta(0);
    } else if (gpsProgress > 90) {
      setGpsStatusText(t('tm.gpsNear', 'Transfer a metros del destino (Llegada inminente)'));
      setGpsSpeed(15);
      setGpsDistance(0.2);
      setGpsEta(1);
    } else if (gpsProgress > 70) {
      setGpsStatusText(t('tm.gpsTraffic', 'Tráfico moderado - Transfer cruzando la Plaza Mayor'));
      setGpsSpeed(32);
      setGpsDistance(0.9);
      setGpsEta(3);
    } else if (gpsProgress > 50) {
      setGpsStatusText(t('tm.gpsConstant', 'Velocidad constante - En ruta principal'));
      setGpsSpeed(52);
      setGpsDistance(1.5);
      setGpsEta(4);
    } else {
      setGpsStatusText(t('tm.gpsTransit', 'Transfer en tránsito - Acercándose al Hotel'));
      setGpsSpeed(48);
      setGpsDistance(2.1);
      setGpsEta(5);
    }
  }, [gpsProgress, t]);

  const selectedTourist = tourists.find(t => t.id === selectedTouristId) || tourists[0];

  // Filters tourists by search bar query, country, and operator scope
  const filteredTourists = tourists.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = selectedCountry === 'all' || t.country === selectedCountry;

    // If user is B2B operator, they should see tourists having bookings for their tours
    if (currentRole === 'operator') {
      const operatorBookings = bookings.filter(b => (b.customerName || '').toLowerCase().includes((t.name || '').toLowerCase()) && b.tourId && tours.find(tour => tour.id === b.tourId)?.operator === currentOperator);
      return matchesSearch && matchesCountry && operatorBookings.length > 0;
    }
    return matchesSearch && matchesCountry;
  });

  // Handle simulated message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'operator',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => ({
      ...prev,
      [selectedTouristId]: [...(prev[selectedTouristId] || []), userMessage]
    }));
    setChatInput('');

    // Trigger auto reply simulation after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Excelente, muchas gracias. Ya los veo desde la ventana del hotel.',
        'Entendido. El guía me comentó que va a hacer un poco de frío arriba, ¿debería abrigarme más?',
        'Perfecto, gracias por el aviso. Estaré atento al color del vehículo.',
        '¡Genial! Los servicios adicionales que agregué están incluidos, ¿cierto?',
        'Muchas gracias por la rápida atención. ¡Nos vemos en unos minutos!'
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      const touristReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'tourist',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats((prev) => ({
        ...prev,
        [selectedTouristId]: [...(prev[selectedTouristId] || []), touristReply]
      }));
    }, 2000);
  };

  // Moderate reviews logic
  const handleApproveReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'Aprobado' } : r));
  };

  const handleHideReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'Oculto' } : r));
  };

  // Get current bookings for the selected tourist
  const touristBookings = bookings.filter(b => (b.customerName || '').toLowerCase().includes((selectedTourist.name || '').toLowerCase()));

  // Get current reviews for the selected tourist
  const touristReviews = reviews.filter(r => r.touristId === selectedTourist.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tourists-management-container">
      
      {/* LEFT COLUMN: TOURISTS LIST (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder={t('tourist.search', 'Buscar turistas...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">{t('tourist.filterCountry', 'Filtrar País:')}</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
               className="bg-slate-950 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-amber-500/50"
            >
              <option value="all">🌍 {t('todos', 'Todos')}</option>
              <option value="Alemania">🇩🇪 Alemania</option>
              <option value="Francia">🇫🇷 Francia</option>
              <option value="Brasil">🇧🇷 Brasil</option>
              <option value="EE.UU.">🇺🇸 EE.UU.</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden flex-1 max-h-[600px] overflow-y-auto">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{t('tourist.registered', 'CLIENTES REGISTRADOS')}</span>
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-mono text-slate-300 rounded-lg">{filteredTourists.length}</span>
          </div>

          <div className="divide-y divide-white/5">
            {filteredTourists.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                 {t('tm.noTourists', 'No se encontraron turistas.')}
              </div>
            ) : (
              filteredTourists.map((tourist) => {
                const isSelected = tourist.id === selectedTouristId;
                return (
                  <button
                    key={tourist.id}
                    onClick={() => {
                      setSelectedTouristId(tourist.id);
                      // Reset GPS simulation progress for fresh feel
                      setGpsProgress(35);
                    }}
                    className={`w-full text-left p-4 flex items-center gap-3.5 transition-all duration-150 hover:bg-white/3 relative ${
                      isSelected ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                    }`}
                  >
                    <img
                      src={tourist.avatar}
                      alt={tourist.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-xs font-semibold text-white truncate flex items-center gap-1">{tourist.flag} {tourist.name}</strong>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${
                          tourist.status === 'En ruta' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : tourist.status === 'Activo'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {tourist.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">{tourist.email}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: TOURIST PROFILE & ACTIONS (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Tourist Header Card */}
        <div className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row gap-5 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-4.5 text-center sm:text-left">
            <img
              src={selectedTourist.avatar}
              alt={selectedTourist.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30 shadow-lg shadow-amber-500/5"
            />
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">{selectedTourist.flag} {selectedTourist.name} <span className="text-xs font-mono text-slate-500 font-bold">({selectedTourist.country})</span></h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Mail size={12} className="text-amber-500" /> {selectedTourist.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} className="text-amber-500" /> {selectedTourist.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-white/5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-wider">{t('tm.ecoPoints', 'ECO PUNTOS')}</span>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-0.5">
                <Award size={13} className="text-emerald-400" />
                {selectedTourist.ecoPoints} PTS
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-wider">{t('tm.reservas', 'RESERVAS')}</span>
              <span className="text-xs font-black text-white mt-0.5">{touristBookings.length}</span>
            </div>
          </div>
        </div>

        {/* Workspace Tab Container */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col flex-grow min-h-[500px]">
          
          {/* Tab Selector */}
          <div className="bg-slate-950 border-b border-white/5 p-2 flex flex-wrap gap-1">
               <button
                 onClick={() => setActiveSubTab('gps')}
                 className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                   activeSubTab === 'gps' 
                     ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
               }`}
            >
              <Navigation size={14} />
              {t('tourist.tabGps', 'Telemetría Transfer GPS')}
            </button>
               <button
                 onClick={() => setActiveSubTab('chat')}
                 className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 relative ${
                   activeSubTab === 'chat' 
                     ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
               }`}
            >
              <MessageSquare size={14} />
              {t('tourist.tabChat', 'Simulador Chat')}
              {(chats[selectedTouristId] || []).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border border-slate-950 rounded-full animate-pulse" />
              )}
            </button>
               <button
                 onClick={() => setActiveSubTab('bookings')}
                 className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                   activeSubTab === 'bookings' 
                     ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
               }`}
            >
              <Calendar size={14} />
              {t('tourist.tabBookings', 'Historial Reservas')}
            </button>
               <button
                 onClick={() => setActiveSubTab('reviews')}
                 className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                   activeSubTab === 'reviews' 
                     ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
               }`}
            >
              <Star size={14} />
              {t('tourist.tabReviews', 'Moderador Reseñas')}
              {touristReviews.some(r => r.status === 'Pendiente') && (
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-5 flex-grow flex flex-col justify-between">
            
            {/* TAB 1: GPS TRACKER TELEMETRY */}
            {activeSubTab === 'gps' && (
              <div className="space-y-5 flex-grow flex flex-col" id="gps-telemetry-panel">
                
                {/* Status Bar */}
                <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">{t('tourist.satcom', 'TELEMETRÍA SATCOM SATELITAL')}</span>
                      <strong className="text-xs font-semibold text-white mt-0.5 block">{gpsStatusText}</strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    {t('tm.route', 'Ruta')}: Hotel Posada del Sol
                  </span>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">{t('tm.speed', 'VELOCIDAD')}</span>
                    <strong className="text-sm font-black text-white mt-1 block">{gpsSpeed} km/h</strong>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">{t('tm.distance', 'DISTANCIA')}</span>
                    <strong className="text-sm font-black text-white mt-1 block">{gpsDistance} km</strong>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">{t('tm.etaPickup', 'ETA RECOGIDA')}</span>
                    <strong className="text-sm font-black text-amber-500 mt-1 block">{gpsEta} minutos</strong>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">{t('tm.satConnectivity', 'SAT CONECTIVIDAD')}</span>
                    <strong className="text-sm font-black text-emerald-400 mt-1 block">99.8% LNK</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold font-mono text-slate-400">
                    <span>{t('tm.baseOps', 'Base de Operaciones')}</span>
                    <span>{Math.round(gpsProgress)}% Recorrido</span>
                    <span>{t('tm.passengerHotel', 'Hotel del Pasajero')}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${gpsProgress}%` }}
                    />
                  </div>
                </div>

                {/* Vector Map Simulation Canvas */}
                <div className="relative border border-white/5 bg-slate-950 rounded-2xl h-56 overflow-hidden flex flex-col justify-end p-4 shadow-inner">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1524_1px,transparent_1px),linear-gradient(to_bottom,#0c1524_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
                  
                  {/* Decorative glowing path line */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    <path
                      d="M 50 150 Q 180 30, 260 120 T 450 70"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="4"
                    />
                    <path
                      d="M 50 150 Q 180 30, 260 120 T 450 70"
                      fill="none"
                      stroke="url(#map-glow-grad)"
                      strokeWidth="2.5"
                      strokeDasharray="8 6"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="map-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Vehicle Marker */}
                  <div 
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
                    style={{
                      left: `${50 + (gpsProgress / 100) * 400}px`,
                      top: `${150 - (gpsProgress / 100) * 80}px`
                    }}
                  >
                    <div className="p-1 bg-amber-500 text-slate-950 rounded-lg shadow-xl shadow-amber-500/20 border border-slate-950 flex items-center justify-center animate-bounce">
                      <Navigation size={12} className="rotate-90 fill-current" />
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-slate-900 border border-white/10 px-1 py-0.5 rounded text-white mt-1 whitespace-nowrap shadow-md">
                      VAN BT-04
                    </span>
                  </div>

                  {/* Destination Marker */}
                  <div className="absolute right-10 top-12 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-full shadow-lg border border-slate-950 animate-pulse">
                      <MapPin size={12} className="fill-current text-slate-950" />
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-slate-900 border border-white/10 px-1 py-0.5 rounded text-white mt-1 whitespace-nowrap">
                      Hotel Posada
                    </span>
                  </div>

                  <div className="relative z-10 p-3.5 bg-slate-900/90 border border-white/5 rounded-xl max-w-xs backdrop-blur-md">
                    <div className="flex items-center gap-2 text-amber-500 font-mono text-[9px] font-bold uppercase">
                      <Compass size={12} className="animate-spin-slow" />
                      <span>{t('tm.urbanLogistics', 'LOGÍSTICA URBANA LIVE')}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {t('tm.gpsRedundant', 'El GPS del transfer está enviando coordenadas de forma redundante sobre la red satelital de BuscaTours.')}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: LIVE SIMULATED CHAT */}
            {activeSubTab === 'chat' && (
              <div className="flex-grow flex flex-col justify-between h-[400px]" id="chat-messages-panel">
                
                {/* Chat Message Thread */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[300px]">
                  {(chats[selectedTouristId] || []).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-10">
                      <MessageSquare size={32} className="opacity-40" />
                      <span>                       {t('tm.noMessages', 'No hay mensajes anteriores con este turista.')}</span>
                      <button 
                        onClick={() => {
                          setChats(prev => ({
                            ...prev,
                            [selectedTouristId]: [
                              { id: 'm-init', sender: 'tourist', text: 'Hola, tengo una pregunta acerca de mi viaje.', timestamp: 'Justo ahora' }
                            ]
                          }));
                        }}
                        className="mt-2 text-amber-500 font-bold hover:underline"
                      >
                         {t('tm.simulateChat', 'Simular inicio de chat por el turista')}
                      </button>
                    </div>
                  ) : (
                    (chats[selectedTouristId] || []).map((msg) => {
                      const isOperator = msg.sender === 'operator';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${
                            isOperator ? 'align-self-end ml-auto items-end' : 'align-self-start mr-auto items-start'
                          }`}
                        >
                          <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                            isOperator 
                              ? 'bg-amber-500 text-slate-950 rounded-tr-none shadow-md shadow-amber-500/5' 
                              : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 mt-1 px-1">
                            {isOperator ? t('tm.operator', 'Operador') : selectedTourist.name} • {msg.timestamp}
                          </span>
                        </div>
                      );
                    })
                  )}

                  {isTyping && (
                    <div className="flex flex-col items-start align-self-start mr-auto max-w-[80%]">
                      <div className="p-3 bg-slate-800 text-slate-400 rounded-2xl rounded-tl-none border border-white/5 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2.5 border-t border-white/5 pt-4">
                  <input
                    type="text"
                     placeholder={t('tm.writeMsg', 'Escribir mensaje a {nombre}...').replace('{nombre}', selectedTourist?.name || '')}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                     className="flex-grow bg-slate-950 border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50 transition-all"
                  />
                  <button
                    type="submit"
                     className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-all flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-amber-500/10"
                  >
                    <Send size={13} />
                    <span>{t('tmEnviar', 'Enviar')}</span>
                  </button>
                </form>

              </div>
            )}

            {/* TAB 3: BOOKINGS HISTORY */}
            {activeSubTab === 'bookings' && (
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[360px]" id="bookings-history-panel">
                {touristBookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    {t('tm.noPurchases', 'Este turista no tiene compras registradas en el sistema.')}
                  </div>
                ) : (
                  touristBookings.map((b) => (
                    <div 
                      key={b.id} 
                      className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono text-amber-500">{b.id}</span>
                          <strong className="text-xs font-semibold text-white">{b.tourTitle}</strong>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                          <span>{t('tmFecha', 'Fecha:')} {b.date}</span>
                          <span>{t('profilePasajeros', 'Pasajeros')}: {b.pax} PAX</span>
                          <span className="text-emerald-400 font-bold">{t('tmTotal', 'Total:')} {b.price} {b.currency}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        b.status === 'Confirmada' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : b.status === 'Pendiente'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: REVIEWS MODERATION */}
            {activeSubTab === 'reviews' && (
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[360px]" id="reviews-moderator-panel">
                {touristReviews.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    {t('tm.noReviews', 'El turista no ha redactado reseñas para sus tours aún.')}
                  </div>
                ) : (
                  touristReviews.map((r) => (
                    <div 
                      key={r.id}
                      className="p-4.5 bg-slate-950/60 border border-white/5 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">{t('tm.tourReviewed', 'TOUR OPINADO')}</span>
                          <strong className="text-xs font-semibold text-white">{r.tourName}</strong>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < r.rating ? 'text-amber-400 fill-current' : 'text-slate-700'} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic bg-white/3 p-3 rounded-lg border border-white/5 font-sans leading-relaxed">
                        "{r.comment}"
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-500">{t('tm.publishedOn', 'Publicado el')} {r.date}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            r.status === 'Aprobado' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : r.status === 'Pendiente'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {r.status}
                          </span>
                          
                          {r.status === 'Pendiente' && (
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleApproveReview(r.id)}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[9px] transition-colors"
                              >
                                 {t('tm.approve', 'Aprobar')}
                               </button>
                              <button 
                                onClick={() => handleHideReview(r.id)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded text-[9px] transition-colors"
                              >
                                 {t('tm.hide', 'Ocultar')}
                               </button>
                            </div>
                          )}

                          {r.status === 'Aprobado' && (
                            <button 
                              onClick={() => handleHideReview(r.id)}
                              className="text-[9px] text-slate-500 hover:text-slate-400 underline font-semibold"
                            >
                               {t('tm.hideReview', 'Ocultar reseña')}
                            </button>
                          )}

                          {r.status === 'Oculto' && (
                            <button 
                              onClick={() => handleApproveReview(r.id)}
                              className="text-[9px] text-amber-500 hover:text-amber-400 underline font-semibold"
                            >
                               {t('tm.approveShow', 'Aprobar y Mostrar')}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
