import React from "react";
import { X } from "lucide-react";
import { useTranslation } from '../i18n/LanguageContext';
import { useCheckout } from './checkout/useCheckout';
import CrossSellStep from './checkout/CrossSellStep';
import PaymentStep from './checkout/PaymentStep';
import SuccessStep from './checkout/SuccessStep';

export default function CheckoutModal({ tour, guests, date, activeCurrency, onClose, onBookingSuccess }) {
  const { t } = useTranslation();
  const c = useCheckout({ tour, guests, t });

  const handleSubmit = (e) => c.handlePaymentSubmit(e, onBookingSuccess);

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
        className="glass-card modal modal-responsive-card checkout-modal-card"
        style={{
          width: "100%",
          maxWidth: "550px",
          maxHeight: "90vh",
          borderRadius: "var(--radius-md)",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        <div className="checkout-modal-body-scroll" style={{ overflowY: "auto", flexGrow: 1 }}>
          {c.step === 1 && (
            <CrossSellStep
              tour={tour}
              activeCurrency={activeCurrency}
              selectedAddons={c.selectedAddons}
              toggleAddon={c.toggleAddon}
              onContinue={() => c.setStep(2)}
            />
          )}

          {c.step === 2 && (
            <PaymentStep
              tour={tour}
              guests={guests}
              date={date}
              activeCurrency={activeCurrency}
              selectedAddons={c.selectedAddons}
              carbonOffset={c.carbonOffset}
              setCarbonOffset={c.setCarbonOffset}
              splitPayment={c.splitPayment}
              setSplitPayment={c.setSplitPayment}
              fullName={c.fullName}
              setFullName={c.setFullName}
              email={c.email}
              setEmail={c.setEmail}
              paymentMethod={c.paymentMethod}
              setPaymentMethod={c.setPaymentMethod}
              isChileTour={c.isChileTour}
              cardNumber={c.cardNumber}
              setCardNumber={c.setCardNumber}
              cardExpiry={c.cardExpiry}
              setCardExpiry={c.setCardExpiry}
              cardCvc={c.cardCvc}
              setCardCvc={c.setCardCvc}
              pixBRLStr={c.pixBRLStr}
              pixBrcode={c.pixBrcode}
              pixCopied={c.pixCopied}
              copyPix={c.copyPix}
              finalPriceUSD={c.finalPriceUSD}
              errorMessage={c.errorMessage}
              isProcessing={c.isProcessing}
              onSubmit={handleSubmit}
            />
          )}

          {c.step === 3 && (
            <SuccessStep
              tour={tour}
              date={date}
              guests={guests}
              fullName={c.fullName}
              activeCurrency={activeCurrency}
              finalPriceUSD={c.finalPriceUSD}
              splitPayment={c.splitPayment}
              successBookingId={c.successBookingId}
              onClose={onClose}
            />
          )}
        </div>
      </div>
      <style>{`
        .checkout-modal-card {
          padding: 0 !important;
        }
        .checkout-modal-body-scroll {
          padding: 40px;
        }
        .modal-step-padding {
          padding: 0;
        }
        @media (max-width: 576px) {
          .checkout-modal-body-scroll {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
