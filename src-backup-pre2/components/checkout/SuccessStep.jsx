import React from "react";
import { Check, Compass } from "lucide-react";
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from "../../data/translations";

export default function SuccessStep({ tour, date, guests, fullName, activeCurrency, finalPriceUSD, splitPayment, successBookingId, onClose }) {
  const { t } = useTranslation();
  const splitShare = Math.round(finalPriceUSD / guests);
  return (
    <div className="modal-step-padding" style={{ textAlign: "center" }}>
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)"
        }}
      >
        <Check size={30} />
      </div>
      <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "6px" }}>{t('checkoutConfirmed', '¡Pago Confirmado!')}</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
        {t('checkoutVoucherIntro', 'Tu reserva está confirmada. Presenta este voucher digital al abordar.')}
      </p>

      {/* Boarding Pass Voucher */}
      <div
        className="boarding-pass"
        style={{
          textAlign: "left",
          marginBottom: "20px",
          backgroundColor: "var(--bg-main)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div className="boarding-pass-header">
          <div>
            <span style={{ fontSize: "0.55rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.8, letterSpacing: "1px", display: "block" }}>{t('checkoutBoardingPass', 'PASE DE ABORDAJE')}</span>
            <strong style={{ fontSize: "1rem" }}>BuscaTours Voucher</strong>
          </div>
          <Compass size={22} style={{ opacity: 0.9 }} />
        </div>

        <div className="boarding-pass-body">
          <div>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('checkoutTourExp', 'TOUR / EXPERIENCIA')}</span>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tour.title}</strong>
          </div>

          <div>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('checkoutDateHour', 'FECHA / HORA')}</span>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>{date || "12/07/2026"} (08:30 AM)</strong>
          </div>

          <div>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('checkoutHolder', 'TITULAR')}</span>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>{fullName || "Cliente"}</strong>
          </div>

          <div>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", fontWeight: 700 }}>{t('checkoutPassengers', 'PASAJEROS')}</span>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-heading)", display: "block" }}>{guests} {guests > 1 ? t('profileTravelers', 'Viajeros') : t('profileTraveler', 'Viajero')}</strong>
          </div>
        </div>

        <div className="boarding-pass-footer">
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", fontWeight: 700 }}>{t('checkoutBookingCode', 'CÓDIGO DE RESERVA')}</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--primary)", fontFamily: "monospace" }}>{successBookingId || "BT-45218"}</strong>
          </div>
          {/* Visual QR Code */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40" height="40" viewBox="0 0 29 29" style={{ display: "block" }}>
                <path d="M0 0h7v7H0zm1 1v5h5V1zm8-1h1v1H9zm1 1h1v1h-1zm1 1h1v1h-1zm-3-3h1v1H7zm1 3h1v1H8zm-3 4h1v1H5zm6-4h1v1h-1zm0 3h1v1h-1zm-2 1h1v1H9zm2 1h1v1h-1zm1-5h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm1 2h1v1h-1zm-3 2h1v1h-1zm2 1h1v1h-1zm2 0h1v1h-1zm-6 2h1v1h-1zm2 1h1v1h-1zm0-7h1v1H9zm10-5h7v7h-7zm1 1v5h5V9zm-10 9h1v1h-1zm2 1h1v1h-1zm1 1h1v1h-1zm-3-3h1v1H7zm1 3h1v1H8zm-3 4h1v1H5zm6-4h1v1h-1zm0 3h1v1h-1zm-2 1h1v1H9zm2 1h1v1h-1zm2 1h1v1h-1zm2 1h1v1h-1zm1-5h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm1 2h1v1h-1zm-3 2h1v1h-1zm2 1h1v1h-1zm2 0h1v1h-1zm-6 2h1v1h-1zm2 1h1v1h-1zm0-7h1v1H9" fill="#000000" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Split Payment Share Link */}
      {splitPayment && (
        <div style={{
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          border: "1.5px dashed #3b82f6",
          borderRadius: "var(--radius-sm)",
          padding: "16px",
          fontSize: "0.82rem",
          marginBottom: "32px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <strong style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: "6px" }}>
            {t('checkoutSplitLinkGenerated', '🔗 Enlace de Cobro Dividido Generado')}
          </strong>
          <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>
            {t('checkoutSplitShareIntro', 'Comparte este enlace de pago seguro con tus amigos para que abonen su cuota de')} <strong>{formatPrice(splitShare, activeCurrency)}</strong> {t('checkoutSplitSharePerPerson', 'por persona:')}
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <input
              type="text"
              readOnly
              value={`http://localhost:5173/#pay/${successBookingId || "BT-45218"}/split`}
              style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.72rem", backgroundColor: "rgba(0,0,0,0.02)", outline: "none", color: "var(--text-muted)" }}
            />
            <button
              type="button"
              onClick={() => alert(t("checkoutCopiedAlert", "¡Enlace de pago copiado al portapapeles!"))}
              style={{ padding: "6px 12px", border: "none", backgroundColor: "#3b82f6", color: "#fff", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
            >
              {t('checkoutCopy', 'Copiar')}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="btn btn-primary"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.95rem"
        }}
      >
        {t('checkoutBackToSite', 'Volver al sitio')}
      </button>
    </div>
  );
}
