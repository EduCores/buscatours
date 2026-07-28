import React, { useState, useMemo } from "react";
import { destinationsData } from "../data/tours";
import { ArrowUpRight, DollarSign, Calendar, Star, Globe, CloudSun, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

// Country options for the location dropdown in the admin panel
const countryOptions = [
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Belice', value: 'Belice' },
  { label: 'Bolivia', value: 'Bolivia' },
  { label: 'Brasil', value: 'Brasil' },
  { label: 'Chile', value: 'Chile' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Haití', value: 'Haití' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'México', value: 'México' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Panamá', value: 'Panamá' },
  { label: 'Paraguay', value: 'Paraguay' },
  { label: 'Perú', value: 'Perú' },
  { label: 'Rep. Dominicana', value: 'Rep. Dominicana' },
  { label: 'Uruguay', value: 'Uruguay' },
  { label: 'Venezuela', value: 'Venezuela' }
];

// Country lists for "Explora el Mundo" - LATIN AMERICA section
const latinoAmericaCountries = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela'
];

// Country lists for "Explora el Mundo" - CENTRAL AMERICA section
const centroAmericaCountries = [
  'México','Haití', 'Rep. Dominicana', 'Belice', 'Costa Rica', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panamá', 'Cuba', 
];

// Filter destinations by region
const latinoAmericaDestinations = destinationsData.filter(dest => 
  latinoAmericaCountries.includes(dest.name)
);

const centroAmericaDestinations = destinationsData.filter(dest => 
  centroAmericaCountries.includes(dest.name)
);

const getGridStyle = (index) => {
  switch (index) {
    case 0:
      return { gridArea: "span 2 / span 2" };
    case 1:
    case 6:
      return { gridArea: "span 1 / span 2" };
    default:
      return { gridArea: "span 1 / span 1" };
  }
};

const getCardHeight = (index) => {
  if (index === 0) return "460px";
  if (index === 1 || index === 6) return "220px";
  return "220px";
};

const RenderRegionSection = ({ 
  title, 
  icon: Icon, 
  destinations, 
  tours,
  onSelectDestination, 
  t,
  sizeStyle = 'medium'
}) => {
  if (!destinations || destinations.length === 0) return null;
  
  const enrichedDestinations = destinations.map((dest) => {
    const activeToursCount = tours.filter(
      (t) => t.destination && t.destination.toLowerCase() === dest.name.toLowerCase()
    ).length;
    return {
      ...dest,
      count: activeToursCount,
    };
  });

  if (enrichedDestinations.length === 0) return null;

  if (destinations.length === 0) return null;

  return (
    <div style={{ marginBottom: "80px" }}>
      {/* Asymmetrical Grid Wrapper */}
      <div className="destinations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", gridAutoFlow: "dense" }}>
        {enrichedDestinations.map((dest, idx) => {
          const cardSize = idx === 0 ? "large" : (idx === 1 || idx === 6) ? "wide" : "small";
          return (
            <div
              key={dest.name}
              className={`destination-card card-${cardSize} glass-card hover-zoom-img`}
              style={{
                position: "relative",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                height: getCardHeight(idx),
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                ...getGridStyle(idx),
              }}
              onClick={() => onSelectDestination ? onSelectDestination(dest.name) : alert(`${t('destExploring', 'Explorando')} ${t('destToursEn', 'Tours en')}: ${dest.name}`)}
            >
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
                  transition: "transform 0.5s ease, opacity 0.4s ease",
                  transform: "scale(1.02)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(15,23,42,0) 40%, rgba(15,23,42,0.9) 100%)",
                  zIndex: 1,
                }}
              />
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
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
                  <ArrowUpRight size={16} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                    {t('explorar', 'Explorar')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Destinations({ tours = [], onSelectDestination }) {
  const { t } = useTranslation();

  // Enrich all destinations with tour counts
  const allEnrichedDestinations = useMemo(() => {
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
      <div style={{ width: "100%" }}>
        {/* Section Header - LATINO AMÉRICA */}
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
            {t('destino', 'Destino')}
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text-heading)",
              letterSpacing: "-0.5px",
            }}
          >
            {t('latinoAmerica', 'Latino América')}
          </h2>
          <p style={{ 
            color: "var(--text-muted)", 
            fontSize: "1rem", 
            marginTop: "8px",
            fontWeight: 500
          }}>
            {latinoAmericaDestinations.length} {t('paises', 'países')} · 
            {latinoAmericaDestinations.reduce((sum, d) => sum + d.count, 0)} {t('toursRegistrados', 'Tours Registrados')}
          </p>
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

        {/* Latino América Section */}
        <RenderRegionSection
          title={t('latinoAmerica', 'Latino América')}
          icon={Globe}
          destinations={latinoAmericaDestinations}
          tours={tours}
          onSelectDestination={onSelectDestination}
          t={t}
        />

        {/* Section Header - CENTRO AMÉRICA */}
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
            {t('destino', 'Destino')}
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text-heading)",
              letterSpacing: "-0.5px",
            }}
          >
            {t('centroAmerica', 'Centro América')}
          </h2>
          <p style={{ 
            color: "var(--text-muted)", 
            fontSize: "1rem", 
            marginTop: "8px",
            fontWeight: 500
          }}>
            {centroAmericaDestinations.length} {t('paises', 'países')} · 
            {centroAmericaDestinations.reduce((sum, d) => sum + d.count, 0)} {t('toursRegistrados', 'Tours Registrados')}
          </p>
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

        {/* Centro América Section */}
        <RenderRegionSection
          title={t('centroAmerica', 'Centro América')}
          icon={Zap}
          destinations={centroAmericaDestinations}
          tours={tours}
          onSelectDestination={onSelectDestination}
          t={t}
        />

        {/* All Other Destinations Section (fallback for any not in the two regions) */}
        {(() => {
          const otherDestinations = allEnrichedDestinations.filter(dest => 
            !latinoAmericaCountries.includes(dest.name) && 
            !centroAmericaCountries.includes(dest.name)
          );
          if (otherDestinations.length === 0) return null;
          
          return (
            <RenderRegionSection
              title={t('otrosDestinos', 'Otros Destinos')}
              icon={Globe}
              destinations={otherDestinations}
              tours={tours}
              onSelectDestination={onSelectDestination}
              t={t}
            />
          );
        })()}
      </div>
    </section>
  );
}