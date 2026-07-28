import React, { Suspense, lazy, useState, useEffect } from "react";
import { useTranslation } from "./i18n/LanguageContext";
import { useAppData } from "./app/useAppData";
import { useAppRouting } from "./app/useAppRouting";
import { useToursFilter } from "./app/useToursFilter";
import HomeContent from "./components/home/HomeContent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TourDetailView from "./components/TourDetailView";
import { AuthProvider } from "./context/AuthContext";

const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat"));
const CheckoutModal = lazy(() => import("./components/CheckoutModal"));
const UserProfileModal = lazy(() => import("./components/UserProfileModal"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const DestinationToursView = lazy(() => import("./components/DestinationToursView"));
const AiPlannerModal = lazy(() => import("./components/AiPlannerModal"));
const SplitPaymentGate = lazy(() => import("./components/SplitPaymentGate"));
const RegisterPage = lazy(() => import("./components/RegisterPage"));

const Fallback = ({ label }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default function App() {
  const { t } = useTranslation();
  const data = useAppData();
  const routing = useAppRouting();
  const tours = useToursFilter({
    toursList: data.toursList,
    setToursList: data.setToursList,
    setBookingsList: data.setBookingsList,
    currentUser: data.currentUser,
    setCurrentUser: data.setCurrentUser,
    availableUsers: data.availableUsers,
    setAvailableUsers: data.setAvailableUsers,
    view: routing.view,
    setView: routing.setView,
    selectedTourId: routing.selectedTourId,
    setSelectedTourId: routing.setSelectedTourId
  });

  const [flashDealsTimer, setFlashDealsTimer] = useState(9920);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setFlashDealsTimer((prev) => (prev > 0 ? prev - 1 : 9920));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const formatTimer = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [showPlannerModal, setShowPlannerModal] = useState(false);

  const headerProps = {
    setView: routing.setView,
    theme: data.theme,
    toggleTheme: data.toggleTheme,
    activeCurrency: data.activeCurrency,
    setActiveCurrency: data.setActiveCurrency,
    activeLanguage: data.activeLanguage,
    setActiveLanguage: data.setActiveLanguage,
    onOpenProfile: () => setShowProfileModal(true),
    onOpenPlanner: () => setShowPlannerModal(true),
    onOpenRegister: () => routing.setView("register"),
    currentUser: data.currentUser,
    availableUsers: data.availableUsers,
    onChangeUser: tours.handleUserChange
  };

  // ADMIN PANEL
  if (routing.view === "admin") {
    if (!data.currentUser || data.currentUser.role === "customer") {
      return (
        <>
          <Header {...headerProps} />
          <div style={{ padding: "160px 24px", minHeight: "calc(100vh - 120px)", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Acceso restringido</h1>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "640px", margin: "0 auto 24px" }}>
              Esta área solo está disponible para operadores de tours y para el equipo de Busca Tours.
              Si estás navegando como usuario final, vuelve al sitio público para explorar y comprar tours.
            </p>
            <button
              onClick={() => routing.setView("home")}
              style={{ padding: "12px 24px", borderRadius: "999px", border: "none", backgroundColor: "var(--primary)", color: "#fff", cursor: "pointer" }}
            >
              Volver al Sitio
            </button>
          </div>
          <Footer activeLanguage={data.activeLanguage} />
        </>
      );
    }

    return (
      <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
        <AuthProvider>
          <AdminPanel
            tours={data.toursList}
            bookings={data.bookingsList}
            activeCurrency={data.activeCurrency}
            currentUser={data.currentUser}
            users={data.availableUsers}
            onBack={() => routing.setView("home")}
            onSaveTour={tours.handleSaveTour}
            onDeleteTour={tours.handleDeleteTour}
          />
        </AuthProvider>
      </Suspense>
    );
  }

  // SPLIT PAYMENT
  if (routing.view === "split-payment") {
    return (
      <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
        <SplitPaymentGate
          bookingId={routing.selectedBookingId}
          bookings={data.bookingsList}
          activeCurrency={data.activeCurrency}
          onBack={() => routing.setView("home")}
          onPaySuccess={(updatedBooking) => {
            data.setBookingsList((prev) => prev.map((b) => (b.bookingId === updatedBooking.bookingId ? updatedBooking : b)));
          }}
        />
      </Suspense>
    );
  }

  // REGISTER
  if (routing.view === "register") {
    return (
      <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
        <Header {...headerProps} />
        <RegisterPage
          theme={data.theme}
          onBack={() => routing.setView("home")}
          onRegister={tours.handleRegisterUser}
        />
      </Suspense>
    );
  }

  // TOUR DETAIL
  if (routing.view === "detail" && tours.selectedTour) {
    return (
      <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
        <Header {...headerProps} />
        <TourDetailView
          tour={tours.selectedTour}
          allTours={data.toursList}
          setView={routing.setView}
          setSelectedTourId={routing.setSelectedTourId}
          activeCurrency={data.activeCurrency}
          activeLanguage={data.activeLanguage}
          onBookTour={(guestsCount, selectedDate, customTour) => {
            setCheckoutData({ tour: customTour || tours.selectedTour, guests: guestsCount, date: selectedDate });
            setShowCheckoutModal(true);
          }}
          wishlist={data.wishlist}
          onAddToWishlist={(id) => data.setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]))}
          onRemoveFromWishlist={(id) => data.setWishlist((prev) => prev.filter((x) => x !== id))}
        />
        <Footer activeLanguage={data.activeLanguage} />
        <WhatsAppFloat />

        {showProfileModal && (
          <UserProfileModal
            wishlist={data.wishlist}
            bookings={data.bookingsList}
            tours={data.toursList}
            activeCurrency={data.activeCurrency}
            ecoPoints={data.ecoPoints}
            onClose={() => setShowProfileModal(false)}
            onSelectTour={(id) => {
              routing.setSelectedTourId(id);
              routing.setView("detail");
            }}
            onRemoveFromWishlist={(id) => data.setWishlist((prev) => prev.filter((x) => x !== id))}
          />
        )}

        {showCheckoutModal && checkoutData && (
          <CheckoutModal
            tour={checkoutData.tour}
            guests={checkoutData.guests}
            date={checkoutData.date}
            activeCurrency={data.activeCurrency}
            onClose={() => setShowCheckoutModal(false)}
            onBookingSuccess={(booking) => {
              tours.handleBookingSuccess(booking);
              const isCompensated = booking.addons && booking.addons.some((a) => a.includes("Compensación"));
              data.setEcoPoints((prev) => prev + (isCompensated ? 250 : 100));
            }}
          />
        )}

        {showPlannerModal && (
          <AiPlannerModal
            tours={data.toursList}
            activeCurrency={data.activeCurrency}
            activeLanguage={data.activeLanguage}
            onClose={() => setShowPlannerModal(false)}
            onBookBundle={(guestsCount, selectedDate, customTour) => {
              setCheckoutData({ tour: customTour, guests: guestsCount, date: selectedDate });
              setShowPlannerModal(false);
              setShowCheckoutModal(true);
            }}
          />
        )}
      </Suspense>
    );
  }

  // HOME
  return (
    <HomeContent
      setView={routing.setView}
      theme={data.theme}
      toggleTheme={data.toggleTheme}
      activeCurrency={data.activeCurrency}
      setActiveCurrency={data.setActiveCurrency}
      activeLanguage={data.activeLanguage}
      setActiveLanguage={data.setActiveLanguage}
      currentUser={data.currentUser}
      availableUsers={data.availableUsers}
      onChangeUser={tours.handleUserChange}
      toursList={data.toursList}
      filters={tours.filters}
      setFilters={tours.setFilters}
      onFilterChange={tours.handleFilterChange}
      categoriesList={tours.categoriesList}
      activeActivity={tours.activeActivity}
      setActiveActivity={tours.setActiveActivity}
      onSelectActivity={tours.handleSelectActivity}
      filteredTours={tours.filteredTours}
      handleTourClick={tours.handleTourClick}
      flashDealsTimer={flashDealsTimer}
      formatTimer={formatTimer}
      flashDealTours={tours.flashDealTours}
      popularDeals={tours.popularDeals}
      vacationTours={tours.vacationTours}
      oneDayTours={tours.oneDayTours}
      activeDestinationView={tours.activeDestinationView}
      setActiveDestinationView={tours.setActiveDestinationView}
      wishlist={data.wishlist}
      onAddToWishlist={(id) => data.setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]))}
      onRemoveFromWishlist={(id) => data.setWishlist((prev) => prev.filter((x) => x !== id))}
      showProfileModal={showProfileModal}
      setShowProfileModal={setShowProfileModal}
      showCheckoutModal={showCheckoutModal}
      checkoutData={checkoutData}
      setShowCheckoutModal={setShowCheckoutModal}
      showPlannerModal={showPlannerModal}
      setShowPlannerModal={setShowPlannerModal}
      bookingsList={data.bookingsList}
      ecoPoints={data.ecoPoints}
      setEcoPoints={data.setEcoPoints}
      setCheckoutData={setCheckoutData}
      handleBookingSuccess={tours.handleBookingSuccess}
      compareTours={tours.compareTours}
      setCompareTours={tours.setCompareTours}
      showCompareModal={tours.showCompareModal}
      setShowCompareModal={tours.setShowCompareModal}
      handleToggleCompare={tours.handleToggleCompare}
    />
  );
}
