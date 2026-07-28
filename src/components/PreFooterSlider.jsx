import React, { useState, useEffect } from "react";
import { dataService } from "../services/dataService";

function fetchActiveSlides() {
  const all = dataService.getBottomSliderSlides();
  return all.filter((s) => s.active).sort((a, b) => a.order - b.order);
}

export default function PreFooterSlider({ children }) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(() => fetchActiveSlides());

  // Re-sync when an admin publishes new slider slides
  useEffect(() => {
    const onUpdate = () => {
      setSlides(fetchActiveSlides());
      setCurrent(0);
    };
    window.addEventListener("bottom-slider-updated", onUpdate);
    return () => window.removeEventListener("bottom-slider-updated", onUpdate);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      style={{
        position: "relative",
        padding: "0 0 0 0",
        overflow: "hidden",
        backgroundColor: "var(--bg-main)",
        marginTop: "0px"
      }}
      className="pre-footer-slider-container"
    >
      {/* Background Images with Fades */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id || index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: isActive ? 0.35 : 0, // semi-transparent so it integrates nicely with the dark background
              transition: "opacity 1.5s ease-in-out",
              zIndex: isActive ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.05)" : "scale(1.0)",
                transition: isActive ? "transform 6s ease-out" : "none",
              }}
            />
          </div>
        );
      })}

      {/* Top Blend Gradient (faded towards the top) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: "linear-gradient(to bottom, var(--bg-main) 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none"
        }}
      />

      {/* Dark tint overlay for card readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
          zIndex: 2,
          pointerEvents: "none"
        }}
      />

      {/* Content Layer (Cards) */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
}
