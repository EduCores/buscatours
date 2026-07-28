import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, DollarSign, Compass, ChevronDown, Sparkles, RotateCw } from "lucide-react";
import { activitiesData } from "../data/tours";
import * as Icons from "lucide-react";
import { formatPrice } from "../data/translations";
import { dataService } from "../services/dataService";
import { useTranslation } from "../i18n/LanguageContext";

export default function SearchBar({ tours = [], onTourClick, filters, onFilterChange, categories, activeActivity, onSelectActivity,   activeLanguage, activeCurrency }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState("all");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(4000);

  // Search mode state: "ai" | "traditional" | "vibe"
  const [searchMode, setSearchMode] = useState("ai");

  // Vibe sensory sliders
  const [vibeAdrenaline, setVibeAdrenaline] = useState(50);
  const [vibeRelax, setVibeRelax] = useState(50);
  const [vibeCulture, setVibeCulture] = useState(50);
  const [vibeFamily, setVibeFamily] = useState(50);

  const handleVibeChange = (vibeName, value) => {
    const val = Number(value);
    let newAdrenaline = vibeAdrenaline;
    let newRelax = vibeRelax;
    let newCulture = vibeCulture;
    let newFamily = vibeFamily;

    if (vibeName === "adrenaline") {
      setVibeAdrenaline(val);
      newAdrenaline = val;
    } else if (vibeName === "relax") {
      setVibeRelax(val);
      newRelax = val;
    } else if (vibeName === "culture") {
      setVibeCulture(val);
      newCulture = val;
    } else if (vibeName === "family") {
      setVibeFamily(val);
      newFamily = val;
    }

    onFilterChange({
      query: "",
      duration: "all",
      category: "all",
      maxPrice: price,
      searchMode: "vibe",
      vibeScores: {
        adrenaline: newAdrenaline,
        relax: newRelax,
        culture: newCulture,
        family: newFamily
      }
    });
  };

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    if (mode !== "ai") {
      setConversationalMatches([]);
    }

    onFilterChange({
      query: mode === "traditional" ? query : "",
      duration: mode === "traditional" ? duration : "all",
      category: mode === "traditional" ? category : "all",
      maxPrice: price,
      searchMode: mode,
      vibeScores: {
        adrenaline: vibeAdrenaline,
        relax: vibeRelax,
        culture: vibeCulture,
        family: vibeFamily
      }
    });
  };
  const [conversationalPrompt, setConversationalPrompt] = useState("");
  const [conversationalStep, setConversationalStep] = useState(0);
  const [conversationalLoading, setConversationalLoading] = useState(false);
  const [conversationalMatches, setConversationalMatches] = useState([]);

  // Synchronize local search inputs when filters prop is updated by clicking on Destinations or other actions
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (filters) {
      if (filters.query !== undefined) setQuery(filters.query);
      if (filters.duration !== undefined) setDuration(filters.duration);
      if (filters.category !== undefined) setCategory(filters.category);
      if (filters.maxPrice !== undefined) setPrice(filters.maxPrice);
      if (filters.searchMode !== undefined) setSearchMode(filters.searchMode);
      if (filters.vibeScores !== undefined) {
        if (filters.vibeScores.adrenaline !== undefined) setVibeAdrenaline(filters.vibeScores.adrenaline);
        if (filters.vibeScores.relax !== undefined) setVibeRelax(filters.vibeScores.relax);
        if (filters.vibeScores.culture !== undefined) setVibeCulture(filters.vibeScores.culture);
        if (filters.vibeScores.family !== undefined) setVibeFamily(filters.vibeScores.family);
      }
    }
  }, [filters]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleConversationalSearch = async (e) => {
    e.preventDefault();
    if (!conversationalPrompt.trim()) return;

    setConversationalLoading(true);
    setConversationalStep(1);
    setConversationalMatches([]);

    const steps = [
      { step: 1, msg: t('aiStep1Msg', '🔍 Entendiendo tus preferencias y presupuesto...') },
      { step: 2, msg: t('aiStep2Msg', '🌎 Escaneando tours activos de operadores certificados en LATAM...') },
      { step: 3, msg: t('aiStep3Msg', 'Cruzando datos con el pronóstico del clima local...') },
        { step: 4, msg: t('aiStep4Msg', '🎯 Ordenando por ranking de guías y precio...') }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      currentStepIndex += 1;
      if (currentStepIndex < steps.length) {
        setConversationalStep(steps[currentStepIndex].step);
      }
    }, 850);

    try {
      setConversationalLoading(true);
      setConversationalStep(1);
      setConversationalMatches([]);

      const steps = [
        { step: 1, msg: t('aiStep1Msg', '🔍 Entendiendo tus preferencias y presupuesto...') },
        { step: 2, msg: t('aiStep2Msg', '🌎 Escaneando tours activos de operadores certificados en LATAM...') },
        { step: 3, msg: t('aiStep3Msg', 'Cruzando datos con el pronóstico del clima local...') },
      { step: 4, msg: t('aiStep4Msg', '🎯 Ordenando por ranking de guías y precio...') }
      ];

      let currentStepIndex = 0;
      const interval = setInterval(() => {
        currentStepIndex += 1;
        if (currentStepIndex < steps.length) {
          setConversationalStep(steps[currentStepIndex].step);
        }
      }, 850);

      setTimeout(() => {
        clearInterval(interval);
        const safeTours = Array.isArray(tours) ? tours.filter(Boolean) : [];
        let matches = [];
        const promptLower = conversationalPrompt.toLowerCase();

        if (promptLower.includes("glaciar") || promptLower.includes("hielo") || promptLower.includes("calafate") || promptLower.includes("frío") || promptLower.includes("nieve")) {
          matches = safeTours.filter(t => 
            (t.title || "").toLowerCase().includes("glaciar") || 
            (t.location || "").toLowerCase().includes("argentina") || 
            (t.description || "").toLowerCase().includes("hielo")
          );
        } else if (promptLower.includes("selva") || promptLower.includes("amazonas") || promptLower.includes("río") || promptLower.includes("trekking") || promptLower.includes("aventura")) {
          matches = safeTours.filter(t => 
            (t.category || "").toLowerCase().includes("aventura") || 
            (t.category || "").toLowerCase().includes("salvaje") || 
            (t.title || "").toLowerCase().includes("trekking") ||
            (t.location || "").toLowerCase().includes("perú") ||
            (t.location || "").toLowerCase().includes("colombia") ||
            (t.location || "").toLowerCase().includes("bolivia")
          );
        } else if (promptLower.includes("playa") || promptLower.includes("mar") || promptLower.includes("caribe") || promptLower.includes("calor") || promptLower.includes("relaj")) {
          matches = safeTours.filter(t => 
            (t.category || "").toLowerCase().includes("relaxación") || 
            (t.location || "").toLowerCase().includes("dominicana") || 
            (t.location || "").toLowerCase().includes("cartagena")
          );
        } else if (promptLower.includes("cultura") || promptLower.includes("ruinas") || promptLower.includes("historia") || promptLower.includes("maya") || promptLower.includes("inca")) {
          matches = safeTours.filter(t => 
            (t.category || "").toLowerCase().includes("cultural") || 
            (t.category || "").toLowerCase().includes("histórico") || 
            (t.title || "").toLowerCase().includes("inca") ||
            (t.title || "").toLowerCase().includes("chichén")
          );
        }

        if (matches.length === 0) {
          matches = [...safeTours].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setTimeout(() => {
          clearInterval(interval);
          setConversationalMatches(matches.slice(0, 3));
          setConversationalLoading(false);
          setConversationalStep(0);
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("AI Search failed, falling back to local search", error);
      const safeTours = Array.isArray(tours) ? tours.filter(Boolean) : [];
      let matches = [];
      const promptLower = conversationalPrompt.toLowerCase();

      if (promptLower.includes("glaciar") || promptLower.includes("hielo") || promptLower.includes("calafate") || promptLower.includes("frío") || promptLower.includes("nieve")) {
        matches = safeTours.filter(t => 
          (t.title || "").toLowerCase().includes("glaciar") || 
          (t.location || "").toLowerCase().includes("argentina") || 
          (t.description || "").toLowerCase().includes("hielo")
        );
      } else if (promptLower.includes("selva") || promptLower.includes("amazonas") || promptLower.includes("río") || promptLower.includes("trekking") || promptLower.includes("aventura")) {
        matches = safeTours.filter(t => 
          (t.category || "").toLowerCase().includes("aventura") || 
          (t.category || "").toLowerCase().includes("salvaje") || 
          (t.title || "").toLowerCase().includes("trekking") ||
          (t.location || "").toLowerCase().includes("perú") ||
          (t.location || "").toLowerCase().includes("colombia") ||
          (t.location || "").toLowerCase().includes("bolivia")
        );
      } else if (promptLower.includes("playa") || promptLower.includes("mar") || promptLower.includes("caribe") || promptLower.includes("calor") || promptLower.includes("relaj")) {
        matches = safeTours.filter(t => 
          (t.category || "").toLowerCase().includes("relaxación") || 
          (t.location || "").toLowerCase().includes("dominicana") || 
          (t.location || "").toLowerCase().includes("cartagena")
        );
      } else if (promptLower.includes("cultura") || promptLower.includes("ruinas") || promptLower.includes("historia") || promptLower.includes("maya") || promptLower.includes("inca")) {
        matches = safeTours.filter(t => 
          (t.category || "").toLowerCase().includes("cultural") || 
          (t.category || "").toLowerCase().includes("histórico") || 
          (t.title || "").toLowerCase().includes("inca") ||
          (t.title || "").toLowerCase().includes("chichén")
        );
      }

      if (matches.length === 0) {
        matches = [...safeTours].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setTimeout(() => {
        clearInterval(interval);
        setConversationalMatches(matches.slice(0, 3));
        setConversationalLoading(false);
        setConversationalStep(0);
      }, 2000);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({ 
      query, 
      duration, 
      category, 
      maxPrice: price,
      searchMode: "traditional",
      vibeScores: { adrenaline: vibeAdrenaline, relax: vibeRelax, culture: vibeCulture, family: vibeFamily }
    });
  };

  // Dynamically resolve lucide icons
  const renderIcon = (iconName, size = 24, color = "currentColor") => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent size={size} style={{ color }} />;
    }
    return <Icons.HelpCircle size={size} style={{ color }} />;
  };

  const handleChange = (type, value) => {
    let newQuery = query;
    let newDuration = duration;
    let newCategory = category;
    let newPrice = price;

    if (type === "query") {
      setQuery(value);
      newQuery = value;
    } else if (type === "duration") {
      setDuration(value);
      newDuration = value;
    } else if (type === "category") {
      setCategory(value);
      newCategory = value;
    } else if (type === "price") {
      setPrice(value);
      newPrice = Number(value);
    }

    onFilterChange({
      query: newQuery,
      duration: newDuration,
      category: newCategory,
      maxPrice: newPrice,
      searchMode: "traditional",
      vibeScores: {
        adrenaline: vibeAdrenaline,
        relax: vibeRelax,
        culture: vibeCulture,
        family: vibeFamily
      }
    });
  };

  const getStepContent = () => {
    switch (conversationalStep) {
      case 1:
        return {
          icon: <Icons.Search size={16} style={{ color: "var(--primary)" }} />,
          text: t('aiStep1', 'Entendiendo tus preferencias y presupuesto...')
        };
      case 2:
        return {
          icon: <Icons.Globe size={16} style={{ color: "var(--accent)" }} />,
          text: t('aiStep2', 'Escaneando tours activos de operadores certificados en LATAM...')
        };
      case 3:
        return {
          icon: <Icons.CloudSun size={16} style={{ color: "#f59e0b" }} />,
          text: t('aiStep3', 'Cruzando datos con el pronóstico del clima local...')
        };
      case 4:
        return {
          icon: <Icons.Target size={16} style={{ color: "#ef4444" }} />,
          text: t('aiStep4', 'Ordenando por ranking de guías y precio...')
        };
      default:
        return null;
    }
  };

  const activeStep = getStepContent();

  return (
    <div
      id="buscar-tours"
      className="container"
      style={{
        position: "relative",
        zIndex: 30,
      }}
    >
      {/* Toggle Selector */}
      <div 
        className="search-toggle-buttons"
        style={{ 
          display: "flex", 
          flexWrap: "wrap",
          gap: "8px", 
          marginBottom: "12px", 
          justifyContent: "center" 
        }}
      >
        <button
          type="button"
          onClick={() => handleSearchModeChange("ai")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
            border: "none",
            backgroundColor: searchMode === "ai" ? "var(--topbar-bg-glass)" : "transparent",
            backdropFilter: searchMode === "ai" ? "blur(12px)" : "none",
            borderBottom: searchMode === "ai" ? "2px solid var(--accent)" : "none",
            color: searchMode === "ai" ? "var(--accent)" : "var(--text-muted)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icons.Bot size={14} style={{ color: "var(--accent)" }} /> {t('copilotoDeViajes', 'Copiloto de Viajes')}
        </button>
        <button
          type="button"
          onClick={() => handleSearchModeChange("vibe")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
            border: "none",
            backgroundColor: searchMode === "vibe" ? "var(--topbar-bg-glass)" : "transparent",
            backdropFilter: searchMode === "vibe" ? "blur(12px)" : "none",
            borderBottom: searchMode === "vibe" ? "2px solid #a855f7" : "none",
            color: searchMode === "vibe" ? "#c084fc" : "var(--text-muted)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icons.Compass size={14} style={{ color: searchMode === "vibe" ? "#c084fc" : "var(--text-muted)" }} /> {t('buscarPorVibra', 'Buscar por Vibra')}
        </button>
        <button
          type="button"
          onClick={() => handleSearchModeChange("traditional")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
            border: "none",
            backgroundColor: searchMode === "traditional" ? "var(--topbar-bg-glass)" : "transparent",
            backdropFilter: searchMode === "traditional" ? "blur(12px)" : "none",
            borderBottom: searchMode === "traditional" ? "2px solid var(--primary)" : "none",
            color: searchMode === "traditional" ? "var(--primary)" : "var(--text-muted)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icons.Search size={14} style={{ color: searchMode === "traditional" ? "var(--primary)" : "var(--text-muted)" }} /> {t('busquedaTradicional', 'Búsqueda Tradicional')}
        </button>
        <button
          type="button"
          onClick={() => handleSearchModeChange("map")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
            border: "none",
            backgroundColor: searchMode === "map" ? "var(--topbar-bg-glass)" : "transparent",
            backdropFilter: searchMode === "map" ? "blur(12px)" : "none",
            borderBottom: searchMode === "map" ? "2px solid var(--accent)" : "none",
            color: searchMode === "map" ? "var(--accent)" : "var(--text-muted)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Icons.Map size={14} style={{ color: searchMode === "map" ? "var(--accent)" : "var(--text-muted)" }} /> {t('explorarEnMapa', 'Explorar en Mapa')}
        </button>
      </div>

      {(searchMode === "traditional" || searchMode === "map") && (
        <form
          onSubmit={handleSearch}
          className="glass-card search-bar-form"
          style={{
            borderRadius: "var(--radius-md)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            alignItems: "center",
            gap: "24px",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Destination Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <MapPin size={12} style={{ color: "var(--primary)" }} />
              {t('aDondeVas', '¿A dónde vas?')}
            </label>
            <div style={{ position: "relative" }}>
<input
                 type="text"
                 placeholder={t('buscarDestinoOTour', 'Buscar destino o tour...')}
                 value={query}
                 onChange={(e) => handleChange("query", e.target.value)}
                 data-testid="search-input"
                 style={{
                   width: "100%",
                   padding: "12px 12px 12px 36px",
                   border: "1px solid var(--border-color)",
                   borderRadius: "var(--radius-sm)",
                   fontSize: "0.9rem",
                   backgroundColor: "rgba(0,0,0,0.02)",
                   color: "var(--text-heading)",
                   fontFamily: "var(--font-body)",
                   outline: "none",
                 }}
               />
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
            </div>
          </div>

          {/* Duration Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Clock size={12} style={{ color: "var(--primary)" }} />
              {t('duracion', 'Duración')}
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <select
                value={duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 38px 12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  backgroundColor: "rgba(0,0,0,0.02)",
                  color: "var(--text-heading)",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
              >
                <option value="all" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-heading)" }}>{t('cualquierDuracion', 'Cualquier duración')}</option>
                <option value="1" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-heading)" }}>{t('duracion1Dia', '1 día / Horas')}</option>
                <option value="short" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-heading)" }}>{t('duracion2a6', '2 - 6 días')}</option>
                <option value="long" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-heading)" }}>{t('duracion7Plus', '7+ días')}</option>
              </select>
              <ChevronDown
                size={18}
                strokeWidth={2.5}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-heading)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Activity Category Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Compass size={12} style={{ color: "var(--primary)" }} />
              {t('actividad', 'Actividad')}
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <select
                value={category}
                onChange={(e) => handleChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 38px 12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  backgroundColor: "rgba(0,0,0,0.02)",
                  color: "var(--text-heading)",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
              >
                {(() => {
                  const lang = activeLanguage || "ES";
                  const categoryOptions = {
                    all: { ES: "Todas las actividades", EN: "All experiences", PT: "Todas as atividades" },
                    "Outdoor": { ES: "Outdoor", EN: "Outdoor", PT: "Outdoor" },
                    "Aventura": { ES: "Aventura", EN: "Adventure", PT: "Aventura" },
                    "Cultural": { ES: "Cultural", EN: "Cultural", PT: "Cultural" },
                    "Familiar": { ES: "Familiar", EN: "Family", PT: "Familiar" },
                    "Relaxación": { ES: "Relajación", EN: "Relaxation", PT: "Relaxamento" },
                    "Lujo": { ES: "Lujo", EN: "Luxury", PT: "Luxo" },
                    "Selva": { ES: "Selva", EN: "Jungle", PT: "Selva" },
                    "Glaciar": { ES: "Glaciar", EN: "Glacier", PT: "Glaciar" },
                    "Ciudad": { ES: "Ciudad", EN: "City", PT: "Cidade" },
                    "Montaña": { ES: "Montaña", EN: "Mountain", PT: "Montanha" },
                    "Full Day": { ES: "Full Day", EN: "Full Day", PT: "Full Day" }
                  };
                  return Object.entries(categoryOptions).map(([key, labels]) => (
                    <option key={key} value={key} style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-heading)" }}>
                      {labels[lang] || labels.ES}
                    </option>
                  ));
                })()}
              </select>
              <ChevronDown
                size={18}
                strokeWidth={2.5}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-heading)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Price Slider Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <DollarSign size={12} style={{ color: "var(--primary)" }} />
                {t('presupuestoMax', 'Presupuesto máx.')}
              </label>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
                ${price.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={price}
              onChange={(e) => handleChange("price", e.target.value)}
              style={{
                width: "100%",
                accentColor: "var(--primary)",
                cursor: "pointer",
              }}
            />
          </div>

          {/* --- NEW ROW FOR ACTIVITIES --- */}
          {activeActivity !== undefined && (
            <div
              className="activities-container"
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                padding: "8px 0 8px 0",
                scrollBehavior: "smooth",
                marginTop: "8px",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "24px",
              }}
            >
              {/* "All" button */}
              <button
                type="button"
                onClick={() => onSelectActivity("all")}
                className={`activity-pill ${activeActivity === "all" ? "active" : ""}`}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: activeActivity === "all" ? "var(--primary)" : "var(--border-color)",
                  backgroundColor: activeActivity === "all" ? "#0081de2e" : "transparent",
                  color: activeActivity === "all" ? "#ffffff" : "var(--text-heading)",
                  fontFamily: "var(--font-title)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Icons.Layers size={16} style={{ color: "var(--primary)" }} />
                {t('todos', 'Todos')}
              </button>

              {activitiesData.map((act, idx) => {
                const isSelected = activeActivity === act.name;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => onSelectActivity(act.name)}
                    className={`activity-pill ${isSelected ? "active" : ""}`}
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--primary)" : "var(--border-color)",
                      backgroundColor: isSelected ? "#0081de2e" : "transparent",
                      color: isSelected ? "#ffffff" : "var(--text-heading)",
                      fontFamily: "var(--font-title)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {renderIcon(act.icon, 16, "var(--primary)")}
                    {act.name}
                  </button>
                );
              })}
            </div>
          )}
        </form>
      )}

      {searchMode === "ai" && (
        <div 
          className="glass-card conversational-search-container" 
          style={{ 
            padding: "32px", 
            borderRadius: "var(--radius-md)", 
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            border: "1px solid rgba(234,179,8,0.2)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t('queTipoViaje', '¿Qué tipo de viaje o aventura tienes en mente?')}
            </label>
            <form 
              onSubmit={handleConversationalSearch} 
              className="conversational-search-form"
              style={{ display: "flex", gap: "12px", width: "100%" }}
            >
              <input
                type="text"
                value={conversationalPrompt}
                onChange={(e) => setConversationalPrompt(e.target.value)}
                placeholder={t('ejemploTrekking', 'Ej. Quiero hacer trekking con glaciares exigente pero con vistas hermosas en Argentina...')}
                style={{
                  flexGrow: 1,
                  padding: "14px 18px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                  backgroundColor: "rgba(0,0,0,0.02)",
                  color: "var(--text-heading)",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  width: "100%"
                }}
              />
              <button 
                type="submit" 
                className="btn btn-yellow"
                style={{ 
                  padding: "0 28px", 
                  fontSize: "0.95rem", 
                  textTransform: "uppercase", 
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
                disabled={conversationalLoading}
              >
                 <Sparkles size={16} /> {t('preguntar', 'Preguntar')} <Icons.Bot size={16} />
              </button>
            </form>
          </div>

          {/* Loading steps animation */}
          {conversationalLoading && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "12px", 
              padding: "20px 0",
              borderTop: "1px solid var(--border-color)"
            }}>
              <RotateCw size={28} className="spin" style={{ color: "var(--accent)" }} />
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-heading)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                {activeStep && (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {activeStep.icon}
                    <span>{activeStep.text}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results Matching Cards */}
          {conversationalMatches.length > 0 && !conversationalLoading && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "16px",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "20px"
            }}>
              <h5 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", margin: 0 }}>
                 ✨ {t('copilotoIaRecomendados', 'Copiloto IA: Tours Recomendados que Coinciden')}
              </h5>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                gap: "20px" 
              }}>
                {conversationalMatches.map((t) => {
                  if (!t) return null;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (onTourClick) onTourClick(t.id);
                      }}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "12px",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "hsl(220deg 100% 84.67% / 7%)",
                        cursor: "pointer",
                        transition: "transform 0.2s, border-color 0.2s"
                      }}
                      className="ranking-item"
                    >
                      <img 
                        src={t.image || ""} 
                        alt={t.title || ""} 
                        style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "6px" }} 
                      />
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1, minWidth: 0 }}>
                        <h6 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t.title || ""}
                        </h6>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{(t.location || "")} • {t.duration || ""}</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                          <strong style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
                            {formatPrice(t.price || 0, activeCurrency)}
                          </strong>
                          <span style={{ fontSize: "0.72rem", color: "#fbbf24", fontWeight: 700 }}>
                            ★ {t.rating ? Number(t.rating).toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {searchMode === "vibe" && (
        <div 
          className="glass-card vibe-search-container" 
          style={{ 
            padding: "32px", 
            borderRadius: "var(--radius-md)", 
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            border: "1px solid rgba(168,85,247,0.2)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#c084fc", margin: 0, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.Compass size={20} /> {t('buscadorVibras', 'Buscador de Vibras & Estados de Ánimo')}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                {t('vibeIntro', 'Sintoniza tu viaje ideal ajustando tus preferencias emocionales. Los resultados se actualizan y ordenan automáticamente abajo en tiempo real (desliza hacia abajo para verlos).')}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            marginTop: "10px"
          }}>
            {/* Slider 1: Adrenaline */}
            <div className="vibe-slider-card" style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-color)",
              transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.Mountain size={14} style={{ color: "#f43f5e" }} /> {t('vibeAdrenalina', 'Adrenalina')}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f43f5e" }}>
                  {vibeAdrenaline}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vibeAdrenaline}
                onChange={(e) => handleVibeChange("adrenaline", e.target.value)}
                style={{
                  width: "100%",
                  accentColor: "#f43f5e",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {t('vibeAdrenalinaDesc', 'Deportes extremos, trekking de montaña y pura aventura.')}
              </span>
            </div>

            {/* Slider 2: Relaxation */}
            <div className="vibe-slider-card" style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-color)",
              transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.Parasol size={14} style={{ color: "#10b981" }} /> {t('vibeDesconexion', 'Desconexión')}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#10b981" }}>
                  {vibeRelax}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vibeRelax}
                onChange={(e) => handleVibeChange("relax", e.target.value)}
                style={{
                  width: "100%",
                  accentColor: "#10b981",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {t('vibeDesconexionDesc', 'Paz, meditación, masajes y entornos silenciosos y naturales.')}
              </span>
            </div>

            {/* Slider 3: Culture */}
            <div className="vibe-slider-card" style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-color)",
              transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.Amphora size={14} style={{ color: "#3b82f6" }} /> {t('vibeCultura', 'Cultura & Historia')}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#3b82f6" }}>
                  {vibeCulture}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vibeCulture}
                onChange={(e) => handleVibeChange("culture", e.target.value)}
                style={{
                  width: "100%",
                  accentColor: "#3b82f6",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {t('vibeCulturaDesc', 'Ruinas arqueológicas, gastronomía y recorridos históricos guiados.')}
              </span>
            </div>

            {/* Slider 4: Family */}
            <div className="vibe-slider-card" style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-color)",
              transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.Heart size={14} style={{ color: "#eab308" }} /> {t('vibeFamiliar', 'Diversión Familiar')}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#eab308" }}>
                  {vibeFamily}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vibeFamily}
                onChange={(e) => handleVibeChange("family", e.target.value)}
                style={{
                  width: "100%",
                  accentColor: "#eab308",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {t('vibeFamiliarDesc', 'Excursiones de navegación, actividades dinámicas aptas para niños.')}
              </span>
            </div>
          </div>

          {/* Current selected feedback */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            backgroundColor: "rgba(168,85,247,0.08)",
            borderRadius: "6px",
            border: "1px solid rgba(168,85,247,0.2)",
            fontSize: "0.85rem",
            marginTop: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>✨</span>
              <span>
                {t('searchCurrentVibe', 'Vibra predominante actual:')} <strong>
                  {(() => {
                    const maxVal = Math.max(vibeAdrenaline, vibeRelax, vibeCulture, vibeFamily);
                    if (maxVal === 0) return t('vibeNinguna', 'Ninguna vibra seleccionada (Mostrando todos)');
                    if (maxVal === vibeAdrenaline) return <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{t('vibePredAdrenalina', 'Aventura & Adrenalina Exigente')} <Icons.Mountain size={14} /></span>;
                    if (maxVal === vibeRelax) return <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{t('vibePredRelax', 'Paz, Relajación & Bienestar')} <Icons.Parasol size={14} /></span>;
                    if (maxVal === vibeCulture) return <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{t('vibePredCultura', 'Cultura, Historia & Gastronomía')} <Icons.Amphora size={14} /></span>;
                    if (maxVal === vibeFamily) return <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{t('vibePredFamiliar', 'Aventura & Diversión Familiar')} <Icons.Heart size={14} /></span>;
                    return t('vibeTodas', 'Todas las actividades');
                  })()}
                </strong>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: "4px 10px",
                fontSize: "0.72rem",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#c084fc",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => {
                setVibeAdrenaline(50);
                setVibeRelax(50);
                setVibeCulture(50);
                setVibeFamily(50);
                onFilterChange({
                  query: "",
                  duration: "all",
                  category: "all",
                  maxPrice: price
                });
              }}
            >
              {t('restablecerVibras', 'Restablecer Vibras')}
            </button>
          </div>
        </div>
      )}
      <style>{`
        .search-bar-form {
          padding: 24px 32px;
        }
        .conversational-search-container, .vibe-search-container {
          padding: 32px;
        }
        .conversational-search-form {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .conversational-search-container {
            padding: 24px !important;
            gap: 16px !important;
          }
          .conversational-search-form {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .conversational-search-form input {
            width: 100% !important;
          }
          .conversational-search-form button {
            width: 100% !important;
            padding: 14px !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 576px) {
          .search-bar-form {
            padding: 16px 20px !important;
            gap: 16px !important;
          }
          .search-toggle-buttons {
            gap: 4px !important;
            flex-wrap: wrap !important;
          }
          .search-toggle-buttons button {
            padding: 8px 12px !important;
            font-size: 0.75rem !important;
          }
          .conversational-search-container {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

