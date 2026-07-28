import React, { Suspense, lazy } from "react";
import * as Icons from "lucide-react";
import { Sparkles, Calendar, Compass, ChevronRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageContext";
import { formatPrice } from "../../data/translations";
import Header from "../Header";
import HeroSlider from "../HeroSlider";
import SearchBar from "../SearchBar";
import Destinations from "../Destinations";
import TrustBadges from "../TrustBadges";
import TourCarousel from "../TourCarousel";
import TourCard from "../TourCard";
import Footer from "../Footer";
import { destinationsData, activitiesData } from "../../data/tours";
import CompareDrawer from "./CompareDrawer";
import HomeModals from "./HomeModals";

const WhatsAppFloat = lazy(() => import("../WhatsAppFloat"));
const PreFooterSlider = lazy(() => import("../PreFooterSlider"));
const InteractiveMap = lazy(() => import("../InteractiveMap"));
const DestinationToursView = lazy(() => import("../DestinationToursView"));
const SocialProofFeed = lazy(() => import("../SocialProofFeed"));

const countryVideos = {
  "argentina": "https://assets.mixkit.co/videos/preview/mixkit-glacier-river-in-patagonia-41808-large.mp4",
  "perú": "https://assets.mixkit.co/videos/preview/mixkit-ancient-ruins-on-a-hill-under-clouds-40995-large.mp4",
  "bolivia": "https://assets.mixkit.co/videos/preview/mixkit-water-reflecting-the-clouds-and-sunset-41618-large.mp4",
  "brasil": "https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-turquoise-water-and-palm-trees-41819-large.mp4",
  "colombia": "https://assets.mixkit.co/videos/preview/mixkit-tropical-island-landscape-view-4692-large.mp4",
  "ecuador": "https://assets.mixkit.co/videos/preview/mixkit-underwater-view-of-a-coral-reef-and-fish-41639-large.mp4",
  "chile": "https://assets.mixkit.co/videos/preview/mixkit-mountains-under-the-stars-in-chile-41805-large.mp4"
};

export default function HomeContent({
  // header
  setView, theme, toggleTheme, activeCurrency, setActiveCurrency, activeLanguage, setActiveLanguage,
  currentUser, availableUsers, onChangeUser,
  // search
  toursList, filters, setFilters, onFilterChange, categoriesList, activeActivity, setActiveActivity, onSelectActivity, filteredTours, handleTourClick,
  // sections
  flashDealsTimer, formatTimer, flashDealTours, popularDeals, vacationTours, oneDayTours,
  activeDestinationView, setActiveDestinationView,
  // wishlist
  wishlist, onAddToWishlist, onRemoveFromWishlist,
  // modals
  showProfileModal, setShowProfileModal,
  showCheckoutModal, checkoutData, setShowCheckoutModal,
  showPlannerModal, setShowPlannerModal,
  bookingsList, ecoPoints, setEcoPoints, setCheckoutData,
  handleBookingSuccess,
  // compare
  compareTours, setCompareTours, showCompareModal, setShowCompareModal, handleToggleCompare
}) {
  const { t } = useTranslation();
  const [hoveredSidebarDest, setHoveredSidebarDest] = React.useState(null);

  const renderActivityIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) return <IconComponent size={14} style={{ color: "var(--primary)" }} />;
    return <Icons.HelpCircle size={14} style={{ color: "var(--primary)" }} />;
  };

  const headerProps = {
    setView, theme, toggleTheme, activeCurrency, setActiveCurrency, activeLanguage, setActiveLanguage,
    onOpenProfile: () => setShowProfileModal(true),
    onOpenPlanner: () => setShowPlannerModal(true),
    onOpenRegister: () => setView("register"),
    currentUser, availableUsers, onChangeUser
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">{t('appLoading', 'Cargando Módulos...')}</span>
      </div>
    }>
      <div style={{ width: "100%", overflowX: "hidden", position: "relative", maxWidth: "100vw" }}>
        <Header {...headerProps} />

        <HeroSlider>
          <SearchBar
            tours={toursList}
            onTourClick={handleTourClick}
            filters={filters}
            onFilterChange={onFilterChange}
            categories={categoriesList}
            activeActivity={activeActivity}
            onSelectActivity={onSelectActivity}
            activeLanguage={activeLanguage}
            activeCurrency={activeCurrency}
          />
        </HeroSlider>

        {activeDestinationView ? (
          <div id="destination-tours-view-top">
            <DestinationToursView
              destinationName={activeDestinationView}
              allTours={toursList}
              activeCurrency={activeCurrency}
              activeLanguage={activeLanguage}
              onClose={() => setActiveDestinationView(null)}
              onTourClick={handleTourClick}
            />
          </div>
        ) : (
          <main style={{ padding: "12px 0 var(--radius-lg) 0", backgroundColor: "var(--bg-main)", marginTop: "-2px", position: "relative", zIndex: 10 }}>
            <div className="container" style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
              {filters.searchMode === "map" ? (
                <div style={{ marginTop: "10px", width: "100%" }} className="fade-in-up">
                  <InteractiveMap tours={filteredTours} activeCurrency={activeCurrency} onTourClick={handleTourClick} />
                </div>
              ) : filters.searchMode === "vibe" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "10px" }} className="fade-in-up">
                  <div style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icons.Compass size={22} style={{ color: "#a855f7" }} />
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>RESULTADOS ORDENADOS POR VIBRA Y ÁNIMO</h3>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {filteredTours.length} {filteredTours.length === 1 ? "tour encontrado" : "tours encontrados"}
                    </span>
                  </div>
                  {filteredTours.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
                      {filteredTours.map((tour) => (
                        <TourCard
                          key={tour.id}
                          tour={tour}
                          activeCurrency={activeCurrency}
                          onClick={() => handleTourClick(tour.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)" }}>
                      <Icons.Compass size={48} style={{ color: "var(--text-muted)", marginBottom: "16px", animation: "spin 10s linear infinite" }} />
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>{t.noEncontrado}</h3>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                        No hay tours dentro de tu rango de presupuesto. Prueba incrementando el presupuesto máximo en la pestaña tradicional.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "60px", marginTop: "0" }}>
                    <TourCarousel
                      tours={flashDealTours.map((deal, idx) => {
                        const discountPercentage = 15 + idx * 5;
                        const dealPrice = Math.round(deal.price * (1 - discountPercentage / 100));
                        return { ...deal, originalPrice: deal.price, price: dealPrice, discount: `¡${discountPercentage}% OFF!` };
                      })}
                      activeCurrency={activeCurrency}
                      onTourClick={handleTourClick}
                      direction="right"
                      icon={Icons.Zap}
                      title="OFERTAS RELÁMPAGO"
                      linkText={activeLanguage === "ES" ? "Ver ofertas" : activeLanguage === "EN" ? "View flash deals" : "Ver ofertas relâmpago"}
                      itemsPerPage={4}
                      customHeaderElement={
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgb(255, 191, 0)", backdropFilter: "blur(2px)", borderRadius: "4px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          <Icons.Timer size={12} /> Termina en: <span style={{ fontFamily: "monospace", color: "rgb(234, 236, 241)", fontSize: "0.75rem" }}>{formatTimer(flashDealsTimer)}</span>
                        </div>
                      }
                    />

                    {popularDeals.length > 0 && (
                      <TourCarousel
                        tours={popularDeals}
                        activeCurrency={activeCurrency}
                        onTourClick={handleTourClick}
                        direction="right"
                        icon={Icons.Sparkles}
                        title="POPULAR DEALS"
                        linkText={activeLanguage === "ES" ? "Ver promociones" : activeLanguage === "EN" ? "View popular promotions" : "Ver promoções populares"}
                        itemsPerPage={4}
                        onToggleCompare={handleToggleCompare}
                        compareTours={compareTours}
                      />
                    )}
                  </div>

                  {vacationTours.length > 0 && (
                    <div className="section-two-columns">
                      <TourCarousel
                        tours={vacationTours}
                        activeCurrency={activeCurrency}
                        onTourClick={handleTourClick}
                        direction="left"
                        icon={Calendar}
                        title="TOP VACATION TOURS"
                        linkText={activeLanguage === "ES" ? "Ver Tours" : activeLanguage === "EN" ? "View vacation packages" : "Ver pacotes de férias"}
                        onToggleCompare={handleToggleCompare}
                        compareTours={compareTours}
                      />

                      <aside className="right-sidebar-area" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                          <div className="sidebar-heading-bar">
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{t.destinosDestacados}</h3>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                            {destinationsData.slice(0, 4).map((d, idx) => (
                              <div
                                key={idx}
                                onClick={() => { setActiveDestinationView(d.name); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                onMouseEnter={() => setHoveredSidebarDest(idx)}
                                onMouseLeave={() => setHoveredSidebarDest(null)}
                                style={{ height: "75px", borderRadius: "var(--radius-sm)", position: "relative", overflow: "hidden", cursor: "pointer" }}
                              >
                                <img
                                  src={d.image}
                                  alt={d.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease", opacity: hoveredSidebarDest === idx ? 0 : 1 }}
                                  className="card-bg-image"
                                />
                                {hoveredSidebarDest === idx && (
                                  <video
                                    src={countryVideos[d.name.toLowerCase()]}
                                    autoPlay muted loop playsInline
                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                                  />
                                )}
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1 }} />
                                <span style={{ position: "absolute", bottom: "8px", left: "8px", color: "#fff", fontSize: "0.75rem", fontWeight: 700, zIndex: 2 }}>{d.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="sidebar-heading-bar">
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{t.buscarActividad}</h3>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {activitiesData.map((act, idx) => (
                              <a
                                key={idx}
                                href="#tours"
                                onClick={() => onSelectActivity(act.name)}
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500, transition: "color 0.2s" }}
                                className="activity-link"
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {renderActivityIcon(act.icon)}
                                  <span>{act.name}</span>
                                </div>
                                <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </div>
                  )}

                  {oneDayTours.length > 0 && (
                    <div className="section-two-columns">
                      <TourCarousel
                        tours={oneDayTours}
                        activeCurrency={activeCurrency}
                        onTourClick={handleTourClick}
                        direction="up"
                        icon={Compass}
                        title="TOP ONE DAY TOURS"
                        linkText={activeLanguage === "ES" ? "Ver excursiones diarias" : activeLanguage === "EN" ? "View daily excursions" : "Ver excursões diárias"}
                        onToggleCompare={handleToggleCompare}
                        compareTours={compareTours}
                      />
                    </div>
                  )}
                </>
              )}

              <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                <Destinations
                  tours={toursList}
                  onSelectDestination={(destName) => {
                    setActiveDestinationView(destName);
                    setTimeout(() => {
                      const target = document.getElementById("destination-tours-view-top");
                      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                      else window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                />
              </div>

              {filteredTours.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)" }}>
                  <Compass size={48} style={{ color: "var(--text-muted)", marginBottom: "16px", animation: "spin 10s linear infinite" }} />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>{t.noEncontrado}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                    Intenta ajustando el presupuesto, cambiando la categoría o escribiendo un término de búsqueda diferente.
                  </p>
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: "24px", padding: "8px 20px" }}
                    onClick={() => {
                      setFilters({ query: "", duration: "all", category: "all", maxPrice: 4000, searchMode: "ai", vibeScores: { adrenaline: 50, relax: 50, culture: 50, family: 50 } });
                      setActiveActivity("all");
                    }}
                  >
                    {t.limpiarFiltros}
                  </button>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "40px" }}>
                <div style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icons.UserCheck size={22} style={{ color: "#22c55e" }} />
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>SHOWCASE DE OPERADORES DE LATAM VERIFICADOS</h3>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                  {[
                    { name: "Andes Expeditions", loc: "Cusco, Perú", rating: "5.0 ★", response: "5 min", tours: "Cultura & Trekking", reviews: 142 },
                    { name: "Patagonia Wild Outdoors", loc: "Puerto Natales, Chile", rating: "4.9 ★", response: "12 min", tours: "Glaciares & Trekking", reviews: 98 },
                    { name: "Amazon Green Travel", loc: "Leticia, Colombia", rating: "4.8 ★", response: "9 min", tours: "Selva & Navegación", reviews: 54 }
                  ].map((op, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: "0.95rem", color: "var(--text-heading)", display: "block" }}>{op.name}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>📍 {op.loc}</span>
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "#22c55e", border: "1px solid #22c55e", backgroundColor: "color-mix(in srgb, #22c55e 12%, rgba(0, 0, 0, 0.45))", backdropFilter: "blur(2px)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "inline-block" }}>
                          ✓ Verificado
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", backgroundColor: "rgba(0,0,0,0.02)", padding: "10px", borderRadius: "6px", fontSize: "0.75rem" }}>
                        <div>
                          <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.68rem" }}>Soporte chat</span>
                          <strong>{op.response} resp.</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.68rem" }}>Especialidad</span>
                          <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: "100%" }}>{op.tours}</strong>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", fontSize: "0.75rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>{op.reviews} reseñas</span>
                        <strong style={{ color: "#fbbf24" }}>{op.rating}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SocialProofFeed onTourClick={handleTourClick} />
            </div>
          </main>
        )}

        <PreFooterSlider>
          <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
            <div className="glass-card" style={{ padding: "40px", borderRadius: "var(--radius-md)", backgroundColor: "var(--topbar-bg-glass)", color: "#fff" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "16px" }}>¿Tienes dudas?</h3>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", marginBottom: "24px" }}>
                Habla directamente con un experto local de Buscatours en LATAM.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <a href="tel:1820334533" style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--yellow-btn)", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "50%" }}>📞</span>
                  1.820.3345.33
                </a>
                <a href="mailto:contacto@buscatours.com" style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--yellow-btn)", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "50%" }}>✉️</span>
                  contacto@buscatours.com
                </a>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "40px", borderRadius: "var(--radius-md)", backgroundColor: "var(--topbar-bg-glass)", color: "#fff" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "16px" }}>Boletín de Ofertas</h3>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", marginBottom: "24px" }}>
                Inscríbete para recibir promociones exclusivas y paquetes vacacionales en LATAM.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte!"); }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input type="email" placeholder="Tu correo electrónico" required style={{ padding: "14px 18px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "1rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }} />
                <button type="submit" className="btn btn-primary" style={{ padding: "14px", fontSize: "1rem", borderRadius: "var(--radius-sm)" }}>Suscribirse ahora</button>
              </form>
            </div>
          </div>

          <div style={{ marginTop: "40px", marginBottom: "0px" }}>
            <TrustBadges />
          </div>

          <Footer activeLanguage={activeLanguage} />
        </PreFooterSlider>

        <WhatsAppFloat />

        <HomeModals
          showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal}
          showCheckoutModal={showCheckoutModal} checkoutData={checkoutData} setShowCheckoutModal={setShowCheckoutModal}
          showPlannerModal={showPlannerModal} setShowPlannerModal={setShowPlannerModal}
          toursList={toursList} bookingsList={bookingsList} wishlist={wishlist}
          activeCurrency={activeCurrency} ecoPoints={ecoPoints} activeLanguage={activeLanguage}
          handleBookingSuccess={handleBookingSuccess} setEcoPoints={setEcoPoints} setCheckoutData={setCheckoutData}
          handleRemoveFromWishlist={onRemoveFromWishlist} handleTourClick={handleTourClick}
        />

        <CompareDrawer
          compareTours={compareTours}
          toursList={toursList}
          activeCurrency={activeCurrency}
          showCompareModal={showCompareModal}
          setCompareTours={setCompareTours}
          setShowCompareModal={setShowCompareModal}
          handleToggleCompare={handleToggleCompare}
          handleTourClick={handleTourClick}
        />
      </div>
    </Suspense>
  );
}
