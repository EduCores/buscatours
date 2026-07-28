import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";

import { dataService } from "../services/dataService";

const FitTitle = ({ text }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const adjustFontSize = () => {
      // Restablecer tamaño de fuente para permitir que CSS (clamp) calcule el valor base
      el.style.fontSize = "";

      const parent = el.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      if (parentWidth === 0) return;

      const computedStyle = window.getComputedStyle(el);
      let currentSize = parseFloat(computedStyle.fontSize);

      el.style.whiteSpace = "nowrap";

      // Reducir la fuente progresivamente hasta que quepa en el contenedor o alcance el mínimo (16px)
      let safetyVal = 0;
      while (el.scrollWidth > parentWidth && currentSize > 16 && safetyVal < 100) {
        currentSize -= 1;
        el.style.fontSize = `${currentSize}px`;
        safetyVal++;
      }
    };

    adjustFontSize();

    const observer = new ResizeObserver(() => {
      adjustFontSize();
    });

    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [text]);

  return (
    <h1
      ref={containerRef}
      className="hero-text-glow hero-title"
      style={{
        fontFamily: "var(--font-title)",
        fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "-1.5px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {text}
    </h1>
  );
};

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    subtitle: 'Tour Especial de Aventura',
    title: '7 Días / 6 Noches',
    description: 'Cueva del Milodón, Laguna Sofía, Base Torres del Paine y Glaciar Grey. La experiencia patagónica definitiva.',
    buttonText: 'Ver Más',
    image: '/uploads/tours/hero/slider-cataratas-del-iguazu.webp',
    link: '#tours',
  },
  {
    id: 'default-2',
    subtitle: 'Encuentra tus Vacaciones Perfectas',
    title: 'Descubre la Magia de la Patagonia',
    description: 'Excursiones exclusivas saliendo de Punta Arenas, Puerto Natales y exploraciones en la salvaje Tierra del Fuego.',
    buttonText: 'Explorar Destinos',
    image: '/uploads/tours/hero/slider-machu-pichu.webp',
    link: '#destinos',
  },
  {
    id: 'default-3',
    subtitle: 'Abre tus Ojos a...',
    title: 'Un Mundo Oculto',
    description: 'Explora glaciares milenarios, estancias remotas y senderos vírgenes en el extremo sur del planeta.',
    buttonText: 'Ver Actividades',
    image: '/uploads/tours/hero/slider-cataratas-del-iguazu.webp',
    link: '#actividades',
  }
];

export default function HeroSlider({ children }) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES); // Start with fallback to avoid blank flash

  useEffect(() => {
    dataService.getSliderSlides()
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(err => {
        console.warn("Failed to load slides from DB, keeping fallback", err);
      });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <section
      className="hero-slider-section"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "var(--bg-main)",
      }}
    >
      {/* Background Images with Ken Burns Zoom Effect and Overlay Gradient */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={`bg-${slide.id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: isActive ? 1 : 0,
              transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: isActive ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            {/* Background Image with Ken Burns Zoom Effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.05)" : "scale(1.0)",
                transition: isActive ? "transform 7s ease-out" : "none",
              }}
            />
            {/* Global Dark Overlay for Text Readability and Glass Contrast */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Perfect Seamless Bottom Edge using CSS Mask (smooth and subtle fade) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "var(--bg-main)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 30%, black 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, transparent 30%, black 100%)",
              }}
            />
          </div>
        );
      })}

      {/* Foreground Flex Layout */}
      <div
        className="hero-layout-container"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {/* Slide Content container */}
        <div
          className="hero-slide-container"
          style={{
            position: "relative",
            width: "100%",
            display: "grid",
            alignItems: "end",
          }}
        >
          {slides.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={`content-${slide.id}`}
                style={{
                  gridArea: "1 / 1",
                  width: "100%",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: isActive ? 2 : 1,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                className="container hero-slide-content"
              >
                <div
                  style={{
                    maxWidth: "650px",
                    color: "#fff",
                    transform: isActive ? "translateY(0)" : "translateY(40px)",
                    opacity: isActive ? 1 : 0,
                    transition: isActive ? "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" : "none",
                  }}
                >
                  {/* Subtitle */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--secondary)",
                      borderRadius: "var(--radius-full)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                    className="hero-subtitle"
                  >
                    <Calendar size={14} />
                    {slide.subtitle}
                  </span>

                  {/* Title */}
                  <FitTitle text={slide.title} />

                  {/* Description */}
                  <p
                    className="hero-text-glow hero-desc"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: 400,
                      lineHeight: "1.6",
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* Call to Action Button */}
                  <a
                    href={slide.link}
                    className="btn btn-primary hero-btn"
                  >
                    {slide.buttonText}
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Slide Indicators / Dots */}
          <div
            className="hero-dots"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              gap: "12px",
            }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                style={{
                  width: index === current ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: index === current ? "var(--primary)" : "rgba(255, 255, 255, 0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* SearchBar Container */}
        <div className="hero-search-wrapper" style={{ width: "100%", zIndex: 20 }}>
          {children}
        </div>
      </div>

      <style>{`
        .hero-slider-section {
          min-height: 100vh;
        }
        .hero-layout-container {
          min-height: 100vh;
        }
        .hero-slide-container {
          padding-top: 150px;
          padding-bottom: 40px;
        }
        .hero-slide-content {
          display: flex;
          flex-direction: column;
          justifyContent: flex-end;
          align-items: flex-start;
          padding-top: 0px; 
          padding-bottom: 0px; 
        }
        .hero-subtitle {
          padding: 6px 14px;
          font-size: 0.85rem;
          margin-bottom: 8px;
        }
        .hero-title {
          font-size: clamp(2.0rem, 4.2vw, 4.5rem);
          margin-bottom: 8px;
          line-height: 1;
        }
        .hero-desc {
          font-size: clamp(0.95rem, 1.8vw, 1.25rem);
          margin-bottom: 12px;
        }
        .hero-btn {
          font-size: 1rem;
          padding: 14px 32px;
        }
        .hero-dots {
          bottom: 12px;
        }
        .hero-search-wrapper {
          padding-bottom: 40px; 
          margin-top: auto;
        }
        @media (max-width: 768px) {
          .hero-slider-section {
            min-height: auto !important;
          }
          .hero-layout-container {
            min-height: auto !important;
          }
          .hero-slide-container {
            padding-top: 134px !important;
            padding-bottom: 30px !important;
          }
          .hero-slide-content {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
          }
          .hero-subtitle {
            font-size: 0.75rem;
            padding: 4px 10px;
            margin-bottom: 4px;
          }
          .hero-title {
            font-size: 1.8rem;
            margin-bottom: 4px;
            line-height: 1;
          }
          .hero-desc {
            font-size: 0.85rem;
            margin-bottom: 8px;
          }
          .hero-btn {
            font-size: 0.85rem;
            padding: 10px 22px;
          }
          .hero-dots {
            bottom: 4px;
          }
          .hero-search-wrapper {
            padding-bottom: 20px;
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
