import React from "react";
import * as Icons from "lucide-react";
import { formatPrice } from "../../data/translations";
import { useTranslation } from "../../i18n/LanguageContext";

export default function CompareDrawer({
  compareTours, toursList, activeCurrency, showCompareModal, setCompareTours, setShowCompareModal, handleToggleCompare, handleTourClick
}) {
  const { t } = useTranslation();
  if (compareTours.length === 0) return null;

  return (
    <>
      {/* COMPARATOR FLOATING DRAWER */}
      <div
        className={`compare-drawer ${compareTours.length > 0 ? "open" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text-inverse)",
              padding: "8px 12px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            Comparando {compareTours.length} de 3
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {compareTours.map((id) => {
              const t = toursList.find((x) => x.id === id);
              if (!t) return null;
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "var(--bg-main)",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <img src={t.image} alt={t.title} style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }} />
                  <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-heading)" }}>{t.title}</span>
                  <button
                    onClick={() => handleToggleCompare(id)}
                    style={{ border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <Icons.X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => setCompareTours([])}>
            Limpiar
          </button>
          <button className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem" }} onClick={() => setShowCompareModal(true)}>
            Comparar ahora
          </button>
        </div>
      </div>

      {/* COMPARISON MODAL */}
      {showCompareModal && (
        <ComparisonModal
          compareTours={compareTours}
          toursList={toursList}
          activeCurrency={activeCurrency}
          setShowCompareModal={setShowCompareModal}
          handleTourClick={handleTourClick}
        />
      )}
    </>
  );
}

function ComparisonModal({ compareTours, toursList, activeCurrency, setShowCompareModal, handleTourClick }) {
  const { t } = useTranslation();
  return (
    <div className="reel-modal-container" style={{ padding: "20px" }} onClick={() => setShowCompareModal(false)}>
      <div
        className="glass-card modal"
        style={{
          width: "100%",
          maxWidth: "960px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "var(--radius-md)",
          color: "var(--text-main)",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icons.GitCompare size={24} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>Comparador de Tours</h3>
          </div>
          <button onClick={() => setShowCompareModal(false)} style={{ border: "none", background: "none", color: "var(--text-heading)", cursor: "pointer" }}>
            <Icons.X size={24} />
          </button>
        </div>

        {/* Modal Body: Comparison Table */}
        <div style={{ padding: "24px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "12px", width: "200px" }}>Característica</th>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <th key={id} style={{ padding: "12px", minWidth: "200px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <img src={t.image} alt={t.title} style={{ width: "100%", height: "120px", borderRadius: "8px", objectFit: "cover" }} />
                        <strong style={{ color: "var(--text-heading)", fontSize: "0.95rem" }}>{t.title}</strong>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <Row label={t('appTblPrice', 'Precio')}>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return <td key={id} style={{ padding: "12px", color: "var(--secondary)", fontWeight: 800, fontSize: "1.1rem" }}>{formatPrice(t.price, activeCurrency)}</td>;
                })}
              </Row>
              <Row label={t('appTblDuration', 'Duración')}>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return <td key={id} style={{ padding: "12px" }}>{t.duration}</td>;
                })}
              </Row>
              <Row label={t('appTblLocation', 'Ubicación')}>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return <td key={id} style={{ padding: "12px" }}>📍 {t.location}</td>;
                })}
              </Row>
              <Row label={t('appTblRating', 'Valoración')}>
                {compareTours.map((id) => {
                  const tour = toursList.find((x) => x.id === id);
                  if (!tour) return null;
                  return (
                    <td key={id} style={{ padding: "12px" }}>
                      <span style={{ color: "#fbbf24", fontWeight: 700 }}>★ {tour.rating.toFixed(1)}</span>{" "}
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({tour.reviewsCount || 25} {t('reviews', 'reseñas')})</span>
                    </td>
                  );
                })}
              </Row>
              <Row label={t('appTblCategory', 'Categoría')}>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <td key={id} style={{ padding: "12px" }}>
                      <span style={{ border: "1px solid var(--primary)", color: "var(--primary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>{t.category}</span>
                    </td>
                  );
                })}
              </Row>
              <Row label="Dificultad">
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  const level = t.id % 3 === 0 ? "Fácil" : t.id % 3 === 1 ? "Moderado" : "Desafiante";
                  const color = level === "Fácil" ? "#22c55e" : level === "Moderado" ? "#ea580c" : "#dc2626";
                  return <td key={id} style={{ padding: "12px", color, fontWeight: 700 }}>{level}</td>;
                })}
              </Row>
              <Row label="Huella de Carbono">
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  const eco = 90 + (t.id % 3) * 15;
                  return <td key={id} style={{ padding: "12px", color: "#10b981", fontWeight: 600 }}>🌱 Ahorro de {eco}kg CO₂</td>;
                })}
              </Row>
              <tr>
                <td style={{ padding: "12px" }}></td>
                {compareTours.map((id) => {
                  const t = toursList.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <td key={id} style={{ padding: "12px" }}>
                      <button className="btn btn-primary" style={{ width: "100%", padding: "10px", fontSize: "0.85rem" }} onClick={() => { handleTourClick(t.id); setShowCompareModal(false); }}>
                        Ver Detalle
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
      <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-heading)" }}>{label}</td>
      {children}
    </tr>
  );
}
