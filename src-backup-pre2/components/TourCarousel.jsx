import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import TourCard from "./TourCard";
import { useTranslation } from "../i18n/LanguageContext";

export default function TourCarousel({
  tours,
  activeCurrency,
  onTourClick,
  direction = "right",
  icon: Icon,
  title,
  linkText,
  itemsPerPage = 3,
  customHeaderElement,
  onToggleCompare,
  compareTours
}) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeItemsPerPage = isMobile ? 1 : isTablet ? 2 : itemsPerPage;

  const isUp = true;
  const isLeft = direction === "left";

  const maxIndex = isUp 
    ? Math.ceil(tours.length / activeItemsPerPage) - 1 
    : Math.max(0, tours.length - activeItemsPerPage);

  // Safety bounds
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  const getTransform = () => {
    if (isUp) {
      return `translateY(0)`; // Handled via grid overlap now
    }
    const offset = `calc(${safeCurrentIndex} * (100% / ${activeItemsPerPage} + ${24 / activeItemsPerPage}px))`;
    return isLeft ? `translateX(calc(-1 * ${offset}))` : `translateX(-${offset})`;
  };

  return (
    <div className="left-content-area" style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
      {/* Header with Nav Buttons */}
      <div className="section-heading-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {Icon && <Icon size={24} style={{ color: "var(--accent)" }} />}
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{title}</h2>
          <button
            className="btn-card-action no-rotate"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(31, 162, 249, 0.21)",
              border: "none",
              color: "var(--primary)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0
            }}
            onClick={() => {
              window.location.hash = "#tours";
            }}
            title={linkText}
          >
            <Plus size={16} />
          </button>
          {customHeaderElement && (
            <div style={{ marginLeft: "16px" }}>
              {customHeaderElement}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={handleNext}
            style={{ 
              backgroundColor: "rgba(31, 162, 249, 0.21)", 
              border: "none", 
              borderRadius: "50%", 
              width: "36px", 
              height: "36px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--primary)"
            }}
            title={t('siguienteFila', 'Siguiente fila')}
          >
            <ChevronUp size={18} />
          </button>
          <button 
            onClick={handlePrev}
            style={{ 
              backgroundColor: "rgba(31, 162, 249, 0.21)", 
              border: "none", 
              borderRadius: "50%", 
              width: "36px", 
              height: "36px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--primary)"
            }}
            title={t('filaAnterior', 'Fila anterior')}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Viewport */}
      <div 
        style={{ 
          overflow: "hidden", 
          padding: "4px", // to prevent box-shadow clipping
          margin: "-4px"
        }}
      >
        <div 
          style={{ 
            display: isUp ? "grid" : "flex",
            flexDirection: isUp ? "column" : "row",
            gap: "24px",
            transform: getTransform(),
            transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            width: "100%",
          }}
        >
          {isUp ? (
            // Render rows of 3 overlapping in a grid to prevent height stretching
            Array.from({ length: maxIndex + 1 }).map((_, rowIdx) => {
              const isActive = rowIdx === safeCurrentIndex;
              const yOffset = (rowIdx - safeCurrentIndex) * 100;
              return (
                <div 
                  key={rowIdx} 
                  style={{ 
                    gridArea: "1 / 1",
                    display: "flex", 
                    gap: "24px", 
                    width: "100%", 
                    transform: `translateY(${yOffset}%)`,
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                    transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease"
                  }}
                >
                  {tours.slice(rowIdx * activeItemsPerPage, rowIdx * activeItemsPerPage + activeItemsPerPage).map(tour => (
                    <div key={tour.id} style={{ flex: "1 1 0", minWidth: 0 }}>
                      <TourCard 
                        tour={tour} 
                        onClick={() => onTourClick(tour.id)} 
                        activeCurrency={activeCurrency} 
                        onToggleCompare={onToggleCompare}
                        isComparing={compareTours && compareTours.includes(tour.id)}
                      />
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            // Render all items linearly
            tours.map(tour => (
              <div key={tour.id} style={{ flex: `0 0 calc(${100 / activeItemsPerPage}% - ${(24 * (activeItemsPerPage - 1)) / activeItemsPerPage}px)` }}>
                <TourCard 
                  tour={tour} 
                  onClick={() => onTourClick(tour.id)} 
                  activeCurrency={activeCurrency} 
                  onToggleCompare={onToggleCompare}
                  isComparing={compareTours && compareTours.includes(tour.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
