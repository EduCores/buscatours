import React, { useMemo } from "react";
import TourCard from "./TourCard";
import { X, MapPin } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function DestinationToursView({ destinationName, allTours, activeCurrency, activeLanguage, onClose, onTourClick }) {
  const { t } = useTranslation();
  // Filter and sort tours for the selected destination
  const destinationTours = useMemo(() => {
    const filtered = allTours.filter((tour) =>
      (tour.destination && tour.destination.toLowerCase() === destinationName.toLowerCase()) ||
      tour.location.toLowerCase().includes(destinationName.toLowerCase())
    );

    // 2. Sort by importance
    return filtered.sort((a, b) => {
      let scoreA = 0;
      if (a.popular) scoreA += 100;
      if (a.discount) scoreA += 50;
      scoreA += a.reviewsCount || 0;

      let scoreB = 0;
      if (b.popular) scoreB += 100;
      if (b.discount) scoreB += 50;
      scoreB += b.reviewsCount || 0;

      return scoreB - scoreA; // Descending order
    });
  }, [allTours, destinationName]);

  return (
    <section className="destination-tours-view fade-in-up" style={{ padding: "60px 0", backgroundColor: "var(--bg-main)", minHeight: "80vh" }}>
      <div className="container">
        {/* Header with Close Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "2px solid var(--border-color)", paddingBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
               <MapPin size={14} /> {t("destExploring", "Explorando")}
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-heading)" }}>
               {t("destToursIn", "Tours en")} {destinationName}
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
               {destinationTours.length} {destinationTours.length === 1 ? t("destTourFound", "tour encontrado") : t("destToursFound", "tours encontrados")}{t("destSortedByRelevance", ", ordenados por relevancia.")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px" }}
          >
             <X size={16} /> {t("destClose", "Cerrar")}
          </button>
        </div>

        {/* Tours Grid */}
        {destinationTours.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
            {destinationTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                activeCurrency={activeCurrency}
                onClick={() => onTourClick(tour.id)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)" }}>
             <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-heading)" }}>{t("destNoToursFound", "No se encontraron tours")}</h3>
             <p style={{ color: "var(--text-muted)" }}>{t("destNoToursAvailable", "Actualmente no tenemos tours disponibles para")} {destinationName}.</p>
             <button onClick={onClose} className="btn btn-primary" style={{ marginTop: "20px" }}>{t("destBackToMain", "Volver a la página principal")}</button>
          </div>
        )}
      </div>
      <style>{`
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
