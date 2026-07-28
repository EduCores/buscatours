import React, { useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Calendar, Users, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { formatPrice } from "../data/translations";
import { useTranslation } from "../i18n/LanguageContext";

export default function SplitPaymentGate({ bookingId, bookings = [], activeCurrency, onBack, onPaySuccess }) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "var(--font-body)"
      }}>
        <div className="glass-card" style={{ maxWidth: "450px", width: "100%", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle size={48} style={{ color: "#ef4444", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "8px" }}>{t("splitBookingNotFound", "Reserva No Encontrada")}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "24px" }}>
            {t("splitBookingNotFoundMsg", "El enlace de pago dividido no corresponde a ninguna reserva activa. Por favor, solicita a tu amigo que verifique el enlace de cobro.")}
          </p>
          <button onClick={onBack} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
            {t("splitGoToMainPortal", "Ir al Portal Principal")}
          </button>
        </div>
      </div>
    );
  }

  const alreadyFullyPaid = booking.paidAmountUSD >= booking.totalPriceUSD;
  const friendShare = booking.splitShareUSD || Math.round(booking.totalPriceUSD / booking.guests);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!fullName || !email || !cardNumber || !cardExpiry || !cardCvc) {
      setErrorMsg(t("splitCompleteFields", "Por favor, completa todos los campos de pago."));
      return;
    }
    setErrorMsg("");
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      const friendPayment = {
        name: fullName,
        email: email,
        amount: friendShare,
        paidAt: new Date().toLocaleDateString()
      };

      const updatedBooking = {
        ...booking,
        paidAmountUSD: Math.min(booking.totalPriceUSD, booking.paidAmountUSD + friendShare),
        friendsPaid: [...(booking.friendsPaid || []), friendPayment]
      };

      onPaySuccess(updatedBooking);
    }, 2500);
  };

  if (paymentSuccess) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "var(--font-body)"
      }}>
        <div className="glass-card" style={{ maxWidth: "500px", width: "100%", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(34,197,94,0.3)" }}>
          <CheckCircle size={56} style={{ color: "#22c55e", marginBottom: "16px", animation: "pulse 2s infinite" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "8px" }}>{t("splitPaymentSuccess", "¡Pago Completado Exitosamente!")}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "24px" }}>
            {t("splitSuccessHi", "Hola ")}<strong>{fullName}</strong>{t("splitSuccessCredited", ", hemos acreditado tu cuota de ")}<strong>{formatPrice(friendShare, activeCurrency)}</strong>{t("splitSuccessExcursion", " para la excursión ")}<strong>{booking.tourTitle}</strong>{t("splitSuccessNotified", ". Tu amigo ha sido notificado del abono.")}
          </p>

          <div style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "left",
            fontSize: "0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "32px"
          }}>
            <div>{t("splitReservationCode", "Código de Reserva")}: <strong style={{ color: "var(--primary)" }}>{booking.bookingId}</strong></div>
            <div>{t("splitAmountPaid", "Monto Abonado")}: <strong>{formatPrice(friendShare, activeCurrency)}</strong></div>
            <div>{t("splitTransactionDate", "Fecha de Transacción")}: <strong>{new Date().toLocaleDateString()}</strong></div>
            <div>{t("splitReservationStatus", "Estado de Reserva")}: <span style={{ color: "#22c55e", fontWeight: 700 }}>{t("splitConfirmed", "✓ Confirmada")}</span></div>
          </div>

          <button onClick={onBack} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
            {t("splitGoToPortal", "Ir al Portal BuscaTours")}
          </button>
        </div>
      </div>
    );
  }

  const percentPaid = Math.min(100, Math.round((booking.paidAmountUSD / booking.totalPriceUSD) * 100));

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-main)",
      color: "var(--text-main)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "var(--font-body)"
    }}>
      <div className="glass-card" style={{ maxWidth: "600px", width: "100%", padding: "32px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Back Button */}
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, padding: 0, marginBottom: "20px" }}>
          <ArrowLeft size={16} /> {t("splitBackToBuscaTours", "Volver a BuscaTours")}
        </button>

         <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0", textTransform: "uppercase" }}>{t("splitSharedPaymentGateway", "Pasarela de Pago Compartido")}</h2>
         <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t("splitSettleGroupShare", "Saldar cuota grupal para la reserva de viaje")}</span>

        {/* Booking Card Details */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.01)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "16px",
          margin: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <img src={booking.tourImage} alt={booking.tourTitle} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{booking.tourTitle}</h4>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "10px", marginTop: "3px" }}>
                <span>📅 {booking.date}</span>
                 <span>👥 {booking.guests} {t("splitPeople", "personas")}</span>
              </div>
            </div>
          </div>

          {/* Ledger status */}
          <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
              <span>{t("splitGroupCollection", "Recaudación del Grupo")}:</span>
              <strong>{formatPrice(booking.paidAmountUSD, activeCurrency)} / {formatPrice(booking.totalPriceUSD, activeCurrency)} ({percentPaid}%)</strong>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${percentPaid}%`, height: "100%", backgroundColor: percentPaid === 100 ? "#22c55e" : "#3b82f6", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {alreadyFullyPaid ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ display: "inline-flex", padding: "10px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.12)", color: "#22c55e", marginBottom: "12px" }}>
              <CheckCircle size={32} />
            </div>
             <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "4px" }}>{t("splitFullySettled", "¡Reserva Totalmente Salda!")}</h4>
             <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4", margin: "0 0 20px 0" }}>
               {t("splitFullyPaidMsg", "Esta reserva grupal ya ha sido pagada en su totalidad por sus integrantes. No hay cuotas pendientes de abonar.")}
             </p>
             <button onClick={onBack} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
               {t("splitBackToPortal", "Volver al Portal")}
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "12px 16px", borderRadius: "6px", fontSize: "0.9rem" }}>
              <span style={{ fontWeight: 700, color: "#93c5fd" }}>{t("splitYourShare", "Tu cuota individual a abonar")}:</span>
              <strong style={{ fontSize: "1.1rem", color: "var(--primary)" }}>{formatPrice(friendShare, activeCurrency)}</strong>
            </div>

            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            {/* Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("splitFullName", "Nombre Completo")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("splitFullNamePlaceholder", "Ej. Sofía Silva")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("splitEmail", "Correo Electrónico")}</label>
                <input
                  type="email"
                  required
                  placeholder={t("splitEmailPlaceholder", "sofia@correo.com")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("splitCardNumber", "Número de Tarjeta")}</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  placeholder="4556 1200 4432 9901"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ width: "100%", padding: "10px 10px 10px 36px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }}
                />
                <CreditCard size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("splitExpiry", "Expiración (MM/AA)")}</label>
                <input
                  type="text"
                  required
                  placeholder="12/29"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("splitCvc", "CVC / CVV")}</label>
                <input
                  type="password"
                  required
                  maxLength="4"
                  placeholder="•••"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", outline: "none" }}
                />
              </div>
            </div>

            {/* Shield Guarantee */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#10b981", fontSize: "0.7rem", marginTop: "4px" }}>
               <ShieldCheck size={14} /> {t("splitSslProtected", "Transacción protegida con cifrado SSL de 256 bits.")}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
              style={{
                marginTop: "12px",
                padding: "14px",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="spin" />
                  {t("splitProcessing", "Procesando Pago Seguro...")}
                </>
              ) : (
                t("splitPayAmount", `Abonar ${formatPrice(friendShare, activeCurrency)}`)
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
