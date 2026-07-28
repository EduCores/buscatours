import React from "react";
import { CreditCard, AlertCircle, ShieldCheck, Copy } from "lucide-react";
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from "../../data/translations";
import { crossSellingOptions } from './useCheckout';
import PixQRCode from './PixQRCode';

export default function PaymentStep({
  tour, guests, date, activeCurrency,
  selectedAddons, carbonOffset, setCarbonOffset, splitPayment, setSplitPayment,
  fullName, setFullName, email, setEmail,
  paymentMethod, setPaymentMethod, isChileTour,
  cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvc, setCardCvc,
  pixBRLStr, pixBrcode, pixCopied, copyPix,
  finalPriceUSD, errorMessage, isProcessing, onSubmit
}) {
  const { t } = useTranslation();
  const splitShare = Math.round(finalPriceUSD / guests);

  return (
    <div className="modal-step-padding">
      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "6px" }}>{t('checkoutCompleteBooking', 'Completar Reserva')}</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
        {t('checkoutSummaryFor', 'Resumen para')} {guests} {t('checkoutSummaryPassengers', 'pasajeros en la fecha')} {date}.
      </p>

      {/* Billing Summary Box */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: "var(--radius-sm)",
          padding: "16px",
          border: "1px solid var(--border-color)",
          marginBottom: "24px",
          fontSize: "0.85rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 600 }}>
          <span>{tour.title} (x{guests})</span>
          <span>{formatPrice(tour.price * guests, activeCurrency)}</span>
        </div>
        {selectedAddons.map((id) => {
          const opt = crossSellingOptions.find((o) => o.id === id);
          return (
            <div key={id} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "4px", fontSize: "0.8rem" }}>
              <span>{opt.name}</span>
              <span>+{formatPrice(opt.price, activeCurrency)}</span>
            </div>
          );
        })}
        {carbonOffset && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", marginBottom: "4px", fontSize: "0.8rem", fontWeight: 600 }}>
            <span>{t('checkoutCarbonOffsetPatagonia', '🌱 Compensación CO₂ (Patagonia)')}</span>
            <span>+{formatPrice(1.50 * guests, activeCurrency)}</span>
          </div>
        )}
        <div style={{ borderTop: "1px dashed var(--border-color)", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1rem" }}>
          <span>{t('checkoutTotalFinal', 'Total Final:')}</span>
          <span>+{carbonOffset ? 250 : 100} pts</span>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#ef4444", fontSize: "0.85rem", marginBottom: "16px" }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t('checkoutLabelFullName', 'Nombre Completo')}</label>
          <input
            type="text"
            required
            placeholder={t('checkoutPhFullName', 'Ej. Juan Pérez')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t('checkoutLabelEmail', 'Correo Electrónico')}</label>
          <input
            type="email"
            required
            placeholder={t('checkoutPhEmail', 'juan@correo.com')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
          />
        </div>

        {/* B2C Innovation: Carbon Offset Checkbox */}
        <div
          onClick={() => setCarbonOffset(!carbonOffset)}
          style={{
            border: carbonOffset ? "1.5px solid #10b981" : "1.5px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 14px",
            backgroundColor: carbonOffset ? "rgba(16, 185, 129, 0.04)" : "transparent",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            cursor: "pointer",
            marginTop: "6px",
            transition: "all 0.2s"
          }}
        >
          <input
            type="checkbox"
            checked={carbonOffset}
            onChange={() => {}}
            style={{ marginTop: "3px", cursor: "pointer" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
              {t('checkoutCompensateCarbon', '🌱 Compensar Huella de Carbono')}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
              {t('checkoutCarbonDesc', 'Añade')} <strong>{formatPrice(1.50 * guests, activeCurrency)}</strong> {t('checkoutCarbonDesc2', 'para neutralizar tu viaje plantando árboles nativos en la Patagonia con Reforestemos LATAM.')}
            </span>
          </div>
        </div>

        {/* B2C Innovation: Split-Payment Toggle */}
        {guests > 1 && (
          <div
            onClick={() => setSplitPayment(!splitPayment)}
            style={{
              border: splitPayment ? "1.5px solid #3b82f6" : "1.5px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              backgroundColor: splitPayment ? "rgba(59, 130, 246, 0.04)" : "transparent",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="checkbox"
                checked={splitPayment}
                onChange={() => {}}
                style={{ marginTop: "3px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}>
                  {t('checkoutSplitPaymentFriends', '💳 Dividir Pago con Amigos (Split-Payment)')}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
                  {t('checkoutSplitEquitative', 'Divide el total de forma equitativa. Generaremos un enlace de cobro para compartir.')}
                </span>
              </div>
            </div>
            {splitPayment && (
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", borderTop: "1px dashed var(--border-color)", paddingTop: "8px", marginTop: "4px", paddingLeft: "24px" }}>
                {t('checkoutEachFriendPays', 'Cada amigo pagará:')} <strong>{formatPrice(splitShare, activeCurrency)} / {t('checkoutPerPerson', 'persona')}</strong>.
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "10px" }}>{t('checkoutSelectPaymentMethod', 'Selecciona tu método de pago')}</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
            <PaymentMethodButton label={t('checkoutMethodCard', 'Tarjeta')} sub="Stripe / Apple Pay / Google Pay" active={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} />
            <PaymentMethodButton label="Webpay" sub={isChileTour ? t("checkoutWebpaySubChile", "Transbank & Tarjetas chilenas") : t("checkoutWebpaySubOther", "Disponible solo para reservas en Chile")} active={paymentMethod === "webpay"} onClick={() => setPaymentMethod("webpay")} disabled={!isChileTour} />
            <PaymentMethodButton label="MercadoPago" sub={t('checkoutMercadoSub', 'Pagos locales para LatAm')} active={paymentMethod === "mercadopago"} onClick={() => setPaymentMethod("mercadopago")} />
            <PaymentMethodButton label="PayPal" sub={t('checkoutPaypalSub', 'Pago instantáneo internacional')} active={paymentMethod === "paypal"} onClick={() => setPaymentMethod("paypal")} />
            <PaymentMethodButton label="Google Pay" sub={t('checkoutGooglepaySub', 'Pago rápido y sin fricción')} active={paymentMethod === "googlepay"} onClick={() => setPaymentMethod("googlepay")} />
            <PaymentMethodButton label="PIX" sub={t('checkoutPixSub', 'Pago instantáneo (Brasil)')} active={paymentMethod === "pix"} onClick={() => setPaymentMethod("pix")} />
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "10px" }}>
            {t('checkoutRecommendedMethod', 'Método recomendado:')} <strong>{paymentMethod === "card" ? "Tarjeta con Stripe" : paymentMethod === "webpay" ? "Webpay / Transbank" : paymentMethod === "mercadopago" ? "MercadoPago" : paymentMethod === "paypal" ? "PayPal" : paymentMethod === "googlepay" ? "Google Pay" : "PIX"}</strong>
          </p>
        </div>

        {paymentMethod === "card" && (
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{t('checkoutSecureCardPayment', 'PAGO CON TARJETA SEGURO')}</span>
              <CreditCard size={16} style={{ color: "var(--text-muted)" }} />
            </div>

            <input
              type="text"
              required
              placeholder={t('checkoutPhCardNumber', 'Número de Tarjeta (xxxx xxxx xxxx xxxx)')}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <input
                type="text"
                required
                placeholder="MM/AA"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
              />
              <input
                type="text"
                required
                placeholder="CVC"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
              />
            </div>
          </div>
        )}

        {paymentMethod === "webpay" && (
          <div style={{ marginTop: "10px", border: "1px solid #2563eb", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(37, 99, 235, 0.08)", padding: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#1d4ed8" }}>Webpay / Transbank</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {t('checkoutWebpayDesc', 'Ideal para clientes chilenos. Acepta RedCompra, Visa, Mastercard y tarjetas locales. Este flujo reduce la tasa de abandono en reservas nacionales.')}
            </p>
          </div>
        )}

        {paymentMethod === "mercadopago" && (
          <div style={{ marginTop: "10px", border: "1px solid #009ee3", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(0, 158, 227, 0.08)", padding: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#0369a1" }}>MercadoPago</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {t('checkoutMercadoDesc', 'Método local recomendado para LatAm. Soporta pagos con tarjeta, cuotas, saldo y transferencias locales.')}
            </p>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div style={{ marginTop: "10px", border: "1px solid #034ea2", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(3, 78, 162, 0.08)", padding: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#0f172a" }}>PayPal</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {t('checkoutPaypalDesc', 'Perfecto para turistas extranjeros. Pago seguro con cuenta PayPal sin necesidad de ingresar tarjeta local.')}
            </p>
          </div>
        )}

        {paymentMethod === "googlepay" && (
          <div style={{ marginTop: "10px", border: "1px solid #0f766e", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(15, 118, 110, 0.08)", padding: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "#064e3b" }}>Google Pay</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {t('checkoutGooglepayDesc', 'Pago rápido y sin fricción en dispositivos compatibles. Ideal para viajeros móviles que quieren cerrar la compra al instante.')}
            </p>
          </div>
        )}

        {paymentMethod === "pix" && (
          <div style={{ marginTop: "10px", border: "1px solid #009c3b", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(0, 156, 59, 0.08)", padding: "16px" }}>
            <strong style={{ display: "block", marginBottom: "6px", color: "#00802b" }}>PIX · Banco Central do Brasil</strong>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "14px" }}>
              {t('checkoutPixDesc', 'Escanea el QR con el app de tu banco o usa la opción Copia e Cola. PIX es el sistema de pagos del Banco Central de Brasil: liquidación en segundos, 24/7.')}
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <PixQRCode />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "4px" }}>{t('checkoutPixAmount', 'Valor a pagar vía PIX:')}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#00802b", marginBottom: "10px" }}>{pixBRLStr}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "6px" }}>{t('checkoutPixCopiaCola', 'Copia e Cola (brcode)')}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    readOnly
                    value={pixBrcode}
                    style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.66rem", backgroundColor: "rgba(0,0,0,0.02)", outline: "none", color: "var(--text-muted)", fontFamily: "monospace" }}
                  />
                  <button
                    type="button"
                    onClick={copyPix}
                    style={{ padding: "6px 12px", border: "none", backgroundColor: "#00802b", color: "#fff", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Copy size={12} /> {pixCopied ? "✓" : t('checkoutPixCopy', 'Copiar código PIX')}
                  </button>
                </div>
                {pixCopied && (
                  <div style={{ fontSize: "0.72rem", color: "#00802b", marginTop: "6px" }}>{t('checkoutPixCopied', '¡Código PIX copiado al portapapeles!')}</div>
                )}
              </div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#b45309", marginTop: "12px", fontStyle: "italic" }}>⚠️ {t('checkoutPixMockNote', 'Simulación local - no es un cobro real de PIX.')}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="btn btn-yellow"
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "16px",
            fontSize: "0.95rem",
            textTransform: "uppercase"
          }}
        >
          {isProcessing ? t("checkoutProcessing", "Procesando pago seguro...") : `${t("checkoutPay", "Pagar")} ${formatPrice(finalPriceUSD, activeCurrency)}`}
        </button>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "8px" }}>
          <ShieldCheck size={14} style={{ color: "#22c55e" }} />
          <span>{t('checkoutSsl', 'Encriptación SSL de 256 bits. Pago respaldado por')} {paymentMethod === "card" ? "Stripe" : paymentMethod === "webpay" ? "Webpay" : paymentMethod === "mercadopago" ? "MercadoPago" : paymentMethod === "paypal" ? "PayPal" : paymentMethod === "googlepay" ? "Google Pay" : "PIX (Banco Central do Brasil)"}.</span>
        </div>
      </form>
    </div>
  );
}

function PaymentMethodButton({ label, sub, active, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: active ? "2px solid var(--primary)" : "1px solid var(--border-color)",
        borderRadius: "14px",
        backgroundColor: active ? "rgba(56, 189, 248, 0.08)" : "transparent",
        color: active ? "var(--text-heading)" : "var(--text-main)",
        padding: "14px",
        textAlign: "left",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      <strong>{label}</strong>
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sub}</span>
    </button>
  );
}
