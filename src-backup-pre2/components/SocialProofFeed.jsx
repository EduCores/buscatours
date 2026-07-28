import React from "react";
import { Star, MessageCircle, Heart, Compass } from "lucide-react";
import { socialPosts } from "../data/socialPosts";
import { useTranslation } from "../i18n/LanguageContext";

export default function SocialProofFeed({ onTourClick }) {
  const { t } = useTranslation();
  const posts = socialPosts;


  return (
    <div style={{ marginTop: "40px", marginBottom: "40px" }} className="social-proof-section">
      <div style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "12px", marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Compass size={22} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, textTransform: "uppercase" }}>
            {t("socialProofFeedTitle", "Muro de Aventureros en Instagram & TikTok")}
          </h3>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
          {t("socialProofFeedSubtitle", "Explora fotos y reviews orgánicas subidas por viajeros reales en América. Haz clic en cualquier historia para reservar su excursión.")}
        </p>
      </div>

      <div className="social-proof-grid">
        {posts.slice(0, 4).map((post, idx) => (
          <div
            key={idx}
            onClick={() => onTourClick(post.tourId)}
            className="social-post-card glass-card"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              cursor: "pointer",
              aspectRatio: "1",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s"
            }}
          >
            <img
              src={post.image}
              alt={post.location}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Gradient Overlay */}
            <div
              className="social-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                opacity: 0.9,
                transition: "opacity 0.3s"
              }}
            >
              {/* Header Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img
                    src={post.avatar}
                    alt={post.username}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--primary)" }}
                  />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{post.username}</span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      fill={i < post.rating ? "var(--primary)" : "none"}
                      stroke={i < post.rating ? "var(--primary)" : "#fff"}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>
                  📍 {post.location}
                </span>
                <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                  "{post.comment}"
                </p>

                {/* Social metrics */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "8px", marginTop: "4px" }}>
                  <div style={{ display: "flex", gap: "12px", color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Heart size={12} fill="#ef4444" stroke="#ef4444" /> {post.likes}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MessageCircle size={12} /> {post.comments}</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", display: "flex", alignItems: "center", gap: "2px" }}>
                    {t("socialProofViewTour", "Ver Tour")} ➔
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .social-proof-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .social-post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45) !important;
          border-color: var(--primary) !important;
        }
        @media (max-width: 768px) {
          .social-proof-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .social-proof-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
