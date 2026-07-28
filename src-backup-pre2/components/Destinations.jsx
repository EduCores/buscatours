import React, { useState } from "react";
import { destinationsData } from "../data/tours";
import { ArrowUpRight, DollarSign, Calendar, Star, Globe, CloudSun, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

const countryVideos = {
  "argentina": "https://assets.mixkit.co/videos/preview/mixkit-glacier-river-in-patagonia-41808-large.mp4",
  "perú": "https://assets.mixkit.co/videos/preview/mixkit-ancient-ruins-on-a-hill-under-clouds-40995-large.mp4",
  "bolivia": "https://assets.mixkit.co/videos/preview/mixkit-water-reflecting-the-clouds-and-sunset-41618-large.mp4",
  "brasil": "https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-turquoise-water-and-palm-trees-41819-large.mp4",
  "colombia": "https://assets.mixkit.co/videos/preview/mixkit-tropical-island-landscape-view-4692-large.mp4",
  "ecuador": "https://assets.mixkit.co/videos/preview/mixkit-underwater-view-of-a-coral-reef-and-fish-41639-large.mp4",
  "chile": "https://assets.mixkit.co/videos/preview/mixkit-mountains-under-the-stars-in-chile-41805-large.mp4"
};
export default function Destinations({ tours = [], onSelectDestination }) {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // We want to create an asymmetrical layout grid, so we assign custom styles
  // to cards depending on their index.
  const getGridStyle = (index) => {
    switch (index) {
      case 0:
        return { gridArea: "span 2 / span 2" }; // Large card (featured)
      case 1:
      case 6:
        return { gridArea: "span 1 / span 2" }; // Wide card
      default:
        return { gridArea: "span 1 / span 1" }; // Standard cards
    }
  };

  const enrichedDestinations = React.useMemo(() => {
    return destinationsData.map((dest) => {
      const activeToursCount = tours.filter(
        (t) => t.destination && t.destination.toLowerCase() === dest.name.toLowerCase()
      ).length;
      return {
        ...dest,
        count: activeToursCount,
      };
    });
  }, [tours]);

  return (
    <section id="destinos" style={{ paddingTop: "10px", position: "relative" }}>
      {/* Decorative Blur Blob */}
      <div className="glow-blob" style={{ top: "10%", right: "-100px" }} />

      <div style={{ width: "100%" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "var(--primary)",
              marginBottom: "8px",
            }}
          >
            {t('exploraElMundo', 'Explora el Mundo')}
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text-heading)",
              letterSpacing: "-0.5px",
            }}
          >
            {t('destinosPopulares', 'Destinos Populares')}
          </h2>
          <div
            style={{
              width: "60px",
              height: "4px",
              backgroundColor: "var(--primary)",
              borderRadius: "2px",
              marginTop: "16px",
            }}
          />
        </div>

        {/* Asymmetrical Grid Wrapper */}
        <div className="destinations-grid">
          {enrichedDestinations.map((dest, idx) => {
            const cardSize = idx === 0 ? "large" : (idx === 1 || idx === 6) ? "wide" : "small";
            return (
              <div
                key={idx}
                className={`destination-card card-${cardSize} glass-card hover-zoom-img`}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  height: idx === 0 ? "460px" : idx === 1 ? "220px" : "220px",
                  boxShadow: "var(--shadow-md)",
                  cursor: "pointer",
                  ...getGridStyle(idx),
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectDestination ? onSelectDestination(dest.name) : alert(`${t('destExploring', 'Explorando')} ${t('destToursEn', 'Tours en')}: ${dest.name}`)}
              >
                {/* Background Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.4s ease",
                    opacity: hoveredIndex === idx ? 0 : 1,
                  }}
                />
                {hoveredIndex === idx && (
                  <video
                    src={countryVideos[dest.name.toLowerCase()]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                      borderRadius: "var(--radius-md)"
                    }}
                  />
                )}

                {/* Trending Tag / FOMO indicator */}
                {dest.trending && (
                  <div
                    className="trending-tag animate-bounce-on-hover"
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      zIndex: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "2px 5px",
                      color: "#EF4444",
                      border: "1px solid #EF4444",
                      backgroundColor: "color-mix(in srgb, #EF4444 12%, rgba(0, 0, 0, 0.45))",
                      backdropFilter: "blur(2px)",
                      WebkitBackdropFilter: "blur(2px)",
                      borderRadius: "4px",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <span
                      className="ping-dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EF4444",
                        display: "inline-block",
                      }}
                    />
                    <span>{t('tendencia', 'Tendencia')}</span>
                  </div>
                )}

                {/* Scarcity Badge / Escasez (Point 3) */}
                {(idx === 0 || idx === 1 || idx === 3) && (
                  <div
                    className="scarcity-tag animate-pulse"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      zIndex: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 5px",
                      color: "#ea580c",
                      border: "1px solid #ea580c",
                      backgroundColor: "color-mix(in srgb, #ea580c 12%, rgba(0, 0, 0, 0.45))",
                      backdropFilter: "blur(2px)",
                      WebkitBackdropFilter: "blur(2px)",
                      borderRadius: "4px",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <Zap size={10} strokeWidth={3} style={{ color: "#ea580c" }} />
                    <span>{idx === 0 ? t('seAgotaRapido', 'Se agota rápido') : t('soloQuedan2', '¡Solo quedan 2 lugares!')}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0) 100%)",
                    zIndex: 1,
                  }}
                />

                {/* Text Info (overlayed) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    padding: idx === 0 ? "28px" : "18px",
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    color: "#fff",
                  }}
                >
                  <div style={{ flex: 1, marginRight: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-title)",
                          fontSize: idx === 0 ? "1.8rem" : "1.25rem",
                          fontWeight: 800,
                          color: "#ffffff",
                          marginBottom: "2px",
                          lineHeight: 1.2,
                          textShadow: "0 2px 4px rgba(15,23,42,0.8)",
                        }}
                      >
                        {dest.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "rgba(255, 255, 255, 0.85)",
                          fontWeight: 500,
                          textShadow: "0 1px 2px rgba(15,23,42,0.8)",
                        }}
                      >
                         {dest.count} {t('toursRegistrados', 'Tours Registrados')}
                      </span>
                    </div>

                    {/* Slogan (Slides up on Hover) */}
                    <div
                      className="dest-slogan"
                      style={{
                        fontSize: "0.75rem",
                        lineHeight: "1.4",
                        color: "rgba(255, 255, 255, 0.85)",
                        textShadow: "0 1px 2px rgba(15,23,42,0.8)",
                        fontWeight: 400,
                      }}
                    >
                      {dest.slogan}
                    </div>

                    {/* Friction Eliminators (Point 2) */}
                    <div className="dest-friction-eliminators" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: "#4ade80", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        <ShieldCheck size={13} />
                        <span>{t('cancelacionGratuita', 'Cancelación Gratuita')}</span>
                      </div>
                      {idx !== 2 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: "#fbbf24", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                          <Zap size={13} />
                          <span>{t('confirmacionInmediata', 'Confirmación Inmediata')}</span>
                        </div>
                      )}
                    </div>

                    {/* Detailed Tourist Info Capsules */}
                    <div className="dest-details-container" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {/* Price capsule */}
                      <div className="dest-badge dest-essential">
                        <DollarSign size={12} style={{ color: "var(--accent)" }} />
                        <span>{t('desde', 'Desde')} {dest.priceFrom}</span>
                      </div>

                      {/* Rating capsule */}
                      <div className="dest-badge dest-essential">
                        <Star size={11} style={{ fill: "#fbbf24", color: "#fbbf24" }} />
                        <span>{dest.rating}</span>
                      </div>

                      {/* Season capsule */}
                      <div className="dest-badge dest-medium">
                        <Calendar size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
                        <span>{dest.bestSeason}</span>
                      </div>

                      {/* Weather capsule */}
                      <div className="dest-badge dest-full">
                        <CloudSun size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
                        <span>{dest.weather}</span>
                      </div>

                      {/* Visa capsule */}
                      <div className="dest-badge dest-full">
                        <Globe size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
                        <span>{dest.visaRequired}</span>
                      </div>
                    </div>

                    {/* Highlights/Tags */}
                    <div className="dest-tags-container dest-full" style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "6px" }}>
                      {dest.highlights && dest.highlights.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="dest-tag-pill"
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            background: "rgba(255, 255, 255, 0.12)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#ffffff",
                            backdropFilter: "blur(1.1px)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow up-right icon on hover */}
                  <button
                    className={`btn-circular-glass dest-arrow-icon ${idx === 0 ? "btn-lg" : "btn-md"}`}
                    aria-label={`${t('verToursEn', 'Ver tours en')} ${dest.name}`}
                  >
                    <ArrowUpRight size={idx === 0 ? 18 : 15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        .destination-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .destination-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
        }

        /* Hover Reveal Slogan Style */
        .dest-slogan {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin-top 0.4s ease;
          margin-top: 0 !important;
        }

        .destination-card:hover .dest-slogan {
          max-height: 60px;
          opacity: 1;
          margin-top: 6px !important;
        }

        .dest-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(1.1px);
          -webkit-backdrop-filter: blur(1.1px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
          transition: all 0.25s ease;
        }
        
        .dest-badge:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .dest-badge svg {
          flex-shrink: 0;
        }

        /* Desktop size rules: hide elements based on card size class */
        .destination-card.card-small .dest-medium,
        .destination-card.card-small .dest-full {
          display: none !important;
        }
        .destination-card.card-wide .dest-full {
          display: none !important;
        }

        @media (max-width: 991px) {
          .destinations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .destination-card {
            grid-area: auto !important;
            height: 320px !important;
          }
          /* Always open slogan and details on mobile */
          .dest-slogan {
            max-height: 60px !important;
            opacity: 1 !important;
            margin-top: 6px !important;
          }
          /* On mobile/tablet, display ALL elements for ALL cards */
          .destination-card.card-small .dest-medium,
          .destination-card.card-small .dest-full,
          .destination-card.card-wide .dest-full {
            display: inline-flex !important;
          }
          .dest-tags-container.dest-full {
            display: flex !important;
          }
        }
        
        @media (max-width: 575px) {
          .destinations-grid {
            grid-template-columns: 1fr;
          }
          .destination-card {
            height: 290px !important;
          }
        }
        
        .destination-card:hover .dest-arrow-icon {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          transform: rotate(45deg);
        }

        @keyframes pulseScarcity {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.98); }
        }
        .animate-pulse {
          animation: pulseScarcity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
