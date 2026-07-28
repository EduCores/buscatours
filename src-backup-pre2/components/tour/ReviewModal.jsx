import React from "react";
import { X, Star, Compass } from "lucide-react";
import * as Icons from "lucide-react";

export default function ReviewModal({
  showReviewModal, setShowReviewModal,
  reviewName, setReviewName, reviewComment, setReviewComment,
  reviewStars, setReviewStars, reviewBell, setReviewBell,
  reviewLeaf, setReviewLeaf, reviewMsg, setReviewMsg, reviewCam, setReviewCam,
  handleReviewSubmit, tText
}) {
  if (!showReviewModal) return null;

  return (
    <div
      className="reel-modal-container"
      onClick={() => setShowReviewModal(false)}
      style={{ zIndex: 1002 }}
    >
      <div
        className="glass-card modal"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          padding: "24px",
          color: "var(--text-main)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Compass size={24} style={{ color: "var(--accent)" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-heading)" }}>
              VALORAR MI AVENTURA
            </h3>
          </div>
          <button
            onClick={() => setShowReviewModal(false)}
            style={{ background: "none", border: "none", color: "var(--text-heading)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Nombre / Nickname */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>Tu Nombre / Nickname</label>
            <input
              type="text"
              placeholder="Ej: Laura M."
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              required
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          {/* Comentario */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>Tu Opinión</label>
            <textarea
              placeholder="Cuéntanos los mejores detalles de tu experiencia..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
              rows={3}
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "0.9rem",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {/* General Rating Stars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>{tText('tdRating', 'Calificación General')}</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewStars(star)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Star
                    size={28}
                    fill={star <= reviewStars ? "#fbbf24" : "none"}
                    stroke={star <= reviewStars ? "#fbbf24" : "var(--text-muted)"}
                    style={{ transition: "transform 0.15s" }}
                  />
                </button>
              ))}
              <span style={{ fontSize: "0.95rem", fontWeight: 700, marginLeft: "10px" }}>{reviewStars}.0 / 5.0</span>
            </div>
          </div>

          {/* SLIDERS FOR CHARACTERISTICS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Valorar Características (Desliza para puntuar)
            </span>

            {/* 1. Aventura / Adrenalina */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.Bell size={14} style={{ color: "#fb923c" }} /> Aventura y Adrenalina</span>
                <span style={{ color: "var(--primary)" }}>{reviewBell} Pts</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={reviewBell}
                onChange={(e) => setReviewBell(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", height: "6px", borderRadius: "3px", outline: "none" }}
              />
            </div>

            {/* 2. Sostenibilidad */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.Leaf size={14} style={{ color: "#10b981" }} /> Sostenibilidad Ecológica</span>
                <span style={{ color: "var(--primary)" }}>{reviewLeaf} Pts</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                value={reviewLeaf}
                onChange={(e) => setReviewLeaf(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", height: "6px", borderRadius: "3px", outline: "none" }}
              />
            </div>

            {/* 3. Cultura */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.MessageSquare size={14} style={{ color: "#eab308" }} /> Cultura & Historia</span>
                <span style={{ color: "var(--primary)" }}>{reviewMsg}M Pts</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", height: "6px", borderRadius: "3px", outline: "none" }}
              />
            </div>

            {/* 4. Fotogenia */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.Camera size={14} style={{ color: "#3b82f6" }} /> Paisaje y Fotogenia</span>
                <span style={{ color: "var(--primary)" }}>{reviewCam} Pts</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={reviewCam}
                onChange={(e) => setReviewCam(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", height: "6px", borderRadius: "3px", outline: "none" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text-inverse)",
              padding: "12px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              marginTop: "12px",
              boxShadow: "0 4px 14px rgba(251, 191, 36, 0.3)",
              transition: "background-color 0.2s"
            }}
          >
            Publicar Valoración
          </button>
        </form>
      </div>
    </div>
  );
}
