import React from "react";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from "../../data/translations";
import { crossSellingOptions } from './useCheckout';

export default function CrossSellStep({ tour, activeCurrency, selectedAddons, toggleAddon, onContinue }) {
  const { t } = useTranslation();
  return (
    <div className="modal-step-padding">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <ShoppingBag size={24} style={{ color: "var(--accent)" }} />
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)" }}>{t('checkoutImproveAdventure', '¿Deseas mejorar tu aventura?')}</h3>
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
        {t('checkoutUpsellIntro', 'Suma opcionales recomendados para tu excursión a')} {tour.title} {t('checkoutUpsellPrepared', 'y viaja totalmente preparado:')}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        {crossSellingOptions.map((opt) => {
          const isSelected = selectedAddons.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => toggleAddon(opt.id)}
              style={{
                border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: isSelected ? "rgba(234, 179, 8, 0.05)" : "transparent",
                transition: "all 0.2s"
              }}
            >
              <div style={{ flexGrow: 1, paddingRight: "16px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "4px" }}>{opt.name}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.3" }}>{opt.description}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary)", display: "block" }}>
                  +{formatPrice(opt.price, activeCurrency)}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>p/p</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <button className="btn btn-outline" onClick={onContinue} style={{ flex: 1 }}>
          {t('checkoutNoContinue', 'No, continuar')}
        </button>
        <button className="btn btn-primary" onClick={onContinue} style={{ flex: 1 }}>
          {t('checkoutSaveContinue', 'Guardar y continuar')}
        </button>
      </div>
    </div>
  );
}
