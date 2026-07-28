import React, { Suspense } from "react";
import { useTranslation } from "../../i18n/LanguageContext";

const UserProfileModal = React.lazy(() => import("../UserProfileModal"));
const CheckoutModal = React.lazy(() => import("../CheckoutModal"));
const AiPlannerModal = React.lazy(() => import("../AiPlannerModal"));

const Fallback = ({ label }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default function HomeModals({
  showProfileModal, setShowProfileModal,
  showCheckoutModal, checkoutData, setShowCheckoutModal,
  showPlannerModal, setShowPlannerModal,
  toursList, bookingsList, wishlist, activeCurrency, ecoPoints, activeLanguage,
  handleBookingSuccess, setEcoPoints, setCheckoutData,
  handleRemoveFromWishlist, handleTourClick
}) {
  const { t } = useTranslation();

  const onCheckoutSuccess = (booking) => {
    handleBookingSuccess(booking);
    const isCompensated = booking.addons && booking.addons.some((a) => a.includes("Compensación"));
    setEcoPoints((prev) => prev + (isCompensated ? 250 : 100));
  };

  return (
    <>
      {showProfileModal && (
        <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
          <UserProfileModal
            wishlist={wishlist}
            bookings={bookingsList}
            tours={toursList}
            activeCurrency={activeCurrency}
            ecoPoints={ecoPoints}
            onClose={() => setShowProfileModal(false)}
            onSelectTour={(id) => {
              handleTourClick(id);
            }}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
        </Suspense>
      )}

      {showCheckoutModal && checkoutData && (
        <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
          <CheckoutModal
            tour={checkoutData.tour}
            guests={checkoutData.guests}
            date={checkoutData.date}
            activeCurrency={activeCurrency}
            onClose={() => setShowCheckoutModal(false)}
            onBookingSuccess={onCheckoutSuccess}
          />
        </Suspense>
      )}

      {showPlannerModal && (
        <Suspense fallback={<Fallback label={t('appLoading', 'Cargando Módulos...')} />}>
          <AiPlannerModal
            tours={toursList}
            activeCurrency={activeCurrency}
            activeLanguage={activeLanguage}
            onClose={() => setShowPlannerModal(false)}
            onBookBundle={(guestsCount, selectedDate, customTour) => {
              setCheckoutData({ tour: customTour, guests: guestsCount, date: selectedDate });
              setShowPlannerModal(false);
              setShowCheckoutModal(true);
            }}
          />
        </Suspense>
      )}
    </>
  );
}
