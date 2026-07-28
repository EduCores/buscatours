import React, { useState } from "react";
import { X, Sparkles, Bot, Compass, Calendar, Users, Check, ArrowRight, RotateCw, MapPin, Mountain, Parasol, Amphora } from "lucide-react";
import { formatPrice } from "../data/translations";
import { useTranslation } from '../i18n/LanguageContext';

export default function AiPlannerModal({ tours = [], activeCurrency, activeLanguage, onClose, onBookBundle }) {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [style, setStyle] = useState("adventure");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [itinerary, setItinerary] = useState(null);

  const getStepText = () => {
    switch (step) {
      case 1:
        return t("plannerStep1", "Analizando destinos y cruces de fronteras en América...");
      case 2:
        return t("plannerStep2", "Consultando catálogo de operadores locales verificados...");
      case 3:
        return t("plannerStep3", "Optimizando tiempos de traslados y rutas ecológicas...");
      case 4:
        return t("plannerStep4", "Aplicando descuento del 15% por reserva de paquete...");
      default:
        return "";
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destinations.trim()) return;

    setLoading(true);
    setStep(1);
    setItinerary(null);

    const stepsInterval = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);

    // Call backend-backed AI only
    try {
      const catalogStr = JSON.stringify(tours.map(t => ({
        id: t.id,
        title: t.title,
        price: t.price,
        loc: t.location,
        cat: t.category,
      })));

      const aiPrompt = `Eres un agente de viajes experto en América. Diseña un itinerario de viaje de 3 días para los destinos: "${destinations}". Estilo de viaje: "${style}". 
      Usa ÚNICAMENTE este catálogo de tours reales para asociar al itinerario: ${catalogStr}.
      Responde estrictamente con un JSON válido con este formato:
      {
        "title": "Aventura en ...",
        "summary": "Resumen del viaje...",
        "days": [
          { "dayNum": 1, "title": "Día 1: ...", "desc": "Descripción detallada del día..." },
          { "dayNum": 2, "title": "Día 2: ...", "desc": "Descripción..." },
          { "dayNum": 3, "title": "Día 3: ...", "desc": "Descripción..." }
        ],
        "matchedTourIds": [IDs de los tours del catálogo que se deben reservar]
      }
      No devuelvas nada más que el JSON puro sin bloques de código ni formato extra.`;

      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json().catch(() => null);
      const textResponse = data?.text ?? '';
      const jsonMatch = textResponse.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const matchedIds = (parsed.matchedTourIds || []).map(Number);
        const matchedTours = tours.filter(t => matchedIds.includes(t.id));

        setItinerary({
          title: parsed.title || 'Tu Itinerario Personalizado',
          summary: parsed.summary || 'Ruta de exploración optimizada en América.',
          days: parsed.days || [],
          tours: matchedTours.length > 0 ? matchedTours : tours.slice(0, 2),
        });
        clearInterval(stepsInterval);
        setLoading(false);
        setStep(0);
        return;
      }
    } catch (error) {
      console.error('AI Planner API failed, falling back to simulation', error);
    }

    // FALLBACK SIMULATION
    setTimeout(() => {
      clearInterval(stepsInterval);
      
      // Determine related tours
      const destLower = destinations.toLowerCase();
      let matchedTours;
      if (destLower.includes("peru") || destLower.includes("machu") || destLower.includes("cusco")) {
        matchedTours = tours.filter(t => t.location.toLowerCase().includes("perú") || t.id === 2);
      } else if (destLower.includes("patagonia") || destLower.includes("paine") || destLower.includes("calafate") || destLower.includes("chile") || destLower.includes("argentina")) {
        matchedTours = tours.filter(t => t.location.toLowerCase().includes("argentina") || t.location.toLowerCase().includes("chile") || t.id === 1 || t.id === 11);
      } else {
        matchedTours = tours.slice(0, 2);
      }

      if (matchedTours.length === 0) matchedTours = tours.slice(0, 2);

      const mockDays = [
        {
          dayNum: 1,
          title: `Día 1: Llegada y Exploración en ${destinations.split(",")[0]}`,
          desc: "Recepción por el guía local. Traslado al hotel y aclimatación. Por la tarde, caminata suave por senderos panorámicos y orientación del viaje."
        },
        {
          dayNum: 2,
          title: `Día 2: Experiencia de Aventura Principal (${style.toUpperCase()})`,
          desc: `Día de inmersión total. Realizaremos la excursión estrella de nuestra ruta, enfocada en ${style === "adventure" ? "adrenalina y trekking" : style === "relaxation" ? "descanso y termas" : "cultura e historia maya/inca"}. Almuerzo tipo picnic en mirador.`
        },
        {
          dayNum: 3,
          title: "Día 3: Despedida y Transfer al Aeropuerto",
          desc: "Mañana libre para compras de artesanías locales. Almuerzo de despedida y traslado privado al aeropuerto para el viaje de regreso."
        }
      ];

      setItinerary({
        title: `Ruta de Exploración: ${destinations}`,
        summary: `Itinerario optimizado de 3 días diseñado especialmente para una experiencia de ${style === "adventure" ? "Aventura Salvaje" : style === "relaxation" ? "Relax y Bienestar" : "Historia y Cultura Local"}.`,
        days: mockDays,
        tours: matchedTours
      });
      setLoading(false);
      setStep(0);
    }, 3200);
  };

  const calculateBundlePrice = () => {
    if (!itinerary) return 0;
    const baseSum = itinerary.tours.reduce((sum, t) => sum + t.price, 0) * guests;
    return Math.round(baseSum * 0.85); // 15% bundle discount
  };

  const handleBookAll = () => {
    if (!itinerary) return;
    const finalPrice = calculateBundlePrice();
    const bundleTour = {
      id: 999, // special ID for bundle
      title: itinerary.title,
      price: Math.round(finalPrice / guests),
      image: itinerary.tours[0]?.image || "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80",
      location: destinations,
      category: "Paquete AI Multidestino",
      oneDay: false,
      isBundle: true,
      toursCount: itinerary.tours.length
    };
    onBookBundle(guests, date || new Date().toISOString().split("T")[0], bundleTour);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1200, fontFamily: "var(--font-body)",
      padding: "20px"
    }}>
      <div className="glass-card modal" style={{
        width: "100%", maxWidth: "700px", maxHeight: "90vh",
        borderRadius: "var(--radius-md)",
        display: "flex", flexDirection: "column", position: "relative",
        overflow: "hidden", animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: "absolute", top: "20px", right: "20px",
          background: "transparent", border: "none", color: "var(--text-muted)",
          cursor: "pointer", zIndex: 10
        }}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: "28px 32px 16px 32px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(234,179,8,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <Bot size={22} />
          </div>
          <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                {t('plannerHeaderTitle', 'Copiloto IA de Itinerarios')} <Sparkles size={16} style={{ color: "var(--accent)", fill: "var(--accent)" }} />
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t('plannerHeaderSubtitle', 'Diseña tu viaje a medida por América Latina en segundos')}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flexGrow: 1, overflowY: "auto", padding: "28px 32px" }}>
          {!itinerary && !loading && (
            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Destinations input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={13} style={{ color: "var(--primary)" }} /> {t('plannerLabelDestinations', 'Destinos que deseas visitar')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('plannerPhDestinations', 'Ej. Cusco, Salar de Uyuni, Patagonia')}
                  value={destinations}
                  onChange={(e) => setDestinations(e.target.value)}
                  style={{ padding: "12px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", backgroundColor: "rgba(0,0,0,0.01)", color: "var(--text-heading)", outline: "none" }}
                />
              </div>

              {/* Date & Guests */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} style={{ color: "var(--primary)" }} /> {t('plannerLabelStartDate', 'Fecha de Inicio')}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ padding: "12px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", backgroundColor: "rgba(0,0,0,0.01)", colorScheme: "dark", color: "var(--text-heading)", outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Users size={13} style={{ color: "var(--primary)" }} /> {t('plannerLabelGuests', 'Pasajeros')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    style={{ padding: "12px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", backgroundColor: "rgba(0,0,0,0.01)", color: "var(--text-heading)", outline: "none" }}
                  />
                </div>
              </div>

              {/* Style selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Compass size={13} style={{ color: "var(--primary)" }} /> {t('plannerLabelStyle', 'Estilo de Experiencia')}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { id: "adventure", label: t("plannerStyleAdventure", "Aventura Salvaje"), icon: Mountain, desc: t("plannerStyleAdventureDesc", "Trekking, naturaleza y adrenalina") },
                    { id: "relaxation", label: t("plannerStyleRelaxation", "Relax & Confort"), icon: Parasol, desc: t("plannerStyleRelaxationDesc", "Termas, paisajes y descanso") },
                    { id: "cultural", label: t("plannerStyleCultural", "Historia & Cultura"), icon: Amphora, desc: t("plannerStyleCulturalDesc", "Ruinas, museos y pueblos mágicos") }
                  ].map((s) => {
                    const IconComp = s.icon;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        style={{
                          padding: "12px 14px",
                          border: style === s.id ? "2px solid var(--accent)" : "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          backgroundColor: style === s.id ? "rgba(234,179,8,0.05)" : "transparent",
                          transition: "all 0.2s",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <IconComp size={18} style={{ color: style === s.id ? "var(--accent)" : "var(--text-muted)" }} />
                        <strong style={{ fontSize: "0.85rem", color: "var(--text-heading)", display: "block" }}>{s.label}</strong>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", marginTop: "2px", lineHeight: "1.2" }}>{s.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-yellow animate-bounce-on-hover" style={{ width: "100%", padding: "14px", fontSize: "0.95rem", textTransform: "uppercase", fontWeight: 800, marginTop: "12px" }}>
                 <Sparkles size={16} /> {t('plannerGenerate', 'Generar Ruta Inteligente')}
              </button>
            </form>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyBetween: "center", gap: "16px", padding: "40px 0" }}>
              <RotateCw size={36} className="spin" style={{ color: "var(--accent)" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <strong style={{ fontSize: "0.95rem", color: "var(--text-heading)" }}>{getStepText()}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t('plannerOptimizingGemini', 'Optimizando con Inteligencia Artificial Gemini')}</span>
              </div>
            </div>
          )}

          {/* ITINERARY RESULT VIEW */}
          {itinerary && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Header result */}
              <div style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)", margin: 0 }}>✨ {itinerary.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-main)", margin: "8px 0 0 0", lineHeight: "1.5" }}>{itinerary.summary}</p>
              </div>

              {/* Day-by-day itinerary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid var(--border-color)", paddingBottom: "8px" }}>{t('plannerItineraryDayByDay', 'ITINERARIO DÍA A DÍA')}</h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {itinerary.days.map((day) => (
                    <div key={day.dayNum} style={{ display: "flex", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyBetween: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                          {day.dayNum}
                        </div>
                        <div style={{ width: "2px", flexGrow: 1, backgroundColor: "var(--border-color)", marginTop: "4px" }}></div>
                      </div>
                      <div style={{ paddingBottom: "12px" }}>
                        <strong style={{ fontSize: "0.9rem", color: "var(--text-heading)", display: "block" }}>{day.title}</strong>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0 0 0", lineHeight: "1.4" }}>{day.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched tours list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px dashed var(--border-color)", paddingTop: "20px" }}>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", margin: 0 }}>
                  🎟️ {t('plannerIncludedExcursions', 'Excursiones Incluidas en el Paquete')}
                </h5>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {itinerary.tours.map((t) => (
                    <div key={t.id} style={{ display: "flex", gap: "12px", padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.01)" }}>
                      <img src={t.image} alt={t.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                      <div style={{ display: "flex", flexDirection: "column", justifyBetween: "space-between", justifyContent: "space-between", minWidth: 0 }}>
                        <strong style={{ fontSize: "0.78rem", color: "var(--text-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{t.title}</strong>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{t.location}</span>
                        <strong style={{ fontSize: "0.78rem", color: "var(--primary)" }}>{formatPrice(t.price, activeCurrency)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom total callout & booking button */}
              <div style={{ borderTop: "2px solid var(--border-color)", paddingTop: "20px", display: "flex", justifyBetween: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>{t('plannerBundlePackage', 'PAQUETE MULTIDESTINO')} (x{guests} {t('plannerPassengers', 'Pasajeros')})</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
                    <strong style={{ fontSize: "1.4rem", color: "var(--primary)", fontFamily: "var(--font-title)" }}>
                      {formatPrice(calculateBundlePrice(), activeCurrency)}
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, border: "1px solid #10b981", padding: "1px 5px", borderRadius: "4px", backgroundColor: "rgba(16,185,129,0.05)" }}>
                      15% BUNDLE OFF
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn btn-outline" onClick={() => setItinerary(null)} style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
                    {t('plannerRegenerate', 'Re-generar')}
                  </button>
                  <button className="btn btn-yellow animate-bounce-on-hover" onClick={handleBookAll} style={{ padding: "10px 24px", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                    {t('plannerBookAll', 'Reservar Todo')} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
