/* eslint-disable react-hooks/refs */
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Compass, DollarSign, Layers, Mountain, Parasol, Amphora, Heart } from "lucide-react";

import TourCard from "./TourCard";
import { useTranslation } from "../i18n/LanguageContext";

// Dominant Vibe Helper
const getDominantVibe = (tour, t) => {
  const scores = [
    { 
      key: "Adrenaline", 
      val: tour.vibeAdrenaline || 0, 
      label: t("mapVibeAdventure", "Aventura"), 
      class: "vibe-pin-adventure", 
      svg: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="currentColor" class="vibe-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` 
    },
    { 
      key: "Relax", 
      val: tour.vibeRelax || 0, 
      label: t("mapVibeRelax", "Relax"), 
      class: "vibe-pin-relax", 
      svg: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="vibe-svg"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"></path><path d="M9 22v-4h4"></path></svg>` 
    },
    { 
      key: "Culture", 
      val: tour.vibeCulture || 0, 
      label: t("mapVibeCulture", "Cultura"), 
      class: "vibe-pin-culture", 
      svg: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="vibe-svg"><line x1="4" y1="21" x2="20" y2="21"></line><line x1="4" y1="14" x2="20" y2="14"></line><line x1="17" y1="8" x2="17" y2="14"></line><line x1="12" y1="8" x2="12" y2="14"></line><line x1="7" y1="8" x2="7" y2="14"></line><path d="M4 8l8-5 8 5"></path></svg>` 
    },
    { 
      key: "Family", 
      val: tour.vibeFamily || 0, 
      label: t("mapVibeFamily", "Familiar"), 
      class: "vibe-pin-family", 
      svg: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="vibe-svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` 
    }
  ];
  
  // Sort descending to find the dominant score
  scores.sort((a, b) => b.val - a.val);
  
  // Default to Culture if everything is zero, otherwise return highest score vibe
  return scores[0].val > 0 ? scores[0] : scores.find(s => s.key === "Culture") || scores[0];
};

