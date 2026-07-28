import React, { useState } from "react";
import { Star, Clock, MapPin, ArrowRight, Bell, Leaf, MessagesSquare, Camera, Sparkles, GitCompare } from "lucide-react";
import { formatPrice } from "../data/translations";
import { useTranslation } from "../i18n/LanguageContext";

export default function TourCard({ tour, onClick, activeCurrency,   onToggleCompare, isComparing }) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    title,
    location,
    duration,
    originalPrice,
    price,
    discount,
    rating,
    reviewsCount,
    description,
    image,
  } = tour;

  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 0;
  const safeRating = typeof rating === "number" ? rating : 4.7;
  const safeOriginalPrice = typeof originalPrice === "number" ? originalPrice : (typeof price === "number" ? price : 0);
  const safePrice = typeof price === "number" ? price : 0;

  // Get dynamic badges based on ID and discount
  const allBadges = (() => {
    const list = [];
    if (discount) {
      list.push(discount.replace(/\s*\(IA Spark\)/i, ""));
    }
    
    // Add additional tag based on ID
    if (id % 4 === 0) {
      list.push(t('superTour', 'Súper Tour'));
    } else if (id % 4 === 1 && discount !== "Recomendado") {
      list.push(t('masVendido', 'Más Vendido'));
    } else if (id % 4 === 2) {
      list.push(t('ultimosCupos', 'Últimos Cupos'));
    } else if (id % 4 === 3 && discount !== "Recomendado") {
      list.push(t('recomendado', 'Recomendado'));
    }
    
    return [...new Set(list)];
  })();

  const priceBadges = allBadges.filter(b => b.toLowerCase().includes("off") || b.toLowerCase().includes("special offer") || b.includes("%"));
  const topBadges = allBadges.filter(b => !priceBadges.includes(b));

  // Get color for a badge
  const getBadgeColor = (badge) => {
    if (badge === "Súper Tour") return "#9F6CB7";
    if (badge === "Más Vendido") return "#12BC84";
    if (badge === "Recomendado") return "#467BE7";
    if (badge === "Últimos Cupos") return "#F7971B";
    if (badge === "Tendencia" || badge === "TENDENCIA") return "#EF4444";
    if (badge.includes("Off")) return "var(--primary)";
    return "var(--secondary)";
  };

  // Get modern outlined style for badges
  const getBadgeStyle = (badge) => {
    const color = getBadgeColor(badge);
    return {
      color: color,
      border: `1px solid ${color}`,
      backgroundColor: `color-mix(in srgb, ${color} 12%, rgba(0, 0, 0, 0.45))`,
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)",
      fontSize: "0.55rem",
      fontWeight: 700,
      padding: "2px 5px",
      borderRadius: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
    };
  };

  return (
    <article
      className="glass-card fade-in-up"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "450px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
      }}
    >
      {/* Background Image Wrapper with Zoom Hover */}
      <div
        className="hover-zoom-img"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          backgroundColor: "#000"
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: 1
          }}
          className="card-bg-image"
        />
        {/* Overlay Dark Gradient fading to solid black */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.92) 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Floating Promotion Tags (Top Right) */}
      {topBadges.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
            zIndex: 2,
          }}
        >
          {topBadges.map((badge, idx) => (
            <span key={idx} className="tour-card-badge tour-card-promo-badge" style={getBadgeStyle(badge)}>
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Top Left Badges (Location & Duration) */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          zIndex: 2,
        }}
      >
        {/* Location Badge */}
        <span
          className="tour-card-badge"
          style={{
            backgroundColor: "rgb(0 0 0 / 30%)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.70rem",
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: "4px",
            backdropFilter: "blur(1.1px)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <MapPin size={12} style={{ color: "var(--primary)" }} />
          {location.split(",")[0]}
        </span>
        
        {/* Duration Badge */}
        <span
          className="tour-card-badge"
          style={{
            backgroundColor: "rgb(0 0 0 / 30%)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.70rem",
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: "4px",
            backdropFilter: "blur(1.1px)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Clock size={12} style={{ color: "var(--primary)" }} />
          {duration}
        </span>
        
        {tour.vibeMatchPercentage !== undefined && (
          <span
            className="tour-card-badge"
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.45)",
              color: "#f3e8ff",
              border: "1px solid rgba(168, 85, 247, 0.6)",
              fontSize: "0.70rem",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              backdropFilter: "blur(1.1px)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 4px 10px rgba(168, 85, 247, 0.2)"
            }}
          >
            <Sparkles size={12} fill="#f3e8ff" />
            {tour.vibeMatchPercentage}% {t('coincidencia', 'Coincidencia')}
          </span>
        )}
      </div>

      {/* Tour Info Section */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 2,
          color: "#ffffff",
        }}
      >
        <div>
          {/* Rating and Stats header */}
          <div
            className="tour-stats-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
              fontSize: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--secondary)", fontWeight: 700, opacity: 0.9 }}>
              <Star size={12} fill="var(--secondary)" />
              <span>{safeRating.toFixed(1)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              <Bell size={12} color="#ffa94d" style={{ opacity: 0.9 }} />
              <span>{56 + (numericId % 5) * 10}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              <Leaf size={12} color="rgba(32, 201, 151, 0.9)" style={{ opacity: 0.9 }} />
              <span>{90 + (numericId % 3) * 15}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              <MessagesSquare size={12} color="#fcc419" style={{ opacity: 0.9 }} />
              <span>{(numericId % 4) + 1}M</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              <Camera size={12} color="#4db8ff" style={{ opacity: 0.9 }} />
              <span>{(numericId % 6) + 2}</span>
            </div>
          </div>

          {/* Tour Title */}
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              lineHeight: "1.3",
              color: "rgba(255,255,255,0.9)",
              transition: "transform 0.3s",
              marginBottom: "8px",
            }}
            className="tour-title-text"
          >
            {title}
          </h3>

          {/* Tour Description */}
          <p
            className="tour-desc-text"
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.5",
              marginBottom: "8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer of the Card: Price and Action Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "16px",
            marginTop: "8px",
          }}
        >
          {/* Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{t('desde', 'Desde')}</span>
              {originalPrice > price && (
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(originalPrice, activeCurrency)}
                </span>
              )}
              {priceBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="tour-card-badge tour-card-promo-badge"
                  style={getBadgeStyle(badge)}
                >
                  {badge}
                </span>
              ))}
            </div>
            <span
              className="tour-price-value"
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "var(--secondary)",
                fontFamily: "var(--font-title)",
                opacity: 0.9,
              }}
            >
              {formatPrice(price, activeCurrency)}
            </span>
          </div>

          {/* Action Buttons (Compare & Detail) */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Compare Button (Relocated next to CTA and inherits its styling) */}
            {onToggleCompare && (
              <button
                className={`btn-circular-glass btn-card-action btn-lg no-rotate ${isComparing ? "btn-active-compare" : "btn-blue-glass"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(id);
                }}
                title={t('compararEsteTour', 'Comparar este Tour')}
              >
                <GitCompare size={16} />
              </button>
            )}

            <button
              className="btn-circular-glass btn-card-action btn-lg btn-blue-glass"
              onClick={(e) => {
                if (onClick) {
                  e.stopPropagation();
                  onClick();
                } else {
                   alert(`${t('reservaDe', 'Reserva de:')} ${title}`);
                }
              }}
            >
              <ArrowRight size={18} style={{ transition: "transform 0.3s" }} className="arrow-icon" />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .tour-title-text {
          transition: color 0.3s ease;
        }
        .glass-card:hover .tour-title-text {
          color: var(--secondary) !important;
          transform: translateX(4px);
        }
        .glass-card:hover .card-bg-image {
          transform: scale(1.08) rotate(1.5deg);
        }
        
        @keyframes pulse-fomo {
          0% { opacity: 0.85; }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0.85; }
        }

        /* Mobile specific enhancements */
        @media (max-width: 768px) {
          .tour-title-text {
            font-size: 1.4rem !important;
            font-weight: 800 !important;
          }
          .tour-desc-text {
            font-size: 1rem !important;
            line-height: 1.6 !important;
            margin-bottom: 12px !important;
          }
          .tour-price-value {
            font-size: 1.6rem !important;
          }
          .tour-card-badge {
            font-size: 0.88rem !important;
            padding: 5px 12px !important;
          }
          .tour-card-badge svg {
            width: 14px !important;
            height: 14px !important;
          }
          .tour-card-promo-badge {
            font-size: 0.88rem !important;
            padding: 5px 14px !important;
          }
          .tour-stats-container {
            font-size: 0.95rem !important;
            gap: 16px !important;
            margin-bottom: 12px !important;
          }
          .tour-stats-container svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </article>
  );
}
