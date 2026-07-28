import React from "react";
import { X, Heart, MessageCircle, Calendar } from "lucide-react";

export default function ReelPlayerModal({
  showReelPlayer, setShowReelPlayer, tour,
  reelLikes, setReelLikes, hasLikedReel, setHasLikedReel
}) {
  if (!showReelPlayer) return null;

  return (
    <div className="reel-modal-container" onClick={() => setShowReelPlayer(false)}>
      <div className="reel-phone-wrapper" onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 30 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            🎬 Tour Trailer
          </span>
          <button
            onClick={() => setShowReelPlayer(false)}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="reel-video-container">
          <video
            src={tour.id % 2 === 0 ? "https://assets.mixkit.co/videos/preview/mixkit-glacier-river-in-patagonia-41808-large.mp4" : "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-desert-camp-in-dubai-42849-large.mp4"}
            autoPlay
            loop
            playsInline
            muted
            className="reel-video"
          />

          <div className="reel-actions-column">
            <button
              className="reel-action-btn"
              onClick={() => {
                setReelLikes((prev) => (hasLikedReel ? prev - 1 : prev + 1));
                setHasLikedReel(!hasLikedReel);
              }}
              style={{ color: hasLikedReel ? "#ef4444" : "#fff" }}
            >
              <Heart size={20} fill={hasLikedReel ? "#ef4444" : "transparent"} />
            </button>
            <span style={{ color: "#fff", fontSize: "0.7rem", marginTop: "-16px", fontWeight: 700 }}>{reelLikes}</span>

            <button className="reel-action-btn">
              <MessageCircle size={20} />
            </button>
            <span style={{ color: "#fff", fontSize: "0.7rem", marginTop: "-16px", fontWeight: 700 }}>18</span>

            <button className="reel-action-btn" onClick={() => {
              setShowReelPlayer(false);
              const submitBtn = document.querySelector('button[type="submit"].btn-yellow');
              if (submitBtn) submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
            }}>
              <Calendar size={20} />
            </button>
            <span style={{ color: "#fff", fontSize: "0.6rem", marginTop: "-16px", fontWeight: 700 }}>Reservar</span>
          </div>

          <div className="reel-overlay-content">
            <strong style={{ fontSize: "0.95rem", color: "#fff" }}>{tour.title}</strong>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: "1.4" }}>
              {tour.description.substring(0, 100)}...
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                ⭐ {tour.rating}
              </span>
              <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                ⏱️ {tour.duration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