// Component to handle map bounds and automatic fitting on load
function MapBounds({ tours }) {
  const map = useMap();
  const prevToursKeyRef = useRef("");

  useEffect(() => {
    if (tours && tours.length > 0) {
      const validTours = tours.filter(t => t.lat && t.lng);
      if (validTours.length > 0) {
        // Generar una clave unica con los IDs ordenados de los tours validos
        const toursKey = validTours.map(t => t.id).sort().join(",");
        if (toursKey !== prevToursKeyRef.current) {
          prevToursKeyRef.current = toursKey;
          const bounds = L.latLngBounds(validTours.map(t => [t.lat, t.lng]));
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
      }
    } else {
      prevToursKeyRef.current = "";
    }
  }, [tours, map]);

  return null;
}

// Map Event Listener for updating map bounds when the user pans/zooms
function MapMoveHandler({ onBoundsChange, active }) {
  const map = useMapEvents({
    moveend: () => {
      if (active) {
        onBoundsChange(map.getBounds());
      }
    },
    zoomend: () => {
      if (active) {
        onBoundsChange(map.getBounds());
      }
    }
  });

  // Trigger initial bounds calculation when map loads or active state is enabled
  useEffect(() => {
    if (active) {
      // Small timeout to ensure leaflet container has finalized its layout dimensions
      const timer = setTimeout(() => {
        try {
          onBoundsChange(map.getBounds());
        } catch (e) {
          console.warn("Leaflet map is not fully initialized yet:", e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active, map, onBoundsChange]);

  return null;
}



export default function InteractiveMap({ tours = [], activeCurrency, onTourClick }) {
  const { t } = useTranslation();
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const [searchAsIPan, setSearchAsIPan] = useState(true);
  const [mapMode, setMapMode] = useState("price"); // "price" or "vibe"
  const [mapBounds, setMapBounds] = useState(null);
  
  const sidebarContainerRef = useRef(null);
  const mapRef = useRef(null);
  const iconsCacheRef = useRef({});

  const validTours = tours.filter(t => t.lat && t.lng);

  // Filter tours dynamically based on visible map coordinates
  const displayedTours = tours.filter(tour => {
    if (!searchAsIPan || !mapBounds) return true;
    if (!tour.lat || !tour.lng) return false;
    
    // Check if bounds contain the coordinate
    try {
      return mapBounds.contains([tour.lat, tour.lng]);
    } catch (e) {
      return true;
    }
  });

  // Scroll map coordinates back to fit all matching tours
  const handleResetMap = () => {
    setSearchAsIPan(false);
    if (validTours.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(validTours.map(t => [t.lat, t.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  };

  return (
    <div 
      className="interactive-map-container animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "row",
        height: "75vh",
        width: "100%",
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-main)",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* Sidebar with Tour Cards */}
      <div 
        ref={sidebarContainerRef}
        className="map-sidebar scrollbar-hide"
        style={{
          width: "35%",
          minWidth: "320px",
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "var(--bg-surface)",
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
          zIndex: 2,
          transition: "background-color 0.3s ease"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-heading)", fontFamily: "var(--font-title)" }}>
            {displayedTours.length} {displayedTours.length === 1 ? t("mapTourInThisArea", "Tour en esta zona") : t("mapToursInThisArea", "Tours en esta zona")}
          </h3>
          {searchAsIPan && displayedTours.length !== tours.length && (
            <button 
              onClick={handleResetMap}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
               {t("mapViewAll", "Ver todos")} ({tours.length})
            </button>
          )}
        </div>
        
        {displayedTours.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px", padding: "0 10px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "15px" }}>
              {t("mapNoToursInArea", "No hay excursiones para los filtros seleccionados en esta zona del mapa.")}
            </p>
            <button 
              className="btn btn-outline" 
              onClick={handleResetMap}
              style={{ padding: "8px 16px", fontSize: "0.8rem", width: "100%" }}
            >
               {t("mapResetToAllTours", "Reajustar mapa para ver todos los tours")}
            </button>
          </div>
        ) : (
          displayedTours.map(tour => (
            <div 
              key={tour.id}
              id={`tour-card-${tour.id}`}
              onMouseEnter={() => setHoveredTourId(tour.id)}
              onMouseLeave={() => setHoveredTourId(null)}
              style={{
                transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15), box-shadow 0.25s ease",
                transform: hoveredTourId === tour.id ? "scale(1.015) translateY(-2px)" : "none",
                boxShadow: hoveredTourId === tour.id ? "var(--shadow-md)" : "none",
                borderRadius: "var(--radius-md)",
                border: hoveredTourId === tour.id ? "1px solid var(--primary)" : "1px solid transparent"
              }}
            >
              <TourCard 
                tour={tour}
                currency={activeCurrency}
                onClick={() => onTourClick && onTourClick(tour.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Interactive Map */}
      <div 
        className="map-view"
        style={{
          width: "65%",
          height: "100%",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Floating Overlays */}
        <div className="map-floating-overlay">
          {/* Search as I pan switcher */}
          <div className="map-control-card">
            <label className="map-switch-container">
              <input 
                type="checkbox" 
                className="map-switch-input" 
                checked={searchAsIPan}
                onChange={(e) => {
                  setSearchAsIPan(e.target.checked);
                  if (!e.target.checked) {
                    setMapBounds(null);
                  }
                }}
              />
              <span className="map-switch-slider"></span>
              <span>{t("mapSearchAsPan", "Buscar al mover el mapa")}</span>
            </label>
          </div>

          {/* Toggle modes Precios / Vibras */}
          <div className="mode-toggle-group">
            <button 
              className={`mode-toggle-btn ${mapMode === "price" ? "active" : ""}`}
              onClick={() => setMapMode("price")}
            >
              <DollarSign size={13} />
               <span>{t("mapModePrices", "Precios")}</span>
            </button>
            <button 
              className={`mode-toggle-btn ${mapMode === "vibe" ? "active" : ""}`}
              onClick={() => setMapMode("vibe")}
            >
              <Layers size={13} />
               <span>{t("mapModeVibes", "Vibras")}</span>
            </button>
          </div>
        </div>

        {/* Vibe Mode Legend */}
        {mapMode === "vibe" && (
          <div className="map-legend-card animate-fade-in">
            <div className="legend-title">{t("mapVibeFilter", "Filtro de Vibras")}</div>
            <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="legend-color-dot" style={{ backgroundColor: "#ef4444" }}></span>
              <Mountain size={12} style={{ color: "#ef4444" }} />
               <span>{t("mapVibeAdventure", "Aventura")}</span>
            </div>
            <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="legend-color-dot" style={{ backgroundColor: "#3b82f6" }}></span>
              <Parasol size={12} style={{ color: "#3b82f6" }} />
               <span>{t("mapVibeRelax", "Relax")}</span>
            </div>
            <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="legend-color-dot" style={{ backgroundColor: "#8b5cf6" }}></span>
              <Amphora size={12} style={{ color: "#8b5cf6" }} />
               <span>{t("mapVibeCulture", "Cultura")}</span>
            </div>
            <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="legend-color-dot" style={{ backgroundColor: "#10b981" }}></span>
              <Heart size={12} style={{ color: "#10b981" }} />
               <span>{t("mapVibeFamily", "Familiar")}</span>
            </div>
          </div>
        )}

        <MapContainer 
          center={[-15, -60]} 
          zoom={4} 
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapBounds tours={validTours} />
          <MapMoveHandler onBoundsChange={setMapBounds} active={searchAsIPan} />
          
          {validTours.map(tour => {
            const isHovered = hoveredTourId === tour.id;
            const isFlashDeal = !!tour.discount;
            const vibeInfo = getDominantVibe(tour, t);
            const priceText = activeCurrency === "CLP" 
              ? `$${Math.round(tour.price * 950).toLocaleString("es-CL")}` 
              : `$${tour.price}`;
            const iconKey = `${tour.id}_${mapMode}_${isHovered}_${isFlashDeal}_${priceText}`;
            
            let customIcon = iconsCacheRef.current[iconKey];
            if (!customIcon) {
              let iconClass = `custom-map-pin ${isHovered ? 'pin-active' : ''} ${isFlashDeal ? 'flash-pulse-pin' : ''}`;
              let htmlContent;
              let iconSize;
              let iconAnchor;

              if (mapMode === "vibe") {
                iconClass += ` ${vibeInfo.class}`;
                htmlContent = `<div class="pin-inner">${vibeInfo.svg}<span>${vibeInfo.label}</span></div>`;
                iconSize = [90, 32];
                iconAnchor = [45, 16];
              } else {
                htmlContent = `<div class="pin-inner">${priceText}</div>`;
                iconSize = [80, 32];
                iconAnchor = [40, 16];
              }

              customIcon = L.divIcon({
                className: iconClass,
                html: htmlContent,
                iconSize: iconSize,
                iconAnchor: iconAnchor
              });
              iconsCacheRef.current[iconKey] = customIcon;
            }

            return (
              <Marker 
                key={tour.id}
                position={[tour.lat, tour.lng]}
                icon={customIcon}
                eventHandlers={{
                  mouseover: () => setHoveredTourId(tour.id),
                  mouseout: () => setHoveredTourId(null),
                  click: () => {
                    setHoveredTourId(tour.id);
                    // Smoothly scroll sidebar to this tour's card
                    const cardElement = document.getElementById(`tour-card-${tour.id}`);
                    if (cardElement && sidebarContainerRef.current) {
                      cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                  }
                }}
              >
                <Popup className="custom-popup">
                  <div 
                    style={{ cursor: "pointer", width: "200px" }}
                    onClick={() => onTourClick && onTourClick(tour.id)}
                  >
                    <img 
                      src={tour.image} 
                      alt={tour.title} 
                      style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", marginBottom: "8px" }} 
                    />
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-heading)", fontWeight: 700, fontFamily: "var(--font-title)" }}>
                      {tour.title}
                    </h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 800 }}>
                        {activeCurrency === "CLP" ? `CLP $${Math.round(tour.price * 950).toLocaleString("es-CL")}` : `$${tour.price}`}
                      </span>
                      {tour.discount && (
                        <span style={{ fontSize: "0.7rem", backgroundColor: "var(--secondary)", color: "#000000", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                          {tour.discount.replace(/\s*\(IA Spark\)/i, "")}
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
