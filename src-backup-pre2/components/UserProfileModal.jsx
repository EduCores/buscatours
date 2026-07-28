import { useState, useEffect, useRef } from "react";
import { X, Heart, Calendar, Download, User, MapPin, Navigation, Star, ArrowLeft, Phone, MessageSquare, Send, Check } from "lucide-react";
import { formatPrice } from "../data/translations";
import { useTranslation } from '../i18n/LanguageContext';

export default function UserProfileModal({ wishlist, bookings, tours, activeCurrency, ecoPoints, onClose, onSelectTour, onRemoveFromWishlist }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "wishlist"

  // Voucher details state
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState(null);

  // GPS Live Tracking states
  const [selectedGpsBooking, setSelectedGpsBooking] = useState(null);
  const [gpsSecondsLeft, setGpsSecondsLeft] = useState(504); // 8m 24s
  const [gpsTab, setGpsTab] = useState("status"); // "status" | "chat"
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "driver", text: "¡Hola! Soy Carlos, tu conductor de Busca Tours. Ya voy en camino a buscarte al hotel.", time: "08:32 AM" },
    { id: 2, sender: "driver", text: "Voy en una Mercedes Sprinter color gris plata.", time: "08:33 AM" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // GPS Countdown Timer
  useEffect(() => {
    if (!selectedGpsBooking) return;
    const interval = setInterval(() => {
      setGpsSecondsLeft((prev) => (prev > 1 ? prev - 1 : 504));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedGpsBooking]);

  const handleSendQuickMessage = (text) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: "user", text, time: timeNow };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "¡Recibido! Estaré allí en unos minutos.";
      if (text.includes("esperarme")) {
        replyText = "Sin problema, te espero en el lobby. Avísame cuando bajes.";
      } else if (text.includes("patente")) {
        replyText = "La patente es AX-120-WT. Es un minibús gris de la empresa.";
      } else if (text.includes("camino")) {
        replyText = "Sí, estoy pasando por la plaza central, calculo unos 5 minutos.";
      }
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "driver", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

  const formatGpsEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min, ${secs.toString().padStart(2, "0")} s`;
  };

  const favoriteTours = tours.filter((t) => wishlist.includes(t.id));

  const handleDownloadVoucher = (booking) => {
    alert(`Descargando Voucher PDF para reserva: ${booking.bookingId}\nTour: ${booking.tourTitle}\nFecha: ${booking.date}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        fontFamily: "var(--font-body)"
      }}
    >
      <div
        className="glass-card modal modal-responsive-card"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "500px",
          maxHeight: "90vh",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {selectedGpsBooking ? (
          /* GPS Tracker Panel */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            {/* GPS Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <button
                onClick={() => setSelectedGpsBooking(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  {t('profileTrackingTitle', 'Seguimiento de Traslado')}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600 }}>
                    ● {t('profileBusOnWay', 'Minibús en camino')} • {selectedGpsBooking.tourTitle}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}
              >
                <span className="gps-live-dot" style={{ width: "6px", height: "6px", backgroundColor: "#ef4444", borderRadius: "50%" }}></span>
                {t('profileGpsLive', 'GPS VIVO')}
              </div>
            </div>

            {/* SVG MAP */}
            <div style={{ padding: "12px 24px 0 24px" }}>
              <svg width="100%" height="180px" style={{ backgroundColor: "#09101d", borderRadius: "var(--radius-sm)", overflow: "hidden", display: "block", border: "1px solid var(--border-color)" }}>
                {/* Grid background */}
                <defs>
                  <pattern id="gps-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gps-grid)" />

                {/* Lakes or Parks as decorative backgrounds */}
                <path d="M -10 120 C 50 130, 80 180, 110 180 C 140 180, 160 140, 200 130 C 240 120, 280 160, 310 150 L 600 200 L -10 200 Z" fill="rgba(34, 197, 94, 0.04)" />
                <circle cx="430" cy="50" r="25" fill="rgba(14, 165, 233, 0.06)" />
                <text x="430" y="53" fontSize="9" fill="rgba(14, 165, 233, 0.3)" textAnchor="middle" fontWeight="bold">Lago Patagónico</text>
                
                <rect x="60" y="30" width="110" height="50" rx="6" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.03)" />
                <text x="115" y="60" fontSize="9" fill="rgba(255,255,255,0.15)" textAnchor="middle">Centro Histórico</text>

                {/* Route Roads (Subtle background paths) */}
                <path d="M 0 40 Q 150 40 150 180" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="3" />
                <path d="M 300 0 Q 300 100 600 100" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="3" />

                {/* Active Route Path */}
                <path
                  id="route-path"
                  d="M 30,50 L 150,50 C 220,50 250,140 320,140 L 450,140 C 490,140 510,85 550,85"
                  fill="none"
                  stroke="rgba(234, 179, 8, 0.12)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  id="route-path-dashed"
                  d="M 30,50 L 150,50 C 220,50 250,140 320,140 L 450,140 C 490,140 510,85 550,85"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeDasharray="6,5"
                  strokeLinecap="round"
                />

                {/* Starting Point Marker */}
                <circle cx="30" cy="50" r="5" fill="#ef4444" />
                <circle cx="30" cy="50" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
                <text x="30" y="38" fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontWeight="bold">Central</text>

                {/* Destination Point (Hotel Lobby) */}
                <g transform="translate(550, 85)">
                  <circle r="10" fill="none" stroke="#22c55e" strokeWidth="1.5">
                    <animate attributeName="r" values="5;18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="5" fill="#22c55e" />
                  <text y="-12" fontSize="8" fill="#22c55e" textAnchor="middle" fontWeight="bold">Tu Hotel</text>
                </g>

                {/* Moving Minibús */}
                <g>
                  <circle r="14" fill="rgba(234, 179, 8, 0.25)" />
                  <rect x="-10" y="-10" width="20" height="20" rx="4" fill="var(--primary)" stroke="#09101d" strokeWidth="1.5" />
                  <text y="4.5" textAnchor="middle" fontSize="11" fill="#000" fontWeight="bold">🚌</text>
                  <animateMotion
                    dur="18s"
                    repeatCount="indefinite"
                    path="M 30,50 L 150,50 C 220,50 250,140 320,140 L 450,140 C 490,140 510,85 550,85"
                    rotate="auto"
                  />
                </g>
              </svg>
            </div>

            {/* GPS Tab Options */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.15)", marginTop: "12px" }}>
              <button
                onClick={() => setGpsTab("status")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  background: "transparent",
                  color: gpsTab === "status" ? "var(--primary)" : "var(--text-muted)",
                  borderBottom: gpsTab === "status" ? "2px solid var(--primary)" : "2px solid transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <MapPin size={14} /> {t('profileArrivalStatus', 'Estado del Arribo')}
              </button>
              <button
                onClick={() => setGpsTab("chat")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  background: "transparent",
                  color: gpsTab === "chat" ? "var(--primary)" : "var(--text-muted)",
                  borderBottom: gpsTab === "chat" ? "2px solid var(--primary)" : "2px solid transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <MessageSquare size={14} /> {t('profileDriverChat', 'Chat Conductor')} 
                <span style={{ backgroundColor: "#ef4444", color: "#fff", fontSize: "0.65rem", padding: "1px 5px", borderRadius: "10px", marginLeft: "4px", fontWeight: "bold" }}>
                  2
                </span>
              </button>
            </div>

            {/* GPS TAB CONTENT BODY */}
            <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", height: "180px" }}>
              {gpsTab === "status" ? (
                <div style={{ padding: "12px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* ETA Display */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                    <div>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{t('profileEta', 'Arribo Estimado')}</span>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)", fontFamily: "monospace", marginTop: "2px" }}>
                        {formatGpsEta(gpsSecondsLeft)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{t('profileDistance', 'Distancia')}</span>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-heading)", marginTop: "2px" }}>
                        {(gpsSecondsLeft * 0.005).toFixed(2)} km
                      </div>
                    </div>
                  </div>

                  {/* Driver Card */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.1)" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(234, 179, 8, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                        👨‍✈️
                      </div>
                      <span style={{ position: "absolute", bottom: -2, right: -2, width: "12px", height: "12px", backgroundColor: "#22c55e", borderRadius: "50%", border: "2px solid #09101d", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "6px" }}>
                        ✓
                      </span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-heading)" }}>Carlos Gómez</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "1px", fontSize: "0.65rem", color: "var(--primary)", fontWeight: 700 }}>
                          <Star size={9} fill="var(--primary)" /> 4.9
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "1px" }}>
                        Mercedes Sprinter • <span style={{ fontFamily: "monospace", color: "var(--text-heading)", fontWeight: 700 }}>AX-120-WT</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => alert("Simulando llamada telefónica al conductor Carlos al +54 9 11 5555-1234...")}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.01)", color: "var(--text-heading)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                        title={t('profileCallDriver', 'Llamar Conductor')}
                      >
                        <Phone size={12} />
                      </button>
                      <button
                        onClick={() => setGpsTab("chat")}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.01)", color: "var(--text-heading)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                        title={t('profileSendMessage', 'Enviar Mensaje')}
                      >
                        <MessageSquare size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Milestones timeline */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }}></div>
                        <div style={{ width: "1.5px", height: "16px", backgroundColor: "#22c55e" }}></div>
                      </div>
                      <div style={{ fontSize: "0.7rem", transform: "translateY(-3px)" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-heading)" }}>{t('profileMilestoneDeparture', 'Salida de Terminal')}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>08:20 AM</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }}></div>
                        <div style={{ width: "1.5px", height: "16px", backgroundColor: "var(--border-color)" }}></div>
                      </div>
                      <div style={{ fontSize: "0.7rem", transform: "translateY(-3px)" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-heading)" }}>{t('profileMilestoneOnRoute', 'En Ruta (GPS Activo)')}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>{t('profileSpeedRegular', 'Velocidad regular')}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--border-color)" }}></div>
                      </div>
                      <div style={{ fontSize: "0.7rem", transform: "translateY(-3px)" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{t('profileMilestoneHotel', 'Arribo a tu Hotel (Lobby)')}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>~08:45 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                  {/* Messages list */}
                  <div style={{ flexGrow: 1, padding: "10px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "120px" }}>
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                          maxWidth: "85%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.sender === "user" ? "flex-end" : "flex-start"
                        }}
                      >
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: "10px",
                            backgroundColor: msg.sender === "user" ? "var(--primary)" : "rgba(255,255,255,0.04)",
                            color: msg.sender === "user" ? "#000" : "var(--text-heading)",
                            fontSize: "0.75rem",
                            fontWeight: msg.sender === "user" ? 600 : 500,
                            border: msg.sender === "user" ? "none" : "1px solid var(--border-color)",
                            lineHeight: "1.25"
                          }}
                        >
                          {msg.text}
                        </div>
                        <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", marginTop: "1px", padding: "0 2px" }}>
                          {msg.time}
                        </span>
                      </div>
                    ))}

                    {isTyping && (
                      <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                        <div style={{ padding: "6px 10px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span className="dot-typing" style={{ width: "3px", height: "3px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block" }}></span>
                          <span className="dot-typing" style={{ width: "3px", height: "3px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animationDelay: "0.2s" }}></span>
                          <span className="dot-typing" style={{ width: "3px", height: "3px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animationDelay: "0.4s" }}></span>
                           <span>{t('profileDriverTyping', 'Carlos escribiendo...')}</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Templates bar */}
                  <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.1)", display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }} className="no-scrollbar">
                    <button
                      onClick={() => handleSendQuickMessage("¿Ya estás en camino?")}
                      style={{ flexShrink: 0, padding: "5px 10px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "rgba(255,255,255,0.02)", color: "var(--text-heading)", fontSize: "0.65rem", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {t('profileQuickComing', '¿Ya vienes? 📍')}
                    </button>
                    <button
                      onClick={() => handleSendQuickMessage("Listo en el lobby del hotel")}
                      style={{ flexShrink: 0, padding: "5px 10px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "rgba(255,255,255,0.02)", color: "var(--text-heading)", fontSize: "0.65rem", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {t('profileQuickLobby', 'Listo en lobby 👍')}
                    </button>
                    <button
                      onClick={() => handleSendQuickMessage("¿Cuál es la patente del vehículo?")}
                      style={{ flexShrink: 0, padding: "5px 10px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "rgba(255,255,255,0.02)", color: "var(--text-heading)", fontSize: "0.65rem", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {t('profileQuickPlate', '¿Patente? 📇')}
                    </button>
                    <button
                      onClick={() => handleSendQuickMessage("Espera 5 minutos por favor")}
                      style={{ flexShrink: 0, padding: "5px 10px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "rgba(255,255,255,0.02)", color: "var(--text-heading)", fontSize: "0.65rem", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {t('profileQuickWait', 'Esperame 5m ⏱️')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : selectedVoucherBooking ? (
          /* Boarding Pass Voucher view */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <button
                onClick={() => setSelectedVoucherBooking(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  {t('profileVoucherTitle', 'Voucher de Embarque Digital')}
              </h3>
            </div>

            <div 
              className="boarding-pass" 
              style={{ 
                backgroundColor: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div className="boarding-pass-header">
                <div>
                  <span style={{ fontSize: "0.55rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.8, letterSpacing: "1px", display: "block" }}>{t('profileBoardingPass', 'PASE DE ABORDAJE')}</span>
                  <strong style={{ fontSize: "1rem" }}>BuscaTours Voucher</strong>
                </div>
                <Navigation size={22} style={{ opacity: 0.9 }} />
              </div>

              <div className="boarding-pass-body">
                <div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('profileTourExp', 'TOUR / EXPERIENCIA')}</span>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selectedVoucherBooking.tourTitle}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('profileDateHour', 'FECHA / HORA')}</span>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>
                    {selectedVoucherBooking.date} (08:30 AM)
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('profileHolder', 'TITULAR')}</span>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>
                    {selectedVoucherBooking.fullName || "Cliente BuscaTours"}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('profilePassengers', 'PASAJEROS')}</span>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>
                    {selectedVoucherBooking.guests}                     {selectedVoucherBooking.guests > 1 ? t('profileTravelers', 'Viajeros') : t('profileTraveler', 'Viajero')}
                  </strong>
                </div>
              </div>

              <div className="boarding-pass-footer">
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", fontWeight: 700 }}>{t('profileBookingCode', 'CÓDIGO DE RESERVA')}</span>
                  <strong style={{ fontSize: "0.95rem", color: "var(--primary)", fontFamily: "monospace" }}>
                    {selectedVoucherBooking.bookingId}
                  </strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ backgroundColor: "#ffffff", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="40" height="40" viewBox="0 0 29 29" style={{ display: "block" }}>
                      <path d="M0 0h7v7H0zm1 1v5h5V1zm8-1h1v1H9zm1 1h1v1h-1zm1 1h1v1h-1zm-3-3h1v1H7zm1 3h1v1H8zm-3 4h1v1H5zm6-4h1v1h-1zm0 3h1v1h-1zm-2 1h1v1H9zm2 1h1v1h-1zm2 1h1v1h-1zm2 1h1v1h-1zm1-5h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm1 2h1v1h-1zm-3 2h1v1h-1zm2 1h1v1h-1zm2 0h1v1h-1zm-6 2h1v1h-1zm2 1h1v1h-1zm0-7h1v1H9" fill="#000000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Original User Profile Content */
          <>
            {/* Header Profile */}
            <div
              className="profile-modal-header"
              style={{
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(234, 179, 8, 0.15)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(234, 179, 8, 0.3)"
                }}
              >
                <User size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>{t('profileMyAccount', 'Mi Cuenta Busca Tours')}</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t('profileMemberSince', 'Miembro desde Junio 2026 • Categoría: Explorador Frecuente')}</span>
              </div>

              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer"
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab System Links */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.01)" }}>
              <button
                onClick={() => setActiveTab("bookings")}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  background: "transparent",
                  color: activeTab === "bookings" ? "var(--primary)" : "var(--text-muted)",
                  borderBottom: activeTab === "bookings" ? "3px solid var(--primary)" : "3px solid transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}
              >
                {t('profileMyBookings', 'Mis Reservas')} ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  background: "transparent",
                  color: activeTab === "wishlist" ? "var(--primary)" : "var(--text-muted)",
                  borderBottom: activeTab === "wishlist" ? "3px solid var(--primary)" : "3px solid transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}
              >
                {t('profileMyFavorites', 'Mis Favoritos')} ({favoriteTours.length})
              </button>
            </div>

            {/* Scrollable list content */}
            <div className="profile-modal-body" style={{ flexGrow: 1, overflowY: "auto" }}>
              
              {/* B2C Innovation: Eco-Points Wallet Card */}
              <div 
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.05) 100%)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "0.68rem", color: "#10b981", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.5px" }}>
                      {t('profileEcoWallet', 'Billetera Ecológica (Green Ledger)')}
                    </span>
                    <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                       🪙 {ecoPoints || 0} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-muted)" }}>{t('profileEcoPoints', 'Eco-Puntos')}</span>
                    </h4>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>
                      {t('profileCo2Neutralized', 'CO₂ Neutralizado')}
                    </span>
                    <strong style={{ fontSize: "1rem", color: "#10b981" }}>
                      {((ecoPoints || 0) * 0.15).toFixed(1)} kg CO₂ 🌳
                    </strong>
                  </div>
                </div>

                {/* Badges system */}
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                    {t('profileEcoBadgesUnlocked', 'Insignias Ecológicas Unlocked:')}
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 4px",
                      borderRadius: "6px",
                      backgroundColor: ecoPoints >= 100 ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.01)",
                      border: ecoPoints >= 100 ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border-color)",
                      opacity: ecoPoints >= 100 ? 1 : 0.4,
                      transition: "all 0.3s"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>🌱</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: ecoPoints >= 100 ? "#4ade80" : "var(--text-muted)", textAlign: "center" }}>{t('profileBadgeSeed', 'Semilla Verde')}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 4px",
                      borderRadius: "6px",
                      backgroundColor: ecoPoints >= 250 ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.01)",
                      border: ecoPoints >= 250 ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border-color)",
                      opacity: ecoPoints >= 250 ? 1 : 0.4,
                      transition: "all 0.3s"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>🐾</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: ecoPoints >= 250 ? "#10b981" : "var(--text-muted)", textAlign: "center" }}>{t('profileBadgeJungle', 'Guardián de la Selva')}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 4px",
                      borderRadius: "6px",
                      backgroundColor: ecoPoints >= 500 ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.01)",
                      border: ecoPoints >= 500 ? "1px solid rgba(59,130,246,0.3)" : "1px solid var(--border-color)",
                      opacity: ecoPoints >= 500 ? 1 : 0.4,
                      transition: "all 0.3s"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>❄️</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: ecoPoints >= 500 ? "#60a5fa" : "var(--text-muted)", textAlign: "center" }}>{t('profileBadgeGlacier', 'Defensor de Glaciares')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* TAB 1: BOOKING LOG HISTORY */}
              {activeTab === "bookings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      <Calendar size={32} style={{ marginBottom: "12px", color: "var(--text-muted)" }} />
                      <p style={{ fontSize: "0.85rem" }}>{t('profileNoBookings', 'Aún no tienes excursiones reservadas.')}</p>
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div
                        key={b.bookingId}
                        className="profile-booking-item"
                        style={{
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          padding: "14px",
                          gap: "10px"
                        }}
                      >
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <img
                            src={b.tourImage}
                            alt={b.tourTitle}
                            style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "6px" }}
                          />
                          <div style={{ flexGrow: 1 }}>
                            <div className="profile-booking-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{b.tourTitle}</h4>
                              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)" }}>
                                {formatPrice(b.totalPriceUSD, activeCurrency)}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              <span>{t('profileFecha', 'Fecha')}: {b.date}</span>
                              <span>{t('profilePasajeros', 'Pasajeros')}: {b.guests}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking footer */}
                        <div className="profile-booking-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "8px", marginTop: "4px" }}>
                          <span style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 700 }}>● {t('profilePaymentConfirmed', 'Pago Confirmado')} ({b.gateway})</span>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => setSelectedVoucherBooking(b)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "var(--accent)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                cursor: "pointer"
                              }}
                            >
                              <User size={12} /> {t('profileViewQr', 'Ver QR')}
                            </button>
                            <button
                              onClick={() => handleDownloadVoucher(b)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "var(--primary)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                cursor: "pointer"
                              }}
                            >
                              <Download size={12} /> {t('profileDownloadVoucher', 'Descargar Voucher')}
                            </button>
                          </div>
                        </div>

                        {/* Split Payment Group Info */}
                        {b.isSplit && (
                          <div style={{
                            backgroundColor: "rgba(59, 130, 246, 0.04)",
                            border: "1px dashed rgba(59, 130, 246, 0.3)",
                            borderRadius: "4px",
                            padding: "10px 12px",
                            fontSize: "0.72rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            marginTop: "4px"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <strong style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}>
                                {t('profileSplitActive', '💳 Split-Payment Activo (Grupal)')}
                              </strong>
                              <span style={{ fontWeight: 700, color: b.paidAmountUSD >= b.totalPriceUSD ? "#22c55e" : "#3b82f6" }}>
                                {b.paidAmountUSD >= b.totalPriceUSD ? t("profileSplitFullyPaid", "✓ Soportado Totalmente") : `${t("profileSplitMissing", "Faltan")} $${b.totalPriceUSD - b.paidAmountUSD}`}
                              </span>
                            </div>
                            <div style={{ color: "var(--text-muted)", lineHeight: "1.3" }}>
                              {t('profileSplitPerPerson', 'Cuota por persona')}: <strong>{formatPrice(b.splitShareUSD, activeCurrency)}</strong>. {t('profileSplitCollected', 'Total recaudado')}: <strong>{formatPrice(b.paidAmountUSD, activeCurrency)}</strong> {t('profileOf', 'de')} {formatPrice(b.totalPriceUSD, activeCurrency)}.
                            </div>
                            {b.friendsPaid && b.friendsPaid.length > 0 ? (
                              <div style={{ fontSize: "0.68rem", color: "#3b82f6" }}>
                                 {t('profileFriendsPaid', '👥 Amigos que pagaron')}: <strong>{b.friendsPaid.map(f => `${f.name} (${formatPrice(f.amount, activeCurrency)})`).join(", ")}</strong>
                              </div>
                            ) : b.paidAmountUSD < b.totalPriceUSD ? (
                              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                {t('profileWaitingForFriends', '⏳ Esperando abono de tus amigos...')}
                              </div>
                            ) : null}
                            {b.paidAmountUSD < b.totalPriceUSD && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`http://localhost:5173/#pay/${b.bookingId}/split`);
                                  alert("Enlace de cobro copiado al portapapeles: \n" + `http://localhost:5173/#pay/${b.bookingId}/split`);
                                }}
                                style={{
                                  alignSelf: "flex-start",
                                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                                  border: "1px solid rgba(59, 130, 246, 0.4)",
                                  color: "#60a5fa",
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  marginTop: "4px"
                                }}
                              >
                                {t('profileCopyPaymentLink', 'Copiar Enlace de Pago 🔗')}
                              </button>
                            )}
                          </div>
                        )}

                        {/* GPS Live Tracking Activation Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)", border: "1px dashed var(--border-color)", borderRadius: "4px", padding: "6px 10px", marginTop: "4px" }}>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={10} style={{ color: "var(--primary)" }} /> {t('profilePickup', 'Recogida')}: 08:30 AM (Lobby)
                          </span>
                          <button
                            onClick={() => {
                              setSelectedGpsBooking(b);
                              setGpsSecondsLeft(504);
                              setGpsTab("status");
                            }}
                            className="gps-tracker-btn"
                            style={{
                              border: "1px solid var(--primary)",
                              background: "rgba(234, 179, 8, 0.08)",
                              color: "var(--primary)",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.2s"
                            }}
                          >
                            <Navigation size={10} className="gps-nav-icon" /> {t('profileFollowBus', 'Seguir Minibús en Vivo')} 📍
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: WISHLIST / FAVORITES */}
              {activeTab === "wishlist" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {favoriteTours.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      <Heart size={32} style={{ marginBottom: "12px", color: "var(--text-muted)" }} />
                      <p style={{ fontSize: "0.85rem" }}>{t('profileNoFavorites', 'Aún no has guardado favoritos.')}</p>
                    </div>
                  ) : (
                    favoriteTours.map((t) => (
                      <div
                        key={t.id}
                        className="profile-wishlist-item"
                        style={{
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)"
                        }}
                      >
                        <div
                          onClick={() => {
                            onSelectTour(t.id);
                            onClose();
                          }}
                          className="profile-wishlist-left"
                          style={{ display: "flex", gap: "12px", alignItems: "center", cursor: "pointer", flexGrow: 1 }}
                        >
                          <img
                            src={t.image}
                            alt={t.title}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                          />
                          <div>
                            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>{t.title}</h4>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.location}</span>
                          </div>
                        </div>
                        <div className="profile-wishlist-right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--primary)" }}>
                            {formatPrice(t.price, activeCurrency)}
                          </span>
                          <button
                            onClick={() => onRemoveFromWishlist(t.id)}
                            style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer" }}
                            title={t('profileRemoveFavorite', 'Eliminar de favoritos')}
                          >
                            <Heart size={16} fill="var(--accent)" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
      <style>{`
        .profile-modal-header {
          padding: 24px 32px 16px 32px;
        }
        .profile-modal-body {
          padding: 24px 32px;
        }
        .profile-booking-item {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
        }
        .profile-wishlist-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
        }
        @keyframes red-pulse {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.4; }
        }
        .gps-live-dot {
          animation: red-pulse 1.4s infinite ease-in-out;
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .dot-typing {
          animation: dot-bounce 0.8s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .gps-tracker-btn:hover {
          background-color: var(--primary) !important;
          color: #000 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
        }
        @media (max-width: 576px) {
          .profile-modal-header {
            padding: 16px 20px 12px 20px !important;
          }
          .profile-modal-body {
            padding: 16px 12px !important;
          }
          .profile-booking-item {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 12px !important;
          }
          .profile-booking-item img {
            width: 100% !important;
            height: 120px !important;
            object-fit: cover !important;
          }
          .profile-booking-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
          }
          .profile-booking-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .profile-wishlist-item {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 12px !important;
          }
          .profile-wishlist-left {
            width: 100% !important;
          }
          .profile-wishlist-right {
            justify-content: space-between !important;
            width: 100% !important;
            border-top: 1px solid var(--border-color) !important;
            padding-top: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
