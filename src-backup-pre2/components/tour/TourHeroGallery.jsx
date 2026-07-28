import React from "react";
import { useTranslation } from "../../i18n/LanguageContext";

export default function TourHeroGallery({ tour, heroImages, heroSlideIndex, goHeroSlide, tText }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "90vh",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Slide images */}
      {heroImages.map((imgSrc, idx) => {
        const isActive = idx === heroSlideIndex;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${imgSrc}")`,
              backgroundSize: "cover",
              backgroundPosition: tour.heroBackgroundPosition || "center",
              transition: "opacity 1s ease-in-out, transform 7s ease-out",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1.05)" : "scale(1.0)",
              zIndex: isActive ? 1 : 0,
            }}
          />
        );
      })}

      {/* Overlay Dark fading to the main page background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, var(--bg-main) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Navigation arrows (only if multiple images) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={() => goHeroSlide(heroSlideIndex - 1)}
            aria-label={tText('tdPrevImage', 'Imagen anterior')}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              fontSize: "1.1rem",
              lineHeight: 1,
              transition: "background 0.2s",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => goHeroSlide(heroSlideIndex + 1)}
            aria-label={tText('tdNextImage', 'Siguiente imagen')}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              fontSize: "1.1rem",
              lineHeight: 1,
              transition: "background 0.2s",
            }}
          >
            ›
          </button>

          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goHeroSlide(idx)}
                aria-label={`Imagen ${idx + 1}`}
                style={{
                  width: idx === heroSlideIndex ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background: idx === heroSlideIndex ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Counter badge */}
          <div
            style={{
              position: "absolute",
              top: "90px",
              right: "72px",
              zIndex: 2,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🖼️ {heroSlideIndex + 1} / {heroImages.length}
          </div>
        </>
      )}
    </div>
  );
}
