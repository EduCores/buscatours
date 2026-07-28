import React from "react";
import { Star, Clock, Calendar, Users, ShieldAlert, Check, X, Phone, Mail, Heart, ChevronDown, ChevronUp, MessageCircle, Compass } from "lucide-react";
import TourCard from "./TourCard";
import * as Icons from "lucide-react";
import { formatPrice } from "../data/translations";
import { useTranslation } from "../i18n/LanguageContext";
import { useTour } from "./useTour";
import ReviewModal from "./tour/ReviewModal";
import GroupPlannerModal from "./tour/GroupPlannerModal";
import ReelPlayerModal from "./tour/ReelPlayerModal";
import BuddyChatModal from "./tour/BuddyChatModal";
import TourSidebarWidgets from "./tour/TourSidebarWidgets";
import TourHeroGallery from "./tour/TourHeroGallery";

export default function TourDetailView({
  tour,
  allTours,
  setSelectedTourId,
  activeCurrency,
  activeLanguage,
  onBookTour,
  wishlist,
  onAddToWishlist,
  onRemoveFromWishlist
}) {
  const {
    activeTab, setActiveTab,
    heroSlideIndex, goHeroSlide, heroImages,
    ratingVal, bellVal, leafVal, msgVal, camVal,
    showReviewModal, setShowReviewModal,
    reviewName, setReviewName, reviewComment, setReviewComment,
    reviewStars, setReviewStars, reviewBell, setReviewBell, reviewLeaf, setReviewLeaf, reviewMsg, setReviewMsg, reviewCam, setReviewCam,
    localPosts, handleReviewSubmit, handlePostClick,
    expandedDay, toggleDay, itineraryDays, relatedTours,
    date, setDate, guests, setGuests, selectedFlexDate, setSelectedFlexDate,
    calendarViewDate, setCalendarViewDate, renderAvailabilityCalendar,
    weather, WeatherIcon, windSpeed, windSpeedOverride, setWindSpeedOverride,
    checkedItems, setCheckedItems,
    showReelPlayer, setShowReelPlayer, reelLikes, setReelLikes, hasLikedReel, setHasLikedReel,
    selectedBuddyChat, setSelectedBuddyChat, chatInput, setChatInput, buddyChats, setBuddyChats, handleSendBuddyMessage,
    showGroupPlanner, setShowGroupPlanner, copiedLink, setCopiedLink,
    plannerVotes, setPlannerVotes, plannerChatMsg, setPlannerChatMsg, plannerChats, setPlannerChats,
    isFavorited, toggleWishlist,
    displayedPosts,
    tText
  } = useTour({ tour, allTours, setSelectedTourId, activeCurrency, wishlist, onAddToWishlist, onRemoveFromWishlist });
  if (!tour) return null;
  return (
    <div style={{ backgroundColor: "var(--bg-main)", minHeight: "100vh", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>

      {/* ===== HERO IMAGE SLIDER ===== */}
      <TourHeroGallery
        tour={tour}
        heroImages={heroImages}
        heroSlideIndex={heroSlideIndex}
        goHeroSlide={goHeroSlide}
        tText={tText}
      />

      {/* 1. HERO BANNER HEADER - 100% WIDTH */}
      <section
        className="detail-hero-section"
        style={{
          position: "relative",
          minHeight: "57vh",
          paddingTop: "120px",
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          zIndex: 2,
        }}
      >
        {/* Hero Caption */}
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            paddingBottom: "80px",
            color: "#fff",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, rgba(0, 0, 0, 0.45))",
                backdropFilter: "blur(2px)",
                fontSize: "0.55rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              {tour.category}
            </span>
            {tour.discount && (
              <span
                style={{
                  color: "var(--secondary)",
                  border: "1px solid var(--secondary)",
                  backgroundColor: "color-mix(in srgb, var(--secondary) 12%, rgba(0, 0, 0, 0.45))",
                  backdropFilter: "blur(2px)",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                {String(tour.discount).replace(/\s*\(IA Spark\)/i, "")}
              </span>
            )}
            <span
              style={{
                color: "#10b981",
                border: "1px solid #10b981",
                backgroundColor: "color-mix(in srgb, #10b981 12%, rgba(0, 0, 0, 0.45))",
                backdropFilter: "blur(2px)",
                fontSize: "0.55rem",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              className="pulse-fomo"
            >
              <span style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#10b981" }} className="ping-dot"></span>
              3 <Users size={11} className="lucide lucide-users" /> {tText('tdTuristeando', 'turisteando')}
            </span>


          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1px",
              lineHeight: "1.2",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {tour.title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "16px",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 800,
              fontFamily: "var(--font-title)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icons.Star size={18} fill="#fbbf24" style={{ color: "#fbbf24" }} />
              <span style={{ fontSize: "1.1rem", color: "#ffffff" }}>{ratingVal.toFixed(1)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icons.Bell size={18} style={{ color: "#fb923c" }} />
              <span style={{ fontSize: "1.1rem", color: "#ffffff" }}>{bellVal}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icons.Leaf size={18} style={{ color: "#10b981" }} />
              <span style={{ fontSize: "1.1rem", color: "#ffffff" }}>{leafVal}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icons.MessageSquare size={18} style={{ color: "#eab308" }} />
              <span style={{ fontSize: "1.1rem", color: "#ffffff" }}>{msgVal}M</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icons.Camera size={18} style={{ color: "#3b82f6" }} />
              <span style={{ fontSize: "1.1rem", color: "#ffffff" }}>{camVal}</span>
            </div>
          </div>

          {/* Weather Widget (moved here without container) */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", zIndex: 1 }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "6px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(1.1px)",
              }}
              className="weather-icon-pulse"
            >
              <WeatherIcon size={18} style={{ color: weather.color }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-title)" }}>
                  {weather.temp}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", textTransform: "uppercase" }}>
                  {weather.desc}
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.75)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Icons.Info size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontWeight: 600 }}>Tip:</span> {weather.tip}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DETAIL LAYOUT GRID - 100% WIDTH FLUID CONTAINER */}
      <div className="container detail-main-container" style={{ marginTop: "-60px", position: "relative", zIndex: 2 }}>
        <div className="detail-grid-layout">

          {/* LEFT COLUMN: TOUR DETAILS (70%) */}
          <div className="detail-main-column" style={{ display: "flex", flexDirection: "column", gap: "30px", minWidth: 0 }}>

            {/* Quick Metadata Bar */}
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "20px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Clock size={24} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{tText('duracion', 'DURACIÓN')}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)" }}>{tour.duration}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Calendar size={24} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{tText('disponibilidad', 'DISPONIBILIDAD')}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)" }}>{tText('todoElAno', 'Todo el Año')}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Users size={24} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{tText('edadMinima', 'EDAD MÍNIMA')}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)" }}>{tText('edad12', '12+ años')}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <ShieldAlert size={24} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{tText('pasajerosMax', 'PASAJEROS MÁX.')}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)" }}>{tText('pax15', '15 personas')}</span>
              </div>
            </div>



            {/* TAB SYSTEM NAVIGATION */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "2px solid var(--border-color)",
                overflowX: "auto",
                paddingBottom: "1px",
              }}
              className="tabs-nav-container tabs-scrollable"
            >
              {["detail", "itinerary", "map", "photos", "trailer"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "trailer") setShowReelPlayer(true);
                  }}
                  style={{
                    padding: "12px 24px",
                    fontFamily: "var(--font-title)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: "none",
                    background: "transparent",
                    color: activeTab === tab ? "var(--primary)" : "var(--text-muted)",
                    borderBottom: activeTab === tab ? "3px solid var(--primary)" : "3px solid transparent",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {tab === "detail" ? tText('tdTabDetail', 'Detalle')
                    : tab === "itinerary" ? tText('tdTabItinerary', 'Itinerario')
                      : tab === "map" ? tText('tdTabMap', 'Mapa')
                        : tab === "photos" ? tText('tdTabPhotos', 'Fotos')
                          : <><Icons.PlayCircle size={14} fill="currentColor" /> {tText('tdTabTrailer', 'Trailer')}</>}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="glass-card detail-tab-content" style={{ borderRadius: "var(--radius-md)", minWidth: 0 }}>

              {/* TAB 1: GENERAL DETAIL */}
              {activeTab === "detail" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>{tText.detallesExcursion}</h3>
                    <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.7" }}>
                      {tour.description} {tText('tdDetailIntro', 'Al iniciar el viaje con Busca Tours, te aseguramos el transporte guiado local por profesionales certificados. Nos enfocamos en la seguridad y la entrega de datos arqueológicos, de fauna y flora representativos de cada sector.')}
                    </p>
                  </div>

                  {/* Verified Social Proof Badges */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                      padding: "16px 20px",
                      backgroundColor: "rgba(0,0,0,0.02)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px dashed var(--border-color)",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "12px",
                      marginBottom: "24px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Icons.ShieldCheck size={20} style={{ color: "#10b981" }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>
                        {tText('tdVerifiedOperator', 'Operador Verificado y Asegurado')}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-heading)" }}>Google</span>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#fbbf24" style={{ color: "#fbbf24" }} />)}
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                          4.9â­ ({tour.reviewsCount + 10} {tText('reviews', 'reseñas')})
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", borderLeft: "1px solid var(--border-color)", paddingLeft: "16px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#00b090" }}>TripAdvisor</span>
                        <div style={{ backgroundColor: "#00b090", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 800 }}>
                          TRAVELLER'S CHOICE 2026
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr style={{ borderColor: "var(--border-color)" }} />

                  {/* Price inclusions / exclusions */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
                    {/* Includes */}
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Check size={18} style={{ color: "var(--accent)" }} /> {tText('precioIncluye', 'El Precio Incluye')}
                      </h4>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                         <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('tdCertGuide', 'Guía local certificado (Español/Inglés)')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('tdIncludeTransport', 'Transporte privado ida y vuelta')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('tdIncludeLunch', 'Box Lunch premium con hidratación')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('tdIncludeInsurance', 'Seguros de viaje contra accidentes')}</li>
                      </ul>
                    </div>

                    {/* Excludes */}
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <X size={18} style={{ color: "var(--accent)" }} /> {tText('precioNoIncluye', 'El Precio No Incluye')}
                      </h4>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><X size={14} style={{ color: "var(--accent)" }} /> {tText('tdExcludeParks', 'Entradas a Parques Nacionales')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><X size={14} style={{ color: "var(--accent)" }} /> {tText('tdExcludeTips', 'Propinas para el guía / chofer')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><X size={14} style={{ color: "var(--accent)" }} /> {tText('tdExcludeGear', 'Equipamiento de montaña personal')}</li>
                        <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><X size={14} style={{ color: "var(--accent)" }} /> {tText('tdExcludeSnacks', 'Snacks adicionales en el trayecto')}</li>
                      </ul>
                    </div>
                  </div>



                </div>
              )}

              {/* TAB 2: ITINERARY ACCORDION */}
              {activeTab === "itinerary" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>{tText('cronograma', 'Cronograma del Viaje')}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {itineraryDays.map((day, idx) => {
                      const isExpanded = expandedDay === idx;
                      return (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "rgba(0,0,0,0.01)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => toggleDay(idx)}
                            style={{
                              width: "100%",
                              padding: "16px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "var(--font-title)",
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "var(--text-heading)",
                            }}
                          >
                            <span>{day.title}</span>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>

                          {/* Accordion body */}
                          {isExpanded && (
                            <div
                              style={{
                                padding: "0 20px 20px 20px",
                                fontSize: "0.9rem",
                                color: "var(--text-main)",
                                borderTop: "1px solid var(--border-color)",
                                paddingTop: "14px",
                                backgroundColor: "var(--bg-surface)",
                              }}
                            >
                              {day.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: MAP SIMULATION */}
              {activeTab === "map" && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>{tText('mapaRuta', 'Mapa de Ruta')}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                    {tText('tdMapDesc', 'Ubicación y recorrido geográfico para la excursión a')} {tour.title}.
                  </p>

                  {/* Map Graphic Box */}
                  <div
                    style={{
                      height: "350px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "#e3f2fd",
                      border: "1px solid var(--border-color)",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Simulated map route drawing */}
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 800 400"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      {/* Realistic Latin America Map Vector */}
                      <path
                        d="M 280 20 
                           C 310 40, 330 60, 340 70 
                           C 370 80, 390 90, 420 85 
                           C 450 80, 480 90, 510 110 
                           C 550 140, 580 180, 600 220 
                           C 570 260, 540 300, 500 340 
                           C 480 370, 460 380, 450 395 
                           C 440 360, 430 310, 420 260 
                           C 400 200, 380 150, 360 120 
                           C 370 100, 370 80, 340 70 
                           C 320 50, 300 30, 280 20 Z"
                        fill="rgba(255, 255, 255, 0.04)"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      {/* Route Line */}
                      <path
                        d="M 320,50 Q 360,110 400,210 T 560,230"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeDasharray="6"
                      />
                      {/* Interactive Route Nodes */}
                      <circle cx="320" cy="50" r="6" fill="var(--accent)" />
                      <circle cx="400" cy="210" r="6" fill="var(--primary)" />
                      <circle cx="560" cy="230" r="6" fill="var(--secondary)" />
                    </svg>
                    <div style={{ position: "absolute", left: "340px", top: "45px", backgroundColor: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {tText('tdMapOrigin', 'Origen')}
                    </div>
                    <div style={{ position: "absolute", left: "420px", top: "205px", backgroundColor: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {tText('tdMapStop', 'Escala')}
                    </div>
                    <div style={{ position: "absolute", left: "580px", top: "225px", backgroundColor: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {tText('tdMapDestino', 'Destino:')} {tour.location.split(",")[0]}
                    </div>
                    <span style={{ position: "absolute", bottom: "16px", left: "20px", fontSize: "0.8rem", color: "var(--text-muted)", zIndex: 10, backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: "20px" }}>
                      {tText('tdMapRoute', 'Ruta de Exploración Dinámica')}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 4: PHOTOS GRID */}
              {activeTab === "photos" && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "16px" }}>{tText('galeriaFotos', 'Galería de Fotos')}</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {[
                      "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
                    ].map((url, idx) => (
                      <div
                        key={idx}
                        className="hover-zoom-img"
                        style={{
                          height: "140px",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          border: "1px solid var(--border-color)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        <img
                          src={url}
                          alt="Gallery"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TRAILER */}
              {activeTab === "trailer" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icons.PlayCircle size={24} style={{ color: "var(--primary)" }} />
                    <h3 style={{ fontSize: "1.4rem", margin: 0 }}>{tText('tdTrailerTitle', 'Trailer del Tour')}</h3>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                    {tText('tdTrailerDesc', 'Mira el adelanto oficial de')} <strong>{tour.title}</strong> {tText('tdTrailerDesc2', 'y descubre lo que te espera.')}
                  </p>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      backgroundColor: "#000",
                      boxShadow: "var(--shadow-md)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <iframe
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&mute=1&rel=0&modestbranding=1"
                      title={`Trailer: ${tour.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", backgroundColor: "rgba(56,189,248,0.07)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(56,189,248,0.15)" }}>
                    <Icons.Info size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      {tText('tdTrailerNote', 'El video es una muestra representativa del destino. El operador puede actualizar el trailer en cualquier momento.')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Only: Pricing and Weather Match widgets */}

            {/* Booking Form Widget (Mobile Only) */}
            <div
              className="glass-card mobile-only"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "32px",
                boxShadow: "var(--shadow-lg)",
                marginBottom: "30px",
              }}
            >
              {/* Price Callout */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>{tText.porPersona}</span>
                <span
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "rgb(215, 156, 11)",
                    fontFamily: "var(--font-title)",
                  }}
                >
                  {formatPrice(tour.price, activeCurrency)}
                </span>
              </div>

              {/* Form Input fields */}
              {(() => {
                const getFlexibleDates = () => {
                  const baseDate = date ? new Date(date) : new Date();
                  const d0 = new Date(baseDate);
                  const d1 = new Date(baseDate);
                  d1.setDate(d1.getDate() + 2);
                  const d2 = new Date(baseDate);
                  d2.setDate(d2.getDate() + 4);

                  const formatDateStr = (d) => {
                    return d.toLocaleDateString(activeLanguage === "ES" ? "es-ES" : activeLanguage === "PT" ? "pt-BR" : "en-US", {
                      month: "short",
                      day: "numeric",
                      weekday: "short"
                    });
                  };

                  return [
                    { index: 0, dateStr: d0.toISOString().split("T")[0], display: formatDateStr(d0), discount: 0, label: activeLanguage === "ES" ? "Estándar" : activeLanguage === "PT" ? "Padrão" : "Standard" },
                    { index: 1, dateStr: d1.toISOString().split("T")[0], display: formatDateStr(d1), discount: 0.10, label: activeLanguage === "ES" ? "-10% Tarifa Promo" : activeLanguage === "PT" ? "-10% Tarifa Promo" : "-10% Promo Rate" },
                    { index: 2, dateStr: d2.toISOString().split("T")[0], display: formatDateStr(d2), discount: 0.05, label: activeLanguage === "ES" ? "-5% Tarifa Baja" : activeLanguage === "PT" ? "-5% Tarifa Baixa" : "-5% Cheap Rate" }
                  ];
                };

                const flexDates = getFlexibleDates();
                const discountFactor = selectedFlexDate === 1 ? 0.90 : selectedFlexDate === 2 ? 0.95 : 1;
                const finalGuestsPrice = Math.round(tour.price * guests * discountFactor);

                const handleSubmit = (e) => {
                  e.preventDefault();
                  const chosenDate = date || flexDates[0].dateStr;
                  const customTour = {
                    ...tour,
                    price: Math.round(tour.price * discountFactor)
                  };
                  if (onBookTour) {
                    onBookTour(guests, chosenDate, customTour);
                  }
                };

                return (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Real Availability Calendar Selector */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                        {tText.fechaSalida} ({tText('tdRealAvailability', 'Disponibilidad Real')})
                      </label>
                      {renderAvailabilityCalendar()}
                      {date && (
                        <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, marginTop: "6px" }}>
                          {tText('tdDateSelected', 'Fecha Seleccionada:')} {date}
                        </div>
                      )}
                    </div>

                    {/* Flexible Dates Recommendations */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                        <span>{tText('tdRecDates', 'Fechas Recomendadas')}</span>
                        <span style={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700 }}>{tText('tdSave10', 'Ahorra hasta 10%')}</span>
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {flexDates.map((flex) => {
                          const isFlexSelected = selectedFlexDate === flex.index;
                          return (
                            <div
                              key={flex.index}
                              onClick={() => {
                                setSelectedFlexDate(flex.index);
                                setDate(flex.dateStr);
                                setWindSpeedOverride(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 12px",
                                border: isFlexSelected ? "2px solid #10b981" : "1px solid var(--border-color)",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: isFlexSelected ? "rgba(16, 185, 129, 0.05)" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              className="flex-date-row"
                            >
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-heading)" }}>{flex.display}</span>
                                <span style={{ fontSize: "0.7rem", color: flex.discount > 0 ? "#10b981" : "var(--text-muted)", fontWeight: flex.discount > 0 ? 700 : 500 }}>{flex.label}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "rgb(215, 156, 11)" }}>
                                  {formatPrice(Math.round(tour.price * (1 - flex.discount)), activeCurrency)}
                                </span>
                                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid " + (isFlexSelected ? "#10b981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isFlexSelected ? "#10b981" : "transparent" }}>
                                  {isFlexSelected && <Check size={10} style={{ color: "#fff" }} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Guest Count Selection */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>{tText.numPasajeros}</label>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                        <button
                          type="button"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          style={{
                            width: "44px",
                            height: "44px",
                            border: "none",
                            background: "rgba(0,0,0,0.02)",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            color: "var(--text-heading)",
                          }}
                        >
                          -
                        </button>
                        <span style={{ flexGrow: 1, textAlign: "center", fontWeight: 700, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                          {guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests(guests + 1)}
                          style={{
                            width: "44px",
                            height: "44px",
                            border: "none",
                            background: "rgba(0,0,0,0.02)",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            color: "var(--text-heading)",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price Estimate */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "0.95rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{tText.totalEstimado}:</span>
                      <span style={{ fontWeight: 800, color: "rgb(215, 156, 11)", fontSize: "1.2rem" }}>
                        {formatPrice(finalGuestsPrice, activeCurrency)}
                      </span>
                    </div>

                    {/* YELLOW BUTTON BOOKING CTA */}
                    <button
                      type="submit"
                      className="btn btn-yellow animate-bounce-on-hover"
                      style={{
                        width: "100%",
                        padding: "14px",
                        marginTop: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {tText.reservarExcursion}
                    </button>
                  </form>
                );
              })()}

              {/* Wishlist, Group Planner & Travel Buddy Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginTop: "20px",
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={toggleWishlist}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: isFavorited ? "var(--accent)" : "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "color 0.2s",
                    }}
                    className="wishlist-detail-btn"
                  >
                    <Heart size={15} fill={isFavorited ? "var(--accent)" : "transparent"} style={{ color: isFavorited ? "var(--accent)" : "currentColor", transition: "transform 0.3s ease" }} />
                    {isFavorited ? tText('tdSaved', 'Guardado') : tText('tdFavorite', 'Favorito')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGroupPlanner(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "color 0.2s",
                    }}
                  >
                    <Icons.Users size={15} />
                    {tText('tdPlanGroup', 'Planificar en Grupo')}
                  </button>
                </div>

                {/* Compañero de viaje ideal integration inside the sidebar form card */}
                <div
                  style={{
                    borderTop: "1.5px dashed var(--border-color)",
                    paddingTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {tText('tdIdealBuddy', 'ðŸ‘¥ Compañero de viaje ideal')}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
                       {tText('tdIdealBuddyDesc', '¿Viajas solo? Conéctate con otros aventureros interesados en este tour.')}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {[
                      { name: "Lucas M.", flag: "ðŸ‡¦ðŸ‡·", match: "96%" },
                      { name: "Mariana R.", flag: "ðŸ‡¨ðŸ‡±", match: "91%" }
                    ].map((buddy, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedBuddyChat(buddy.name)}
                        className="btn btn-outline"
                        style={{
                          flex: 1,
                          padding: "6px",
                          fontSize: "0.72rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          fontWeight: 700
                        }}
                      >
                        <span>{buddy.flag} {buddy.name}</span>
                        <span style={{ color: "#10b981", fontSize: "0.65rem", fontWeight: 800 }}>({buddy.match})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Weather Match Widget */}
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                border: "1px solid var(--border-color)",
                background: "linear-gradient(135deg, rgba(56, 189, 248, 0.04) 0%, rgba(16, 185, 129, 0.04) 100%)",
                marginBottom: "30px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icons.CloudSun size={24} style={{ color: "var(--accent)" }} />
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                      Tour Weather Match
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{tText('tdWeatherRecs', 'Recomendaciones meteorológicas cruzadas')}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "6px 12px", borderRadius: "20px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#10b981" }}>
                    {date ? `${90 + (date.charCodeAt(date.length - 1) % 10)}% ${tText('coincidencia', 'Coincidencia')}` : `95% ${tText('coincidencia', 'Coincidencia')}`}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-main)", margin: 0 }}>
                {date ? (
                  <span>{tText('tdWeatherDate', 'Para la fecha seleccionada del')} <strong>{date}</strong>, {tText('tdWeatherIndicates', 'el pronóstico indica')} <strong>{weather.desc}</strong> {tText('tdWeatherTemp', 'con temperatura de')} <strong>{weather.temp}</strong>. {weather.tip}</span>
                ) : (
                  <span>                       {tText('tdWeatherSelect', 'Selecciona una fecha en el calendario para calcular el porcentaje de compatibilidad climática en tiempo real.')}</span>
                )}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginTop: "4px" }}>
                {[
                  { day: "Lun 10", temp: "18Â°C", match: "90%", icon: "Sun" },
                  { day: "Mar 11", temp: "15Â°C", match: "85%", icon: "CloudSun" },
                  { day: "Miér 12", temp: "22Â°C", match: "98%", icon: "Sparkles", recommended: true },
                  { day: "Jue 13", temp: "12Â°C", match: "65%", icon: "CloudRain" },
                  { day: "Vie 14", temp: "14Â°C", match: "80%", icon: "Wind" },
                ].map((forecast, idx) => {
                  const FIcon = Icons[forecast.icon] || Icons.Sun;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: forecast.recommended ? "1.5px solid #10b981" : "1px solid var(--border-color)",
                        backgroundColor: forecast.recommended ? "rgba(16, 185, 129, 0.08)" : "rgba(0,0,0,0.01)",
                        textAlign: "center",
                        position: "relative"
                      }}
                    >
                      {forecast.recommended && (
                        <span style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#10b981", color: "#fff", fontSize: "0.5rem", fontWeight: 800, padding: "1px 4px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                           {tText('tdBestWeather', 'MEJOR CLIMA')}
                        </span>
                      )}
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, display: "block", color: "var(--text-heading)", marginBottom: "4px" }}>{forecast.day}</span>
                      <div style={{ margin: "4px 0", display: "flex", justifyContent: "center" }}>
                        <FIcon size={14} style={{ color: forecast.recommended ? "#10b981" : "var(--primary)" }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, display: "block" }}>{forecast.temp}</span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600 }}>{forecast.match}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VALORACIONES DE VIAJEROS SECTION (Muro de Aventureros) */}
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "32px",
                boxShadow: "var(--shadow-md)",
                marginTop: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Compass size={24} style={{ color: "var(--accent)" }} />
                    <h3 style={{ fontSize: "1.3rem", fontFamily: "var(--font-title)", fontWeight: 800, margin: 0, textTransform: "uppercase", color: "var(--text-heading)" }}>
                      {tText('socialProofFeedTitle', 'Muro de Aventureros en Instagram & TikTok')}
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "8px 0 0 0" }}>
                    {tText('socialProofFeedSubtitle', 'Explora fotos y reviews orgánicas subidas por viajeros reales en América. Haz clic en cualquier historia para explorar su recorrido.')}
                  </p>
                </div>
                <button
                  className="btn"
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    backgroundColor: "#1ea2f1",
                    color: "#ffffff",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(30, 162, 241, 0.3)"
                  }}
                >
                  <Icons.Edit3 size={16} /> {tText('tdWriteReview', 'Escribir una valoración')}
                </button>
              </div>

              <div className="social-proof-grid">
                {displayedPosts.map((post, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePostClick(post.tourId)}
                    className="social-post-card glass-card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "12px",
                      cursor: (post.tourId === tour.id || String(post.tourId) === String(tour.id)) ? "default" : "pointer",
                      aspectRatio: "1",
                      border: "1px solid var(--border-color)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s"
                    }}
                  >
                    <img
                      src={post.image}
                      alt={post.location}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />

                    {/* Dynamic Badge for current tour post */}
                    {(post.tourId === tour.id || String(post.tourId) === String(tour.id)) && (
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        zIndex: 10,
                        textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                      }}>
                        {tText('tdThisAdventure', 'Esta Aventura â­')}
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div
                      className="social-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "20px",
                        opacity: 0.9,
                        transition: "opacity 0.3s"
                      }}
                    >
                      {/* Header Info */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={post.avatar}
                            alt={post.username}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--primary)" }}
                          />
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{post.username}</span>
                        </div>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill={i < post.rating ? "var(--primary)" : "none"}
                              stroke={i < post.rating ? "var(--primary)" : "#fff"}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "0.68rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>
                          ðŸ“ {post.location}
                        </span>
                        <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                          "{post.comment}"
                        </p>

                        {/* Social metrics */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "8px", marginTop: "4px" }}>
                          <div style={{ display: "flex", gap: "12px", color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Heart size={12} fill="#ef4444" stroke="#ef4444" /> {post.likes}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MessageCircle size={12} /> {post.comments}</span>
                          </div>
                          {(post.tourId !== tour.id && String(post.tourId) !== String(tour.id)) && (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", display: "flex", alignItems: "center", gap: "2px" }}>
                              {tText('socialProofViewTour', 'Ver Tour')} âž”
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: BOOKING SIDEBAR (30%) */}
          <div className="detail-sidebar-column" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

            {/* Booking Form Widget (Desktop Only) */}
            <div
              className="glass-card desktop-only"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "32px",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Price Callout */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>{tText.porPersona}</span>
                <span
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "rgb(215, 156, 11)",
                    fontFamily: "var(--font-title)",
                  }}
                >
                  {formatPrice(tour.price, activeCurrency)}
                </span>
              </div>

              {/* Form Input fields */}
              {(() => {
                const getFlexibleDates = () => {
                  const baseDate = date ? new Date(date) : new Date();
                  const d0 = new Date(baseDate);
                  const d1 = new Date(baseDate);
                  d1.setDate(d1.getDate() + 2);
                  const d2 = new Date(baseDate);
                  d2.setDate(d2.getDate() + 4);

                  const formatDateStr = (d) => {
                    return d.toLocaleDateString(activeLanguage === "ES" ? "es-ES" : activeLanguage === "PT" ? "pt-BR" : "en-US", {
                      month: "short",
                      day: "numeric",
                      weekday: "short"
                    });
                  };

                  return [
                    { index: 0, dateStr: d0.toISOString().split("T")[0], display: formatDateStr(d0), discount: 0, label: activeLanguage === "ES" ? "Estándar" : activeLanguage === "PT" ? "Padrão" : "Standard" },
                    { index: 1, dateStr: d1.toISOString().split("T")[0], display: formatDateStr(d1), discount: 0.10, label: activeLanguage === "ES" ? "-10% Tarifa Promo" : activeLanguage === "PT" ? "-10% Tarifa Promo" : "-10% Promo Rate" },
                    { index: 2, dateStr: d2.toISOString().split("T")[0], display: formatDateStr(d2), discount: 0.05, label: activeLanguage === "ES" ? "-5% Tarifa Baja" : activeLanguage === "PT" ? "-5% Tarifa Baixa" : "-5% Cheap Rate" }
                  ];
                };

                const flexDates = getFlexibleDates();
                const discountFactor = selectedFlexDate === 1 ? 0.90 : selectedFlexDate === 2 ? 0.95 : 1;
                const finalGuestsPrice = Math.round(tour.price * guests * discountFactor);

                const handleSubmit = (e) => {
                  e.preventDefault();
                  const chosenDate = date || flexDates[0].dateStr;
                  const customTour = {
                    ...tour,
                    price: Math.round(tour.price * discountFactor)
                  };
                  if (onBookTour) {
                    onBookTour(guests, chosenDate, customTour);
                  }
                };

                return (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Real Availability Calendar Selector */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                        {tText.fechaSalida} ({tText('tdRealAvailability', 'Disponibilidad Real')})
                      </label>
                      {renderAvailabilityCalendar()}
                      {date && (
                        <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, marginTop: "6px" }}>
                          {tText('tdDateSelected', 'Fecha Seleccionada:')} {date}
                        </div>
                      )}
                    </div>

                    {/* Flexible Dates Recommendations */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                        <span>{tText('tdRecDates', 'Fechas Recomendadas')}</span>
                        <span style={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700 }}>{tText('tdSave10', 'Ahorra hasta 10%')}</span>
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {flexDates.map((flex) => {
                          const isFlexSelected = selectedFlexDate === flex.index;
                          return (
                            <div
                              key={flex.index}
                              onClick={() => {
                                setSelectedFlexDate(flex.index);
                                setDate(flex.dateStr);
                                setWindSpeedOverride(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 12px",
                                border: isFlexSelected ? "2px solid #10b981" : "1px solid var(--border-color)",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: isFlexSelected ? "rgba(16, 185, 129, 0.05)" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              className="flex-date-row"
                            >
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-heading)" }}>{flex.display}</span>
                                <span style={{ fontSize: "0.7rem", color: flex.discount > 0 ? "#10b981" : "var(--text-muted)", fontWeight: flex.discount > 0 ? 700 : 500 }}>{flex.label}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "rgb(215, 156, 11)" }}>
                                  {formatPrice(Math.round(tour.price * (1 - flex.discount)), activeCurrency)}
                                </span>
                                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid " + (isFlexSelected ? "#10b981" : "var(--border-color)"), display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isFlexSelected ? "#10b981" : "transparent" }}>
                                  {isFlexSelected && <Check size={10} style={{ color: "#fff" }} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Guest Count Selection */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>{tText.numPasajeros}</label>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                        <button
                          type="button"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          style={{
                            width: "44px",
                            height: "44px",
                            border: "none",
                            background: "rgba(0,0,0,0.02)",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            color: "var(--text-heading)",
                          }}
                        >
                          -
                        </button>
                        <span style={{ flexGrow: 1, textAlign: "center", fontWeight: 700, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                          {guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests(guests + 1)}
                          style={{
                            width: "44px",
                            height: "44px",
                            border: "none",
                            background: "rgba(0,0,0,0.02)",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            color: "var(--text-heading)",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price Estimate */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "0.95rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{tText.totalEstimado}:</span>
                      <span style={{ fontWeight: 800, color: "rgb(215, 156, 11)", fontSize: "1.2rem" }}>
                        {formatPrice(finalGuestsPrice, activeCurrency)}
                      </span>
                    </div>

                    {/* YELLOW BUTTON BOOKING CTA (USER SPECIFIC SPECIFICATION) */}
                    <button
                      type="submit"
                      className="btn btn-yellow animate-bounce-on-hover"
                      style={{
                        width: "100%",
                        padding: "14px",
                        marginTop: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {tText.reservarExcursion}
                    </button>
                  </form>
                );
              })()}

              {/* Wishlist, Group Planner & Travel Buddy Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginTop: "20px",
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={toggleWishlist}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: isFavorited ? "var(--accent)" : "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "color 0.2s",
                    }}
                    className="wishlist-detail-btn"
                  >
                    <Heart size={15} fill={isFavorited ? "var(--accent)" : "transparent"} style={{ color: isFavorited ? "var(--accent)" : "currentColor", transition: "transform 0.3s ease" }} />
                    {isFavorited ? tText('tdSaved', 'Guardado') : tText('tdFavorite', 'Favorito')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGroupPlanner(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "color 0.2s",
                    }}
                  >
                    <Icons.Users size={15} />
                    {tText('tdPlanGroup', 'Planificar en Grupo')}
                  </button>
                </div>

                {/* Compañero de viaje ideal integration inside the sidebar form card */}
                <div
                  style={{
                    borderTop: "1.5px dashed var(--border-color)",
                    paddingTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {tText('tdIdealBuddy', 'ðŸ‘¥ Compañero de viaje ideal')}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
                       {tText('tdIdealBuddyDesc', '¿Viajas solo? Conéctate con otros aventureros interesados en este tour.')}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {[
                      { name: "Lucas M.", flag: "ðŸ‡¦ðŸ‡·", match: "96%" },
                      { name: "Mariana R.", flag: "ðŸ‡¨ðŸ‡±", match: "91%" }
                    ].map((buddy, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedBuddyChat(buddy.name)}
                        className="btn btn-outline"
                        style={{
                          flex: 1,
                          padding: "6px",
                          fontSize: "0.72rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          fontWeight: 700
                        }}
                      >
                        <span>{buddy.flag} {buddy.name}</span>
                        <span style={{ color: "#10b981", fontSize: "0.65rem", fontWeight: 800 }}>({buddy.match})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar widgets: Weather Guarantee, Smart Pack, Carbon Footprint */}
            <TourSidebarWidgets
              tour={tour}
              weather={weather}
              windSpeed={windSpeed}
              windSpeedOverride={windSpeedOverride}
              setWindSpeedOverride={setWindSpeedOverride}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              tText={tText}
            />



            {/* Why Book With Us Widget */}
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "24px",
              }}
            >
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "16px" }}>{tText('porQueReservar', '¿Por qué reservar con Busca Tours?')}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('confirmacionInmediata', 'Confirmación inmediata de reserva')}</li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('sinCargosOcultos', 'Sin cargos ocultos ni sorpresas')}</li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('cancelacionFlexible', 'Cancelación flexible (24 horas antes)')}</li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}><Check size={14} style={{ color: "var(--primary)" }} /> {tText('guiasExpertos', 'Guías locales con años de experiencia')}</li>
              </ul>
            </div>

            {/* Get a Question Widget */}
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-md)",
                padding: "24px",
              }}
            >
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "12px" }}>{tText('tienesPreguntas', '¿Tienes preguntas?')}</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {tText('ayudaCoordinar', 'Si necesitas ayuda para esta excursión o coordinar un viaje a medida, contáctanos:')}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
                <a href="tel:+56612414567" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "var(--primary)" }}>
                  <Phone size={14} />
                  +56 61 241 4567
                </a>
                <a href="mailto:contacto@buscatours.cl" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "var(--primary)" }}>
                  <Mail size={14} />
                  contacto@buscatours.cl
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>



      {/* 3. RELATED TOURS SECTION - BEFORE FOOTER */}
      {relatedTours.length > 0 && (
        <section
          style={{
            marginTop: "60px",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "60px",
          }}
        >
          <div className="container">
            <h3
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text-heading)",
                marginBottom: "30px",
              }}
            >
              {tText('toursRelacionados', 'Tours Relacionados')}
            </h3>

            <div className="tours-grid-layout">
              {relatedTours.map((t) => (
                <div key={t.id} onClick={() => { setSelectedTourId(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
                  <TourCard tour={t} activeCurrency={activeCurrency} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injecting dynamic grid styles locally */}
      <style>{`
        .mobile-only {
          display: none !important;
        }
        .desktop-only {
          display: block !important;
        }
        div.desktop-only.flex-style {
          display: flex !important;
        }
        @media (max-width: 991px) {
          .mobile-only {
            display: block !important;
          }
          div.mobile-only.flex-style {
            display: flex !important;
          }
          .desktop-only,
          div.desktop-only.flex-style {
            display: none !important;
          }
        }
        .detail-grid-layout {
          display: grid;
          grid-template-columns: 7fr 3fr;
          gap: 32px;
        }
        @media (max-width: 991px) {
          .detail-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .tours-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }
        .detail-tab-content {
          padding: 32px;
        }
        @media (max-width: 576px) {
          .detail-tab-content {
            padding: 20px 16px !important;
          }
          .detail-grid-layout {
            gap: 20px !important;
          }
        }
        .social-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .social-post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45) !important;
          border-color: var(--primary) !important;
        }
        @media (max-width: 768px) {
          .social-proof-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .social-proof-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .detail-hero-section {
            padding-top: 160px !important;
          }
        }
        @media (max-width: 576px) {
          .detail-hero-section {
            min-height: 38vh !important;
            padding-top: 126px !important;
          }
          .detail-main-container {
            margin-top: 30px !important;
          }
        }
      `}</style>

      {/* 4. COLLABORATIVE GROUP PLANNER SLIDEOUT MODAL */}
      {showGroupPlanner && (
        <div style={{
          position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "420px", height: "100%",
          backgroundColor: "var(--bg-surface)", borderLeft: "1px solid var(--border-color)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.4)", zIndex: 1500, display: "flex", flexDirection: "column",
          fontFamily: "var(--font-body)", color: "var(--text-main)"
        }}>
          {/* Header */}
          <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Icons.Users style={{ color: "var(--primary)" }} /> Planificador Grupal BuscaTours
            </h3>
            <button onClick={() => setShowGroupPlanner(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <Icons.X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Invite link share */}
            <div style={{ backgroundColor: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Enlace para Compartir con Amigos
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  readOnly
                  value={`http://localhost:5173/#tour/${tour.id}?grp=736358`}
                  style={{ flex: 1, padding: "6px 10px", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.75rem", backgroundColor: "rgba(0,0,0,0.01)", color: "var(--text-muted)", outline: "none" }}
                />
                <button
                  onClick={() => {
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  style={{ padding: "6px 12px", border: "none", backgroundColor: "var(--primary)", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  {copiedLink ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Live voting */}
            <div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "10px" }}>Preferencias de Fecha del Grupo</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {plannerVotes.map((v, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "var(--bg-surface)", fontSize: "0.8rem" }}>
                    <span>ðŸ‘¤ <strong>{v.name}</strong></span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{v.date}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: v.status.includes("Confirmado") ? "#22c55e" : "var(--primary)" }}>{v.status}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (plannerVotes.some(x => x.name.includes("TÃº"))) return;
                  setPlannerVotes([...plannerVotes, { name: "TÃº (Organizador)", date: date || "Por definir", status: "Confirmado ðŸ‘" }]);
                }}
                className="btn btn-outline"
                style={{ width: "100%", padding: "8px", fontSize: "0.78rem", marginTop: "10px" }}
              >
                Votar por mi Fecha Seleccionada
              </button>
            </div>

            {/* Chat section */}
            <div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "10px" }}>Chat del Grupo</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "180px", overflowY: "auto", padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.01)" }}>
                {plannerChats.map((c, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px", alignSelf: c.sender === "TÃº" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", alignSelf: c.sender === "TÃº" ? "flex-end" : "flex-start" }}>{c.sender} â€¢ {c.time}</span>
                    <div style={{ padding: "8px 12px", borderRadius: "12px", fontSize: "0.78rem", backgroundColor: c.sender === "TÃº" ? "var(--primary)" : "var(--bg-surface)", color: c.sender === "TÃº" ? "#fff" : "var(--text-main)", border: c.sender === "TÃº" ? "none" : "1px solid var(--border-color)" }}>
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Escribe un mensaje al grupo..."
                  value={plannerChatMsg}
                  onChange={(e) => setPlannerChatMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && plannerChatMsg.trim()) {
                      setPlannerChats([...plannerChats, { sender: "TÃº", text: plannerChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                      setPlannerChatMsg("");
                    }
                  }}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "var(--bg-surface)", color: "var(--text-main)", outline: "none" }}
                />
                <button
                  onClick={() => {
                    if (!plannerChatMsg.trim()) return;
                    setPlannerChats([...plannerChats, { sender: "TÃº", text: plannerChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                    setPlannerChatMsg("");
                  }}
                  style={{ border: "none", backgroundColor: "var(--primary)", color: "#fff", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}
                >
                  Enviar
                </button>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                alert("Itinerario compartido guardado. Todos los miembros recibirán notificaciones.");
                setShowGroupPlanner(false);
              }}
              className="btn btn-primary"
              style={{ flex: 1, padding: "10px", fontSize: "0.85rem" }}
            >
              Confirmar Itinerario Grupal
            </button>
          </div>
        </div>
      )}

      {/* VERTICAL REEL PLAYER MODAL */}
      <ReelPlayerModal
        showReelPlayer={showReelPlayer}
        setShowReelPlayer={setShowReelPlayer}
        tour={tour}
        reelLikes={reelLikes}
        setReelLikes={setReelLikes}
        hasLikedReel={hasLikedReel}
        setHasLikedReel={setHasLikedReel}
      />

      {/* TRAVEL BUDDY CHAT MODAL */}
      <BuddyChatModal
        selectedBuddyChat={selectedBuddyChat}
        setSelectedBuddyChat={setSelectedBuddyChat}
        buddyChats={buddyChats}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendBuddyMessage={handleSendBuddyMessage}
      />

      {/* VALORAR TOUR MODAL (SOLO TURISTA) */}
      <ReviewModal
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
        reviewName={reviewName}
        setReviewName={setReviewName}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewStars={reviewStars}
        setReviewStars={setReviewStars}
        reviewBell={reviewBell}
        setReviewBell={setReviewBell}
        reviewLeaf={reviewLeaf}
        setReviewLeaf={setReviewLeaf}
        reviewMsg={reviewMsg}
        setReviewMsg={setReviewMsg}
        reviewCam={reviewCam}
        setReviewCam={setReviewCam}
        handleReviewSubmit={handleReviewSubmit}
        tText={tText}
      />

    </div>
  );
}
