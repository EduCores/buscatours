import React from "react";
import { Users, Award, Shield, Sparkles } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function TrustBadges() {
  const { t } = useTranslation();

  const badges = [
    {
      icon: Users,
      title: t("trustBadgeClientsTitle", "+40,000 Clientes"),
      description: t("trustBadgeClientsDesc", "Miles de viajeros confían en nosotros para sus aventuras en Patagonia.")
    },
    {
      icon: Award,
      title: t("trustBadgeAwardTitle", "Servicio Premiado"),
      description: t("trustBadgeAwardDesc", "Reconocidos por la excelencia de nuestros guías locales y excursiones.")
    },
    {
      icon: Shield,
      title: t("trustBadgeSecureTitle", "Pago 100% Seguro"),
      description: t("trustBadgeSecureDesc", "Tus transacciones están protegidas con encriptación SSL de nivel bancario.")
    },
    {
      icon: Sparkles,
      title: t("trustBadgeOffersTitle", "Ofertas Exclusivas"),
      description: t("trustBadgeOffersDesc", "Garantizamos los mejores precios locales y promociones de temporada.")
    }
  ];

  return (
    <section
      style={{
        marginTop: "5px",
        marginBottom: "0px",
        paddingTop: "24px",
        paddingBottom: "24px",
        backgroundColor: "rgba(234, 179, 8, 0.03)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="badge-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px",
                  transition: "transform 0.3s ease",
                }}
              >
                {/* Icon wrapper */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-surface)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    marginBottom: "16px",
                    border: "1px solid var(--border-glass)",
                  }}
                  className="badge-icon-box"
                >
                  <Icon size={28} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-heading)",
                    marginBottom: "8px",
                  }}
                >
                  {badge.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.5",
                    maxWidth: "280px",
                  }}
                >
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .badge-item:hover {
          transform: translateY(-4px);
        }
        .badge-item:hover .badge-icon-box {
          background-color: var(--primary) !important;
          color: var(--text-inverse) !important;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </section>
  );
}
